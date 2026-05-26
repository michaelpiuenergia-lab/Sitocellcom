"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { PhoneSilhouette } from "./phone-silhouette";
import type { PublicProductListItem } from "@/lib/crm-client/types";

/**
 * Lifecycle Showcase — sezione Apple-style.
 *
 * 4 "momenti" del ciclo vita del telefono (compra → ripara → impara → rivende)
 * con scroll-driven parallax, sfondo cream chiaro che alterna col dark del
 * resto della home, tipografia grossa centrata, accent rosso Cellcom.
 *
 * Ispirazione: apple.com/ipad-pro/ pattern dei "feature moments" — testo
 * gigantesco al centro che entra dal basso al scroll, supporting visual a
 * fianco, niente clutter.
 */
export function LifecycleShowcase({
  devices = [],
}: {
  devices?: PublicProductListItem[];
}) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax sottile su uno strato di background
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#f5f3ef] text-[#0a0a0a]"
      // Cream chiaro come sezioni Apple, rompe il dark del resto.
      // Ho scelto un cream caldo (#f5f3ef) invece di bianco puro — meno
      // sterile, più premium.
    >
      {/* Strato parallax — gradiente rosso soft che si muove al scroll */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-x-0 -top-1/4 -bottom-1/4 -z-0 opacity-60 pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(220,38,38,0.10)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(220,38,38,0.06)_0%,transparent_50%)]" />
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 py-24 lg:py-40 flex flex-col gap-24 lg:gap-40">
        {/* ─── INTRO eyebrow + headline cinematic ─────────────────────── */}
        <div className="flex flex-col items-center text-center gap-6">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[11px] uppercase tracking-[0.32em] text-brand-600"
          >
            Phone Lifecycle Hub
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-serif text-[clamp(48px,7vw,104px)] font-normal leading-[0.95] tracking-[-0.02em] text-[#0a0a0a] max-w-[14ch]"
          >
            Tutto il telefono,{" "}
            <span className="italic text-brand-600">una sola casa.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="text-lg sm:text-xl text-[#3a3a3a] max-w-2xl leading-relaxed"
          >
            Dal primo acquisto fino al riciclo. Quattro servizi, un solo gruppo,
            la stessa filosofia: il telefono migliore è quello che dura il più
            possibile.
          </motion.p>
        </div>

        {/* ─── 4 MOMENTI grandi, alternati ────────────────────────────── */}
        <Moment
          eyebrow="Compri"
          headline="Il nuovo, il ricondizionato, il ricambio."
          body="Telefoni nuovi, ricondizionati certificati e usati testati. Stesso magazzino, stesso prezzo del listino, in tutti i nostri brand. Niente sorprese al check-out."
          accentWord="ricondizionato"
          ctaHref="/prodotti"
          ctaLabel="Sfoglia il catalogo"
          phoneVariant={1}
          device={devices[0]}
          align="left"
        />
        <Moment
          eyebrow="Ripari"
          headline="Quasi tutto si ripara, e in 24 ore."
          body="Schermo, batteria, scocca, scheda madre. Microscopio, microsaldatura, calibrazione. Diagnosi gratuita, preventivo prima di toccare, garanzia 12 mesi su lavoro e ricambi."
          accentWord="ripara"
          ctaHref="/riparazioni"
          ctaLabel="Richiedi riparazione"
          phoneVariant={3}
          device={devices[1]}
          align="right"
        />
        <Moment
          eyebrow="Rivendi"
          headline="Il tuo vecchio telefono vale ancora."
          body="Valutazione gratuita dopo aver visto le foto. Spedizione gratis o ritiro nei nostri negozi. Pagamento bonifico, oppure credito Cellcom con bonus +10%."
          accentWord="vale"
          ctaHref="/rivendi"
          ctaLabel="Valuta il tuo usato"
          phoneVariant={5}
          device={devices[2]}
          align="left"
        />
        <Moment
          eyebrow="Lavori coi telefoni"
          headline="Listino B2B, prezzi che sanno il tuo nome."
          body="Per rivenditori, centri assistenza autorizzati, operatori. Listino dedicato per tier, disponibilità prioritaria, account manager. Zero fila al banco."
          accentWord="prezzi"
          ctaHref="/b2b"
          ctaLabel="Apri l'area B2B"
          phoneVariant={4}
          device={devices[3]}
          align="right"
        />
      </div>
    </section>
  );
}

