"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils/cn";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Intensità dello spotlight (0..1). Default 0.30 */
  intensity?: number;
  /** Raggio dello spotlight in px. Default 360 */
  radius?: number;
  /** Tilt 3D al mouse */
  tilt?: boolean;
  href?: string;
  onClick?: () => void;
};

/**
 * Card nera con spotlight rosso brand che segue il mouse.
 * Pattern usato per le sezioni cinematic (Lifecycle phone panel,
 * IntakeOptions, scelta riparazione, ecc.).
 */
export function SpotlightCard({
  children,
  className,
  intensity = 0.3,
  radius = 360,
  tilt = false,
  href,
  onClick,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smoothX = useSpring(mx, { stiffness: 160, damping: 22 });
  const smoothY = useSpring(my, { stiffness: 160, damping: 22 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], tilt ? [4, -4] : [0, 0]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], tilt ? [-6, 6] : [0, 0]);

  const spotlightX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  const background = useTransform(
    [spotlightX, spotlightY],
    (latest) => {
      const [x, y] = latest as [string, string];
      return `radial-gradient(circle ${radius}px at ${x} ${y}, rgba(220,38,38,${intensity}) 0%, transparent 65%)`;
    },
  );

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onPointerLeave() {
    mx.set(0);
    my.set(0);
  }

  const Inner = href ? motion.a : motion.div;
  const innerProps = href ? { href } : { onClick };

  return (
    <Inner
      {...(innerProps as object)}
      ref={ref as React.RefObject<HTMLDivElement & HTMLAnchorElement>}
      onPointerMove={onPointerMove as React.PointerEventHandler<HTMLDivElement & HTMLAnchorElement>}
      onPointerLeave={onPointerLeave}
      style={
        tilt
          ? {
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }
          : undefined
      }
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-ink transition-colors duration-300",
        "hover:border-brand-600/40",
        (href || onClick) && "cursor-pointer block",
        className,
      )}
    >
      {/* Spotlight cursore */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background }}
      />
      {/* Contenuto */}
      <div className="relative">{children}</div>
    </Inner>
  );
}
