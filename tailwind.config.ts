import type { Config } from "tailwindcss";

export default {
  // Habilita modo oscuro mediante la clase "dark"
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores para el modo claro (se utilizarán en conjunto con las variables CSS)
        background: "#F8FAFC", // Un gris muy claro (equivalente a slate-50)
        foreground: "#1F2937", // Un gris oscuro (equivalente a gray-800)
        // Paleta "brand": tonos de verde elegantes y profundos
        brand: {
          50: "#E3F9E5",
          100: "#C1EAC5",
          200: "#A3D9A5",
          300: "#7BC47F",
          400: "#57AE5B",
          500: "#3F9142", // Verde principal (ideal para botones y acentos)
          600: "#2F8132",
          700: "#207227",
          800: "#0E5814",
          900: "#05400A",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
