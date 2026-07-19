export const sceneOrder = [
  "arrival",
  "target",
  "record",
  "handoff",
  "radius",
  "check",
  "evolve",
  "ship",
  "transfer",
  "replay",
] as const;

export type SceneId = (typeof sceneOrder)[number];
export type Confidence = 0.4 | 0.7 | 0.9;

/**
 * `detail` is feedback copy. It should be revealed only after the learner has
 * committed to a choice; the title must carry the neutral pre-decision option.
 */
export type Choice = {
  id: string;
  title: string;
  detail: string;
  correct?: boolean;
  essential?: boolean;
  dangerous?: boolean;
  /** @deprecated Prefer qualitative obligations on ScopeChoice. */
  cost?: number;
  /** @deprecated Prefer qualitative obligations on ScopeChoice. */
  files?: number;
};

export const productIdentity = {
  name: "Pentimento",
  pronunciation: "pen-ti-MEN-to",
  meaning: "A visible trace of an earlier version beneath a finished work.",
  descriptor: "A guided simulation for first-time AI builders",
  tagline: "See the decisions beneath the finished surface.",
  promise:
    "Learn to lead one small AI-built project from idea to a tested, shareable version—without writing code.",
} as const;

export const sceneLabels: Record<SceneId, string> = {
  arrival: "First layer",
  target: "Target",
  record: "Record",
  handoff: "Assign",
  radius: "Scope",
  check: "Check",
  evolve: "Evolve",
  ship: "Release",
  transfer: "Transfer",
  replay: "Revision trace",
};

export const mission = {
  title: "The page beneath the polish",
  duration: "18–20 minutes",
  premise:
    "The organizer plans to share this page in ten minutes. The AI says it is responsive, accessible, and ready.",
  stakeholder:
    "Our neighborhood Repair Café needs a page for Saturday. People should quickly understand when and where it happens, what they can bring, and how to ask a question. We cannot promise every item will be repaired, and we do not have a booking system.",
  approvedFacts: [
    "Saturday, July 25 · 10:00–14:00",
    "West Hall Community Room",
    "Small appliances, clothing, and bicycles",
    "Repairs depend on volunteer availability",
    "Questions: hello@repair-cafe.example",
  ],
  inventedFact: "Walk-ins are guaranteed a repair",
  aiClaim:
    "Everything requested is complete. I verified the facts, phone layout, keyboard path, tracked files, and build. The page is ready to publish.",
  runtimeAI: {
    required: false,
    explanation:
      "AI helps create this page, but visitors only need verified information and an email link. The finished page does not need a model, API key, or per-visitor AI cost.",
    rule:
      "Using AI to build a project does not mean AI must live inside the finished product.",
  },
} as const;

export type DefectId =
  | "unsupported-guarantee"
  | "broken-email-action"
  | "empty-execution-record";

export type DefectRecord = {
  id: DefectId;
  claim: string;
  observed: string;
  evidenceAnchor: string;
  humanConsequence: string;
  repairBoundary: string;
};

/** The canonical defect story. All scenes and debriefs should derive from it. */
export const defectLedger: readonly DefectRecord[] = [
  {
    id: "unsupported-guarantee",
    claim: "Every public event statement matches an organizer-approved fact.",
    observed:
      "The page says walk-ins are guaranteed a repair; the approved source says repairs depend on volunteer availability.",
    evidenceAnchor: "facts.md · availability statement",
    humanConsequence:
      "A neighbor may travel to the event expecting a promise the volunteers cannot keep.",
    repairBoundary: "Replace the unsupported sentence with the approved availability wording.",
  },
  {
    id: "broken-email-action",
    claim: "A phone visitor can contact the organizer through the approved email address.",
    observed:
      "At a 390px screen width, the contact action is clipped and activating it opens no destination.",
    evidenceAnchor:
      "390px interaction recording · expected destination hello@repair-cafe.example",
    humanConsequence:
      "A visitor with a question cannot reach the organizer from the device most likely to be in their hand.",
    repairBoundary:
      "Make the action fluid at 390px and connect it to the approved email without collecting personal data.",
  },
  {
    id: "empty-execution-record",
    claim: "The checks named in the AI summary actually ran on this exact version.",
    observed:
      "The AI says five checks passed, but the execution record contains no command, time, output, or result.",
    evidenceAnchor: "Execution record for the proposal commit · empty",
    humanConsequence:
      "The organizer is being asked to accept release risk on the strength of an assurance that cannot be reproduced.",
    repairBoundary:
      "Run the agreed checks, preserve their real results, and report any remaining uncertainty.",
  },
] as const;

export const arrivalChoices: Choice[] = [
  {
    id: "ship",
    title: "Publish it now—the deadline is close",
    detail:
      "The page reaches visitors quickly, but the unsourced promise and unusable phone action reach them too. A deadline does not turn an unchecked claim into evidence.",
  },
  {
    id: "summary",
    title: "Ask the AI to confirm its own work again",
    detail:
      "The explanation may be useful for deciding what to inspect, but it comes from the same source as the work and cannot verify that work by itself.",
  },
  {
    id: "inspect",
    title: "Pause and check the organizer’s facts and the visitor’s key path",
    detail:
      "Comparing the page with approved facts and trying its contact action produces evidence independent of the AI’s assurance.",
    correct: true,
  },
];

export type TargetField = "audience" | "outcome" | "proof" | "nonGoal";

export type TargetFieldDefinition = {
  id: TargetField;
  label: string;
  prompt: string;
  plainLanguage: string;
  options: Choice[];
};

