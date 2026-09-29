"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { FiMapPin } from "react-icons/fi";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/app/lib/gsap";
import { VIDEOS, type VideoClip } from "@/app/lib/videos";
import SectionHeading from "../ui/SectionHeading";
import LazyVideo from "../ui/LazyVideo";
import TechIcon from "../TechIcon";

type ExperienceKey = keyof typeof VIDEOS.experience;

interface Experience {
  id: string;
  key: ExperienceKey;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  achievementKeys: string[];
  technologies: string[];
  companyLogo: string;
}

const experiences: Experience[] = [
  {
    id: "exp-0",
    key: "entel",
    startDate: "2025-11",
    endDate: "",
    isCurrent: true,
    achievementKeys: ["a1", "a2", "a3", "a4", "a5"],
    technologies: ["Python", "FastAPI", "Whisper X", "AWS", "Lambda", "SQS", "OpenAI", "Next.js", "React", "ML", "NLP"],
    companyLogo: "/logos/entel-logo.png",
  },
  {
    id: "exp-1",
    key: "t309",
    startDate: "2025-04",
    endDate: "2025-11",
    isCurrent: false,
    achievementKeys: ["a1", "a2", "a3", "a4", "a5"],
    technologies: ["Next.js", "AI", "Java", "Kotlin", "Spring Boot", "AWS", "ML", "Figma", "React", "TypeScript"],
    companyLogo: "/logos/309.png",
  },
  {
    id: "exp-2",
    key: "encora",
    startDate: "2023-10",
    endDate: "2025-04",
    isCurrent: false,
    achievementKeys: ["a1", "a2"],
    technologies: ["Java", "Spring Boot", "WebFlux", "RxJava", "Azure", "AWS", "Kubernetes", "Angular", "Next.js"],
    companyLogo: "/logos/encora.png",
  },
  {
    id: "exp-3",
    key: "serverli",
    startDate: "2024-06",
    endDate: "2024-12",
    isCurrent: false,
    achievementKeys: ["a1", "a2", "a3"],
    technologies: ["Next.js", "NestJS", ".Net", "C#", "Python", "Azure", "Kubernetes", "TypeScript"],
    companyLogo: "/logos/serverli.png",
  },
  {
    id: "exp-4",
    key: "mdp",
    startDate: "2020-11",
    endDate: "2023-10",
    isCurrent: false,
    achievementKeys: ["a1", "a2", "a3", "a4", "a5", "a6"],
    technologies: ["Java", "Spring Boot", "Node.js", "Angular", "React", "Python", "OpenAI", "AWS", "Azure", "Docker"],
    companyLogo: "/logos/mdp.png",
  },
];

