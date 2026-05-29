"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogoC } from "@/components/marketing/logo-c";
import type { B2bCustomer } from "@/lib/crm-client/types";
import { cn } from "@/lib/utils/cn";

const b2bLinks = [
  { label: "Prodotti", href: "/b2b/prodotti" },
  { label: "Ordini", href: "/b2b/ordini" },
  { label: "Preventivi", href: "/b2b/preventivi" },
  { label: "Fatture", href: "/b2b/fatture" },
  { label: "Note credito", href: "/b2b/note-credito" },
  { label: "Pagamenti", href: "/b2b/pagamenti" },
  { label: "Spedizioni", href: "/b2b/spedizioni" },
  { label: "Documenti", href: "/b2b/documenti" },
  { label: "Richieste", href: "/b2b/richieste" },
  { label: "Account", href: "/b2b/account" },
];

/**
 * Navbar area B2B — FastFix-style, bianca pulita.
 * Logo + nome azienda + chip tier rosso a sinistra.
 * Nav inline destra + bottone "Esci".
 */
export function B2bNavbar({ customer }: { customer: B2bCustomer }) {
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-shadow duration-300",
        scrolled
          ? "shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.08)]"
          : "",
      )}
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #ececec" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between gap-4">
        <a
          href="/b2b/prodotti"
          className="flex items-center gap-3 min-w-0"
        >
          <LogoC className="w-8 h-8 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span
              className="font-mono uppercase leading-tight"
              style={{
                fontSize: "10px",
                letterSpacing: "0.32em",
                color: "#dc2626",
              }}
            >
              Area B2B
            </span>
            <span
              className="font-sans truncate"
              style={{
                fontSize: "13px",
                color: "#0a0a0a",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {customer.company ?? customer.name}
            </span>
          </div>
          {customer.pricingTier && (
            <span
              className="hidden sm:inline-flex items-center gap-1.5 ml-3 px-2.5 h-6 rounded-full font-mono uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#dc2626" }}
              />
              {customer.pricingTier.name}
            </span>
          )}
        </a>

        <nav className="hidden lg:flex items-center gap-0 overflow-x-auto min-w-0">
          {b2bLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative px-2.5 py-2 transition-colors duration-200 group whitespace-nowrap"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: active ? "#dc2626" : "#404040",
                }}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute left-2.5 right-2.5 bottom-1 h-px origin-left transition-transform duration-300 ease-out",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                  style={{ backgroundColor: "#dc2626" }}
                />
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          disabled={busy}
          className="hidden lg:inline-flex font-mono uppercase px-3 py-1.5 rounded-full transition-colors duration-200 hover:border-[#dc2626] hover:text-[#dc2626] disabled:opacity-50 shrink-0"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: "#525252",
            border: "1px solid #e5e5e5",
            backgroundColor: "#ffffff",
          }}
        >
          {busy ? "Uscita…" : "Esci"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={busy}
          className="lg:hidden font-mono uppercase px-3 py-1.5 rounded-full shrink-0"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: "#525252",
            border: "1px solid #e5e5e5",
          }}
        >
          {busy ? "…" : "Esci"}
        </button>
      </div>

      {/* Nav mobile / tablet — scroll orizzontale */}
      <div
        className="lg:hidden"
        style={{ borderTop: "1px solid #ececec" }}
      >
        <nav className="flex gap-1 py-2 px-4 overflow-x-auto">
          {b2bLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className="py-1.5 px-3 rounded-full whitespace-nowrap"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: active ? "#dc2626" : "#525252",
                  backgroundColor: active ? "#fef2f2" : "transparent",
                  border: active ? "1px solid #fecaca" : "1px solid transparent",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
