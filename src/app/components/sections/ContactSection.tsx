"use client";

import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaLinkedin, FaPaperPlane } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("ContactSection");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        e.currentTarget,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      )
      .then(
        (result) => {
          console.log(result.text);
          toast.success(t("toastSuccess"));
        },
        (error) => {
          console.log(error.text);
          toast.error(t("toastError"));
        },
      );

    e.currentTarget.reset();
  };

  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-accent-500/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-[120px]" />

      <Toaster position="bottom-center" />

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

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LinkedIn Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center p-6 sm:p-8 glass rounded-2xl hover:glow transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent-500/10 flex items-center justify-center mb-6">
            <FaLinkedin className="w-8 h-8 text-accent-400" />
          </div>
          <p className="mb-6 text-base text-slate-300 text-center leading-relaxed">
            {t("linkedinDescription")}
          </p>
          <motion.a
            href="https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-accent-500/25 transition-all"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-5 h-5" />
            {t("linkedinButton")}
          </motion.a>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col p-6 sm:p-8 glass rounded-2xl hover:glow transition-all duration-300"
        >
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="email"
              name="user_email"
              placeholder={t("formEmailPlaceholder")}
              required
              className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-slate-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/30 transition-all"
            />
            <input
              type="tel"
              name="user_phone"
              placeholder={t("formPhonePlaceholder")}
              required
              className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-slate-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/30 transition-all"
            />
            <textarea
              name="message"
              placeholder={t("formMessagePlaceholder")}
              rows={4}
              required
              className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-slate-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/30 transition-all resize-none"
            ></textarea>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-500 to-purple-500 text-white font-semibold shadow-lg overflow-hidden transition-all"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {t("submitButton")}
                <FaPaperPlane className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
