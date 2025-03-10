"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/solid";
import ReactCountryFlag from "react-country-flag";

export function NavBar() {
  const t = useTranslations("NavBar");
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams(); // Obtenemos el locale desde la ruta dinámica [locale]

  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejo del tema
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

  // Links de navegación
  const navLinks = [
    { href: "#home", label: t("links.home") },
    { href: "#about", label: t("links.about") },
    { href: "#projects", label: t("links.projects") },
    { href: "#contact", label: t("links.contact") },
  ];

  // Cambiar idioma usando next-intl (sin concatenar prefijos)
  const changeLocale = (newLocale: "en" | "es") => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  // Bandera actual: "US" para inglés, "PE" para español
  const currentFlag = locale === "en" ? "US" : "PE";

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
              {t("logo")}
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground dark:text-white hover:text-brand-500 transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Botón para cambiar tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-brand-100 dark:bg-brand-800 hover:bg-brand-200 dark:hover:bg-brand-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <SunIcon className="w-6 h-6 text-yellow-500" />
              ) : (
                <MoonIcon className="w-6 h-6 text-foreground dark:text-white" />
              )}
            </button>

            {/* Dropdown para cambiar idioma */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="ml-3 p-2 rounded bg-brand-100 dark:bg-brand-800 hover:bg-brand-200 dark:hover:bg-brand-700 transition-colors flex items-center"
                aria-label="Toggle Language Dropdown"
              >
                <ReactCountryFlag
                  countryCode={currentFlag}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                  <button
                    onClick={() => {
                      changeLocale("en");
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center dark:text-white"
                  >
                    <ReactCountryFlag
                      countryCode="US"
                      svg
                      style={{ width: "1.5em", height: "1.5em" }}
                      className="mr-2"
                    />
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLocale("es");
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center dark:text-white"
                  >
                    <ReactCountryFlag
                      countryCode="PE"
                      svg
                      style={{ width: "1.5em", height: "1.5em" }}
                      className="mr-2"
                    />
                    Español
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md text-foreground dark:text-white hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
              aria-label="Toggle mobile menu"
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
                className="block px-4 py-2 text-base font-medium text-foreground dark:text-white hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
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
              className="block w-full text-left px-4 py-2 text-base font-medium text-foreground dark:text-white hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              <div className="flex items-center">
                {isDark ? (
                  <>
                    <SunIcon className="w-6 h-6 text-yellow-500 mr-2" />
                    {t("toggle.light")}
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-6 h-6 text-foreground dark:text-white mr-2" />
                    {t("toggle.dark")}
                  </>
                )}
              </div>
            </button>

            {/* Dropdown para cambiar idioma en menú móvil */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="ml-3 p-2 rounded bg-brand-100 dark:bg-brand-800 hover:bg-brand-200 dark:hover:bg-brand-700 transition-colors flex items-center"
                aria-label="Toggle Language Dropdown"
              >
                <ReactCountryFlag
                  countryCode={currentFlag}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-full sm:w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                  <button
                    onClick={() => {
                      changeLocale("en");
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center dark:text-white"
                  >
                    <ReactCountryFlag
                      countryCode="US"
                      svg
                      style={{ width: "1.5em", height: "1.5em" }}
                      className="mr-2"
                    />
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLocale("es");
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center dark:text-white"
                  >
                    <ReactCountryFlag
                      countryCode="PE"
                      svg
                      style={{ width: "1.5em", height: "1.5em" }}
                      className="mr-2"
                    />
                    Español
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
