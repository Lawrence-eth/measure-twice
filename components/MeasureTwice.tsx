"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DebriefResponseSchema, type DebriefResponse } from "@/lib/debrief-contracts";
import {
  buildCompetencies,
  calibrationSnapshot,
  canCompleteScene,
  evidenceLevel,
  evidenceScore,
  initialProgress,
  isMissionProgress,
  repairIsSpecific,
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
  repairFields,
  repositoryOptions,
  sceneLabels,
  sceneOrder,
  shipGate,
  targetFields,
  transferQuestions,
  type Choice,
  type Confidence,
  type SceneId,
} from "@/lib/mission";

const STORAGE_KEY = "measure-twice:mission:v1:repair-cafe";

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
        evidence: "Inspection reveals an unsourced guarantee, a dead action, and no test log.",
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
      nextMove: "Rewind safely and define what the project must prove before changing it again.",
    };
  }

  const success: Record<Exclude<SceneId, "arrival" | "replay">, Feedback> = {
    target: {
      scene,
      passed,
      goal: "Turn a vague request into a testable project promise.",
      evidence: passed
        ? "The Build Map now names a phone-first audience, meaningful outcome, observable proof, and explicit non-goals."
        : "At least one selected statement is still broad, subjective, or dependent on the AI judging itself.",
      principle: "Start with the smallest user outcome you can prove—not a pile of features.",
      nextMove: passed
        ? "Save this promise where the AI and future collaborators can recover it."
        : "Revise the weak field, then commit to the Build Map again.",
    },
    record: {
      scene,
      passed,
      goal: "Create durable project memory and a safe restore point.",
      evidence: passed
        ? "Trusted facts, setup context, files, safe placeholders, and a known-good checkpoint now share one history."
        : progress.repository.includes("api-key")
          ? "The real API key would be copied into project history. Deleting the visible file later would not reliably erase that history."
          : "The repository is missing durable context or includes noise that should be summarized instead.",
      principle: "A repository is shared memory and undo history—not a secret manager or chat archive.",
      nextMove: passed
        ? "Assemble only the context and authority needed for one AI handoff."
        : "Remove unsafe/noisy items and restore the missing project artifacts.",
    },
    handoff: {
      scene,
      passed,
      goal: "Give the AI enough trusted context and a clear authority boundary.",
      evidence: passed
        ? "The Context X-ray shows the goal, sources, current state, checks, permission boundary, and relevant phone reference."
        : progress.context.includes("secret")
          ? "A production credential crossed into the handoff. That grants authority; it does not explain the task."
          : "The X-ray still contains a blind spot or unrelated private material.",
      principle: "Context is the smallest trusted packet needed for one decision—not everything you can upload.",
      nextMove: passed
        ? "Review the AI's proposed blast radius before granting permission to edit."
        : "Remove dangerous/noisy material and supply every essential source and boundary.",
    },
    radius: {
      scene,
      passed,
      goal: "Reduce the AI plan to one complete, reversible slice.",
      evidence: passed
        ? "The plan now touches only the facts, one responsive action, and the checks that prove them."
        : "The proposed plan still introduces a hidden system or omits part of the proof-sized slice.",
      principle: "Cut scope by removing systems, not by leaving many systems half-built.",
      nextMove: passed
        ? "Inspect the proposal and make every completion claim pay evidence."
        : "Defer accounts, databases, and dashboards; keep the three items tied to the brief.",
    },
    check: {
      scene,
      passed,
      goal: "Connect each requirement to evidence that actually exists.",
      evidence: passed
        ? "The proof ledger exposes an invented guarantee, phone overflow, and an empty execution log while preserving passing safety evidence."
        : progress.checksRun.includes("ask-again")
          ? "Asking the same AI for confidence added a claim, not evidence."
          : "One or more critical requirements still have no independent check.",
      principle: "‘Done’ is a claim. The artifact, trusted source, and reproducible checks decide whether it is true.",
      nextMove: passed
        ? "Describe the exact failures, request the smallest repair, and protect what already passed."
        : "Run the facts, phone, secret, and actual-log checks; remove self-reassurance from the ledger.",
    },
    evolve: {
      scene,
      passed,
      goal: "Repair from reproducible evidence and rerun the failed checks.",
      evidence: passed
        ? "The unsupported promise is gone, the action fits at 390px, and both original failures now pass on rerun."
        : "The repair is still vague, non-reproducible, too wide, or not yet verified against both original failures.",
      principle: "A fix is not finished until the original failure is reproduced, repaired, and retested.",
      nextMove: passed
        ? "Cross a deliberate ship gate and save the verified state."
        : "Complete the Bug Capsule, apply only that repair, then rerun facts and mobile checks.",
    },
    ship: {
      scene,
      passed,
      goal: "Release a known-good version that another person can understand and recover.",
      evidence: passed
        ? "The core path, facts, access, secrets, documentation, and final restore point all have current evidence."
        : "At least one release claim is still unchecked or the repaired failures were not rerun.",
      principle: "Deployment is a verification boundary, not merely clicking Publish.",
      nextMove: passed
        ? "Apply the method to a different artifact without the TRACE labels."
        : "Finish every ship-gate item and verify the exact version being released.",
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

function ChoiceButton({
  choice,
  selected,
  onClick,
  mode = "single",
}: {
  choice: Choice;
  selected: boolean;
  onClick: () => void;
  mode?: "single" | "toggle";
}) {
  return (
    <button
      type="button"
      className={`choice-card ${selected ? "choice-card--selected" : ""} ${choice.dangerous ? "choice-card--danger" : ""}`}
      onClick={onClick}
      role={mode === "single" ? "radio" : undefined}
      aria-checked={mode === "single" ? selected : undefined}
      aria-pressed={mode === "toggle" ? selected : undefined}
    >
      <span className="choice-card__control" aria-hidden="true">
        {selected ? "✓" : mode === "single" ? "○" : "+"}
      </span>
      <span>
        <strong>{choice.title}</strong>
        <small>{choice.detail}</small>
      </span>
    </button>
  );
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
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <header className="scene-heading">
      <p>{eyebrow}</p>
      <h1>{title}</h1>
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
          <button type="button" className="mock-cta" onClick={onAction}>
            Ask about a repair <span>↗</span>
          </button>
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
    <nav className="ruler" aria-label="Mission progress">
      <div className="ruler__line" aria-hidden="true" />
      {sceneOrder.map((item, index) => (
        <span
          key={item}
          className={`${index <= current ? "is-reached" : ""} ${item === scene ? "is-current" : ""}`}
          aria-current={item === scene ? "step" : undefined}
          title={sceneLabels[item]}
        >
          <i />
          <small>{String(index + 1).padStart(2, "0")}</small>
        </span>
      ))}
    </nav>
  );
}

function FieldNoteCard({ scene }: { scene: SceneId }) {
  const note = fieldNotes.find((item) => item.scene === scene);
  if (!note) return null;

  return (
    <section className="field-note">
      <div className="field-note__label"><span>Filed</span> Reusable field note</div>
      <h3>{note.title}</h3>
      <p>{note.principle}</p>
      <pre>{note.template}</pre>
    </section>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main className="intro" data-testid="intro">
      <div className="intro__measure" aria-hidden="true">01&nbsp;&nbsp;02&nbsp;&nbsp;03&nbsp;&nbsp;04&nbsp;&nbsp;05</div>
      <div className="intro__copy">
        <p className="overline">A field school for building with AI</p>
        <h1>AI can make it look finished.<br /><em>Can you tell when it’s real?</em></h1>
        <p className="intro__lede">
          Learn the judgment behind a trustworthy project—by rescuing one that looks polished and quietly fails.
        </p>
        <button type="button" className="primary-button primary-button--large" onClick={onStart} data-testid="start-mission">
          Enter the field exercise <span>→</span>
        </button>
        <div className="intro__meta">
          <span><b>01</b> No experience assumed</span>
          <span><b>02</b> One 18–20 minute mission</span>
          <span><b>03</b> Your decisions change the project</span>
        </div>
      </div>
      <aside className="intro__manifesto">
        <p>Three rules you will prove</p>
        <ol>
          <li><span>Every feature</span> pays a hidden-system cost.</li>
          <li><span>Every AI action</span> needs an authority boundary.</li>
          <li><span>Every “done” claim</span> owes evidence.</li>
        </ol>
        <small>Mission 01 · The page that looks finished</small>
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
        <b>{selected.includes("checkpoint") ? "1 commit" : "no restore point"}</b>
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
                <small>{item.id === "checkpoint" ? "known good" : item.dangerous ? "exposed" : "tracked"}</small>
              </div>
            );
          })}
          {!selected.length && <p>Select artifacts to assemble the project memory.</p>}
        </div>
        <footer>
          <span><i className={selected.includes("checkpoint") ? "is-on" : ""} /> working state</span>
          <span><i className={selected.includes("checkpoint") ? "is-on" : ""} /> named snapshot</span>
          <span><i /> future changes</span>
        </footer>
      </div>
    </section>
  );
}

