import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { onboardAction } from "./actions";
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
          <form className={styles.form} action={onboardAction}>
            <label className={styles.label} htmlFor="handle">
              Email or username
            </label>
            <input
              id="handle"
              name="handle"
              placeholder="you@domain.com or handle"
              aria-label="Email or username"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.primaryButton}>
              Sign in
            </button>
          </form>
          <button type="button" className={styles.secondaryButton}>
            Create account
          </button>
        </div>
      </section>
    </div>
  );
}
