import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "lenis/dist/lenis.css";
import "../globals.css";
import { NavBar } from "../components/NavBar";
import Preloader from "../components/Preloader";
import Cursor from "../components/ui/Cursor";
import ScrollProgress from "../components/ui/ScrollProgress";
import ChapterHud from "../components/ui/ChapterHud";
import ScrollFx from "../components/ui/ScrollFx";
import SmoothScroll from "../components/providers/SmoothScroll";
import { IntroProvider } from "../components/providers/IntroProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "profile",
      locale,
      images: ["/images/mathyu.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mathyu Cardozo",
  jobTitle: "Senior Full-Stack Engineer & AI Tech Lead",
  worksFor: { "@type": "Organization", name: "Entel" },
  alumniOf: "Universidad Peruana de Ciencias Aplicadas",
  sameAs: [
    "https://www.linkedin.com/in/mathyu-cardozo-7325a51b5/",
    "https://github.com/xMathyu",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="bg-ink font-sans text-fg antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <NextIntlClientProvider>
          <IntroProvider>
            <SmoothScroll>
              <Preloader />
              <ScrollProgress />
              <NavBar />
              {children}
              <ChapterHud />
              <ScrollFx />
              <Cursor />
            </SmoothScroll>
          </IntroProvider>
        </NextIntlClientProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
