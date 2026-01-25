## CodeRaid

CodeRaid tracks public LeetCode progress with daily snapshots, converts deltas into XP/streaks, and lets parties compare momentum. Stack: Next.js (App Router) + Prisma + Postgres.

### Quick start

```bash
npm install
cp .env.example .env   # add your DATABASE_URL (use Supabase postgres URL)
npx prisma migrate dev --name init  # create tables (requires reachable DB)
npm run dev
```

### Data model (Prisma)
- User: handle, XP, level, streak.
- LeetCodeSnapshot: daily counts per difficulty plus optional topic JSON.
- DerivedProgress: computed deltas + XP/streak outcome per day.
- Party + PartyMembership: simple private groups with invite codes.

### In-flight pieces
- Manual resync API now records synthetic snapshots; swap in real LeetCode fetch later.
- Services: snapshot manager, diffing, XP/streak engine, recommendation heuristics, party aggregator.
- UI: onboarding on `/`, dashboard on `/dashboard`, parties on `/party`, settings on `/settings`.

### Scripts
- `npm run dev` – start Next.js dev server.
- `npm run build` / `npm start` – production build + serve.
- `npm run lint` – run ESLint.
- `npx prisma studio` – inspect DB (after DATABASE_URL is set).

### Next steps
- Replace synthetic profile fetcher with real public-only LeetCode fetcher (rate-limited + cached).
- Add real auth (magic link or OAuth) and migrate session cookie to durable sessions.
- Introduce cron for daily snapshots and surface party aggregates over time.
