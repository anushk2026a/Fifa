# 07 — Database Design (MongoDB + Mongoose)

> ⚠ **PHASE 2+ (FUTURE) — NOT part of the current static build.**
> Phase 1 has **no database**; content lives in local `data/` files in the Next.js app. This MongoDB design is for _later_. The document shapes here intentionally mirror the Phase 1 data files, so migrating from hardcoded data to MongoDB is a swap, not a rewrite.

MongoDB is a document database, so the design is about **collections, document shape, and embed-vs-reference decisions** — not normalized tables and joins. We model around how the app reads: the **city page is the hottest read**, so the city document is shaped to serve most of that page in one or two queries.

## 1. Embed vs reference — the rule we follow

| Embed (store inside the parent document) when… | Reference (separate collection + id) when…   |
| ---------------------------------------------- | -------------------------------------------- |
| Data is small, bounded, owned by the parent    | Data is large or unbounded (grows over time) |
| Always read together with the parent           | Queried/listed on its own                    |
| Changes with the parent                        | Has its own lifecycle / many writers         |

Applied here:

- **Embedded in `cities`:** stadium summary, SEO block, the 5 transport categories, ticket links. (Small, bounded, read with the page.)
- **Separate collections referenced by `cityId`:** `pois` (restaurants/hotels — many, refreshed by a scheduled job), `fan_zones`, `matches`, `blog_posts`. (Large or independently queried.)
- `stadiums` is kept as a thin separate collection (referenced) so geo queries and the POI refresh job have a clean target, with a denormalized summary copied into the city doc for fast reads.

## 2. Collections

### `cities` (aggregate root)

```jsonc
{
  "_id": ObjectId,
  "slug": "dallas",                  // unique, indexed
  "name": "Dallas",
  "country": "USA",                  // USA | Canada | Mexico
  "region": "Central",               // West | Central | East
  "timezone": "America/Chicago",
  "status": "published",             // draft | published
  "stadiumId": ObjectId,             // ref → stadiums
  "stadium": {                       // denormalized summary for fast reads
    "name": "AT&T Stadium",
    "capacity": 80000,
    "matchesHosted": 9,
    "location": { "type": "Point", "coordinates": [-97.0945, 32.7473] }
  },
  "gettingThereSummary": "DART rail + match-day shuttle to the stadium.",
  "transport": [                     // embedded — the 5 fixed categories
    { "category": "shared_ride", "title": "Uber / Lyft pickup zones",
      "description": "...", "url": "https://...", "provider": "Uber", "order": 1, "isActive": true },
    { "category": "metro",   "title": "DART rail", "url": "https://...", "order": 2, "isActive": true },
    { "category": "parking", "title": "Pre-book via JustPark", "url": "https://...", "order": 3, "isActive": true },
    { "category": "airport", "title": "DFW & Love Field access", "url": "https://...", "order": 4, "isActive": true },
    { "category": "stadium", "title": "Stadium access & gates", "url": "https://...", "order": 5, "isActive": true }
  ],
  "ticketLinks": [                   // embedded
    { "label": "Official FIFA tickets", "url": "https://...", "sourceType": "official", "order": 1, "isActive": true }
  ],
  "officialSourcesNotice": true,
  "heroMediaId": ObjectId,           // ref → media_assets
  "seo": {                           // embedded value object
    "title": "Dallas — FIFA World Cup 2026 Guide | SportsOnePoint",
    "description": "...",
    "ogImageId": ObjectId,
    "canonical": "https://SportsOnePoint.com/cities/dallas"
  },
  "createdAt": ISODate, "updatedAt": ISODate
}
```

### `stadiums`

```jsonc
{
  "_id": ObjectId,
  "cityId": ObjectId,                // ref → cities (1:1)
  "name": "AT&T Stadium",
  "officialName": "AT&T Stadium",    // editable (sponsor names change)
  "capacity": 80000,
  "matchesHosted": 9,
  "address": "1 AT&T Way, Arlington, TX 76011",
  "location": { "type": "Point", "coordinates": [-97.0945, 32.7473] }, // GeoJSON [lng,lat]
  "timezone": "America/Chicago",
  "createdAt": ISODate, "updatedAt": ISODate
}
```

### `pois` (restaurants + hotels — curated + cached)

