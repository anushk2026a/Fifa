# 08 — API Specification (Express REST)

> ⚠ **PHASE 2+ (FUTURE) — NOT part of the current static build.**
> Phase 1 makes **no API calls of our own** — pages read from local `data/` files at build time. This REST API is for *later*, when a CMS and live data replace the hardcoded content. Until then, treat this as the contract we're designing toward.

All endpoints are served by the Express modular monolith under `/api`. JSON in/out, UTF-8. Public read endpoints are cacheable; `/api/admin/*` requires auth.

## 1. Conventions

- **Base URL:** `https://api.sportsonepoint.com` (prod, the Express app on Render/Railway) — the Next.js web app calls it server-side; the browser mostly hits cached Next.js pages, not the API directly.
- **Versioning:** path-prefixed → `/api/v1/...` (omitted below for brevity; v1 implied).
- **Auth:** admin routes require a valid access token (httpOnly cookie or `Authorization: Bearer`). Public routes are open.
- **Validation:** every request validated with Zod; failures return `422`.
- **IDs:** Mongo `ObjectId` as 24-char hex strings.
- **Time:** ISO-8601 UTC.
- **Caching:** public GETs return `Cache-Control` + `ETag`; the real page cache lives in Next.js (ISR + `revalidateTag`/`revalidatePath`), not a separate Redis/CDN layer we operate.

### Standard response envelope
```jsonc
// success
{ "data": <payload>, "meta": { /* pagination, timing */ } }
// error
{ "error": { "code": "NOT_FOUND", "message": "City not found", "details": [] } }
```

### Error codes
| HTTP | code | when |
|------|------|------|
| 400 | `BAD_REQUEST` | malformed request |
| 401 | `UNAUTHORIZED` | missing/invalid token (admin) |
| 403 | `FORBIDDEN` | role lacks permission |
| 404 | `NOT_FOUND` | resource/slug missing |
| 409 | `CONFLICT` | duplicate slug/externalId |
| 422 | `VALIDATION_ERROR` | Zod validation failed (`details[]`) |
| 429 | `RATE_LIMITED` | rate limit exceeded |
| 500 | `INTERNAL` | unexpected |
| 503 | `UPSTREAM_UNAVAILABLE` | external API down (still serves cache) |

### Pagination
Query: `?page=1&limit=20` (or cursor `?cursor=...&limit=20` for large lists).
`meta`: `{ "page":1, "limit":20, "total":134, "totalPages":7 }`.

## 2. Public endpoints

### Cities
```
GET /api/cities
    → list published cities (summary). Optional ?region=West|Central|East&country=USA
    200 { data: CitySummary[] }

GET /api/cities/region/:region
    → cities grouped/filtered by region.

GET /api/cities/:slug
    → single city core (header, stadium summary, seo).
    200 { data: City }   404 if not found/unpublished

GET /api/cities/:slug/full
    → full city page payload (assembled): city + restaurants(5/10) + hotels(5/10)
      + transport(grouped) + tickets + fanZones. One call powers the whole page.
    200 { data: CityFullPage }
```

`CitySummary`
```jsonc
{ "slug":"dallas","name":"Dallas","country":"USA","region":"Central",
  "stadium":{"name":"AT&T Stadium","matchesHosted":9},"heroUrl":"https://cdn/..." }
```

`CityFullPage` (shape)
```jsonc
{
  "city": { /* City core + stadium summary + gettingThereSummary + seo */ },
  "restaurants": { "5mi": Poi[], "10mi": Poi[] },
  "hotels":      { "5mi": Poi[], "10mi": Poi[] },
  "transportation": {
    "shared_ride": TransportOption[], "metro": [...], "parking": [...],
    "airport": [...], "stadium": [...]
  },
  "tickets": TicketLink[],
  "fanZones": { "fan_festival": FanZone[], "public_viewing": [...], "local_event": [...] }
}
```

### City sections (granular — used for lazy loading / "show more")
```
GET /api/cities/:slug/restaurants?band=5|10&sort=distance|rating&limit=20&page=1
GET /api/cities/:slug/hotels?band=5|10&sort=distance|rating&limit=20&page=1
GET /api/cities/:slug/transportation        → grouped by the 5 categories
GET /api/cities/:slug/tickets
GET /api/cities/:slug/fan-zones              → grouped by category
```

`Poi`
```jsonc
{ "id":"...", "type":"restaurant", "name":"The Steakhouse",
  "rating":4.5, "reviewCount":1203, "priceLevel":2, "distanceMiles":1.2, "band":"5mi",
  "address":"123 Main St...", "categories":["steakhouse"],
  "website":"https://...", "mapsUrl":"https://maps.google.com/?q=...", "photoUrl":"https://cdn/..." ,
  "isFeatured":false }
```

### Matches / schedule
```
GET /api/matches/today        → MatchDay (in caller's tz; ?tz=America/Chicago)
GET /api/matches/tomorrow
GET /api/matches?city=dallas&date=2026-06-18
GET /api/matches/upcoming?limit=10
```
`MatchDay`
```jsonc
{ "date":"2026-06-18",
  "matches":[
    { "id":"...","status":"finished","kickoffUtc":"2026-06-18T18:00:00Z","venueTimezone":"America/New_York",
      "city":{"slug":"atlanta","name":"Atlanta"},"stadium":"Mercedes-Benz Stadium",
      "home":{"name":"Czechia","code":"CZE","score":1},"away":{"name":"South Africa","code":"RSA","score":1} }
  ],
  "fullScheduleUrl":"https://www.fifa.com/.../scores-fixtures" }
```

