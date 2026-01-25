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
      <div className={`${styles.shell}`}>
        <section className={styles.hero}>
          <p className={styles.heroTitle}>Track your LeetCode progress with daily snapshots.</p>
          <form className={styles.ctaRow} action={onboardAction}>
            <input
              name="handle"
              placeholder="LeetCode handle"
              aria-label="LeetCode handle"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.buttonPrimary}>
              Continue
            </button>
          </form>
          <p className={styles.helper}>Public profile only. No passwords.</p>
        </section>
      </div>
    </div>
  );
}
