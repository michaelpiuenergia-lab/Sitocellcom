import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TradeInCalculator } from "@/components/trade-in/calculator";

export const metadata: Metadata = {
  title: "Rivendi il tuo telefono — Cellcom Group",
  description:
    "Valutazione gratuita del tuo smartphone usato. Spedizione gratis, pagamento entro 48h. Bonus +10% se scegli credito Cellcom.",
};

export default function RivendiPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-12 px-6 lg:px-16 max-w-[1400px] mx-auto">
          <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.18)_0%,transparent_60%)]" />

          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <span className="font-mono text-xs text-brand-500 uppercase tracking-[0.2em]">
              <span className="text-brand-600">◢</span> Trade-in Cellcom
            </span>
            <h1 className="font-serif text-[clamp(40px,5.5vw,72px)] leading-[1.02] tracking-[-0.02em] text-foreground">
              Il tuo vecchio telefono{" "}
              <span className="italic text-brand-500">vale ancora.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Dicci che telefono hai e in che condizioni è. I nostri tecnici lo
              valutano gratuitamente dopo aver ricevuto le foto e ti rispondono
              via email entro poche ore. Spedizione gratuita o ritiro nei
              nostri negozi. Bonus{" "}
              <strong className="text-foreground">+10%</strong> se scegli
              credito spendibile sul Gruppo Cellcom.
            </p>
          </div>
        </section>

        {/* ── CALCULATOR ───────────────────────────────────────────────── */}
        <section className="px-6 lg:px-16 pb-16">
          <TradeInCalculator />
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section className="relative border-y border-border bg-card/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(220,38,38,0.06)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-16 py-16">
            <div className="flex flex-col gap-3 mb-10 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-500">
                Come funziona
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                Quattro passi, zero sorprese.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Step
                n="01"
                title="Compila il form"
                text="Scegli marca, modello, memoria e condizione del tuo telefono. Bastano 30 secondi, niente account."
              />
              <Step
                n="02"
                title="Foto via email"
                text="Ti scriviamo entro poche ore chiedendoti 4-6 foto guidate (fronte, retro, IMEI, schermo acceso). Le mandi rispondendo all'email."
              />
              <Step
                n="03"
                title="Valutazione personalizzata"
                text="Un nostro tecnico verifica le foto e ti manda la valutazione dedicata al tuo telefono via email — niente algoritmi automatici, una persona vera che decide il prezzo."
              />
              <Step
                n="04"
                title="Spedizione + pagamento"
                text="Accetti, spedizione gratis o ritiro in negozio. Controllo finale e pagamento entro 48h (bonifico o credito Cellcom +10%)."
              />
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="max-w-[900px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-500">
              FAQ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
              Le domande che ci fanno tutti.
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <Faq
              q="Perché non vedo subito un prezzo?"
              a="Perché vogliamo darti una valutazione onesta, non un range generico tirato a caso. I nostri tecnici controllano le foto vere del tuo telefono — vetro, schermo, segni d'uso reali — e ti scrivono il prezzo esatto che ti pagheremmo. Niente sorprese al ricevimento."
            />
            <Faq
              q="Quanto ci mette davvero ad arrivare l'offerta?"
              a="Entro 24 ore lavorative dall'invio delle foto. Spesso anche più velocemente — i nostri tecnici lavorano dal lunedì al sabato. Se hai inviato il form di venerdì sera, l'offerta arriva lunedì mattina."
            />
            <Faq
              q="Quando ricevo la valutazione finale?"
              a="Subito dopo che ci hai inviato le foto. Se la spedizione corrisponde alle foto, paghiamo esattamente la cifra dell'email. Se trovassimo qualcosa che non avevamo visto nelle foto, ti contattiamo prima di chiudere la pratica con una controproposta — sei libero di accettare o ritirare gratis."
            />
            <Faq
              q="Come funziona la spedizione gratuita?"
              a="Dopo che accetti l'offerta ti mandiamo un'etichetta prepagata via email. Spedisci da qualsiasi ufficio postale o Punto Poste con il telefono ben imballato (idealmente in scatola originale). In alternativa fissi un appuntamento e te lo ritiriamo a casa, o lo porti in uno dei punti vendita del Gruppo."
            />
            <Faq
              q="Cos'è il bonus +10% per il credito Cellcom?"
              a="Se invece del bonifico scegli credito spendibile sui siti del Gruppo Cellcom (cellcom.it, fast-fix.it, italianparts.it), maggiorìamo l'offerta del 10%. Esempio: offerta €500 → credito €550. Valido 24 mesi, spendibile in qualsiasi momento."
            />
            <Faq
              q="Comprate solo telefoni o anche tablet, smartwatch e accessori?"
              a="Adesso solo smartphone. Tablet, smartwatch, AirPods, console: scrivici a hello@cellcom.it e ti diciamo cosa possiamo fare caso per caso."
            />
            <Faq
              q="Il mio telefono è rotto, posso venderlo lo stesso?"
              a="Sì ma cambia il flusso. Per schermi rotti, batterie guaste, telefoni che non accendono: meglio passare prima dal nostro centro riparazioni. Spesso ripariamo a costo basso e poi il valore di rivendita sale del 3-5x. Scrivici descrivendo il problema."
            />
            <Faq
              q="Il mio modello non è nella lista, cosa faccio?"
              a="Seleziona 'Altro / non in lista' e scrivi marca e modello a mano. Il nostro tecnico farà la valutazione esattamente come per i modelli in lista — solo che ci mette qualche ora in più per recuperare i prezzi di mercato del tuo modello specifico."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:border-brand-600/40 hover:bg-card-hover transition-all duration-300">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500 tabular-nums">
        {n}
      </span>
      <h3 className="font-serif italic text-xl text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-border pb-5">
      <summary className="cursor-pointer flex items-center justify-between gap-4 list-none">
        <h3 className="font-serif italic text-lg sm:text-xl text-foreground group-hover:text-brand-500 transition-colors">
          {q}
        </h3>
        <span
          className="text-brand-500 text-xl shrink-0 transition-transform group-open:rotate-45"
          aria-hidden
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
    </details>
  );
}
