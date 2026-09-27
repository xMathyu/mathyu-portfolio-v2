"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/app/lib/gsap";
import { useIntro } from "./providers/IntroProvider";

const SEEN_KEY = "mc-intro-seen";

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable (private mode) — the intro simply plays again
  }
}

export default function Preloader() {
  const t = useTranslations("Preloader");
  const { setIntroDone } = useIntro();
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!lenis) return;
    if (visible) lenis.stop();
    else lenis.start();
  }, [lenis, visible]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      el.style.animation = "none";
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce || readSeen()) {
        setIntroDone(true);
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.45,
          ease: "power2.out",
          onComplete: () => setVisible(false),
        });
        return;
      }

      const counter = { value: 0 };
      gsap
        .timeline({
          onComplete: () => {
            markSeen();
            setVisible(false);
          },
        })
        .from("[data-pl-line]", {
          yPercent: 110,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.06,
        })
        .to(
          counter,
          {
            value: 100,
            duration: 1.4,
            ease: "power3.inOut",
            onUpdate: () => {
              if (count.current) {
                count.current.textContent = String(
                  Math.round(counter.value),
                ).padStart(3, "0");
              }
            },
          },
          0.1,
        )
        .to("[data-pl-bar]", { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0.1)
        .to("[data-pl-line]", {
          yPercent: -110,
          duration: 0.5,
          ease: "power3.in",
          stagger: 0.04,
        })
        .add(() => setIntroDone(true), "-=0.15")
        .to(el, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "<");
    },
    { scope: root },
  );

  if (!visible) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 sm:p-10"
    >
      <div className="flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
        <span className="overflow-hidden">
          <span data-pl-line className="block">
            Mathyu Cardozo
          </span>
        </span>
        <span className="overflow-hidden">
          <span data-pl-line className="block">
            {t("role")}
          </span>
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="overflow-hidden">
          <span
            data-pl-line
            className="block text-[clamp(4rem,14vw,12rem)] font-semibold leading-[0.85] tracking-tightest"
          >
            <span ref={count}>000</span>
          </span>
        </span>
        <span className="overflow-hidden pb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          <span data-pl-line className="block">
            Portfolio ©{new Date().getFullYear()}
          </span>
        </span>
      </div>

      <div
        data-pl-bar
        className="bg-ai absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0"
      />
    </div>
  );
}
