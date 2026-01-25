import { differenceInDays } from "date-fns";
import { PartyAggregate, PartyMemberProgress } from "./types";

export const partyAggregator = {
  summarize(members: PartyMemberProgress[]): PartyAggregate {
    const now = new Date();
    const totals = members.reduce(
      (acc, member) => {
        const recentSolved = member.deltas.reduce((sum, delta) => sum + delta.totalDelta, 0);
        const active = member.deltas.some((delta) => differenceInDays(now, delta.day) <= 3 && delta.totalDelta > 0);
        acc.totalSolved += recentSolved;
        acc.totalXp += member.xp;
        acc.activeMembers += active ? 1 : 0;
        return acc;
      },
      { members: members.length, totalSolved: 0, totalXp: 0, activeMembers: 0 }
    );
    return totals;
  },
};
