import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div data-theme="light" className="bg-background text-foreground min-h-screen pt-20">
        {children}
      </div>
      <Footer />
    </>
  );
}