export const targetFields: TargetFieldDefinition[] = [
  {
    id: "audience",
    label: "For whom",
    prompt: "Whose situation should guide the first version?",
    plainLanguage: "Name one person in one situation, not everybody who might ever visit.",
    options: [
      {
        id: "audience-everyone",
        title: "Local people interested in community repair events",
        detail:
          "This sounds reasonable, but it combines many situations and gives no device, urgency, or decision to design around.",
      },
      {
        id: "audience-neighbors",
        title: "A nearby resident checking the event from a phone",
        detail:
          "The person and situation are specific enough to guide the page hierarchy, wording, and screen-width check.",
        correct: true,
      },
    ],
  },
  {
    id: "outcome",
    label: "Outcome",
    prompt: "What should that person be able to decide or do?",
    plainLanguage: "Describe a useful change for the visitor, not a feature or a feeling.",
    options: [
      {
        id: "outcome-impressive",
        title: "Understand the event and feel impressed by the page",
        detail:
          "Understanding matters, but ‘feel impressed’ is subjective and does not identify the visitor’s most important action.",
      },
      {
        id: "outcome-attend",
        title: "Decide whether their item fits and contact the organizer",
        detail:
          "This names a real decision followed by a meaningful action that can be exercised during review.",
        correct: true,
      },
    ],
  },
  {
    id: "proof",
    label: "How we will know",
    prompt: "What evidence would support that outcome?",
    plainLanguage: "Choose observations another person can repeat on the finished page.",
    options: [
      {
        id: "proof-ai",
        title: "The organizer likes the desktop preview and AI reports completion",
        detail:
          "Approval and an AI report are useful signals, but neither checks factual accuracy or the phone contact path.",
      },
      {
        id: "proof-behavior",
        title: "Facts match; key event details are present; email works at 390px",
        detail:
          "These checks compare the visible content with the trusted source and exercise the important action on the device that matters.",
        correct: true,
      },
    ],
  },
  {
    id: "nonGoal",
    label: "Not in this version",
    prompt: "Which systems should remain outside the first complete path?",
    plainLanguage: "A non-goal protects time and prevents accidental commitments.",
    options: [
      {
        id: "nongoal-none",
        title: "Keep booking and volunteer features available if time permits",
        detail:
          "‘If time permits’ leaves the boundary open; either feature would create data, access, recovery, and support obligations.",
      },
      {
        id: "nongoal-systems",
        title: "Defer accounts, booking, payments, chat, and live inventory",
        detail:
          "The first version remains complete for its chosen outcome without creating identity, money, or data systems.",
        correct: true,
      },
    ],
  },
];

export type ProjectTerm = {
  id: string;
  term: string;
  plainLanguage: string;
  usefulWhen: string;
};

export const projectTerms: readonly ProjectTerm[] = [
  {
    id: "folder",
    term: "Project folder",
    plainLanguage: "The project’s files on the computer where you are working.",
    usefulWhen: "You need to know what AI can read or change locally.",
  },
  {
    id: "git",
    term: "Git",
    plainLanguage: "A tool that saves named versions of files and shows what changed between them.",
    usefulWhen: "You want to compare, review, or return to an earlier version.",
  },
  {
    id: "github",
    term: "GitHub",
    plainLanguage: "A remote place to store, share, and review a Git repository.",
    usefulWhen: "You want off-device history, collaboration, or a repository judges can inspect.",
  },
  {
    id: "repository",
    term: "Repository",
    plainLanguage: "The project files plus the version history Git has recorded.",
    usefulWhen: "You need durable project context rather than relying on one chat.",
  },
  {
    id: "commit",
    term: "Commit",
    plainLanguage: "One named version of a coherent change.",
    usefulWhen: "A useful slice has been inspected and you want a version you can identify later.",
  },
  {
    id: "baseline",
    term: "Baseline snapshot",
    plainLanguage: "A saved starting state. It is recoverable but not ‘known good’ until checks pass.",
    usefulWhen: "You inherit work whose quality has not yet been verified.",
  },
  {
    id: "diff",
    term: "Diff",
    plainLanguage: "The before-and-after changes between two saved states.",
    usefulWhen: "You need to inspect exactly what AI added, removed, or changed.",
  },
  {
    id: "readme",
    term: "README",
    plainLanguage: "The project’s front-page instructions: purpose, setup, checks, limits, and handoff notes.",
    usefulWhen: "Someone—including future you—needs to understand or run the project.",
  },
  {
    id: "gitignore",
    term: ".gitignore",
    plainLanguage: "A list of local files Git must not save in project history.",
    usefulWhen: "The project creates machine-specific, generated, private, or secret-bearing files.",
  },
  {
    id: "environment-variable",
    term: "Environment variable",
    plainLanguage: "A setting supplied outside the source files, often by your computer or hosting platform.",
    usefulWhen: "A real feature needs environment-specific configuration or a server-side secret.",
  },
  {
    id: "preview",
    term: "Preview",
    plainLanguage: "A temporary online version for checking the exact release candidate before it replaces the live site.",
    usefulWhen: "You want to test hosting behavior without affecting real visitors.",
  },
  {
    id: "production",
    term: "Live version",
    plainLanguage: "The version real people can currently use.",
    usefulWhen: "Publishing, access, user data, or reputation could be affected.",
  },
  {
    id: "rollback",
    term: "Recovery version",
    plainLanguage: "An earlier verified version you know how to put back online.",
    usefulWhen: "A live release fails and you need a fast, understood route back.",
  },
] as const;

