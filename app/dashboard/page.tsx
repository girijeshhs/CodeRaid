import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import PartyOverview from "./party-overview";

const WEEK_SIZE = 7;

function summarizeWeek(progresses: { totalDelta: number; easyDelta: number; mediumDelta: number; hardDelta: number; xpEarned: number; streakAfter: number; }[]) {
  return progresses.reduce(
    (acc, item) => {
      acc.total += item.totalDelta;
      acc.easy += item.easyDelta;
      acc.medium += item.mediumDelta;
      acc.hard += item.hardDelta;
      acc.xp += item.xpEarned;
      return acc;
    },
    { total: 0, easy: 0, medium: 0, hard: 0, xp: 0 }
  );
}

function buildSignals({ total, easy, medium, hard, streakCount, entries }: { total: number; easy: number; medium: number; hard: number; streakCount: number; entries: number; }) {
  const strengths: string[] = [];
  const gaps: string[] = [];

  if (total >= 10) strengths.push("High weekly volume.");
  if (entries >= 5) strengths.push("Consistent activity across the week.");
  if (medium >= easy && medium >= hard && medium > 0) strengths.push("Strong focus on medium problems.");
  if (hard >= 2) strengths.push("Regular hard problem exposure.");

  if (total < 5) gaps.push("Limited weekly volume.");
  if (hard === 0) gaps.push("Low hard problem volume.");
  if (streakCount < 3) gaps.push("Short current streak length.");

  if (strengths.length === 0) strengths.push("Baseline activity established.");
  if (gaps.length === 0) gaps.push("No significant gaps detected this week.");

  return { strengths, gaps };
}

export default async function DashboardPage() {
  const userId = await requireUserId();

  let membership = null;
  try {
    membership = await prisma.partyMembership.findFirst({
      where: { userId },
      include: {
        party: {
          include: {
            memberships: {
              orderBy: { joinedAt: "asc" },
              include: {
                user: {
                  include: {
                    progresses: { orderBy: { day: "desc" }, take: 14 },
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch {
    redirect("/");
  }

  if (!membership) {
    return (
      <div style={{ padding: "48px 24px" }}>
        <h1 style={{ fontSize: "20px", marginBottom: "8px" }}>No party yet</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Create or join a party to see the overview.
        </p>
      </div>
    );
  }

  const party = membership.party;

  const members = party.memberships.map((member) => {
    const progresses = member.user.progresses;
    const recent = progresses.slice(0, WEEK_SIZE);
    const summary = summarizeWeek(recent);
    const signals = buildSignals({
      total: summary.total,
      easy: summary.easy,
      medium: summary.medium,
      hard: summary.hard,
      streakCount: member.user.streakCount,
      entries: recent.length,
    });

    return {
      id: member.userId,
      handle: member.user.handle,
      streakCount: member.user.streakCount,
      weeklySolved: summary.total,
      weeklyEasy: summary.easy,
      weeklyMedium: summary.medium,
      weeklyHard: summary.hard,
      strengths: signals.strengths,
      gaps: signals.gaps,
    };
  });

  return (
    <PartyOverview
      partyName={party.name}
      memberCount={party.memberships.length}
      members={members}
    />
  );
}
