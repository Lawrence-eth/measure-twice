import { describe, expect, it } from "vitest";

import {
  completeFinalStage,
  initialFinalProgress,
  parseFinalProgress,
  parseStoredFinalProgress,
  startFinalJourney,
  type FinalProgress,
} from "@/lib/final-progress";

function fresh(): FinalProgress {
  return {
    ...initialFinalProgress,
    completedStages: [],
    mirrorDraft: { ...initialFinalProgress.mirrorDraft },
  };
}

describe("final Pentimento progress", () => {
  it("accepts only the final v4 state model", () => {
    expect(parseFinalProgress(null)).toBeNull();
    expect(parseFinalProgress({ version: 3 })).toBeNull();
    expect(parseFinalProgress({ version: 5 })).toBeNull();
    expect(parseStoredFinalProgress("not-json")).toBeNull();
  });

  it("starts directly at Idea with no conceptual gate", () => {
    expect(startFinalJourney(fresh())).toMatchObject({
      version: 4,
      started: true,
      stage: "idea",
      completedStages: [],
    });
  });

  it("advances only after the useful choice for each layer", () => {
    let progress = startFinalJourney(fresh());

    progress = { ...progress, ideaChoice: "donation" };
    expect(completeFinalStage(progress, "idea")).toBe(progress);
    progress = { ...progress, ideaChoice: "facts-email" };
    progress = completeFinalStage(progress, "idea");
    expect(progress.stage).toBe("tools");

    progress = { ...progress, toolChoice: "repository" };
    progress = completeFinalStage(progress, "tools");
    progress = {
      ...progress,
      projectHomeChoice: "route-home",
      secretChoice: "private-env",
    };
    progress = completeFinalStage(progress, "project-home");
    progress = {
      ...progress,
      aiFirstChoice: "inspect-plan",
      planApprovalChoice: "approve-step-one",
    };
    progress = completeFinalStage(progress, "ask-ai");
    progress = { ...progress, buildEvidenceChoice: "full-evidence" };
    progress = completeFinalStage(progress, "build");
    progress = {
      ...progress,
      checkAttemptChoice: "try-contact",
      repairChoice: "bounded-repair",
    };
    expect(completeFinalStage(progress, "check")).toBe(progress);
    progress = { ...progress, checkRetryChoice: "retry-contact" };
    progress = completeFinalStage(progress, "check");
    expect(progress.stage).toBe("go-live");
    progress = {
      ...progress,
      releaseVersionChoice: "v4-checked",
      releaseProofChoice: "public-path",
    };
    progress = completeFinalStage(progress, "go-live");
    progress = { ...progress, improveChoice: "source-then-page" };
    progress = completeFinalStage(progress, "improve");

    expect(progress).toMatchObject({
      stage: "completion",
      finished: true,
      checkRetryChoice: "retry-contact",
      completedStages: [
        "idea",
        "tools",
        "project-home",
        "ask-ai",
        "build",
        "check",
        "go-live",
        "improve",
      ],
    });
  });

  it("restores a valid approval substep exactly", () => {
    const restored = parseFinalProgress({
      version: 4,
      started: true,
      stage: "ask-ai",
      completedStages: ["idea", "tools", "project-home"],
      ideaChoice: "facts-email",
      toolChoice: "repository",
      projectHomeChoice: "route-home",
      secretChoice: "private-env",
      aiFirstChoice: "inspect-plan",
      planApprovalChoice: null,
      buildEvidenceChoice: null,
      checkAttemptChoice: null,
      repairChoice: null,
      checkRetryChoice: null,
      releaseVersionChoice: null,
      releaseProofChoice: null,
      improveChoice: null,
    });

    expect(restored).toMatchObject({
      stage: "ask-ai",
      completedStages: ["idea", "tools", "project-home"],
      ideaChoice: "facts-email",
      toolChoice: "repository",
      projectHomeChoice: "route-home",
      secretChoice: "private-env",
      aiFirstChoice: "inspect-plan",
      planApprovalChoice: null,
    });
  });

  it("truncates forged completion and clears unreachable choices", () => {
    const restored = parseFinalProgress({
      version: 4,
      started: true,
      stage: "completion",
      completedStages: ["idea", "tools", "project-home", "ask-ai"],
      ideaChoice: "facts-email",
      toolChoice: "repository",
      projectHomeChoice: "chat-only",
      secretChoice: "private-env",
      aiFirstChoice: "inspect-plan",
      planApprovalChoice: "approve-step-one",
      buildEvidenceChoice: "full-evidence",
      checkAttemptChoice: "try-contact",
      repairChoice: "bounded-repair",
      checkRetryChoice: "retry-contact",
      releaseVersionChoice: "v4-checked",
      releaseProofChoice: "public-path",
      improveChoice: "source-then-page",
    });

    expect(restored).toMatchObject({
      stage: "project-home",
      completedStages: ["idea", "tools"],
      projectHomeChoice: "chat-only",
      secretChoice: "private-env",
      aiFirstChoice: null,
      buildEvidenceChoice: null,
      checkRetryChoice: null,
      finished: false,
    });
  });

  it("bounds the optional Teaching Mirror draft", () => {
    const longText = "x".repeat(1_500);
    const restored = parseFinalProgress({
      version: 4,
      started: true,
      stage: "completion",
      completedStages: [
        "idea",
        "tools",
        "project-home",
        "ask-ai",
        "build",
        "check",
        "go-live",
        "improve",
      ],
      ideaChoice: "facts-email",
      toolChoice: "hosted",
      projectHomeChoice: "route-home",
      secretChoice: "private-env",
      aiFirstChoice: "inspect-plan",
      planApprovalChoice: "approve-step-one",
      buildEvidenceChoice: "full-evidence",
      checkAttemptChoice: "try-contact",
      repairChoice: "bounded-repair",
      checkRetryChoice: "retry-contact",
      releaseVersionChoice: "v4-checked",
      releaseProofChoice: "public-path",
      improveChoice: "source-then-page",
      mirrorOpen: true,
      mirrorStep: 99,
      mirrorDraft: { person: longText, toolRoute: "hosted" },
    });

    expect(restored?.mirrorStep).toBe(4);
    expect(restored?.checkRetryChoice).toBe("retry-contact");
    expect(restored?.mirrorDraft.person).toHaveLength(1_200);
    expect(restored?.mirrorDraft.toolRoute).toBe("hosted");
  });
});
