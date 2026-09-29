"use client";

import { gsap, useGSAP, ScrollTrigger, MOTION_OK, FINE_POINTER } from "@/app/lib/gsap";

/**
 * Page-wide motion that reacts to how you scroll and point:
 * - `data-skew="y" | "x"`: media leans with scroll velocity and settles when you stop.
 * - `data-tilt`: cards tilt in 3D toward the pointer (mouse only).
 */
export default function ScrollFx() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const clamp = gsap.utils.clamp(-7, 7);
      const axes = [
        { els: gsap.utils.toArray<HTMLElement>('[data-skew="y"]'), prop: "skewY", sign: -1 },
        { els: gsap.utils.toArray<HTMLElement>('[data-skew="x"]'), prop: "skewX", sign: 1 },
      ].filter((a) => a.els.length);

      const state = { skew: 0 };
      const setters = axes.map((a) => ({ set: gsap.quickSetter(a.els, a.prop, "deg"), sign: a.sign }));
      const apply = () => setters.forEach(({ set, sign }) => set(state.skew * sign));

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / 350);
          if (Math.abs(skew) > Math.abs(state.skew)) {
            state.skew = skew;
            gsap.to(state, { skew: 0, duration: 0.9, ease: "power3", overwrite: true, onUpdate: apply });
          }
        },
      });
      axes.forEach((a) => gsap.set(a.els, { force3D: true }));
    });

    mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
      const cleanups = gsap.utils.toArray<HTMLElement>("[data-tilt]").map((el) => {
        gsap.set(el, { transformPerspective: 900 });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          rx(py * -8);
          ry(px * 10);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => cleanups.forEach((fn) => fn());
    });
  });

  return null;
}
