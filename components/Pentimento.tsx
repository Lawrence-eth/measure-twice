"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AccessibleDialog } from "@/components/AccessibleDialog";
import { AccessibleTabs } from "@/components/AccessibleTabs";
import { RadioCardGroup, ToggleCard } from "@/components/ChoiceControls";
import { DebriefResponseSchema, type DebriefResponse } from "@/lib/debrief-contracts";
import {
  buildCompetencies,
  calibrationSnapshot,
  canCompleteScene,
  initialProgress,
  parseMissionProgress,
  releaseEvidenceSnapshot,
  repairIsSpecific,
  transferExplanationIsMeaningful,
  type MissionProgress,
} from "@/lib/evidence-engine";
import {
  arrivalChoices,
  checks,
  contextOptions,
  fieldNotes,
  mission,
  nextScene,
  planOptions,
  postRepairReruns,
  projectTerms,
  repairFields,
  repositoryOptions,
  sceneLabels,
  sceneOrder,
  scopeDispositions,
  targetFields,
  transferQuestions,
  workModes,
  type ScopeDisposition,
  type WorkModeId,
  type Confidence,
  type SceneId,
} from "@/lib/mission";

const STORAGE_KEY = "pentimento:mission:v2:repair-cafe";
const LEGACY_STORAGE_KEY = "measure-twice:mission:v1:repair-cafe";
const RELEASE_VERSION = "c7a91e4";

type Feedback = {
  scene: SceneId;
  passed: boolean;
  goal: string;
  evidence: string;
  principle: string;
  nextMove: string;
};

const hints: Partial<Record<SceneId, string[]>> = {
  target: [
    "Which choices describe something a real visitor can do or something you can observe?",
    "Replace broad audiences, feelings, and AI assurances with a specific visitor, outcome, and check.",
    "Choose nearby phone users, deciding whether to attend, facts/mobile evidence, and explicit non-goals.",
  ],
  record: [
    "Which items preserve trusted context and history without exposing authority or private data?",
    "Keep the brief, facts, files, safe placeholders, and a checkpoint. A credential never belongs in history.",
    "Select README, facts, project files, .env.example, and the initial commit—never the API key or a chat dump.",
  ],
  handoff: [
    "What would the AI need for this one change—and what would be dangerous or irrelevant?",
    "Include the outcome, sources, current files, checks, and permission boundary. Exclude secrets and unrelated folders.",
    "The handoff needs goal, facts, current files, acceptance checks, authority, and the relevant mobile reference.",
  ],
  radius: [
    "Which plan items directly prove the brief without creating a new hidden system?",
    "Accounts, databases, and dashboards each create several new failure paths.",
    "Keep approved facts, one responsive action, and verification. Defer the rest.",
  ],
  check: [
    "Which checks get evidence from the artifact or trusted source rather than another AI claim?",
    "Inspect facts, phone behavior, secrets, and the actual execution log.",
    "Run the facts, mobile, secret, and execution-log checks. Keyboard evidence is also useful.",
  ],
  evolve: [
    "Can another person reproduce the exact gap, know the expected result, and protect what already works?",
    "A repair request needs observed, reproduce, expected, and preserve—not simply ‘fix it.’",
    "Name the unsupported claim and 390px clipping, give the path, define the pass state, preserve verified behavior, then retest both failures.",
  ],
  transfer: [
    "The artifact changed, but the evidence discipline has not. What defines truth outside the AI response?",
    "Preserve the original, inspect the one changed formula, and calculate from approved inputs.",
    "Use receipts as truth, independently recalculate, and make a bounded reversible repair.",
  ],
};

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function removeStoredMission() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in privacy modes; the in-memory mission still works.
  }
}

function confidenceLabel(value: Confidence): string {
  if (value === 0.4) return "Unsure";
  if (value === 0.7) return "Fairly sure";
  return "Very sure";
}

function feedbackFor(progress: MissionProgress, scene: SceneId, passed: boolean): Feedback {
  if (scene === "arrival") {
    if (progress.arrivalChoice === "inspect") {
      return {
        scene,
        passed: true,
        goal: "Decide whether the artifact is ready.",
        evidence: "Inspection finds an unsourced guarantee, a clipped contact action with no email destination, and an empty execution record. Keyboard order and saved-file safety currently pass.",
        principle: "Polish changes how work feels; evidence changes what you know.",
        nextMove: "Turn the vague request into a promise you can actually test.",
      };
    }
    return {
      scene,
      passed: true,
      goal: "Decide whether the artifact is ready.",
      evidence:
        progress.arrivalChoice === "ship"
          ? "The main action does nothing, and one public promise has no source."
          : "The AI summary repeats that everything works, but still provides no independent check.",
      principle: "The creator's assurance is not evidence that its output works.",
      nextMove: "Return to the recoverable baseline and define what the project must prove before changing it again.",
    };
  }

  const success: Record<Exclude<SceneId, "arrival" | "replay">, Feedback> = {
    target: {
      scene,
      passed,
      goal: "Turn a vague request into a testable project promise.",
      evidence: passed
        ? "The brief now names a phone-first person, a meaningful outcome, observable checks, explicit non-goals, and no unnecessary runtime AI."
        : "At least one selected statement is still broad, subjective, or dependent on the AI judging itself.",
      principle: "Start with the smallest user outcome you can prove—not a pile of features.",
      nextMove: passed
        ? "Save this agreement where AI and future collaborators can recover it."
        : "Revise the weak field, then test the brief again.",
    },
    record: {
      scene,
      passed,
      goal: "Create durable project memory and an honestly labelled starting point.",
      evidence: passed
        ? "Trusted facts, setup context, current files, .gitignore, and an unverified baseline now share one recoverable history."
        : progress.repository.includes("api-key")
          ? "The real API key would be copied into project history. Deleting the visible file later would not reliably erase that history."
          : "The repository is missing durable context or includes noise that should be summarized instead.",
      principle: "A repository is shared memory and undo history—not a secret manager or chat archive.",
      nextMove: passed
        ? "Assemble only the context, work mode, and permission needed for one AI handoff."
        : "Remove unsafe/noisy items and restore the missing project artifacts.",
    },
    handoff: {
      scene,
      passed,
      goal: "Give the AI enough trusted context and a clear authority boundary.",
      evidence: passed
        ? "The Context Lens shows Plan mode, goal, sources, current state, checks, permission boundary, and relevant phone reference."
        : progress.context.includes("secret")
          ? "A production credential crossed into the handoff. That grants authority; it does not explain the task."
          : "The Context Lens still contains a blind spot or unrelated private material.",
      principle: "Context is the smallest trusted packet needed for one decision—not everything you can upload.",
      nextMove: passed
        ? "Review the proposed change footprint before granting permission to edit."
        : "Remove dangerous/noisy material and supply every essential source and boundary.",
    },
    radius: {
      scene,
      passed,
      goal: "Reduce the AI plan to one complete, reversible slice.",
      evidence: passed
        ? "Every plan item is now kept, deferred, or held for a stakeholder answer; only the facts, contact path, and checks are ready to build."
        : "At least one plan item still has the wrong disposition or an ambiguous request was treated as implementation-ready.",
      principle: "Cut scope by removing systems, not by leaving many systems half-built.",
      nextMove: passed
        ? "Inspect the proposal and make every completion claim produce evidence."
        : "Keep the three brief-backed items, defer extra systems, and hold the ambiguous joining flow for an answer.",
    },
    check: {
      scene,
      passed,
      goal: "Connect each requirement to evidence that actually exists.",
      evidence: passed
        ? "The evidence ledger exposes an invented guarantee, a clipped/dead contact action, and an empty execution record while recording the two checks that currently pass."
        : progress.checksRun.includes("ask-again")
          ? "Asking the same AI for confidence added a claim, not evidence."
          : "One or more critical requirements still have no independent check.",
      principle: "‘Done’ is a claim. The artifact, trusted source, and reproducible checks decide whether it is true.",
      nextMove: passed
        ? "Describe the exact failures, diagnose before editing, request the smallest repair, and protect what already passed."
        : "Run the facts, phone, secret, and actual-log checks; remove self-reassurance from the ledger.",
    },
    evolve: {
      scene,
      passed,
      goal: "Repair from reproducible evidence and rerun the failed checks.",
      evidence: passed
        ? "The approved wording is present; the action fits at 390px, opens the correct email, still works by keyboard, and the final saved state is secret-safe."
        : "The repair is still vague, non-reproducible, too wide, or missing one of the five affected post-repair checks.",
      principle: "A fix is not finished until the original failure is reproduced, repaired, and retested.",
      nextMove: passed
        ? "Create release evidence for this exact verified state before approving any public action."
        : "Complete the repair brief, diagnose first, apply only that patch, then rerun facts, width, destination, keyboard, and final-file checks.",
    },
    ship: {
      scene,
      passed,
      goal: "Release an exact verified version that another person can understand and recover.",
      evidence: passed
        ? "Facts, contact path, keyboard, final files, documentation, build, preview, approval, live smoke test, and recovery all point to the same version."
        : "At least one release claim is missing generated evidence, explicit approval, or a post-publish result.",
      principle: "Deployment is a verification boundary, not merely clicking Publish.",
      nextMove: passed
        ? "Apply the method to a different project without the TRACE labels."
        : "Generate the missing release record and verify the exact version being released.",
    },
    transfer: {
      scene,
      passed,
      goal: "Transfer the evidence method from a website to a spreadsheet.",
      evidence: passed
        ? "You used receipts as truth, inspected and recalculated the formula, and kept the repair bounded and reversible."
        : "One decision still trusts the AI or newest artifact instead of the approved inputs and independent calculation.",
      principle: "The interface changes; the discipline of source, boundary, evidence, and repair does not.",
      nextMove: passed
        ? "Replay the causal trail and take the reusable field manual."
        : "Identify the trusted source, independent proof, and smallest reversible next move.",
    },
  };

  return success[scene as Exclude<SceneId, "arrival" | "replay">];
}

