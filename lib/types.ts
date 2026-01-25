export type TopicStat = {
  slug: string;
  solved: number;
  total?: number;
};

export type SnapshotStats = {
  takenFor: Date;
  total: number;
  easy: number;
  medium: number;
  hard: number;
  topics?: TopicStat[];
  contests?: Record<string, unknown>;
};

export type ProfileSnapshot = {
  handle: string;
  stats: SnapshotStats;
};

export type ProgressDelta = {
  day: Date;
  totalDelta: number;
  easyDelta: number;
  mediumDelta: number;
  hardDelta: number;
};

export type StreakComputation = {
  xpEarned: number;
  streakAfter: number;
};

export type Recommendation = {
  title: string;
  reason: string;
  focus: "difficulty" | "topic" | "consistency";
};

export type PartyMemberProgress = {
  userId: string;
  displayName: string;
  deltas: ProgressDelta[];
  xp: number;
};

export type PartyAggregate = {
  members: number;
  totalSolved: number;
  totalXp: number;
  activeMembers: number;
};
