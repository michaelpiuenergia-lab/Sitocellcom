"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoC } from "@/components/marketing/logo-c";
import { cn } from "@/lib/utils/cn";
import { EASE, DURATION } from "@/lib/constants";

const navLinks = [
  { label: "Prodotti", href: "/prodotti" },
  { label: "Riparazioni", href: "/riparazioni" },
  { label: "Corsi", href: "/corsi" },
  { label: "Negozi", href: "/negozi" },
  { label: "Chi siamo", href: "/chi-siamo" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/40 border-b border-border">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <LogoC className="w-8 h-8" />
          <span className="font-sans font-semibold text-sm tracking-[0.12em] uppercase text-foreground">
            Cellcom Group
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-600 transition-[width] duration-300 ease-smooth group-hover:w-full" />
            </a>
          ))}
          <a
            href="/b2b"
            className="text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border border-brand-600/40 text-brand-500 hover:bg-brand-600/10 hover:border-brand-600 transition-colors duration-200"
          >
            Area B2B
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={isOpen}
        >
          <span
            className={cn(
              "w-5 h-px bg-foreground transition-all duration-300",
              isOpen && "rotate-45 translate-y-[3.5px]"
            )}
          />
          <span
            className={cn(
              "w-5 h-px bg-foreground transition-all duration-300",
              isOpen && "-rotate-45 -translate-y-[3.5px]"
            )}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.smooth }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-foreground py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/b2b"
                onClick={() => setIsOpen(false)}
                className="mt-2 self-start text-sm font-mono uppercase tracking-wider px-4 py-2 rounded-full border border-brand-600/40 text-brand-500"
              >
                Area B2B
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
