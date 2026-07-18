import { beforeEach, describe, expect, it } from "vitest";

import { POST } from "@/app/api/debrief/route";
import { initialProgress, type MissionProgress } from "@/lib/evidence-engine";
import { checks, planOptions, repositoryOptions, shipGate } from "@/lib/mission";

const endpoint = "http://localhost/api/debrief";
const sessionId = "123e4567-e89b-42d3-a456-426614174000";

function completeProgress(): MissionProgress {
  return {
    ...initialProgress,
    scene: "replay",
    started: true,
    arrivalChoice: "inspect",
    confidence: { arrival: 0.7, radius: 0.9, transfer: 0.9 },
    target: {
      audience: "audience-neighbors",
      outcome: "outcome-attend",
      proof: "proof-behavior",
      nonGoal: "nongoal-systems",
    },
    repository: repositoryOptions.filter((item) => item.correct).map((item) => item.id),
    context: ["goal", "trusted-facts", "current-files", "acceptance", "authority", "mobile-reference"],
    plan: planOptions.filter((item) => item.correct).map((item) => item.id),
    checksRun: checks.filter((item) => item.correct).map((item) => item.id),
    repair: {
      observed: "observed-exact",
      reproduce: "reproduce-exact",
      expected: "expected-exact",
      preserve: "preserve-verified",
    },
    repaired: true,
    retested: ["facts-check", "mobile-check"],
    shipGate: shipGate.map((item) => item.id),
    transfer: {
      source: "source-receipts",
      proof: "proof-recalc",
      next: "next-bounded",
    },
    attempts: {
      arrival: 1,
      target: 1,
      record: 1,
      handoff: 1,
      radius: 1,
      check: 1,
      evolve: 1,
      ship: 1,
      transfer: 1,
    },
  };
}

function request(body: unknown): Request {
  return new Request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("debrief API", () => {
  beforeEach(() => {
    process.env.DEMO_MODE = "true";
  });

  it("recomputes the authoritative evidence score", async () => {
    const response = await POST(request({ sessionId, progress: completeProgress(), score: 0 }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.mode).toBe("demo");
    expect(body.score).toBe(100);
    expect(body.level).toBe("Independent");
    expect(body.result.nextProjectMoves).toHaveLength(3);
  });

  it("reduces the score when the supplied mission evidence is unsafe", async () => {
    const progress = completeProgress();
    progress.repository.push("api-key");
    const response = await POST(request({ sessionId, progress }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.score).toBeLessThan(100);
  });

  it("rejects oversized reflection text", async () => {
    const progress = completeProgress();
    progress.reflection = "x".repeat(601);
    const response = await POST(request({ sessionId, progress }));

    expect(response.status).toBe(400);
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(new Request(endpoint, { method: "POST", body: "{" }));
    expect(response.status).toBe(400);
  });
});
