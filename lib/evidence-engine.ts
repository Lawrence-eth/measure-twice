import {
  arrivalChoices,
  checks,
  contextOptions,
  fieldNotes,
  isCorrectChoice,
  planOptions,
  postRepairReruns as requiredPostRepairReruns,
  repairFields,
  repositoryOptions,
  sceneOrder,
  shipGate,
  targetFields,
  transferQuestions,
  workModes,
  type Confidence,
  type RepairField,
  type SceneId,
  type ScopeDisposition,
  type TargetField,
  type WorkModeId,
} from "@/lib/mission";

export const MISSION_PROGRESS_VERSION = 2 as const;

type TargetAnswers = Partial<Record<TargetField, string>>;
type RepairAnswers = Partial<Record<RepairField, string>>;
type TransferAnswers = Partial<Record<"source" | "proof" | "next", string>>;

type SharedProgressFields = {
  scene: SceneId;
  started: boolean;
  arrivalChoice: string;
  confidence: Partial<Record<"arrival" | "radius" | "transfer", Confidence>>;
  target: TargetAnswers;
  repository: string[];
  context: string[];
  /** Legacy selected-plan representation retained while the interface migrates. */
  plan: string[];
  checksRun: string[];
  repair: RepairAnswers;
  repaired: boolean;
  /** Legacy two-check rerun representation. It never satisfies the v2 release gate. */
  retested: string[];
  /** Legacy self-attestation list. It carries no release-evidence weight in v2. */
  shipGate: string[];
  transfer: TransferAnswers;
  attempts: Partial<Record<SceneId, number>>;
  hints: Partial<Record<SceneId, number>>;
  fieldNotes: string[];
  reflection: string;
};

export type MissionProgressV1 = SharedProgressFields & {
  version?: 1;
};

export type ScopeDecisions = Record<string, ScopeDisposition>;

export type PostRepairRerunEvidence = {
  id: string;
  passed: boolean;
  version: string;
  evidence: string;
};

export type ReadmeReleaseEvidence = {
  version: string;
  reviewedAt: string;
  limitationsReviewed: boolean;
};

export type BuildReleaseEvidence = {
  version: string;
  command: string;
  exitCode: number;
  recordedAt: string;
};

export type HostedCheckEvidence = {
  version: string;
  url: string;
  checkedAt: string;
  factsPassed: boolean;
  corePathPassed: boolean;
};

export type ReleaseVersionEvidence = {
  commit: string;
  recoveryVersion: string;
  recoveryProcedure: string;
};

export type ConcreteReleaseEvidence = {
  readme?: ReadmeReleaseEvidence;
  build?: BuildReleaseEvidence;
  preview?: HostedCheckEvidence;
  releaseVersion?: ReleaseVersionEvidence;
  production?: HostedCheckEvidence;
};

export type MissionProgress = SharedProgressFields & {
  version: typeof MISSION_PROGRESS_VERSION;
  /** Every proposed plan item has an explicit Keep / Defer / Needs-answer disposition. */
  scopeDecisions: ScopeDecisions;
  /** Every preselected disposition must still be explicitly reviewed by the learner. */
  scopeReviewed: string[];
  workMode: WorkModeId;
  diagnosed: boolean;
  /** Structured evidence for all five required post-repair checks. */
  postRepairReruns: PostRepairRerunEvidence[];
  /** Concrete artifacts/actions only; generated rows are derived by the engine. */
  releaseEvidence: ConcreteReleaseEvidence;
  publishApproved: boolean;
  published: boolean;
  productionChecked: boolean;
  transferExplanation: string;
  activeEvidenceCheck: string | null;
  /** Present only when a stored v1 record was safely migrated. */
  migratedFromVersion?: 1;
};

export type SupportLabel =
  | "independent"
  | "after revision"
  | "with support"
  | "not yet";

export type ReleaseEvidenceStatus = "pass" | "missing" | "fail";

export type GeneratedReleaseEvidenceRow = {
  id: string;
  label: string;
  status: ReleaseEvidenceStatus;
  source: "derived-check" | "concrete-action" | "human-approval" | "live-check";
  evidence: string;
};

function initialScopeDecisions(): ScopeDecisions {
  return Object.fromEntries(planOptions.map((option) => [option.id, "keep"])) as ScopeDecisions;
}

export function emptyReleaseEvidence(): ConcreteReleaseEvidence {
  return {};
}

