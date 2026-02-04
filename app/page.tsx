import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { getSessionUserId } from "@/lib/session";

export default async function Home() {
  const sessionUserId = await getSessionUserId();
  if (sessionUserId) {
    redirect("/dashboard");
  }

  return (
    <div className={styles.page}>
      <section className={styles.left}>
        <div className={styles.intro}>
          <div className={styles.brand}>CodeRaid</div>
          <h1 className={styles.headline}>Track progress with daily structure and clear comparisons.</h1>
          <ul className={styles.bullets}>
            <li>Daily snapshots keep progress measurable.</li>
            <li>Weekly analysis surfaces real movement.</li>
            <li>Party comparisons make momentum visible.</li>
            <li>Structured signals guide improvement.</li>
          </ul>
        </div>
      </section>

      <section className={styles.right}>
        <div className={styles.loginCard}>
          <div className={styles.loginTitle}>Sign in</div>
          <a className={styles.googleButton} href="/api/auth/google">
            Continue with Google
          </a>
          <div className={styles.divider}>
            <span>Requires Google account</span>
          </div>
          <div className={styles.helperText}>You will link your LeetCode handle after sign-in.</div>
        </div>
      </section>
    </div>
  );
}
