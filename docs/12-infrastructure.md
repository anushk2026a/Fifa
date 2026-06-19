# 12 — Infrastructure & Operations (Phase 1: Static Site)

Very little to operate: a prerendered Next.js site on Vercel, plus one small Express service for the contact form. Near-zero ops.

## 1. Deployment

```
   GitHub repo ──┬──push──▶ Vercel  (frontend/, root dir = "frontend")
                 │            │  next build → prerendered pages
                 │            ▼
                 │     Vercel (Next.js runtime + global edge, TLS, domain)
                 │            │
                 │            ▼
                 │         Browser ──POST /api/contact──┐
                 │                                       ▼
                 └──push──▶ Render / Railway  (backend/, root dir = "backend")
                              npm run build → npm start (Express)
                              └─ Nodemailer ──SMTP──▶ email to team
```

**Frontend (Vercel)**
- **Root Directory = `frontend`** (the repo root has `frontend/`, `backend/`, `docs/`; Vercel must be pointed at the app, or it won't detect Next.js).
- **Build:** `next build` (default). Vercel runs Next.js natively.
- **Env:** `NEXT_PUBLIC_API_URL` = the backend URL.
- **Domain:** `www.sportsonepoint.com` via Vercel DNS / CNAME. TLS automatic.
- **Preview deploys:** every PR gets a URL; merge to `main` → production.

**Backend (Render / Railway)**
- **Root Directory = `backend`.** Build `npm install && npm run build`, start `npm start`.
- **Env:** `SMTP_*`, `MAIL_FROM`, `CONTACT_TO`, and `CORS_ORIGIN` = the Vercel domain(s).
- A single small always-on instance is plenty (the free/Hobby tier suffices).

No database, Nginx, Docker, or container orchestration in Phase 1.

## 2. Local development

```bash
# Frontend
cd frontend && npm install && npm run dev   # http://localhost:3000

# Backend (separate terminal)
cd backend && cp .env.example .env && npm install && npm run dev   # http://localhost:4000
```
- Node 18+, npm.
- The contact form needs both running; set `NEXT_PUBLIC_API_URL=http://localhost:4000`.
- Editing site content = editing `frontend/src/data/*.ts`.

## 3. Caching

- **The CDN caches the static files.** Pages are immutable per deploy (fingerprinted assets); a new deploy publishes fresh HTML.
- Match-day traffic is trivially handled — these are static files on a global edge. No app servers to scale.

## 4. Monitoring & logging

Kept minimal and sufficient:
- **Vercel dashboard** — build logs, deploy status, basic traffic/analytics.
- **Vercel Web Analytics** (or Plausible) — page views and Web Vitals.
- **Uptime ping** (UptimeRobot/BetterStack) on the home page — optional.
- **Form service dashboard** — submissions and delivery status.
- **Errors:** optional Sentry browser SDK for client-side errors. Not essential for a static site.

No Prometheus/Grafana/OTel/PagerDuty — the only backend is the tiny contact service, watched via Render's built-in logs/metrics.

## 5. Security & privacy

- **TLS everywhere** (Vercel).
- **No backend = tiny attack surface.** No database to inject, no auth to breach, no secrets on a server (Phase 1 has no API keys — links are public URLs).
- **Contact form / backend:** the Express service validates input (Zod), rate-limits submissions, and uses a honeypot field; CORS is restricted to the site origin. SMTP credentials live in the host's env (never committed). Only PII is what the fan types, sent straight to email — nothing is stored.
- **Security headers** via `next.config` (CSP, X-Content-Type-Options, Referrer-Policy, frame-ancestors).
- **Dependencies:** `npm audit` / Dependabot; pinned lockfile.
- **Privacy:** a short privacy note; cookie banner only if analytics requires it (Plausible is cookieless).

## 6. CI/CD

Lightweight — GitHub Actions for checks, Vercel for deploys.
```
on PR:
  npm ci → typecheck → lint → build (next build / export)
  → Vercel preview deploy (automatic)

on merge to main:
  Vercel auto-deploys to production
```
- Gates: typecheck, lint, successful static build. Optional Lighthouse budget check on the preview URL.
- **Rollback:** Vercel keeps previous deploys — one-click rollback.

## 7. Cost

- **Vercel Hobby:** \$0 for this size; Pro (~\$20/mo) only if limits are hit.
- **Form service:** free tier covers low volume.
- **Analytics:** Vercel Analytics or Plausible (cheap/free).
- **Domain:** ~\$10–15/yr.
- **No DB, no API, no compute bills.** Effectively the cost of a domain + maybe Vercel Pro.

## 8. Phase 2+ (future) infrastructure

When the CMS/API arrive, add: the Express API on Render/Railway, MongoDB Atlas, a media store (Cloudinary/S3), and transactional email (Resend/SES). The static web app stays on Vercel and simply starts fetching live data. Details in [05 §7](./05-architecture.md#7-phase-2-future--the-dynamic-platform) and docs 06–10.
