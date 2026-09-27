"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    // Recalculate trigger positions once webfonts have settled
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return null;
}

/** Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, anchors: true, lerp: 0.1 }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
