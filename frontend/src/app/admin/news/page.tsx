"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/admin-auth";
import { apiUrl } from "@/lib/api";
import type { NewsItem } from "@/data/types";
import {
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  Upload,
} from "lucide-react";

const PENDING_KEY = "admin_news_pending";

function getPending(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(PENDING_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}
function savePending(ids: Set<string>) {
  localStorage.setItem(PENDING_KEY, JSON.stringify([...ids]));
}

type Draft = {
  title: string;
  summary: string;
  url: string;
  source: string;
  date: string;
};
const EMPTY: Draft = { title: "", summary: "", url: "", source: "", date: "" };

const fieldCls =
  "w-full rounded border border-line bg-paper px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent transition-colors";

/** Small reusable image picker with preview */
function ImagePicker({
  preview,
  onFile,
  onClear,
}: {
  preview: string | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return preview ? (
    <div className="relative w-full overflow-hidden rounded border border-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={preview} alt="Preview" className="h-12 w-full object-cover" />
      <button
        type="button"
        onClick={() => {
          onClear();
          if (ref.current) ref.current.value = "";
        }}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  ) : (
    <label className="flex h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded border-2 border-dashed border-line text-faint transition hover:border-accent hover:text-accent">
      <Upload className="h-5 w-5" />
      <span className="text-[11px]">
        Click to upload (JPEG / PNG / WebP — max 5 MB)
      </span>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </label>
  );
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addDraft, setAddDraft] = useState<Draft>(EMPTY);
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<{
    id: string;
    kind: "ok" | "pending";
  } | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPendingIds(getPending());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiUrl("/news"), {
      cache: "no-store",
      credentials: "include",
    });
    const data = await res.json();
    if (data.ok) setNews(data.news as NewsItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function setFlashMsg(id: string, kind: "ok" | "pending") {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlash({ id, kind });
    flashTimer.current = setTimeout(() => setFlash(null), 2500);
  }

  function buildFormData(draft: Draft, imageFile: File | null): FormData {
    const fd = new FormData();
    fd.append("title", draft.title);
    fd.append("summary", draft.summary);
    fd.append("url", draft.url);
    if (draft.source) fd.append("source", draft.source);
    if (draft.date) fd.append("date", draft.date);
    if (imageFile) fd.append("image", imageFile);
    return fd;
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch("/news", {
        method: "POST",
        body: buildFormData(addDraft, addImageFile),
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (res.ok && data.ok) {
        setAddDraft(EMPTY);
        setAddImageFile(null);
        setAddImagePreview(null);
        setShowAdd(false);
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function onSaveEdit(oldId: string) {
    setSaving(true);
    try {
      await authFetch(`/news/${oldId}`, { method: "DELETE" });
      const res = await authFetch("/news", {
        method: "POST",
        body: buildFormData(editDraft, editImageFile),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const newId = data.news?.id ?? data.id;
        if (newId) {
          const next = getPending();
          next.add(newId);
          savePending(next);
          setPendingIds(new Set(next));
          setFlashMsg(newId, "pending");
        }
        setEditId(null);
        setEditImageFile(null);
        setEditImagePreview(null);
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function onApprove(id: string) {
    const next = getPending();
    next.delete(id);
    savePending(next);
    setPendingIds(new Set(next));
    setFlashMsg(id, "ok");
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this news item?")) return;
    const res = await authFetch(`/news/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    if (res.ok) {
      const next = getPending();
      next.delete(id);
      savePending(next);
      setPendingIds(new Set(next));
      await load();
    }
  }

  function startEdit(item: NewsItem) {
    setEditId(item.id ?? null);
    setEditDraft({
      title: item.title,
      summary: item.summary,
      url: item.url,
      source: item.source ?? "",
      date: item.date ?? "",
    });
    // Show existing image as preview (could be external URL or local path)
    setEditImageFile(null);
    setEditImagePreview(
      item.image
        ? item.image.startsWith("/uploads/")
          ? `${process.env.NEXT_PUBLIC_API_URL}${item.image}`
          : item.image
        : null,
    );
  }

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase()) ||
      (n.source ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const pendingCount = filtered.filter(
    (n) => n.id && pendingIds.has(n.id),
  ).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{news.length} items</span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-none sm:w-56">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-faint" />
            <input
              type="text"
              placeholder="Search news…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-line bg-surface pl-7 pr-3 py-1.5 text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            onClick={() => {
              setShowAdd((v) => !v);
              setAddDraft(EMPTY);
              setAddImageFile(null);
              setAddImagePreview(null);
            }}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              showAdd
                ? "bg-paper border border-line text-ink"
                : "bg-accent text-white hover:bg-accent-strong"
            }`}
          >
            {showAdd ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            {showAdd ? "Cancel" : "Add news"}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={onAdd}
          className="rounded-lg border border-line bg-surface p-4 space-y-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            New news item
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                Title *
              </label>
              <input
                required
                className={fieldCls}
                placeholder="Article headline"
                value={addDraft.title}
                onChange={(e) =>
                  setAddDraft({ ...addDraft, title: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                Summary *
              </label>
              <textarea
                required
                rows={2}
                className={`${fieldCls} resize-none`}
                placeholder="Short summary"
                value={addDraft.summary}
                onChange={(e) =>
                  setAddDraft({ ...addDraft, summary: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                URL *
              </label>
              <input
                required
                type="url"
                className={fieldCls}
                placeholder="https://…"
                value={addDraft.url}
                onChange={(e) =>
                  setAddDraft({ ...addDraft, url: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                Source
              </label>
              <input
                className={fieldCls}
                placeholder="FIFA, BBC…"
                value={addDraft.source}
                onChange={(e) =>
                  setAddDraft({ ...addDraft, source: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                Date
              </label>
              <input
                type="date"
                className={fieldCls}
                value={addDraft.date}
                onChange={(e) =>
                  setAddDraft({ ...addDraft, date: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                Upload Image
              </label>
              <ImagePicker
                preview={addImagePreview}
                onFile={(f) => {
                  setAddImageFile(f);
                  setAddImagePreview(URL.createObjectURL(f));
                }}
                onClear={() => {
                  setAddImageFile(null);
                  setAddImagePreview(null);
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded border border-line px-3 py-1.5 text-xs font-medium text-muted hover:bg-paper cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-strong disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="rounded-lg border border-line bg-surface divide-y divide-line">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-4 py-3.5 flex items-center gap-3">
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 rounded bg-paper animate-pulse" />
                <div className="h-2.5 w-1/3 rounded bg-paper animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line py-16 text-center text-sm text-faint">
          No news items found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                <th className="px-4 py-2.5">Title</th>
                <th className="px-4 py-2.5">Source</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((item) => {
                const isPending = !!item.id && pendingIds.has(item.id);
                const isEditing = editId === item.id;
                const isFlash = flash?.id === item.id;

                return (
                  <>
                    <tr
                      key={item.id ?? item.title}
                      className={`transition-colors ${
                        isPending
                          ? "bg-amber-50/60"
                          : isFlash
                            ? "bg-green-50/60"
                            : "hover:bg-paper"
                      }`}
                    >
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex items-center gap-2.5">
                          {item.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                item.image.startsWith("/uploads/")
                                  ? `${process.env.NEXT_PUBLIC_API_URL}${item.image}`
                                  : item.image
                              }
                              alt=""
                              className="h-9 w-14 shrink-0 rounded object-cover border border-line"
                            />
                          )}
                          <div>
                            <p className="font-medium text-ink truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-muted mt-0.5 line-clamp-1">
                              {item.summary}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.source ? (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            {item.source}
                          </span>
                        ) : (
                          <span className="text-faint">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted">
                        {item.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Pending review
                          </span>
                        ) : isFlash && flash?.kind === "ok" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            <Check className="h-3 w-3" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            Live
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isPending && (
                            <button
                              onClick={() => onApprove(item.id!)}
                              className="rounded px-2 py-1 text-[11px] font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded p-1.5 text-faint hover:text-ink hover:bg-paper transition"
                            title="Open article"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          {item.id && (
                            <button
                              onClick={() =>
                                isEditing ? setEditId(null) : startEdit(item)
                              }
                              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-muted hover:bg-paper hover:text-ink border border-transparent hover:border-line transition cursor-pointer"
                            >
                              {isEditing ? (
                                <X className="h-3 w-3" />
                              ) : (
                                <Pencil className="h-3 w-3" />
                              )}
                              {isEditing ? "Cancel" : "Edit"}
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(item.id!)}
                            disabled={!item.id}
                            title={
                              item.id ? "Delete" : "Static — cannot delete"
                            }
                            className="rounded p-1.5 text-faint hover:text-red-600 hover:bg-red-50 transition disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isEditing && (
                      <tr key={`edit-${item.id}`}>
                        <td
                          colSpan={5}
                          className="border-l-2 border-accent bg-accent-soft/30 px-4 py-4"
                        >
                          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-accent">
                            Editing — will require approval before going live
                          </p>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                                Title
                              </label>
                              <input
                                className={fieldCls}
                                value={editDraft.title}
                                onChange={(e) =>
                                  setEditDraft({
                                    ...editDraft,
                                    title: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                                Summary
                              </label>
                              <textarea
                                rows={2}
                                className={`${fieldCls} resize-none`}
                                value={editDraft.summary}
                                onChange={(e) =>
                                  setEditDraft({
                                    ...editDraft,
                                    summary: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                                URL
                              </label>
                              <input
                                type="url"
                                className={fieldCls}
                                value={editDraft.url}
                                onChange={(e) =>
                                  setEditDraft({
                                    ...editDraft,
                                    url: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                                Source
                              </label>
                              <input
                                className={fieldCls}
                                value={editDraft.source}
                                onChange={(e) =>
                                  setEditDraft({
                                    ...editDraft,
                                    source: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                                Date
                              </label>
                              <input
                                type="date"
                                className={fieldCls}
                                value={editDraft.date}
                                onChange={(e) =>
                                  setEditDraft({
                                    ...editDraft,
                                    date: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">
                                Image
                              </label>
                              <ImagePicker
                                preview={editImagePreview}
                                onFile={(f) => {
                                  setEditImageFile(f);
                                  setEditImagePreview(URL.createObjectURL(f));
                                }}
                                onClear={() => {
                                  setEditImageFile(null);
                                  setEditImagePreview(null);
                                }}
                              />
                              Image{" "}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => setEditId(null)}
                              className="rounded border border-line px-3 py-1.5 text-xs font-medium text-muted hover:bg-paper cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => onSaveEdit(item.id!)}
                              disabled={saving}
                              className="rounded bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition cursor-pointer"
                            >
                              {saving ? "Saving…" : "Save — pending approval"}
                            </button>
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
