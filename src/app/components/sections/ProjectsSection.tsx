"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Datos de ejemplo para tus proyectos (se agregó la propiedad "url")
const projects = [
  {
    id: 1,
    title: "Fa Meng Chuen",
    description: "Escuela de Kung Fu",
    image: "/images/proyecto1.png",
    url: "https://famengchuen.com/",
  },
  {
    id: 2,
    title: "Examen docente",
    description: "Sistema de exámenes para docentes",
    image: "/images/proyecto3.png",
    url: "https://docent-exam-xmathyus-projects.vercel.app/",
  },
  {
    id: 3,
    title: "Inti",
    description: "Parque botánico y de mariposas",
    image: "/images/proyecto2.png",
    url: "https://inti-eta.vercel.app/",
  },
];

// Variantes para animar las tarjetas con Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative flex flex-col items-center justify-center bg-background dark:bg-foreground transition-colors px-4 py-16 overflow-hidden"
    >
      <h2 className="text-3xl font-semibold mb-8 text-brand-500 dark:text-brand-200 transition-colors">
        Proyectos recientes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col cursor-pointer border rounded p-4 bg-brand-100 text-gray-900 transition-colors shadow-md
                       dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          >
            {project.image && (
              <div className="relative w-full h-40 mb-4">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-sm flex-1">
              {project.description.slice(0, 80)}
              {project.description.length > 80 ? "..." : ""}
            </p>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white transition-colors text-center
                         dark:bg-brand-700 dark:hover:bg-brand-600"
            >
              Ver sitio web
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