export const initialProgress: MissionProgress = {
  version: MISSION_PROGRESS_VERSION,
  scene: "arrival",
  started: false,
  arrivalChoice: "",
  confidence: {},
  target: {},
  repository: [],
  context: [],
  plan: planOptions.map((option) => option.id),
  scopeDecisions: initialScopeDecisions(),
  scopeReviewed: [],
  workMode: "plan",
  checksRun: [],
  activeEvidenceCheck: null,
  repair: {},
  repaired: false,
  diagnosed: false,
  retested: [],
  postRepairReruns: [],
  shipGate: [],
  releaseEvidence: emptyReleaseEvidence(),
  publishApproved: false,
  published: false,
  productionChecked: false,
  transfer: {},
  transferExplanation: "",
  attempts: {},
  hints: {},
  fieldNotes: [],
  reflection: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function boundedString(value: unknown, max: number, allowEmpty = true): value is string {
  return (
    typeof value === "string" &&
    value.length <= max &&
    (allowEmpty || value.trim().length > 0)
  );
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isRecordedTime(value: unknown): value is string {
  return boundedString(value, 80, false) && Number.isFinite(Date.parse(value));
}

function uniqueAllowedStrings(
  value: unknown,
  allowed: ReadonlySet<string>,
  maxItems = 50,
): string[] | null {
  if (!Array.isArray(value) || value.length > maxItems) return null;
  const strings: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !allowed.has(item)) return null;
    if (!strings.includes(item)) strings.push(item);
  }
  return strings;
}

function parseConfidence(value: unknown): MissionProgress["confidence"] | null {
  if (!isRecord(value)) return null;
  const allowedKeys = new Set(["arrival", "radius", "transfer"]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) return null;
  const result: MissionProgress["confidence"] = {};
  for (const key of ["arrival", "radius", "transfer"] as const) {
    const item = value[key];
    if (item === undefined) continue;
    if (item !== 0.4 && item !== 0.7 && item !== 0.9) return null;
    result[key] = item;
  }
  return result;
}

function parseAnswers<K extends string>(
  value: unknown,
  definitions: ReadonlyArray<{ id: K; options: ReadonlyArray<{ id: string }> }>,
): Partial<Record<K, string>> | null {
  if (!isRecord(value)) return null;
  const allowedKeys = new Set(definitions.map((definition) => definition.id));
  if (Object.keys(value).some((key) => !allowedKeys.has(key as K))) return null;
  const result: Partial<Record<K, string>> = {};
  for (const definition of definitions) {
    const selected = value[definition.id];
    if (selected === undefined) continue;
    if (
      typeof selected !== "string" ||
      !definition.options.some((option) => option.id === selected)
    ) {
      return null;
    }
    result[definition.id] = selected;
  }
  return result;
}

function parseSceneNumbers(
  value: unknown,
  maximum: number,
): Partial<Record<SceneId, number>> | null {
  if (value === undefined) return {};
  if (!isRecord(value)) return null;
  const result: Partial<Record<SceneId, number>> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!sceneOrder.includes(key as SceneId)) return null;
    if (!Number.isInteger(item) || (item as number) < 0 || (item as number) > maximum) {
      return null;
    }
    result[key as SceneId] = item as number;
  }
  return result;
}

function parseSharedProgress(value: unknown): SharedProgressFields | null {
  if (!isRecord(value)) return null;
  if (!sceneOrder.includes(value.scene as SceneId)) return null;
  if (!isBoolean(value.started)) return null;

  const arrivalIds = new Set(arrivalChoices.map((choice) => choice.id));
  if (
    !boundedString(value.arrivalChoice, 80) ||
    (value.arrivalChoice !== "" && !arrivalIds.has(value.arrivalChoice))
  ) {
    return null;
  }

  const confidence = parseConfidence(value.confidence);
  const target = parseAnswers(value.target, targetFields);
  const repair = parseAnswers(value.repair, repairFields);
  const transfer = parseAnswers(value.transfer, transferQuestions);
  const attempts = parseSceneNumbers(value.attempts, 100);
  const hints = parseSceneNumbers(value.hints, 3);
  if (!confidence || !target || !repair || !transfer || !attempts || !hints) return null;

  const repository = uniqueAllowedStrings(
    value.repository,
    new Set(repositoryOptions.map((option) => option.id)),
  );
  const context = uniqueAllowedStrings(
    value.context,
    new Set(contextOptions.map((option) => option.id)),
  );
  const plan = uniqueAllowedStrings(
    value.plan,
    new Set(planOptions.map((option) => option.id)),
  );
  const checksRun = uniqueAllowedStrings(
    value.checksRun,
    new Set(checks.map((option) => option.id)),
  );
  const retested = uniqueAllowedStrings(
    value.retested,
    new Set([
      ...requiredPostRepairReruns.map((item) => item.id),
      "facts-check",
      "mobile-check",
    ]),
  );
  const selectedShipRows = uniqueAllowedStrings(
    value.shipGate,
    new Set(shipGate.map((item) => item.id)),
  );
  const collectedNotes = uniqueAllowedStrings(
    value.fieldNotes,
    new Set(fieldNotes.map((item) => item.id)),
  );

  if (
    !repository ||
    !context ||
    !plan ||
    !checksRun ||
    !retested ||
    !selectedShipRows ||
    !collectedNotes
  ) {
    return null;
  }
  if (!isBoolean(value.repaired)) return null;
  if (!boundedString(value.reflection, 600)) return null;

  return {
    scene: value.scene as SceneId,
    started: value.started,
    arrivalChoice: value.arrivalChoice,
    confidence,
    target,
    repository,
    context,
    plan,
    checksRun,
    repair,
    repaired: value.repaired,
    retested,
    shipGate: selectedShipRows,
    transfer,
    attempts,
    hints,
    fieldNotes: collectedNotes,
    reflection: value.reflection,
  };
}

