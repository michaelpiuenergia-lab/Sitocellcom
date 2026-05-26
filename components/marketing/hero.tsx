"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/constants";
import { formatPrice } from "@/lib/crm-client/mocks/products";
import type { PublicProductListItem } from "@/lib/crm-client/types";

const VIDEO_SRC = "/videos/hero-evolution.mp4";
const FLASH_DURATION_MS = 1400;
const ELLCOM_LETTERS = ["E", "L", "L", "C", "O", "M"] as const;

const PILLAR_BUTTONS: Array<{
  label: string;
  href: string;
}> = [
  { label: "Compra", href: "/prodotti" },
  { label: "Ripara", href: "/riparazioni" },
  { label: "Rivendi", href: "/rivendi" },
  { label: "Impara", href: "/corsi" },
];

type Phase = "video" | "flash" | "content";

export function Hero({ devices = [] }: { devices?: PublicProductListItem[] }) {
  const shouldReduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(shouldReduce ? "content" : "video");
  const [isVideoNearEnd, setIsVideoNearEnd] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const newDevices = devices
    .filter((d) => d.condition !== "used" && d.condition !== "refurbished")
    .slice(0, 3);

  // Pausa il video quando la Hero esce dal viewport: niente decode inutile.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "video") return;
    const safety = setTimeout(() => setPhase("flash"), 9000);
    return () => clearTimeout(safety);
  }, [phase]);

  useEffect(() => {
    if (phase !== "flash") return;
    const t = setTimeout(() => setPhase("content"), FLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const handleVideoEnd = () => {
    setPhase((p) => (p === "video" ? "flash" : p));
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (!v.duration || isVideoNearEnd) return;
    if (v.currentTime > v.duration - 1.6) setIsVideoNearEnd(true);
  };

  const isWhite = phase === "flash" || phase === "content";
  const showContent = phase === "content";
  const hidden = phase === "video";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden transition-colors duration-700 flex flex-col"
      style={{
        backgroundColor: isWhite ? "#ffffff" : "#050505",
        // navbar (72) + banner (~48) = 120 — Hero leggermente più corta così
        // il banner ROSSO sotto entra nel primo fold senza scrollare.
        minHeight: "calc(100vh - 120px)",
      }}
    >
      {/* Video background — a tutto schermo (cover su ogni breakpoint) */}
      <div className="absolute inset-0 z-0">
        {!shouldReduce && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onEnded={handleVideoEnd}
            onTimeUpdate={handleVideoTimeUpdate}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center" }}
            aria-hidden="true"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Bridge bianco invisibile */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ backgroundColor: "#ffffff" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVideoNearEnd || phase !== "video" ? 1 : 0,
        }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        aria-hidden="true"
      />

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
              Wordmark — SOLO fade-in + rotazione iniziale.
              Niente cambio di dimensione: il banner resta ancorato al posto
              definitivo dall'inizio, non "cammina" tra le fasi.
             */}
            <div className="flex items-end gap-2 md:gap-3">
              <motion.svg
                viewBox="10 15 80 70"
                aria-label="Cellcom"
                preserveAspectRatio="xMidYMid meet"
                style={{
                  display: "block",
                  overflow: "visible",
                  flexShrink: 0,
                  // C grande, dominante rispetto a ELLCOM (ratio ~2.5-3x).
                  width: "clamp(110px, 14vw, 200px)",
                  height: "clamp(96px, 12.3vw, 175px)",
                }}
                initial={
                  shouldReduce
                    ? { rotate: 0, opacity: 1 }
                    : { rotate: -180, opacity: 0 }
                }
                animate={{
                  rotate: phase === "video" ? -180 : 0,
                  opacity: hidden ? 0 : 1,
                }}
                transition={{
                  duration: 0.9,
                  ease: EASE.smooth,
                }}
              >
                <motion.path
                  d="M 80,25 A 30,30 0 1,0 80,75"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="18"
                  strokeLinecap="round"
                  initial={
                    shouldReduce
                      ? { strokeDashoffset: 0, strokeDasharray: 280 }
                      : { strokeDasharray: 280, strokeDashoffset: 280 }
                  }
                  animate={{
                    strokeDashoffset: hidden ? 280 : 0,
                  }}
                  transition={{ duration: 1.0, ease: EASE.smooth }}
                />
              </motion.svg>

              <div className="flex flex-col items-start gap-1 md:gap-2 pb-1.5 md:pb-2.5">
                <div className="flex items-end">
                  {ELLCOM_LETTERS.map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={
                        shouldReduce
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 30 }
                      }
                      animate={{
                        opacity: hidden ? 0 : 1,
                        y: hidden ? 30 : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: EASE.snappy,
                        delay: phase === "flash" ? 0.1 + i * 0.05 : i * 0.04,
                      }}
                      style={{
                        fontFamily:
                          '"Geist", ui-sans-serif, system-ui, -apple-system, sans-serif',
                        fontWeight: 800,
                        fontSize: "clamp(32px, 4.8vw, 72px)",
                        color: "#0a0a0a",
                        lineHeight: 0.85,
                        letterSpacing: "-0.045em",
                        display: "inline-block",
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
                <motion.span
                  initial={shouldReduce ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: hidden ? 0 : 1 }}
                  transition={{
                    duration: 0.6,
                    delay: phase === "flash" ? 0.9 : 0.6,
                  }}
                  className="font-mono uppercase tabular-nums"
                  style={{
                    fontSize: "clamp(11px, 1vw, 14px)",
                    letterSpacing: "0.42em",
                    color: "#dc2626",
                    lineHeight: 1,
                    marginLeft: "0.1em",
                  }}
                >
                  GROUP
                </motion.span>
              </div>
            </div>

            <motion.h2
              initial={shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{
                opacity: hidden ? 0 : 1,
                y: hidden ? 14 : 0,
              }}
              transition={{
                duration: 0.7,
                ease: EASE.smooth,
                delay: phase === "flash" ? 0.6 : 0.1,
              }}
              className="font-serif tracking-[-0.02em] text-[#171717]"
              style={{
                fontSize: "var(--text-h2)",
                lineHeight: 1.05,
              }}
            >
              Vendiamo,{" "}
              <em className="italic text-brand-600 not-italic" style={{ fontStyle: "italic" }}>ripariamo</em>,{" "}
              riforniamo{" "}
              <em className="italic text-brand-600" style={{ fontStyle: "italic" }}>chi li vende</em>.
            </motion.h2>

            <div className="flex flex-wrap gap-3 md:gap-4 mt-1">
              {PILLAR_BUTTONS.map((btn, i) => (
                <motion.div
                  key={btn.href}
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
                    delay: phase === "flash" ? 0.8 + i * 0.1 : i * 0.07,
                  }}
                >
                  <Link
                    href={btn.href}
                    className="group relative inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-3 sm:py-4 rounded-xl overflow-hidden transition-all duration-300 ease-snappy hover:shadow-[0_14px_36px_-10px_rgba(220,38,38,0.55),0_0_0_1px_rgba(248,113,113,0.3)]"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                      color: "#ffffff",
                    }}
                  >
                    <span
                      className="font-semibold"
                      style={{
                        fontFamily:
                          '"Geist", ui-sans-serif, system-ui, sans-serif',
                        fontSize: "clamp(16px, 2.1vw, 26px)",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {btn.label}
                    </span>
                    <span className="transition-transform duration-300 ease-snappy group-hover:translate-x-1 text-base sm:text-lg">
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
                Tre attività, un solo magazzino.{" "}
                <strong className="font-semibold" style={{ color: "#0a0a0a" }}>
                  Vendita al pubblico
                </strong>{" "}
                di smartphone, accessori e ricambi.{" "}
                <strong className="font-semibold" style={{ color: "#0a0a0a" }}>
                  Centro assistenza
                </strong>{" "}
                con laboratorio interno e garanzia 12 mesi.{" "}
                <strong className="font-semibold" style={{ color: "#0a0a0a" }}>
                  Ingrosso B2B
                </strong>{" "}
                per rivenditori, centri assistenza e aziende.
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
                  Nuovi in catalogo
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
                        href={`/prodotti/${d.slug}`}
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
                          <div
                            className="font-semibold tabular-nums"
                            style={{
                              color: "#dc2626",
                              fontSize: "18px",
                              letterSpacing: "-0.015em",
                            }}
                          >
                            {d.priceHidden ? "Su richiesta" : formatPrice(d.priceCents)}
                          </div>
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
                      Catalogo completo
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        fontSize: "clamp(14px, 1.3vw, 17px)",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      Tutti gli smartphone, ricambi, accessori
                    </span>
                  </span>
                  <span
                    className="font-mono uppercase flex items-center gap-1.5 sm:gap-2 shrink-0"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.28em",
                    }}
                  >
                    <span className="hidden sm:inline">Esplora</span>
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
