"use client";

import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaLinkedin } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("ContactSection");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Envía el formulario a través de EmailJS
    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        e.currentTarget,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(
        (result) => {
          console.log(result.text);
          toast.success(t("toastSuccess"));
        },
        (error) => {
          console.log(error.text);
          toast.error(t("toastError"));
        }
      );

    e.currentTarget.reset();
  };

  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center bg-background dark:bg-foreground transition-colors px-4 py-16 overflow-hidden"
    >
      {/* Contenedor para las notificaciones */}
      <Toaster position="bottom-center" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-semibold mb-8 text-brand-500 dark:text-brand-200 transition-colors"
      >
        {t("sectionTitle")}
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
            {t("linkedinDescription")}
          </p>
          <a
            href="https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-brand-500 dark:bg-brand-200 text-white dark:text-brand-800 font-semibold rounded-full shadow hover:bg-brand-600 dark:hover:bg-brand-300 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="mr-2 w-6 h-6" />
            {t("linkedinButton")}
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
              name="user_email"
              placeholder={t("formEmailPlaceholder")}
              required
              className="p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:ring-brand-500 transition-colors"
            />
            <input
              type="tel"
              name="user_phone"
              placeholder={t("formPhonePlaceholder")}
              required
              className="p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:ring-brand-500 transition-colors"
            />
            <textarea
              name="message"
              placeholder={t("formMessagePlaceholder")}
              rows={4}
              required
              className="p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:ring-brand-500 transition-colors"
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 rounded bg-brand-500 hover:bg-brand-600 text-white transition-colors"
            >
              {t("submitButton")}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
