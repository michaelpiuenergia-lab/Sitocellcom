import { Breadcrumb } from "@/components/layout/breadcrumb";
import { RepairWizard } from "@/components/repairs/repair-wizard";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { H1, Accent } from "@/components/ui/heading";
import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Richiedi riparazione — Cellcom Group",
  description:
    "Wizard riparazione: scegli telefono, problema, modalità (negozio / spedizione / domicilio) e appuntamento. Diagnosi gratuita, garanzia 12 mesi.",
};

export default async function RichiediPage() {
  const t = await getT();
  return (
    <>
      <Breadcrumb
        items={[
          { label: t("bc.home"), href: "/" },
          { label: t("bc.repairs"), href: "/riparazioni" },
          { label: t("rep.request.eyebrow") },
        ]}
      />
      <Container className="pt-12 lg:pt-16 pb-10">
        <div className="max-w-2xl flex flex-col gap-5">
          <Eyebrow>{t("rep.request.eyebrow")}</Eyebrow>
          <H1 as="h1">
            {t("rep.request.titleA")} <Accent>{t("rep.request.accent")}</Accent>
          </H1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("rep.request.intro")}
          </p>
        </div>
      </Container>

      <Container className="pb-24">
        <RepairWizard />
      </Container>
    </>
  );
}