function parseScopeDecisions(value: unknown): ScopeDecisions | null {
  if (!isRecord(value)) return null;
  const planIds = new Set(planOptions.map((option) => option.id));
  if (Object.keys(value).some((key) => !planIds.has(key))) return null;

  const result: ScopeDecisions = {};
  for (const option of planOptions) {
    const disposition = value[option.id];
    if (
      disposition !== "keep" &&
      disposition !== "defer" &&
      disposition !== "needs-answer"
    ) {
      return null;
    }
    result[option.id] = disposition;
  }
  return result;
}

function parsePostRepairReruns(value: unknown): PostRepairRerunEvidence[] | null {
  if (!Array.isArray(value) || value.length > requiredPostRepairReruns.length) return null;
  const allowed = new Set(requiredPostRepairReruns.map((item) => item.id));
  const result: PostRepairRerunEvidence[] = [];

  for (const item of value) {
    if (!isRecord(item) || typeof item.id !== "string" || !allowed.has(item.id)) return null;
    if (result.some((existing) => existing.id === item.id)) return null;
    if (!isBoolean(item.passed)) return null;
    if (!boundedString(item.version, 100, false)) return null;
    if (!boundedString(item.evidence, 600, false)) return null;
    result.push({
      id: item.id,
      passed: item.passed,
      version: item.version.trim(),
      evidence: item.evidence.trim(),
    });
  }
  return result;
}

function parseReadmeEvidence(value: unknown): ReadmeReleaseEvidence | null {
  if (!isRecord(value)) return null;
  if (!boundedString(value.version, 100, false)) return null;
  if (!isRecordedTime(value.reviewedAt)) return null;
  if (!isBoolean(value.limitationsReviewed)) return null;
  return {
    version: value.version.trim(),
    reviewedAt: value.reviewedAt,
    limitationsReviewed: value.limitationsReviewed,
  };
}

function parseBuildEvidence(value: unknown): BuildReleaseEvidence | null {
  if (!isRecord(value)) return null;
  if (!boundedString(value.version, 100, false)) return null;
  if (!boundedString(value.command, 300, false)) return null;
  if (!Number.isInteger(value.exitCode) || (value.exitCode as number) < 0 || (value.exitCode as number) > 255) {
    return null;
  }
  if (!isRecordedTime(value.recordedAt)) return null;
  return {
    version: value.version.trim(),
    command: value.command.trim(),
    exitCode: value.exitCode as number,
    recordedAt: value.recordedAt,
  };
}

function parseHostedEvidence(value: unknown): HostedCheckEvidence | null {
  if (!isRecord(value)) return null;
  if (!boundedString(value.version, 100, false)) return null;
  if (!boundedString(value.url, 500, false) || !isHttpUrl(value.url)) return null;
  if (!isRecordedTime(value.checkedAt)) return null;
  if (!isBoolean(value.factsPassed) || !isBoolean(value.corePathPassed)) return null;
  return {
    version: value.version.trim(),
    url: value.url,
    checkedAt: value.checkedAt,
    factsPassed: value.factsPassed,
    corePathPassed: value.corePathPassed,
  };
}

function parseReleaseVersionEvidence(value: unknown): ReleaseVersionEvidence | null {
  if (!isRecord(value)) return null;
  if (!boundedString(value.commit, 100, false)) return null;
  if (!boundedString(value.recoveryVersion, 100, false)) return null;
  if (!boundedString(value.recoveryProcedure, 600, false)) return null;
  return {
    commit: value.commit.trim(),
    recoveryVersion: value.recoveryVersion.trim(),
    recoveryProcedure: value.recoveryProcedure.trim(),
  };
}

