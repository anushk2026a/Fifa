"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Match } from "@/data/types";
import { matchesOn, prettyDate, ymd } from "@/lib/schedule";
import { getCity } from "@/data/cities";

function MatchRow({ m }: { m: Match }) {
  const city = getCity(m.citySlug);
  const finished = m.status === "finished";
  return (
    <li className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">
          <span>{m.home.name}</span>
          {finished ? (
            <span className="mx-2 font-semibold text-accent">
              {m.home.score}–{m.away.score}
            </span>
          ) : (
            <span className="mx-2 text-faint">vs</span>
          )}
          <span>{m.away.name}</span>
        </p>
        <p className="truncate text-xs text-muted">
          {city ? (
            <Link href={`/cities/${city.slug}`} className="hover:text-accent">
              {city.name}
            </Link>
          ) : (
            m.citySlug
          )}{" "}
          · {m.stadium}
        </p>
      </div>
      <span className="shrink-0 text-xs font-medium text-faint">
        {finished ? "Full time" : m.status === "live" ? "Live" : m.kickoff}
      </span>
    </li>
  );
}

function DayBlock({ label, date }: { label: string; date: string }) {
  const matches = matchesOn(date);
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">{label}</h3>
        <span className="text-xs text-faint">{prettyDate(date)}</span>
      </div>
      {matches.length > 0 ? (
        <ul>{matches.map((m, i) => <MatchRow key={i} m={m} />)}</ul>
      ) : (
        <p className="py-3 text-sm text-muted">No matches scheduled.</p>
      )}
    </div>
  );
}

export function MatchList() {
  // Compute on the client so "today/tomorrow" follow the visitor's date.
  const [dates, setDates] = useState<{ today: string; tomorrow: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const tmr = new Date(now);
    tmr.setDate(now.getDate() + 1);
    setDates({ today: ymd(now), tomorrow: ymd(tmr) });
  }, []);

  if (!dates) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 rounded-[var(--radius-card)] border border-line bg-surface" />
        <div className="h-32 rounded-[var(--radius-card)] border border-line bg-surface" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DayBlock label="Today" date={dates.today} />
      <DayBlock label="Tomorrow" date={dates.tomorrow} />
    </div>
  );
}
