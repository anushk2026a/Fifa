# 06 — Modular Monolith: Module Catalog (Express / MongoDB)

> ⚠ **PHASE 2+ (FUTURE) — NOT part of the current static build.**
> The site we build now ([Phase 1](./README.md)) is a static Next.js site with hardcoded content and **no backend**. This document is the target backend design for *later*, when we add a CMS and live data. Keep it as reference; do not build it yet.

Each module is an **Express feature module** = one bounded context, living in its own folder (`apps/api/src/modules/<name>`). It owns its Mongoose model(s), service, router, and validation (Zod). It communicates with other modules **only** through the exported service interface — never by importing another module's Mongoose model.

A typical module folder:
```
modules/city/
  city.model.ts        Mongoose schema + model
  city.repository.ts   query functions (the only place that touches the model)
  city.service.ts      use-cases, triggers revalidation     ← public surface
  city.router.ts       Express routes + Zod validation + auth middleware
  city.dto.ts          request/response shapes (Zod) + mappers
  city.test.ts
  index.ts             barrel: exports service + types only
```

**No event bus.** Side effects happen via **direct service calls**. The common one is cache freshness: after a content write, the service calls `revalidationService.revalidate(path)` which tells Next.js to regenerate that page. Simple and traceable.

Legend: **R**esponsibilities · **API** (selected endpoints) · **Collections** · **Services** · **DTOs** · **Side effects** (what a write triggers)

---

## Catalog / Core

