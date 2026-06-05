import { redirect } from "next/navigation";
import { optionalB2bSession } from "@/lib/auth/guards";
import { LoginForm } from "./login-form";
import { LogoC } from "@/components/marketing/logo-c";
import { getT } from "@/lib/i18n/server";

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
  const t = await getT();

  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#fafaf8" }}
    >
      <div className="w-full max-w-[440px] flex flex-col items-center gap-9">
        {/* Logo + eyebrow */}
        <a
          href="/"
          className="flex flex-col items-center gap-3"
          aria-label="Torna alla home"
        >
          <LogoC className="w-12 h-12" />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.32em",
              color: "#dc2626",
            }}
          >
            {t("auth.b2b.eyebrow")}
          </span>
        </a>

        {/* Card form */}
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
              {t("auth.b2b.login.title")}
            </h1>
            <p style={{ fontSize: "14px", color: "#525252" }}>
              {t("auth.b2b.login.subtitle")}
            </p>
          </div>

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
              {t("auth.b2b.login.sessionExpired")}
            </p>
          )}

          <LoginForm next={next} />
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3 text-center">
          <p style={{ fontSize: "14px", color: "#525252" }}>
            {t("auth.b2b.login.noCredentials")}{" "}
            <a
              href="/b2b/registrati"
              className="hover:underline"
              style={{ color: "#dc2626", fontWeight: 500 }}
            >
              {t("auth.b2b.login.requestActivation")}
            </a>
          </p>
          <a
            href="/"
            className="font-mono uppercase transition-colors hover:text-[#0a0a0a]"
            style={{
              fontSize: "10px",
              letterSpacing: "0.28em",
              color: "#737373",
            }}
          >
            {t("auth.common.backToSite")}
          </a>
        </div>
      </div>
    </main>
  );
}