```jsonc
{
  "_id": ObjectId,
  "cityId": ObjectId,                // ref → cities
  "type": "restaurant",              // restaurant | hotel
  "externalId": "google:ChIJ...",    // unique per source — upsert key
  "source": "google_places",
  "name": "The Steakhouse",
  "address": "123 Main St, Arlington, TX",
  "location": { "type": "Point", "coordinates": [-97.10, 32.74] },
  "distanceMiles": 1.2,              // precomputed from stadium
  "band": "5mi",                     // 5mi | 10mi (derived from distance)
  "rating": 4.5, "reviewCount": 1203, "priceLevel": 2,
  "categories": ["steakhouse"],
  "phone": "+1...", "website": "https://...",
  "photoRef": "https://cdn/.../photo.jpg",
  "curation": {                      // editor overrides
    "isFeatured": false, "isHidden": false, "manualOrder": null, "editorNote": null
  },
  "lastRefreshedAt": ISODate,
  "createdAt": ISODate, "updatedAt": ISODate
}
```

### `fan_zones`

```jsonc
{
  "_id": ObjectId, "cityId": ObjectId,
  "name": "Dallas FIFA Fan Festival",
  "category": "fan_festival",        // fan_festival | public_viewing | local_event
  "address": "...", "location": { "type": "Point", "coordinates": [ ... ] },
  "startDate": ISODate, "endDate": ISODate, "hours": "11:00–23:00 daily",
  "url": "https://...", "description": "...", "isActive": true,
  "createdAt": ISODate, "updatedAt": ISODate
}
```

### `matches` & `teams`

```jsonc
// matches
{
  "_id": ObjectId,
  "externalId": "fifa:match:48",
  "stage": "group",                  // group | r32 | r16 | qf | sf | final ...
  "cityId": ObjectId, "stadiumId": ObjectId,
  "kickoffUtc": ISODate, "venueTimezone": "America/Chicago",
  "status": "finished",              // scheduled | live | finished
  "home": { "teamId": ObjectId, "name": "Czechia", "code": "CZE", "score": 1 },
  "away": { "teamId": ObjectId, "name": "South Africa", "code": "RSA", "score": 1 },
  "createdAt": ISODate, "updatedAt": ISODate
}
// teams
{ "_id": ObjectId, "name": "Czechia", "code": "CZE", "flagUrl": "https://...", "confederation": "UEFA" }
```

### `blog_posts`, `blog_categories`, `redirects`

```jsonc
// blog_posts
{
  "_id": ObjectId, "slug": "getting-around-dallas-world-cup",  // unique
  "title": "Getting Around Dallas for the World Cup",
  "excerpt": "...", "coverMediaId": ObjectId,
  "content": [ /* ordered content blocks: paragraph, image, heading, callout, embed */ ],
  "author": { "name": "Editorial Team", "avatarUrl": "..." },
  "categorySlugs": ["getting-around"],
  "relatedCityIds": [ ObjectId ],
  "status": "published",             // draft | scheduled | published
  "publishedAt": ISODate, "scheduledFor": ISODate,
  "readTimeMinutes": 6,
  "seo": { "title": "...", "description": "...", "ogImageId": ObjectId, "canonical": "..." },
  "createdAt": ISODate, "updatedAt": ISODate
}
// blog_categories
{ "_id": ObjectId, "slug": "getting-around", "name": "Getting Around", "order": 3 }
// redirects (slug changes)
{ "_id": ObjectId, "from": "/blogs/old-slug", "to": "/blogs/new-slug", "code": 301 }
```

### Platform collections

```jsonc
// admin_users
{ "_id": ObjectId, "email": "editor@...", "passwordHash": "...", "role": "editor", // admin | editor
  "isActive": true, "lastLoginAt": ISODate, "createdAt": ISODate }

// admin_sessions  (refresh tokens, stored in Mongo)
{ "_id": ObjectId, "userId": ObjectId, "refreshTokenHash": "...", "userAgent": "...",
  "ip": "...", "expiresAt": ISODate, "createdAt": ISODate }

// audit_logs
{ "_id": ObjectId, "userId": ObjectId, "action": "city.update", "targetType": "city",
  "targetId": ObjectId, "diff": { ... }, "ip": "...", "at": ISODate }

// contact_submissions
{ "_id": ObjectId, "name": "...", "email": "...", "type": "business", // fan|business|press|partnership
  "cityId": ObjectId, "subject": "...", "message": "...", "status": "new", // new|read|handled|spam
  "meta": { "ip": "...", "ua": "..." }, "createdAt": ISODate }

// featured_content
{ "_id": ObjectId, "placement": "home_hero", "refType": "city", "refId": ObjectId,
  "title": "...", "order": 1, "isActive": true, "startAt": ISODate, "endAt": ISODate }

// seo_overrides
{ "_id": ObjectId, "path": "/cities/dallas", "title": "...", "description": "...", "ogImageId": ObjectId }

// media_assets
{ "_id": ObjectId, "key": "s3://.../x.jpg", "url": "https://cdn/...", "alt": "...",
  "variants": [ { "w": 400, "url": "..." }, { "w": 800, "url": "..." } ],
  "width": 1600, "height": 900, "ownerType": "blog", "ownerId": ObjectId }

// analytics_events  (time-series)
{ "_id": ObjectId, "ts": ISODate, "type": "outbound_click", "path": "/cities/dallas",
  "target": "tickets", "sessionHash": "...", "meta": { ... } }
```

