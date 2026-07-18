import { beforeEach, describe, expect, it } from "vitest";

import { POST } from "@/app/api/tutor/route";
import { buildDemoDiagnosis } from "@/lib/demo-engine";
import { getLesson } from "@/lib/lessons";

const endpoint = "http://localhost/api/tutor";
const sessionId = "123e4567-e89b-42d3-a456-426614174000";
const lesson = getLesson("await-microtask");

function tutorRequest(body: unknown): Request {
  return new Request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("tutor API evidence boundaries", () => {
  beforeEach(() => {
    process.env.DEMO_MODE = "true";
  });

  it("rejects prediction IDs that are not part of the lesson", async () => {
    const response = await POST(
      tutorRequest({
        action: "diagnose",
        sessionId,
        lessonId: lesson.id,
        predictionId: "invented-option",
        explanation: "I think this option follows source order in every case.",
      }),
    );

    expect(response.status).toBe(400);
  });

  it("rejects forged runtime observations", async () => {
    const response = await POST(
      tutorRequest({
        action: "evaluate_teachback",
        sessionId,
        lessonId: lesson.id,
        originalExplanation: "I think await blocks the whole program here.",
        teachback:
          "await suspends the async function while outside synchronous code continues.",
        observation: ["FAKE", "OUTPUT"],
      }),
    );

    expect(response.status).toBe(409);
  });

  it("returns only server-verified observations to the seeded evaluator", async () => {
    const response = await POST(
      tutorRequest({
        action: "evaluate_teachback",
        sessionId,
        lessonId: lesson.id,
        originalExplanation: "I think await blocks the whole program here.",
        teachback:
          "await suspends the current async function, so C appears before D while outside synchronous code continues.",
        observation: lesson.expectedOutput,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.result.evidenceUsed).toEqual(["Observed order: A → B → C → D"]);
  });

  it("keeps the seeded diagnosis compatible with the API fixture", () => {
    const diagnosis = buildDemoDiagnosis(
      lesson,
      "whole-program-pauses",
      "await blocks the whole program until the promise resolves",
    );

    expect(diagnosis.confidence).toBeLessThanOrEqual(1);
  });
});
