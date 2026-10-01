"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/app/lib/gsap";
import { useIntro } from "./providers/IntroProvider";

const SEEN_KEY = "mc-intro-seen";

// Reel of shots from the site; the last one is the portrait
const SHOTS = Array.from({ length: 9 }, (_, i) => `/loader/${String(i + 1).padStart(2, "0")}.jpg`);
const COLUMNS = 6;
const DIGITS = Array.from({ length: 10 }, (_, i) => i);
const GRADIENT = ["#0894ff", "#5b76f0", "#c959dd", "#e8457f", "#ff2e54", "#ff9004"];

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable (private mode) — the intro simply plays again
  }
}

/**
 * Opening titles: a montage of the site's footage flickers in a framed
 * window while an odometer counts to 100, then brand-gradient columns sweep
 * up over the screen and away to reveal the hero. Plays once per session.
 */
export default function Preloader() {
  const t = useTranslations("Preloader");
  const { setIntroDone } = useIntro();
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!lenis) return;
    if (visible) lenis.stop();
    else lenis.start();
  }, [lenis, visible]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      el.style.animation = "none";
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || readSeen()) {
        setIntroDone(true);
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.45,
          ease: "power2.out",
          onComplete: () => setVisible(false),
        });
        return;
      }

      const shots = gsap.utils.toArray<HTMLElement>("[data-pl-shot]");
      const wheels = gsap.utils.toArray<HTMLElement>("[data-pl-wheel]");
      const columns = gsap.utils.toArray<HTMLElement>("[data-pl-col]");
      const counter = { value: 0 };
      const COUNT = 1.7;

      // Odometer: each wheel shows one digit (a digit is 10% of the wheel)
      const setDigits = (v: number) => {
        const n = Math.round(v);
        const digits = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
        wheels.forEach((w, i) => gsap.set(w, { yPercent: -digits[i] * 10 }));
      };

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          markSeen();
          setVisible(false);
        },
      });

      tl.from("[data-pl-line]", { yPercent: 110, duration: 0.9, stagger: 0.05 })
        .from(
          "[data-pl-frame]",
          { clipPath: "inset(50% 50% 50% 50% round 24px)", duration: 0.9, ease: "expo.inOut" },
          0.05,
        )
        .to(counter, { value: 100, duration: COUNT, ease: "power2.inOut", onUpdate: () => setDigits(counter.value) }, 0.35)
        .to("[data-pl-bar]", { scaleX: 1, duration: COUNT, ease: "power2.inOut" }, 0.35)
        .fromTo("[data-pl-frame-inner]", { scale: 1.25 }, { scale: 1, duration: COUNT + 0.4, ease: "power2.out" }, 0.35);

      // Montage: cut through the shots, slowing down as it lands on the portrait
      let at = 0.35;
      shots.forEach((shot, i) => {
        tl.set(shot, { autoAlpha: 1, zIndex: i + 1 }, at);
        at += 0.1 + (i / shots.length) * 0.16;
      });

      // Hold on the portrait for a beat, then exit: brand columns sweep up over everything...
      tl.to("[data-pl-line]", { yPercent: -110, duration: 0.45, ease: "power3.in", stagger: 0.03 }, at + 0.35)
        .to("[data-pl-frame]", { scale: 1.08, autoAlpha: 0, duration: 0.5, ease: "power3.in" }, "<")
        .fromTo(
          columns,
          { scaleY: 0, transformOrigin: "50% 100%" },
          { scaleY: 1, duration: 0.55, ease: "expo.inOut", stagger: { each: 0.05, from: "center" } },
          "<0.1",
        )
        .set(el, { backgroundColor: "transparent" })
        .set("[data-pl-content]", { autoAlpha: 0 })
        // ...and away, revealing the hero as its own entrance starts
        .add(() => setIntroDone(true))
        .to(columns, {
          scaleY: 0,
          transformOrigin: "50% 0%",
          duration: 0.7,
          ease: "expo.inOut",
          stagger: { each: 0.05, from: "center" },
        });
    },
    { scope: root },
  );

  if (!visible) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[100] overflow-hidden bg-ink"
    >
      <div data-pl-content className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
        <div className="flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          <span className="overflow-hidden">
            <span data-pl-line className="block">
              Mathyu Cardozo
            </span>
          </span>
          <span className="overflow-hidden">
            <span data-pl-line className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff3b30]" />
              {t("role")}
            </span>
          </span>
        </div>

        {/* Montage window */}
        <div className="pointer-events-none absolute left-1/2 top-[44%] w-[min(80vw,46rem)] -translate-x-1/2 -translate-y-1/2">
          <div
            data-pl-frame
            className="relative aspect-[16/10] overflow-hidden rounded-[24px] shadow-[0_0_80px_-10px_rgba(201,89,221,0.55)] [clip-path:inset(0%_0%_0%_0%_round_24px)]"
          >
            <div data-pl-frame-inner className="absolute inset-0">
              {SHOTS.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  data-pl-shot
                  src={src}
                  alt=""
                  className="invisible absolute inset-0 h-full w-full object-cover opacity-0"
                />
              ))}
            </div>
            <div className="absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/15" />
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          {/* Odometer */}
          <span className="overflow-hidden">
            <span
              data-pl-line
              className="flex text-[clamp(4.5rem,15vw,12rem)] font-semibold leading-none tracking-tightest tabular-nums"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="relative block h-[1em] overflow-hidden">
                  <span data-pl-wheel className="block">
                    {DIGITS.map((d) => (
                      <span key={d} className="block h-[1em]">
                        {d}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
          </span>
          <span className="overflow-hidden pb-3 text-right font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            <span data-pl-line className="block">
              {t("loading")}
            </span>
            <span data-pl-line className="mt-1 block text-fg/70">
              Portfolio ©{new Date().getFullYear()}
            </span>
          </span>
        </div>

        <div
          data-pl-bar
          className="bg-ai absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0"
        />
      </div>

      {/* Brand-gradient wipe */}
      <div className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span
            key={i}
            data-pl-col
            className="h-full flex-1 scale-y-0"
            style={{ background: `linear-gradient(180deg, ${GRADIENT[i]}, #0b0b0e 120%)` }}
          />
        ))}
      </div>
    </div>
  );
}
