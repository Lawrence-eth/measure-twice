"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type RefObject,
} from "react";

import { AccessibleDialog } from "@/components/AccessibleDialog";
import { JourneyShell, stageLabels } from "@/components/learning/JourneyShell";
import { LessonFrame } from "@/components/learning/LessonFrame";
import { ProjectCanvas } from "@/components/learning/ProjectCanvas";
import {
  TeachingMirrorResultSchema,
  type TeachingMirrorResult,
} from "@/lib/debrief-contracts";
import {
  buildLoop,
  buildablePromptParts,
  completePlanningPrompt,
  completeRepairPrompt,
  exampleReleaseCard,
  featureObligations,
  firstSevenDays,
  firstVersionBrief,
  playbookCards,
  projectHomeSteps,
  releaseStages,
  repairCafeBuildCycles,
  repairCafeDefects,
  repairCafeFeatureDecisions,
  repairCafePostLaunchChange,
  repairCafeProjectFiles,
  repairCafeRoughIdea,
  runtimeAIExplanation,
  startingLanes,
  studioIdentity,
  studioGlossary,
  studioStops,
  systemRoles,
  toolCategories,
  versionRibbon,
  weakFirstPrompt,
  type PromptPartId,
  type StudioStopId,
} from "@/lib/studio";
import {
  STUDIO_STORAGE_KEY,
  completeLearningStage,
  initialStudioProgress,
  learningStages,
  parseStudioProgress,
  type BuildPhase,
  type LearningStage,
  type MirrorDraft,
  type StudioProgress,
  type StudioStage,
  type ToolLane,
} from "@/lib/studio-progress";

const stageToContent: Record<LearningStage, StudioStopId> = {
  idea: "idea",
  tools: "tools",
  home: "project-home",
  ask: "ask-ai",
  build: "build",
  check: "check",
  live: "go-live",
  improve: "improve",
};

const nextStage: Record<LearningStage, StudioStage> = {
  idea: "tools",
  tools: "home",
  home: "ask",
  ask: "build",
  build: "check",
  check: "live",
  live: "improve",
  improve: "playbook",
};

const phaseOrder: readonly BuildPhase[] = ["ask", "inspect", "run", "check", "save"];

const promptGroups: readonly {
  id: string;
  label: string;
  parts: readonly PromptPartId[];
  result: string;
}[] = [
  {
    id: "purpose",
    label: "Goal and person",
    parts: ["role", "goal", "person"],
    result: "AI knows who needs what and how much explanation you need.",
  },
  {
    id: "truth",
    label: "Facts and complete path",
    parts: ["facts", "complete-path"],
    result: "AI has a source of truth and one end-to-end visitor outcome.",
  },
  {
    id: "limits",
    label: "Boundaries and quality",
    parts: ["boundaries", "quality"],
    result: "The request cannot quietly grow into accounts, payments, or runtime AI.",
  },
  {
    id: "mode",
    label: "Work mode and approval",
    parts: ["work-mode", "approval"],
    result: "AI must plan and stop before changing files.",
  },
  {
    id: "done",
    label: "Observable finish line",
    parts: ["finish-line"],
    result: "Completion is tied to files and checks instead of an AI assurance.",
  },
] as const;

const improveActions = [
  {
    title: "Update the trusted source",
    detail: repairCafePostLaunchChange.sourceChange,
  },
  {
    title: "Request only the approved change",
    detail: "Name the new fact, the affected files, and everything that must remain stable.",
  },
  {
    title: "Repeat the affected checks",
    detail: "Recheck facts, the complete path, 390px layout, keyboard use, and project commands.",
  },
  {
    title: "Save, preview, and release a new version",
    detail: repairCafePostLaunchChange.savedVersion,
  },
] as const;

const mirrorExampleDraft: MirrorDraft = {
  person: "A neighbor who has spare seeds but has never attended a seed swap",
  situation:
    "They are checking from a phone and need to decide what to bring before leaving home.",
  usefulResult:
    "They understand which seeds are accepted, where to go, and can email one question.",
  completePath:
    "Open the page → read the date, place, and accepted-seed rules → understand the labeling rule → open an email.",
  trustedFacts:
    "Sunday, August 9 · 11:00–13:00\nNorth Library garden room\nDry, labeled vegetable and herb seeds only\nQuestions: seeds@example.org",
  mustHave:
    "Accurate event summary\nAccepted-seed rules\nReadable phone layout\nWorking email link",
  notNow:
    "Member accounts\nSeed inventory\nReservations\nPayments\nAI gardening advice",
  doneWhen:
    "A first-time visitor can explain what to bring and open the organizer email at desktop and 390px widths.",
};

function stop(stage: LearningStage) {
  const id = stageToContent[stage];
  const result = studioStops.find((item) => item.id === id);
  if (!result) throw new Error(`Missing studio content for ${stage}`);
  return result;
}

function recommendationLabel(
  decision: (typeof repairCafeFeatureDecisions)[number]["decision"],
) {
  if (decision === "build-now") return "First version";
  if (decision === "needs-answer") return "Needs an organizer answer";
  return "Later";
}

function IntroHeader() {
  return (
    <header className="studio-header">
      <div className="studio-wordmark">
        <span aria-hidden="true">P</span>
        <b>Pentimento</b>
      </div>
      <p>
        Your first AI build <span>No coding experience needed</span>
      </p>
    </header>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="studio-primary"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <span aria-hidden="true">→</span>
    </button>
  );
}

function LessonActions({
  label,
  onNext,
  disabled,
}: {
  label: string;
  onNext: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="lesson-actions">
      <PrimaryButton onClick={onNext} disabled={disabled}>
        {label}
      </PrimaryButton>
    </div>
  );
}

