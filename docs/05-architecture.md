# 05 — Architecture (Phase 1: Static Site)

## 1. Phase 1 at a glance

The site is a **Next.js app** (content from TypeScript data files, pages prerendered) on Vercel, plus **one small Express backend** that exists only to email the **Contact** form via SMTP. No database.

```
   ┌──────────────┐      build time       ┌─────────────────────────────┐
   │  data/*.ts   │ ───────────────────▶  │  Next.js (App Router)       │
   │ (cities,     │   generateStaticParams│  prerendered pages for       │
   │  matches,    │   renders every page  │    /, /locations, /cities/*, │
   │  news, faq)  │                       │    /news, /contact           │
   └──────────────┘                       └──────────────┬──────────────┘
                                                         │ deploy
                                          ┌──────────────▼──────────────┐
                                          │   Vercel (Next.js + CDN)    │
                                          └──────────────┬──────────────┘
                                                         │ HTTPS
                                          ┌──────────────▼──────────────┐
                                          │           Browser            │
                                          └──────┬───────────────┬──────┘
                          outbound links         │               │ POST /api/contact
              ┌────────────────────────▼──┐      │      ┌────────▼─────────────────┐
              │ Google Maps · FIFA tickets │      │      │ Express backend (Render) │
              │ FIFA schedule · transit …  │      │      │  modules/contact         │
              │ (the fan clicks out)       │      │      │  → Nodemailer (SMTP)     │
              └────────────────────────────┘      │      └────────┬─────────────────┘
                                                  │               │ SMTP
                                                  │      ┌────────▼─────────┐
                                                  │      │  Email → team    │
                                                  │      └──────────────────┘
```

**That's the whole system.** A prerendered Next.js site on a CDN, outbound links, and a tiny Express service whose only job is to receive the contact form and send an email. No database, queue, or CMS.

## 2. Why Next.js

We use Next.js 15 (App Router) rather than plain HTML because:
- **Components + data files** scale to 16 near-identical city pages far better than copy-pasted HTML. One `CityPage` template + `generateStaticParams` over `data/cities` produces all 16.
- **Built-in SEO** — the Metadata API generates per-page `<title>`, meta, Open Graph, and JSON-LD. ([11](./11-seo.md))
- **`next/image`** optimizes banners automatically (responsive, lazy, modern formats — handled by Vercel's runtime).
- **Prerendered on Vercel** — pages are static/SSG and served from the edge; Vercel runs Next.js natively (no separate static-export step needed, though the app can also be exported to plain HTML if a non-Vercel static host is ever required).
- **Same framework Phase 2 uses.** When we add live data/CMS later, the pages stay; only their data source changes (from `data/*.ts` to API fetches). No rewrite.

### The contact backend
`POST /api/contact` is handled by the Express **Contact module** ([06](./06-modules.md)): validate (Zod) → send via Nodemailer/SMTP → reply with `{ ok, delivered }`. It stores nothing. The frontend posts to `NEXT_PUBLIC_API_URL`. This is the modular-monolith backend in miniature — Phase 2 simply adds more modules beside `contact`.

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

- **"Today/tomorrow"** is computed in a small helper from the device/current date against `data/matches`. This runs client-side on the home page (a tiny client component) so the right two days always show; the rest of Home is prerendered.
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

- **Frontend:** `next build` → prerendered pages, deployed on **Vercel** (root directory `frontend`; Vercel runs Next.js natively). Every push → preview deploy; merge to main → production. (The app can also be `output: 'export'`-ed to plain static HTML for a non-Vercel host if ever needed.)
- **Backend:** the Express contact service on **Render/Railway** (root directory `backend`). No database.

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
| Framework / rendering | Next.js 15 (App Router, prerendered on Vercel) |
| Language | TypeScript |
| Styling / components | TailwindCSS + shadcn/ui (flat, restyled) |
| Content | Local `data/*.ts` (typed, hardcoded) |
| Images | `next/image` |
| Contact backend | Express + Nodemailer (SMTP) on Render/Railway |
| Hosting | Vercel (static + CDN) |
| Light client state | React state / a tiny Zustand store if needed (mobile menu, filters) |
