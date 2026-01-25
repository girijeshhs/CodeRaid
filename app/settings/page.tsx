import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { signOutAction, updateHandleAction } from "../actions";
import styles from "./settings.module.css";

export default async function SettingsPage() {
  const userId = requireUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.card}>
        <h3>Profile</h3>
        <form className={styles.form} action={updateHandleAction}>
          <input
            name="handle"
            defaultValue={user.handle}
            className={styles.input}
            placeholder="LeetCode handle"
            required
          />
          <input
            name="email"
            defaultValue={user.email ?? ""}
            className={styles.input}
            placeholder="Email (optional)"
            type="email"
          />
          <button type="submit" className={styles.button}>
            Save
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h3>Session</h3>
        <form action={signOutAction}>
          <button type="submit" className={`${styles.button} ${styles.secondary}`}>
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
