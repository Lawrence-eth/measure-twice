"use client";

import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { AccessibleDialog } from "@/components/AccessibleDialog";
import {
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

type MirrorResult = {
  clearStrength: string;
  unresolvedAssumptions: string[];
  featureToPostpone: { feature: string; reason: string };
  toolTradeoff: string;
  nextMoves: string[];
};

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
              <span className="p6-choice__marker-selected">✓</span>
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
}: {
  choice: ChoiceItem | undefined;
  successLabel?: string;
  riskLabel?: string;
}) {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!choice || choice.recommended) return;
    const behavior = preferredScrollBehavior();
    const timer = window.setTimeout(() => {
      shellRef.current?.scrollIntoView({
        block: "nearest",
        behavior,
      });
    }, behavior === "auto" ? 0 : 340);
    return () => window.clearTimeout(timer);
  }, [choice]);

  return (
    <div
      className={cx("p6-feedback-shell", choice && "is-visible")}
      ref={shellRef}
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
            <small>
              <span aria-hidden="true">↳</span> {choice.canvasChange}
            </small>
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

function BuildVisual({ checked }: { checked: boolean }) {
  return (
    <div className="p4-build">
      <div className="p4-ai-report">
        <span>AI report</span>
        <p>Done — the Willow Fix Day page is ready.</p>
      </div>
      <div className="p4-build__loop" aria-label="The reusable build loop">
        {["Ask", "Inspect", "Run", "Check", "Save"].map((step) => (
          <span className={cx(checked && "is-complete")} key={step}>
            {step}
          </span>
        ))}
      </div>
      <div className="p4-versions" aria-label="Saved layers">
        <span className={cx("p4-version", checked && "is-current")}>V1</span>
        <span className="p4-version">V2</span>
        <span className="p4-version">V3</span>
      </div>
      <EvidenceLadder earned={checked ? 4 : 3} />
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

function ImproveVisual({ completed }: { completed: boolean }) {
  return (
    <div className="p4-diff">
      <article>
        <small>V4 · trusted source</small>
        <p>West Hall Community Room</p>
      </article>
      <span aria-hidden="true">→</span>
      <article>
        <small>{completed ? "V5 · source + page" : "Requested layer"}</small>
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
    <aside className="p5-saved-receipt" aria-label={`${previous.navLabel} build-kit note saved`}>
      <span>{previous.navLabel} build-kit note saved</span>
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
        <BuildVisual checked={progress.buildEvidenceChoice === "full-evidence"} />
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
        <EvidenceLadder earned={progress.releaseProofChoice ? 5 : 4} />
        <ReleaseVisual progress={progress} />
        <SavedArtifact progress={progress} />
      </CanvasFrame>
    );
  }
  return (
    <CanvasFrame layer={`${layerNumber} / 8`}>
      <FoundationSummary progress={progress} />
      <ImproveVisual completed={progress.improveChoice === "source-then-page"} />
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
      <details className="p4-canvas-mobile" open>
        <summary>
          <span>Project layers</span>
          <b>{canvasDisclosureLabel(progress.stage)}</b>
        </summary>
        <CanvasLens progress={progress} />
      </details>
    </>
  );
}

type StageTaskProps = {
  progress: FinalProgress;
  choose: (
    stage: FinalLearningStage,
    patch: Partial<FinalProgress>,
    complete?: boolean,
    focusNextQuestion?: boolean,
  ) => void;
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

function IdeaTask({ progress, choose }: StageTaskProps) {
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
      />
    </TaskShell>
  );
}

function ToolsTask({ progress, choose }: StageTaskProps) {
  const selected = toolChoices.find((choice) => choice.id === progress.toolChoice);
  return (
    <TaskShell
      id="tools"
      eyebrow="One route, three jobs"
      question="Which tradeoff matters more for your first project?"
      hint="Both routes can work. Choose the tradeoff you prefer—not a product brand."
    >
      <ChoiceButtons
        choices={toolChoices}
        selected={progress.toolChoice}
        onChoose={(id) =>
          choose("tools", { toolChoice: id as FinalProgress["toolChoice"] }, true)
        }
      />
      <ChoiceFeedback choice={selected} successLabel="A deliberate starter route" />
    </TaskShell>
  );
}

function ProjectHomeTask({ progress, choose }: StageTaskProps) {
  const route = progress.toolChoice ?? "repository";
  if (progress.projectHomeChoice === "route-home") {
    const privateChoices: readonly ChoiceItem[] = [secretChoices[1], secretChoices[0]];
    const selected = privateChoices.find((choice) => choice.id === progress.secretChoice);
    return (
      <TaskShell
        id="runtime-ai"
        eyebrow="Project home chosen · one more decision"
        question="Does this finished page need an AI API key?"
        hint="The visitor only reads approved facts and opens a normal email link."
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
          }, false, id === "route-home")
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="The work has a home"
        riskLabel="The work would disappear with the chat"
      />
    </TaskShell>
  );
}

function AskTask({ progress, choose }: StageTaskProps) {
  if (progress.aiFirstChoice === "inspect-plan") {
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
          }, false, id === "inspect-plan")
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="Plan before change"
        riskLabel="Too much changes before you can review it"
      />
    </TaskShell>
  );
}

