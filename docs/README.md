# SportsOnePoint.com — Design & Architecture Documentation

> Your single point of reference for FIFA World Cup 2026™.
> FIFA-related information, resources, and links in one place — for fans, enthusiasts, travelers, local communities, and businesses across the 16 host cities.

**Domain:** www.SportsOnePoint.com

---

## Read this first — two phases

We are building in two phases. **Phase 1 is what we build now.**

|              | **Phase 1 — Static site (NOW)**                                                           | **Phase 2+ — Dynamic platform (LATER)**   |
| ------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| What         | A fast, static website. Menu → Home (Sports) → Locations → City pages → News → Contact.   | Admin CMS, live data, search, accounts.   |
| Content      | **Hardcoded** in local data files (curated links).                                        | Editable via CMS, sourced from APIs.      |
| Backend      | **Minimal** — a small Express service for the **Contact** form (SMTP email). No database. | Express + MongoDB + Google Places, etc.   |
| Matches/News | **Static**, taken manually from FIFA's site.                                              | Synced automatically.                     |
| Hosting      | Next.js on **Vercel** (prerendered) + the contact API on **Render/Railway**.              | Same web app + a fuller API service + DB. |

The client deliberately simplified to a static site so we can ship something solid, then add complexity. **All API/CMS/database documentation in this set is Phase 2+ reference — not part of the current build.** Each such doc is marked at the top.

---

## What we're building (Phase 1)

A FIFA World Cup 2026 **information directory**. A fan arrives and quickly answers three questions:

1. **Which match & when?** — today's / tomorrow's matches + a link to the full FIFA schedule.
2. **Where is it?** — the host city and its stadium.
3. **What's around it?** — restaurants (1 / 2 / 5 / 10 mi), hotels (5 / 10 mi), transportation, tickets, and screening zones near that stadium.

Everything is a **curated link or a short content block** — the fan reads, then clicks out to the real destination (Google Maps, FIFA tickets, a hotel site, a transit page). No accounts, no live API calls.

## Menu (build this first)

- **Sports** → the Home page (the client's name for Home)
- **Locations** → dropdown of the 16 host cities + a Locations landing page
- **News** → 2–3 static recent-match items (from FIFA)
- **Contact Us** → banner + form ("share your details and we'll guide you for your location")

## Pages

`/` Home (Sports) · `/locations` · `/cities/{slug}` (×16) · `/news` · `/contact`
→ 16 city pages + Home + News + Contact = the initial set, plus FAQ on the Home page.

## Build order (client's instruction)

**Menu → Home (Sports) → Locations page → City pages → News → Contact**

## Document index

| #   | Document                                                     | Phase       | Covers                                           |
| --- | ------------------------------------------------------------ | ----------- | ------------------------------------------------ |
| 01  | [Product Requirements](./01-product-requirements.md)         | 1           | Vision, scope, static-first decisions            |
| 02  | [Information Architecture](./02-information-architecture.md) | 1           | Menu, sitemap, page-by-page structure            |
| 03  | [User Flows](./03-user-flows.md)                             | 1           | How fans move through the static site            |
| 04  | [UX & Visual Design](./04-ux-design.md)                      | 1           | Design principles + wireframes per page          |
| 05  | [Architecture](./05-architecture.md)                         | 1 (+2 note) | Static Next.js architecture now; platform later  |
| 11  | [SEO Strategy](./11-seo.md)                                  | 1           | Metadata, sitemap, structured data (static)      |
| 12  | [Infrastructure](./12-infrastructure.md)                     | 1           | Vercel (frontend) + Render/Railway (contact API) |
| 13  | [Folder Structure](./13-folder-structure.md)                 | 1           | Next.js app + `data/` files                      |
| 14  | [Roadmap & Scope](./14-roadmap.md)                           | 1→3         | Phase 1 build plan, then Phase 2/3               |
| 06  | [Modules](./06-modules.md)                                   | **2+**      | _Future_ backend modules                         |
| 07  | [Database](./07-database.md)                                 | **2+**      | _Future_ MongoDB design                          |
| 08  | [API Spec](./08-api-spec.md)                                 | **2+**      | _Future_ REST API                                |
| 09  | [Integrations](./09-integrations.md)                         | 1+2         | Phase 1 links; _future_ Places/Maps APIs         |
| 10  | [Admin / CMS](./10-admin-cms.md)                             | **2+**      | _Future_ content management                      |

## Tech stack

- **Phase 1 — frontend:** Next.js 15 (App Router) · TypeScript · TailwindCSS · shadcn/ui. Content in local `data/` files; pages are prerendered. Deploy on **Vercel** (native Next.js runtime).
- **Phase 1 — backend:** a small **Express** modular monolith (TypeScript + Nodemailer) for the **Contact** feature, emailing submissions via **SMTP**. Deploy on **Render / Railway**. No database.
- **Phase 2+:** grow the same Express backend (modules for City/POI/Blog…) + MongoDB Atlas + a custom CMS, swapping hardcoded data for live data — **no rewrite of the pages**, just the data source.

## Key principles

1. **Static-first, minimal backend.** Ship a fast prerendered site; the only backend is a small contact API. Add complexity only when needed.
2. **Links, not APIs.** Curated outbound links and content; the fan clicks out to official sources.
3. **One predictable city-page layout**, so a fan learns it once.
4. **Content-first, low-chrome design** — clean, legible, no decorative shadows/gradients. ([principles](./04-ux-design.md#design-principles))
5. **Build to grow.** Page structure and data shapes are designed so the Phase 2 CMS/API drop in cleanly.
