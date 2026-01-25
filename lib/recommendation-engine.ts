import { differenceInDays } from "date-fns";
import { ProgressDelta, Recommendation, SnapshotStats, TopicStat } from "./types";

const windowDays = 30;

export const recommendationEngine = {
  build(
    deltas: ProgressDelta[],
    latestSnapshot?: SnapshotStats
  ): Recommendation[] {
    const recs: Recommendation[] = [];
    const recent = deltas
      .slice()
      .sort((a, b) => b.day.getTime() - a.day.getTime())
      .filter((delta) => differenceInDays(new Date(), delta.day) <= windowDays);

    const difficultyRec = pickDifficulty(recentsTotals(recent));
    if (difficultyRec) recs.push(difficultyRec);

    const inactivityRec = pickInactivity(recent);
    if (inactivityRec) recs.push(inactivityRec);

    const topicRec = pickTopicWeakness(latestSnapshot?.topics);
    if (topicRec) recs.push(topicRec);

    return recs.slice(0, 3);
  },
};

const recentsTotals = (deltas: ProgressDelta[]) => {
  return deltas.reduce(
    (acc, curr) => {
      acc.easy += curr.easyDelta;
      acc.medium += curr.mediumDelta;
      acc.hard += curr.hardDelta;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 }
  );
};

const pickDifficulty = (totals: { easy: number; medium: number; hard: number }): Recommendation | null => {
  const entries = [
    { key: "Easy", value: totals.easy },
    { key: "Medium", value: totals.medium },
    { key: "Hard", value: totals.hard },
  ];
  const weakest = entries.reduce((min, curr) => (curr.value < min.value ? curr : min), entries[0]);
  if (weakest.value === 0) {
    return {
      title: `Start with a quick ${weakest.key}`,
      reason: `${weakest.key} bucket has no solves in the last ${windowDays} days.`,
      focus: "difficulty",
    };
  }
  if (weakest.value < entries.find((e) => e.key !== weakest.key)?.value ?? 0) {
    return {
      title: `${weakest.key} is the lowest bucket`,
      reason: `${weakest.key} solves trail the others; do one or two to balance.`,
      focus: "difficulty",
    };
  }
  return null;
};

const pickInactivity = (recent: ProgressDelta[]): Recommendation | null => {
  const lastDelta = recent[0];
  if (!lastDelta) {
    return {
      title: "No activity yet",
      reason: "Take one easy solve to seed your streak and unlock XP.",
      focus: "consistency",
    };
  }
  const daysSince = differenceInDays(new Date(), lastDelta.day);
  if (daysSince >= 3) {
    return {
      title: "Streak rescue",
      reason: `It has been ${daysSince} days since your last solve. Ship one easy problem to restart streaks.`,
      focus: "consistency",
    };
  }
  return null;
};

const pickTopicWeakness = (topics?: TopicStat[]): Recommendation | null => {
  if (!topics || topics.length === 0) return null;
  const sorted = topics
    .filter((topic) => topic.total && topic.total > 0)
    .map((topic) => ({
      slug: topic.slug,
      ratio: topic.solved / (topic.total ?? topic.solved || 1),
    }))
    .sort((a, b) => a.ratio - b.ratio);

  const weakest = sorted[0];
  if (!weakest) return null;
  return {
    title: `Reinforce ${weakest.slug}`,
    reason: `${weakest.slug} has the lowest completion share in your recent data. Practice 1-2 here.`,
    focus: "topic",
  };
};
