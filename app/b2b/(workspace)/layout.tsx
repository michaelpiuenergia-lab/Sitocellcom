/**
 * Layout workspace B2B (prodotti / richieste / account).
 * Dark theme come il resto del sito.
 */
export default function B2bWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
