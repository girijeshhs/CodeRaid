import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import styles from "./party.module.css";
import CreatePartyForm from "./create-party-form";
import JoinPartyForm from "./join-party-form";

export default async function PartyPage() {
  const userId = await requireUserId();

  const memberships = await prisma.partyMembership.findMany({
    where: { userId },
    include: { party: true },
  });

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Parties</h1>

      <div className={styles.card}>
        <h3>Create a party</h3>
        <CreatePartyForm />
      </div>

      <div className={styles.card}>
        <h3>Join with invite code</h3>
        <JoinPartyForm />
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
