export const SKILL_CATEGORIES = [
  { key: "backend", color: "#818cf8" },
  { key: "frontend", color: "#c084fc" },
  { key: "language", color: "#e879f9" },
  { key: "cloud", color: "#38bdf8" },
  { key: "devops", color: "#34d399" },
  { key: "database", color: "#fbbf24" },
  { key: "testing", color: "#f87171" },
  { key: "tool", color: "#fb923c" },
] as const;

export const SKILL_LEVELS = [
  { key: "expert", color: "#e2e8f0" },
  { key: "advanced", color: "#94a3b8" },
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]["key"];
export type SkillLevel = (typeof SKILL_LEVELS)[number]["key"];

export interface SkillNode {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
}

export type SkillCategoryFilter = SkillCategory | "all";
export type SkillLevelFilter = SkillLevel | "all";

export const SKILLS: SkillNode[] = [
  { name: "Java", level: "expert", category: "backend" },
  { name: "Spring Boot", level: "expert", category: "backend" },
  { name: "Next.js", level: "expert", category: "frontend" },
  { name: "React", level: "expert", category: "frontend" },
  { name: "JavaScript", level: "expert", category: "language" },
  { name: "GitHub", level: "expert", category: "devops" },
  { name: "Node.js", level: "advanced", category: "backend" },
  { name: "NestJS", level: "advanced", category: "backend" },
  { name: "TypeScript", level: "advanced", category: "language" },
  { name: "Python", level: "advanced", category: "language" },
  { name: "Angular", level: "advanced", category: "frontend" },
  { name: "Tailwind", level: "advanced", category: "frontend" },
  { name: "Azure", level: "advanced", category: "cloud" },
  { name: "AWS", level: "advanced", category: "cloud" },
  { name: "Docker", level: "advanced", category: "devops" },
  { name: "PostgreSQL", level: "advanced", category: "database" },
  { name: "Redis", level: "advanced", category: "database" },
  { name: "OpenAI API", level: "advanced", category: "tool" },
  { name: "Kotlin", level: "advanced", category: "language" },
  { name: "WebFlux", level: "advanced", category: "backend" },
  { name: "Flask", level: "advanced", category: "backend" },
  { name: "Jest", level: "advanced", category: "testing" },
  { name: "JUnit", level: "advanced", category: "testing" },
  { name: ".NET", level: "advanced", category: "backend" },
  { name: "Kubernetes", level: "advanced", category: "devops" },
  { name: "Terraform", level: "advanced", category: "devops" },
  { name: "GCP", level: "advanced", category: "cloud" },
  { name: "MongoDB", level: "advanced", category: "database" },
  { name: "Figma", level: "advanced", category: "tool" },
  { name: "ML", level: "advanced", category: "tool" },
  { name: "C#", level: "advanced", category: "language" },
];

export const CATEGORY_COLORS = Object.fromEntries(
  SKILL_CATEGORIES.map((category) => [category.key, category.color]),
) as Record<SkillCategory, string>;

export const LEVEL_SIZES: Record<SkillLevel, number> = {
  expert: 16,
  advanced: 13,
};

export function getFilteredSkills(
  filters: {
    category: SkillCategoryFilter;
    level: SkillLevelFilter;
  },
  source: SkillNode[] = SKILLS,
) {
  return source.filter((skill) => {
    const matchesCategory =
      filters.category === "all" || skill.category === filters.category;
    const matchesLevel =
      filters.level === "all" || skill.level === filters.level;

    return matchesCategory && matchesLevel;
  });
}