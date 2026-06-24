import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { CityCard } from "@/components/common/CityCard";
import { Flag } from "@/components/common/Flag";
import { AosInit } from "@/components/common/AosInit";
import { citiesByCountry, COUNTRY_ORDER } from "@/data/cities";
import { countryFlagIso } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Host Cities — FIFA World Cup 2026",
  description:
    "All 16 FIFA World Cup 2026 host cities across the USA, Canada and Mexico. Pick a city for restaurants, hotels, transport, tickets and fan zones near the stadium.",
};

export default function LocationsPage() {
  const grouped = citiesByCountry();
  return (

    <>
      <AosInit />
      <section className="bg-gradient-to-b from-[#012A6B] to-[#001B44] text-white">
        <Container className="py-12 sm:py-16">
          <h1
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            data-aos="fade-right"
            data-aos-duration="700"
          >
            Host cities
          </h1>
          <p
            className="mt-3 max-w-2xl text-base !text-white/70 font-medium"
            data-aos="fade-right"
            data-aos-delay="120"
            data-aos-duration="700"
          >
            16 cities across three countries. Pick yours to find restaurants, hotels,
            transport, tickets and fan zones near the stadium.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        {COUNTRY_ORDER.map((country) => (
          <div key={country} className="mb-10 last:mb-0">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-faint">
              <Flag iso2={countryFlagIso(country)} label={country} /> {country}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[country].map((city, i) => (
                <CityCard key={city.slug} city={city} index={i} />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
