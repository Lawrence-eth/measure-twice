import {
  finalLearningStages,
  finalStages,
  playbookIndex,
  type AffectedCheckChoice,
  type AiFirstChoice,
  type BuildEvidenceChoice,
  type CheckAttemptChoice,
  type CheckRetryChoice,
  type FinalLearningStage,
  type FinalStage,
  type IdeaChoice,
  type ImproveChoice,
  type PlanApprovalChoice,
  type PlaybookCardId,
  type ProjectHomeChoice,
  type ReleaseProofChoice,
  type ReleaseVersionChoice,
  type RepairChoice,
  type SecretChoice,
  type ToolChoice,
  type ToolRoute,
} from "@/lib/final-journey";

export const FINAL_PROGRESS_VERSION = 4;
export const FINAL_STORAGE_KEY = "pentimento-studio-v4";
export const FINAL_STUDIO_STORAGE_KEY = FINAL_STORAGE_KEY;

export type FinalMirrorDraft = {
  person: string;
  situation: string;
  usefulResult: string;
  completePath: string;
  trustedFacts: string;
  mustHave: string;
  notNow: string;
  doneWhen: string;
  toolRoute: ToolRoute | "";
};

/** A compatibility-friendly name for consumers that already use MirrorDraft. */
export type MirrorDraft = FinalMirrorDraft;

export type FinalProgress = {
  version: 4;
  started: boolean;
  stage: FinalStage;
  completedStages: FinalLearningStage[];
  introFailureObserved: boolean;

  ideaChoice: IdeaChoice | null;
  toolChoice: ToolChoice | null;
  projectHomeChoice: ProjectHomeChoice | null;
  secretChoice: SecretChoice | null;
  aiFirstChoice: AiFirstChoice | null;
  planApprovalChoice: PlanApprovalChoice | null;
  buildEvidenceChoice: BuildEvidenceChoice | null;
  checkAttemptChoice: CheckAttemptChoice | null;
  repairChoice: RepairChoice | null;
  checkRetryChoice: CheckRetryChoice | null;
  releaseVersionChoice: ReleaseVersionChoice | null;
  releaseProofChoice: ReleaseProofChoice | null;
  improveChoice: ImproveChoice | null;
  affectedCheckChoice: AffectedCheckChoice | null;

  toolDecoderOpen: boolean;
  playbookOpen: boolean;
  activePlaybookCard: PlaybookCardId | null;
  mirrorOpen: boolean;
  mirrorStep: 1 | 2 | 3 | 4;
  mirrorDraft: FinalMirrorDraft;
  finished: boolean;
};

export const initialFinalMirrorDraft: FinalMirrorDraft = {
  person: "",
  situation: "",
  usefulResult: "",
  completePath: "",
  trustedFacts: "",
  mustHave: "",
  notNow: "",
  doneWhen: "",
  toolRoute: "",
};

export const initialMirrorDraft = initialFinalMirrorDraft;

export const initialFinalProgress: FinalProgress = {
  version: 4,
  started: false,
  stage: "welcome",
  completedStages: [],
  introFailureObserved: false,

  ideaChoice: null,
  toolChoice: null,
  projectHomeChoice: null,
  secretChoice: null,
  aiFirstChoice: null,
  planApprovalChoice: null,
  buildEvidenceChoice: null,
  checkAttemptChoice: null,
  repairChoice: null,
  checkRetryChoice: null,
  releaseVersionChoice: null,
  releaseProofChoice: null,
  improveChoice: null,
  affectedCheckChoice: null,

  toolDecoderOpen: false,
  playbookOpen: false,
  activePlaybookCard: null,
  mirrorOpen: false,
  mirrorStep: 1,
  mirrorDraft: { ...initialFinalMirrorDraft },
  finished: false,
};

type ParsedChoices = Pick<
  FinalProgress,
  | "ideaChoice"
  | "toolChoice"
  | "projectHomeChoice"
  | "secretChoice"
  | "aiFirstChoice"
  | "planApprovalChoice"
  | "buildEvidenceChoice"
  | "checkAttemptChoice"
  | "repairChoice"
  | "checkRetryChoice"
  | "releaseVersionChoice"
  | "releaseProofChoice"
  | "improveChoice"
  | "affectedCheckChoice"
>;