### Blogs
```
GET /api/blogs?page=1&limit=12&category=getting-around
GET /api/blogs/:slug                     → full post (+ relatedCities, relatedPosts)
GET /api/blogs/category/:slug
GET /api/blog-categories
```

### Search
```
GET /api/search?q=toronto+hotels&type=all|city|blog&limit=10
    → { data: { cities:[...], sections:[...], blogs:[...] } }
```

### Contact (public, rate-limited)
```
POST /api/contact
  body: { name, email, type:"fan|business|press|partnership", cityId?, subject?, message, hp? /*honeypot*/, captchaToken? }
  201 { data: { id, status:"new" } }
  429 if rate-limited
```

### Analytics beacon
```
POST /api/events
  body: { events: [ { type, path, target?, ts } ] }   // batched, fire-and-forget
  202 (accepted)
```

### SEO support
```
GET /sitemap.xml          (served by web tier; data from API)
GET /robots.txt
```

## 3. Admin endpoints (auth required)

### Auth
```
POST /api/auth/login      { email, password } → sets httpOnly cookies, { user }
POST /api/auth/refresh    → new access token
POST /api/auth/logout
GET  /api/auth/me         → current admin user
```

### CRUD (role: editor/admin) — consistent shape across resources
```
# Cities
GET    /api/admin/cities
POST   /api/admin/cities
GET    /api/admin/cities/:id
PATCH  /api/admin/cities/:id
DELETE /api/admin/cities/:id
POST   /api/admin/cities/:id/publish
POST   /api/admin/cities/:id/unpublish

# Stadiums
GET/POST/PATCH/DELETE  /api/admin/stadiums[...]

# POIs (restaurants & hotels share this; ?type=restaurant|hotel)
GET    /api/admin/pois?cityId=&type=&band=
PATCH  /api/admin/pois/:id            // curation: isFeatured, isHidden, manualOrder, editorNote
POST   /api/admin/pois/refresh        // { cityId, type } → enqueue Places refresh job
GET    /api/admin/jobs/:id            // refresh job status

# Transportation / Tickets (embedded in city; edited via city sub-resources)
PUT    /api/admin/cities/:id/transportation   // replace grouped set
PUT    /api/admin/cities/:id/tickets

# Fan zones
GET/POST/PATCH/DELETE  /api/admin/fan-zones[...]

# Blogs
GET/POST/PATCH/DELETE  /api/admin/blogs[...]
POST   /api/admin/blogs/:id/publish      // immediate or { scheduledFor }
GET    /api/admin/blog-categories ...

# Matches (mostly synced; manual override allowed)
GET/PATCH /api/admin/matches[...]
POST   /api/admin/matches/sync           // trigger schedule sync job

# Contacts
GET    /api/admin/contacts?status=&type=&page=
PATCH  /api/admin/contacts/:id           // { status }

# CMS extras
GET/PUT  /api/admin/featured
GET/PUT  /api/admin/seo                   // path overrides
GET      /api/admin/dashboard             // counts, recent activity
POST     /api/admin/media                 // multipart upload → Cloudinary/S3
GET      /api/admin/analytics/summary
GET      /api/admin/audit-logs
```

## 4. Caching & invalidation

Caching lives in **Next.js**, not in a separate layer on the API. Each public page fetches the API in a server component and caches the result with a **tag**; when an editor changes content, the API calls Next.js on-demand revalidation for that tag/path.

| Next.js page | Fetch tag | Strategy | Revalidated when |
|--------------|-----------|----------|------------------|
| `/cities/[slug]` | `city:{slug}` | ISR, revalidate on demand | city/POI/transport/ticket/fan-zone edit |
| `/` (home) | `schedule` | ISR `revalidate: 60` | schedule sync / status change |
| `/blogs`, `/blogs/[slug]` | `blog:{slug}` | ISR, revalidate on demand | blog publish/update |
| `/locations`, `/cities` | `cities` | ISR, revalidate on demand | city publish |
| `/search` | (dynamic) | server-rendered, no cache | — |

The API exposes the data; the **web app owns the cache**. The only short-TTL endpoint is the schedule (`revalidate: 60`) so live scores stay fresh without manual revalidation.

## 5. Cross-cutting middleware (Express)

Applied in order: `requestId` → `helmet` (security headers) → `cors` → `compression` → `rateLimit` (`express-rate-limit`, in-memory store — single instance is fine for MVP) → `bodyParser` → route `zodValidate` → (`requireAuth`/`requireRole` for admin) → handler → `responseEnvelope` → `errorHandler` (maps domain errors → codes above).

## 6. Contracts package

All request/response shapes are defined once as **Zod schemas** in `packages/contracts` and imported by both the Express API (runtime validation) and the React app (typed fetch + inference). One source of truth, no drift.
