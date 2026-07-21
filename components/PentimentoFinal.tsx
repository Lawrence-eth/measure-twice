"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";

import { AccessibleDialog } from "@/components/AccessibleDialog";
import {
  affectedCheckChoices,
  aiFirstChoices,
  buildArtifact,
  buildEvidenceChoices,
  checkRetryChoices,
  defectReportArtifact,
  durableHabits,
  evidenceLadder,
  finalChapters,
  finalJourney,
  finalLearningStages,
  finalOpening,
  firstVersionBriefArtifact,
  ideaChoices,
  improveChoices,
  planningArtifact,
  planApprovalChoices,
  playbookIndex,
  projectHomeChoices,
  projectHomeGuidance,
  releaseArtifact,
  releasePipeline,
  releaseProofChoices,
  releaseVersionChoices,
  repairChoices,
  secretChoices,
  shownThreeStepPlan,
  threeRoleMap,
  toolChoices,
  toolDecoder,
  toolRouteGuidance,
  updateArtifact,
  updateRequest,
  vagueBuildRequest,
  welcomeAuditLayers,
  welcomeOutcomes,
  welcomePrologueBeats,
  type FinalChoice,
  type FinalLearningStage,
  type FinalStage,
  type PlaybookCardId,
  type TeachingMirrorFieldKey,
  type ToolRoute,
} from "@/lib/final-journey";
import {
  FINAL_STORAGE_KEY,
  completeFinalStage,
  initialFinalProgress,
  navigateFinalStage,
  parseStoredFinalProgress,
  serializeFinalProgress,
  startFinalJourney,
  type FinalMirrorDraft,
  type FinalProgress,
} from "@/lib/final-progress";

type ChoiceId = string;
type ChoiceItem = FinalChoice<ChoiceId>;
type HandoffId =
  | "runtime-ai"
  | "approve-plan"
  | "repair"
  | "retry-contact"
  | "release-proof"
  | "affected-checks";

type MirrorResult = {
  clearStrength: string;
  unresolvedAssumptions: string[];
  featureToPostpone: { feature: string; reason: string };
  toolTradeoff: string;
  nextMoves: string[];
};

type ReflectionMode = "demo" | "live";

const introFolios = [
  {
    id: "orientation",
    number: "01",
    shortLabel: "What this is",
    label: "What Pentimento teaches",
  },
  {
    id: "claim",
    number: "02",
    shortLabel: "The claim",
    label: "Inspect the AI-ready claim",
  },
  {
    id: "evidence",
    number: "03",
    shortLabel: "The test",
    label: "Test the important action",
  },
  {
    id: "layers",
    number: "04",
    shortLabel: "The layers",
    label: "Reveal the hidden project layers",
  },
  {
    id: "method",
    number: "05",
    shortLabel: "The method",
    label: "Learn the four-part method",
  },
  {
    id: "lesson",
    number: "06",
    shortLabel: "Your lesson",
    label: "Begin the interactive field lesson",
  },
] as const;

const openingLayerDetails = [
  {
    prompt: "What single result must this version complete?",
    summary: "What must the first version finish?",
    artifact: "A first-version brief with a clear Not now boundary",
  },
  {
    prompt: "Where do the files and their history survive?",
    summary: "Where will files and history live?",
    artifact: "A recoverable project home with version history",
  },
  {
    prompt: "What did a person actually try and observe?",
    summary: "What did a person verify?",
    artifact: "A short evidence record tied to the important path",
  },
  {
    prompt: "Which checked version is live—and which can you restore?",
    summary: "Which checked version is live?",
    artifact: "A release-and-recovery record for one exact version",
  },
] as const;

const openingMethodDetails = [
  {
    summary: "Define the first version",
    artifact: "V1 brief",
    proof: "One person can finish one complete path.",
  },
  {
    summary: "Keep the work recoverable",
    artifact: "Tool map + project home",
    proof: "You can find the files, history, and host again.",
  },
  {
    summary: "Bound the change",
    artifact: "AI work agreement",
    proof: "The requested change, boundary, and stopping point are visible.",
  },
  {
    summary: "Check the exact version",
    artifact: "Evidence + release card",
    proof: "The important path works on the exact version that is live.",
  },
] as const;

const stageById = Object.fromEntries(
  finalJourney.map((stage) => [stage.id, stage]),
) as Record<FinalLearningStage, (typeof finalJourney)[number]>;

const chapterByStage = Object.fromEntries(
  finalChapters.flatMap((chapter) =>
    chapter.stages.map((stage) => [stage, chapter]),
  ),
) as Record<FinalLearningStage, (typeof finalChapters)[number]>;

function chapterForStage(stage: FinalStage) {
  if (stage === "welcome") return finalChapters[0];
  if (stage === "completion") return finalChapters.at(-1)!;
  return chapterByStage[stage];
}

function cloneInitialProgress(): FinalProgress {
  return {
    ...initialFinalProgress,
    completedStages: [],
    mirrorDraft: { ...initialFinalProgress.mirrorDraft },
  };
}

function stageLabel(stage: FinalStage): string {
  if (stage === "welcome") return "Welcome";
  if (stage === "completion") return "Completion";
  return stageById[stage].navLabel;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

type TransitionKind =
  | "choice"
  | "substep"
  | "scene"
  | "canvas"
  | "workshop"
  | "prologue";

type NativeViewTransition = {
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  activeViewTransition?: NativeViewTransition;
  startViewTransition?: (update: () => void) => NativeViewTransition;
};

function runViewTransition(
  update: () => void,
  kind: TransitionKind = "choice",
) {
  /*
   * Scene destinations already own their entrance motion. Capturing the whole
   * root here would animate the sticky shell a second time and can briefly
   * expose both screens. Keep native snapshots for local task/canvas changes;
   * let full scene changes render once.
   */
  if (kind === "scene" || kind === "workshop") {
    update();
    return;
  }

  const viewDocument = document as ViewTransitionDocument;
  const reducedMotion = preferredScrollBehavior() === "auto";

  if (
    reducedMotion ||
    !viewDocument.startViewTransition ||
    viewDocument.activeViewTransition
  ) {
    update();
    return;
  }

  const root = document.documentElement;
  root.dataset.pentimentoTransition = kind;
  const transition = viewDocument.startViewTransition(() => {
    flushSync(update);
  });
  transition.finished.finally(() => {
    delete root.dataset.pentimentoTransition;
  });
}

function bringIntoViewIfNeeded(
  element: HTMLElement | null,
  block: ScrollLogicalPosition = "nearest",
) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const safeTop = 24;
  const safeBottom = window.innerHeight - 24;
  if (rect.top >= safeTop && rect.bottom <= safeBottom) return;
  element.scrollIntoView({
    block,
    behavior: preferredScrollBehavior(),
  });
}

function Brand({ onClick }: { onClick?: () => void }) {
  const content = (
    <>
      <span className="p4-brand__mark" aria-hidden="true">
        P
      </span>
      <b>Pentimento</b>
    </>
  );

  if (!onClick) return <div className="p4-brand">{content}</div>;
  return (
    <button className="p4-brand" type="button" onClick={onClick}>
      {content}
      <span className="p4-visually-hidden">Open the route</span>
    </button>
  );
}