function ContextXray({ selected }: { selected: string[] }) {
  const factsVisible = ["goal", "trusted-facts", "current-files", "acceptance", "authority"].every((id) =>
    selected.includes(id),
  );
  return (
    <section className="xray">
      <header>
        <div><span className="pulse" /> Context X-ray</div>
        <small>{selected.length} items inside the handoff</small>
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
          <p className={factsVisible ? "is-known" : ""}><b>Goal</b>{factsVisible ? "Known" : "Blind spot"}</p>
          <p className={selected.includes("trusted-facts") ? "is-known" : ""}><b>Facts</b>{selected.includes("trusted-facts") ? "Sourced" : "May be invented"}</p>
          <p className={selected.includes("authority") ? "is-known" : ""}><b>Authority</b>{selected.includes("authority") ? "Bounded" : "Unbounded"}</p>
          <p className={selected.includes("secret") ? "is-danger" : "is-known"}><b>Secrets</b>{selected.includes("secret") ? "Exposed" : "Withheld"}</p>
        </div>
      </div>
    </section>
  );
}

function BlastRadius({ selected }: { selected: string[] }) {
  const active = planOptions.filter((item) => selected.includes(item.id));
  const cost = active.reduce((sum, item) => sum + (item.cost ?? 0), 0);
  const files = active.reduce((sum, item) => sum + (item.files ?? 0), 0);
  const size = Math.min(96, 34 + cost * 3.2);

  return (
    <section className="blast">
      <header>
        <span>Proposed change radius</span>
        <b>{files} files · complexity {cost}</b>
      </header>
      <div className="blast__map" style={{ "--blast-size": `${size}%` } as React.CSSProperties}>
        <i className="blast__outer" />
        <i className="blast__middle" />
        <div className="blast__core"><span>Brief</span><b>1 useful path</b></div>
        {active.map((item, index) => (
          <span
            key={item.id}
            className={`blast__node ${item.correct ? "is-core" : "is-system"}`}
            style={{ "--node-index": index } as React.CSSProperties}
          >
            {item.title}
          </span>
        ))}
      </div>
      <footer>
        <span><i className="key-core" /> proof-sized work</span>
        <span><i className="key-system" /> new hidden system</span>
      </footer>
    </section>
  );
}

