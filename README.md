# CodeRaid

CodeRaid tracks public LeetCode progress with daily snapshots, turns deltas into XP/streaks, and lets parties compare momentum.

## What This App Does
- Captures daily snapshot stats for each user (per difficulty + topics JSON).
- Computes derived progress (deltas, XP, streak outcome).
- Supports parties (private groups) for comparisons.
- Provides basic flows: onboarding, dashboard, parties, settings.

## Tech Stack
- Next.js (App Router)
- Prisma
- Postgres (recommended via Supabase)

## Quick Start
```bash
npm install
cp .env.example .env   # add DATABASE_URL
npx prisma migrate dev --name init
npm run dev
```

## Environment Variables
- `DATABASE_URL`: Postgres connection string.

## Scripts
- `npm run dev` – start Next.js dev server.
- `npm run build` – production build.
- `npm start` – serve production build.
- `npm run lint` – run ESLint.
- `npx prisma studio` – inspect DB (requires `DATABASE_URL`).

## Data Model (Prisma)
- `User`: handle, XP, level, streak.
- `LeetCodeSnapshot`: daily counts per difficulty + optional topic JSON.
- `DerivedProgress`: computed deltas + XP/streak outcome per day.
- `Party` + `PartyMembership`: private groups with invite codes.

## Project Structure (High Level)
- `app/` – Next.js routes and UI.
- `lib/` – services, data logic, utilities.
- `prisma/` – schema and migrations.
- `public/` – static assets.

## In-Flight Pieces
- Manual resync API currently records synthetic snapshots.
- Services: snapshot manager, diffing, XP/streak engine, recommendation heuristics, party aggregator.
- UI: onboarding on `/`, dashboard on `/dashboard`, parties on `/party`, settings on `/settings`.

## Potential Improvements (Roadmap Ideas)
- Replace synthetic profile fetcher with real public-only LeetCode fetcher (rate-limited + cached).
- Add authentication (magic link or OAuth) and durable sessions.
- Add scheduled daily snapshot cron and background job processing.
- Surface party aggregates over time with charts and trendlines.
- Add user privacy controls for public/private profile visibility.
- Improve onboarding with handle validation and profile previews.
- Add notifications for streak milestones and party leader changes.
- Add skill/topic recommendations based on weak areas.
- Add export of progress history (CSV/JSON).
- Improve error states and empty-state UX.
- Add mobile-first layout improvements and accessibility audits.
- Add tests for snapshot diffing and XP/streak logic.
- Add observability (logging, metrics, alerting for cron failures).
- Add admin tools for resyncs and handle changes.

## Notes
This project expects a reachable Postgres instance for Prisma migrations and runtime.