export const repositoryOptions: Choice[] = [
  {
    id: "readme",
    title: "README with purpose, scope, setup, checks, and limits",
    detail:
      "This turns decisions into durable project context that survives beyond the current conversation.",
    correct: true,
    essential: true,
  },
  {
    id: "facts",
    title: "facts.md with organizer-approved event details",
    detail:
      "A named source lets reviewers distinguish approved information from an AI inference or invention.",
    correct: true,
    essential: true,
  },
  {
    id: "files",
    title: "Current project files and approved assets",
    detail:
      "The current state is necessary for comparison, but it remains unverified until its claims and behavior are checked.",
    correct: true,
    essential: true,
  },
  {
    id: "gitignore",
    title: ".gitignore before any local secret or generated file",
    detail:
      "This tells Git which local files it must not save. It reduces accidental tracking, but it cannot erase a secret already committed.",
    correct: true,
    essential: true,
  },
  {
    id: "env-example",
    title: "An empty .env.example for possible future AI access",
    detail:
      "This page needs no runtime AI or configuration variable. Add an example only when a real feature has a setting to document.",
  },
  {
    id: "checkpoint",
    title: "Baseline snapshot labeled ‘unverified starting state’",
    detail:
      "The snapshot makes the inherited work recoverable without falsely calling a defective page known good.",
    correct: true,
    essential: true,
  },
  {
    id: "api-key",
    title: "An API key so AI can be added later",
    detail:
      "The finished page does not need runtime AI. A real credential grants access and must never enter a prompt, client file, or repository history.",
    dangerous: true,
  },
  {
    id: "chat-dump",
    title: "The complete build conversation as permanent project context",
    detail:
      "A transcript mixes decisions, abandoned ideas, speculation, and possibly private material. Preserve approved decisions and sources instead.",
  },
];

export type WorkModeId =
  | "explore"
  | "plan"
  | "implement"
  | "diagnose"
  | "review"
  | "verify";

export type WorkMode = {
  id: WorkModeId;
  label: string;
  plainLanguage: string;
  mayChangeFiles: boolean;
  usefulWhen: string;
  expectedReturn: string;
};

export const workModes: readonly WorkMode[] = [
  {
    id: "explore",
    label: "Explore",
    plainLanguage: "Compare possibilities without changing the project.",
    mayChangeFiles: false,
    usefulWhen: "The problem or approach is still unclear.",
    expectedReturn: "Options, trade-offs, assumptions, and unanswered questions.",
  },
  {
    id: "plan",
    label: "Plan",
    plainLanguage: "Inspect the current project and propose a bounded sequence without editing.",
    mayChangeFiles: false,
    usefulWhen: "You understand the outcome but want to review scope before granting edit permission.",
    expectedReturn: "Likely files, dependencies, risks, checks, and decisions that need approval.",
  },
  {
    id: "implement",
    label: "Implement",
    plainLanguage: "Make one agreed change, inspect it, and run the agreed checks.",
    mayChangeFiles: true,
    usefulWhen: "The goal, context, boundary, and proof of done are already clear.",
    expectedReturn: "Changed files, actual check results, assumptions, and remaining risk.",
  },
  {
    id: "diagnose",
    label: "Diagnose",
    plainLanguage: "Reproduce a failure and identify its likely cause without fixing it yet.",
    mayChangeFiles: false,
    usefulWhen: "The symptom is known but the cause is not.",
    expectedReturn: "Reproduction, evidence, likely cause, uncertainty, and smallest repair proposal.",
  },
  {
    id: "review",
    label: "Review",
    plainLanguage: "Inspect existing changes and report issues without editing them.",
    mayChangeFiles: false,
    usefulWhen: "AI or another collaborator has already produced a change.",
    expectedReturn: "Findings ordered by consequence, with exact evidence locations.",
  },
  {
    id: "verify",
    label: "Verify",
    plainLanguage: "Run named checks on an exact version and report what they do and do not prove.",
    mayChangeFiles: false,
    usefulWhen: "A completion or release claim needs independent support.",
    expectedReturn: "Command or procedure, exact result, evidence location, and remaining gap.",
  },
] as const;

export const contextOptions: Choice[] = [
  {
    id: "goal",
    title: "The chosen visitor and outcome",
    detail:
      "The AI can connect decisions to a real person and action instead of optimizing for generic polish.",
    correct: true,
    essential: true,
  },
  {
    id: "trusted-facts",
    title: "facts.md as the approved source",
    detail:
      "This names what the AI should follow when its general knowledge or guesses conflict with project truth.",
    correct: true,
    essential: true,
  },
  {
    id: "current-files",
    title: "The current page and its before-and-after changes",
    detail:
      "The AI needs the real starting state, and the reviewer needs a bounded surface for inspecting what changes.",
    correct: true,
    essential: true,
  },
  {
    id: "acceptance",
    title: "The agreed checks for facts, event details, email, phone, and keyboard",
    detail:
      "These checks define completion before implementation begins, so the AI cannot invent an easier definition afterward.",
    correct: true,
    essential: true,
  },
  {
    id: "authority",
    title: "What AI may do now—and what requires asking",
    detail:
      "Local reading and planning are allowed. New packages, deletion, network use, publishing, messaging, spending, and access changes require review or explicit approval.",
    correct: true,
    essential: true,
  },
  {
    id: "mobile-reference",
    title: "A 390px reference plus the behavior expected there",
    detail:
      "The screenshot clarifies the relevant situation; the behavior statement prevents a static picture from being mistaken for an interaction test.",
    correct: true,
    essential: true,
  },
  {
    id: "secret",
    title: "A production API key so AI can configure the page",
    detail:
      "A secret grants authority; it does not explain the task. This page needs no runtime AI, so there is no reason to expose a key.",
    dangerous: true,
  },
  {
    id: "downloads",
    title: "The entire Downloads folder in case something is useful",
    detail:
      "Unrelated files increase ambiguity and can expose personal, licensed, or secret material without improving this decision.",
  },
];

export type ScopeDisposition = "keep" | "defer" | "needs-answer";

