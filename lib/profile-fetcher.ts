import { ProfileSnapshot, SnapshotStats } from "./types";

const normalizeHandle = (handle: string) => handle.trim().toLowerCase();

type LeetCodeStats = {
  data?: {
    matchedUser?: {
      submitStats?: {
        acSubmissionNum?: Array<{ difficulty: string; count: number }>;
      };
      profile?: {
        ranking?: number;
        reputation?: number;
      };
    };
    userContestRanking?: {
      rating?: number;
    };
  };
  errors?: Array<{ message: string }>;
};

const GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

export const profileFetcher = {
  async fetchPublicProfile(handle: string): Promise<ProfileSnapshot> {
    const sanitized = normalizeHandle(handle);
    const body = JSON.stringify({
      query: `query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
          }
        }
        userContestRanking(username: $username) {
          rating
        }
      }`,
      variables: { username: sanitized },
    });

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`LeetCode fetch failed (${response.status})`);
    }

    const payload = (await response.json()) as LeetCodeStats;
    if (payload.errors?.length) {
      throw new Error(payload.errors.map((e) => e.message).join(", "));
    }

    const counts = payload.data?.matchedUser?.submitStats?.acSubmissionNum ?? [];
    const total = findDifficulty(counts, "All");
    const easy = findDifficulty(counts, "Easy");
    const medium = findDifficulty(counts, "Medium");
    const hard = findDifficulty(counts, "Hard");

    const stats: SnapshotStats = {
      takenFor: new Date(),
      total,
      easy,
      medium,
      hard,
      contests: {
        rating: payload.data?.userContestRanking?.rating ?? null,
        ranking: payload.data?.matchedUser?.profile?.ranking ?? null,
        reputation: payload.data?.matchedUser?.profile?.reputation ?? null,
      },
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

const findDifficulty = (
  items: Array<{ difficulty: string; count: number }>,
  difficulty: string
) => {
  return items.find((entry) => entry.difficulty === difficulty)?.count ?? 0;
};
