"use client";

import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { useTranslations } from "next-intl";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiArrowUpRight, FiDownload, FiSend } from "react-icons/fi";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/app/lib/gsap";
import { VIDEOS } from "@/app/lib/videos";
import LazyVideo from "../ui/LazyVideo";
import Magnetic from "../ui/Magnetic";

const links = [
  { key: "linkedin", href: "https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/", icon: FaLinkedin },
  { key: "github", href: "https://github.com/xMathyu", icon: FaGithub },
  { key: "cv", href: "/mathyu-cv-es.pdf", icon: FiDownload },
] as const;

export default function ContactSection() {
  const t = useTranslations("Contact");
  const root = useRef<HTMLElement>(null);
  const [sending, setSending] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const title = root.current?.querySelector<HTMLElement>("[data-contact-title]");
        let chars: Element[] = [];
        SplitText.create(title!, {
          type: "lines,chars",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) => {
            chars = self.chars;
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: { trigger: title, start: "top 85%", once: true },
              // Free the letters so the hover wave isn't clipped
              onComplete: () => void gsap.set(self.masks, { overflow: "visible" }),
            });
          },
        });

        // Hover: a wave runs through the headline
        const wave = () =>
          gsap.to(chars, {
            keyframes: { yPercent: [0, -22, 0], easeEach: "sine.inOut" },
            duration: 0.7,
            stagger: 0.018,
            overwrite: true,
          });
        title?.addEventListener("pointerenter", wave);

        // A giant "hire me" band slides across as the section scrolls by
        gsap.fromTo(
          "[data-hire-band]",
          { xPercent: 0 },
          {
            xPercent: -40,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
        gsap.from("[data-contact-fade]", {
          autoAlpha: 0,
          y: 30,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.2,
          scrollTrigger: { trigger: "[data-contact-title]", start: "top 85%", once: true },
        });

        return () => title?.removeEventListener("pointerenter", wave);
      });
    },
    { scope: root },
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );
      toast.success(t("toastSuccess"));
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(t("toastError"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section ref={root} id="contact" className="relative overflow-hidden py-28 sm:py-40">
      <LazyVideo
        clip={VIDEOS.contact}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-72 left-1/2 h-[520px] w-[90%] max-w-5xl -translate-x-1/2 rounded-full opacity-25 blur-[140px]"
        style={{ background: "linear-gradient(90deg,#0894ff,#c959dd,#ff2e54,#ff9004)" }}
      />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#111114",
            color: "#f5f5f7",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9999px",
          },
        }}
      />

      <div aria-hidden="true" className="pointer-events-none relative mb-16 overflow-hidden sm:mb-24">
        <p
          data-hire-band
          className="whitespace-nowrap text-[clamp(5rem,17vw,17rem)] font-black uppercase leading-[0.85] tracking-tightest text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.18)]"
        >
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="mr-[0.25em]">
              {t("band")}
              <span className="text-ai [-webkit-text-stroke:0]"> ✦ </span>
            </span>
          ))}
        </p>
      </div>

      <div className="container-x relative grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <span data-contact-fade className="eyebrow">
            {t("eyebrow")}
          </span>
          <h2
            data-contact-title
            className="mt-8 text-[clamp(2.4rem,6.2vw,6rem)] font-semibold leading-[0.95] tracking-tightest text-fg"
          >
            {t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
          </h2>
          <p data-contact-fade className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            {t("body")}
          </p>

          <div data-contact-fade className="mt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-subtle">
              {t("reach")}
            </p>
            <ul className="mt-4 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {links.map(({ key, href, icon: Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-5 text-xl font-medium text-fg transition-colors sm:text-2xl"
                  >
                    <span className="flex items-center gap-4">
                      <Icon className="h-5 w-5 text-muted transition-colors group-hover:text-fg" />
                      <span className="transition-transform duration-500 group-hover:translate-x-2">
                        {t(key)}
                      </span>
                    </span>
                    <FiArrowUpRight className="h-6 w-6 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-fg" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-contact-fade className="lg:col-span-5 lg:pt-24">
          <form
            onSubmit={handleSubmit}
            className="card flex flex-col gap-5 bg-surface/80 p-6 backdrop-blur-xl sm:p-8"
          >
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-fg">{t("formTitle")}</h3>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted">{t("email")}</span>
              <input
                type="email"
                name="user_email"
                placeholder={t("emailPlaceholder")}
                required
                autoComplete="email"
                className="field"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted">{t("phone")}</span>
              <input
                type="tel"
                name="user_phone"
                placeholder={t("phonePlaceholder")}
                autoComplete="tel"
                className="field"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted">{t("message")}</span>
              <textarea
                name="message"
                placeholder={t("messagePlaceholder")}
                rows={5}
                required
                className="field resize-none"
              />
            </label>
            <Magnetic strength={0.15} className="mt-2 w-full">
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full justify-center disabled:cursor-wait disabled:opacity-60"
              >
                {sending ? t("sending") : t("submit")}
                <FiSend className="h-4 w-4" />
              </button>
            </Magnetic>
          </form>
        </div>
      </div>
    </section>
  );
}