export const scopeDispositions: ReadonlyArray<{
  id: ScopeDisposition;
  label: string;
  plainLanguage: string;
}> = [
  {
    id: "keep",
    label: "Keep",
    plainLanguage: "Directly serves the chosen outcome and has a clear check.",
  },
  {
    id: "defer",
    label: "Defer",
    plainLanguage: "Creates obligations the first version does not need.",
  },
  {
    id: "needs-answer",
    label: "Needs an answer",
    plainLanguage: "May matter, but the trusted brief does not yet define what it means.",
  },
] as const;

export type ScopeChoice = Choice & {
  recommendedDisposition: ScopeDisposition;
  obligations: string[];
  questionToResolve?: string;
  evidenceRequired: string;
};

export const planOptions: ScopeChoice[] = [
  {
    id: "facts-section",
    title: "Use the approved event details in the page",
    detail:
      "KEEP · This directly supports the visitor’s decision and can be checked line by line against facts.md.",
    correct: true,
    essential: true,
    recommendedDisposition: "keep",
    obligations: ["Trace each public claim to facts.md", "Show uncertainty without inventing a promise"],
    evidenceRequired: "A completed facts comparison with exact source anchors.",
  },
  {
    id: "mobile-action",
    title: "Make one email action work on desktop and phone",
    detail:
      "KEEP · One approved email link completes the chosen visitor path without creating a form or storing personal data.",
    correct: true,
    essential: true,
    recommendedDisposition: "keep",
    obligations: ["Use the approved email", "Remain visible at 390px", "Work by pointer and keyboard"],
    evidenceRequired: "Observed destination, 390px interaction, and keyboard activation.",
  },
  {
    id: "verify",
    title: "Run and preserve the checks named in the brief",
    detail:
      "KEEP · The work is not complete until the exact proposal is compared with sources and exercised through its important path.",
    correct: true,
    essential: true,
    recommendedDisposition: "keep",
    obligations: ["Record commands or procedures", "Keep results tied to the exact version", "Report remaining gaps"],
    evidenceRequired: "A reproducible evidence ledger for the release candidate.",
  },
  {
    id: "accounts",
    title: "Give volunteers personal accounts",
    detail:
      "DEFER · Accounts create identity, sign-in, recovery, privacy, abuse, and support work without helping this page’s first outcome.",
    recommendedDisposition: "defer",
    obligations: ["Identity", "Authentication", "Recovery", "Privacy", "Abuse handling", "Support"],
    evidenceRequired: "A separate user need, risk review, access model, and account test plan.",
  },
  {
    id: "database",
    title: "Show live repair availability",
    detail:
      "DEFER · Live data creates ownership, update, permission, stale-state, hosting, and failure obligations the organizer has not accepted.",
    recommendedDisposition: "defer",
    obligations: ["Source ownership", "Update workflow", "Permissions", "Stale-data state", "Hosting", "Recovery"],
    evidenceRequired: "An approved source-of-truth and a plan for missing, stale, and unauthorized states.",
  },
  {
    id: "admin",
    title: "Create an organizer control panel",
    detail:
      "DEFER · A control panel requires administrator identity, roles, data storage, audit history, and its own tested workflows.",
    recommendedDisposition: "defer",
    obligations: ["Administrator identity", "Roles", "Authorization", "Stored data", "Audit trail", "Support"],
    evidenceRequired: "A separately approved administrator journey and security model.",
  },
  {
    id: "joining-flow",
    title: "Add an online ‘join the event’ flow",
    detail:
      "NEEDS AN ANSWER · ‘Join’ might mean attend, volunteer, reserve a slot, or simply ask a question; each interpretation creates different work.",
    recommendedDisposition: "needs-answer",
    obligations: ["Clarify the actor", "Clarify the action", "Identify any data collected", "Identify who owns follow-up"],
    questionToResolve: "Does ‘join’ mean attend, volunteer, reserve a repair, or contact the organizer?",
    evidenceRequired: "A stakeholder answer added to the brief before implementation.",
  },
];

export type CheckResult = "pass" | "fail" | "not-run" | "unproven";
export type EvidenceKind = "trusted-source" | "observed-behavior" | "change-review" | "execution-record";

export type EvidenceCheck = Choice & {
  result: CheckResult;
  evidenceKind: EvidenceKind;
  evidenceAnchor: string;
  proves: string;
  doesNotProve: string;
  defectIds: DefectId[];
};

