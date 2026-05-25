/**
 * Layout area B2B. Niente Footer pubblico, navbar dedicata.
 *
 * Le pagine figlie che devono essere protette chiamano direttamente
 * `requireB2bSession()` in cima al loro Server Component. Il layout NON fa
 * la guard, perché /b2b/login deve restare accessibile senza sessione.
 */
export default function B2bLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
