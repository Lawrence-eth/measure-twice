import { describe, expect, it } from "vitest";

import {
  completeLearningStage,
  initialStudioProgress,
  parseStudioProgress,
} from "@/lib/studio-progress";

describe("studio progress", () => {
  it("rejects unknown and earlier progress formats", () => {
    expect(parseStudioProgress(null)).toBeNull();
    expect(parseStudioProgress({ version: 2 })).toBeNull();
    expect(parseStudioProgress("not progress")).toBeNull();
  });

  it("restores valid learner state and removes malformed fields", () => {
    const restored = parseStudioProgress({
      version: 3,
      started: true,
      stage: "build",
      completedStages: ["idea", "tools", "home", "ask", "unknown", "build"],
      revealPercent: 200,
      featureDecisions: {
        "Event facts and accepted-item list": "now",
        "Email link": "now",
        "Booking system": "later",
        broken: "sometimes",
      },
      ideaStep: 3,
      toolLane: "repository",
      foundationStep: 4,
      promptParts: ["purpose", "truth", "limits", "mode", "done", "unexpected"],
      planApproved: true,
      buildCycle: 2,
      buildPhase: "check",
      checksRun: [
        "unsupported-promise",
        "clipped-contact",
        "inactive-email",
        "unexpected",
      ],
      repairPrepared: true,
      repairApplied: false,
      versionFocus: 4,
      releaseStep: 1,
      improveStep: 0,
      mirrorDraft: {
        person: "A first-time club organizer",
        situation: "Planning from a phone",
        usefulResult: "Publish one accurate event page",
        completePath: "Open → read → email",
        trustedFacts: "Approved date\nApproved place",
        mustHave: "Readable schedule",
        notNow: "Accounts\nPayments",
        doneWhen: "A visitor can complete the path at 390px",
        ignored: "not persisted",
      },
      finished: false,
    });

    expect(restored).toMatchObject({
      started: true,
      stage: "build",
      completedStages: ["idea", "tools", "home", "ask"],
      revealPercent: 88,
      featureDecisions: {
        "Event facts and accepted-item list": "now",
        "Email link": "now",
        "Booking system": "later",
      },
      ideaStep: 3,
      toolLane: "repository",
      foundationStep: 4,
      promptParts: ["purpose", "truth", "limits", "mode", "done"],
      planApproved: true,
      buildCycle: 2,
      buildPhase: "check",
      checksRun: ["unsupported-promise", "clipped-contact", "inactive-email"],
      repairPrepared: true,
      versionFocus: 4,
      mirrorDraft: {
        person: "A first-time club organizer",
        situation: "Planning from a phone",
        usefulResult: "Publish one accurate event page",
        completePath: "Open → read → email",
        trustedFacts: "Approved date\nApproved place",
        mustHave: "Readable schedule",
        notNow: "Accounts\nPayments",
        doneWhen: "A visitor can complete the path at 390px",
      },
    });
  });

  it("falls back safely for invalid fields in a v3 record", () => {
    const restored = parseStudioProgress({
      version: 3,
      stage: "elsewhere",
      toolLane: "magic",
      buildPhase: "guess",
      revealPercent: Number.NaN,
      foundationStep: -8,
    });

    expect(restored).toEqual(initialStudioProgress);
  });

  it("does not let a malformed saved record skip unfinished lessons", () => {
    const restored = parseStudioProgress({
      ...initialStudioProgress,
      started: true,
      stage: "playbook",
      completedStages: ["idea", "tools", "check", "live"],
      promptParts: ["done", "purpose"],
      checksRun: ["inactive-email"],
      finished: true,
    });

    expect(restored).toMatchObject({
      stage: "home",
      completedStages: ["idea", "tools"],
      promptParts: [],
      checksRun: [],
      finished: false,
    });
  });

  it("records a completed learning stage once and moves forward", () => {
    const first = completeLearningStage(initialStudioProgress, "idea", "tools");
    const repeated = completeLearningStage(first, "idea", "tools");

    expect(repeated.stage).toBe("tools");
    expect(repeated.completedStages).toEqual(["idea"]);
  });
});