const stageSet = new Set<string>(finalStages);
const ideaChoiceSet = new Set<string>([
  "facts-email",
  "booking",
  "donation",
]);
const toolChoiceSet = new Set<string>(["hosted", "repository"]);
const projectHomeChoiceSet = new Set<string>(["chat-only", "route-home"]);
const secretChoiceSet = new Set<string>(["project-files", "private-env"]);
const aiFirstChoiceSet = new Set<string>([
  "build-everything",
  "inspect-plan",
]);
const planApprovalChoiceSet = new Set<string>([
  "approve-step-one",
  "revise-step-one",
]);
const buildEvidenceChoiceSet = new Set<string>([
  "ai-claim",
  "preview-only",
  "full-evidence",
]);
const checkAttemptChoiceSet = new Set<string>(["try-contact"]);
const repairChoiceSet = new Set<string>(["redesign", "bounded-repair"]);
const checkRetryChoiceSet = new Set<string>(["retry-contact"]);
const releaseVersionChoiceSet = new Set<string>([
  "v3-broken",
  "v4-checked",
]);
const releaseProofChoiceSet = new Set<string>([
  "dashboard-success",
  "public-path",
]);
const improveChoiceSet = new Set<string>([
  "page-only",
  "source-then-page",
  "redesign-everything",
]);
const affectedCheckChoiceSet = new Set<string>([
  "affected-plus-smoke",
  "surface-only",
  "retest-redesign",
]);
const playbookCardSet = new Set<string>(playbookIndex.map((card) => card.id));

const MAX_MIRROR_FIELD_LENGTH = 1_200;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactChoice<T extends string>(
  value: unknown,
  allowed: ReadonlySet<string>,
): T | null {
  return typeof value === "string" && allowed.has(value)
    ? (value as T)
    : null;
}

function orderedCompletedPrefix(value: unknown): FinalLearningStage[] {
  if (!Array.isArray(value)) return [];

  const prefix: FinalLearningStage[] = [];
  for (let index = 0; index < finalLearningStages.length; index += 1) {
    if (value[index] !== finalLearningStages[index]) break;
    prefix.push(finalLearningStages[index]);
  }
  return prefix;
}

function parseChoices(value: Record<string, unknown>): ParsedChoices {
  return {
    ideaChoice: exactChoice<IdeaChoice>(value.ideaChoice, ideaChoiceSet),
    toolChoice: exactChoice<ToolChoice>(value.toolChoice, toolChoiceSet),
    projectHomeChoice: exactChoice<ProjectHomeChoice>(
      value.projectHomeChoice,
      projectHomeChoiceSet,
    ),
    secretChoice: exactChoice<SecretChoice>(
      value.secretChoice,
      secretChoiceSet,
    ),
    aiFirstChoice: exactChoice<AiFirstChoice>(
      value.aiFirstChoice,
      aiFirstChoiceSet,
    ),
    planApprovalChoice: exactChoice<PlanApprovalChoice>(
      value.planApprovalChoice,
      planApprovalChoiceSet,
    ),
    buildEvidenceChoice: exactChoice<BuildEvidenceChoice>(
      value.buildEvidenceChoice,
      buildEvidenceChoiceSet,
    ),
    checkAttemptChoice: exactChoice<CheckAttemptChoice>(
      value.checkAttemptChoice,
      checkAttemptChoiceSet,
    ),
    repairChoice: exactChoice<RepairChoice>(
      value.repairChoice,
      repairChoiceSet,
    ),
    checkRetryChoice: exactChoice<CheckRetryChoice>(
      value.checkRetryChoice,
      checkRetryChoiceSet,
    ),
    releaseVersionChoice: exactChoice<ReleaseVersionChoice>(
      value.releaseVersionChoice,
      releaseVersionChoiceSet,
    ),
    releaseProofChoice: exactChoice<ReleaseProofChoice>(
      value.releaseProofChoice,
      releaseProofChoiceSet,
    ),
    improveChoice: exactChoice<ImproveChoice>(
      value.improveChoice,
      improveChoiceSet,
    ),
    affectedCheckChoice: exactChoice<AffectedCheckChoice>(
      value.affectedCheckChoice,
      affectedCheckChoiceSet,
    ),
  };
}

