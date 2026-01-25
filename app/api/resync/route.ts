import { NextResponse } from "next/server";
import { startOfDay } from "date-fns";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { log } from "@/lib/logger";
import { profileFetcher } from "@/lib/profile-fetcher";
import { snapshotManager } from "@/lib/snapshot-manager";

const payloadSchema = z.object({
  handle: z.string().min(3).max(32),
  userId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { handle, userId } = payloadSchema.parse(body);

    const user = await resolveUser(handle, userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const profile = await profileFetcher.fetchPublicProfile(handle);
    const shaped = profileFetcher.shapeSnapshot({
      handle,
      stats: { ...profile.stats, takenFor: startOfDay(new Date()) },
    });

    const result = await snapshotManager.recordSnapshot(user.id, shaped.stats);
    return NextResponse.json({ status: "ok", result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 422 });
    }
    log.error("manual-resync", "Unexpected failure", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

async function resolveUser(handle: string, userId?: string) {
  if (userId) {
    return prisma.user.findUnique({ where: { id: userId } });
  }
  const existing = await prisma.user.findUnique({ where: { handle: handle.toLowerCase() } });
  if (existing) return existing;
  return prisma.user.create({ data: { handle: handle.toLowerCase() } });
}
