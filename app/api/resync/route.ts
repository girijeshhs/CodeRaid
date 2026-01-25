import { NextResponse } from "next/server";
import { z } from "zod";
import { log } from "@/lib/logger";

const payloadSchema = z.object({
  handle: z.string().min(3).max(32),
  userId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { handle, userId } = payloadSchema.parse(body);

    log.info("manual-resync", `Requested for handle=${handle} user=${userId ?? "anon"}`);

    // TODO: Wire to profileFetcher + snapshotManager once auth + DB are in place.
    return NextResponse.json(
      {
        status: "accepted",
        message: "Manual resync stub created. Hook up profile fetcher + snapshot persistence next.",
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 422 });
    }
    log.error("manual-resync", "Unexpected failure", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
