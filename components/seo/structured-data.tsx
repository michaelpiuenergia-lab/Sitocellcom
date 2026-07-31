import { COMPANY, STORES } from "@/lib/stores";

/**
 * Componenti per inserire JSON-LD structured data nelle pagine. I bot
 * Google/Bing leggono <script type="application/ld+json"> e generano
 * rich snippets (mappa LocalBusiness, breadcrumb, Course card, ecc).
 *
 * Usi tipici:
 * - <OrganizationJsonLd/> nel root layout (una volta)
 * - <LocalBusinessJsonLd/> sulla /negozi (2 sedi)
 * - <BreadcrumbJsonLd items={...}/> su ogni pagina secondaria
 * - <ProductJsonLd .../> sulla scheda prodotto
 * - <CourseJsonLd .../> per corsi
 */

import { SITE, SITE_URL } from "@/lib/seo/site";

const SITE_META = SITE;
const SITE_BASE = SITE_URL;

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
    "@id": `${SITE_BASE}#organization`,
    name: "Fast-Fix",
    legalName: COMPANY.legalName,
    vatID: COMPANY.vatNumber,
    taxID: COMPANY.taxCode,
    // Attività avviata nel 2016 — dato confermato su fonti pubbliche
    foundingDate: "2016",
    url: SITE_BASE,
    logo: `${SITE_BASE}/logo-fast-fix.svg`,
    sameAs: ["https://fast-fix.it"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@fast-fix.it",
        telephone: "+39-0735-501637",
        areaServed: "IT",
        availableLanguage: ["it", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "b2b@fast-fix.it",
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
  // Un nodo LocalBusiness per ogni sede Fast-Fix.
  //
  // È il blocco che alimenta il pannello locale di Google: più campi
  // compilati e coerenti con Google Business Profile, più è probabile
  // comparire nelle ricerche "riparazione telefoni vicino a me".
  return STORES.map((s) =>
    jsonLd({
      "@context": "https://schema.org",
      "@type": "MobilePhoneStore",
      "@id": `${SITE_BASE}/negozi#${s.id}`,
      name: s.name,
      legalName: s.legalName,
      description: `Riparazione smartphone, tablet e computer a ${s.city}. Diagnosi gratuita, preventivo in 24 ore, garanzia 12 mesi. Vendita ricambi, acquisto usato e ingrosso per rivenditori.`,
      ...(s.vatNumber ? { vatID: s.vatNumber } : {}),
      url: `${SITE_BASE}/negozi`,
      image: `${SITE_BASE}/opengraph-image`,
      logo: `${SITE_BASE}/logo-fast-fix.svg`,
      telephone: s.phone,
      ...(s.mobile ? { contactPoint: { "@type": "ContactPoint", telephone: s.mobile, contactType: "customer service" } } : {}),
      email: s.email,
      priceRange: "€€",
      currenciesAccepted: "EUR",
      paymentAccepted: "Contanti, Carta di credito, Bonifico bancario",
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
          closes: "13:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "15:30",
          closes: "19:30",
        },
      ],
      // I comuni da cui arrivano i clienti: aiuta a intercettare le ricerche
      // fatte dai paesi limitrofi, non solo dalla città della sede.
      areaServed: [
        ...SITE_META.nearbyCities.map((name) => ({ "@type": "City", name })),
        { "@type": "City", name: s.city },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servizi Fast-Fix",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Riparazione smartphone" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sostituzione display e batteria" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Microsaldatura e recupero dati" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Acquisto e vendita usato garantito" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vendita ricambi e ingrosso B2B" } },
        ],
      },
    }),
  );
}

/**
 * Schema del servizio di riparazione. Separato dal LocalBusiness perché
 * descrive la prestazione (diagnosi gratuita, garanzia, tempi) e può
 * comparire per ricerche sul servizio invece che sul negozio.
 */
export function RepairServiceJsonLd() {
  const main = STORES[0];
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_BASE}/riparazioni#service`,
    serviceType: "Riparazione smartphone, tablet, computer e console",
    name: "Riparazione dispositivi Fast-Fix",
    description:
      "Laboratorio interno a San Benedetto del Tronto: diagnosi gratuita, preventivo entro 24 ore, garanzia 12 mesi su manodopera e ricambi. Nessun costo se il preventivo viene rifiutato.",
    provider: { "@id": `${SITE_BASE}#organization` },
    url: `${SITE_BASE}/riparazioni`,
    areaServed: [
      ...SITE_META.nearbyCities.map((name) => ({ "@type": "City", name })),
      { "@type": "City", name: SITE_META.city },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_BASE}/riparazioni/richiedi`,
      servicePhone: main?.phone,
      serviceLocation: main
        ? {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress: main.address,
              addressLocality: main.city,
              postalCode: main.cap,
              addressRegion: main.province,
              addressCountry: "IT",
            },
          }
        : undefined,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      description: "Diagnosi gratuita, preventivo entro 24 ore, nessun costo se rifiuti",
    },
  });
}

/**
 * FAQ in dati strutturati: sono le domande che le persone digitano davvero,
 * e Google può mostrarle come risultato espanso.
 */
export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  });
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
      ...(item.url ? { item: item.url.startsWith("http") ? item.url : `${SITE_BASE}${item.url}` } : {}),
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
      url: url.startsWith("http") ? url : `${SITE_BASE}${url}`,
      priceCurrency: "EUR",
      ...(priceNumber ? { price: priceNumber } : {}),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE_BASE}#organization` },
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
    "@id": `${SITE_BASE}/corsi#${id}`,
    name,
    ...(description ? { description } : {}),
    provider: { "@id": `${SITE_BASE}#organization` },
    ...(durationLabel ? { timeRequired: durationLabel } : {}),
    ...(priceNumber
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE_BASE}/corsi`,
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
        name: "Fast-Fix Academy",
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
    "@id": `${SITE_BASE}#website`,
    name: "Fast-Fix",
    url: SITE_BASE,
    inLanguage: ["it-IT", "en-US"],
    publisher: { "@id": `${SITE_BASE}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_BASE}/prodotti?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}