export const checks: EvidenceCheck[] = [
  {
    id: "facts-check",
    title: "Compare each public statement with facts.md",
    detail:
      "FAIL · The guarantee has no approved source and conflicts with the organizer’s availability statement.",
    correct: true,
    essential: true,
    result: "fail",
    evidenceKind: "trusted-source",
    evidenceAnchor: "facts.md · availability statement ↔ event-page guarantee",
    proves: "Whether the displayed event claims match the approved source.",
    doesNotProve: "Whether the page works on a phone or the contact destination is correct.",
    defectIds: ["unsupported-guarantee"],
  },
  {
    id: "mobile-check",
    title: "Use the contact action at a 390px screen width",
    detail:
      "FAIL · The action is partly outside the screen and activating it opens no email destination.",
    correct: true,
    essential: true,
    result: "fail",
    evidenceKind: "observed-behavior",
    evidenceAnchor: "390px preview · contact-action interaction recording",
    proves: "Whether the primary phone action is visible and reaches its intended destination.",
    doesNotProve: "Whether the same path works by keyboard or on the deployed site.",
    defectIds: ["broken-email-action"],
  },
  {
    id: "keyboard-check",
    title: "Follow the visitor path using only a keyboard",
    detail:
      "PASS FOR THIS VERSION · Visible controls receive focus in a useful order, but this must be rerun after the repair.",
    correct: true,
    result: "pass",
    evidenceKind: "observed-behavior",
    evidenceAnchor: "Proposal commit · recorded focus order",
    proves: "Whether the current controls can be reached and activated without a pointer.",
    doesNotProve: "Whether labels are understandable to screen-reader users or remain correct after a change.",
    defectIds: [],
  },
  {
    id: "secret-check",
    title: "Inspect the saved files and before-and-after changes for credentials",
    detail:
      "PASS FOR THIS VERSION · No credential appears in the files Git will save; the final repair still requires a fresh scan.",
    correct: true,
    essential: true,
    result: "pass",
    evidenceKind: "change-review",
    evidenceAnchor: "Proposal commit · tracked-file list and diff scan",
    proves: "Whether obvious credential material appears in the inspected version and history.",
    doesNotProve: "That a previously exposed credential is safe; an exposed credential must still be revoked or rotated.",
    defectIds: [],
  },
  {
    id: "execution-log",
    title: "Open the record of checks that actually ran",
    detail:
      "NOT RUN · The AI named five passing checks, but the record has no command, procedure, time, output, or result.",
    correct: true,
    essential: true,
    result: "not-run",
    evidenceKind: "execution-record",
    evidenceAnchor: "Proposal commit · empty execution record",
    proves: "Whether the claimed checks were executed on the exact proposal.",
    doesNotProve: "That the project is correct; real output still needs interpretation against the brief.",
    defectIds: ["empty-execution-record"],
  },
  {
    id: "ask-again",
    title: "Ask AI to explain why it believes the page is ready",
    detail:
      "The explanation may suggest checks to run, but another statement from the creator of the proposal is still not independent evidence.",
    result: "unproven",
    evidenceKind: "execution-record",
    evidenceAnchor: "AI conversation · second assurance",
    proves: "What the AI believes or intended.",
    doesNotProve: "What the project actually does.",
    defectIds: [],
  },
];

export type RepairField = "observed" | "reproduce" | "expected" | "preserve";

export const repairBrief = {
  mode: "Diagnose first; do not edit until the likely cause and smallest patch are reviewed.",
  observed:
    "The page makes an unsupported guarantee. At 390px, the contact action is clipped and opens no destination.",
  reproduce:
    "Open the unverified baseline, compare the event copy with facts.md, set the preview to 390px, and activate ‘Ask about a repair.’",
  expected:
    "The page uses the approved availability wording. The action remains fully visible and opens hello@repair-cafe.example.",
  evidenceAnchor: [
    "facts.md · approved availability statement",
    "390px interaction recording",
    "Observed mail destination",
    "Proposal commit and repair diff",
  ],
  mustPreserve: [
    "Approved date, time, place, and repair categories",
    "Keyboard focus order",
    "No form or personal-data collection",
    "No credential in files Git saves",
  ],
  changeBoundary: "Change only the event claim and contact-action implementation; add no package or new system.",
} as const;

export const repairFields: Array<{
  id: RepairField;
  label: string;
  evidenceAnchor: string;
  options: Choice[];
}> = [
  {
    id: "observed",
    label: "What was observed",
    evidenceAnchor: "facts comparison + 390px interaction",
    options: [
      {
        id: "observed-exact",
        title: "The guarantee lacks a source; the phone action clips and opens nothing",
        detail:
          "This records the visible failures precisely without pretending to know their code-level cause.",
        correct: true,
      },
      {
        id: "observed-broken",
        title: "The event page is unreliable and should be rewritten",
        detail:
          "This jumps from two observed gaps to a project-wide conclusion and gives the repair no precise boundary.",
      },
    ],
  },
  {
    id: "reproduce",
    label: "How another person can reproduce it",
    evidenceAnchor: "unverified baseline commit + named source + screen width + action",
    options: [
      {
        id: "reproduce-exact",
        title: "Compare the event section with facts.md; then activate its action at 390px",
        detail:
          "This names the exact source, location, width, and action another reviewer needs to observe the same failures.",
        correct: true,
      },
      {
        id: "reproduce-none",
        title: "Open the page on a few devices and look for anything unusual",
        detail:
          "Broad exploration can discover new issues, but it cannot reliably reproduce these two known failures.",
      },
    ],
  },
  {
    id: "expected",
    label: "What passing looks like",
    evidenceAnchor: "approved wording + visible action + exact email destination",
    options: [
      {
        id: "expected-exact",
        title: "Use the approved availability wording; keep the action visible and open the approved email",
        detail:
          "Each expected result has a pass-or-fail observation tied to the original defect.",
        correct: true,
      },
      {
        id: "expected-better",
        title: "Make the page more accurate, responsive, and useful",
        detail:
          "The direction is sensible, but subjective adjectives do not tell a reviewer when the repair is complete.",
      },
    ],
  },
  {
    id: "preserve",
    label: "What the repair must preserve",
    evidenceAnchor: "post-repair regression and final-file checks",
    options: [
      {
        id: "preserve-verified",
        title: "Approved event details, keyboard order, and credential-free project history",
        detail:
          "These behaviors already have evidence, so the repair must rerun nearby checks rather than silently trading one defect for another.",
        correct: true,
      },
      {
        id: "preserve-nothing",
        title: "Allow a wider rewrite if AI can make the layout cleaner",
        detail:
          "A wider rewrite expands review work and can damage behavior that was already supported by evidence.",
      },
    ],
  },
];

export type PostRepairRerun = {
  id: string;
  label: string;
  method: string;
  passingEvidence: string;
  protectsAgainst: string;
};

