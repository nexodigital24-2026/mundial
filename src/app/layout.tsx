import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Radio Nuevo Día Mundial - 100.9 FM | Portal del Mundial 2026",
  description: "Radio Nuevo Día — El Diario. Portal deportivo del Mundial 2026. Resultados en vivo, 12 grupos, goleadores y más. 100.9 FM",
  keywords: ["Mundial", "Fútbol", "Nuevo Día Mundial", "Radio Nuevo Día", "100.9 FM", "Resultados", "Goleadores"],
  icons: {
    icon: "/logo-nuevo-dia.png",
    shortcut: "/logo-nuevo-dia.png",
    apple: "/logo-nuevo-dia.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
