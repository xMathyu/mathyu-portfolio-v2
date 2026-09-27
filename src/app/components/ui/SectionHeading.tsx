"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/app/lib/gsap";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Eyebrow + display title whose lines rise out of a mask on scroll. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
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
              yPercent: 110,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: trigger,
            }),
        });

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
      className={`flex flex-col gap-6 ${centered ? "items-center text-center" : "items-start"} ${className}`}
    >
      <span data-fade className="eyebrow">
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
