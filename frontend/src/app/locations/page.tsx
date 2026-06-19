import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { CityCard } from "@/components/common/CityCard";
import { citiesByCountry, COUNTRY_ORDER } from "@/data/cities";

export const metadata: Metadata = {
  title: "Host Cities — FIFA World Cup 2026",
  description:
    "All 16 FIFA World Cup 2026 host cities across the USA, Canada and Mexico. Pick a city for restaurants, hotels, transport, tickets and fan zones near the stadium.",
};

const FLAG: Record<string, string> = { USA: "🇺🇸", Canada: "🇨🇦", Mexico: "🇲🇽" };

export default function LocationsPage() {
  const grouped = citiesByCountry();
  return (
    <>
      <section className="border-b border-line bg-accent-soft">
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Host cities</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            16 cities across three countries. Pick yours to find restaurants, hotels,
            transport, tickets and fan zones near the stadium.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        {COUNTRY_ORDER.map((country) => (
          <div key={country} className="mb-10 last:mb-0">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-faint">
              <span aria-hidden>{FLAG[country]}</span> {country}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[country].map((city) => (
                <CityCard key={city.slug} city={city} />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
