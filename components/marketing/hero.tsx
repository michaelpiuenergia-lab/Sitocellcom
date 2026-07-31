"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/constants";
import { formatPrice } from "@/lib/crm-client/mocks/products";
import type { PublicProductListItem } from "@/lib/crm-client/types";
import { useLang } from "@/lib/i18n/lang-context";
import type { Dict } from "@/lib/i18n/dict";
import {
  BoxesIcon,
  GraduationCapIcon,
  RepeatIcon,
  ShoppingBagIcon,
  WrenchIcon,
} from "./service-icons";

// Le cinque aree di Fast-Fix, ognuna con la sua icona: a colpo d'occhio si
// capisce cosa fa l'azienda senza leggere.
// Ordine deliberato: "Ripara" per primo — la riparazione è il mestiere
// principale e deve leggersi al primo impatto, prima della vendita.
const PILLAR_BUTTONS: Array<{
  key: keyof Dict;
  href: string;
  Icon: (props: { className?: string }) => React.ReactElement;
}> = [
  { key: "hero.pillar.repair", href: "/riparazioni", Icon: WrenchIcon },
  { key: "hero.pillar.buy", href: "/prodotti", Icon: ShoppingBagIcon },
  { key: "hero.pillar.resell", href: "/rivendi", Icon: RepeatIcon },
  { key: "hero.pillar.learn", href: "/corsi", Icon: GraduationCapIcon },
  { key: "hero.pillar.b2b", href: "/b2b", Icon: BoxesIcon },
];

