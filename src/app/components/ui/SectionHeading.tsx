"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/app/lib/gsap";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Chapter number drawn huge behind the title, e.g. "04" */
  index?: string;
}

/** Eyebrow + display title whose lines rise out of a mask on scroll. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
  index,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        if (!root) return;
        const trigger = { trigger: root, start: "top 85%", once: true };

        SplitText.create(root.querySelector("[data-heading]"), {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              rotation: 4,
              transformOrigin: "0% 100%",
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: trigger,
            }),
        });

        // Eyebrow decodes like a terminal readout
        gsap.to(root.querySelector("[data-eyebrow]"), {
          duration: 1.2,
          scrambleText: { text: "{original}", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", speed: 0.6 },
          scrollTrigger: trigger,
        });

        const number = root.querySelector("[data-heading-index]");
        if (number) {
          gsap.fromTo(
            number,
            { yPercent: 35, autoAlpha: 0 },
            {
              yPercent: -35,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        gsap.from(root.querySelectorAll("[data-fade]"), {
          autoAlpha: 0,
          y: 18,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.15,
          scrollTrigger: trigger,
        });
      });
    },
    { scope: ref },
  );

  const centered = align === "center";

  return (
    <div
      ref={ref}
      className={`relative isolate flex flex-col gap-6 ${centered ? "items-center text-center" : "items-start"} ${className}`}
    >
      {index && (
        <span
          data-heading-index
          aria-hidden="true"
          className="pointer-events-none absolute -top-[0.3em] right-0 -z-10 select-none text-[clamp(8rem,24vw,24rem)] font-semibold leading-none tracking-tightest text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.09)]"
        >
          {index}
        </span>
      )}
      <span data-fade data-eyebrow className="eyebrow">
        {eyebrow}
      </span>
      <h2
        data-heading
        className="max-w-[18ch] text-[clamp(2.5rem,6.4vw,6rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-fg"
      >
        {title}
      </h2>
      {description && (
        <p
          data-fade
          className={`max-w-xl text-lg leading-relaxed text-muted ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
