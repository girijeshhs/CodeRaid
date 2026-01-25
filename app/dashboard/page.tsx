import { format, differenceInDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { recommendationEngine } from "@/lib/recommendation-engine";
import { requireUserId } from "@/lib/session";
import { simulateSnapshotAction } from "../actions";
import { partyAggregator } from "@/lib/party-aggregator";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  const userId = await requireUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      snapshots: { orderBy: { takenFor: "desc" }, take: 1 },
      progresses: { orderBy: { day: "desc" }, take: 7 },
      memberships: {
        include: {
          party: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const latestSnapshot = user.snapshots[0];
  const recs = recommendationEngine.build(user.progresses, latestSnapshot);
  const totals = latestSnapshot
    ? {
        easy: latestSnapshot.easy,
        medium: latestSnapshot.medium,
        hard: latestSnapshot.hard,
        total: latestSnapshot.total,
      }
    : { easy: 0, medium: 0, hard: 0, total: 0 };

  const latestDelta = user.progresses[0];
  const streakStatus = latestDelta
    ? latestDelta.totalDelta > 0
      ? "Continue"
      : "Broken"
    : "Reset";

  const daysSince = latestDelta ? differenceInDays(new Date(), latestDelta.day) : null;
  const partyAggregate = partyAggregator.summarize(
    user.memberships.map((member) => ({
      userId: member.userId,
      displayName: member.party.name,
      deltas: user.progresses,
      xp: user.xp,
    }))
  );

  return (
    <div className={styles.wrapper}>
      {/* Header with username and inline stats badges */}
      <div className={styles.header}>
        <div className={styles.username}>{user.handle}</div>
        <div className={styles.stats}>
          <div className={styles.statBadge}>
            🔥 Streak <span className="mono">{user.streakCount}</span>
          </div>
          <div className={styles.statBadge}>
            XP <span className="mono">{user.xp}</span>
          </div>
          <div className={styles.statBadge}>
            Level <span className="mono">{user.level}</span>
          </div>
        </div>
      </div>

      {/* Main 2-column grid */}
      <div className={styles.mainGrid}>
        {/* Left column: Solved Problems + Recent Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Solved Problems</div>
            <div className={styles.progressList}>
              <div className={styles.progressRow}>
                <div className={styles.diffLabel} style={{ color: "var(--easy)" }}>Easy</div>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${styles.barEasy}`}
                    style={{ width: totals.total ? `${(totals.easy / totals.total) * 100}%` : "0%" }}
                  />
                </div>
                <div className="mono">{totals.easy}</div>
              </div>
              <div className={styles.progressRow}>
                <div className={styles.diffLabel} style={{ color: "var(--medium)" }}>Medium</div>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${styles.barMedium}`}
                    style={{ width: totals.total ? `${(totals.medium / totals.total) * 100}%` : "0%" }}
                  />
                </div>
                <div className="mono">{totals.medium}</div>
              </div>
              <div className={styles.progressRow}>
                <div className={styles.diffLabel} style={{ color: "var(--hard)" }}>Hard</div>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${styles.barHard}`}
                    style={{ width: totals.total ? `${(totals.hard / totals.total) * 100}%` : "0%" }}
                  />
                </div>
                <div className="mono">{totals.hard}</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Recent Activity</div>
            {user.progresses.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>No history.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Solved</th>
                    <th>Easy</th>
                    <th>Med</th>
                    <th>Hard</th>
                    <th>XP</th>
                    <th>Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {user.progresses.map((p) => (
                    <tr key={p.id}>
                      <td>{format(p.day, "MMM d")}</td>
                      <td className="mono">+{p.totalDelta}</td>
                      <td className="mono" style={{ color: "var(--easy)" }}>{p.easyDelta}</td>
                      <td className="mono" style={{ color: "var(--medium)" }}>{p.mediumDelta}</td>
                      <td className="mono" style={{ color: "var(--hard)" }}>{p.hardDelta}</td>
                      <td className="mono">{p.xpEarned}</td>
                      <td className="mono">{p.streakAfter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right column: Today + Streak + Party + Recommendations */}
        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Today & Streak</div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Solved today</span>
              <span className={styles.statValue}>
                {latestDelta ? (
                  <>
                    <span className="mono">+{latestDelta.totalDelta}</span>{" "}
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      ({latestDelta.easyDelta}E / {latestDelta.mediumDelta}M / {latestDelta.hardDelta}H)
                    </span>
                  </>
                ) : (
                  <span style={{ color: "var(--text-secondary)" }}>0</span>
                )}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Streak status</span>
              <span className={`${styles.statValue} ${latestDelta?.totalDelta ? styles.streakActive : styles.streakBroken}`}>
                {streakStatus} {daysSince !== null ? `(${daysSince}d)` : ""}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Party Progress</div>
            {user.memberships.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>No parties joined</div>
            ) : (
              <div className={styles.compactList}>
                <div>Members: <span className="mono">{partyAggregate.members}</span></div>
                <div>Active: <span className="mono">{partyAggregate.activeMembers}</span></div>
                <div>Weekly solved: <span className="mono">{partyAggregate.totalSolved}</span></div>
              </div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Recommendations</div>
            {recs.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>No suggestions yet</div>
            ) : (
              <div className={styles.compactList}>
                {recs.map((rec) => (
                  <div key={rec.title}>{rec.title}</div>
                ))}
              </div>
            )}
          </div>

          <form action={simulateSnapshotAction}>
            <button type="submit" className={styles.actionButton}>
              Fetch Latest
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
