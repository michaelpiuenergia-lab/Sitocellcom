import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Display, Accent } from "@/components/ui/heading";

type Metric = { label: string; value: string };
type Trust = { label: string; icon: ReactNode };

type CatalogHeroProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description: string;
  /** Metriche numeriche (conteggi). Mostrate come banda di stat sotto l'header. */
  metrics?: Metric[];
  /** Riga garanzie (icona + label). Alternativa alle metriche, per pagine
   *  dove i conteggi sarebbero spesso 0 (es. usato). Ha priorità su metrics. */
  trust?: Trust[];
};

export function CatalogHero({
  eyebrow,
  title,
  accent,
  description,
  metrics,
  trust,
}: CatalogHeroProps) {
  return (
    <Container className="pt-14 pb-10 lg:pt-20 lg:pb-14">
      {/* Header: un solo elemento focale (titolo display), supporto sobrio */}
      <div className="flex flex-col gap-5 max-w-3xl">
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
        <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-[58ch]">
          {description}
        </p>
      </div>

      {trust && trust.length > 0 ? (
        <ul className="mt-10 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {trust.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5"
            >
              <span className="shrink-0 text-brand-600" aria-hidden>
                {item.icon}
              </span>
              <span className="text-sm font-medium leading-tight text-foreground">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      ) : metrics && metrics.length > 0 ? (
        <dl className="mt-10 lg:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 border-t border-border pt-8">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-1.5">
              <dd className="font-sans font-semibold tabular-nums tracking-tight text-foreground text-[clamp(28px,3.4vw,38px)] leading-none">
                {m.value}
              </dd>
              <dt className="font-mono uppercase text-[11px] tracking-[0.18em] text-muted-foreground">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>
      ) : null}
    </Container>
  );
}
