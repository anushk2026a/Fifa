"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/admin-auth";
import {
  Search, Pencil, Trash2, ChevronDown, ChevronUp,
  Mail, Phone, Globe, MapPin, ExternalLink, X, Check,
} from "lucide-react";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  stadium?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  socialUrl?: string;
  imageUrl?: string;
  message: string;
  createdAt: string;
  approved?: boolean;
};

type Tab = "all" | "pending" | "approved";

const fieldCls =
  "w-full rounded border border-line bg-paper px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent transition-colors";

export default function ExperiencesPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editMsg, setEditMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await authFetch("/contact", { cache: "no-store" });
    if (res.status === 401) { router.replace("/admin/login"); return; }
    const data = await res.json();
    if (data.ok) setContacts(data.contacts as ContactSubmission[]);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function onApprove(id: string, approved: boolean) {
    const res = await authFetch(`/contact/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ approved }),
    });
    if (res.status === 401) { router.replace("/admin/login"); return; }
    if (res.ok) {
      setFlash(id);
      setTimeout(() => setFlash(null), 2000);
      await load();
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this submission permanently?")) return;
    const res = await authFetch(`/contact/${id}`, { method: "DELETE" });
    if (res.status === 401) { router.replace("/admin/login"); return; }
    if (res.ok) {
      if (expandedId === id) setExpandedId(null);
      if (editId === id) setEditId(null);
      await load();
    }
  }

  async function onSaveEdit(id: string) {
    setSaving(true);
    try {
      const res = await authFetch(`/contact/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ message: editMsg.trim(), approved: false }),
      });
      if (res.status === 401) { router.replace("/admin/login"); return; }
      if (res.ok) {
        setFlash(id);
        setTimeout(() => setFlash(null), 2000);
        await load();
      }
    } finally {
      setEditId(null);
      setSaving(false);
    }
  }

  const tabCounts = {
    all: contacts.length,
    pending: contacts.filter((c) => !c.approved).length,
    approved: contacts.filter((c) => c.approved).length,
  };

  const filtered = contacts
    .filter((c) => {
      if (tab === "pending") return !c.approved;
      if (tab === "approved") return !!c.approved;
      return true;
    })
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        (c.city ?? "").toLowerCase().includes(q) ||
        (c.country ?? "").toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5">
          {(["all", "pending", "approved"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition cursor-pointer ${
                tab === t
                  ? "bg-ink text-white"
                  : "text-muted hover:text-ink hover:bg-paper border border-line"
              }`}
            >
              {t} <span className="opacity-60">({tabCounts[t]})</span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-faint" />
          <input
            type="text"
            placeholder="Search experiences…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-line bg-surface pl-7 pr-3 py-1.5 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-line bg-surface divide-y divide-line">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-3.5 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-paper animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-1/2 rounded bg-paper animate-pulse" />
                <div className="h-2.5 w-1/4 rounded bg-paper animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line py-16 text-center text-sm text-faint">
          No submissions found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                <th className="px-4 py-2.5">Sender</th>
                <th className="px-4 py-2.5">Location</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Message</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((c) => {
                const isExpanded = expandedId === c.id;
                const isEditing = editId === c.id;
                const isFlash = flash === c.id;

                return (
                  <>
                    <tr
                      key={c.id}
                      onClick={() => !isEditing && setExpandedId(isExpanded ? null : c.id)}
                      className={`cursor-pointer transition-colors ${
                        isFlash ? "bg-green-50/60" : c.approved ? "hover:bg-paper" : "bg-amber-50/40 hover:bg-amber-50/80"
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${c.approved ? "bg-green-500" : "bg-slate-400"}`}>
                            {c.name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-medium text-ink leading-none">{c.name}</p>
                            <p className="text-[11px] text-muted mt-0.5">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <MapPin className="h-3 w-3 text-accent shrink-0" />
                          {[c.city, c.country].filter(Boolean).join(", ") || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted">
                        {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="truncate text-xs text-muted">{c.message}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isFlash ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            <Check className="h-3 w-3" /> Done
                          </span>
                        ) : c.approved ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Pending
                          </span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {c.approved ? (
                            <button
                              onClick={() => onApprove(c.id, false)}
                              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition cursor-pointer"
                            >
                              <Check className="h-3 w-3" /> Published
                            </button>
                          ) : (
                            <button
                              onClick={() => onApprove(c.id, true)}
                              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold text-white bg-green-600 hover:bg-green-700 transition cursor-pointer"
                            >
                              <Check className="h-3 w-3" /> Approve
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (isEditing) { setEditId(null); return; }
                              setEditId(c.id);
                              setEditMsg(c.message);
                              setExpandedId(null);
                            }}
                            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-muted hover:bg-paper hover:text-ink border border-transparent hover:border-line transition cursor-pointer"
                          >
                            {isEditing ? <X className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                            {isEditing ? "Cancel" : "Edit"}
                          </button>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : c.id)}
                            className="rounded p-1.5 text-faint hover:text-ink hover:bg-paper transition cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => onDelete(c.id)}
                            className="rounded p-1.5 text-faint hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline edit row */}
                    {isEditing && (
                      <tr key={`edit-${c.id}`}>
                        <td colSpan={6} className="border-l-2 border-accent bg-accent-soft/30 px-4 py-4">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                            Editing — will revert to pending after save
                          </p>
                          <div className="space-y-2">
                            <div>
                              <label className="mb-1 block text-[11px] font-semibold uppercase text-muted">Message</label>
                              <textarea
                                rows={4}
                                className={`${fieldCls} resize-none`}
                                value={editMsg}
                                onChange={(e) => setEditMsg(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button onClick={() => setEditId(null)} className="rounded border border-line px-3 py-1.5 text-xs font-medium text-muted hover:bg-paper cursor-pointer">Cancel</button>
                            <button
                              onClick={() => onSaveEdit(c.id)}
                              disabled={saving}
                              className="rounded bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition cursor-pointer"
                            >
                              {saving ? "Saving…" : "Save — pending approval"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Expand detail row */}
                    {isExpanded && !isEditing && (
                      <tr key={`detail-${c.id}`}>
                        <td colSpan={6} className="border-l-2 border-line bg-paper px-6 py-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                              <div>
                                <p className="font-semibold uppercase tracking-wider text-muted mb-1">Email</p>
                                <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-accent hover:underline font-medium">
                                  <Mail className="h-3.5 w-3.5" />{c.email}
                                </a>
                              </div>
                              {c.phone && (
                                <div>
                                  <p className="font-semibold uppercase tracking-wider text-muted mb-1">Phone</p>
                                  <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-ink font-medium">
                                    <Phone className="h-3.5 w-3.5" />{c.phone}
                                  </a>
                                </div>
                              )}
                              <div>
                                <p className="font-semibold uppercase tracking-wider text-muted mb-1">Location</p>
                                <div className="flex items-center gap-1.5 text-ink font-medium">
                                  <Globe className="h-3.5 w-3.5 text-accent" />
                                  {[c.city, c.country].filter(Boolean).join(", ") || "—"}
                                </div>
                              </div>
                            </div>
                            <div className="rounded border border-line bg-surface p-3">
                              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">Message</p>
                              <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{c.message}</p>
                            </div>
                            {c.imageUrl && (
                              <div>
                                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">Photo</p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_URL}${c.imageUrl}`}
                                  alt="Experience photo"
                                  className="h-48 w-auto rounded border border-line object-cover"
                                />
                              </div>
                            )}
                            {(c.youtube || c.facebook || c.instagram || c.x) && (
                              <div className="flex flex-wrap gap-2">
                                {c.youtube && (
                                  <a href={c.youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100">
                                    YouTube <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                                {c.facebook && (
                                  <a href={c.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">
                                    Facebook <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                                {c.instagram && (
                                  <a href={c.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-700 hover:bg-pink-100">
                                    Instagram <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                                {c.x && (
                                  <a href={c.x} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-ink hover:bg-slate-200">
                                    X <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