function ChoiceButtons({
  choices,
  selected,
  onChoose,
  showHints = false,
}: {
  choices: readonly ChoiceItem[];
  selected: string | null;
  onChoose: (id: string) => void;
  showHints?: boolean;
}) {
  return (
    <div className={cx("p4-options", choices.length === 3 && "p4-options--three")}>
      {choices.map((choice, index) => {
        const isSelected = selected === choice.id;
        return (
          <button
            key={choice.id}
            type="button"
            className={cx(
              "p4-choice",
              isSelected && "is-selected",
              isSelected && (choice.recommended ? "is-success" : "is-risk"),
            )}
            aria-pressed={isSelected}
            onClick={() => onChoose(choice.id)}
          >
            <span className="p6-choice__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="p6-choice__copy">
              <b>{choice.label}</b>
              {showHints && <small>{choice.canvasChange}</small>}
            </span>
            <span className="p6-choice__marker" aria-hidden="true">
              <span className="p6-choice__marker-idle">→</span>
              <span className="p6-choice__marker-selected">
                {choice.recommended ? "✓" : "×"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ChoiceFeedback({
  choice,
  successLabel = "Useful choice",
  riskLabel = "More work appears beneath the surface",
  lessonRule,
  continueLabel,
  onContinue,
}: {
  choice: ChoiceItem | undefined;
  successLabel?: string;
  riskLabel?: string;
  lessonRule?: string;
  continueLabel?: string;
  onContinue?: () => void;
}) {
  return (
    <div
      className={cx("p6-feedback-shell", choice && "is-visible")}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="p6-feedback-shell__inner">
        {choice && (
          <div
            className={cx(
              "p4-feedback",
              choice.recommended ? "is-success" : "is-risk",
            )}
            key={choice.id}
          >
            <b>{choice.recommended ? successLabel : riskLabel}</b>
            <p>{choice.consequence}</p>
            <p className="p7-feedback__canvas-update">
              <b>Canvas updated:</b> {choice.canvasChange}
            </p>
            {!choice.recommended && lessonRule && (
              <p className="p7-feedback__working-rule">
                <b>Working rule:</b> {lessonRule}
              </p>
            )}
            {choice.recommended && onContinue && continueLabel && (
              <button
                className="p4-secondary p7-feedback__continue"
                type="button"
                onClick={onContinue}
              >
                {continueLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CanvasFrame({
  layer,
  children,
}: {
  layer: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="p4-canvas" role="region" aria-label="Project layers">
      <div className="p4-canvas__label">
        <span>Willow Fix Day · project layers</span>
        <b>{layer}</b>
      </div>
      {children}
    </aside>
  );
}

function BriefVisual({ risk }: { risk?: "booking" | "donation" | null }) {
  if (risk) {
    const systems =
      risk === "booking"
        ? ["Availability", "Personal data", "Cancellations", "Operator"]
        : ["Payment provider", "Identity", "Receipts", "Disputes"];
    return (
      <div className="p4-layer-stack">
        <article className="p4-layer">
          <span>Underpainting · extra systems</span>
          <h3>{risk === "booking" ? "Booking is a service." : "Payment is a system."}</h3>
          <p>
            The button is the visible surface. These responsibilities sit beneath it.
          </p>
          <div className="p4-risk-meter">
            {systems.map((system) => (
              <span className="is-on" key={system}>
                {system}
              </span>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="p4-layer-stack">
      <article className="p4-layer" aria-hidden="true">
        <span>Rough idea</span>
      </article>
      <article className="p4-layer">
        <span>Layer 01 · first-version brief</span>
        <div className="p4-brief">
          <div className="p4-brief__row">
            <span>Visitor</span>
            <b>Nearby visitor</b>
          </div>
          <div className="p4-brief__row">
            <span>Path</span>
            <b>Approved facts → decide item fit → email a question</b>
          </div>
          <div className="p4-brief__row">
            <span>Not now</span>
            <b>Accounts · booking · payments · live availability · AI advice</b>
          </div>
        </div>
      </article>
    </div>
  );
}

function SourceNoteVisual() {
  return (
    <article className="p4-source-note">
      <span>Organizer-approved note · source for V1</span>
      <h3>Willow Fix Day</h3>
      <ul>
        <li>Saturday, July 25 · 10:00–14:00</li>
        <li>West Hall Community Room · small appliances, clothing, and bicycles</li>
        <li>Questions: hello@willow-fix.example</li>
      </ul>
      <p><b>Support available now:</b> approved facts and organizer email.</p>
      <p><b>Not available:</b> booking operator or payment owner.</p>
    </article>
  );
}

function RoleRouteVisual({ route }: { route: ToolRoute | null }) {
  const guidance = route ? toolRouteGuidance[route] : null;
  return (
    <div className="p4-route">
      <div className="p4-route__nodes" aria-label="Three durable tool roles">
        {threeRoleMap.map((role, index) => (
          <article className={cx("p4-route__node", route && "is-active")} key={role.id}>
            <span>{role.job}</span>
            <b>{guidance?.diagram[index] ?? role.label}</b>
          </article>
        ))}
      </div>
      <p className="p4-route__selected">
        <b>AI workspace helps build → project home remembers → host publishes.</b>
        {guidance && (
          <>
            <br />
            Build here: {guidance.buildHere}<br />
            Keep files/history here: {guidance.keepHere}<br />
            Publish here: {guidance.publishHere}<br />
            First action: {guidance.firstAction}<br />
            Watch for: {guidance.watchFor}
          </>
        )}
      </p>
      <p className="p4-you-role">
        <b>You direct and check:</b> choose scope → approve changes → verify evidence.
      </p>
    </div>
  );
}

function HomeVisual({ progress }: { progress: FinalProgress }) {
  const route = progress.toolChoice ?? "repository";
  const guidance = projectHomeGuidance[route];
  const routeChoice = toolChoices.find((choice) => choice.id === route);
  const created = progress.projectHomeChoice === "route-home";
  return (
    <div className="p4-home">
      <div className="p4-route-receipt">
        <span>Route chosen</span>
        <b>{routeChoice?.label}</b>
        <p>Build: {toolRouteGuidance[route].buildHere} · Save: {toolRouteGuidance[route].keepHere} · Publish: {toolRouteGuidance[route].publishHere}</p>
      </div>
      <p className="p4-route__selected">
        {guidance.path.join(" → ")} → publish through the host
      </p>
      <div className="p4-home__rail">
        {guidance.path.map((step, index) => (
          <article className={cx("p4-home__step", created && "is-created")} key={step}>
            <span>Home {index + 1}</span>
            <b>{step}</b>
          </article>
        ))}
      </div>
      {created && (
        <div
          className={cx(
            "p4-secret",
            progress.secretChoice === "private-env" && "is-safe",
            progress.secretChoice === "project-files" && "is-risk",
          )}
        >
          <code>Finished visitor path</code>
          <b>
            {progress.secretChoice === "private-env"
              ? "Approved facts + normal email link · no AI API key"
              : "Decide whether runtime AI belongs next"}
          </b>
        </div>
      )}
    </div>
  );
}

function PlanningVisual({ progress }: { progress: FinalProgress }) {
  const planned = progress.aiFirstChoice === "inspect-plan";
  const request = progress.toolChoice === "hosted"
    ? "Inspect the saved project and its approved brief. Return three small steps. Preserve the Not now list. Do not edit or publish until I approve a shown step."
    : planningArtifact.conciseRequest;
  return (
    <div className="p4-prompt">
      <article className={cx("p4-prompt__paper", !planned && "is-vague")}>
        <span className="p4-mini-label">{planned ? "Limited request" : "Vague request"}</span>
        <blockquote>{planned ? request : vagueBuildRequest}</blockquote>
        {planned && (
          <div className="p4-prompt__chips">
            <span>Inspect</span>
            <span>Plan</span>
            <span>Preserve</span>
            <span>Stop</span>
          </div>
        )}
      </article>
      {progress.planApprovalChoice && (
        <div className="p4-artifact">
          <span>Approved first step</span>
          <p>{planningArtifact.approvedFirstStep}</p>
        </div>
      )}
    </div>
  );
}

function EvidenceLadder({ earned }: { earned: number }) {
  return (
    <ol className="p4-evidence" aria-label={`${earned} of 5 evidence levels earned`}>
      {evidenceLadder.map((item, index) => (
        <li
          className={cx(index < earned && "is-earned", index === earned && "is-next")}
          key={item.id}
          title={item.proves}
        >
          <span>{item.label}</span>
          <small>{index < earned ? "earned" : index === earned ? "next" : "later"}</small>
        </li>
      ))}
    </ol>
  );
}

function BuildVisual({ candidateReady }: { candidateReady: boolean }) {
  return (
    <div className="p4-build">
      <div className="p4-ai-report">
        <span>AI report</span>
        <p>Done — the Willow Fix Day page is ready.</p>
      </div>
      <div className="p4-build__loop" aria-label="The reusable build loop">
        {["Ask", "Inspect", "Run", "Check", "Save"].map((step, index) => (
          <span
            className={cx(
              index < 3 && "is-complete",
              index === 3 && "is-next",
            )}
            key={step}
          >
            {step}
          </span>
        ))}
      </div>
      <div className="p4-versions" aria-label="Saved layers">
        <span className={cx("p4-version", candidateReady && "is-candidate")}>
          {candidateReady ? "V1 candidate" : "V1 preview"}
        </span>
        <span className="p4-version">Not checked</span>
        <span className="p4-version">Not saved</span>
      </div>
      <EvidenceLadder earned={3} />
    </div>
  );
}

function BrowserVisual({ state }: { state: "untested" | "failed" | "repaired" | "fixed" }) {
  const ready = state === "repaired" || state === "fixed";
  return (
    <div className="p4-browser">
      <div className="p4-browser__bar">willow-fix · preview</div>
      <div className="p4-browser__page">
        <span>Saturday · West Hall Community Room</span>
        <h3>Bring it. Repair it. Learn together.</h3>
        <p>Small appliances, clothing, and bicycles. Repairs depend on volunteer availability.</p>
        <span className={cx("p4-contact", state === "failed" && "is-broken", ready && "is-fixed")}>
          {state === "fixed" ? "Simulated target reached ✓" : state === "repaired" ? "Repair ready · retry" : "Email the organizer"}
        </span>
        {state === "failed" && <span className="p4-defect-marker">Nothing happened</span>}
      </div>
    </div>
  );
}

function FixedPathVisual() {
  return (
    <div className="p4-browser p4-browser--compact">
      <div className="p4-browser__bar">willow-fix · checked V4</div>
      <div className="p4-browser__page">
        <span>Repeated visitor path</span>
        <h3>Simulated target reached.</h3>
        <p>No email was sent. In a real preview, repeat the mail link once by keyboard and once by pointer.</p>
        <span className="p4-contact is-fixed">mailto target reached ✓</span>
      </div>
    </div>
  );
}

function ReleaseVisual({ progress }: { progress: FinalProgress }) {
  const selected = progress.releaseVersionChoice === "v4-checked";
  const publicChecked = progress.releaseProofChoice === "public-path";
  return (
    <div className="p4-release">
      <div className="p4-release__rail">
        {releasePipeline.map((node, index) => {
          const reached = index === 0 || (index === 1 && selected) || (index === 2 && publicChecked);
          return (
            <div className={cx("p4-release__node", reached && "is-reached")} key={node}>
              <i>{index + 1}</i>
              <b>{node}</b>
            </div>
          );
        })}
      </div>
      <div className="p4-recovery">
        <span>Recovery</span>
        <b>V2 · last known working version stays pinned</b>
      </div>
      {publicChecked && (
        <div className="p4-artifact">
          <span>Public evidence</span>
          <p>V4 selected · public path worked · recovery preserved.</p>
        </div>
      )}
    </div>
  );
}

function ImproveVisual({
  sourceUpdated,
  saved,
}: {
  sourceUpdated: boolean;
  saved: boolean;
}) {
  return (
    <div className="p4-diff">
      <article>
        <small>V4 · trusted source</small>
        <p>West Hall Community Room</p>
      </article>
      <span aria-hidden="true">→</span>
      <article>
        <small>
          {saved
            ? "V5 · checked source + page"
            : sourceUpdated
              ? "V5 candidate · targeted checks pending"
              : "Requested layer"}
        </small>
        <p>Step-free access: side entrance on Willow Lane</p>
      </article>
    </div>
  );
}

function SavedArtifact({ progress }: { progress: FinalProgress }) {
  const current = progress.stage;
  if (current === "ask-ai" && progress.completedStages.includes("project-home")) {
    const route = progress.toolChoice ?? "repository";
    const conciseChecklist = route === "repository"
      ? [
          "Project folder named",
          "Saved history (Git) started",
          "Online copy (GitHub) controlled",
          "Private-key boundary checked",
        ]
      : [
          "Hosted project named",
          "Saved-version restore found",
          "GitHub connection or export checked",
          "Protected-secret boundary checked",
        ];
    return (
      <section className="p4-artifact" role="region" aria-label="Project-home checklist">
        <span>Saved artifact</span>
        <h3>Project-home checklist</h3>
        <ul>
          {conciseChecklist.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    );
  }
  if (current === "build" && progress.completedStages.includes("ask-ai")) {
    return (
      <section className="p4-artifact">
        <span>Approved first step</span>
        <p>{planningArtifact.approvedFirstStep}</p>
      </section>
    );
  }
  if (current === "check" && progress.completedStages.includes("build")) {
    return (
      <section className="p4-artifact" role="region" aria-label="Saved change record">
        <span>Saved change record</span>
        <h3>{buildArtifact.title}</h3>
        <p><b>Request:</b> Approved page structure only; then stop.</p>
        <p><b>Changed files:</b> {buildArtifact.changedFiles.join(", ")}</p>
        <p><b>Observed result:</b> {buildArtifact.visibleResult}</p>
        <p><b>Checks:</b> Automatic code check passed; preview opened; visitor behavior is not proven yet.</p>
        <p><b>Saved version:</b> {buildArtifact.savedVersion}</p>
      </section>
    );
  }
  if (current === "go-live" && progress.completedStages.includes("check")) {
    return (
      <section className="p4-artifact">
        <span>Checked layer</span>
        <h3>V4 · checked repair</h3>
        <p>Human path worked after the bounded contact repair.</p>
      </section>
    );
  }
  if (current === "improve" && progress.completedStages.includes("go-live")) {
    return (
      <section className="p4-artifact" role="region" aria-label="Release card">
        <span>Release card</span>
        <h3>{releaseArtifact.exactVersion}</h3>
        <p>{releaseArtifact.publicUrl}</p>
        <p>Public path worked · {releaseArtifact.knownLimit}</p>
        <p><b>{releaseArtifact.recoveryLabel}:</b> {releaseArtifact.restoreAction}</p>
      </section>
    );
  }
  return null;
}

function FoundationSummary({ progress }: { progress: FinalProgress }) {
  return (
    <div className="p4-layer-tabs" aria-label="Earlier saved layers">
      {progress.completedStages.map((stage) => (
        <span key={stage}>
          {String(finalLearningStages.indexOf(stage) + 1).padStart(2, "0")} · {stageById[stage].navLabel} saved
        </span>
      ))}
    </div>
  );
}

function savedDecisionReason(
  stage: FinalLearningStage,
  progress: FinalProgress,
): string | null {
  switch (stage) {
    case "idea":
      return ideaChoices.find((choice) => choice.id === progress.ideaChoice)?.consequence ?? null;
    case "tools":
      return toolChoices.find((choice) => choice.id === progress.toolChoice)?.consequence ?? null;
    case "project-home":
      return secretChoices.find((choice) => choice.id === progress.secretChoice)?.consequence ?? null;
    case "ask-ai":
      return planApprovalChoices.find((choice) => choice.id === progress.planApprovalChoice)?.consequence ?? null;
    case "build":
      return buildEvidenceChoices.find((choice) => choice.id === progress.buildEvidenceChoice)?.consequence ?? null;
    case "check":
      return checkRetryChoices.find((choice) => choice.id === progress.checkRetryChoice)?.consequence ?? null;
    case "go-live":
      return releaseProofChoices.find((choice) => choice.id === progress.releaseProofChoice)?.consequence ?? null;
    case "improve":
      return improveChoices.find((choice) => choice.id === progress.improveChoice)?.consequence ?? null;
  }
}

function LastSavedRule({ progress }: { progress: FinalProgress }) {
  if (progress.stage === "welcome") return null;
  const previous = progress.stage === "completion"
    ? finalJourney.at(-1)
    : finalJourney[finalLearningStages.indexOf(progress.stage) - 1];
  if (!previous || !progress.completedStages.includes(previous.id)) return null;
  return (
    <aside
      className="p5-saved-receipt"
      aria-label={`${previous.navLabel} lesson completed`}
    >
      <span>Previous lesson · {previous.navLabel}</span>
      <p>{previous.reusableRule}</p>
      <small>{previous.savedLabel}</small>
    </aside>
  );
}

function ProjectCanvas({ progress }: { progress: FinalProgress }) {
  const stage = progress.stage;
  const layerNumber =
    stage === "completion"
      ? 8
      : stage === "welcome"
        ? 0
        : Math.max(1, finalLearningStages.indexOf(stage) + 1);

  if (stage === "completion") {
    return (
      <CanvasFrame layer="8 / 8 · V5 saved">
        <div className="p4-artifact">
          <span>Source-backed layer · V5</span>
          <h3>Step-free entrance added</h3>
          <p>Step-free access is through the side entrance on Willow Lane.</p>
          <p>Trusted source changed first · affected checks passed · V4 preserved beneath V5.</p>
        </div>
      </CanvasFrame>
    );
  }

  if (stage === "idea") {
    const risk = progress.ideaChoice === "booking" || progress.ideaChoice === "donation"
      ? progress.ideaChoice
      : null;
    return (
      <CanvasFrame layer={`${layerNumber} / 8`}>
        {progress.ideaChoice === null ? <SourceNoteVisual /> : <BriefVisual risk={risk} />}
      </CanvasFrame>
    );
  }
  if (stage === "tools") {
    return (
      <CanvasFrame layer={`${layerNumber} / 8`}>
        {progress.ideaChoice === "facts-email" && (
          <div className="p4-artifact">
            <span>Layer 01 saved</span>
            <p>{firstVersionBriefArtifact.path}</p>
            <p>Not now: {firstVersionBriefArtifact.notNow}</p>
          </div>
        )}
        <RoleRouteVisual route={progress.toolChoice} />
      </CanvasFrame>
    );
  }
  if (stage === "project-home") {
    return (
      <CanvasFrame layer={`${layerNumber} / 8`}>
        <HomeVisual progress={progress} />
      </CanvasFrame>
    );
  }
  if (stage === "ask-ai") {
    return (
      <CanvasFrame layer={`${layerNumber} / 8`}>
        <FoundationSummary progress={progress} />
        <SavedArtifact progress={progress} />
        <PlanningVisual progress={progress} />
      </CanvasFrame>
    );
  }
  if (stage === "build") {
    return (
      <CanvasFrame layer={`${layerNumber} / 8`}>
        <FoundationSummary progress={progress} />
        <SavedArtifact progress={progress} />
        <BuildVisual candidateReady={progress.buildEvidenceChoice === "full-evidence"} />
      </CanvasFrame>
    );
  }
  if (stage === "check") {
    return (
      <CanvasFrame layer={`${layerNumber} / 8`}>
        <FoundationSummary progress={progress} />
        <BrowserVisual
          state={
            progress.checkRetryChoice
              ? "fixed"
              : progress.repairChoice === "bounded-repair"
                ? "repaired"
                : progress.checkAttemptChoice
                  ? "failed"
                  : "untested"
          }
        />
        <EvidenceLadder earned={progress.checkRetryChoice ? 4 : 3} />
        <SavedArtifact progress={progress} />
      </CanvasFrame>
    );
  }
  if (stage === "go-live") {
    return (
      <CanvasFrame layer={`${layerNumber} / 8`}>
      <FoundationSummary progress={progress} />
      <FixedPathVisual />
      <EvidenceLadder earned={progress.releaseProofChoice === "public-path" ? 5 : 4} />
      <ReleaseVisual progress={progress} />
        <SavedArtifact progress={progress} />
      </CanvasFrame>
    );
  }
  return (
    <CanvasFrame layer={`${layerNumber} / 8`}>
      <FoundationSummary progress={progress} />
      <ImproveVisual
        sourceUpdated={progress.improveChoice === "source-then-page"}
        saved={progress.completedStages.includes("improve")}
      />
      <SavedArtifact progress={progress} />
    </CanvasFrame>
  );
}

function canvasDisclosureLabel(stage: FinalStage): string {
  switch (stage) {
    case "idea":
      return "View the approved source";
    case "tools":
      return "View the tool map";
    case "project-home":
      return "View the project home";
    case "ask-ai":
      return "View the saved request";
    case "build":
      return "View the change record";
    case "check":
      return "View the simulated preview";
    case "go-live":
      return "View release evidence";
    case "improve":
      return "View the source-backed update";
    case "completion":
      return "View the final project layer";
    default:
      return "View the project canvas";
  }
}

function canvasStateSignature(progress: FinalProgress): string {
  return [
    progress.stage,
    progress.completedStages.length,
    progress.ideaChoice,
    progress.toolChoice,
    progress.projectHomeChoice,
    progress.secretChoice,
    progress.aiFirstChoice,
    progress.planApprovalChoice,
    progress.buildEvidenceChoice,
    progress.checkAttemptChoice,
    progress.repairChoice,
    progress.checkRetryChoice,
    progress.releaseVersionChoice,
    progress.releaseProofChoice,
    progress.improveChoice,
  ].join(":");
}

function ProjectSurfaceVisual({ progress }: { progress: FinalProgress }) {
  const stage = progress.stage;
  const built =
    stage === "build" ||
    stage === "check" ||
    stage === "go-live" ||
    stage === "improve" ||
    stage === "completion";
  const failed = stage === "check" && Boolean(progress.checkAttemptChoice) && !progress.checkRetryChoice;
  const checked =
    (stage === "check" && Boolean(progress.checkRetryChoice)) ||
    (stage === "go-live" && progress.releaseVersionChoice === "v4-checked") ||
    stage === "improve" ||
    stage === "completion";
  const updated = stage === "completion" || progress.improveChoice === "source-then-page";
  const status = !built
    ? "Not built yet"
    : failed
      ? "Dead path observed"
      : checked
        ? updated
          ? "V5 · source-backed"
          : "V4 · checked"
        : "AI says: ready";

  return (
    <div className="p5-surface">
      <div className="p5-surface__bar">
        <span>willow-fix.preview</span>
        <b className={cx(failed && "is-failed", checked && "is-checked")}>{status}</b>
      </div>
      {built ? (
        <div className="p5-surface__page">
          <p>Neighborhood repair day · West Hall</p>
          <h3>Bring it broken.<br />Leave with a plan.</h3>
          <span>Small appliances · clothing · bicycles</span>
          {updated && <mark>Step-free access · Willow Lane entrance</mark>}
          <div className={cx("p5-surface__action", failed && "is-failed", checked && "is-checked")}>
            {failed
              ? "Email action · nothing happened"
              : checked
                ? "Email path · checked"
                : "Email the organizer"}
          </div>
        </div>
      ) : (
        <div className="p5-surface__empty">
          <span aria-hidden="true">＋</span>
          <b>The visible page comes later.</b>
          <p>First decide what it can honestly promise and where the work will live.</p>
        </div>
      )}
      <p className="p5-surface__caption">
        The surface shows what a visitor sees. The underlayers show why it can be trusted.
      </p>
    </div>
  );
}

function CanvasLens({ progress }: { progress: FinalProgress }) {
  const [view, setView] = useState<"surface" | "underlayers">("underlayers");
  const transitionKey = `${view}:${canvasStateSignature(progress)}`;
  return (
    <section className="p5-canvas-lens" aria-label="Visitor surface and project layers">
      <div
        className="p5-canvas-lens__controls"
        data-view={view}
        role="group"
        aria-label="Project canvas view"
      >
        <button
          type="button"
          aria-pressed={view === "surface"}
          onClick={() => setView("surface")}
        >
          Visitor surface
        </button>
        <button
          type="button"
          aria-pressed={view === "underlayers"}
          onClick={() => setView("underlayers")}
        >
          Layers underneath
        </button>
      </div>
      <div className="p5-canvas-lens__view" key={transitionKey}>
        {view === "surface" ? (
          <CanvasFrame layer="Visitor surface">
            <ProjectSurfaceVisual progress={progress} />
          </CanvasFrame>
        ) : (
          <ProjectCanvas progress={progress} />
        )}
      </div>
    </section>
  );
}

function ResponsiveProjectCanvas({ progress }: { progress: FinalProgress }) {
  return (
    <>
      <div className="p4-canvas-desktop">
        <CanvasLens progress={progress} />
      </div>
      <details className="p4-canvas-mobile">
        <summary>
          <span>Project layer updated</span>
          <b>{canvasDisclosureLabel(progress.stage)}</b>
        </summary>
        <CanvasLens progress={progress} />
      </details>
    </>
  );
}

type StageTaskProps = {
  progress: FinalProgress;
  pendingHandoff: HandoffId | null;
  receiptReady: boolean;
  choose: (
    stage: FinalLearningStage,
    patch: Partial<FinalProgress>,
    complete?: boolean,
    handoff?: HandoffId,
  ) => void;
  onContinueHandoff: (handoff: HandoffId) => void;
  onRevealReceipt: () => void;
};

function TaskShell({
  id,
  eyebrow,
  question,
  hint,
  children,
}: {
  id: string;
  eyebrow: string;
  question: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-question`;
  return (
    <section className="p4-task" role="group" aria-labelledby={headingId}>
      <p className="p4-task__eyebrow">{eyebrow}</p>
      <h2 id={headingId} tabIndex={-1}>{question}</h2>
      {hint && <p className="p4-task__hint">{hint}</p>}
      {children}
    </section>
  );
}

function LessonHandoff({
  eyebrow,
  title,
  body,
  action,
  onContinue,
  tone = "progress",
}: {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
  onContinue: () => void;
  tone?: "progress" | "observed";
}) {
  return (
    <section
      className={cx("p7-handoff", tone === "observed" && "is-observed")}
      aria-label={eyebrow}
    >
      <span>{eyebrow}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <button className="p4-secondary" type="button" onClick={onContinue}>
        {action}
      </button>
    </section>
  );
}

function IdeaTask({
  progress,
  choose,
  receiptReady,
  onRevealReceipt,
}: StageTaskProps) {
  const selected = ideaChoices.find((choice) => choice.id === progress.ideaChoice);
  return (
    <TaskShell
      id="idea"
      eyebrow="Your first boundary"
      question="What should a visitor be able to do from start to finish?"
      hint="Choose what can work completely today—not what sounds most impressive."
    >
      <ChoiceButtons
        choices={ideaChoices}
        selected={progress.ideaChoice}
        onChoose={(id) =>
          choose("idea", { ideaChoice: id as FinalProgress["ideaChoice"] }, id === "facts-email")
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="A small, complete path"
        riskLabel="Useful later; unsupported in this first version"
        lessonRule={stageById.idea.reusableRule}
        continueLabel={!receiptReady ? "Save this lesson" : undefined}
        onContinue={!receiptReady ? onRevealReceipt : undefined}
      />
    </TaskShell>
  );
}

function ToolsTask({
  progress,
  choose,
  receiptReady,
  onRevealReceipt,
}: StageTaskProps) {
  const selected = toolChoices.find((choice) => choice.id === progress.toolChoice);
  return (
    <TaskShell
      id="tools"
      eyebrow="One route, three jobs"
      question="Which tradeoff matters more for your first project?"
      hint="Both routes can work. Choose the starting experience that suits you today—not a product brand."
    >
      <div className="p7-role-primer" aria-label="The three jobs every AI project needs covered">
        <div><span>01 · Build</span><b>Where AI changes the project</b></div>
        <div><span>02 · Remember</span><b>Where files and versions survive</b></div>
        <div><span>03 · Publish</span><b>Where one chosen version becomes available</b></div>
      </div>
      <ChoiceButtons
        choices={toolChoices}
        selected={progress.toolChoice}
        onChoose={(id) =>
          choose("tools", { toolChoice: id as FinalProgress["toolChoice"] }, true)
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="A deliberate starter route"
        lessonRule={stageById.tools.reusableRule}
        continueLabel={!receiptReady ? "Save this lesson" : undefined}
        onContinue={!receiptReady ? onRevealReceipt : undefined}
      />
    </TaskShell>
  );
}

function ProjectHomeTask({
  progress,
  choose,
  pendingHandoff,
  receiptReady,
  onContinueHandoff,
  onRevealReceipt,
}: StageTaskProps) {
  const route = progress.toolChoice ?? "repository";
  const holdingProjectHome = pendingHandoff === "runtime-ai";
  if (progress.projectHomeChoice === "route-home" && !holdingProjectHome) {
    const privateChoices: readonly ChoiceItem[] = [secretChoices[1], secretChoices[0]];
    const selected = privateChoices.find((choice) => choice.id === progress.secretChoice);
    return (
      <TaskShell
        id="runtime-ai"
        eyebrow="Project home chosen · decide what runs for visitors"
        question="Will visitors need AI inside the finished page?"
        hint="AI helped build it. Now decide whether the visitor experience itself needs live AI."
      >
        <ChoiceButtons
          choices={privateChoices}
          selected={progress.secretChoice}
          onChoose={(id) =>
            choose(
              "project-home",
              { secretChoice: id as FinalProgress["secretChoice"] },
              id === "private-env",
            )
          }
        />
        <ChoiceFeedback
          choice={selected}
          successLabel="Build-time AI is not runtime AI"
          riskLabel="An unnecessary system was added"
          lessonRule={stageById["project-home"].reusableRule}
          continueLabel={!receiptReady ? "Save this lesson" : undefined}
          onContinue={!receiptReady ? onRevealReceipt : undefined}
        />
      </TaskShell>
    );
  }

  const correctLabel =
    route === "repository"
      ? "Files in a project folder, with saved history (Git) and an online copy (GitHub)"
      : "A saved hosted project with versions and a GitHub connection or export";
  const survivalChoices: readonly ChoiceItem[] = [
    { ...projectHomeChoices[1], label: correctLabel },
    { ...projectHomeChoices[0], label: "Only in this AI chat" },
  ];
  const selected = survivalChoices.find((choice) => choice.id === progress.projectHomeChoice);
  return (
    <TaskShell
      id="project-home"
      eyebrow="Make the work recoverable"
      question="Where should the work survive after this chat closes?"
      hint={
        route === "repository"
          ? `First action: ${toolRouteGuidance.repository.firstAction}`
          : `First action: ${toolRouteGuidance.hosted.firstAction}`
      }
    >
      <ChoiceButtons
        choices={survivalChoices}
        selected={progress.projectHomeChoice}
        onChoose={(id) =>
          choose("project-home", {
            projectHomeChoice: id as FinalProgress["projectHomeChoice"],
            secretChoice: null,
          }, false, id === "route-home" ? "runtime-ai" : undefined)
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="The work has a home"
        riskLabel="The work would disappear with the chat"
        lessonRule={stageById["project-home"].reusableRule}
        continueLabel={holdingProjectHome ? "Continue · decide what visitors actually need" : undefined}
        onContinue={
          holdingProjectHome
            ? () => onContinueHandoff("runtime-ai")
            : undefined
        }
      />
    </TaskShell>
  );
}

function AskTask({
  progress,
  choose,
  pendingHandoff,
  receiptReady,
  onContinueHandoff,
  onRevealReceipt,
}: StageTaskProps) {
  const holdingRequest = pendingHandoff === "approve-plan";
  if (progress.aiFirstChoice === "inspect-plan" && !holdingRequest) {
    const selected = planApprovalChoices.find(
      (choice) => choice.id === progress.planApprovalChoice,
    );
    return (
      <TaskShell
        id="approve-plan"
        eyebrow="AI stopped before editing"
        question="How much should AI do before you review again?"
      >
        <section role="region" aria-label="AI's three-step plan">
          <div className="p4-plan-criteria">
            <span>One visible result</span>
            <span>Evidence named</span>
            <span>Stops for review</span>
          </div>
          <ol className="p4-plan p4-plan--first">
            <li>
              <span>Proposed step 1</span>
              <b>{shownThreeStepPlan[0]}</b>
            </li>
          </ol>
          <details className="p4-plan-more">
            <summary>See proposed steps 2 and 3</summary>
            <ol className="p4-plan">
              {shownThreeStepPlan.slice(1).map((step, index) => (
                <li key={step}>
                  <span>Step {index + 2}</span>
                  <b>{step}</b>
                </li>
              ))}
            </ol>
          </details>
        </section>
        <ChoiceButtons
          choices={planApprovalChoices}
          selected={progress.planApprovalChoice}
          onChoose={(id) =>
            choose(
              "ask-ai",
              { planApprovalChoice: id as FinalProgress["planApprovalChoice"] },
              id === "approve-step-one",
            )
          }
        />
        <ChoiceFeedback
          choice={selected}
          successLabel="One shown step approved"
          riskLabel="Too much work before the next review"
          lessonRule={stageById["ask-ai"].reusableRule}
          continueLabel={!receiptReady ? "Save this lesson" : undefined}
          onContinue={!receiptReady ? onRevealReceipt : undefined}
        />
      </TaskShell>
    );
  }

  const selected = aiFirstChoices.find((choice) => choice.id === progress.aiFirstChoice);
  return (
    <TaskShell
      id="ask-ai"
      eyebrow="Before AI changes files"
      question="What should AI do first?"
      hint={`The rough request is: “${vagueBuildRequest}”`}
    >
      <ChoiceButtons
        choices={aiFirstChoices}
        selected={progress.aiFirstChoice}
        onChoose={(id) =>
          choose("ask-ai", {
            aiFirstChoice: id as FinalProgress["aiFirstChoice"],
            planApprovalChoice: null,
          }, false, id === "inspect-plan" ? "approve-plan" : undefined)
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="Plan before change"
        riskLabel="Too much changes before you can review it"
        lessonRule={stageById["ask-ai"].reusableRule}
        continueLabel={holdingRequest ? "See the bounded request and proposed plan" : undefined}
        onContinue={
          holdingRequest
            ? () => onContinueHandoff("approve-plan")
            : undefined
        }
      />
    </TaskShell>
  );
}

function BuildTask({
  progress,
  choose,
  receiptReady,
  onRevealReceipt,
}: StageTaskProps) {
  const choices: readonly ChoiceItem[] = buildEvidenceChoices;
  const selected = choices.find((choice) => choice.id === progress.buildEvidenceChoice);
  return (
    <TaskShell
      id="build"
      eyebrow="AI says “Done” · three evidence levels earned"
      question="The preview is open. What must happen before this candidate can be trusted?"
      hint="The AI claim, changed files, and preview prove three different things. Human-path evidence is still missing."
    >
      <EvidenceLadder earned={3} />
      <ChoiceButtons
        choices={choices}
        selected={progress.buildEvidenceChoice}
        onChoose={(id) =>
          choose(
            "build",
            { buildEvidenceChoice: id as FinalProgress["buildEvidenceChoice"] },
            id === "full-evidence",
          )
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="Correct next action · evidence still pending"
        riskLabel="Evidence is still missing"
        lessonRule="A preview is a candidate—not proof that the visitor path works."
        continueLabel={!receiptReady ? "Save this lesson" : undefined}
        onContinue={!receiptReady ? onRevealReceipt : undefined}
      />
    </TaskShell>
  );
}

function ContactPractice({
  state,
  onTry,
  context = "preview",
}: {
  state: "ready" | "failed" | "repaired" | "reached";
  onTry?: () => void;
  context?: "preview" | "public";
}) {
  const interactive = state === "ready" || state === "repaired";
  return (
    <div className="p4-browser p4-browser--practice">
      <div className="p4-browser__bar">
        {context === "public"
          ? "willow-fix.example · public V4 · build WF-V4-CHECKED"
          : "simulated preview · no email is sent"}
      </div>
      <div className="p4-browser__page">
        <span>Willow Fix Day · contact</span>
        <h3>Questions before you come?</h3>
        <p>
          {context === "public"
            ? "This fresh public page confirms what a visitor actually received."
            : "The address is fictional. This checks link behavior, not delivery."}
        </p>
        <button
          type="button"
          className={cx(
            "p4-contact",
            (state === "repaired" || state === "reached") && "is-fixed",
            state === "failed" && "is-broken",
          )}
          onClick={onTry}
          disabled={!interactive}
        >
          {state === "failed"
            ? "Email the organizer · no response"
            : state === "reached"
              ? context === "public"
                ? "Public path reached ✓"
                : "Preview path repeated ✓"
              : "Email the organizer"}
        </button>
      </div>
    </div>
  );
}

function CheckTask({
  progress,
  choose,
  pendingHandoff,
  receiptReady,
  onContinueHandoff,
  onRevealReceipt,
}: StageTaskProps) {
  if (progress.checkRetryChoice === "retry-contact") {
    return (
      <TaskShell
        id="check-complete"
        eyebrow="Human-path evidence earned"
        question="The same visitor path now finishes"
        hint="You reproduced the failure, repaired only its cause, and repeated the exact action."
      >
        <ContactPractice state="reached" />
        {!receiptReady && (
          <LessonHandoff
            eyebrow="Observation → repair → proof"
            title="A passing repeat is stronger than a confident report."
            body="The evidence belongs to the checked version because you performed the path after the repair."
            action="Save this lesson"
            onContinue={onRevealReceipt}
          />
        )}
      </TaskShell>
    );
  }

  if (pendingHandoff === "repair") {
    return (
      <TaskShell
        id="try-contact-result"
        eyebrow="Observed result"
        question="The polished path has a real dead end"
        hint="You turned appearance into an observation. Record what happened before asking AI to repair anything."
      >
        <ContactPractice state="failed" />
        <LessonHandoff
          eyebrow="Evidence captured"
          title="Nothing happened when the important action was used."
          body="Now describe the observed result, the expected result, and what the repair must preserve."
          action="Continue · write the defect"
          onContinue={() => onContinueHandoff("repair")}
          tone="observed"
        />
      </TaskShell>
    );
  }

  if (progress.introFailureObserved && !progress.checkAttemptChoice) {
    return (
      <TaskShell
        id="remembered-contact-result"
        eyebrow="Evidence carried from the introduction"
        question="You found this failure earlier. Now record it."
        hint="The important action produced no result. Preserve that observation before asking AI to repair anything."
      >
        <ContactPractice state="failed" />
        <LessonHandoff
          eyebrow="Observed · important path failed"
          title="Nothing happened when you used the email action."
          body="Turn the observation into a defect: name what happened, what should have happened, and what the repair must preserve."
          action="Continue · write the defect"
          onContinue={() =>
            choose("check", { checkAttemptChoice: "try-contact" })
          }
          tone="observed"
        />
      </TaskShell>
    );
  }

  if (!progress.checkAttemptChoice) {
    return (
      <TaskShell
        id="try-contact"
        eyebrow="Use it like a visitor"
        question="Try the visitor contact action"
        hint="The preview looks polished. Find out what the important path actually does."
      >
        <ContactPractice
          state="ready"
          onTry={() =>
            choose(
              "check",
              { checkAttemptChoice: "try-contact" },
              false,
              "repair",
            )
          }
        />
      </TaskShell>
    );
  }

  if (
    progress.repairChoice === "bounded-repair" &&
    pendingHandoff !== "retry-contact"
  ) {
    return (
      <TaskShell
        id="retry-contact"
        eyebrow="One link changed · everything else preserved"
        question="Does the repaired contact path now finish?"
        hint="Repeat the same action. This simulation should reach the mailto target; it will not open or send email."
      >
        <ContactPractice
          state="repaired"
          onTry={() =>
            choose(
              "check",
              { checkRetryChoice: "retry-contact" },
              true,
            )
          }
        />
      </TaskShell>
    );
  }

  const choices: readonly ChoiceItem[] = [
    {
      ...repairChoices[1],
      label: "Repair only the inactive email link",
    },
    repairChoices[0],
  ];
  const selected = choices.find((choice) => choice.id === progress.repairChoice);
  return (
    <TaskShell
      id="repair"
      eyebrow="Observed: nothing happened"
      question="What should you do after the contact action fails?"
      hint="Repair the cause you observed while preserving everything that already works."
    >
      <section
        className="p4-artifact p6-defect-report"
        role="region"
        aria-label="Defect report"
      >
        <span>Defect report</span>
        <div className="p4-defect-brief">
          <p><b>Observed</b><span>Nothing happened.</span></p>
          <p><b>Expected</b><span>Reach the approved email target.</span></p>
        </div>
        <details>
          <summary>See steps, what to preserve, and the repeat check</summary>
          {defectReportArtifact.fields
            .filter((field) => field.label === "Steps" || field.label === "Preserve" || field.label === "Repeat after repair")
            .map((field) => (
              <p key={field.label}><b>{field.label}:</b> {field.value}</p>
            ))}
        </details>
      </section>
      <ChoiceButtons
        choices={choices}
        selected={progress.repairChoice}
        onChoose={(id) =>
          choose(
            "check",
            { repairChoice: id as FinalProgress["repairChoice"] },
            false,
            id === "bounded-repair" ? "retry-contact" : undefined,
          )
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="Smallest safe repair"
        riskLabel="The repair expanded beyond the observed defect"
        lessonRule={stageById.check.reusableRule}
        continueLabel={
          pendingHandoff === "retry-contact"
            ? "Continue · repeat the same visitor path"
            : undefined
        }
        onContinue={
          pendingHandoff === "retry-contact"
            ? () => onContinueHandoff("retry-contact")
            : undefined
        }
      />
    </TaskShell>
  );
}

function GoLiveTask({
  progress,
  choose,
  pendingHandoff,
  receiptReady,
  onContinueHandoff,
  onRevealReceipt,
}: StageTaskProps) {
  if (progress.releaseProofChoice === "public-path") {
    return (
      <TaskShell
        id="release-complete"
        eyebrow="Public evidence earned"
        question="The checked V4 path also works in public"
        hint="The exact version, the fresh public result, and the recovery version now belong on one release record."
      >
        <ContactPractice state="reached" context="public" />
        {!receiptReady && (
          <LessonHandoff
            eyebrow="Release verified"
            title="The dashboard and the visitor path now tell the same story."
            body="Hosting finished, V4 was served, and the important public action still worked."
            action="Save this lesson"
            onContinue={onRevealReceipt}
          />
        )}
      </TaskShell>
    );
  }

  if (progress.releaseProofChoice === "dashboard-success") {
    return (
      <TaskShell
        id="public-path"
        eyebrow="Public version · V4"
        question="Does the visitor path still work at the public address?"
        hint="Repeat the important action on the fresh public version. The address and email are fictional."
      >
        <ContactPractice
          state="repaired"
          context="public"
          onTry={() =>
            choose(
              "go-live",
              { releaseProofChoice: "public-path" },
              true,
            )
          }
        />
      </TaskShell>
    );
  }

  if (
    progress.releaseVersionChoice === "v4-checked" &&
    pendingHandoff !== "release-proof"
  ) {
    return (
      <TaskShell
        id="release-proof"
        eyebrow="Deployment finished · public behavior unproven"
        question="What does the green hosting dashboard actually prove?"
        hint="It proves that hosting finished. It does not prove which version a visitor received."
      >
        <div className="p4-public-check">
          <div>
            <span>Host dashboard</span>
            <b>Deployment completed</b>
            <code>Build WF-V4-CHECKED · source V4</code>
            <small>
              The receipt ties the public build to checked V4. It still does
              not prove the visitor path works.
            </small>
          </div>
          <button
            className="p4-primary"
            type="button"
            onClick={() =>
              choose(
                "go-live",
                { releaseProofChoice: "dashboard-success" },
                false,
              )
            }
          >
            Open the public version
          </button>
        </div>
      </TaskShell>
    );
  }

  const selected = releaseVersionChoices.find(
    (choice) => choice.id === progress.releaseVersionChoice,
  );
  return (
      <TaskShell
        id="release-version"
        eyebrow="Choose an exact layer"
        question="Which version should go live?"
        hint="Compare what was actually checked. Visual polish and visitor behavior are different evidence."
    >
      <ol className="p9-version-thread" aria-label="How the project versions changed">
        <li><span>V1</span><b>Structure</b></li>
        <li><span>V2</span><b>Email worked</b></li>
        <li><span>V3</span><b>Phone polish broke it</b></li>
        <li><span>V4</span><b>Repaired + retested</b></li>
      </ol>
      <ChoiceButtons
        choices={releaseVersionChoices}
        selected={progress.releaseVersionChoice}
        onChoose={(id) =>
          choose("go-live", {
            releaseVersionChoice: id as FinalProgress["releaseVersionChoice"],
            releaseProofChoice: null,
          }, false, id === "v4-checked" ? "release-proof" : undefined)
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="Release candidate selected"
        riskLabel="Known evidence does not support this version"
        lessonRule={stageById["go-live"].reusableRule}
        continueLabel={
          pendingHandoff === "release-proof"
            ? "Continue · inspect the public release"
            : undefined
        }
        onContinue={
          pendingHandoff === "release-proof"
            ? () => onContinueHandoff("release-proof")
            : undefined
        }
      />
    </TaskShell>
  );
}

function ImproveTask({
  progress,
  choose,
  pendingHandoff,
  receiptReady,
  onContinueHandoff,
  onRevealReceipt,
}: StageTaskProps) {
  const holdingSourceChange = pendingHandoff === "affected-checks";
  const selected = improveChoices.find((choice) => choice.id === progress.improveChoice);

  if (progress.improveChoice === "source-then-page" && !holdingSourceChange) {
    const affectedSelected = affectedCheckChoices.find(
      (choice) => choice.id === progress.affectedCheckChoice,
    );
    return (
      <TaskShell
        id="affected-checks"
        eyebrow="Source and surface now agree"
        question="Which evidence should be refreshed for this one-fact update?"
        hint="Follow what the fact can affect, then run one small check for accidental breakage."
      >
        <ChoiceButtons
          choices={affectedCheckChoices}
          selected={progress.affectedCheckChoice}
          onChoose={(id) =>
            choose("improve", {
              affectedCheckChoice:
                id as FinalProgress["affectedCheckChoice"],
            })
          }
        />
        <ChoiceFeedback
          choice={affectedSelected}
          successLabel="Checks follow the dependency"
          riskLabel="The evidence no longer matches the size of the change"
          lessonRule={stageById.improve.reusableRule}
          continueLabel={
            affectedSelected?.recommended && !receiptReady
              ? "Save this lesson"
              : undefined
          }
          onContinue={
            affectedSelected?.recommended && !receiptReady
              ? onRevealReceipt
              : undefined
          }
        />
      </TaskShell>
    );
  }

  return (
    <TaskShell
      id="improve"
      eyebrow="One new approved fact"
      question="What changes first?"
      hint={`Request: “${updateRequest}”`}
    >
      <ChoiceButtons
        choices={improveChoices}
        selected={progress.improveChoice}
        onChoose={(id) =>
          choose(
            "improve",
            {
              improveChoice: id as FinalProgress["improveChoice"],
              affectedCheckChoice: null,
            },
            false,
            id === "source-then-page" ? "affected-checks" : undefined,
          )
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="Source before surface"
        riskLabel="The source or scope is still wrong"
        lessonRule={stageById.improve.reusableRule}
        continueLabel={
          holdingSourceChange
            ? "Continue · trace the affected checks"
            : undefined
        }
        onContinue={
          holdingSourceChange
            ? () => onContinueHandoff("affected-checks")
            : undefined
        }
      />
    </TaskShell>
  );
}

function StageTask(props: StageTaskProps) {
  switch (props.progress.stage) {
    case "idea":
      return <IdeaTask {...props} />;
    case "tools":
      return <ToolsTask {...props} />;
    case "project-home":
      return <ProjectHomeTask {...props} />;
    case "ask-ai":
      return <AskTask {...props} />;
    case "build":
      return <BuildTask {...props} />;
    case "check":
      return <CheckTask {...props} />;
    case "go-live":
      return <GoLiveTask {...props} />;
    case "improve":
      return <ImproveTask {...props} />;
    default:
      return null;
  }
}

const checkpointActions: Record<FinalLearningStage, string> = {
  idea: "Continue to 2 · Choose a tool route",
  tools: "Continue to 3 · Give the work a home",
  "project-home": "Continue to 4 · Make AI show its plan",
  "ask-ai": "Continue to 5 · Build with evidence",
  build: "Continue to 6 · Test it like a visitor",
  check: "Continue to 7 · Release the checked version",
  "go-live": "Continue to 8 · Update from a trusted source",
  improve: "Finish the field lesson",
};

function StageCheckpoint({
  stage,
  progress,
  onContinue,
}: {
  stage: FinalLearningStage;
  progress: FinalProgress;
  onContinue: () => void;
}) {
  const stop = stageById[stage];
  const reason = savedDecisionReason(stage, progress);
  return (
    <section className="p5-checkpoint" aria-labelledby={`${stage}-checkpoint-title`}>
      <span>
        Lesson receipt · practice saved · {progress.completedStages.length + 1} / 8
      </span>
      <h2 id={`${stage}-checkpoint-title`} tabIndex={-1}>
        {stop.reusableRule}
      </h2>
      {reason && <p>{reason}</p>}
      <dl>
        <div>
          <dt>Use this when</dt>
          <dd>{stop.fieldUse}</dd>
        </div>
        <div>
          <dt>Prevents</dt>
          <dd>{stop.failurePrevented}</dd>
        </div>
      </dl>
      <button className="p4-primary" type="button" onClick={onContinue}>
        {checkpointActions[stage]}
      </button>
    </section>
  );
}

function SavedStageReview({
  stage,
  currentStage,
  onReturn,
}: {
  stage: FinalLearningStage;
  currentStage: FinalStage;
  onReturn: () => void;
}) {
  const saved = stageById[stage];
  return (
    <TaskShell
      id="saved-review"
      eyebrow="Saved layer · read-only review"
      question={`${saved.navLabel} is preserved exactly as checked`}
      hint={saved.reusableRule}
    >
      <p className="p4-review-note">
        Review the canvas beside this card. Returning keeps every later layer unchanged.
      </p>
      <button className="p4-primary" type="button" onClick={onReturn}>
        Return to {stageLabel(currentStage)}
      </button>
    </TaskShell>
  );
}

function StageDepth({ progress }: { progress: FinalProgress }) {
  const stage = progress.stage;
  if (stage === "welcome" || stage === "completion") return null;
  const stop = stageById[stage];
  let specific: React.ReactNode = null;

  if (stage === "tools") {
    specific = (
      <div className="p5-field-note__specific">
        <h3>Tool language, decoded</h3>
        <div className="p5-tool-decoder">
          {toolDecoder.map((item) => (
            <article key={item.id}>
              <h3>{item.label}</h3>
              <p>{item.plainMeaning}</p>
              <p><b>Ask before choosing:</b> {item.askBeforeChoosing}</p>
            </article>
          ))}
        </div>
      </div>
    );
  } else if (stage === "ask-ai") {
    const request = progress.toolChoice === "hosted"
      ? "Inspect the saved project and its approved brief. Return three small steps. Preserve the Not now list. Do not edit or publish until I approve a shown step."
      : planningArtifact.conciseRequest;
    specific = (
      <div className="p5-field-note__specific">
        <h3>Copyable work agreement</h3>
        <blockquote>{request}</blockquote>
        <p><b>Why it works:</b> it gives AI a source, finish, boundary, sequence, evidence request, and stopping point.</p>
      </div>
    );
  } else if (stage === "project-home") {
    const route = progress.toolChoice ?? "repository";
    specific = (
      <div className="p5-field-note__specific">
        <h3>If a future project truly needs a private key</h3>
        <p>
          Keep it outside AI chat, shared files, exports, and browser-visible code.
          {route === "repository"
            ? " Use an ignored local environment file such as .env.local, then verify it is absent from Git."
            : " Use the platform’s protected Secrets or Environment settings, then verify it is absent from exports."}
        </p>
        <p><b>Rule:</b> first decide whether runtime AI is necessary; only then create and protect a key.</p>
      </div>
    );
  } else if (stage === "check") {
    specific = (
      <div className="p5-field-note__specific">
        <h3>Two more checking lenses</h3>
        <p><b>Facts:</b> compare every public statement with the approved brief.</p>
        <p><b>Phone and keyboard:</b> repeat the path at 390px and without a pointer; appearance alone is not the check.</p>
      </div>
    );
  } else if (stage === "go-live") {
    specific = (
      <div className="p5-field-note__specific">
        <h3>Version story, release, and recovery</h3>
        <p><b>Version story:</b> V1 structure → V2 working email path → V3 phone polish introduced the inactive link → V4 small repair passed the repeated path.</p>
        <p><b>Exact version:</b> {releaseArtifact.exactVersion}</p>
        <p><b>Known limit:</b> {releaseArtifact.knownLimit}</p>
        <p><b>Restore:</b> {releaseArtifact.restoreAction}</p>
      </div>
    );
  } else if (stage === "improve") {
    specific = (
      <div className="p5-field-note__specific">
        <h3>Bounded update record</h3>
        <p><b>Source:</b> {updateArtifact.sourceChange}</p>
        <p><b>Request:</b> {updateArtifact.boundedRequest}</p>
        <ul>{updateArtifact.affectedChecks.map((check) => <li key={check}>{check}</li>)}</ul>
      </div>
    );
  }

  return (
    <details className="p4-depth">
      <summary>Use this on my project · {stop.navLabel}</summary>
      <div className="p4-depth__content p5-field-note">
        <div className="p5-field-note__grid">
          <article>
            <span>Why</span>
            <p>{stop.stakes}</p>
          </article>
          <article>
            <span>Make</span>
            <p>{stop.artifact}</p>
          </article>
          <article>
            <span>Proof</span>
            <p>{stop.reusableRule}</p>
          </article>
          <article>
            <span>Avoid</span>
            <p>{stop.failurePrevented}</p>
          </article>
        </div>
        {specific}
      </div>
    </details>
  );
}

function PrologueSpecimen({
  activeBeat,
  activeMethod = 0,
  interactive = false,
  onTest,
}: {
  activeBeat: number;
  activeMethod?: number;
  interactive?: boolean;
  onTest?: () => void;
}) {
  return (
    <div className="p8-specimen" data-active={activeBeat}>
      <div className="p8-specimen__registration" aria-hidden="true">
        <span>WF-01</span>
        <i />
        <span>Surface / evidence</span>
      </div>

      <div className="p8-specimen__stage">
        <div
          className="p8-specimen__layers"
          aria-hidden={activeBeat < 2 ? "true" : undefined}
        >
          {welcomeAuditLayers.map((layer, index) => (
            <div
              className={cx(
                "p8-specimen__layer",
                `p8-specimen__layer--${layer.id}`,
              )}
              key={layer.id}
            >
              <span>0{index + 1}</span>
              <b>{layer.label}</b>
              <small>{layer.issue}</small>
            </div>
          ))}
        </div>

        <article className="p8-specimen__surface">
          <div className="p8-specimen__surface-status">
            <span>Willow Fix Day</span>
            <b>{activeBeat >= 1 ? "Observed · failed" : "AI says · ready"}</b>
          </div>
          <div className="p8-specimen__surface-copy">
            <span>Generated preview</span>
            <h3>
              Bring it broken.
              <br />
              Leave with a plan.
            </h3>
            <p>Saturday · West Hall · repairs depend on volunteer availability</p>
            {interactive ? (
              <button
                className={cx(
                  "p8-specimen__contact",
                  "p9-specimen-action",
                  activeBeat >= 1 && "is-failed",
                )}
                type="button"
                onClick={onTest}
                disabled={activeBeat >= 1}
              >
                {activeBeat >= 1
                  ? "Email action · nothing happened"
                  : "Email the organizer"}
              </button>
            ) : (
              <div
                className={cx(
                  "p8-specimen__contact",
                  activeBeat >= 1 && "is-failed",
                )}
              >
                {activeBeat >= 1
                  ? "Email action · nothing happened"
                  : "Email the organizer"}
              </div>
            )}
          </div>
        </article>

        <div
          className="p8-specimen__failure"
          aria-hidden={activeBeat < 1 ? "true" : undefined}
        >
          <span>Observed evidence</span>
          <b>One important path failed.</b>
          <small>Appearance was a claim. The click produced evidence.</small>
        </div>

        <ol
          className="p8-specimen__route"
          aria-hidden={activeBeat < 3 ? "true" : undefined}
        >
          {finalChapters.map((chapter, index) => (
            <li className={index === activeMethod ? "is-active" : undefined} key={chapter.id}>
              <span>0{chapter.number}</span>
              <b>{chapter.id}</b>
            </li>
          ))}
        </ol>

        <div className="p8-specimen__scan" aria-hidden="true" />
      </div>

      <div className="p8-specimen__meter" aria-hidden="true">
        <span>Introduction</span>
        <div>
          {welcomePrologueBeats.map((beat, index) => (
            <i className={index <= activeBeat ? "is-active" : undefined} key={beat.id} />
          ))}
        </div>
        <b>0{activeBeat + 1} / 04</b>
      </div>
    </div>
  );
}

function OpeningArtifactFrame({
  label,
  marker,
  children,
}: {
  label: string;
  marker: string;
  children: React.ReactNode;
}) {
  return (
    <section className="p10-artifact" aria-label={label}>
      <header className="p10-artifact__registration" aria-hidden="true">
        <span>Willow Fix Day</span>
        <i />
        <span>{marker}</span>
      </header>
      <div className="p10-artifact__body">{children}</div>
    </section>
  );
}

function OpeningProjectArtifact({
  failed = false,
  interactive = false,
  onTest,
}: {
  failed?: boolean;
  interactive?: boolean;
  onTest?: () => void;
}) {
  return (
    <OpeningArtifactFrame
      label={
        interactive
          ? "Willow Fix Day visitor-path test"
          : "Willow Fix Day generated preview"
      }
      marker={failed ? "Evidence · observed" : "Preview · untested"}
    >
      <div className="p10-project-proof" data-state={failed ? "failed" : "claim"}>
        <article className="p10-project-page">
          <header>
            <span>Neighborhood repair day</span>
            <b>{failed ? "Observed · failed" : "AI says · ready"}</b>
          </header>
          <div className="p10-project-page__content">
            <p>Saturday · West Hall</p>
            <h3>
              <span>Bring it broken.</span>
              <span>Leave with a plan.</span>
            </h3>
            <small>Repairs depend on volunteer availability.</small>
            {interactive ? (
              <button
                aria-disabled={failed || undefined}
                className={cx(
                  "p10-project-page__action",
                  failed && "is-tested",
                )}
                type="button"
                onClick={() => {
                  if (!failed) onTest?.();
                }}
              >
                Email the organizer
              </button>
            ) : (
              <div className="p10-project-page__action">Email the organizer</div>
            )}
          </div>
          <footer>
            <span>Important path 01</span>
            <b>Details → Email</b>
          </footer>
        </article>

        <div
          className="p10-evidence-receipt"
          aria-hidden={!failed ? "true" : undefined}
          aria-live={failed ? "polite" : undefined}
          aria-atomic={failed ? "true" : undefined}
          role={failed ? "status" : undefined}
        >
          <span>Observed failure · exact version · 12:04</span>
          <b>No email opened because the button has no address.</b>
          <p>That click is evidence: the page looks complete, but its important path is broken.</p>
        </div>
      </div>
    </OpeningArtifactFrame>
  );
}

function handleOpeningTabKey(
  event: ReactKeyboardEvent<HTMLButtonElement>,
  index: number,
  count: number,
  onChange: (nextIndex: number) => void,
) {
  let nextIndex: number | null = null;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (index + 1) % count;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (index - 1 + count) % count;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = count - 1;
  }

  if (nextIndex === null) return;
  event.preventDefault();
  onChange(nextIndex);
  event.currentTarget.parentElement
    ?.querySelectorAll<HTMLButtonElement>("[role='tab']")
    [nextIndex]?.focus();
}

function OpeningLayerArtifact({
  activeLayer,
  onLayerChange,
}: {
  activeLayer: number;
  onLayerChange: (index: number) => void;
}) {
  const layer = welcomeAuditLayers[activeLayer];
  const detail = openingLayerDetails[activeLayer];

  return (
    <OpeningArtifactFrame
      label="Explore the four working layers beneath an AI-built page"
      marker="Underpainting · four layers"
    >
      <div className="p10-layer-workbench">
        <div
          className="p10-layer-stack"
          role="tablist"
          aria-label="Choose a project layer"
        >
          {welcomeAuditLayers.map((item, index) => (
            <button
              aria-selected={activeLayer === index}
              aria-controls="p10-layer-detail"
              className={cx(
                "p10-layer-sheet",
                activeLayer === index && "is-selected",
              )}
              data-layer={item.id}
              id={`p10-layer-tab-${item.id}`}
              key={item.id}
              role="tab"
              tabIndex={activeLayer === index ? 0 : -1}
              type="button"
              onClick={() => onLayerChange(index)}
              onKeyDown={(event) =>
                handleOpeningTabKey(
                  event,
                  index,
                  welcomeAuditLayers.length,
                  onLayerChange,
                )
              }
            >
              <span>0{index + 1}</span>
              <b>{item.label}</b>
              <small>{openingLayerDetails[index].summary}</small>
            </button>
          ))}
        </div>

        <div
          className="p10-layer-detail"
          id="p10-layer-detail"
          key={layer.id}
          role="tabpanel"
          aria-labelledby={`p10-layer-tab-${layer.id}`}
        >
          <span>Layer {activeLayer + 1} · question you own</span>
          <h3>{layer.label}</h3>
          <p>{detail.prompt}</p>
          <dl>
            <dt>You create</dt>
            <dd>{detail.artifact}</dd>
          </dl>
        </div>
      </div>
    </OpeningArtifactFrame>
  );
}

function OpeningMethodArtifact({
  activeMethod,
  onMethodChange,
}: {
  activeMethod: number;
  onMethodChange: (index: number) => void;
}) {
  const chapter = finalChapters[activeMethod];
  const detail = openingMethodDetails[activeMethod];

  return (
    <OpeningArtifactFrame
      label="Explore the Shape, Ground, Direct, and Prove method"
      marker="Method · human direction"
    >
      <div className="p10-method-workbench">
        <div
          className="p10-method-steps"
          role="tablist"
          aria-label="Explore the four-part method"
        >
          {finalChapters.map((item, index) => (
            <button
              aria-selected={activeMethod === index}
              aria-controls="p10-method-detail"
              className={activeMethod === index ? "is-selected" : undefined}
              id={`p10-method-tab-${item.id}`}
              key={item.id}
              role="tab"
              tabIndex={activeMethod === index ? 0 : -1}
              type="button"
              onClick={() => onMethodChange(index)}
              onKeyDown={(event) =>
                handleOpeningTabKey(
                  event,
                  index,
                  finalChapters.length,
                  onMethodChange,
                )
              }
            >
              <span>0{item.number}</span>
              <b>{item.id}</b>
              <small>{openingMethodDetails[index].summary}</small>
            </button>
          ))}
        </div>

        <div
          className="p10-method-detail"
          id="p10-method-detail"
          key={chapter.id}
          role="tabpanel"
          aria-labelledby={`p10-method-tab-${chapter.id}`}
        >
          <span>Your decision · step 0{chapter.number}</span>
          <h3>{chapter.title}</h3>
          <p>{welcomeOutcomes[activeMethod].detail}</p>
          <div>
            <dl>
              <dt>You make</dt>
              <dd>{detail.artifact}</dd>
            </dl>
            <dl>
              <dt>You can prove</dt>
              <dd>{detail.proof}</dd>
            </dl>
          </div>
        </div>
      </div>
    </OpeningArtifactFrame>
  );
}

function OpeningRouteArtifact() {
  return (
    <section className="p10-route-artifact" aria-label="Four-chapter lesson route">
      <header>
        <span>Your field route</span>
        <p>
          <span><b>04</b> chapters</span>
          <span><b>08</b> stops</span>
          <span>about <b>15</b> minutes</span>
        </p>
      </header>
      <ol>
        {finalChapters.map((chapter) => (
          <li key={chapter.id}>
            <span>0{chapter.number}</span>
            <div>
              <b>{chapter.title}</b>
              <p>{chapter.summary}</p>
            </div>
            <small>{chapter.stages.length} {chapter.stages.length === 1 ? "stop" : "stops"}</small>
          </li>
        ))}
      </ol>
      <footer>
        <span>Finish</span>
        <b>A checked release you can explain and recover</b>
      </footer>
    </section>
  );
}

function ScrollPrologue({
  headingRef,
  onEnter,
  onOverview,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  onEnter: () => void;
  onOverview: () => void;
}) {
  const [activeBeat, setActiveBeat] = useState(0);
  const storyRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const steps = stepRefs.current.filter(
      (step): step is HTMLElement => step !== null,
    );
    if (!steps.length || !("IntersectionObserver" in window)) return;

    const visible = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target, entry.intersectionRatio);
          } else {
            visible.delete(entry.target);
          }
        });

        const viewportCenter = window.innerHeight * 0.52;
        const nearest = [...visible.keys()]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              element: element as HTMLElement,
              distance: Math.abs(rect.top + rect.height / 2 - viewportCenter),
            };
          })
          .sort((a, b) => a.distance - b.distance)[0]?.element;

        if (nearest) {
          setActiveBeat(Number(nearest.dataset.prologueStep ?? 0));
        }
      },
      {
        rootMargin: "-18% 0px -28% 0px",
        threshold: [0, 0.2, 0.45, 0.7],
      },
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="p8-prologue">
      <section className="p8-prologue__hero" aria-labelledby="welcome-title">
        <div className="p8-prologue__folio" aria-hidden="true">
          <span>00</span>
          <i />
          <span>Surface</span>
        </div>

        <div className="p8-prologue__hero-copy">
          <p className="p4-kicker">{finalOpening.kicker}</p>
          <h1 id="welcome-title" ref={headingRef} tabIndex={-1}>
            {finalOpening.promise}
          </h1>
          <p>{finalOpening.explanation}</p>
        </div>

        <aside className="p8-prologue__definition">
          <span>Pentimento · /ˌpɛntɪˈmɛntoʊ/</span>
          <p>
            In painting, evidence of an earlier version still visible beneath
            the finished surface.
          </p>
          <b>{finalOpening.destination}</b>
        </aside>

        <dl className="p8-prologue__facts">
          <div>
            <dt>Format</dt>
            <dd>15-minute interactive project</dd>
          </div>
          <div>
            <dt>Audience</dt>
            <dd>No building experience needed</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>A repeatable path from idea to release</dd>
          </div>
        </dl>

        <a
          className="p8-prologue__scroll"
          href="#pentimento-story"
          onClick={(event) => {
            event.preventDefault();
            storyRef.current?.scrollIntoView({
              block: "start",
              behavior: preferredScrollBehavior(),
            });
            window.requestAnimationFrame(() => {
              storyRef.current?.focus({ preventScroll: true });
            });
          }}
        >
          <span>Scroll to see why finished is not ready</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section
        className="p8-story"
        data-active={activeBeat}
        id="pentimento-story"
        ref={storyRef}
        tabIndex={-1}
        aria-label="Why Pentimento exists"
      >
        <div className="p8-story__frame">
          <div className="p8-story__steps">
            {welcomePrologueBeats.map((beat, index) => (
              <article
                aria-current={activeBeat === index ? "step" : undefined}
                className={cx(
                  "p8-story__step",
                  activeBeat === index && "is-active",
                )}
                data-prologue-step={index}
                key={beat.id}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
              >
                <div className="p8-story__step-index">
                  <span>{beat.number}</span>
                  <i />
                  <span>{beat.eyebrow}</span>
                </div>
                <h2>{beat.title}</h2>
                <p>{beat.body}</p>

                {beat.id === "underpainting" && (
                  <dl className="p8-story__layers">
                    {welcomeAuditLayers.map((layer) => (
                      <div key={layer.id}>
                        <dt>{layer.label}</dt>
                        <dd>{layer.issue}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {beat.id === "method" && (
                  <ol className="p8-story__method">
                    {finalChapters.map((chapter) => (
                      <li key={chapter.id}>
                        <b>{chapter.title}</b>
                        <span>{chapter.summary}</span>
                      </li>
                    ))}
                  </ol>
                )}

                <p className="p8-story__margin">{beat.margin}</p>
              </article>
            ))}
          </div>

          <aside
            className="p8-story__visual"
            aria-label="The same project changes as its hidden layers are revealed"
          >
            <div aria-hidden="true">
              <PrologueSpecimen activeBeat={activeBeat} />
            </div>
            <p className="p4-visually-hidden">
              The Willow Fix Day preview changes from an AI-ready claim to an
              observed failed action, then reveals Promise, Project home,
              Evidence, and Release beneath its surface.
            </p>
          </aside>
        </div>
      </section>

      <section className="p8-threshold" aria-labelledby="prologue-threshold-title">
        <div className="p8-threshold__folio" aria-hidden="true">
          <span>05</span>
          <i />
          <span>Field lesson</span>
        </div>

        <div className="p8-threshold__heading">
          <p className="p4-kicker">The field lesson</p>
          <h2 id="prologue-threshold-title">
            This is not a tutorial to watch.
            <em>It is a project to direct.</em>
          </h2>
          <p>
            Direct one fictional community repair site from rough idea to
            checked release. Across 14 short decisions, test its most important
            action, diagnose one failure, repair only what broke, and prove the
            published version still works.
          </p>
        </div>

        <ol className="p8-threshold__outcomes">
          {welcomeOutcomes.map((outcome, index) => (
            <li key={outcome.title}>
              <span>0{index + 1}</span>
              <div>
                <b>{outcome.title}</b>
                <p>{outcome.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="p8-threshold__kit">
          <span>You keep</span>
          <p>{finalOpening.payoff}</p>
        </aside>

        <div className="p8-threshold__actions">
          <button className="p4-primary" type="button" onClick={onEnter}>
            {finalOpening.primaryAction}
          </button>
          <p>{finalOpening.reassurance}</p>
        </div>

        <div className="p8-threshold__overview">
          <span>Want the whole map first?</span>
          <button className="p4-text-button" type="button" onClick={onOverview}>
            {finalOpening.overviewAction}
          </button>
        </div>
      </section>
    </div>
  );
}

function PaginatedPrologue({
  headingRef,
  onEnter,
  onOverview,
  onFolioChange,
  onEvidence,
  skipToLessonRequest,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  onEnter: () => void;
  onOverview: () => void;
  onFolioChange: (folio: number) => void;
  onEvidence: () => void;
  skipToLessonRequest: number;
}) {
  const [activeFolio, setActiveFolio] = useState(0);
  const [auditStep, setAuditStep] = useState<"surface" | "failed">("surface");
  const [activeLayer, setActiveLayer] = useState(0);
  const [activeMethod, setActiveMethod] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const folioRefs = useRef<Array<HTMLElement | null>>([]);
  const focusFrameRef = useRef<number | null>(null);
  const programmaticFolioRef = useRef<number | null>(null);
  const wheelLockedRef = useRef(false);
  const wheelReleaseRef = useRef<number | null>(null);

  useEffect(() => {
    onFolioChange(activeFolio);
  }, [activeFolio, onFolioChange]);

  useEffect(() => {
    if (!scrollerRef.current) return;

    let frame = 0;
    const syncActiveFolio = () => {
      frame = 0;
      if (programmaticFolioRef.current !== null) {
        return;
      }
      const headerHeight = window.innerWidth <= 560 ? 64 : 72;
      const activationLine =
        headerHeight + (window.innerHeight - headerHeight) * 0.42;
      const next = folioRefs.current.reduce((current, folio, index) => {
        if (!folio) return current;
        return folio.getBoundingClientRect().top <= activationLine
          ? index
          : current;
      }, 0);
      setActiveFolio((current) => (current === next ? current : next));
    };

    const scheduleSync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncActiveFolio);
    };

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    syncActiveFolio();

    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(
    () => () => {
      if (focusFrameRef.current !== null) {
        window.cancelAnimationFrame(focusFrameRef.current);
      }
      if (wheelReleaseRef.current !== null) {
        window.clearTimeout(wheelReleaseRef.current);
      }
    },
    [],
  );

  function scrollToFolio(index: number, focusHeading = true) {
    const folio = folioRefs.current[index];
    if (!folio) return;

    programmaticFolioRef.current = index;
    const behavior = preferredScrollBehavior();
    folio.scrollIntoView({
      block: "start",
      behavior,
    });

    if (focusFrameRef.current !== null) {
      window.cancelAnimationFrame(focusFrameRef.current);
    }
    const startedAt = window.performance.now();
    const finishWhenAligned = () => {
      const headerHeight = window.innerWidth <= 560 ? 64 : 72;
      const distance = Math.abs(folio.getBoundingClientRect().top - headerHeight);
      const timedOut = window.performance.now() - startedAt > 1200;

      if (behavior !== "auto" && distance > 3 && !timedOut) {
        focusFrameRef.current = window.requestAnimationFrame(finishWhenAligned);
        return;
      }

      programmaticFolioRef.current = null;
      setActiveFolio(index);
      focusFrameRef.current = window.requestAnimationFrame(() => {
        if (focusHeading) {
          folio
            .querySelector<HTMLElement>("h1, h2")
            ?.focus({ preventScroll: true });
        }
        focusFrameRef.current = null;
      });
    };

    focusFrameRef.current = window.requestAnimationFrame(finishWhenAligned);
  }

  useEffect(() => {
    if (skipToLessonRequest > 0) scrollToFolio(5);
  }, [skipToLessonRequest]);

  useEffect(() => {
    const handlePageKey = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select, [contenteditable='true']") ||
          target.closest("[role='dialog']"))
      ) {
        return;
      }

      let nextFolio: number | null = null;
      if (event.key === "PageDown") {
        nextFolio = Math.min(introFolios.length - 1, activeFolio + 1);
      } else if (event.key === "PageUp") {
        nextFolio = Math.max(0, activeFolio - 1);
      } else if (event.key === "Home") {
        nextFolio = 0;
      } else if (event.key === "End") {
        nextFolio = introFolios.length - 1;
      }

      if (nextFolio === null || nextFolio === activeFolio) return;
      event.preventDefault();
      scrollToFolio(nextFolio);
    };

    window.addEventListener("keydown", handlePageKey);
    return () => window.removeEventListener("keydown", handlePageKey);
  }, [activeFolio]);

  useEffect(() => {
    const handlePageWheel = (event: WheelEvent) => {
      if (
        !(event.target instanceof Node) ||
        !scrollerRef.current
          ?.closest<HTMLElement>(".p9-welcome")
          ?.contains(event.target) ||
        window.innerWidth < 901 ||
        preferredScrollBehavior() === "auto" ||
        event.ctrlKey ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        Math.abs(event.deltaY) < 10
      ) {
        return;
      }

      event.preventDefault();

      if (wheelReleaseRef.current !== null) {
        window.clearTimeout(wheelReleaseRef.current);
      }
      wheelReleaseRef.current = window.setTimeout(() => {
        wheelLockedRef.current = false;
        wheelReleaseRef.current = null;
      }, 420);

      if (wheelLockedRef.current) return;
      const nextFolio = Math.max(
        0,
        Math.min(
          introFolios.length - 1,
          activeFolio + (event.deltaY > 0 ? 1 : -1),
        ),
      );
      if (nextFolio === activeFolio) return;

      wheelLockedRef.current = true;
      scrollToFolio(nextFolio, false);
    };

    window.addEventListener("wheel", handlePageWheel, { passive: false });
    return () => window.removeEventListener("wheel", handlePageWheel);
  }, [activeFolio]);

  function testClaim() {
    if (auditStep === "failed") return;
    setAuditStep("failed");
    onEvidence();
  }

  return (
    <div
      className="p9-prologue"
      data-audit={auditStep}
      data-folio={activeFolio}
    >
      {activeFolio > 0 && (
        <h1 className="p4-visually-hidden">
          Pentimento — learn to build trustworthy projects with AI
        </h1>
      )}
      <nav className="p9-folio-nav" aria-label="Introduction pages">
        <ol>
          {introFolios.map((folio, index) => (
            <li key={folio.id}>
              <button
                aria-current={activeFolio === index ? "step" : undefined}
                aria-label={`Go to page ${index + 1} of ${introFolios.length}: ${folio.label}`}
                type="button"
                onClick={() => scrollToFolio(index)}
              >
                <span>{folio.number}</span>
                <i aria-hidden="true" />
                <b>{folio.shortLabel}</b>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div
        className="p9-folios"
        ref={scrollerRef}
        aria-label="Pentimento introduction. Scroll one page at a time."
      >
        <section
          className={cx(
            "p9-folio",
            "p9-folio--orientation",
            activeFolio === 0 && "is-active",
          )}
          id="p9-orientation"
          aria-labelledby="welcome-title"
          ref={(node) => {
            folioRefs.current[0] = node;
          }}
        >
          <div className="p9-folio__inner p9-orientation">
            <div className="p9-folio__index" aria-hidden="true">
              <span>01</span>
              <i />
              <span>Orientation</span>
            </div>

            <div className="p9-orientation__copy">
              <p className="p4-kicker">{finalOpening.kicker}</p>
              <h1 id="welcome-title" ref={headingRef} tabIndex={-1}>
                {finalOpening.promise}
              </h1>
              <p className="p9-orientation__answer">
                {finalOpening.destination}
              </p>
              <p className="p9-orientation__explanation">
                {finalOpening.explanation}
              </p>
            </div>

            <aside className="p9-orientation__definition">
              <span>Pentimento · /ˌpɛntɪˈmɛntoʊ/</span>
              <p>
                An earlier version still visible beneath a finished painting.
              </p>
              <b>
                The name is a reminder: every finished surface carries the
                decisions beneath it.
              </b>
            </aside>

            <dl className="p9-orientation__facts">
              <div>
                <dt>Time</dt>
                <dd>About 15 minutes</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>None required</dd>
              </div>
              <div>
                <dt>You keep</dt>
                <dd>Five reusable build tools</dd>
              </div>
            </dl>

            <button
              className="p9-next"
              type="button"
              onClick={() => scrollToFolio(1)}
            >
              <span>
                Meet the finished-looking project
                <small>One idea per page</small>
              </span>
              <i aria-hidden="true">02</i>
            </button>
          </div>
        </section>

        <section
          className={cx(
            "p9-folio",
            "p9-folio--dark",
            "p9-folio--claim",
            activeFolio === 1 && "is-active",
          )}
          id="p9-claim"
          aria-labelledby="p9-claim-title"
          ref={(node) => {
            folioRefs.current[1] = node;
          }}
        >
          <div className="p9-folio__inner p10-scene">
            <div className="p9-folio__index" aria-hidden="true">
              <span>02</span>
              <i />
              <span>The claim</span>
            </div>

            <div className="p9-folio__copy p10-scene__copy">
              <p className="p4-kicker">AI build report · “Ready to publish”</p>
              <h2 id="p9-claim-title" tabIndex={-1}>
                What does a polished preview prove?
              </h2>
              <p>
                It proves how the page looks—not whether its one important
                action works.
              </p>
            </div>

            <div className="p10-scene__artifact" aria-hidden="true">
              <OpeningProjectArtifact />
            </div>

            <div className="p10-scene__footer">
              <button
                className="p9-next p9-next--dark"
                type="button"
                onClick={() => scrollToFolio(2)}
              >
                <span>
                  Test the important path
                  <small>Turn appearance into evidence</small>
                </span>
                <i aria-hidden="true">03</i>
              </button>
            </div>
          </div>
        </section>

        <section
          className={cx(
            "p9-folio",
            "p9-folio--dark",
            "p9-folio--evidence",
            activeFolio === 2 && "is-active",
          )}
          id="p9-evidence"
          aria-labelledby="p9-evidence-title"
          ref={(node) => {
            folioRefs.current[2] = node;
          }}
        >
          <div className="p9-folio__inner p10-scene">
            <div className="p9-folio__index" aria-hidden="true">
              <span>03</span>
              <i />
              <span>The test</span>
            </div>

            <div className="p9-folio__copy p10-scene__copy">
              <p className="p4-kicker">Your first evidence check</p>
              <h2 id="p9-evidence-title" tabIndex={-1}>
                Test the visitor’s one important action.
              </h2>
              <p>
                This page promises that a visitor can email the organizer. Try
                that exact path yourself.
              </p>
            </div>

            <div className="p10-scene__artifact">
              <OpeningProjectArtifact
                failed={auditStep === "failed"}
                interactive
                onTest={testClaim}
              />
            </div>

            <div className="p10-scene__footer">
              {auditStep === "surface" ? (
                <aside className="p9-test-instruction">
                  <span>Your task</span>
                  <b>Select “Email the organizer”</b>
                  <p>Evidence is what a person tries and observes on the exact version.</p>
                </aside>
              ) : null}

              {auditStep === "failed" && (
                <button
                  className="p9-next p9-next--dark"
                  type="button"
                  onClick={() => scrollToFolio(3)}
                >
                  <span>
                    Reveal what the page cannot show
                    <small>Inspect the project beneath it</small>
                  </span>
                  <i aria-hidden="true">04</i>
                </button>
              )}
            </div>
          </div>
        </section>

        <section
          className={cx(
            "p9-folio",
            "p9-folio--dark",
            "p9-folio--layers",
            activeFolio === 3 && "is-active",
          )}
          id="p9-layers"
          aria-labelledby="p9-layers-title"
          ref={(node) => {
            folioRefs.current[3] = node;
          }}
        >
          <div className="p9-folio__inner p10-scene">
            <div className="p9-folio__index" aria-hidden="true">
              <span>04</span>
              <i />
              <span>The underpainting</span>
            </div>

            <div className="p9-folio__copy p10-scene__copy">
              <p className="p4-kicker">What the finished page cannot show</p>
              <h2 id="p9-layers-title" tabIndex={-1}>
                A trustworthy project has four working layers.
              </h2>
              <p>
                Open the promise, project files, test evidence, and exact
                release. AI can help with each; you own the decision.
              </p>
            </div>

            <div className="p10-scene__artifact">
              <OpeningLayerArtifact
                activeLayer={activeLayer}
                onLayerChange={setActiveLayer}
              />
            </div>

            <div className="p10-scene__footer">
              <button
                className="p9-next p9-next--dark"
                type="button"
                onClick={() => scrollToFolio(4)}
              >
                <span>
                  Turn the layers into a method
                  <small>Shape → Ground → Direct → Prove</small>
                </span>
                <i aria-hidden="true">05</i>
              </button>
            </div>
          </div>
        </section>

        <section
          className={cx(
            "p9-folio",
            "p9-folio--method",
            activeFolio === 4 && "is-active",
          )}
          id="p9-method"
          aria-labelledby="p9-method-title"
          ref={(node) => {
            folioRefs.current[4] = node;
          }}
        >
          <div className="p9-folio__inner p10-scene">
            <div className="p9-folio__index" aria-hidden="true">
              <span>05</span>
              <i />
              <span>The method</span>
            </div>

            <div className="p9-folio__copy p10-scene__copy">
              <p className="p4-kicker">A method that survives the tool</p>
              <h2 id="p9-method-title" tabIndex={-1}>
                Prompting is one move. Direction is the skill.
              </h2>
              <p>
                Shape the promise. Ground the work. Direct the AI. Prove the
                release. The method survives when the tool changes.
              </p>
            </div>

            <div className="p10-scene__artifact">
              <OpeningMethodArtifact
                activeMethod={activeMethod}
                onMethodChange={setActiveMethod}
              />
            </div>

            <div className="p10-scene__footer">
              <button
                className="p9-next"
                type="button"
                onClick={() => scrollToFolio(5)}
              >
                <span>
                  Start the guided build
                  <small>Apply the method to Willow Fix Day</small>
                </span>
                <i aria-hidden="true">06</i>
              </button>
            </div>
          </div>
        </section>

        <section
          className={cx(
            "p9-folio",
            "p9-folio--lesson",
            activeFolio === 5 && "is-active",
          )}
          id="p9-lesson"
          aria-labelledby="p9-lesson-title"
          ref={(node) => {
            folioRefs.current[5] = node;
          }}
        >
          <div className="p9-folio__inner p9-lesson">
            <div className="p9-folio__index" aria-hidden="true">
              <span>06</span>
              <i />
              <span>The field lesson</span>
            </div>

            <div className="p9-lesson__heading">
              <p className="p4-kicker">Learn by deciding, not watching</p>
              <h2 id="p9-lesson-title" tabIndex={-1}>
                Now direct Willow Fix Day.
              </h2>
              <p>
                Across eight short stops, own the project decisions, repair{" "}
                {auditStep === "failed"
                  ? "the failure you found"
                  : "an observed failure"}
                , and finish with a checked release.
              </p>
            </div>

            <div className="p10-lesson-route">
              <OpeningRouteArtifact />
            </div>

            <aside className="p9-lesson__kit">
              <span>Your build kit</span>
              <p>{finalOpening.payoff}</p>
            </aside>

            <div className="p9-lesson__actions">
              <button className="p4-primary" type="button" onClick={onEnter}>
                Start: shape the promise
              </button>
              <p>{finalOpening.reassurance}</p>
            </div>

            <div className="p9-lesson__overview">
              <span>Prefer to inspect the route first?</span>
              <button
                className="p4-text-button"
                type="button"
                onClick={onOverview}
              >
                {finalOpening.overviewAction}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PaginatedWelcome({
  headingRef,
  onStart,
  onOverview,
  onEvidenceObserved,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  onStart: (introFailureObserved: boolean) => void;
  onOverview: () => void;
  onEvidenceObserved: () => void;
}) {
  const [activeFolio, setActiveFolio] = useState(0);
  const [failureObserved, setFailureObserved] = useState(false);
  const [skipToLessonRequest, setSkipToLessonRequest] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("p9-intro-active");
    return () => root.classList.remove("p9-intro-active");
  }, []);

  return (
    <div
      className="p4-welcome p6-welcome p9-welcome"
      data-intro-folio={activeFolio}
    >
      <header className="p4-welcome__header p9-welcome-header">
        <Brand />
        <div className="p9-welcome-header__progress">
          <span aria-hidden="true">
            {String(activeFolio + 1).padStart(2, "0")} / 06
          </span>
          <b>{introFolios[activeFolio].shortLabel}</b>
        </div>
        {activeFolio === 5 ? (
          <button
            className="p9-welcome-header__skip"
            type="button"
            onClick={() => onStart(failureObserved)}
          >
            Start lesson
          </button>
        ) : (
          <button
            className="p9-welcome-header__skip"
            type="button"
            onClick={() => setSkipToLessonRequest((current) => current + 1)}
          >
            Skip to lesson
          </button>
        )}
      </header>
      <main id="main-content" className="p9-main">
        <PaginatedPrologue
          headingRef={headingRef}
          onEnter={() => onStart(failureObserved)}
          onOverview={onOverview}
          onFolioChange={setActiveFolio}
          skipToLessonRequest={skipToLessonRequest}
          onEvidence={() => {
            setFailureObserved(true);
            onEvidenceObserved();
          }}
        />
      </main>
    </div>
  );
}

function PreparingStudio() {
  return (
    <div className="p4-welcome p6-welcome p9-welcome p9-preparing">
      <header className="p4-welcome__header p9-welcome-header">
        <Brand />
        <div className="p9-welcome-header__progress" aria-hidden="true">
          <span>01 / 06</span>
          <b>What this is</b>
        </div>
        <span className="p9-welcome-header__skip">Interactive field lesson</span>
      </header>
      <main className="p9-main" id="main-content">
        <section
          className="p9-folio p9-folio--orientation is-active"
          aria-labelledby="preparing-title"
        >
          <div className="p9-folio__inner p9-orientation">
            <div className="p9-folio__index" aria-hidden="true">
              <span>01</span>
              <i />
              <span>Orientation</span>
            </div>
            <div className="p9-orientation__copy">
              <p className="p4-kicker">{finalOpening.kicker}</p>
              <h1 id="preparing-title">{finalOpening.promise}</h1>
              <p className="p9-orientation__answer">
                {finalOpening.destination}
              </p>
              <p className="p9-orientation__explanation">
                {finalOpening.explanation}
              </p>
            </div>
            <aside className="p9-orientation__definition">
              <span>Pentimento · /ˌpɛntɪˈmɛntəʊ/</span>
              <p>An earlier version still visible beneath a finished painting.</p>
              <b>
                The name is a reminder: every finished surface carries the
                decisions beneath it.
              </b>
            </aside>
            <dl className="p9-orientation__facts">
              <div>
                <dt>Time</dt>
                <dd>About 15 minutes</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>None required</dd>
              </div>
              <div>
                <dt>You keep</dt>
                <dd>Five reusable build tools</dd>
              </div>
            </dl>
            <div className="p9-next p9-preparing__status" role="status">
              <span>
                Preparing the field lesson
                <small>One useful decision per page</small>
              </span>
              <i aria-hidden="true">···</i>
            </div>
            <noscript className="p9-preparing__noscript">
              This interactive lesson needs JavaScript. Enable it and reload;
              no account is required.
            </noscript>
          </div>
        </section>
      </main>
    </div>
  );
}

function Welcome({
  headingRef,
  onStart,
  onOverview,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
  onOverview: () => void;
}) {
  const [screen, setScreen] = useState<"orientation" | "inspection">(
    "orientation",
  );
  const [auditStep, setAuditStep] = useState<"surface" | "failed" | "revealed">(
    "surface",
  );
  const inspectionHeadingRef = useRef<HTMLHeadingElement>(null);
  const auditRevealRef = useRef<HTMLButtonElement>(null);
  const auditLayersHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const frame = window.requestAnimationFrame(() => {
      if (screen === "inspection") {
        inspectionHeadingRef.current?.focus({ preventScroll: true });
      } else {
        headingRef.current?.focus({ preventScroll: true });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [headingRef, screen]);

  useEffect(() => {
    if (auditStep === "failed") {
      const frame = window.requestAnimationFrame(() => {
        auditRevealRef.current?.focus({ preventScroll: true });
        bringIntoViewIfNeeded(
          auditRevealRef.current?.closest<HTMLElement>(".p5-audit__reveal") ?? null,
          "center",
        );
      });
      return () => window.cancelAnimationFrame(frame);
    }
    if (auditStep === "revealed") {
      const frame = window.requestAnimationFrame(() => {
        auditLayersHeadingRef.current?.focus({ preventScroll: true });
        bringIntoViewIfNeeded(
          auditLayersHeadingRef.current?.closest<HTMLElement>(".p5-audit__underlayers") ?? null,
          "start",
        );
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [auditStep]);

  function openInspection(kind: "scene" | "prologue" = "scene") {
    runViewTransition(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      setAuditStep("surface");
      setScreen("inspection");
    }, kind);
  }

  function returnToPrologue() {
    runViewTransition(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      setScreen("orientation");
    }, "scene");
  }

  return (
    <div className="p4-welcome p6-welcome">
      <header className="p4-welcome__header p8-welcome-header">
        <Brand />
        {screen === "orientation" ? (
          <div className="p8-welcome-header__intro">
            <span>Introduction · follow the project beneath its surface</span>
            <button
              className="p4-text-button"
              type="button"
              onClick={() => openInspection("scene")}
            >
              Skip to the evidence check
            </button>
          </div>
        ) : (
          <span>Guided project · first evidence check</span>
        )}
      </header>
      <main id="main-content">
        {screen === "orientation" ? (
          <ScrollPrologue
            headingRef={headingRef}
            onEnter={() => openInspection("prologue")}
            onOverview={onOverview}
          />
        ) : (
          <section className="p6-inspection" aria-labelledby="inspection-title">
            <div className="p6-inspection__intro">
              <p className="p4-kicker">First evidence check · one minute</p>
              <h1 id="inspection-title" ref={inspectionHeadingRef} tabIndex={-1}>
                Your first job: test the project.
              </h1>
              <p>
                Willow Fix Day is fictional. Its page has one job: show the event
                details and let a visitor email the organizer.
              </p>
              <aside>
                <span>AI report</span>
                <b>“Ready to publish.”</b>
                <p>
                  Test the claim yourself: try the visitor’s only important
                  action.
                </p>
              </aside>
              <button
                className="p4-text-button p6-inspection__back"
                type="button"
                onClick={returnToPrologue}
              >
                Back to the introduction
              </button>
            </div>

            <section
              className={cx("p5-audit", `is-${auditStep}`)}
              aria-label="Willow Fix Day project inspection"
            >
              <div className="p5-audit__status">
                <span>
                  {auditStep === "surface"
                    ? "Your task · test the email path"
                    : "Willow Fix Day · generated preview"}
                </span>
                <b>
                  {auditStep === "surface"
                    ? "AI says: ready"
                    : auditStep === "failed"
                      ? "Observed: failed"
                      : "Underlayers visible"}
                </b>
              </div>
              <div className="p7-audit-scene">
                <div
                  className="p5-audit__surface"
                  aria-hidden={auditStep === "revealed" ? "true" : undefined}
                >
                  <span>Visitor surface · one important path</span>
                  <h2 id="welcome-audit-title">
                    Bring it broken.
                    <br />
                    Leave with a plan.
                  </h2>
                  <p>
                    Saturday · West Hall · repairs depend on volunteer availability
                  </p>
                  <button
                    id="welcome-audit-action"
                    type="button"
                    className={cx(
                      "p4-primary",
                      "p5-audit__action",
                      auditStep !== "surface" && "is-failed",
                    )}
                    onClick={() =>
                      runViewTransition(() => setAuditStep("failed"), "canvas")
                    }
                    disabled={auditStep !== "surface"}
                  >
                    {auditStep === "surface"
                      ? "Email the organizer"
                      : "Email action · nothing happened"}
                  </button>
                </div>

                {auditStep === "failed" && (
                  <div className="p5-audit__reveal" role="status">
                    <span>Observed failure</span>
                    <h3>Nothing happened.</h3>
                    <p>
                      The preview showed you the surface. Your click revealed
                      how it behaved. Now uncover the decisions and evidence
                      the screen could not show.
                    </p>
                    <button
                      ref={auditRevealRef}
                      className="p4-secondary"
                      type="button"
                      onClick={() =>
                        runViewTransition(() => setAuditStep("revealed"), "canvas")
                      }
                    >
                      Reveal the missing layers
                    </button>
                  </div>
                )}

                {auditStep === "revealed" && (
                  <div className="p5-audit__underlayers" role="status">
                    <span>Under the surface · four responsibilities the preview hid</span>
                    <h3 ref={auditLayersHeadingRef} tabIndex={-1}>
                      The screen was only the surface.
                    </h3>
                    <ol>
                      {welcomeAuditLayers.map((layer, index) => (
                        <li key={layer.id}>
                          <span aria-hidden="true">0{index + 1}</span>
                          <div>
                            <b>{layer.label}</b>
                            <p>{layer.issue}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="p5-audit__thesis">
                      Pentimento teaches you to control these layers before the
                      visible surface goes live.
                    </p>
                    <button
                      className="p4-primary"
                      type="button"
                      onClick={onStart}
                    >
                      Continue to stop 1 · shape the promise
                    </button>
                  </div>
                )}
              </div>

              {auditStep === "surface" && (
                <p className="p5-audit__instruction">
                  The report makes a claim. Your click tests the behavior.
                </p>
              )}
            </section>
          </section>
        )}
      </main>
    </div>
  );
}

function ResumeWelcome({
  progress,
  headingRef,
  onResume,
  onRestart,
}: {
  progress: FinalProgress;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onResume: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="p4-welcome">
      <header className="p4-welcome__header">
        <Brand />
        <span>Your saved project canvas is ready</span>
      </header>
      <main className="p4-welcome__main" id="main-content">
        <div className="p4-welcome__copy">
          <p className="p4-kicker">Progress restored</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Welcome back.
            <em>Your layers are still here.</em>
          </h1>
          <p className="p4-welcome__lede">
            Continue at {stageLabel(progress.stage)}. Your route, choices, and saved artifacts stay on this device.
          </p>
          <button className="p4-primary" type="button" onClick={onResume}>
            Resume at {stageLabel(progress.stage)}
          </button>
          <button className="p4-text-button" type="button" onClick={onRestart}>
            Start over
          </button>
        </div>
        <div className="p4-welcome-art" aria-label="Saved Pentimento project layers">
          <article className="p4-welcome-art__layer">
            <span>{progress.completedStages.length} layers saved</span>
            <h2>{progress.completedStages.length ? stageLabel(progress.completedStages.at(-1)!) : "Idea ready"}</h2>
          </article>
          <article className="p4-welcome-art__layer">
            <span>Next layer</span>
            <h2>{stageLabel(progress.stage)}</h2>
          </article>
        </div>
      </main>
    </div>
  );
}

function JourneyHeader({
  progress,
  onRoute,
  onPlaybook,
  onRestart,
  restartRef,
}: {
  progress: FinalProgress;
  onRoute: () => void;
  onPlaybook: () => void;
  onRestart: () => void;
  restartRef: RefObject<HTMLButtonElement | null>;
}) {
  const completed = progress.completedStages.length;
  const currentNumber =
    progress.stage === "completion"
      ? 8
      : progress.stage === "welcome"
        ? 0
        : finalLearningStages.indexOf(progress.stage) + 1;
  const chapter = chapterForStage(progress.stage);
  return (
    <>
      <header className="p4-header">
        <Brand />
        <div className="p4-header__center" aria-label="Current lesson position">
          <span className="p7-header-state" key={progress.stage}>
            <span>
              {progress.stage === "completion"
                ? "Lesson complete"
                : `${String(currentNumber).padStart(2, "0")} / 08`}
            </span>
            <b>{stageLabel(progress.stage)}</b>
            <small>{chapter.title}</small>
          </span>
        </div>
        <div className="p4-header__actions">
          <button type="button" onClick={onPlaybook}>Build kit</button>
          <button type="button" onClick={onRoute}>Lesson map</button>
          <button ref={restartRef} type="button" onClick={onRestart}>Start over</button>
        </div>
      </header>
      <div className="p4-progress" aria-hidden="true">
        <i
          style={{
            transform: `scaleX(${Math.max(completed, currentNumber - 1) / 8})`,
          }}
        />
      </div>
    </>
  );
}

function Completion({
  progress,
  headingRef,
  onPlaybook,
  onMirror,
}: {
  progress: FinalProgress;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onPlaybook: () => void;
  onMirror: () => void;
}) {
  const routeTitle = progress.toolChoice
    ? toolChoices.find((choice) => choice.id === progress.toolChoice)?.label
    : "Choose a starter route";
  const startToday = progress.toolChoice === "hosted"
    ? [
        "Create one empty project in your browser AI workspace.",
        "Save a short V1 brief with one person, path, source, and Not now list.",
        "Ask AI to inspect it, show three small steps, and stop before editing.",
      ]
    : [
        "Make one project folder—the home for every file—and open it in an AI coding workspace.",
        "Ask AI to create a run note (README.md), save your V1 brief (docs/brief.md), and explain how it starts recoverable version history (Git).",
        "Ask AI to inspect the brief, show three small steps, and stop before editing.",
      ];
  return (
    <main className="p4-complete" id="main-content">
      <div className="p4-complete__hero">
        <p className="p4-kicker">Eight layers · one complete path</p>
        <h1 ref={headingRef} tabIndex={-1}>
          You now have a method to reuse.{" "}
          <em>The next project makes it yours.</em>
        </h1>
        <p>
          You practiced turning an idea into a bounded brief, directing AI one
          visible step at a time, proving the important path, and releasing a
          version you can recover.
        </p>
        <LastSavedRule progress={progress} />
      </div>
      <div className="p4-complete__actions">
        <button className="p4-primary" type="button" onClick={onMirror}>
          Create my V1 brief
        </button>
        <button className="p4-text-button p7-completion-kit" type="button" onClick={onPlaybook}>
          Open my build kit
        </button>
      </div>
      <section className="p6-capabilities" aria-labelledby="capabilities-title">
        <div>
          <span>Method recap</span>
          <h2 id="capabilities-title">What this project taught you to direct</h2>
        </div>
        <ol>
          <li><span>01</span><b>Shape a first version one person can finish</b></li>
          <li><span>02</span><b>Give AI bounded steps and a stopping point</b></li>
          <li><span>03</span><b>Demand evidence beyond the AI report</b></li>
          <li><span>04</span><b>Release an exact, recoverable version</b></li>
        </ol>
      </section>
      <section className="p4-start-today" aria-labelledby="start-today-title">
        <div>
          <span>Your route</span>
          <b>{routeTitle}</b>
        </div>
        <div>
          <h2 id="start-today-title">Start today</h2>
          <ol>{startToday.map((step) => <li key={step}>{step}</li>)}</ol>
        </div>
      </section>
      <details className="p4-habits-disclosure">
        <summary>Review the four reusable habits</summary>
        <ol className="p4-habits" aria-label="Four durable habits">
          {durableHabits.map((habit, index) => (
            <li key={habit}>
              <span>Habit {index + 1}</span>
              <b>{habit}</b>
            </li>
          ))}
        </ol>
      </details>
      <ResponsiveProjectCanvas progress={progress} />
    </main>
  );
}

function RouteDialog({
  open,
  progress,
  appRootRef,
  onClose,
  onNavigate,
  onRestart,
  onStart,
}: {
  open: boolean;
  progress: FinalProgress;
  appRootRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onNavigate: (stage: FinalLearningStage) => void;
  onRestart: () => void;
  onStart: () => void;
}) {
  return (
    <AccessibleDialog
      open={open}
      title={progress.started ? "Your eight-stop lesson map" : "The whole lesson, one decision at a time"}
      description={
        progress.started
          ? "Only the current stop asks for attention. Completed stops remain available for review."
          : "Four chapters take one fictional project from a tempting AI-made surface to a supportable, recoverable, checked release. Nothing here edits files or publishes a real site."
      }
      onDismiss={onClose}
      appRootRef={appRootRef}
      backdropClassName="p4-dialog-backdrop"
      dialogClassName="p4-dialog"
      titleClassName="p4-dialog__title"
      descriptionClassName="p4-dialog__description"
      contentClassName="p4-dialog__content"
    >
      <button className="p4-dialog__close" type="button" onClick={onClose} aria-label="Close lesson map">×</button>
      {!progress.started ? (
        <>
          <div className="p4-overview-phases">
            {finalChapters.map((chapter) => (
              <article key={chapter.id}>
                <span>0{chapter.number} · {chapter.title}</span>
                <h3>{chapter.summary}</h3>
                <p>
                  {chapter.stages
                    .map((stage) => stageById[stage].navLabel)
                    .join(" → ")}
                </p>
              </article>
            ))}
          </div>
          <div className="p4-overview-footer">
            <button
              className="p4-primary p4-overview-start"
              type="button"
              onClick={() => {
                onClose();
                onStart();
              }}
            >
              Start with the first promise
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p6-route-status" aria-live="polite">
            <span>Lessons completed</span>
            <b>{progress.completedStages.length} / {finalJourney.length}</b>
          </div>
          <ol className="p4-route-sheet">
            {finalJourney.map((stop) => {
              const completed = progress.completedStages.includes(stop.id);
              const reached =
                completed || progress.stage === stop.id;
              return (
                <li className={cx(completed && "is-complete")} key={stop.id}>
                  <button
                    type="button"
                    disabled={!reached}
                    aria-current={progress.stage === stop.id ? "step" : undefined}
                    onClick={() => onNavigate(stop.id)}
                  >
                    <span>{stop.number}</span>
                    <b>{stop.navLabel}</b>
                  </button>
                </li>
              );
            })}
          </ol>
          <button className="p4-text-button p4-route-restart" type="button" onClick={onRestart}>
            Start over
          </button>
        </>
      )}
    </AccessibleDialog>
  );
}

type PlaybookDetail = {
  when: string;
  actions: readonly string[];
  proof: string;
  template: string;
  example: string;
};

function playbookDetailFor(
  id: PlaybookCardId,
  route: ToolRoute,
): PlaybookDetail {
  const routeName = route === "hosted"
    ? "one browser workspace"
    : "files and saved history you control";
  switch (id) {
    case "brief":
      return {
        when: "An idea contains several audiences, features, or unverified facts.",
        actions: [
          "Name one person and one useful finish.",
          "Write the shortest complete path.",
          "List the approved source and the systems that are Not now.",
        ],
        proof: "Another person can repeat the path and explain what V1 deliberately excludes.",
        template:
          "For [person] in [situation], help them [result] through [path]. Use [approved source]. Include [must-have]. Not now: [systems]. Done when [repeatable check].",
        example: firstVersionBriefArtifact.path,
      };
    case "route":
      return route === "hosted"
        ? {
            when: "You want the shortest route to a first preview.",
            actions: [
              "Create an empty project in one browser AI workspace.",
              "Paste the saved brief and ask AI to inspect, plan, and stop.",
              "Find version restore, then connect GitHub or export before substantial work.",
            ],
            proof: "You can reopen, restore, and export the project without depending on one chat.",
            template:
              "Build in: [workspace]. Saved versions: [location]. Connection/export: [method]. Publish with: [host]. Restore by: [action].",
            example: projectHomeGuidance.hosted.checklist.join(" "),
          }
        : {
            when: "You want visible files and transferable version history.",
            actions: [
              "Make one project folder and open it in a repository-aware AI workspace.",
              "Ask AI to create a run note (README.md), save your V1 brief (docs/brief.md), and explain how to start version history (Git).",
              "Review the files, save a snapshot (commit), then upload that reviewed copy (push) to a GitHub repository you control.",
            ],
            proof: "You can close the chat, reopen the folder, find a saved snapshot, and find the same reviewed copy on GitHub.",
            template:
              "Help me create a recoverable project home. Explain each action in plain language before doing it. Then work one step at a time: (1) create README.md with the run instructions and docs/brief.md with my V1 brief; (2) start Git version history; (3) create .gitignore and keep any future .env.local private; (4) after I review the files, help me commit a saved snapshot and push that reviewed copy to a private GitHub repository. Stop after each step and show me what proves it worked.",
            example: projectHomeGuidance.repository.checklist.join(" "),
          };
    case "work-loop":
      return {
        when: "The brief is ready and AI is about to change files.",
        actions: [
          "Ask AI to inspect, show a small plan, and stop.",
          "Approve one visible result with named evidence.",
          "Inspect files, run the command, try the path, then save a version.",
        ],
        proof: "The change record separates files, command result, preview, human path, and saved version.",
        template: route === "hosted"
          ? "Inspect this saved project and its approved brief. Return three small steps. Preserve Not now. Do not edit or publish until I approve a shown step."
          : planningArtifact.conciseRequest,
        example: `Starting route: ${routeName}. ${planningArtifact.approvedFirstStep}`,
      };
    case "repair":
      return {
        when: "A visitor path fails or a public fact disagrees with its source.",
        actions: [
          "Record only what you observed and the repeatable steps.",
          "Name the expected result and working behavior to preserve.",
          "Repair the smallest cause, then repeat the same path.",
        ],
        proof: "The defect report has Observed, Steps, Expected, Preserve, and Repeat after repair.",
        template:
          "Observed: __. Steps: __. Expected: __. Preserve: __. Repair only: __. Repeat after repair: __.",
        example: defectReportArtifact.boundedRepair,
      };
    case "release-update":
      return {
        when: "One checked version is ready to publish or a trusted fact changes.",
        actions: [
          "Release the exact checked version and keep the last known working version pinned.",
          "Open the public address fresh and repeat the core path.",
          "For updates, change the approved source, run affected checks, then quickly repeat one core path.",
        ],
        proof: "The release card names exact version, public check, known limit, and restore action.",
        template:
          "Release [version]. Public path checked: [result]. Known limit: [limit]. Recovery: [version/action]. Source updated: [path]. Affected + smoke checks: [results].",
        example: `${releaseArtifact.exactVersion}; ${releaseArtifact.recoveryLabel}; ${updateArtifact.savedVersion}.`,
      };
  }
}

function PlaybookDialog({
  open,
  progress,
  appRootRef,
  onClose,
}: {
  open: boolean;
  progress: FinalProgress;
  appRootRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const [activeCard, setActiveCard] = useState<PlaybookCardId | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const cardRef = useRef<HTMLElement>(null);
  const cardButtonRefs = useRef<Partial<Record<PlaybookCardId, HTMLButtonElement>>>({});
  const restoreCardRef = useRef<PlaybookCardId | null>(null);
  const active = playbookIndex.find((card) => card.id === activeCard) ?? null;
  const detail = active
    ? playbookDetailFor(active.id, progress.toolChoice ?? "repository")
    : null;

  useEffect(() => {
    if (!open) {
      setActiveCard(null);
      setCopyStatus("");
      restoreCardRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    setCopyStatus("");
    if (!activeCard) {
      const restoreCard = restoreCardRef.current;
      if (!open || !restoreCard) return;
      const frame = window.requestAnimationFrame(() => {
        cardButtonRefs.current[restoreCard]?.focus({ preventScroll: true });
        if (window.matchMedia("(max-width: 820px)").matches) {
          cardButtonRefs.current[restoreCard]?.scrollIntoView({
            block: "nearest",
            behavior: preferredScrollBehavior(),
          });
        }
        restoreCardRef.current = null;
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const frame = window.requestAnimationFrame(() => {
      cardRef.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 820px)").matches) {
        cardRef.current?.scrollIntoView({
          block: "nearest",
          behavior: preferredScrollBehavior(),
        });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeCard, open]);

  async function copyTemplate() {
    if (!active || !detail) return;
    try {
      await navigator.clipboard.writeText(detail.template);
      setCopyStatus(`${active.title} template copied.`);
    } catch {
      setCopyStatus("Copy was blocked. Select the template text instead.");
    }
  }

  return (
    <AccessibleDialog
      open={open}
      title="Your build kit"
      description="Five reusable milestone guides. Open the one that matches the decision in front of you."
      onDismiss={onClose}
      appRootRef={appRootRef}
      backdropClassName="p4-dialog-backdrop"
      dialogClassName="p4-dialog"
      titleClassName="p4-dialog__title"
      descriptionClassName="p4-dialog__description"
      contentClassName="p4-dialog__content"
    >
      <button className="p4-dialog__close" type="button" onClick={onClose} aria-label="Close build kit">×</button>
      <div className={cx("p4-guide", active && "has-active")}>
        <ol className="p4-guide__index" aria-label="Build kit index">
          {playbookIndex.map((card) => (
            <li key={card.id}>
              <button
                ref={(node) => {
                  if (node) cardButtonRefs.current[card.id] = node;
                }}
                type="button"
                aria-expanded={activeCard === card.id}
                onClick={() => setActiveCard((current) => current === card.id ? null : card.id)}
              >
                <span className="p7-guide-index__copy">
                  <b>{card.title}</b>
                  <small>{card.summary}</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ol>
        <article ref={cardRef} className={cx("p4-guide__card", !active && "is-empty")} tabIndex={-1}>
          <div
            className="p6-guide-card__content"
            key={active?.id ?? "build-kit-index"}
          >
            {active && detail ? (
              <>
                <button
                  className="p4-guide__back"
                  type="button"
                  onClick={() => {
                    restoreCardRef.current = active.id;
                    setActiveCard(null);
                  }}
                >
                  ← All milestones
                </button>
                <span>When · {detail.when}</span>
                <h3>{active.title}</h3>
                <div className="p7-guide-includes" aria-label="Artifacts in this guide">
                  <span>Produces</span>
                  <ul>
                    {active.includes.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <p><b>Do</b></p>
                <ol>{detail.actions.map((action) => <li key={action}>{action}</li>)}</ol>
                <p><b>Proof:</b> {detail.proof}</p>
                <details>
                  <summary>Template and Willow Fix Day example</summary>
                  <pre><code>{detail.template}</code></pre>
                  <p><b>Worked example:</b> {detail.example}</p>
                  <button className="p4-secondary" type="button" onClick={copyTemplate}>
                    {copyStatus.includes("copied") ? "Copied ✓" : "Copy template"}
                  </button>
                </details>
              </>
            ) : (
              <>
                <span>Index</span>
                <h3>Choose one milestone</h3>
                <p>The full method stays available without placing every instruction on one screen.</p>
              </>
            )}
            <p role="status" aria-live="polite">{copyStatus}</p>
          </div>
        </article>
      </div>
    </AccessibleDialog>
  );
}

const mirrorLabels: Record<Exclude<TeachingMirrorFieldKey, "toolRoute">, string> = {
  person: "Who exactly will use it?",
  situation: "In what moment will they use it?",
  usefulResult: "What should become possible for them?",
  completePath: "What 3–5 steps will they finish?",
  trustedFacts: "Which source can you verify, and which facts come from it?",
  mustHave: "What is essential to that path?",
  notNow: "Which tempting features are deliberately later?",
  doneWhen: "What observable action proves the path works?",
};

const mirrorSteps: ReadonlyArray<{
  title: string;
  fields: ReadonlyArray<Exclude<TeachingMirrorFieldKey, "toolRoute">>;
}> = [
  { title: "Person and useful result", fields: ["person", "situation", "usefulResult"] },
  { title: "Complete path and trusted facts", fields: ["completePath", "trustedFacts"] },
  { title: "Must-have and Not now", fields: ["mustHave", "notNow"] },
  { title: "Finish line and starter route", fields: ["doneWhen"] },
];

const mirrorFieldKeys: ReadonlyArray<
  Exclude<TeachingMirrorFieldKey, "toolRoute">
> = mirrorSteps.flatMap((mirrorStep) => mirrorStep.fields);

const mirrorPlaceholders: Record<Exclude<TeachingMirrorFieldKey, "toolRoute">, string> = {
  person: "Write one specific kind of person",
  situation: "Name the moment or decision",
  usefulResult: "Describe the useful change",
  completePath: "Beginning → middle → finish",
  trustedFacts: "Source: … Facts: …",
  mustHave: "Only what the path needs",
  notNow: "Useful later, outside V1",
  doneWhen: "A person can … on phone and desktop",
};

const mirrorExamples: Record<Exclude<TeachingMirrorFieldKey, "toolRoute">, string> = {
  person: "A first-time visitor considering Willow Fix Day",
  situation: "They are on their phone deciding whether their broken item fits",
  usefulResult: "They can confirm the event details and reach the organizer",
  completePath: "Open the page → compare the accepted items → email one question",
  trustedFacts: "Source: organizer-approved note. Facts: date, venue, accepted items, email",
  mustHave: "Event facts in reading order, accepted-item list, and one working email action",
  notNow: "Accounts, booking, payment, live availability, and an AI chat",
  doneWhen:
    "A first-time visitor can decide whether the event fits and reach the email action on phone and desktop",
};

function listFromText(value: string): string[] {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2)
    .slice(0, 10);
}

function MirrorDialog({
  open,
  progress,
  appRootRef,
  onClose,
  onProgress,
}: {
  open: boolean;
  progress: FinalProgress;
  appRootRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onProgress: (patch: Partial<FinalProgress>) => void;
}) {
  const [result, setResult] = useState<MirrorResult | null>(null);
  const [reflectionMode, setReflectionMode] =
    useState<ReflectionMode>("demo");
  const [resultMode, setResultMode] = useState<ReflectionMode | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [briefReady, setBriefReady] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [stepDirection, setStepDirection] = useState<"forward" | "back">("forward");
  const [validationField, setValidationField] =
    useState<Exclude<TeachingMirrorFieldKey, "toolRoute"> | null>(null);
  const [validationMessage, setValidationMessage] = useState("");
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const briefHeadingRef = useRef<HTMLHeadingElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<
    Partial<
      Record<
        Exclude<TeachingMirrorFieldKey, "toolRoute">,
        HTMLInputElement | HTMLTextAreaElement
      >
    >
  >({});
  const step = progress.mirrorStep;
  const stepData = mirrorSteps[step - 1];
  const route = progress.mirrorDraft.toolRoute || progress.toolChoice || "repository";
  const briefCopy = [
    `PERSON: ${progress.mirrorDraft.person.trim()}`,
    `SITUATION: ${progress.mirrorDraft.situation.trim()}`,
    `USEFUL RESULT: ${progress.mirrorDraft.usefulResult.trim()}`,
    `COMPLETE PATH: ${progress.mirrorDraft.completePath.trim()}`,
    `TRUSTED FACTS: ${progress.mirrorDraft.trustedFacts.trim()}`,
    `MUST HAVE: ${progress.mirrorDraft.mustHave.trim()}`,
    `NOT NOW: ${progress.mirrorDraft.notNow.trim()}`,
    `DONE WHEN: ${progress.mirrorDraft.doneWhen.trim()}`,
    `STARTER ROUTE: ${route === "hosted" ? "browser workspace" : "files and saved history"}`,
  ].join("\n");

  useEffect(() => {
    if (!open) {
      setResult(null);
      setResultMode(null);
      setStatus("idle");
      setBriefReady(false);
      setCopyStatus("");
      setValidationField(null);
      setValidationMessage("");
      return;
    }

    const controller = new AbortController();
    setReflectionMode("demo");
    fetch("/api/debrief", {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as { mode?: ReflectionMode };
        if (response.ok && (payload.mode === "demo" || payload.mode === "live")) {
          setReflectionMode(payload.mode);
        }
      })
      .catch(() => {
        // Demo is the conservative label when mode discovery is unavailable.
      });

    return () => controller.abort();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      const target = briefReady ? briefHeadingRef.current : stepHeadingRef.current;
      if (dialogContentRef.current) dialogContentRef.current.scrollTop = 0;
      target?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [briefReady, open, step]);

  useEffect(() => {
    if (!open || !validationField) return;
    const frame = window.requestAnimationFrame(() => {
      const target = fieldRefs.current[validationField];
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({
        behavior: preferredScrollBehavior(),
        block: "center",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, step, validationField]);

  function updateDraft(field: keyof FinalMirrorDraft, value: string) {
    onProgress({
      mirrorDraft: { ...progress.mirrorDraft, [field]: value },
    });
    setValidationField(null);
    setValidationMessage("");
  }

  function firstIncomplete(
    fields: ReadonlyArray<Exclude<TeachingMirrorFieldKey, "toolRoute">>,
  ) {
    return fields.find(
      (field) => progress.mirrorDraft[field].trim().length < 2,
    );
  }

  function showIncomplete(
    field: Exclude<TeachingMirrorFieldKey, "toolRoute">,
  ) {
    setValidationField(field);
    setValidationMessage("Add a specific answer here to continue.");
  }

  function advanceWorkshop() {
    const incomplete = firstIncomplete(stepData.fields);
    if (incomplete) {
      showIncomplete(incomplete);
      return;
    }

    setStepDirection("forward");
    setValidationMessage("");
    runViewTransition(() => {
      onProgress({
        mirrorStep: (step + 1) as 1 | 2 | 3 | 4,
      });
    }, "workshop");
  }

  function createBrief() {
    const incomplete = firstIncomplete(mirrorFieldKeys);
    if (incomplete) {
      const incompleteStep =
        mirrorSteps.findIndex((mirrorStep) =>
          mirrorStep.fields.includes(incomplete),
        ) + 1;
      setStepDirection(incompleteStep < step ? "back" : "forward");
      if (incompleteStep !== step) {
        onProgress({ mirrorStep: incompleteStep as 1 | 2 | 3 | 4 });
      }
      showIncomplete(incomplete);
      return;
    }

    setValidationMessage("");
    runViewTransition(() => setBriefReady(true), "workshop");
  }

  async function requestMirror() {
    if (firstIncomplete(mirrorFieldKeys)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const draft = progress.mirrorDraft;
    try {
      const response = await fetch("/api/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: crypto.randomUUID(),
          toolLane: route,
          firstVersionBrief: {
            person: draft.person.trim(),
            situation: draft.situation.trim(),
            usefulResult: draft.usefulResult.trim(),
            completePath: draft.completePath.trim(),
            trustedFacts: listFromText(draft.trustedFacts),
            mustHave: listFromText(draft.mustHave),
            notNow: listFromText(draft.notNow),
            doneWhen: draft.doneWhen.trim(),
          },
        }),
      });
      const payload = await response.json() as {
        mode?: ReflectionMode;
        result?: MirrorResult;
      };
      if (!response.ok || !payload.result) throw new Error("No reflection returned");
      setResult(payload.result);
      setResultMode(
        payload.mode === "live" || payload.mode === "demo"
          ? payload.mode
          : "demo",
      );
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(briefCopy);
      setCopyStatus("V1 brief copied.");
    } catch {
      setCopyStatus("Copy was blocked. Select the brief text instead.");
    }
  }

  return (
    <AccessibleDialog
      open={open}
      title="V1 brief workshop"
      description="Bring one project you want to make. In four short passes, turn it into a first version AI can plan without guessing. Your text stays on this device unless you request the optional teaching reflection. Never include secrets or personal information."
      onDismiss={onClose}
      appRootRef={appRootRef}
      initialFocusRef={stepHeadingRef}
      ariaBusy={status === "loading"}
      backdropClassName="p4-dialog-backdrop"
      dialogClassName={cx(
        "p4-dialog",
        "p9-mirror-dialog",
        !briefReady && "is-wizard",
        (step > 1 || briefReady) && "is-condensed",
      )}
      titleClassName="p4-dialog__title"
      descriptionClassName="p4-dialog__description"
      contentClassName="p4-dialog__content"
      contentRef={dialogContentRef}
    >
      <button className="p4-dialog__close" type="button" onClick={onClose} aria-label="Close V1 brief workshop">×</button>
      {briefReady ? (
        <div className="p4-brief-result">
          <div className="p4-brief-result__heading">
            <span>Your reusable artifact</span>
            <h3 ref={briefHeadingRef} tabIndex={-1}>V1 brief ready</h3>
            <p>Save this beside the project, then give it to your AI workspace as the source for planning.</p>
          </div>
          <pre><code>{briefCopy}</code></pre>
          <div className="p4-brief-result__actions">
            <button className="p4-primary" type="button" onClick={copyBrief}>Copy my V1 brief</button>
            {!result && (
              <button
                className="p4-secondary"
                type="button"
                disabled={status === "loading"}
                onClick={requestMirror}
              >
                {status === "loading"
                  ? reflectionMode === "live"
                    ? "Asking GPT-5.6…"
                    : "Opening the example…"
                  : reflectionMode === "live"
                    ? "Optional · ask GPT-5.6 to reflect"
                    : "Optional · see an authored example reflection"}
              </button>
            )}
            <button
              className="p4-tertiary"
              type="button"
              onClick={() => {
                setResult(null);
                setResultMode(null);
                setStatus("idle");
                setCopyStatus("");
                setBriefReady(false);
              }}
            >
              Edit my answers
            </button>
          </div>
          <p role="status" aria-live="polite">{copyStatus}</p>
          {status === "error" && <p className="p4-feedback is-risk" role="alert">The optional reflection could not load. Your complete brief is still available above.</p>}
          {result && (
            <div className="p4-mirror-result">
              <p className={cx("p9-reflection-mode", resultMode === "live" && "is-live")}>
                {resultMode === "live"
                  ? "GPT-5.6 reflection · live"
                  : "Authored example · deterministic, no live AI call"}
              </p>
              <article><span>Clear strength</span><p>{result.clearStrength}</p></article>
              <article><span>Questions still open</span><ul>{result.unresolvedAssumptions.map((item) => <li key={item}>{item}</li>)}</ul></article>
              <article><span>Keep out of V1</span><p><b>{result.featureToPostpone.feature}</b> — {result.featureToPostpone.reason}</p></article>
              <article><span>Route tradeoff</span><p>{result.toolTradeoff}</p></article>
              <article><span>Three next moves</span><ol>{result.nextMoves.map((item) => <li key={item}>{item}</li>)}</ol></article>
            </div>
          )}
        </div>
      ) : (
        <div className="p4-wizard">
          <div
            className="p4-wizard-progress"
            role="progressbar"
            aria-label="V1 brief workshop progress"
            aria-valuemin={1}
            aria-valuemax={4}
            aria-valuenow={step}
          >
            {[1, 2, 3, 4].map((item) => (
              <span
                className={cx(item <= step && "is-active")}
                aria-hidden="true"
                key={item}
              >
                0{item}
              </span>
            ))}
          </div>
          <section
            className={cx(
              "p4-wizard__step",
              stepDirection === "back" ? "is-back" : "is-forward",
            )}
            key={`workshop-step-${step}`}
          >
            <span>Step {step} of 4</span>
            <h3 ref={stepHeadingRef} tabIndex={-1}>{stepData.title}</h3>
            <p className="p4-wizard__hint">
              {step === 1
                ? "Start with one person and one moment. Specific beats impressive."
                : "The brief above carries forward. Add only what this pass needs."}
            </p>
            {step > 1 && (
              <div className="p7-brief-thread" aria-label="Brief so far">
                <span>Brief so far</span>
                <p>
                  <b>{progress.mirrorDraft.person}</b>
                  <span aria-hidden="true">→</span>
                  {progress.mirrorDraft.usefulResult}
                </p>
              </div>
            )}
            <div className="p4-wizard__fields">
              {stepData.fields.map((field) => (
                <label key={field}>
                  {mirrorLabels[field]}
                  {step === 1 ? (
                    <input
                      ref={(element) => {
                        fieldRefs.current[field] = element ?? undefined;
                      }}
                      type="text"
                      value={progress.mirrorDraft[field]}
                      placeholder={mirrorPlaceholders[field]}
                      aria-invalid={
                        validationField === field ? "true" : undefined
                      }
                      aria-describedby={
                        validationField === field
                          ? "p9-workshop-validation"
                          : undefined
                      }
                      onChange={(event) => updateDraft(field, event.target.value)}
                    />
                  ) : (
                    <textarea
                      ref={(element) => {
                        fieldRefs.current[field] = element ?? undefined;
                      }}
                      value={progress.mirrorDraft[field]}
                      placeholder={mirrorPlaceholders[field]}
                      aria-invalid={
                        validationField === field ? "true" : undefined
                      }
                      aria-describedby={
                        validationField === field
                          ? "p9-workshop-validation"
                          : undefined
                      }
                      onChange={(event) => updateDraft(field, event.target.value)}
                      rows={4}
                    />
                  )}
                  <small className="p7-field-example">
                    <span>Example</span>
                    {mirrorExamples[field]}
                  </small>
                </label>
              ))}
            </div>
            <p
              className={cx(
                "p9-workshop-validation",
                validationMessage && "is-visible",
              )}
              id="p9-workshop-validation"
              role={validationMessage ? "alert" : undefined}
            >
              {validationMessage}
            </p>
            {step === 4 && (
              <fieldset className="p6-wizard-route">
                <legend>Choose a starter route</legend>
                <div className="p4-options" role="group" aria-label="Selected tool route">
                  {toolChoices.map((choice) => (
                    <button
                      className={cx("p4-choice", route === choice.id && "is-selected")}
                      type="button"
                      aria-pressed={route === choice.id}
                      key={choice.id}
                      onClick={() => updateDraft("toolRoute", choice.id)}
                    >
                      <b>
                        {choice.id === "hosted"
                          ? "Browser workspace"
                          : "Files + saved history"}
                      </b>
                      <small>
                        {choice.id === "hosted"
                          ? "Fastest first preview; verify version history, export, ownership, limits, and cost."
                          : "More setup and a separate publishing step; clearer file ownership and recovery."}
                      </small>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </section>
          <div className="p4-wizard__actions">
            <button
              className="p4-secondary"
              type="button"
              disabled={step === 1}
              onClick={() =>
                runViewTransition(() => {
                  setStepDirection("back");
                  onProgress({
                    mirrorStep: Math.max(1, step - 1) as 1 | 2 | 3 | 4,
                  });
                }, "workshop")
              }
            >
              Back
            </button>
            {step < 4 ? (
              <button
                className="p4-primary"
                type="button"
                onClick={advanceWorkshop}
              >
                Next
              </button>
            ) : (
              <button
                className="p4-primary"
                type="button"
                onClick={createBrief}
              >
                Create my V1 brief
              </button>
            )}
          </div>
        </div>
      )}
    </AccessibleDialog>
  );
}

function RestartDialog({
  open,
  appRootRef,
  returnFocusRef,
  onClose,
  onConfirm,
}: {
  open: boolean;
  appRootRef: RefObject<HTMLElement | null>;
  returnFocusRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const keepRef = useRef<HTMLButtonElement>(null);
  return (
    <AccessibleDialog
      open={open}
      role="alertdialog"
      title="Start the journey again?"
      description="This removes the saved route, project layers, and V1 brief draft from this device."
      onDismiss={onClose}
      appRootRef={appRootRef}
      returnFocusRef={returnFocusRef}
      initialFocusRef={keepRef}
      dismissOnBackdrop={false}
      backdropClassName="p4-dialog-backdrop"
      dialogClassName="p4-dialog p4-dialog--small"
      titleClassName="p4-dialog__title"
      descriptionClassName="p4-dialog__description"
      contentClassName="p4-dialog__content"
    >
      <div className="p4-restart-actions">
        <button ref={keepRef} className="p4-secondary" type="button" onClick={onClose}>Keep my progress</button>
        <button className="p4-danger" type="button" onClick={onConfirm}>Remove progress and restart</button>
      </div>
    </AccessibleDialog>
  );
}

export function PentimentoFinal() {
  const [progress, setProgress] = useState<FinalProgress>(() => cloneInitialProgress());
  const [hydrated, setHydrated] = useState(false);
  const [resumePending, setResumePending] = useState(false);
  const [routeOpen, setRouteOpen] = useState(false);
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const [mirrorOpen, setMirrorOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const [restartFromRoute, setRestartFromRoute] = useState(false);
  const [pendingHandoff, setPendingHandoff] = useState<HandoffId | null>(null);
  const [receiptReady, setReceiptReady] = useState(false);
  const [taskRevision, setTaskRevision] = useState(0);
  const [checkpointRevision, setCheckpointRevision] = useState(0);
  const [introFailureObserved, setIntroFailureObserved] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const appRootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const restored = parseStoredFinalProgress(
      window.localStorage.getItem(FINAL_STORAGE_KEY),
    );
    const next = restored ?? cloneInitialProgress();
    setProgress(next);
    setResumePending(next.started && next.stage !== "completion");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      FINAL_STORAGE_KEY,
      serializeFinalProgress(progress),
    );
  }, [hydrated, progress]);

  useEffect(() => {
    if (!hydrated) return;
    const frame = window.requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [
    hydrated,
    progress.stage,
    resumePending,
  ]);

  useEffect(() => {
    if (!hydrated || taskRevision === 0) return;
    const frame = window.requestAnimationFrame(() => {
      const question = document.querySelector<HTMLElement>(".p4-task h2");
      const task = question?.closest<HTMLElement>(".p4-task") ?? null;
      if (task) {
        const rect = task.getBoundingClientRect();
        if (rect.top < 92 || rect.bottom > window.innerHeight - 24) {
          window.scrollTo({
            top: Math.max(0, window.scrollY + rect.top - 96),
            behavior: "auto",
          });
        }
      }
      question?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hydrated, taskRevision]);

  useEffect(() => {
    if (!hydrated || checkpointRevision === 0) return;
    let scrollTimer: number | undefined;
    const frame = window.requestAnimationFrame(() => {
      const checkpoint = document.querySelector<HTMLElement>(".p5-checkpoint h2");
      const receipt =
        checkpoint?.closest<HTMLElement>(".p5-checkpoint") ?? null;
      if (receipt) {
        const rect = receipt.getBoundingClientRect();
        if (rect.top < 92 || rect.bottom > window.innerHeight - 24) {
          window.scrollTo({
            top: Math.max(0, window.scrollY + rect.top - 96),
            behavior: "auto",
          });
        }
      }
      scrollTimer = window.setTimeout(() => {
        checkpoint?.focus({ preventScroll: true });
      }, preferredScrollBehavior() === "auto" ? 0 : 260);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
    };
  }, [checkpointRevision, hydrated]);

  function choose(
    stage: FinalLearningStage,
    patch: Partial<FinalProgress>,
    complete = false,
    handoff?: HandoffId,
  ) {
    runViewTransition(() => {
      setReceiptReady(false);
      setPendingHandoff(handoff ?? null);
      setProgress((current) => {
        if (current.completedStages.includes(stage)) {
          setAnnouncement(`${stageLabel(stage)} is a saved, read-only layer.`);
          return current;
        }
        return { ...current, ...patch };
      });
    }, handoff ? "substep" : "choice");
  }

  function continueHandoff(handoff: HandoffId) {
    runViewTransition(() => {
      setPendingHandoff((current) => current === handoff ? null : current);
      setTaskRevision((current) => current + 1);
    }, "substep");
  }

  function revealReceipt() {
    runViewTransition(() => {
      setPendingHandoff(null);
      setReceiptReady(true);
      setCheckpointRevision((current) => current + 1);
    }, "choice");
  }

  function saveCurrentLayer(stage: FinalLearningStage) {
    runViewTransition(() => {
      setPendingHandoff(null);
      setReceiptReady(false);
      window.scrollTo({ top: 0, behavior: "auto" });
      setProgress((current) => {
        const advanced = completeFinalStage(current, stage);
        if (advanced === current || advanced.stage === current.stage) return current;
        setAnnouncement(
          `${stageLabel(stage)} layer saved. Next: ${stageLabel(advanced.stage)}.`,
        );
        return advanced;
      });
    }, "scene");
  }

  function updateProgress(patch: Partial<FinalProgress>) {
    setProgress((current) => ({ ...current, ...patch }));
  }

  function begin(introFailureObserved = false) {
    runViewTransition(() => {
      setPendingHandoff(null);
      setReceiptReady(false);
      setProgress((current) => ({
        ...startFinalJourney(current),
        introFailureObserved,
      }));
      setResumePending(false);
      setAnnouncement("Idea opened. Choose one useful finish for the first visitor.");
    }, "scene");
  }

  function resetJourney() {
    const fresh = cloneInitialProgress();
    setProgress(fresh);
    setResumePending(false);
    setRestartOpen(false);
    setRestartFromRoute(false);
    setRouteOpen(false);
    setPlaybookOpen(false);
    setMirrorOpen(false);
    setPendingHandoff(null);
    setReceiptReady(false);
    setIntroFailureObserved(false);
    setAnnouncement("Progress removed. The journey is ready to begin again.");
  }

  function navigateTo(stage: FinalLearningStage) {
    runViewTransition(() => {
      setPendingHandoff(null);
      setReceiptReady(false);
      setProgress((current) => navigateFinalStage(current, stage));
      setRouteOpen(false);
      setAnnouncement(`${stageLabel(stage)} opened for review.`);
    }, "scene");
  }

  function returnToCurrentStage() {
    runViewTransition(() => {
      setPendingHandoff(null);
      setReceiptReady(false);
      setProgress((current) => {
        const currentStage = finalLearningStages[current.completedStages.length] ?? "completion";
        setAnnouncement(`${stageLabel(currentStage)} restored.`);
        return { ...current, stage: currentStage };
      });
    }, "scene");
  }

  let content: React.ReactNode;
  if (!hydrated) {
    content = <PreparingStudio />;
  } else if (resumePending) {
    content = (
      <ResumeWelcome
        progress={progress}
        headingRef={headingRef}
        onResume={() => {
          setResumePending(false);
          setAnnouncement(`${stageLabel(progress.stage)} restored.`);
        }}
        onRestart={() => setRestartOpen(true)}
      />
    );
  } else if (!progress.started || progress.stage === "welcome") {
    content = (
      <PaginatedWelcome
        headingRef={headingRef}
        onStart={begin}
        onOverview={() => setRouteOpen(true)}
        onEvidenceObserved={() => setIntroFailureObserved(true)}
      />
    );
  } else {
    const reviewingSavedStage =
      progress.stage !== "completion" &&
      progress.completedStages.includes(progress.stage);
    const currentReachableStage =
      finalLearningStages[progress.completedStages.length] ?? "completion";
    const activeLearningStage = progress.stage as FinalLearningStage;
    const currentStageReady =
      progress.stage !== "completion" &&
      !reviewingSavedStage &&
      completeFinalStage(progress, activeLearningStage).stage !== progress.stage;
    content = (
      <>
        <JourneyHeader
          progress={progress}
          onRoute={() => setRouteOpen(true)}
          onPlaybook={() => setPlaybookOpen(true)}
          onRestart={() => setRestartOpen(true)}
          restartRef={restartButtonRef}
        />
        {progress.stage === "completion" ? (
          <Completion
            progress={progress}
            headingRef={headingRef}
            onPlaybook={() => setPlaybookOpen(true)}
            onMirror={() => setMirrorOpen(true)}
          />
        ) : (
          <>
            <main id="main-content">
              <section className="p4-stage">
                <header
                  className="p4-stage__intro"
                  key={`stage-intro-${progress.stage}`}
                >
                  <p className="p4-kicker">
                    Stop {stageById[progress.stage].number} · {stageById[progress.stage].navLabel}
                  </p>
                  <h1 ref={headingRef} tabIndex={-1}>
                    {stageById[progress.stage].heading}
                  </h1>
                  <p>{stageById[progress.stage].introduction}</p>
                  <p className="p7-stage-output">
                    <span>Make at this stop</span>
                    <b>{stageById[progress.stage].canvasLayer}</b>
                  </p>
                  <LastSavedRule progress={progress} />
                </header>
                <div className="p4-workspace">
                  <div
                    className="p5-learning-column"
                    key={`learning-column-${progress.stage}`}
                  >
                    {reviewingSavedStage ? (
                      <SavedStageReview
                        stage={progress.stage as FinalLearningStage}
                        currentStage={currentReachableStage}
                        onReturn={returnToCurrentStage}
                      />
                    ) : (
                      <>
                        {currentStageReady && receiptReady ? (
                          <StageCheckpoint
                            key={`receipt:${progress.stage}:${checkpointRevision}`}
                            stage={activeLearningStage}
                            progress={progress}
                            onContinue={() => saveCurrentLayer(activeLearningStage)}
                          />
                        ) : (
                          <StageTask
                            key={`${progress.stage}:${taskRevision}`}
                            progress={progress}
                            pendingHandoff={pendingHandoff}
                            receiptReady={receiptReady}
                            choose={choose}
                            onContinueHandoff={continueHandoff}
                            onRevealReceipt={revealReceipt}
                          />
                        )}
                      </>
                    )}
                  </div>
                  <ResponsiveProjectCanvas progress={progress} />
                </div>
              </section>
              <StageDepth progress={progress} />
            </main>
          </>
        )}
      </>
    );
  }

  return (
    <>
      {hydrated && progress.started && progress.stage !== "welcome" ? (
        <a className="p4-skip" href="#main-content">
          Skip to the current task
        </a>
      ) : null}
      <div className="p4-app" ref={appRootRef}>
        {content}
        <p className="p4-visually-hidden" role="status" aria-live="polite">
          {announcement}
        </p>
      </div>
      <RouteDialog
        open={routeOpen}
        progress={progress}
        appRootRef={appRootRef}
        onClose={() => setRouteOpen(false)}
        onNavigate={navigateTo}
        onRestart={() => {
          setRouteOpen(false);
          setRestartFromRoute(true);
          setRestartOpen(true);
        }}
        onStart={() => begin(introFailureObserved)}
      />
      <PlaybookDialog
        open={playbookOpen}
        progress={progress}
        appRootRef={appRootRef}
        onClose={() => setPlaybookOpen(false)}
      />
      <MirrorDialog
        open={mirrorOpen}
        progress={progress}
        appRootRef={appRootRef}
        onClose={() => setMirrorOpen(false)}
        onProgress={updateProgress}
      />
      <RestartDialog
        open={restartOpen}
        appRootRef={appRootRef}
        returnFocusRef={restartButtonRef}
        onClose={() => {
          setRestartOpen(false);
          if (restartFromRoute) setRouteOpen(true);
          setRestartFromRoute(false);
        }}
        onConfirm={resetJourney}
      />
    </>
  );
}