function parseReleaseEvidence(value: unknown): ConcreteReleaseEvidence | null {
  if (!isRecord(value)) return null;
  const allowedKeys = new Set(["readme", "build", "preview", "releaseVersion", "production"]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) return null;
  const result: ConcreteReleaseEvidence = {};

  if (value.readme !== undefined) {
    const parsed = parseReadmeEvidence(value.readme);
    if (!parsed) return null;
    result.readme = parsed;
  }
  if (value.build !== undefined) {
    const parsed = parseBuildEvidence(value.build);
    if (!parsed) return null;
    result.build = parsed;
  }
  if (value.preview !== undefined) {
    const parsed = parseHostedEvidence(value.preview);
    if (!parsed) return null;
    result.preview = parsed;
  }
  if (value.releaseVersion !== undefined) {
    const parsed = parseReleaseVersionEvidence(value.releaseVersion);
    if (!parsed) return null;
    result.releaseVersion = parsed;
  }
  if (value.production !== undefined) {
    const parsed = parseHostedEvidence(value.production);
    if (!parsed) return null;
    result.production = parsed;
  }

  return result;
}

function inferScopeDecisionsFromV1(selectedPlan: string[]): ScopeDecisions {
  return Object.fromEntries(
    planOptions.map((option) => {
      if (selectedPlan.includes(option.id)) return [option.id, "keep"];
      if (option.recommendedDisposition === "keep") return [option.id, "defer"];
      return [option.id, option.recommendedDisposition];
    }),
  ) as ScopeDecisions;
}

function rawRepairIsSpecific(progress: Pick<MissionProgress, "repair">): boolean {
  return repairFields.every((field) =>
    isCorrectChoice(field.options, progress.repair[field.id] ?? ""),
  );
}

function migrateV1(shared: SharedProgressFields): MissionProgress {
  const legacyVersion = "legacy-v1";
  const scopeReviewIndex = sceneOrder.indexOf("radius");
  const safeScene = sceneOrder.indexOf(shared.scene) > scopeReviewIndex ? "radius" : shared.scene;
  const legacyReruns = shared.retested
    .filter((id) => id === "facts-check" || id === "mobile-check")
    .map((id) => ({
      id,
      passed: true,
      version: legacyVersion,
      evidence: `Migrated v1 record: ${id} was marked as rerun.`,
    }));

  return {
    ...shared,
    scene: safeScene,
    version: MISSION_PROGRESS_VERSION,
    scopeDecisions: inferScopeDecisionsFromV1(shared.plan),
    scopeReviewed: [],
    workMode: "plan",
    diagnosed: shared.repaired && rawRepairIsSpecific({ repair: shared.repair }),
    postRepairReruns: legacyReruns,
    releaseEvidence: emptyReleaseEvidence(),
    publishApproved: false,
    published: false,
    productionChecked: false,
    transferExplanation: "",
    activeEvidenceCheck: null,
    migratedFromVersion: 1,
  };
}

export function parseMissionProgress(value: unknown): MissionProgress | null {
  const shared = parseSharedProgress(value);
  if (!shared || !isRecord(value)) return null;

  if (value.version === undefined || value.version === 1) {
    return migrateV1(shared);
  }
  if (value.version !== MISSION_PROGRESS_VERSION) return null;

  const scopeDecisions = parseScopeDecisions(value.scopeDecisions);
  const scopeReviewWasAddedAfterSave = value.scopeReviewed === undefined;
  const scopeReviewed = uniqueAllowedStrings(
    value.scopeReviewed ?? [],
    new Set(planOptions.map((option) => option.id)),
    planOptions.length,
  );
  const workModeIds = new Set(workModes.map((mode) => mode.id));
  if (typeof value.workMode !== "string" || !workModeIds.has(value.workMode as WorkModeId)) {
    return null;
  }
  if (!isBoolean(value.diagnosed)) return null;
  const postRepairReruns = parsePostRepairReruns(value.postRepairReruns);
  const releaseEvidence = parseReleaseEvidence(value.releaseEvidence);
  if (!scopeDecisions || !scopeReviewed || !postRepairReruns || !releaseEvidence) return null;
  if (!isBoolean(value.publishApproved) || !isBoolean(value.published) || !isBoolean(value.productionChecked)) {
    return null;
  }
  if (!boundedString(value.transferExplanation, 1_000)) return null;

  const checkIds = new Set(checks.map((item) => item.id));
  if (
    value.activeEvidenceCheck !== null &&
    (typeof value.activeEvidenceCheck !== "string" || !checkIds.has(value.activeEvidenceCheck))
  ) {
    return null;
  }
  if (value.migratedFromVersion !== undefined && value.migratedFromVersion !== 1) return null;

  return {
    ...shared,
    scene:
      scopeReviewWasAddedAfterSave && sceneOrder.indexOf(shared.scene) > sceneOrder.indexOf("radius")
        ? "radius"
        : shared.scene,
    version: MISSION_PROGRESS_VERSION,
    scopeDecisions,
    scopeReviewed,
    workMode: value.workMode as WorkModeId,
    diagnosed: value.diagnosed,
    postRepairReruns,
    releaseEvidence,
    publishApproved: value.publishApproved,
    published: value.published,
    productionChecked: value.productionChecked,
    transferExplanation: value.transferExplanation,
    activeEvidenceCheck: value.activeEvidenceCheck,
    migratedFromVersion: value.migratedFromVersion as 1 | undefined,
  };
}

