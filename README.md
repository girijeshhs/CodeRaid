## CodeRaid

CodeRaid tracks public LeetCode progress with daily snapshots, converts deltas into XP/streaks, and lets parties compare momentum. Stack: Next.js (App Router) + Prisma + Postgres.

### Quick start

```bash
npm install
cp .env.example .env   # add your DATABASE_URL (Postgres)
npx prisma migrate dev  # create tables
npm run dev
```

### Data model (Prisma)
- User: handle, XP, level, streak.
- LeetCodeSnapshot: daily counts per difficulty plus optional topic JSON.
- DerivedProgress: computed deltas + XP/streak outcome per day.
- Party + PartyMembership: simple private groups with invite codes.

### In-flight pieces
- Manual resync API stub at `app/api/resync/route.ts` (hooks to fetch/diff next).
- Services drafted: snapshot manager, diffing, XP/streak engine, recommendation scaffolding.
- UI: landing outlines flows, guardrails, and next steps.

### Scripts
- `npm run dev` – start Next.js dev server.
- `npm run build` / `npm start` – production build + serve.
- `npm run lint` – run ESLint.
- `npx prisma studio` – inspect DB (after DATABASE_URL is set).

### Next steps
- Wire auth (e.g., magic link) and onboarding to collect handles.
- Implement public-only LeetCode fetcher with rate limits + caching.
- Connect cron + manual resync to snapshot persistence and recommendations.
