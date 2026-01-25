import { prisma } from "./prisma";
import { log } from "./logger";
import { SnapshotStats } from "./types";
import { progressDiffer } from "./progress-differ";
import { xpStreakEngine } from "./xp-streak-engine";

export const snapshotManager = {
  async recordSnapshot(userId: string, snapshot: SnapshotStats) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error(`User ${userId} not found`);

    const previousSnapshot = await prisma.leetCodeSnapshot.findFirst({
      where: { userId, takenFor: { lt: snapshot.takenFor } },
      orderBy: { takenFor: "desc" },
    });

    const savedSnapshot = await prisma.leetCodeSnapshot.upsert({
      where: {
        userId_takenFor: {
          userId,
          takenFor: snapshot.takenFor,
        },
      },
      update: {
        total: snapshot.total,
        easy: snapshot.easy,
        medium: snapshot.medium,
        hard: snapshot.hard,
        topics: snapshot.topics,
        contests: snapshot.contests,
      },
      create: {
        userId,
        takenFor: snapshot.takenFor,
        total: snapshot.total,
        easy: snapshot.easy,
        medium: snapshot.medium,
        hard: snapshot.hard,
        topics: snapshot.topics,
        contests: snapshot.contests,
      },
    });

    const delta = progressDiffer.diff(snapshot, previousSnapshot ?? undefined);
    const { xpEarned, streakAfter } = xpStreakEngine.compute(delta, user.streakCount);

    await prisma.$transaction([
      prisma.derivedProgress.upsert({
        where: {
          userId_day: {
            userId,
            day: delta.day,
          },
        },
        update: {
          totalDelta: delta.totalDelta,
          easyDelta: delta.easyDelta,
          mediumDelta: delta.mediumDelta,
          hardDelta: delta.hardDelta,
          xpEarned,
          streakAfter,
          snapshotId: savedSnapshot.id,
        },
        create: {
          userId,
          snapshotId: savedSnapshot.id,
          day: delta.day,
          totalDelta: delta.totalDelta,
          easyDelta: delta.easyDelta,
          mediumDelta: delta.mediumDelta,
          hardDelta: delta.hardDelta,
          xpEarned,
          streakAfter,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: xpEarned },
          streakCount: streakAfter,
          lastSnapshotAt: snapshot.takenFor,
        },
      }),
    ]);

    log.info("snapshotManager", `Snapshot recorded for ${user.handle}`);

    return { snapshot: savedSnapshot, delta, xpEarned, streakAfter };
  },
};
