import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Danza y Gym | Configuración inicial",
  description: "Aplicación privada de gestión para academias, estudios y gimnasios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
