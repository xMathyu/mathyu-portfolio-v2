"use client";

import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-background dark:bg-foreground text-foreground dark:text-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Mathyu Cardozo. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-500"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://github.com/xMathyu/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-500"
              aria-label="GitHub"
            >
              <FaGithub size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
