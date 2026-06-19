# 04 — UX & Visual Design (Phase 1: Static Site)

> Hard requirement: **the site must not look "AI-generated."** No decorative shadow stacks, no purple gradients, no glassmorphism, no emoji-as-design. A FIFA fan should land, trust it, and find what they need. This document encodes that.

## 1. Design principles

1. **Content first, chrome last.** The page is useful links and facts. Decoration never pushes content down.
2. **Flat and editorial, not "dashboard-y."** Think a well-made sports newspaper or a transit-authority site — confident type, clear sections, generous whitespace, hairline dividers. Not SaaS-landing gloss.
3. **One accent, used sparingly.** A single brand color for links/CTAs and active states. Everything else is ink, paper, and a few greys.
4. **No gratuitous shadows or gradients.** Elevation comes from **borders and spacing**, not drop shadows. At most one subtle shadow for a genuinely floating element (the Locations dropdown). Never card-shadow soup.
5. **Predictable structure.** Every city page is identical in layout. Fans learn it once.
6. **Fast over fancy.** No heavy hero videos, no parallax, no animation that blocks reading. The banner is a single optimized image with a soft treatment.
7. **Mobile is the primary canvas.** Most match-goers are on a phone at/near a stadium — thumb-reachable, legible in sunlight, light on data.

## 2. Visual language

| Token | Choice | Notes |
|-------|--------|-------|
| **Type** | One strong sans (Inter / system stack) + a slightly condensed display weight for headings | Real hierarchy, not size-soup |
| **Color — ink** | Near-black `#16181d` text on warm near-white `#fbfbf9` | Paper, not pure white |
| **Color — accent** | One brand accent (finalized with brand) for links/CTAs/active | One accent only |
| **Color — support** | 3–4 greys for borders, muted text, surfaces | |
| **Borders** | 1px hairline `#e6e6e2`; small radius (4–6px), consistent | Borders do the work shadows would |
| **Spacing** | 4px base scale; sections separated by large vertical rhythm | Whitespace is the layout tool |
| **Shadows** | None on cards. One soft shadow reserved for the dropdown only | |
| **Icons** | Lucide line icons, 1.5px stroke, for wayfinding not decoration | |
| **Banner imagery** | Real stadium/cup/team photography with a soft blur/darken so headline text reads | No AI-gradient hero |

## 3. Layout system

- 12-column grid, max content width ~1200px, comfortable 16–24px gutters.
- City sections are full-width bands separated by hairline rules + a section label — not floating cards on a busy background.
- Listings are **dense rows**, not big shadowed cards: name · phone · distance · address + map link. Scannable like a results list.

## 4. Page wireframes

### 4.1 Home ("Sports", `/`)
```
┌───────────────────────────────────────────────────────────┐
│ HEADER  SportsOnePoint   Sports  Locations▾  News  Contact │
├───────────────────────────────────────────────────────────┤
│ ░░░ BANNER ░░░  (cup in stadium, teams, soft blur)         │
│  FIFA World Cup 2026 — One Point.                          │
│  [ Browse host cities ]   [ Full schedule ↗ ]             │
├───────────────────────────────────────────────────────────┤
│  ABOUT — Find Places near your Match Location              │
│  One short paragraph on what the site does.               │
├───────────────────────────────────────────────────────────┤
│  MATCHES                              [ Full schedule ↗ ]  │
│  TODAY — June 18                                           │
│   Czechia 1–1 South Africa · Atlanta · FT                 │  ← compact rows
│   Switzerland 4–1 Bosnia    · Los Angeles · FT            │     (city links)
│  TOMORROW — June 19                                        │
│   USA vs Australia          · Seattle · 18:00             │
├───────────────────────────────────────────────────────────┤
│  EXPERIENCE FIFA WORLD CUP 2026                            │
│  [Restaurants] [Hotels] [Transportation]                  │  ← 5 boxes
│  [Tickets]     [Match Screening Zone]                     │     → /locations
├───────────────────────────────────────────────────────────┤
│  NEWS   2–3 recent-match items (plain cards)   [More →]   │
├───────────────────────────────────────────────────────────┤
│  FAQ    accordion of common questions                     │
├───────────────────────────────────────────────────────────┤
│  FOOTER  cities · news · contact · official-sources note  │
└───────────────────────────────────────────────────────────┘
```

