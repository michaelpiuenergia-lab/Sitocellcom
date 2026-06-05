import { RegisterForm } from "./register-form";
import { LogoC } from "@/components/marketing/logo-c";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Registrati come rivenditore — Cellcom B2B",
  description:
    "Crea il tuo account rivenditore Cellcom. Verifica del nostro staff in 24h lavorative.",
};

export const dynamic = "force-dynamic";

export default async function B2bRegistratiPage() {
  const t = await getT();
  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#fafaf8" }}
    >
      <div className="w-full max-w-[480px] flex flex-col items-center gap-9">
        <a href="/" className="flex flex-col items-center gap-3" aria-label="Home">
          <LogoC className="w-12 h-12" />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.32em",
              color: "#dc2626",
            }}
          >
            {t("auth.b2b.register.eyebrow")}
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
              style={{
                fontSize: "28px",
                color: "#0a0a0a",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {t("auth.b2b.register.title")}
            </h1>
            <p style={{ fontSize: "14px", color: "#525252" }}>
              {t("auth.b2b.register.subtitle")}
            </p>
          </div>
          <RegisterForm />
        </div>

        <a
          href="/b2b/login"
          className="font-mono uppercase transition-colors hover:text-[#0a0a0a]"
          style={{
            fontSize: "10px",
            letterSpacing: "0.28em",
            color: "#737373",
          }}
        >
          {t("auth.common.backToLogin")}
        </a>
      </div>
    </main>
  );
}
