import { SetPasswordForm } from "./set-password-form";
import { LogoC } from "@/components/marketing/logo-c";

export const metadata = {
  title: "Imposta la tua password — Cellcom Group",
  description: "Crea la password per accedere all'area clienti Cellcom.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ token?: string }>;

export default async function ImpostaPasswordPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { token } = (await searchParams) ?? {};

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
            Area clienti
          </span>
        </a>

        <div
          className="w-full flex flex-col gap-7 rounded-2xl p-9 lg:p-10"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ececec",
            boxShadow: "0 24px 60px -28px rgba(0,0,0,0.12)",
          }}
        >
          <div className="flex flex-col gap-2">
            <h1
              className="font-sans tracking-[-0.02em]"
              style={{ fontSize: "28px", color: "#0a0a0a", fontWeight: 700, lineHeight: 1.1 }}
            >
              Imposta la tua password
            </h1>
            <p style={{ fontSize: "14px", color: "#525252" }}>
              Crea una password (minimo 8 caratteri) per entrare nell&apos;area clienti.
            </p>
          </div>

          {token ? (
            <SetPasswordForm token={token} />
          ) : (
            <p
              className="rounded-xl px-4 py-3"
              style={{
                fontSize: "14px",
                color: "#b91c1c",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
              }}
            >
              Link non valido. Apri il link dall&apos;email che hai ricevuto, oppure
              chiedi al negozio di rimandarti l&apos;invito.
            </p>
          )}
        </div>

        <a
          href="/clienti/login"
          className="font-mono uppercase transition-colors hover:text-[#0a0a0a]"
          style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
        >
          ← Hai già la password? Accedi
        </a>
      </div>
    </main>
  );
}
