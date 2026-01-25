import { XP_RULES } from "./config";
import { ProgressDelta, StreakComputation } from "./types";

export const xpStreakEngine = {
  compute(delta: ProgressDelta, priorStreak: number): StreakComputation {
    const solvedSomething = delta.totalDelta > 0;
    const streakAfter = solvedSomething ? priorStreak + 1 : 0;

    const baseXp =
      delta.easyDelta * XP_RULES.easy +
      delta.mediumDelta * XP_RULES.medium +
      delta.hardDelta * XP_RULES.hard;

    const streakBonus = solvedSomething && streakAfter > 1 ? XP_RULES.streakBonus : 0;

    return {
      xpEarned: baseXp + streakBonus,
      streakAfter,
    };
  },
};
