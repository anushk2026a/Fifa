"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES } from "@/data/cities";

const SERVICES = [
  { id: "restaurants", label: "Restaurants & Dining" },
  { id: "hotels", label: "Hotels & Stays" },
  { id: "transportation", label: "Transportation" },
  { id: "tickets", label: "Match Tickets" },
  { id: "screening", label: "Watch & Fan Zones" },
];

export function DirectorySearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [service, setService] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;
    
    let url = `/cities/${city}`;
    if (service) {
      url += `#${service}`;
    }
    
    router.push(url);
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm md:p-8">
      <h2 className="text-lg font-semibold text-ink">Refine Your Search</h2>
      <p className="mt-1 text-sm text-muted">
        Use our directory finder to instantly discover curated local recommendations for your host city:
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col items-end gap-4 md:flex-row">
        <div className="w-full flex-1">
          <label htmlFor="city-select" className="mb-2 block text-sm font-medium text-ink">
            Host City
          </label>
          <select
            id="city-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full rounded-[var(--radius-card)] border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
          >
            <option value="" disabled>Select City</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex-1">
          <label htmlFor="service-select" className="mb-2 block text-sm font-medium text-ink">
            Directory Service
          </label>
          <select
            id="service-select"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-[var(--radius-card)] border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
          >
            <option value="">Any Service</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!city}
          className="w-full rounded-[var(--radius-card)] border border-accent bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        >
          Search &gt;
        </button>
      </form>
    </div>
  );
}
