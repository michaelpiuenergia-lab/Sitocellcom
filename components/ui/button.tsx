"use client";

import { forwardRef, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  /** Aggiunge il pull magnetico al mouse (solo se shouldReduce è false) */
  magnetic?: boolean;
  /** Striscia bianca diagonale che scorre al hover. Solo per primary. */
  shine?: boolean;
  /** Slot fine, es. freccia → */
  iconEnd?: React.ReactNode;
  /** Slot inizio */
  iconStart?: React.ReactNode;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

type ButtonAsLink = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-6 text-[15px] gap-2",
  lg: "h-14 px-8 text-[17px] gap-2.5",
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white border border-brand-600 hover:bg-brand-500 hover:border-brand-500 font-semibold",
  secondary:
    "bg-transparent text-foreground border border-border hover:border-brand-600 hover:bg-brand-600/5 font-medium",
  ghost:
    "bg-transparent text-foreground hover:bg-foreground/5 font-medium border border-transparent",
  link:
    "bg-transparent text-brand-600 hover:text-brand-500 font-medium px-0 h-auto border border-transparent",
};

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  props,
  forwardedRef,
) {
  const {
    children,
    className,
    variant = "primary",
    size = "md",
    magnetic = false,
    shine = false,
    iconEnd,
    iconStart,
  } = props;

  const internalRef = useRef<HTMLElement | null>(null);
  const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLElement>;
  const shouldReduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const motionEnabled = magnetic && !shouldReduce;

  const onPointerMove = (e: React.MouseEvent) => {
    if (!motionEnabled || !ref.current) return;
    const rect = (ref.current as HTMLElement).getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cls = cn(
    "relative inline-flex items-center justify-center rounded-[10px] transition-colors duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-brand-600/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background select-none",
    SIZE_CLASS[size],
    VARIANT_CLASS[variant],
    variant === "primary" && shine && "btn-shine",
    "disabled" in props && props.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className,
  );

  const motionStyle = motionEnabled
    ? { x: springX, y: springY }
    : undefined;

  const inner = (
    <>
      {iconStart && <span aria-hidden>{iconStart}</span>}
      <span className="relative z-10">{children}</span>
      {iconEnd && (
        <span aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
          {iconEnd}
        </span>
      )}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        className={cn(cls, "group")}
        style={motionStyle}
        onMouseMove={onPointerMove}
        onMouseLeave={onPointerLeave}
      >
        {inner}
      </motion.a>
    );
  }

  const { type = "button", disabled, onClick } = props as ButtonAsButton;
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(cls, "group")}
      style={motionStyle}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
    >
      {inner}
    </motion.button>
  );
});
