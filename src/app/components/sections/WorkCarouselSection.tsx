"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Datos de ejemplo para las empresas
const companies = [
  { id: 1, name: "AOS", logo: "/logos/aos.png" },
  { id: 2, name: "Encora", logo: "/logos/encora.png" },
  { id: 3, name: "Interbank", logo: "/logos/interbank.png" },
  { id: 4, name: "MDP", logo: "/logos/mdp.png" },
  { id: 5, name: "Niubiz", logo: "/logos/niubiz.png" },
  { id: 6, name: "Pacifico", logo: "/logos/pacifico.svg" },
  { id: 7, name: "Serverli", logo: "/logos/serverli.png" },
  { id: 8, name: "Scotiabank", logo: "/logos/scotiabank.png" },
];

export default function WorkCarouselSection() {
  return (
    <section
      id="work"
      className="relative py-16 bg-background dark:bg-foreground overflow-hidden"
    >
      {/* Contenedor central */}
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-brand-500 dark:text-brand-200 text-center mb-8">
          Empresas con las que he trabajado
        </h2>

        {/* Contenedor del carrusel con degradados laterales */}
        <div className="relative overflow-hidden">
          {/* Degradado izquierdo */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background dark:from-foreground z-10 pointer-events-none" />
          {/* Degradado derecho */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background dark:from-foreground z-10 pointer-events-none" />

          <motion.div
            className="flex items-center space-x-8"
            animate={{ x: "-50%" }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
          >
            {[...companies, ...companies].map((company, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={150}
                  height={80}
                  className="object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
