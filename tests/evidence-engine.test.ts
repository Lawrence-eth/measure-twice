import { describe, expect, it } from "vitest";

import {
  MISSION_PROGRESS_VERSION,
  buildCompetencies,
  canCompleteScene,
  contextIsUseful,
  evidenceLevel,
  evidenceScore,
  initialProgress,
  isMissionProgress,
  migrateMissionProgress,
  parseMissionProgress,
  planIsBounded,
  postRepairRerunsAreComplete,
  releaseEvidenceSnapshot,
  repairIsVerified,
  repositoryIsSafe,
  shipGateIsComplete,
  transferIsCorrect,
  type MissionProgress,
  type MissionProgressV1,
} from "@/lib/evidence-engine";
import {
  checks,
  planOptions,
  postRepairReruns,
  repositoryOptions,
  shipGate,
} from "@/lib/mission";

const RELEASE_VERSION = "8f4c2d1";
const CHECKED_AT = "2026-07-18T14:00:00.000Z";

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
    scopeDecisions: Object.fromEntries(
      planOptions.map((item) => [item.id, item.recommendedDisposition]),
    ),
    scopeReviewed: planOptions.map((item) => item.id),
    workMode: "plan",
    checksRun: checks.filter((item) => item.correct).map((item) => item.id),
    repair: {
      observed: "observed-exact",
      reproduce: "reproduce-exact",
      expected: "expected-exact",
      preserve: "preserve-verified",
    },
    repaired: true,
    diagnosed: true,
    retested: ["facts-check", "mobile-check"],
    postRepairReruns: postRepairReruns.map((item) => ({
      id: item.id,
      passed: true,
      version: RELEASE_VERSION,
      evidence: `${item.label} passed on ${RELEASE_VERSION}.`,
    })),
    // Legacy checked rows are deliberately empty on the complete v2 path.
    shipGate: [],
    releaseEvidence: {
      readme: {
        version: RELEASE_VERSION,
        reviewedAt: CHECKED_AT,
        limitationsReviewed: true,
      },
      build: {
        version: RELEASE_VERSION,
        command: "npm run build",
        exitCode: 0,
        recordedAt: CHECKED_AT,
      },
      preview: {
        version: RELEASE_VERSION,
        url: "https://preview.example.test",
        checkedAt: CHECKED_AT,
        factsPassed: true,
        corePathPassed: true,
      },
      releaseVersion: {
        commit: RELEASE_VERSION,
        recoveryVersion: "4bd91aa",
        recoveryProcedure: "Redeploy the previously verified commit from the hosting release list.",
      },
      production: {
        version: RELEASE_VERSION,
        url: "https://pentimento.example.test",
        checkedAt: CHECKED_AT,
        factsPassed: true,
        corePathPassed: true,
      },
    },
    publishApproved: true,
    published: true,
    productionChecked: true,
    transfer: {
      source: "source-receipts",
      proof: "proof-recalc",
      next: "next-bounded",
    },
    transferExplanation:
      "The receipts and approved rule prove the corrected total; the rest of the workbook remains outside this check.",
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

function legacyProgress(): MissionProgressV1 {
  const complete = completeProgress();
  return {
    scene: complete.scene,
    started: complete.started,
    arrivalChoice: complete.arrivalChoice,
    confidence: complete.confidence,
    target: complete.target,
    repository: complete.repository,
    context: complete.context.filter((item) => item !== "work-mode"),
    plan: complete.plan,
    checksRun: complete.checksRun,
    repair: complete.repair,
    repaired: true,
    retested: ["facts-check", "mobile-check"],
    shipGate: shipGate.map((item) => item.id),
    transfer: complete.transfer,
    attempts: complete.attempts,
    hints: {},
    fieldNotes: [],
    reflection: "",
  };
}

type ProgressMutator = (candidate: MissionProgress) => void;

function expectProgressRejected(mutator: ProgressMutator) {
  const candidate = structuredClone(completeProgress());
  mutator(candidate);
  expect(parseMissionProgress(candidate)).toBeNull();
}

