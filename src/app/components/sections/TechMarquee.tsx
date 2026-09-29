"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/app/lib/gsap";

const ROWS = [
  ["Next.js", "Spring Boot", "AWS", "Whisper X", "React", "Kotlin", "Azure", "NestJS"],
  ["Python", "FastAPI", "OpenAI", "Kubernetes", "TypeScript", "Terraform", "Java", "Docker"],
];

/**
 * Two rows of giant tech names drifting in opposite directions. Scroll speed
 * pushes them faster and skews them; scrolling up reverses them.
 */
export default function TechMarquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-tm-row]");
        const loops = rows.map((row, i) =>
          gsap.fromTo(
            row,
            { xPercent: i % 2 ? -50 : 0 },
            { xPercent: i % 2 ? 0 : -50, duration: 40, ease: "none", repeat: -1, paused: true },
          ),
        );
        const skewTo = gsap.quickTo(rows, "skewX", { duration: 0.5, ease: "power3" });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
          onUpdate: (self) => {
            const v = self.getVelocity();
            const dir = v < 0 ? -1 : 1;
            const boost = 1 + gsap.utils.clamp(0, 6, Math.abs(v) / 300);
            loops.forEach((l) =>
              gsap.to(l, {
                timeScale: dir * boost,
                duration: 0.25,
                overwrite: true,
                onComplete: () => void gsap.to(l, { timeScale: dir, duration: 1.2, ease: "power2.out" }),
              }),
            );
            skewTo(gsap.utils.clamp(-12, 12, -v / 250));
          },
          onLeave: () => skewTo(0),
          onLeaveBack: () => skewTo(0),
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-hidden="true"
      className="relative flex flex-col gap-2 overflow-hidden py-16 sm:py-24"
    >
      {ROWS.map((words, i) => (
        <div key={i} className="overflow-hidden">
          <div data-tm-row className="flex w-max will-change-transform">
            {[0, 1].map((copy) => (
              <p
                key={copy}
                className="flex shrink-0 items-center whitespace-nowrap text-[clamp(3rem,9vw,9rem)] font-semibold leading-[1.05] tracking-tightest"
              >
                {words.map((w, j) => (
                  <span key={w} className="flex items-center">
                    <span
                      className={
                        (j + i) % 2
                          ? "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)]"
                          : "text-fg"
                      }
                    >
                      {w}
                    </span>
                    <span className="bg-ai mx-[0.35em] inline-block h-[0.22em] w-[0.22em] rounded-full" />
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
