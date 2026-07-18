import { describe, expect, it } from "vitest";

import {
  buildCompetencies,
  canCompleteScene,
  evidenceLevel,
  evidenceScore,
  initialProgress,
  planIsBounded,
  repositoryIsSafe,
  transferIsCorrect,
  type MissionProgress,
} from "@/lib/evidence-engine";
import { checks, planOptions, repositoryOptions, shipGate } from "@/lib/mission";

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
    context: [
      "goal",
      "trusted-facts",
      "current-files",
      "acceptance",
      "authority",
      "mobile-reference",
    ],
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
  };
}

describe("evidence engine", () => {
  it("rejects a repository that contains a real secret", () => {
    const progress = completeProgress();
    progress.repository.push("api-key");

    expect(repositoryIsSafe(progress)).toBe(false);
    expect(canCompleteScene(progress, "record")).toBe(false);
  });

  it("requires the AI plan to be reduced to the proof-sized slice", () => {
    const progress = completeProgress();
    progress.plan.push("accounts");

    expect(planIsBounded(progress)).toBe(false);
    expect(canCompleteScene(progress, "radius")).toBe(false);
  });

  it("does not treat asking the AI again as an independent check", () => {
    const progress = completeProgress();
    progress.checksRun = ["facts-check", "mobile-check", "secret-check", "execution-log", "ask-again"];

    expect(canCompleteScene(progress, "check")).toBe(false);
  });

  it("requires repair evidence to be rerun before shipping", () => {
    const progress = completeProgress();
    progress.retested = ["facts-check"];

    expect(canCompleteScene(progress, "evolve")).toBe(false);
    expect(canCompleteScene(progress, "ship")).toBe(false);
  });

  it("assesses transfer on an unfamiliar artifact", () => {
    const progress = completeProgress();
    expect(transferIsCorrect(progress)).toBe(true);

    progress.transfer.proof = "proof-again";
    expect(transferIsCorrect(progress)).toBe(false);
  });

  it("produces an evidence score rather than a false mastery claim", () => {
    const progress = completeProgress();
    const competencies = buildCompetencies(progress);

    expect(evidenceScore(progress)).toBe(100);
    expect(evidenceLevel(progress)).toBe("Independent");
    expect(competencies).toHaveLength(7);
    expect(competencies.every((item) => item.rating === 3)).toBe(true);
  });

  it("reduces evidence ratings after corrective attempts", () => {
    const progress = completeProgress();
    progress.attempts = { target: 2, record: 2 };

    const competencies = buildCompetencies(progress);
    expect(competencies.find((item) => item.id === "target")?.rating).toBe(2);
    expect(competencies.find((item) => item.id === "record")?.rating).toBe(2);
    expect(evidenceScore(progress)).toBeLessThan(100);
  });

  it("records confidence without rewarding an unsupported first impression", () => {
    const progress = completeProgress();
    progress.arrivalChoice = "ship";
    progress.confidence.arrival = 0.9;

    const inspect = buildCompetencies(progress).find((item) => item.id === "inspect");
    expect(inspect?.rating).toBe(2);
    expect(evidenceScore(progress)).toBeLessThan(100);
  });
});
