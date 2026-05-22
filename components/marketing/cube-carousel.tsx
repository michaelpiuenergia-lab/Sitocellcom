"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneSilhouette } from "./phone-silhouette";
import { CUBE, EASE, DURATION } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/crm-client/mocks/products";
import type { PublicProductListItem } from "@/lib/crm-client/types";
import styles from "./cube-carousel.module.css";

const CHANNEL_LABELS: Record<string, string> = {
  cellcom: "Cellcom B2B",
  italianparts: "ItalianParts",
  fastfix: "Fast-Fix Store",
};

const CONDITION_LABELS: Record<string, string> = {
  new: "Nuovo",
  used: "Usato",
  refurbished: "Ricondizionato",
};

function buildConditionLabel(p: PublicProductListItem): string {
  const cond = p.condition ? CONDITION_LABELS[p.condition] : null;
  const channel = CHANNEL_LABELS[p.channel] ?? p.channel;
  return cond ? `${cond} · ${channel}` : channel;
}

function buildStockLabel(p: PublicProductListItem): {
  label: string;
  cls: "" | "low" | "out";
} {
  if (p.stock.count === 0) return { label: "Esaurito", cls: "out" };
  if (!p.stock.capped && p.stock.count <= 3)
    return { label: `Ultimi ${p.stock.count} pezzi`, cls: "low" };
  return { label: "Disponibile", cls: "" };
}

interface CubeCarouselProps {
  devices?: PublicProductListItem[];
}

export function CubeCarousel({ devices = [] }: CubeCarouselProps) {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [captionKey, setCaptionKey] = useState(0);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (targetIndex: number) => {
      const prevIdx = currentIndex;
      const idx = ((targetIndex % 6) + 6) % 6;
      let diff = idx - prevIdx;
      if (Math.abs(diff) > 3) {
        diff = diff > 0 ? diff - 6 : diff + 6;
      }
      const newRotation = currentRotation + diff * CUBE.angleStep;
      setCurrentRotation(newRotation);
      setCurrentIndex(idx);
      setCaptionKey((k) => k + 1);
    },
    [currentIndex, currentRotation]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  const startAuto = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      if (!isPaused && !isDragging) {
        next();
      }
    }, CUBE.autoInterval);
  }, [isPaused, isDragging, next]);

  const stopAuto = useCallback(() => {
    if (autoTimer.current) {
      clearInterval(autoTimer.current);
      autoTimer.current = null;
    }
  }, []);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [startAuto, stopAuto]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        next();
        startAuto();
      }
      if (e.key === "ArrowLeft") {
        prev();
        startAuto();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, startAuto]);

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStartX.current = e.clientX;
    dragStartRotation.current = currentRotation;
    stopAuto();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    const newRot = dragStartRotation.current + dx * 0.4;
    setCurrentRotation(newRot);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const nearestIdx = Math.round(currentRotation / CUBE.angleStep);
    const snappedRotation = nearestIdx * CUBE.angleStep;
    const snappedIndex = ((nearestIdx % 6) + 6) % 6;
    setCurrentRotation(snappedRotation);
    setCurrentIndex(snappedIndex);
    setCaptionKey((k) => k + 1);
    startAuto();
  };

  const device = devices[currentIndex];
  const stockInfo = device ? buildStockLabel(device) : null;
  const condLabel = device ? buildConditionLabel(device) : null;
  const hasDevices = devices.length > 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className={styles["cube-stage"]}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className={cn(styles.cube, isDragging && styles.dragging)}
          style={{
            transform: `rotateY(${-currentRotation}deg)`,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const faceDevice = hasDevices ? devices[i % devices.length] : null;
            return (
              <div
                key={i}
                className={styles.face}
                style={{
                  transform: `rotateY(${i * 60}deg) translateZ(${CUBE.depth}px)`,
                }}
              >
                {faceDevice?.photoUrl ? (
                  <div className="relative w-[78%] h-[78%] flex items-center justify-center" style={{ zIndex: 2 }}>
                    <Image
                      src={faceDevice.photoUrl}
                      alt={faceDevice.name}
                      fill
                      sizes="320px"
                      className="object-contain"
                      style={{
                        filter:
                          "drop-shadow(0 20px 25px rgba(0,0,0,0.35)) drop-shadow(0 8px 10px rgba(0,0,0,0.25))",
                      }}
                      priority={i === 0}
                    />
                  </div>
                ) : (
                  <PhoneSilhouette variant={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption */}
      <AnimatePresence mode="wait">
        <motion.div
          key={captionKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: DURATION.fast, ease: EASE.smooth }}
          className="border-l-2 border-brand-600 pl-4 min-h-[100px] w-full max-w-sm"
        >
          {device && stockInfo && condLabel ? (
            <>
              <div className="font-mono text-[10px] text-brand-500 uppercase tracking-[0.15em] mb-1.5">
                {condLabel}
              </div>
              <div className="font-serif text-[18px] italic text-foreground leading-tight mb-2 line-clamp-1" title={device.name}>
                {device.name}
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-mono text-xl font-medium text-foreground tabular-nums">
                  {formatPrice(device.priceCents)}
                </span>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-[0.1em] font-sans",
                    stockInfo.cls === "low"
                      ? "text-yellow-400"
                      : stockInfo.cls === "out"
                        ? "text-brand-500"
                        : "text-green-400",
                  )}
                >
                  {stockInfo.label}
                </span>
              </div>
            </>
          ) : (
            <div className="font-serif italic text-muted-foreground">
              Catalogo in caricamento…
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-5">
        <button
          className="w-11 h-11 rounded-full bg-card border border-border text-foreground flex items-center justify-center cursor-pointer transition-all duration-200 ease-snappy hover:bg-card-hover hover:border-brand-600 hover:text-brand-500 hover:scale-[1.08]"
          onClick={() => {
            prev();
            startAuto();
          }}
          aria-label="Precedente"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const d = hasDevices ? devices[i % devices.length] : null;
            return (
              <button
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 ease-smooth cursor-pointer",
                  i === currentIndex
                    ? "bg-brand-600 w-6 shadow-[0_0_12px_rgba(220,38,38,0.6)]"
                    : "bg-border w-1.5 hover:bg-neutral-700",
                )}
                onClick={() => {
                  goTo(i);
                  startAuto();
                }}
                aria-label={d ? `Vai a ${d.name}` : `Modello ${i + 1}`}
              />
            );
          })}
        </div>

        <button
          className="w-11 h-11 rounded-full bg-card border border-border text-foreground flex items-center justify-center cursor-pointer transition-all duration-200 ease-snappy hover:bg-card-hover hover:border-brand-600 hover:text-brand-500 hover:scale-[1.08]"
          onClick={() => {
            next();
            startAuto();
          }}
          aria-label="Successivo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
}
