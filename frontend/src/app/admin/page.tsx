"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/common/Container";
import { apiUrl } from "@/lib/api";
import { authHeaders, clearToken, getToken } from "@/lib/admin-auth";
import type { NewsItem } from "@/data/types";
import {
  Trash2,
  LogOut,
  Mail,
  Phone,
  Globe,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  Plus,
  ExternalLink,
  Search,
  MessageSquare,
  CheckCircle,
  Star,
} from "lucide-react";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  stadium?: string;
  socialUrl?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  message: string;
  createdAt: string;
  approved?: boolean;
};

const fieldClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent transition-colors duration-200";

function adminGreeting(d = new Date()): string {
  const mins = d.getHours() * 60 + d.getMinutes();
  if (mins >= 240 && mins <= 719) return "Good morning, Admin";
  if (mins >= 720 && mins <= 960) return "Good afternoon, Admin";
  if (mins >= 961 && mins <= 1230) return "Good evening, Admin";
  return "Good day to you, Admin";
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Filters
  const [newsSearch, setNewsSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    const res = await fetch(apiUrl("/news"), { cache: "no-store" });
    const data = await res.json();
    if (data.ok) setNews(data.news as NewsItem[]);
  }, []);

  const loadContacts = useCallback(async () => {
    const res = await fetch(apiUrl("/contact"), { headers: authHeaders(), cache: "no-store" });
    const data = await res.json();
    if (data.ok) setContacts(data.contacts as ContactSubmission[]);
  }, []);

  useEffect(() => {
    setGreeting(adminGreeting());
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    (async () => {
      try {
        const res = await fetch(apiUrl("/auth/me"), { headers: authHeaders() });
        if (!res.ok) {
          clearToken();
          router.replace("/admin/login");
          return;
        }
        await Promise.all([loadNews(), loadContacts()]);
        setReady(true);
      } catch {
        setMsg({ kind: "err", text: "Could not reach the server. Is the backend running?" });
        setReady(true);
      }
    })();
  }, [router, loadNews, loadContacts]);

  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value.trim();
    const body = {
      title: get("title"),
      summary: get("summary"),
      url: get("url"),
      source: get("source") || undefined,
      image: get("image") || undefined,
      date: get("date") || undefined,
    };
    try {
      const res = await fetch(apiUrl("/news"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        form.reset();
        setMsg({ kind: "ok", text: "News item added successfully." });
        await loadNews();
      } else if (res.status === 401) {
        clearToken();
        router.replace("/admin/login");
      } else {
        setMsg({ kind: "err", text: "Could not add item. Check fields (URLs must be valid)." });
      }
    } catch {
      setMsg({ kind: "err", text: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteNews(id?: string) {
    if (!id) return;
    if (!confirm("Delete this news item?")) return;
    const res = await fetch(apiUrl(`/news/${id}`), { method: "DELETE", headers: authHeaders() });
    if (res.ok) {
      await loadNews();
    } else if (res.status === 401) {
      clearToken();
      router.replace("/admin/login");
    }
  }

  async function onDeleteContact(id: string) {
    if (!confirm("Delete this contact submission?")) return;
    const res = await fetch(apiUrl(`/contact/${id}`), { method: "DELETE", headers: authHeaders() });
    if (res.ok) {
      await loadContacts();
      if (expandedContactId === id) setExpandedContactId(null);
    } else if (res.status === 401) {
      clearToken();
      router.replace("/admin/login");
    }
  }

  async function onApproveContact(id: string, approved: boolean) {
    const res = await fetch(apiUrl(`/contact/${id}/approve`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ approved }),
    });
    if (res.ok) {
      await loadContacts();
      setMsg({ kind: "ok", text: approved ? "Story approved and published." : "Story unapproved." });
    } else if (res.status === 401) {
      clearToken();
      router.replace("/admin/login");
    }
  }

  function logout() {
    clearToken();
    router.replace("/admin/login");
  }

  // Filter lists
  const filteredNews = news.filter(
    (n) =>
      n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      n.summary.toLowerCase().includes(newsSearch.toLowerCase()) ||
      (n.source && n.source.toLowerCase().includes(newsSearch.toLowerCase()))
  );

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.message.toLowerCase().includes(contactSearch.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(contactSearch.toLowerCase())) ||
      (c.country && c.country.toLowerCase().includes(contactSearch.toLowerCase()))
  );

  if (!ready) {
    return (
      <Container className="py-16">
        <p className="text-sm text-muted">Loading Portal Data…</p>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-[#002f6c] p-8 text-white shadow-lg mb-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            {greeting && <p className="text-xs font-semibold tracking-wider text-accent-soft uppercase">{greeting}</p>}
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white leading-none">FIFA Sports Admin Portal</h1>
            <p className="mt-2 text-sm text-slate-200 max-w-xl">
              Publish news items and manage submitted experiences or fan enquiries securely.
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 self-start md:self-center rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md border border-white/20 transition hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl -translate-y-12 translate-x-12" />
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Submissions", value: contacts.length, color: "text-ink" },
          { label: "Pending Review", value: contacts.filter(c => !c.approved).length, color: "text-amber-600" },
          { label: "Approved Stories", value: contacts.filter(c => c.approved).length, color: "text-green-600" },
          { label: "News Items", value: news.length, color: "text-accent" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{s.label}</p>
            <p className={`mt-1 text-3xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {msg && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3.5 text-sm flex items-center justify-between ${
            msg.kind === "ok" ? "border-success bg-green-50 text-green-800" : "border-red-300 bg-red-50 text-red-800"
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Main Form & News Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Add news form */}
        <form onSubmit={onAdd} className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <Plus className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-ink">Publish News Update</h2>
          </div>
          <div>
            <label htmlFor="title" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Title</label>
            <input id="title" name="title" required className={fieldClass} placeholder="Enter article headline..." />
          </div>
          <div>
            <label htmlFor="summary" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Summary</label>
            <textarea id="summary" name="summary" required rows={3} className={`${fieldClass} resize-none`} placeholder="Write a short summary..." />
          </div>
          <div>
            <label htmlFor="url" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Link (URL)</label>
            <input id="url" name="url" type="url" required placeholder="https://..." className={fieldClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="source" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Source</label>
              <input id="source" name="source" placeholder="e.g. FIFA" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="date" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Date</label>
              <input id="date" name="date" type="date" className={fieldClass} />
            </div>
          </div>
          <div>
            <label htmlFor="image" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Image URL</label>
            <input id="image" name="image" type="url" placeholder="https://..." className={fieldClass} />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-strong disabled:opacity-60 transition-all hover:shadow-md cursor-pointer"
          >
            {saving ? "Publishing…" : "Publish Update"}
          </button>
        </form>

        {/* Existing news list */}
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line pb-3 mb-4">
              <h2 className="text-lg font-bold text-ink">Active News Items ({filteredNews.length})</h2>
              <div className="relative w-full sm:w-48">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-faint" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-line focus:border-accent outline-none"
                />
              </div>
            </div>

            {filteredNews.length === 0 ? (
              <div className="py-12 text-center text-sm text-faint">No matching news items found.</div>
            ) : (
              <ul className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredNews.map((item) => (
                  <li
                    key={item.id ?? item.title}
                    className="flex items-start justify-between gap-3 rounded-xl border border-line bg-paper p-3 transition hover:border-line-strong hover:bg-surface"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-faint">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{item.date}</span>
                        {item.source && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-accent">{item.source}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteNews(item.id)}
                      disabled={!item.id}
                      title={item.id ? "Delete article" : "Static item - cannot delete"}
                      className="shrink-0 rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Shared Experiences & Enquiries Section */}
      <div className="mt-12 rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-line pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-bold text-ink">Shared Experiences & Enquiries</h2>
            </div>
            <p className="text-xs text-muted mt-1">Review contact form entries submitted by visitors.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-faint" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-line focus:border-accent outline-none"
            />
          </div>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="py-16 text-center text-sm text-faint border border-dashed border-line rounded-xl">
            No contact form submissions found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="min-w-full divide-y divide-line text-left text-sm">
              <thead className="bg-paper text-xs uppercase tracking-wider text-muted font-bold">
                <tr>
                  <th className="px-6 py-3">Sender</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Date Submitted</th>
                  <th className="px-6 py-3">Message Preview</th>
                  <th className="px-6 py-3">Social Links</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {filteredContacts.map((contact) => {
                  const isExpanded = expandedContactId === contact.id;
                  const letter = contact.name.trim().charAt(0).toUpperCase() || "C";
                  return (
                    <>
                      {/* Standard Row */}
                      <tr
                        key={contact.id}
                        className={`hover:bg-accent-soft/30 transition-colors duration-150 cursor-pointer ${
                          isExpanded ? "bg-accent-soft/20" : ""
                        }`}
                        onClick={() => setExpandedContactId(isExpanded ? null : contact.id)}
                      >
                        {/* Sender */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm text-white ${contact.approved ? "bg-green-500" : "bg-accent"}`}>
                              {letter}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-ink leading-normal truncate max-w-xs">{contact.name}</p>
                                {contact.approved && (
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                                    <CheckCircle className="h-2.5 w-2.5" /> Story
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted leading-normal truncate max-w-xs">{contact.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-ink font-medium">
                            <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                            <span>
                              {[contact.city, contact.country].filter(Boolean).join(", ") || "Unknown"}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted">
                          {new Date(contact.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Preview */}
                        <td className="px-6 py-4 max-w-xs truncate text-xs text-muted">
                          {contact.message}
                        </td>

                        {/* Social Links */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {contact.youtube && (
                              <a
                                href={contact.youtube}
                                target="_blank"
                                rel="noreferrer"
                                title="YouTube profile"
                                className="h-6 w-6 rounded bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-700 text-xs font-semibold"
                              >
                                YT
                              </a>
                            )}
                            {contact.facebook && (
                              <a
                                href={contact.facebook}
                                target="_blank"
                                rel="noreferrer"
                                title="Facebook profile"
                                className="h-6 w-6 rounded bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold"
                              >
                                FB
                              </a>
                            )}
                            {contact.instagram && (
                              <a
                                href={contact.instagram}
                                target="_blank"
                                rel="noreferrer"
                                title="Instagram profile"
                                className="h-6 w-6 rounded bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-pink-700 text-xs font-semibold"
                              >
                                IG
                              </a>
                            )}
                            {contact.x && (
                              <a
                                href={contact.x}
                                target="_blank"
                                rel="noreferrer"
                                title="X profile"
                                className="h-6 w-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-ink text-xs font-semibold"
                              >
                                X
                              </a>
                            )}
                            {!contact.youtube && !contact.facebook && !contact.instagram && !contact.x && (
                              <span className="text-xs text-faint">—</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setExpandedContactId(isExpanded ? null : contact.id)}
                              className="rounded-lg p-1.5 text-muted hover:bg-paper hover:text-ink transition cursor-pointer"
                              title={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => onApproveContact(contact.id, !contact.approved)}
                              className={`rounded-lg p-1.5 transition cursor-pointer ${contact.approved ? "text-green-600 hover:bg-green-50" : "text-muted hover:bg-green-50 hover:text-green-600"}`}
                              title={contact.approved ? "Unapprove Story" : "Approve as Story"}
                            >
                              {contact.approved ? <Star className="h-4 w-4 fill-green-500" /> : <Star className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => onDeleteContact(contact.id)}
                              className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition cursor-pointer"
                              title="Delete Submission"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Detail Sub-Row */}
                      {isExpanded && (
                        <tr key={`${contact.id}-detail`}>
                          <td colSpan={6} className="bg-paper px-8 py-6 border-l-4 border-accent">
                            <div className="space-y-4">
                              {/* Metadata grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div>
                                  <p className="font-semibold text-muted uppercase tracking-wider">Email Address</p>
                                  <a href={`mailto:${contact.email}`} className="mt-1 flex items-center gap-1.5 text-accent font-medium hover:underline">
                                    <Mail className="h-3.5 w-3.5" />
                                    <span>{contact.email}</span>
                                  </a>
                                </div>
                                {contact.phone && (
                                  <div>
                                    <p className="font-semibold text-muted uppercase tracking-wider">Phone Number</p>
                                    <a href={`tel:${contact.phone}`} className="mt-1 flex items-center gap-1.5 text-ink font-medium hover:underline">
                                      <Phone className="h-3.5 w-3.5" />
                                      <span>{contact.phone}</span>
                                    </a>
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-muted uppercase tracking-wider">Location</p>
                                  <div className="mt-1 flex items-center gap-1.5 text-ink font-medium">
                                    <Globe className="h-3.5 w-3.5 text-accent" />
                                    <span>{[contact.city, contact.country].filter(Boolean).join(", ") || "Not Provided"}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Speech bubble message display */}
                              <div className="rounded-xl border border-line bg-surface p-4 shadow-inner">
                                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Message / Fan Experience</p>
                                <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                              </div>

                              {/* Social buttons details */}
                              {(contact.youtube || contact.facebook || contact.instagram || contact.x) && (
                                <div>
                                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Connected Channels</p>
                                  <div className="flex flex-wrap gap-3">
                                    {contact.youtube && (
                                      <a
                                        href={contact.youtube}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                                      >
                                        YouTube Profile <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                    {contact.facebook && (
                                      <a
                                        href={contact.facebook}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                                      >
                                        Facebook Profile <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                    {contact.instagram && (
                                      <a
                                        href={contact.instagram}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 border border-pink-200 px-3 py-1.5 text-xs font-semibold text-pink-700 hover:bg-pink-100 transition"
                                      >
                                        Instagram Profile <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                    {contact.x && (
                                      <a
                                        href={contact.x}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gray-200 transition"
                                      >
                                        X Profile <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>
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
    </Container>
  );
}
