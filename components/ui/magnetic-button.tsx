"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  href?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className,
  variant = "primary",
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (shouldReduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    x.set(cx * 0.2);
    y.set(cy * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const baseClasses =
    "relative inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] font-sans font-semibold text-[15px] cursor-pointer border-none overflow-hidden isolate transition-shadow duration-300";

  const primaryClasses =
    "bg-linear-to-br from-brand-600 to-brand-800 text-white shadow-[0_0_0_0_rgba(220,38,38,0)] hover:shadow-[0_8px_32px_-8px_rgba(220,38,38,0.6),0_0_0_1px_rgba(248,113,113,0.3)]";

  const ghostClasses =
    "bg-transparent text-foreground border border-border hover:border-brand-600 hover:bg-brand-600/5";

  const combined = cn(
    baseClasses,
    variant === "primary" ? primaryClasses : ghostClasses,
    className
  );

  const inner = (
    <>
      {variant === "primary" && (
        <span
          className={cn(
            "absolute inset-0 bg-linear-to-br from-brand-500 to-brand-700 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
          style={{ zIndex: -1 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={combined}
        style={{ x: shouldReduce ? 0 : springX, y: shouldReduce ? 0 : springY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={combined}
      style={{ x: shouldReduce ? 0 : springX, y: shouldReduce ? 0 : springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {inner}
    </motion.button>
  );
}
