"use client";

import { useRef } from "react";
import { gsap, useGSAP, FINE_POINTER } from "@/app/lib/gsap";

/**
 * Soft follower ring for mouse users. Grows over links/buttons and shows a
 * label over elements with `data-cursor="Label"`.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ring.current;
    const text = label.current;
    if (!el || !text || !window.matchMedia(FINE_POINTER).matches) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    let shown = false;
    let state = "";

    const setState = (next: string, labelText = "") => {
      if (next === state) return;
      state = next;
      text.textContent = labelText;
      el.dataset.state = next;
      const size = next === "label" ? 88 : next === "link" ? 48 : 12;
      gsap.to(el, { width: size, height: size, duration: 0.4, ease: "power3.out" });
      gsap.to(text, { autoAlpha: next === "label" ? 1 : 0, duration: 0.25 });
    };

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']",
      );
      if (!target) return setState("");
      const labelText = target.dataset.cursor;
      if (labelText) setState("label", labelText);
      else setState("link");
    };

    const onLeave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      shown = false;
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  });

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-3 w-3 items-center justify-center rounded-full bg-white mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:flex data-[state=label]:mix-blend-normal data-[state=link]:border data-[state=link]:border-white data-[state=link]:bg-transparent"
    >
      <span
        ref={label}
        className="invisible whitespace-nowrap text-[12px] font-medium text-ink opacity-0"
      />
    </div>
  );
}
