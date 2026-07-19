"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { AccessibleDialog } from "@/components/AccessibleDialog";
import { AccessibleTabs } from "@/components/AccessibleTabs";
import { RadioCardGroup } from "@/components/ChoiceControls";
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
  productIdentity,
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
  type Choice,
  type Confidence,
  type SceneId,
} from "@/lib/mission";

const STORAGE_KEY = "pentimento:mission:v2:repair-cafe";
const LEGACY_STORAGE_KEY = "measure-twice:mission:v1:repair-cafe";
const RELEASE_VERSION = "c7a91e4";
const JOURNEY_CHAPTERS = [
  { label: "Understand", start: 0, end: 1 },
  { label: "Direct AI", start: 2, end: 4 },
  { label: "Check & repair", start: 5, end: 6 },
  { label: "Release & reuse", start: 7, end: 9 },
] as const;

type Feedback = {
  scene: SceneId;
  passed: boolean;
  goal: string;
  evidence: string;
  principle: string;
  nextMove: string;
};

type MissionUiState = {
  arrivalStage: "observe" | "decide";
  targetStep: number;
  recordStep: number;
  repositoryDecisions: Record<string, boolean>;
  handoffStage: "mode" | "context";
  workModeReviewed: boolean;
  contextStep: number;
  contextDecisions: Record<string, boolean>;
  scopeStep: number;
  repairStep: number;
  transferStep: number;
};

function objectRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function boundedStep(value: unknown, maximum: number, fallback: number): number {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= maximum
    ? Number(value)
    : fallback;
}

function booleanDecisions(value: unknown, allowedIds: string[]): Record<string, boolean> {
  const record = objectRecord(value);
  if (!record) return {};
  return Object.fromEntries(
    allowedIds.flatMap((id) => typeof record[id] === "boolean" ? [[id, record[id] as boolean]] : []),
  );
}

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
      passed: false,
      goal: "Decide whether the artifact is ready.",
      evidence:
        progress.arrivalChoice === "ship"
          ? "The main action does nothing, and one public promise has no source."
          : "The AI summary repeats that everything works, but still provides no independent check.",
      principle: "The creator's assurance is not evidence that its output works.",
      nextMove: "Revise the decision and choose a move that creates independent evidence before publication.",
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
        ? "Use the same evidence habits on a different kind of project."
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

