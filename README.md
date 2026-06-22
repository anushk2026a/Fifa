# SportsOnePoint.com — FIFA One Point

> **Your single point of reference for FIFA World Cup 2026.**
> FIFA-related information, resources, and links in one place — for fans, enthusiasts, travelers, local communities, and businesses across all 16 host cities.

🌐 **Live Site:** [www.SportsOnePoint.com](https://www.SportsOnePoint.com)
📁 **Architecture Docs:** [`/docs`](./docs/README.md)

---

## What is this?

A FIFA World Cup 2026 **information directory**. A fan arrives and quickly answers three questions:

1. **Which match & when?** — today's / tomorrow's matches + full FIFA schedule link
2. **Where is it?** — the host city and its stadium
3. **What's around it?** — restaurants, hotels, transport, tickets, and fan screening zones near each stadium

Everything on the site is **curated links and content blocks**. The only dynamic piece is the **Contact Us** form, which sends emails via SMTP so fans can reach out and share their experiences.

---

## Architecture

A simple two-app monorepo:

| App             | Stack                                                          | Hosts            | Role                                           |
| --------------- | -------------------------------------------------------------- | ---------------- | ---------------------------------------------- |
| **`frontend/`** | Next.js 15 (App Router), TypeScript, Tailwind CSS              | Vercel           | The full public-facing website (prerendered)   |
| **`backend/`**  | Express + TypeScript (modular monolith), Nodemailer (SMTP), MongoDB | Render / Railway | Contact form storage, auth, news API           |

- **Frontend** is **feature-wise**: `components/{home,city,news,contact,common}`, content in `src/data`, helpers in `src/lib`.
- **Backend** is a **modular monolith**: feature modules under `src/modules/<feature>` (`contact`, `auth`, `news`, `health`), shared code in `src/shared`.

> See [`CLAUDE.md`](./CLAUDE.md) for the repo working agreement.

---

## Build Status — Phase 1

| Feature              | Status | Notes                                                                              |
| -------------------- | ------ | ---------------------------------------------------------------------------------- |
| Menu / Nav           | ✅     | Sports · Locations (dropdown, 16 cities) · News · Stories · Contact + mobile menu  |
| Home (Sports)        | ✅     | Hero banner, about, matches, experience boxes, news, FAQ, directory search         |
| Locations            | ✅     | All 16 cities as photo cards, grouped by country                                  |
| City Pages (×16)     | ✅     | Photo banner + 5 sections — restaurants, hotels, transport, tickets, screening     |
| News                 | ✅     | Static match items                                                                 |
| Stories              | ✅     | Fan experience sharing page                                                        |
| Contact / Share      | ✅     | Form → SMTP email (name, phone, city, stadium, social link, message)               |
| Backend (Contact)    | ✅     | Express modular monolith, Nodemailer, MongoDB submission storage                   |
| Backend (Auth)       | ✅     | JWT-based authentication with bcrypt password hashing                             |
| Backend (News API)   | ✅     | News module serving content to the frontend                                        |
| SEO                  | ✅     | Per-page metadata + JSON-LD, sitemap.xml, robots.txt, custom 404                  |

---

## Pages

| Route            | Page                 |
| ---------------- | -------------------- |
| `/`              | Home (Sports)        |
| `/locations`     | All 16 host cities   |
| `/cities/[slug]` | Individual city page |
| `/news`          | News                 |
| `/contact`       | Contact / Share      |
| `/stories`       | Fan Stories          |

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

### Backend (the API)

```bash
cd backend
cp .env.example .env                  # set SMTP_*, CONTACT_TO, MONGODB_URI, JWT_SECRET
npm install
npm run dev                           # http://localhost:4000  (GET /health to verify)
npm run build && npm start            # production
```

The contact form needs **both** running locally: the frontend posts to `NEXT_PUBLIC_API_URL` → `POST /contact` → SMTP email + MongoDB storage.

---

## Deployment

### Vercel (Frontend)

The frontend deploys natively on Vercel.

1. Import the `frontend` folder into a new Vercel project.
2. In **Project Settings → Environment Variables**, add:
   - `SMTP_HOST` (e.g. `smtp.gmail.com`)
   - `SMTP_PORT` (e.g. `587`)
   - `SMTP_SECURE` (`false`)
   - `SMTP_USER` (your email)
   - `SMTP_PASS` (Gmail App Password)
   - `MAIL_FROM`
   - `CONTACT_TO`
   - `NEXT_PUBLIC_API_URL` (backend URL)
3. Deploy!

### Render / Railway (Backend)

1. Import the `backend` folder.
2. Add env vars: `SMTP_*`, `CONTACT_TO`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`.
3. Set start command to `npm start` (runs `dist/server.js` after `npm run build`).

> **Secrets:** keep credentials in `.env.local` / `.env` (both git-ignored) locally. Never commit them. Gmail requires an **App Password**, not your account password.

---

## Project Structure

```
/
├── CLAUDE.md                 # repo working agreement
├── README.md                 # this file
├── docs/                     # design & architecture docs (read docs/README.md first)
├── frontend/                 # Next.js 15 app
│   ├── src/
│   │   ├── app/              # routes: /, /locations, /cities/[slug], /news, /contact, /stories
│   │   │   ├── icon.png      # custom favicon (auto-served by Next.js App Router)
│   │   │   └── api/contact/  # Next.js API route — SMTP email handler
│   │   ├── components/       # feature-wise: home, city, news, contact, layout, common
│   │   ├── data/             # all content (cities, matches, news, faq, stories)
│   │   └── lib/              # helpers (schedule, seo, utils)
│   └── public/
│       ├── banner/           # hero images (desktop + mobile)
│       └── images/cities/    # 16 city banner photos
└── backend/                  # Express modular monolith
    └── src/
        ├── modules/          # contact, auth, news, health
        ├── shared/           # middleware, error handler, mailer
        └── config/           # env validation
```

---

## Key Principles

1. **Static-first.** A fast prerendered site; complexity is added only when needed.
2. **Links, not heavy APIs.** Curated outbound links; the fan clicks out to official sources.
3. **One predictable city-page layout** — learn it once, know every city.
4. **Content-first design** — clean, legible, and premium-looking.
5. **Modular monolith (backend) + feature-wise (frontend)** so the codebase grows cleanly.
6. **Build to grow.** Page and data structures are designed so Phase 2 CMS/API changes drop in without a rewrite.
