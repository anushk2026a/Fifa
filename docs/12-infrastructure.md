# 12 — Infrastructure & Operations (Phase 1: Static Site)

There is almost nothing to operate. A static Next.js export on a CDN, plus a form service. That's the point — ship value with near-zero ops.

## 1. Deployment

```
   GitHub repo ──push──▶ Vercel
                          │  next build (output: 'export')
                          │  → static HTML/CSS/JS
                          ▼
                   Vercel CDN (global edge, TLS, custom domain)
                          │
                          ▼
                       Browser
                          │ form POST
                          ▼
              Formspree / Web3Forms ──▶ email to team
```

- **Host:** Vercel (free/Hobby tier is enough; Pro if needed). Could also be Netlify, Cloudflare Pages, or GitHub Pages — it's just static files.
- **Build:** `next build` with `output: 'export'` → `frontend/out/`.
- **Domain:** `www.sportsonepoint.com` via Vercel DNS / a CNAME.
- **TLS:** automatic (Vercel).
- **Preview deploys:** every PR gets a unique preview URL; merge to `main` → production.

No servers, containers, database, Nginx, Docker, or cloud infra to manage in Phase 1.

## 2. Local development

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
npm run build        # static export → frontend/out/
```
- Node 18+, npm.
- No services to run locally (no DB/Redis). Editing content = editing `src/data/*.ts`.

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

No Prometheus/Grafana/OTel/PagerDuty — there's no backend to observe.

## 5. Security & privacy

- **TLS everywhere** (Vercel).
- **No backend = tiny attack surface.** No database to inject, no auth to breach, no secrets on a server (Phase 1 has no API keys — links are public URLs).
- **Contact form:** the form service handles spam (honeypot/captcha options); we add a honeypot field and rely on the provider's filtering. Only PII collected is what the fan types into the form, sent straight to email — we store nothing ourselves.
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
