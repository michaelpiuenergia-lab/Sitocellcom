"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
  badge?: string;
  ctaLabel: string;
}

function TiltCard({ icon, title, description, href, external, disabled, badge, ctaLabel }: ServiceCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const shouldReduce = useReducedMotion();

  const onMouseMove = (e: React.MouseEvent) => {
    if (shouldReduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: y * -6, y: x * 6 });
  };

  const onMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <a
      ref={ref}
      href={disabled ? undefined : href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card transition-colors duration-300",
        "hover:bg-card-hover hover:border-brand-600/30 hover:shadow-[0_8px_32px_-8px_rgba(220,38,38,0.15)]",
        disabled && "pointer-events-none opacity-60"
      )}
      style={{
        transform: shouldReduce
          ? undefined
          : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out, background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {badge && (
        <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-brand-900/60 text-[10px] font-mono uppercase tracking-wider text-brand-400 border border-brand-800">
          {badge}
        </span>
      )}
      <div className="w-10 h-10 rounded-lg bg-brand-600/10 border border-brand-600/20 flex items-center justify-center text-brand-500 group-hover:text-brand-400 group-hover:border-brand-600/40 transition-colors duration-300">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-xl italic text-foreground group-hover:text-brand-500 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-brand-500 group-hover:text-brand-400 transition-colors duration-300">
        {ctaLabel}
        <span className="transition-transform duration-300 ease-snappy group-hover:translate-x-1">
          {disabled ? "→" : external ? "↗" : "→"}
        </span>
      </span>
    </a>
  );
}

const services: ServiceCardProps[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    title: "Compra",
    description: "Smartphone, tablet e accessori dai cinque brand del Gruppo. Oltre 20.000 prodotti, disponibilità verificata in magazzino, spedizione in 24-48 ore.",
    href: "/prodotti",
    ctaLabel: "Scopri",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Ripara",
    description: "Schermo, batteria, scheda madre. Riparazione professionale con garanzia 12 mesi sui ricambi e tracciamento ticket online.",
    href: "/riparazioni",
    ctaLabel: "Traccia la tua",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: "Impara",
    description: "Corsi di riparazione smartphone per professionisti e curiosi. Dal saper aprire un device alla microsaldatura BGA.",
    href: "https://smartphonefix.it",
    external: true,
    ctaLabel: "Vai ai corsi",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    title: "Rivendi",
    description: "Valuta il tuo vecchio device in 60 secondi e ritira credito sull'acquisto del nuovo.",
    href: "#",
    disabled: true,
    ctaLabel: "Disponibile a breve",
  },
];

export function ServiceCards() {
  return (
    <section className="py-24 px-6 lg:px-16 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: DURATION.slow,
              ease: EASE.smooth,
              delay: i * 0.1,
            }}
          >
            <TiltCard {...s} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
