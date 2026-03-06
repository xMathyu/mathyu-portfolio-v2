"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  FaCertificate,
  FaTrophy,
  FaGraduationCap,
  FaLanguage,
} from "react-icons/fa";

const certifications = [
  {
    key: "azure",
    icon: "microsoft",
    type: "cert",
  },
  {
    key: "scrum",
    icon: "cert",
    type: "cert",
  },
  {
    key: "izipay",
    icon: "trophy",
    type: "award",
  },
  {
    key: "bcp",
    icon: "trophy",
    type: "award",
  },
];

const education = [{ key: "upc" }, { key: "icpna" }];

const languages = [
  { key: "english", level: 85 },
  { key: "spanish", level: 100 },
  { key: "portuguese", level: 30 },
];

const iconMap: Record<string, React.ReactNode> = {
  microsoft: <FaCertificate className="w-6 h-6" />,
  cert: <FaCertificate className="w-6 h-6" />,
  trophy: <FaTrophy className="w-6 h-6" />,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function AchievementsSection() {
  const t = useTranslations("AchievementsSection");

  return (
    <section
      id="achievements"
      className="relative flex flex-col items-center px-4 py-24 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-400/10 rounded-full blur-[140px]" />

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
      </motion.div>

      <div className="w-full max-w-6xl space-y-16">
        {/* Certifications & Awards */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl font-bold text-foreground mb-8 flex items-center gap-3"
          >
            <FaCertificate className="text-accent-400" />
            {t("certsTitle")}
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.key}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 hover:glow transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      cert.type === "award"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-accent-500/10 text-accent-400"
                    }`}
                  >
                    {iconMap[cert.icon]}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-accent-300 transition-colors">
                      {t(`certs.${cert.key}.name`)}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {t(`certs.${cert.key}.issuer`)}
                    </p>
                    {cert.type === "award" && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        <FaTrophy className="w-3 h-3" />
                        {t("winner")}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl font-bold text-foreground mb-8 flex items-center gap-3"
          >
            <FaGraduationCap className="text-accent-400" />
            {t("educationTitle")}
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {education.map((edu, i) => (
              <motion.div
                key={edu.key}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 hover:glow transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <FaGraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      {t(`education.${edu.key}.degree`)}
                    </h4>
                    <p className="text-sm text-accent-400">
                      {t(`education.${edu.key}.institution`)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {t(`education.${edu.key}.period`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl font-bold text-foreground mb-8 flex items-center gap-3"
          >
            <FaLanguage className="text-accent-400" />
            {t("languagesTitle")}
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {languages.map((lang, i) => (
              <motion.div
                key={lang.key}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 hover:glow transition-all duration-300"
              >
                <h4 className="font-bold text-foreground mb-2">
                  {t(`languages.${lang.key}.name`)}
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  {t(`languages.${lang.key}.level`)}
                </p>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-500 to-purple-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
