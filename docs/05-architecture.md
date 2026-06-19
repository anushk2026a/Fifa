# 05 — Architecture (Phase 1: Static Site)

## 1. Phase 1 at a glance

There is no backend. The entire site is a **Next.js app that exports to static HTML** and is served from a CDN (Vercel). Content lives in TypeScript data files inside the app.

```
   ┌──────────────┐      build time       ┌─────────────────────────────┐
   │  data/*.ts   │ ───────────────────▶  │  Next.js static export      │
   │ (cities,     │   generateStaticParams│  → pre-rendered HTML for     │
   │  matches,    │   renders every page  │    /, /locations, /cities/*, │
   │  news, faq)  │                       │    /news, /contact           │
   └──────────────┘                       └──────────────┬──────────────┘
                                                         │ deploy
                                          ┌──────────────▼──────────────┐
                                          │   Vercel (static + CDN)     │
                                          └──────────────┬──────────────┘
                                                         │ HTTPS
                                          ┌──────────────▼──────────────┐
                                          │           Browser            │
                                          └──────────────┬──────────────┘
                            outbound links │              │ form POST
                  ┌────────────────────────▼──┐   ┌───────▼────────────┐
                  │ Google Maps · FIFA tickets │   │ Form service       │
                  │ FIFA schedule · transit …  │   │ (Formspree/Web3-   │
                  │ (the fan clicks out)       │   │  Forms) → email    │
                  └────────────────────────────┘   └────────────────────┘
```

**That's the whole system.** One app, static output, a CDN, and outbound links. The only "dynamic" call anywhere is the **contact form**, which posts to a third-party form service — not a server of ours.

## 2. Why Next.js (even for static)

We use Next.js 15 with **static export** (`output: 'export'`) rather than plain HTML because:
- **Components + data files** scale to 16 near-identical city pages far better than copy-pasted HTML. One `CityPage` template + `generateStaticParams` over `data/cities` produces all 16.
- **Built-in SEO** — the Metadata API generates per-page `<title>`, meta, Open Graph, and JSON-LD at build time. ([11](./11-seo.md))
- **`next/image`** optimizes banners automatically (responsive, lazy, modern formats).
- **It's the same framework Phase 2 uses.** When we add live data/CMS later, the pages stay; only their data source changes (from `data/*.ts` to API fetches). No rewrite.

## 3. How the data flows (Phase 1)

```
data/cities.ts      → one object per city: { slug, name, country, region, stadium,
                       gettingThere, restaurants[1mi/2/5/10], hotels[5/10],
                       transportation[], tickets[], screeningZones[] }
data/matches.ts     → fixtures with date/time, teams, score, city, status
data/news.ts        → 2–3 news items
data/faq.ts         → FAQ entries

Pages read these at build time:
  /                 → matches (today/tomorrow from current date), news, faq
  /locations        → all cities (cards)
  /cities/[slug]    → one city (generateStaticParams over cities)
  /news             → news
  /contact          → static form
```

- **"Today/tomorrow"** is computed in a small helper from the device/current date against `data/matches`. With static export, this runs client-side on the home page (a tiny client component) so the right two days always show; the rest of Home is fully static.
- **All place data is curated** — each entry is `{ name, phone, address, mapUrl, distanceMiles, website?, note? }`. No API.

## 4. Component architecture

```
app/
  layout.tsx            Header (menu) + Footer wrap every page
  page.tsx              Home (Sports)
  locations/page.tsx
  cities/[slug]/page.tsx
  news/page.tsx
  contact/page.tsx

components/
  layout/   Header, Nav, LocationsDropdown, Footer, MobileMenu(Sheet)
  home/     Banner, About, MatchList, ExperienceBoxes, NewsPreview, Faq
  city/     CityHeader, AnchorChips, Section, ListingRow, DistanceBand
  common/   OutboundLink, CityCard, SectionHeading, Badge

lib/
  schedule.ts   today/tomorrow helpers (date math, venue tz aware)
  seo.ts        metadata + JSON-LD builders

data/
  cities.ts, matches.ts, news.ts, faq.ts, types.ts
```

- **Server Components by default** (rendered to static HTML). Only genuinely interactive pieces are client components: the today/tomorrow match list, the mobile menu, the Locations dropdown, the FAQ accordion, and the contact form.

## 5. Build & deploy

- `next build` with `output: 'export'` → static HTML/CSS/JS in `frontend/out/`.
- Deployed to **Vercel** (or any static host). No servers, no database, no runtime.
- Every push → Vercel preview deploy; merge to main → production.

## 6. Maintainability

- **All content in `data/*.ts`**, typed (`data/types.ts`). Adding a restaurant = add one object; changing a link = edit one field; redeploy.
- **One city template** guarantees every city looks and behaves the same.
- **Typed data** means a missing field is a compile error, not a broken page.
- Clear separation between *content* (`data/`) and *presentation* (`components/`) — the seam where Phase 2's API will plug in.

## 7. Phase 2+ (future) — the dynamic platform

> Not built now. Captured here so today's structure stays compatible.

When the site needs a CMS and live data, we add:
- An **Express modular monolith** API ([06](./06-modules.md)) + **MongoDB Atlas** ([07](./07-database.md), [08](./08-api-spec.md)).
- A **custom admin CMS** ([10](./10-admin-cms.md)) so editors manage content without code.
- **Google Places / Maps** and schedule integrations ([09](./09-integrations.md)) to source/refresh data.

The migration is deliberately small: the `data/*.ts` shapes mirror the future MongoDB documents, so the pages swap `import { cities } from '@/data'` for an API fetch — **the page components don't change.** That's why we use Next.js and typed data now.

## 8. Technology mapping (Phase 1)

| Concern | Choice |
|---------|--------|
| Framework / rendering | Next.js 15 (App Router, **static export**) |
| Language | TypeScript |
| Styling / components | TailwindCSS + shadcn/ui (flat, restyled) |
| Content | Local `data/*.ts` (typed, hardcoded) |
| Images | `next/image` |
| Contact form | Formspree / Web3Forms (no backend) |
| Hosting | Vercel (static + CDN) |
| Light client state | React state / a tiny Zustand store if needed (mobile menu, filters) |
