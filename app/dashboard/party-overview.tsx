"use client";

import { useMemo, useState } from "react";
import styles from "./dashboard.module.css";

type MemberStats = {
  id: string;
  handle: string;
  streakCount: number;
  weeklySolved: number;
  weeklyEasy: number;
  weeklyMedium: number;
  weeklyHard: number;
  strengths: string[];
  gaps: string[];
};

type PartyOverviewProps = {
  partyName: string;
  memberCount: number;
  members: MemberStats[];
};

export default function PartyOverview({ partyName, memberCount, members }: PartyOverviewProps) {
  const [activeMember, setActiveMember] = useState<MemberStats | null>(null);

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => b.weeklySolved - a.weeklySolved);
  }, [members]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <div className={styles.partyLabel}>Party</div>
          <h1 className={styles.partyName}>{partyName}</h1>
        </div>
        <div className={styles.memberCount}>
          Members <span className="mono">{memberCount}</span>
        </div>
      </header>

      <section className={styles.grid}>
        {sortedMembers.map((member) => (
          <button
            key={member.id}
            type="button"
            className={styles.card}
            onClick={() => setActiveMember(member)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.handle}>{member.handle}</div>
              <div className={styles.streak}>
                Streak <span className="mono">{member.streakCount}</span>
              </div>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Weekly solved</span>
              <span className="mono">{member.weeklySolved}</span>
            </div>
            <div className={styles.breakdown}>
              <div>
                E <span className="mono" style={{ color: "var(--easy)" }}>{member.weeklyEasy}</span>
              </div>
              <div>
                M <span className="mono" style={{ color: "var(--medium)" }}>{member.weeklyMedium}</span>
              </div>
              <div>
                H <span className="mono" style={{ color: "var(--hard)" }}>{member.weeklyHard}</span>
              </div>
            </div>
          </button>
        ))}
      </section>

      {activeMember ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalTitle}>{activeMember.handle}</div>
                <div className={styles.modalSubtitle}>
                  Weekly solved <span className="mono">{activeMember.weeklySolved}</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setActiveMember(null)}
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Strengths</div>
              <ul className={styles.modalList}>
                {activeMember.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Gaps</div>
              <ul className={styles.modalList}>
                {activeMember.gaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
