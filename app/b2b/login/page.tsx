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
    <main className="min-h-screen px-6 py-16 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.18)_0%,transparent_60%)]" />

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.1fr,1fr] gap-12 lg:gap-20 items-center">
        {/* LEFT — pitch persuasivo */}
        <div className="flex flex-col gap-8 max-w-[640px]">
          <a href="/" className="flex items-center gap-3 self-start">
            <LogoC className="w-10 h-10" />
            <div className="flex flex-col leading-tight">
              <span className="font-sans font-semibold text-xs tracking-[0.18em] uppercase text-brand-500">
                Cellcom Group
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Area Rivenditori · Operatori · Aziende
              </span>
            </div>
          </a>

          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-[clamp(36px,4.5vw,56px)] leading-[1.05] tracking-[-0.02em] text-foreground">
              Lo stesso magazzino,{" "}
              <span className="italic shimmer-ruby">il tuo prezzo.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Da oltre dieci anni forniamo telefoni, ricambi e accessori a
              rivenditori, centri assistenza autorizzati e operatori sparsi in
              tutta Italia. Stesso stock che vedi nel sito pubblico, listino
              riservato per chi compra a volumi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <PitchPoint
              num="01"
              title="Listino tier dedicato"
              text="Prezzi differenziati per Rivenditore, Operatore e VIP. Sconti progressivi su quantità."
            />
            <PitchPoint
              num="02"
              title="Disponibilità prioritaria"
              text="Stock riservato per chi ha contratto attivo. Vedi prima del pubblico cosa entra in magazzino."
            />
            <PitchPoint
              num="03"
              title="Pagamenti su misura"
              text="Bonifico a 30/60 giorni in base al rating, RID/SDD per ordini ricorrenti, fattura elettronica."
            />
            <PitchPoint
              num="04"
              title="Account manager dedicato"
              text="Un solo riferimento commerciale che conosce la tua azienda. Email diretta, WhatsApp business."
            />
          </div>
        </div>

        {/* RIGHT — form login */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto flex flex-col gap-6 bg-card border border-border rounded-2xl p-8 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500">
              Accesso area B2B
            </span>
            <h2 className="font-serif italic text-2xl text-foreground">
              Hai già un account?
            </h2>
          </div>

          {reason === "expired" && (
            <p className="text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-2">
              Sessione scaduta. Effettua di nuovo l'accesso.
            </p>
          )}

          <LoginForm next={next} />

          <div className="pt-4 border-t border-border flex flex-col gap-3 text-sm">
            <p className="text-muted-foreground">
              Non hai ancora le credenziali?{" "}
              <a
                href="mailto:b2b@cellcom.it?subject=Richiesta%20attivazione%20account%20B2B"
                className="text-brand-500 hover:text-brand-400 underline-offset-4 hover:underline"
              >
                Richiedi attivazione →
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              Servono solo P.IVA e dati aziendali — un nostro commerciale ti
              richiama in giornata, le credenziali arrivano entro 24 ore
              lavorative.
            </p>
          </div>

          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 text-center pt-2 border-t border-border/50">
            Dev mock: rivenditore@demo.cellcom.it / demo1234
          </p>
        </div>
      </div>
    </main>
  );
}

function PitchPoint({
  num,
  title,
  text,
}: {
  num: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card/60">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-brand-500 tabular-nums">
          {num}
        </span>
        <h3 className="font-serif italic text-base text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
