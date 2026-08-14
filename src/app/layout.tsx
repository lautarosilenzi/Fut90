import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { brand } from "@/lib/branding/config";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — Fútbol argentino en vivo`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  openGraph: {
    title: brand.name,
    description: brand.description,
    locale: brand.locale,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: brand.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${bebasNeue.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-neutral-950 text-neutral-50 antialiased">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-20 pt-4 sm:pb-10">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
