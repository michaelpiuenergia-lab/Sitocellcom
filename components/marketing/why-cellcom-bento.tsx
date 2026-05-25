"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

/**
 * Bento grid asimmetrica "Perché Cellcom". Spezza la monotonia visiva tra
 * stats strip e service cards aggiungendo VARIETÀ di contenuto: tile di
 * formato diverso, icone, micro-grafici.
 *
 * Layout responsive: 1 colonna mobile, 6-column grid desktop con span variabili.
 */

type IconType =
  | "shield"
  | "truck"
  | "live"
  | "tools"
  | "leaf"
  | "star"
  | "lock";

function Icon({ type, className }: { type: IconType; className?: string }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (type) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "live":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="10" opacity="0.5" />
        </svg>
      );
    case "tools":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M6 3h12v6a9 9 0 0 1-9 9 9 9 0 0 1-9-9V3z" transform="translate(3,0)" />
          <path d="M9 21V12" transform="translate(3,0)" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
  }
}

type Tile = {
  span: string;
  rowSpan?: string;
  title: string;
  description?: string;
  icon?: IconType;
  highlight?: string; // numero/cifra grande
  highlightUnit?: string;
  accent?: boolean;
  footer?: string;
  href?: string;
};

const TILES: Tile[] = [
  {
    span: "md:col-span-2 md:row-span-2",
    title: "Garanzia 12 mesi su ogni riparazione",
    description:
      "Schermo, batteria, scheda madre, vetro posteriore. Lavoriamo con ricambi originali quando disponibili e ricondizionati certificati negli altri casi — mai con componenti generici di provenienza ignota. Se il problema si ripresenta entro un anno, lo risolviamo gratis: la garanzia copre il ricambio E la manodopera.",
    icon: "shield",
    accent: true,
    footer: "Estensione fino a 24 mesi disponibile su richiesta",
  },
  {
    span: "md:col-span-2",
    title: "Spedizione",
    highlight: "24-48",
    highlightUnit: "h",
    description:
      "Su tutto il territorio italiano, tracking live dal nostro gestionale. Ordini entro le 15:00 partono in giornata. Ritiro gratuito nei punti vendita.",
    icon: "truck",
  },
  {
    span: "md:col-span-2",
    title: "Disponibilità verificata",
    highlight: "100",
    highlightUnit: "%",
    description:
      "Lo stock che vedi sul sito è quello che hai in mano: i nostri 5 canali condividono lo stesso magazzino. Niente sorprese al check-out, niente \"esaurito\" che spunta dopo il pagamento.",
    icon: "live",
  },
  {
    span: "md:col-span-3",
    title: "Tecnici formati alla SmartphoneFix Academy",
    description:
      "I nostri operatori passano dalla nostra scuola di riparazione interna prima di toccare un device cliente. Calibrazione True Tone, postazioni ESD, microscopio, microsaldatura BGA: la stessa strumentazione che insegniamo nei corsi avanzati.",
    icon: "tools",
    footer: "Continuamente aggiornati su iPhone, Samsung, Xiaomi",
  },
  {
    span: "md:col-span-3",
    title: "Dati protetti, telefono sigillato",
    description:
      "Quando ci consegni il telefono lo sigilliamo in busta numerata davanti a te. I tuoi dati non vengono toccati: il device resta acceso solo per i test funzionali necessari, sotto la nostra responsabilità. Non chiediamo MAI il PIN se non strettamente necessario alla diagnosi.",
    icon: "lock",
  },
  {
    span: "md:col-span-6",
    title: "Sei un rivenditore, un operatore o un'azienda?",
    description:
      "Apri un account B2B e accedi al listino riservato: prezzi dedicati per tier, disponibilità prioritaria, condizioni di pagamento personalizzate, account manager dedicato. Le credenziali si richiedono direttamente al nostro ufficio commerciale — risposta entro 24 ore lavorative.",
    icon: "star",
    accent: true,
    footer: "Accedi all'area B2B →",
    href: "/b2b",
  },
];

export function WhyCellcomBento() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="relative max-w-[1600px] mx-auto px-6 lg:px-16 py-24">
      <div className="flex flex-col gap-3 mb-12 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.24em] text-brand-500">
          <span className="text-brand-600">◢</span> Perché comprare e riparare da noi
        </span>
        <h2 className="font-serif text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.02em] text-foreground">
          Quello che ti aspetti da un negozio serio,{" "}
          <span className="italic shimmer-ruby">messo per iscritto</span>.
        </h2>
        <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
          Prezzi chiari, ricambi tracciati, garanzia 12 mesi su ogni intervento,
          tecnici formati nella nostra Academy. Stessi standard se sei un
          privato che compra un telefono, un cliente che porta un dispositivo in
          riparazione, o un'azienda che ordina a volumi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-fr gap-4">
        {TILES.map((tile, i) => {
          const Wrapper = (tile.href ? "a" : "div") as "a" | "div";
          const wrapperProps = tile.href ? { href: tile.href } : {};
          return (
          <motion.div
            key={tile.title}
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: DURATION.normal,
              ease: EASE.smooth,
              delay: i * 0.06,
            }}
            className={cn(tile.span, tile.rowSpan ?? "")}
          >
          <Wrapper
            {...wrapperProps}
            className={cn(
              "relative group overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 h-full flex",
              "hover:bg-card-hover hover:-translate-y-0.5",
              tile.accent
                ? "border-brand-600/40 hover:border-brand-500 hover:shadow-[0_18px_48px_-18px_rgba(220,38,38,0.45)]"
                : "border-border hover:border-brand-600/30 hover:shadow-[0_12px_36px_-16px_rgba(220,38,38,0.30)]",
              tile.href && "cursor-pointer",
            )}
          >
            {tile.accent && (
              <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-600/12 blur-3xl" />
            )}
            <div className="relative flex flex-col h-full gap-4">
              {tile.icon && (
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl border flex items-center justify-center transition-colors",
                    tile.accent
                      ? "border-brand-600/40 bg-brand-600/10 text-brand-400"
                      : "border-border bg-popover text-brand-500 group-hover:border-brand-600/30",
                  )}
                >
                  <Icon type={tile.icon} />
                </div>
              )}
              {tile.highlight && (
                <div className="flex items-baseline gap-1 leading-none">
                  <span className="font-serif text-[clamp(38px,4.5vw,56px)] text-brand-500 tabular-nums">
                    {tile.highlight}
                  </span>
                  {tile.highlightUnit && (
                    <span className="font-mono text-xl text-muted-foreground">
                      {tile.highlightUnit}
                    </span>
                  )}
                </div>
              )}
              <h3 className="font-serif text-xl italic text-foreground">
                {tile.title}
              </h3>
              {tile.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tile.description}
                </p>
              )}
              {tile.footer && (
                <div className="mt-auto pt-2 border-t border-border/60">
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider",
                      tile.href
                        ? "text-brand-500 group-hover:text-brand-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {tile.footer}
                  </span>
                </div>
              )}
            </div>
          </Wrapper>
          </motion.div>
          );
        })}
      </div>
    </section>
  );
}