export function migrateMissionProgress(value: unknown): MissionProgress | null {
  return parseMissionProgress(value);
}

/**
 * Backward-compatible guard for the existing local-storage consumer. A valid
 * v1 object is replaced in place with its sanitized v2 migration so callers do
 * not accidentally retain an object missing required v2 fields.
 */
export function isMissionProgress(value: unknown): value is MissionProgress {
  const parsed = parseMissionProgress(value);
  if (!parsed || !isRecord(value)) return false;
  try {
    for (const key of Object.keys(value)) delete value[key];
    Object.assign(value, parsed);
    return true;
  } catch {
    return false;
  }
}

function normalize(progress: MissionProgress | MissionProgressV1): MissionProgress | null {
  return parseMissionProgress(progress);
}

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

function rawTargetIsCorrect(progress: MissionProgress): boolean {
  return targetFields.every((field) =>
    isCorrectChoice(field.options, progress.target[field.id] ?? ""),
  );
}

export function targetIsCorrect(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawTargetIsCorrect(parsed));
}

function rawRepositoryIsSafe(progress: MissionProgress): boolean {
  return allCorrectSelections(progress.repository, repositoryOptions);
}

export function repositoryIsSafe(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawRepositoryIsSafe(parsed));
}

function rawContextIsUseful(progress: MissionProgress): boolean {
  return (
    progress.workMode === "plan" &&
    allCorrectSelections(progress.context, contextOptions)
  );
}

export function contextIsUseful(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawContextIsUseful(parsed));
}

function rawPlanIsBounded(progress: MissionProgress): boolean {
  return planOptions.every(
    (option) =>
      progress.scopeReviewed.includes(option.id) &&
      progress.scopeDecisions[option.id] === option.recommendedDisposition,
  );
}

export function planIsBounded(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawPlanIsBounded(parsed));
}

function rawEssentialChecksRan(progress: MissionProgress): boolean {
  return allCorrectSelections(progress.checksRun, checks);
}

export function essentialChecksRan(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawEssentialChecksRan(parsed));
}

function rawEveryUsefulCheckRan(progress: MissionProgress): boolean {
  return allCorrectSelections(progress.checksRun, checks, true);
}

export function everyUsefulCheckRan(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawEveryUsefulCheckRan(parsed));
}

export function repairIsSpecific(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawRepairIsSpecific(parsed));
}

function rawPostRepairRerunsComplete(progress: MissionProgress): boolean {
  const requiredIds = requiredPostRepairReruns.map((item) => item.id);
  const records = requiredIds.map((id) =>
    progress.postRepairReruns.find((record) => record.id === id),
  );
  if (records.some((record) => !record?.passed || !record.evidence.trim())) return false;
  const versions = new Set(records.map((record) => record?.version));
  return versions.size === 1;
}

export function postRepairRerunsAreComplete(
  progress: MissionProgress | MissionProgressV1,
): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawPostRepairRerunsComplete(parsed));
}

function rawRepairIsVerified(progress: MissionProgress): boolean {
  return (
    progress.repaired &&
    progress.diagnosed &&
    rawRepairIsSpecific(progress) &&
    rawPostRepairRerunsComplete(progress)
  );
}

export function repairIsVerified(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawRepairIsVerified(parsed));
}

function releaseRowLabel(id: string): string {
  return shipGate.find((item) => item.id === id)?.title ?? id;
}

