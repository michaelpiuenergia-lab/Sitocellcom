import type { B2bDocumentLine } from "@/lib/crm-client/types";

const eur = (c: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(c / 100);

export function LineItems({ lines }: { lines: B2bDocumentLine[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
      <table className="w-full text-left" style={{ fontSize: "13px" }}>
        <thead>
          <tr style={{ backgroundColor: "#fafaf8", borderBottom: "1px solid #ececec" }}>
            <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Articolo</th>
            <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>SKU</th>
            <th className="px-5 py-3 font-mono uppercase text-right" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Qta</th>
            <th className="px-5 py-3 font-mono uppercase text-right" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Prezzo unit.</th>
            <th className="px-5 py-3 font-mono uppercase text-right" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Totale riga</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i} style={{ borderTop: i === 0 ? "none" : "1px solid #f4f3ee" }}>
              <td className="px-5 py-3" style={{ color: "#0a0a0a" }}>{l.productName}</td>
              <td className="px-5 py-3 font-mono" style={{ color: "#737373" }}>{l.sku ?? "—"}</td>
              <td className="px-5 py-3 text-right tabular-nums" style={{ color: "#0a0a0a" }}>{l.qty}</td>
              <td className="px-5 py-3 text-right tabular-nums" style={{ color: "#525252" }}>{eur(l.unitPriceCents)}</td>
              <td className="px-5 py-3 text-right tabular-nums" style={{ color: "#0a0a0a", fontWeight: 600 }}>{eur(l.lineTotalCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
