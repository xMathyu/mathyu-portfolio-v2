"use client";

import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaLinkedin } from "react-icons/fa";

export default function ContactSection() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes integrar una solución real para enviar el formulario (por ejemplo, EmailJS o una API)
    toast.success("Mensaje enviado, gracias por contactarme");
    e.currentTarget.reset();
  };

  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center min-h-screen bg-background dark:bg-foreground transition-colors px-4 py-16 overflow-hidden"
    >
      {/* Contenedor para las notificaciones */}
      <Toaster position="bottom-center" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-semibold mb-8 text-brand-500 dark:text-brand-200 transition-colors"
      >
        Contacto
      </motion.h2>

      {/* Contenedor responsivo que une ambas opciones en una sola vista */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Opción 1: Conectar por LinkedIn */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800"
        >
          <p className="mb-4 text-lg text-gray-900 dark:text-gray-100 text-center">
            Conecta conmigo a través de LinkedIn para conocer más sobre mi
            trabajo y colaboraciones.
          </p>
          <a
            href="https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-brand-500 dark:bg-brand-200 text-white dark:text-brand-800 font-semibold rounded-full shadow hover:bg-brand-600 dark:hover:bg-brand-300 transition-colors"
          >
            <FaLinkedin className="mr-2 w-6 h-6" />
            Visita mi perfil
          </a>
        </motion.div>

        {/* Opción 2: Formulario de contacto */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800"
        >
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Tu correo"
              required
              className="p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:ring-brand-500 transition-colors"
            />
            <input
              type="tel"
              placeholder="Tu teléfono"
              required
              className="p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:ring-brand-500 transition-colors"
            />
            <textarea
              placeholder="Escribe tu mensaje..."
              rows={4}
              required
              className="p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:ring-brand-500 transition-colors"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 rounded bg-brand-500 hover:bg-brand-600 text-white transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
