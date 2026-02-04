import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import styles from "./settings.module.css";
import ProfileForm from "./profile-form";
import SignOutForm from "./sign-out-form";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.card}>
        <h3>Profile</h3>
        <ProfileForm user={user} />
      </div>

      <div className={styles.card}>
        <h3>Session</h3>
        <SignOutForm />
      </div>
    </div>
  );
}
