import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TradeInCalculator } from "@/components/trade-in/calculator";

export const metadata: Metadata = {
  title: "Rivendi il tuo telefono — Cellcom Group",
  description:
    "Valutazione gratuita del tuo smartphone usato. Spedizione gratis, pagamento entro 48h. Bonus +10% se scegli credito Cellcom.",
};

const STEPS = [
  {
    n: "01",
    title: "Compila il form",
    text: "Scegli marca, modello, memoria e condizione del tuo telefono. Bastano 30 secondi, niente account.",
  },
  {
    n: "02",
    title: "Foto via email",
    text: "Ti scriviamo entro poche ore chiedendoti 4-6 foto guidate (fronte, retro, IMEI, schermo acceso).",
  },
  {
    n: "03",
    title: "Valutazione personalizzata",
    text: "Un tecnico verifica le foto e ti manda la valutazione dedicata via email — niente algoritmi, una persona vera.",
  },
  {
    n: "04",
    title: "Spedizione + pagamento",
    text: "Accetti, spedizione gratis o ritiro in negozio. Controllo finale e pagamento entro 48h.",
  },
];

const FAQS = [
  {
    q: "Perché non vedo subito un prezzo?",
    a: "Perché vogliamo darti una valutazione onesta, non un range generico tirato a caso. I nostri tecnici controllano le foto vere del tuo telefono — vetro, schermo, segni d'uso reali — e ti scrivono il prezzo esatto che ti pagheremmo. Niente sorprese al ricevimento.",
  },
  {
    q: "Quanto ci mette davvero ad arrivare l'offerta?",
    a: "Entro 24 ore lavorative dall'invio delle foto. Spesso anche più velocemente — i nostri tecnici lavorano dal lunedì al sabato.",
  },
  {
    q: "Quando ricevo la valutazione finale?",
    a: "Subito dopo che ci hai inviato le foto. Se la spedizione corrisponde alle foto, paghiamo esattamente la cifra dell'email. Se trovassimo qualcosa che non avevamo visto nelle foto, ti contattiamo prima di chiudere la pratica — sei libero di accettare o ritirare gratis.",
  },
  {
    q: "Come funziona la spedizione gratuita?",
    a: "Dopo che accetti l'offerta ti mandiamo un'etichetta prepagata via email. Spedisci da qualsiasi ufficio postale con il telefono ben imballato (idealmente in scatola originale). In alternativa fissi un appuntamento e te lo ritiriamo a casa.",
  },
  {
    q: "Cos'è il bonus +10% per il credito Cellcom?",
    a: "Se invece del bonifico scegli credito spendibile sui siti del Gruppo Cellcom, maggioriamo l'offerta del 10%. Esempio: offerta €500 → credito €550. Valido 24 mesi.",
  },
  {
    q: "Comprate solo telefoni o anche tablet, smartwatch?",
    a: "Adesso solo smartphone. Tablet, smartwatch, AirPods, console: scrivici a hello@cellcom.it e ti diciamo cosa possiamo fare caso per caso.",
  },
  {
    q: "Il mio telefono è rotto, posso venderlo lo stesso?",
    a: "Sì ma cambia il flusso. Per schermi rotti, batterie guaste, telefoni che non accendono: meglio passare prima dal nostro centro riparazioni. Spesso ripariamo a costo basso e poi il valore di rivendita sale del 3-5x.",
  },
  {
    q: "Il mio modello non è nella lista, cosa faccio?",
    a: "Seleziona 'Altro / non in lista' e scrivi marca e modello a mano. Il nostro tecnico farà la valutazione esattamente come per i modelli in lista.",
  },
];

