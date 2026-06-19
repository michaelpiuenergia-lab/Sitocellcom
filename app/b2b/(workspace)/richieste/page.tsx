import { requireB2bSession } from "@/lib/auth/guards";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { listB2bRequests } from "@/lib/crm-client";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  info: "Info prodotto",
  "spare-part": "Ricambio",
  repair: "Riparazione",
  "b2b-quote": "Preventivo",
  "trade-in": "Permuta",
  shipment: "Spedizione",
};

const STATUS_LABEL: Record<string, string> = {
  "da-gestire": "Da gestire",
  "in-lavorazione": "In lavorazione",
  "risposta-inviata": "Risposta inviata",
  chiusa: "Chiusa",
  spam: "Spam",
};

const STATUS_TONE: Record<string, string> = {
  "da-gestire": "#b45309",
  "in-lavorazione": "#2563eb",
  "risposta-inviata": "#047857",
  chiusa: "#6b7280",
  spam: "#dc2626",
};

export default async function B2bRequestsPage() {
  const ctx = await requireB2bSession("/b2b/richieste");
  const { items } = await listB2bRequests(ctx.sessionToken, { limit: 100 }).catch(
    () => ({ items: [], total: 0, hasMore: false, limit: 100, offset: 0 }),
  );

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
            Tutte le richieste di disponibilità, preventivi e ordini speciali che
            hai inviato, con stato e risposta dell&apos;ufficio commerciale
            aggiornati dal gestionale Cellcom.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 flex flex-col items-center justify-center gap-4 text-center">
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
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-card text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Prodotto</th>
                  <th className="px-4 py-3">Messaggio</th>
                  <th className="px-4 py-3">Stato</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("it-IT")}
                    </td>
                    <td className="px-4 py-3">{KIND_LABEL[r.kind] ?? r.kind}</td>
                    <td className="px-4 py-3">
                      {r.productName ?? "—"}
                      {r.variantLabel ? ` (${r.variantLabel})` : ""}
                    </td>
                    <td className="px-4 py-3 max-w-[280px] truncate text-muted-foreground">
                      {r.message ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          color: STATUS_TONE[r.status] ?? "#6b7280",
                          backgroundColor: `${STATUS_TONE[r.status] ?? "#6b7280"}1a`,
                        }}
                      >
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
