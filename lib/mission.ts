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

export type Choice = {
  id: string;
  title: string;
  detail: string;
  correct?: boolean;
  essential?: boolean;
  dangerous?: boolean;
  cost?: number;
  files?: number;
};

export const sceneLabels: Record<SceneId, string> = {
  arrival: "First look",
  target: "Target",
  record: "Record",
  handoff: "Assign",
  radius: "Constrain",
  check: "Check",
  evolve: "Evolve",
  ship: "Ship gate",
  transfer: "Transfer",
  replay: "Replay",
};

export const mission = {
  title: "The page that looks finished",
  duration: "18–20 minutes",
  stakeholder:
    "Our neighborhood Repair Café needs a great website for Saturday. Make it exciting, modern, and easy. People should know what we repair and how to join. We need it soon!",
  approvedFacts: [
    "Saturday, July 25 · 10:00–14:00",
    "West Hall Community Room",
    "Small appliances, clothing, and bicycles",
    "Repairs depend on volunteer availability",
    "Questions: hello@repair-cafe.example",
  ],
  inventedFact: "Walk-ins are guaranteed a repair",
} as const;

export const arrivalChoices: Choice[] = [
  {
    id: "ship",
    title: "Ship it",
    detail: "It looks complete and the AI says every request is covered.",
  },
  {
    id: "summary",
    title: "Read the AI summary",
    detail: "Ask the same source for more reassurance before deciding.",
  },
  {
    id: "inspect",
    title: "Inspect the work",
    detail: "Compare the artifact with its facts and try the important path.",
    correct: true,
  },
];

export type TargetField = "audience" | "outcome" | "proof" | "nonGoal";

export const targetFields: Array<{
  id: TargetField;
  label: string;
  prompt: string;
  options: Choice[];
}> = [
  {
    id: "audience",
    label: "For whom",
    prompt: "Who must this work for?",
    options: [
      {
        id: "audience-everyone",
        title: "Everyone in the city",
        detail: "Broad audiences hide the decisions that make a project useful.",
      },
      {
        id: "audience-neighbors",
        title: "Nearby residents deciding on a phone",
        detail: "Specific enough to guide content, layout, and testing.",
        correct: true,
      },
    ],
  },
  {
    id: "outcome",
    label: "Outcome",
    prompt: "What should they be able to decide or do?",
    options: [
      {
        id: "outcome-impressive",
        title: "Feel impressed by the design",
        detail: "A reaction is hard to verify and does not name the real job.",
      },
      {
        id: "outcome-attend",
        title: "Know what to bring and decide whether to attend",
        detail: "A user-visible outcome that can be checked.",
        correct: true,
      },
    ],
  },
  {
    id: "proof",
    label: "Proof of done",
    prompt: "What evidence would demonstrate success?",
    options: [
      {
        id: "proof-ai",
        title: "The AI reports that the page is complete",
        detail: "A completion claim is not independent evidence.",
      },
      {
        id: "proof-behavior",
        title: "Facts match the source; the mobile action works",
        detail: "Observable checks tied directly to the outcome.",
        correct: true,
      },
    ],
  },
  {
    id: "nonGoal",
    label: "Not building yet",
    prompt: "What should this first version deliberately exclude?",
    options: [
      {
        id: "nongoal-none",
        title: "Nothing—let the AI add useful ideas",
        detail: "Unbounded initiative creates hidden systems and more failure paths.",
      },
      {
        id: "nongoal-systems",
        title: "Accounts, payments, chat, and live inventory",
        detail: "A clear boundary protects the smallest useful version.",
        correct: true,
      },
    ],
  },
];

