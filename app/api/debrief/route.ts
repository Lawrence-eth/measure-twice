import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { DebriefRequestSchema } from "@/lib/debrief-contracts";
import { createLiveDebrief, seededDebrief } from "@/lib/debrief";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 12_000;
const LIVE_WINDOW_MS = 15 * 60 * 1_000;
const MAX_LIVE_REQUESTS_PER_CLIENT = 2;
const MAX_RATE_BUCKETS = 2_000;
const buckets = new Map<string, { count: number; resetsAt: number }>();

function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== "false" || !process.env.OPENAI_API_KEY;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  return json({ mode: isDemoMode() ? "demo" : "live" });
}

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
      const oldest = [...buckets.entries()].sort(
        (left, right) => left[1].resetsAt - right[1].resetsAt,
      )[0];
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
    if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
      return json({ error: "Request body is too large." }, 413);
    }

    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_REQUEST_BYTES) {
      return json({ error: "Request body is too large." }, 413);
    }
    payload = JSON.parse(raw);
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const parsed = DebriefRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      { error: "The first-version brief is incomplete or invalid." },
      400,
    );
  }

  const mirrorInput = {
    firstVersionBrief: parsed.data.firstVersionBrief,
    toolLane: parsed.data.toolLane,
  };
  const demoMode = isDemoMode();

  if (demoMode || !takeLiveSlot(request)) {
    return json({
      mode: "demo",
      result: seededDebrief(mirrorInput),
    });
  }

  try {
    const result = await createLiveDebrief({
      ...mirrorInput,
      safetyIdentifier: identifierFor(parsed.data.sessionId),
    });

    return json({ mode: "live", result });
  } catch (error) {
    console.error("Live Teaching Mirror failed; using the authored fallback.", error);
    return json({
      mode: "demo",
      result: seededDebrief(mirrorInput),
    });
  }
}
