import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  hover?: boolean;
  as?: "div" | "article" | "a";
  href?: string;
};

export function Card({
  children,
  className,
  accent = false,
  hover = false,
  as = "div",
  href,
}: CardProps) {
  const Tag = (href ? "a" : as) as "a" | "div" | "article";
  const tagProps = href ? { href } : {};

  return (
    <Tag
      {...tagProps}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card transition-colors duration-200",
        accent ? "border-brand-600/40" : "border-border",
        hover && "hover:border-brand-600/40 hover:bg-card-hover",
        href && "cursor-pointer",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

type ChipProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "brand" | "ink" | "outline";
  size?: "sm" | "md";
  as?: "span" | "button" | "a";
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

const CHIP_SIZE: Record<NonNullable<ChipProps["size"]>, string> = {
  sm: "h-6 px-2.5 text-[10px] tracking-[0.18em]",
  md: "h-7 px-3 text-[11px] tracking-[0.18em]",
};

const CHIP_TONE: Record<NonNullable<ChipProps["tone"]>, string> = {
  neutral: "bg-card-hover text-muted-foreground border-border",
  brand: "bg-brand-600 text-white border-brand-600",
  ink: "bg-foreground text-background border-foreground",
  outline: "bg-transparent text-foreground border-border",
};

export function Chip({
  children,
  className,
  tone = "neutral",
  size = "sm",
  as = "span",
  href,
  onClick,
  active,
}: ChipProps) {
  const Tag = (href ? "a" : as) as "a" | "span" | "button";
  const tagProps: Record<string, unknown> = {};
  if (href) tagProps.href = href;
  if (onClick) tagProps.onClick = onClick;
  if (as === "button" || onClick) tagProps.type = "button";

  return (
    <Tag
      {...tagProps}
      className={cn(
        "inline-flex items-center font-mono uppercase rounded-full border transition-colors duration-200",
        CHIP_SIZE[size],
        active ? CHIP_TONE.brand : CHIP_TONE[tone],
        (href || onClick) && !active && "hover:border-brand-600/40 cursor-pointer",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