function EvidenceWorkbench({ progress }: { progress: MissionProgress }) {
  const [view, setView] = useState<"preview" | "changes" | "requirements">("preview");
  const ran = (id: string) => progress.checksRun.includes(id);
  const requirementRows = [
    { requirement: "Claims match facts.md", check: "Facts comparison", status: ran("facts-check") ? "fail" : "unproven" },
    { requirement: "Main action works at 390px", check: "Mobile interaction", status: ran("mobile-check") ? "fail" : "unproven" },
    { requirement: "No secret in tracked files", check: "Diff + history", status: ran("secret-check") ? "pass" : "unproven" },
    { requirement: "Checks actually ran", check: "Execution log", status: ran("execution-log") ? "fail" : "unproven" },
  ];

  return (
    <section className="evidence-workbench">
      <div className="view-tabs" role="tablist" aria-label="Inspect the AI proposal">
        {(["preview", "changes", "requirements"] as const).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={view === item} onClick={() => setView(item)}>
            {item === "changes" ? "What changed" : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
      <div className="evidence-workbench__view">
        {view === "preview" && <RepairCafePreview phone />}
        {view === "changes" && (
          <div className="diff-view">
            <header><span>page.tsx</span><b>+12 −3</b></header>
            <code><i>+</i> Walk-ins are guaranteed a repair</code>
            <code><i>+</i> min-width: 31rem; <mark>/* wider than phone */</mark></code>
            <code><i>~</i> AI summary: “all four checks passed”</code>
            <footer>No test output attached to this change.</footer>
          </div>
        )}
        {view === "requirements" && (
          <div className="proof-ledger">
            <header><span>Requirement</span><span>Evidence thread</span><span>Result</span></header>
            {requirementRows.map((row) => (
              <div key={row.requirement} className={`proof-row proof-row--${row.status}`}>
                <b>{row.requirement}</b><i /><span>{row.check}</span><strong>{row.status}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SpreadsheetTransfer() {
  return (
    <section className="sheet" aria-label="Community event budget spreadsheet">
      <header><span>Community event budget</span><b>AI edited · not verified</b></header>
      <div className="sheet__grid">
        <b>Item</b><b>Receipt</b><b>Formula result</b>
        <span>Room hire</span><span>$240.00</span><span>$240.00</span>
        <span>Materials</span><span>$86.40</span><span>$86.40</span>
        <span>Refreshments</span><span>$58.75</span><span>$58.75</span>
        <strong>Total</strong><strong>$385.15</strong><strong className="sheet__changed">$442.90</strong>
      </div>
      <footer>
        <code>=SUM(B2:B5)+57.75</code>
        <span>AI note: “I corrected the formula and verified the total.”</span>
      </footer>
    </section>
  );
}

export function MeasureTwice() {
  const [progress, setProgress] = useState<MissionProgress>(initialProgress);
  const [sessionId, setSessionId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [previewNotice, setPreviewNotice] = useState("");
  const [debrief, setDebrief] = useState<DebriefResponse | null>(null);
  const [debriefBusy, setDebriefBusy] = useState(false);
  const [debriefError, setDebriefError] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const feedbackRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const record = parsed as { sessionId?: unknown; progress?: unknown };
          if (typeof record.sessionId === "string") setSessionId(record.sessionId);
          if (isMissionProgress(record.progress)) setProgress(record.progress);
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setSessionId((current) => current || crypto.randomUUID());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !sessionId) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId, progress }));
  }, [hydrated, progress, sessionId]);

  useEffect(() => {
    if (feedback) feedbackRef.current?.focus();
  }, [feedback]);

  const currentScene = progress.scene;
  const sceneNumber = sceneOrder.indexOf(currentScene) + 1;
  const unlockedNotes = fieldNotes.filter((note) => progress.fieldNotes.includes(note.id));

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
      repaired: false,
      retested: [],
    }));
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

  function applyRepair() {
    if (!repairIsSpecific(progress)) {
      const attempted = {
        ...progress,
        attempts: { ...progress.attempts, evolve: (progress.attempts.evolve ?? 0) + 1 },
      };
      setProgress(attempted);
      setFeedback(feedbackFor(attempted, "evolve", false));
      return;
    }
    patchProgress({ repaired: true, retested: [] });
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
    window.localStorage.removeItem(STORAGE_KEY);
    setProgress(initialProgress);
    setSessionId(crypto.randomUUID());
    setFeedback(null);
    setDebrief(null);
    setDebriefError("");
    setManualOpen(false);
  }

  async function copyNote(id: string, template: string) {
    await navigator.clipboard.writeText(template);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1400);
  }

  const activeHint = hints[currentScene]?.[(progress.hints[currentScene] ?? 0) - 1];

  if (!hydrated) return <div className="loading-screen">Opening the field studio…</div>;

  if (!progress.started) {
    return (
      <div className="app-shell">
        <header className="site-header">
          <a className="wordmark" href="#"><span>M//2</span> Measure Twice</a>
          <div><span>Education track</span><b>Build Week 2026</b></div>
        </header>
        <Intro onStart={() => patchProgress({ started: true })} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="site-header site-header--mission">
        <a className="wordmark" href="#" onClick={(event) => { event.preventDefault(); setManualOpen(true); }}>
          <span>M//2</span> Measure Twice
        </a>
        <ProgressRuler scene={currentScene} />
        <div className="header-actions">
          <button type="button" onClick={() => setManualOpen(true)}>Field notes <b>{unlockedNotes.length}</b></button>
          <button type="button" onClick={resetMission}>Start over</button>
        </div>
      </header>

      <main className={`mission-canvas mission-canvas--${currentScene}`} data-testid={`scene-${currentScene}`}>
        <div className="mission-label">
          <span>Mission 01</span>
          <b>{mission.title}</b>
          <small>{String(sceneNumber).padStart(2, "0")} / {sceneOrder.length}</small>
        </div>

        {currentScene === "arrival" && (
          <section className="scene-grid scene-grid--arrival">
            <div className="scene-copy">
              <SceneHeading
                eyebrow="Cold open · Make the call"
                title="The AI says it’s ready."
                copy="No lesson first. Inspect the result, choose your next move, and commit before seeing the consequence."
              />
              <div className="ai-claim"><span>AI</span><p>Everything requested is complete. The page is responsive, accessible, and ready to publish.</p><b>Ready to ship</b></div>
              <div className="choice-stack" role="radiogroup" aria-label="Choose the next action">
                {arrivalChoices.map((choice) => (
                  <ChoiceButton key={choice.id} choice={choice} selected={progress.arrivalChoice === choice.id} onClick={() => patchProgress({ arrivalChoice: choice.id })} />
                ))}
              </div>
              <ConfidencePicker value={progress.confidence.arrival} onChange={(value) => patchProgress({ confidence: { ...progress.confidence, arrival: value } })} />
              <button type="button" className="primary-button" disabled={!progress.arrivalChoice || !progress.confidence.arrival} onClick={() => submitScene("arrival")} data-testid="commit-arrival">
                Commit my decision <span>→</span>
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
              <SceneHeading eyebrow="TRACE 01 · Target" title="Turn a wish into a promise." copy="The organizer’s note sounds clear until someone must decide what to build—and how to know it works." />
              <blockquote className="stakeholder-note"><span>From the organizer</span>{mission.stakeholder}</blockquote>
              <div className="target-fields">
                {targetFields.map((field) => (
                  <fieldset key={field.id}>
                    <legend><span>{field.label}</span>{field.prompt}</legend>
                    <div role="radiogroup">
                      {field.options.map((choice) => (
                        <ChoiceButton key={choice.id} choice={choice} selected={progress.target[field.id] === choice.id} onClick={() => chooseTarget(field.id, choice.id)} />
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.target}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("target")}>Need a hint</button>
                <button type="button" className="primary-button" onClick={() => submitScene("target")} data-testid="commit-target">Commit the Build Map <span>→</span></button>
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
              <SceneHeading eyebrow="TRACE 02 · Record" title="Give the project a memory—and an undo button." copy="A chat remembers a conversation. A repository preserves the facts, files, decisions, and named states of the project." />
              <div className="plain-language-strip">
                <span><b>Git</b> local version history</span><span><b>GitHub</b> shared remote copy</span><span><b>Commit</b> named snapshot</span>
              </div>
              <p className="instruction">Choose what belongs in the first GitHub repository. You can revise before creating the checkpoint.</p>
              <div className="toggle-grid">
                {repositoryOptions.map((choice) => (
                  <ChoiceButton key={choice.id} choice={choice} selected={progress.repository.includes(choice.id)} mode="toggle" onClick={() => patchProgress({ repository: toggle(progress.repository, choice.id) })} />
                ))}
              </div>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.record}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("record")}>Need a hint</button>
                <button type="button" className="primary-button" onClick={() => submitScene("record")} data-testid="commit-record">Create the starting line <span>→</span></button>
              </div>
            </div>
            <RepositoryRoom selected={progress.repository} />
          </section>
        )}

        {currentScene === "handoff" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 03 · Assign" title="Make the AI’s field of view visible." copy="AI cannot know a hidden requirement. It also should not receive every file or permission simply because it can." />
              <p className="instruction">Assemble the smallest trusted packet for this one change. Set both context and authority.</p>
              <div className="toggle-grid">
                {contextOptions.map((choice) => (
                  <ChoiceButton key={choice.id} choice={choice} selected={progress.context.includes(choice.id)} mode="toggle" onClick={() => patchProgress({ context: toggle(progress.context, choice.id) })} />
                ))}
              </div>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.handoff}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("handoff")}>Need a hint</button>
                <button type="button" className="primary-button" onClick={() => submitScene("handoff")} data-testid="commit-handoff">Seal the handoff <span>→</span></button>
              </div>
            </div>
            <ContextXray selected={progress.context} />
          </section>
        )}

        {currentScene === "radius" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 03 · Assign" title="Control the blast radius before editing." copy="The AI proposed a helpful-looking plan. Every extra system creates files, permissions, failure states, and future work." />
              <div className="ai-plan-label"><span>AI proposed</span><b>{progress.plan.length} plan items</b><small>Remove work that does not pay for the brief.</small></div>
              <div className="plan-list">
                {planOptions.map((choice) => (
                  <ChoiceButton key={choice.id} choice={choice} selected={progress.plan.includes(choice.id)} mode="toggle" onClick={() => patchProgress({ plan: toggle(progress.plan, choice.id) })} />
                ))}
              </div>
              <ConfidencePicker value={progress.confidence.radius} onChange={(value) => patchProgress({ confidence: { ...progress.confidence, radius: value } })} />
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.radius}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("radius")}>Need a hint</button>
                <button type="button" className="primary-button" disabled={!progress.confidence.radius} onClick={() => submitScene("radius")} data-testid="commit-radius">Approve this radius <span>→</span></button>
              </div>
            </div>
            <BlastRadius selected={progress.plan} />
          </section>
        )}

        {currentScene === "check" && (
          <section className="scene-grid scene-grid--wide-artifact">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 04 · Check" title="Put every “done” claim on trial." copy="The proposal looks plausible. Choose evidence sources, run them, then inspect what they actually prove." />
              <div className="check-list">
                {checks.map((choice) => (
                  <button key={choice.id} type="button" className={`${progress.checksRun.includes(choice.id) ? "is-run" : ""} ${choice.id === "ask-again" ? "is-claim" : ""}`} onClick={() => patchProgress({ checksRun: toggle(progress.checksRun, choice.id) })} aria-pressed={progress.checksRun.includes(choice.id)}>
                    <span>{progress.checksRun.includes(choice.id) ? "✓" : "▶"}</span><b>{choice.title}</b>
                    {progress.checksRun.includes(choice.id) && <small>{choice.detail}</small>}
                  </button>
                ))}
              </div>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.check}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("check")}>Need a hint</button>
                <button type="button" className="primary-button" onClick={() => submitScene("check")} data-testid="commit-check">Close the proof ledger <span>→</span></button>
              </div>
            </div>
            <EvidenceWorkbench progress={progress} />
          </section>
        )}

        {currentScene === "evolve" && (
          <section className="scene-grid scene-grid--wide-artifact">
            <div className="scene-copy">
              <SceneHeading eyebrow="TRACE 05 · Evolve" title="Repair the gap—not the whole project." copy="Translate the failed evidence into a reproducible, bounded correction. Then make the original checks earn green again." />
              <div className="repair-fields">
                {repairFields.map((field) => (
                  <fieldset key={field.id}>
                    <legend>{field.label}</legend>
                    <div role="radiogroup">
                      {field.options.map((choice) => (
                        <ChoiceButton key={choice.id} choice={choice} selected={progress.repair[field.id] === choice.id} onClick={() => chooseRepair(field.id, choice.id)} />
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.evolve}/3</b>{activeHint}</p>}
              {!progress.repaired ? (
                <div className="scene-actions">
                  <button type="button" className="text-button" onClick={() => requestHint("evolve")}>Need a hint</button>
                  <button type="button" className="primary-button" onClick={applyRepair}>Apply the smallest repair <span>→</span></button>
                </div>
              ) : (
                <div className="retest-panel">
                  <p><span>Patch applied</span> A proposal is not a verified fix. Rerun both failed checks.</p>
                  <div>
                    {["facts-check", "mobile-check"].map((id) => (
                      <button type="button" key={id} className={progress.retested.includes(id) ? "is-pass" : ""} onClick={() => patchProgress({ retested: progress.retested.includes(id) ? progress.retested : [...progress.retested, id] })}>
                        {progress.retested.includes(id) ? "✓ PASS" : "▶ RUN"} {id === "facts-check" ? "trusted facts" : "390px action"}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="primary-button" onClick={() => submitScene("evolve")} data-testid="commit-evolve">Commit the verified repair <span>→</span></button>
                </div>
              )}
            </div>
            <div className="repair-artifact">
              <RepairCafePreview phone repaired={progress.repaired} />
              <div className="patch-summary">
                <span className={progress.repaired ? "is-solid" : ""}>AI proposal</span>
                <b>{progress.repaired ? "2 bounded changes" : "waiting for Bug Capsule"}</b>
                <p>− unsupported guarantee<br />− fixed-width action<br />+ verified source language<br />+ fluid phone layout</p>
              </div>
            </div>
          </section>
        )}

        {currentScene === "ship" && (
          <section className="scene-grid">
            <div className="scene-copy">
              <SceneHeading eyebrow="Release boundary · Ship gate" title="Publish the exact state you proved." copy="Local success is not a release. Name the version, check the real path, document limits, and know how to return." />
              <p className="instruction">Complete the gate for this repaired version. Each check describes evidence—not ceremony.</p>
              <div className="ship-list">
                {shipGate.map((choice) => (
                  <ChoiceButton key={choice.id} choice={choice} selected={progress.shipGate.includes(choice.id)} mode="toggle" onClick={() => patchProgress({ shipGate: toggle(progress.shipGate, choice.id) })} />
                ))}
              </div>
              <button type="button" className="primary-button" onClick={() => submitScene("ship")} data-testid="commit-ship">Cross the ship gate <span>→</span></button>
            </div>
            <aside className="release-card">
              <div className="release-card__stamp">PREVIEW<br /><b>→</b><br />PRODUCTION</div>
              <p>Release candidate</p>
              <h3>repair-cafe<br /><span>verified-mobile-fix</span></h3>
              <div><small>Commit</small><code>8f4c2d1</code></div>
              <div><small>Evidence</small><b>{progress.shipGate.length} / {shipGate.length}</b></div>
              <div><small>Rollback</small><b>4bd91aa · known good</b></div>
              <footer className={progress.shipGate.length === shipGate.length ? "is-ready" : ""}>
                <i /> {progress.shipGate.length === shipGate.length ? "Gate prepared" : "Not ready to release"}
              </footer>
            </aside>
          </section>
        )}

        {currentScene === "transfer" && (
          <section className="scene-grid scene-grid--wide-artifact">
            <div className="scene-copy">
              <SceneHeading eyebrow="No labels · New artifact" title="The interface changed. Did the method transfer?" copy="An AI edited a community budget spreadsheet and says the total is correct. TRACE is hidden now." />
              <div className="transfer-questions">
                {transferQuestions.map((question) => (
                  <fieldset key={question.id}>
                    <legend>{question.label}</legend>
                    <div role="radiogroup">
                      {question.options.map((choice) => (
                        <ChoiceButton key={choice.id} choice={choice} selected={progress.transfer[question.id] === choice.id} onClick={() => chooseTransfer(question.id, choice.id)} />
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              <ConfidencePicker value={progress.confidence.transfer} onChange={(value) => patchProgress({ confidence: { ...progress.confidence, transfer: value } })} />
              {activeHint && <p className="hint" role="status"><b>Hint {progress.hints.transfer}/3</b>{activeHint}</p>}
              <div className="scene-actions">
                <button type="button" className="text-button" onClick={() => requestHint("transfer")}>Need a hint</button>
                <button type="button" className="primary-button" disabled={!progress.confidence.transfer} onClick={() => submitScene("transfer")} data-testid="commit-transfer">Commit the transfer decision <span>→</span></button>
              </div>
            </div>
            <SpreadsheetTransfer />
          </section>
        )}

        {currentScene === "replay" && (
          <Replay
            progress={progress}
            debrief={debrief}
            busy={debriefBusy}
            error={debriefError}
            onReflection={(reflection) => patchProgress({ reflection })}
            onDebrief={createDebrief}
            onManual={() => setManualOpen(true)}
          />
        )}
      </main>

      {feedback && (
        <section className={`consequence ${feedback.passed ? "consequence--passed" : "consequence--repair"}`} ref={feedbackRef} tabIndex={-1} aria-live="polite">
          <div className="consequence__header">
            <span>{feedback.passed ? "Consequence recorded" : "Not ready—repair the decision"}</span>
            <b>{sceneLabels[feedback.scene]}</b>
          </div>
          <div className="consequence__grid">
            <div><small>Goal</small><p>{feedback.goal}</p></div>
            <div><small>Evidence</small><p>{feedback.evidence}</p></div>
            <div><small>Principle</small><p>{feedback.principle}</p></div>
            <div><small>Next move</small><p>{feedback.nextMove}</p></div>
          </div>
          {feedback.passed && <FieldNoteCard scene={feedback.scene} />}
          <button type="button" className="primary-button" onClick={continueAfterFeedback} data-testid="continue-feedback">
            {feedback.passed ? "Continue the build" : "Revise my decision"} <span>→</span>
          </button>
        </section>
      )}

      {manualOpen && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setManualOpen(false); }}>
          <aside className="field-manual" role="dialog" aria-modal="true" aria-label="Field manual">
            <header><div><p>Collected practice</p><h2>Your field manual</h2></div><button type="button" onClick={() => setManualOpen(false)} aria-label="Close field manual">×</button></header>
            <p className="field-manual__intro">These are working instruments, not prompt tricks. Each one was earned by using it inside the mission.</p>
            <div className="field-manual__notes">
              {unlockedNotes.length ? unlockedNotes.map((note) => (
                <article key={note.id}>
                  <span>{sceneLabels[note.scene]}</span><h3>{note.title}</h3><p>{note.principle}</p><pre>{note.template}</pre>
                  <button type="button" onClick={() => copyNote(note.id, note.template)}>{copied === note.id ? "Copied" : "Copy template"}</button>
                </article>
              )) : <p>Complete the first decision to begin collecting field notes.</p>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Replay({
  progress,
  debrief,
  busy,
  error,
  onReflection,
  onDebrief,
  onManual,
}: {
  progress: MissionProgress;
  debrief: DebriefResponse | null;
  busy: boolean;
  error: string;
  onReflection: (reflection: string) => void;
  onDebrief: () => void;
  onManual: () => void;
}) {
  const competencies = useMemo(() => buildCompetencies(progress), [progress]);
  const score = evidenceScore(progress);
  const level = evidenceLevel(progress);
  const events = [
    { key: "Target", decision: "Defined a phone-first outcome", consequence: "Removed subjective success", evidence: "4 observable brief fields" },
    { key: "Record", decision: "Created trusted project memory", consequence: "Made the work recoverable", evidence: "Known-good commit" },
    { key: "Assign", decision: "Bounded context and authority", consequence: "Prevented blind assumptions and overreach", evidence: "Context X-ray" },
    { key: "Check", decision: "Inspected beyond the AI summary", consequence: "Found two real defects", evidence: "Proof ledger" },
    { key: "Evolve", decision: "Repaired from a Bug Capsule", consequence: "Preserved passing behavior", evidence: "2 rerun checks" },
    { key: "Transfer", decision: "Used approved inputs in a new artifact", consequence: "Avoided AI self-verification", evidence: "Independent recalculation" },
  ];

  return (
    <section className="replay" data-testid="replay">
      <header className="replay__hero">
        <p>Build Replay · Mission complete</p>
        <h1>The page changed.<br /><em>Your method changed more.</em></h1>
        <span>Scrub the causal trail: decision → consequence → evidence. No completion badge can substitute for this record.</span>
      </header>
      <div className="replay__trail">
        {events.map((event, index) => (
          <article key={event.key} style={{ "--event-index": index } as React.CSSProperties}>
            <small>{String(index + 1).padStart(2, "0")} · {event.key}</small>
            <h3>{event.decision}</h3>
            <p>{event.consequence}</p>
            <span>Evidence: {event.evidence}</span>
          </article>
        ))}
      </div>
      <div className="replay__assessment">
        <section className="evidence-profile">
          <header><div><p>Mission evidence</p><h2>{score}<span>/100</span></h2></div><b>{level}</b></header>
          <p className="assessment-caveat">This is evidence from one mission—not a claim of mastery. Transfer and later retrieval require more practice.</p>
          {competencies.map((competency) => (
            <div className="competency" key={competency.id}>
              <span>{competency.label}</span>
              <i><b style={{ width: `${(competency.rating / 3) * 100}%` }} /></i>
              <strong>{competency.rating}/3</strong>
              <small>{competency.evidence}</small>
            </div>
          ))}
          <footer><b>Calibration snapshot</b>{calibrationSnapshot(progress)}</footer>
        </section>
        <section className="personal-debrief">
          <p>GPT‑5.6 debrief</p>
          {!debrief ? (
            <>
              <h2>Explain the method in your own words.</h2>
              <label htmlFor="reflection">What will you do differently before accepting AI work on your next project?</label>
              <textarea id="reflection" value={progress.reflection} onChange={(event) => onReflection(event.target.value)} maxLength={600} placeholder="I will…" />
              <small>{progress.reflection.length}/600 · optional · treated as learner data, never instructions</small>
              {error && <p className="api-error" role="alert">{error}</p>}
              <button type="button" className="primary-button" disabled={busy} onClick={onDebrief}>
                {busy ? "Reading your evidence…" : "Create my evidence debrief"} <span>→</span>
              </button>
            </>
          ) : (
            <div className="debrief-result">
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
        <p>Don’t learn to ask AI for more.</p>
        <h2>Learn to know when the work is real.</h2>
      </footer>
    </section>
  );
}