function Welcome({
  headingRef,
  resumePending,
  savedStage,
  onStart,
  onResume,
  onRestart,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  resumePending: boolean;
  savedStage: StudioStage;
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}) {
  if (resumePending && savedStage !== "welcome") {
    const label =
      savedStage === "map"
        ? "the tool map"
        : savedStage === "reveal"
          ? "the project layers"
          : savedStage === "playbook"
            ? "your completed playbook"
            : stageLabels[savedStage as LearningStage];

    return (
      <div className="studio-intro-shell">
        <IntroHeader />
        <main className="resume-page">
          <p className="studio-kicker">Welcome back</p>
          <h1 ref={headingRef} tabIndex={-1}>
            You were at <em>{label}.</em>
          </h1>
          <p>
            Your exact choices are still here. Resume with the next unfinished
            action, or begin the redesigned journey again.
          </p>
          <div className="resume-page__actions">
            <PrimaryButton onClick={onResume}>Resume where I left off</PrimaryButton>
            <button type="button" className="studio-secondary" onClick={onRestart}>
              Start again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="studio-intro-shell">
      <IntroHeader />
      <main className="studio-welcome">
        <section className="studio-welcome__copy">
          <p className="studio-kicker">{studioIdentity.descriptor}</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Build your first project with AI—
            <em>from idea to live link.</em>
          </h1>
          <p className="studio-welcome__lede">{studioIdentity.promise}</p>
          <PrimaryButton onClick={onStart}>{studioIdentity.firstAction}</PrimaryButton>
          <ul className="studio-reassurance" aria-label="Experience details">
            {studioIdentity.reassurance.map((item) => (
              <li key={item}>{item}</li>
            ))}
            <li>{studioIdentity.duration}</li>
          </ul>
        </section>

        <aside className="studio-welcome__folio" aria-label="What you will learn">
          <p>ONE COMPLETE ROUTE</p>
          <ol>
            {learningStages.map((stage, index) => (
              <li key={stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {stageLabels[stage]}
              </li>
            ))}
          </ol>
          <b>You leave with a reusable First AI Build Playbook.</b>
        </aside>
      </main>
    </div>
  );
}

function ToolMap({
  headingRef,
  onNext,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  onNext: () => void;
}) {
  return (
    <div className="studio-intro-shell">
      <IntroHeader />
      <main className="tool-map-page">
        <header>
          <p className="studio-kicker">The map before the tools</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Most first projects need <em>three roles—not twenty tools.</em>
          </h1>
          <p>
            Products combine these jobs in different ways. Learn the jobs first,
            and unfamiliar product names become much easier to judge.
          </p>
        </header>

        <ol className="system-map">
          {systemRoles.map((role, index) => (
            <li key={role.id}>
              <span>{index + 1}</span>
              <small>{role.plainName}</small>
              <h2>{role.job}</h2>
              <p>
                <b>Ask:</b> {role.beginnerQuestion}
              </p>
            </li>
          ))}
        </ol>

        <p className="system-map__line">
          <b>AI helps build</b>
          <span aria-hidden="true">→</span>
          <b>the project home remembers</b>
          <span aria-hidden="true">→</span>
          <b>the host publishes</b>
        </p>

        <aside className="runtime-callout">
          <span aria-hidden="true">AI?</span>
          <div>
            <h2>Does the finished project need an AI model?</h2>
            <p>
              Usually not. AI can help build ordinary software. The finished
              product needs an AI API only when its visitors genuinely need
              generated or interpreted responses.
            </p>
          </div>
        </aside>

        <LessonActions label="See the project beneath the surface" onNext={onNext} />
      </main>
    </div>
  );
}

function LayerReveal({
  progress,
  headingRef,
  onChange,
  onNext,
}: {
  progress: StudioProgress;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onChange: (percent: number) => void;
  onNext: () => void;
}) {
  const style = { "--reveal": `${progress.revealPercent}%` } as CSSProperties;

  return (
    <div className="studio-intro-shell">
      <IntroHeader />
      <main className="layer-page">
        <header>
          <p className="studio-kicker">Why the name Pentimento</p>
          <h1 ref={headingRef} tabIndex={-1}>
            The finished page is only <em>the visible surface.</em>
          </h1>
          <p>
            Move the reveal to uncover the brief, files, AI requests, checks, and
            saved versions beneath it. You will rebuild those layers in order.
          </p>
        </header>

        <section className="layer-reveal" style={style}>
          <div className="layer-reveal__under">
            <p>EARLIER LAYERS</p>
            <ol>
              <li>01 · Rough idea and first-version brief</li>
              <li>02 · Project folder, Git, and GitHub</li>
              <li>03 · The request and three build cycles</li>
              <li>04 · Phone, facts, and keyboard checks</li>
              <li>05 · Preview, live version, and recovery</li>
            </ol>
          </div>
          <div className="layer-reveal__surface">
            <ProjectCanvas state="repaired" compact />
          </div>
          <span className="layer-reveal__edge" aria-hidden="true" />
        </section>

        <div className="layer-control">
          <button
            type="button"
            onClick={() => onChange(Math.max(12, progress.revealPercent - 15))}
            aria-label="Reveal more earlier layers"
          >
            ← Earlier layers
          </button>
          <label>
            <span>Visible surface: {progress.revealPercent}%</span>
            <input
              type="range"
              min="12"
              max="88"
              value={progress.revealPercent}
              onChange={(event) => onChange(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            onClick={() => onChange(Math.min(88, progress.revealPercent + 15))}
            aria-label="Reveal more finished surface"
          >
            Finished surface →
          </button>
        </div>

        <p className="layer-page__promise">
          At every stop, you will make one practical decision and add one reusable
          page to your playbook.
        </p>

        <LessonActions label="Begin with the rough idea" onNext={onNext} />
      </main>
    </div>
  );
}

function IdeaStage({
  progress,
  headingRef,
  setProgress,
  onComplete,
}: StageProps) {
  const content = stop("idea");
  const total = repairCafeFeatureDecisions.length;
  const index = Math.min(progress.ideaStep, total);
  const item = repairCafeFeatureDecisions[index];
  const choice = item ? progress.featureDecisions[item.feature] : undefined;
  const finished = index >= total;
  const nowCount = Object.values(progress.featureDecisions).filter(
    (value) => value === "now",
  ).length;
  const laterCount = Object.values(progress.featureDecisions).filter(
    (value) => value === "later",
  ).length;

  function decide(disposition: "now" | "later") {
    if (!item) return;
    setProgress((current) => ({
      ...current,
      featureDecisions: {
        ...current.featureDecisions,
        [item.feature]: disposition,
      },
    }));
  }

  function advance() {
    setProgress((current) => ({
      ...current,
      ideaStep: Math.min(total, current.ideaStep + 1),
    }));
  }

  return (
    <LessonFrame
      step={content.number}
      label={content.navLabel}
      title={content.title}
      explanation={content.explanation}
      headingRef={headingRef}
      takeaway={
        finished ? (
          <>
            <b>{content.artifact.name}</b>
            <p>{content.artifact.usefulAfterLesson}</p>
          </>
        ) : undefined
      }
      deeper={
        <p>
          Accounts, booking, payments, live data, and public AI answers each create
          work for security, privacy, operations, or cost. Postponing them is a
          product decision, not a lack of ambition.
        </p>
      }
    >
      <div className="idea-workbench">
        <aside className="rough-note">
          <span>ORGANIZER’S FIRST NOTE</span>
          <blockquote>{repairCafeRoughIdea.note}</blockquote>
          <p>
            <b>What is missing:</b> one person, one result, trusted facts, and a
            finish line.
          </p>
        </aside>

        {!finished && item ? (
          <section className="feature-sorter" aria-labelledby="feature-title">
            <div className="activity-progress">
              Feature {index + 1} of {total}
            </div>
            <h2 id="feature-title">{item.feature}</h2>
            <p>
              Make your call, then compare it with the worked-example
              recommendation and the work this feature creates.
            </p>
            <div className="feature-sorter__actions">
              <button
                type="button"
                className={choice === "now" ? "is-selected" : ""}
                aria-pressed={choice === "now"}
                onClick={() => decide("now")}
              >
                First version
              </button>
              <button
                type="button"
                className={choice === "later" ? "is-selected" : ""}
                aria-pressed={choice === "later"}
                onClick={() => decide("later")}
              >
                Later
              </button>
            </div>

            {choice && (
              <div className="feature-result" aria-live="polite">
                <b>
                  Worked-example recommendation:{" "}
                  {recommendationLabel(item.decision)}
                </b>
                <p>{item.reason}</p>
                {item.obligations.length > 0 && (
                  <ul>
                    {item.obligations.map((id) => {
                      const obligation = featureObligations.find(
                        (candidate) => candidate.id === id,
                      );
                      return obligation ? (
                        <li key={id}>
                          <b>{obligation.plainName}:</b> {obligation.workAdded}
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
                <button type="button" onClick={advance}>
                  {index + 1 === total ? "See the finished brief" : "Next feature →"}
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="brief-sheet">
            <header>
              <span>FIRST-VERSION BRIEF</span>
              <b>
                Your calls: {nowCount} now · {laterCount} later
              </b>
            </header>
            <p>
              This finished example follows the organizer-approved
              recommendations above. Your calls were a way to expose each
              tradeoff; they do not silently rewrite the approved brief.
            </p>
            <dl>
              {firstVersionBrief.map((field) => (
                <div key={field.id}>
                  <dt>{field.label}</dt>
                  <dd>
                    {Array.isArray(field.repairCafeAnswer)
                      ? field.repairCafeAnswer.join(" · ")
                      : field.repairCafeAnswer}
                  </dd>
                </div>
              ))}
            </dl>
            <p>
              <b>Finished product needs AI?</b> No. Approved information and a
              normal email link complete the visitor’s result.
            </p>
            <LessonActions label="Next: choose where to build" onNext={onComplete} />
          </section>
        )}
      </div>
    </LessonFrame>
  );
}

function ToolsStage({
  progress,
  headingRef,
  setProgress,
  onComplete,
}: StageProps) {
  const content = stop("tools");
  const selected = progress.toolLane;

  return (
    <LessonFrame
      step={content.number}
      label={content.navLabel}
      title={content.title}
      explanation={content.explanation}
      headingRef={headingRef}
      takeaway={
        selected ? (
          <>
            <b>{content.artifact.name}</b>
            <p>
              {selected === "repository"
                ? "Repository-aware agent → GitHub → web host"
                : "Hosted builder → repository export → built-in or separate host"}
            </p>
          </>
        ) : undefined
      }
      deeper={
        <div>
          <p>{runtimeAIExplanation.reason}</p>
          <p>
            The worked lesson uses the repository route because it makes files,
            versions, checks, and recovery visible—not because every beginner must
            choose it.
          </p>
        </div>
      }
    >
      <section className="lane-chooser" aria-labelledby="lane-title">
        <header>
          <p>Two legitimate starting lanes</p>
          <h2 id="lane-title">Choose the tradeoff you want to learn from.</h2>
        </header>

        <details className="tool-name-decoder">
          <summary>
            First, see where names like ChatGPT, Codex, Cursor, Lovable, and
            Replit fit.
          </summary>
          <p>
            Product features overlap and change. Sort each product by the job
            you need now; do not collect one of every kind. Examples checked in
            July 2026.
          </p>
          <div>
            {toolCategories.map((category) => (
              <article key={category.id}>
                <span>{category.label}</span>
                <h3>{category.examples.join(" · ")}</h3>
                <p>{category.beginnerGuidance}</p>
              </article>
            ))}
          </div>
        </details>

        <div className="lane-chooser__grid">
          {startingLanes.map((lane) => (
            <article
              key={lane.id}
              className={selected === lane.id ? "lane-card is-selected" : "lane-card"}
            >
              <span>{lane.label}</span>
              <h3>{lane.plainTitle}</h3>
              <p className="lane-card__technical">
                <span>Tool-language route</span>
                {lane.route}
              </p>
              <p>{lane.chooseWhen}</p>
              <dl>
                <div>
                  <dt>Watch for</dt>
                  <dd>{lane.beCarefulAbout}</dd>
                </div>
                <div>
                  <dt>First action</dt>
                  <dd>{lane.firstAction}</dd>
                </div>
              </dl>
              <button
                type="button"
                aria-pressed={selected === lane.id}
                onClick={() =>
                  setProgress((current) => ({
                    ...current,
                    toolLane: lane.id as ToolLane,
                  }))
                }
              >
                {selected === lane.id
                  ? `Selected: ${lane.plainTitle}`
                  : `Choose: ${lane.plainTitle}`}
              </button>
            </article>
          ))}
        </div>

        {selected && (
          <aside className="lane-decision" aria-live="polite">
            <b>
              Your playbook will use the{" "}
              {selected === "repository" ? "repository" : "hosted"} lane.
            </b>
            <p>
              This changes setup guidance, not the project lifecycle: define,
              build, inspect, check, save, preview, and release still apply.
            </p>
            <p>
              {selected === "hosted"
                ? "Next, the project-home lesson shows what your builder must preserve or export, even when its interface hides the files and version history."
                : "Next, the project-home lesson shows the folder, Git history, and GitHub copy you will work with directly."}
            </p>
            <p className="lane-decision__example">
              <span>One reasonable example stack</span>
              <b>
                {selected === "hosted"
                  ? "Replit Agent, Lovable, or v0 → GitHub connection or export → built-in or separate host"
                  : "Codex, Cursor Agent, or Claude Code → Git + GitHub → separate web host"}
              </b>
            </p>
          </aside>
        )}

        <LessonActions
          label="Next: give the project a safe home"
          onNext={onComplete}
          disabled={!selected}
        />
      </section>
    </LessonFrame>
  );
}

function HomeStage({
  progress,
  headingRef,
  setProgress,
  onComplete,
}: StageProps) {
  const content = stop("home");
  const complete = progress.foundationStep >= projectHomeSteps.length;
  const current = projectHomeSteps[progress.foundationStep];
  const visibleFileCount =
    progress.foundationStep < 2
      ? 0
      : progress.foundationStep === 2
        ? 2
        : repairCafeProjectFiles.length;
  const visibleFiles = repairCafeProjectFiles.slice(0, visibleFileCount);

  function performStep() {
    setProgress((state) => ({
      ...state,
      foundationStep: Math.min(projectHomeSteps.length, state.foundationStep + 1),
    }));
  }

  return (
    <LessonFrame
      step={content.number}
      label={content.navLabel}
      title={content.title}
      explanation={content.explanation}
      headingRef={headingRef}
      takeaway={
        complete ? (
          <>
            <b>{content.artifact.name}</b>
            <p>Folder → Git history → GitHub copy, with private files excluded.</p>
          </>
        ) : undefined
      }
      deeper={
        <p>
          A private repository is still not a secret manager. If a credential is
          ever exposed, revoke or rotate it first; merely deleting the line does
          not undo access or historical copies.
        </p>
      }
    >
      <div className="home-workbench">
        {progress.toolLane === "hosted" && (
          <aside
            className="runtime-callout"
            style={{ gridColumn: "1 / -1", marginTop: 0 }}
          >
            <span aria-hidden="true">HOSTED</span>
            <div>
              <h2>Look for the same foundation behind the builder.</h2>
              <p>
                Your tool may create the folder and saved versions for you.
                Confirm where its files live, how to connect or export them to
                GitHub, and how private settings stay out of that copy.
              </p>
            </div>
          </aside>
        )}
        <section className="file-tree" aria-label="Repair Café project files">
          <header>
            <span>repair-cafe/</span>
            <b>{complete ? "Remote copy ready" : "Building foundation"}</b>
          </header>
          <ul>
            {visibleFiles.map((file) => (
              <li key={file.path} className={!file.safeToCommit ? "is-private" : ""}>
                <code>{file.path}</code>
                <span>{file.job}</span>
                <b>{file.safeToCommit ? "safe to review and save" : "keep private"}</b>
              </li>
            ))}
          </ul>
          {!visibleFiles.length && <p>No files yet.</p>}
        </section>

        <section className="foundation-step" aria-live="polite">
          {!complete && current ? (
            <>
              <span>
                Foundation step {current.order} of {projectHomeSteps.length}
              </span>
              <h2>{current.action}</h2>
              <p>
                <b>Check:</b> {current.check}
              </p>
              <button type="button" onClick={performStep}>
                Do this simulated setup step →
              </button>
            </>
          ) : (
            <>
              <span>FOUNDATION COMPLETE</span>
              <h2>The project now has memory outside the AI conversation.</h2>
              <p>
                The folder holds files. Git records named versions. GitHub keeps a
                remote copy. The ignored environment file never enters history.
              </p>
              <div className="secret-rule">
                <b>No real key belongs in a prompt, screenshot, public file, or commit.</b>
                <code>.env.local → blocked by .gitignore</code>
              </div>
              <LessonActions label="Next: give AI its first task" onNext={onComplete} />
            </>
          )}
        </section>
      </div>
    </LessonFrame>
  );
}

function AskStage({
  progress,
  headingRef,
  setProgress,
  onComplete,
}: StageProps) {
  const content = stop("ask");
  const groupIndex = Math.min(progress.promptParts.length, promptGroups.length);
  const current = promptGroups[groupIndex];
  const assembled = groupIndex >= promptGroups.length;

  function addGroup() {
    if (!current) return;
    setProgress((state) => ({
      ...state,
      promptParts: [...state.promptParts, current.id],
    }));
  }

  return (
    <LessonFrame
      step={content.number}
      label={content.navLabel}
      title={content.title}
      explanation={content.explanation}
      headingRef={headingRef}
      takeaway={
        progress.planApproved ? (
          <>
            <b>{content.artifact.name}</b>
            <p>A copyable planning request that stops before file changes.</p>
          </>
        ) : undefined
      }
      deeper={
        <p>
          The prompt is a small work agreement, not a magic sentence. A short,
          well-grounded request is better than a long request filled with role-play
          or style words that do not change the finish line.
        </p>
      }
    >
      <div className="prompt-lab">
        <section className="prompt-before">
          <span>VAGUE REQUEST</span>
          <blockquote>{weakFirstPrompt}</blockquote>
          <ul>
            <li>No source of truth</li>
            <li>No first visitor</li>
            <li>No boundary</li>
            <li>No review point</li>
          </ul>
        </section>

        <section className="prompt-builder" aria-live="polite">
          <header>
            <span>BUILDABLE REQUEST</span>
            <b>
              {groupIndex} of {promptGroups.length} parts
            </b>
          </header>

          {!assembled && current ? (
            <div className="prompt-builder__step">
              <small>ADD NEXT</small>
              <h2>{current.label}</h2>
              {current.parts.map((partId) => {
                const part = buildablePromptParts.find((item) => item.id === partId);
                return part ? (
                  <p key={part.id}>
                    <b>{part.label}:</b> {part.repairCafeText}
                  </p>
                ) : null;
              })}
              <button type="button" onClick={addGroup}>
                Add this useful context →
              </button>
            </div>
          ) : (
            <div className="prompt-complete">
              <pre>{completePlanningPrompt}</pre>
              {!progress.planApproved ? (
                <button
                  type="button"
                  onClick={() =>
                    setProgress((state) => ({ ...state, planApproved: true }))
                  }
                >
                  Approve the three-cycle plan
                </button>
              ) : (
                <p className="verified-note">
                  <b>Plan approved.</b> AI may implement cycle one only, then stop
                  for review.
                </p>
              )}
            </div>
          )}

          {groupIndex > 0 && !assembled && (
            <p className="prompt-builder__result">
              <b>What changed:</b> {promptGroups[groupIndex - 1]?.result}
            </p>
          )}
        </section>
      </div>

      {progress.planApproved && (
        <LessonActions label="Next: build in small visible cycles" onNext={onComplete} />
      )}
    </LessonFrame>
  );
}

function BuildStage({
  progress,
  headingRef,
  setProgress,
  onComplete,
}: StageProps) {
  const content = stop("build");
  const complete = progress.buildCycle >= repairCafeBuildCycles.length;
  const cycle = repairCafeBuildCycles[progress.buildCycle];
  const phaseIndex = phaseOrder.indexOf(progress.buildPhase);

  function advancePhase() {
    setProgress((state) => {
      const index = phaseOrder.indexOf(state.buildPhase);
      if (index < phaseOrder.length - 1) {
        return { ...state, buildPhase: phaseOrder[index + 1] };
      }
      return {
        ...state,
        buildCycle: Math.min(repairCafeBuildCycles.length, state.buildCycle + 1),
        buildPhase: "ask",
      };
    });
  }

  const previewState =
    complete || (progress.buildCycle >= 2 && phaseIndex >= 1)
      ? "broken"
      : progress.buildCycle === 0 && phaseIndex < 2
        ? "blank"
        : "first";

  return (
    <LessonFrame
      step={content.number}
      label={content.navLabel}
      title={content.title}
      explanation={content.explanation}
      headingRef={headingRef}
      takeaway={
        complete ? (
          <>
            <b>{content.artifact.name}</b>
            <p>Three named versions, each with a request, changed files, checks, and result.</p>
          </>
        ) : undefined
      }
      deeper={
        <p>
          You do not need to understand every line before you can inspect useful
          signals: which files changed, which public words appeared, whether new
          packages or network calls were added, what the preview does, and which
          commands actually passed.
        </p>
      }
    >
      {!complete && cycle ? (
        <div className="build-studio">
          <header className="build-studio__cycle">
            <span>
              Cycle {cycle.number} of {repairCafeBuildCycles.length}
            </span>
            <h2>{cycle.title}</h2>
            <p>{cycle.visibleResult}</p>
          </header>

          <ol className="build-loop" aria-label="Build loop">
            {buildLoop.map((item, index) => (
              <li
                key={item.verb}
                className={
                  index < phaseIndex
                    ? "is-complete"
                    : index === phaseIndex
                      ? "is-current"
                      : ""
                }
              >
                <span>{index < phaseIndex ? "✓" : index + 1}</span>
                {item.verb}
              </li>
            ))}
          </ol>

          <div className="build-studio__panes">
            <section className="agent-pane">
              <header>
                <span>AI CONVERSATION</span>
                <b>{progress.buildPhase}</b>
              </header>
              <p>
                {progress.buildPhase === "ask"
                  ? cycle.request
                  : `AI reports: “Cycle ${cycle.number} is complete.”`}
              </p>
              {phaseIndex >= 1 && (
                <ul>
                  {cycle.expectedFiles.map((file) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              )}
            </section>

            <section className="change-pane">
              <header>
                <span>WHAT CHANGED</span>
                <b>{phaseIndex >= 1 ? cycle.expectedFiles.length : 0} files</b>
              </header>
              {phaseIndex >= 1 ? (
                <ul>
                  {cycle.inspectWithoutReadingCode.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No files change until this bounded request is approved.</p>
              )}
              {phaseIndex >= 3 && (
                <p className="verified-note">
                  <b>Observed check:</b> {cycle.check.join(" ")}
                </p>
              )}
              {phaseIndex >= 4 && (
                <code>{cycle.save.message}</code>
              )}
            </section>

            <ProjectCanvas state={previewState} compact />
          </div>

          <div className="build-studio__action">
            <p>
              <b>{buildLoop[phaseIndex]?.verb}:</b>{" "}
              {buildLoop[phaseIndex]?.learnerAction}
            </p>
            <button type="button" onClick={advancePhase}>
              {progress.buildPhase === "save"
                ? `Save ${cycle.artifact} →`
                : `${phaseOrder[phaseIndex + 1] ?? "save"} →`}
            </button>
          </div>
        </div>
      ) : (
        <section className="cycle-summary">
          <span>THREE RECOVERABLE VERSIONS</span>
          <h2>The page is polished. Now try to prove the visitor path works.</h2>
          <ol>
            {repairCafeBuildCycles.map((cycle) => (
              <li key={cycle.id}>
                <b>{cycle.artifact}</b>
                <span>{cycle.save.message}</span>
              </li>
            ))}
          </ol>
          <p>
            The final preview deliberately contains realistic defects. That is
            where inspection becomes more useful than another AI assurance.
          </p>
          <LessonActions label="Next: check the project yourself" onNext={onComplete} />
        </section>
      )}
    </LessonFrame>
  );
}

function CheckStage({
  progress,
  headingRef,
  setProgress,
  onComplete,
}: StageProps) {
  const content = stop("check");
  const nextDefect = repairCafeDefects.find(
    (defect) => !progress.checksRun.includes(defect.id),
  );
  const allFound = repairCafeDefects.every((defect) =>
    progress.checksRun.includes(defect.id),
  );

  function runCheck() {
    if (!nextDefect) return;
    setProgress((state) => ({
      ...state,
      checksRun: [...state.checksRun, nextDefect.id],
    }));
  }

  return (
    <LessonFrame
      step={content.number}
      label={content.navLabel}
      title={content.title}
      explanation={content.explanation}
      headingRef={headingRef}
      takeaway={
        progress.repairApplied ? (
          <>
            <b>{content.artifact.name}</b>
            <p>Observed → reproduce → expected → preserve → repair → recheck.</p>
          </>
        ) : undefined
      }
      deeper={
        <p>
          A screenshot supports one visual state. A production build supports
          buildability. Automated tests support only the behavior they encode. The
          visitor path still needs to be tried in the environment that matters.
        </p>
      }
    >
      <div className="check-lab">
        <ProjectCanvas state={progress.repairApplied ? "repaired" : "broken"} />

        {!allFound && nextDefect ? (
          <section className="check-lens">
            <span>
              LENS {progress.checksRun.length + 1} OF {repairCafeDefects.length}
            </span>
            <h2>{nextDefect.friendlyName}</h2>
            <ol>
              {nextDefect.reproduce.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <button type="button" onClick={runCheck}>
              Run this simulated check
            </button>
          </section>
        ) : !progress.repairPrepared ? (
          <section className="defect-report">
            <header>
              <span>WHAT THE CHECKS OBSERVED</span>
              <b>{repairCafeDefects.length} reproducible defects</b>
            </header>
            {repairCafeDefects.map((defect) => (
              <article key={defect.id}>
                <h3>{defect.friendlyName}</h3>
                <p>
                  <b>Observed:</b> {defect.observed}
                </p>
                <p>
                  <b>Expected:</b> {defect.expected}
                </p>
                <small>{defect.consequence}</small>
              </article>
            ))}
            <button
              type="button"
              onClick={() =>
                setProgress((state) => ({ ...state, repairPrepared: true }))
              }
            >
              Assemble the bounded repair request →
            </button>
          </section>
        ) : !progress.repairApplied ? (
          <section className="repair-prompt">
            <header>
              <span>REPAIR REQUEST</span>
              <b>Smallest relevant change</b>
            </header>
            <pre>{completeRepairPrompt}</pre>
            <button
              type="button"
              onClick={() =>
                setProgress((state) => ({
                  ...state,
                  repairApplied: true,
                  versionFocus: 4,
                }))
              }
            >
              Apply the simulated repair and rerun checks
            </button>
          </section>
        ) : (
          <section className="version-review">
            <header>
              <span>REPAIRED AND RECHECKED</span>
              <h2>One exact version is now supported by current checks.</h2>
              <p>
                Approved facts, complete path, 390px layout, keyboard use,
                typecheck, tests, and production build all pass for V4.
              </p>
            </header>
            <div
              className="version-ribbon"
              role="group"
              aria-label="Project versions"
            >
              {versionRibbon.slice(0, 5).map((version, index) => (
                <button
                  type="button"
                  key={version.id}
                  className={progress.versionFocus === index ? "is-selected" : ""}
                  aria-pressed={progress.versionFocus === index}
                  onClick={() =>
                    setProgress((state) => ({ ...state, versionFocus: index }))
                  }
                >
                  <span>{index + 1}</span>
                  <b>{version.label}</b>
                  <small>{version.state}</small>
                </button>
              ))}
            </div>
            <p className="version-detail">
              {versionRibbon[progress.versionFocus]?.contains}
            </p>
            <LessonActions label="Next: move V4 toward a live link" onNext={onComplete} />
          </section>
        )}
      </div>
    </LessonFrame>
  );
}

function LiveStage({
  progress,
  headingRef,
  setProgress,
  onComplete,
}: StageProps) {
  const content = stop("live");
  const complete = progress.releaseStep >= releaseStages.length;
  const current = releaseStages[progress.releaseStep];

  function advance() {
    setProgress((state) => ({
      ...state,
      releaseStep: Math.min(releaseStages.length, state.releaseStep + 1),
    }));
  }

  return (
    <LessonFrame
      step={content.number}
      label={content.navLabel}
      title={content.title}
      explanation={content.explanation}
      headingRef={headingRef}
      takeaway={
        complete ? (
          <>
            <b>{content.artifact.name}</b>
            <p>Exact version, public check, known limits, and recovery instruction.</p>
          </>
        ) : undefined
      }
      deeper={
        <p>
          A repository URL is not the application URL. A successful deployment
          confirms that files moved to a host; it does not confirm that a new
          visitor can complete the public path.
        </p>
      }
    >
      <div className="release-room">
        <ol className="release-pipeline" aria-label="Release stages">
          {releaseStages.map((stage, index) => (
            <li
              key={stage.id}
              className={
                index < progress.releaseStep
                  ? "is-complete"
                  : index === progress.releaseStep
                    ? "is-current"
                    : ""
              }
            >
              <span>{index < progress.releaseStep ? "✓" : index + 1}</span>
              <b>{stage.label}</b>
            </li>
          ))}
        </ol>

        {!complete && current ? (
          <section className="release-stage">
            <span>{current.label.toUpperCase()}</span>
            <h2>{current.plainMeaning}</h2>
            <p>
              <b>Do now:</b> {current.learnerAction}
            </p>
            <dl>
              <div>
                <dt>Ready when</dt>
                <dd>{current.readyWhen}</dd>
              </div>
              <div>
                <dt>Common mistake</dt>
                <dd>{current.commonMistake}</dd>
              </div>
            </dl>
            <button type="button" onClick={advance}>
              Record: {current.artifact} →
            </button>
          </section>
        ) : (
          <section className="release-card">
            <header>
              <span>SIMULATED RELEASE CARD</span>
              <b>Public path checked</b>
            </header>
            <dl>
              <div>
                <dt>Project</dt>
                <dd>{exampleReleaseCard.project}</dd>
              </div>
              <div>
                <dt>Released version</dt>
                <dd>{exampleReleaseCard.releasedVersion}</dd>
              </div>
              <div>
                <dt>Public link</dt>
                <dd>{exampleReleaseCard.publicUrl}</dd>
              </div>
              <div>
                <dt>Public check</dt>
                <dd>{exampleReleaseCard.publicCheck}</dd>
              </div>
              <div>
                <dt>Recovery</dt>
                <dd>{exampleReleaseCard.recovery}</dd>
              </div>
            </dl>
            <LessonActions label="Next: make the first live update" onNext={onComplete} />
          </section>
        )}
      </div>
    </LessonFrame>
  );
}

function ImproveStage({
  progress,
  headingRef,
  setProgress,
  onComplete,
}: StageProps) {
  const content = stop("improve");
  const complete = progress.improveStep >= improveActions.length;
  const current = improveActions[progress.improveStep];

  function advance() {
    setProgress((state) => ({
      ...state,
      improveStep: Math.min(improveActions.length, state.improveStep + 1),
    }));
  }

  return (
    <LessonFrame
      step={content.number}
      label={content.navLabel}
      title={content.title}
      explanation={content.explanation}
      headingRef={headingRef}
      takeaway={
        complete ? (
          <>
            <b>{content.artifact.name}</b>
            <p>One approved source change, bounded request, repeated checks, and a new version.</p>
          </>
        ) : undefined
      }
      deeper={
        <p>
          If a request introduces identity, money, private data, live operations,
          or runtime AI, it deserves its own first-version decision rather than
          being hidden inside a “small improvement.”
        </p>
      }
    >
      <div className="improve-studio">
        <aside className="change-request">
          <span>POST-LAUNCH REQUEST</span>
          <blockquote>{repairCafePostLaunchChange.request}</blockquote>
          <p>{repairCafePostLaunchChange.decision}</p>
        </aside>

        <ProjectCanvas state={progress.improveStep >= 2 ? "updated" : "repaired"} compact />

        {!complete && current ? (
          <section className="improve-action">
            <span>
              UPDATE STEP {progress.improveStep + 1} OF {improveActions.length}
            </span>
            <h2>{current.title}</h2>
            <p>{current.detail}</p>
            {progress.improveStep === 1 && (
              <pre>{repairCafePostLaunchChange.focusedPrompt}</pre>
            )}
            {progress.improveStep === 2 && (
              <ul>
                {repairCafePostLaunchChange.checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            )}
            <button type="button" onClick={advance}>
              Complete this update step →
            </button>
          </section>
        ) : (
          <section className="update-complete">
            <span>NEW RECOVERABLE VERSION</span>
            <h2>The update changed one approved fact—not the whole project.</h2>
            <p>{repairCafePostLaunchChange.whyItStaysSmall}</p>
            <LessonActions label="Open my First AI Build Playbook" onNext={onComplete} />
          </section>
        )}
      </div>
    </LessonFrame>
  );
}

type StageProps = {
  progress: StudioProgress;
  headingRef: RefObject<HTMLHeadingElement | null>;
  setProgress: React.Dispatch<React.SetStateAction<StudioProgress>>;
  onComplete: () => void;
};

function PlaybookContent({
  completedStages,
  toolLane,
  onCopy,
  copyStatus,
  compact = false,
}: {
  completedStages: readonly LearningStage[];
  toolLane: ToolLane | null;
  onCopy: (value: string, label: string) => void;
  copyStatus: string;
  compact?: boolean;
}) {
  const earnedCards = useMemo(() => {
    const mapping: Record<LearningStage, readonly string[]> = {
      idea: ["first-version"],
      tools: ["tool-choice"],
      home: ["project-home", "secret-safety"],
      ask: ["planning-prompt"],
      build: ["small-change", "inspect"],
      check: ["repair"],
      live: ["release"],
      improve: ["post-launch"],
    };
    return new Set(completedStages.flatMap((stage) => mapping[stage]));
  }, [completedStages]);

  const markdown = useMemo(
    () =>
      [
        "# My First AI Build Playbook",
        "",
        `Starting lane: ${
          toolLane === "hosted"
            ? "Hosted builder"
            : toolLane === "repository"
              ? "Repository-aware agent"
              : "Choose after defining the first version"
        }`,
        "",
        ...playbookCards.flatMap((card) => [
          `## ${card.title}`,
          "",
          `Use when: ${card.useWhen}`,
          "",
          ...card.exactActions.map((action) => `- ${action}`),
          "",
          `Template: ${card.reusableTemplate}`,
          "",
          `Expected result: ${card.expectedResult}`,
          "",
          `Prevents: ${card.prevents}`,
          "",
        ]),
        "## Plain-language glossary",
        "",
        ...studioGlossary.flatMap((entry) => [
          `### ${entry.term}`,
          "",
          entry.meaning,
          "",
          `Use it when: ${entry.useItWhen}`,
          "",
        ]),
        "## First seven days",
        "",
        ...firstSevenDays.map(
          (day) => `- Day ${day.day}: ${day.action} — ${day.artifact}`,
        ),
      ].join("\n"),
    [toolLane],
  );

  return (
    <div className={compact ? "playbook playbook--compact" : "playbook"}>
      <header className="playbook__header">
        <div>
          <p className="studio-kicker">Keep this beside any AI coding tool</p>
          <h2>First AI Build Playbook</h2>
          <p>
            Practical templates are available from the beginning. Completed
            lessons mark the cards you have already practiced.
          </p>
        </div>
        <button type="button" onClick={() => onCopy(markdown, "Complete playbook")}>
          Copy complete playbook
        </button>
      </header>

      <p className="copy-status" role="status" aria-live="polite">
        {copyStatus}
      </p>

      <div className="playbook__cards">
        {playbookCards.map((card) => (
          <article
            key={card.id}
            className={earnedCards.has(card.id) ? "playbook-card is-practiced" : "playbook-card"}
          >
            <header>
              <span>{earnedCards.has(card.id) ? "Practiced" : "Available now"}</span>
              <h3>{card.title}</h3>
            </header>
            <p>
              <b>Use when:</b> {card.useWhen}
            </p>
            <ol>
              {card.exactActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ol>
            <details>
              <summary>Worked example and blank template</summary>
              <p>
                <b>Repair Café:</b> {card.completedExample}
              </p>
              <pre>{card.reusableTemplate}</pre>
              <p>
                <b>Result:</b> {card.expectedResult}
              </p>
              <p>
                <b>Prevents:</b> {card.prevents}
              </p>
            </details>
            <button
              type="button"
              onClick={() => onCopy(card.reusableTemplate, card.title)}
            >
              Copy blank template
            </button>
          </article>
        ))}
      </div>

      <details className="playbook-glossary">
        <summary>
          <span>Plain-language glossary</span>
          <b>{studioGlossary.length} terms to look up when a tool assumes you know them</b>
        </summary>
        <dl>
          {studioGlossary.map((entry) => (
            <div key={entry.term}>
              <dt>{entry.term}</dt>
              <dd>
                <p>{entry.meaning}</p>
                <small>
                  <b>Use it when:</b> {entry.useItWhen}
                </small>
              </dd>
            </div>
          ))}
        </dl>
      </details>

      {!compact && (
        <section className="seven-day-plan">
          <header>
            <span>A REALISTIC START</span>
            <h3>Your first seven days</h3>
          </header>
          <ol>
            {firstSevenDays.map((day) => (
              <li key={day.day}>
                <span>Day {day.day}</span>
                <div>
                  <b>{day.action}</b>
                  <small>{day.artifact}</small>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

const mirrorFieldGroups: readonly {
  key: keyof MirrorDraft;
  label: string;
  help: string;
  placeholder: string;
  list?: boolean;
  maximum: number;
}[] = [
  {
    key: "person",
    label: "One person",
    help: "Who should this first version help?",
    placeholder: "A first-time organizer who…",
    maximum: 180,
  },
  {
    key: "situation",
    label: "Their situation",
    help: "Where are they, and what are they trying to decide?",
    placeholder: "They are checking from a phone and need to…",
    maximum: 240,
  },
  {
    key: "usefulResult",
    label: "Useful result",
    help: "What becomes possible after using the project?",
    placeholder: "They can decide…",
    maximum: 240,
  },
  {
    key: "completePath",
    label: "One complete path",
    help: "Write the beginning, middle, and end.",
    placeholder: "Open… → understand… → do…",
    maximum: 360,
  },
  {
    key: "trustedFacts",
    label: "Trusted facts",
    help: "One approved fact or source per line.",
    placeholder: "Approved date\nApproved place\nSource owner",
    list: true,
    maximum: 1_200,
  },
  {
    key: "mustHave",
    label: "Must be in version one",
    help: "One observable behavior per line.",
    placeholder: "Readable phone layout\nWorking contact action",
    list: true,
    maximum: 1_200,
  },
  {
    key: "notNow",
    label: "Not now",
    help: "One tempting system or feature per line.",
    placeholder: "Accounts\nPayments\nRuntime AI",
    list: true,
    maximum: 1_200,
  },
  {
    key: "doneWhen",
    label: "Finish line",
    help: "What can another person repeat to check it?",
    placeholder: "Complete when someone can…",
    maximum: 360,
  },
] as const;

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim().slice(0, 180))
    .filter((item) => item.length >= 2)
    .slice(0, 8);
}

function TeachingMirror({
  draft,
  toolLane,
  setProgress,
}: {
  draft: MirrorDraft;
  toolLane: ToolLane;
  setProgress: React.Dispatch<React.SetStateAction<StudioProgress>>;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [mode, setMode] = useState<"demo" | "live" | null>(null);
  const [result, setResult] = useState<TeachingMirrorResult | null>(null);
  const [error, setError] = useState("");
  const sessionIdRef = useRef("");

  const complete =
    draft.person.trim().length >= 2 &&
    draft.situation.trim().length >= 2 &&
    draft.usefulResult.trim().length >= 2 &&
    draft.completePath.trim().length >= 2 &&
    lines(draft.trustedFacts).length > 0 &&
    lines(draft.mustHave).length > 0 &&
    lines(draft.notNow).length > 0 &&
    draft.doneWhen.trim().length >= 2;

  function updateDraft(key: keyof MirrorDraft, value: string) {
    setProgress((current) => ({
      ...current,
      mirrorDraft: {
        ...current.mirrorDraft,
        [key]: value,
      },
    }));
    if (status !== "idle") {
      setStatus("idle");
      setMode(null);
      setResult(null);
      setError("");
    }
  }

  function loadExample() {
    setProgress((current) => ({
      ...current,
      mirrorDraft: { ...mirrorExampleDraft },
    }));
    setStatus("idle");
    setMode(null);
    setResult(null);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!complete || status === "loading") return;

    setStatus("loading");
    setError("");
    setResult(null);

    try {
      if (!sessionIdRef.current) {
        sessionIdRef.current = window.crypto.randomUUID();
      }

      const response = await fetch("/api/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          toolLane,
          firstVersionBrief: {
            person: draft.person.trim(),
            situation: draft.situation.trim(),
            usefulResult: draft.usefulResult.trim(),
            completePath: draft.completePath.trim(),
            trustedFacts: lines(draft.trustedFacts),
            mustHave: lines(draft.mustHave),
            notNow: lines(draft.notNow),
            doneWhen: draft.doneWhen.trim(),
          },
        }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || typeof payload !== "object" || payload === null) {
        throw new Error("The reflection could not be prepared.");
      }

      const body = payload as { mode?: unknown; result?: unknown };
      const parsed = TeachingMirrorResultSchema.safeParse(body.result);
      if (!parsed.success) {
        throw new Error("The reflection returned an unexpected format.");
      }

      setMode(body.mode === "live" ? "live" : "demo");
      setResult(parsed.data);
      setStatus("ready");
    } catch {
      setStatus("error");
      setError(
        "The Teaching Mirror is unavailable right now. Your brief is still saved in this browser, and the main lesson remains complete.",
      );
    }
  }

  return (
    <details className="teaching-mirror">
      <summary>
        <span>Optional · GPT-5.6 Teaching Mirror</span>
        <b>Try the method on your own idea</b>
        <small>
          It asks useful questions about your brief. It does not grade, build,
          publish, or control your progress.
        </small>
      </summary>

      <div className="teaching-mirror__inside">
        <header>
          <div>
            <p className="studio-kicker">Transfer, not another quiz</p>
            <h2>Write the brief before choosing features or tools.</h2>
            <p>
              Replace the lesson example with an idea you care about. The mirror
              will surface assumptions, a possible postponement, the honest tool
              tradeoff, and three next moves.
            </p>
          </div>
          <button type="button" onClick={loadExample}>
            Load a tiny example
          </button>
        </header>

        <form onSubmit={submit}>
          <div className="teaching-mirror__fields">
            {mirrorFieldGroups.map((field) => (
              <label key={field.key}>
                <span>{field.label}</span>
                <small>{field.help}</small>
                <textarea
                  value={draft[field.key]}
                  placeholder={field.placeholder}
                  rows={field.list ? 4 : 3}
                  maxLength={field.maximum}
                  onChange={(event) => updateDraft(field.key, event.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="teaching-mirror__consent">
            <p>
              Only this brief and your{" "}
              {toolLane === "repository" ? "repository" : "hosted-builder"} lane
              are sent when you press the button. No project files or progress
              history are attached automatically. Do not type a real name,
              private fact, password, API key, or private link into these fields.
            </p>
            <button type="submit" disabled={!complete || status === "loading"}>
              {status === "loading"
                ? "Preparing the reflection…"
                : "Ask the Teaching Mirror"}
            </button>
          </div>
        </form>

        <p className="teaching-mirror__status" role="status" aria-live="polite">
          {!complete && status === "idle"
            ? "Complete all eight short fields to make the reflection specific."
            : error}
        </p>

        {result && status === "ready" && (
          <section className="mirror-result" aria-labelledby="mirror-result-title">
            <header>
              <span>{mode === "live" ? "GPT-5.6 reflection" : "Authored practice reflection"}</span>
              <h3 id="mirror-result-title">Questions and next moves—not a score.</h3>
            </header>

            <article className="mirror-result__strength">
              <span>Clear strength</span>
              <p>{result.clearStrength}</p>
            </article>

            <article>
              <span>Two assumptions to resolve</span>
              <ol>
                {result.unresolvedAssumptions.map((assumption) => (
                  <li key={assumption}>{assumption}</li>
                ))}
              </ol>
            </article>

            <article>
              <span>Candidate to postpone</span>
              <h4>{result.featureToPostpone.feature}</h4>
              <p>{result.featureToPostpone.reason}</p>
            </article>

            <article>
              <span>Your tool-lane tradeoff</span>
              <p>{result.toolTradeoff}</p>
            </article>

            <article className="mirror-result__moves">
              <span>Next three moves</span>
              <ol>
                {result.nextMoves.map((move) => (
                  <li key={move}>{move}</li>
                ))}
              </ol>
            </article>

            <p>
              {mode === "live"
                ? "Generated by GPT-5.6 from only the brief above. Review every inference before acting."
                : "The live model was unavailable or rate-limited, so Pentimento used its authored fallback. Your route and playbook never depend on model availability."}
            </p>
          </section>
        )}
      </div>
    </details>
  );
}

function Completion({
  progress,
  headingRef,
  setProgress,
  onNavigate,
  onOpenPlaybook,
  onRestart,
  onCopy,
  copyStatus,
}: {
  progress: StudioProgress;
  headingRef: RefObject<HTMLHeadingElement | null>;
  setProgress: React.Dispatch<React.SetStateAction<StudioProgress>>;
  onNavigate: (stage: LearningStage) => void;
  onOpenPlaybook: () => void;
  onRestart: () => void;
  onCopy: (value: string, label: string) => void;
  copyStatus: string;
}) {
  useEffect(() => {
    setProgress((state) =>
      state.finished ? state : { ...state, finished: true },
    );
  }, [setProgress]);

  return (
    <JourneyShell
      currentStage="improve"
      completedStages={learningStages}
      onNavigate={onNavigate}
      onOpenPlaybook={onOpenPlaybook}
      onRestart={onRestart}
    >
      <section className="completion-page">
        <header>
          <p className="studio-kicker">The first complete route</p>
          <h1 ref={headingRef} tabIndex={-1}>
            You now know <em>where to start.</em>
          </h1>
          <p>
            You followed one project from a rough idea through tool choice,
            files, AI requests, small build cycles, checks, recovery, a public
            link, and the first update.
          </p>
        </header>

        <blockquote>
          “I know what each tool does, what to ask AI, how to check the work, and
          how one saved version becomes a live project.”
        </blockquote>

        <TeachingMirror
          draft={progress.mirrorDraft}
          toolLane={progress.toolLane ?? "repository"}
          setProgress={setProgress}
        />

        <PlaybookContent
          completedStages={learningStages}
          toolLane={progress.toolLane}
          onCopy={onCopy}
          copyStatus={copyStatus}
        />
      </section>
    </JourneyShell>
  );
}

export function PentimentoStudio() {
  const [progress, setProgress] = useState<StudioProgress>(initialStudioProgress);
  const [hydrated, setHydrated] = useState(false);
  const [resumePending, setResumePending] = useState(false);
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const appRootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restartCancelRef = useRef<HTMLButtonElement>(null);
  const focusedViewRef = useRef("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STUDIO_STORAGE_KEY);
      if (saved) {
        const restored = parseStudioProgress(JSON.parse(saved));
        if (restored) {
          setProgress(restored);
          setResumePending(restored.started && restored.stage !== "welcome");
        }
      }
    } catch {
      try {
        window.localStorage.removeItem(STUDIO_STORAGE_KEY);
      } catch {
        // Storage can be entirely unavailable in hardened browser contexts.
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // The authored lesson remains usable when storage is unavailable.
    }
  }, [hydrated, progress]);

  useEffect(() => {
    if (!hydrated || playbookOpen || restartOpen) return;
    const viewKey = resumePending ? `resume:${progress.stage}` : progress.stage;
    if (focusedViewRef.current === viewKey) return;
    focusedViewRef.current = viewKey;

    const frame = window.requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hydrated, playbookOpen, progress.stage, restartOpen, resumePending]);

  function moveTo(stage: StudioStage) {
    setResumePending(false);
    setProgress((state) => ({ ...state, started: true, stage }));
  }

  function complete(stage: LearningStage) {
    setProgress((state) => completeLearningStage(state, stage, nextStage[stage]));
  }

  function navigate(stage: LearningStage) {
    if (
      progress.stage === stage ||
      progress.completedStages.includes(stage)
    ) {
      moveTo(stage);
    }
  }

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopyStatus(`${label} copied.`);
    window.setTimeout(() => setCopyStatus(""), 2400);
  }

  function restart() {
    try {
      window.localStorage.removeItem(STUDIO_STORAGE_KEY);
    } catch {
      // Resetting in memory is sufficient when storage is unavailable.
    }
    setProgress({ ...initialStudioProgress });
    setResumePending(false);
    setPlaybookOpen(false);
    setRestartOpen(false);
    setCopyStatus("");
  }

  if (!hydrated) {
    return <div className="studio-loading">Preparing your first build route…</div>;
  }

  let page: React.ReactNode;

  if (resumePending || progress.stage === "welcome") {
    page = (
      <Welcome
        headingRef={headingRef}
        resumePending={resumePending}
        savedStage={progress.stage}
        onStart={() => moveTo("map")}
        onResume={() => setResumePending(false)}
        onRestart={() => setRestartOpen(true)}
      />
    );
  } else if (progress.stage === "map") {
    page = <ToolMap headingRef={headingRef} onNext={() => moveTo("reveal")} />;
  } else if (progress.stage === "reveal") {
    page = (
      <LayerReveal
        progress={progress}
        headingRef={headingRef}
        onChange={(revealPercent) =>
          setProgress((state) => ({ ...state, revealPercent }))
        }
        onNext={() => moveTo("idea")}
      />
    );
  } else if (progress.stage === "playbook") {
    page = (
      <Completion
        progress={progress}
        headingRef={headingRef}
        setProgress={setProgress}
        onNavigate={navigate}
        onOpenPlaybook={() => setPlaybookOpen(true)}
        onRestart={() => setRestartOpen(true)}
        onCopy={copy}
        copyStatus={copyStatus}
      />
    );
  } else {
    const currentStage = progress.stage as LearningStage;
    const shared: StageProps = {
      progress,
      headingRef,
      setProgress,
      onComplete: () => complete(currentStage),
    };

    const content =
      currentStage === "idea" ? (
        <IdeaStage {...shared} />
      ) : currentStage === "tools" ? (
        <ToolsStage {...shared} />
      ) : currentStage === "home" ? (
        <HomeStage {...shared} />
      ) : currentStage === "ask" ? (
        <AskStage {...shared} />
      ) : currentStage === "build" ? (
        <BuildStage {...shared} />
      ) : currentStage === "check" ? (
        <CheckStage {...shared} />
      ) : currentStage === "live" ? (
        <LiveStage {...shared} />
      ) : (
        <ImproveStage {...shared} />
      );

    page = (
      <JourneyShell
        currentStage={currentStage}
        completedStages={progress.completedStages}
        onNavigate={navigate}
        onOpenPlaybook={() => setPlaybookOpen(true)}
        onRestart={() => setRestartOpen(true)}
      >
        {content}
      </JourneyShell>
    );
  }

  return (
    <>
      <div ref={appRootRef} className="studio-app">
        {page}
      </div>

      <AccessibleDialog
        open={playbookOpen}
        title="Your First AI Build Playbook"
        description="Every template is available now. Practiced cards are marked."
        onDismiss={() => setPlaybookOpen(false)}
        appRootRef={appRootRef}
        backdropClassName="studio-dialog-backdrop"
        dialogClassName="studio-playbook-dialog"
        titleClassName="studio-dialog-title"
        descriptionClassName="studio-dialog-description"
        contentClassName="studio-dialog-content"
      >
        <button
          type="button"
          className="studio-dialog-close"
          onClick={() => setPlaybookOpen(false)}
          aria-label="Close playbook"
        >
          ×
        </button>
        <PlaybookContent
          completedStages={progress.completedStages}
          toolLane={progress.toolLane}
          onCopy={copy}
          copyStatus={copyStatus}
          compact
        />
      </AccessibleDialog>

      <AccessibleDialog
        open={restartOpen}
        role="alertdialog"
        title="Start the journey again?"
        description="This removes your current route, choices, and practiced-card markers from this browser."
        onDismiss={() => setRestartOpen(false)}
        dismissOnBackdrop={false}
        appRootRef={appRootRef}
        initialFocusRef={restartCancelRef}
        backdropClassName="studio-dialog-backdrop"
        dialogClassName="studio-restart-dialog"
        titleClassName="studio-dialog-title"
        descriptionClassName="studio-dialog-description"
      >
        <div className="studio-restart-actions">
          <button
            ref={restartCancelRef}
            type="button"
            className="studio-secondary"
            onClick={() => setRestartOpen(false)}
          >
            Keep my progress
          </button>
          <button type="button" className="studio-danger" onClick={restart}>
            Remove progress and restart
          </button>
        </div>
      </AccessibleDialog>
    </>
  );
}