export function Hero({
  devices = [],
  canSeePrices = false,
}: {
  devices?: PublicProductListItem[];
  canSeePrices?: boolean;
}) {
  const { t } = useLang();
  const shouldReduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const newDevices = devices
    .filter((d) => d.condition !== "used" && d.condition !== "refurbished")
    .slice(0, 3);

  // Hero senza video — partiamo direttamente nello stato finale ("content")
  // con sfondo bianco, wordmark gia' fermo, contenuti visibili.
  const showContent = true;
  const hidden = false;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#ffffff",
        minHeight: "calc(100vh - 120px)",
      }}
    >

      {/*
        Layout principale: container UNIFICATO con navbar (max-w-[1400px]
        + lg:px-12). Flex-1 cresce, in fondo alla sezione c'è il BrandMarquee
        rosso così è visibile nel primo fold senza scrollare.
       */}
      <div className="relative z-30 flex-1 flex items-center max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 pt-4 sm:pt-8 pb-8 sm:pb-10 w-full">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 sm:gap-12 lg:gap-16 w-full">
          {/* === Colonna sinistra === */}
          <div className="flex-1 flex flex-col gap-6 sm:gap-8 items-start text-left max-w-[640px] w-full">
            {/*
              Niente wordmark qui: il logo è già nella navbar, due righe sopra.
              Ripeterlo grande rubava il primo schermo al messaggio vero e
              faceva sembrare la pagina un frontespizio.
              Al suo posto il claim, che ora è l'h1 della homepage: prima non
              esisteva nessun h1, e per Google è il segnale più forte di cosa
              tratta la pagina.
             */}
            <motion.h1
              initial={shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{
                opacity: hidden ? 0 : 1,
                y: hidden ? 14 : 0,
              }}
              transition={{
                duration: 0.7,
                ease: EASE.smooth,
                delay: 0.1,
              }}
              className="font-serif tracking-[-0.02em] text-[#171717]"
              style={{
                fontSize: "var(--text-h1, var(--text-h2))",
                lineHeight: 1.05,
              }}
            >
              <em className="italic text-brand-600" style={{ fontStyle: "italic" }}>{t("hero.claim.italicA")}</em>
              {t("hero.claim.between")}{" "}
              <em className="italic text-brand-600" style={{ fontStyle: "italic" }}>{t("hero.claim.italicB")}</em>.
            </motion.h1>

            {/*
              Mobile: griglia a due colonne, così i cinque pulsanti restano
              allineati e leggibili invece di spezzarsi con larghezze diverse.
              Da sm in su tornano in fila con wrap naturale.
             */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 md:gap-3 mt-1 w-full">
              {PILLAR_BUTTONS.map((btn, i) => (
                <motion.div
                  key={btn.href}
                  className="w-full sm:w-auto"
                  initial={
                    shouldReduce
                      ? { y: 0, opacity: 1, rotate: 0 }
                      : { y: -180, opacity: 0, rotate: -10 }
                  }
                  animate={{
                    y: hidden ? -180 : 0,
                    opacity: hidden ? 0 : 1,
                    rotate: hidden ? -10 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 18,
                    delay: i * 0.07,
                  }}
                >
                  <Link
                    href={btn.href}
                    // w-full + justify-center: su mobile i pulsanti riempiono
                    // la colonna della griglia e restano allineati invece di
                    // andare a capo con larghezze diverse.
                    // hover:-translate-y-0.5 + scale: il "leggero ingrandimento
                    // con ombra" chiesto, tenuto sotto il 3% per non far
                    // ballare la riga.
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-3 rounded-xl overflow-hidden transition-all duration-300 ease-snappy hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(220,38,38,0.55),0_0_0_1px_rgba(248,113,113,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                      color: "#ffffff",
                    }}
                  >
                    <btn.Icon className="w-[18px] h-[18px] shrink-0 transition-transform duration-300 ease-snappy group-hover:scale-110" />
                    <span
                      className="font-semibold"
                      style={{
                        fontFamily:
                          '"Geist", ui-sans-serif, system-ui, sans-serif',
                        fontSize: "clamp(14px, 1.25vw, 17px)",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {t(btn.key)}
                    </span>
                    <span className="transition-transform duration-300 ease-snappy group-hover:translate-x-1 text-sm ml-auto sm:ml-0">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {showContent && (
              <motion.p
                className="leading-relaxed max-w-[640px] mt-2 font-sans"
                style={{
                  color: "#3f3f46",
                  fontSize: "var(--text-body-lg)",
                }}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: EASE.smooth, delay: 0.4 }}
              >
                {t("hero.intro.lead")}{" "}
                <strong className="font-semibold" style={{ color: "#0a0a0a" }}>
                  {t("hero.intro.boldA")}
                </strong>
                {t("hero.intro.bodyA")}{" "}
                <strong className="font-semibold" style={{ color: "#0a0a0a" }}>
                  {t("hero.intro.boldB")}
                </strong>
                {t("hero.intro.bodyB")}{" "}
                <strong className="font-semibold" style={{ color: "#0a0a0a" }}>
                  {t("hero.intro.boldC")}
                </strong>
                {t("hero.intro.bodyC")}{" "}
                <strong className="font-semibold" style={{ color: "#0a0a0a" }}>
                  {t("hero.intro.boldD")}
                </strong>
                {t("hero.intro.bodyD")}{" "}
                <strong className="font-semibold" style={{ color: "#0a0a0a" }}>
                  {t("hero.intro.boldE")}
                </strong>
                {t("hero.intro.bodyE")}
              </motion.p>
            )}
          </div>

          {/*
            === Colonna destra ===
            Width SEMPRE riservata (anche durante video/flash), così il banner
            a sinistra non si sposta quando appaiono i prodotti. Contenuto
            interno solo dopo showContent.
           */}
          <div className="w-full lg:w-[440px] xl:w-[480px] flex-shrink-0">
            {showContent && newDevices.length > 0 && (
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: EASE.smooth, delay: 0.5 }}
              >
                <div
                  className="font-mono uppercase flex items-center gap-3"
                  style={{
                    color: "#737373",
                    fontSize: "11px",
                    letterSpacing: "0.32em",
                  }}
                >
                  <span className="h-px w-10" style={{ backgroundColor: "#dc2626" }} />
                  {t("hero.newDevicesEyebrow")}
                </div>

                <div className="flex flex-col gap-3">
                  {newDevices.map((d, idx) => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: EASE.smooth,
                        delay: 0.7 + idx * 0.08,
                      }}
                    >
                      <Link
                        // La scheda prodotto singola non esiste: /prodotti/<slug>
                        // restituiva 404 (verificato nei log di produzione).
                        // Si atterra sulla categoria con l'àncora al prodotto,
                        // come fa già il chatbot in lib/chatbot/tools.ts.
                        href={`/prodotti/telefoni#${d.slug}`}
                        className="group flex items-center gap-4 sm:gap-5 rounded-2xl border border-neutral-200/80 bg-white hover:border-brand-600 transition-all duration-300 ease-snappy hover:shadow-[0_22px_50px_-22px_rgba(220,38,38,0.32)] p-3 sm:p-4"
                      >
                        <div className="relative w-[108px] h-[108px] sm:w-[136px] sm:h-[136px] flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-neutral-50">
                          {d.photoUrl ? (
                            <Image
                              src={d.photoUrl}
                              alt={d.name}
                              fill
                              sizes="(max-width: 640px) 108px, 136px"
                              className="object-contain p-3 transition-transform duration-500 ease-snappy group-hover:scale-110"
                            />
                          ) : (
                            <div className="text-4xl" style={{ color: "#dc2626" }}>
                              ◢
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          {d.brand && (
                            <span
                              className="font-mono uppercase"
                              style={{
                                color: "#a3a3a3",
                                fontSize: "10px",
                                letterSpacing: "0.28em",
                              }}
                            >
                              {d.brand}
                            </span>
                          )}
                          <div
                            className="font-semibold line-clamp-2 leading-snug"
                            style={{
                              color: "#0a0a0a",
                              fontSize: "16px",
                              letterSpacing: "-0.015em",
                            }}
                            title={d.name}
                          >
                            {d.name}
                          </div>
                          {canSeePrices ? (
                            <div
                              className="font-semibold tabular-nums"
                              style={{
                                color: "#dc2626",
                                fontSize: "18px",
                                letterSpacing: "-0.015em",
                              }}
                            >
                              {d.priceHidden
                                ? t("hero.priceOnRequest")
                                : formatPrice(d.priceCents)}
                            </div>
                          ) : (
                            <div
                              className="font-mono uppercase"
                              style={{
                                color: "#a3a3a3",
                                fontSize: "10px",
                                letterSpacing: "0.22em",
                              }}
                            >
                              {t("hero.pricesReservedHint")}
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* CTA catalogo — rosso brand */}
                <Link
                  href="/prodotti"
                  className="group relative mt-1 inline-flex items-center justify-between gap-3 sm:gap-4 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 text-white transition-all duration-300 hover:shadow-[0_20px_50px_-18px_rgba(220,38,38,0.6)]"
                  style={{
                    backgroundColor: "#dc2626",
                    border: "1px solid #dc2626",
                  }}
                >
                  <span className="flex flex-col gap-1 min-w-0">
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.32em",
                        color: "#ffffff",
                        opacity: 0.85,
                      }}
                    >
                      {t("hero.catalogCta.eyebrow")}
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        fontSize: "clamp(14px, 1.3vw, 17px)",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {t("hero.catalogCta.title")}
                    </span>
                  </span>
                  <span
                    className="font-mono uppercase flex items-center gap-1.5 sm:gap-2 shrink-0"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.28em",
                    }}
                  >
                    <span className="hidden sm:inline">{t("hero.catalogCta.explore")}</span>
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1 text-base"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
