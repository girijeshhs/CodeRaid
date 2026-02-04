import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { completeOnboardingAction } from "../actions";
import styles from "./page.module.css";

export default async function OnboardPage() {
  const store = await cookies();
  const email = store.get("oauth_email")?.value;

  if (!email) {
    redirect("/");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Link your LeetCode handle</div>
        <p className={styles.subtitle}>
          Signed in as <span className={styles.email}>{email}</span>
        </p>
        <form className={styles.form} action={completeOnboardingAction}>
          <label className={styles.label} htmlFor="handle">
            LeetCode username
          </label>
          <input
            id="handle"
            name="handle"
            placeholder="leetcode_handle"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.primaryButton}>
            Continue
          </button>
        </form>
        <p className={styles.helper}>We only read your public profile.</p>
      </div>
    </div>
  );
}
