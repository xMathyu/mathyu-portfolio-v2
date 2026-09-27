"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, MOTION_OK } from "@/app/lib/gsap";
import { VIDEOS } from "@/app/lib/videos";
import LazyVideo from "../ui/LazyVideo";

const WORDS = ["w1", "w2", "w3"] as const;
const DISCIPLINES = ["frontend", "backend", "cloud", "ai"] as const;

// Sized by viewport height too, so the three words always fit before the zoom
const REEL_TYPE =
  "select-none text-center text-[length:min(19vw,22svh)] font-black uppercase leading-[0.86] tracking-[-0.04em] will-change-transform";

/**
 * Video seen through giant knockout type. Scrolling zooms into the letters
 * until the footage takes over the screen, then the caption lands.
 */
export default function ShowreelSection() {
  const t = useTranslations("Showreel");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: "[data-reel-pin]",
              start: "top top",
              end: "+=280%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          })
          // Hold first so all three words can be read, then dive into the letters
          .fromTo(
            "[data-reel-text]",
            { scale: 1 },
            { scale: 12, ease: "power3.in", duration: 1 },
            0.3,
          )
          .to("[data-reel-mask]", { autoAlpha: 0, duration: 0.35 }, 0.95)
          .to("[data-reel-tint]", { opacity: 0.12, duration: 0.35 }, 0.95)
          .fromTo("[data-reel-scrim]", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.15)
          .from(
            "[data-reel-caption] > *",
            { autoAlpha: 0, y: 40, stagger: 0.06, duration: 0.3, ease: "power2.out" },
            1.25,
          )
          .to({}, { duration: 0.35 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={t("eyebrow")} className="relative">
      <div data-reel-pin className="relative isolate h-[100svh] overflow-hidden bg-ink">
        {/* Zoomed toward the top-right: the clip has a dark wedge in its lower-left corner */}
        <LazyVideo
          clip={VIDEOS.showreel}
          className="absolute inset-0 h-full w-full origin-top-right scale-[1.4] object-cover"
        />
        {/* Brand gradient lifts the darkest parts of the footage so no letter goes black */}
        <div data-reel-tint className="bg-ai absolute inset-0 opacity-40 mix-blend-screen" />

        <div
          data-reel-scrim
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 motion-safe:opacity-0"
        />

        {/* White type on black, multiplied over the video: footage only shows inside the letters */}
        <div
          data-reel-mask
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black mix-blend-multiply motion-reduce:hidden"
        >
          <p data-reel-text className={`${REEL_TYPE} text-white`}>
            {WORDS.map((w) => (
              <span key={w} className="block">
                {t(w)}
              </span>
            ))}
          </p>
        </div>

        <div
          data-reel-caption
          className="container-x absolute inset-x-0 bottom-0 flex flex-col gap-6 pb-14 sm:pb-20"
        >
          <span className="eyebrow text-fg/80">{t("eyebrow")}</span>
          <h2 className="max-w-[16ch] text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-fg">
            {t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {DISCIPLINES.map((d) => (
              <li
                key={d}
                className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm text-fg/90 backdrop-blur-md"
              >
                {t(`disciplines.${d}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
