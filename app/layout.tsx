import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { SpotlightCursor } from "@/components/effects/spotlight-cursor";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <SpotlightCursor />
        {children}
        <GrainOverlay />
      </body>
    </html>
  );
}
