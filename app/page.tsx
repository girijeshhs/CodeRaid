import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { getSessionUserId } from "@/lib/session";
import { cookies } from "next/headers";

type HomeProps = {
  searchParams?: { error?: string } | Promise<{ error?: string }>;
};

const errorMap: Record<string, string> = {
  server: "Server error while finalizing sign-in. Check DATABASE_URL and try again.",
  oauth: "OAuth request was incomplete. Please try signing in again.",
  state: "OAuth state mismatch. Please retry sign-in.",
  token: "Could not exchange OAuth code. Please retry.",
  idtoken: "Missing ID token from Google. Please retry.",
  tokeninfo: "Could not validate Google token. Please retry.",
  email: "Google account email not verified.",
};

export default async function Home({ searchParams }: HomeProps) {
  const sessionUserId = await getSessionUserId();
  if (sessionUserId) {
    redirect("/dashboard");
  }

  const resolvedParams =
    searchParams && typeof (searchParams as Promise<{ error?: string }>).then === "function"
      ? await searchParams
      : searchParams ?? {};

  const store = await cookies();
  const pendingEmail = store.get("oauth_email")?.value;
  const errorKey = resolvedParams.error;
  const errorMessage = errorKey ? errorMap[errorKey] : null;

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
          {errorMessage ? <div className={styles.errorBanner}>{errorMessage}</div> : null}
          {pendingEmail ? (
            <div className={styles.pendingBox}>
              <div className={styles.pendingTitle}>Finish setup</div>
              <div className={styles.pendingText}>
                Signed in as <span className={styles.email}>{pendingEmail}</span>
              </div>
              <a className={styles.googleButton} href="/onboard">
                Continue to onboarding
              </a>
            </div>
          ) : null}
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