describe("mission progress v2", () => {
  it("starts with a versioned, fully shaped v2 record", () => {
    expect(initialProgress.version).toBe(MISSION_PROGRESS_VERSION);
    expect(Object.keys(initialProgress.scopeDecisions)).toEqual(
      planOptions.map((item) => item.id),
    );
    expect(initialProgress.workMode).toBe("plan");
    expect(initialProgress.scopeReviewed).toEqual([]);
    expect(initialProgress.postRepairReruns).toEqual([]);
    expect(initialProgress.releaseEvidence).toEqual({});
    expect(initialProgress.publishApproved).toBe(false);
    expect(initialProgress.published).toBe(false);
    expect(initialProgress.productionChecked).toBe(false);
  });

  it("safely migrates v1 without turning checked ship rows into evidence", () => {
    const migrated = migrateMissionProgress(legacyProgress());

    expect(migrated?.version).toBe(2);
    expect(migrated?.migratedFromVersion).toBe(1);
    expect(migrated?.scene).toBe("radius");
    expect(migrated?.workMode).toBe("plan");
    expect(migrated?.scopeReviewed).toEqual([]);
    expect(migrated?.diagnosed).toBe(true);
    expect(migrated?.postRepairReruns.map((item) => item.id)).toEqual([
      "facts-check",
      "mobile-check",
    ]);
    expect(migrated?.releaseEvidence).toEqual({});
    expect(migrated?.publishApproved).toBe(false);
    expect(shipGateIsComplete(migrated!)).toBe(false);
  });

  it("upgrades a valid v1 object in place for the existing storage guard", () => {
    const stored: unknown = legacyProgress();

    expect(isMissionProgress(stored)).toBe(true);
    expect((stored as MissionProgress).version).toBe(2);
    expect((stored as MissionProgress).migratedFromVersion).toBe(1);
    expect((stored as MissionProgress).releaseEvidence).toEqual({});
  });

  it("rejects malformed or unknown progress instead of preserving unsafe values", () => {
    const unknownFile = completeProgress() as MissionProgress;
    unknownFile.repository = [...unknownFile.repository, "private-export.csv"];
    expect(parseMissionProgress(unknownFile)).toBeNull();

    const missingDisposition = structuredClone(completeProgress()) as MissionProgress;
    delete missingDisposition.scopeDecisions[planOptions[0].id];
    expect(parseMissionProgress(missingDisposition)).toBeNull();

    const invalidUrl = structuredClone(completeProgress()) as MissionProgress;
    invalidUrl.releaseEvidence.preview!.url = "javascript:alert(1)";
    expect(parseMissionProgress(invalidUrl)).toBeNull();
  });

  it.each<[string, ProgressMutator]>([
    ["unknown scene", (value) => { (value as unknown as { scene: string }).scene = "unknown"; }],
    ["non-boolean started state", (value) => { (value as unknown as { started: string }).started = "yes"; }],
    ["unknown arrival decision", (value) => { value.arrivalChoice = "trust-everything"; }],
    ["unsupported confidence value", (value) => { (value.confidence as Record<string, unknown>).arrival = 1; }],
    ["unknown confidence field", (value) => { (value.confidence as Record<string, unknown>).ship = 0.7; }],
    ["unknown target answer", (value) => { value.target.audience = "everyone-always"; }],
    ["unknown target field", (value) => { (value.target as Record<string, unknown>).budget = "none"; }],
    ["unknown repair answer", (value) => { value.repair.observed = "looks-bad"; }],
    ["unknown transfer answer", (value) => { value.transfer.source = "ai-said-so"; }],
    ["attempt below zero", (value) => { value.attempts.arrival = -1; }],
    ["attempt above the bound", (value) => { value.attempts.arrival = 101; }],
    ["hint above the bound", (value) => { value.hints.arrival = 4; }],
    ["unknown scene counter", (value) => { (value.attempts as Record<string, unknown>).unknown = 1; }],
    ["unknown repository item", (value) => { value.repository.push("private-export.csv"); }],
    ["unknown context item", (value) => { value.context.push("whole-hard-drive"); }],
    ["unknown plan item", (value) => { value.plan.push("rewrite-everything"); }],
    ["unknown evidence check", (value) => { value.checksRun.push("ai-assurance"); }],
    ["unknown legacy rerun", (value) => { value.retested.push("visual-vibes"); }],
    ["unknown legacy ship row", (value) => { value.shipGate.push("self-attested"); }],
    ["unknown field note", (value) => { value.fieldNotes.push("hidden-answer"); }],
    ["non-boolean repaired state", (value) => { (value as unknown as { repaired: string }).repaired = "yes"; }],
    ["oversized reflection", (value) => { value.reflection = "x".repeat(601); }],
    ["invalid scope disposition", (value) => { (value.scopeDecisions as Record<string, unknown>).accounts = "later"; }],
    ["unknown scope item", (value) => { (value.scopeDecisions as Record<string, unknown>).surprise = "keep"; }],
    ["unknown reviewed scope item", (value) => { value.scopeReviewed.push("surprise"); }],
    ["unknown work mode", (value) => { (value as unknown as { workMode: string }).workMode = "autopilot"; }],
    ["non-boolean diagnosis", (value) => { (value as unknown as { diagnosed: string }).diagnosed = "yes"; }],
    ["duplicate post-repair rerun", (value) => { value.postRepairReruns.push({ ...value.postRepairReruns[0] }); }],
    ["non-boolean rerun result", (value) => { (value.postRepairReruns[0] as unknown as { passed: string }).passed = "yes"; }],
    ["blank rerun version", (value) => { value.postRepairReruns[0].version = " "; }],
    ["blank rerun evidence", (value) => { value.postRepairReruns[0].evidence = " "; }],
    ["unknown release evidence key", (value) => { (value.releaseEvidence as Record<string, unknown>).wish = {}; }],
    ["invalid README review time", (value) => { value.releaseEvidence.readme!.reviewedAt = "someday"; }],
    ["non-boolean README review", (value) => { (value.releaseEvidence.readme as unknown as { limitationsReviewed: string }).limitationsReviewed = "yes"; }],
    ["blank build command", (value) => { value.releaseEvidence.build!.command = " "; }],
    ["build exit below range", (value) => { value.releaseEvidence.build!.exitCode = -1; }],
    ["build exit above range", (value) => { value.releaseEvidence.build!.exitCode = 256; }],
    ["invalid build record time", (value) => { value.releaseEvidence.build!.recordedAt = "not-a-date"; }],
    ["unsafe hosted URL", (value) => { value.releaseEvidence.preview!.url = "javascript:alert(1)"; }],
    ["invalid hosted check time", (value) => { value.releaseEvidence.production!.checkedAt = "later"; }],
    ["non-boolean hosted result", (value) => { (value.releaseEvidence.preview as unknown as { factsPassed: string }).factsPassed = "yes"; }],
    ["blank release commit", (value) => { value.releaseEvidence.releaseVersion!.commit = " "; }],
    ["blank recovery version", (value) => { value.releaseEvidence.releaseVersion!.recoveryVersion = " "; }],
    ["blank recovery procedure", (value) => { value.releaseEvidence.releaseVersion!.recoveryProcedure = " "; }],
    ["non-boolean publish approval", (value) => { (value as unknown as { publishApproved: string }).publishApproved = "yes"; }],
    ["non-boolean publication", (value) => { (value as unknown as { published: string }).published = "yes"; }],
    ["non-boolean production check", (value) => { (value as unknown as { productionChecked: string }).productionChecked = "yes"; }],
    ["oversized transfer reasoning", (value) => { value.transferExplanation = "x".repeat(1_001); }],
    ["unknown active evidence check", (value) => { value.activeEvidenceCheck = "trust-me"; }],
    ["unsupported migration marker", (value) => { (value as unknown as { migratedFromVersion: number }).migratedFromVersion = 2; }],
    ["unsupported storage version", (value) => { (value as unknown as { version: number }).version = 99; }],
  ])("rejects %s at the persistence boundary", (_label, mutator) => {
    expectProgressRejected(mutator);
  });
});

