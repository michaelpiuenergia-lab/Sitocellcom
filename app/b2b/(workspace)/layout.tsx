/**
 * Layout workspace B2B (prodotti / richieste / account).
 * Bianco FastFix-style coerente col resto del sito.
 */
export default function B2bWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen pt-[72px]"
      style={{ backgroundColor: "#fafaf8" }}
    >
      {children}
    </div>
  );
}
