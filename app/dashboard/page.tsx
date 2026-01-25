import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { recommendationEngine } from "@/lib/recommendation-engine";
import { requireUserId } from "@/lib/session";
import { simulateSnapshotAction } from "../actions";
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

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Dashboard</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>XP</div>
          <div className={styles.metric}>{user.xp}</div>
          <div className={styles.subtext}>Level {user.level}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Streak</div>
          <div className={styles.metric}>{user.streakCount} days</div>
          <div className={styles.subtext}>Last snapshot {latestSnapshot ? format(latestSnapshot.takenFor, "MMM d") : "n/a"}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Handle</div>
          <div className={styles.metric}>{user.handle}</div>
          <div className={styles.subtext}>{user.email ?? "no email"}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Party</div>
          <div className={styles.metric}>{user.memberships.length}</div>
          <div className={styles.subtext}>Joined parties</div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Latest delta</div>
          {user.progresses[0] ? (
            <div className={styles.listItem}>
              {format(user.progresses[0].day, "MMM d")} · +{user.progresses[0].totalDelta} solved (E {user.progresses[0].easyDelta} / M {user.progresses[0].mediumDelta} / H {user.progresses[0].hardDelta}) · XP {user.progresses[0].xpEarned} · Streak {user.progresses[0].streakAfter}
            </div>
          ) : (
            <div className={styles.empty}>No progress yet. Simulate a snapshot below.</div>
          )}
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Recommendations</div>
          {recs.length === 0 ? (
            <div className={styles.empty}>No recs yet; add a snapshot.</div>
          ) : (
            <ul className={styles.list}>
              {recs.map((rec) => (
                <li key={rec.title} className={styles.listItem}>
                  <strong>{rec.title}</strong> — {rec.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Recent deltas</div>
        {user.progresses.length === 0 ? (
          <div className={styles.empty}>No history.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Solved</th>
                <th>Breakdown</th>
                <th>XP</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {user.progresses.map((p) => (
                <tr key={p.id}>
                  <td>{format(p.day, "MMM d")}</td>
                  <td>+{p.totalDelta}</td>
                  <td>
                    E {p.easyDelta} / M {p.mediumDelta} / H {p.hardDelta}
                  </td>
                  <td>{p.xpEarned}</td>
                  <td>{p.streakAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Actions</div>
        <div className={styles.actions}>
          <form action={simulateSnapshotAction}>
            <button type="submit" className={styles.primaryBtn}>
              Simulate snapshot
            </button>
          </form>
          <div className={styles.subtext}>Uses deterministic mock data; replace with real LeetCode fetch when ready.</div>
        </div>
      </div>
    </div>
  );
}