## 3. Indexes

| Collection            | Index                                                                                                                                               | Why                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `cities`              | `{ slug: 1 }` unique; `{ region: 1 }`; `{ status: 1 }`                                                                                              | slug lookup, region listing                       |
| `stadiums`            | `{ cityId: 1 }`; `{ location: '2dsphere' }`                                                                                                         | geo queries for POI banding                       |
| `pois`                | `{ cityId: 1, type: 1, band: 1 }`; `{ externalId: 1 }` unique; `{ location: '2dsphere' }`; `{ cityId:1, type:1, 'curation.isHidden':1, rating:-1 }` | city section reads, upsert key, distance, ranking |
| `fan_zones`           | `{ cityId: 1, category: 1 }`; `{ location: '2dsphere' }`                                                                                            | section reads                                     |
| `matches`             | `{ kickoffUtc: 1 }`; `{ cityId: 1 }`; `{ externalId: 1 }` unique; `{ status: 1 }`                                                                   | today/tomorrow, city schedule, upsert             |
| `blog_posts`          | `{ slug: 1 }` unique; `{ status:1, publishedAt:-1 }`; `{ categorySlugs: 1 }`; Atlas Search / `$text`                                                | index list, category, search                      |
| `contact_submissions` | `{ status: 1, createdAt: -1 }`                                                                                                                      | CMS inbox                                         |
| `admin_users`         | `{ email: 1 }` unique                                                                                                                               | login                                             |
| `analytics_events`    | time-series `{ ts }` + `{ type:1, ts:-1 }`                                                                                                          | dashboards                                        |
| `redirects`           | `{ from: 1 }` unique                                                                                                                                | redirect lookup                                   |

## 4. Geo queries (5mi / 10mi bands)

POIs carry a precomputed `distanceMiles` and `band` (set by the refresh job from the stadium's coordinates), so **public reads are a simple indexed filter** (`{cityId, type, band}`) — no geo math on the hot path. The job computes distance with `$geoNear` against the stadium `location` (2dsphere) when ingesting, and re-bands when the stadium location changes.

## 5. Data integrity (without foreign keys)

MongoDB has no FK constraints, so integrity is enforced in the **service layer**:

- References (`cityId`, `stadiumId`) validated on write; orphan cleanup on city delete (cascade in `cityService`).
- **Multi-document transactions** (replica set) used where a write spans collections (e.g., publish city + write featured entry + audit log).
- Schema enforced by **Mongoose schemas + Zod** at the API edge; MongoDB JSON Schema validation enabled on critical collections as a backstop.
- `slug`/`externalId`/`email` uniqueness enforced by unique indexes.

## 6. Lifecycle & retention

- **POIs:** upserted by a scheduled job; stale entries (not seen in N refreshes) flagged, not hard-deleted, so editor curation survives.
- **Matches:** synced from schedule source; status/score updated in place.
- **Contact submissions:** retained per privacy policy; PII purge job (V2).
- **Analytics:** time-series with TTL/rollup; raw events expire, aggregates retained.
- **Audit logs:** append-only, long retention.

## 7. ERD (document relationships)

```
                 ┌──────────────┐
                 │   cities     │ (slug, region, country, status, embeds: stadium summ.,
                 │  (aggregate) │  transport[], ticketLinks[], seo)
                 └──┬───┬───┬───┘
        stadiumId   │   │   │   cityId (refs ↓)
        (1:1)       │   │   │
        ┌───────────▼┐  │   │
        │ stadiums   │  │   │
        │ (2dsphere) │  │   │
        └────────────┘  │   │
                ┌───────▼──┐ │ ┌──────────▼─┐
                │  pois    │ │ │ fan_zones  │
                │ rest/hot │ │ │            │
                └──────────┘ │ └────────────┘
                       ┌─────▼─────┐
                       │  matches  │── teams (refs in home/away)
                       └───────────┘

blog_posts ──relatedCityIds──▶ cities          blog_posts ──categorySlugs──▶ blog_categories
contact_submissions ──cityId?──▶ cities         media_assets ──ownerId──▶ (city|blog|stadium)
featured_content ──refId──▶ (city|blog)         seo_overrides ──path──▶ (route)
admin_users ──userId──▶ admin_sessions, audit_logs
```
