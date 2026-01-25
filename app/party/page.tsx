import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { createPartyAction, joinPartyAction } from "../actions";
import styles from "./party.module.css";

export default async function PartyPage() {
  const userId = requireUserId();

  const memberships = await prisma.partyMembership.findMany({
    where: { userId },
    include: { party: true },
  });

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Parties</h1>

      <div className={styles.card}>
        <h3>Create a party</h3>
        <form className={styles.formRow} action={createPartyAction}>
          <input name="name" placeholder="Party name" className={styles.input} required />
          <input name="description" placeholder="Description (optional)" className={styles.input} />
          <button type="submit" className={styles.button}>
            Create
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h3>Join with invite code</h3>
        <form className={styles.formRow} action={joinPartyAction}>
          <input name="code" placeholder="Invite code" className={styles.input} required />
          <button type="submit" className={styles.button}>
            Join
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h3>Your parties</h3>
        {memberships.length === 0 ? (
          <p>No parties yet.</p>
        ) : (
          <ul className={styles.list}>
            {memberships.map((m) => (
              <li key={m.id} className={styles.item}>
                <strong>{m.party.name}</strong> — invite: {m.party.inviteCode}
                <div>{m.party.description ?? ""}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
