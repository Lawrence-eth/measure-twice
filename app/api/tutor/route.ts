import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

import { TutorRequestSchema } from "@/lib/contracts";
import {
  buildDemoDiagnosis,
  evaluateDemoTeachback,
  evaluateDemoTransfer,
} from "@/lib/demo-engine";
import { getLesson } from "@/lib/lessons";
import {
  diagnoseWithOpenAI,
  evaluateTeachbackWithOpenAI,
  evaluateTransferWithOpenAI,
  TutorModelError,
} from "@/lib/openai-tutor";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 20_000;
const LIVE_REQUEST_LIMIT = 8;
const LIVE_RATE_WINDOW_MS = 10 * 60 * 1_000;
const liveRateBuckets = new Map<string, { count: number; resetsAt: number }>();

function arraysMatch(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function safetyIdentifier(sessionId: string): string {
  return createHash("sha256")
    .update(`${process.env.SAFETY_SALT ?? "counterproof-local"}:${sessionId}`)
    .digest("hex");
}

function takeLiveRateSlot(request: Request, sessionId: string): boolean {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "local";
  const key = createHash("sha256").update(`${address}:${sessionId}`).digest("hex");
  const now = Date.now();
  const existing = liveRateBuckets.get(key);

  if (!existing || existing.resetsAt <= now) {
    liveRateBuckets.set(key, { count: 1, resetsAt: now + LIVE_RATE_WINDOW_MS });
    return true;
  }

  if (existing.count >= LIVE_REQUEST_LIMIT) return false;
  existing.count += 1;

  if (liveRateBuckets.size > 500) {
    for (const [bucketKey, bucket] of liveRateBuckets) {
      if (bucket.resetsAt <= now) liveRateBuckets.delete(bucketKey);
    }
  }

  return true;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    }
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = TutorRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the lesson response and try again." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const lesson = getLesson(input.lessonId);
  const isDemo =
    process.env.DEMO_MODE !== "false" || !process.env.OPENAI_API_KEY;
  const identifier = safetyIdentifier(input.sessionId);

  if (!isDemo && !takeLiveRateSlot(request, input.sessionId)) {
    return NextResponse.json(
      { error: "Live tutor limit reached. Continue in seeded demo mode or try again later." },
      { status: 429 },
    );
  }

  try {
    if (input.action === "diagnose") {
      if (!lesson.predictionOptions.some((option) => option.id === input.predictionId)) {
        return NextResponse.json({ error: "Unknown prediction option." }, { status: 400 });
      }

      const result = isDemo
        ? buildDemoDiagnosis(lesson, input.predictionId, input.explanation)
        : await diagnoseWithOpenAI({
            lesson,
            predictionId: input.predictionId,
            explanation: input.explanation,
            safetyIdentifier: identifier,
          });

      return NextResponse.json({
        action: input.action,
        mode: isDemo ? "demo" : "live",
        result,
      });
    }

    if (input.action === "evaluate_teachback") {
      if (!arraysMatch(input.observation, lesson.expectedOutput)) {
        return NextResponse.json(
          { error: "Runtime evidence did not match the audited lesson fixture." },
          { status: 409 },
        );
      }

      const result = isDemo
        ? evaluateDemoTeachback(input.teachback, lesson.expectedOutput)
        : await evaluateTeachbackWithOpenAI({
            lesson,
            originalExplanation: input.originalExplanation,
            teachback: input.teachback,
            observation: lesson.expectedOutput,
            safetyIdentifier: identifier,
          });

      return NextResponse.json({
        action: input.action,
        mode: isDemo ? "demo" : "live",
        result,
      });
    }

    const transferPrediction = lesson.transfer.predictionOptions.find(
      (option) => option.id === input.predictionId,
    );
    if (!transferPrediction) {
      return NextResponse.json({ error: "Unknown transfer option." }, { status: 400 });
    }
    if (!arraysMatch(input.observation, lesson.transfer.expectedOutput)) {
      return NextResponse.json(
        { error: "Runtime evidence did not match the audited transfer fixture." },
        { status: 409 },
      );
    }
    const predictionMatched =
      transferPrediction.order.replaceAll(" ", "") ===
      lesson.transfer.expectedOutput.join("→");
    const result = isDemo
      ? evaluateDemoTransfer(input.predictionId, input.rationale)
      : await evaluateTransferWithOpenAI({
          lesson,
          predictionId: input.predictionId,
          rationale: input.rationale,
          observation: lesson.transfer.expectedOutput,
          predictionMatched,
          safetyIdentifier: identifier,
        });

    return NextResponse.json({
      action: input.action,
      mode: isDemo ? "demo" : "live",
      result,
    });
  } catch (error) {
    if (error instanceof TutorModelError) {
      const status = error.kind === "refusal" ? 422 : error.kind === "incomplete" ? 503 : 502;
      const message =
        error.kind === "refusal"
          ? "GPT-5.6 could not evaluate that response. Rephrase it and try again."
          : error.kind === "incomplete"
            ? "GPT-5.6 returned an incomplete result. Please retry this step."
            : "GPT-5.6 could not complete this tutor step.";
      return NextResponse.json({ error: message }, { status });
    }

    console.error("Tutor request failed", error);
    return NextResponse.json(
      { error: "The tutor could not complete that step. Please try again." },
      { status: 500 },
    );
  }
}
