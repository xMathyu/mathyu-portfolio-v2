"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
// Keep in sync with the `pin` screen in tailwind.config.ts
export const PIN_OK = `${MOTION_OK} and (min-height: 600px)`;
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
