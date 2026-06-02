import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { Chatbot } from "@/components/chatbot";
import { LangProvider } from "@/lib/i18n/lang-context";
import { getLang } from "@/lib/i18n/server";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sitocellcom.vercel.app"),
  title: {
    default: "Cellcom Group — Compra, ripara, impara, rivendi",
    template: "%s — Cellcom Group",
  },
  description:
    "Smartphone nuovi e ricondizionati, riparazioni con garanzia 12 mesi, ricambi originali, corsi di riparazione. Tre brand del Gruppo Cellcom: Cellcom (B2B), Fast-Fix (riparazioni), ItalianParts (ricambi). San Benedetto del Tronto.",
  keywords: [
    "riparazione smartphone",
    "smartphone ricondizionati",
    "ricambi smartphone",
    "Cellcom",
    "Fast-Fix",
    "ItalianParts",
    "corsi riparazione smartphone",
    "B2B smartphone ingrosso",
    "San Benedetto del Tronto",
  ],
  authors: [{ name: "Cellcom Group" }],
  alternates: {
    canonical: "/",
    languages: {
      it: "/",
      en: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    alternateLocale: ["en_US"],
    siteName: "Cellcom Group",
    title: "Cellcom Group — Compra, ripara, impara, rivendi",
    description:
      "Tre brand. Un solo magazzino. Diagnosi gratuita, preventivo entro 24h, garanzia 12 mesi.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cellcom Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cellcom Group — Compra, ripara, impara, rivendi",
    description: "Tre brand. Un solo magazzino. Diagnosi gratuita, garanzia 12 mesi.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // google: "<google-search-console-token>",  // da aggiungere quando registrato
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <LangProvider initialLang={lang}>
          {children}
          <Chatbot />
        </LangProvider>
        <GrainOverlay />
        {/* JSON-LD globali: rich snippet Google */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  );
}