function MobileInstrument({
  progress,
  workModeReviewed,
}: {
  progress: MissionProgress;
  workModeReviewed: boolean;
}) {
  const releaseRows = releaseEvidenceSnapshot(progress);
  const correctChecks = checks.filter((check) => check.correct).length;
  const scopeCounts = scopeDispositions.map((disposition) => ({
    label: disposition.label,
    count: planOptions.filter((item) => progress.scopeReviewed.includes(item.id) && progress.scopeDecisions[item.id] === disposition.id).length,
  }));
  const transferAnswers = transferQuestions.filter((question) => progress.transfer[question.id]).length;

  const state: Record<SceneId, { instrument: string; value: string; detail: string }> = {
    arrival: {
      instrument: "Project preview",
      value: "AI claim · unverified",
      detail: progress.arrivalChoice ? "Decision selected; review its consequence next." : "The source and visitor path still need inspection.",
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
      value: workModeReviewed
        ? `${workModes.find((mode) => mode.id === progress.workMode)?.label} · ${progress.context.length} inputs`
        : "Work mode not chosen",
      detail: !workModeReviewed
        ? "Choose AI’s permission boundary before sharing context."
        : progress.context.includes("secret")
          ? "A credential is exposed."
          : progress.context.includes("authority")
            ? "Authority boundary included."
            : "Authority boundary not selected yet.",
    },
    radius: {
      instrument: "Change footprint",
      value: `${progress.scopeReviewed.length} / ${planOptions.length} proposals reviewed`,
      detail: progress.scopeReviewed.length
        ? scopeCounts.map((item) => `${item.count} ${item.label.toLowerCase()}`).join(" · ")
        : "No proposal has been classified yet.",
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
      detail: progress.productionChecked
        ? "Simulated live URL checked; exact version and visitor path match."
        : progress.published
          ? "Published in simulation; the live check is still missing."
          : "Publishing remains a human-approved action.",
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

  return (
    <aside className="mobile-instrument" aria-label={`Current project status. ${current.instrument}: ${current.value}`}>
      <span aria-hidden="true"><i /></span>
      <div><small>{sceneLabels[progress.scene]} · current workspace</small><b>{current.instrument} · {current.value}</b></div>
      <p>{current.detail}</p>
    </aside>
  );
}

function FieldNoteCard({ scene }: { scene: SceneId }) {
  const note = fieldNotes.find((item) => item.scene === scene);
  if (!note) return null;

  return (
    <section className="field-note">
      <div className="field-note__label"><span>Saved</span> Added to your practical guide</div>
      <h3>{note.title}</h3>
      <p><b>Use it when:</b> {note.whenToUse}</p>
      <pre>{note.template}</pre>
    </section>
  );
}

function Intro({
  onContinue,
  buttonRef,
}: {
  onContinue: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <main id="studio-intro" className="intro" data-testid="intro">
      <div className="intro__measure" aria-hidden="true">P&nbsp;&nbsp;P&nbsp;&nbsp;P</div>
      <div className="intro__copy">
        <p className="overline">A guided simulation for first-time AI builders</p>
        <h1>Learn to lead an<br /><em>AI-built project.</em></h1>
        <p className="intro__lede">
          Pentimento is an interactive lesson for complete beginners. Guide one small website from an idea to a tested, shareable version—learning what to ask AI, what to check yourself, and how to recover when something goes wrong.
        </p>
        <button ref={buttonRef} type="button" className="primary-button primary-button--large" onClick={onContinue} data-testid="open-briefing">
          See how the lesson works <span>→</span>
        </button>
        <div className="intro__meta">
          <span><b>20 min</b> One guided project</span>
          <span><b>No code</b> You make the decisions</span>
          <span><b>Safe</b> Nothing is really published</span>
        </div>
      </div>
      <aside className="intro__manifesto">
        <p>How the lesson works</p>
        <ol>
          <li><span>Inspect</span> one part of a realistic project.</li>
          <li><span>Choose</span> what you would do next.</li>
          <li><span>See</span> what happens and why it matters.</li>
          <li><span>Keep</span> a practical note for your own project.</li>
        </ol>
        <small>{productIdentity.tagline}</small>
      </aside>
    </main>
  );
}

function LessonBriefing({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <main id="lesson-briefing" className="briefing" data-testid="briefing">
      <div className="briefing__progress"><span>Before the first decision</span><b>About 60 seconds</b></div>
      <section className="briefing__hero">
        <p className="overline">Here is the project</p>
        <h1 ref={headingRef} tabIndex={-1}>You are the project lead.<br /><em>AI made the first draft.</em></h1>
        <p>
          A neighborhood Repair Café needs a simple event page. It looks polished, and the AI says every check passed. The organizer wants to share it in ten minutes.
        </p>
      </section>

      <div className="briefing__grid">
        <section className="briefing__card briefing__card--role">
          <span>01 · Your role</span>
          <h2>Guide the work. You do not need to code.</h2>
          <p>Decide what the page must accomplish, what the AI may use and change, how its work should be checked, and whether the result is safe to release.</p>
        </section>
        <section className="briefing__card">
          <span>02 · Your goal</span>
          <h2>Help one phone visitor understand the event and contact the organizer.</h2>
          <p>Every later decision will connect back to that simple outcome.</p>
        </section>
        <section className="briefing__card">
          <span>03 · What you do</span>
          <h2>One small task at a time.</h2>
          <ol>
            <li>Read the situation.</li>
            <li>Inspect one part of the project.</li>
            <li>Choose the next move.</li>
            <li>See the result and revise if needed.</li>
          </ol>
        </section>
      </div>

      <aside className="briefing__safety">
        <span aria-hidden="true">◇</span>
        <p><b>Safe to explore.</b> This is a simulation. Nothing will be published, no email will be sent, and every choice can be revised.</p>
      </aside>

      <div className="briefing__actions">
        <button type="button" className="text-button" onClick={onBack}>← Back</button>
        <button type="button" className="primary-button primary-button--large" onClick={onStart} data-testid="start-mission">
          Inspect the AI draft <span>→</span>
        </button>
      </div>
    </main>
  );
}

function ResumeExperience({
  scene,
  onContinue,
  onRestart,
}: {
  scene: SceneId;
  onContinue: () => void;
  onRestart: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sceneIndex = sceneOrder.indexOf(scene);
  const chapterIndex = JOURNEY_CHAPTERS.findIndex((chapter) => sceneIndex >= chapter.start && sceneIndex <= chapter.end);

  useEffect(() => {
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  return (
    <main id="resume-experience" className="resume-experience" data-testid="resume-experience">
      <p className="overline">Welcome back</p>
      <h1 ref={headingRef} tabIndex={-1}>Your guided project is waiting.</h1>
      <p>Pentimento is a safe simulation about leading an AI-built project. You stopped at <b>{sceneLabels[scene]}</b>; your decisions are still saved on this device.</p>
      <div className="resume-experience__summary">
        <span>Continue from</span><b>{sceneLabels[scene]}</b><small>Chapter {chapterIndex + 1} of {JOURNEY_CHAPTERS.length} · {JOURNEY_CHAPTERS[Math.max(0, chapterIndex)].label}</small>
      </div>
      <div className="resume-experience__actions">
        <button type="button" className="primary-button primary-button--large" onClick={onContinue}>Continue my project <span>→</span></button>
        <button type="button" className="text-button" onClick={onRestart}>Start over</button>
      </div>
    </main>
  );
}

function SceneTask({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="scene-task" aria-label={`${label}: ${title}`}>
      <span>{label}</span>
      <div><h2>{title}</h2>{children}</div>
    </aside>
  );
}

function DecisionTrail({
  items,
  activeIndex,
  onEdit,
}: {
  items: Array<{ label: string; value?: string }>;
  activeIndex: number;
  onEdit: (index: number) => void;
}) {
  return (
    <ol className="decision-trail" aria-label="Decisions in this step">
      {items.map((item, index) => {
        const complete = Boolean(item.value);
        const active = index === activeIndex;
        return (
          <li key={item.label} className={`${complete ? "is-complete" : ""} ${active ? "is-active" : ""}`}>
            <span aria-hidden="true">{complete ? "✓" : String(index + 1).padStart(2, "0")}</span>
            <div><b>{item.label}</b>{complete && <small>{item.value}</small>}</div>
            {complete && !active && <button type="button" onClick={() => onEdit(index)}>Edit</button>}
          </li>
        );
      })}
    </ol>
  );
}

function FocusedStep({
  stepKey,
  announcement,
  className = "",
  testId,
  children,
}: {
  stepKey: string | number;
  announcement: string;
  className?: string;
  testId?: string;
  children: ReactNode;
}) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const previousKeyRef = useRef(stepKey);

  useEffect(() => {
    if (previousKeyRef.current === stepKey) return;
    previousKeyRef.current = stepKey;
    const frame = window.requestAnimationFrame(() => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      anchor.focus({ preventScroll: true });
      anchor.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [stepKey]);

  return (
    <div
      ref={anchorRef}
      className={`step-focus-anchor ${className}`.trim()}
      tabIndex={-1}
      role="group"
      aria-label={announcement}
      data-testid={testId}
    >
      {children}
    </div>
  );
}

function BinaryDecision({
  choice,
  index,
  total,
  decision,
  positiveLabel,
  negativeLabel,
  instruction = "Choose where this item belongs. You can change your answer before review.",
  onDecision,
  revealDetail = false,
}: {
  choice: Choice;
  index: number;
  total: number;
  decision?: boolean;
  positiveLabel: string;
  negativeLabel: string;
  instruction?: string;
  onDecision: (decision: boolean) => void;
  revealDetail?: boolean;
}) {
  return (
    <fieldset className="binary-decision">
      <legend>
        <span>{index + 1} of {total}</span>
        {choice.title}
      </legend>
      <p>{instruction}</p>
      <div>
        <button type="button" className={decision === true ? "is-selected" : ""} aria-pressed={decision === true} onClick={() => onDecision(true)}>
          <span aria-hidden="true">+</span><b>{positiveLabel}</b>
        </button>
        <button type="button" className={decision === false ? "is-selected" : ""} aria-pressed={decision === false} onClick={() => onDecision(false)}>
          <span aria-hidden="true">−</span><b>{negativeLabel}</b>
        </button>
      </div>
      {revealDetail && <small className="binary-decision__review">{choice.detail}</small>}
    </fieldset>
  );
}

function CompactJourney({ scene }: { scene: SceneId }) {
  const current = sceneOrder.indexOf(scene);
  const chapterIndex = JOURNEY_CHAPTERS.findIndex((chapter) => current >= chapter.start && current <= chapter.end);
  const chapter = JOURNEY_CHAPTERS[Math.max(0, chapterIndex)];

  return (
    <div className="journey-compact" aria-label={`Learning journey: chapter ${chapterIndex + 1} of ${JOURNEY_CHAPTERS.length}, ${chapter.label}. Current layer: ${sceneLabels[scene]}.`}>
      <span>Chapter {chapterIndex + 1} of {JOURNEY_CHAPTERS.length}</span>
      <b>{chapter.label}</b>
      <i><span style={{ width: `${((current + 1) / sceneOrder.length) * 100}%` }} /></i>
    </div>
  );
}

function ReleaseSequence({
  progress,
  focusRequest,
  onRecordVersion,
  onReviewReadme,
  onBuild,
  onPreview,
  onApprove,
  onPublish,
  onProduction,
}: {
  progress: MissionProgress;
  focusRequest: number;
  onRecordVersion: () => void;
  onReviewReadme: () => void;
  onBuild: () => void;
  onPreview: () => void;
  onApprove: () => void;
  onPublish: () => void;
  onProduction: () => void;
}) {
  const actions = [
    {
      label: "Record exact version + recovery",
      detail: progress.releaseEvidence.releaseVersion ? `Recorded · ${RELEASE_VERSION}` : "Name the exact version and how to recover if the release fails.",
      complete: Boolean(progress.releaseEvidence.releaseVersion),
      run: onRecordVersion,
    },
    {
      label: "Review README + limitations",
      detail: progress.releaseEvidence.readme ? "Reviewed · purpose, setup, checks, and limits match" : "Make sure another person can understand, run, and check this version.",
      complete: Boolean(progress.releaseEvidence.readme),
      run: onReviewReadme,
    },
    {
      label: "Run production build",
      detail: progress.releaseEvidence.build ? "Passed · npm run build exited 0" : "Produce the same kind of artifact the host will run and preserve the result.",
      complete: Boolean(progress.releaseEvidence.build),
      run: onBuild,
    },
    {
      label: "Smoke-test hosted preview",
      detail: progress.releaseEvidence.preview ? "Passed · facts and contact path work on the hosted preview" : "Repeat the important checks on the real preview URL.",
      complete: Boolean(progress.releaseEvidence.preview),
      run: onPreview,
    },
    {
      label: "Approve this exact public action",
      detail: progress.publishApproved ? `Approved · ${RELEASE_VERSION}` : "A person reviews the evidence and explicitly approves public access.",
      complete: progress.publishApproved,
      run: onApprove,
    },
    {
      label: "Publish the simulated release",
      detail: progress.published ? `Published in simulation · ${RELEASE_VERSION}` : "This is the external action. Approval must come first.",
      complete: progress.published,
      run: onPublish,
    },
    {
      label: "Smoke-test the live URL",
      detail: progress.productionChecked ? "Passed · exact live version and visitor path verified" : "Confirm the live environment serves the approved version and path.",
      complete: progress.productionChecked,
      run: onProduction,
    },
  ];
  const nextIndex = actions.findIndex((action) => !action.complete);
  const next = nextIndex >= 0 ? actions[nextIndex] : undefined;

  return (
    <section className="release-sequence" aria-labelledby="release-actions-title">
      <header>
        <div><span>Release actions</span><h3 id="release-actions-title">{next ? "Do only the next missing action." : "Release actions complete."}</h3></div>
        <b>{actions.filter((action) => action.complete).length} / {actions.length}</b>
      </header>
      {actions.some((action) => action.complete) && (
        <ol className="release-sequence__complete">
          {actions.filter((action) => action.complete).map((action) => <li key={action.label}><span>✓</span><b>{action.label}</b><small>{action.detail}</small></li>)}
        </ol>
      )}
      <FocusedStep
        stepKey={`${nextIndex >= 0 ? nextIndex : actions.length}-${focusRequest}`}
        announcement={next ? `Next release action: ${next.label}` : "All release actions are complete"}
        testId="release-focused-action"
      >
        {next ? (
          <div className="release-sequence__next">
            <span>Next action · {String(nextIndex + 1).padStart(2, "0")}</span>
            <h4>{next.label}</h4>
            <p>{next.detail}</p>
            <button type="button" className="primary-button" onClick={next.run}>{next.label} <span>→</span></button>
          </div>
        ) : (
          <p className="release-sequence__ready" role="status"><span>✓</span><b>All release actions are complete.</b> The full ledger now connects every claim to generated evidence.</p>
        )}
      </FocusedStep>
    </section>
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

function ContextXray({ selected, workMode }: { selected: string[]; workMode?: WorkModeId }) {
  const factsVisible = ["goal", "trusted-facts", "current-files", "acceptance", "authority"].every((id) =>
    selected.includes(id),
  );
  return (
    <section className="xray">
      <header>
        <div><span className="registration-mark" aria-hidden="true" /> Context Lens</div>
        <small>{workMode ? `${workModes.find((mode) => mode.id === workMode)?.label} mode` : "mode not chosen"} · {selected.length} context items</small>
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
          <p className={workMode === "plan" ? "is-known" : workMode ? "is-danger" : ""}><b>Mode</b>{workMode === "plan" ? "Plan · no edits" : workMode ? `${workModes.find((mode) => mode.id === workMode)?.label} · can overreach here` : "Not chosen"}</p>
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
  value?: ScopeDisposition;
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

function ChangeFootprint({
  decisions,
  reviewed,
}: {
  decisions: MissionProgress["scopeDecisions"];
  reviewed: string[];
}) {
  const isReviewed = (id: string) => reviewed.includes(id);
  const kept = planOptions.filter((item) => isReviewed(item.id) && decisions[item.id] === "keep");
  const deferred = planOptions.filter((item) => isReviewed(item.id) && decisions[item.id] === "defer");
  const questions = planOptions.filter((item) => isReviewed(item.id) && decisions[item.id] === "needs-answer");
  const obligations = kept.reduce((sum, item) => sum + item.obligations.length, 0);
  const size = Math.min(94, 38 + obligations * 2.5);

  return (
    <section className="blast">
      <header>
        <span>Change footprint</span>
        <b>{reviewed.length} / {planOptions.length} reviewed</b>
      </header>
      <div className="blast__map" style={{ "--blast-size": `${size}%` } as React.CSSProperties}>
        <i className="blast__outer" />
        <i className="blast__middle" />
        <div className="blast__core"><span>Brief</span><b>1 useful path</b></div>
        {planOptions.map((item, index) => (
          <span
            key={item.id}
            className={`blast__node is-${isReviewed(item.id) ? decisions[item.id] : "pending"}`}
            style={{ "--node-index": index } as React.CSSProperties}
          >
            <b>{isReviewed(item.id) ? scopeDispositions.find((disposition) => disposition.id === decisions[item.id])?.label : "Not reviewed"}</b>{item.title}
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
  const [entryStage, setEntryStage] = useState<"welcome" | "briefing">("welcome");
  const [resumePending, setResumePending] = useState(false);
  const [arrivalStage, setArrivalStage] = useState<"observe" | "decide">("observe");
  const [targetStep, setTargetStep] = useState(0);
  const [recordStep, setRecordStep] = useState(0);
  const [repositoryDecisions, setRepositoryDecisions] = useState<Record<string, boolean>>({});
  const [handoffStage, setHandoffStage] = useState<"mode" | "context">("mode");
  const [workModeReviewed, setWorkModeReviewed] = useState(false);
  const [contextStep, setContextStep] = useState(0);
  const [contextDecisions, setContextDecisions] = useState<Record<string, boolean>>({});
  const [scopeStep, setScopeStep] = useState(0);
  const [repairStep, setRepairStep] = useState(0);
  const [transferStep, setTransferStep] = useState(0);
  const [revisionFocusRequest, setRevisionFocusRequest] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [previewNotice, setPreviewNotice] = useState("");
  const [debrief, setDebrief] = useState<DebriefResponse | null>(null);
  const [debriefBusy, setDebriefBusy] = useState(false);
  const [debriefError, setDebriefError] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const appRootRef = useRef<HTMLDivElement>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const manualCloseRef = useRef<HTMLButtonElement>(null);
  const helpCloseRef = useRef<HTMLButtonElement>(null);
  const introButtonRef = useRef<HTMLButtonElement>(null);
  const restartCancelRef = useRef<HTMLButtonElement>(null);
  const sceneHeadingRef = useRef<HTMLHeadingElement>(null);
  const arrivalDecisionRef = useRef<HTMLHeadingElement>(null);
  const previousSceneRef = useRef<SceneId>(progress.scene);
  const previousStartedRef = useRef(progress.started);
  const previousResumePendingRef = useRef(resumePending);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
        ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const record = parsed as { sessionId?: unknown; progress?: unknown; uiState?: unknown };
          if (typeof record.sessionId === "string") setSessionId(record.sessionId);
          const restored = parseMissionProgress(record.progress);
          if (restored) {
            setProgress(restored);
            setResumePending(restored.started);

            const savedUi = objectRecord(record.uiState);
            const firstTargetGap = targetFields.findIndex((field) => !restored.target[field.id]);
            const firstScopeGap = planOptions.findIndex((item) => !restored.scopeReviewed.includes(item.id));
            const firstRepairGap = repairFields.findIndex((field) => !restored.repair[field.id]);
            const firstTransferGap = transferQuestions.findIndex((question) => !restored.transfer[question.id]);

            setArrivalStage(savedUi?.arrivalStage === "decide" || restored.arrivalChoice ? "decide" : "observe");
            setTargetStep(boundedStep(savedUi?.targetStep, targetFields.length - 1, firstTargetGap >= 0 ? firstTargetGap : targetFields.length - 1));
            setRecordStep(boundedStep(savedUi?.recordStep, repositoryOptions.length - 1, 0));
            setRepositoryDecisions(savedUi
              ? booleanDecisions(savedUi.repositoryDecisions, repositoryOptions.map((item) => item.id))
              : Object.fromEntries(restored.repository.map((id) => [id, true])));
            setHandoffStage(savedUi?.handoffStage === "context" ? "context" : "mode");
            setWorkModeReviewed(savedUi?.workModeReviewed === true);
            setContextStep(boundedStep(savedUi?.contextStep, contextOptions.length - 1, 0));
            setContextDecisions(savedUi
              ? booleanDecisions(savedUi.contextDecisions, contextOptions.map((item) => item.id))
              : Object.fromEntries(restored.context.map((id) => [id, true])));
            setScopeStep(boundedStep(savedUi?.scopeStep, planOptions.length - 1, firstScopeGap >= 0 ? firstScopeGap : planOptions.length - 1));
            setRepairStep(boundedStep(savedUi?.repairStep, repairFields.length - 1, firstRepairGap >= 0 ? firstRepairGap : repairFields.length - 1));
            setTransferStep(boundedStep(savedUi?.transferStep, transferQuestions.length, firstTransferGap >= 0 ? firstTransferGap : transferQuestions.length));
          }
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
      const uiState: MissionUiState = {
        arrivalStage,
        targetStep,
        recordStep,
        repositoryDecisions,
        handoffStage,
        workModeReviewed,
        contextStep,
        contextDecisions,
        scopeStep,
        repairStep,
        transferStep,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId, progress, uiState }));
    } catch {
      // The mission remains usable when storage is unavailable or full.
    }
  }, [
    arrivalStage,
    contextDecisions,
    contextStep,
    handoffStage,
    hydrated,
    progress,
    recordStep,
    repairStep,
    repositoryDecisions,
    scopeStep,
    sessionId,
    targetStep,
    transferStep,
    workModeReviewed,
  ]);

  useEffect(() => {
    const enteredMission = !previousStartedRef.current && progress.started;
    const changedScene = previousSceneRef.current !== progress.scene;
    const resumedMission = previousResumePendingRef.current && !resumePending && progress.started;
    previousStartedRef.current = progress.started;
    previousSceneRef.current = progress.scene;
    previousResumePendingRef.current = resumePending;
    if (!hydrated || (!enteredMission && !changedScene && !resumedMission)) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.requestAnimationFrame(() => sceneHeadingRef.current?.focus({ preventScroll: true }));
  }, [hydrated, progress.scene, progress.started, resumePending]);

  const currentScene = progress.scene;
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

  function decideRepositoryItem(id: string, include: boolean) {
    setRepositoryDecisions((current) => ({ ...current, [id]: include }));
    setProgress((current) => ({
      ...current,
      repository: include
        ? current.repository.includes(id) ? current.repository : [...current.repository, id]
        : current.repository.filter((item) => item !== id),
    }));
  }

  function decideContextItem(id: string, include: boolean) {
    setContextDecisions((current) => ({ ...current, [id]: include }));
    setProgress((current) => ({
      ...current,
      context: include
        ? current.context.includes(id) ? current.context : [...current.context, id]
        : current.context.filter((item) => item !== id),
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
    const passed = canCompleteScene(attempted, scene);
    setProgress(attempted);
    setFeedback(feedbackFor(attempted, scene, passed));
  }

  function openArrivalDecision() {
    setArrivalStage("decide");
    window.requestAnimationFrame(() => arrivalDecisionRef.current?.focus());
  }

  function continueAfterFeedback() {
    if (!feedback) return;
    if (!feedback.passed) {
      if (feedback.scene === "arrival") setArrivalStage("decide");
      if (feedback.scene === "target") {
        const firstWeakField = targetFields.findIndex((field) => {
          const selected = field.options.find((option) => option.id === progress.target[field.id]);
          return !selected?.correct;
        });
        setTargetStep(Math.max(0, firstWeakField));
      }
      if (feedback.scene === "record") {
        const firstWeakItem = repositoryOptions.findIndex((item) => Boolean(item.correct) !== progress.repository.includes(item.id));
        setRecordStep(Math.max(0, firstWeakItem));
      }
      if (feedback.scene === "handoff") {
        if (progress.workMode !== "plan") {
          setHandoffStage("mode");
        } else {
          const firstWeakItem = contextOptions.findIndex((item) => Boolean(item.correct) !== progress.context.includes(item.id));
          setContextStep(Math.max(0, firstWeakItem));
          setHandoffStage("context");
        }
      }
      if (feedback.scene === "radius") {
        const firstWeakItem = planOptions.findIndex((item) => progress.scopeDecisions[item.id] !== item.recommendedDisposition);
        setScopeStep(Math.max(0, firstWeakItem));
      }
      if (feedback.scene === "evolve") {
        const firstWeakField = repairFields.findIndex((field) => {
          const selected = field.options.find((option) => option.id === progress.repair[field.id]);
          return !selected?.correct;
        });
        setRepairStep(Math.max(0, firstWeakField));
      }
      if (feedback.scene === "transfer") {
        const firstWeakQuestion = transferQuestions.findIndex((question) => {
          const selected = question.options.find((option) => option.id === progress.transfer[question.id]);
          return !selected || !("correct" in selected && selected.correct);
        });
        setTransferStep(firstWeakQuestion >= 0 ? firstWeakQuestion : transferQuestions.length);
      }
      setRevisionFocusRequest((request) => request + 1);
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
    setEntryStage("welcome");
    setResumePending(false);
    setArrivalStage("observe");
    setTargetStep(0);
    setRecordStep(0);
    setRepositoryDecisions({});
    setHandoffStage("mode");
    setWorkModeReviewed(false);
    setContextStep(0);
    setContextDecisions({});
    setScopeStep(0);
    setRepairStep(0);
    setTransferStep(0);
    setRevisionFocusRequest(0);
    setFeedback(null);
    setDebrief(null);
    setDebriefError("");
    setManualOpen(false);
    setHelpOpen(false);
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

  if (progress.started && resumePending) {
    return (
      <div className="app-shell" ref={appRootRef}>
        <a className="skip-link" href="#resume-experience">Skip to saved project</a>
        <header className="site-header">
          <a className="wordmark" href="/" aria-label="Pentimento home"><span aria-hidden="true">P</span><b className="wordmark__name">Pentimento</b></a>
          <div><span>Guided simulation</span><b>Your progress is saved</b></div>
        </header>
        <ResumeExperience scene={progress.scene} onContinue={() => setResumePending(false)} onRestart={() => setRestartOpen(true)} />
        <AccessibleDialog
          open={restartOpen}
          role="alertdialog"
          title="Start this guided project over?"
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
          <button type="button" className="danger-button" onClick={resetMission}>Erase progress and start over</button>
        </AccessibleDialog>
      </div>
    );
  }

  if (!progress.started) {
    return (
      <div className="app-shell" ref={appRootRef}>
        <a className="skip-link" href={entryStage === "welcome" ? "#studio-intro" : "#lesson-briefing"}>Skip to main content</a>
        <header className="site-header">
          <a className="wordmark" href="/" aria-label="Pentimento home"><span aria-hidden="true">P</span><b className="wordmark__name">Pentimento</b></a>
          <div><span>Learn to build with AI</span><b>No coding required</b></div>
        </header>
        {entryStage === "welcome" ? (
          <Intro onContinue={() => setEntryStage("briefing")} buttonRef={introButtonRef} />
        ) : (
          <LessonBriefing
            onBack={() => {
              setEntryStage("welcome");
              window.requestAnimationFrame(() => introButtonRef.current?.focus());
            }}
            onStart={() => patchProgress({ started: true })}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app-shell" ref={appRootRef}>
      <a className="skip-link" href="#mission-content">Skip to the current decision</a>
      <header className="site-header site-header--mission">
        <div className="wordmark" role="img" aria-label="Pentimento">
          <span aria-hidden="true">P</span><b className="wordmark__name">Pentimento</b>
        </div>
        <CompactJourney scene={currentScene} />
        <div className="header-actions">
          <button type="button" onClick={() => setHelpOpen(true)} aria-label="How this lesson works"><span className="header-help__long">How this works</span><span className="header-help__short">Help</span></button>
          {unlockedNotes.length > 0 && <button type="button" onClick={() => setManualOpen(true)}>My guide <b>{unlockedNotes.length}</b></button>}
          <button type="button" className="header-actions__quiet" onClick={() => setRestartOpen(true)}>Start over</button>
        </div>
      </header>

      <main id="mission-content" className={`mission-canvas mission-canvas--${currentScene}`} data-testid={`scene-${currentScene}`}>
        <div className="mission-label">
          <span>Guided project</span>
          <b>Repair Café event page</b>
          <small>{sceneLabels[currentScene]}</small>
        </div>
        {currentScene !== "arrival" && <MobileInstrument progress={progress} workModeReviewed={workModeReviewed} />}

        {currentScene === "arrival" && (
          <section className="scene-grid scene-grid--arrival">
            <div className="scene-copy">
              <SceneHeading
                eyebrow="First decision · Inspect the draft"
                title="Can a visitor do what they came to do?"
                copy="The Repair Café organizer plans to share this AI-made page in ten minutes. Your first job is not to fix it. Understand what is true and what the visitor can actually do."
                headingRef={sceneHeadingRef}
              />
              <SceneTask label="Do this now" title="Inspect before you decide.">
                <ol>
                  <li>Compare the page with the organizer’s approved facts.</li>
                  <li>Try the page’s main “Ask about a repair” action.</li>
                  <li>Notice whether the AI gives evidence or only an assurance.</li>
                </ol>
              </SceneTask>
              <div className="ai-claim"><span>AI</span><p>{mission.aiClaim}</p><b>AI claim · not proof</b></div>
            </div>
            <div className="artifact-column">
              <aside className="source-card">
                <header><span>Organizer’s approved facts</span><b>Source of truth</b></header>
                <ul>{mission.approvedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
              </aside>
              <RepairCafePreview onAction={() => setPreviewNotice("Nothing happened. The action has no destination.")} />
              <p className={`preview-notice ${previewNotice ? "is-visible" : ""}`} role="status">{previewNotice || "Try the page’s main action, then compare its claims with the approved facts."}</p>
            </div>
            <FocusedStep
              stepKey={`${arrivalStage}-${revisionFocusRequest}`}
              announcement={arrivalStage === "observe" ? "The project draft is ready to inspect" : "One decision: choose what should happen next"}
              className="arrival-interaction"
            >
              {arrivalStage === "observe" ? (
                <div className="arrival-ready">
                  <p>Take your time with the draft. When you have looked at the source and tried the action, continue to one decision.</p>
                  <button type="button" className="primary-button" onClick={openArrivalDecision} data-testid="open-arrival-decision">
                    Make the decision <span>→</span>
                  </button>
                </div>
              ) : (
                <section className="arrival-decision" aria-labelledby="arrival-decision-title" data-testid="arrival-decision">
                  <p>One decision</p>
                  <h2 id="arrival-decision-title" ref={arrivalDecisionRef} tabIndex={-1}>The AI says everything passed. What should happen next?</h2>
                  <RadioCardGroup
                    name="arrival-choice"
                    groupLabel="Choose what should happen before the page goes live"
                    choices={arrivalChoices}
                    value={progress.arrivalChoice}
                    onChange={(arrivalChoice) => patchProgress({ arrivalChoice })}
                    revealDetails={(progress.attempts.arrival ?? 0) > 0}
                    optionsClassName="choice-stack"
                  />
                  <button type="button" className="primary-button" disabled={!progress.arrivalChoice} onClick={() => submitScene("arrival")} data-testid="commit-arrival">
                    See where this decision leads <span>→</span>
                  </button>
                </section>
              )}
            </FocusedStep>
          </section>
        )}

        {currentScene === "target" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="Define the project · Four clear lines" title="Build a clear project promise." copy="Before AI changes anything, define four lines. We will create them one at a time." headingRef={sceneHeadingRef} />
              <details className="case-note">
                <summary>Read the organizer’s original request</summary>
                <blockquote className="stakeholder-note"><span>From the organizer</span>{mission.stakeholder}</blockquote>
              </details>
              <DecisionTrail
                activeIndex={targetStep}
                onEdit={setTargetStep}
                items={targetFields.map((field) => ({
                  label: field.label,
                  value: field.options.find((item) => item.id === progress.target[field.id])?.title,
                }))}
              />
              <FocusedStep
                stepKey={`${targetFields[targetStep].id}-${revisionFocusRequest}`}
                announcement={`Project promise, question ${targetStep + 1} of ${targetFields.length}: ${targetFields[targetStep].prompt}`}
                className="focused-decision target-fields"
                testId="target-focused-question"
              >
                <RadioCardGroup
                  key={targetFields[targetStep].id}
                  name={`target-${targetFields[targetStep].id}`}
                  legend={<><span>Question {targetStep + 1} of {targetFields.length}</span>{targetFields[targetStep].prompt}</>}
                  description={<span className="plain-language"><b>In plain language:</b> {targetFields[targetStep].plainLanguage}</span>}
                  choices={targetFields[targetStep].options}
                  value={progress.target[targetFields[targetStep].id]}
                  onChange={(choiceId) => chooseTarget(targetFields[targetStep].id, choiceId)}
                  revealDetails={(progress.attempts.target ?? 0) > 0}
                />
              </FocusedStep>
              {targetStep === targetFields.length - 1 && progress.target[targetFields[targetStep].id] && (
                <aside className="runtime-ai-note">
                  <span>One decision beginners often miss</span>
                  <h3>Does the finished page need AI?</h3>
                  <p><b>No.</b> {mission.runtimeAI.explanation}</p>
                </aside>
              )}
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.target}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("target")}>Need a hint</button>
                {targetStep < targetFields.length - 1 ? (
                  <button
                    type="button"
                    className="primary-button"
                    disabled={!progress.target[targetFields[targetStep].id]}
                    onClick={() => setTargetStep((step) => Math.min(targetFields.length - 1, step + 1))}
                    data-testid="next-target-question"
                  >
                    Continue to {targetFields[targetStep + 1].label.toLowerCase()} <span>→</span>
                  </button>
                ) : (
                  <button type="button" className="primary-button" disabled={!progress.target[targetFields[targetStep].id]} onClick={() => submitScene("target")} data-testid="commit-target">Review my project promise <span>→</span></button>
                )}
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
              <SceneHeading eyebrow="Save the starting point · One item at a time" title="Give the project a memory—and an undo button." copy="A repository is a project folder with saved history. It helps another person understand the work and lets you return to an earlier version." headingRef={sceneHeadingRef} />
              <SceneTask label="Your task" title="Decide what the project should remember.">
                <p>Review one item at a time. Put useful project context in the repository; keep secrets and irrelevant material out.</p>
              </SceneTask>
              <details className="terms-disclosure">
                <summary>New to GitHub? Learn the six terms used here</summary>
                <div className="plain-language-strip">
                  <span><b>Git</b> saved version history</span>
                  <span><b>GitHub</b> a shared copy of the project</span>
                  <span><b>Commit</b> one named saved version</span>
                  <span><b>README</b> purpose and instructions</span>
                  <span><b>.gitignore</b> files Git must not save</span>
                  <span><b>API key</b> a private service credential</span>
                </div>
              </details>
              <FocusedStep
                stepKey={`${repositoryOptions[recordStep].id}-${revisionFocusRequest}`}
                announcement={`Repository review, item ${recordStep + 1} of ${repositoryOptions.length}: ${repositoryOptions[recordStep].title}`}
                className="focused-sequence"
                testId="repository-focused-item"
              >
                <div className="focused-sequence__progress"><span>Repository review</span><b>{recordStep + 1} / {repositoryOptions.length}</b></div>
                <BinaryDecision
                  choice={repositoryOptions[recordStep]}
                  index={recordStep}
                  total={repositoryOptions.length}
                  decision={repositoryDecisions[repositoryOptions[recordStep].id]}
                  positiveLabel="Include in the repository"
                  negativeLabel="Keep out"
                  onDecision={(include) => decideRepositoryItem(repositoryOptions[recordStep].id, include)}
                  revealDetail={(progress.attempts.record ?? 0) > 0}
                />
              </FocusedStep>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.record}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <div className="sequence-secondary-actions">
                  {recordStep > 0 && <button type="button" className="text-button" onClick={() => setRecordStep((step) => step - 1)}>← Previous item</button>}
                  <button type="button" className="text-button" onClick={() => requestHint("record")}>Need a hint</button>
                </div>
                {recordStep < repositoryOptions.length - 1 ? (
                  <button type="button" className="primary-button" disabled={repositoryDecisions[repositoryOptions[recordStep].id] === undefined} onClick={() => setRecordStep((step) => step + 1)} data-testid="next-repository-item">Next item <span>→</span></button>
                ) : (
                  <button type="button" className="primary-button" disabled={repositoryDecisions[repositoryOptions[recordStep].id] === undefined} onClick={() => submitScene("record")} data-testid="commit-record">Review this project memory <span>→</span></button>
                )}
              </div>
            </div>
            <RepositoryRoom selected={progress.repository} />
          </section>
        )}

        {currentScene === "handoff" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="Direct the AI · Permission before context" title="Make the AI’s field of view visible." copy="AI cannot know a hidden requirement. It also should not receive every file or permission simply because it can." headingRef={sceneHeadingRef} />
              <SceneTask label="Two small decisions" title={handoffStage === "mode" ? "First, choose what kind of help you want." : "Now choose what the AI needs for that one task."}>
                <p>{handoffStage === "mode" ? "The work mode sets the boundary before any files or context are shared." : "Useful context explains the goal and evidence. It does not include secrets or unrelated personal files."}</p>
              </SceneTask>
              <FocusedStep
                stepKey={`${handoffStage}-${contextStep}-${revisionFocusRequest}`}
                announcement={handoffStage === "mode"
                  ? "Choose what kind of help AI may provide"
                  : `Context packet, item ${contextStep + 1} of ${contextOptions.length}: ${contextOptions[contextStep].title}`}
                testId="handoff-focused-stage"
              >
              {handoffStage === "mode" ? (
                <>
                  <RadioCardGroup
                    name="work-mode"
                    legend="What may AI do in this turn?"
                    description={<span className="plain-language"><b>Right now:</b> You want to inspect the project and review a proposed plan before allowing edits.</span>}
                    choices={workModes.filter((mode) => ["plan", "implement", "review"].includes(mode.id)).map((mode) => ({
                      id: mode.id,
                      title: `${mode.label} · ${mode.mayChangeFiles ? "may change files" : "no file changes"}`,
                      detail: `${mode.plainLanguage} Expected return: ${mode.expectedReturn}`,
                      correct: mode.id === "plan",
                    }))}
                    value={workModeReviewed ? progress.workMode : undefined}
                    onChange={(workMode) => {
                      patchProgress({ workMode: workMode as WorkModeId });
                      setWorkModeReviewed(true);
                    }}
                    revealDetails={(progress.attempts.handoff ?? 0) > 0}
                    className="work-mode-choice focused-decision"
                  />
                  <div className="scene-actions scene-actions--end">
                    <button type="button" className="primary-button" disabled={!workModeReviewed} onClick={() => setHandoffStage("context")} data-testid="continue-to-context">Continue to context <span>→</span></button>
                  </div>
                </>
              ) : (
                <>
                  <div className="focused-sequence" data-testid="context-focused-item">
                    <div className="focused-sequence__progress"><span>Context packet</span><b>{contextStep + 1} / {contextOptions.length}</b></div>
                    <BinaryDecision
                      choice={contextOptions[contextStep]}
                      index={contextStep}
                      total={contextOptions.length}
                      decision={contextDecisions[contextOptions[contextStep].id]}
                      positiveLabel="Give this to AI"
                      negativeLabel="Leave it out"
                      instruction="Decide whether this helps AI plan the agreed change safely. You can revise before review."
                      onDecision={(include) => decideContextItem(contextOptions[contextStep].id, include)}
                      revealDetail={(progress.attempts.handoff ?? 0) > 0}
                    />
                  </div>
                  <div className="scene-actions">
                    <div className="sequence-secondary-actions">
                      <button type="button" className="text-button" onClick={() => contextStep > 0 ? setContextStep((step) => step - 1) : setHandoffStage("mode")}>← Back</button>
                      <button type="button" className="text-button" onClick={() => requestHint("handoff")}>Need a hint</button>
                    </div>
                    {contextStep < contextOptions.length - 1 ? (
                      <button type="button" className="primary-button" disabled={contextDecisions[contextOptions[contextStep].id] === undefined} onClick={() => setContextStep((step) => step + 1)} data-testid="next-context-item">Next item <span>→</span></button>
                    ) : (
                      <button type="button" className="primary-button" disabled={contextDecisions[contextOptions[contextStep].id] === undefined} onClick={() => submitScene("handoff")} data-testid="commit-handoff">Review the AI handoff <span>→</span></button>
                    )}
                  </div>
                </>
              )}
              </FocusedStep>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.handoff}/3</b>{activeHint}</p>}
            </div>
            <ContextXray selected={progress.context} workMode={workModeReviewed ? progress.workMode : undefined} />
          </section>
        )}

        {currentScene === "radius" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="Review the AI plan · One proposal at a time" title="Review the change footprint before editing." copy="Every extra system creates permissions, failure states, and future work. Decide whether each proposal belongs in this first version." headingRef={sceneHeadingRef} />
              <div className="ai-plan-label"><span>AI proposed</span><b>{planOptions.length} plan items</b><small>Choose Keep, Defer, or Needs an answer for each item. Nothing is approved merely because AI suggested it.</small></div>
              <div className="focused-sequence__progress"><span>Plan review</span><b>{scopeStep + 1} / {planOptions.length}</b></div>
              <div className="plan-list">
                <FocusedStep
                  stepKey={`${planOptions[scopeStep].id}-${revisionFocusRequest}`}
                  announcement={`Plan review, proposal ${scopeStep + 1} of ${planOptions.length}: ${planOptions[scopeStep].title}`}
                  testId="scope-focused-item"
                >
                  <ScopeDecisionCard
                    key={planOptions[scopeStep].id}
                    choice={planOptions[scopeStep]}
                    value={progress.scopeReviewed.includes(planOptions[scopeStep].id) ? progress.scopeDecisions[planOptions[scopeStep].id] : undefined}
                    reviewed={progress.scopeReviewed.includes(planOptions[scopeStep].id)}
                    onChange={(disposition) => chooseScopeDisposition(planOptions[scopeStep].id, disposition)}
                    revealFeedback={(progress.attempts.radius ?? 0) > 0}
                  />
                </FocusedStep>
              </div>
              {scopeStep === planOptions.length - 1 && progress.scopeReviewed.includes(planOptions[scopeStep].id) && (
                <ConfidencePicker value={progress.confidence.radius} onChange={(value) => patchProgress({ confidence: { ...progress.confidence, radius: value } })} />
              )}
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.radius}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <div className="sequence-secondary-actions">
                  {scopeStep > 0 && <button type="button" className="text-button" onClick={() => setScopeStep((step) => step - 1)}>← Previous item</button>}
                  <button type="button" className="text-button" onClick={() => requestHint("radius")}>Need a hint</button>
                </div>
                {scopeStep < planOptions.length - 1 ? (
                  <button type="button" className="primary-button" disabled={!progress.scopeReviewed.includes(planOptions[scopeStep].id)} onClick={() => setScopeStep((step) => step + 1)} data-testid="next-scope-item">Next proposal <span>→</span></button>
                ) : (
                  <button type="button" className="primary-button" disabled={!progress.confidence.radius} onClick={() => submitScene("radius")} data-testid="commit-radius">Review the whole plan <span>→</span></button>
                )}
              </div>
            </div>
            <ChangeFootprint decisions={progress.scopeDecisions} reviewed={progress.scopeReviewed} />
          </section>
        )}

        {currentScene === "check" && (
          <section className="scene-grid scene-grid--wide-artifact">
            <div className="scene-copy">
              <SceneHeading eyebrow="Inspect the AI claim · Independent evidence" title="Put every “done” claim on trial." copy="The proposal looks plausible. Run evidence tools, then inspect what they actually prove." headingRef={sceneHeadingRef} />
              <FocusedStep
                stepKey={`check-${revisionFocusRequest}`}
                announcement="Run independent evidence tools and inspect what each result proves"
                testId="check-focused-work"
              >
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
              </FocusedStep>
            </div>
            <EvidenceWorkbench progress={progress} />
          </section>
        )}

        {currentScene === "evolve" && (
          <section className="scene-grid scene-grid--wide-artifact">
            <div className="scene-copy">
              <SceneHeading eyebrow="Repair from evidence · Four precise lines" title="Repair the gap—not the whole project." copy="Describe the observed failure, how to reproduce it, what passing looks like, and what already-working behavior must be preserved." headingRef={sceneHeadingRef} />
              <FocusedStep
                stepKey={`${!progress.diagnosed ? `line-${repairStep}` : !progress.repaired ? "diagnosis" : "retest"}-${revisionFocusRequest}`}
                announcement={!progress.diagnosed
                  ? `Repair brief, line ${repairStep + 1} of ${repairFields.length}: ${repairFields[repairStep].label}`
                  : !progress.repaired
                    ? "Diagnosis recorded; review the proposed bounded patch"
                    : "Patch applied; rerun the version-matched checks"}
                testId="repair-focus-stage"
              >
              {!progress.diagnosed && (
                <>
                  <DecisionTrail
                    activeIndex={repairStep}
                    onEdit={setRepairStep}
                    items={repairFields.map((field) => ({
                      label: field.label,
                      value: field.options.find((item) => item.id === progress.repair[field.id])?.title,
                    }))}
                  />
                  <div className="repair-fields focused-decision" data-testid="repair-focused-question">
                  <RadioCardGroup
                    key={repairFields[repairStep].id}
                    name={`repair-${repairFields[repairStep].id}`}
                    legend={<><span>Repair line {repairStep + 1} of {repairFields.length}</span>{repairFields[repairStep].label}</>}
                    choices={repairFields[repairStep].options}
                    value={progress.repair[repairFields[repairStep].id]}
                    onChange={(choiceId) => chooseRepair(repairFields[repairStep].id, choiceId)}
                    revealDetails={(progress.attempts.evolve ?? 0) > 0}
                  />
                  </div>
                  {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.evolve}/3</b>{activeHint}</p>}
                </>
              )}
              {!progress.diagnosed ? (
                <div className="scene-actions">
                  <div className="sequence-secondary-actions">
                    {repairStep > 0 && <button type="button" className="text-button" onClick={() => setRepairStep((step) => step - 1)}>← Previous line</button>}
                    <button type="button" className="text-button" onClick={() => requestHint("evolve")}>Need a hint</button>
                  </div>
                  {repairStep < repairFields.length - 1 ? (
                    <button type="button" className="primary-button" disabled={!progress.repair[repairFields[repairStep].id]} onClick={() => setRepairStep((step) => step + 1)} data-testid="next-repair-line">Next repair line <span>→</span></button>
                  ) : (
                    <button type="button" className="primary-button" disabled={!progress.repair[repairFields[repairStep].id]} onClick={diagnoseRepair}>Diagnose before editing <span>→</span></button>
                  )}
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
              </FocusedStep>
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
              <SceneHeading eyebrow="Release boundary · One action at a time" title="Publish the exact state you proved." copy="A verified preview is not yet the live version real people use. Name the version, produce the missing evidence, approve the public action, and check again after release." headingRef={sceneHeadingRef} />
              <SceneTask label="How this works" title="The ledger is generated, not self-reported.">
                <p>Rows become supported only when a real check or release action produces evidence. You cannot turn a claim green by ticking a box.</p>
              </SceneTask>
              <p className="visually-hidden" role="status">
                {releaseRows.filter((row) => row.status === "pass").length} of {releaseRows.length} release claims currently supported.
              </p>
              <ReleaseSequence
                progress={progress}
                focusRequest={revisionFocusRequest}
                onRecordVersion={recordReleaseVersion}
                onReviewReadme={reviewReadme}
                onBuild={runReleaseBuild}
                onPreview={runPreviewSmoke}
                onApprove={approvePublishing}
                onPublish={publishSimulatedRelease}
                onProduction={runProductionSmoke}
              />
              <details className="release-ledger-disclosure">
                <summary><span>Inspect the full evidence record</span><b>{releaseRows.filter((row) => row.status === "pass").length} / {releaseRows.length} claims supported</b></summary>
                <div className="release-ledger table-scroll" tabIndex={0}>
                  <table aria-label="Release claims, generated status, source, and evidence">
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
              </details>
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
              <SceneHeading eyebrow="Use the method again · New kind of project" title="The interface changed. Did the method transfer?" copy="An AI edited a community budget spreadsheet and says the total is correct. Use the same habits you practised in this new setting." headingRef={sceneHeadingRef} />
              <SceneTask label="Transfer challenge" title="Make three decisions, then explain what is actually proven.">
                <p>The website is gone, but the same questions remain: What is the trusted source? What evidence supports the claim? What is the smallest safe next move?</p>
              </SceneTask>
              <DecisionTrail
                activeIndex={Math.min(transferStep, transferQuestions.length - 1)}
                onEdit={setTransferStep}
                items={transferQuestions.map((question) => ({
                  label: question.id === "source" ? "Trusted source" : question.id === "proof" ? "Independent proof" : "Bounded next move",
                  value: question.options.find((item) => item.id === progress.transfer[question.id])?.title,
                }))}
              />
              <FocusedStep
                stepKey={`${transferStep < transferQuestions.length ? transferQuestions[transferStep].id : "explanation"}-${revisionFocusRequest}`}
                announcement={transferStep < transferQuestions.length
                  ? `Transfer challenge, decision ${transferStep + 1} of ${transferQuestions.length}: ${transferQuestions[transferStep].label}`
                  : "Transfer challenge: explain what is proven and what remains uncertain"}
                className={transferStep < transferQuestions.length ? "transfer-questions focused-decision" : ""}
                testId="transfer-focused-question"
              >
              {transferStep < transferQuestions.length ? (
                <>
                  <RadioCardGroup
                    key={transferQuestions[transferStep].id}
                    name={`transfer-${transferQuestions[transferStep].id}`}
                    legend={<><span>Decision {transferStep + 1} of {transferQuestions.length}</span>{transferQuestions[transferStep].label}</>}
                    choices={transferQuestions[transferStep].options}
                    value={progress.transfer[transferQuestions[transferStep].id]}
                    onChange={(choiceId) => chooseTransfer(transferQuestions[transferStep].id, choiceId)}
                    revealDetails={(progress.attempts.transfer ?? 0) > 0}
                  />
                </>
              ) : (
                <>
                  <div className="transfer-explanation">
                    <label htmlFor="transfer-explanation">In your own words, what is proven—and what is still uncertain?</label>
                    <p>Use the receipts, formula, independent calculation, and limits of this check. Specificity matters more than length.</p>
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
                </>
              )}
              </FocusedStep>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.transfer}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <div className="sequence-secondary-actions">
                  {transferStep > 0 && <button type="button" className="text-button" onClick={() => setTransferStep((step) => step - 1)}>← Back</button>}
                  <button type="button" className="text-button" onClick={() => requestHint("transfer")}>Need a hint</button>
                </div>
                {transferStep < transferQuestions.length ? (
                  <button type="button" className="primary-button" disabled={!progress.transfer[transferQuestions[transferStep].id]} onClick={() => setTransferStep((step) => step + 1)} data-testid="next-transfer-question">
                    {transferStep === transferQuestions.length - 1 ? "Explain what is proven" : "Next decision"} <span>→</span>
                  </button>
                ) : (
                  <button type="button" className="primary-button" disabled={!progress.confidence.transfer || !transferExplanationIsMeaningful(progress.transferExplanation)} onClick={() => submitScene("transfer")} data-testid="commit-transfer">Review my reasoning <span>→</span></button>
                )}
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
        title={feedback?.passed ? "Here’s what your choice leads to" : "Let’s revise this choice"}
        description={feedback ? `${sceneLabels[feedback.scene]} · nothing is lost; use the result to decide what happens next.` : undefined}
        onDismiss={() => undefined}
        dismissOnEscape={false}
        dismissOnBackdrop={false}
        restoreFocus={false}
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
            <div><small>What happened</small><p>{feedback.evidence}</p></div>
            <div><small>Why it matters</small><p>{feedback.principle}</p></div>
            <div><small>What to do next</small><p>{feedback.nextMove}</p></div>
          </div>
          {feedback.passed && <FieldNoteCard scene={feedback.scene} />}
          <button ref={continueButtonRef} type="button" className="primary-button" onClick={continueAfterFeedback} data-testid="continue-feedback">
            {feedback.passed ? "Continue to the next small task" : "Revise this decision"} <span>→</span>
          </button>
          </>
        )}
      </AccessibleDialog>

      <AccessibleDialog
        open={helpOpen}
        title="How this lesson works"
        description="A quick reminder you can open at any time."
        onDismiss={() => setHelpOpen(false)}
        appRootRef={appRootRef}
        initialFocusRef={helpCloseRef}
        backdropClassName="drawer-backdrop drawer-backdrop--center"
        dialogClassName="lesson-help"
        titleClassName="lesson-help__title"
        descriptionClassName="lesson-help__description"
        contentClassName="lesson-help__content"
        testId="lesson-help-dialog"
      >
        <div className="lesson-help__role"><span>Your role</span><p>You are the project lead. AI makes proposals; you decide the outcome, boundaries, checks, and release.</p></div>
        <ol>
          <li><span>1</span><div><b>Read one situation</b><p>Each layer introduces one part of the same Repair Café project.</p></div></li>
          <li><span>2</span><div><b>Make one focused decision</b><p>Choose what you would do. A wrong answer is safe and can be revised.</p></div></li>
          <li><span>3</span><div><b>See what the choice changes</b><p>The result explains what happened, why it matters, and what to do next.</p></div></li>
        </ol>
        <p className="lesson-help__safety">Nothing here publishes a real project, sends an email, or needs an AI account.</p>
        <div className="lesson-help__actions">
          <button type="button" className="text-button" onClick={() => {
            setHelpOpen(false);
            setRestartOpen(true);
          }}>Start this project over</button>
          <button ref={helpCloseRef} type="button" className="primary-button" onClick={() => setHelpOpen(false)}>Return to my task <span>→</span></button>
        </div>
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
        title="Start this guided project over?"
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
        <button type="button" className="danger-button" onClick={resetMission}>Erase progress and start over</button>
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
    if (rating === 3) return "Independent";
    if (rating === 2) return "After revision";
    if (rating === 1) return "With a hint";
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
      evidence: `Independent source and visitor-path inspection · ${supportRecord("arrival")}`,
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
            <span><b>{independently}</b> independent</span>
            <span><b>{afterRevision}</b> after revision</span>
            <span><b>{withSupport}</b> with a hint</span>
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
