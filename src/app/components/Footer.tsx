"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/app/lib/gsap";

function useLimaTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Lima",
      }).format(new Date());
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export default function Footer() {
  const t = useTranslations("Footer");
  const lenis = useLenis();
  const time = useLimaTime();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-wordmark]", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 100,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-white/[0.06] pt-16">
      <div className="container-x flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-subtle">
            {t("localTime")}
          </span>
          <span className="text-2xl font-medium tabular-nums text-fg" suppressHydrationWarning>
            {time ?? "--:--"} <span className="text-base text-subtle">GMT−5</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-white/30 hover:text-fg"
          >
            <FaLinkedin className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/xMathyu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-white/30 hover:text-fg"
          >
            <FaGithub className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => lenis?.scrollTo(0, { duration: 1.6 })}
            className="btn-ghost ml-2"
          >
            {t("backToTop")}
            <FiArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="container-x mt-16">
        <p className="border-t border-white/[0.06] py-6 text-sm text-subtle">
          {t("rights", { year: new Date().getFullYear() })}
        </p>
      </div>

      <div aria-hidden="true" className="overflow-hidden px-2">
        <p
          data-wordmark
          className="select-none whitespace-nowrap pb-[3vw] text-center text-[18.5vw] font-semibold leading-[0.78] tracking-tightest text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.14)]"
        >
          Mathyu
        </p>
      </div>
    </footer>
  );
}
