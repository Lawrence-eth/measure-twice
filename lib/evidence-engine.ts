import {
  arrivalChoices,
  checks,
  contextOptions,
  isCorrectChoice,
  planOptions,
  repairFields,
  repositoryOptions,
  sceneOrder,
  shipGate,
  targetFields,
  transferQuestions,
  type Confidence,
  type RepairField,
  type SceneId,
  type TargetField,
} from "@/lib/mission";

export type MissionProgress = {
  scene: SceneId;
  started: boolean;
  arrivalChoice: string;
  confidence: Partial<Record<"arrival" | "radius" | "transfer", Confidence>>;
  target: Partial<Record<TargetField, string>>;
  repository: string[];
  context: string[];
  plan: string[];
  checksRun: string[];
  repair: Partial<Record<RepairField, string>>;
  repaired: boolean;
  retested: string[];
  shipGate: string[];
  transfer: Partial<Record<"source" | "proof" | "next", string>>;
  attempts: Partial<Record<SceneId, number>>;
  hints: Partial<Record<SceneId, number>>;
  fieldNotes: string[];
  reflection: string;
};

export const initialProgress: MissionProgress = {
  scene: "arrival",
  started: false,
  arrivalChoice: "",
  confidence: {},
  target: {},
  repository: [],
  context: [],
  plan: planOptions.map((option) => option.id),
  checksRun: [],
  repair: {},
  repaired: false,
  retested: [],
  shipGate: [],
  transfer: {},
  attempts: {},
  hints: {},
  fieldNotes: [],
  reflection: "",
};

function allCorrectSelections(
  selected: string[],
  options: ReadonlyArray<{ id: string; correct?: boolean; essential?: boolean }>,
  requireAllCorrect = false,
): boolean {
  const essential = options.filter((option) => option.essential).map((option) => option.id);
  const selectedOptions = selected
    .map((id) => options.find((option) => option.id === id))
    .filter(Boolean);
  const hasEssentials = essential.every((id) => selected.includes(id));
  const containsOnlyCorrect = selectedOptions.every((option) => option?.correct);
  const hasEveryCorrect = options
    .filter((option) => option.correct)
    .every((option) => selected.includes(option.id));

  return hasEssentials && containsOnlyCorrect && (!requireAllCorrect || hasEveryCorrect);
}

export function targetIsCorrect(progress: MissionProgress): boolean {
  return targetFields.every((field) =>
    isCorrectChoice(field.options, progress.target[field.id] ?? ""),
  );
}

export function repositoryIsSafe(progress: MissionProgress): boolean {
  return allCorrectSelections(progress.repository, repositoryOptions);
}

export function contextIsUseful(progress: MissionProgress): boolean {
  return allCorrectSelections(progress.context, contextOptions);
}

export function planIsBounded(progress: MissionProgress): boolean {
  return allCorrectSelections(progress.plan, planOptions, true);
}

export function essentialChecksRan(progress: MissionProgress): boolean {
  return allCorrectSelections(progress.checksRun, checks);
}

export function everyUsefulCheckRan(progress: MissionProgress): boolean {
  return allCorrectSelections(progress.checksRun, checks, true);
}

export function repairIsSpecific(progress: MissionProgress): boolean {
  return repairFields.every((field) =>
    isCorrectChoice(field.options, progress.repair[field.id] ?? ""),
  );
}

export function repairIsVerified(progress: MissionProgress): boolean {
  return (
    progress.repaired &&
    ["facts-check", "mobile-check"].every((id) => progress.retested.includes(id))
  );
}

export function shipGateIsComplete(progress: MissionProgress): boolean {
  return allCorrectSelections(progress.shipGate, shipGate, true) && repairIsVerified(progress);
}

export function transferIsCorrect(progress: MissionProgress): boolean {
  return transferQuestions.every((question) =>
    isCorrectChoice(question.options, progress.transfer[question.id] ?? ""),
  );
}

export function canCompleteScene(progress: MissionProgress, scene: SceneId): boolean {
  switch (scene) {
    case "arrival":
      return Boolean(progress.arrivalChoice && progress.confidence.arrival);
    case "target":
      return targetIsCorrect(progress);
    case "record":
      return repositoryIsSafe(progress);
    case "handoff":
      return contextIsUseful(progress);
    case "radius":
      return planIsBounded(progress) && Boolean(progress.confidence.radius);
    case "check":
      return everyUsefulCheckRan(progress);
    case "evolve":
      return repairIsSpecific(progress) && repairIsVerified(progress);
    case "ship":
      return shipGateIsComplete(progress);
    case "transfer":
      return transferIsCorrect(progress) && Boolean(progress.confidence.transfer);
    case "replay":
      return true;
  }
}

type CompetencyId =
  | "target"
  | "record"
  | "assign"
  | "inspect"
  | "verify"
  | "revise"
  | "transfer";