function BuildTask({ progress, choose }: StageTaskProps) {
  const choices: readonly ChoiceItem[] = buildEvidenceChoices;
  const selected = choices.find((choice) => choice.id === progress.buildEvidenceChoice);
  return (
    <TaskShell
      id="build"
      eyebrow="AI says “Done”"
      question="Which action earns the next evidence level?"
      hint="AI made a claim, files changed, and a preview appeared. None proves the visitor can finish."
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
        successLabel="Evidence before trust"
        riskLabel="Evidence is still missing"
      />
    </TaskShell>
  );
}

function ContactPractice({
  repaired,
  onTry,
}: {
  repaired: boolean;
  onTry: () => void;
}) {
  return (
    <div className="p4-browser p4-browser--practice">
      <div className="p4-browser__bar">simulated preview · no email is sent</div>
      <div className="p4-browser__page">
        <span>Willow Fix Day · contact</span>
        <h3>Questions before you come?</h3>
        <p>The address is fictional. This checks link behavior, not delivery.</p>
        <button
          type="button"
          className={cx("p4-contact", repaired && "is-fixed")}
          onClick={onTry}
        >
          Email the organizer
        </button>
      </div>
    </div>
  );
}

function CheckTask({ progress, choose }: StageTaskProps) {
  if (!progress.checkAttemptChoice) {
    return (
      <TaskShell
        id="try-contact"
        eyebrow="Use it like a visitor"
        question="Try the visitor contact action"
        hint="The preview looks polished. Find out what the important path actually does."
      >
        <ContactPractice
          repaired={false}
          onTry={() => choose("check", { checkAttemptChoice: "try-contact" }, false, true)}
        />
      </TaskShell>
    );
  }

  if (progress.repairChoice === "bounded-repair" && !progress.checkRetryChoice) {
    return (
      <TaskShell
        id="retry-contact"
        eyebrow="One link changed · everything else preserved"
        question="Does the repaired contact path now finish?"
        hint="Repeat the same action. This simulation should reach the mailto target; it will not open or send email."
      >
        <ContactPractice
          repaired
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
            id === "bounded-repair",
          )
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="Smallest safe repair"
        riskLabel="The repair expanded beyond the observed defect"
      />
    </TaskShell>
  );
}

