# SportsOnePoint.com

> **Your single point of reference for FIFA World Cup 2026.**
> FIFA-related information, resources, and links in one place — for fans, enthusiasts, travelers, local communities, and businesses across all 16 host cities.

🌐 **Domain:** [www.sportsonepoint.com](https://www.sportsonepoint.com)
📁 **Docs:** [`/docs`](./docs/README.md)

---

## What is this?

A FIFA World Cup 2026 **information directory**. A fan arrives and quickly answers three questions:

1. **Which match & when?** — today's / tomorrow's matches + full FIFA schedule link
2. **Where is it?** — the host city and its stadium
3. **What's around it?** — restaurants (1 / 2 / 5 / 10 mi), hotels (5 / 10 mi), transport, tickets, and screening zones near each stadium

Most of the site is **curated links and content**. The only dynamic piece is **Contact Us**, which emails the team via SMTP so fans can ask which stadium hosts their match or how to get there.

---

## Architecture

A simple two-app setup (see [`/docs`](./docs/README.md)):

| App | Stack | Hosts | Role |
|-----|-------|-------|------|
| **`frontend/`** | Next.js 15 (App Router), TypeScript, Tailwind, shadcn/ui | Vercel | The whole public site (prerendered) |
| **`backend/`** | Express + TypeScript (**modular monolith**), Nodemailer (SMTP) | Render / Railway | The Contact feature (emails submissions) |

- **Frontend** is **feature-wise**: `components/{home,city,news,contact,common}`, content in `src/data`, helpers in `src/lib`.
- **Backend** is a **modular monolith**: feature modules under `src/modules/<feature>` (currently `contact`, `health`), shared code in `src/shared`.
- No database, Redis, queues, or Docker. Content lives in `frontend/src/data`.

> See [`CLAUDE.md`](./CLAUDE.md) for the repo working agreement.

---

## Build Status — Phase 1

| Layer | Status | Notes |
|-------|--------|-------|
| Menu / Nav | ✅ | Sports · Locations (dropdown, 16 cities) · News · Contact + mobile menu + footer |
| Home (Sports) | ✅ | Banner, about, today/tomorrow matches, category boxes, news, FAQ |
| Locations | ✅ | All 16 cities as photo cards, grouped by country |
| City Pages (×16) | ✅ | Photo banner + 5 sections, curated restaurants/hotels/transport/tickets/screening |
| News | ✅ | Static match items |
| Contact | ✅ | Form → backend → **SMTP email** |
| Backend (Contact) | ✅ | Express modular monolith, Nodemailer |
| SEO | ✅ | Per-page metadata + JSON-LD, sitemap.xml, robots.txt, custom 404 |

---

## Pages

| Route | Page |
|-------|------|
| `/` | Home (Sports) |
| `/locations` | All 16 cities |
| `/cities/[slug]` | Individual city page |
| `/news` | News |
| `/contact` | Contact Us |

### 16 Host Cities

**USA** — Atlanta · Boston · Dallas · Houston · Kansas City · Los Angeles · Miami · New York/New Jersey · Philadelphia · San Francisco Bay Area · Seattle
**Canada** — Toronto · Vancouver
**Mexico** — Mexico City · Guadalajara · Monterrey

---

## Getting Started

Prerequisites: **Node.js 18+** and **npm**.

### Frontend (the website)

```bash
cd frontend
cp .env.local.example .env.local      # set NEXT_PUBLIC_API_URL to the backend URL
npm install
npm run dev                           # http://localhost:3000
npm run build                         # production build (Vercel runs Next.js natively)
```

### Backend (the contact API)

```bash
cd backend
cp .env.example .env                  # set SMTP_* and CONTACT_TO (Gmail App Password works)
npm install
npm run dev                           # http://localhost:4000  (GET /health to check)
npm run build && npm start            # production
```

The contact form needs **both** running locally: the frontend posts to `NEXT_PUBLIC_API_URL` → `POST /api/contact` → SMTP email.

---

## Deployment
## 🚀 Setup & Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/Fifa.git
   cd Fifa/frontend
   npm install
   ```

2. **Environment Variables**
   Copy `.env.local.example` to `.env.local` and add your SMTP credentials (e.g. Gmail App Password) for the contact form to work locally.

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## 🌍 Deployment

### Vercel (Frontend & Serverless API)
The entire project is built to deploy on Vercel natively.
1. Import the `frontend` folder into a new Vercel project.
2. In Vercel Project Settings → Environment Variables, add:
   - `SMTP_HOST` (e.g. `smtp.gmail.com`)
   - `SMTP_PORT` (e.g. `587`)
   - `SMTP_SECURE` (`false`)
   - `SMTP_USER` (your email)
   - `SMTP_PASS` (your app password)
   - `MAIL_FROM`
   - `CONTACT_TO`
3. Deploy!

> **Secrets:** keep SMTP credentials in `frontend/.env.local` (git-ignored) locally and in the host's env settings in production. Never commit them. Gmail uses an **App Password**, not your account password.

---

## Project Structure

```
/
├── CLAUDE.md           # repo working agreement
├── docs/               # design & architecture docs (read docs/README.md first)
├── frontend/           # Next.js 15 app (static export)
│   ├── src/app/        # routes: /, /locations, /cities/[slug], /news, /contact
│   ├── src/components/  # feature-wise: home, city, news, contact, layout, common
│   ├── src/data/       # all content (cities, matches, news, faq)
│   ├── src/lib/        # helpers (schedule, seo, utils)
│   └── public/images/cities/   # 16 city banner images
├── backend/            # Express modular monolith (Contact via SMTP)
│   └── src/
│       ├── modules/    # contact, health
│       ├── shared/     # mailer, middleware, validation
│       └── config/     # env
└── README.md
```

---

## Key Principles

1. **Static-first.** A fast site with almost no backend; add complexity only when needed.
2. **Links, not heavy APIs.** Curated outbound links; the fan clicks out to official sources.
3. **One predictable city-page layout** — learn it once, know every city.
4. **Content-first design** — clean & legible.
5. **Modular monolith (backend) + feature-wise (frontend)** so the codebase grows cleanly.
