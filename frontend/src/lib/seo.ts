import type { City } from "@/data/types";
import { SITE } from "@/data/site";
import { FAQ } from "@/data/faq";

const COUNTRY_CODE: Record<City["country"], string> = {
  USA: "US",
  Canada: "CA",
  Mexico: "MX",
};

const base = `https://${SITE.domain}`;

/** Organization + WebSite for the home page. */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#org`,
        name: SITE.name,
        url: base,
        description: SITE.description,
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#site`,
        url: base,
        name: SITE.name,
        publisher: { "@id": `${base}/#org` },
      },
    ],
  };
}

/** FAQPage structured data — makes the FAQ eligible for Google rich results. */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Place + StadiumOrArena + Breadcrumbs for a city page. */
export function cityJsonLd(city: City) {
  const url = `${base}/cities/${city.slug}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        "@id": `${url}#city`,
        name: city.name,
        url,
        address: {
          "@type": "PostalAddress",
          addressLocality: city.name,
          addressCountry: COUNTRY_CODE[city.country],
        },
      },
      {
        "@type": "StadiumOrArena",
        name: city.stadium.name,
        address: city.stadium.address,
        ...(city.stadium.capacity ? { maximumAttendeeCapacity: city.stadium.capacity } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
          { "@type": "ListItem", position: 2, name: "Locations", item: `${base}/locations/` },
          { "@type": "ListItem", position: 3, name: city.name, item: url },
        ],
      },
    ],
  };
}
