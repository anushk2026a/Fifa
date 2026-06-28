"use client";

import { useState } from "react";
import { MATCHES } from "@/data/matches";
import type { Match } from "@/data/types";
import { Search, Plus, X, Pencil, Check } from "lucide-react";
import { teamFlagIso, findTeamCode } from "@/lib/flags";
import { Flag } from "@/components/common/Flag";

type DraftMatch = {
  home: string;
  homeCode: string;
  away: string;
  awayCode: string;
  stadium: string;
  citySlug: string;
  kickoffUtc: string;
  status: Match["status"];
};

const STATUS_PILL: Record<Match["status"], string> = {
  live: "bg-red-100 text-red-700",
  finished: "bg-slate-100 text-slate-600",
  scheduled: "bg-blue-100 text-blue-700",
};

const fieldCls =
  "w-full rounded border border-line bg-paper px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent transition-colors";

const EMPTY_DRAFT: DraftMatch = {
  home: "", homeCode: "", away: "", awayCode: "",
  stadium: "", citySlug: "", kickoffUtc: "", status: "scheduled",
};

type PendingEntry = DraftMatch & { idx: number };

export default function MatchesPage() {
  const [matchesList, setMatchesList] = useState<Match[]>(MATCHES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Match["status"]>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [addDraft, setAddDraft] = useState<DraftMatch>(EMPTY_DRAFT);
  const [addError, setAddError] = useState<string | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<DraftMatch>(EMPTY_DRAFT);
  const [pendingEdits, setPendingEdits] = useState<Map<number, PendingEntry>>(new Map());
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const baseList = matchesList.map((m, i) => ({ ...m, idx: i }));

  const displayed = baseList.filter((m) => {
    const q = search.toLowerCase();
    const matchQ =
      m.home.name.toLowerCase().includes(q) ||
      m.away.name.toLowerCase().includes(q) ||
      m.citySlug.toLowerCase().includes(q) ||
      m.stadium.toLowerCase().includes(q);
    const matchF = filter === "all" || m.status === filter;
    return matchQ && matchF;
  });

  function handleHomeNameChange(name: string, isEdit = false) {
    const autoCode = findTeamCode(name);
    if (isEdit) {
      setEditDraft((prev) => ({
        ...prev,
        home: name,
        homeCode: autoCode || prev.homeCode,
      }));
    } else {
      setAddDraft((prev) => ({
        ...prev,
        home: name,
        homeCode: autoCode || prev.homeCode,
      }));
    }
  }

  function handleAwayNameChange(name: string, isEdit = false) {
    const autoCode = findTeamCode(name);
    if (isEdit) {
      setEditDraft((prev) => ({
        ...prev,
        away: name,
        awayCode: autoCode || prev.awayCode,
      }));
    } else {
      setAddDraft((prev) => ({
        ...prev,
        away: name,
        awayCode: autoCode || prev.awayCode,
      }));
    }
  }

  function handleAddMatch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!addDraft.home.trim() || !addDraft.away.trim()) {
      setAddError("Home and Away team names are required.");
      return;
    }
    if (!addDraft.stadium.trim()) {
      setAddError("Stadium name is required.");
      return;
    }

    const homeCode = addDraft.homeCode.trim().toUpperCase() || findTeamCode(addDraft.home) || addDraft.home.trim().slice(0, 3).toUpperCase();
    const awayCode = addDraft.awayCode.trim().toUpperCase() || findTeamCode(addDraft.away) || addDraft.away.trim().slice(0, 3).toUpperCase();

    const newMatch: Match = {
      home: {
        name: addDraft.home.trim(),
        code: homeCode,
      },
      away: {
        name: addDraft.away.trim(),
        code: awayCode,
      },
      stadium: addDraft.stadium.trim(),
      citySlug: addDraft.citySlug.trim().toLowerCase().replace(/\s+/g, "-") || "general",
      kickoffUtc: addDraft.kickoffUtc ? new Date(addDraft.kickoffUtc).toISOString() : new Date().toISOString(),
      status: addDraft.status,
    };

    setMatchesList((prev) => [newMatch, ...prev]);
    setAddDraft(EMPTY_DRAFT);
    setAddError(null);
    setShowAdd(false);
  }

  function startEdit(idx: number, m: Match) {
    setEditIdx(idx);
    setEditDraft({
      home: m.home.name, homeCode: m.home.code,
      away: m.away.name, awayCode: m.away.code,
      stadium: m.stadium, citySlug: m.citySlug,
      kickoffUtc: m.kickoffUtc, status: m.status,
    });
  }

  function cancelEdit() { setEditIdx(null); }

  function saveEdit(idx: number) {
    setPendingEdits((prev) => new Map(prev).set(idx, { ...editDraft, idx }));
    setSaved((prev) => new Set(prev).add(idx));
    setEditIdx(null);
    setTimeout(() => setSaved((prev) => { const s = new Set(prev); s.delete(idx); return s; }), 2000);
  }

  function approvePending(idx: number) {
    const pending = pendingEdits.get(idx);
    if (pending) {
      setMatchesList((prev) =>
        prev.map((m, i) => {
          if (i === idx) {
            return {
              ...m,
              home: { name: pending.home, code: pending.homeCode },
              away: { name: pending.away, code: pending.awayCode },
              stadium: pending.stadium,
              citySlug: pending.citySlug,
              kickoffUtc: pending.kickoffUtc,
              status: pending.status,
            };
          }
          return m;
        })
      );
    }
    setPendingEdits((prev) => { const m = new Map(prev); m.delete(idx); return m; });
  }

  function getMatch(m: typeof baseList[0]) {
    const p = pendingEdits.get(m.idx);
    if (p) {
      return {
        home: { name: p.home, code: p.homeCode },
        away: { name: p.away, code: p.awayCode },
        stadium: p.stadium, citySlug: p.citySlug,
        kickoffUtc: p.kickoffUtc, status: p.status,
        idx: m.idx, isPending: true,
      };
    }
    return { ...m, isPending: false };
  }

  const counts: Record<string, number> = {
    all: matchesList.length,
    live: matchesList.filter((m) => m.status === "live").length,
    scheduled: matchesList.filter((m) => m.status === "scheduled").length,
    finished: matchesList.filter((m) => m.status === "finished").length,
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5">
          {(["all", "scheduled", "finished"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition cursor-pointer ${
                filter === s
                  ? "bg-ink text-white"
                  : "text-muted hover:text-ink hover:bg-paper border border-line"
              }`}
            >
              {s} <span className="opacity-60">({counts[s]})</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-none sm:w-56">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-faint" />
            <input
              type="text"
              placeholder="Search teams or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-line bg-surface pl-7 pr-3 py-1.5 text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            onClick={() => { setShowAdd((v) => !v); setAddDraft(EMPTY_DRAFT); setAddError(null); }}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              showAdd ? "bg-paper border border-line text-ink" : "bg-accent text-white hover:bg-accent-strong"
            }`}
          >
            {showAdd ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showAdd ? "Cancel" : "Add match"}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAddMatch} className="rounded-lg border border-line bg-surface p-4">
          <p className="mb-3 text-xs font-semibold text-muted uppercase tracking-wider">New Match</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Home team *</label>
              <div className="flex items-center gap-2">
                <Flag iso2={teamFlagIso(addDraft.homeCode || addDraft.home)} label={addDraft.home || "Home"} />
                <input required className={fieldCls} placeholder="Brazil" value={addDraft.home} onChange={(e) => handleHomeNameChange(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Code</label>
              <input className={fieldCls} placeholder="BRA" maxLength={3} value={addDraft.homeCode} onChange={(e) => setAddDraft({ ...addDraft, homeCode: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Away team *</label>
              <div className="flex items-center gap-2">
                <Flag iso2={teamFlagIso(addDraft.awayCode || addDraft.away)} label={addDraft.away || "Away"} />
                <input required className={fieldCls} placeholder="Argentina" value={addDraft.away} onChange={(e) => handleAwayNameChange(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Code</label>
              <input className={fieldCls} placeholder="ARG" maxLength={3} value={addDraft.awayCode} onChange={(e) => setAddDraft({ ...addDraft, awayCode: e.target.value.toUpperCase() })} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Stadium *</label>
              <input required className={fieldCls} placeholder="MetLife Stadium" value={addDraft.stadium} onChange={(e) => setAddDraft({ ...addDraft, stadium: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">City slug</label>
              <input className={fieldCls} placeholder="new-york" value={addDraft.citySlug} onChange={(e) => setAddDraft({ ...addDraft, citySlug: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Kickoff (Date & Time)</label>
              <input type="datetime-local" className={fieldCls} value={addDraft.kickoffUtc} onChange={(e) => setAddDraft({ ...addDraft, kickoffUtc: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Status</label>
              <select className={fieldCls} value={addDraft.status} onChange={(e) => setAddDraft({ ...addDraft, status: e.target.value as Match["status"] })}>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>
          {addError && (
            <p className="mt-2 text-xs font-medium text-red-600">{addError}</p>
          )}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAddError(null); }}
              className="rounded border border-line px-3 py-1.5 text-xs font-medium text-muted hover:bg-paper cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-strong transition cursor-pointer"
            >
              Save Match
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
              <th className="px-4 py-2.5">Match</th>
              <th className="px-4 py-2.5">Score</th>
              <th className="px-4 py-2.5">Venue</th>
              <th className="px-4 py-2.5">Kickoff</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {displayed.map((raw) => {
              const m = getMatch(raw);
              const isEditing = editIdx === raw.idx;
              const isSaved = saved.has(raw.idx);

              return (
                <div key={raw.idx} className="contents">
                  <tr className={`transition-colors ${m.isPending ? "bg-amber-50/60" : "hover:bg-paper"}`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1">
                          <Flag iso2={teamFlagIso(m.home.code || m.home.name)} label={m.home.name} />
                          <span className="text-xs font-bold text-faint">vs</span>
                          <Flag iso2={teamFlagIso(m.away.code || m.away.name)} label={m.away.name} />
                        </div>
                        <div>
                          <p className="font-medium text-ink">
                            {m.home.name} <span className="text-muted font-normal">vs</span> {m.away.name}
                          </p>
                          <p className="text-[11px] text-faint">{m.home.code || "—"} · {m.away.code || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-sm text-ink">
                      {raw.home.score !== undefined && raw.away.score !== undefined
                        ? `${raw.home.score} – ${raw.away.score}`
                        : <span className="text-faint">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-ink">{m.stadium}</p>
                      <p className="text-[11px] text-faint capitalize">{m.citySlug.replace(/-/g, " ")}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted">
                      {new Date(m.kickoffUtc).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_PILL[m.status]}`}>
                          {m.status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
                          {m.status}
                        </span>
                        {m.isPending && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Pending
                          </span>
                        )}
                        {isSaved && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 flex items-center gap-0.5">
                            <Check className="h-3 w-3" /> Saved
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {m.isPending && (
                          <button
                            onClick={() => approvePending(raw.idx)}
                            className="rounded px-2 py-1 text-[11px] font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => isEditing ? cancelEdit() : startEdit(raw.idx, raw)}
                          className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-muted hover:bg-paper hover:text-ink transition cursor-pointer border border-transparent hover:border-line"
                        >
                          {isEditing ? <X className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                          {isEditing ? "Cancel" : "Edit"}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isEditing && (
                    <tr>
                      <td colSpan={6} className="border-l-2 border-accent bg-accent-soft/30 px-4 py-4">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-accent">Editing match</p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Home team</label>
                            <div className="flex items-center gap-2">
                              <Flag iso2={teamFlagIso(editDraft.homeCode || editDraft.home)} label={editDraft.home || "Home"} />
                              <input className={fieldCls} value={editDraft.home} onChange={(e) => handleHomeNameChange(e.target.value, true)} />
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Code</label>
                            <input className={fieldCls} maxLength={3} value={editDraft.homeCode} onChange={(e) => setEditDraft({ ...editDraft, homeCode: e.target.value.toUpperCase() })} />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Away team</label>
                            <div className="flex items-center gap-2">
                              <Flag iso2={teamFlagIso(editDraft.awayCode || editDraft.away)} label={editDraft.away || "Away"} />
                              <input className={fieldCls} value={editDraft.away} onChange={(e) => handleAwayNameChange(e.target.value, true)} />
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Code</label>
                            <input className={fieldCls} maxLength={3} value={editDraft.awayCode} onChange={(e) => setEditDraft({ ...editDraft, awayCode: e.target.value.toUpperCase() })} />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Stadium</label>
                            <input className={fieldCls} value={editDraft.stadium} onChange={(e) => setEditDraft({ ...editDraft, stadium: e.target.value })} />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">City slug</label>
                            <input className={fieldCls} value={editDraft.citySlug} onChange={(e) => setEditDraft({ ...editDraft, citySlug: e.target.value })} />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Status</label>
                            <select className={fieldCls} value={editDraft.status} onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value as Match["status"] })}>
                              <option value="scheduled">Scheduled</option>
                              <option value="live">Live</option>
                              <option value="finished">Finished</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={cancelEdit} className="rounded border border-line px-3 py-1.5 text-xs font-medium text-muted hover:bg-paper cursor-pointer">Cancel</button>
                          <button
                            onClick={() => saveEdit(raw.idx)}
                            className="rounded bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition cursor-pointer"
                          >
                            Save as draft — pending approval
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </div>
              );
            })}
          </tbody>
        </table>
        {displayed.length === 0 && (
          <p className="py-12 text-center text-sm text-faint">No matches found.</p>
        )}
      </div>

      <p className="text-right text-[11px] text-faint">
        {displayed.length} of {matchesList.length} matches
      </p>
    </div>
  );
}
