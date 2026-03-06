import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { NavBar } from "../components/NavBar";
import Scene3DWrapper from "../components/Scene3DWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Mathyu Cardozo | Portfolio",
  description: "FullStack Developer, DevOps & AI - Portfolio",
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
    <html lang={locale} className={inter.className}>
      <body className="bg-background text-foreground">
        <Scene3DWrapper />
        <NextIntlClientProvider>
          <NavBar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