function ConfidencePicker({
  value,
  onChange,
}: {
  value?: Confidence;
  onChange: (value: Confidence) => void;
}) {
  return (
    <fieldset className="confidence">
      <legend>Before seeing the consequence, how sure are you?</legend>
      <div>
        {([0.4, 0.7, 0.9] as const).map((option) => (
          <button
            type="button"
            key={option}
            className={value === option ? "is-selected" : ""}
            onClick={() => onChange(option)}
            aria-pressed={value === option}
          >
            {confidenceLabel(option)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function SceneHeading({
  eyebrow,
  title,
  copy,
  headingRef,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  headingRef?: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <header className="scene-heading">
      <p>{eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1}>{title}</h1>
      <span>{copy}</span>
    </header>
  );
}

function RepairCafePreview({
  repaired = false,
  phone = false,
  onAction,
}: {
  repaired?: boolean;
  phone?: boolean;
  onAction?: () => void;
}) {
  return (
    <div className={`device ${phone ? "device--phone" : "device--desktop"}`}>
      <div className="device__bar">
        <span><i /><i /><i /></span>
        <small>repair-cafe.preview</small>
        <b>{repaired ? "verified repair" : "AI proposal"}</b>
      </div>
      <div className="repair-page">
        <div className="repair-page__nav">
          <b>RE:PAIR</b>
          <span>Saturday · West Hall</span>
        </div>
        <div className="repair-page__hero">
          <p>Neighborhood Repair Café</p>
          <h3>Bring it broken.<br />Leave with a plan.</h3>
          <span>Small appliances, clothing, and bicycles · 10:00–14:00</span>
          {!repaired && <mark>Walk-ins are guaranteed a repair</mark>}
          {repaired && <mark className="verified-copy">Repairs depend on volunteer availability</mark>}
          {repaired ? (
            <a
              href="mailto:hello@repair-cafe.example"
              className="mock-cta"
              onClick={(event) => {
                event.preventDefault();
                onAction?.();
              }}
            >
              Ask about a repair <span>↗</span>
            </a>
          ) : (
            <button type="button" className="mock-cta" onClick={onAction}>
              Ask about a repair <span>↗</span>
            </button>
          )}
        </div>
        <div className="repair-page__footer">
          <span>July 25</span>
          <span>West Hall Community Room</span>
        </div>
      </div>
    </div>
  );
}

function ProgressRuler({ scene }: { scene: SceneId }) {
  const current = sceneOrder.indexOf(scene);
  return (
    <div className="ruler" role="group" aria-label={`Mission progress: step ${current + 1} of ${sceneOrder.length}, ${sceneLabels[scene]}`}>
      <span className="ruler__current"><b>{String(current + 1).padStart(2, "0")} / {sceneOrder.length}</b>{sceneLabels[scene]}</span>
      <ol>
        {sceneOrder.map((item, index) => (
          <li
            key={item}
            className={`${index <= current ? "is-reached" : ""} ${item === scene ? "is-current" : ""}`}
            aria-current={item === scene ? "step" : undefined}
            aria-label={`Step ${index + 1} of ${sceneOrder.length}: ${sceneLabels[item]}${index < current ? ", completed" : item === scene ? ", current" : ""}`}
            title={sceneLabels[item]}
          >
            <i aria-hidden="true" />
            <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MobileInstrument({ progress }: { progress: MissionProgress }) {
  const releaseRows = releaseEvidenceSnapshot(progress);
  const correctChecks = checks.filter((check) => check.correct).length;
  const scopeCounts = scopeDispositions.map((disposition) => ({
    label: disposition.label,
    count: planOptions.filter((item) => progress.scopeDecisions[item.id] === disposition.id).length,
  }));
  const transferAnswers = transferQuestions.filter((question) => progress.transfer[question.id]).length;

  const state: Record<SceneId, { instrument: string; value: string; detail: string }> = {
    arrival: {
      instrument: "Project preview",
      value: "AI claim · unverified",
      detail: progress.arrivalChoice ? "Decision selected; confidence still matters." : "No evidence inspected yet.",
    },
    target: {
      instrument: "Build map",
      value: `${Object.keys(progress.target).length} / ${targetFields.length} decisions`,
      detail: "Runtime AI is not required for this visitor outcome.",
    },
    record: {
      instrument: "Repository",
      value: `${progress.repository.length} items selected`,
      detail: progress.repository.includes("checkpoint") ? "Baseline saved · still unverified." : "No recoverable baseline yet.",
    },
    handoff: {
      instrument: "Context Lens",
      value: `${workModes.find((mode) => mode.id === progress.workMode)?.label} · ${progress.context.length} inputs`,
      detail: progress.context.includes("secret") ? "A credential is exposed." : "Authority remains visible.",
    },
    radius: {
      instrument: "Change footprint",
      value: scopeCounts.map((item) => `${item.count} ${item.label.toLowerCase()}`).join(" · "),
      detail: "The full footprint remains below this decision.",
    },
    check: {
      instrument: "Evidence ledger",
      value: `${progress.checksRun.length} / ${correctChecks} useful checks run`,
      detail: progress.activeEvidenceCheck
        ? `${checks.find((check) => check.id === progress.activeEvidenceCheck)?.result ?? "unproven"} · inspect the exact evidence below`
        : "AI assurance is not an independent check.",
    },
    evolve: {
      instrument: "Repair record",
      value: progress.repaired ? `${progress.postRepairReruns.length} / ${postRepairReruns.length} reruns` : progress.diagnosed ? "Diagnosed · awaiting approval" : "No diagnosis recorded",
      detail: "All passing reruns must point to the same repaired version.",
    },
    ship: {
      instrument: "Release ledger",
      value: `${releaseRows.filter((row) => row.status === "pass").length} / ${releaseRows.length} claims supported`,
      detail: progress.published ? "Published in simulation; live proof still matters." : "Publishing remains a human-approved action.",
    },
    transfer: {
      instrument: "Transfer check",
      value: `${transferAnswers} / ${transferQuestions.length} decisions`,
      detail: transferExplanationIsMeaningful(progress.transferExplanation) ? "Reasoning is ready to review." : "Name what is proved and what remains uncertain.",
    },
    replay: {
      instrument: "Revision Trace",
      value: "8 causal layers recorded",
      detail: "Decision → consequence → evidence.",
    },
  };
  const current = state[progress.scene];
  const currentStep = sceneOrder.indexOf(progress.scene) + 1;
  const progressLabel = `Step ${currentStep} of ${sceneOrder.length}: ${sceneLabels[progress.scene]}`;

  return (
    <aside className="mobile-instrument" aria-label={`Mission progress: ${progressLabel}. ${current.instrument}: ${current.value}`}>
      <span aria-hidden="true"><i /></span>
      <div><small>{String(currentStep).padStart(2, "0")} / {sceneOrder.length} · {sceneLabels[progress.scene]}</small><b>{current.instrument} · {current.value}</b></div>
      <p>{current.detail}</p>
    </aside>
  );
}

function FieldNoteCard({ scene }: { scene: SceneId }) {
  const note = fieldNotes.find((item) => item.scene === scene);
  if (!note) return null;

  return (
    <section className="field-note">
      <div className="field-note__label"><span>Filed</span> Working note earned</div>
      <h3>{note.title}</h3>
      <p><b>Use it when:</b> {note.whenToUse}</p>
      <pre>{note.template}</pre>
    </section>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main id="studio-intro" className="intro" data-testid="intro">
      <div className="intro__measure" aria-hidden="true">P&nbsp;&nbsp;P&nbsp;&nbsp;P</div>
      <div className="intro__copy">
        <p className="overline">Pentimento · See the decisions beneath the finished surface</p>
        <h1>The first draft is easy.<br /><em>Knowing what to trust is the craft.</em></h1>
        <p className="intro__lede">
          Take one polished-but-broken project from idea to a version you can explain, test, repair, and safely share. No coding experience needed.
        </p>
        <button type="button" className="primary-button primary-button--large" onClick={onStart} data-testid="start-mission">
          Begin the 20-minute studio <span>→</span>
        </button>
        <div className="intro__meta">
          <span><b>01</b> No experience assumed</span>
          <span><b>02</b> One 18–20 minute mission</span>
          <span><b>03</b> Every decision leaves a visible trace</span>
        </div>
      </div>
      <aside className="intro__manifesto">
        <p>Three practices you will prove</p>
        <ol>
          <li><span>Decide the outcome</span> before choosing features.</li>
          <li><span>Give AI only</span> the context and permission this step needs.</li>
          <li><span>Call work finished</span> only when evidence matches the claim.</li>
        </ol>
        <small>Studio case 01 · The page that looks finished</small>
      </aside>
    </main>
  );
}

function RepositoryRoom({ selected }: { selected: string[] }) {
  return (
    <section className="repo-room" aria-label="Simulated GitHub repository">
      <header>
        <span className="repo-icon">◇</span>
        <div><small>github.com / your-name</small><strong>repair-cafe</strong></div>
        <b>{selected.includes("checkpoint") ? "baseline saved · unverified" : "no restore point"}</b>
      </header>
      <div className="repo-room__body">
        <div className="file-tree">
          {repositoryOptions.map((item) => {
            const active = selected.includes(item.id);
            if (!active) return null;
            return (
              <div key={item.id} className={item.dangerous ? "is-danger" : ""}>
                <span>{item.id === "checkpoint" ? "●" : item.id === "api-key" ? "!" : "▱"}</span>
                <b>{item.title}</b>
                <small>{item.id === "checkpoint" ? "recoverable · unverified" : item.dangerous ? "exposed" : "saved by Git"}</small>
              </div>
            );
          })}
          {!selected.length && <p>Select artifacts to assemble the project memory.</p>}
        </div>
        <footer>
          <span><i className={selected.includes("checkpoint") ? "is-on" : ""} /> starting state saved</span>
          <span><i className={selected.includes("checkpoint") ? "is-on" : ""} /> checks still pending</span>
          <span><i /> known good after verification</span>
        </footer>
      </div>
    </section>
  );
}

function ContextXray({ selected, workMode }: { selected: string[]; workMode: WorkModeId }) {
  const factsVisible = ["goal", "trusted-facts", "current-files", "acceptance", "authority"].every((id) =>
    selected.includes(id),
  );
  return (
    <section className="xray">
      <header>
        <div><span className="registration-mark" aria-hidden="true" /> Context Lens</div>
        <small>{workModes.find((mode) => mode.id === workMode)?.label} mode · {selected.length} context items</small>
      </header>
      <div className="xray__beam">
        <div className="xray__source">
          {contextOptions.map((item) => (
            <span key={item.id} className={selected.includes(item.id) ? "is-visible" : ""}>
              {item.title}
            </span>
          ))}
        </div>
        <div className="xray__lens">AI<br />VIEW</div>
        <div className="xray__result">
          <p className={workMode === "plan" ? "is-known" : "is-danger"}><b>Mode</b>{workMode === "plan" ? "Plan · no edits" : `${workModes.find((mode) => mode.id === workMode)?.label} · can overreach here`}</p>
          <p className={factsVisible ? "is-known" : ""}><b>Goal</b>{factsVisible ? "Known" : "Blind spot"}</p>
          <p className={selected.includes("trusted-facts") ? "is-known" : ""}><b>Facts</b>{selected.includes("trusted-facts") ? "Sourced" : "May be invented"}</p>
          <p className={selected.includes("authority") ? "is-known" : ""}><b>Authority</b>{selected.includes("authority") ? "Bounded" : "Unbounded"}</p>
          <p className={selected.includes("secret") ? "is-danger" : "is-known"}><b>Secrets</b>{selected.includes("secret") ? "Exposed" : "Withheld"}</p>
        </div>
      </div>
    </section>
  );
}

function ScopeDecisionCard({
  choice,
  value,
  reviewed,
  onChange,
  revealFeedback,
}: {
  choice: (typeof planOptions)[number];
  value: ScopeDisposition;
  reviewed: boolean;
  onChange: (value: ScopeDisposition) => void;
  revealFeedback: boolean;
}) {
  return (
    <fieldset className={`scope-card ${reviewed ? "is-reviewed" : "is-unreviewed"}`}>
      <legend>{choice.title}</legend>
      <p className="scope-card__review-state">{reviewed ? "Reviewed" : "Needs your review"}</p>
      <div className="scope-card__choices">
        {scopeDispositions.map((disposition) => (
          <label key={disposition.id} className={value === disposition.id ? "is-selected" : ""}>
            <input
              type="radio"
              name={`scope-${choice.id}`}
              value={disposition.id}
              checked={value === disposition.id}
              onChange={() => onChange(disposition.id)}
              onClick={() => onChange(disposition.id)}
            />
            <span>{disposition.label}</span>
          </label>
        ))}
      </div>
      {revealFeedback && (
        <div className={`scope-card__feedback ${value === choice.recommendedDisposition ? "is-correct" : "is-revision"}`}>
          <b>{value === choice.recommendedDisposition ? "Disposition supported" : "Review this disposition"}</b>
          <p>{choice.detail}</p>
          <small><strong>Obligations:</strong> {choice.obligations.join(" · ")}</small>
          {choice.questionToResolve && <small><strong>Question:</strong> {choice.questionToResolve}</small>}
          <small><strong>Evidence if built:</strong> {choice.evidenceRequired}</small>
        </div>
      )}
    </fieldset>
  );
}

function ChangeFootprint({ decisions }: { decisions: MissionProgress["scopeDecisions"] }) {
  const kept = planOptions.filter((item) => decisions[item.id] === "keep");
  const deferred = planOptions.filter((item) => decisions[item.id] === "defer");
  const questions = planOptions.filter((item) => decisions[item.id] === "needs-answer");
  const obligations = kept.reduce((sum, item) => sum + item.obligations.length, 0);
  const size = Math.min(94, 38 + obligations * 2.5);

  return (
    <section className="blast">
      <header>
        <span>Change footprint</span>
        <b>{kept.length} keep · {deferred.length} defer · {questions.length} ask</b>
      </header>
      <div className="blast__map" style={{ "--blast-size": `${size}%` } as React.CSSProperties}>
        <i className="blast__outer" />
        <i className="blast__middle" />
        <div className="blast__core"><span>Brief</span><b>1 useful path</b></div>
        {planOptions.map((item, index) => (
          <span
            key={item.id}
            className={`blast__node is-${decisions[item.id]}`}
            style={{ "--node-index": index } as React.CSSProperties}
          >
            <b>{scopeDispositions.find((disposition) => disposition.id === decisions[item.id])?.label}</b>{item.title}
          </span>
        ))}
      </div>
      <footer>
        <span><i className="key-core" /> serves this outcome</span>
        <span><i className="key-system" /> extra system deferred</span>
        <span><i className="key-question" /> stakeholder answer needed</span>
      </footer>
    </section>
  );
}

function EvidenceWorkbench({ progress }: { progress: MissionProgress }) {
  const [view, setView] = useState<"preview" | "changes" | "requirements">("preview");
  const ran = (id: string) => progress.checksRun.includes(id);
  const activeCheck = checks.find((item) => item.id === progress.activeEvidenceCheck);

  useEffect(() => {
    if (progress.activeEvidenceCheck) setView("requirements");
  }, [progress.activeEvidenceCheck]);

  const requirementRows = [
    { requirement: "Claims match facts.md", check: "Facts comparison", status: ran("facts-check") ? "fail" : "unproven" },
    { requirement: "Contact stays visible at 390px", check: "Phone interaction", status: ran("mobile-check") ? "fail" : "unproven" },
    { requirement: "Contact opens the approved email", check: "Observed destination", status: ran("mobile-check") ? "fail" : "unproven" },
    { requirement: "Visitor path works by keyboard", check: "Recorded focus path", status: ran("keyboard-check") ? "pass" : "unproven" },
    { requirement: "Saved files contain no credential", check: "Diff + history", status: ran("secret-check") ? "pass" : "unproven" },
    { requirement: "Named checks actually ran", check: "Execution record", status: ran("execution-log") ? "fail" : "unproven" },
  ];

  const tabs = [
    {
      id: "preview" as const,
      label: "Preview",
      panel: <RepairCafePreview phone />,
    },
    {
      id: "changes" as const,
      label: "What changed",
      panel: (
          <div className="diff-view">
            <header><span>page.tsx</span><b>+12 −3</b></header>
            <code><i>+</i> Walk-ins are guaranteed a repair</code>
            <code><i>+</i> min-width: 31rem; <mark>/* wider than 390px */</mark></code>
            <code><i>+</i> action: button <mark>/* no destination */</mark></code>
            <code><i>~</i> AI summary: “all five checks passed”</code>
            <footer>No test output attached to this change.</footer>
          </div>
      ),
    },
    {
      id: "requirements" as const,
      label: "Evidence ledger",
      panel: (
          <div className="proof-ledger table-scroll" tabIndex={0}>
            <table>
              <caption className="visually-hidden">Requirements connected to current evidence and results</caption>
              <thead><tr><th scope="col">Requirement</th><th scope="col">Evidence thread</th><th scope="col">Result</th></tr></thead>
              <tbody>{requirementRows.map((row) => (
                <tr key={row.requirement} className={`proof-row proof-row--${row.status}`}>
                  <th scope="row">{row.requirement}</th><td><i aria-hidden="true" /><span>{row.check}</span></td><td><strong>{row.status}</strong></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
      ),
    },
  ];

  return (
    <section className="evidence-workbench">
      {activeCheck && (
        <article className={`evidence-inspection evidence-inspection--${activeCheck.result}`} aria-live="polite">
          <header><span>{activeCheck.evidenceKind.replace("-", " ")}</span><b>{activeCheck.result}</b></header>
          <h3>{activeCheck.title}</h3>
          <p>{activeCheck.detail}</p>
          <dl>
            <div><dt>Evidence location</dt><dd>{activeCheck.evidenceAnchor}</dd></div>
            <div><dt>Supports</dt><dd>{activeCheck.proves}</dd></div>
            <div><dt>Does not establish</dt><dd>{activeCheck.doesNotProve}</dd></div>
          </dl>
        </article>
      )}
      <AccessibleTabs
        label="Inspect the AI proposal"
        tabs={tabs}
        value={view}
        onValueChange={setView}
        className="evidence-workbench__tabs"
        panelClassName="evidence-workbench__view"
      />
    </section>
  );
}

function SpreadsheetTransfer() {
  return (
    <section className="sheet" aria-label="Community event budget spreadsheet">
      <header><span>Community event budget</span><b>AI edited · not verified</b></header>
      <table className="sheet__grid">
        <caption className="visually-hidden">Approved receipts compared with the AI-edited formula result</caption>
        <thead><tr><th scope="col">Item</th><th scope="col">Receipt</th><th scope="col">Formula result</th></tr></thead>
        <tbody>
          <tr><th scope="row">Room hire</th><td>$240.00</td><td>$240.00</td></tr>
          <tr><th scope="row">Materials</th><td>$86.40</td><td>$86.40</td></tr>
          <tr><th scope="row">Refreshments</th><td>$58.75</td><td>$58.75</td></tr>
          <tr className="sheet__total"><th scope="row">Total</th><td>$385.15</td><td className="sheet__changed">$442.90</td></tr>
        </tbody>
      </table>
      <footer>
        <code>=SUM(B2:B4)+57.75</code>
        <span>AI note: “I corrected the formula and verified the total.”</span>
      </footer>
    </section>
  );
}

function FirstProjectGuide() {
  const proofTypes = [
    ["Trusted-source comparison", "Whether project claims match an approved source", "Whether the interface works"],
    ["Before-and-after changes (diff)", "What files, dependencies, configuration, and behavior were changed", "Whether the new behavior succeeds"],
    ["Production build", "Whether the exact code and configuration can produce a deployable artifact", "Whether a visitor can complete the main path"],
    ["Automated tests", "Whether the behaviors encoded in those tests pass", "Requirements the tests never encoded"],
    ["Screenshot", "What one visual state looked like at one size", "Keyboard use, link destinations, data flow, or other screen sizes"],
    ["Representative path", "What a real or simulated user could observe while doing the important task", "Untried paths or environments"],
    ["AI summary", "What the AI intended, believes, or says it ran", "What the project actually does"],
  ] as const;

  return (
    <section className="first-project-guide" aria-labelledby="first-project-title">
      <header>
        <p>Use this tomorrow</p>
        <h3 id="first-project-title">Your first real AI-assisted project</h3>
        <span>Choose a project that is useful enough to matter and safe enough to revise.</span>
      </header>

      <details open>
        <summary>1 · Choose a safe first project</summary>
        <div className="guide-grid">
          <div><b>Good first-project traits</b><ul><li>One specific person and one useful action</li><li>Public or invented information</li><li>A result you can inspect yourself</li><li>Small, reversible changes</li><li>A static page, guide, calculator with test data, or personal workflow</li></ul></div>
          <div><b>Defer until you have support</b><ul><li>Accounts, permissions, or private user data</li><li>Payments, purchases, or financial transfers</li><li>Health, legal, safety, or eligibility decisions</li><li>Messages sent as you or automatic publishing</li><li>Secrets exposed to browser code</li></ul></div>
        </div>
      </details>

      <details>
        <summary>2 · Follow the complete project route</summary>
        <ol className="project-route">
          <li><b>Write the four-line brief.</b><span>Name the person, outcome, observable checks, and non-goals.</span></li>
          <li><b>Decide whether the finished product needs AI.</b><span>If fixed logic or verified content solves the problem, do not add a model, key, cost, or failure mode.</span></li>
          <li><b>Create one project folder and Git repository.</b><span>Choose public or private visibility deliberately; a public repository makes every committed file public.</span></li>
          <li><b>Add durable context.</b><span>Write README.md, trusted source files, asset licences/credits, and .gitignore before any local secret-bearing file.</span></li>
          <li><b>Run the starting project.</b><span>Record the command and result. Inspect what Git will save, then create an honestly labelled unverified baseline.</span></li>
          <li><b>Ask AI to plan first.</b><span>Give the outcome, trusted files, one change, boundaries, what it may do, when it must ask, and proof of done.</span></li>
          <li><b>Review the change footprint.</b><span>Keep work tied to the outcome, defer unnecessary systems, and answer ambiguity before editing.</span></li>
          <li><b>Approve one implementable slice.</b><span>Let AI change only the agreed files and require a report of assumptions, changes, checks actually run, and remaining uncertainty.</span></li>
          <li><b>Inspect before-and-after changes.</b><span>Review additions, deletions, dependencies, configuration, network use, secret exposure, and unrelated edits.</span></li>
          <li><b>Run checks that match the claim.</b><span>Compare trusted facts, exercise the main path, test representative sizes and keyboard use, build, and scan the final saved state.</span></li>
          <li><b>Repair from evidence.</b><span>Reproduce the gap, diagnose before editing, apply the smallest patch, and rerun failed plus nearby regression checks.</span></li>
          <li><b>Create a verified commit.</b><span>Name the exact state only after current evidence passes. Keep limitations in README.</span></li>
          <li><b>Verify a hosted preview.</b><span>Publishing uses the network and affects access, so AI asks first. Smoke-test the real preview URL.</span></li>
          <li><b>Approve and check the live release.</b><span>Record the exact commit, public URL, time, access mode, post-release result, and recovery procedure.</span></li>
        </ol>
      </details>

      <details>
        <summary>3 · Choose the AI work mode explicitly</summary>
        <div className="mode-table" role="list">
          {workModes.map((mode) => (
            <article key={mode.id} role="listitem">
              <div><h4>{mode.label}</h4><span>{mode.mayChangeFiles ? "May edit after approval" : "No file changes"}</span></div>
              <p>{mode.plainLanguage}</p>
              <small><b>Use when:</b> {mode.usefulWhen}</small>
              <small><b>Ask it to return:</b> {mode.expectedReturn}</small>
            </article>
          ))}
        </div>
      </details>

      <details>
        <summary>4 · Know what each check can prove</summary>
        <div className="table-scroll" tabIndex={0}>
          <table className="proof-types">
            <caption className="visually-hidden">Evidence types, what they support, and what they cannot establish</caption>
            <thead><tr><th scope="col">Evidence</th><th scope="col">Supports</th><th scope="col">Does not establish</th></tr></thead>
            <tbody>{proofTypes.map(([name, proves, doesNot]) => <tr key={name}><th scope="row">{name}</th><td>{proves}</td><td>{doesNot}</td></tr>)}</tbody>
          </table>
        </div>
      </details>

      <details>
        <summary>5 · Translate the project vocabulary</summary>
        <dl className="glossary">
          {projectTerms.map((item) => (
            <div key={item.id}><dt>{item.term}</dt><dd>{item.plainLanguage}<small>Useful when: {item.usefulWhen}</small></dd></div>
          ))}
        </dl>
      </details>
    </section>
  );
}

export function Pentimento() {
  const [progress, setProgress] = useState<MissionProgress>(initialProgress);
  const [sessionId, setSessionId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [previewNotice, setPreviewNotice] = useState("");
  const [debrief, setDebrief] = useState<DebriefResponse | null>(null);
  const [debriefBusy, setDebriefBusy] = useState(false);
  const [debriefError, setDebriefError] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const appRootRef = useRef<HTMLDivElement>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const manualCloseRef = useRef<HTMLButtonElement>(null);
  const restartCancelRef = useRef<HTMLButtonElement>(null);
  const sceneHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousSceneRef = useRef<SceneId>(progress.scene);
  const previousStartedRef = useRef(progress.started);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
        ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const record = parsed as { sessionId?: unknown; progress?: unknown };
          if (typeof record.sessionId === "string") setSessionId(record.sessionId);
          const restored = parseMissionProgress(record.progress);
          if (restored) setProgress(restored);
        }
      }
      try {
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {
        // A successful in-memory restore should not depend on storage cleanup.
      }
    } catch {
      removeStoredMission();
    }
    setSessionId((current) => current || crypto.randomUUID());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !sessionId) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId, progress }));
    } catch {
      // The mission remains usable when storage is unavailable or full.
    }
  }, [hydrated, progress, sessionId]);

  useEffect(() => {
    const enteredMission = !previousStartedRef.current && progress.started;
    const changedScene = previousSceneRef.current !== progress.scene;
    previousStartedRef.current = progress.started;
    previousSceneRef.current = progress.scene;
    if (!hydrated || (!enteredMission && !changedScene)) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.requestAnimationFrame(() => sceneHeadingRef.current?.focus({ preventScroll: true }));
  }, [hydrated, progress.scene, progress.started]);

  const currentScene = progress.scene;
  const sceneNumber = sceneOrder.indexOf(currentScene) + 1;
  const unlockedNotes = fieldNotes.filter((note) => progress.fieldNotes.includes(note.id));
  const releaseRows = releaseEvidenceSnapshot(progress);
  const prePublishReady = releaseRows
    .filter((row) => row.id !== "publish-approval" && row.id !== "production-smoke")
    .every((row) => row.status === "pass");

  function patchProgress(patch: Partial<MissionProgress>) {
    setProgress((current) => ({ ...current, ...patch }));
  }

  function chooseTarget(field: keyof MissionProgress["target"], id: string) {
    setProgress((current) => ({ ...current, target: { ...current.target, [field]: id } }));
  }

  function chooseRepair(field: keyof MissionProgress["repair"], id: string) {
    setProgress((current) => ({
      ...current,
      repair: { ...current.repair, [field]: id },
      diagnosed: false,
      repaired: false,
      retested: [],
      postRepairReruns: [],
      releaseEvidence: {},
      publishApproved: false,
      published: false,
      productionChecked: false,
    }));
  }

  function chooseScopeDisposition(choiceId: string, disposition: ScopeDisposition) {
    setProgress((current) => {
      const scopeDecisions = { ...current.scopeDecisions, [choiceId]: disposition };
      return {
        ...current,
        scopeDecisions,
        scopeReviewed: current.scopeReviewed.includes(choiceId)
          ? current.scopeReviewed
          : [...current.scopeReviewed, choiceId],
        plan: planOptions
          .filter((choice) => scopeDecisions[choice.id] === "keep")
          .map((choice) => choice.id),
      };
    });
  }

  function chooseTransfer(field: keyof MissionProgress["transfer"], id: string) {
    setProgress((current) => ({ ...current, transfer: { ...current.transfer, [field]: id } }));
  }

  function submitScene(scene: SceneId) {
    const attempted: MissionProgress = {
      ...progress,
      attempts: { ...progress.attempts, [scene]: (progress.attempts[scene] ?? 0) + 1 },
    };
    const passed = scene === "arrival" ? Boolean(attempted.arrivalChoice && attempted.confidence.arrival) : canCompleteScene(attempted, scene);
    setProgress(attempted);
    setFeedback(feedbackFor(attempted, scene, passed));
  }

  function continueAfterFeedback() {
    if (!feedback) return;
    if (!feedback.passed) {
      setFeedback(null);
      return;
    }
    const note = fieldNotes.find((item) => item.scene === feedback.scene);
    setProgress((current) => ({
      ...current,
      scene: nextScene(feedback.scene),
      fieldNotes: note && !current.fieldNotes.includes(note.id)
        ? [...current.fieldNotes, note.id]
        : current.fieldNotes,
    }));
    setFeedback(null);
    setPreviewNotice("");
  }

  function requestHint(scene: SceneId) {
    setProgress((current) => ({
      ...current,
      hints: { ...current.hints, [scene]: Math.min(3, (current.hints[scene] ?? 0) + 1) },
    }));
  }

  function diagnoseRepair() {
    if (!repairIsSpecific(progress)) {
      const attempted = {
        ...progress,
        attempts: { ...progress.attempts, evolve: (progress.attempts.evolve ?? 0) + 1 },
      };
      setProgress(attempted);
      setFeedback(feedbackFor(attempted, "evolve", false));
      return;
    }
    patchProgress({ diagnosed: true, repaired: false, retested: [], postRepairReruns: [] });
  }

  function applyRepair() {
    if (!progress.diagnosed || !repairIsSpecific(progress)) {
      diagnoseRepair();
      return;
    }
    patchProgress({ repaired: true, retested: [], postRepairReruns: [], releaseEvidence: {} });
  }

  function runPostRepairCheck(id: string) {
    const definition = postRepairReruns.find((item) => item.id === id);
    if (!definition) return;
    setProgress((current) => ({
      ...current,
      retested: current.retested.includes(id) ? current.retested : [...current.retested, id],
      postRepairReruns: [
        ...current.postRepairReruns.filter((record) => record.id !== id),
        {
          id,
          passed: true,
          version: RELEASE_VERSION,
          evidence: definition.passingEvidence,
        },
      ],
    }));
  }

  function recordReleaseVersion() {
    setProgress((current) => ({
      ...current,
      releaseEvidence: {
        ...current.releaseEvidence,
        releaseVersion: {
          commit: RELEASE_VERSION,
          recoveryVersion: "no prior live release · withdraw to holding page",
          recoveryProcedure: `Withdraw public access, preserve ${RELEASE_VERSION} as the failed evidence anchor, repair in a new commit, and publish again only after the new preview passes.`,
        },
      },
    }));
  }

  function reviewReadme() {
    setProgress((current) => ({
      ...current,
      releaseEvidence: {
        ...current.releaseEvidence,
        readme: {
          version: RELEASE_VERSION,
          reviewedAt: new Date().toISOString(),
          limitationsReviewed: true,
        },
      },
    }));
  }

  function runReleaseBuild() {
    setProgress((current) => ({
      ...current,
      releaseEvidence: {
        ...current.releaseEvidence,
        build: {
          version: RELEASE_VERSION,
          command: "npm run build",
          exitCode: 0,
          recordedAt: new Date().toISOString(),
        },
      },
    }));
  }

  function runPreviewSmoke() {
    setProgress((current) => ({
      ...current,
      releaseEvidence: {
        ...current.releaseEvidence,
        preview: {
          version: RELEASE_VERSION,
          url: "https://preview.repair-cafe.example",
          checkedAt: new Date().toISOString(),
          factsPassed: true,
          corePathPassed: true,
        },
      },
    }));
  }

  function approvePublishing() {
    if (!prePublishReady) return;
    patchProgress({ publishApproved: true });
  }

  function publishSimulatedRelease() {
    if (!progress.publishApproved || !prePublishReady) return;
    patchProgress({ published: true });
  }

  function runProductionSmoke() {
    if (!progress.published) return;
    setProgress((current) => ({
      ...current,
      productionChecked: true,
      releaseEvidence: {
        ...current.releaseEvidence,
        production: {
          version: RELEASE_VERSION,
          url: "https://repair-cafe.example",
          checkedAt: new Date().toISOString(),
          factsPassed: true,
          corePathPassed: true,
        },
      },
    }));
  }

  async function createDebrief() {
    if (!sessionId || debriefBusy) return;
    setDebriefBusy(true);
    setDebriefError("");
    try {
      const response = await fetch("/api/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, progress }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message = typeof data === "object" && data && "error" in data
          ? String(data.error)
          : "The debrief could not be created.";
        throw new Error(message);
      }
      const parsed = DebriefResponseSchema.safeParse(data);
      if (!parsed.success) throw new Error("The debrief returned an unexpected format.");
      setDebrief(parsed.data);
    } catch (error) {
      setDebriefError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setDebriefBusy(false);
    }
  }

  function resetMission() {
    removeStoredMission();
    setProgress({
      ...initialProgress,
      confidence: {},
      target: {},
      repository: [],
      context: [],
      plan: [...initialProgress.plan],
      scopeDecisions: { ...initialProgress.scopeDecisions },
      scopeReviewed: [],
      checksRun: [],
      repair: {},
      retested: [],
      postRepairReruns: [],
      shipGate: [],
      releaseEvidence: {},
      transfer: {},
      attempts: {},
      hints: {},
      fieldNotes: [],
    });
    setSessionId(crypto.randomUUID());
    setFeedback(null);
    setDebrief(null);
    setDebriefError("");
    setManualOpen(false);
    setRestartOpen(false);
  }

  async function copyNote(id: string, template: string) {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(template);
      setCopied(id);
      setCopyStatus("Template copied to clipboard.");
      window.setTimeout(() => {
        setCopied("");
        setCopyStatus("");
      }, 1800);
    } catch {
      setCopied("");
      setCopyStatus("Copy failed. Select the template text and copy it manually.");
    }
  }

  const activeHint = hints[currentScene]?.[(progress.hints[currentScene] ?? 0) - 1];

  if (!hydrated) return <div className="loading-screen">Opening the field studio…</div>;

  if (!progress.started) {
    return (
      <div className="app-shell" ref={appRootRef}>
        <a className="skip-link" href="#studio-intro">Skip to studio introduction</a>
        <header className="site-header">
          <a className="wordmark" href="/" aria-label="Pentimento home"><span aria-hidden="true">P</span><b className="wordmark__name">Pentimento</b></a>
          <div><span>Education track</span><b>Build Week 2026</b></div>
        </header>
        <Intro onStart={() => patchProgress({ started: true })} />
      </div>
    );
  }

  return (
    <div className="app-shell" ref={appRootRef}>
      <a className="skip-link" href="#mission-content">Skip to the current decision</a>
      <header className="site-header site-header--mission">
        <div className="wordmark" aria-label="Pentimento">
          <span aria-hidden="true">P</span><b className="wordmark__name">Pentimento</b>
        </div>
        <ProgressRuler scene={currentScene} />
        <div className="header-actions">
          <button type="button" onClick={() => setManualOpen(true)}>Field notes <b>{unlockedNotes.length}</b></button>
          <button type="button" onClick={() => setRestartOpen(true)}>Restart mission</button>
        </div>
      </header>

      <main id="mission-content" className={`mission-canvas mission-canvas--${currentScene}`} data-testid={`scene-${currentScene}`}>
        <div className="mission-label">
          <span>Mission 01</span>
          <b>{mission.title}</b>
          <small>{String(sceneNumber).padStart(2, "0")} / {sceneOrder.length}</small>
        </div>
        <MobileInstrument progress={progress} />

        {currentScene === "arrival" && (
          <section className="scene-grid scene-grid--arrival">
            <div className="scene-copy">
              <SceneHeading
                eyebrow="Cold open · Make the call"
                title="The AI says it’s ready."
                copy="A preview is a temporary version you inspect before it replaces the live page. The organizer plans to share this one in ten minutes. Decide what to trust before seeing the consequence."
                headingRef={sceneHeadingRef}
              />
              <div className="ai-claim"><span>AI</span><p>{mission.aiClaim}</p><b>AI claim · unverified</b></div>
              <RadioCardGroup
                name="arrival-choice"
                groupLabel="Choose the next action"
                choices={arrivalChoices}
                value={progress.arrivalChoice}
                onChange={(arrivalChoice) => patchProgress({ arrivalChoice })}
                revealDetails={(progress.attempts.arrival ?? 0) > 0}
                optionsClassName="choice-stack"
              />
              <ConfidencePicker value={progress.confidence.arrival} onChange={(value) => patchProgress({ confidence: { ...progress.confidence, arrival: value } })} />
              <button type="button" className="primary-button" disabled={!progress.arrivalChoice || !progress.confidence.arrival} onClick={() => submitScene("arrival")} data-testid="commit-arrival">
                See the consequence <span>→</span>
              </button>
            </div>
            <div className="artifact-column">
              <RepairCafePreview onAction={() => setPreviewNotice("Nothing happened. The action has no destination.")} />
              <p className={`preview-notice ${previewNotice ? "is-visible" : ""}`} role="status">{previewNotice || "Try the page's main action."}</p>
            </div>
          </section>
        )}

        {currentScene === "target" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 01 · Target" title="Turn a wish into a promise." copy="The organizer’s note sounds clear until someone must decide what to build—and how to know it works." headingRef={sceneHeadingRef} />
              <blockquote className="stakeholder-note"><span>From the organizer</span>{mission.stakeholder}</blockquote>
              <div className="target-fields">
                {targetFields.map((field) => (
                  <RadioCardGroup
                    key={field.id}
                    name={`target-${field.id}`}
                    legend={<><span>{field.label}</span>{field.prompt}</>}
                    description={<span className="plain-language"><b>In plain language:</b> {field.plainLanguage}</span>}
                    choices={field.options}
                    value={progress.target[field.id]}
                    onChange={(choiceId) => chooseTarget(field.id, choiceId)}
                    revealDetails={(progress.attempts.target ?? 0) > 0}
                  />
                ))}
              </div>
              <aside className="runtime-ai-note">
                <span>One decision beginners often miss</span>
                <h3>Does the finished page need AI?</h3>
                <p><b>No.</b> {mission.runtimeAI.explanation}</p>
              </aside>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.target}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("target")}>Need a hint</button>
                <button type="button" className="primary-button" onClick={() => submitScene("target")} data-testid="commit-target">Test this brief <span>→</span></button>
              </div>
            </div>
            <aside className="build-map">
              <header><span>BUILD MAP</span><b>v0 · draft</b></header>
              {targetFields.map((field) => {
                const selected = field.options.find((item) => item.id === progress.target[field.id]);
                return <div key={field.id}><small>{field.label}</small><p>{selected?.title ?? "Not decided"}</p></div>;
              })}
              <footer>Features come later. First, make the promise testable.</footer>
            </aside>
          </section>
        )}

        {currentScene === "record" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 02 · Record" title="Give the project a memory—and an undo button." copy="A chat remembers a conversation. A repository preserves facts, files, decisions, and named versions." headingRef={sceneHeadingRef} />
              <div className="plain-language-strip">
                <span><b>Git</b> local version history</span>
                <span><b>GitHub</b> shared remote copy</span>
                <span><b>Commit</b> named snapshot</span>
                <span><b>README</b> project purpose and instructions</span>
                <span><b>.gitignore</b> local files Git must not save</span>
                <span><b>.env.example</b> blank settings guide—never a secret</span>
                <span><b>API key</b> private credential for a service</span>
              </div>
              <p className="instruction">Choose what belongs in the first GitHub repository. The saved starting state is recoverable, but it stays unverified until its checks pass.</p>
              <div className="toggle-grid">
                {repositoryOptions.map((choice) => (
                  <ToggleCard
                    key={choice.id}
                    choice={choice}
                    pressed={progress.repository.includes(choice.id)}
                    onPressedChange={() => patchProgress({ repository: toggle(progress.repository, choice.id) })}
                    revealDetails={(progress.attempts.record ?? 0) > 0}
                  />
                ))}
              </div>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.record}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("record")}>Need a hint</button>
                <button type="button" className="primary-button" onClick={() => submitScene("record")} data-testid="commit-record">Review this starting line <span>→</span></button>
              </div>
            </div>
            <RepositoryRoom selected={progress.repository} />
          </section>
        )}

        {currentScene === "handoff" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 03 · Assign" title="Make the AI’s field of view visible." copy="AI cannot know a hidden requirement. It also should not receive every file or permission simply because it can." headingRef={sceneHeadingRef} />
              <p className="instruction">First choose the work mode: what kind of help AI should provide in this turn. Then assemble the smallest trusted packet and permission boundary.</p>
              <RadioCardGroup
                name="work-mode"
                legend="What may AI do in this turn?"
                description={<span className="plain-language"><b>In plain language:</b> A mode separates thinking, editing, diagnosis, review, and verification.</span>}
                choices={workModes.filter((mode) => ["plan", "implement", "review"].includes(mode.id)).map((mode) => ({
                  id: mode.id,
                  title: `${mode.label} · ${mode.mayChangeFiles ? "may change files" : "no file changes"}`,
                  detail: `${mode.plainLanguage} Expected return: ${mode.expectedReturn}`,
                  correct: mode.id === "plan",
                }))}
                value={progress.workMode}
                onChange={(workMode) => patchProgress({ workMode: workMode as WorkModeId })}
                revealDetails={(progress.attempts.handoff ?? 0) > 0}
                className="work-mode-choice"
              />
              <div className="toggle-grid">
                {contextOptions.map((choice) => (
                  <ToggleCard
                    key={choice.id}
                    choice={choice}
                    pressed={progress.context.includes(choice.id)}
                    onPressedChange={() => patchProgress({ context: toggle(progress.context, choice.id) })}
                    revealDetails={(progress.attempts.handoff ?? 0) > 0}
                  />
                ))}
              </div>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.handoff}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("handoff")}>Need a hint</button>
                <button type="button" className="primary-button" onClick={() => submitScene("handoff")} data-testid="commit-handoff">Review the handoff <span>→</span></button>
              </div>
            </div>
            <ContextXray selected={progress.context} workMode={progress.workMode} />
          </section>
        )}

        {currentScene === "radius" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 03 · Assign" title="Review the change footprint before editing." copy="The AI proposed a helpful-looking plan. Every extra system creates permissions, failure states, and future work." headingRef={sceneHeadingRef} />
              <div className="ai-plan-label"><span>AI proposed</span><b>{planOptions.length} plan items</b><small>Every proposal starts as Keep. Review each one: Keep, Defer, or Needs an answer.</small></div>
              <div className="plan-list">
                {planOptions.map((choice) => (
                  <ScopeDecisionCard
                    key={choice.id}
                    choice={choice}
                    value={progress.scopeDecisions[choice.id]}
                    reviewed={progress.scopeReviewed.includes(choice.id)}
                    onChange={(disposition) => chooseScopeDisposition(choice.id, disposition)}
                    revealFeedback={(progress.attempts.radius ?? 0) > 0}
                  />
                ))}
              </div>
              <ConfidencePicker value={progress.confidence.radius} onChange={(value) => patchProgress({ confidence: { ...progress.confidence, radius: value } })} />
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.radius}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("radius")}>Need a hint</button>
                <button type="button" className="primary-button" disabled={!progress.confidence.radius} onClick={() => submitScene("radius")} data-testid="commit-radius">Review the scope decision <span>→</span></button>
              </div>
            </div>
            <ChangeFootprint decisions={progress.scopeDecisions} />
          </section>
        )}

        {currentScene === "check" && (
          <section className="scene-grid scene-grid--wide-artifact">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 04 · Check" title="Put every “done” claim on trial." copy="The proposal looks plausible. Run evidence tools, then inspect what they actually prove." headingRef={sceneHeadingRef} />
              <div className="check-list">
                {checks.map((choice) => {
                  const ran = progress.checksRun.includes(choice.id);
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      className={`${ran ? `is-run is-result-${choice.result}` : "is-untested"} ${choice.id === "ask-again" ? "is-claim" : ""} ${progress.activeEvidenceCheck === choice.id ? "is-active" : ""}`}
                      onClick={() => patchProgress({
                        checksRun: choice.correct && !ran ? [...progress.checksRun, choice.id] : progress.checksRun,
                        activeEvidenceCheck: choice.id,
                      })}
                    >
                      <span>{ran ? choice.result === "pass" ? "✓" : "!" : "▶"}</span>
                      <b>{choice.title}</b>
                      <small>{ran ? `${choice.result.toUpperCase()} · inspect the evidence` : choice.id === "ask-again" ? "AI explanation · not an independent check" : "Run evidence tool"}</small>
                    </button>
                  );
                })}
              </div>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.check}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("check")}>Need a hint</button>
                <button type="button" className="primary-button" onClick={() => submitScene("check")} data-testid="commit-check">Read the evidence ledger <span>→</span></button>
              </div>
            </div>
            <EvidenceWorkbench progress={progress} />
          </section>
        )}

        {currentScene === "evolve" && (
          <section className="scene-grid scene-grid--wide-artifact">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 05 · Evolve" title="Repair the gap—not the whole project." copy="Translate failed evidence into a reproducible correction. Then make every affected check earn green again." headingRef={sceneHeadingRef} />
              <div className="repair-fields">
                {repairFields.map((field) => (
                  <RadioCardGroup
                    key={field.id}
                    name={`repair-${field.id}`}
                    legend={field.label}
                    choices={field.options}
                    value={progress.repair[field.id]}
                    onChange={(choiceId) => chooseRepair(field.id, choiceId)}
                    revealDetails={(progress.attempts.evolve ?? 0) > 0}
                  />
                ))}
              </div>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.evolve}/3</b>{activeHint}</p>}
              {!progress.diagnosed ? (
                <div className="scene-actions">
                  <button type="button" className="text-button" onClick={() => requestHint("evolve")}>Need a hint</button>
                  <button type="button" className="primary-button" onClick={diagnoseRepair}>Diagnose before editing <span>→</span></button>
                </div>
              ) : !progress.repaired ? (
                <div className="diagnosis-panel" role="status">
                  <span>Diagnosis recorded · no files changed</span>
                  <p><b>Likely causes:</b> unsupported copy was generated without checking facts.md; a fixed minimum width exceeds 390px; the visible control has no email destination.</p>
                  <p><b>Smallest proposed patch:</b> replace one sentence, remove the fixed minimum width, and use the approved <code>mailto:</code> destination. No package, form, database, or runtime AI.</p>
                  <button type="button" className="primary-button" onClick={applyRepair}>Approve this bounded patch <span>→</span></button>
                </div>
              ) : (
                <div className="retest-panel">
                  <p><span>Patch applied to {RELEASE_VERSION}</span> A proposal is not a verified fix. Rerun the failed checks and nearby regressions on this exact version.</p>
                  <div>
                    {postRepairReruns.map((check) => {
                      const record = progress.postRepairReruns.find((item) => item.id === check.id);
                      return (
                      <button type="button" key={check.id} className={record?.passed ? "is-pass" : ""} onClick={() => runPostRepairCheck(check.id)}>
                        <span>{record?.passed ? "✓ PASS" : "▶ RUN"}</span>
                        <b>{check.label}</b>
                        <small>{record?.passed ? check.passingEvidence : check.method}</small>
                      </button>
                    );})}
                  </div>
                  <button type="button" className="primary-button" onClick={() => submitScene("evolve")} data-testid="commit-evolve">Review the repair evidence <span>→</span></button>
                </div>
              )}
            </div>
            <div className="repair-artifact">
              <RepairCafePreview
                phone
                repaired={progress.repaired}
                onAction={() => setPreviewNotice("Destination verified: hello@repair-cafe.example")}
              />
              {progress.repaired && (
                <p className={`preview-notice ${previewNotice ? "is-visible" : ""}`} role="status">
                  {previewNotice || "Activate the repaired contact action to inspect its destination."}
                </p>
              )}
              <div className="patch-summary">
                <span className={progress.repaired ? "is-solid" : ""}>AI proposal</span>
                <b>{progress.repaired ? "3 bounded changes" : progress.diagnosed ? "diagnosed · awaiting approval" : "waiting for repair brief"}</b>
                <p>− unsupported guarantee<br />− fixed-width action<br />− inert button<br />+ approved availability wording<br />+ fluid phone layout<br />+ mailto:hello@repair-cafe.example</p>
              </div>
            </div>
          </section>
        )}

        {currentScene === "ship" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="Release boundary · Evidence gate" title="Publish the exact state you proved." copy="A verified preview is not the live version real people use. Name the version, test the real path, and know how to recover." headingRef={sceneHeadingRef} />
              <p className="instruction">Inside this simulation, the ledger reads evidence produced elsewhere. Its rows turn green because a check or concrete release action exists—not because you tick a claim.</p>
              <p className="visually-hidden" role="status">
                {releaseRows.filter((row) => row.status === "pass").length} of {releaseRows.length} release claims currently supported.
              </p>
              <div className="release-ledger table-scroll" tabIndex={0}>
                <table>
                  <caption className="visually-hidden">Release claims, generated status, source, and evidence</caption>
                  <thead><tr><th scope="col">Release claim</th><th scope="col">Source</th><th scope="col">Status</th></tr></thead>
                  <tbody>{releaseRows.map((row) => (
                    <tr key={row.id} className={`release-row release-row--${row.status}`}>
                      <th scope="row"><span>{row.label}</span><small>{row.evidence}</small></th>
                      <td>{row.source.replace("-", " ")}</td>
                      <td><b>{row.status === "pass" ? "✓ PASS" : row.status === "fail" ? "× FAIL" : "○ MISSING"}</b></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <section className="release-actions" aria-labelledby="release-actions-title">
                <h3 id="release-actions-title">Produce the missing release evidence</h3>
                <div>
                  <button type="button" className={progress.releaseEvidence.releaseVersion ? "is-complete" : ""} onClick={recordReleaseVersion}><span>01</span><b>Record exact version + recovery</b><small>{progress.releaseEvidence.releaseVersion ? `Complete · ${RELEASE_VERSION}` : "Required before version-matched release checks"}</small></button>
                  <button type="button" className={progress.releaseEvidence.readme ? "is-complete" : ""} disabled={!progress.releaseEvidence.releaseVersion} onClick={reviewReadme}><span>02</span><b>Review README + limitations</b><small>{progress.releaseEvidence.readme ? "Complete · purpose, setup, checks, runtime choice, and non-goals reviewed" : "Purpose, setup, checks, no runtime AI, and non-goals"}</small></button>
                  <button type="button" className={progress.releaseEvidence.build ? "is-complete" : ""} disabled={!progress.releaseEvidence.releaseVersion} onClick={runReleaseBuild}><span>03</span><b>Run production build</b><small>{progress.releaseEvidence.build ? "Complete · npm run build exited 0" : <><code>npm run build</code> · preserve the exit result</>}</small></button>
                  <button type="button" className={progress.releaseEvidence.preview ? "is-complete" : ""} disabled={!progress.releaseEvidence.releaseVersion} onClick={runPreviewSmoke}><span>04</span><b>Smoke-test hosted preview</b><small>{progress.releaseEvidence.preview ? "Complete · facts and contact path passed in preview" : "Facts + desktop/390px contact path on the real URL"}</small></button>
                  <button type="button" className={progress.publishApproved ? "is-complete" : ""} disabled={!prePublishReady} onClick={approvePublishing}><span>05</span><b>Approve this exact public action</b><small>{progress.publishApproved ? `Complete · ${RELEASE_VERSION} approved for public access` : "Human approval after evidence and limitations are visible"}</small></button>
                  <button type="button" className={progress.published ? "is-complete" : ""} disabled={!progress.publishApproved} onClick={publishSimulatedRelease}><span>06</span><b>Publish the simulated release</b><small>{progress.published ? `Complete · ${RELEASE_VERSION} published in the simulation` : "External action · approval required"}</small></button>
                  <button type="button" className={progress.productionChecked ? "is-complete" : ""} disabled={!progress.published} onClick={runProductionSmoke}><span>07</span><b>Smoke-test the live URL</b><small>{progress.productionChecked ? "Complete · live facts and contact path passed" : "Certificate, exact version, facts, and contact path"}</small></button>
                </div>
              </section>
              <button type="button" className="primary-button" onClick={() => submitScene("ship")} data-testid="commit-ship">Review the release record <span>→</span></button>
            </div>
            <aside className="release-card">
              <div className="release-card__stamp">PREVIEW<br /><b>→</b><br />PRODUCTION</div>
              <p>Release candidate</p>
              <h3>repair-cafe<br /><span>verified-mobile-fix</span></h3>
              <div><small>Commit</small><code>{progress.releaseEvidence.releaseVersion?.commit ?? "not recorded"}</code></div>
              <div><small>Evidence</small><b>{releaseRows.filter((row) => row.status === "pass").length} / {releaseRows.length}</b></div>
              <div><small>Recovery</small><b>{progress.releaseEvidence.releaseVersion?.recoveryVersion ?? "not recorded"}</b></div>
              <footer className={releaseRows.every((row) => row.status === "pass") ? "is-ready" : ""}>
                <i /> {releaseRows.every((row) => row.status === "pass") ? "Exact live version verified" : "Evidence still missing"}
              </footer>
            </aside>
          </section>
        )}

        {currentScene === "transfer" && (
          <section className="scene-grid scene-grid--wide-artifact">
            <div className="scene-copy">
              <SceneHeading eyebrow="No labels · New project" title="The interface changed. Did the method transfer?" copy="An AI edited a community budget spreadsheet and says the total is correct. TRACE is hidden now." headingRef={sceneHeadingRef} />
              <div className="transfer-questions">
                {transferQuestions.map((question) => (
                  <RadioCardGroup
                    key={question.id}
                    name={`transfer-${question.id}`}
                    legend={question.label}
                    choices={question.options}
                    value={progress.transfer[question.id]}
                    onChange={(choiceId) => chooseTransfer(question.id, choiceId)}
                    revealDetails={(progress.attempts.transfer ?? 0) > 0}
                  />
                ))}
              </div>
              <div className="transfer-explanation">
                <label htmlFor="transfer-explanation">What would you tell the budget owner is proven—and what is still uncertain?</label>
                <p>Use the receipts, formula, independent calculation, and limits of this check. Seven useful words is the minimum; specificity matters more than length.</p>
                <textarea
                  id="transfer-explanation"
                  value={progress.transferExplanation}
                  onChange={(event) => patchProgress({ transferExplanation: event.target.value })}
                  maxLength={1000}
                  placeholder="The approved receipts prove… This check does not yet prove…"
                />
                <small className={transferExplanationIsMeaningful(progress.transferExplanation) ? "is-ready" : ""}>
                  {progress.transferExplanation.length}/1000 · {transferExplanationIsMeaningful(progress.transferExplanation) ? "enough reasoning to review" : "include what is proven and what remains uncertain"}
                </small>
              </div>
              <ConfidencePicker value={progress.confidence.transfer} onChange={(value) => patchProgress({ confidence: { ...progress.confidence, transfer: value } })} />
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.transfer}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("transfer")}>Need a hint</button>
                <button type="button" className="primary-button" disabled={!progress.confidence.transfer} onClick={() => submitScene("transfer")} data-testid="commit-transfer">Test my transfer <span>→</span></button>
              </div>
            </div>
            <SpreadsheetTransfer />
          </section>
        )}

        {currentScene === "replay" && (
          <Replay
            progress={progress}
            headingRef={sceneHeadingRef}
            debrief={debrief}
            busy={debriefBusy}
            error={debriefError}
            onReflection={(reflection) => patchProgress({ reflection })}
            onDebrief={createDebrief}
            onManual={() => setManualOpen(true)}
          />
        )}
      </main>

      <AccessibleDialog
        open={Boolean(feedback)}
        title={feedback?.passed ? "Consequence recorded" : "This decision needs revision"}
        description={feedback ? `${sceneLabels[feedback.scene]} · inspect what happened before continuing.` : undefined}
        onDismiss={() => undefined}
        dismissOnEscape={false}
        dismissOnBackdrop={false}
        appRootRef={appRootRef}
        initialFocusRef={continueButtonRef}
        backdropClassName="drawer-backdrop drawer-backdrop--consequence"
        dialogClassName={`consequence ${feedback?.passed ? "consequence--passed" : "consequence--repair"}`}
        titleClassName="consequence__title"
        descriptionClassName="consequence__description"
        contentClassName="consequence__content"
        testId="consequence-dialog"
      >
        {feedback && (
          <>
          <div className="consequence__grid">
            <div><small>Goal</small><p>{feedback.goal}</p></div>
            <div><small>Evidence</small><p>{feedback.evidence}</p></div>
            <div><small>Principle</small><p>{feedback.principle}</p></div>
            <div><small>Next move</small><p>{feedback.nextMove}</p></div>
          </div>
          {feedback.passed && <FieldNoteCard scene={feedback.scene} />}
          <button ref={continueButtonRef} type="button" className="primary-button" onClick={continueAfterFeedback} data-testid="continue-feedback">
            {feedback.passed ? "Continue the build" : "Revise my decision"} <span>→</span>
          </button>
          </>
        )}
      </AccessibleDialog>

      <AccessibleDialog
        open={manualOpen}
        title="Your field manual"
        description="Reusable working notes earned inside the mission—not prompt tricks."
        onDismiss={() => setManualOpen(false)}
        appRootRef={appRootRef}
        initialFocusRef={manualCloseRef}
        backdropClassName="drawer-backdrop"
        dialogClassName="field-manual"
        titleClassName="field-manual__title"
        descriptionClassName="field-manual__intro"
        contentClassName="field-manual__content"
        testId="field-manual-dialog"
      >
            <button ref={manualCloseRef} className="field-manual__close" type="button" onClick={() => setManualOpen(false)} aria-label="Close field manual">×</button>
            <div className="field-manual__notes">
              {unlockedNotes.length ? unlockedNotes.map((note) => (
                <article key={note.id}>
                  <span>{sceneLabels[note.scene]}</span>
                  <h3>{note.title}</h3>
                  <p className="manual-principle">{note.principle}</p>
                  <dl className="manual-note-meta">
                    <div><dt>Use it when</dt><dd>{note.whenToUse}</dd></div>
                    <div><dt>Evidence it produces</dt><dd>{note.evidenceProduced}</dd></div>
                    <div><dt>Prevents</dt><dd>{note.prevents}</dd></div>
                  </dl>
                  <details>
                    <summary>See the completed Repair Café example</summary>
                    <pre>{note.completedExample}</pre>
                  </details>
                  <h4>Blank template</h4>
                  <pre>{note.template}</pre>
                  <button type="button" onClick={() => copyNote(note.id, note.template)}>{copied === note.id ? "Copied" : "Copy blank template"}</button>
                </article>
              )) : <p>Complete the first decision to begin collecting field notes.</p>}
            </div>
            <FirstProjectGuide />
            <p className="copy-status" role="status" aria-live="polite">{copyStatus}</p>
      </AccessibleDialog>

      <AccessibleDialog
        open={restartOpen}
        role="alertdialog"
        title="Restart this mission?"
        description="This removes the progress saved on this device, including your decisions, notes, and debrief. It cannot be undone."
        onDismiss={() => setRestartOpen(false)}
        appRootRef={appRootRef}
        initialFocusRef={restartCancelRef}
        backdropClassName="drawer-backdrop drawer-backdrop--center"
        dialogClassName="restart-dialog"
        titleClassName="restart-dialog__title"
        descriptionClassName="restart-dialog__description"
        contentClassName="restart-dialog__actions"
        testId="restart-dialog"
      >
        <button ref={restartCancelRef} type="button" className="text-button" onClick={() => setRestartOpen(false)}>Keep my progress</button>
        <button type="button" className="danger-button" onClick={resetMission}>Erase progress and restart</button>
      </AccessibleDialog>
    </div>
  );
}

