"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/common/Container";
import { apiUrl } from "@/lib/api";
import { authHeaders, clearToken, getToken } from "@/lib/admin-auth";
import type { NewsItem } from "@/data/types";

const fieldClass =
  "w-full rounded-[var(--radius-card)] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent";

/** Greeting based on local time:
 *   4:00am–11:59am → morning · 12:00pm–4:00pm → afternoon
 *   4:01pm–8:30pm → evening · 8:31pm–3:59am → good day */
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
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const loadNews = useCallback(async () => {
    const res = await fetch(apiUrl("/news"), { cache: "no-store" });
    const data = await res.json();
    if (data.ok) setNews(data.news as NewsItem[]);
  }, []);

  // Set greeting client-side (depends on the visitor's local clock).
  useEffect(() => {
    setGreeting(adminGreeting());
  }, []);

  // Gate the page: no token → login. Otherwise verify it, then load news.
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
        await loadNews();
        setReady(true);
      } catch {
        setMsg({ kind: "err", text: "Could not reach the server. Is the backend running?" });
        setReady(true);
      }
    })();
  }, [router, loadNews]);

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
        setMsg({ kind: "ok", text: "News item added." });
        await loadNews();
      } else if (res.status === 401) {
        clearToken();
        router.replace("/admin/login");
      } else {
        setMsg({ kind: "err", text: "Could not add item. Check the fields (URL and image must be valid links)." });
      }
    } catch {
      setMsg({ kind: "err", text: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id?: string) {
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

  function logout() {
    clearToken();
    router.replace("/admin/login");
  }

  if (!ready) {
    return (
      <Container className="py-16">
        <p className="text-sm text-muted">Loading…</p>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          {greeting && <p className="text-sm font-medium text-accent">{greeting}</p>}
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-ink">News admin</h1>
          <p className="mt-1 text-sm text-muted">Add or remove items shown on the public News page.</p>
        </div>
        <button onClick={logout} className="rounded border border-line px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-accent">
          Sign out
        </button>
      </div>

      {msg && (
        <div
          className={`mb-6 rounded-[var(--radius-card)] border px-4 py-3 text-sm ${
            msg.kind === "ok" ? "border-accent bg-accent-soft text-ink" : "border-red-300 bg-red-50 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Add form */}
        <form onSubmit={onAdd} className="space-y-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
          <h2 className="text-base font-semibold text-ink">Add news</h2>
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-ink">Title</label>
            <input id="title" name="title" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor="summary" className="mb-1 block text-sm font-medium text-ink">Summary</label>
            <textarea id="summary" name="summary" required rows={3} className={`${fieldClass} resize-none`} />
          </div>
          <div>
            <label htmlFor="url" className="mb-1 block text-sm font-medium text-ink">Link (URL)</label>
            <input id="url" name="url" type="url" required placeholder="https://…" className={fieldClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="source" className="mb-1 block text-sm font-medium text-ink">Source <span className="font-normal text-muted">(optional)</span></label>
              <input id="source" name="source" placeholder="FIFA" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="date" className="mb-1 block text-sm font-medium text-ink">Date <span className="font-normal text-muted">(optional)</span></label>
              <input id="date" name="date" type="date" className={fieldClass} />
            </div>
          </div>
          <div>
            <label htmlFor="image" className="mb-1 block text-sm font-medium text-ink">Image URL <span className="font-normal text-muted">(optional)</span></label>
            <input id="image" name="image" type="url" placeholder="https://…" className={fieldClass} />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong disabled:opacity-60 transition-colors"
          >
            {saving ? "Adding…" : "Add news item"}
          </button>
        </form>

        {/* Existing list */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-ink">Current items ({news.length})</h2>
          <ul className="space-y-3">
            {news.map((item) => (
              <li
                key={item.id ?? item.title}
                className="flex items-start justify-between gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs text-faint">
                    {item.date}
                    {item.source ? ` · ${item.source}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(item.id)}
                  disabled={!item.id}
                  title={item.id ? "Delete" : "Seed/static item — not deletable"}
                  className="shrink-0 rounded border border-line px-2 py-1 text-xs text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-40"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
