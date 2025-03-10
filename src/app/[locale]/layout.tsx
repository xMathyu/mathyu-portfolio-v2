import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { NavBar } from "../components/NavBar";

// Configuración de la fuente Inter para el cuerpo y Poppins para los encabezados
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Mathyu Portfolio",
  description: "Portafolio de Mathyu Cardozo",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Se obtienen los mensajes para el locale actual
  const messages = await getMessages();

  return (
    <html lang={params.locale} className={inter.className}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <NavBar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
