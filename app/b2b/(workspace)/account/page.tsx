import { requireB2bSession } from "@/lib/auth/guards";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";

export const dynamic = "force-dynamic";

export default async function B2bAccountPage() {
  const ctx = await requireB2bSession("/b2b/account");
  const { customer } = ctx;

  return (
    <>
      <B2bNavbar customer={customer} />

      <main className="pt-24 pb-16 px-6 lg:px-16 max-w-[800px] mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-500">
            Account aziendale
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-foreground">
            Dati del tuo account
          </h1>
          <p className="text-sm text-muted-foreground">
            Per modifiche contatta l'ufficio commerciale Cellcom.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <AccountField label="Ragione sociale" value={customer.company} />
          <AccountField label="Partita IVA" value={customer.vatNumber} />
          <AccountField label="Referente" value={customer.name} />
          <AccountField label="Email" value={customer.email} />
          <AccountField
            label="Listino assegnato"
            value={customer.pricingTier?.name ?? "Standard B2B"}
          />
          <AccountField
            label="Codice listino"
            value={customer.pricingTier?.code ?? "—"}
          />
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-border bg-card flex flex-col gap-3">
          <h2 className="font-serif italic text-lg">Hai bisogno di assistenza?</h2>
          <p className="text-sm text-muted-foreground">
            Il nostro ufficio commerciale è disponibile per ordini speciali,
            cambio listino, condizioni dedicate e gestione resi.
          </p>
          <a
            href="mailto:b2b@cellcom.it"
            className="self-start px-5 py-2.5 rounded-lg bg-linear-to-br from-brand-600 to-brand-800 text-white text-sm font-semibold"
          >
            Scrivi a b2b@cellcom.it
          </a>
        </div>
      </main>
    </>
  );
}

function AccountField({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-xl border border-border bg-card">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-sm text-foreground tabular-nums truncate">
        {value ?? "—"}
      </span>
    </div>
  );
}
