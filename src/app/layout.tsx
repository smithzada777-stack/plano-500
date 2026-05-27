import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plano 500 - Acesso Exclusivo",
  description: "Plano 500 - O seu plano para resultados.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
