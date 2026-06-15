"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { PhoneSilhouette } from "./phone-silhouette";
import type { PublicProductListItem } from "@/lib/crm-client/types";
import { useLang } from "@/lib/i18n/lang-context";

// Modello GLB Samsung Galaxy (1.5MB) + Three.js pesante (~300KB gz) →
// dynamic import + SSR off per non bloccare il first paint.
// Loading placeholder visibile così l'utente capisce che sta caricando.
const Phone3D = dynamic(() => import("./phone-3d").then((m) => m.Phone3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-brand-400">
        <div className="w-10 h-10 rounded-full border-2 border-brand-600/30 border-t-brand-600 animate-spin" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
          Caricamento 3D…
        </span>
      </div>
    </div>
  ),
});

/**
 * ImmersivePin — scena sticky-pinned Apple-style.
 *
 * Il contenitore è alto ~300vh, dentro un sticky top-0 h-screen che resta
 * fermo mentre si scrolla. Tre "momenti" testuali si dissolvono in sequenza
 * mentre il telefono al centro ruota di 360° e cambia scala. Lo sfondo vira
 * dal nero profondo al cremisi sul rosso brand. Mouse tracking aggiunge un
 * 3D tilt sopra il movimento scroll-driven — il telefono sembra "vivo".
 *
 * Si attiva al primo entry nel viewport, finisce quando si esce.
 * On mobile/touch il tilt è ridotto al minimo (no mouseover effettivo).
 */
