"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogoC } from "@/components/marketing/logo-c";
import type { CustomerProfile } from "@/lib/crm-client/types";

const NAV_ITEMS: { label: string; href: string; match: (p: string) => boolean }[] = [
  {
    label: "Riparazioni",
    href: "/clienti",
    match: (p) => p === "/clienti",
  },
  {
    label: "Corsi",
    href: "/clienti/corsi",
    match: (p) => p.startsWith("/clienti/corsi"),
  },
];

export function ClientiNavbar({ customer }: { customer: CustomerProfile }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/clienti";
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #ececec" }}
    >
      <div className="max-w-[1100px] mx-auto px-5 lg:px-10 h-[72px] flex items-center justify-between gap-4">
        <a
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label="Home"
        >
          <LogoC className="w-8 h-8" />
          <span
            className="font-sans hidden sm:inline"
            style={{
              fontSize: "16px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#0a0a0a",
            }}
          >
            Area clienti
          </span>
        </a>

        {/* Menu desktop — tabs centrali */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 transition-colors"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: active ? "#dc2626" : "#525252",
                  backgroundColor: active ? "#fef2f2" : "transparent",
                  border: active
                    ? "1px solid #fecaca"
                    : "1px solid transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <span style={{ fontSize: "13px", color: "#525252" }}>
            {customer.name.split(" ")[0]}
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full px-4 py-2 transition-colors hover:bg-neutral-50"
            style={{
              border: "1px solid #e5e5e5",
              fontSize: "13px",
              fontWeight: 500,
              color: "#0a0a0a",
            }}
          >
            Esci
          </button>
        </div>

        {/* Hamburger mobile */}
        <button
          type="button"
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden rounded-full p-2 transition-colors"
          style={{ border: "1px solid #e5e5e5" }}
        >
          <span className="block relative w-5 h-5">
            <span
              className="absolute left-0 right-0 h-[2px] rounded-full transition-all"
              style={{
                top: menuOpen ? "9px" : "4px",
                backgroundColor: "#0a0a0a",
                transform: menuOpen ? "rotate(45deg)" : "none",
              }}
            />
            <span
              className="absolute left-0 right-0 h-[2px] rounded-full transition-opacity"
              style={{
                top: "9px",
                backgroundColor: "#0a0a0a",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="absolute left-0 right-0 h-[2px] rounded-full transition-all"
              style={{
                top: menuOpen ? "9px" : "14px",
                backgroundColor: "#0a0a0a",
                transform: menuOpen ? "rotate(-45deg)" : "none",
              }}
            />
          </span>
        </button>
      </div>

      {/* Drawer mobile */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: "1px solid #ececec",
            backgroundColor: "#ffffff",
          }}
        >
          <div className="px-5 py-4 flex flex-col gap-2">
            <div
              className="font-mono uppercase pb-2"
              style={{
                fontSize: "10px",
                letterSpacing: "0.28em",
                color: "#a3a3a3",
              }}
            >
              {customer.name}
            </div>
            {NAV_ITEMS.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 transition-colors"
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: active ? "#dc2626" : "#0a0a0a",
                    backgroundColor: active ? "#fef2f2" : "transparent",
                    border: `1px solid ${active ? "#fecaca" : "#f1f5f9"}`,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="rounded-xl px-4 py-3 text-left mt-1"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#525252",
                border: "1px solid #e5e5e5",
                backgroundColor: "#fafaf8",
              }}
            >
              Esci →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
