"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/app/lib/gsap";

export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.3,
        // Pinned sections add scroll length, so measure after them
        refreshPriority: -1,
      },
    });
  });

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="bg-ai pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0"
    />
  );
}
