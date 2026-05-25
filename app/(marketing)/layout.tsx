/**
 * Layout (marketing): passthrough. Navbar e Footer vivono dentro i layout
 * figli specifici, così possono ereditare il theme giusto:
 *  - landing root (page.tsx): dark
 *  - (secondary) sub-group: light
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
