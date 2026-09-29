"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, PIN_OK } from "@/app/lib/gsap";
import { VIDEOS } from "@/app/lib/videos";
import LazyVideo from "../ui/LazyVideo";
import TechIcon from "../TechIcon";

const PANELS = [
  { key: "frontend", tint: "#0894ff", tech: ["Next.js", "React", "Angular", "TypeScript", "Tailwind", "Figma"] },
  { key: "backend", tint: "#c959dd", tech: ["Java", "Spring Boot", "NestJS", "FastAPI", "Node.js", "WebFlux"] },
  { key: "cloud", tint: "#ff2e54", tech: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform"] },
  { key: "ai", tint: "#ff9004", tech: ["Python", "Whisper X", "OpenAI", "ML", "NLP", "Lambda"] },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "What I do" as a film strip: four full-screen video panels that slide
 * sideways while the section is pinned. Short screens get a vertical stack.
 */
export default function StackSection() {
  const t = useTranslations("Stack");
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(PIN_OK, () => {
        const el = track.current;
        if (!el) return;
        const panels = gsap.utils.toArray<HTMLElement>("[data-stack-panel]");
        const distance = () => el.scrollWidth - window.innerWidth;

        const slide = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-stack-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.to("[data-stack-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-stack-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        panels.forEach((panel, i) => {
          // Footage drifts slower than the panel: a window onto a moving scene
          gsap.fromTo(
            panel.querySelector("[data-stack-media]"),
            { xPercent: i === 0 ? 0 : -18 },
            {
              xPercent: 18,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
          if (i === 0) return;
          gsap.from(panel.querySelectorAll("[data-stack-reveal]"), {
            autoAlpha: 0,
            x: 120,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: slide,
              start: "left 75%",
              end: "left 20%",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={t("eyebrow")} className="relative bg-ink">
      <div data-stack-pin className="relative overflow-hidden pin:h-[100svh]">
        <div
          ref={track}
          className="flex flex-col gap-4 px-4 nopin:py-16 pin:h-full pin:w-max pin:flex-row pin:gap-0 pin:px-0"
        >
          {PANELS.map((panel, i) => (
            <article
              key={panel.key}
              data-stack-panel
              className="relative isolate h-[85svh] w-full flex-shrink-0 overflow-hidden rounded-[28px] bg-surface pin:h-full pin:w-screen pin:rounded-none"
            >
              <div data-stack-media className="absolute inset-y-0 -inset-x-[20%]">
                <LazyVideo
                  clip={VIDEOS.stack[panel.key]}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              <div
                aria-hidden="true"
                className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full opacity-40 blur-[120px]"
                style={{ background: panel.tint }}
              />

              <div className="container-x relative flex h-full flex-col justify-between pb-10 pt-28 sm:pb-16">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-fg/70">
                  <span>{t("eyebrow")}</span>
                  <span>
                    {pad(i + 1)} / {pad(PANELS.length)}
                  </span>
                </div>

                <div className="max-w-3xl">
                  <span
                    data-stack-reveal
                    className="mb-5 block h-1 w-16 rounded-full"
                    style={{ background: panel.tint }}
                  />
                  <h3
                    data-stack-reveal
                    className="text-[clamp(3.2rem,min(11vw,18svh),10rem)] font-semibold leading-[0.9] tracking-tightest text-fg"
                  >
                    {t(`panels.${panel.key}.title`)}
                  </h3>
                  <p
                    data-stack-reveal
                    className="mt-6 max-w-xl text-lg leading-relaxed text-fg/80 sm:text-xl"
                  >
                    {t(`panels.${panel.key}.body`)}
                  </p>
                  <ul data-stack-reveal className="mt-8 flex flex-wrap gap-2">
                    {panel.tech.map((tech) => (
                      <li
                        key={tech}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-sm text-fg/90 backdrop-blur-md"
                      >
                        <TechIcon technology={tech} size={14} />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[3px] bg-white/10 pin:block">
          <div data-stack-progress className="bg-ai h-full origin-left scale-x-0" />
        </div>
      </div>
    </section>
  );
}
