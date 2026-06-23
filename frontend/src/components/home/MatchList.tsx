"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Match } from "@/data/types";
import { localTime, matchesOn, prettyDate, ymd } from "@/lib/schedule";
import { getCity } from "@/data/cities";
import { teamFlagIso } from "@/lib/flags";
import { Flag } from "@/components/common/Flag";
import { cn } from "@/lib/utils";

function TeamRow({
  team,
  finished,
  winner,
}: {
  team: Match["home"];
  finished: boolean;
  winner: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <Flag iso2={teamFlagIso(team.code)} label={team.name} />
        <span className={cn("truncate text-sm", winner ? "font-semibold text-ink" : "font-medium text-ink")}>
          {team.name}
        </span>
        <span className="shrink-0 text-xs text-faint">{team.code}</span>
      </div>
      {finished && (
        <span className={cn("tabular-nums text-base", winner ? "font-bold text-ink" : "font-semibold text-muted")}>
          {team.score}
        </span>
      )}
    </div>
  );
}

function MatchCard({ m }: { m: Match }) {
  const city = getCity(m.citySlug);
  const finished = m.status === "finished";
  const live = m.status === "live";
  const homeWin = finished && (m.home.score ?? 0) > (m.away.score ?? 0);
  const awayWin = finished && (m.away.score ?? 0) > (m.home.score ?? 0);

  return (
    <div className="flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-4">
      <div className="mb-1 flex items-center justify-between">
        {city ? (
          <Link href={`/cities/${city.slug}`} className="truncate text-xs font-medium text-muted hover:text-accent">
            {city.name}
          </Link>
        ) : (
          <span className="truncate text-xs font-medium text-muted">{m.citySlug}</span>
        )}
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
            live
              ? "bg-red-50 text-red-700"
              : finished
                ? "bg-paper text-faint"
                : "bg-accent-soft text-accent-strong",
          )}
        >
          {finished ? "Full time" : live ? "● Live" : localTime(m.kickoffUtc)}
        </span>
      </div>

      <div className="divide-y divide-line">
        <TeamRow team={m.home} finished={finished} winner={homeWin} />
        <TeamRow team={m.away} finished={finished} winner={awayWin} />
      </div>

      <p className="mt-2 truncate border-t border-line pt-2 text-xs text-faint">{m.stadium}</p>
    </div>
  );
}

function DayBlock({ label, date }: { label: string; date: string }) {
  const matches = matchesOn(date);
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">{label}</h3>
        <span className="text-xs text-faint">{prettyDate(date)}</span>
      </div>
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matches.map((m, i) => (
            <MatchCard key={i} m={m} />
          ))}
        </div>
      ) : (
        <p className="rounded-[var(--radius-card)] border border-dashed border-line bg-paper px-4 py-6 text-sm text-muted">
          No matches scheduled.
        </p>
      )}
    </div>
  );
}

export function MatchList() {
  const [dates, setDates] = useState<{ today: string; next: string; nextLabel: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    const today = ymd(now);

    // Find the next day with matches (skip empty days — happens when US kickoffs
    // fall on the following calendar day in the visitor's local timezone).
    let next = "";
    let nextLabel = "Tomorrow";
    for (let offset = 1; offset <= 60; offset++) {
      const d = new Date(now);
      d.setDate(now.getDate() + offset);
      const candidate = ymd(d);
      if (matchesOn(candidate).length > 0) {
        next = candidate;
        nextLabel = offset === 1 ? "Tomorrow" : prettyDate(candidate);
        break;
      }
    }

    setDates({ today, next, nextLabel });
  }, []);

  if (!dates) {
    return (
      <div className="space-y-6">
        <div className="h-24 rounded-[var(--radius-card)] border border-line bg-surface" />
        <div className="h-24 rounded-[var(--radius-card)] border border-line bg-surface" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DayBlock label="Today's Match" date={dates.today} />
      {dates.next && <DayBlock label="Next Match" date={dates.next} />}
    </div>
  );
}
