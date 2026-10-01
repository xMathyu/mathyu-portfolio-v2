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

// The whole page plays as a 3-minute film at 24 fps
const FILM_SECONDS = 180;
const FPS = 24;

const pad = (n: number) => String(n).padStart(2, "0");
const timecode = (progress: number) => {
  const frames = Math.round(progress * FILM_SECONDS * FPS);
  const s = Math.floor(frames / FPS);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(frames % FPS)}`;
};

const corner = "absolute h-6 w-6 border-white/35";

/**
 * Camera viewfinder over the page: REC light, scene number and name, and a
 * timecode that runs with scroll so the site reads as one continuous film.
 * Hidden on the hero and on phones.
 */
export default function ChapterHud() {
  const t = useTranslations("Hud");
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);

  useGSAP(() => {
    const show = gsap.to(root.current, { autoAlpha: 1, duration: 0.6, ease: "power3.out", paused: true });

    ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (self) => {
        if (clock.current) clock.current.textContent = timecode(self.progress);
      },
    });

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
      className="pointer-events-none invisible fixed inset-0 z-40 hidden opacity-0 md:block"
    >
      {/* Viewfinder corners */}
      <span className={`${corner} left-5 top-5 border-l border-t`} />
      <span className={`${corner} right-5 top-5 border-r border-t`} />
      <span className={`${corner} bottom-5 left-5 border-b border-l`} />
      <span className={`${corner} bottom-5 right-5 border-b border-r`} />

      <div className="absolute bottom-7 left-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white mix-blend-difference">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff3b30]" />
          REC
        </span>
        <span className="tabular-nums">
          {t("scene")} {pad(Math.max(active, 0) + 1)} / {pad(CHAPTERS.length)}
        </span>
        <span className="relative h-px w-16 overflow-hidden bg-white/30">
          <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-white" />
        </span>
        <span>{active >= 0 ? t(`chapters.${CHAPTERS[active]}`) : ""}</span>
      </div>

      <div className="absolute bottom-7 right-10 font-mono text-[11px] tabular-nums tracking-[0.2em] text-white mix-blend-difference">
        <span ref={clock}>00:00:00:00</span>
      </div>
    </div>
  );
}