function choicesCompleteStage(
  choices: ParsedChoices,
  stage: FinalLearningStage,
): boolean {
  switch (stage) {
    case "idea":
      return choices.ideaChoice === "facts-email";
    case "tools":
      return choices.toolChoice !== null;
    case "project-home":
      return (
        choices.projectHomeChoice === "route-home" &&
        choices.secretChoice === "private-env"
      );
    case "ask-ai":
      return (
        choices.aiFirstChoice === "inspect-plan" &&
        choices.planApprovalChoice === "approve-step-one"
      );
    case "build":
      return choices.buildEvidenceChoice === "full-evidence";
    case "check":
      return (
        choices.checkAttemptChoice === "try-contact" &&
        choices.repairChoice === "bounded-repair" &&
        choices.checkRetryChoice === "retry-contact"
      );
    case "go-live":
      return (
        choices.releaseVersionChoice === "v4-checked" &&
        choices.releaseProofChoice === "public-path"
      );
    case "improve":
      return choices.improveChoice === "source-then-page";
  }
}

function safeCompletedStages(
  value: unknown,
  choices: ParsedChoices,
): FinalLearningStage[] {
  const ordered = orderedCompletedPrefix(value);
  const completed: FinalLearningStage[] = [];

  for (const stage of ordered) {
    if (!choicesCompleteStage(choices, stage)) break;
    completed.push(stage);
  }

  return completed;
}

function nextReachableStage(
  completedStages: readonly FinalLearningStage[],
): FinalStage {
  return (
    finalLearningStages[completedStages.length] ??
    ("completion" satisfies FinalStage)
  );
}

function safeStage(
  value: unknown,
  started: boolean,
  completedStages: readonly FinalLearningStage[],
): FinalStage {
  if (!started) return "welcome";

  const fallback = nextReachableStage(completedStages);
  if (
    typeof value !== "string" ||
    !stageSet.has(value) ||
    value === "welcome"
  ) {
    return fallback;
  }

  const candidate = value as FinalStage;
  if (candidate === "completion") {
    return completedStages.length === finalLearningStages.length
      ? candidate
      : fallback;
  }

  const candidateIndex = finalLearningStages.indexOf(
    candidate as FinalLearningStage,
  );
  return candidateIndex <= completedStages.length ? candidate : fallback;
}

function stageHasBeenReached(
  completedStages: readonly FinalLearningStage[],
  stage: FinalLearningStage,
): boolean {
  const index = finalLearningStages.indexOf(stage);
  return index >= 0 && index <= completedStages.length;
}

function clearUnreachableChoices(
  choices: ParsedChoices,
  completedStages: readonly FinalLearningStage[],
): ParsedChoices {
  return {
    ideaChoice: stageHasBeenReached(completedStages, "idea")
      ? choices.ideaChoice
      : null,
    toolChoice: stageHasBeenReached(completedStages, "tools")
      ? choices.toolChoice
      : null,
    projectHomeChoice: stageHasBeenReached(completedStages, "project-home")
      ? choices.projectHomeChoice
      : null,
    secretChoice: stageHasBeenReached(completedStages, "project-home")
      ? choices.secretChoice
      : null,
    aiFirstChoice: stageHasBeenReached(completedStages, "ask-ai")
      ? choices.aiFirstChoice
      : null,
    planApprovalChoice: stageHasBeenReached(completedStages, "ask-ai")
      ? choices.planApprovalChoice
      : null,
    buildEvidenceChoice: stageHasBeenReached(completedStages, "build")
      ? choices.buildEvidenceChoice
      : null,
    checkAttemptChoice: stageHasBeenReached(completedStages, "check")
      ? choices.checkAttemptChoice
      : null,
    repairChoice: stageHasBeenReached(completedStages, "check")
      ? choices.repairChoice
      : null,
    checkRetryChoice: stageHasBeenReached(completedStages, "check")
      ? choices.checkRetryChoice
      : null,
    releaseVersionChoice: stageHasBeenReached(completedStages, "go-live")
      ? choices.releaseVersionChoice
      : null,
    releaseProofChoice: stageHasBeenReached(completedStages, "go-live")
      ? choices.releaseProofChoice
      : null,
    improveChoice: stageHasBeenReached(completedStages, "improve")
      ? choices.improveChoice
      : null,
    affectedCheckChoice: stageHasBeenReached(completedStages, "improve")
      ? choices.affectedCheckChoice
      : null,
  };
}

function boundedMirrorStep(value: unknown): 1 | 2 | 3 | 4 {
  if (typeof value !== "number" || !Number.isInteger(value)) return 1;
  return Math.max(1, Math.min(4, value)) as 1 | 2 | 3 | 4;
}

function safeMirrorText(value: unknown): string {
  return typeof value === "string"
    ? value.slice(0, MAX_MIRROR_FIELD_LENGTH)
    : "";
}

