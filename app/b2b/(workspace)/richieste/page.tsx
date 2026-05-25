import { requireB2bSession } from "@/lib/auth/guards";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";

export const dynamic = "force-dynamic";

export default async function B2bRequestsPage() {
  const ctx = await requireB2bSession("/b2b/richieste");

  // Lista richieste B2B: in attesa di endpoint CRM GET /api/v1/b2b/requests
  // (vedi CRM-BRIEF-B2B.md §2.2.3 — per ora coperto solo POST).
  // Placeholder visivo. Quando l'endpoint sarà esposto, sostituire con la lista reale.

  return (
    <>
      <B2bNavbar customer={ctx.customer} />

      <main className="pt-24 pb-16 px-6 lg:px-16 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-500">
            Le tue richieste
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-foreground">
            Storico richieste
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Qui troverai tutte le richieste di disponibilità, preventivi e
            ordini speciali che hai inviato. Stato e risposta dell'ufficio
            commerciale sempre aggiornati dal gestionale Cellcom.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.07 0 3.98.7 5.5 1.88" />
            </svg>
          </div>
          <h3 className="font-serif italic text-xl">Nessuna richiesta ancora</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Le richieste di disponibilità e preventivo che invierai dalla
            sezione prodotti compariranno qui.
          </p>
          <a
            href="/b2b/prodotti"
            className="mt-2 px-5 py-2.5 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold"
          >
            Sfoglia il catalogo
          </a>
        </div>
      </main>
    </>
  );
}
