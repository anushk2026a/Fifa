"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { Match } from "@/data/types";
import { fetchMatchesApi } from "@/lib/matches-store";
import { teamFlagIso } from "@/lib/flags";
import { Flag } from "@/components/common/Flag";
import { localTime } from "@/lib/schedule";
import { Container } from "@/components/common/Container";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────

function toYMD(date: Date): string {
  // Format as YYYY-MM-DD in America/New_York time zone to match Eastern Time calendar dates
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function sameDay(a: Date, b: Date): boolean {
  return toYMD(a) === toYMD(b);
}

function buildCalendarWeeks(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDow = first.getDay(); // 0 = Sun

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const STATUS_COLOR: Record<Match["status"], string> = {
  live: "bg-red-500",
  scheduled: "bg-accent",
  finished: "bg-slate-400",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Match card inside the day panel ─────────────────────────────────────────

function MatchCard({ m }: { m: Match }) {
  const finished = m.status === "finished";
  const live = m.status === "live";
  const homeWin = finished && (m.home.score ?? 0) > (m.away.score ?? 0);
  const awayWin = finished && (m.away.score ?? 0) > (m.home.score ?? 0);

  return (
    <div className={`rounded-xl border ${live ? "border-red-300 bg-red-50" : "border-line bg-surface"} p-4 transition-all hover:shadow-md`}>
      {/* Status badge */}
      <div className="mb-3 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide
          ${live ? "bg-red-100 text-red-700" : finished ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-700"}`}>
          {live && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
          {m.status}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-faint">
          <Clock className="h-3 w-3" />
          {localTime(m.kickoffUtc)}
        </span>
      </div>

      {/* Teams */}
      <div className="space-y-2">
        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Flag iso2={teamFlagIso(m.home.code)} label={m.home.name} className="h-5 w-7" />
            <span className={`text-sm truncate ${homeWin ? "font-bold text-ink" : "font-medium text-ink"}`}>
              {m.home.name}
            </span>
          </div>
          {finished && (
            <span className={`text-lg font-bold tabular-nums ${homeWin ? "text-ink" : "text-muted"}`}>
              {m.home.score}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-line" />
          {!finished && <span className="text-[10px] font-semibold text-faint uppercase">vs</span>}
          {finished && <span className="text-xs font-bold text-faint">—</span>}
          <div className="h-px flex-1 bg-line" />
        </div>

        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Flag iso2={teamFlagIso(m.away.code)} label={m.away.name} className="h-5 w-7" />
            <span className={`text-sm truncate ${awayWin ? "font-bold text-ink" : "font-medium text-ink"}`}>
              {m.away.name}
            </span>
          </div>
          {finished && (
            <span className={`text-lg font-bold tabular-nums ${awayWin ? "text-ink" : "text-muted"}`}>
              {m.away.score}
            </span>
          )}
        </div>
      </div>

      {/* Venue */}
      <div className="mt-3 flex items-center gap-1 border-t border-line pt-2">
        <MapPin className="h-3 w-3 shrink-0 text-faint" />
        <span className="truncate text-[11px] text-faint">{m.stadium}</span>
      </div>
    </div>
  );
}

// ─── Main Calendar Page ───────────────────────────────────────────────────────

export default function SchedulePage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchMatchesApi();
    setAllMatches(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Build match-day lookup map: "YYYY-MM-DD" → Match[] using US Eastern Time Zone
  const matchDayMap = new Map<string, Match[]>();
  for (const m of allMatches) {
    const key = toYMD(new Date(m.kickoffUtc));
    if (!matchDayMap.has(key)) matchDayMap.set(key, []);
    matchDayMap.get(key)!.push(m);
  }

  const weeks = buildCalendarWeeks(viewYear, viewMonth);

  const selectedKey = toYMD(selectedDate);
  const selectedMatches = (matchDayMap.get(selectedKey) ?? [])
    .sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function selectDay(d: Date) {
    setSelectedDate(d);
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  }

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <>
      {/* Hero */}
      <div className="border-b border-line bg-gradient-to-br from-accent/10 via-paper to-paper py-10">
        <Container>
          <div className="flex items-center gap-3 mb-1">
            <Calendar className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-bold text-ink">Match Calendar</h1>
          </div>
          <p className="text-sm text-muted ml-9">
            FIFA World Cup 2026 — Full tournament schedule in US Eastern Time (ET). Click any date to see matches.
          </p>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* ── Calendar Grid ── */}
          <div>
            {/* Month navigation */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition hover:bg-paper hover:text-ink"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-center">
                <h2 className="text-base font-bold text-ink">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </h2>
                {!isCurrentMonth && (
                  <button
                    onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelectedDate(today); }}
                    className="text-[11px] font-medium text-accent hover:underline"
                  >
                    Back to today (ET)
                  </button>
                )}
              </div>
              <button
                onClick={nextMonth}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition hover:bg-paper hover:text-ink"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="mb-1 grid grid-cols-7 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="py-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint">{d}</div>
              ))}
            </div>

            {/* Weeks */}
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              {weeks.map((week, wi) => (
                <div key={wi} className={`grid grid-cols-7 ${wi < weeks.length - 1 ? "border-b border-line" : ""}`}>
                  {week.map((day, di) => {
                    if (!day) {
                      return <div key={di} className="min-h-[72px] border-r border-line bg-paper/40 last:border-r-0" />;
                    }
                    const key = toYMD(day);
                    const dayMatches = matchDayMap.get(key) ?? [];
                    const isToday = sameDay(day, today);
                    const isSelected = sameDay(day, selectedDate);
                    const hasMatches = dayMatches.length > 0;

                    // Determine dominant status
                    const hasLive = dayMatches.some(m => m.status === "live");
                    const hasScheduled = dayMatches.some(m => m.status === "scheduled");

                    return (
                      <button
                        key={di}
                        onClick={() => selectDay(day)}
                        className={`group relative min-h-[72px] p-1.5 text-left transition-all border-r border-line last:border-r-0
                          ${isSelected ? "bg-accent/10 ring-1 ring-inset ring-accent" : "hover:bg-paper"}
                          ${day.getMonth() !== viewMonth ? "opacity-40" : ""}
                        `}
                      >
                        {/* Day number */}
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold
                          ${isToday ? "bg-accent text-white" : isSelected ? "text-accent font-bold" : "text-ink"}`}>
                          {day.getDate()}
                        </span>

                        {/* Match dots */}
                        {hasMatches && (
                          <div className="mt-1 space-y-0.5">
                            {dayMatches.slice(0, 3).map((m, mi) => (
                              <div key={mi} className="flex items-center gap-1 overflow-hidden">
                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_COLOR[m.status]}`} />
                                <span className="truncate text-[9px] text-muted leading-tight">
                                  {m.home.code || m.home.name.slice(0, 3)} v {m.away.code || m.away.name.slice(0, 3)}
                                </span>
                              </div>
                            ))}
                            {dayMatches.length > 3 && (
                              <div className="text-[9px] text-faint">+{dayMatches.length - 3} more</div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-5 text-[11px] text-muted">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" />Live</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" />Scheduled</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400" />Finished</div>
            </div>
          </div>

          {/* ── Day panel ── */}
          <div ref={panelRef}>
            <div className="sticky top-20">
              {/* Header */}
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <h3 className="font-bold text-ink">
                    {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </h3>
                  {sameDay(selectedDate, today) && (
                    <span className="text-[11px] font-semibold text-accent uppercase tracking-wide">Today (ET)</span>
                  )}
                </div>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                  {selectedMatches.length} match{selectedMatches.length !== 1 ? "es" : ""}
                </span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="h-36 rounded-xl border border-line bg-surface animate-pulse" />
                  ))}
                </div>
              ) : selectedMatches.length > 0 ? (
                <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                  {selectedMatches.map((m, i) => (
                    <MatchCard key={i} m={m} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper py-16 text-center">
                  <Calendar className="mb-3 h-10 w-10 text-line" />
                  <p className="text-sm font-medium text-muted">No matches on this day</p>
                  <p className="mt-1 text-[11px] text-faint">Select a highlighted date on the calendar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
