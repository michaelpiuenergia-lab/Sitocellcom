import { PasswordResetForm } from "./password-reset-form";
import { LogoC } from "@/components/marketing/logo-c";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Reimposta password — Cellcom B2B",
  description: "Imposta una nuova password per il tuo account rivenditore Cellcom.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ token?: string }>;

export default async function ReimpostaPasswordPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { token } = (await searchParams) ?? {};
  const t = await getT();

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
            {t("auth.b2b.eyebrow")}
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
              {t("auth.b2b.reset.titleInline")}
            </h1>
            <p style={{ fontSize: "14px", color: "#525252" }}>
              {t("auth.b2b.reset.minLengthHint")}
            </p>
          </div>

          {token ? (
            <PasswordResetForm token={token} />
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
              {t("auth.b2b.reset.invalidLinkBefore")}{" "}
              <a href="/b2b/password-dimenticata" className="underline">
                {t("auth.b2b.reset.invalidLinkAnchor")}
              </a>
              .
            </p>
          )}
        </div>

        <a
          href="/b2b/login"
          className="font-mono uppercase transition-colors hover:text-[#0a0a0a]"
          style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#737373" }}
        >
          {t("auth.common.backToLogin")}
        </a>
      </div>
    </main>
  );
}