function formatDate(dateStr: string, locale: string): string {
  const [year, month] = dateStr.split("-").map(Number);
  const label = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(
    new Date(year, month - 1, 1),
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * One layer of the desktop video stage. Only the active layer downloads and
 * plays; the rest stay paused under a crossfade.
 */
function StageLayer({ clip, active }: { clip: VideoClip; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active) {
      if (!video.getAttribute("src")) video.src = clip.src;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        video.play().catch(() => {});
      }
      return;
    }
    const id = window.setTimeout(() => video.pause(), 700);
    return () => window.clearTimeout(id);
  }, [active, clip.src]);

  return (
    <video
      ref={ref}
      poster={clip.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${
        active ? "scale-100 opacity-100" : "scale-105 opacity-0"
      }`}
    />
  );
}

export default function ExperienceSection() {
  const t = useTranslations("Experience");
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      // Which role is being read drives the desktop stage (runs with or without motion)
      gsap.utils.toArray<HTMLElement>("[data-exp-row]").forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-exp-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-exp-list]",
              start: "top 60%",
              end: "bottom 60%",
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          "[data-exp-stage]",
          { clipPath: "inset(10% 10% 10% 10% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            ease: "none",
            scrollTrigger: { trigger: "[data-exp-list]", start: "top 90%", end: "top 40%", scrub: true },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-exp-row]").forEach((row) => {
          gsap.from(row.querySelectorAll("[data-exp-reveal]"), {
            autoAlpha: 0,
            y: 40,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: row, start: "top 78%", once: true },
          });
          gsap.fromTo(
            row.querySelector("[data-exp-dot]"),
            { scale: 0.4, backgroundColor: "#2a2a2e" },
            {
              scale: 1,
              backgroundColor: "#f5f5f7",
              duration: 0.4,
              scrollTrigger: {
                trigger: row,
                start: "top 60%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  const period = (exp: Experience) =>
    `${formatDate(exp.startDate, locale)} — ${exp.isCurrent ? t("present") : formatDate(exp.endDate, locale)}`;
  const current = experiences[active];

  return (
    <section ref={root} id="experience" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionHeading
          index="04"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
          description={t("description")}
        />

        <div data-exp-list className="relative mt-20 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Desktop stage: footage for the role being read */}
          <div className="hidden lg:col-span-5 lg:block">
            <div
              data-exp-stage
              className="sticky top-24 h-[calc(100svh-8rem)] max-h-[46rem] overflow-hidden rounded-[28px] border border-white/[0.08] bg-surface"
            >
              {experiences.map((exp, i) => (
                <StageLayer key={exp.id} clip={VIDEOS.experience[exp.key]} active={i === active} />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 font-mono text-[11px] uppercase tracking-[0.2em] text-fg/80">
                <span>{t("eyebrow")}</span>
                <span className="tabular-nums">
                  {String(active + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}
                </span>
              </div>

              <div key={current.id} className="absolute inset-x-0 bottom-0 animate-[stage-in_0.7s_cubic-bezier(0.16,1,0.3,1)] p-7">
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-2.5 backdrop-blur-md">
                  <Image
                    src={current.companyLogo}
                    alt=""
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </span>
                <p className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-fg">
                  {t(`${current.key}.company`)}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-fg/70">
                  {period(current)}
                </p>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div className="absolute bottom-0 left-[5px] top-0 w-px bg-white/10">
              <div
                data-exp-progress
                className="h-full w-full origin-top bg-gradient-to-b from-ai-blue via-ai-purple to-ai-orange"
              />
            </div>

            {experiences.map((exp) => (
              <article
                key={exp.id}
                data-exp-row
                className="relative border-t border-white/[0.08] py-12 pl-10 first-of-type:border-t-0 first-of-type:pt-0 md:pl-14"
              >
                <span
                  data-exp-dot
                  className="absolute left-0 top-[52px] h-[11px] w-[11px] rounded-full bg-fg ring-4 ring-ink [article:first-of-type>&]:top-1"
                />

                {/* Phones & tablets: each role carries its own clip */}
                <div
                  data-exp-reveal
                  data-skew="y"
                  className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[22px] border border-white/[0.08] bg-surface lg:hidden"
                >
                  <LazyVideo clip={VIDEOS.experience[exp.key]} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div data-exp-reveal className="flex flex-wrap items-center gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                    <Image
                      src={exp.companyLogo}
                      alt={t(`${exp.key}.company`)}
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
                    {period(exp)}
                  </span>
                  {exp.isCurrent && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2.5 py-0.5 text-[11px] font-medium text-live">
                      <span className="h-1.5 w-1.5 rounded-full bg-live" />
                      {t("current")}
                    </span>
                  )}
                </div>

                <h3
                  data-exp-reveal
                  className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em] text-fg sm:text-4xl"
                >
                  {t(`${exp.key}.position`)}
                </h3>
                <p
                  data-exp-reveal
                  className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-muted"
                >
                  <span className="font-medium text-fg/90">{t(`${exp.key}.company`)}</span>
                  <span className="inline-flex items-center gap-1 text-sm text-subtle">
                    <FiMapPin className="h-3.5 w-3.5" />
                    {t(`${exp.key}.location`)}
                  </span>
                </p>
                <p data-exp-reveal className="mt-6 max-w-3xl text-[17px] leading-relaxed text-muted">
                  {t(`${exp.key}.description`)}
                </p>

                <ul className="mt-8 grid gap-x-10 gap-y-4 2xl:grid-cols-2">
                  {exp.achievementKeys.map((a) => (
                    <li
                      key={a}
                      data-exp-reveal
                      className="flex gap-3 text-[15px] leading-relaxed text-fg/85"
                    >
                      <span className="bg-ai mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      {t(`${exp.key}.${a}`)}
                    </li>
                  ))}
                </ul>

                <div data-exp-reveal className="mt-8 flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="chip">
                      <TechIcon technology={tech} size={12} />
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
