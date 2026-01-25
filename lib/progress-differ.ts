import { startOfDay } from "date-fns";
import { ProgressDelta, SnapshotStats } from "./types";

export const progressDiffer = {
  diff(current: SnapshotStats, previous?: SnapshotStats): ProgressDelta {
    const day = startOfDay(current.takenFor);
    const totalDelta = safeDelta(current.total, previous?.total);
    const easyDelta = safeDelta(current.easy, previous?.easy);
    const mediumDelta = safeDelta(current.medium, previous?.medium);
    const hardDelta = safeDelta(current.hard, previous?.hard);

    return {
      day,
      totalDelta,
      easyDelta,
      mediumDelta,
      hardDelta,
    };
  },
};

const safeDelta = (current: number, previous?: number) => {
  if (previous === undefined) return Math.max(current, 0);
  return Math.max(current - previous, 0);
};
