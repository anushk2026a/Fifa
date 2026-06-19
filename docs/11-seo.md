# 11 — SEO Strategy (Phase 1: Static Site)

SEO is a primary acquisition channel: fans search "[city] world cup hotels / transport / fan festival". Static export plays *into* this — every page is pre-rendered HTML with full metadata, so crawlers get real content on first byte, and pages are fast.

## 1. URL structure

- Clean, lowercase, hyphenated, stable:
  - `/` · `/locations` · `/cities/{slug}` · `/news` · `/contact`
  - City sections are **anchors** (`/cities/dallas#hotels`) → link equity concentrates on one strong city page instead of being split into thin pages.
- No query strings in canonical URLs; `<link rel="canonical">` on every page points to the clean URL.

## 2. Metadata strategy

- Generated at build time via the Next.js **Metadata API** (`generateMetadata` per route) — title/meta/OG baked into the static HTML.
- Defaults are **generated per template** from the data file:
  - City: `"{City} — FIFA World Cup 2026 Guide: Hotels, Restaurants, Transport | SportsOnePoint"`
  - Home: brand + "FIFA World Cup 2026 — host cities, matches, restaurants, hotels".
- `<meta name="description">` from a per-city/per-page summary in `data/`.
- One `<h1>` per page; semantic heading order; descriptive `<title>`.

## 3. Open Graph & Twitter cards

- Every page emits `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, plus `twitter:card=summary_large_image`.
- OG images: per-city banner image; brand fallback. (Phase 2: dynamically generated OG images per city/match.)

## 4. Structured data (JSON-LD)

Rendered as `<script type="application/ld+json">` in each static page:
- **City page:** `Place`/`TouristDestination` for the city; `StadiumOrArena` for the stadium (name, address); `ItemList` for restaurants/hotels; `SportsEvent` for matches in that city.
- **Restaurant/Hotel items:** `Restaurant` / `LodgingBusiness` with `address` and (where known) `telephone` — only fields we actually curate, no invented ratings.
- **Breadcrumbs:** `BreadcrumbList` on city pages.
- **Site:** `Organization` + `WebSite`.

## 5. Sitemap & robots

- `sitemap.ts` in the app generates `sitemap.xml` at build time from `data/cities` + static routes → emitted as a static file by the export.
- `robots.ts` allows crawl and points to the sitemap.
- Re-generated on every build (i.e., whenever content changes and we redeploy).

## 6. Programmatic SEO

The 16 cities × consistent sections = a scalable, templated content surface:
- **One canonical, rich page per city** — ranks for the city + multiple intents (hotels, restaurants, transport, tickets, screening) because the page genuinely covers them with real curated links.
- **News** items target timely, recent-match queries.
- **Internal linking:** home → cities; locations → cities; city → nearby cities + full schedule; consistent footer links spread equity.
- Avoid thin content: don't publish a city until it has real curated entries (a pre-launch checklist per city).

## 7. Performance = ranking

Core Web Vitals are both a ranking factor and the UX bar:
- Static export + Vercel CDN → fast TTFB and LCP.
- `next/image` (responsive `srcset`, lazy, modern formats); reserved dimensions → low CLS.
- Minimal JS (only the few interactive components hydrate) → good INP.
- Targets: **LCP < 2.0s, CLS < 0.05, INP < 200ms** ([04 §8](./04-ux-design.md#8-performance-budget)).

## 8. Internationalization (future)

- `hreflang` for EN/ES (Mexico) and EN/FR (Canada) when localized; reserve `/{locale}/...` URL strategy to avoid a future migration.

## 9. Governance

- Per-city pre-publish check: title ≤ 60 chars, description 120–160, OG image set, canonical valid, real entries present.
- Monitor with Google Search Console (coverage, queries); validate structured data on the templates.
