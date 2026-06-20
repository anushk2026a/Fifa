import Image from "next/image";
import { Container } from "@/components/common/Container";
import { OutboundLink } from "@/components/common/OutboundLink";
import type { City } from "@/data/types";

export function CityBanner({ city }: { city: City }) {
  return (
    <section className="relative isolate flex min-h-[340px] items-end overflow-hidden border-b border-line sm:min-h-[520px]">
      {/* Background Image */}
      {city.bannerImage && (
        <Image
          src={city.bannerImage}
          alt={`${city.name} — ${city.stadium.name}`}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/70" />

      <Container className="relative z-10 py-12">
        <div className="max-w-3xl text-white">
          <p className="text-sm font-medium !text-white opacity-90">
            {city.country} · {city.region} Region
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight !text-white sm:text-6xl">
            {city.name}
          </h1>

          <p className="mt-4 text-lg !text-white opacity-95">
            {city.stadium.name}
            {city.stadium.capacity &&
              ` · ${city.stadium.capacity.toLocaleString()} Capacity`}
          </p>

          <p className="mt-2 text-sm !text-white opacity-90">
            {city.stadium.address} ·{" "}
            <OutboundLink
              href={city.stadium.mapUrl}
              className="!text-white underline underline-offset-4 hover:opacity-80"
            >
              View on Map
            </OutboundLink>
          </p>

          <p className="mt-5 max-w-2xl text-base leading-7 !text-white opacity-95">
            <span className="font-semibold !text-white">
              Getting There:
            </span>{" "}
            {city.gettingThere}
          </p>
        </div>
      </Container>
    </section>
  );
}