export default function RivendiPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {/* HERO (bianco) */}
        <section style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-14 lg:pt-20 pb-16">
            <div className="max-w-3xl flex flex-col gap-5">
              <span
                className="font-mono uppercase inline-flex items-center gap-3"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.32em",
                  color: "#dc2626",
                }}
              >
                <span
                  aria-hidden
                  className="inline-block h-px w-9"
                  style={{ backgroundColor: "#dc2626" }}
                />
                Trade-in Cellcom
              </span>
              <h1
                className="font-sans tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(40px, 5vw, 72px)",
                  lineHeight: 1.02,
                  color: "#0a0a0a",
                  fontWeight: 700,
                }}
              >
                Il tuo vecchio telefono{" "}
                <span style={{ color: "#dc2626" }}>vale ancora.</span>
              </h1>
              <p
                className="leading-relaxed"
                style={{
                  fontSize: "19px",
                  color: "#525252",
                  maxWidth: "640px",
                }}
              >
                Dicci che telefono hai e in che condizioni è. I tecnici lo
                valutano gratuitamente dopo aver ricevuto le foto e ti rispondono
                via email entro poche ore. Spedizione gratuita o ritiro nei
                negozi. Bonus{" "}
                <strong style={{ color: "#0a0a0a" }}>+10%</strong> se scegli
                credito spendibile sul Gruppo Cellcom.
              </p>
            </div>
          </div>
        </section>

        {/* CALCULATOR (mantiene la sua logica e i fetch CRM) */}
        <section style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
            <TradeInCalculator />
          </div>
        </section>

        {/* COME FUNZIONA (nero — fanale rosso assente perché elenco lineare) */}
        <section
          aria-label="Come funziona il trade-in"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
            <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-20 items-end mb-14">
              <div className="flex flex-col gap-5">
                <span
                  className="font-mono uppercase inline-flex items-center gap-3"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.32em",
                    color: "#dc2626",
                  }}
                >
                  <span
                    aria-hidden
                    className="inline-block h-px w-9"
                    style={{ backgroundColor: "#dc2626" }}
                  />
                  Come funziona
                </span>
                <h2
                  className="font-sans tracking-[-0.025em]"
                  style={{
                    fontSize: "clamp(32px, 4.2vw, 56px)",
                    lineHeight: 1.05,
                    color: "#fafafa",
                    fontWeight: 700,
                  }}
                >
                  Quattro passi,{" "}
                  <span style={{ color: "#dc2626" }}>zero sorprese.</span>
                </h2>
              </div>
              <p
                className="leading-relaxed"
                style={{
                  fontSize: "17px",
                  color: "#a3a3a3",
                  maxWidth: "520px",
                }}
              >
                Dalla compilazione al pagamento, tutto tracciato. Niente
                algoritmi opachi, niente offerte gonfiate che poi scendono al
                ricevimento — la persona che ti scrive il prezzo è la stessa che
                controlla il telefono in laboratorio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl p-7 flex flex-col gap-3 transition-colors duration-300 hover:border-[#dc2626]"
                  style={{
                    backgroundColor: "#141414",
                    border: "1px solid #1f1f1f",
                  }}
                >
                  <span
                    className="font-sans tabular-nums leading-none"
                    style={{
                      fontSize: "32px",
                      letterSpacing: "-0.02em",
                      color: "#dc2626",
                      fontWeight: 700,
                    }}
                  >
                    {step.n}
                  </span>
                  <h3
                    className="font-sans"
                    style={{
                      fontSize: "17px",
                      letterSpacing: "-0.01em",
                      color: "#fafafa",
                      fontWeight: 600,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ fontSize: "14px", color: "#a3a3a3" }}
                  >
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ (bianco) */}
        <section
          aria-label="FAQ trade-in"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="max-w-[960px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
            <div className="flex flex-col gap-5 mb-12">
              <span
                className="font-mono uppercase inline-flex items-center gap-3"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.32em",
                  color: "#dc2626",
                }}
              >
                <span
                  aria-hidden
                  className="inline-block h-px w-9"
                  style={{ backgroundColor: "#dc2626" }}
                />
                FAQ
              </span>
              <h2
                className="font-sans tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(32px, 4.2vw, 56px)",
                  lineHeight: 1.05,
                  color: "#0a0a0a",
                  fontWeight: 700,
                }}
              >
                Le <span style={{ color: "#dc2626" }}>domande</span> che ci
                fanno tutti.
              </h2>
            </div>

            <div className="flex flex-col">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group py-5"
                  style={{ borderBottom: "1px solid #ececec" }}
                >
                  <summary className="cursor-pointer flex items-center justify-between gap-4 list-none">
                    <h3
                      className="font-sans transition-colors group-hover:text-brand-600"
                      style={{
                        fontSize: "17px",
                        color: "#0a0a0a",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {f.q}
                    </h3>
                    <span
                      aria-hidden
                      className="shrink-0 text-2xl transition-transform duration-300 group-open:rotate-45"
                      style={{ color: "#dc2626" }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="mt-4 leading-relaxed"
                    style={{ fontSize: "15px", color: "#525252" }}
                  >
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
