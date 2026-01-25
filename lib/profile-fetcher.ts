import { ProfileSnapshot, SnapshotStats } from "./types";

const normalizeHandle = (handle: string) => handle.trim().toLowerCase();

export const profileFetcher = {
  async fetchPublicProfile(handle: string): Promise<ProfileSnapshot> {
    const sanitized = normalizeHandle(handle);
    // Placeholder public-data fetcher: deterministic synthetic stats so the app stays runnable
    // without external calls. Replace with real LeetCode scraping/GraphQL when ready.
    const today = new Date();
    const base = seedFromHandle(sanitized);
    const dayOffset = Math.floor(today.getTime() / 86_400_000) % 5;

    const total = base + 20 + dayOffset * 2;
    const easy = Math.max(0, Math.floor(total * 0.45));
    const medium = Math.max(0, Math.floor(total * 0.4));
    const hard = Math.max(0, total - easy - medium);

    const stats: SnapshotStats = {
      takenFor: today,
      total,
      easy,
      medium,
      hard,
      topics: sampleTopics(total, base),
      contests: { rating: 1500 + base * 3 },
    };

    return {
      handle: sanitized,
      stats,
    };
  },
  shapeSnapshot(payload: {
    handle: string;
    stats: SnapshotStats;
  }): ProfileSnapshot {
    return {
      handle: normalizeHandle(payload.handle),
      stats: payload.stats,
    };
  },
};

const seedFromHandle = (handle: string) => {
  return handle.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 50;
};

const sampleTopics = (total: number, seed: number) => {
  const spread = Math.max(1, Math.floor(total / 10));
  return [
    { slug: "arrays", solved: spread + (seed % 3), total: 60 },
    { slug: "graphs", solved: spread - 1, total: 40 },
    { slug: "dp", solved: Math.max(0, spread - 2), total: 50 },
  ];
};
