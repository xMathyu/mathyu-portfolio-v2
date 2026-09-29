"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, MOTION_OK } from "@/app/lib/gsap";
import { VIDEOS } from "@/app/lib/videos";
import SectionHeading from "../ui/SectionHeading";
import LazyVideo from "../ui/LazyVideo";
import { useSpotlight } from "../ui/useSpotlight";

const stats = [
  { key: "cost", value: 75, span: "sm:col-span-2 lg:col-span-4 lg:row-span-2", hero: true },
  { key: "calls", value: 100, span: "lg:col-span-2", video: VIDEOS.stats.calls },
  { key: "years", value: 6, span: "lg:col-span-2", video: VIDEOS.stats.years },
  { key: "hackathons", value: 2, span: "lg:col-span-2" },
  { key: "remote", value: 3, span: "lg:col-span-2", video: VIDEOS.stats.remote },
  { key: "companies", value: 10, span: "sm:col-span-2 lg:col-span-2", video: VIDEOS.stats.companies },
] as const;

export default function StatsSection() {
  const t = useTranslations("Stats");
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  useSpotlight(grid);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-stat]", {
          autoAlpha: 0,
          y: 90,
          rotationX: 38,
          scale: 0.92,
          transformPerspective: 1100,
          transformOrigin: "50% 100%",
          duration: 1.4,
          ease: "expo.out",
          stagger: { each: 0.09, from: "start" },
          scrollTrigger: { trigger: grid.current, start: "top 80%", once: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const counter = { value: 0 };
          el.textContent = "0";
          gsap.to(counter, {
            value: end,
            duration: 2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.value));
            },
          });
        });

        return () => {
          gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
            el.textContent = el.dataset.count ?? "";
          });
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
        />

        <div
          ref={grid}
          className="spotlight-group mt-16 grid auto-rows-[minmax(220px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-6"
        >
          {stats.map((stat) => (
            <article
              key={stat.key}
              data-stat
              data-tilt
              className={`card spotlight group flex flex-col justify-between p-7 sm:p-8 ${stat.span}`}
            >
              {"video" in stat && (
                <>
                  <LazyVideo
                    clip={stat.video}
                    className="absolute inset-0 h-full w-full object-cover opacity-55 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/10" />
                </>
              )}
              {"hero" in stat && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] animate-spin-slow rounded-full opacity-40 blur-[80px]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #0894ff, #c959dd, #ff2e54, #ff9004, #0894ff)",
                  }}
                />
              )}
              <span className="relative z-[2] font-mono text-[11px] uppercase tracking-[0.2em] text-fg/60">
                {t(`items.${stat.key}.detail`)}
              </span>
              <div className="relative z-[2]">
                <p
                  className={`font-semibold tracking-tightest ${
                    "hero" in stat
                      ? "text-ai text-[clamp(6rem,16vw,15rem)] leading-[0.85]"
                      : "text-[clamp(3.5rem,6vw,5rem)] leading-none text-fg"
                  }`}
                >
                  <span data-count={stat.value}>{stat.value}</span>
                  {t(`items.${stat.key}.suffix`)}
                </p>
                <p
                  className={`mt-3 max-w-xs leading-snug text-muted ${
                    "hero" in stat ? "text-xl sm:text-2xl" : "text-base"
                  }`}
                >
                  {t(`items.${stat.key}.label`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
