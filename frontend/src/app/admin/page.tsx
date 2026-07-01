"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/admin-auth";
import { apiUrl } from "@/lib/api";
import { MATCHES } from "@/data/matches";
import type { NewsItem } from "@/data/types";
import { ArrowRight } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  email: string;
  city?: string;
  country?: string;
  message: string;
  createdAt: string;
  approved?: boolean;
};

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [nr, cr] = await Promise.all([
        fetch(apiUrl("/news"), { cache: "no-store" }),
        authFetch("/contact", { cache: "no-store" }),
      ]);
      if (cr.status === 401) { router.replace("/admin/login"); return; }
      const nd = await nr.json();
      const cd = await cr.json();
      if (nd.ok) setNews(nd.news);
      if (cd.ok) setContacts(cd.contacts);
    } catch { /* offline */ }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const pending = contacts.filter((c) => !c.approved).length;
  const approved = contacts.filter((c) => c.approved).length;
  const live = MATCHES.filter((m) => m.status === "live").length;

  const stats = [
    { label: "News items", value: news.length },
    { label: "Matches", value: MATCHES.length },
    { label: "Experiences", value: contacts.length },
    { label: "Pending review", value: pending, accent: pending > 0 },
  ];

  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const recentNews = [...news]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-base font-semibold text-ink">Overview</h2>
        <p className="text-xs text-muted mt-0.5">{todayLabel()}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-surface px-4 py-4">
            <p className={`text-2xl font-bold tabular-nums ${s.accent ? "text-amber-600" : "text-ink"}`}>
              {loading ? <span className="inline-block h-6 w-10 rounded bg-paper animate-pulse" /> : s.value}
            </p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {live > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-semibold text-red-700">{live} match{live > 1 ? "es" : ""} live right now</span>
          <Link href="/admin/matches" className="ml-auto text-xs text-red-600 underline underline-offset-2">
            View
          </Link>
        </div>
      )}

      {pending > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm">
          <span className="font-semibold text-amber-800">{pending} experience{pending > 1 ? "s" : ""} awaiting review</span>
          <Link href="/admin/experiences" className="ml-auto text-xs text-amber-700 underline underline-offset-2">
            Review
          </Link>
        </div>
      )}

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent news */}
        <section className="rounded-lg border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Recent News</h3>
            <Link href="/admin/news" className="flex items-center gap-1 text-xs text-accent hover:underline">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="divide-y divide-line">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-3">
                  <div className="h-3.5 w-3/4 rounded bg-paper animate-pulse mb-1.5" />
                  <div className="h-2.5 w-1/3 rounded bg-paper animate-pulse" />
                </div>
              ))}
            </div>
          ) : recentNews.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-faint">No news items yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentNews.map((item) => (
                <li key={item.id ?? item.title} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{item.title}</p>
                    <p className="text-[11px] text-muted">
                      {item.source ? `${item.source} · ` : ""}{item.date}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent experiences */}
        <section className="rounded-lg border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Recent Experiences</h3>
            <Link href="/admin/experiences" className="flex items-center gap-1 text-xs text-accent hover:underline">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="divide-y divide-line">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-3">
                  <div className="h-3.5 w-1/2 rounded bg-paper animate-pulse mb-1.5" />
                  <div className="h-2.5 w-1/4 rounded bg-paper animate-pulse" />
                </div>
              ))}
            </div>
          ) : recentContacts.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-faint">No submissions yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentContacts.map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${c.approved ? "bg-green-500" : "bg-slate-400"}`}>
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{c.name}</p>
                    <p className="text-[11px] text-muted">
                      {[c.city, c.country].filter(Boolean).join(", ") || c.email}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    c.approved
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {c.approved ? "Published" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Manage Matches", href: "/admin/matches", sub: `${MATCHES.length} fixtures` },
          { label: "Manage News", href: "/admin/news", sub: `${news.length} items` },
          { label: "Review Experiences", href: "/admin/experiences", sub: `${pending} pending` },
        ].map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3.5 hover:border-line-strong hover:shadow-sm transition-all"
          >
            <div>
              <p className="text-sm font-medium text-ink">{q.label}</p>
              <p className="text-xs text-muted">{q.sub}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-faint" />
          </Link>
        ))}
      </div>
    </div>
  );
}