function row(
  id: string,
  status: ReleaseEvidenceStatus,
  source: GeneratedReleaseEvidenceRow["source"],
  evidence: string,
): GeneratedReleaseEvidenceRow {
  return { id, label: releaseRowLabel(id), status, source, evidence };
}

function matchingPassedRerun(
  progress: MissionProgress,
  id: string,
  releaseVersion: string,
): PostRepairRerunEvidence | undefined {
  return progress.postRepairReruns.find(
    (record) =>
      record.id === id &&
      record.passed &&
      record.version === releaseVersion &&
      Boolean(record.evidence.trim()),
  );
}

function rawReleaseEvidenceSnapshot(progress: MissionProgress): GeneratedReleaseEvidenceRow[] {
  const concrete = progress.releaseEvidence;
  const releaseVersion = concrete.releaseVersion?.commit ?? "";
  const facts = matchingPassedRerun(progress, "facts-check", releaseVersion);
  const mobile = matchingPassedRerun(progress, "mobile-check", releaseVersion);
  const destination = matchingPassedRerun(progress, "email-destination-check", releaseVersion);
  const keyboard = matchingPassedRerun(progress, "keyboard-check", releaseVersion);
  const secrets = matchingPassedRerun(progress, "secret-check", releaseVersion);

  const readmePass = Boolean(
    releaseVersion &&
    concrete.readme?.version === releaseVersion &&
    concrete.readme.limitationsReviewed,
  );
  const buildPass = Boolean(
    releaseVersion &&
    concrete.build?.version === releaseVersion &&
    concrete.build.exitCode === 0 &&
    concrete.build.command.trim(),
  );
  const previewPass = Boolean(
    releaseVersion &&
    concrete.preview?.version === releaseVersion &&
    concrete.preview.factsPassed &&
    concrete.preview.corePathPassed,
  );
  const versionPass = Boolean(
    releaseVersion &&
    concrete.releaseVersion?.recoveryVersion.trim() &&
    concrete.releaseVersion.recoveryProcedure.trim(),
  );
  const productionPass = Boolean(
    progress.publishApproved &&
    progress.published &&
    progress.productionChecked &&
    releaseVersion &&
    concrete.production?.version === releaseVersion &&
    concrete.production.factsPassed &&
    concrete.production.corePathPassed,
  );

  return [
    row(
      "facts-pass",
      facts ? "pass" : "missing",
      "derived-check",
      facts?.evidence ?? "A passing facts rerun tied to the release version is missing.",
    ),
    row(
      "core-pass",
      mobile && destination ? "pass" : "missing",
      "derived-check",
      mobile && destination
        ? `${mobile.evidence} ${destination.evidence}`
        : "Passing 390px visibility and email-destination reruns tied to the release version are required.",
    ),
    row(
      "access-pass",
      keyboard ? "pass" : "missing",
      "derived-check",
      keyboard?.evidence ?? "A passing keyboard regression rerun tied to the release version is missing.",
    ),
    row(
      "secret-pass",
      secrets ? "pass" : "missing",
      "derived-check",
      secrets?.evidence ?? "A final saved-file review tied to the release version is missing.",
    ),
    row(
      "readme-current",
      readmePass ? "pass" : "missing",
      "concrete-action",
      readmePass
        ? `README and limitations reviewed at ${concrete.readme?.reviewedAt}.`
        : "A version-matched README and limitations review is missing.",
    ),
    row(
      "build-pass",
      concrete.build && concrete.build.exitCode !== 0 ? "fail" : buildPass ? "pass" : "missing",
      "concrete-action",
      buildPass
        ? `${concrete.build?.command} exited 0 at ${concrete.build?.recordedAt}.`
        : concrete.build && concrete.build.exitCode !== 0
          ? `${concrete.build.command} exited ${concrete.build.exitCode}.`
          : "A successful build record tied to the release version is missing.",
    ),
    row(
      "preview-pass",
      concrete.preview && (!concrete.preview.factsPassed || !concrete.preview.corePathPassed)
        ? "fail"
        : previewPass
          ? "pass"
          : "missing",
      "concrete-action",
      previewPass
        ? `Preview checked at ${concrete.preview?.url} on ${concrete.preview?.checkedAt}.`
        : "A version-matched preview check covering facts and the core path is missing or failed.",
    ),
    row(
      "final-commit",
      versionPass ? "pass" : "missing",
      "concrete-action",
      versionPass
        ? `Release ${releaseVersion}; recovery version ${concrete.releaseVersion?.recoveryVersion}.`
        : "The exact release version and concrete recovery method are missing.",
    ),
    row(
      "publish-approval",
      progress.publishApproved ? "pass" : "missing",
      "human-approval",
      progress.publishApproved
        ? `Explicit approval recorded for release ${releaseVersion}.`
        : "Explicit human approval to publish this exact version is missing.",
    ),
    row(
      "production-smoke",
      concrete.production && (!concrete.production.factsPassed || !concrete.production.corePathPassed)
        ? "fail"
        : productionPass
          ? "pass"
          : "missing",
      "live-check",
      productionPass
        ? `Live version checked at ${concrete.production?.url} on ${concrete.production?.checkedAt}.`
        : "Publication and a version-matched live smoke test are required.",
    ),
  ];
}

