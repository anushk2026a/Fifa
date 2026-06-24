"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/common/Container";
import { MapPin, Quote, Globe, ExternalLink, Users } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { apiUrl } from "@/lib/api";

type Story = {
  id: string;
  name: string;
  email: string;
  country?: string;
  city?: string;
  stadium?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  message: string;
  createdAt: string;
  approved?: boolean;
};

function socialLink(s: Story): { url: string; label: string; color: string } | null {
  if (s.instagram) return { url: s.instagram, label: "Instagram", color: "#e1306c" };
  if (s.youtube)   return { url: s.youtube,   label: "YouTube",   color: "#ff0000" };
  if (s.facebook)  return { url: s.facebook,  label: "Facebook",  color: "#1877f2" };
  if (s.x)         return { url: s.x,         label: "X",         color: "#000000" };
  return null;
}

function StoryCard({ s, index }: { s: Story; index: number }) {
  const delay = index * 120;
  const initials = s.name.trim().charAt(0).toUpperCase();
  const social = socialLink(s);
  const location = [s.city, s.country].filter(Boolean).join(", ") || "—";
  const dateStr = new Date(s.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const inner = (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer">
      <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-[#012A6B] via-[#0057B8] to-[#FFD700]" />

      <div className="flex items-center gap-4 px-6 pt-7 pb-5">
        <div className="relative shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#012A6B] to-[#0057B8] text-xl font-bold text-white shadow-lg ring-2 ring-white">
            {initials}
          </div>
          {social && (
            <span
              className="absolute -right-1.5 -bottom-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white shadow-md"
              style={{ backgroundColor: social.color }}
            >
              ↗
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-ink">{s.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3 text-accent" />
            {location}
          </p>
        </div>

        {social && (
          <ExternalLink className="h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        )}
      </div>

      {s.stadium && (
        <div className="mx-6 mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2">
          <Globe className="h-3.5 w-3.5 shrink-0 text-accent" />
          <span className="truncate text-xs font-semibold text-accent">{s.stadium}</span>
        </div>
      )}

      <div className="relative mx-6 mb-5 flex-1">
        <Quote className="absolute -top-1 -left-1 h-6 w-6 text-slate-100" />
        <p className="pl-6 text-sm leading-relaxed text-muted italic">{s.message}</p>
      </div>

      <div className="mx-6 mb-5 flex items-center justify-between border-t border-line pt-4">
        <time className="text-xs text-faint">{dateStr}</time>
        {social && (
          <span
            className="rounded-full px-3 py-1 text-[11px] font-semibold text-white"
            style={{ backgroundColor: social.color }}
          >
            {social.label}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-2 ring-[#0057B8]/25 transition-opacity duration-300 group-hover:opacity-100" />
    </article>
  );

  const wrapper = social ? (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
      data-aos="fade-up"
      data-aos-delay={String(delay)}
      data-aos-duration="650"
    >
      {inner}
    </a>
  ) : (
    <div
      className="block h-full"
      data-aos="fade-up"
      data-aos-delay={String(delay)}
      data-aos-duration="650"
    >
      {inner}
    </div>
  );

  return wrapper;
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden">
      <div className="h-0.75 bg-linear-to-r from-[#012A6B] via-[#0057B8] to-[#FFD700]" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-1/3 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
        <div className="h-8 rounded-xl bg-slate-100 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
          <div className="h-3 w-4/5 rounded bg-slate-100 animate-pulse" />
          <div className="h-3 w-3/5 rounded bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ once: true, easing: "ease-out-cubic" });

    fetch(apiUrl("/contact/approved"), { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setStories(data.stories as Story[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Banner */}
      <section className="relative isolate overflow-hidden border-b border-line bg-linear-to-br from-[#012A6B] via-[#01358A] to-[#001B44] py-20">
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#FFD700]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-[#0057B8]/30 blur-3xl" />
        <Container className="relative">
          <div className="flex items-center gap-3" data-aos="fade-right" data-aos-duration="700">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Users className="h-6 w-6 text-[#FFD700]" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Fan Stories
            </h1>
          </div>
          <div
            className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg"
            data-aos="fade-right"
            data-aos-delay="120"
            data-aos-duration="700"
          >
            Real experiences from football fans around the world at FIFA 2026.
            Click any card to visit their social profile.
          </div>
        </Container>
      </section>

      {/* Stories grid */}
      <section className="bg-linear-to-b from-slate-50 to-white py-14">
        <Container>
          {loading ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : stories.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-lg font-semibold text-ink">No stories published yet.</p>
              <p className="mt-1 text-sm text-muted">Check back soon — fan stories will appear here once approved.</p>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((s, i) => (
                <StoryCard key={s.id} s={s} index={i} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