function safeMirrorDraft(value: unknown): FinalMirrorDraft {
  if (!isRecord(value)) return { ...initialFinalMirrorDraft };

  return {
    person: safeMirrorText(value.person),
    situation: safeMirrorText(value.situation),
    usefulResult: safeMirrorText(value.usefulResult),
    completePath: safeMirrorText(value.completePath),
    trustedFacts: safeMirrorText(value.trustedFacts),
    mustHave: safeMirrorText(value.mustHave),
    notNow: safeMirrorText(value.notNow),
    doneWhen: safeMirrorText(value.doneWhen),
    toolRoute:
      value.toolRoute === "hosted" || value.toolRoute === "repository"
        ? value.toolRoute
        : "",
  };
}

function freshInitialProgress(): FinalProgress {
  return {
    ...initialFinalProgress,
    completedStages: [],
    mirrorDraft: { ...initialFinalMirrorDraft },
  };
}

/**
 * Parse untrusted persisted data. Only version 4 is accepted; version 3 is
 * intentionally not migrated because the route and interaction model changed.
 */
export function parseFinalProgress(value: unknown): FinalProgress | null {
  if (!isRecord(value) || value.version !== FINAL_PROGRESS_VERSION) return null;

  const started = value.started === true;
  if (!started) return freshInitialProgress();

  const parsedChoices = parseChoices(value);
  const completedStages = safeCompletedStages(
    value.completedStages,
    parsedChoices,
  );
  const choices = clearUnreachableChoices(parsedChoices, completedStages);
  const stage = safeStage(value.stage, started, completedStages);
  const routeComplete =
    completedStages.length === finalLearningStages.length;
  const completionAvailable = routeComplete && stage === "completion";
  const toolsReached = stageHasBeenReached(completedStages, "tools");

  const activePlaybookCard =
    completionAvailable &&
    typeof value.activePlaybookCard === "string" &&
    playbookCardSet.has(value.activePlaybookCard)
      ? (value.activePlaybookCard as PlaybookCardId)
      : null;

  return {
    version: 4,
    started,
    stage,
    completedStages,
    introFailureObserved: value.introFailureObserved === true,
    ...choices,
    toolDecoderOpen: toolsReached && value.toolDecoderOpen === true,
    playbookOpen: completionAvailable && value.playbookOpen === true,
    activePlaybookCard,
    mirrorOpen: completionAvailable && value.mirrorOpen === true,
    mirrorStep: completionAvailable ? boundedMirrorStep(value.mirrorStep) : 1,
    mirrorDraft: completionAvailable
      ? safeMirrorDraft(value.mirrorDraft)
      : { ...initialFinalMirrorDraft },
    finished: completionAvailable,
  };
}

/**
 * Parse the localStorage payload without allowing invalid JSON to escape.
 */
export function parseStoredFinalProgress(
  serialized: string | null,
): FinalProgress | null {
  if (serialized === null) return null;

  try {
    return parseFinalProgress(JSON.parse(serialized) as unknown);
  } catch {
    return null;
  }
}

export function serializeFinalProgress(progress: FinalProgress): string {
  return JSON.stringify(progress);
}

export function startFinalJourney(
  progress: FinalProgress = initialFinalProgress,
): FinalProgress {
  if (progress.started) return progress;
  return {
    ...freshInitialProgress(),
    started: true,
    stage: "idea",
  };
}

export function canCompleteFinalStage(
  progress: FinalProgress,
  stage: FinalLearningStage,
): boolean {
  const expectedStage = finalLearningStages[progress.completedStages.length];
  return expectedStage === stage && choicesCompleteStage(progress, stage);
}

export function completeFinalStage(
  progress: FinalProgress,
  stage: FinalLearningStage,
): FinalProgress {
  if (!canCompleteFinalStage(progress, stage)) return progress;

  const completedStages = [...progress.completedStages, stage];
  const nextStage = nextReachableStage(completedStages);

  return {
    ...progress,
    started: true,
    stage: nextStage,
    completedStages,
    finished: nextStage === "completion",
  };
}

export function isFinalStageReachable(
  progress: FinalProgress,
  stage: FinalStage,
): boolean {
  if (stage === "welcome") return !progress.started;
  if (!progress.started) return false;
  if (stage === "completion") {
    return progress.completedStages.length === finalLearningStages.length;
  }

  const index = finalLearningStages.indexOf(stage);
  return index >= 0 && index <= progress.completedStages.length;
}

export function navigateFinalStage(
  progress: FinalProgress,
  stage: FinalStage,
): FinalProgress {
  return isFinalStageReachable(progress, stage)
    ? { ...progress, stage }
    : progress;
}
