import type { WarrantyPublic } from "@/lib/crm-client/types";

/**
 * Esito della verifica garanzia.
 *
 * Tre stati distinti, non due: attiva, scaduta, e "nessuna garanzia
 * registrata" — quest'ultimo capita quando il dispositivo non e' ancora stato
 * consegnato, o quando alla consegna non e' stata scelta una durata.
 *
 * `daysRemaining` e `active` arrivano gia' calcolati dal CRM e NON vanno
 * ricalcolati qui: l'orologio del telefono del cliente puo' essere sbagliato.
 */

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export function WarrantyCard({ data }: { data: WarrantyPublic }) {
  const w = data.warranty;
  const active = w?.active === true;

  const tone = !w
    ? { bg: "#fffbeb", border: "#fde68a", text: "#92400e" }
    : active
      ? { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" }
      : { bg: "#fef2f2", border: "#fecaca", text: "#b91c1c" };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e5e5e5" }}
    >
      <div className="px-6 py-5" style={{ backgroundColor: tone.bg, borderBottom: `1px solid ${tone.border}` }}>
        <span
          className="font-mono uppercase block"
          style={{ fontSize: "11px", letterSpacing: "0.16em", color: tone.text }}
        >
          {!w ? "Garanzia non registrata" : active ? "Garanzia attiva" : "Garanzia scaduta"}
        </span>

        {w && active && (
          <>
            <span className="block mt-2" style={{ fontSize: "40px", fontWeight: 800, color: tone.text, lineHeight: 1 }}>
              {w.daysRemaining}
            </span>
            <span className="block mt-1" style={{ fontSize: "14px", fontWeight: 600, color: tone.text }}>
              {w.daysRemaining === 1 ? "giorno rimanente" : "giorni rimanenti"}
            </span>
          </>
        )}

        {w && !active && (
          <span className="block mt-2" style={{ fontSize: "15px", fontWeight: 600, color: tone.text }}>
            Era valida fino al {formatDate(w.validUntil)}
          </span>
        )}

        {!w && (
          <span className="block mt-2" style={{ fontSize: "15px", fontWeight: 600, color: tone.text }}>
            {data.deliveredAt
              ? "Per questa riparazione non risulta una garanzia registrata."
              : "Il dispositivo non risulta ancora consegnato."}
          </span>
        )}
      </div>

      <div className="px-6 py-5 space-y-3">
        {data.device && (
          <div className="flex justify-between gap-4">
            <span style={{ fontSize: "14px", color: "#737373" }}>Dispositivo</span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#0a0a0a" }}>{data.device}</span>
          </div>
        )}
        {data.deliveredAt && (
          <div className="flex justify-between gap-4">
            <span style={{ fontSize: "14px", color: "#737373" }}>Consegnato il</span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#0a0a0a" }}>
              {formatDate(data.deliveredAt)}
            </span>
          </div>
        )}
        {w && (
          <>
            <div className="flex justify-between gap-4">
              <span style={{ fontSize: "14px", color: "#737373" }}>Durata</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#0a0a0a" }}>
                {w.months} mesi
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span style={{ fontSize: "14px", color: "#737373" }}>
                {active ? "Valida fino al" : "Scaduta il"}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#0a0a0a" }}>
                {formatDate(w.validUntil)}
              </span>
            </div>
          </>
        )}

        <p className="pt-2" style={{ fontSize: "12px", color: "#a3a3a3", lineHeight: 1.5 }}>
          La garanzia copre il ricambio sostituito e l&apos;intervento eseguito, non l&apos;intero
          dispositivo. Per assistenza contatta il negozio dove hai lasciato il telefono.
        </p>
      </div>
    </div>
  );
}
