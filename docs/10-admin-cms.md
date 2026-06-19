# 10 — Admin Panel / CMS

> ⚠ **PHASE 2+ (FUTURE) — NOT part of the current static build.**
> Phase 1 has **no CMS** — editors change content by editing local `data/` files and redeploying. This CMS is the *later* upgrade so non-technical editors can manage content without touching code. Reference only for now.

The CMS is the reason links can change without a deploy. It's a custom admin panel built as a **route group inside the Next.js app** (`/admin`, client components, no SEO/ISR — auth-gated), talking to the `/api/admin/*` Express endpoints. No separate app to build or host. Roles: **admin** (full) and **editor** (content, no user management).

## 1. Goals

- A non-technical editor keeps the site current: cities, stadiums, POIs, transport links, ticket links, fan zones, blogs, SEO, featured/home content — and reads contact submissions.
- Every change is **audited** and **invalidates the right cache** so the public site updates within seconds.
- Fast, boring, reliable — the same flat, low-chrome design language as the public site.

## 2. Navigation (admin)

```
Dashboard
Cities
  └ City detail (tabs: Overview · Stadium · Restaurants · Hotels ·
                 Transportation · Tickets · Fan Zones · SEO)
Blogs            (+ Categories)
Matches / Schedule
Fan Zones        (cross-city view)
Contacts         (inbox)
Featured / Home
Media Library
SEO
Settings         (admin only: users, redirects, audit log)
```

## 3. Screens

### Dashboard
- Counts (published cities, draft cities, blogs, new contacts).
- Recent activity (from `audit_logs`).
- Quick actions: "New blog post", "Trigger POI refresh", "Sync schedule".
- Health: last POI refresh time, last schedule sync, any stale cities.

### Cities → City detail (the core workflow)
A single city is edited through tabs that map 1:1 to the public page sections:
- **Overview:** name, country, region, slug, status (draft/published), `gettingThereSummary`, hero image, publish/unpublish.
- **Stadium:** name/official name, capacity, matches hosted, address, **map pin** (drag to set `location` — drives POI distance bands; saving emits `StadiumGeoChanged`).
- **Restaurants / Hotels:** table of cached POIs with band, rating, distance. Editor actions: **feature**, **hide**, **reorder**, add note. Button: **"Refresh from Google"** → enqueues a job, shows progress. New results appear for review; curation is preserved across refreshes.
- **Transportation:** five fixed groups (Shared Ride, Metro, Parking, Airport, Stadium). Add/edit/reorder link items (title, URL, provider, note, active).
- **Tickets:** official + hospitality links; the "official sources only" notice toggle.
- **Fan Zones:** add/edit fan festival / public viewing / local events (name, category, map pin, dates, hours, URL).
- **SEO:** title, description, OG image, canonical override (defaults auto-generated — see [11](./11-seo.md)).

Saving any tab invalidates `city:{slug}` cache.

### Blogs
- List with status (draft/scheduled/published), category, date.
- Editor: title, slug (auto from title, editable → creates redirect), cover image, **block-based content editor** (paragraph, heading, image, callout, quote, embed), categories, related cities, excerpt, read-time (auto), SEO block.
- Publish now or **schedule** (`scheduledFor`); a small scheduled job (`blogPublishService`) flips status at the time and revalidates.

### Matches / Schedule
- Mostly synced; editor can **trigger sync**, manually edit a fixture (teams, kickoff, status, score) for corrections.

### Contacts (inbox)
- Filter by type (fan/business/press/partnership) and status (new/read/handled/spam).
- Detail view; mark handled; **business/partnership** items flagged as listing leads.

### Featured / Home
- Manage what appears on the home page: featured cities, featured blog posts, ordering, optional schedule window (`startAt`/`endAt`).

### Media Library
- Upload (multipart → Cloudinary/S3), see variants, set alt text, reuse across cities/blogs.

### SEO
- Per-path overrides, default templates, OG defaults, sitemap status, robots.

### Settings (admin only)
- Admin users (invite, role, deactivate), redirects manager, audit log viewer.

## 4. Editorial workflow

```
Draft → (edit across tabs) → Preview (Next.js draft/preview mode renders the real page with draft data)
      → Publish → service calls Next.js revalidate for the affected path(s)
      → public page regenerates → live in seconds
      → audit_log entry written
```
- **Preview** uses Next.js Draft Mode to render the real public page with unpublished data — no separate preview templates.
- **Revisions** (`content_versions`) let editors revert (V2: full revision history; MVP: last-saved snapshot).

## 5. CMS-side cross-cutting

- **AuthZ:** every `/api/admin/*` call passes `requireAuth` + `requireRole`. Editors can't touch Settings.
- **Validation:** same Zod contracts as the public API — bad input rejected with field-level errors surfaced in the form.
- **Optimistic UI** via TanStack Query mutations with rollback on error.
- **Audit:** every admin write records to `audit_logs` (who/what/when/diff).
- **Revalidation is automatic** — editors never think about it; each content service calls Next.js on-demand revalidation for the affected path after a successful write.

## 6. Why this maps cleanly to the architecture

The CMS is a **façade** (CMS module) over the same module services the public API uses — no parallel logic. "Manage Cities/Stadiums/Transportation/Tickets/Fan Zones/Blogs/SEO/Featured" each correspond to a module's admin service ([06 — Modules](./06-modules.md)). This is why the admin panel was cheap to build and stays consistent with the public site.
