"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoC } from "@/components/marketing/logo-c";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { label: "Prodotti", href: "/prodotti" },
  { label: "Usato", href: "/usato" },
  { label: "Riparazioni", href: "/riparazioni" },
  { label: "Rivendi", href: "/rivendi" },
  { label: "Corsi", href: "/corsi" },
  { label: "Negozi", href: "/negozi" },
  { label: "Chi siamo", href: "/chi-siamo" },
];

/**
 * Navbar FastFix-style.
 * Fondo bianco solid (no più dark blur), border bottom sottile.
 * Logo + wordmark CELLCOM a sinistra (mai più C persa da sola).
 * Nav centrale piccolo, CTA rosso "Ripara ora" + B2B a destra.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-shadow duration-300",
        scrolled ? "shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.08)]" : "",
      )}
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #ececec" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between gap-6">
        {/* Logo + wordmark */}
        <a
          href="/"
          aria-label="Cellcom Group — home"
          className="flex items-center gap-2.5 shrink-0"
        >
          <LogoC className="w-8 h-8" />
          <span
            className="font-sans"
            style={{
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#0a0a0a",
            }}
          >
            CELLCOM
            <span style={{ color: "#dc2626" }}>.</span>
          </span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-3.5 py-2 transition-colors duration-200 hover:text-brand-600 group"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#404040",
              }}
            >
              {link.label}
              <span
                className="absolute left-3.5 right-3.5 bottom-1 h-px origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                style={{ backgroundColor: "#dc2626" }}
              />
            </a>
          ))}
        </nav>

        {/* CTA destra */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a
            href="/b2b"
            className="px-4 py-2 transition-colors duration-200 hover:text-brand-600"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#525252",
              letterSpacing: "0.02em",
            }}
          >
            Area B2B
          </a>
          <a
            href="/riparazioni"
            className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.55)]"
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Ripara ora
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>

        {/* Hamburger mobile */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={isOpen}
        >
          <span
            className={cn(
              "w-5 h-0.5 transition-all duration-300",
              isOpen && "rotate-45 translate-y-[3.5px]",
            )}
            style={{ backgroundColor: "#0a0a0a" }}
          />
          <span
            className={cn(
              "w-5 h-0.5 transition-all duration-300",
              isOpen && "-rotate-45 -translate-y-[3.5px]",
            )}
            style={{ backgroundColor: "#0a0a0a" }}
          />
        </button>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden"
            style={{ backgroundColor: "#ffffff", borderTop: "1px solid #ececec" }}
          >
            <nav className="flex flex-col px-6 py-5 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="py-2.5"
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#0a0a0a",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-3 mt-3 pt-4 border-t border-[#ececec]">
                <a
                  href="/b2b"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-full px-5 py-2.5 text-center border"
                  style={{
                    borderColor: "#e5e5e5",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#0a0a0a",
                  }}
                >
                  Area B2B
                </a>
                <a
                  href="/riparazioni"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-full px-5 py-2.5 text-center"
                  style={{
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Ripara ora →
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
