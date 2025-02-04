"use client";

import React, { useEffect, useState } from "react";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export function NavBar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Al montar el componente, se verifica el valor almacenado en localStorage.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else if (storedTheme === "light") {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      } else {
        // Si no hay preferencia almacenada, podemos optar por usar el valor del sistema:
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
          setIsDark(true);
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          setIsDark(false);
          localStorage.setItem("theme", "light");
        }
      }
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "Acerca de mí" },
    { href: "#projects", label: "Proyectos" },
    { href: "#contact", label: "Contacto" },
  ];

  return (
    <header className="bg-background dark:bg-foreground transition-colors shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <a
              href="#home"
              className="text-2xl font-bold text-brand-500 dark:text-brand-200"
            >
              Mathyu C.
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground dark:text-background hover:text-brand-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-brand-100 dark:bg-brand-800 hover:bg-brand-200 dark:hover:bg-brand-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <SunIcon className="w-6 h-6 text-yellow-500" />
              ) : (
                <MoonIcon className="w-6 h-6 text-foreground dark:text-background" />
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md text-foreground dark:text-background hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
              aria-label="Open mobile menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-base font-medium text-foreground dark:text-background hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-base font-medium text-foreground dark:text-background hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              <div className="flex items-center">
                {isDark ? (
                  <>
                    <SunIcon className="w-6 h-6 text-yellow-500 mr-2" />
                    Modo Claro
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-6 h-6 text-foreground dark:text-background mr-2" />
                    Modo Oscuro
                  </>
                )}
              </div>
            </button>
          </div>
          <div className="px-4 pb-3">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-right text-foreground dark:text-background hover:text-brand-500 transition-colors"
              aria-label="Close mobile menu"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
