# 13 — Folder Structure (Phase 1: Static Site)

Phase 1 is a **single Next.js app** in `frontend/` (no monorepo, no `apps/api`). Matches the root [README](../README.md).

## 1. Repo top level

```
sportsonepoint/
├─ docs/                  # this documentation set
├─ frontend/              # the Next.js 15 app (the whole Phase 1 site)
└─ README.md
```

## 2. `frontend/` — the Next.js app

```
frontend/
├─ src/
│  ├─ app/                          # App Router — one folder per route
│  │  ├─ layout.tsx                 # root layout: Header (menu) + Footer + fonts
│  │  ├─ page.tsx                   # Home ("Sports")  /
│  │  ├─ globals.css                # tailwind + design tokens
│  │  ├─ locations/
│  │  │  └─ page.tsx                # /locations  — 16 city cards
│  │  ├─ cities/
│  │  │  └─ [slug]/
│  │  │     └─ page.tsx             # /cities/{slug} — generateStaticParams over data
│  │  ├─ news/
│  │  │  └─ page.tsx                # /news
│  │  ├─ contact/
│  │  │  └─ page.tsx                # /contact (form)
│  │  ├─ sitemap.ts                 # static sitemap from data
│  │  └─ robots.ts
│  │
│  ├─ components/
│  │  ├─ layout/                    # Header, Nav, LocationsDropdown, MobileMenu, Footer
│  │  ├─ home/                      # Banner, About, MatchList, ExperienceBoxes,
│  │  │                             #   NewsPreview, Faq
│  │  ├─ city/                      # CityHeader, AnchorChips, Section, ListingRow,
│  │  │                             #   DistanceBand
│  │  ├─ news/                      # NewsCard
│  │  ├─ contact/                   # ContactForm
│  │  └─ common/                    # OutboundLink, CityCard, SectionHeading, Badge,
│  │                               #   Container
│  │
│  ├─ data/                         # ── all content lives here (hardcoded) ──
│  │  ├─ types.ts                   # City, Place, Match, NewsItem, FaqItem types
│  │  ├─ cities.ts                  # all 16 cities + their places (the big one)
│  │  ├─ cities/                    # (optional) one file per city if cities.ts grows
│  │  │  ├─ dallas.ts
│  │  │  ├─ atlanta.ts
│  │  │  └─ ...
│  │  ├─ matches.ts                 # fixtures (today/tomorrow source)
│  │  ├─ news.ts                    # 2–3 news items
│  │  └─ faq.ts                     # FAQ entries
│  │
│  └─ lib/
│     ├─ schedule.ts                # today/tomorrow helpers (date math)
│     ├─ seo.ts                     # metadata + JSON-LD builders
│     └─ utils.ts                   # cn(), formatters, slug helpers
│
├─ public/                          # banner images, og images, favicon
│  └─ images/{cities,banners}/
├─ next.config.ts                   # output: 'export', images, security headers
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
└─ .env.local.example               # form service endpoint/key (public, build-time)
```

## 3. The data shape (the heart of Phase 1)

`src/data/types.ts` defines the contract every page reads. Designed so Phase 2's MongoDB documents ([07](./07-database.md)) mirror it 1:1 — migrating means swapping the import for a fetch, not rewriting pages.

```ts
export type Place = {
  name: string;
  phone?: string;
  address: string;
  mapUrl: string;           // google maps link — powers [Map ↗]
  website?: string;
  distanceMiles: number;    // curated distance from the stadium
  note?: string;            // cuisine/price/route note, etc.
};

export type DistanceBand = '1mi' | '2mi' | '5mi' | '10mi';

export type TransportOption = {
  category: 'shared_ride' | 'metro' | 'parking' | 'getting_there';
  title: string;
  url: string;
  note?: string;
};

export type City = {
  slug: string;             // 'dallas'
  name: string;             // 'Dallas'
  country: 'USA' | 'Canada' | 'Mexico';
  region: 'West' | 'Central' | 'East';
  stadium: { name: string; address: string; mapUrl: string };
  gettingThere: string;     // one-line summary
  bannerImage: string;      // /images/cities/dallas.jpg
  restaurants: Partial<Record<DistanceBand, Place[]>>; // 1/2/5/10
  hotels: Partial<Record<'5mi' | '10mi', Place[]>>;
  transportation: TransportOption[];
  tickets: { label: string; url: string; official: boolean }[];
  screeningZones: { name: string; type: string; address?: string; url: string; note?: string }[];
  seo: { title: string; description: string };
};

export type Match = {
  date: string;             // '2026-06-18' (venue-local date)
  kickoff: string;          // '18:00'
  citySlug: string;
  stadium: string;
  home: { name: string; code: string; score?: number };
  away: { name: string; code: string; score?: number };
  status: 'scheduled' | 'live' | 'finished';
};
```

## 4. Conventions

- Files: `kebab-case.ts`; components `PascalCase.tsx`.
- **All content edits happen in `src/data/`** — never hardcode content inside components.
- One `CityPage` template renders every city from a `City` object → consistency for free.
- Interactive bits are the only `'use client'` components: `MatchList` (today/tomorrow), `MobileMenu`, `LocationsDropdown`, `Faq`, `ContactForm`.
- `OutboundLink` centralizes external-link behavior (`target="_blank"`, `rel="noopener"`, "opens in new tab").

## 5. Phase 2 note

When the CMS/API land, this `frontend/` app stays. We add a sibling `api/` (Express) and switch pages from `import { cities } from '@/data'` to a typed fetch — the components and routes are unchanged. That's the payoff of keeping content in typed `data/` files now.
