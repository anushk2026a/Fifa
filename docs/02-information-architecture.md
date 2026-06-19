# 02 — Information Architecture (Phase 1: Static Site)

## 1. Top-level navigation (build this first)

A small, deliberate header. The logo and **Sports** both go Home.

```
┌──────────────────────────────────────────────────────────────────────┐
│  SportsOnePoint      Sports   Locations ▾   News   Contact Us         │
└──────────────────────────────────────────────────────────────────────┘
```

| Item | Goes to | Notes |
|------|---------|-------|
| **Logo / wordmark** | `/` | Home |
| **Sports** | `/` | The client's name for **Home** — Sports *is* the home page |
| **Locations ▾** | dropdown + `/locations` | 16 cities grouped by country; also a landing page |
| **News** | `/news` | Static recent-match items |
| **Contact Us** | `/contact` | Form |

> "Sports" = Home is intentional. The client didn't want the label "Home." When this doc says "Home page," that is the **Sports** tab at `/`.

## 2. Sitemap

```
/                          Home (Sports)
/locations                 All 16 cities (grid of cards)
/cities/{city-slug}        City page (×16)
/news                      News
/contact                   Contact Us

(Phase 2+: /admin, search, etc. — not built now)
```

## 3. Locations dropdown — the 16 cities

```
Locations ▾
 ┌───────────────────────────────────────────────┐
 │ 🇺🇸 USA                                         │
 │   Atlanta · Boston · Dallas · Houston          │
 │   Kansas City · Los Angeles · Miami            │
 │   New York/New Jersey · Philadelphia           │
 │   San Francisco Bay Area · Seattle             │
 │ 🇨🇦 CANADA                                       │
 │   Toronto · Vancouver                           │
 │ 🇲🇽 MEXICO                                       │
 │   Mexico City · Guadalajara · Monterrey        │
 │ ──────────────────────────────────────────────│
 │ View all locations →   (/locations)             │
 └───────────────────────────────────────────────┘
```

## 4. Page-by-page structure

### 4.1 Home (`/`, the "Sports" tab)
```
1. BANNER            FIFA cup / stadium / teams, soft-blur treatment
2. ABOUT             "Find Places near your Match Location" + short intro
3. MATCHES           Full FIFA schedule link
                     ┌ TODAY  (auto by current date) — match rows
                     └ TOMORROW (auto by current date) — match rows
4. EXPERIENCE        "Experience FIFA World Cup 2026"
   FWC 2026          [ Restaurants ] [ Hotels ] [ Transportation ]
                     [ Tickets ] [ Match Screening Zone ]
                     → each box links to /locations (pick a city)
5. NEWS              2–3 recent-match items → /news
6. FAQ              common questions (accordion)
   FOOTER            cities, news, contact, official-sources note
```
- Match rows show: teams, score (if finished) or kickoff time, host city (links to that city page), stadium, status.
- "Today/Tomorrow" is derived from the device date against the static match data — the correct two days surface automatically.

### 4.2 Locations (`/locations`)
```
1. BANNER
2. CITY GRID         16 cards, grouped by country (USA / Canada / Mexico)
                     each card: city name, flag, stadium name, short guide line,
                                "View city →"
                     → click → /cities/{slug}
```

### 4.3 City page (`/cities/{slug}`)
Identical structure for all 16, so a fan learns it once. Order: orient → eat → sleep → get there → tickets → watch.
```
1. BANNER            city + stadium
   (header: city, country, stadium name, "getting there" one-liner,
    sticky anchor chips → the 5 sections)

§ RESTAURANTS        Within 1 mi · 2 mi · 5 mi · 10 mi
§ HOTELS             Within 5 mi · 10 mi
§ TRANSPORTATION     Shared Ride · Metro · Parking · "Getting there" guide
§ TICKETS            Official FIFA ticket link(s) + "official sources only" note
§ MATCH SCREENING    FIFA Fan Festival · Public viewing · Local events
   ZONE

   FOOTER            related cities (same country/region), full schedule link
```

**Listing format (left-aligned), the unit of the page:**
```
Name of place
Phone · 1.2 mi from stadium
123 Main St, Arlington, TX        [ Map ↗ ]   [ Website ↗ ]
```
Each entry: **Name · Phone · Address (+ Map link) · Distance from stadium**, plus category-specific extras (e.g., cuisine/price for restaurants, a route note for transport).

### 4.4 News (`/news`)
```
1. BANNER (optional / lightweight)
2. NEWS LIST   2–3 items: title, date, short summary, source link ↗
```

### 4.5 Contact (`/contact`)
```
1. BANNER + copy: "You may share your details and we will guide you for your location."
2. FORM         Name · Email · City (dropdown of 16) · Message → submit
                (posts to our small Express backend → SMTP email)
3. (optional)   short FAQ / official-sources note
```

## 5. Host cities & stadiums (canonical data)

This is the seed data for `data/cities`.

| City | Country | Region | Stadium |
|------|---------|--------|---------|
| Atlanta | USA | East | Mercedes-Benz Stadium |
| Boston (Foxborough) | USA | East | Gillette Stadium |
| Dallas (Arlington) | USA | Central | AT&T Stadium |
| Houston | USA | Central | NRG Stadium |
| Kansas City | USA | Central | Arrowhead Stadium |
| Los Angeles (Inglewood) | USA | West | SoFi Stadium |
| Miami (Miami Gardens) | USA | East | Hard Rock Stadium |
| New York / New Jersey (East Rutherford) | USA | East | MetLife Stadium |
| Philadelphia | USA | East | Lincoln Financial Field |
| San Francisco Bay Area (Santa Clara) | USA | West | Levi's Stadium |
| Seattle | USA | West | Lumen Field |
| Toronto | Canada | East | BMO Field |
| Vancouver | Canada | West | BC Place |
| Mexico City | Mexico | Central | Estadio Azteca |
| Guadalajara | Mexico | Central | Estadio Akron |
| Monterrey | Mexico | Central | Estadio BBVA |

## 6. URL conventions

- Lowercase, hyphenated slugs: `/cities/new-york-new-jersey`, `/cities/san-francisco-bay-area`.
- City sections are **anchors on one page** (`#restaurants`, `#hotels`, …) — one strong page per city, the way fans scan.
- Stable slugs; if one ever changes, add a redirect (Phase 2 concern).

## 7. Where the Home category boxes lead

The five "Experience" boxes on Home **all link to `/locations`** (not to a city directly). The fan picks a category in spirit, lands on Locations, chooses a city, and finds that category on the city page. (A Phase 2 nicety: deep-link a box straight to a chosen city's section.)