export type Competency = {
  id: CompetencyId;
  label: string;
  weight: number;
  rating: 0 | 1 | 2 | 3;
  evidence: string;
};

function adjustedRating(
  correct: boolean,
  scenes: SceneId[],
  progress: MissionProgress,
  fullCredit = true,
): 0 | 1 | 2 | 3 {
  if (!correct) return 0;
  const attempts = Math.max(...scenes.map((scene) => progress.attempts[scene] ?? 1));
  const hints = scenes.reduce((sum, scene) => sum + (progress.hints[scene] ?? 0), 0);

  if (hints >= 2) return 1;
  if (hints === 1 || attempts > 1) return 2;
  return fullCredit ? 3 : 2;
}

export function buildCompetencies(progress: MissionProgress): Competency[] {
  const arrivalInspected = progress.arrivalChoice === "inspect";

  return [
    {
      id: "target",
      label: "Target an outcome",
      weight: 15,
      rating: adjustedRating(targetIsCorrect(progress), ["target"], progress),
      evidence: "Named a specific audience, outcome, proof, and non-goal.",
    },
    {
      id: "record",
      label: "Record durable context",
      weight: 15,
      rating: adjustedRating(repositoryIsSafe(progress), ["record"], progress),
      evidence: "Built a recoverable repository without committing a secret.",
    },
    {
      id: "assign",
      label: "Assign bounded work",
      weight: 15,
      rating: adjustedRating(
        contextIsUseful(progress) && planIsBounded(progress),
        ["handoff", "radius"],
        progress,
      ),
      evidence: "Supplied trusted context and reduced the AI plan to one proof-sized slice.",
    },
    {
      id: "inspect",
      label: "Inspect critically",
      weight: 15,
      rating: adjustedRating(
        essentialChecksRan(progress),
        ["arrival", "check"],
        progress,
        arrivalInspected,
      ),
      evidence: "Looked past the AI summary and inspected the artifact, facts, and logs.",
    },
    {
      id: "verify",
      label: "Verify independently",
      weight: 20,
      rating: adjustedRating(
        essentialChecksRan(progress),
        ["check"],
        progress,
        everyUsefulCheckRan(progress),
      ),
      evidence: "Connected requirements to checks that actually ran.",
    },
    {
      id: "revise",
      label: "Revise and preserve",
      weight: 10,
      rating: adjustedRating(
        repairIsSpecific(progress) && repairIsVerified(progress),
        ["evolve", "ship"],
        progress,
      ),
      evidence: "Created a reproducible, bounded repair and reran failed checks.",
    },
    {
      id: "transfer",
      label: "Transfer the method",
      weight: 10,
      rating: adjustedRating(
        transferIsCorrect(progress),
        ["transfer"],
        progress,
        true,
      ),
      evidence: "Applied the same evidence discipline to an unfamiliar spreadsheet.",
    },
  ];
}

export function evidenceScore(progress: MissionProgress): number {
  const weighted = buildCompetencies(progress).reduce(
    (sum, competency) => sum + competency.weight * (competency.rating / 3),
    0,
  );
  return Math.round(weighted);
}

export function evidenceLevel(progress: MissionProgress): "Developing" | "Independent" {
  const competencies = buildCompetencies(progress);
  const independentCount = competencies.filter((item) => item.rating >= 2).length;
  return independentCount >= 6 && transferIsCorrect(progress) ? "Independent" : "Developing";
}

export function calibrationSnapshot(progress: MissionProgress): string {
  const observations: Array<{ confidence?: Confidence; correct: boolean; label: string }> = [
    {
      confidence: progress.confidence.arrival,
      correct: progress.arrivalChoice === "inspect",
      label: "first inspection decision",
    },
    {
      confidence: progress.confidence.radius,
      correct: planIsBounded(progress),
      label: "scope decision",
    },
    {
      confidence: progress.confidence.transfer,
      correct: transferIsCorrect(progress),
      label: "transfer decision",
    },
  ].filter((item) => item.confidence);

  if (!observations.length) return "No confidence decisions recorded yet.";
  const largestMismatch = observations
    .map((item) => ({
      ...item,
      gap: Math.abs((item.confidence ?? 0) - (item.correct ? 1 : 0)),
    }))
    .sort((left, right) => right.gap - left.gap)[0];

  if (largestMismatch.gap < 0.35) {
    return "Your confidence generally matched the evidence available to you.";
  }

  return largestMismatch.correct
    ? `You were cautious during the ${largestMismatch.label}, even though your process produced strong evidence.`
    : `You were confident during the ${largestMismatch.label} before the artifact supported that confidence.`;
}

export function isMissionProgress(value: unknown): value is MissionProgress {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MissionProgress>;
  return Boolean(
    candidate.scene &&
      sceneOrder.includes(candidate.scene) &&
      Array.isArray(candidate.repository) &&
      Array.isArray(candidate.context) &&
      Array.isArray(candidate.plan),
  );
}
