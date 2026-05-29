import { requireB2bSession } from "@/lib/auth/guards";
import { listB2bDocuments } from "@/lib/crm-client";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { B2B_DOCUMENT_KIND_LABELS } from "@/lib/crm-client/types";

export const dynamic = "force-dynamic";

const d = (iso: string) => new Date(iso).toLocaleDateString("it-IT");

export default async function DocumentiPage() {
  const ctx = await requireB2bSession("/b2b/documenti");
  const { items, total } = await listB2bDocuments(ctx.sessionToken, { limit: 200 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return (
    <>
      <B2bNavbar customer={ctx.customer} />
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <span className="font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#dc2626" }}>
            Documenti · {total}
          </span>
          <h1 className="font-sans tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}>
            Documenti amministrativi
          </h1>
          <p style={{ fontSize: "14px", color: "#525252", maxWidth: "640px" }}>
            DDT, bolle, contratti, certificati e altri documenti. Le fatture sono nella sezione dedicata.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <p style={{ fontSize: "16px", color: "#525252" }}>Nessun documento disponibile.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
            <table className="w-full text-left" style={{ fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#fafaf8", borderBottom: "1px solid #ececec" }}>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Tipo</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Titolo</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Data</th>
                  <th className="px-5 py-3 font-mono uppercase" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}>Collegato a</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((doc, i) => (
                  <tr key={doc.id} style={{ borderTop: i === 0 ? "none" : "1px solid #f4f3ee" }}>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono uppercase"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.14em",
                          backgroundColor: "#fef2f2",
                          color: "#dc2626",
                          border: "1px solid #fecaca",
                        }}
                      >
                        {B2B_DOCUMENT_KIND_LABELS[doc.kind]}
                      </span>
                    </td>
                    <td className="px-5 py-4" style={{ color: "#0a0a0a" }}>{doc.title}</td>
                    <td className="px-5 py-4" style={{ color: "#525252" }}>{d(doc.issuedAt)}</td>
                    <td className="px-5 py-4 font-mono" style={{ color: "#525252", fontSize: "12px" }}>
                      {doc.relatedOrderId ? (
                        <a href={`/b2b/ordini/${doc.relatedOrderId}`} style={{ color: "#dc2626" }}>{doc.relatedOrderId}</a>
                      ) : doc.relatedInvoiceId ? (
                        <a href={`/b2b/fatture/${doc.relatedInvoiceId}`} style={{ color: "#dc2626" }}>{doc.relatedInvoiceId}</a>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {doc.pdfAvailable && (
                        <a href={`/api/b2b/download/documents/${doc.id}`} style={{ color: "#dc2626", fontSize: "13px", fontWeight: 500 }}>
                          Scarica →
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
