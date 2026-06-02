import { STORES } from "@/lib/stores";

/**
 * Componenti per inserire JSON-LD structured data nelle pagine. I bot
 * Google/Bing leggono <script type="application/ld+json"> e generano
 * rich snippets (mappa LocalBusiness, breadcrumb, Course card, ecc).
 *
 * Usi tipici:
 * - <OrganizationJsonLd/> nel root layout (una volta)
 * - <LocalBusinessJsonLd/> sulla /negozi (2 negozi)
 * - <BreadcrumbJsonLd items={...}/> su ogni pagina secondaria
 * - <ProductJsonLd .../> sulla scheda prodotto
 * - <CourseJsonLd .../> per corsi
 */

const SITE = "https://sitocellcom.vercel.app";

function jsonLd(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}#organization`,
    name: "Cellcom Group",
    url: SITE,
    logo: `${SITE}/logo-c.svg`,
    sameAs: ["https://cellcom.it", "https://fast-fix.it", "https://www.italianparts.it"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@cellcom.it",
        telephone: "+39-344-455-5678",
        areaServed: "IT",
        availableLanguage: ["it", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "b2b@cellcom.it",
        areaServed: "IT",
        availableLanguage: ["it", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "technical support",
        email: "assistenza@fast-fix.it",
        telephone: "+39-320-857-4006",
        areaServed: "IT",
        availableLanguage: ["it", "en"],
      },
    ],
  });
}

export function LocalBusinessJsonLd() {
  // Un nodo LocalBusiness per ogni negozio (Cellcom + Fast-Fix)
  return STORES.map((s) =>
    jsonLd({
      "@context": "https://schema.org",
      "@type": "MobilePhoneStore",
      "@id": `${SITE}/negozi#${s.id}`,
      name: s.name,
      legalName: s.legalName,
      ...(s.vatNumber ? { vatID: s.vatNumber } : {}),
      url: `${SITE}/negozi`,
      telephone: s.phone,
      email: s.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: s.address,
        addressLocality: s.city,
        postalCode: s.cap,
        addressRegion: s.province,
        addressCountry: "IT",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: s.lat,
        longitude: s.lng,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "19:30",
        },
      ],
      areaServed: { "@type": "Country", name: "Italy" },
    }),
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url?: string }[];
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      ...(item.url ? { item: item.url.startsWith("http") ? item.url : `${SITE}${item.url}` } : {}),
    })),
  });
}

export type ProductJsonLdProps = {
  name: string;
  description?: string | null;
  image?: string | null;
  brand?: string | null;
  sku?: string | null;
  priceEur?: string | null;
  condition?: "new" | "used" | "refurbished" | null;
  inStock?: boolean;
  url: string;
};

export function ProductJsonLd({
  name,
  description,
  image,
  brand,
  sku,
  priceEur,
  condition,
  inStock = true,
  url,
}: ProductJsonLdProps) {
  const conditionMap = {
    new: "https://schema.org/NewCondition",
    used: "https://schema.org/UsedCondition",
    refurbished: "https://schema.org/RefurbishedCondition",
  } as const;

  // priceEur arrives like "580,00 €" — strip per schema
  const priceNumber = priceEur ? priceEur.replace(/[^\d,]/g, "").replace(",", ".") : null;

  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(sku ? { sku } : {}),
    ...(condition ? { itemCondition: conditionMap[condition] } : {}),
    offers: {
      "@type": "Offer",
      url: url.startsWith("http") ? url : `${SITE}${url}`,
      priceCurrency: "EUR",
      ...(priceNumber ? { price: priceNumber } : {}),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE}#organization` },
    },
  });
}

export type CourseJsonLdProps = {
  id: string;
  name: string;
  description?: string | null;
  durationLabel?: string | null;
  priceEur?: string | null;
};

export function CourseJsonLd({
  id,
  name,
  description,
  durationLabel,
  priceEur,
}: CourseJsonLdProps) {
  const priceNumber = priceEur ? priceEur.replace(/[^\d,]/g, "").replace(",", ".") : null;

  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE}/corsi#${id}`,
    name,
    ...(description ? { description } : {}),
    provider: { "@id": `${SITE}#organization` },
    ...(durationLabel ? { timeRequired: durationLabel } : {}),
    ...(priceNumber
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE}/corsi`,
            priceCurrency: "EUR",
            price: priceNumber,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      location: {
        "@type": "Place",
        name: "Cellcom Academy",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Via Calatafimi 52",
          addressLocality: "San Benedetto del Tronto",
          postalCode: "63074",
          addressRegion: "AP",
          addressCountry: "IT",
        },
      },
    },
  });
}

export function WebSiteJsonLd() {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}#website`,
    name: "Cellcom Group",
    url: SITE,
    inLanguage: ["it-IT", "en-US"],
    publisher: { "@id": `${SITE}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/prodotti?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}
