import Link from "next/link";
import Image from "next/image";
import type { City } from "@/data/types";
import { MdRestaurant, MdHotel, MdDirectionsTransit, MdConfirmationNumber, MdCelebration } from "react-icons/md";

const categories = [
  { icon: MdRestaurant, label: "Restaurants" },
  { icon: MdHotel, label: "Hotels" },
  { icon: MdDirectionsTransit, label: "Transport" },
  { icon: MdConfirmationNumber, label: "Tickets" },
  { icon: MdCelebration, label: "Fan zones" },
];

function StadiumArcSVG() {
  return (
    <svg
      viewBox="0 0 320 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0 right-0 w-full"
      aria-hidden="true"
    >
      <path d="M0 72 Q160 -20 320 72" stroke="currentColor" strokeWidth="1" className="text-white/20" />
      <path d="M30 72 Q160 8 290 72" stroke="currentColor" strokeWidth="1" className="text-white/15" />
      <path d="M65 72 Q160 28 255 72" stroke="currentColor" strokeWidth="0.75" className="text-white/10" />
      <ellipse cx="160" cy="72" rx="38" ry="10" stroke="currentColor" strokeWidth="0.75" className="text-white/15" />
      <line x1="0" y1="72" x2="0" y2="52" stroke="currentColor" strokeWidth="1" className="text-white/20" />
      <line x1="320" y1="72" x2="320" y2="52" stroke="currentColor" strokeWidth="1" className="text-white/20" />
    </svg>
  );
}

function LocationPinSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M8 0C4.686 0 2 2.686 2 6c0 4.5 6 14 6 14s6-9.5 6-14c0-3.314-2.686-6-6-6z" fill="currentColor" />
      <circle cx="8" cy="6" r="2" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

function ArrowSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-200 hover:border-accent hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Image / Banner */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-accent/30 to-accent/10">
        {city.bannerImage ? (
          <Image
            src={city.bannerImage}
            alt={`${city.name} — ${city.stadium.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-accent/20 to-transparent" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <StadiumArcSVG />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60 mb-0.5">
                Match Day Guide
              </p>
              <h3 className="text-xl font-bold text-white leading-tight">{city.name}</h3>
            </div>
            <LocationPinSVG className="w-5 h-6 text-accent flex-shrink-0 mb-0.5 opacity-90" />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4 gap-3">
        {/* Stadium row */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-3 flex-shrink-0 text-muted" aria-hidden="true">
            <rect x="1" y="5" width="18" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" />
            <path d="M5 5 Q10 0 15 5" stroke="currentColor" strokeWidth="1.25" />
            <line x1="10" y1="5" x2="10" y2="13" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
          </svg>
          <span className="text-sm text-muted truncate">{city.stadium.name}</span>
        </div>

        <div className="h-px bg-line" />

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-faint transition-colors group-hover:border-accent/30 group-hover:text-muted"
            >
              <Icon className="w-3 h-3" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-auto pt-1 flex items-center justify-between">
          <span className="text-xs text-faint">Everything you need</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-all duration-150 group-hover:gap-2">
            View guide
            <ArrowSVG className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}