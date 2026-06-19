import Link from "next/link";
import Image from "next/image";
import type { City } from "@/data/types";

export function CityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-colors hover:border-accent"
    >
      {city.bannerImage && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={city.bannerImage}
            alt={`${city.name} — ${city.stadium.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-lg font-semibold text-ink group-hover:text-accent-strong">{city.name}</span>
        <span className="mt-0.5 text-sm text-muted">{city.stadium.name}</span>
        <span className="mt-3 text-sm text-faint">
          Restaurants · Hotels · Transport · Tickets · Fan zones
        </span>
        <span className="mt-3 text-sm font-medium text-accent">View city →</span>
      </div>
    </Link>
  );
}