describe("bounded decisions and evidence", () => {
  it("requires the independent-inspection decision at the beginner-friendly first-look gate", () => {
    const progress = completeProgress();
    progress.arrivalChoice = "";
    expect(canCompleteScene(progress, "arrival")).toBe(false);

    progress.arrivalChoice = "ship";
    expect(canCompleteScene(progress, "arrival")).toBe(false);

    progress.arrivalChoice = "inspect";
    delete progress.confidence.arrival;
    expect(canCompleteScene(progress, "arrival")).toBe(true);
  });

  it("requires every target answer to match the observable outcome", () => {
    const progress = completeProgress();
    progress.target.outcome = "outcome-impressive";
    expect(canCompleteScene(progress, "target")).toBe(false);
  });

  it("rejects a repository that contains a real credential", () => {
    const progress = completeProgress();
    progress.repository.push("api-key");

    expect(repositoryIsSafe(progress)).toBe(false);
    expect(canCompleteScene(progress, "record")).toBe(false);
  });

  it("requires Plan mode and a useful handoff", () => {
    const progress = completeProgress();
    progress.workMode = "implement";

    expect(contextIsUseful(progress)).toBe(false);
    expect(canCompleteScene(progress, "handoff")).toBe(false);
  });

  it("requires an explicit correct disposition for every proposed item", () => {
    const progress = completeProgress();
    expect(planIsBounded(progress)).toBe(true);

    progress.scopeDecisions.accounts = "keep";
    expect(planIsBounded(progress)).toBe(false);

    progress.scopeDecisions.accounts = "defer";
    progress.scopeDecisions["joining-flow"] = "defer";
    expect(planIsBounded(progress)).toBe(false);
  });

  it("requires the learner to review even a preselected Keep disposition", () => {
    const progress = completeProgress();
    progress.scopeReviewed = progress.scopeReviewed.filter((id) => id !== "facts-section");

    expect(progress.scopeDecisions["facts-section"]).toBe("keep");
    expect(planIsBounded(progress)).toBe(false);
    expect(canCompleteScene(progress, "radius")).toBe(false);
  });

  it("requires confidence at the scope and transfer gates", () => {
    const progress = completeProgress();
    delete progress.confidence.radius;
    expect(canCompleteScene(progress, "radius")).toBe(false);

    progress.confidence.radius = 0.9;
    delete progress.confidence.transfer;
    expect(canCompleteScene(progress, "transfer")).toBe(false);
  });

  it("opens replay only for a valid persisted mission record", () => {
    expect(canCompleteScene(completeProgress(), "replay")).toBe(true);
    const malformed = completeProgress();
    malformed.repository.push("unknown-file");
    expect(canCompleteScene(malformed, "replay")).toBe(false);
  });

  it("does not treat asking AI again as an independent check", () => {
    const progress = completeProgress();
    progress.checksRun = [
      "facts-check",
      "mobile-check",
      "keyboard-check",
      "secret-check",
      "execution-log",
      "ask-again",
    ];

    expect(canCompleteScene(progress, "check")).toBe(false);
  });

  it("requires diagnosis and five passing reruns from the same repaired version", () => {
    const progress = completeProgress();
    expect(postRepairRerunsAreComplete(progress)).toBe(true);
    expect(repairIsVerified(progress)).toBe(true);

    progress.diagnosed = false;
    expect(repairIsVerified(progress)).toBe(false);

    progress.diagnosed = true;
    progress.postRepairReruns = progress.postRepairReruns.filter(
      (item) => item.id !== "email-destination-check",
    );
    expect(repairIsVerified(progress)).toBe(false);

    progress.postRepairReruns = completeProgress().postRepairReruns;
    progress.postRepairReruns[0].version = "different-version";
    expect(repairIsVerified(progress)).toBe(false);
  });

  it("never lets the legacy retested list satisfy the v2 repair gate", () => {
    const progress = completeProgress();
    progress.postRepairReruns = [];
    progress.retested = postRepairReruns.map((item) => item.id);

    expect(postRepairRerunsAreComplete(progress)).toBe(false);
    expect(canCompleteScene(progress, "evolve")).toBe(false);
  });
});

