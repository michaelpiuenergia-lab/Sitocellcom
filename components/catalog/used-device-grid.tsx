"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { UsedDevice, UsedDeviceCondition } from "@/lib/crm-client/types";
import { PhoneSilhouette } from "@/components/marketing/phone-silhouette";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";
import { Chip } from "@/components/ui/card";
import { RequestTrigger } from "@/components/forms/request-trigger";

const conditionTone: Record<UsedDeviceCondition, string> = {
  ottimo: "text-emerald-600",
  buono: "text-emerald-600",
  discreto: "text-amber-600",
  rotto: "text-brand-600",
};

function silhouetteVariant(id: string): 1 | 2 | 3 | 4 | 5 | 6 {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((Math.abs(sum) % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}

function UsedDeviceCard({ device }: { device: UsedDevice }) {
  const photo = device.photos[0] ?? null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: DURATION.normal, ease: EASE.smooth }}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card hover:border-brand-600/40 transition-colors duration-300 overflow-hidden"
    >
      <div className="aspect-[3/4] relative bg-card-hover flex items-center justify-center overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={device.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-7 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <PhoneSilhouette variant={silhouetteVariant(device.id)} className="w-auto h-[80%]" />
        )}
        {!device.functional && (
          <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-600 bg-background/80 px-2 py-1 rounded">
            Per pezzi
          </span>
        )}
      </div>

      <div className="px-5 pt-1 flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Chip tone="ink" size="sm">
            {device.brand}
          </Chip>
          <Chip tone="outline" size="sm">
            {device.conditionLabel}
          </Chip>
          {device.warrantyMonths ? (
            <Chip tone="outline" size="sm">
              Garanzia {device.warrantyMonths}m
            </Chip>
          ) : null}
        </div>

        <h3 className="font-sans font-semibold text-base leading-snug text-foreground line-clamp-2">
          {device.title}
        </h3>

        {device.color && (
          <p className="text-xs text-muted-foreground">{device.color}</p>
        )}
      </div>

      <div className="px-5 pb-5 mt-auto flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-sans font-semibold tabular-nums text-foreground text-xl">
            € {device.priceEur}
          </span>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.18em]",
              conditionTone[device.condition],
            )}
          >
            {device.functional ? "Disponibile" : "Non funzionante"}
          </span>
        </div>

        <RequestTrigger
          kind="info"
          product={{
            id: null,
            slug: null,
            name: device.title,
            variantId: null,
            variantLabel: device.variant,
          }}
          label="Lo voglio · richiedi info"
          className="w-full"
        />
      </div>
    </motion.div>
  );
}

const conditionFilters: { value: UsedDeviceCondition | "all"; label: string }[] = [
  { value: "all", label: "Tutte" },
  { value: "ottimo", label: "Ottimo" },
  { value: "buono", label: "Buono" },
  { value: "discreto", label: "Discreto" },
];

export function UsedDeviceGrid({ initialDevices }: { initialDevices: UsedDevice[] }) {
  const [activeCondition, setActiveCondition] = useState<UsedDeviceCondition | "all">("all");
  const [activeBrand, setActiveBrand] = useState("Tutte");

  const brands = ["Tutte", ...Array.from(new Set(initialDevices.map((d) => d.brand)))];

  const filtered = initialDevices.filter((d) => {
    const condMatch = activeCondition === "all" || d.condition === activeCondition;
    const brandMatch = activeBrand === "Tutte" || d.brand === activeBrand;
    return condMatch && brandMatch;
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {conditionFilters.map((c) => (
            <Chip
              key={c.value}
              size="md"
              active={activeCondition === c.value}
              onClick={() => setActiveCondition(c.value)}
            >
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <Chip key={b} size="md" active={activeBrand === b} onClick={() => setActiveBrand(b)}>
              {b}
            </Chip>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((device) => (
            <UsedDeviceCard key={device.id} device={device} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          Nessun usato disponibile al momento.
        </p>
      )}
    </div>
  );
}
