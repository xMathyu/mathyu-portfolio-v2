"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { FiArrowUpRight, FiDownload } from "react-icons/fi";
import { gsap, useGSAP, ScrollTrigger, SplitText, MOTION_OK } from "@/app/lib/gsap";
import { useIntro } from "../providers/IntroProvider";
import Magnetic from "../ui/Magnetic";

const HeroOrb = dynamic(() => import("../three/HeroOrb"), { ssr: false });

export default function HeroSection() {
  const t = useTranslations("Hero");
  const { introDone } = useIntro();
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const introDoneRef = useRef(introDone);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-hero-title]", {
          type: "lines,chars",
          mask: "lines",
          linesClass: "split-line",
        });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.from(split.chars, { yPercent: 118, duration: 1.5, stagger: 0.035 })
          .from(
            "[data-hero-orb]",
            { autoAlpha: 0, scale: 0.7, duration: 2.4, ease: "power3.out" },
            0,
          )
          .from(
            "[data-hero-fade]",
            { autoAlpha: 0, y: 26, duration: 1.1, stagger: 0.09, ease: "power3.out" },
            0.45,
          )
          .to(
            "[data-hero-role]",
            {
              duration: 1.4,
              scrambleText: {
                text: "{original}",
                chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ·—",
                speed: 0.5,
                revealDelay: 0.3,
              },
            },
            0.5,
          );
        intro.current = tl;
        if (introDoneRef.current) tl.play();

        // Scroll-out: copy drifts up and dissolves while the orb swells
        gsap.to("[data-hero-content]", {
          yPercent: -14,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom 15%",
            scrub: true,
          },
        });

        return () => {
          intro.current = null;
        };
      });
    },
    { scope: root },
  );

  useEffect(() => {
    introDoneRef.current = introDone;
    if (introDone) intro.current?.play();
  }, [introDone]);

  return (
    <section
      ref={root}
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Phones: the orb gets its own band above the copy. md+: full-bleed, right of the headline */}
      <div
        data-hero-orb
        className="relative -z-10 mt-16 h-[clamp(160px,calc(100svh-600px),320px)] shrink-0 md:absolute md:inset-0 md:mt-0 md:h-auto"
      >
        <div className="hero-glow absolute left-1/2 top-1/2 h-[min(56vw,300px)] w-[min(56vw,300px)] -translate-x-1/2 -translate-y-1/2 md:left-[72%] md:top-[26%] md:h-[34vw] md:max-h-[560px] md:w-[34vw] md:max-w-[560px] md:translate-y-0" />
        <HeroOrb progress={progress} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-gradient-to-t from-ink via-ink/75 to-transparent" />

      <div
        data-hero-content
        className="container-x relative flex flex-1 flex-col justify-end pb-8 pt-4 sm:pb-12 md:pt-32 [@media(max-height:520px)]:md:pt-24"
      >
        <div
          data-hero-fade
          className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-fg/90 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </span>
          {t("available")}
        </div>

        <p
          data-hero-role
          className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted sm:text-xs"
        >
          {t("role")}
        </p>

        <h1
          data-hero-title
          className="text-[clamp(3.4rem,min(13.5vw,24svh),12.5rem)] font-semibold leading-[0.86] tracking-tightest"
        >
          Mathyu
          <br />
          Cardozo<span className="text-ai-blue">.</span>
        </h1>

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <p
            data-hero-fade
            className="max-w-xl text-[1.05rem] leading-relaxed text-muted sm:text-xl"
          >
            {t.rich("lead", {
              b: (chunks) => <span className="text-fg">{chunks}</span>,
            })}
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#contact" className="btn-primary">
                {t("ctaPrimary")}
                <FiArrowUpRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <a
              href="/mathyu-cv-es.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <FiDownload className="h-4 w-4" />
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        <div
          data-hero-fade
          className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-subtle"
        >
          <span>{t("location")}</span>
          <span className="hidden sm:inline">{t("remote")}</span>
          <a href="#about" className="flex items-center gap-3 hover:text-fg">
            {t("scroll")}
            <span className="relative block h-6 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-fg" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