export function releaseEvidenceSnapshot(
  progress: MissionProgress | MissionProgressV1,
): GeneratedReleaseEvidenceRow[] {
  const parsed = normalize(progress);
  return parsed ? rawReleaseEvidenceSnapshot(parsed) : [];
}

function rawShipGateIsComplete(progress: MissionProgress): boolean {
  return (
    rawRepairIsVerified(progress) &&
    rawReleaseEvidenceSnapshot(progress).every((item) => item.status === "pass")
  );
}

export function shipGateIsComplete(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawShipGateIsComplete(parsed));
}

function rawTransferChoicesAreCorrect(progress: MissionProgress): boolean {
  return transferQuestions.every((question) =>
    isCorrectChoice(question.options, progress.transfer[question.id] ?? ""),
  );
}

export function transferExplanationIsMeaningful(explanation: string): boolean {
  const normalized = explanation.trim().replace(/\s+/g, " ");
  return normalized.length >= 40 && normalized.split(" ").length >= 7;
}

function rawTransferIsCorrect(progress: MissionProgress): boolean {
  return (
    rawTransferChoicesAreCorrect(progress) &&
    transferExplanationIsMeaningful(progress.transferExplanation)
  );
}

export function transferIsCorrect(progress: MissionProgress | MissionProgressV1): boolean {
  const parsed = normalize(progress);
  return Boolean(parsed && rawTransferIsCorrect(parsed));
}

