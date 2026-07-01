import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { OutboundLink } from "@/components/common/OutboundLink";
import { CitySection, EmptyState } from "@/components/city/CitySection";
import { CityBanner } from "@/components/city/CityBanner";
import { ListingRow } from "@/components/city/ListingRow";
import { JsonLd } from "@/components/common/JsonLd";
import { cityJsonLd } from "@/lib/seo";
import { CITIES, getCity } from "@/data/cities";
import { youtubeEmbed } from "@/lib/utils";
import type { HotelBand, RestaurantBand } from "@/data/types";

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "City not found" };
  return {
    title: city.seo.title,
    description: city.seo.description,
    openGraph: {
      title: city.seo.title,
      description: city.seo.description,
      images: city.bannerImage ? [{ url: city.bannerImage }] : undefined,
    },
  };
}

const RESTAURANT_BANDS: { band: RestaurantBand; label: string }[] = [
  { band: "2mi", label: "Within 2 miles" },
  { band: "5mi", label: "Within 5 miles" },
  { band: "10mi", label: "Within 10 miles" },
  { band: "20mi", label: "Within 20 miles" },
];

const HOTEL_BANDS: { band: HotelBand; label: string }[] = [
  { band: "2mi", label: "Within 2 miles" },
  { band: "5mi", label: "Within 5 miles" },
  { band: "10mi", label: "Within 10 miles" },
  { band: "20mi", label: "Within 20 miles" },
];

const TRANSPORT_LABELS: Record<string, string> = {
  shared_ride: "Shared ride",
  metro: "Metro & transit",
  parking: "Parking",
  image: "image_url",
  getting_there: "Getting there",
};

const ANCHORS = [
  { id: "restaurants", label: "Restaurants" },
  { id: "hotels", label: "Hotels" },
  { id: "transportation", label: "Transport" },
  { id: "tickets", label: "Tickets" },
  { id: "screening", label: "Match Screening" },
];

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const hasRestaurants = RESTAURANT_BANDS.some(
    (b) => (city.restaurants[b.band]?.length ?? 0) > 0,
  );
  const hasHotels = HOTEL_BANDS.some(
    (b) => (city.hotels[b.band]?.length ?? 0) > 0,
  );

  return (
    <>
      <JsonLd data={cityJsonLd(city)} />

      {/* Banner — city photo */}
      <CityBanner city={city} />

      {/* Sticky anchor chips */}
      <div className="sticky top-16 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <Container>
          <nav
            aria-label="City sections"
            className="flex gap-1 overflow-x-auto py-2"
          >
            {ANCHORS.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="whitespace-nowrap rounded-full px-3 py-1 text-sm text-muted hover:bg-accent-soft hover:text-accent-strong"
              >
                {a.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {/* Restaurants */}
      <CitySection id="restaurants" title="Restaurants">
        {hasRestaurants ? (
          <div className="space-y-6">
            {RESTAURANT_BANDS.map(({ band, label }) => {
              const places = city.restaurants[band] ?? [];
              if (places.length === 0) return null;
              return (
                <div key={band}>
                  <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-accent">
                    {label}
                  </h3>
                  <ul>
                    {places.map((p) => (
                      <ListingRow key={p.name} place={p} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState>
            Curated restaurant listings for {city.name} are coming soon. In the
            meantime, search near{" "}
            <OutboundLink href={city.stadium.mapUrl}>
              {city.stadium.name}
            </OutboundLink>
            .
          </EmptyState>
        )}
      </CitySection>

      {/* Hotels */}
      <CitySection id="hotels" title="Hotels">
        {hasHotels ? (
          <div className="space-y-6">
            {HOTEL_BANDS.map(({ band, label }) => {
              const places = city.hotels[band] ?? [];
              if (places.length === 0) return null;
              return (
                <div key={band}>
                  <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-accent">
                    {label}
                  </h3>
                  <ul>
                    {places.map((p) => (
                      <ListingRow key={p.name} place={p} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState>
            Curated hotel listings for {city.name} are coming soon. In the
            meantime, search near{" "}
            <OutboundLink href={city.stadium.mapUrl}>
              {city.stadium.name}
            </OutboundLink>
            .
          </EmptyState>
        )}
      </CitySection>

      {/* Transportation */}
      <CitySection id="transportation" title="Transportation">
        <ul className="space-y-4">
          {city.transportation.map((t) => (
            <li
              key={t.title}
              className="border-t border-line pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                    {TRANSPORT_LABELS[t.category] ?? t.category}
                  </p>
                  {t.links && t.links.length > 0 ? (
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-base text-ink">
                      {t.links.map((l) => (
                        <OutboundLink key={l.label} href={l.url}>
                          {l.label}
                        </OutboundLink>
                      ))}
                    </p>
                  ) : (
                    <p className="mt-1 text-base text-ink">
                      {t.url ? <OutboundLink href={t.url}>{t.title}</OutboundLink> : t.title}
                    </p>
                  )}
                  {t.note && <p className="mt-1.5 text-sm text-muted">{t.note}</p>}
                  {/* {t.video && youtubeEmbed(t.video) && (
                    <div className="mt-3 max-w-xl">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-faint">
                        Travel guide
                      </p>
                      <div className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] border border-line">
                        <iframe
                          src={youtubeEmbed(t.video)!}
                          title={`How to reach ${city.stadium.name}`}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                    </div>
                  )} */}
                </div>
                {t.image && (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block h-20 w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-line sm:h-24 sm:w-36"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.image}
                      alt={t.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CitySection>

      {/* Tickets */}
      <CitySection id="tickets" title="Tickets">
        <ul className="space-y-3">
          {city.tickets.map((t) => (
            <li
              key={t.label}
              className="flex items-center justify-between gap-4 border-t border-line pt-3 first:border-t-0 first:pt-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-base text-ink">
                  <OutboundLink href={t.url}>{t.label}</OutboundLink>
                  {t.official && (
                    <span className="ml-2 text-xs font-medium text-accent">
                      Official
                    </span>
                  )}
                </p>
              </div>
              {t.image && (
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block h-20 w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-line sm:h-24 sm:w-36"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt={t.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-[var(--radius-card)] border border-line bg-paper px-4 py-3 text-sm text-muted">
          Buy tickets from official FIFA sources. Direct Link!
        </p>
      </CitySection>

      {/* Match Screening Zone */}
      <CitySection id="screening" title="Match Screening Zone">
        {city.screeningZones.length > 0 ? (
          <ul className="space-y-4">
            {city.screeningZones.map((z) => (
              <li
                key={z.name}
                className="border-t border-line pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {z.note && (
                      <p className="mb-1 text-sm text-faint">{z.note}</p>
                    )}
                    <p className="text-base font-medium text-ink">
                      <OutboundLink href={z.url}>{z.name}</OutboundLink>
                    </p>
                    {z.address && (
                      <p className="mt-0.5 text-sm text-muted">{z.address}</p>
                    )}
                  </div>
                  {z.image && (
                    <a
                      href={z.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block h-20 w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-line sm:h-24 sm:w-36"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={z.image}
                        alt={z.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState>
            Fan festival and public viewing details are coming soon.
          </EmptyState>
        )}
      </CitySection>

      <Container className="py-8">
        <Link
          href="/locations"
          className="text-sm font-medium text-accent hover:text-accent-strong"
        >
          ← All host cities
        </Link>
      </Container>
    </>
  );
}
