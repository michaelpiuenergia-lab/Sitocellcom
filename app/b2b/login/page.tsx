import { redirect } from "next/navigation";
import { optionalB2bSession } from "@/lib/auth/guards";
import { LoginForm } from "./login-form";
import { LogoC } from "@/components/marketing/logo-c";

type SearchParams = Promise<{ next?: string; reason?: string }>;

export const dynamic = "force-dynamic";

export default async function B2bLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next, reason } = await searchParams;
  const existing = await optionalB2bSession();
  if (existing) {
    redirect(next ?? "/b2b/prodotti");
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
      {/* Sfondo ambient: gradiente radiale rosso soft, niente di invadente */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.12)_0%,transparent_60%)]" />

      <div className="w-full max-w-[420px] flex flex-col items-center gap-8">
        {/* Logo + nome */}
        <a
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Torna alla home"
        >
          <LogoC className="w-10 h-10" />
          <div className="flex flex-col leading-tight">
            <span className="font-sans font-semibold text-sm tracking-[0.15em] uppercase text-foreground">
              Cellcom Group
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Area B2B
            </span>
          </div>
        </a>

        {/* Card form */}
        <div className="w-full flex flex-col gap-6 bg-card border border-border rounded-2xl p-8 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col gap-1.5 text-center">
            <h1 className="font-serif italic text-3xl text-foreground">
              Accedi al tuo listino
            </h1>
            <p className="text-sm text-muted-foreground">
              Prezzi riservati per rivenditori, operatori e aziende.
            </p>
          </div>

          {reason === "expired" && (
            <p className="text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-2 text-center">
              Sessione scaduta. Effettua di nuovo l&apos;accesso.
            </p>
          )}

          <LoginForm next={next} />
        </div>

        {/* Footer: attivazione + back */}
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            Non hai ancora le credenziali?{" "}
            <a
              href="mailto:b2b@cellcom.it?subject=Richiesta%20attivazione%20account%20B2B"
              className="text-brand-500 hover:text-brand-400 underline-offset-4 hover:underline"
            >
              Richiedi attivazione →
            </a>
          </p>
          <a
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Torna al sito pubblico
          </a>
        </div>
      </div>
    </main>
  );
}