function GoLiveTask({ progress, choose }: StageTaskProps) {
  if (progress.releaseVersionChoice === "v4-checked") {
    return (
      <TaskShell
        id="release-proof"
        eyebrow="Deployment finished · public behavior unproven"
        question="Prove the release where a visitor reaches it"
        hint="Open the public address fresh and repeat the same important path. This is a safe simulation."
      >
        <div className="p4-public-check">
          <div>
            <span>Host dashboard</span>
            <b>Deployment completed</b>
            <small>Proves the host finished—not that the visitor path works.</small>
          </div>
          <button
            className="p4-primary"
            type="button"
            onClick={() => choose("go-live", { releaseProofChoice: "public-path" }, true)}
          >
            Open fresh and repeat the contact path
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
      <ChoiceButtons
        choices={releaseVersionChoices}
        selected={progress.releaseVersionChoice}
        onChoose={(id) =>
          choose("go-live", {
            releaseVersionChoice: id as FinalProgress["releaseVersionChoice"],
            releaseProofChoice: null,
          }, false, id === "v4-checked")
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="Release candidate selected"
        riskLabel="Known evidence does not support this version"
      />
    </TaskShell>
  );
}

function ImproveTask({ progress, choose }: StageTaskProps) {
  const selected = improveChoices.find((choice) => choice.id === progress.improveChoice);
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
            { improveChoice: id as FinalProgress["improveChoice"] },
            id === "source-then-page",
          )
        }
      />
      <ChoiceFeedback
        choice={selected}
        successLabel="Source before surface"
        riskLabel="The source or scope is still wrong"
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
  idea: "Keep this V1 boundary",
  tools: "Save this tool route",
  "project-home": "Pin this project home",
  "ask-ai": "Approve this work agreement",
  build: "Save this evidenced version",
  check: "Pin the repaired path",
  "go-live": "Record this checked release",
  improve: "Save this source-backed update",
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
      <span>Build-kit note ready · {stop.artifact}</span>
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
  const auditStartRef = useRef<HTMLButtonElement>(null);
  const auditLayersHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (screen === "inspection") {
      window.scrollTo({ top: 0, behavior: "auto" });
      const frame = window.requestAnimationFrame(() => {
        inspectionHeadingRef.current?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [screen]);

  useEffect(() => {
    if (auditStep === "failed") {
      const frame = window.requestAnimationFrame(() => {
        auditRevealRef.current
          ?.closest(".p5-audit__reveal")
          ?.scrollIntoView({
            block: "center",
            behavior: preferredScrollBehavior(),
          });
        auditRevealRef.current?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(frame);
    }
    if (auditStep === "revealed") {
      const frame = window.requestAnimationFrame(() => {
        auditLayersHeadingRef.current
          ?.closest(".p5-audit__underlayers")
          ?.scrollIntoView({
            block: "start",
            behavior: preferredScrollBehavior(),
          });
        auditLayersHeadingRef.current?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [auditStep]);

  return (
    <div className="p4-welcome p6-welcome">
      <header className="p4-welcome__header">
        <Brand />
        <span>Field lesson 01 · building with AI</span>
      </header>
      <main id="main-content">
        {screen === "orientation" ? (
          <section className="p6-orientation" aria-labelledby="welcome-title">
            <div className="p6-orientation__index" aria-hidden="true">
              <span>001</span>
              <i />
              <span>Orientation</span>
            </div>
            <div className="p6-orientation__grid">
              <div className="p4-welcome__copy">
                <p className="p4-kicker">{finalOpening.kicker}</p>
                <h1 id="welcome-title" ref={headingRef} tabIndex={-1}>
                  <span>{finalOpening.promise}</span>
                  <em>{finalOpening.destination}</em>
                </h1>
                <p className="p4-welcome__lede">{finalOpening.explanation}</p>
              </div>
              <aside className="p6-orientation__brief" aria-label="What this lesson gives you">
                <span>What changes after this lesson</span>
                <p>{finalOpening.payoff}</p>
                <dl>
                  <div>
                    <dt>Practice</dt>
                    <dd>One fictional website</dd>
                  </div>
                  <div>
                    <dt>Method</dt>
                    <dd>Eight stops, 13 decisions</dd>
                  </div>
                  <div>
                    <dt>Keep</dt>
                    <dd>A reusable build kit</dd>
                  </div>
                </dl>
              </aside>
            </div>
            <div className="p6-orientation__footer">
              <div>
                <button
                  className="p4-primary"
                  type="button"
                  onClick={() => setScreen("inspection")}
                >
                  {finalOpening.primaryAction}
                </button>
                <p>{finalOpening.reassurance}</p>
              </div>
              <div className="p6-orientation__preview">
                <span>Prefer to look ahead?</span>
                <button className="p4-text-button" type="button" onClick={onOverview}>
                  {finalOpening.overviewAction}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="p6-inspection" aria-labelledby="inspection-title">
            <div className="p6-inspection__intro">
              <p className="p4-kicker">Before the method · one-minute inspection</p>
              <h1 id="inspection-title" ref={inspectionHeadingRef} tabIndex={-1}>
                Meet your practice project.
              </h1>
              <p>
                Willow Fix Day is fictional. Its page has one job: show the event
                details and let a visitor email the organizer.
              </p>
              <aside>
                <span>AI report</span>
                <b>“Ready to publish.”</b>
                <p>
                  Do not trust the report yet. Try the visitor’s only important
                  action.
                </p>
              </aside>
              <button
                className="p4-text-button p6-inspection__back"
                type="button"
                onClick={() => setScreen("orientation")}
              >
                Back to the introduction
              </button>
            </div>

            <section
              className={cx("p5-audit", `is-${auditStep}`)}
              aria-labelledby="welcome-audit-title"
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
              <div className="p5-audit__surface">
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
                  onClick={() => setAuditStep("failed")}
                  disabled={auditStep !== "surface"}
                >
                  {auditStep === "surface"
                    ? "Email the organizer"
                    : "Email action · nothing happened"}
                </button>
              </div>

              {auditStep === "surface" && (
                <p className="p5-audit__instruction">
                  The report proves a claim. Your click checks the behavior.
                </p>
              )}

              {auditStep === "failed" && (
                <div className="p5-audit__reveal" role="status">
                  <span>Observed failure</span>
                  <h3>Nothing happened.</h3>
                  <p>
                    The preview proved appearance. Your click tested behavior.
                    Now inspect what the polished screen kept out of view.
                  </p>
                  <button
                    ref={auditRevealRef}
                    className="p4-secondary"
                    type="button"
                    onClick={() => setAuditStep("revealed")}
                  >
                    Reveal what the screen hid
                  </button>
                </div>
              )}

              {auditStep === "revealed" && (
                <div className="p5-audit__underlayers" role="status">
                  <span>Spectral inspection · four hidden layers</span>
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
                    ref={auditStartRef}
                    className="p4-primary"
                    type="button"
                    onClick={onStart}
                  >
                    Start with layer 1 · define the promise
                  </button>
                </div>
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
        <Brand onClick={onRoute} />
        <button className="p4-header__center" type="button" onClick={onRoute}>
          <span>
            {progress.stage === "completion"
              ? "Route complete"
              : `${String(currentNumber).padStart(2, "0")} / 08`}
          </span>
          <b>{stageLabel(progress.stage)}</b>
          <small>{chapter.title}</small>
        </button>
        <div className="p4-header__actions">
          <button type="button" onClick={onPlaybook}>Build kit</button>
          <button type="button" onClick={onRoute}>Route</button>
          <button ref={restartRef} type="button" onClick={onRestart}>Start over</button>
        </div>
      </header>
      <div className="p4-progress" aria-hidden="true">
        <i style={{ width: `${Math.max(completed, currentNumber - 1) / 8 * 100}%` }} />
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
          You can guide{" "}
          <em>a project from idea to evidence.</em>
        </h1>
        <p>
          You completed a simulated release. Next, use the same method on a project you care about.
        </p>
        <LastSavedRule progress={progress} />
      </div>
      <div className="p4-complete__actions">
        <button className="p4-primary" type="button" onClick={onMirror}>
          Shape my own V1 brief
        </button>
        <button className="p4-secondary" type="button" onClick={onPlaybook}>
          Open my build kit
        </button>
      </div>
      <section className="p6-capabilities" aria-labelledby="capabilities-title">
        <div>
          <span>Transfer check</span>
          <h2 id="capabilities-title">What you can now direct</h2>
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
      title={progress.started ? "Your eight-stop route" : "The whole journey, one decision at a time"}
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
      <button className="p4-dialog__close" type="button" onClick={onClose} aria-label="Close route">×</button>
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
            <span>Build-kit notes saved</span>
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
          "For updates, change the approved source, run affected checks, then one core-path smoke check.",
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
                {card.title}
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
                <p><b>Do</b></p>
                <ol>{detail.actions.map((action) => <li key={action}>{action}</li>)}</ol>
                <p><b>Proof:</b> {detail.proof}</p>
                <details>
                  <summary>Template and Willow Fix Day example</summary>
                  <pre><code>{detail.template}</code></pre>
                  <p><b>Worked example:</b> {detail.example}</p>
                  <button className="p4-secondary" type="button" onClick={copyTemplate}>Copy template</button>
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
  person: "Who is this for?",
  situation: "What situation are they in?",
  usefulResult: "What useful result should they get?",
  completePath: "What complete path should they finish?",
  trustedFacts: "What facts can you trust?",
  mustHave: "What must the first version include?",
  notNow: "What is not now?",
  doneWhen: "What proves it is done?",
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

const mirrorPlaceholders: Record<Exclude<TeachingMirrorFieldKey, "toolRoute">, string> = {
  person: "e.g. a first-time visitor",
  situation: "e.g. checking details by phone",
  usefulResult: "e.g. confirm details, then email",
  completePath: "e.g. open → compare → email",
  trustedFacts: "e.g. organizer-approved note",
  mustHave: "e.g. date, place, list, contact",
  notNow: "e.g. accounts, booking, payments",
  doneWhen: "e.g. another person completes it at 390px",
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
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [briefReady, setBriefReady] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const briefHeadingRef = useRef<HTMLHeadingElement>(null);
  const step = progress.mirrorStep;
  const stepData = mirrorSteps[step - 1];
  const route = progress.mirrorDraft.toolRoute || progress.toolChoice || "repository";
  const fieldsReady = stepData.fields.every((field) => progress.mirrorDraft[field].trim().length >= 2);
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
      setStatus("idle");
      setBriefReady(false);
      setCopyStatus("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      const target = briefReady ? briefHeadingRef.current : stepHeadingRef.current;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({
        block: "nearest",
        behavior: preferredScrollBehavior(),
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [briefReady, open, step]);

  function updateDraft(field: keyof FinalMirrorDraft, value: string) {
    onProgress({
      mirrorDraft: { ...progress.mirrorDraft, [field]: value },
    });
  }

  async function requestMirror() {
    if (!fieldsReady) return;
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
      const payload = await response.json() as { result?: MirrorResult };
      if (!response.ok || !payload.result) throw new Error("No reflection returned");
      setResult(payload.result);
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
      description="Shape a reusable first-version brief on this device. Your text stays here until you request the optional teaching reflection; that sends the brief to the server. Never include secrets or personal information."
      onDismiss={onClose}
      appRootRef={appRootRef}
      ariaBusy={status === "loading"}
      backdropClassName="p4-dialog-backdrop"
      dialogClassName="p4-dialog"
      titleClassName="p4-dialog__title"
      descriptionClassName="p4-dialog__description"
      contentClassName="p4-dialog__content"
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
                {status === "loading" ? "Reflecting…" : "Optional · get a teaching reflection"}
              </button>
            )}
          </div>
          <p role="status" aria-live="polite">{copyStatus}</p>
          {status === "error" && <p className="p4-feedback is-risk" role="alert">The optional reflection could not load. Your complete brief is still available above.</p>}
          {result && (
            <div className="p4-mirror-result">
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
          <section className="p4-wizard__step" key={`workshop-step-${step}`}>
            <span>Step {step} of 4</span>
            <h3 ref={stepHeadingRef} tabIndex={-1}>{stepData.title}</h3>
            <p className="p4-wizard__hint">
              {step === 1
                ? "Complete the three short prompts. Specific beats impressive."
                : "Use the example inside each field as a shape, not an answer."}
            </p>
            <div className="p4-wizard__fields">
              {stepData.fields.map((field) => (
                <label key={field}>
                  {mirrorLabels[field]}
                  {step === 1 ? (
                    <input
                      type="text"
                      value={progress.mirrorDraft[field]}
                      placeholder={mirrorPlaceholders[field]}
                      onChange={(event) => updateDraft(field, event.target.value)}
                    />
                  ) : (
                    <textarea
                      value={progress.mirrorDraft[field]}
                      placeholder={mirrorPlaceholders[field]}
                      onChange={(event) => updateDraft(field, event.target.value)}
                      rows={4}
                    />
                  )}
                </label>
              ))}
            </div>
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
                      <b>{choice.label}</b>
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
              onClick={() => onProgress({ mirrorStep: Math.max(1, step - 1) as 1 | 2 | 3 | 4 })}
            >
              Back
            </button>
            {step < 4 ? (
              <button
                className="p4-primary"
                type="button"
                disabled={!fieldsReady}
                onClick={() => onProgress({ mirrorStep: (step + 1) as 1 | 2 | 3 | 4 })}
              >
                Next
              </button>
            ) : (
              <button className="p4-primary" type="button" disabled={!fieldsReady} onClick={() => setBriefReady(true)}>
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
  const [taskRevision, setTaskRevision] = useState(0);
  const [checkpointRevision, setCheckpointRevision] = useState(0);
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
      question?.focus({ preventScroll: true });
      question?.closest(".p4-task")?.scrollIntoView({
        block: "start",
        behavior: preferredScrollBehavior(),
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hydrated, taskRevision]);

  useEffect(() => {
    if (!hydrated || checkpointRevision === 0) return;
    let scrollTimer: number | undefined;
    const frame = window.requestAnimationFrame(() => {
      const checkpoint = document.querySelector<HTMLElement>(".p5-checkpoint h2");
      checkpoint?.focus({ preventScroll: true });
      scrollTimer = window.setTimeout(() => {
        checkpoint?.closest(".p5-checkpoint")?.scrollIntoView({
          block: "nearest",
          behavior: preferredScrollBehavior(),
        });
      }, preferredScrollBehavior() === "auto" ? 0 : 340);
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
    focusNextQuestion = false,
  ) {
    if (focusNextQuestion) setTaskRevision((current) => current + 1);
    setProgress((current) => {
      if (current.completedStages.includes(stage)) {
        setAnnouncement(`${stageLabel(stage)} is a saved, read-only layer.`);
        return current;
      }
      const patched = { ...current, ...patch };
      if (!complete) return patched;
      setCheckpointRevision((revision) => revision + 1);
      return patched;
    });
  }

  function saveCurrentLayer(stage: FinalLearningStage) {
    setProgress((current) => {
      const advanced = completeFinalStage(current, stage);
      if (advanced === current || advanced.stage === current.stage) return current;
      setAnnouncement(
        `${stageLabel(stage)} layer saved. Next: ${stageLabel(advanced.stage)}.`,
      );
      return advanced;
    });
  }

  function updateProgress(patch: Partial<FinalProgress>) {
    setProgress((current) => ({ ...current, ...patch }));
  }

  function begin() {
    setProgress((current) => startFinalJourney(current));
    setResumePending(false);
    setAnnouncement("Idea opened. Choose one useful finish for the first visitor.");
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
    setAnnouncement("Progress removed. The journey is ready to begin again.");
  }

  function navigateTo(stage: FinalLearningStage) {
    setProgress((current) => navigateFinalStage(current, stage));
    setRouteOpen(false);
    setAnnouncement(`${stageLabel(stage)} opened for review.`);
  }

  function returnToCurrentStage() {
    setProgress((current) => {
      const currentStage = finalLearningStages[current.completedStages.length] ?? "completion";
      setAnnouncement(`${stageLabel(currentStage)} restored.`);
      return { ...current, stage: currentStage };
    });
  }

  let content: React.ReactNode;
  if (!hydrated) {
    content = <div className="p4-loading">Preparing the studio…</div>;
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
      <Welcome
        headingRef={headingRef}
        onStart={begin}
        onOverview={() => setRouteOpen(true)}
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
                  <aside className="p5-stage-contract" aria-label="Learning purpose and outcome">
                    <div>
                      <span>Why this matters</span>
                      <p>{stageById[progress.stage].stakes}</p>
                    </div>
                    <div>
                      <span>You will leave with</span>
                      <p>{stageById[progress.stage].canvasLayer}</p>
                    </div>
                  </aside>
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
                        <StageTask
                          key={`${progress.stage}:${taskRevision}`}
                          progress={progress}
                          choose={choose}
                        />
                        {currentStageReady && (
                          <StageCheckpoint
                            stage={activeLearningStage}
                            progress={progress}
                            onContinue={() => saveCurrentLayer(activeLearningStage)}
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
      <a className="p4-skip" href="#main-content">Skip to the current task</a>
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
        onStart={begin}
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
