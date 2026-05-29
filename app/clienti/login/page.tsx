import { redirect } from "next/navigation";
import { optionalCustomerSession } from "@/lib/auth/customer-guards";
import { AuthForm } from "./auth-form";
import { LogoC } from "@/components/marketing/logo-c";

type SearchParams = Promise<{ next?: string; reason?: string; mode?: string }>;

export const dynamic = "force-dynamic";

export default async function ClientiLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next, reason, mode } = await searchParams;
  const existing = await optionalCustomerSession();
  if (existing) {
    redirect(next ?? "/clienti");
  }

  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#fafaf8" }}
    >
      <div className="w-full max-w-[440px] flex flex-col items-center gap-9">
        <a href="/" className="flex flex-col items-center gap-3" aria-label="Torna alla home">
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
          {reason === "expired" && (
            <p
              className="rounded-xl px-4 py-3 text-center"
              style={{
                fontSize: "13px",
                color: "#92400e",
                backgroundColor: "#fef3c7",
                border: "1px solid #fde68a",
              }}
            >
              Sessione scaduta. Effettua di nuovo l&apos;accesso.
            </p>
          )}

          <AuthForm next={next} initialMode={mode === "register" ? "register" : "login"} />
        </div>

        <a
          href="/"
          className="font-mono uppercase transition-colors hover:text-[#0a0a0a]"
          style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
        >
          ← Torna al sito pubblico
        </a>
      </div>
    </main>
  );
}
