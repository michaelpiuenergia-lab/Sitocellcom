"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoC } from "@/components/marketing/logo-c";
import type { B2bCustomer } from "@/lib/crm-client/types";
import { cn } from "@/lib/utils/cn";

const b2bLinks = [
  { label: "Prodotti", href: "/b2b/prodotti" },
  { label: "Richieste", href: "/b2b/richieste" },
  { label: "Account", href: "/b2b/account" },
];

export function B2bNavbar({ customer }: { customer: B2bCustomer }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch("/api/auth/b2b/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-brand-800/40">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 h-16 flex items-center justify-between gap-4">
        <a href="/b2b/prodotti" className="flex items-center gap-3 min-w-0">
          <LogoC className="w-8 h-8 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-sans font-semibold text-xs tracking-[0.16em] uppercase text-brand-500 leading-tight">
              Area B2B
            </span>
            <span className="font-sans text-[11px] text-muted-foreground truncate">
              {customer.company ?? customer.name}
            </span>
          </div>
          {customer.pricingTier && (
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-brand-600/15 border border-brand-600/40 text-[10px] font-mono uppercase tracking-wider text-brand-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              {customer.pricingTier.name}
            </span>
          )}
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {b2bLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            disabled={busy}
            className={cn(
              "text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full",
              "border border-border text-muted-foreground hover:text-foreground hover:border-brand-600/40",
              "transition-colors duration-200 disabled:opacity-50",
            )}
          >
            {busy ? "Uscita…" : "Esci"}
          </button>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          disabled={busy}
          className="md:hidden text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border border-border text-muted-foreground"
        >
          {busy ? "…" : "Esci"}
        </button>
      </div>

      <div className="md:hidden border-t border-border">
        <nav className="flex justify-around py-2">
          {b2bLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-muted-foreground py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
