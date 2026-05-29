/**
 * Layout area clienti (B2C). Niente Footer pubblico.
 * Le pagine protette chiamano requireCustomerSession() in cima al loro
 * Server Component; /clienti/login resta accessibile senza sessione.
 */
export default function ClientiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
