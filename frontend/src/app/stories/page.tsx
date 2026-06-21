"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/common/Container";
import { apiUrl } from "@/lib/api";
import { MapPin, Quote, Globe, Link2 } from "lucide-react";

type Story = {
  id: string;
  name: string;
  country?: string;
  city?: string;
  stadium?: string;
  socialUrl?: string;
  message: string;
  createdAt: string;
};

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/contact/approved"), { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setStories(data.stories);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Banner */}
      <section className="border-b border-line bg-gradient-to-br from-[#012A6B] to-[#001B44] py-16">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Fan Stories
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80">
            Real experiences from football fans around the world at FIFA World
            Cup 2026.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        {loading ? (
          <p className="text-sm text-muted">Loading stories…</p>
        ) : stories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper py-20 text-center">
            <p className="text-lg font-semibold text-ink">No stories yet</p>
            <p className="mt-2 text-sm text-muted">
              Be the first to{" "}
              <a href="/contact" className="text-accent hover:underline">
                share your experience
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <article
                key={s.id}
                className="flex flex-col rounded-2xl border border-line bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Header strip */}
                <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-[#012A6B] to-[#0057B8] px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-base font-bold text-white">
                    {s.name.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{s.name}</p>
                    {(s.city || s.country) && (
                      <p className="flex items-center gap-1 text-xs text-white/70">
                        <MapPin className="h-3 w-3" />
                        {[s.city, s.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  {s.stadium && (
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                      <Globe className="h-3.5 w-3.5" />
                      {s.stadium}
                    </p>
                  )}

                  <div className="relative flex-1">
                    <Quote className="absolute -top-1 -left-1 h-5 w-5 text-slate-200" />
                    <p className="pl-5 text-sm leading-relaxed text-muted">
                      {s.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-line pt-3">
                    <p className="text-xs text-faint">
                      {new Date(s.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {s.socialUrl && (
                      <a
                        href={s.socialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                      >
                        <Link2 className="h-3 w-3" /> Profile
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
