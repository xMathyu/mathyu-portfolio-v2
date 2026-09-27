import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        // Scroll-pinned storytelling only when there is motion and enough height for it;
        // short screens (landscape phones, tiny phones) get the static stacked layout.
        pin: { raw: "(prefers-reduced-motion: no-preference) and (min-height: 600px)" },
        nopin: { raw: "(prefers-reduced-motion: reduce), (max-height: 599.98px)" },
      },
      colors: {
        ink: "#000000",
        surface: "#0b0b0e",
        fg: "#f5f5f7",
        muted: "#a1a1a6",
        subtle: "#6e6e73",
        live: "#30d158",
        ai: {
          blue: "#0894ff",
          purple: "#c959dd",
          pink: "#ff2e54",
          orange: "#ff9004",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.055em",
      },
      keyframes: {
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "scroll-cue": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 14s linear infinite",
        "scroll-cue": "scroll-cue 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
