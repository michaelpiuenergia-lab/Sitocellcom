import { Hero } from "@/components/marketing/hero";
import { ServiceCards } from "@/components/marketing/service-cards";
import { getProducts } from "@/lib/crm-client";

export const revalidate = 60;

export default async function MarketingPage() {
  // Fetch 6 telefoni reali per popolare il cube carousel.
  // Se il CRM è offline o l'API key non è settata, il barrel ritorna mock
  // e il cube cade comunque su PhoneSilhouette fallback.
  let devices: Awaited<ReturnType<typeof getProducts>>["items"] = [];
  try {
    const res = await getProducts({ kind: "device", limit: 6 });
    devices = res.items;
  } catch {
    devices = [];
  }

  return (
    <main>
      <Hero devices={devices} />
      <ServiceCards />
    </main>
  );
}
