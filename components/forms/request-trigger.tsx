"use client";

import { useState } from "react";
import { RequestForm } from "./request-form";
import { cn } from "@/lib/utils/cn";
import type {
  SiteRequestKind,
  SiteRequestProductPayload,
} from "@/lib/crm-client/types";

/**
 * Bottone che apre il RequestForm in modale. Usabile in qualunque punto
 * del sito pubblico (es. dettaglio prodotto, hero contatti).
 */
export function RequestTrigger({
  kind,
  product = null,
  label,
  variant = "primary",
  className,
}: {
  kind: SiteRequestKind;
  product?: SiteRequestProductPayload | null;
  label: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const variantClass = {
    primary:
      "bg-linear-to-br from-brand-600 to-brand-800 text-white hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.5)]",
    outline:
      "border border-brand-600/40 text-brand-500 hover:bg-brand-600/10",
    ghost: "text-muted-foreground hover:text-foreground",
  }[variant];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "py-2.5 px-5 rounded-lg text-sm font-semibold transition-all duration-300",
          variantClass,
          className,
        )}
      >
        {label}
      </button>
      {open && (
        <RequestForm
          kind={kind}
          product={product}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
