"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, ScrollTrigger } from "@/app/lib/gsap";

export const CHAPTERS = [
  "about",
  "stack",
  "work",
  "experience",
  "skills",
  "projects",
  "achievements",
  "contact",
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Fixed "chapter" readout (number, name, progress) so the page reads as one
 * continuous scroll story. Hidden on the hero and on phones.
 */
export default function ChapterHud() {
  const t = useTranslations("Hud");
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);

  useGSAP(() => {
    const show = gsap.to(root.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", paused: true });

    CHAPTERS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        // Measure after pinned sections have added their spacers
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive) {
            setActive(i);
            show.play();
          } else if (i === 0 && self.direction === -1) {
            setActive(-1);
            show.reverse();
          }
        },
        onUpdate: (self) => {
          if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
        },
      });
    });
  });

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none invisible fixed bottom-6 left-6 z-40 hidden translate-y-4 items-center gap-4 opacity-0 mix-blend-difference md:flex"
    >
      <span className="font-mono text-[11px] tabular-nums tracking-[0.2em] text-white">
        {pad(Math.max(active, 0) + 1)} / {pad(CHAPTERS.length)}
      </span>
      <span className="relative h-px w-16 overflow-hidden bg-white/30">
        <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-white" />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
        {active >= 0 ? t(`chapters.${CHAPTERS[active]}`) : ""}
      </span>
    </div>
  );
}