export function ImmersivePin({
  device,
}: {
  device?: PublicProductListItem;
}) {
  const { t } = useLang();
  const containerRef = useRef<HTMLElement>(null);

  // Monta il 3D (dynamic ssr:false) solo dopo il primo commit. Senza questo,
  // l'import dinamico può risolversi DURANTE il render iniziale e React 19
  // emette il warning "state update on a component that hasn't mounted yet".
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Scroll progress sull'intero contenitore (h=300vh) da 0 → 1
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth con spring per niente jitter
  const sp = useSpring(scrollYProgress, { stiffness: 100, damping: 26 });

  // Scroll-driven: rotazione 360° sull'asse Y + scale + y.
  // Start a 0° (frontale, vedi schermo); finisce a 360° (giro completo).
  const phoneRotateY = useTransform(sp, [0, 1], [0, 360]);
  const phoneScale = useTransform(sp, [0, 0.5, 1], [0.85, 1.15, 0.95]);
  const phoneY = useTransform(sp, [0, 0.5, 1], ["8%", "0%", "-6%"]);

  // 3 momenti di testo che si dissolvono in sequenza
  // Ognuno appare per ~33% dello scroll
  const opacity1 = useTransform(sp, [0, 0.05, 0.28, 0.36], [0, 1, 1, 0]);
  const y1 = useTransform(sp, [0, 0.1, 0.36], ["20px", "0px", "-20px"]);

  const opacity2 = useTransform(sp, [0.32, 0.4, 0.6, 0.68], [0, 1, 1, 0]);
  const y2 = useTransform(sp, [0.32, 0.4, 0.68], ["20px", "0px", "-20px"]);

  const opacity3 = useTransform(sp, [0.64, 0.72, 0.95, 1], [0, 1, 1, 1]);
  const y3 = useTransform(sp, [0.64, 0.72, 1], ["20px", "0px", "0px"]);

  // Sfondo che vira: cremisi scuro → rosso → rosso acceso e RESTA acceso.
  // Parte già caldo (non nero) così la scena ha colore fin dal primo frame.
  // Niente reverse a fine sezione: la prossima zona della pagina raccoglie
  // la temperatura calda con un bridge gradient.
  const bgColor = useTransform(
    sp,
    [0, 0.3, 0.6, 1],
    ["#240608", "#3a0809", "#4d0b0b", "#5e0d0d"],
  );
  const glowOpacity = useTransform(sp, [0, 0.4, 0.75, 1], [0.6, 0.9, 1, 1]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "300vh" }}
      aria-label="Scopri Cellcom"
    >
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Glow ambient che pulsa con lo scroll */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(220,38,38,0.4)_0%,rgba(220,38,38,0.15)_35%,transparent_70%)] pointer-events-none"
        />

        {/* Particle dots (statiche, look stellare) */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-1 h-1 rounded-full bg-white/40" />
          <div className="absolute top-[30%] left-[80%] w-0.5 h-0.5 rounded-full bg-white/50" />
          <div className="absolute top-[60%] left-[10%] w-0.5 h-0.5 rounded-full bg-brand-400/60" />
          <div className="absolute top-[70%] left-[85%] w-1 h-1 rounded-full bg-white/30" />
          <div className="absolute top-[40%] left-[50%] w-0.5 h-0.5 rounded-full bg-brand-400/40" />
          <div className="absolute top-[15%] left-[40%] w-0.5 h-0.5 rounded-full bg-white/30" />
          <div className="absolute top-[80%] left-[60%] w-1 h-1 rounded-full bg-brand-400/50" />
        </div>

        {/* Samsung Galaxy 3D, dimensioni contenute così non invade la
            tipografia della sezione. */}
        <motion.div
          style={{
            scale: phoneScale,
            y: phoneY,
          }}
          className="relative z-10 w-[280px] sm:w-[360px] md:w-[420px] h-[520px]"
        >
          {mounted && <Phone3D rotationDeg={phoneRotateY} />}
          <noscript>
            <div className="absolute inset-0 flex items-center justify-center text-brand-400">
              <PhoneSilhouette variant={1} />
            </div>
          </noscript>
        </motion.div>

        {/* MOMENTI TESTUALI — 3 in sequenza, cross-fade scroll-driven */}
        <div className="absolute inset-0 z-20 flex items-end justify-center pb-20 lg:pb-28 px-6 pointer-events-none">
          <div className="relative w-full max-w-4xl text-center">
            {/* MOMENTO 1 */}
            <motion.div
              style={{ opacity: opacity1, y: y1 }}
              className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3"
            >
              <span className="font-mono text-xs uppercase tracking-[0.32em] text-brand-400">
                {t("immersive.m1.eyebrow")}
              </span>
              <h2 className="font-serif text-[clamp(40px,7vw,96px)] leading-[0.95] tracking-[-0.02em] text-white max-w-[18ch]">
                {t("immersive.m1.titleA")}{" "}
                <span className="italic text-brand-400">{t("immersive.m1.italic")}</span>
              </h2>
              <p className="text-base sm:text-lg text-white/60 max-w-xl mt-2">
                {t("immersive.m1.body")}
              </p>
            </motion.div>

            {/* MOMENTO 2 */}
            <motion.div
              style={{ opacity: opacity2, y: y2 }}
              className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3"
            >
              <span className="font-mono text-xs uppercase tracking-[0.32em] text-brand-400">
                {t("immersive.m2.eyebrow")}
              </span>
              <h2 className="font-serif text-[clamp(40px,7vw,96px)] leading-[0.95] tracking-[-0.02em] text-white max-w-[18ch]">
                {t("immersive.m2.titleA")} <span className="italic text-brand-400">{t("immersive.m2.italic")}</span>{t("immersive.m2.titleB")}
              </h2>
              <p className="text-base sm:text-lg text-white/60 max-w-xl mt-2">
                {t("immersive.m2.body")}
              </p>
            </motion.div>

            {/* MOMENTO 3 */}
            <motion.div
              style={{ opacity: opacity3, y: y3 }}
              className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4"
            >
              <span className="font-mono text-xs uppercase tracking-[0.32em] text-brand-400">
                {t("immersive.m3.eyebrow")}
              </span>
              <h2 className="font-serif text-[clamp(40px,7vw,96px)] leading-[0.95] tracking-[-0.02em] text-white max-w-[18ch]">
                <span className="italic text-brand-400">{t("immersive.m3.italic")}</span> {t("immersive.m3.titleA")}
              </h2>
              <p className="text-base sm:text-lg text-white/60 max-w-xl mt-2">
                {t("immersive.m3.body")}
              </p>
              <a
                href="/rivendi"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0a0a0a] text-sm font-semibold hover:bg-brand-400 hover:text-white transition-colors duration-300 pointer-events-auto"
              >
                {t("immersive.m3.cta")}
                <span aria-hidden>→</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint in alto, sparisce a fine sezione */}
        <motion.div
          style={{
            opacity: useTransform(sp, [0, 0.1, 0.85, 1], [1, 1, 0, 0]),
          }}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            {t("immersive.scrollHint")}
          </span>
          <div className="w-px h-12 bg-linear-to-b from-white/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
