import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import { EmptyState } from "../components/empty-state";

const WEEK_SIZE = 7;

type ProgressRow = {
  totalDelta: number;
  easyDelta: number;
  mediumDelta: number;
  hardDelta: number;
  xpEarned: number;
  streakAfter: number;
};

function summarizeWeek(progresses: ProgressRow[]) {
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

function getStreakChange(progresses: ProgressRow[]) {
  if (progresses.length < 2) return 0;
  const latest = progresses[0].streakAfter;
  const oldest = progresses[progresses.length - 1].streakAfter;
  return latest - oldest;
}

export default async function WeeklyProgressPage() {
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
      <div className="mx-auto max-w-7xl px-8 py-12">
        <h1 className="mt-1.5 mb-8 text-3xl font-bold tracking-tight text-white">Weekly progress</h1>
        <EmptyState
          icon="🎉"
          title="No party yet"
          description="Join or create a party to track and compare weekly progress with your coding buddies."
          action={{ label: "Manage Parties", href: "/party" }}
        />
      </div>
    );
  }

  const party = membership.party;

  const rows = party.memberships.map((member) => {
    const progresses = member.user.progresses as ProgressRow[];
    const recent = progresses.slice(0, WEEK_SIZE);
    const previous = progresses.slice(WEEK_SIZE, WEEK_SIZE * 2);
    const recentSummary = summarizeWeek(recent);
    const previousSummary = summarizeWeek(previous);

    const delta = recentSummary.total - previousSummary.total;
    let trend: "Improving" | "Stable" | "Declining" = "Stable";
    if (delta >= 2) trend = "Improving";
    if (delta <= -2) trend = "Declining";

    return {
      id: member.userId,
      handle: member.user.handle,
      totals: recentSummary,
      trend,
      streakChange: getStreakChange(recent),
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <header className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Party</div>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-white">{party.name} — Weekly progress</h1>
        </div>
        <div className="text-sm text-zinc-400">Last 7 days</div>
      </header>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-zinc-800 bg-zinc-950 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Username</th>
              <th className="border-b border-zinc-800 bg-zinc-950 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Problems solved</th>
              <th className="border-b border-zinc-800 bg-zinc-950 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Difficulty</th>
              <th className="border-b border-zinc-800 bg-zinc-950 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">XP gained</th>
              <th className="border-b border-zinc-800 bg-zinc-950 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Streak change</th>
              <th className="border-b border-zinc-800 bg-zinc-950 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="group transition-colors hover:bg-zinc-800/50">
                <td className="border-b border-zinc-800 px-5 py-5 text-zinc-300 last:border-b-0">{row.handle}</td>
                <td className="border-b border-zinc-800 px-5 py-5 font-mono text-zinc-300 last:border-b-0">{row.totals.total}</td>
                <td className="flex gap-3 border-b border-zinc-800 px-5 py-5 font-mono text-zinc-300 last:border-b-0">
                  <span>
                    E <span className="font-mono font-semibold text-emerald-500">{row.totals.easy}</span>
                  </span>
                  <span>
                    M <span className="font-mono font-semibold text-amber-500">{row.totals.medium}</span>
                  </span>
                  <span>
                    H <span className="font-mono font-semibold text-red-500">{row.totals.hard}</span>
                  </span>
                </td>
                <td className="border-b border-zinc-800 px-5 py-5 font-mono text-zinc-300 last:border-b-0">{row.totals.xp}</td>
                <td className="border-b border-zinc-800 px-5 py-5 font-mono text-zinc-300 last:border-b-0">{row.streakChange >= 0 ? `+${row.streakChange}` : row.streakChange}</td>
                <td className="border-b border-zinc-800 px-5 py-5 text-zinc-300 last:border-b-0">
                  <span
                    className={
                      row.trend === "Improving"
                        ? "font-semibold text-emerald-500"
                        : row.trend === "Declining"
                        ? "font-semibold text-red-500"
                        : "font-medium text-zinc-500"
                    }
                  >
                    {row.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
