# CLAUDE.md — working agreement for this repo

## Git (hard rule — do not break)
- **NEVER run `git add`, `git commit`, or `git push`** (or any other git write command).
- Only **suggest** the exact git commands; the user runs them.
- The user owns every commit and push.

## Architecture
- **Backend (`backend/`): Modular Monolith.** One Express app. Organize by bounded
  context under `src/modules/<feature>` (e.g. `modules/contact`). Each module owns its
  router, service, validation and types. Modules talk only through exported services —
  never by reaching into another module's internals. Shared concerns live in `src/shared`.
- **Frontend (`frontend/`): feature-wise.** Group code by feature/domain
  (`components/home`, `components/city`, `components/contact`, `components/news`) with
  shared pieces in `components/common`, content in `src/data`, helpers in `src/lib`.

## Project
SportsOnePoint.com — a FIFA World Cup 2026 information directory.
- **Frontend:** Next.js 15 (App Router, static export) on Vercel. Content curated in
  `frontend/src/data`.
- **Backend:** a small Express service. Phase 1 scope = the **Contact** feature, which
  emails the team via **SMTP** so fans can ask which stadium / how to get to a venue.
- Full design docs are in `/docs`.

## Conventions
- TypeScript end-to-end. Validate all input with **Zod**.
- Keep it simple — add infrastructure only when there's a real need.
- Secrets via environment variables only; never commit real credentials.
