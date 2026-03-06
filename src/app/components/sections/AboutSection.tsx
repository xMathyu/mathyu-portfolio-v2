"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { FaLinkedin, FaGithub, FaDownload } from "react-icons/fa";
import { useTranslations } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutSection() {
  const t = useTranslations("AboutSection");

  return (
    <section
      id="about"
      className="relative flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-6xl w-full">
        {/* Image with tilt effect */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 flex items-center justify-center"
        >
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="#818cf8"
            glarePosition="all"
            scale={1.02}
            transitionSpeed={250}
            className="rounded-2xl overflow-hidden glow"
          >
            <div className="relative">
              <Image
                src="/images/hackaton.png"
                alt={t("altImage")}
                width={500}
                height={350}
                className="object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </Tilt>
        </motion.div>

        {/* Text content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex flex-col items-start text-left space-y-5"
        >
          <motion.div variants={childVariants} className="space-y-2">
            <span className="text-sm tracking-[0.3em] uppercase text-accent-400 font-medium">
              {t("subtitle")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient">
              {t("title")}
            </h2>
          </motion.div>

          <motion.p
            variants={childVariants}
            className="text-base sm:text-lg text-slate-300 leading-relaxed"
            style={{ textAlign: "justify" }}
          >
            {t("paragraph1")}
          </motion.p>
          <motion.p
            variants={childVariants}
            className="text-base sm:text-lg text-slate-400 leading-relaxed"
            style={{ textAlign: "justify" }}
          >
            {t("paragraph2")}
          </motion.p>

          {/* Social & CV buttons */}
          <motion.div
            variants={childVariants}
            className="mt-4 flex flex-wrap gap-3"
          >
            <a
              href="https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-accent-300 hover:text-white hover:border-accent-400/40 transition-all text-sm font-medium"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-4 h-4" />
              {t("social.linkedin")}
            </a>
            <a
              href="https://github.com/xMathyu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-accent-300 hover:text-white hover:border-accent-400/40 transition-all text-sm font-medium"
              aria-label="GitHub"
            >
              <FaGithub className="w-4 h-4" />
              {t("social.github")}
            </a>
            <a
              href="/mathyu-cv-es.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-500 to-purple-500 text-white rounded-xl shadow-lg text-sm font-medium hover:shadow-accent-500/25 transition-all"
              aria-label="Download CV"
            >
              <FaDownload className="w-4 h-4" />
              {t("social.cv")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
