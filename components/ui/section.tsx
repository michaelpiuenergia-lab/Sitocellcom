import { cn } from "@/lib/utils/cn";
import { Container } from "./container";

type Tone = "dark" | "light" | "ink";
type Pad = "none" | "sm" | "md" | "lg" | "xl";

type SectionProps = {
  children: React.ReactNode;
  tone?: Tone;
  pad?: Pad;
  size?: "sm" | "md" | "lg";
  bleed?: boolean;
  className?: string;
  innerClassName?: string;
  id?: string;
};

const PAD_CLASS: Record<Pad, string> = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32",
  xl: "py-32 md:py-44",
};

export function Section({
  children,
  tone = "dark",
  pad = "lg",
  size = "lg",
  bleed = false,
  className,
  innerClassName,
  id,
}: SectionProps) {
  const themeAttr = tone === "dark" ? undefined : tone;

  return (
    <section
      id={id}
      data-theme={themeAttr}
      className={cn(
        "relative bg-background text-foreground",
        PAD_CLASS[pad],
        className,
      )}
    >
      {bleed ? (
        <div className={innerClassName}>{children}</div>
      ) : (
        <Container size={size} className={innerClassName}>
          {children}
        </Container>
      )}
    </section>
  );
}
