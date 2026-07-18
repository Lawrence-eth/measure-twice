import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { DebriefRequestSchema } from "@/lib/debrief-contracts";
import { createLiveDebrief, seededDebrief } from "@/lib/debrief";
import {
  canCompleteScene,
  evidenceLevel,
  evidenceScore,
  parseMissionProgress,
} from "@/lib/evidence-engine";
import type { SceneId } from "@/lib/mission";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 30_000;
const LIVE_WINDOW_MS = 15 * 60 * 1_000;
const MAX_LIVE_REQUESTS_PER_CLIENT = 2;
const MAX_RATE_BUCKETS = 2_000;
const buckets = new Map<string, { count: number; resetsAt: number }>();
const REQUIRED_COMPLETION_SCENES: SceneId[] = [
  "arrival",
  "target",
  "record",
  "handoff",
  "radius",
  "check",
  "evolve",
  "ship",
  "transfer",
];

function identifierFor(sessionId: string): string {
  return createHash("sha256")
    .update(`${process.env.SAFETY_SALT ?? "pentimento-local"}:${sessionId}`)
    .digest("hex");
}

function takeLiveSlot(request: Request): boolean {
  const address =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const now = Date.now();
  if (buckets.size >= MAX_RATE_BUCKETS) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetsAt <= now) buckets.delete(bucketKey);
    }
    if (buckets.size >= MAX_RATE_BUCKETS) {
      const oldest = [...buckets.entries()].sort((a, b) => a[1].resetsAt - b[1].resetsAt)[0];
      if (oldest) buckets.delete(oldest[0]);
    }
  }

  const key = createHash("sha256")
    .update(`${process.env.SAFETY_SALT ?? "pentimento-local"}:${address}`)
    .digest("hex");
  const current = buckets.get(key);

  if (!current || current.resetsAt <= now) {
    buckets.set(key, { count: 1, resetsAt: now + LIVE_WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_LIVE_REQUESTS_PER_CLIENT) return false;
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
    if (new TextEncoder().encode(raw).byteLength > MAX_REQUEST_BYTES) {
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

  const progress = parseMissionProgress(parsed.data.progress);
  const missionIsComplete = Boolean(
    progress?.started &&
    progress.scene === "replay" &&
    REQUIRED_COMPLETION_SCENES.every((scene) => canCompleteScene(progress, scene)),
  );
  if (!progress || !missionIsComplete) {
    return NextResponse.json(
      { error: "The mission record is incomplete or invalid." },
      { status: 400 },
    );
  }
  const score = evidenceScore(progress);
  const level = evidenceLevel(progress);
  const demoMode = process.env.DEMO_MODE !== "false" || !process.env.OPENAI_API_KEY;

  if (demoMode || !takeLiveSlot(request)) {
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
