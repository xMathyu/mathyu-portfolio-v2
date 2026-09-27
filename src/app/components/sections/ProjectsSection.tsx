"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FiArrowUpRight } from "react-icons/fi";
import { gsap, useGSAP, MOTION_OK } from "@/app/lib/gsap";
import SectionHeading from "../ui/SectionHeading";

const projects = [
  {
    key: "twenty",
    title: "TWENTY",
    image: "/images/twentymoda-catalog.jpg",
    url: "https://twentymoda.com/",
    tags: ["Next.js", "React", "Tailwind", "E-commerce"],
    glow: "#facc15",
  },
  {
    key: "calarm",
    title: "Calarm",
    image: "/images/calarm.png",
    url: "https://apps.apple.com/pe/app/calarm-smart-alarms/id6772419323?l=en-GB",
    tags: ["iOS", "Swift", "Apple Intelligence", "Foundation Models"],
    glow: "#ff7a1a",
    portrait: true,
  },
  {
    key: "selvatici",
    title: "I Selvatici",
    image: "/images/selvatici-gallery.jpg",
    url: "https://selvatici.vercel.app/",
    tags: ["Next.js", "React", "Tailwind", "i18n"],
    glow: "#fb923c",
  },
  {
    key: "monyx",
    title: "Monyx",
    image: "/images/monyx.png",
    url: "https://monyx.vercel.app/",
    tags: ["Next.js", "TypeScript", "Firebase", "AI"],
    glow: "#8b5cf6",
  },
  {
    key: "famengchuen",
    title: "Fa Meng Chuen",
    image: "/images/proyecto1.png",
    url: "https://famengchuen.com/",
    tags: ["Next.js", "React", "Tailwind"],
    glow: "#dc2626",
  },
  {
    key: "parco",
    title: "Parco dei Colori",
    image: "/images/proyecto2.png",
    url: "http://parcodeicolori.it/",
    tags: ["Next.js", "AI", "Design"],
    glow: "#22c55e",
  },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectsSection() {
  const t = useTranslations("Projects");
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and scroll the cards sideways
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const el = track.current;
        if (!el) return;
        const distance = () => el.scrollWidth - window.innerWidth;

        const slide = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-projects-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(
                projects.length,
                Math.floor(self.progress * projects.length) + 1,
              );
              if (counter.current) counter.current.textContent = pad(index);
            },
          },
        });

        gsap.to("[data-projects-bar]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-projects-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-project-card]").forEach((card) => {
          gsap.fromTo(
            card.querySelector("[data-project-img]"),
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });

      // Mobile / tablet: simple reveal as each card enters
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
        gsap.utils.toArray<HTMLElement>("[data-project-card]").forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0,
            y: 60,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="projects" className="relative">
      <div
        data-projects-pin
        className="relative flex flex-col justify-center overflow-hidden py-28 sm:py-36 lg:h-[100svh] lg:py-0"
      >
        <div className="container-x mb-12 flex flex-col gap-8 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
            description={t("intro")}
          />
          <div className="hidden w-56 flex-col gap-3 pb-2 lg:flex">
            <span className="font-mono text-xs text-muted">
              <span ref={counter}>01</span>
              <span className="text-subtle"> / {pad(projects.length)}</span>
            </span>
            <span className="h-px w-full overflow-hidden bg-white/10">
              <span data-projects-bar className="block h-full origin-left scale-x-0 bg-fg" />
            </span>
          </div>
        </div>

        <div
          ref={track}
          className="flex flex-col gap-6 px-5 sm:px-8 lg:w-max lg:flex-row lg:gap-8 lg:px-[max(3rem,calc((100vw-82.5rem)/2+3rem))] lg:will-change-transform"
        >
          {projects.map((project, i) => (
            <a
              key={project.key}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-project-card
              data-cursor={t("visit")}
              className="group relative block aspect-[4/5] w-full flex-shrink-0 overflow-hidden rounded-[32px] border border-white/[0.08] bg-surface sm:aspect-[16/10] lg:aspect-auto lg:h-[min(64svh,38.75rem)] lg:w-[min(70vw,62.5rem)]"
            >
              <div data-project-img className="absolute inset-y-0 -inset-x-[8%]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 75vw, 100vw"
                  className={`transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] ${
                    "portrait" in project
                      ? "object-contain object-[85%_20%] sm:object-right-top"
                      : "object-cover object-left-top"
                  }`}
                />
              </div>
              <div
                className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent ${
                  // Portrait screenshots sit behind the copy on small screens, so darken them more
                  "portrait" in project
                    ? "h-full via-black/85 lg:h-3/4 lg:via-black/70"
                    : "h-3/4 via-black/70"
                }`}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-1/2 rounded-full opacity-0 blur-[90px] transition-opacity duration-700 group-hover:opacity-60"
                style={{ background: project.glow }}
              />

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-6 sm:p-10">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg/70">
                  <span>{pad(i + 1)}</span>
                  <span className="h-px w-6 bg-white/30" />
                  <span>{t(`items.${project.key}.category`)}</span>
                </div>
                <div className="flex items-end justify-between gap-6">
                  <div className="max-w-xl">
                    <h3 className="text-4xl font-semibold tracking-[-0.04em] text-fg sm:text-6xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-fg/70 sm:text-lg">
                      {t(`items.${project.key}.description`)}
                    </p>
                  </div>
                  <span className="hidden h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-fg text-ink transition-transform duration-500 group-hover:rotate-45 sm:flex">
                    <FiArrowUpRight className="h-6 w-6" />
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="chip border-white/15 bg-black/30 text-fg/80 backdrop-blur-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