### City Module
- **R:** Canonical host-city data; aggregate root linking stadium, POIs, transport, tickets, fan zones; publish/unpublish; SEO fields.
- **API:** `GET /api/cities`, `GET /api/cities/:slug`, `GET /api/cities/:slug/full` (page payload), `GET /api/cities/region/:region`; admin `POST/PATCH/DELETE /api/admin/cities`.
- **Collections:** `cities` (embeds `stadium` summary, `seo`, `transport` groups, `ticketLinks`; references POIs/fan-zones/blogs by id).
- **Services:** `cityService` (CRUD, publish), `cityPageAssembler` (composes the full city payload from other modules' read services).
- **DTOs:** `CityDto`, `CitySummaryDto`, `CityFullPageDto`, `CreateCityDto`, `UpdateCityDto`.
- **Side effects:** on publish/update → revalidate `/cities/:slug` and (if region changed) `/locations`; reindex search.

### Stadium Module
- **R:** Stadium metadata, GeoJSON location, capacity, IANA timezone, official/sponsor name (editable), matches-hosted count.
- **API:** `GET /api/stadiums/:id`; admin CRUD `/api/admin/stadiums`.
- **Collections:** `stadiums` (referenced by city; a thin summary denormalized into `cities` for fast reads).
- **Services:** `stadiumService`. Exposes `getGeoPoint(cityId)` used by POI refresh (distance bands).
- **DTOs:** `StadiumDto`, `CreateStadiumDto`, `UpdateStadiumDto`.
- **Side effects:** on geo change → `poiRefreshService.rebandCity(cityId)` (recompute POI distances/bands) → revalidate city.

### Match Module (Schedule)
- **R:** Match fixtures (teams, datetime UTC + venue tz, status, score), today/tomorrow computation, link to official FIFA fixtures.
- **API:** `GET /api/matches/today`, `GET /api/matches/tomorrow`, `GET /api/matches?city=&date=`, `GET /api/matches/upcoming`.
- **Collections:** `matches` (embeds `home`/`away` team snapshots), `teams`.
- **Services:** `matchService`, `scheduleService` (timezone-aware today/tomorrow), `scheduleSyncService` (cron job; pulls/updates fixtures).
- **DTOs:** `MatchDto`, `MatchDayDto`.
- **Side effects:** on sync/status change → revalidate `/` (home today/tomorrow).

---

## Places (admin-curated + cached)

### Restaurant Module
- **R:** Curated restaurant POIs per city, banded by distance (5mi / 10mi) from the stadium; sourced from Places API by a scheduled/admin-triggered job, **stored in MongoDB**, then editor-curated (feature, hide, reorder).
- **API:** `GET /api/cities/:slug/restaurants?band=5|10`; admin `/api/admin/restaurants` (list, curate, trigger refresh).
- **Collections:** `pois` (shared, `type:'restaurant'`, embeds curation flags + GeoJSON `location` + `distanceMiles` + `band`).
- **Services:** `restaurantService`, `poiRefreshService` (calls Places client, upserts by `externalId`), `poiRankingService` (sort by distance/rating, dedupe).
- **DTOs:** `RestaurantDto`, `PoiListDto`, `CuratePoiDto`.
- **Side effects:** on refresh/curation → revalidate `/cities/:slug`.

### Hotel Module
- Same shape as Restaurant Module, `type:'hotel'`. Shares the `pois` collection and the `poiRefreshService` / `poiRankingService` pipeline (one Places pipeline, two POI types).
- **API:** `GET /api/cities/:slug/hotels?band=5|10`; admin `/api/admin/hotels`.

> Restaurants & Hotels are the same domain mechanism (a curated, cached POI list near a stadium) with a `type` discriminator — built once, configured twice. See [09 — Integrations](./09-integrations.md).

---

## Mobility

### Transportation Module
- **R:** Curated transport links/notes per city across five fixed categories: **Shared Ride, Metro/Transit, Parking, Airport Access, Stadium Access**. Pure editor-managed link+note content (no external API).
- **API:** `GET /api/cities/:slug/transportation`; admin `PUT /api/admin/cities/:id/transportation`.
- **Collections:** embedded in `cities.transport[]` — `{category, title, description, url, provider, order, isActive}`.
- **Services:** `transportationService`.
- **DTOs:** `TransportOptionDto`, `TransportGroupedDto`, `Create/UpdateTransportDto`.
- **Side effects:** on edit → revalidate `/cities/:slug`.

---

## Engagement

### Ticket Module
- **R:** Official FIFA ticket links + approved hospitality links per city; an "official sources only" disclaimer flag.
- **API:** `GET /api/cities/:slug/tickets`; admin `PUT /api/admin/cities/:id/tickets`.
- **Collections:** embedded `cities.ticketLinks[]` — `{label, url, sourceType:'official'|'hospitality', isActive, order}`.
- **Services:** `ticketService`.
- **DTOs:** `TicketLinkDto`, `Create/UpdateTicketDto`.
- **Side effects:** on edit → revalidate `/cities/:slug`.

### FanZone Module (Match Screening Zones)
- **R:** FIFA Fan Festival, public viewing areas, local fan events per city — name, GeoJSON location, dates/hours, official link, category.
- **API:** `GET /api/cities/:slug/fan-zones`; admin `/api/admin/fan-zones`.
- **Collections:** `fan_zones` — `{cityId, name, category:'fan_festival'|'public_viewing'|'local_event', address, location(GeoJSON), startDate, endDate, hours, url, isActive}`.
- **Services:** `fanZoneService`.
- **DTOs:** `FanZoneDto`, `Create/UpdateFanZoneDto`.
- **Side effects:** on edit → revalidate `/cities/:slug`.

### Blog Module
- **R:** Articles with rich content, categories/tags, author, cover image, status (draft/published/scheduled), SEO, related-city links, slug + redirects.
- **API:** `GET /api/blogs`, `GET /api/blogs/:slug`, `GET /api/blogs/category/:slug`; admin CRUD `/api/admin/blogs`.
- **Collections:** `blog_posts` (embeds `seo`, `categorySlugs[]`, `relatedCityIds[]`, content blocks), `blog_categories`, `redirects`.
- **Services:** `blogService`, `blogPublishService` (scheduling via cron check).
- **DTOs:** `BlogPostDto`, `BlogSummaryDto`, `Create/UpdateBlogDto`.
- **Side effects:** on publish → revalidate `/blogs`, `/blogs/:slug`, related city pages; reindex search; ping sitemap.

### Contact Module
- **R:** Contact form intake; inquiry typing (fan/business/press/partnership); spam protection; team notification; CMS inbox.
- **API:** `POST /api/contact` (public, rate-limited + honeypot/captcha); admin `GET /api/admin/contacts`, `PATCH /api/admin/contacts/:id` (status).
- **Collections:** `contact_submissions` — `{name, email, type, cityId?, subject, message, status, createdAt, meta}`.
- **Services:** `contactService`, `notificationService` (email via Resend/SES, called directly).
- **DTOs:** `CreateContactDto`, `ContactSubmissionDto`.
- **Side effects:** on submit → send notification email.

---

## Platform

### Auth Module
- **R:** Authenticate & authorize **admin/CMS users only** (public site is open). JWT access + refresh tokens (httpOnly cookies), roles (admin, editor), argon2/bcrypt password hashing, optional 2FA (V2), audit of admin logins.
- **API:** `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/refresh`, `GET /api/auth/me`.
- **Collections:** `admin_users`, `admin_sessions` (refresh-token records in Mongo — no Redis), `audit_logs`.
- **Services:** `authService`, `rbacService`, `passwordService`.
- **DTOs:** `LoginDto`, `SessionDto`, `AdminUserDto`.
- **Side effects:** on login/admin action → write `audit_logs`.
- **Cross-cutting:** provides `requireAuth` and `requireRole(...)` Express middleware used by all `/api/admin/*` routes.

### CMS Module
- **R:** Orchestration layer for editorial workflows — a façade exposing admin operations across City/Stadium/POI/Transport/Ticket/FanZone/Blog plus **Featured/Home content** and **SEO** management. Holds little domain logic itself; coordinates other modules' admin services + media.
- **API:** `/api/admin/featured`, `/api/admin/seo`, `/api/admin/dashboard` (counts, recent activity).
- **Collections:** `featured_content`, `seo_overrides`.
- **Services:** `featuredContentService`, `seoService`, `mediaService` (uploads), `revalidationService` (calls Next.js revalidate endpoint).
- **DTOs:** `FeaturedItemDto`, `SeoMetaDto`, `MediaAssetDto`.
- **Side effects:** on featured/SEO change → revalidate affected paths.

### Search Module
- **R:** Cross-entity search (cities, city sections, blog posts) using **MongoDB Atlas Search** (or a `$text` index for MVP); ranked, typed results.
- **API:** `GET /api/search?q=&type=`.
- **Collections:** Atlas Search index on `cities` / `blog_posts` (or a denormalized `search_index` collection refreshed on content writes).
- **Services:** `searchService`, `searchIndexer` (called by city/blog services after publish).
- **DTOs:** `SearchResultDto`.

### Analytics Module
- **R:** Capture privacy-respecting usage signals (page views, outbound clicks to official links, search terms) for product/SEO insight + CMS dashboards. No PII; aggregate.
- **API:** `POST /api/events` (beacon, batched), admin `GET /api/admin/analytics/*`.
- **Collections:** `analytics_events` (Mongo time-series collection).
- **Services:** `analyticsService`, `outboundClickTracker`.
- **DTOs:** `TrackEventDto`, `AnalyticsSummaryDto`.

> MVP can instead lean on a hosted analytics tool (e.g., Vercel Analytics / Plausible) and add this module only for custom outbound-click insights.

### Media Module (supporting, part of CMS context)
- **R:** Image upload/storage (Cloudinary or S3), responsive variants, alt text. Used by City, Stadium, Blog, Featured. (Public images are served via `next/image`.)
- **API:** admin `POST /api/admin/media`, `GET /api/admin/media`.
- **Collections:** `media_assets` — `{provider, url, publicId, width, height, alt, ownerType, ownerId}`.
- **Services:** `mediaService`.

---

## Module dependency rules

```
City ──┬─ reads → Stadium (geo, capacity)
       ├─ reads → Restaurant/Hotel (POI lists)        via exported service fns
       ├─ reads → Transportation, Ticket, FanZone      only — never their models
       └─ assembles CityFullPageDto

Restaurant/Hotel ── re-banded when Stadium geo changes (direct call)
Match  ── independent; Home reads Match + City summaries
Blog   ── references City (related links) by id/slug only
Search ── indexed by City/Blog services after publish (direct call)
Auth   ── guards all /api/admin/*
CMS    ── façade over admin services of the above + revalidationService
```

- **No module imports another module's Mongoose model.** Cross-module data crosses via DTOs from exported services.
- **Shared kernel:** common value-object sub-schemas (`GeoPoint`, `Slug`, `SeoMeta`, `DistanceBand`), error types, the `revalidationService`, and Zod base schemas live in a small `shared/` folder — intentionally minimal.
