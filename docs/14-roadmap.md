# 14 — Roadmap & Scope

We build in phases on purpose: ship a real, useful **static site** first, then add complexity only when it earns its place.

## Phase 1 — Static site (NOW)

**Goal:** a fast, clean, trustworthy FIFA WC 2026 directory — all 16 city pages, Home, Locations, News, Contact — with hardcoded content and only a small backend for the Contact form (SMTP email).

### Build order (client's instruction)
```
1. MENU            Header + nav: Sports (Home) · Locations ▾ (16 cities) · News · Contact
                   + Footer. Responsive (mobile Sheet menu). Build this first.

2. HOME (Sports)   Banner → About → Matches (today/tomorrow + schedule link)
                   → Experience boxes (5 → Locations) → News preview → FAQ

3. LOCATIONS       Banner → grid of 16 city cards (grouped by country)

4. CITY PAGES ×16  Banner + 5 sections (Restaurants 1/2/5/10, Hotels 5/10,
                   Transportation, Tickets, Match Screening Zone).
                   One template, driven by data/cities. Seed Dallas first as the
                   reference, then fill the rest.

5. NEWS            2–3 static recent-match items.

6. CONTACT         Banner + form → Express backend (POST /api/contact) → SMTP email.
```

### Phase 1 scope
- Next.js 15 app (`frontend/`), TypeScript, Tailwind, shadcn/ui (restyled flat).
- All content in typed `src/data/*.ts` files.
- Today/tomorrow matches derived from the current date.
- SEO baseline: metadata, JSON-LD, sitemap, robots, canonical ([11](./11-seo.md)).
- Accessible, mobile-first, **non-AI-looking** visual design ([04](./04-ux-design.md)).
- Static export → deploy on Vercel.

### Explicitly NOT in Phase 1
- No backend, database, API, or CMS.
- No live data, search, accounts, or maps API.
- No image/photo pipeline (curated banner images + outbound Google Maps links only).

### Definition of done (Phase 1)
- Menu, Home, Locations, all 16 city pages, News, Contact all live.
- Every city page has real curated entries in one consistent layout.
- Home shows correct today/tomorrow matches + full schedule link.
- Lighthouse green; it does **not** look templated/AI-generated.
- Adding a place or changing a link = edit one `data/` file + redeploy.

### Suggested working sequence
| Step | Output |
|------|--------|
| **1. Scaffold** | `frontend/` Next.js app, Tailwind + tokens, layout shell; `backend/` Express skeleton |
| **2. Menu** | Header (Sports, Locations dropdown w/ 16 cities, News, Contact), Footer, mobile menu |
| **3. Data + types** | `data/types.ts`, seed `data/cities.ts` (Dallas full), `matches.ts`, `news.ts`, `faq.ts` |
| **4. Home** | All six home sections wired to data |
| **5. Locations** | City grid |
| **6. City template** | One city page rendering Dallas; verify all five sections |
| **7. Fill cities** | Add the remaining 15 cities' data |
| **8. News + Contact** | News list; contact form → Express backend (SMTP) |
| **9. SEO + polish** | metadata/JSON-LD/sitemap, a11y pass, responsive pass, deploy |

---

## Phase 2 — Dynamic data + CMS (LATER)

When hand-editing data files becomes the bottleneck, add the backend already designed in docs 06–10:
- **Express modular monolith** + **MongoDB Atlas** ([05 §7](./05-architecture.md#7-phase-2-future--the-dynamic-platform), [06](./06-modules.md), [07](./07-database.md), [08](./08-api-spec.md)).
- **Custom admin CMS** ([10](./10-admin-cms.md)) — editors manage cities/places/links/news without code.
- **Google Places / Maps + schedule** integrations ([09](./09-integrations.md)) to source and refresh listings.
- Migration is a data-source swap; pages stay the same.

## Phase 3 — Richer & broader

- i18n (ES for Mexico, FR for Canada).
- Interactive maps, POI filters (open-now, price, cuisine), live transit.
- Search, dynamic OG images, analytics dashboards.
- Newsletter/alerts ("matches in your city"), business self-serve listings.
- Personalization, PWA/offline city pages, and templating the platform for future tournaments.

---

## Guiding cut-line

When unsure whether something belongs in Phase 1: **does a fan need it to find which match, where it is, and what's nearby — today?** If yes and it can be a curated link or static content, it's Phase 1. If it needs a server, it waits.
