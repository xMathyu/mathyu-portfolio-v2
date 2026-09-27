"use client";

import { useEffect, type RefObject } from "react";

/**
 * Feeds pointer coordinates to every `.spotlight` card inside `ref` as the
 * CSS variables --mx / --my, powering the hover glow defined in globals.css.
 */
export function useSpotlight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const group = ref.current;
    if (!group) return;
    const cards = Array.from(group.querySelectorAll<HTMLElement>(".spotlight"));

    const onMove = (e: PointerEvent) => {
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }
    };

    group.addEventListener("pointermove", onMove);
    return () => group.removeEventListener("pointermove", onMove);
  }, [ref]);
}
