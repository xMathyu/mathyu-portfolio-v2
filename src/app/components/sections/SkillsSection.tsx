"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const SkillsSphere = dynamic(() => import("../three/SkillsSphere"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] sm:h-[450px] md:h-[600px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const categories = [
  { key: "backend", color: "#818cf8" },
  { key: "frontend", color: "#c084fc" },
  { key: "language", color: "#e879f9" },
  { key: "cloud", color: "#38bdf8" },
  { key: "devops", color: "#34d399" },
  { key: "database", color: "#fbbf24" },
  { key: "testing", color: "#f87171" },
  { key: "tool", color: "#fb923c" },
];

const levelLegend = [
  { key: "expert", color: "#818cf8" },
  { key: "advanced", color: "#c084fc" },
  { key: "intermediate", color: "#e879f9" },
];

export default function SkillsSection() {
  const t = useTranslations("SkillsSection");

  return (
    <section
      id="skills"
      className="relative flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-accent-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 space-y-3"
      >
        <span className="text-sm tracking-[0.3em] uppercase text-accent-400 font-medium">
          {t("subtitle")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient">
          {t("title")}
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
          {t("description")}
        </p>
      </motion.div>

      {/* 3D Skill Sphere */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-4xl relative"
      >
        <SkillsSphere />
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mt-4"
      >
        {levelLegend.map((level) => (
          <div key={level.key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: level.color }}
            />
            <span className="text-xs text-slate-400 capitalize">
              {t(`levels.${level.key}`)}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Category tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl"
      >
        {categories.map((cat) => (
          <span
            key={cat.key}
            className="text-xs px-3 py-1.5 rounded-full glass border border-white/5"
            style={{ color: cat.color }}
          >
            {t(`categories.${cat.key}`)}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
