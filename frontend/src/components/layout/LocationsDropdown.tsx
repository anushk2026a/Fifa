"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { citiesByCountry, COUNTRY_ORDER } from "@/data/cities";
import { countryFlagIso } from "@/lib/flags";
import { Flag } from "@/components/common/Flag";
import { cn } from "@/lib/utils";

export function LocationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const grouped = citiesByCountry();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-accent"
      >
        Locations
        <span aria-hidden className={cn("text-[0.7em] transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[min(92vw,640px)] -translate-x-1/2 pt-2">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {COUNTRY_ORDER.map((country) => (
                <div key={country}>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-faint">
                    <Flag iso2={countryFlagIso(country)} label={country} className="h-3.5 w-5" /> {country}
                  </p>
                  <ul className="space-y-1">
                    {grouped[country].map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/cities/${c.slug}`}
                          onClick={() => setOpen(false)}
                          className="block rounded px-2 py-1 text-sm text-ink hover:bg-accent-soft hover:text-accent-strong"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <Link
                href="/locations"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-accent hover:text-accent-strong"
              >
                View all locations →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
