"use client";

import { useEffect } from "react";
import { Container } from "@/components/common/Container";
import { MapPin, Quote, Globe, ExternalLink, Users } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

type Story = {
  id: string;
  name: string;
  country: string;
  city: string;
  stadium: string;
  socialUrl: string;
  platform: { label: string; color: string };
  message: string;
  date: string;
};

const STORIES: Story[] = [
  {
    id: "1",
    name: "Carlos Mendez",
    country: "Mexico",
    city: "Los Angeles",
    stadium: "SoFi Stadium",
    socialUrl: "https://www.instagram.com/carlosmendez",
    platform: { label: "Instagram", color: "#e1306c" },
    message:
      "Watching Mexico vs. Poland at SoFi was the loudest I've ever heard a crowd. Tears were running down my face during the anthem. FIFA 2026 is truly historic.",
    date: "Jun 14, 2026",
  },
  {
    id: "2",
    name: "Sophie Laurent",
    country: "France",
    city: "New York",
    stadium: "MetLife Stadium",
    socialUrl: "https://twitter.com/sophielaurent",
    platform: { label: "Twitter / X", color: "#1d9bf0" },
    message:
      "MetLife Stadium was electric for the France opener. The tricolor flags, the chants — it felt like Paris had teleported to New Jersey. Magnifique!",
    date: "Jun 16, 2026",
  },
  {
    id: "3",
    name: "Tariq Al-Hassan",
    country: "Saudi Arabia",
    city: "Dallas",
    stadium: "AT&T Stadium",
    socialUrl: "https://www.facebook.com/tariqalhassan",
    platform: { label: "Facebook", color: "#1877f2" },
    message:
      "Flew 18 hours from Riyadh to see this World Cup. AT&T Stadium blew my mind — massive screens, perfect grass, and the Saudi fans section was on fire. Worth every mile.",
    date: "Jun 18, 2026",
  },
];

function StoryCard({ s, index }: { s: Story; index: number }) {
  const delay = index * 120;
  const initials = s.name.trim().charAt(0).toUpperCase();

  return (
    <a
      href={s.socialUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      data-aos="fade-up"
      data-aos-delay={String(delay)}
      data-aos-duration="650"
    >
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer">
        {/* Top accent bar */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#012A6B] via-[#0057B8] to-[#FFD700]" />

        {/* Header */}
        <div className="flex items-center gap-4 px-6 pt-7 pb-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#012A6B] to-[#0057B8] text-xl font-bold text-white shadow-lg ring-2 ring-white">
              {initials}
            </div>
            <span
              className="absolute -right-1.5 -bottom-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white shadow-md"
              style={{ backgroundColor: s.platform.color }}
            >
              ↗
            </span>
          </div>

          {/* Name + location */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-ink">{s.name}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3 text-accent" />
              {s.city}, {s.country}
            </p>
          </div>

          {/* External link icon */}
          <ExternalLink className="h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>

        {/* Stadium badge */}
        <div className="mx-6 mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2">
          <Globe className="h-3.5 w-3.5 shrink-0 text-accent" />
          <span className="truncate text-xs font-semibold text-accent">
            {s.stadium}
          </span>
        </div>

        {/* Quote */}
        <div className="relative mx-6 mb-5 flex-1">
          <Quote className="absolute -top-1 -left-1 h-6 w-6 text-slate-100" />
          <p className="pl-6 text-sm leading-relaxed text-muted italic">
            {s.message}
          </p>
        </div>

        {/* Footer */}
        <div className="mx-6 mb-5 flex items-center justify-between border-t border-line pt-4">
          <time className="text-xs text-faint">{s.date}</time>
          <span
            className="rounded-full px-3 py-1 text-[11px] font-semibold text-white"
            style={{ backgroundColor: s.platform.color }}
          >
            {s.platform.label}
          </span>
        </div>

        {/* Hover ring */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-2 ring-[#0057B8]/25 transition-opacity duration-300 group-hover:opacity-100" />
      </article>
    </a>
  );
}

export default function StoriesPage() {
  useEffect(() => {
    AOS.init({ once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <>
      {/* Banner */}
      <section className="relative isolate overflow-hidden border-b border-line bg-gradient-to-br from-[#012A6B] via-[#01358A] to-[#001B44] py-20">
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#FFD700]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-[#0057B8]/30 blur-3xl" />
        <Container className="relative">
          <div
            className="flex items-center gap-3"
            data-aos="fade-right"
            data-aos-duration="700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
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
      <section className="bg-gradient-to-b from-slate-50 to-white py-14">
        <Container>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {STORIES.map((s, i) => (
              <StoryCard key={s.id} s={s} index={i} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
