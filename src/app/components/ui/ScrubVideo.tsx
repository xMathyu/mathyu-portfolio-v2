"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/app/lib/gsap";
import type { VideoClip } from "@/app/lib/videos";

interface ScrubVideoProps {
  clip: VideoClip;
  lines: string[];
  caption?: string;
  /** "frame": rounded card grows to full bleed. "portal": a circle opens onto the footage. */
  reveal?: "frame" | "portal";
}

const REVEAL = {
  frame: {
    from: "inset(14% 8% 14% 8% round 32px)",
    to: "inset(0% 0% 0% 0% round 0px)",
    initial: "[clip-path:inset(14%_8%_14%_8%_round_32px)]",
  },
  portal: {
    from: "circle(9% at 50% 50%)",
    to: "circle(75% at 50% 50%)",
    initial: "[clip-path:circle(9%_at_50%_50%)]",
  },
} as const;

/**
 * Apple-style scroll-scrubbed footage: a rounded frame grows to full bleed,
 * then the video's playhead follows the scroll while headlines swap over it.
 * The clip must be encoded with frequent keyframes for smooth seeking.
 */
export default function ScrubVideo({ clip, lines, caption, reveal = "frame" }: ScrubVideoProps) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const el = video.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-scrub-frame]",
          { clipPath: REVEAL[reveal].from },
          {
            clipPath: REVEAL[reveal].to,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "top top", scrub: true },
          },
        );

        // Start buffering a screen or two before the reel arrives
        const warmUp = () => {
          el.preload = "auto";
          el.play().then(() => el.pause()).catch(() => {});
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });
        // Fixed length of 1 so headline timings don't shift once the video's duration is known
        tl.to({}, { duration: 1 }, 0);

        const items = gsap.utils.toArray<HTMLElement>("[data-scrub-line]");
        const slot = 1 / items.length;
        items.forEach((line, i) => {
          tl.fromTo(line, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.1 }, i * slot + 0.03);
          if (i < items.length - 1) {
            tl.to(line, { autoAlpha: 0, y: -60, duration: 0.1 }, (i + 1) * slot - 0.08);
          }
        });

        const addScrub = () => {
          tl.fromTo(el, { currentTime: 0 }, { currentTime: Math.max(0, el.duration - 0.1), duration: 1 }, 0);
        };
        if (el.readyState >= 1) addScrub();
        else el.addEventListener("loadedmetadata", addScrub, { once: true });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom+=100%",
          once: true,
          onEnter: warmUp,
        });

        return () => el.removeEventListener("loadedmetadata", addScrub);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-[260svh] motion-reduce:h-auto">
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:relative">
        <div
          data-scrub-frame
          className={`relative h-full w-full overflow-hidden bg-surface motion-reduce:[clip-path:none] ${REVEAL[reveal].initial}`}
        >
          <video
            ref={video}
            src={clip.src}
            poster={clip.poster}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75" />

          <div className="absolute inset-0 grid place-items-center gap-4 px-6 text-center motion-reduce:content-center">
            {lines.map((line) => (
              <p
                key={line}
                data-scrub-line
                className="text-[clamp(2.8rem,9vw,8.5rem)] font-semibold leading-[0.95] tracking-tightest text-fg motion-safe:invisible motion-safe:opacity-0 motion-safe:[grid-area:1/1]"
              >
                {line}
              </p>
            ))}
          </div>

          {caption && (
            <p className="absolute inset-x-0 bottom-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-fg/70">
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
