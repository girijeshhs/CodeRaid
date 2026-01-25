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
      <div className={styles.headerRow}>
        <div className={styles.heading}>Profile</div>
        <div className={styles.username}>{user.handle}</div>
        <div className={styles.inlineStats}>
          <span>
            Streak 🔥 <span className="mono">{user.streakCount}</span>
          </span>
          <span>
            XP <span className="mono">{user.xp}</span>
          </span>
          <span>
            Level <span className="mono">{user.level}</span>
          </span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.panel}>
          <div className={styles.sectionTitle}>Solved problems</div>
          <div className={styles.breakdown}>
            <div className={styles.breakdownRow}>
              <div style={{ color: "var(--easy)" }}>Easy</div>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barEasy}`}
                  style={{ width: totals.total ? `${(totals.easy / totals.total) * 100}%` : "0%" }}
                />
              </div>
              <div className="mono">{totals.easy}</div>
            </div>
            <div className={styles.breakdownRow}>
              <div style={{ color: "var(--medium)" }}>Medium</div>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barMedium}`}
                  style={{ width: totals.total ? `${(totals.medium / totals.total) * 100}%` : "0%" }}
                />
              </div>
              <div className="mono">{totals.medium}</div>
            </div>
            <div className={styles.breakdownRow}>
              <div style={{ color: "var(--hard)" }}>Hard</div>
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

        <div className={styles.sideStack}>
          <div>
            <div className={styles.sectionTitle}>Today</div>
            {latestDelta ? (
              <div className={styles.deltaLine}>
                <span className="mono">+{latestDelta.totalDelta}</span> solved · <span className="mono" style={{ color: "var(--easy)" }}>E {latestDelta.easyDelta}</span> / <span className="mono" style={{ color: "var(--medium)" }}>M {latestDelta.mediumDelta}</span> / <span className="mono" style={{ color: "var(--hard)" }}>H {latestDelta.hardDelta}</span>
              </div>
            ) : (
              <div className={styles.muted}>No activity today.</div>
            )}
          </div>
          <div>
            <div className={styles.sectionTitle}>Streak status</div>
            <div className={latestDelta?.totalDelta ? styles.streakOk : styles.streakWarn}>
              {streakStatus}{daysSince !== null ? ` · ${daysSince}d` : ""}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.sectionTitle}>Recent activity</div>
        {user.progresses.length === 0 ? (
          <div className={styles.muted}>No history.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Solved</th>
                <th>Easy</th>
                <th>Medium</th>
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
                  <td className="mono" style={{ color: "var(--easy)" }}>E {p.easyDelta}</td>
                  <td className="mono" style={{ color: "var(--medium)" }}>M {p.mediumDelta}</td>
                  <td className="mono" style={{ color: "var(--hard)" }}>H {p.hardDelta}</td>
                  <td className="mono">{p.xpEarned}</td>
                  <td className="mono">{p.streakAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.secondaryGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionTitle}>Party progress</div>
          {user.memberships.length === 0 ? (
            <div className={styles.muted}>No parties joined.</div>
          ) : (
            <div className={styles.muted}>
              Members <span className="mono">{partyAggregate.members}</span> · Active <span className="mono">{partyAggregate.activeMembers}</span> · Weekly solved <span className="mono">{partyAggregate.totalSolved}</span>
            </div>
          )}
        </div>
        <div className={styles.panel}>
          <div className={styles.sectionTitle}>Recommendations</div>
          {recs.length === 0 ? (
            <div className={styles.muted}>No recommendations yet.</div>
          ) : (
            <div className={styles.recommendations}>
              {recs.map((rec) => (
                <div key={rec.title}>{rec.title}</div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.actionRow}>
        <form action={simulateSnapshotAction}>
          <button type="submit" className={styles.buttonPlain}>
            Fetch latest
          </button>
        </form>
        <span className={styles.muted}>Public profile only.</span>
      </section>
    </div>
  );
}
