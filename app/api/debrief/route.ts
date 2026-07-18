import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { DebriefRequestSchema } from "@/lib/debrief-contracts";
import { createLiveDebrief, seededDebrief } from "@/lib/debrief";
import { evidenceLevel, evidenceScore, type MissionProgress } from "@/lib/evidence-engine";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 30_000;
const buckets = new Map<string, { count: number; resetsAt: number }>();

function identifierFor(sessionId: string): string {
  return createHash("sha256")
    .update(`${process.env.SAFETY_SALT ?? "measure-twice-local"}:${sessionId}`)
    .digest("hex");
}

function takeLiveSlot(request: Request, sessionId: string): boolean {
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const key = createHash("sha256").update(`${address}:${sessionId}`).digest("hex");
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetsAt <= now) {
    buckets.set(key, { count: 1, resetsAt: now + 15 * 60 * 1_000 });
    return true;
  }
  if (current.count >= 2) return false;
  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }
    const raw = await request.text();
    if (raw.length > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = DebriefRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "The mission record is incomplete or invalid." },
      { status: 400 },
    );
  }

  const progress = parsed.data.progress as MissionProgress;
  const score = evidenceScore(progress);
  const level = evidenceLevel(progress);
  const demoMode = process.env.DEMO_MODE !== "false" || !process.env.OPENAI_API_KEY;

  if (demoMode || !takeLiveSlot(request, parsed.data.sessionId)) {
    return NextResponse.json({
      mode: "demo",
      score,
      level,
      result: seededDebrief(progress),
    });
  }

  try {
    const result = await createLiveDebrief({
      progress,
      safetyIdentifier: identifierFor(parsed.data.sessionId),
    });

    return NextResponse.json({ mode: "live", score, level, result });
  } catch (error) {
    console.error("Live debrief failed; using the authored fallback.", error);
    return NextResponse.json({
      mode: "demo",
      score,
      level,
      result: seededDebrief(progress),
    });
  }
}
