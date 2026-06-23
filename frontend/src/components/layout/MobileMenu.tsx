"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/data/site";
import { citiesByCountry, COUNTRY_ORDER } from "@/data/cities";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const grouped = citiesByCountry();
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded border border-line text-ink"
      >
        <span className="sr-only">Menu</span>
        <div className="space-y-1.5">
          <span
            className={cn(
              "block h-0.5 w-5 bg-ink transition",
              open && "translate-y-2 rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-5 bg-ink transition",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-5 bg-ink transition",
              open && "-translate-y-2 -rotate-45",
            )}
          />
        </div>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-line bg-surface pb-2 h-[calc(100vh-100px)] overflow-y-auto">
          <nav className="px-4 py-3" aria-label="Mobile">
            <ul className="divide-y divide-line">
              {NAV_LINKS.map((link) =>
                link.label === "Locations" ? (
                  <li key={link.href} className="py-1">
                    <button
                      type="button"
                      aria-expanded={citiesOpen}
                      onClick={() => setCitiesOpen((v) => !v)}
                      className="relative inline-flex items-center gap-1.5  text-sm !font-medium transition-colors duration-200 text-accent"
                    >
                      Locations
                      <span
                        aria-hidden
                        className={cn(
                          "text-xs transition-transform",
                          citiesOpen && "rotate-180",
                        )}
                      >
                        ▾
                      </span>
                    </button>
                    {citiesOpen && (
                      <div className="pb-2">
                        {COUNTRY_ORDER.map((country) => (
                          <div key={country} className="mb-2">
                            <p className="px-1 py-1 text-xs font-semibold uppercase tracking-wide text-faint">
                              {country}
                            </p>
                            <ul>
                              {grouped[country].map((c) => (
                                <li key={c.slug}>
                                  <Link
                                    href={`/cities/${c.slug}`}
                                    onClick={close}
                                    className="block px-2 py-1.5 text-sm text-ink"
                                  >
                                    {c.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link
                          href="/locations"
                          onClick={close}
                          className="block px-2 py-1.5 text-sm font-medium text-accent"
                        >
                          View all locations →
                        </Link>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="block py-3 text-base font-medium text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
