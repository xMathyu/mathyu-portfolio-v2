"use client";

import { useTranslations } from "next-intl";
import { FaLinkedin, FaGithub, FaHeart } from "react-icons/fa";

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="relative border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 flex items-center gap-1">
            {t("rights", { year: new Date().getFullYear() })}
            <span className="inline-flex items-center gap-1 text-accent-400">
              <FaHeart className="w-3 h-3" />
            </span>
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-accent-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://github.com/xMathyu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-accent-400 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
