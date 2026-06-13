"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from "react-icons/fa";

const projects = [
  {
    id: 1,
    title: "Monyx",
    description: "AI Finance app",
    image: "/images/monyx.png",
    url: "https://monyx.vercel.app/",
    tags: ["Next.js", "TypeScript", "Firebase", "AI"],
  },
  {
    id: 2,
    title: "Calarm: Smart Alarms",
    description: "Smart alarms iOS app powered by Apple Intelligence",
    image: "/images/calarm.png",
    url: "https://apps.apple.com/pe/app/calarm-smart-alarms/id6772419323?l=en-GB",
    tags: ["iOS", "Swift", "Apple Intelligence", "AI"],
  },
  {
    id: 3,
    title: "Fa Meng Chuen",
    description: "Escuela de Kung Fu",
    image: "/images/proyecto1.png",
    url: "https://famengchuen.com/",
    tags: ["Next.js", "React", "Tailwind"],
  },
  {
    id: 4,
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(1);

  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return track?.clientWidth ?? 1;
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;
    return second.offsetLeft - first.offsetLeft;
  }, []);

  const updateCarousel = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStep();
    const perView = Math.max(1, Math.round(track.clientWidth / step));
    const count = Math.max(1, projects.length - perView + 1);
    setSnapCount(count);
    setActiveIndex(
      Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / step)))
    );
  }, [getStep]);

  useEffect(() => {
    updateCarousel();
    window.addEventListener("resize", updateCarousel);
    return () => window.removeEventListener("resize", updateCarousel);
  }, [updateCarousel]);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * getStep(), behavior: "smooth" });
  };

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

      <div className="relative w-full max-w-6xl">
        <div
          ref={trackRef}
          onScroll={updateCarousel}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-8 -my-8"
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              custom={i % 3}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group glass rounded-2xl overflow-hidden hover:glow transition-all duration-300"
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

        {/* Arrows */}
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous project"
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full glass-light text-accent-300 hover:text-white hover:border-accent-400/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex >= snapCount - 1}
          aria-label="Next project"
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full glass-light text-accent-300 hover:text-white hover:border-accent-400/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots */}
      {snapCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to project ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-accent-400"
                  : "w-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
