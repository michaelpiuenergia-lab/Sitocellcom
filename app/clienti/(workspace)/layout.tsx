import { requireCustomerSession } from "@/lib/auth/customer-guards";
import { ClientiNavbar } from "@/components/clienti/clienti-navbar";

export default async function ClientiWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customer } = await requireCustomerSession("/clienti");
  return (
    <div className="min-h-screen pt-[72px]" style={{ backgroundColor: "#fafaf8" }}>
      <ClientiNavbar customer={customer} />
      {children}
    </div>
  );
}
