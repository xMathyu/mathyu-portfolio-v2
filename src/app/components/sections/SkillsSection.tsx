"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import {
  SKILLS,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SkillCategoryFilter,
  SkillLevelFilter,
  getFilteredSkills,
} from "../skillsData";

const SkillsSphere = dynamic(() => import("../three/SkillsSphere"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] sm:h-[450px] md:h-[600px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface FilterChipProps {
  active: boolean;
  color: string;
  label: string;
  onClick: () => void;
}

function FilterChip({ active, color, label, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-200 ${
        active
          ? "border-transparent text-white"
          : "border-white/10 bg-slate-950/30 text-slate-400 hover:border-white/20 hover:text-slate-200"
      }`}
      style={
        active
          ? {
              color,
              borderColor: `${color}66`,
              background: `linear-gradient(180deg, ${color}26 0%, rgba(15, 23, 42, 0.72) 100%)`,
              boxShadow: `0 0 0 1px ${color}33 inset, 0 0 24px ${color}18`,
            }
          : undefined
      }
    >
      <span className="inline-flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
    </button>
  );
}

export default function SkillsSection() {
  const t = useTranslations("SkillsSection");
  const [activeCategory, setActiveCategory] =
    useState<SkillCategoryFilter>("all");
  const [activeLevel, setActiveLevel] = useState<SkillLevelFilter>("all");

  const filteredSkillsCount = useMemo(
    () =>
      getFilteredSkills({
        category: activeCategory,
        level: activeLevel,
      }).length,
    [activeCategory, activeLevel],
  );

  const handleCategoryFilter = (category: SkillCategoryFilter) => {
    if (category === "all") {
      setActiveCategory("all");
      return;
    }

    setActiveCategory((current) =>
      current === category ? "all" : category,
    );
  };

  const handleLevelFilter = (level: SkillLevelFilter) => {
    if (level === "all") {
      setActiveLevel("all");
      return;
    }

    setActiveLevel((current) => (current === level ? "all" : level));
  };

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
        <SkillsSphere
          activeCategory={activeCategory}
          activeLevel={activeLevel}
          emptyLabel={t("empty")}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-6 flex flex-col items-center gap-3"
      >
        <span className="text-[11px] tracking-[0.24em] uppercase text-slate-500">
          {t("filterByLevel")}
        </span>
        <div className="flex flex-wrap justify-center gap-3">
          <FilterChip
            active={activeLevel === "all"}
            color="#cbd5e1"
            label={t("all")}
            onClick={() => handleLevelFilter("all")}
          />
          {SKILL_LEVELS.map((level) => (
            <FilterChip
              key={level.key}
              active={activeLevel === level.key}
              color={level.color}
              label={t(`levels.${level.key}`)}
              onClick={() => handleLevelFilter(level.key)}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-6 flex max-w-3xl flex-col items-center gap-3"
      >
        <span className="text-[11px] tracking-[0.24em] uppercase text-slate-500">
          {t("filterByCategory")}
        </span>
        <div className="flex flex-wrap justify-center gap-3">
          <FilterChip
            active={activeCategory === "all"}
            color="#cbd5e1"
            label={t("all")}
            onClick={() => handleCategoryFilter("all")}
          />
          {SKILL_CATEGORIES.map((category) => (
            <FilterChip
              key={category.key}
              active={activeCategory === category.key}
              color={category.color}
              label={t(`categories.${category.key}`)}
              onClick={() => handleCategoryFilter(category.key)}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500">
          {t("showing", {
            count: filteredSkillsCount,
            total: SKILLS.length,
          })}
        </p>
      </motion.div>
    </section>
  );
}
