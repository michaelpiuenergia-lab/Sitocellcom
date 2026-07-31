import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { Chatbot } from "@/components/chatbot";
import { LangProvider } from "@/lib/i18n/lang-context";
import { getLang } from "@/lib/i18n/server";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/structured-data";
import { QueryProvider } from "@/lib/providers/query-provider";
import { SITE_URL } from "@/lib/seo/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    // Il title è il fattore on-page che pesa di più: la città sta davanti,
    // perché la ricerca che vogliamo intercettare è "riparazione telefoni
    // san benedetto", non il nome del negozio (che nessuno cerca ancora).
    default:
      "Riparazione smartphone San Benedetto del Tronto — Fast-Fix",
    // Template corto di proposito: Google taglia intorno ai 60 caratteri,
    // e la località la porta ogni pagina nel proprio titolo.
    template: "%s — Fast-Fix",
  },
  description:
    "Riparazione smartphone, tablet e computer a San Benedetto del Tronto: diagnosi gratuita, preventivo in 24 ore, garanzia 12 mesi. Compriamo il tuo usato, vendiamo ricambi e forniamo rivenditori all'ingrosso. Due sedi in centro.",
  keywords: [
    "riparazione smartphone San Benedetto del Tronto",
    "riparazione iPhone San Benedetto del Tronto",
    "riparazione cellulari Ascoli Piceno",
    "sostituzione display smartphone",
    "sostituzione batteria iPhone",
    "microsaldatura scheda madre",
    "ingrosso telefoni",
    "ingrosso ricambi smartphone",
    "grossista smartphone Marche",
    "compro usato smartphone",
    "smartphone ricondizionati garantiti",
    "corso riparazione smartphone",
    "centro assistenza telefoni San Benedetto del Tronto",
  ],
  authors: [{ name: "Fast-Fix" }],
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
    siteName: "Fast-Fix",
    title: "Riparazione smartphone a San Benedetto del Tronto — Fast-Fix",
    description:
      "Diagnosi gratuita, preventivo in 24 ore, garanzia 12 mesi. Due sedi a San Benedetto del Tronto.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Fast-Fix — riparazione smartphone a San Benedetto del Tronto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riparazione smartphone a San Benedetto del Tronto — Fast-Fix",
    description:
      "Diagnosi gratuita, preventivo in 24 ore, garanzia 12 mesi. Due sedi in città.",
    images: ["/opengraph-image"],
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
          <QueryProvider>
            {children}
            <Chatbot />
          </QueryProvider>
        </LangProvider>
        <GrainOverlay />
        {/* JSON-LD globali: rich snippet Google */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  );
}
