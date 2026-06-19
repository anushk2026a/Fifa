import Image from "next/image";
import { Container } from "@/components/common/Container";
import { OutboundLink } from "@/components/common/OutboundLink";
import type { City } from "@/data/types";

export function CityBanner({ city }: { city: City }) {
  return (
    <section className="relative isolate flex min-h-[340px] items-end overflow-hidden border-b border-line sm:min-h-[420px]">
      {city.bannerImage && (
        <Image
          src={city.bannerImage}
          alt={`${city.name} — ${city.stadium.name}`}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
      )}
      {/* legibility scrim — flat, no decorative gradient stack, now with subtle blur */}
      <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-[3px]" />

      <Container className="py-10 text-white">
        <p className="text-sm font-medium text-white/85">
          {city.country} · {city.region} region
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{city.name}</h1>
        <p className="mt-3 text-lg text-white/90">
          {city.stadium.name}
          {city.stadium.capacity ? ` · ${city.stadium.capacity.toLocaleString()} capacity` : ""}
        </p>
        <p className="mt-1 text-sm text-white/80">
          {city.stadium.address} ·{" "}
          <OutboundLink href={city.stadium.mapUrl} className="text-white underline hover:text-white">
            Map
          </OutboundLink>
        </p>
        <p className="mt-4 max-w-2xl text-sm text-white/90">
          <span className="font-medium text-white">Getting there: </span>
          {city.gettingThere}
        </p>
      </Container>
    </section>
  );
}
