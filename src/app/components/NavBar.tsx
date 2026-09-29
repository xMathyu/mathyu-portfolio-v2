"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { gsap, useGSAP, ScrollTrigger } from "@/app/lib/gsap";
import { useIntro } from "./providers/IntroProvider";

const SECTIONS = ["about", "work", "experience", "skills", "projects", "contact"] as const;

type Locale = (typeof routing.locales)[number];

function LocaleSwitch({
  locale,
  onChange,
  label,
}: {
  locale: string;
  onChange: (next: Locale) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex rounded-full border border-white/10 p-0.5 font-mono text-[11px] uppercase"
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          aria-pressed={locale === code}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === code ? "bg-white/15 text-fg" : "text-subtle hover:text-fg"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function NavBar() {
  const t = useTranslations("NavBar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const { introDone } = useIntro();

  const header = useRef<HTMLElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const menuWasOpen = useRef(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useGSAP(() => {
    gsap.set(header.current, { yPercent: -160 });

    // Hide the pill while scrolling down, bring it back on the way up
    const hide = gsap.to(pill.current, {
      yPercent: -160,
      duration: 0.45,
      ease: "power3.out",
      paused: true,
    });
    ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (self) => {
        if (self.scroll() < 200 || self.direction === -1) hide.reverse();
        else hide.play();
      },
    });

    // Highlight the link of the section currently in view
    SECTIONS.forEach((id) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 50%",
        end: "bottom 50%",
        refreshPriority: -1,
        onToggle: (self) =>
          setActive((current) => (self.isActive ? id : current === id ? "" : current)),
      });
    });

    const links = menu.current?.querySelectorAll("[data-menu-link]") ?? [];
    menuTl.current = gsap
      .timeline({ paused: true })
      .set(menu.current, { visibility: "visible" })
      .fromTo(
        menu.current,
        { clipPath: "circle(0% at calc(100% - 44px) 44px)" },
        {
          clipPath: "circle(150% at calc(100% - 44px) 44px)",
          duration: 0.8,
          ease: "power3.inOut",
        },
      )
      .from(links, { yPercent: 110, duration: 0.8, ease: "expo.out", stagger: 0.05 }, 0.3)
      .from(
        menu.current?.querySelectorAll("[data-menu-foot]") ?? [],
        { autoAlpha: 0, y: 12, duration: 0.5 },
        0.5,
      );
  });

  useEffect(() => {
    if (introDone) {
      gsap.to(header.current, { yPercent: 0, duration: 1.2, ease: "expo.out", delay: 0.6 });
    }
  }, [introDone]);

  useEffect(() => {
    if (open) {
      menuWasOpen.current = true;
      lenis?.stop();
      menuTl.current?.timeScale(1).play();
    } else if (menuWasOpen.current) {
      menuWasOpen.current = false;
      lenis?.start();
      menuTl.current?.timeScale(1.6).reverse();
    }
  }, [open, lenis]);

  const changeLocale = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setOpen(false);
    lenis?.start();
    lenis?.scrollTo(hash, { duration: 1.4 });
  };

  return (
    <>
      <header
        ref={header}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
      >
        <div
          ref={pill}
          className="pointer-events-auto flex w-full max-w-[1120px] items-center justify-between gap-4 rounded-full border border-white/10 bg-black/55 py-2 pl-4 pr-2 backdrop-blur-xl backdrop-saturate-150 sm:pl-5"
        >
          <a
            href="#home"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-fg"
          >
            <span className="bg-ai h-5 w-5 rounded-full shadow-[0_0_16px_rgba(201,89,221,0.6)]" />
            {t("logo")}
          </a>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {SECTIONS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget.firstElementChild, {
                    duration: 0.5,
                    overwrite: true,
                    scrambleText: { text: t(`links.${id}`), chars: "lowerCase", speed: 0.9 },
                  })
                }
                className={`rounded-full px-3.5 py-2 text-[13px] transition-colors duration-300 ${
                  active === id ? "bg-white/[0.09] text-fg" : "text-muted hover:text-fg"
                }`}
              >
                <span>{t(`links.${id}`)}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LocaleSwitch locale={locale} onChange={changeLocale} label={t("language")} />
            </div>
            <a
              href="#contact"
              className="hidden h-9 items-center rounded-full bg-fg px-4 text-[13px] font-medium text-ink transition-colors hover:bg-white sm:inline-flex"
            >
              {t("hire")}
            </a>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("close") : t("menu")}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 lg:hidden"
            >
              <span
                className={`absolute h-px w-4 bg-fg transition-transform duration-500 ${
                  open ? "rotate-45" : "-translate-y-[3px]"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-fg transition-transform duration-500 ${
                  open ? "-rotate-45" : "translate-y-[3px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 lg:hidden"
      >
        <nav className="flex flex-col">
          {SECTIONS.map((id, i) => (
            <div key={id} className="overflow-hidden">
              <a
                data-menu-link
                href={`#${id}`}
                onClick={(e) => goTo(e, `#${id}`)}
                tabIndex={open ? 0 : -1}
                className="flex items-baseline gap-4 py-1.5 text-[clamp(2.4rem,11vw,4rem)] font-semibold leading-tight tracking-[-0.04em] text-fg"
              >
                <span className="font-mono text-xs font-normal tracking-normal text-subtle">
                  0{i + 1}
                </span>
                {t(`links.${id}`)}
              </a>
            </div>
          ))}
        </nav>
        <div data-menu-foot className="flex items-center justify-between gap-4">
          <LocaleSwitch locale={locale} onChange={changeLocale} label={t("language")} />
          <a
            href="#contact"
            onClick={(e) => goTo(e, "#contact")}
            tabIndex={open ? 0 : -1}
            className="btn-primary"
          >
            {t("hire")}
          </a>
        </div>
      </div>
    </>
  );
}