describe("generated release evidence", () => {
  it("completes release from version-matched evidence without checked ship rows", () => {
    const progress = completeProgress();
    expect(progress.shipGate).toEqual([]);

    const rows = releaseEvidenceSnapshot(progress);
    expect(rows).toHaveLength(shipGate.length);
    expect(rows.every((item) => item.status === "pass")).toBe(true);
    expect(shipGateIsComplete(progress)).toBe(true);
    expect(canCompleteScene(progress, "ship")).toBe(true);
  });

  it("does not let every legacy ship checkbox manufacture release evidence", () => {
    const progress = completeProgress();
    progress.shipGate = shipGate.map((item) => item.id);
    progress.releaseEvidence = {};
    progress.publishApproved = false;
    progress.published = false;
    progress.productionChecked = false;

    const rows = releaseEvidenceSnapshot(progress);
    expect(rows.some((item) => item.status === "missing")).toBe(true);
    expect(shipGateIsComplete(progress)).toBe(false);
  });

  it("requires README, build, preview, and release actions tied to one exact version", () => {
    const progress = completeProgress();
    progress.releaseEvidence.build!.version = "other-commit";

    expect(
      releaseEvidenceSnapshot(progress).find((item) => item.id === "build-pass")?.status,
    ).toBe("missing");
    expect(shipGateIsComplete(progress)).toBe(false);

    progress.releaseEvidence.build!.version = RELEASE_VERSION;
    progress.releaseEvidence.preview!.corePathPassed = false;
    expect(
      releaseEvidenceSnapshot(progress).find((item) => item.id === "preview-pass")?.status,
    ).toBe("fail");
    expect(shipGateIsComplete(progress)).toBe(false);
  });

  it.each([
    ["approval", (progress: MissionProgress) => { progress.publishApproved = false; }],
    ["publication", (progress: MissionProgress) => { progress.published = false; }],
    ["production smoke", (progress: MissionProgress) => { progress.productionChecked = false; }],
  ])("requires explicit %s before release completion", (_label, removeEvidence) => {
    const progress = completeProgress();
    removeEvidence(progress);

    expect(shipGateIsComplete(progress)).toBe(false);
  });
});

