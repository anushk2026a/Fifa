# 01 — Product Requirements (Phase 1: Static Site)

> **Scope of this document = the static site we build now.** Phase 2+ (CMS, API, database) is captured separately and clearly marked. See [README](./README.md).

## 1. Vision

SportsOnePoint.com is the **single point of reference for FIFA World Cup 2026™**. A fan, traveler, or local business should find _everything practical_ about attending or following a match in a host city, in one place, fast — without hopping between ten sites.

We are the **connective directory**: we collect the scattered authoritative links and local knowledge and present them per city, per need, cleanly. We don't replace FIFA.com (official schedule/tickets) or Google Maps — we point fans to them at the right moment.

## 2. Phase 1 goals & non-goals

### Goals

- Be the fastest way to answer: _"I'm following/attending a match in **[city]** — what do I need to know?"_
- Show **today's and tomorrow's** matches on Home + a link to the full FIFA schedule.
- Per host city, present curated links/content for: **Restaurants (1/2/5/10 mi), Hotels (5/10 mi), Transportation, Tickets, Match Screening Zones**.
- A few **News** items (recent matches) and a **Contact** form.
- Be **fast, clean, and trustworthy** — a fan stays and finds what they need.

### Non-goals (Phase 1)

- **No database, no CMS, no content API.** All page content is hardcoded in `data/` files and edited in code.
- **Backend is minimal** — a small Express service that exists **only** for the Contact form (sending email via SMTP). No data is stored.
- **No live data** — matches and news are entered manually from FIFA's site.
- No accounts, saved itineraries, or social features.
- No native app — mobile-first responsive web.

> Everything in the non-goals list is **Phase 2+**, already designed in docs 06–10. Phase 1 ships value without it.

## 3. Target users

| User                           | Wants                                 | Where                       |
| ------------------------------ | ------------------------------------- | --------------------------- |
| **Match-going fan / traveler** | Get to the stadium, eat, sleep, watch | City page, Home matches     |
| **Local fan (no ticket)**      | Find a fan festival / screening zone  | City → Match Screening Zone |
| **Tourist**                    | Plan a trip around the match          | Home, City page, News       |
| **Local business**             | Get in touch / be listed              | Contact Us                  |

## 4. Functional requirements (Phase 1)

### 4.1 Menu / navigation

Four items (build this first):

- **Sports** → the **Home** page (the client's chosen name for Home).
- **Locations** → dropdown of 16 host cities + a Locations landing page.
- **News** → static recent-match items.
- **Contact Us** → form page.

### 4.2 Home page ("Sports")

Sections, top to bottom:

1. **Banner** — FIFA World Cup imagery (cup in stadium, teams, soft/blurred treatment).
2. **About** — "Find Places near your Match Location" (what the site does, briefly).
3. **Matches** — link to the official FIFA schedule + **today's and tomorrow's** matches; the displayed day is driven by the current date (the right two days surface automatically from the static data).
4. **Experience FIFA World Cup 2026** — five boxes: **Restaurants, Hotels, Transportation, Tickets, Match Screening Zone**. Each links to the **Locations** page (where the fan picks a city).
5. **News** — a few recent-match items.
6. **FAQ** — common questions.

### 4.3 Locations page

1. **Banner.**
2. **All 16 cities as cards**, with guiding copy ("check restaurants, hotels, transport, and more for this city"). Click a city → its City page.

### 4.4 City page (×16)

1. **Banner** (city/stadium).
2. **Five sections**, each a list of curated entries. Each entry shows (left-aligned): **Name · Phone · Address (with Map link) · Distance from Stadium**, plus any category-specific info.
   - **Restaurants** — Within 1 mile · 2 miles · 5 miles · 10 miles
   - **Hotels** — Within 5 miles · 10 miles
   - **Transportation** — Shared Ride · Metro · Parking · "Getting there" guide link
   - **Tickets** — official FIFA ticket link(s)
   - **Match Screening Zone** — FIFA Fan Festival / public viewing / local events

### 4.5 News page

- 2–3 static items about recent matches (sourced manually from FIFA). Title, short summary, date, outbound link.

### 4.6 Contact page

- **Banner** + copy: _"You may share your details and we will guide you for your location."_
- **Form** (name, email, city, message) posts to our **small Express backend** (`POST /api/contact`), which emails the team via **SMTP**. Fans can ask which stadium hosts their match or how to get there.

## 5. Non-functional requirements

| Area                | Requirement                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| **Performance**     | Static HTML; LCP < 2.0s on 4G; instant navigation                            |
| **Hosting**         | Next.js on **Vercel** (prerendered); small contact API on **Render/Railway** |
| **SEO**             | Pre-rendered pages, metadata, sitemap, structured data ([11](./11-seo.md))   |
| **Accessibility**   | WCAG 2.1 AA: semantic HTML, keyboard nav, contrast, alt text                 |
| **Maintainability** | All content in clear `data/` files; one predictable city-page layout         |
| **Responsive**      | Mobile-first — most match-goers are on a phone                               |
|  | Clean, editorial, no decorative shadows/gradients ([04](./04-ux-design.md))  |

## 6. Success criteria (Phase 1)

- All 16 city pages live with curated entries, one consistent layout.
- Home shows correct today/tomorrow matches and links to the full FIFA schedule.
- Menu, Locations, News, Contact all working.
- Fast (Lighthouse green), accessible.
- Updating a link or adding a place = edit one `data/` file + redeploy.

## 7. Constraints & assumptions

- Pre-tournament info changes often → content kept in simple, well-organized `data/` files so edits are trivial.
- Matches/news entered manually from FIFA for now (no API) — acceptable at this stage.
- Official sources are authoritative; we never present unofficial ticket sources as official.
- Page structure and data shapes are designed so the **Phase 2 CMS/API drop in cleanly** — pages won't need rewriting, only their data source.
