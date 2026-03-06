"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import ReactCountryFlag from "react-country-flag";
import { motion, AnimatePresence } from "framer-motion";

export function NavBar() {
  const t = useTranslations("NavBar");
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: t("links.home") },
    { href: "#about", label: t("links.about") },
    { href: "#experience", label: t("links.experience") },
    { href: "#skills", label: t("links.skills") },
    { href: "#projects", label: t("links.projects") },
    { href: "#contact", label: t("links.contact") },
  ];

  const changeLocale = (newLocale: "en" | "es") => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  const currentFlag = locale === "en" ? "US" : "PE";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#home"
            className="text-xl font-bold text-gradient hover:opacity-80 transition-opacity"
          >
            {t("logo")}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-accent-400 to-purple-400 group-hover:w-3/4 transition-all duration-300" />
              </a>
            ))}

            {/* Language dropdown */}
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center"
                aria-label="Toggle Language Dropdown"
              >
                <ReactCountryFlag
                  countryCode={currentFlag}
                  svg
                  style={{ width: "1.3em", height: "1.3em" }}
                />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 glass rounded-xl overflow-hidden shadow-xl"
                  >
                    <button
                      onClick={() => {
                        changeLocale("en");
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      <ReactCountryFlag
                        countryCode="US"
                        svg
                        style={{ width: "1.3em", height: "1.3em" }}
                      />
                      English
                    </button>
                    <button
                      onClick={() => {
                        changeLocale("es");
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      <ReactCountryFlag
                        countryCode="PE"
                        svg
                        style={{ width: "1.3em", height: "1.3em" }}
                      />
                      Español
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass overflow-hidden"
          >
            <div className="pt-2 pb-4 space-y-1 px-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              {/* Language buttons in mobile */}
              <div className="flex gap-2 px-4 pt-2">
                <button
                  onClick={() => {
                    changeLocale("en");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ReactCountryFlag
                    countryCode="US"
                    svg
                    style={{ width: "1.3em", height: "1.3em" }}
                  />
                  EN
                </button>
                <button
                  onClick={() => {
                    changeLocale("es");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ReactCountryFlag
                    countryCode="PE"
                    svg
                    style={{ width: "1.3em", height: "1.3em" }}
                  />
                  ES
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
