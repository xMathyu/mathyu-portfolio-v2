"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaExternalLinkAlt } from "react-icons/fa";

const projects = [
  {
    id: 1,
    title: "Fa Meng Chuen",
    description: "Escuela de Kung Fu",
    image: "/images/proyecto1.png",
    url: "https://famengchuen.com/",
    tags: ["Next.js", "React", "Tailwind"],
  },
  {
    id: 2,
    title: "Examen docente",
    description: "Sistema de exámenes para docentes",
    image: "/images/proyecto3.png",
    url: "https://docent-exam-xmathyus-projects.vercel.app/",
    tags: ["React", "TypeScript", "Vercel"],
  },
  {
    id: 3,
    title: "Parco di colori",
    description: "Parque botánico y de mariposas",
    image: "/images/proyecto2.png",
    url: "http://parcodeicolori.it/",
    inProgress: false,
    tags: ["Next.js", "AI", "Design"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

export default function ProjectsSection() {
  const t = useTranslations("ProjectsSection");

  return (
    <section
      id="projects"
      className="relative flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-pink-400/8 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-accent-500/8 rounded-full blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-3"
      >
        <span className="text-sm tracking-[0.3em] uppercase text-accent-400 font-medium">
          {t("sectionSubtitle")}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient">
          {t("sectionTitle")}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-6xl">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group glass rounded-2xl overflow-hidden hover:glow transition-all duration-300"
          >
            {/* Image with overlay */}
            {project.image && (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                {project.inProgress && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-accent-500/80 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                    {t("inProgress")}
                  </div>
                )}
              </div>
            )}

            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-foreground group-hover:text-accent-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-slate-400">{project.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-300 border border-accent-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Link */}
              {!project.inProgress && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 font-medium transition-colors mt-2"
                >
                  {t("viewSite")}
                  <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