export const postRepairReruns: readonly PostRepairRerun[] = [
  {
    id: "facts-check",
    label: "Approved facts",
    method: "Compare every public event statement with facts.md.",
    passingEvidence: "No unsupported statement remains; availability wording matches the approved source.",
    protectsAgainst: "A polished rewrite quietly reintroducing an invented promise.",
  },
  {
    id: "mobile-check",
    label: "390px visibility",
    method: "Open the repaired page at 390px and inspect the entire contact action.",
    passingEvidence: "The complete action remains inside the screen without horizontal scrolling.",
    protectsAgainst: "Treating a desktop screenshot as proof of phone usability.",
  },
  {
    id: "email-destination-check",
    label: "Email destination",
    method: "Activate the action and record the destination it opens.",
    passingEvidence: "The destination is mailto:hello@repair-cafe.example.",
    protectsAgainst: "A visible control that still performs no useful action or reaches the wrong address.",
  },
  {
    id: "keyboard-check",
    label: "Keyboard regression",
    method: "Reach and activate the repaired action using only the keyboard.",
    passingEvidence: "Focus remains visible and activation opens the same approved destination.",
    protectsAgainst: "The repair fixing pointer use while breaking an already-working input path.",
  },
  {
    id: "secret-check",
    label: "Final saved-file review",
    method: "Inspect the final diff, files Git will save, and repository history for credentials or private data.",
    passingEvidence: "No credential or private visitor data appears in the exact release candidate.",
    protectsAgainst: "Relying on a safety check that ran before the final AI edit.",
  },
] as const;

export type ReleaseEvidence = Choice & {
  claim: string;
  evidenceMethod: string;
  evidenceLocation: string;
  timing: "post-repair" | "release-candidate" | "preview" | "production";
  statusSource: "generated" | "human-approval";
};

/**
 * Release rows describe evidence the interface must generate or retrieve.
 * They are not learner self-attestations, even though they retain Choice fields
 * temporarily for compatibility with the existing scene renderer.
 */
export const shipGate: ReleaseEvidence[] = [
  {
    id: "facts-pass",
    title: "Public facts match the approved source",
    detail: "The post-repair comparison contains no unsupported or conflicting event statement.",
    correct: true,
    essential: true,
    claim: "Every public event statement traces to facts.md.",
    evidenceMethod: "Run the post-repair facts comparison.",
    evidenceLocation: "Evidence ledger · facts-check · release commit",
    timing: "post-repair",
    statusSource: "generated",
  },
  {
    id: "core-pass",
    title: "The complete contact path works on desktop and phone",
    detail: "The action is visible, reachable, and opens the approved email destination on both target layouts.",
    correct: true,
    essential: true,
    claim: "A visitor can reach hello@repair-cafe.example from the exact release candidate.",
    evidenceMethod: "Exercise the action on desktop and at 390px; record the observed destination.",
    evidenceLocation: "Evidence ledger · contact path recording · release commit",
    timing: "release-candidate",
    statusSource: "generated",
  },
  {
    id: "access-pass",
    title: "The repaired path still works by keyboard",
    detail: "A fresh regression check confirms the repair preserved visible focus and activation.",
    correct: true,
    essential: true,
    claim: "The visitor path remains usable without a pointer after the repair.",
    evidenceMethod: "Rerun the recorded focus and activation path after the final change.",
    evidenceLocation: "Evidence ledger · keyboard regression · release commit",
    timing: "post-repair",
    statusSource: "generated",
  },
  {
    id: "secret-pass",
    title: "The final saved state contains no credential or private data",
    detail: "The safety evidence comes from the final diff and history, not a scan performed before the repair.",
    correct: true,
    essential: true,
    claim: "No credential or private visitor data appears in the exact release candidate.",
    evidenceMethod: "Inspect the final diff, tracked-file list, and history.",
    evidenceLocation: "Evidence ledger · final saved-file review · release commit",
    timing: "release-candidate",
    statusSource: "generated",
  },
  {
    id: "readme-current",
    title: "README and limitations describe this exact version",
    detail: "Another person can understand the purpose, run the project, repeat its checks, and see what it does not provide.",
    correct: true,
    essential: true,
    claim: "The handoff documentation matches the release candidate.",
    evidenceMethod: "Review README purpose, setup, checks, limitations, and runtime-AI decision against the current project.",
    evidenceLocation: "README.md · release commit",
    timing: "release-candidate",
    statusSource: "generated",
  },
  {
    id: "build-pass",
    title: "The production build succeeds for the exact release candidate",
    detail: "A successful build supports code and configuration health; it does not replace interaction or comprehension checks.",
    correct: true,
    essential: true,
    claim: "The hosting artifact can be produced from the recorded commit.",
    evidenceMethod: "Run the documented production-build command and preserve its exit result.",
    evidenceLocation: "Execution record · production build · release commit",
    timing: "release-candidate",
    statusSource: "generated",
  },
  {
    id: "preview-pass",
    title: "The hosted preview passes the core smoke test",
    detail: "Hosting can change behavior, so the real preview URL must repeat the facts and contact-path checks.",
    correct: true,
    essential: true,
    claim: "The exact release candidate works in its hosted preview environment.",
    evidenceMethod: "Open the preview URL and rerun the core facts and contact path.",
    evidenceLocation: "Preview URL + check time + release commit",
    timing: "preview",
    statusSource: "generated",
  },
  {
    id: "final-commit",
    title: "The release version and recovery method are recorded",
    detail: "The exact commit identifies what was proved; the recovery note explains which verified version can be redeployed and how.",
    correct: true,
    essential: true,
    claim: "The team can identify this release and return to an earlier verified version if needed.",
    evidenceMethod: "Record the release commit, prior verified commit when one exists, and redeploy procedure.",
    evidenceLocation: "Release record · commit IDs + recovery procedure",
    timing: "release-candidate",
    statusSource: "generated",
  },
  {
    id: "publish-approval",
    title: "A person explicitly approves making this version public",
    detail: "Publishing affects real people and project access, so it remains a human decision even after every technical check passes.",
    correct: true,
    essential: true,
    claim: "The external action has explicit human approval for this exact version and access mode.",
    evidenceMethod: "Request and record approval after presenting the preview and remaining limitations.",
    evidenceLocation: "Release record · approval + commit + access mode",
    timing: "preview",
    statusSource: "human-approval",
  },
  {
    id: "production-smoke",
    title: "The live version passes a post-publish smoke test",
    detail: "Publication is another environment boundary; success in preview does not prove the live route, certificate, or interaction works.",
    correct: true,
    essential: true,
    claim: "The public URL serves the approved release and its core visitor path works.",
    evidenceMethod: "Open the public URL after release and repeat the core path on desktop and phone.",
    evidenceLocation: "Public URL + check time + deployed commit",
    timing: "production",
    statusSource: "generated",
  },
];