function Replay({
  progress,
  headingRef,
  debrief,
  busy,
  error,
  onReflection,
  onDebrief,
  onManual,
}: {
  progress: MissionProgress;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  debrief: DebriefResponse | null;
  busy: boolean;
  error: string;
  onReflection: (reflection: string) => void;
  onDebrief: () => void;
  onManual: () => void;
}) {
  const competencies = useMemo(() => buildCompetencies(progress), [progress]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const arrivalDecision = arrivalChoices.find((choice) => choice.id === progress.arrivalChoice)?.title
    ?? "No first decision recorded";
  const supportLabel = (rating: number) => {
    if (rating === 3) return "Without support";
    if (rating === 2) return "After revision";
    if (rating === 1) return "With worked support";
    return "Not yet demonstrated";
  };
  const supportRecord = (...scenes: SceneId[]) => {
    const attempts = scenes.reduce((sum, scene) => sum + (progress.attempts[scene] ?? 0), 0);
    const hints = scenes.reduce((sum, scene) => sum + (progress.hints[scene] ?? 0), 0);
    return `${attempts} ${attempts === 1 ? "attempt" : "attempts"} · ${hints} ${hints === 1 ? "hint" : "hints"}`;
  };
  const events: Array<{
    key: string;
    decision: string;
    consequence: string;
    evidence: string;
    reasoning?: string;
  }> = [
    {
      key: "First layer",
      decision: arrivalDecision,
      consequence: progress.arrivalChoice === "inspect"
        ? "You inspected before the deadline became someone else’s problem."
        : "A visitor met the consequence before the polished claim was trusted again.",
      evidence: `${confidenceLabel(progress.confidence.arrival ?? 0.4)} confidence · ${supportRecord("arrival")}`,
    },
    {
      key: "Target",
      decision: "Defined one phone-first visitor outcome",
      consequence: (progress.attempts.target ?? 1) > 1
        ? "You revised a broad or subjective promise into observable behavior."
        : "The brief aligned the person, outcome, checks, and non-goals.",
      evidence: `4 brief fields · ${supportRecord("target")}`,
    },
    {
      key: "Record",
      decision: "Saved trusted project memory",
      consequence: "The starting state became recoverable without being falsely called known good.",
      evidence: `${progress.repository.length} deliberate repository items · baseline unverified · ${supportRecord("record")}`,
    },
    {
      key: "Assign",
      decision: "Bounded context, scope, and permission",
      consequence: (progress.attempts.radius ?? 1) > 1
        ? "An oversized plan was reduced before it could create extra systems."
        : "The AI received one small change with a clear test.",
      evidence: `${progress.context.length} context items · ${progress.plan.length} retained plan items · ${supportRecord("handoff", "radius")}`,
    },
    {
      key: "Check",
      decision: "Inspected beyond the AI summary",
      consequence: "The polished proposal separated into defects, passing checks, and an unsupported assurance.",
      evidence: `${progress.checksRun.length} evidence tools · 3 canonical gaps exposed · ${supportRecord("check")}`,
    },
    {
      key: "Evolve",
      decision: "Repaired from reproducible evidence",
      consequence: "The smallest patch changed the failed behavior while protecting what already worked.",
      evidence: `${progress.postRepairReruns.length} version-matched checks rerun · diagnosis ${progress.diagnosed ? "recorded" : "missing"} · ${supportRecord("evolve")}`,
    },
    {
      key: "Release",
      decision: "Prepared the exact version for release",
      consequence: "Publication became a human-approved evidence boundary, not a celebration button.",
      evidence: `${releaseEvidenceSnapshot(progress).filter((row) => row.status === "pass").length} / ${releaseEvidenceSnapshot(progress).length} release claims supported · ${supportRecord("ship")}`,
    },
    {
      key: "Transfer",
      decision: "Reused the method on a budget spreadsheet",
      consequence: "Trusted receipts and independent arithmetic replaced AI self-verification.",
      evidence: `${confidenceLabel(progress.confidence.transfer ?? 0.4)} confidence · exact B5 recalculation · ${supportRecord("transfer")}`,
      reasoning: progress.transferExplanation,
    },
  ];
  const independently = competencies.filter((item) => item.rating === 3).length;
  const afterRevision = competencies.filter((item) => item.rating === 2).length;
  const withSupport = competencies.filter((item) => item.rating === 1).length;
  const activeEvent = events[activeEventIndex];

  return (
    <section className="replay" data-testid="replay">
      <header className="replay__hero">
        <p>Revision Trace · Studio case complete</p>
        <h1 ref={headingRef} tabIndex={-1}>The page changed.<br /><em>Your method changed more.</em></h1>
        <span>Move through your actual path: decision → consequence → evidence. Earlier layers stay visible because they explain why the final version can be trusted.</span>
      </header>
      <div className="replay__controls" aria-label="Move through the revision trace">
        <button type="button" onClick={() => setActiveEventIndex((index) => Math.max(0, index - 1))} disabled={activeEventIndex === 0}>← Previous layer</button>
        <label>
          <span className="visually-hidden">Revision trace position</span>
          <input
            type="range"
            min="0"
            max={events.length - 1}
            value={activeEventIndex}
            onChange={(event) => setActiveEventIndex(Number(event.target.value))}
          />
        </label>
        <output aria-live="polite">{activeEventIndex + 1} of {events.length} · {activeEvent.key}</output>
        <button type="button" onClick={() => setActiveEventIndex((index) => Math.min(events.length - 1, index + 1))} disabled={activeEventIndex === events.length - 1}>Next layer →</button>
      </div>
      <ol className="replay__trail">
        {events.map((event, index) => (
          <li key={event.key} className={index === activeEventIndex ? "is-active" : ""}>
            <button
              type="button"
              className="replay__event"
              style={{ "--event-index": index } as React.CSSProperties}
              onClick={() => setActiveEventIndex(index)}
              aria-current={index === activeEventIndex ? "step" : undefined}
            >
              <small>{String(index + 1).padStart(2, "0")} · {event.key}</small>
              <span className="replay__event-title">{event.decision}</span>
              <span className="replay__event-consequence">{event.consequence}</span>
              {event.reasoning && <span className="replay__event-reasoning">Your reasoning: “{event.reasoning}”</span>}
              <span>Evidence: {event.evidence}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="replay__assessment">
        <section className="evidence-profile">
          <header><div><p>Evidence profile</p><h2>{competencies.length}<span> threads recorded</span></h2></div><b>One mission record</b></header>
          <div className="support-summary" aria-label="Level of support used">
            <span><b>{independently}</b> without support</span>
            <span><b>{afterRevision}</b> after revision</span>
            <span><b>{withSupport}</b> with worked support</span>
          </div>
          <p className="assessment-caveat">This records what happened in one mission. It does not claim mastery; later retrieval and new projects are the stronger test.</p>
          {competencies.map((competency) => (
            <div className="competency" key={competency.id}>
              <span>{competency.label}</span>
              <i><b style={{ width: `${(competency.rating / 3) * 100}%` }} /></i>
              <strong>{supportLabel(competency.rating)}</strong>
              <small>{competency.evidence}</small>
            </div>
          ))}
          <footer><b>Calibration snapshot</b>{calibrationSnapshot(progress)}</footer>
        </section>
        <section className="personal-debrief" aria-busy={busy || undefined}>
          <p>Evidence debrief</p>
          {!debrief ? (
            <>
              <h2>Explain the method in your own words.</h2>
              <label htmlFor="reflection">Which AI claim did you come closest to accepting without evidence? What exact check will you use next time?</label>
              <textarea id="reflection" value={progress.reflection} onChange={(event) => onReflection(event.target.value)} maxLength={600} placeholder="I almost accepted… Next time I will check…" />
              <small>{progress.reflection.length}/600 · optional · learner data is treated as text, never instructions</small>
              <p className="debrief-mode-note">An authored debrief always works. When configured, GPT‑5.6 personalizes it from this evidence record.</p>
              {error && <p className="api-error" role="alert">{error}</p>}
              <button type="button" className="primary-button" disabled={busy} onClick={onDebrief}>
                {busy ? "Reading your evidence…" : "Create my evidence debrief"} <span>→</span>
              </button>
              {busy && <span className="visually-hidden" role="status">Creating your evidence debrief.</span>}
            </>
          ) : (
            <div className="debrief-result" role="status" aria-live="polite" aria-atomic="true">
              <span>{debrief.mode === "live" ? "Personalized live" : "Authored judge mode"}</span>
              <h2>{debrief.result.opening}</h2>
              <div><small>Strongest demonstrated habit</small><p>{debrief.result.strongestHabit}</p></div>
              <div><small>Next habit to repeat</small><p>{debrief.result.nextHabit}</p></div>
              <ol>{debrief.result.nextProjectMoves.map((move) => <li key={move}>{move}</li>)}</ol>
              <blockquote>{debrief.result.practiceChallenge}</blockquote>
            </div>
          )}
          <button type="button" className="manual-button" onClick={onManual}>Open the reusable field manual <span>↗</span></button>
        </section>
      </div>
      <footer className="replay__closing">
        <p>The polished surface is only the latest layer.</p>
        <h2>Trust the decisions whose evidence still connects.</h2>
      </footer>
    </section>
  );
}