export const repositoryOptions: Choice[] = [
  {
    id: "readme",
    title: "README.md",
    detail: "The project purpose, current scope, and how to review or run it.",
    correct: true,
    essential: true,
  },
  {
    id: "facts",
    title: "facts.md",
    detail: "The organizer-approved details that the page must not invent.",
    correct: true,
    essential: true,
  },
  {
    id: "files",
    title: "Project files and approved assets",
    detail: "The current artifact the AI will inspect and propose changes to.",
    correct: true,
    essential: true,
  },
  {
    id: "env-example",
    title: ".env.example",
    detail: "Secret names with placeholder values so setup is documented safely.",
    correct: true,
  },
  {
    id: "checkpoint",
    title: "Initial known-good commit",
    detail: "A named snapshot you can compare with or restore later.",
    correct: true,
    essential: true,
  },
  {
    id: "api-key",
    title: "The real API key",
    detail: "Credentials must stay in a private environment variable, never project history.",
    dangerous: true,
  },
  {
    id: "chat-dump",
    title: "Every previous AI conversation",
    detail: "Noise is not durable context; record decisions and trusted facts instead.",
  },
];

export const contextOptions: Choice[] = [
  {
    id: "goal",
    title: "Audience and outcome",
    detail: "Why the change exists and who must succeed.",
    correct: true,
    essential: true,
  },
  {
    id: "trusted-facts",
    title: "facts.md",
    detail: "The source the AI must use instead of filling gaps.",
    correct: true,
    essential: true,
  },
  {
    id: "current-files",
    title: "Current project files",
    detail: "The actual state to inspect before proposing changes.",
    correct: true,
    essential: true,
  },
  {
    id: "acceptance",
    title: "Acceptance checks",
    detail: "Facts match, mobile action works, and no personal data is requested.",
    correct: true,
    essential: true,
  },
  {
    id: "authority",
    title: "Authority boundary",
    detail: "The AI may edit locally and run checks; it must ask before publishing, deleting, spending, messaging, or changing access.",
    correct: true,
    essential: true,
  },
  {
    id: "mobile-reference",
    title: "Mobile screenshot",
    detail: "A relevant example of the viewport that matters most.",
    correct: true,
    essential: true,
  },
  {
    id: "secret",
    title: "Production API key",
    detail: "A secret is authority, not context. Never place it in a prompt or repository.",
    dangerous: true,
  },
  {
    id: "downloads",
    title: "Entire Downloads folder",
    detail: "Unrelated files increase noise and can expose private information.",
  },
];

export const planOptions: Choice[] = [
  {
    id: "facts-section",
    title: "Render approved event facts",
    detail: "Use facts.md; make no new claims.",
    correct: true,
    essential: true,
    cost: 1,
    files: 2,
  },
  {
    id: "mobile-action",
    title: "Add one responsive contact action",
    detail: "Use the approved organizer email; do not collect data.",
    correct: true,
    essential: true,
    cost: 1,
    files: 2,
  },
  {
    id: "verify",
    title: "Run the agreed checks",
    detail: "Compare facts, test the action at 390px, and report actual evidence.",
    correct: true,
    essential: true,
    cost: 1,
    files: 1,
  },
  {
    id: "accounts",
    title: "Add volunteer accounts",
    detail: "Introduces identity, recovery, storage, and security decisions.",
    cost: 5,
    files: 11,
  },
  {
    id: "database",
    title: "Create a live repair database",
    detail: "Adds schema, hosting, permissions, migrations, and failure states.",
    cost: 5,
    files: 9,
  },
  {
    id: "admin",
    title: "Build an organizer dashboard",
    detail: "Requires its own users, workflows, tests, and authorization model.",
    cost: 6,
    files: 14,
  },
];

export const checks: Choice[] = [
  {
    id: "facts-check",
    title: "Compare every claim with facts.md",
    detail: "FAIL · “Walk-ins are guaranteed” has no approved source.",
    correct: true,
    essential: true,
  },
  {
    id: "mobile-check",
    title: "Try the main action at 390px",
    detail: "FAIL · the action is clipped outside the phone viewport.",
    correct: true,
    essential: true,
  },
  {
    id: "keyboard-check",
    title: "Use the page with only a keyboard",
    detail: "PASS · the visible controls receive focus in a useful order.",
    correct: true,
  },
  {
    id: "secret-check",
    title: "Inspect the diff and repository for secrets",
    detail: "PASS · no credential appears in tracked files.",
    correct: true,
    essential: true,
  },
  {
    id: "execution-log",
    title: "Read the actual check log",
    detail: "NOT RUN · the AI summary claimed tests passed, but the log is empty.",
    correct: true,
    essential: true,
  },
  {
    id: "ask-again",
    title: "Ask the AI whether it is confident",
    detail: "Another claim from the same source does not verify the artifact.",
  },
];

