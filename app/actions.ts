'use server';

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { startOfDay } from "date-fns";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { setSessionUserId, clearSession, requireUserId, getSessionUserId } from "@/lib/session";
import { snapshotManager } from "@/lib/snapshot-manager";
import { profileFetcher } from "@/lib/profile-fetcher";
import { log } from "@/lib/logger";

const handleSchema = z.object({
  handle: z.string().trim().min(3).max(32),
  email: z.string().email().trim().optional(),
});

const partySchema = z.object({
  name: z.string().trim().min(3).max(64),
  description: z.string().trim().max(200).optional(),
});

export async function onboardAction(formData: FormData) {
  const parsed = handleSchema.safeParse({
    handle: formData.get("handle"),
    email: formData.get("email") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid handle or email." };
  }

  const handle = parsed.data.handle.toLowerCase();
  const email = parsed.data.email;

  const user = await prisma.user.upsert({
    where: { handle },
    update: { email },
    create: { handle, email },
  });

  setSessionUserId(user.id);
  redirect("/dashboard");
}

export async function simulateSnapshotAction() {
  const userId = requireUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    clearSession();
    redirect("/");
  }

  // Use profile fetcher stub to simulate public snapshot
  const snapshot = await profileFetcher.fetchPublicProfile(user.handle);
  const today = startOfDay(new Date());
  const shaped = profileFetcher.shapeSnapshot({
    handle: user.handle,
    stats: { ...snapshot.stats, takenFor: today },
  });

  const result = await snapshotManager.recordSnapshot(userId, shaped.stats);
  log.info("simulateSnapshot", `Recorded delta for ${user.handle}`, result);

  redirect("/dashboard");
}

export async function createPartyAction(formData: FormData) {
  const userId = requireUserId();
  const parsed = partySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: "Party name too short." };
  }

  const inviteCode = randomBytes(4).toString("hex");

  await prisma.party.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      inviteCode,
      owner: { connect: { id: userId } },
      memberships: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  redirect("/party");
}

export async function joinPartyAction(formData: FormData) {
  const userId = requireUserId();
  const code = (formData.get("code") || "").toString().trim();
  if (!code) return { ok: false, error: "Invite code required." };

  const party = await prisma.party.findUnique({ where: { inviteCode: code } });
  if (!party) return { ok: false, error: "Invalid invite code." };

  await prisma.partyMembership.upsert({
    where: {
      partyId_userId: {
        partyId: party.id,
        userId,
      },
    },
    update: {},
    create: {
      partyId: party.id,
      userId,
      role: "MEMBER",
    },
  });

  redirect("/party");
}

export async function updateHandleAction(formData: FormData) {
  const userId = requireUserId();
  const parsed = handleSchema.safeParse({
    handle: formData.get("handle"),
    email: formData.get("email") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid handle." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      handle: parsed.data.handle.toLowerCase(),
      email: parsed.data.email,
    },
  });

  redirect("/settings");
}

export async function signOutAction() {
  clearSession();
  redirect("/");
}

export async function seedDemoIfMissing() {
  // Useful for dev: ensures a user exists if cookie is gone but DB empty.
  const current = getSessionUserId();
  if (current) return;
  const exists = await prisma.user.findFirst();
  if (!exists) return;
  setSessionUserId(exists.id);
}
