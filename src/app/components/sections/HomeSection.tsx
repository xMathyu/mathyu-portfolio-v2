"use client";

import { useTypewriter, Cursor } from "react-simple-typewriter";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function HomeSection() {
  const t = useTranslations("HomeSection");

  // Obtenemos el array de palabras desde la traducción
  const typewriterWords = useMemo(() => {
    const wordsStr = t("typewriterWords");
    return wordsStr.split("|");
  }, [t]);

  const [text] = useTypewriter({
    words: typewriterWords,
    loop: 0, // ciclo infinito
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 2000,
  });

  return (
    <section
      id="home"
      className="relative flex flex-col md:flex-row items-center justify-center gap-1 md:gap-12 min-h-screen bg-background dark:bg-foreground transition-colors overflow-hidden px-4"
    >
      {/* Fondo decorativo degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-transparent to-brand-100 dark:from-brand-900 dark:to-brand-800 opacity-40"></div>

      {/* Columna de la imagen (orden 1 en móvil, 2 en md) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 order-1 md:order-2 flex items-center justify-center mb-8 md:mb-0"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-64 h-64 sm:w-72 sm:h-72 bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-xl border-4 border-brand-500 dark:border-brand-200"
        >
          <Image
            src="/images/mathyu.jpg"
            alt="Foto de Mathyu Cardozo"
            fill
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </motion.div>

      {/* Columna del texto (orden 2 en móvil, 1 en md) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 order-2 md:order-1 flex flex-col items-center justify-center space-y-4 md:space-y-6 max-w-lg text-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-500 dark:text-brand-200 transition-colors">
          {t("greeting")}
        </h1>

        <p className="text-xl sm:text-2xl text-foreground dark:text-background transition-colors">
          <span>{text}</span>
          <Cursor cursorColor="#10B981" />
        </p>

        <p className="text-lg sm:text-xl text-foreground dark:text-background transition-colors">
          {t("welcome")}
        </p>

        {/* Botones de llamada a la acción */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="#about"
            className="px-8 py-3 bg-brand-500 dark:bg-brand-200 text-white dark:text-brand-800 font-semibold rounded-full shadow-md hover:bg-brand-600 dark:hover:bg-brand-300 transition-colors"
          >
            {t("cta.about")}
          </a>
          <a
            href="#contact"
            className="px-8 py-3 bg-brand-500 dark:bg-brand-200 text-white dark:text-brand-800 font-semibold rounded-full shadow-md hover:bg-brand-600 dark:hover:bg-brand-300 transition-colors"
          >
            {t("cta.contact")}
          </a>
        </div>
      </motion.div>

      {/* Indicador para bajar con animación, clickeable y centrado */}
      <a href="#about" className="cursor-pointer block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-4 inset-x-0 text-center text-sm text-foreground dark:text-background transition-colors flex flex-col items-center"
        >
          <span>{t("scrollDown")}</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-2"
          >
            <ChevronDownIcon className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </a>
    </section>
  );
}
