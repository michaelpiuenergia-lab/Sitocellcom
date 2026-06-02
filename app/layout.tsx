import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { Chatbot } from "@/components/chatbot";
import { LangProvider } from "@/lib/i18n/lang-context";
import { getLang } from "@/lib/i18n/lang";

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
  title: "Cellcom Group — Phone Lifecycle Hub",
  description:
    "Compra, ripara, impara, rivendi. Un solo gruppo, cinque brand, una sola fiducia — dal primo giorno fino al riciclo.",
  metadataBase: new URL("https://cellcom-hub.vercel.app"),
  openGraph: {
    title: "Cellcom Group — Phone Lifecycle Hub",
    description:
      "Compra, ripara, impara, rivendi. Un solo gruppo, cinque brand, una sola fiducia.",
    type: "website",
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
      </body>
    </html>
  );
}
