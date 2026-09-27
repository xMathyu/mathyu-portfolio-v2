"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/app/lib/gsap";

// `height` compensates for the padding baked into some logo files;
// `opaque` logos ship with a white background and need a different filter.
const companies = [
  { name: "Entel", logo: "/logos/entel-logo.png", width: 320, height: 320, h: 44 },
  { name: "309 Technology", logo: "/logos/309.png", width: 861, height: 417, h: 64 },
  { name: "Encora", logo: "/logos/encora.png", width: 2052, height: 516, h: 30 },
  { name: "Serverli", logo: "/logos/serverli.png", width: 217, height: 53, h: 30 },
  { name: "MDP Consulting", logo: "/logos/mdp.png", width: 200, height: 75, h: 40 },
  { name: "AOS", logo: "/logos/aos.png", width: 200, height: 200, h: 72, opaque: true },
  { name: "Interbank", logo: "/logos/interbank.png", width: 2560, height: 487, h: 30 },
  { name: "Niubiz", logo: "/logos/niubiz.png", width: 534, height: 132, h: 32 },
  { name: "Pacífico", logo: "/logos/pacifico.svg", width: 659, height: 227, h: 40 },
  { name: "Scotiabank", logo: "/logos/scotiabank.png", width: 320, height: 320, h: 112 },
];

export default function CompaniesSection() {
  const t = useTranslations("Companies");
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track.current, {
          xPercent: -50,
          duration: 38,
          ease: "none",
          repeat: -1,
        });

        // Scroll velocity pushes the marquee faster (and backwards when scrolling up)
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const boost = gsap.utils.clamp(0, 5, Math.abs(velocity) / 400);
            gsap.to(loop, {
              timeScale: (velocity < 0 ? -1 : 1) * (1 + boost),
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: 1, duration: 1.4, ease: "power2.out" });
              },
            });
          },
        });

        gsap.from("[data-companies-head]", {
          autoAlpha: 0,
          y: 20,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label={t("title")}
      className="relative overflow-hidden border-y border-white/[0.06] py-20 sm:py-28"
    >
      <div className="container-x mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <span data-companies-head className="eyebrow">
          {t("eyebrow")}
        </span>
        <h2
          data-companies-head
          className="max-w-md text-2xl font-medium tracking-[-0.02em] text-muted sm:text-right sm:text-3xl"
        >
          {t("title")}
        </h2>
      </div>

      <div className="fade-x relative">
        <div ref={track} className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className={`flex flex-shrink-0 items-center gap-16 pr-16 sm:gap-24 sm:pr-24 ${
                copy === 1 ? "marquee-dup" : ""
              }`}
            >
              {companies.map((company) => (
                <li key={company.name} className="flex h-28 items-center">
                  <Image
                    src={company.logo}
                    alt={copy === 0 ? company.name : ""}
                    width={company.width}
                    height={company.height}
                    draggable={false}
                    style={{ height: company.h, width: "auto" }}
                    className={`${
                      company.opaque ? "logo-opaque" : "logo-mono"
                    } opacity-50 transition-opacity duration-300 hover:opacity-100`}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