export const spreadsheetCase = {
  title: "Community event budget",
  trustedInputs: [
    { cell: "B2", label: "Room hire receipt", value: 240 },
    { cell: "B3", label: "Materials receipt", value: 86.4 },
    { cell: "B4", label: "Refreshments receipt", value: 58.75 },
  ],
  totalCell: "B5",
  approvedRule: "The total equals the three approved receipts and includes no extra adjustment.",
  correctFormula: "=SUM(B2:B4)",
  correctTotal: 385.15,
  aiFormula: "=SUM(B2:B4)+57.75",
  aiTotal: 442.9,
  aiClaim: "I corrected the formula and verified the total.",
  consequence:
    "If accepted, the community budget overstates spending by $57.75 and could distort the organizer’s next decision.",
} as const;

export const transferQuestions = [
  {
    id: "source",
    label: "Which source should decide whether the total is true?",
    options: [
      {
        id: "source-ai",
        title: "The AI’s line-by-line explanation of its arithmetic",
        detail:
          "The explanation can expose assumptions, but it still originates from the system whose edit is being checked.",
      },
      {
        id: "source-receipts",
        title: "The original receipts and the approved rule for the total",
        detail:
          "These inputs define the real spending the formula is supposed to represent.",
        correct: true,
      },
      {
        id: "source-total",
        title: "Last month’s approved total as a reasonableness comparison",
        detail:
          "A previous total can reveal an unusual change, but it cannot prove this month’s distinct receipts.",
      },
    ],
  },
  {
    id: "proof",
    label: "Which evidence would support the corrected value?",
    options: [
      {
        id: "proof-again",
        title: "Ask AI to show every arithmetic step and confirm it twice",
        detail:
          "Repeated reasoning can still repeat the same unsupported assumption or extra adjustment.",
      },
      {
        id: "proof-recalc",
        title: "Inspect B5 and independently recalculate B2 through B4",
        detail:
          "The formula and an independent sum both support $385.15 from the trusted inputs.",
        correct: true,
      },
      {
        id: "proof-format",
        title: "Compare the new total with the expected spending range",
        detail:
          "A plausible range may catch a large anomaly, but $442.90 could still look plausible while containing an unsupported $57.75.",
      },
    ],
  },
  {
    id: "next",
    label: "Which next move keeps the correction bounded and recoverable?",
    options: [
      {
        id: "next-rewrite",
        title: "Let AI clean the full workbook while correcting the total",
        detail:
          "Combining cleanup with the repair enlarges the review surface and can disturb unrelated formulas or formatting.",
      },
      {
        id: "next-bounded",
        title: "Preserve the original, repair B5 only, and rerun the calculation",
        detail:
          "This keeps the source recoverable, limits the edit to the observed gap, and repeats the evidence that exposed it.",
        correct: true,
      },
      {
        id: "next-publish",
        title: "Correct B5 directly in the shared live sheet, then review it",
        detail:
          "The formula may become correct, but editing the shared source first removes the safe comparison and shifts risk to other users.",
      },
    ],
  },
] as const;

export type FieldNote = {
  id: string;
  scene: SceneId;
  title: string;
  principle: string;
  whenToUse: string;
  evidenceProduced: string;
  prevents: string;
  completedExample: string;
  template: string;
};

