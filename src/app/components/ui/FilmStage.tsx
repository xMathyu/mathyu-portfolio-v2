"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/app/lib/gsap";
import { SCENES } from "@/app/lib/videos";

type LayerKey = keyof typeof SCENES;
const KEYS = Object.keys(SCENES) as LayerKey[];

/**
 * The whole page plays as one film: a fixed full-screen stage behind every
 * section, with one shot per `[data-scene]` element.
 *
 * - Crossing into a new scene is scrubbed by scroll like an editor timeline:
 *   the current shot pushes in and fades while the next one settles in.
 * - Each shot drifts (slow push-in + pan) for as long as its scene is on screen.
 * - A light leak in the brand gradient sweeps across every cut.
 * - Only shots that are actually visible download and play.
 */
export default function FilmStage() {
  const stage = useRef<HTMLDivElement>(null);
  const leak = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = stage.current;
    if (!root) return;
    const layers = new Map<string, HTMLElement>(
      gsap.utils.toArray<HTMLElement>("[data-layer]", root).map((el) => [el.dataset.layer!, el]),
    );
    const motion = window.matchMedia(MOTION_OK).matches;

    // Scenes in page order; consecutive elements with the same key form one long shot
    const scenes: { key: string; start: HTMLElement; end: HTMLElement }[] = [];
    gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((el) => {
      const key = el.dataset.scene!;
      const last = scenes[scenes.length - 1];
      if (last && last.key === key) last.end = el;
      else scenes.push({ key, start: el, end: el });
    });
    if (!scenes.length) return;

    const load = (key: string) => {
      const video = layers.get(key)?.querySelector("video");
      if (video && !video.getAttribute("src")) video.src = video.dataset.src!;
    };

    // Play what's on screen, pause the rest (batched to one check per frame)
    let queued = 0;
    const sync = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        layers.forEach((layer, key) => {
          const video = layer.querySelector("video");
          if (!video) return;
          if (Number(gsap.getProperty(layer, "opacity")) > 0.02) {
            load(key);
            if (motion && video.paused) video.play().catch(() => {});
          } else if (!video.paused) {
            video.pause();
          }
        });
      });
    };

    // A cut can fire many times while scrubbing; flash at most every 700 ms
    let lastFlash = 0;
    const flash = () => {
      const now = performance.now();
      if (!motion || now - lastFlash < 700) return;
      lastFlash = now;
      gsap.fromTo(
        leak.current,
        { xPercent: -110, opacity: 0 },
        {
          xPercent: 110,
          keyframes: { opacity: [0, 0.55, 0] },
          duration: 1.1,
          ease: "power2.inOut",
          overwrite: true,
        },
      );
    };

    gsap.set([...layers.values()], { autoAlpha: 0 });
    const first = layers.get(scenes[0].key);
    if (first) gsap.set(first, { autoAlpha: 1 });

    scenes.forEach((scene, i) => {
      const layer = layers.get(scene.key);

      // Fetch a screen and a half before the shot is needed
      ScrollTrigger.create({
        trigger: scene.start,
        start: "top bottom+=150%",
        once: true,
        onEnter: () => load(scene.key),
      });

      // Camera drift for the whole length of the shot
      if (layer && motion) {
        gsap.fromTo(
          layer.firstElementChild,
          { scale: 1.06, xPercent: -1.5, yPercent: -2 },
          {
            scale: 1.2,
            xPercent: 1.5,
            yPercent: 2,
            ease: "none",
            scrollTrigger: {
              trigger: scene.start,
              endTrigger: scene.end,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (i === 0) return;
      const prev = layers.get(scenes[i - 1].key);
      const cut = gsap.timeline({
        defaults: { ease: "none", immediateRender: false },
        scrollTrigger: {
          trigger: scene.start,
          start: "top 75%",
          end: "top 40%",
          scrub: 0.6,
          onUpdate: sync,
          onToggle: sync,
        },
      });
      if (prev) {
        // Push-in + fade only: blurring two full-screen videos stalls the GPU on most laptops
        cut.fromTo(prev, { autoAlpha: 1, scale: 1 }, motion ? { autoAlpha: 0, scale: 1.14 } : { autoAlpha: 0 }, 0);
      }
      if (layer) {
        cut.fromTo(layer, motion ? { autoAlpha: 0, scale: 1.16 } : { autoAlpha: 0 }, { autoAlpha: 1, scale: 1 }, 0);
      }
      cut.call(flash, undefined, 0.45);
    });

    load(scenes[0].key);
    sync();
    // Pinned sections added after first paint shift scene positions
    ScrollTrigger.addEventListener("refresh", sync);
    return () => {
      cancelAnimationFrame(queued);
      ScrollTrigger.removeEventListener("refresh", sync);
    };
  });

  return (
    <>
      <div
        ref={stage}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"
      >
        {KEYS.map((key) => (
          <div key={key} data-layer={key} className="invisible absolute inset-0 opacity-0">
            <div className="absolute inset-0 will-change-transform">
              <video
                data-src={SCENES[key].clip.src}
                poster={SCENES[key].clip.poster}
                muted
                loop
                playsInline
                preload="none"
                className="h-full w-full object-cover"
                style={{ opacity: SCENES[key].level }}
              />
            </div>
          </div>
        ))}
        {/* Keeps copy readable: overall dim + vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.75)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      </div>

      {/* Light leak that sweeps across every cut */}
      <div
        ref={leak}
        aria-hidden="true"
        className="bg-ai pointer-events-none fixed inset-y-[-20%] left-0 z-[55] w-[70vw] -skew-x-12 opacity-0 mix-blend-screen blur-[80px]"
      />
    </>
  );
}
