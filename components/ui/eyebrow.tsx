import { cn } from "@/lib/utils/cn";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "muted";
  icon?: React.ReactNode;
};

export function Eyebrow({
  children,
  className,
  tone = "brand",
  icon,
}: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono uppercase",
        tone === "brand" ? "text-brand-600" : "text-muted-foreground",
        className,
      )}
      style={{
        fontSize: "var(--text-eyebrow)",
        letterSpacing: "0.28em",
        lineHeight: 1,
      }}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {children}
    </span>
  );
}
