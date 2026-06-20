import { OutboundLink } from "@/components/common/OutboundLink";
import type { Place } from "@/data/types";

export function ListingRow({ place }: { place: Place }) {
  return (
    <li className="border-t border-line py-3 first:border-t-0">
      <div className="flex items-start justify-between gap-4">
        {/* Left: details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-base font-medium text-ink">{place.name}</p>
            <p className="text-xs text-faint">{place.distanceMiles} mi from stadium</p>
          </div>
          <p className="mt-0.5 text-sm text-muted">
            {place.phone && <span>{place.phone} · </span>}
            {place.address}
            {place.note && <span className="text-faint"> · {place.note}</span>}
          </p>
          <p className="mt-1.5 flex flex-wrap gap-x-4 text-sm">
            <OutboundLink href={place.mapUrl}>Map</OutboundLink>
            {place.website && <OutboundLink href={place.website}>Website</OutboundLink>}
          </p>
        </div>

        {/* Right: photo thumbnail → opens Google Maps */}
        {place.image && (
          <a
            href={place.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block h-20 w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-line sm:h-24 sm:w-36"
            aria-label={`${place.name} on Google Maps`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.image}
              alt={place.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
          </a>
        )}
      </div>
    </li>
  );
}
