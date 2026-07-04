import { LogoC } from "@/components/marketing/logo-c";

/**
 * Landing pubblica dopo un pagamento online (Klarna, in futuro PayPal).
 *
 * Il CRM genera il link di pagamento e Klarna reindirizza qui il cliente con
 * ?klarna=<esito> (ok / cancel / back / failure / error). La registrazione
 * dell'incasso NON avviene qui: arriva al CRM via webhook. Questa pagina da'
 * solo un feedback chiaro e brandizzato al cliente.
 */

export const metadata = {
  title: "Grazie — Cellcom Group",
  description: "Esito del pagamento online.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ klarna?: string; paypal?: string }>;

type Esito = { title: string; body: string; ok: boolean };

const ESITI: Record<string, Esito> = {
  ok: {
    title: "Pagamento completato",
    body: "Grazie! Abbiamo ricevuto il tuo pagamento: il negozio è già stato avvisato. Riceverai la conferma a breve.",
    ok: true,
  },
  cancel: {
    title: "Pagamento annullato",
    body: "Hai annullato il pagamento. Puoi riprovare quando vuoi dal link che hai ricevuto.",
    ok: false,
  },
  back: {
    title: "Operazione interrotta",
    body: "Sei tornato indietro senza completare il pagamento. Il link resta valido: puoi riprovare quando vuoi.",
    ok: false,
  },
  failure: {
    title: "Pagamento non riuscito",
    body: "Qualcosa è andato storto durante il pagamento. Riprova dal link ricevuto, oppure contattaci.",
    ok: false,
  },
  error: {
    title: "Si è verificato un errore",
    body: "Non è stato possibile completare l'operazione. Riprova, oppure contattaci e ti aiutiamo subito.",
    ok: false,
  },
};

const DEFAULT_ESITO: Esito = {
  title: "Grazie",
  body: "Operazione registrata. Per qualsiasi domanda siamo a disposizione.",
  ok: true,
};

export default async function GraziePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { klarna } = (await searchParams) ?? {};
  const esito = (klarna && ESITI[klarna.toLowerCase()]) || DEFAULT_ESITO;

  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#fafaf8" }}
    >
      <div className="w-full max-w-[440px] flex flex-col items-center gap-9">
        <a href="/" className="flex flex-col items-center gap-3" aria-label="Home">
          <LogoC className="w-12 h-12" />
          <span
            className="font-mono uppercase"
            style={{ fontSize: "11px", letterSpacing: "0.32em", color: "#dc2626" }}
          >
            Pagamento online
          </span>
        </a>

        <div
          className="w-full flex flex-col items-center gap-6 rounded-2xl p-9 text-center lg:p-10"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ececec",
            boxShadow: "0 24px 60px -28px rgba(0,0,0,0.12)",
          }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor: esito.ok ? "#f0fdf4" : "#fffbeb",
              color: esito.ok ? "#15803d" : "#b45309",
              fontSize: "28px",
            }}
            aria-hidden
          >
            {esito.ok ? "✓" : "!"}
          </div>

          <div className="flex flex-col gap-2">
            <h1
              className="font-sans tracking-[-0.02em]"
              style={{ fontSize: "28px", color: "#0a0a0a", fontWeight: 700, lineHeight: 1.1 }}
            >
              {esito.title}
            </h1>
            <p style={{ fontSize: "14px", color: "#525252", lineHeight: 1.6 }}>
              {esito.body}
            </p>
          </div>
        </div>

        <a
          href="/"
          className="font-mono uppercase transition-colors hover:text-[#0a0a0a]"
          style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
        >
          ← Torna al sito
        </a>
      </div>
    </main>
  );
}
