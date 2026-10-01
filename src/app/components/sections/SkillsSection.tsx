"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { gsap, useGSAP, MOTION_OK } from "@/app/lib/gsap";
import SectionHeading from "../ui/SectionHeading";
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
    <div className="flex h-[21.875rem] max-h-[85svh] w-full items-center justify-center sm:h-[28rem] md:h-[37.5rem]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-fg/60 border-t-transparent" />
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
          : "border-white/10 bg-white/[0.02] text-muted hover:border-white/20 hover:text-fg"
      }`}
      style={
        active
          ? {
              color,
              borderColor: `${color}66`,
              background: `linear-gradient(180deg, ${color}26 0%, rgba(10, 10, 12, 0.8) 100%)`,
              boxShadow: `0 0 0 1px ${color}33 inset, 0 0 24px ${color}18`,
            }
          : undefined
      }
    >
      <span className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
    </button>
  );
}

export default function SkillsSection() {
  const t = useTranslations("SkillsSection");
  const root = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<SkillCategoryFilter>("all");
  const [activeLevel, setActiveLevel] = useState<SkillLevelFilter>("all");

  const filteredSkillsCount = useMemo(
    () => getFilteredSkills({ category: activeCategory, level: activeLevel }).length,
    [activeCategory, activeLevel],
  );

  const handleCategoryFilter = (category: SkillCategoryFilter) => {
    if (category === "all") {
      setActiveCategory("all");
      return;
    }
    setActiveCategory((current) => (current === category ? "all" : category));
  };

  const handleLevelFilter = (level: SkillLevelFilter) => {
    if (level === "all") {
      setActiveLevel("all");
      return;
    }
    setActiveLevel((current) => (current === level ? "all" : level));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Keep the WebGL canvas composited (never visibility:hidden) so its first
        // appearance doesn't make the GPU set everything up mid-scroll
        gsap.from("[data-sphere]", {
          opacity: 0.001,
          scale: 0.8,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-sphere]", start: "top 80%", once: true },
        });
        gsap.from("[data-filters]", {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-filters]", start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" className="relative overflow-hidden py-28 sm:py-40">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
          index="05"
            eyebrow={t("eyebrow")}
            title={t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
            description={t("description")}
          />

          <div className="mt-12 flex flex-col gap-8">
            <div data-filters className="flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-subtle">
                {t("filterByLevel")}
              </span>
              <div className="flex flex-wrap gap-2.5">
                <FilterChip
                  active={activeLevel === "all"}
                  color="#e5e5ea"
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
            </div>

            <div data-filters className="flex flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-subtle">
                {t("filterByCategory")}
              </span>
              <div className="flex flex-wrap gap-2.5">
                <FilterChip
                  active={activeCategory === "all"}
                  color="#e5e5ea"
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
              <p className="mt-2 text-xs text-subtle">
                {t("showing", { count: filteredSkillsCount, total: SKILLS.length })}
              </p>
            </div>
          </div>
        </div>

        <div data-sphere data-cursor={t("drag")} className="relative lg:col-span-7">
          <SkillsSphere
            activeCategory={activeCategory}
            activeLevel={activeLevel}
            emptyLabel={t("empty")}
            labels={{
              levels: Object.fromEntries(SKILL_LEVELS.map((l) => [l.key, t(`levels.${l.key}`)])),
              categories: Object.fromEntries(SKILL_CATEGORIES.map((c) => [c.key, t(`categories.${c.key}`)])),
            }}
          />
        </div>
      </div>
    </section>
  );
}