export type RepairField = "observed" | "reproduce" | "expected" | "preserve";

export const repairFields: Array<{
  id: RepairField;
  label: string;
  options: Choice[];
}> = [
  {
    id: "observed",
    label: "Observed",
    options: [
      {
        id: "observed-exact",
        title: "An unsupported guarantee appears; the action clips at 390px",
        detail: "Names the two observed failures without guessing their cause.",
        correct: true,
      },
      {
        id: "observed-broken",
        title: "The whole website is broken",
        detail: "Too broad to guide a small, safe correction.",
      },
    ],
  },
  {
    id: "reproduce",
    label: "How to reproduce",
    options: [
      {
        id: "reproduce-exact",
        title: "Open the event section; then test the action at 390px",
        detail: "Gives another person the exact path to see both failures.",
        correct: true,
      },
      {
        id: "reproduce-none",
        title: "Look around until you see it",
        detail: "Not repeatable, so the repair cannot be verified reliably.",
      },
    ],
  },
  {
    id: "expected",
    label: "Expected",
    options: [
      {
        id: "expected-exact",
        title: "Only sourced claims; the action remains fully visible and usable",
        detail: "Defines the behavior the rerun must prove.",
        correct: true,
      },
      {
        id: "expected-better",
        title: "Make it better and more responsive",
        detail: "Subjective language does not create a pass/fail boundary.",
      },
    ],
  },
  {
    id: "preserve",
    label: "Must preserve",
    options: [
      {
        id: "preserve-verified",
        title: "Approved facts, keyboard path, and secret-safe repository",
        detail: "Protects behavior that already has evidence.",
        correct: true,
      },
      {
        id: "preserve-nothing",
        title: "Rewrite whatever is easiest",
        detail: "A wide rewrite can destroy verified behavior and enlarge review work.",
      },
    ],
  },
];

export const shipGate: Choice[] = [
  {
    id: "facts-pass",
    title: "Trusted facts pass",
    detail: "Every public claim traces to facts.md.",
    correct: true,
    essential: true,
  },
  {
    id: "core-pass",
    title: "Core path works on desktop and mobile",
    detail: "The important action was manually exercised after the repair.",
    correct: true,
    essential: true,
  },
  {
    id: "access-pass",
    title: "Keyboard path remains usable",
    detail: "The repair preserved the previously verified interaction.",
    correct: true,
  },
  {
    id: "secret-pass",
    title: "Secrets stay outside tracked files",
    detail: "The final diff and repository history contain no credentials.",
    correct: true,
    essential: true,
  },
  {
    id: "readme-current",
    title: "README and limitations are current",
    detail: "Another person can understand, run, and review what actually exists.",
    correct: true,
    essential: true,
  },
  {
    id: "final-commit",
    title: "Create a named, verified commit",
    detail: "The release has a known-good restore point.",
    correct: true,
    essential: true,
  },
];

