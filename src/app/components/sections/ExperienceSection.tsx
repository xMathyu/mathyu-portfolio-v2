"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Experience {
  id: string;
  positionKey: string;
  companyKey: string;
  locationKey: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  descriptionKey: string;
  achievementKeys: string[];
  technologies: string[];
  companyLogo: string;
}

const experiences: Experience[] = [
  {
    id: "exp-0",
    positionKey: "entel.position",
    companyKey: "entel.company",
    locationKey: "entel.location",
    startDate: "2025-11",
    endDate: "",
    isCurrent: true,
    descriptionKey: "entel.description",
    achievementKeys: [
      "entel.a1",
      "entel.a2",
      "entel.a3",
      "entel.a4",
      "entel.a5",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "Whisper X",
      "AWS",
      "Lambda",
      "SQS",
      "OpenAI",
      "Next.js",
      "React",
      "ML",
      "NLP",
    ],
    companyLogo: "/logos/entel-logo.png",
  },
  {
    id: "exp-1",
    positionKey: "t309.position",
    companyKey: "t309.company",
    locationKey: "t309.location",
    startDate: "2025-04",
    endDate: "2025-11",
    isCurrent: false,
    descriptionKey: "t309.description",
    achievementKeys: ["t309.a1", "t309.a2", "t309.a3", "t309.a4", "t309.a5"],
    technologies: [
      "Next.js",
      "AI",
      "Java",
      "Kotlin",
      "Spring Boot",
      "AWS",
      "ML",
      "Figma",
      "React",
      "TypeScript",
    ],
    companyLogo: "/logos/309.png",
  },
  {
    id: "exp-2",
    positionKey: "encora.position",
    companyKey: "encora.company",
    locationKey: "encora.location",
    startDate: "2023-10",
    endDate: "2025-04",
    isCurrent: false,
    descriptionKey: "encora.description",
    achievementKeys: ["encora.a1", "encora.a2"],
    technologies: [
      "Java",
      "Spring Boot",
      "WebFlux",
      "RxJava",
      "Azure",
      "AWS",
      "Kubernetes",
      "Angular",
      "Next.js",
    ],
    companyLogo: "/logos/encora.png",
  },
  {
    id: "exp-3",
    positionKey: "serverli.position",
    companyKey: "serverli.company",
    locationKey: "serverli.location",
    startDate: "2024-06",
    endDate: "2024-12",
    isCurrent: false,
    descriptionKey: "serverli.description",
    achievementKeys: ["serverli.a1", "serverli.a2", "serverli.a3"],
    technologies: [
      "Next.js",
      "NestJS",
      ".Net",
      "C#",
      "Python",
      "Azure",
      "Kubernetes",
      "TypeScript",
    ],
    companyLogo: "/logos/serverli.png",
  },
  {
    id: "exp-4",
    positionKey: "mdp.position",
    companyKey: "mdp.company",
    locationKey: "mdp.location",
    startDate: "2020-11",
    endDate: "2023-10",
    isCurrent: false,
    descriptionKey: "mdp.description",
    achievementKeys: [
      "mdp.a1",
      "mdp.a2",
      "mdp.a3",
      "mdp.a4",
      "mdp.a5",
      "mdp.a6",
    ],
    technologies: [
      "Java",
      "Spring Boot",
      "Node.js",
      "Angular",
      "React",
      "Python",
      "OpenAI",
      "AWS",
      "Azure",
      "Docker",
    ],
    companyLogo: "/logos/mdp.png",
  },
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const t = useTranslations("ExperienceSection");
  const [isOpen, setIsOpen] = useState(index === 0);
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`relative flex items-start w-full ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col md:gap-8`}
    >
      {/* Timeline dot */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 z-20">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`w-4 h-4 rounded-full border-2 ${
            exp.isCurrent
              ? "bg-accent-400 border-accent-400 shadow-lg shadow-accent-400/50"
              : "bg-background border-accent-500/50"
          }`}
        />
        {exp.isCurrent && (
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-4 h-4 rounded-full bg-accent-400"
          />
        )}
      </div>

      {/* Date label */}
      <div
        className={`hidden md:flex w-1/2 ${
          isLeft ? "justify-end pr-12" : "justify-start pl-12"
        } pt-0`}
      >
        <motion.span
          initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-sm text-accent-400 font-mono whitespace-nowrap"
        >
          {formatDate(exp.startDate)} —{" "}
          {exp.isCurrent ? t("present") : formatDate(exp.endDate)}
        </motion.span>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: index * 0.1 }}
        className={`w-[calc(100%-3.5rem)] md:w-1/2 ml-14 md:ml-0 ${
          isLeft ? "md:pl-12" : "md:pr-12"
        }`}
      >
        <div
          className="glass rounded-2xl p-4 sm:p-6 hover:glow transition-all duration-500 cursor-pointer group"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl glass-light flex items-center justify-center overflow-hidden">
              <Image
                src={exp.companyLogo}
                alt={t(exp.companyKey)}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-accent-300 transition-colors">
                    {t(exp.positionKey)}
                  </h3>
                  <p className="text-sm text-accent-400 font-medium">
                    {t(exp.companyKey)}
                  </p>
                </div>
                {exp.isCurrent && (
                  <span className="flex-shrink-0 px-2.5 py-1 text-xs font-medium bg-accent-500/20 text-accent-300 rounded-full border border-accent-500/30">
                    {t("current")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="w-3 h-3" />
                  {t(exp.locationKey)}
                </span>
                <span className="md:hidden">
                  {formatDate(exp.startDate)} —{" "}
                  {exp.isCurrent ? t("present") : formatDate(exp.endDate)}
                </span>
              </div>
            </div>
            <button className="flex-shrink-0 text-slate-500 hover:text-accent-400 transition-colors mt-1">
              {isOpen ? (
                <FaChevronUp className="w-4 h-4" />
              ) : (
                <FaChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            {t(exp.descriptionKey)}
          </p>

          {/* Expandable content */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Achievements */}
                <div className="mt-4 space-y-2">
                  {exp.achievementKeys.map((key, i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="text-accent-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0" />
                      <span>{t(key)}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-300 border border-accent-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function ExperienceSection() {
  const t = useTranslations("ExperienceSection");

  return (
    <section
      id="experience"
      className="relative flex flex-col items-center px-4 py-24 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent-500/8 rounded-full blur-[160px]" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-purple-500/8 rounded-full blur-[160px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-3"
      >
        <span className="text-sm tracking-[0.3em] uppercase text-accent-400 font-medium">
          {t("subtitle")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient">
          {t("title")}
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          {t("description")}
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="w-full max-w-5xl relative">
        {/* Timeline line */}
        <div className="absolute left-[22px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-accent-500/50 via-purple-500/30 to-transparent" />

        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
