import { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Corsi — Cellcom Group",
  description:
    "Corsi di riparazione smartphone per professionisti e hobbisti. Formazione pratica su tutti i modelli.",
};

export default function CorsiPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Corsi" }]} />
      <main className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-8 items-center text-center max-w-xl mx-auto">
          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
              I nostri <span className="italic text-brand-500">corsi</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              La formazione di riparazione smartphone è gestita direttamente da SmartphoneFix.it.
            </p>
          </div>

          <div className="w-full p-8 rounded-2xl border border-border bg-card flex flex-col gap-6 items-center">
            <p className="text-muted-foreground leading-relaxed">
              Corsi certificati per professionisti e curiosi. Dal saper aprire un device alla
              microsaldatura BGA. Tutto su SmartphoneFix.it.
            </p>
            <a
              href="https://smartphonefix.it"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] bg-linear-to-br from-brand-600 to-brand-800 text-white font-semibold text-[15px] hover:shadow-[0_8px_32px_-8px_rgba(220,38,38,0.6)] transition-shadow duration-300"
            >
              Vai ai corsi
              <span>↗</span>
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            Verrai reindirizzato a{" "}
            <a
              href="https://smartphonefix.it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-500 hover:underline"
            >
              smartphonefix.it
            </a>{" "}
            — il portale dedicato alla formazione del Gruppo Cellcom.
          </p>
        </div>
      </main>
    </>
  );
}
