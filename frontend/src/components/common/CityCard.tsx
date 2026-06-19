import Link from "next/link";
import type { City } from "@/data/types";

export function CityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-accent hover:bg-accent-soft"
    >
      <span className="text-lg font-semibold text-ink group-hover:text-accent-strong">
        {city.name}
      </span>
      <span className="mt-0.5 text-sm text-muted">{city.stadium.name}</span>
      <span className="mt-3 text-sm text-faint">
        Restaurants · Hotels · Transport · Tickets · Fan zones
      </span>
      <span className="mt-3 text-sm font-medium text-accent">View city →</span>
    </Link>
  );
}
