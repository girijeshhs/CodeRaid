import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import OnboardingForm from "./onboarding-form";

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
        <OnboardingForm />
        <p className={styles.helper}>We only read your public profile.</p>
      </div>
    </div>
  );
}
