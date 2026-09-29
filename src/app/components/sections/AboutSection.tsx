"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiCloud, FiCpu, FiDownload, FiLayers, FiUsers } from "react-icons/fi";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/app/lib/gsap";
import { VIDEOS } from "@/app/lib/videos";
import LazyVideo from "../ui/LazyVideo";

const pillars = [
  { key: "ownership", icon: FiLayers },
  { key: "leadership", icon: FiUsers },
  { key: "ai", icon: FiCpu },
  { key: "cloud", icon: FiCloud },
] as const;

export default function AboutSection() {
  const t = useTranslations("About");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Words light up one by one as the paragraph scrolls through the viewport
        SplitText.create("[data-manifesto]", {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.14 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: {
                  trigger: "[data-manifesto]",
                  start: "top 78%",
                  end: "bottom 42%",
                  scrub: true,
                },
              },
            ),
        });

        gsap.to("[data-manifesto] em", {
          backgroundSize: "100% 0.08em",
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: "[data-manifesto]",
            start: "top 70%",
            end: "bottom 45%",
            scrub: true,
          },
        });

        gsap.fromTo(
          "[data-manifesto-media]",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "center top", scrub: true },
          },
        );

        gsap.fromTo(
          "[data-photo]",
          { clipPath: "inset(16% 14% 16% 14% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            ease: "none",
            scrollTrigger: {
              trigger: "[data-photo]",
              start: "top 90%",
              end: "top 30%",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          "[data-photo-img]",
          { scale: 1.3 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-photo]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.from("[data-pillar]", {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-pillars]", start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative py-28 sm:py-40">
      {/* Atmospheric footage behind the manifesto, faded into the page at both edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(130svh,80rem)] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_62%,transparent)]"
      >
        <div data-manifesto-media className="absolute inset-x-0 -inset-y-[12%]">
          <LazyVideo clip={VIDEOS.manifesto} className="h-full w-full object-cover opacity-45" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/60" />
      </div>
      <div className="container-x relative">
        <span className="eyebrow">{t("eyebrow")}</span>
        <p
          data-manifesto
          className="manifesto mt-10 max-w-[1150px] text-[clamp(1.9rem,4.4vw,4.25rem)] font-medium leading-[1.1] tracking-[-0.035em] text-fg"
        >
          {t.rich("manifesto", { em: (chunks) => <em>{chunks}</em> })}
        </p>

        <div className="mt-24 grid gap-12 sm:mt-32 lg:grid-cols-12 lg:gap-16">
          <figure
            data-photo
          data-skew="y"
            className="relative aspect-[4/5] max-h-[85svh] w-full overflow-hidden rounded-[28px] bg-surface sm:aspect-[3/2] lg:col-span-5 lg:aspect-[4/5]"
          >
            <div data-photo-img className="absolute inset-0">
              <Image
                src="/images/mathyu.jpg"
                alt={t("photoAlt")}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[50%_30%]"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
            <figcaption className="absolute bottom-5 left-5 right-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-fg/80">
              <span>Mathyu Cardozo</span>
              <span>{t("photoCaption")}</span>
            </figcaption>
          </figure>

          <div data-pillars className="flex flex-col justify-between gap-12 lg:col-span-7">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {t("pillarsTitle")}
              </h3>
              <div className="mt-10 grid gap-px overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
                {pillars.map(({ key, icon: Icon }, i) => (
                  <div key={key} data-pillar className="flex flex-col gap-4 bg-ink p-7 sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-fg">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-fg">
                      {t(`pillars.${key}.title`)}
                    </h4>
                    <p className="text-[15px] leading-relaxed text-muted">
                      {t(`pillars.${key}.body`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <FaLinkedin className="h-4 w-4" />
                {t("social.linkedin")}
              </a>
              <a
                href="https://github.com/xMathyu"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <FaGithub className="h-4 w-4" />
                {t("social.github")}
              </a>
              <a
                href="/mathyu-cv-es.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <FiDownload className="h-4 w-4" />
                {t("social.cv")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