### 4.2 Locations (`/locations`)
```
┌───────────────────────────────────────────────────────────┐
│ ░░░ BANNER ░░░                                            │
│  Host Cities — pick yours.                                 │
├───────────────────────────────────────────────────────────┤
│  USA                                                       │
│  ┌ Atlanta ───┐ ┌ Boston ───┐ ┌ Dallas ───┐ ┌ Houston ─┐ │  ← city cards
│  │ Mercedes…  │ │ Gillette  │ │ AT&T      │ │ NRG      │ │     name + stadium
│  │ View city →│ │ View city→│ │ View city→│ │View city→│ │   + short guide line
│  └────────────┘ └───────────┘ └───────────┘ └──────────┘ │
│  ...  (11 USA)                                             │
│  CANADA   Toronto · Vancouver                             │
│  MEXICO   Mexico City · Guadalajara · Monterrey          │
└───────────────────────────────────────────────────────────┘
```

### 4.3 City page (Dallas example)
```
┌───────────────────────────────────────────────────────────┐
│ ░░░ BANNER ░░░   Dallas · AT&T Stadium                     │
│  Getting there: DART rail + match-day shuttle              │
│  ◦ Restaurants ◦ Hotels ◦ Transport ◦ Tickets ◦ Watch     │ ← sticky anchor chips
├───────────────────────────────────────────────────────────┤
│  RESTAURANTS                                               │
│   Within 1 mile                                            │
│    The Steakhouse                                          │
│    (214) 555-0100 · 0.6 mi from stadium                   │  ← listing rows
│    123 Main St, Arlington TX        [Map ↗] [Website ↗]   │
│   Within 2 miles · Within 5 miles · Within 10 miles       │
├───────────────────────────────────────────────────────────┤
│  HOTELS          Within 5 miles · Within 10 miles         │
├───────────────────────────────────────────────────────────┤
│  TRANSPORTATION  Shared Ride · Metro · Parking            │
│                  Getting there ↗ (guide + description)     │
├───────────────────────────────────────────────────────────┤
│  TICKETS         Official FIFA tickets ↗                   │
│                  Buy only from official sources.         │
├───────────────────────────────────────────────────────────┤
│  MATCH SCREENING ZONE                                      │
│                  Fan Festival · Public viewing · Events    │
├───────────────────────────────────────────────────────────┤
│  Related cities  ·  Full schedule ↗                        │
└───────────────────────────────────────────────────────────┘
```

### 4.4 Listing row (the unit of the city page)
```
┌─────────────────────────────────────────────────────────────┐
│  Name of place                                              │
│  Phone · 1.2 mi from stadium · $$ · Steakhouse             │
│  123 Main St, Arlington TX           [ Map ↗ ]  [ Site ↗ ] │
└─────────────────────────────────────────────────────────────┘
```
- No shadow. Hairline separator between rows. Hover = subtle background tint only.
- Distance bands are simple labeled sub-headings (1 / 2 / 5 / 10 mi), entries listed under each.

### 4.5 News (`/news`)
- Simple list: title, date, 1–2 line summary, "Read at FIFA ↗". Plain bordered cards, no shadow.

### 4.6 Contact (`/contact`)
- Banner + one line of copy. Single-column form (Name, Email, City dropdown, Message), labels above fields, clear success state. No marketing fluff.

## 5. Components (shadcn/ui, restyled flat)

Use shadcn/ui primitives but **strip default shadows, reduce radii, apply our tokens**. Core set:
`Header/Nav` + `DropdownMenu` (Locations), `Tabs`/anchor chips (city sections), `Card` (flattened, for city/news), listing `rows`, `Badge` (distance/price/category), `Accordion` (FAQ), `Form` inputs, `Sheet` (mobile nav), `Breadcrumb`, `Alert` (official-sources notice).

## 6. Responsive behavior

| Breakpoint | Behavior |
|-----------|----------|
| **< 640 (mobile)** | Single column. Header collapses to logo + menu (Sheet). City anchor chips become a horizontal scroll bar. Listing rows stack. Category boxes 1–2 per row. |
| **640–1024 (tablet)** | City cards 2–3 per row; listings two columns where space allows. |
| **> 1024 (desktop)** | Full grid; city header can show map + info side by side. |

## 7. Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`); one `h1` per page; ordered headings.
- Contrast ≥ 4.5:1; never color-only meaning (icon + text).
- Full keyboard operability; visible focus; skip-to-content link.
- Alt text on banner/city imagery; outbound links announce "opens in new tab".
- Respect `prefers-reduced-motion`.

## 8. Performance budget

- Static export — pages are pre-rendered HTML, near-zero JS to read content.
- City page critical path < 100KB CSS/HTML; banners via `next/image` (responsive, lazy, modern formats).
- Targets: **LCP < 2.0s, CLS < 0.05, INP < 200ms.**
