"use client";

import { useRouter } from "next/navigation";
import { LogoC } from "@/components/marketing/logo-c";
import type { CustomerProfile } from "@/lib/crm-client/types";

export function ClientiNavbar({ customer }: { customer: CustomerProfile }) {
  const router = useRouter();

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
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between gap-6">
        <a href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Home">
          <LogoC className="w-8 h-8" />
          <span
            className="font-sans"
            style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.02em", color: "#0a0a0a" }}
          >
            Area clienti
          </span>
        </a>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline" style={{ fontSize: "13px", color: "#525252" }}>
            {customer.name}
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full px-4 py-2 transition-colors"
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
      </div>
    </header>
  );
}
