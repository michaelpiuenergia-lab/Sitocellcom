import { requireB2bSession } from "@/lib/auth/guards";
import { B2bNavbar } from "@/components/b2b/b2b-navbar";
import { ProfileForm } from "./profile-form";
import { PasswordChangeForm } from "./password-change-form";

export const dynamic = "force-dynamic";

export default async function B2bAccountPage() {
  const ctx = await requireB2bSession("/b2b/account");
  const { customer } = ctx;

  return (
    <>
      <B2bNavbar customer={customer} />

      <main className="pt-24 pb-16 px-6 lg:px-16 max-w-[800px] mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-500">
            Account aziendale
          </span>
          <h1
            className="font-sans tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#0a0a0a", lineHeight: 1.05 }}
          >
            Il tuo account
          </h1>
          <p style={{ fontSize: "14px", color: "#525252" }}>
            Modifica i dati di contatto e cambia password.
            Per modificare ragione sociale, P.IVA o listino contatta{" "}
            <a href="mailto:b2b@cellcom.it" className="underline">
              b2b@cellcom.it
            </a>
            .
          </p>
        </div>

        {/* Dati aziendali — read-only */}
        <section className="rounded-2xl p-6 flex flex-col gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
          <h2
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}
          >
            Dati aziendali
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <ReadField label="Ragione sociale" value={customer.company} />
            <ReadField label="Partita IVA" value={customer.vatNumber} />
            <ReadField label="Listino assegnato" value={customer.pricingTier?.name ?? "Standard B2B"} />
            <ReadField label="Codice listino" value={customer.pricingTier?.code ?? "—"} />
          </div>
        </section>

        {/* Dati referente — editable */}
        <section className="rounded-2xl p-6 flex flex-col gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
          <h2
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}
          >
            Dati referente
          </h2>
          <ProfileForm
            initial={{
              name: customer.name,
              email: customer.email,
              phone: customer.phone ?? "",
            }}
          />
        </section>

        {/* Cambio password */}
        <section className="rounded-2xl p-6 flex flex-col gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid #ececec" }}>
          <h2
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#737373" }}
          >
            Cambio password
          </h2>
          <PasswordChangeForm />
        </section>
      </main>
    </>
  );
}

function ReadField({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="font-mono uppercase"
        style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#a3a3a3" }}
      >
        {label}
      </span>
      <span
        className="font-sans"
        style={{ fontSize: "14px", color: "#0a0a0a", fontWeight: 500 }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}