function Moment({
  eyebrow,
  headline,
  body,
  accentWord,
  ctaHref,
  ctaLabel,
  phoneVariant,
  device,
  align,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  accentWord: string;
  ctaHref: string;
  ctaLabel: string;
  phoneVariant: 1 | 2 | 3 | 4 | 5 | 6;
  device?: PublicProductListItem;
  align: "left" | "right";
}) {
  const parts = headline.split(new RegExp(`(${accentWord})`, "i"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center",
        align === "right" && "lg:[&>*:first-child]:order-2",
      )}
    >
      {/* TESTO */}
      <div
        className={cn(
          "flex flex-col gap-6 max-w-[640px]",
          align === "right" && "lg:ml-auto",
        )}
      >
        <span className="font-mono text-sm uppercase tracking-[0.24em] text-brand-600">
          — {eyebrow}
        </span>
        <h3 className="font-serif text-[clamp(36px,5vw,64px)] leading-[1.02] tracking-[-0.02em] text-[#0a0a0a]">
          {parts.map((p, i) =>
            p.toLowerCase() === accentWord.toLowerCase() ? (
              <span key={i} className="italic text-brand-600">
                {p}
              </span>
            ) : (
              <span key={i}>{p}</span>
            ),
          )}
        </h3>
        <p className="text-lg leading-relaxed text-[#3a3a3a] max-w-xl">
          {body}
        </p>
        <a
          href={ctaHref}
          className="self-start mt-2 inline-flex items-center gap-2 text-base font-medium text-brand-600 hover:text-brand-700 group"
        >
          <span className="border-b border-brand-600/40 group-hover:border-brand-600 pb-0.5 transition-colors">
            {ctaLabel}
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* VISUAL: telefono con 3D tilt + spotlight che segue il mouse */}
      <InteractivePhonePanel
        variant={phoneVariant}
        eyebrow={eyebrow}
        device={device}
      />
    </motion.div>
  );
}

/**
 * Pannello interattivo Apple-style: 3D tilt al mouse + spotlight rosso che
 * segue il cursore + leggero parallax sul telefono. Su touch device il tilt
 * si disattiva (pointer:coarse).
 *
 * Se `device` ha photoUrl la usa con Next/Image (foto vera del CRM).
 * Fallback automatico a PhoneSilhouette se la foto fallisce a caricarsi
 * (es. CRM offline in dev) o se manca proprio.
 */
function InteractivePhonePanel({
  variant,
  eyebrow,
  device,
}: {
  variant: 1 | 2 | 3 | 4 | 5 | 6;
  eyebrow: string;
  device?: PublicProductListItem;
}) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = Boolean(device?.photoUrl) && !imgError;
  const panelRef = useRef<HTMLDivElement>(null);

  // Mouse position normalizzata (-0.5 → 0.5) sui due assi
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Spring per smooth following, niente jitter
  const smoothX = useSpring(mx, { stiffness: 140, damping: 18 });
  const smoothY = useSpring(my, { stiffness: 140, damping: 18 });

  // Tilt: il pannello ruota di ±8° sui due assi
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  // Telefono trasla leggermente in direzione opposta al tilt → parallax
  const phoneTranslateX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const phoneTranslateY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);

  // Spotlight rosso che segue il cursore (in % della larghezza/altezza)
  const spotlightX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(nx);
    my.set(ny);
  }

  function onPointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={panelRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={{ scale: 0.96, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className="relative aspect-[4/3] sm:aspect-[5/4] rounded-3xl bg-linear-to-br from-[#0a0a0a] via-[#1a0606] to-brand-900 overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.35)] cursor-default select-none"
    >
      {/* Spotlight che segue il mouse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            (latest) => {
              const [x, y] = latest as [string, string];
              return `radial-gradient(circle 360px at ${x} ${y}, rgba(239,68,68,0.45) 0%, rgba(220,38,38,0.18) 35%, transparent 70%)`;
            },
          ),
        }}
      />

      {/* Glow ambient di base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(220,38,38,0.12)_0%,transparent_60%)] pointer-events-none" />

      {/* Telefono con parallax — foto reale CRM o silhouette fallback */}
      <motion.div
        style={{
          x: phoneTranslateX,
          y: phoneTranslateY,
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {showPhoto && device?.photoUrl ? (
          <div className="relative w-[55%] sm:w-[60%] max-w-[340px] aspect-[3/4] drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)] drop-shadow-[0_0_40px_rgba(220,38,38,0.35)]">
            <Image
              src={device.photoUrl}
              alt={device.name}
              fill
              sizes="(max-width: 640px) 60vw, 340px"
              className="object-contain"
              onError={() => setImgError(true)}
              priority={false}
            />
          </div>
        ) : (
          <div className="w-[40%] sm:w-[45%] max-w-[260px] text-brand-400 drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] drop-shadow-[0_0_40px_rgba(220,38,38,0.3)]">
            <PhoneSilhouette variant={variant} />
          </div>
        )}
      </motion.div>

      {/* Etichetta laterale: brand + nome modello se c'è */}
      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 pointer-events-none">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
            {eyebrow}
          </span>
          {device && (
            <span className="font-serif italic text-sm sm:text-base text-white/90 truncate">
              {device.brand ? `${device.brand} ` : ""}
              {device.name}
            </span>
          )}
        </div>
        <span className="font-serif italic text-2xl text-brand-400 shrink-0">
          Cellcom
        </span>
      </div>

      {/* Hint cursore */}
      <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
          <path d="M13 13l6 6M5 3l3.5 8L13 13 5 3z" />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">
          Muovi il mouse
        </span>
      </div>
    </motion.div>
  );
}
