"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/common/Container";
import { AosInit } from "@/components/common/AosInit";
import { apiUrl } from "@/lib/api";
import Link from "next/link";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiMapPin,
  FiMessageSquare,
  FiShare2,
} from "react-icons/fi";
import { Users } from "lucide-react";

type Story = {
  id: string;
  name: string;
  email: string;
  country?: string;
  city?: string;
  stadium?: string;
  photo?: string;
  socialUrl?: string;
  message: string;
  createdAt: string;
  approved?: boolean;
};

function allSocialLinks(s: Story): { url: string; label: string }[] {
  if (s.socialUrl) return [{ url: s.socialUrl, label: "Social" }];
  return [];
}

function countryBadge(country?: string): string {
  if (!country) return "INT";
  const trimmed = country.trim();
  if (trimmed.length <= 3) return trimmed.toUpperCase();
  return trimmed.slice(0, 3).toUpperCase();
}

// ── Featured story slide ──────────────────────────────────────────────────────

const FEATURED_HASHTAGS = [
  "#FIFA",
  "#WorldCup",
  "#Football",
  "#Soccer",
  "#FIFAWorldCup",
  "#Sports",
];

function FeaturedStoryCard({ s }: { s: Story }) {
  const location =
    [s.city, s.country].filter(Boolean).join(", ") || "Unknown location";
  const initials = s.name.trim().charAt(0).toUpperCase();
  const dateStr = new Date(s.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="grid md:grid-cols-[280px_1fr] w-full flex-shrink-0">
      <div
        className="relative flex flex-col items-center justify-center gap-2 text-white py-8"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(1,42,107,0.85), rgba(0,27,68,0.92)), url('/banner/fifabanner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ring-4 ring-[#FFD700]/80">
          <span className="text-2xl font-bold text-white">{initials}</span>
        </div>
        <h3 className="text-lg font-semibold">{s.name}</h3>
        <div className="flex items-center gap-1 text-sm text-white">
          <FiMapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
        </div>
        <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide">
          {countryBadge(s.country)}
        </span>
      </div>

      <div className="p-3 bg-surface sm:p-6">
        <h2 className="mt-1 text-xl font-bold text-ink">
          Tell the World Your FIFA Experience
        </h2>
        <p
          className="mt-2 overflow-hidden text-base leading-relaxed text-muted"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {s.message}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {FEATURED_HASHTAGS.map((tag) => (
            <span key={tag} className="text-sm text-[#0057B8]">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="h-4 w-4" />
              {dateStr}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {245}
            </span>
            <span className="flex items-center gap-1.5">
              <FiMessageSquare className="h-4 w-4" />
              {18}
            </span>
            <span className="flex items-center gap-1.5">
              <FiShare2 className="h-4 w-4" />
              {32}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allSocialLinks(s).length > 0 ? (
              allSocialLinks(s).map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFD700] px-5 py-2.5 text-sm font-semibold text-black"
                >
                  {link.label}
                  <FiExternalLink className="h-4 w-4" />
                </a>
              ))
            ) : (
              <span className="text-sm text-muted">No social link</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Story card (bottom slider) ─────────────────────────────────────────────────

function StoryCard({ s }: { s: Story }) {
  const location =
    [s.city, s.country].filter(Boolean).join(", ") || "Unknown location";
  const initials = s.name.trim().charAt(0).toUpperCase();
  const dateStr = new Date(s.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const link = allSocialLinks(s)[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm h-full flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-[#012A6B] via-[#0057B8] to-[#FFD700]" />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#0057B8] to-[#012A6B] flex-shrink-0">
            <span className="text-base font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{s.name}</p>
            <p className="flex items-center gap-1 truncate text-xs text-muted">
              <FiMapPin className="h-3 w-3 flex-shrink-0" />
              {location}
            </p>
          </div>
          <span className="ml-auto flex-shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] font-bold uppercase text-muted">
            {countryBadge(s.country)}
          </span>
        </div>
        <p
          className="mt-4 flex-1 text-sm leading-relaxed text-muted"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
            overflow: "hidden",
          }}
        >
          {s.message}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <FiCalendar className="h-3.5 w-3.5" />
            {dateStr}
          </span>
          {link ? (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700] px-4 py-1.5 text-xs font-semibold text-black"
            >
              View Profile
              <FiExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function SkeletonFeaturedCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center justify-center gap-3 bg-slate-100 px-6 py-10">
          <div className="h-24 w-24 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-5 w-24 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="p-6 sm:p-8">
          <div className="mb-2 h-4 w-32 rounded bg-slate-100 animate-pulse" />
          <div className="h-8 w-3/4 rounded bg-slate-100 animate-pulse" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-3/5 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <div className="flex gap-5">
              <div className="h-4 w-16 rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-12 rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-12 rounded bg-slate-100 animate-pulse" />
            </div>
            <div className="h-9 w-36 rounded-full bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <div className="h-1.5 bg-gradient-to-r from-slate-200 to-slate-100" />
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-slate-100 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/2 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-1/3 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
          <div className="h-3 w-4/5 rounded bg-slate-100 animate-pulse" />
          <div className="h-3 w-3/5 rounded bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const FEATURED_POOL_SIZE = 5;

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Featured slider state
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredAnimating, setFeaturedAnimating] = useState(false);
  const featuredPausedRef = useRef(false);

  // Card slider state
  const [cardIndex, setCardIndex] = useState(0);
  const [cardAnimating, setCardAnimating] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const cardPausedRef = useRef(false);

  useEffect(() => {
    fetch(apiUrl("/contact/approved"), { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setStories(data.stories as Story[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const featuredPool = stories.slice(0, FEATURED_POOL_SIZE);
  const cardStories = stories.slice(FEATURED_POOL_SIZE);
  const totalCardSlides = Math.max(1, Math.ceil(cardStories.length / itemsPerView));
  const maxCardIndex = totalCardSlides - 1;

  // Slide helpers (debounce mid-animation)
  const slideFeatured = (next: number) => {
    if (featuredAnimating) return;
    setFeaturedAnimating(true);
    setFeaturedIndex(next);
    setTimeout(() => setFeaturedAnimating(false), 560);
  };

  const slideCards = (next: number) => {
    if (cardAnimating) return;
    setCardAnimating(true);
    setCardIndex(next);
    setTimeout(() => setCardAnimating(false), 560);
  };

  const goToPrevFeatured = () =>
    slideFeatured(featuredIndex > 0 ? featuredIndex - 1 : featuredPool.length - 1);
  const goToNextFeatured = () =>
    slideFeatured(featuredIndex < featuredPool.length - 1 ? featuredIndex + 1 : 0);

  const goToPrevCard = () =>
    slideCards(cardIndex > 0 ? cardIndex - 1 : maxCardIndex);
  const goToNextCard = () =>
    slideCards(cardIndex < maxCardIndex ? cardIndex + 1 : 0);

  // Auto-advance featured
  useEffect(() => {
    if (featuredPool.length <= 1) return;
    const id = setInterval(() => {
      if (!featuredPausedRef.current)
        setFeaturedIndex((p) => (p < featuredPool.length - 1 ? p + 1 : 0));
    }, 7000);
    return () => clearInterval(id);
  }, [featuredPool.length]);

  // Auto-advance card slider
  useEffect(() => {
    if (totalCardSlides <= 1) return;
    const id = setInterval(() => {
      if (!cardPausedRef.current)
        setCardIndex((p) => (p < maxCardIndex ? p + 1 : 0));
    }, 7000);
    return () => clearInterval(id);
  }, [totalCardSlides, maxCardIndex]);

  return (
    <>
      <AosInit />
      <section
        className="border-b border-line text-white"
        style={{
          backgroundImage: `
    radial-gradient(
      circle at 95% 8%,
      rgba(255,255,255,0.45) 0%,
      rgba(120,180,255,0.18) 20%,
      transparent 45%
    ),
    linear-gradient(
      to right,
      rgba(0,72,190,0.82) 35%,
      rgba(1,42,107,0.65) 70%,
      rgba(0,27,68,0.45) 100%
    ),
    url('/banner/fifabanner.jpg')
  `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Hero heading */}
        <Container className="py-8 sm:py-10">
          <div
            className="flex flex-col items-center justify-center text-center gap-3"
            data-aos="fade-up"
            data-aos-duration="700"
          >
            <h2 className="text-lg font-bold">Fan Stories</h2>
            <span
              className="max-w-xl text-base leading-6 text-white"
              data-aos="fade-up"
              data-aos-delay="120"
              data-aos-duration="700"
            >
              Real experiences from football fans around the world at FIFA 2026.
              <br />
              Click any card to visit their social profile.
            </span>
          </div>
        </Container>

        <Container>
          {loading ? (
            <div className="space-y-8">
              <SkeletonFeaturedCard />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          ) : stories.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <p className="text-lg font-semibold text-ink">
                No stories published yet.
              </p>
              <p className="mt-2 text-sm text-muted">
                Check back soon — approved fan stories will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-7">

              {/* ── Featured soft-slide carousel ──────────────────────────── */}
              {featuredPool.length > 0 && (
                <div
                  data-aos="fade-up"
                  data-aos-duration="700"
                  className="relative"
                  onMouseEnter={() => { featuredPausedRef.current = true; }}
                  onMouseLeave={() => { featuredPausedRef.current = false; }}
                >
                  {/* Clipping wrapper */}
                  <div className="overflow-hidden rounded-2xl border border-blue-900">
                    {/* Sliding track — all slides side-by-side */}
                    <div
                      className="flex"
                      style={{
                        transform: `translateX(-${featuredIndex * 100}%)`,
                        transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                        willChange: "transform",
                      }}
                    >
                      {featuredPool.map((story) => (
                        <div key={story.id} style={{ width: "100%", flexShrink: 0 }}>
                          <FeaturedStoryCard s={story} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow buttons */}
                  {featuredPool.length > 1 && (
                    <>
                      <button
                        aria-label="Previous featured story"
                        onClick={goToPrevFeatured}
                        className="absolute -left-12 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface p-2 shadow-md hover:bg-slate-50 sm:flex transition-all duration-200 hover:scale-110"
                      >
                        <FiChevronLeft className="h-5 w-5 text-ink" />
                      </button>
                      <button
                        aria-label="Next featured story"
                        onClick={goToNextFeatured}
                        className="absolute -right-12 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface p-2 shadow-md hover:bg-slate-50 sm:flex transition-all duration-200 hover:scale-110"
                      >
                        <FiChevronRight className="h-5 w-5 text-ink" />
                      </button>
                    </>
                  )}

                  {/* Animated dots */}
                  {featuredPool.length > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      {featuredPool.map((_, i) => (
                        <button
                          key={i}
                          aria-label={`Go to featured story ${i + 1}`}
                          onClick={() => slideFeatured(i)}
                          className="h-2.5 rounded-full transition-all duration-300"
                          style={{
                            width: i === featuredIndex ? "24px" : "10px",
                            backgroundColor:
                              i === featuredIndex
                                ? "#e1b309"
                                : "rgba(255,255,255,0.4)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Share CTA ─────────────────────────────────────────────── */}
              <div className="flex items-center gap-4 mb-5 rounded-2xl bg-[#033d9a] px-5 py-4 sm:px-6 sm:py-5">
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold text-white sm:text-base">
                    Share your experience and be part of the biggest football
                    celebration.
                  </span>
                  <br />
                  <span className="mt-0.5 text-xs text-white/70 sm:text-sm">
                    Your story could inspire millions of fans worldwide.
                  </span>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full bg-[#FFD700] px-5 py-2.5 font-semibold"
                  style={{ color: "#000", display: "inline-flex" }}
                >
                  Share Your Story
                </Link>
              </div>

              {/* ── Card soft-slide carousel ──────────────────────────────── */}
              {cardStories.length > 0 && (
                <div
                  className="relative pb-8"
                  onMouseEnter={() => { cardPausedRef.current = true; }}
                  onMouseLeave={() => { cardPausedRef.current = false; }}
                >
                  {/* Clipping wrapper */}
                  <div className="overflow-hidden">
                    {/* Sliding track — each "slide" is a grid of itemsPerView cards */}
                    <div
                      className="flex"
                      style={{
                        transform: `translateX(-${cardIndex * 100}%)`,
                        transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                        willChange: "transform",
                      }}
                    >
                      {Array.from({ length: totalCardSlides }).map((_, slideIdx) => {
                        const slideItems = cardStories.slice(
                          slideIdx * itemsPerView,
                          slideIdx * itemsPerView + itemsPerView,
                        );
                        return (
                          <div
                            key={slideIdx}
                            style={{
                              width: "100%",
                              flexShrink: 0,
                              display: "grid",
                              gridTemplateColumns: `repeat(${itemsPerView}, 1fr)`,
                              gap: "20px",
                            }}
                          >
                            {slideItems.map((story) => (
                              <StoryCard key={story.id} s={story} />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Arrow buttons */}
                  {totalCardSlides > 1 && (
                    <>
                      <button
                        aria-label="Previous stories"
                        onClick={goToPrevCard}
                        className="absolute -left-12 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface p-2 shadow-md hover:bg-slate-50 sm:flex transition-all duration-200 hover:scale-110"
                      >
                        <FiChevronLeft className="h-5 w-5 text-ink" />
                      </button>
                      <button
                        aria-label="Next stories"
                        onClick={goToNextCard}
                        className="absolute -right-12 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface p-2 shadow-md hover:bg-slate-50 sm:flex transition-all duration-200 hover:scale-110"
                      >
                        <FiChevronRight className="h-5 w-5 text-ink" />
                      </button>
                    </>
                  )}

                  {/* Animated dots */}
                  {totalCardSlides > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2">
                      {Array.from({ length: totalCardSlides }).map((_, i) => (
                        <button
                          key={i}
                          aria-label={`Go to slide ${i + 1}`}
                          onClick={() => slideCards(i)}
                          className="h-2.5 rounded-full transition-all duration-300"
                          style={{
                            width: i === cardIndex ? "24px" : "10px",
                            backgroundColor:
                              i === cardIndex
                                ? "#e1b309"
                                : "rgba(255,255,255,0.35)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
