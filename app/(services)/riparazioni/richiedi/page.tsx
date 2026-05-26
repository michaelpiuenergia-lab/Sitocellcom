import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RepairWizard } from "@/components/repairs/repair-wizard";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { H1, Accent } from "@/components/ui/heading";

export const metadata = {
  title: "Richiedi riparazione — Cellcom Group",
  description:
    "Wizard riparazione: scegli telefono, problema, modalità (negozio / spedizione / domicilio) e appuntamento. Diagnosi gratuita, garanzia 12 mesi.",
};

export default function RichiediPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Riparazioni", href: "/riparazioni" },
          { label: "Richiedi riparazione" },
        ]}
      />
      <Container className="pt-12 lg:pt-16 pb-10">
        <div className="max-w-2xl flex flex-col gap-5">
          <Eyebrow>Wizard riparazione</Eyebrow>
          <H1 as="h1">
            Quale telefono <Accent>vuoi riparare?</Accent>
          </H1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Tre passi rapidi: telefono → problema → come fartelo arrivare.
            Diagnosi gratuita, nessun impegno fino al preventivo.
          </p>
        </div>
      </Container>

      <Container className="pb-24">
        <RepairWizard />
      </Container>
    </>
  );
}
