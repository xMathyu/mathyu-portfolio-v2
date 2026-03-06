"use client";

import { useTypewriter, Cursor } from "react-simple-typewriter";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function HomeSection() {
  const t = useTranslations("HomeSection");

  const typewriterWords = useMemo(() => {
    const wordsStr = t("typewriterWords");
    return wordsStr.split("|");
  }, [t]);

  const [text] = useTypewriter({
    words: typewriterWords,
    loop: 0,
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 2000,
  });

  return (
    <section
      id="home"
      className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 min-h-screen overflow-hidden px-4"
    >
      {/* Ambient gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-500/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 rounded-full blur-[160px]" />

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 order-1 md:order-2 flex items-center justify-center mb-8 md:mb-0"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-400 via-purple-400 to-pink-400 blur-xl opacity-40 scale-110" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-accent-400/30 shadow-2xl"
          >
            <Image
              src="/images/mathyu.jpg"
              alt="Mathyu Cardozo"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 order-2 md:order-1 flex flex-col items-center md:items-start justify-center space-y-5 max-w-xl text-center md:text-left"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm tracking-[0.3em] uppercase text-accent-400 font-medium"
        >
          {t("subtitle")}
        </motion.span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
          <span className="text-foreground">{t("greetingPrefix")}</span>
          <br />
          <span className="text-gradient glow-text">{t("name")}</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-300 h-8">
          <span>{text}</span>
          <Cursor cursorColor="#818cf8" />
        </p>

        <p className="text-base sm:text-lg text-slate-400 max-w-md">
          {t("welcome")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <motion.a
            href="#about"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-3 bg-gradient-to-r from-accent-500 to-purple-500 text-white font-semibold rounded-full shadow-lg overflow-hidden transition-all"
          >
            <span className="relative z-10">{t("cta.about")}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 glass rounded-full text-accent-300 font-semibold hover:text-white hover:border-accent-400/50 transition-all animate-border-glow"
          >
            {t("cta.contact")}
          </motion.a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <a href="#about" className="cursor-pointer block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 inset-x-0 text-center text-sm text-slate-500 flex flex-col items-center"
        >
          <span className="tracking-widest uppercase text-xs">
            {t("scrollDown")}
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-2"
          >
            <ChevronDownIcon className="w-5 h-5 text-accent-400" />
          </motion.div>
        </motion.div>
      </a>
    </section>
  );
}
