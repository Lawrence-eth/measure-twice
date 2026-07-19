import {
  projectHomeSteps,
  releaseStages,
  repairCafeBuildCycles,
  repairCafeDefects,
  repairCafeFeatureDecisions,
  versionRibbon,
} from "@/lib/studio";

export const STUDIO_STORAGE_KEY = "pentimento-studio-v3";

export const studioStages = [
  "welcome",
  "map",
  "reveal",
  "idea",
  "tools",
  "home",
  "ask",
  "build",
  "check",
  "live",
  "improve",
  "playbook",
] as const;

export const learningStages = [
  "idea",
  "tools",
  "home",
  "ask",
  "build",
  "check",
  "live",
  "improve",
] as const;

export type StudioStage = (typeof studioStages)[number];
export type LearningStage = (typeof learningStages)[number];
export type ToolLane = "hosted" | "repository";
export type FeatureDisposition = "now" | "later";
export type BuildPhase = "ask" | "inspect" | "run" | "check" | "save";

export type MirrorDraft = {
  person: string;
  situation: string;
  usefulResult: string;
  completePath: string;
  trustedFacts: string;
  mustHave: string;
  notNow: string;
  doneWhen: string;
};

export type StudioProgress = {
  version: 3;
  started: boolean;
  stage: StudioStage;
  completedStages: LearningStage[];
  revealPercent: number;
  featureDecisions: Record<string, FeatureDisposition>;
  ideaStep: number;
  toolLane: ToolLane | null;
  foundationStep: number;
  promptParts: string[];
  planApproved: boolean;
  buildCycle: number;
  buildPhase: BuildPhase;
  checksRun: string[];
  repairPrepared: boolean;
  repairApplied: boolean;
  versionFocus: number;
  releaseStep: number;
  improveStep: number;
  mirrorDraft: MirrorDraft;
  finished: boolean;
};

export const initialMirrorDraft: MirrorDraft = {
  person: "",
  situation: "",
  usefulResult: "",
  completePath: "",
  trustedFacts: "",
  mustHave: "",
  notNow: "",
  doneWhen: "",
};

export const initialStudioProgress: StudioProgress = {
  version: 3,
  started: false,
  stage: "welcome",
  completedStages: [],
  revealPercent: 52,
  featureDecisions: {},
  ideaStep: 0,
  toolLane: null,
  foundationStep: 0,
  promptParts: [],
  planApproved: false,
  buildCycle: 0,
  buildPhase: "ask",
  checksRun: [],
  repairPrepared: false,
  repairApplied: false,
  versionFocus: 0,
  releaseStep: 0,
  improveStep: 0,
  mirrorDraft: { ...initialMirrorDraft },
  finished: false,
};

const stageSet = new Set<string>(studioStages);
const laneSet = new Set<string>(["hosted", "repository"]);
const dispositionSet = new Set<string>(["now", "later"]);
const phaseSet = new Set<string>(["ask", "inspect", "run", "check", "save"]);
const promptGroupIds = ["purpose", "truth", "limits", "mode", "done"] as const;
const defectIds = repairCafeDefects.map((defect) => defect.id);
const featureNames = new Set(
  repairCafeFeatureDecisions.map((decision) => decision.feature),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function orderedPrefix(
  value: unknown,
  expectedOrder: readonly string[],
): string[] {
  if (!Array.isArray(value)) return [];

  const prefix: string[] = [];
  for (let index = 0; index < expectedOrder.length; index += 1) {
    if (value[index] !== expectedOrder[index]) break;
    prefix.push(expectedOrder[index]);
  }
  return prefix;
}

function boundedInteger(value: unknown, maximum: number): number {
  if (typeof value !== "number" || !Number.isInteger(value)) return 0;
  return Math.max(0, Math.min(maximum, value));
}

function boundedPercent(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 52;
  return Math.max(12, Math.min(88, Math.round(value)));
}

function mirrorDraft(value: unknown): MirrorDraft {
  if (!isRecord(value)) return { ...initialMirrorDraft };

  return Object.fromEntries(
    Object.keys(initialMirrorDraft).map((key) => [
      key,
      typeof value[key] === "string" ? value[key].slice(0, 1_200) : "",
    ]),
  ) as MirrorDraft;
}

function featureDecisions(value: unknown): Record<string, FeatureDisposition> {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, FeatureDisposition] =>
        featureNames.has(entry[0]) && dispositionSet.has(String(entry[1])),
    ),
  );
}

