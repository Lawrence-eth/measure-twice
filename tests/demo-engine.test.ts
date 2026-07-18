import { describe, expect, it } from "vitest";

import { TutorRequestSchema } from "@/lib/contracts";
import {
  buildDemoDiagnosis,
  evaluateDemoTeachback,
  evaluateDemoTransfer,
} from "@/lib/demo-engine";
import { getLesson } from "@/lib/lessons";

const lesson = getLesson("await-microtask");

describe("demo diagnosis", () => {
  it("turns a program-wide pause belief into a falsifiable hypothesis", () => {
    const diagnosis = buildDemoDiagnosis(
      lesson,
      "whole-program-pauses",
      "await pauses the whole program",
    );

    expect(diagnosis.hypothesis).toContain("pauses all JavaScript");
    expect(diagnosis.discriminatingQuestion).toContain("surrounding script");
    expect(diagnosis.confidence).toBeGreaterThan(0.9);
  });

  it("does not treat a correct prediction as proof of a robust model", () => {
    const diagnosis = buildDemoDiagnosis(
      lesson,
      "function-pauses",
      "await pauses only the current async function",
    );

    expect(diagnosis.misconception).toContain("explanation may still be brittle");
    expect(diagnosis.discriminatingQuestion).not.toHaveLength(0);
  });

  it("uses the written explanation when it conflicts with the selected option", () => {
    const diagnosis = buildDemoDiagnosis(
      lesson,
      "function-pauses",
      "I picked this, but I believe await blocks the whole program.",
    );

    expect(diagnosis.hypothesis).toContain("pauses all JavaScript");
  });
});

describe("teach-back evaluation", () => {
  it("recognizes a repaired causal explanation grounded in the run", () => {
    const evaluation = evaluateDemoTeachback(
      "await suspends the current async function. Outside synchronous code continues, so C appears before D; then the function resumes in a microtask.",
      ["A", "B", "C", "D"],
    );

    expect(evaluation.status).toBe("revised");
    expect(evaluation.evidenceUsed).toEqual(["Observed order: A → B → C → D"]);
  });

  it("does not confuse repeating the observed output with a causal mechanism", () => {
    const evaluation = evaluateDemoTeachback(
      "The answer is A B C D because that is what I saw.",
      ["A", "B", "C", "D"],
    );

    expect(evaluation.status).toBe("unchanged");
    expect(evaluation.evidenceUsed).toEqual(["Observed order: A → B → C → D"]);
  });
});

describe("transfer evaluation", () => {
  it("requires both a matching prediction and a causal explanation", () => {
    const evaluation = evaluateDemoTransfer(
      "transfer-correct",
      "await resumes in a microtask after synchronous code and before the timer",
    );

    expect(evaluation.status).toBe("verified");
  });

  it("does not call a correct guess verified", () => {
    const evaluation = evaluateDemoTransfer(
      "transfer-correct",
      "I guessed this output and it looks right to me",
    );

    expect(evaluation.status).toBe("partial");
  });

  it("does not verify a causal-sounding explanation for a wrong prediction", () => {
    const evaluation = evaluateDemoTransfer(
      "transfer-timer",
      "await resumes in a microtask and the timer runs later",
    );

    expect(evaluation.status).toBe("missed");
  });
});

describe("request validation", () => {
  it("accepts a bounded diagnosis request", () => {
    const result = TutorRequestSchema.safeParse({
      action: "diagnose",
      sessionId: "123e4567-e89b-42d3-a456-426614174000",
      lessonId: "await-microtask",
      predictionId: "whole-program-pauses",
      explanation: "await pauses every part of the program here",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty explanation before it reaches a model", () => {
    const result = TutorRequestSchema.safeParse({
      action: "diagnose",
      sessionId: "123e4567-e89b-42d3-a456-426614174000",
      lessonId: "await-microtask",
      predictionId: "whole-program-pauses",
      explanation: "short",
    });

    expect(result.success).toBe(false);
  });
});

describe("curated runtime fixtures", () => {
  it("keeps expected outputs aligned with the displayed predictions", () => {
    expect(lesson.expectedOutput).toEqual(["A", "B", "C", "D"]);
    expect(lesson.transfer.expectedOutput).toEqual(["A", "B", "C", "D", "E"]);
  });
});