export const transferQuestions = [
  {
    id: "source",
    label: "What is the source of truth?",
    options: [
      { id: "source-ai", title: "The AI's explanation", detail: "It sounds certain." },
      {
        id: "source-receipts",
        title: "Original receipts and approved budget rules",
        detail: "They define the facts the calculation must represent.",
        correct: true,
      },
      { id: "source-total", title: "The newest total", detail: "It is already in the sheet." },
    ],
  },
  {
    id: "proof",
    label: "What would prove the new total?",
    options: [
      { id: "proof-again", title: "Ask the AI to check itself", detail: "The same source repeats its claim." },
      {
        id: "proof-recalc",
        title: "Inspect the changed formula and independently recalculate samples",
        detail: "The evidence comes from the artifact and trusted inputs.",
        correct: true,
      },
      { id: "proof-format", title: "Make the total bold", detail: "Presentation does not test arithmetic." },
    ],
  },
  {
    id: "next",
    label: "What is the safest next move?",
    options: [
      { id: "next-rewrite", title: "Let AI rebuild the spreadsheet", detail: "Expands a local issue into a wide change." },
      {
        id: "next-bounded",
        title: "Preserve the original, repair the one formula, and rerun checks",
        detail: "A bounded, reversible change driven by evidence.",
        correct: true,
      },
      { id: "next-publish", title: "Publish and monitor complaints", detail: "Moves testing cost to real users." },
    ],
  },
] as const;

export const fieldNotes = [
  {
    id: "brief",
    scene: "target" as SceneId,
    title: "The four-line build brief",
    principle: "A useful project starts with an outcome and evidence, not a feature wish list.",
    template: `For: [specific person in a specific situation]\nOutcome: [what they can decide or do]\nProof: [observable checks]\nNot yet: [explicit non-goals]`,
  },
  {
    id: "repository",
    scene: "record" as SceneId,
    title: "Repository as shared memory",
    principle: "Git records recoverable snapshots; GitHub stores and shares that history.",
    template: `Before AI edits:\n1. Keep purpose and scope in README.md\n2. Keep trusted facts in a named source file\n3. Exclude secrets with .gitignore\n4. Inspect what will be saved\n5. Create a named known-good commit`,
  },
  {
    id: "handoff",
    scene: "handoff" as SceneId,
    title: "The bounded handoff",
    principle: "Context is the smallest set of trusted material needed for one decision or change.",
    template: `Mode: Plan first; do not edit yet.\nOutcome:\nTrusted context:\nOne change:\nConstraints / non-goals:\nYou may:\nAsk before:\nProof of done:\nAfterward, report files changed, assumptions, and checks actually run.`,
  },
  {
    id: "plan",
    scene: "radius" as SceneId,
    title: "Plan before permission",
    principle: "Review the blast radius before an AI changes files or creates new systems.",
    template: `Restate the goal and constraints. Propose the smallest plan without editing files. List assumptions, files likely to change, new dependencies, risks, and how each requirement will be verified.`,
  },
  {
    id: "proof",
    scene: "check" as SceneId,
    title: "The proof ledger",
    principle: "Every completion claim owes evidence from the artifact, a trusted source, or a check that actually ran.",
    template: `Requirement | Check | Result | Evidence\nTrusted facts | Compare with source | pass/fail | exact mismatch\nCore action | Exercise the path | pass/fail | observed behavior\nSmall screen | Test target width | pass/fail | viewport + result\nSafety | Inspect diff/history | pass/fail | findings`,
  },
  {
    id: "repair",
    scene: "evolve" as SceneId,
    title: "Evidence-based repair",
    principle: "A useful correction describes a reproducible gap and protects verified behavior.",
    template: `Observed:\nHow to reproduce:\nExpected:\nEvidence:\nMust preserve:\nAfter the smallest repair, rerun:`,
  },
  {
    id: "ship",
    scene: "ship" as SceneId,
    title: "The ship gate",
    principle: "Deployment is a verification boundary, not a celebration button.",
    template: `□ Production build succeeds\n□ Core path manually works\n□ Mobile and keyboard checks pass\n□ No secrets or private data\n□ README and limitations are current\n□ Final verified commit exists\n□ Rollback point is known`,
  },
] as const;

export function nextScene(scene: SceneId): SceneId {
  const index = sceneOrder.indexOf(scene);
  return sceneOrder[Math.min(index + 1, sceneOrder.length - 1)];
}

export function isCorrectChoice(options: readonly Choice[], id: string): boolean {
  return Boolean(options.find((option) => option.id === id)?.correct);
}
