import { Breadcrumb } from "@/components/layout/breadcrumb";
import { WarrantyCard } from "@/components/warranty/warranty-card";
import { WarrantyChecker } from "@/components/warranty/warranty-checker";
import { lookupWarrantyByToken } from "@/lib/crm-client";
import { getT } from "@/lib/i18n/server";

/**
 * Verifica garanzia per il cliente.
 *
 * Il gruppo di route `(services)` non entra nell'URL: la pagina risponde su
 * /garanzia, che e' esattamente cio' che il CRM stampa nel QR della ricevuta
 * di consegna. Sta qui dentro e non in app/garanzia/ perche' Navbar e Footer
 * vivono nel layout di questo gruppo.
 *
 * Due strade per arrivarci:
 *   1. QR sulla ricevuta -> ?token=<token non indovinabile>, risolto qui
 *      lato server: il token non viene mai passato al browser;
 *   2. ricerca a mano (numero riparazione + ultime cifre del telefono), per
 *      chi ha perso il foglio o e' stato servito prima che il QR esistesse.
 */

export const metadata = {
  title: "Verifica la garanzia — Cellcom",
  description:
    "Controlla se la tua riparazione è ancora coperta da garanzia: inquadra il QR della ricevuta o inserisci numero riparazione e ultime cifre del telefono.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ token?: string; ticket?: string }>;

export default async function GaranziaPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = (await searchParams) ?? {};
  const token = (sp.token ?? "").trim().slice(0, 128);
  const initialTicket = (sp.ticket ?? "").slice(0, 40);
  const t = await getT();

  // Risolto server-side: il token resta fra HUB e CRM, non finisce in nessun
  // componente client ne' nell'HTML della pagina.
  const fromToken = token ? await lookupWarrantyByToken(token).catch(() => null) : null;

  return (
    <>
      <Breadcrumb items={[{ label: t("bc.home"), href: "/" }, { label: t("bc.warranty") }]} />
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <span
            className="font-mono uppercase block"
            style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#dc2626" }}
          >
            Garanzia
          </span>
          <h1
            className="mt-3"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#0a0a0a", lineHeight: 1.1 }}
          >
            Verifica la tua garanzia
          </h1>
          <p className="mt-4 max-w-[560px]" style={{ fontSize: "16px", color: "#525252", lineHeight: 1.6 }}>
            La garanzia copre il ricambio sostituito e l&apos;intervento eseguito, e decorre dalla
            data di consegna.
          </p>

          <div className="mt-10">
            {fromToken ? (
              <div className="max-w-[520px]">
                <WarrantyCard data={fromToken} />
              </div>
            ) : (
              <>
                {token && (
                  <p
                    className="mb-6 max-w-[520px] rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: "#fffbeb",
                      border: "1px solid #fde68a",
                      fontSize: "14px",
                      color: "#92400e",
                    }}
                  >
                    Il codice del QR non risulta valido. Puoi cercare la garanzia inserendo il
                    numero della riparazione qui sotto.
                  </p>
                )}
                <WarrantyChecker initialTicket={initialTicket} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
