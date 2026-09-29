"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaMicrosoft, FaTrophy } from "react-icons/fa";
import { FiAward, FiBookOpen, FiGlobe } from "react-icons/fi";
import { gsap, useGSAP, MOTION_OK } from "@/app/lib/gsap";
import SectionHeading from "../ui/SectionHeading";
import { useSpotlight } from "../ui/useSpotlight";

const certifications = [
  { key: "azure", icon: FaMicrosoft },
  { key: "scrum", icon: FiAward },
] as const;

const education = ["upc", "icpna"] as const;

const languages = [
  { key: "english", level: 85 },
  { key: "spanish", level: 100 },
  { key: "portuguese", level: 30 },
] as const;

export default function AchievementsSection() {
  const t = useTranslations("Achievements");
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  useSpotlight(grid);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-ach]", {
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
        gsap.from("[data-lang-bar]", {
          scaleX: 0,
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-lang-bar]", start: "top 90%", once: true },
        });
        gsap.fromTo(
          "[data-ach-photo]",
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-ach-photo]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="achievements" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionHeading
          index="07"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
        />

        <div
          ref={grid}
          className="spotlight-group mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-6"
        >
          {/* Hackathons */}
          <article
            data-ach
            data-tilt
            className="card spotlight flex min-h-[460px] flex-col justify-end md:col-span-2 lg:col-span-3 lg:row-span-2"
          >
            <div data-ach-photo className="absolute inset-0">
              <Image
                src="/images/hackaton.png"
                alt={t("hackathonAlt")}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
            <div className="relative flex flex-col gap-4 p-7 sm:p-9">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200 backdrop-blur-md">
                <FaTrophy className="h-3 w-3" />
                {t("winner")} · BCP · Izipay
              </span>
              <h3 className="text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl">
                {t("hackathonTitle")}
              </h3>
              <p className="max-w-md text-[15px] leading-relaxed text-fg/75 sm:text-base">
                {t("hackathonBody")}
              </p>
            </div>
          </article>

          {/* Certifications */}
          {certifications.map(({ key, icon: Icon }) => (
            <article
              key={key}
              data-ach
              data-tilt
              className="card spotlight flex flex-col justify-between gap-10 p-7 sm:p-8 lg:col-span-3"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-fg">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
                  {t("certification")}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em] text-fg sm:text-2xl">
                  {t(`certs.${key}.name`)}
                </h3>
                <p className="mt-2 text-sm text-muted">{t(`certs.${key}.issuer`)}</p>
              </div>
            </article>
          ))}

          {/* Education */}
          {education.map((key) => (
            <article
              key={key}
              data-ach
              data-tilt
              className="card spotlight flex flex-col justify-between gap-10 p-7 sm:p-8 lg:col-span-2"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-fg">
                  <FiBookOpen className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
                  {t("education")}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-fg">
                  {t(`educationItems.${key}.degree`)}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {t(`educationItems.${key}.institution`)}
                </p>
                <p className="mt-4 font-mono text-xs text-subtle">
                  {t(`educationItems.${key}.period`)}
                </p>
              </div>
            </article>
          ))}

          {/* Languages */}
          <article
            data-ach
            data-tilt
            className="card spotlight flex flex-col gap-8 p-7 sm:p-8 md:col-span-2 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-fg">
                <FiGlobe className="h-5 w-5" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
                {t("languagesTitle")}
              </span>
            </div>
            <ul className="flex flex-col gap-5">
              {languages.map((lang) => (
                <li key={lang.key}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-fg">{t(`languages.${lang.key}.name`)}</span>
                    <span className="text-xs text-muted">{t(`languages.${lang.key}.level`)}</span>
                  </div>
                  <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <span
                      data-lang-bar
                      className="bg-ai block h-full origin-left rounded-full"
                      style={{ width: `${lang.level}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
