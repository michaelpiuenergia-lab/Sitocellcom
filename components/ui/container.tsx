import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  as?: "div" | "section" | "article";
};

const SIZE_CLASS = {
  sm: "max-w-[960px]",
  md: "max-w-[1280px]",
  lg: "max-w-[1400px]",
} as const;

export function Container({
  children,
  className,
  size = "lg",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto px-6 lg:px-12", SIZE_CLASS[size], className)}
    >
      {children}
    </Tag>
  );
}