export const fieldNotes: readonly FieldNote[] = [
  {
    id: "brief",
    scene: "target",
    title: "The four-line build brief",
    principle: "Begin with one human outcome and the observations that would support it—not a feature wish list.",
    whenToUse: "Before asking AI to plan or edit, and whenever the project’s purpose changes.",
    evidenceProduced: "A reviewable agreement about audience, outcome, proof, and non-goals.",
    prevents: "Feature drift, subjective definitions of done, and AI inventing a more convenient goal.",
    completedExample: `For: A nearby resident checking from a phone
Outcome: Decide whether their item fits and contact the organizer
How we will know: Facts match; key event details are present; email works at 390px
Not in this version: Accounts, booking, payment, chat, or live inventory
Runtime AI: Not needed; visitors need verified facts and an email link`,
    template: `For: [specific person in a specific situation]
Outcome: [what they can decide or do]
How we will know: [observable checks]
Not in this version: [explicit non-goals]
Runtime AI: [needed or not needed, and why]`,
  },
  {
    id: "repository",
    scene: "record",
    title: "A project home with honest version labels",
    principle: "Git saves named versions; GitHub can store and share that history. Neither one is a secret manager.",
    whenToUse: "Before the first AI edit, after each verified slice, and before handing work to someone else.",
    evidenceProduced: "A visible saved-file list, an unverified baseline or verified commit ID, and a repeatable setup record.",
    prevents: "Lost work, context trapped in chat, accidental secret history, and falsely calling unchecked work known good.",
    completedExample: `README.md — purpose, scope, setup, checks, limits
facts.md — organizer-approved event information
.gitignore — local and secret-bearing files Git must not save
Baseline: 4bd91aa · unverified starting state
Runtime key: none; this page has no runtime AI feature`,
    template: `Before AI edits:
1. Create or open one repository
2. Add the brief and trusted source files
3. Add .gitignore before local secret-bearing files
4. Run the starting project and record the result
5. Inspect the files Git will save
6. Save a baseline; call it known good only after its checks pass`,
  },
  {
    id: "handoff",
    scene: "handoff",
    title: "The bounded AI handoff",
    principle: "Give AI the smallest trusted packet and permission needed for one useful step.",
    whenToUse: "Whenever AI begins a new task, resumes after context has changed, or could take an action with consequences.",
    evidenceProduced: "A handoff whose mode, sources, authority, boundaries, and proof of done can be reviewed before work begins.",
    prevents: "Hidden assumptions, unnecessary file exposure, accidental publishing, wide edits, and unverifiable completion claims.",
    completedExample: `Mode: Plan; inspect but do not edit
Outcome: Accurate facts and a usable email action at 390px
Trusted context: README.md, facts.md, current page, phone reference
One change: Repair the event claim and contact path
You may: Read local files and propose a plan
Ask before: Packages, deletion, network use, publishing, messaging, spending, or access changes
Done when: Facts, phone, email destination, and keyboard checks pass
Return: Proposed files, risks, checks, and unresolved questions`,
    template: `Mode:
Outcome:
Trusted context:
One change:
Constraints / non-goals:
You may:
Ask before:
Done when:
Return: files changed or proposed, assumptions, checks actually run, evidence, and remaining risk`,
  },
  {
    id: "plan",
    scene: "radius",
    title: "Review the change footprint",
    principle: "Keep work that serves the chosen outcome; defer unnecessary systems; clarify ambiguous requests before building them.",
    whenToUse: "After AI proposes a plan and before granting permission to edit files or add dependencies.",
    evidenceProduced: "A Keep / Defer / Needs an answer decision for every proposed item, with obligations and checks made visible.",
    prevents: "Accounts, data, permissions, and support burdens hiding behind a seemingly small feature request.",
    completedExample: `KEEP — approved facts; email contact path; agreed checks
DEFER — accounts; live availability; organizer control panel
NEEDS AN ANSWER — does “join” mean attend, volunteer, reserve, or contact?`,
    template: `For each plan item:
Disposition: Keep / Defer / Needs an answer
Connection to the chosen outcome:
New obligations or dependencies:
Question that must be answered:
Evidence required if built:`,
  },
  {
    id: "proof",
    scene: "check",
    title: "The evidence ledger",
    principle: "Every completion claim needs evidence from a trusted source, observed behavior, a change review, or a check that actually ran.",
    whenToUse: "Before accepting an AI change, after a repair, in preview, and again after publishing.",
    evidenceProduced: "A claim-by-claim record of method, exact version, result, evidence location, and remaining gap.",
    prevents: "AI confidence, screenshots, builds, or test suites being treated as proof of behavior they never examined.",
    completedExample: `Claim: Contact works on a phone
Method: Set preview to 390px and activate the action
Version: baseline 4bd91aa
Result: FAIL — clipped; no destination opens
Evidence: 390px interaction recording
Remaining gap: keyboard path not yet rerun`,
    template: `Claim:
Method or check:
Exact URL / environment / version:
Result: pass / fail / not run
Evidence location:
What this proves:
What it does not prove:
Remaining gap:`,
  },
  {
    id: "repair",
    scene: "evolve",
    title: "The evidence-anchored repair brief",
    principle: "Describe the reproducible gap, anchor it to evidence, protect passing behavior, then make the original checks pass again.",
    whenToUse: "When a check fails, an AI change has an unwanted consequence, or the cause is uncertain.",
    evidenceProduced: "A reproducible defect record, bounded repair diff, five post-repair reruns, and a verified version.",
    prevents: "Vague ‘fix it’ prompts, cause guessing, wide rewrites, hidden regressions, and green checks unrelated to the original failure.",
    completedExample: `Observed: Unsupported guarantee; contact clips at 390px and opens nothing
Reproduce: Compare facts.md, set 390px, activate the action
Expected: Approved wording; visible action opens hello@repair-cafe.example
Evidence anchor: facts.md + 390px recording + observed destination
Must preserve: Event facts, keyboard path, no personal-data collection
After repair: facts, width, destination, keyboard, final saved-file scan`,
    template: `Mode: Diagnose first; do not edit yet
Observed:
How to reproduce:
Expected:
Evidence anchor:
Environment / URL / version:
Must preserve:
Smallest permitted change:
After repair, rerun:`,
  },
  {
    id: "ship",
    scene: "ship",
    title: "Release evidence, not release ceremony",
    principle: "Publishing is an external action and a new verification boundary. A person approves the exact version after seeing its evidence and limits.",
    whenToUse: "Before making a preview public, promoting it to the live URL, or changing who can access it.",
    evidenceProduced: "A release record connecting an exact commit to build output, preview checks, approval, live smoke test, and recovery method.",
    prevents: "Publishing the wrong version, relying on stale checks, exposing secrets, losing rollback context, or treating deployment success as user success.",
    completedExample: `Release commit: [exact ID]
Build: PASS · [recorded output]
Preview: PASS · facts + desktop/390px contact path · [URL + time]
Limitations: static information page; no booking or guaranteed repair
Approval: [person + exact version + public access]
Live smoke test: [URL + time + result]
Recovery: [prior verified version + redeploy steps]`,
    template: `Release version:
Build evidence:
Core-path evidence:
Keyboard and safety evidence:
README / limitations reviewed:
Preview URL and smoke-test time:
Explicit publishing approval:
Public URL and post-release result:
Recovery version and procedure:`,
  },
] as const;

export function nextScene(scene: SceneId): SceneId {
  const index = sceneOrder.indexOf(scene);
  return sceneOrder[Math.min(index + 1, sceneOrder.length - 1)];
}

export function isCorrectChoice(options: readonly Choice[], id: string): boolean {
  return Boolean(options.find((option) => option.id === id)?.correct);
}
