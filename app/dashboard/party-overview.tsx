"use client";

import { useMemo, useState } from "react";
import { Modal } from "../components/modal";

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
    <div className="mx-auto max-w-7xl px-8 py-12">
      <header className="mb-10 flex flex-col items-end justify-between gap-4 border-b border-zinc-800 pb-6 md:flex-row">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-500 before:block before:h-2 before:w-2 before:rounded-full before:bg-amber-500 before:shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            Party
          </div>
          <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            {partyName}
          </h1>
        </div>
        <div className="rounded-full border border-zinc-800 bg-zinc-800 px-3 py-1.5 font-mono text-sm text-zinc-400">
          Members <span className="font-bold text-white">{memberCount}</span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedMembers.map((member) => (
          <button
            key={member.id}
            type="button"
            className="group relative flex flex-col gap-5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-800 hover:shadow-xl"
            onClick={() => setActiveMember(member)}
          >
            <div className="flex w-full items-start justify-between">
              <div className="text-base font-semibold text-white">{member.handle}</div>
              <div className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-zinc-400">
                <span>🔥</span> {member.streakCount}
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Weekly Solved</span>
              <span className="font-mono text-3xl font-bold text-white">{member.weeklySolved}</span>
            </div>

            <div className="flex w-full justify-between rounded-lg border border-white/5 bg-black/20 p-3">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-semibold uppercase text-emerald-500">Easy</span>
                <span className="font-mono text-sm font-bold text-white">{member.weeklyEasy}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-semibold uppercase text-amber-500">Med</span>
                <span className="font-mono text-sm font-bold text-white">{member.weeklyMedium}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-semibold uppercase text-red-500">Hard</span>
                <span className="font-mono text-sm font-bold text-white">{member.weeklyHard}</span>
              </div>
            </div>
          </button>
        ))}
      </section>

      <Modal
        isOpen={!!activeMember}
        onClose={() => setActiveMember(null)}
        title={activeMember?.handle}
      >
        {activeMember && (
          <>
            <div className="mb-6 font-mono text-sm text-zinc-400">
              Weekly solved <span className="font-bold text-white">{activeMember.weeklySolved}</span>
            </div>

            <div className="mb-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Strengths</div>
              <ul className="flex flex-col gap-2">
                {activeMember.strengths.map((item) => (
                  <li key={item} className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 before:block before:h-1.5 before:w-1.5 before:rounded-full before:bg-emerald-500">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Gaps</div>
              <ul className="flex flex-col gap-2">
                {activeMember.gaps.map((item) => (
                  <li key={item} className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 before:block before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-500">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
