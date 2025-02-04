// app/layout.tsx
import { Inter } from "next/font/google";
import { NavBar } from "./components/NavBar";
import "./globals.css";

// Configuración de la fuente Inter para el cuerpo y Poppins para los encabezados
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Mathyu Portfolio",
  description: "Portafolio de Mathyu Cardozo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Se aplica la clase de Inter al <html> y se puede inyectar una clase para encabezados vía global CSS.
  return (
    <html lang="es" className={inter.className}>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
