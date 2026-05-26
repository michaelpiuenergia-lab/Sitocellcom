import { cn } from "@/lib/utils/cn";

type HeadingTone = "default" | "ink-on-light";
type HeadingProps = {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "div";
  tone?: HeadingTone;
};

const COMMON =
  "text-foreground tracking-[-0.02em] leading-[1.05]";

export function Display({ children, className, as: Tag = "h1" }: HeadingProps) {
  return (
    <Tag
      className={cn("font-serif", COMMON, className)}
      style={{ fontSize: "var(--text-display)", lineHeight: 0.95 }}
    >
      {children}
    </Tag>
  );
}

export function H1({ children, className, as: Tag = "h1" }: HeadingProps) {
  return (
    <Tag
      className={cn("font-serif", COMMON, className)}
      style={{ fontSize: "var(--text-h1)", lineHeight: 1.02 }}
    >
      {children}
    </Tag>
  );
}

export function H2({ children, className, as: Tag = "h2" }: HeadingProps) {
  return (
    <Tag
      className={cn("font-serif", COMMON, className)}
      style={{ fontSize: "var(--text-h2)", lineHeight: 1.05 }}
    >
      {children}
    </Tag>
  );
}

export function H3({ children, className, as: Tag = "h3" }: HeadingProps) {
  return (
    <Tag
      className={cn("font-sans font-semibold text-foreground tracking-[-0.015em]", className)}
      style={{ fontSize: "var(--text-h3)", lineHeight: 1.2 }}
    >
      {children}
    </Tag>
  );
}

/** Accent in corsivo brand-red — usabile dentro le headline */
export function Accent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("italic text-brand-600", className)}>{children}</span>
  );
}
