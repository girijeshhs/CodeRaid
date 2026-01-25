import { ProfileSnapshot, SnapshotStats } from "./types";

const normalizeHandle = (handle: string) => handle.trim().toLowerCase();

export const profileFetcher = {
  async fetchPublicProfile(handle: string): Promise<ProfileSnapshot> {
    const sanitized = normalizeHandle(handle);
    // TODO: Implement LeetCode public fetch (GraphQL + safe HTML fallback) using only public data.
    // Keep rate limits conservative; cache responses; avoid credentials.
    throw new Error(`Profile fetcher not implemented yet for ${sanitized}.`);
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
