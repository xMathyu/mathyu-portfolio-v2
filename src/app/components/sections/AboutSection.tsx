"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import * as HoverCard from "@radix-ui/react-hover-card";
import { FaLinkedin, FaGithub, FaDownload } from "react-icons/fa";

// Variantes para animar el contenedor y sus hijos
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.3 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex flex-col items-center justify-center bg-background dark:bg-foreground transition-colors px-4 py-16 overflow-hidden"
    >
      {/* Contenedor principal: En md se muestra en fila, en móvil en columna */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-5xl">
        {/* Ilustración interactiva con efecto Tilt (foto a la izquierda) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: -50 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full md:w-1/2 flex items-center justify-center"
        >
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.2}
            glareColor="white"
            glarePosition="all"
            scale={1.02}
            transitionSpeed={250}
            className="rounded-lg overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/hackaton.png"
              alt="Acerca de mí"
              width={500}
              height={350}
              className="object-cover"
            />
          </Tilt>
        </motion.div>

        {/* Contenedor del texto (foto a la derecha) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 50 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full md:w-1/2 flex flex-col items-start text-left space-y-3"
        >
          {/* Título con HoverCard de Radix UI */}
          <HoverCard.Root>
            <HoverCard.Trigger asChild>
              <motion.h2
                variants={childVariants}
                className="text-3xl sm:text-4xl font-bold mb-4 text-brand-500 dark:text-brand-200 border-b-4 border-brand-500 dark:border-brand-200 pb-2 inline-block cursor-help"
              >
                Acerca de mí
              </motion.h2>
            </HoverCard.Trigger>
            <HoverCard.Content
              side="bottom"
              align="center"
              className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg z-50"
            >
              <p className="text-sm text-gray-900 dark:text-gray-100">
                Descubre mi pasión por la tecnología y la innovación.
              </p>
            </HoverCard.Content>
          </HoverCard.Root>

          {/* Contenedor del texto */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-2 sm:space-y-3 text-base sm:text-lg text-gray-900 dark:text-gray-100"
          >
            <motion.p
              variants={childVariants}
              className="leading-relaxed"
              style={{ textAlign: "justify" }}
            >
              Fusiono creatividad y tecnología para crear experiencias digitales
              impactantes.
            </motion.p>
            <motion.p
              variants={childVariants}
              className="leading-relaxed"
              style={{ textAlign: "justify" }}
            >
              Con expertise en FullStack, DevOps e IA, diseño soluciones
              innovadoras con un enfoque minimalista.
            </motion.p>
          </motion.div>

          {/* Botones sociales y de CV */}
          <motion.div
            variants={childVariants}
            className="mt-6 flex flex-wrap gap-2 justify-start"
          >
            <a
              href="https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-brand-500 dark:bg-brand-700 text-white dark:text-gray-100 font-medium rounded-lg shadow hover:bg-brand-600 dark:hover:bg-brand-600 transition-colors text-sm"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="mr-1 w-5 h-5" />
              LinkedIn
            </a>
            <a
              href="https://github.com/xMathyu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-brand-500 dark:bg-brand-700 text-white dark:text-gray-100 font-medium rounded-lg shadow hover:bg-brand-600 dark:hover:bg-brand-600 transition-colors text-sm"
              aria-label="GitHub"
            >
              <FaGithub className="mr-1 w-5 h-5" />
              GitHub
            </a>
            <a
              href="/mathyu-cv-es.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-brand-500 dark:bg-brand-700 text-white dark:text-gray-100 font-medium rounded-lg shadow hover:bg-brand-600 dark:hover:bg-brand-600 transition-colors text-sm"
              aria-label="Descargar CV"
            >
              <FaDownload className="mr-1 w-5 h-5" />
              CV
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
