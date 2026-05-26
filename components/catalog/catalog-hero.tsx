import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Display, Accent } from "@/components/ui/heading";

type CatalogHeroProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description: string;
  metrics?: { label: string; value: string }[];
};

export function CatalogHero({
  eyebrow,
  title,
  accent,
  description,
  metrics,
}: CatalogHeroProps) {
  return (
    <Container className="pt-16 pb-12 lg:pt-24 lg:pb-16">
      <div className="grid lg:grid-cols-[1.4fr,1fr] gap-12 items-end">
        <div className="flex flex-col gap-6 max-w-3xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <Display as="h1">
            {title}
            {accent && (
              <>
                {" "}
                <Accent>{accent}</Accent>
              </>
            )}
          </Display>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>
        {metrics && metrics.length > 0 && (
          <dl className="grid grid-cols-2 gap-y-6 gap-x-4 lg:pb-2">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <dd className="font-serif text-[clamp(36px,4vw,56px)] leading-none text-foreground tabular-nums">
                  {m.value}
                </dd>
                <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  {m.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Container>
  );
}
