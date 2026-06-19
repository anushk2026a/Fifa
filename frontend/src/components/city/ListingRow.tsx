import { OutboundLink } from "@/components/common/OutboundLink";
import type { Place } from "@/data/types";

export function ListingRow({ place }: { place: Place }) {
  return (
    <li className="border-t border-line py-3 first:border-t-0">
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
    </li>
  );
}