function safeIdeaStep(
  value: unknown,
  decisions: Record<string, FeatureDisposition>,
): number {
  const requested = boundedInteger(value, repairCafeFeatureDecisions.length);
  let reachable = 0;

  while (
    reachable < requested &&
    decisions[repairCafeFeatureDecisions[reachable].feature]
  ) {
    reachable += 1;
  }
  return reachable;
}

function safeStage(
  value: unknown,
  started: boolean,
  completedStages: readonly LearningStage[],
): StudioStage {
  if (!started) return "welcome";

  const candidate =
    typeof value === "string" && stageSet.has(value)
      ? (value as StudioStage)
      : "welcome";

  if (candidate === "playbook" && completedStages.length < learningStages.length) {
    return learningStages[completedStages.length];
  }

  const learningIndex = learningStages.indexOf(candidate as LearningStage);
  if (learningIndex > completedStages.length) {
    return learningStages[completedStages.length];
  }

  return candidate;
}

export function parseStudioProgress(value: unknown): StudioProgress | null {
  if (!isRecord(value) || value.version !== 3) return null;

  const started = value.started === true;
  const completedStages = orderedPrefix(
    value.completedStages,
    learningStages,
  ) as LearningStage[];
  const stage = safeStage(value.stage, started, completedStages);
  const toolLane = typeof value.toolLane === "string" && laneSet.has(value.toolLane)
    ? (value.toolLane as ToolLane)
    : null;
  const buildPhase = typeof value.buildPhase === "string" && phaseSet.has(value.buildPhase)
    ? (value.buildPhase as BuildPhase)
    : "ask";
  const decisions = featureDecisions(value.featureDecisions);
  const promptParts = orderedPrefix(value.promptParts, promptGroupIds);
  const checksRun = orderedPrefix(value.checksRun, defectIds);
  const planApproved =
    value.planApproved === true && promptParts.length === promptGroupIds.length;
  const repairPrepared =
    value.repairPrepared === true && checksRun.length === defectIds.length;
  const repairApplied = value.repairApplied === true && repairPrepared;
  const finished =
    value.finished === true &&
    stage === "playbook" &&
    completedStages.length === learningStages.length;

  return {
    version: 3,
    started,
    stage,
    completedStages,
    revealPercent: boundedPercent(value.revealPercent),
    featureDecisions: decisions,
    ideaStep: safeIdeaStep(value.ideaStep, decisions),
    toolLane,
    foundationStep: boundedInteger(value.foundationStep, projectHomeSteps.length),
    promptParts,
    planApproved,
    buildCycle: boundedInteger(value.buildCycle, repairCafeBuildCycles.length),
    buildPhase,
    checksRun,
    repairPrepared,
    repairApplied,
    versionFocus: boundedInteger(value.versionFocus, versionRibbon.length - 2),
    releaseStep: boundedInteger(value.releaseStep, releaseStages.length),
    improveStep: boundedInteger(value.improveStep, 4),
    mirrorDraft: mirrorDraft(value.mirrorDraft),
    finished,
  };
}

export function completeLearningStage(
  progress: StudioProgress,
  stage: LearningStage,
  nextStage: StudioStage,
): StudioProgress {
  return {
    ...progress,
    stage: nextStage,
    completedStages: progress.completedStages.includes(stage)
      ? progress.completedStages
      : [...progress.completedStages, stage],
  };
}
