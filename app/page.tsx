import styles from "./page.module.css";
import { onboardAction } from "./actions";

const flows = [
  {
    title: "Snapshot → Delta",
    body: "Fetch public profile data server-side, persist daily snapshots, and diff to derive solved counts.",
    tags: ["Public-only", "Daily job", "Deterministic"],
  },
  {
    title: "XP + Streak",
    body: "Award XP and streak updates from daily deltas with rule-based thresholds (no hidden magic).",
    tags: ["Rules", "Auditable", "Reset on gap"],
  },
  {
    title: "Party rollups",
    body: "Aggregate member deltas to show team momentum, recent totals, and streak heat.",
    tags: ["Members", "Totals", "Recent"],
  },
  {
    title: "Recommendations",
    body: "Suggest what to practice next using simple heuristics: weakest difficulty/topic and inactivity nudges.",
    tags: ["Explainable", "Difficulty", "Topic"],
  },
];

const jobs = [
  "Daily cron: fetch public profile, store snapshot, diff previous, update XP/streak.",
  "Manual resync: user-triggered refresh with cooldown + rate limit.",
  "Party refresh: recompute aggregates after member deltas are stored.",
];

const guardrails = [
  "Public-data-only: use LeetCode public profile/GraphQL endpoints, never ask for credentials.",
  "Backoff + retries: exponential retry with ceilings to avoid hammering LeetCode.",
  "Auditability: log snapshot source, diff results, and XP math per run.",
  "Cooldowns: manual resync guarded to prevent abuse.",
];

const recommendationRules = [
  "Difficulty balance: surface the lowest recent solve bucket (Easy/Medium/Hard).",
  "Inactivity nudge: if no deltas in N days, ask for a quick Easy solve to rebuild streaks.",
  "Topic weakness: pick the topic with lowest share among last 30 days (when available).",
];

const viewPills = [
  "Onboarding: capture LeetCode handle",
  "Dashboard: XP, level, streak, daily delta",
  "Party: member deltas + weekly totals",
  "Recommendations: next topic/difficulty",
  "Settings: handle update + manual resync",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={`${styles.shell}`}>
        <section className={`${styles.hero} ${styles.scanlines}`}>
          <div className={styles.badge}>CodeRaid MVP</div>
          <h1 className={styles.heroTitle}>Track LeetCode progress, earn XP, raid with friends.</h1>
          <p className={styles.heroSubtitle}>
            CodeRaid keeps daily snapshots of your public LeetCode profile, converts progress into XP
            and streaks, and lets parties cheer (or jeer) each other on. Everything is deterministic,
            explainable, and limited to public data.
          </p>
          <form className={styles.ctaRow} action={onboardAction}>
            <input
              name="handle"
              placeholder="LeetCode handle"
              aria-label="LeetCode handle"
              required
              className={styles.input}
            />
            <input
              name="email"
              type="email"
              placeholder="Email (optional)"
              className={styles.input}
            />
            <button type="submit" className={styles.buttonPrimary}>
              Start tracking
            </button>
            <a className={styles.buttonGhost} href="/dashboard">
              Go to dashboard
            </a>
          </form>
        </section>

        <section className={styles.grid}>
          {flows.map((flow) => (
            <article key={flow.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{flow.title}</h3>
              <p className={styles.cardBody}>{flow.body}</p>
              <div className={styles.tagRow}>
                {flow.tags.map((tag) => (
                  <span key={tag} className={`${styles.tag} ${styles.tagAccent}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className={styles.split}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Jobs & cadence</h3>
            <p className={styles.cardBody}>Server-side only. Safe defaults first.</p>
            <ul className={styles.list}>
              {jobs.map((item) => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Guardrails</h3>
            <p className={styles.cardBody}>Focus on correctness, throttling, and audit logs.</p>
            <ul className={styles.list}>
              {guardrails.map((item) => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className={styles.split}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Recommendation rules (MVP)</h3>
            <ul className={styles.list}>
              {recommendationRules.map((item) => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.card}>
            <h3 className={styles.cardTitle}>UI slices</h3>
            <div className={styles.pillRow}>
              {viewPills.map((pill) => (
                <span key={pill} className={styles.pill}>
                  {pill}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Current implementation status</h3>
            <div className={styles.pillRow}>
              <span className={`${styles.pill} ${styles.safe}`}>Next.js app router ready</span>
              <span className={`${styles.pill} ${styles.warn}`}>Prisma schema drafted</span>
              <span className={`${styles.pill} ${styles.alert}`}>LeetCode fetcher pending</span>
            </div>
            <p className={styles.cardBody}>
              Database URL is required before migrations. Cron + API wiring will hook into the snapshot
              pipeline next.
            </p>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Next moves</h3>
            <div className={styles.list}>
              <div className={styles.listItem}>Add auth (email magic link or OAuth) and user onboarding.</div>
              <div className={styles.listItem}>Implement public-profile fetcher with safe fallback and caching.</div>
              <div className={styles.listItem}>Wire cron + manual resync to Prisma snapshot pipeline.</div>
            </div>
          </article>
        </section>

        <p className={styles.footerNote}>Building CodeRaid incrementally: public data only, deterministic rules, zero AI hype.</p>
      </div>
    </div>
  );
}
