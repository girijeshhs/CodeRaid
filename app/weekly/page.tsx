import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import styles from "./weekly.module.css";
import { redirect } from "next/navigation";

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
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Weekly progress</h1>
        <p className={styles.subtle}>Join a party to compare weekly progress.</p>
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
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <div className={styles.partyLabel}>Party</div>
          <h1 className={styles.title}>{party.name} — Weekly progress</h1>
        </div>
        <div className={styles.subtle}>Last 7 days</div>
      </header>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Problems solved</th>
              <th>Difficulty</th>
              <th>XP gained</th>
              <th>Streak change</th>
              <th>Signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.handle}</td>
                <td className="mono">{row.totals.total}</td>
                <td className={styles.diffCol}>
                  <span>
                    E <span className="mono" style={{ color: "var(--easy)" }}>{row.totals.easy}</span>
                  </span>
                  <span>
                    M <span className="mono" style={{ color: "var(--medium)" }}>{row.totals.medium}</span>
                  </span>
                  <span>
                    H <span className="mono" style={{ color: "var(--hard)" }}>{row.totals.hard}</span>
                  </span>
                </td>
                <td className="mono">{row.totals.xp}</td>
                <td className="mono">{row.streakChange >= 0 ? `+${row.streakChange}` : row.streakChange}</td>
                <td>
                  <span
                    className={
                      row.trend === "Improving"
                        ? styles.improving
                        : row.trend === "Declining"
                        ? styles.declining
                        : styles.stable
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