describe("transfer and transparent support labels", () => {
  it("requires the learner to explain what is proved and what remains uncertain", () => {
    const progress = completeProgress();
    expect(transferIsCorrect(progress)).toBe(true);

    progress.transferExplanation = "The total is right.";
    expect(transferIsCorrect(progress)).toBe(false);
    expect(canCompleteScene(progress, "transfer")).toBe(false);

    progress.transferExplanation =
      "The receipts prove the corrected total, while formulas elsewhere in the workbook remain unchecked.";
    expect(transferIsCorrect(progress)).toBe(true);
  });

  it("reports independent evidence on an unassisted first attempt", () => {
    const progress = completeProgress();
    const competencies = buildCompetencies(progress);

    expect(evidenceScore(progress)).toBe(100);
    expect(evidenceLevel(progress)).toBe("Independent");
    expect(competencies).toHaveLength(7);
    expect(competencies.every((item) => item.support === "independent")).toBe(true);
    expect(competencies.every((item) => item.rating === 3)).toBe(true);
  });

  it("uses explicit revision/support labels instead of hidden hint thresholds", () => {
    const revised = completeProgress();
    revised.attempts.target = 2;
    expect(buildCompetencies(revised).find((item) => item.id === "target")?.support)
      .toBe("after revision");

    const supportedOnce = completeProgress();
    supportedOnce.hints.record = 1;
    const supportedThree = completeProgress();
    supportedThree.hints.record = 3;

    const one = buildCompetencies(supportedOnce).find((item) => item.id === "record");
    const three = buildCompetencies(supportedThree).find((item) => item.id === "record");
    expect(one?.support).toBe("with support");
    expect(three?.support).toBe("with support");
    expect(one?.rating).toBe(three?.rating);
  });

  it("marks missing observable evidence as not yet", () => {
    const progress = completeProgress();
    progress.target.outcome = "outcome-impressive";

    const target = buildCompetencies(progress).find((item) => item.id === "target");
    expect(target?.support).toBe("not yet");
    expect(target?.rating).toBe(0);
  });

  it("records confidence without rewarding an unsupported first impression", () => {
    const progress = completeProgress();
    progress.arrivalChoice = "ship";
    progress.confidence.arrival = 0.9;

    const inspect = buildCompetencies(progress).find((item) => item.id === "inspect");
    expect(inspect?.support).toBe("after revision");
    expect(evidenceScore(progress)).toBeLessThan(100);
  });
});
