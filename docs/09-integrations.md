# 09 — External Sources & Integrations

## Phase 1 (NOW): links only, no APIs

> The site is a **directory of curated links**. In Phase 1 we make **no API calls** — every "integration" is just an outbound URL we store in `data/` and the fan clicks.

| Need | Phase 1 approach (no API) |
|------|---------------------------|
| **Full match schedule** | Outbound link to the official FIFA fixtures page: `https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures` |
| **Today/tomorrow matches** | Entered manually in `data/matches.ts` from FIFA; the page picks the right two days by date |
| **Restaurant/hotel locations** | Each entry stores a **Google Maps link** (`https://www.google.com/maps/search/?api=1&query=<name+address>` or a `place_id` URL). The `[Map ↗]` button opens it — no Maps API, no key, free |
| **Restaurant/hotel details** | Curated by hand: name, phone, address, distance from stadium, website link |
| **Transportation** | Curated outbound links: transit authority (DART, MARTA, METRO, LA Metro, TransLink, MTA…), rideshare info, parking (e.g. JustPark), and a "Getting there" guide link |
| **Tickets** | Outbound link to **official FIFA ticketing** only; hospitality via On Location. Strong "buy only from official sources" note |
| **Match screening zones** | Curated links to FIFA Fan Festival / host-city public-viewing pages |
| **News** | 2–3 items entered manually from FIFA, each with a source link |
| **Contact form** | Posts to **Formspree / Web3Forms** (a no-backend form service) which emails the team. The only outbound POST on the site |

**Why this is fine for now:** the data doesn't change minute-to-minute, the volume is small (16 cities), and curated links are fast, free, SEO-friendly, and never break under traffic. Cost ≈ \$0 beyond hosting.

### Distance is curated, not computed
Each place stores its `distanceMiles` from the stadium (looked up once when adding it) and which band it belongs to (1 / 2 / 5 / 10 mi for restaurants; 5 / 10 for hotels). No geocoding at runtime.

---

## Phase 2+ (FUTURE): live data via APIs

> Not built now. This is what replaces hand-curation once we add a backend + CMS.

When we want listings to refresh automatically and be managed in a CMS, we add these — **server-side only**, called by scheduled jobs, results cached in MongoDB (never on the public request path):

### Google Places API (New)
- Restaurants & hotels near each stadium — name, address, geo, rating, price, website, phone, photo.
- Endpoints: Nearby Search → Place Details → Place Photo.
- **Cost** is per-request per SKU; controlled by **refreshing on a schedule**, not per visit. Photos copied to our media store; respect attribution.
- Keys server-side, restricted, in platform secrets.

### Google Maps API
- Static Maps for a stadium map image (cached once per stadium). Interactive JS map only where needed (deferred). Directions stay as free deep-links to Google/Apple Maps.

### FIFA schedule
- A scheduled job ingests fixtures/scores into the DB (official feed/data provider or editor import). The full-schedule link stays an outbound link.

### Transportation / Tickets / Fan zones
- Still curated links, but managed in the CMS instead of code. Optional GTFS transit feeds later.

### Email
- Resend / AWS SES for contact-form notifications (replacing the form service) once we have a backend.

**Migration principle:** the Phase 1 `data/` shapes mirror the Phase 2 documents, so turning on APIs swaps the *source* of the same fields — the pages don't change. See [05 §7](./05-architecture.md#7-phase-2-future--the-dynamic-platform).