export function canCompleteScene(
  progress: MissionProgress | MissionProgressV1,
  scene: SceneId,
): boolean {
  const parsed = normalize(progress);
  if (!parsed) return false;

  switch (scene) {
    case "arrival":
      return parsed.arrivalChoice === "inspect";
    case "target":
      return rawTargetIsCorrect(parsed);
    case "record":
      return rawRepositoryIsSafe(parsed);
    case "handoff":
      return rawContextIsUseful(parsed);
    case "radius":
      return rawPlanIsBounded(parsed) && Boolean(parsed.confidence.radius);
    case "check":
      return rawEveryUsefulCheckRan(parsed);
    case "evolve":
      return rawRepairIsVerified(parsed);
    case "ship":
      return rawShipGateIsComplete(parsed);
    case "transfer":
      return rawTransferIsCorrect(parsed) && Boolean(parsed.confidence.transfer);
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
  support: SupportLabel;
  evidence: string;
};

function supportRating(support: SupportLabel): 0 | 1 | 2 | 3 {
  if (support === "independent") return 3;
  if (support === "after revision") return 2;
  if (support === "with support") return 1;
  return 0;
}

function supportFor(input: {
  demonstrated: boolean;
  scenes: SceneId[];
  progress: MissionProgress;
  independentlyObserved?: boolean;
}): SupportLabel {
  if (!input.demonstrated) return "not yet";
  const usedHint = input.scenes.some((scene) => (input.progress.hints[scene] ?? 0) > 0);
  if (usedHint) return "with support";
  const revised = input.scenes.some((scene) => (input.progress.attempts[scene] ?? 1) > 1);
  if (revised || input.independentlyObserved === false) return "after revision";
  return "independent";
}

function competency(input: Omit<Competency, "rating" | "support"> & {
  demonstrated: boolean;
  scenes: SceneId[];
  progress: MissionProgress;
  independentlyObserved?: boolean;
}): Competency {
  const support = supportFor(input);
  return {
    id: input.id,
    label: input.label,
    weight: input.weight,
    support,
    rating: supportRating(support),
    evidence: input.evidence,
  };
}

function legacyRepairDemonstrated(progress: MissionProgress): boolean {
  return Boolean(
    progress.migratedFromVersion === 1 &&
    progress.repaired &&
    progress.diagnosed &&
    rawRepairIsSpecific(progress) &&
    ["facts-check", "mobile-check"].every((id) =>
      progress.postRepairReruns.some((record) => record.id === id && record.passed),
    ),
  );
}

function legacyTransferDemonstrated(progress: MissionProgress): boolean {
  return Boolean(progress.migratedFromVersion === 1 && rawTransferChoicesAreCorrect(progress));
}

export function buildCompetencies(
  progress: MissionProgress | MissionProgressV1,
): Competency[] {
  const parsed = normalize(progress) ?? initialProgress;
  const arrivalInspected = parsed.arrivalChoice === "inspect";
  const revised = rawRepairIsVerified(parsed) || legacyRepairDemonstrated(parsed);
  const transferred = rawTransferIsCorrect(parsed) || legacyTransferDemonstrated(parsed);

  return [
    competency({
      id: "target",
      label: "Target an outcome",
      weight: 15,
      demonstrated: rawTargetIsCorrect(parsed),
      scenes: ["target"],
      progress: parsed,
      evidence: "Named a specific visitor, useful outcome, observable proof, non-goal, and runtime-AI decision.",
    }),
    competency({
      id: "record",
      label: "Record durable context",
      weight: 15,
      demonstrated: rawRepositoryIsSafe(parsed),
      scenes: ["record"],
      progress: parsed,
      evidence: "Created a recoverable baseline with trusted sources and no committed credential.",
    }),
    competency({
      id: "assign",
      label: "Assign bounded work",
      weight: 15,
      demonstrated: rawContextIsUseful(parsed) && rawPlanIsBounded(parsed),
      scenes: ["handoff", "radius"],
      progress: parsed,
      evidence: "Used Plan mode, bounded authority, and gave every proposed item a justified disposition.",
    }),
    competency({
      id: "inspect",
      label: "Inspect critically",
      weight: 15,
      demonstrated: rawEssentialChecksRan(parsed),
      scenes: ["arrival", "check"],
      progress: parsed,
      independentlyObserved: arrivalInspected,
      evidence: "Looked beyond the AI assurance and inspected the project, trusted source, behavior, and execution record.",
    }),
    competency({
      id: "verify",
      label: "Verify independently",
      weight: 20,
      demonstrated: rawEveryUsefulCheckRan(parsed),
      scenes: ["check"],
      progress: parsed,
      evidence: "Connected every relevant claim to a check and distinguished pass, fail, and not-run evidence.",
    }),
    competency({
      id: "revise",
      label: "Revise and preserve",
      weight: 10,
      demonstrated: revised,
      scenes: ["evolve"],
      progress: parsed,
      evidence: parsed.migratedFromVersion === 1
        ? "Completed the original v1 repair-and-rerun loop; the expanded v2 release gate still requires five versioned reruns."
        : "Diagnosed the bounded gap and produced five passing reruns tied to one repaired version.",
    }),
    competency({
      id: "transfer",
      label: "Transfer the method",
      weight: 10,
      demonstrated: transferred,
      scenes: ["transfer"],
      progress: parsed,
      evidence: parsed.migratedFromVersion === 1
        ? "Applied the original transfer choices to a different artifact."
        : "Applied the evidence discipline to a spreadsheet and explained what was proved and what remained uncertain.",
    }),
  ];
}

export function evidenceScore(progress: MissionProgress | MissionProgressV1): number {
  const weighted = buildCompetencies(progress).reduce(
    (sum, item) => sum + item.weight * (item.rating / 3),
    0,
  );
  return Math.round(weighted);
}

export function evidenceLevel(
  progress: MissionProgress | MissionProgressV1,
): "Developing" | "Independent" {
  const competencies = buildCompetencies(progress);
  const demonstrated = competencies.filter((item) => item.support !== "not yet").length;
  const transfer = competencies.find((item) => item.id === "transfer");
  return demonstrated >= 6 && transfer?.support !== "not yet" ? "Independent" : "Developing";
}

export function calibrationSnapshot(progress: MissionProgress | MissionProgressV1): string {
  const parsed = normalize(progress);
  if (!parsed) return "No valid confidence decisions are available.";

  const observations: Array<{ confidence?: Confidence; correct: boolean; label: string }> = [
    {
      confidence: parsed.confidence.arrival,
      correct: parsed.arrivalChoice === "inspect",
      label: "first inspection decision",
    },
    {
      confidence: parsed.confidence.radius,
      correct: rawPlanIsBounded(parsed),
      label: "scope decision",
    },
    {
      confidence: parsed.confidence.transfer,
      correct: rawTransferChoicesAreCorrect(parsed),
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
    : `You were confident during the ${largestMismatch.label} before the project supported that confidence.`;
}
