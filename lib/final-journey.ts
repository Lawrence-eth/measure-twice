/**
 * Authored content for the final Pentimento journey.
 *
 * The core route is deliberately small: eight stops, thirteen meaningful
 * interactions, and one project canvas that gains a layer at every stop.
 * Optional reference content lives outside the required route.
 */

export const finalLearningStages = [
  "idea",
  "tools",
  "project-home",
  "ask-ai",
  "build",
  "check",
  "go-live",
  "improve",
] as const;

export const finalStages = [
  "welcome",
  ...finalLearningStages,
  "completion",
] as const;

export type FinalLearningStage = (typeof finalLearningStages)[number];
export type FinalStage = (typeof finalStages)[number];
export type ToolRoute = "hosted" | "repository";

export type IdeaChoice = "facts-email" | "booking" | "donation";
export type ToolChoice = ToolRoute;
export type ProjectHomeChoice = "chat-only" | "route-home";
export type SecretChoice = "project-files" | "private-env";
export type AiFirstChoice = "build-everything" | "inspect-plan";
export type PlanApprovalChoice = "approve-step-one" | "revise-step-one";
export type BuildEvidenceChoice =
  | "ai-claim"
  | "preview-only"
  | "full-evidence";
export type CheckAttemptChoice = "try-contact";
export type RepairChoice = "redesign" | "bounded-repair";
export type CheckRetryChoice = "retry-contact";
export type ReleaseVersionChoice = "v3-broken" | "v4-checked";
export type ReleaseProofChoice = "dashboard-success" | "public-path";
export type ImproveChoice =
  | "page-only"
  | "source-then-page"
  | "redesign-everything";

export type FinalChoice<Id extends string> = {
  id: Id;
  label: string;
  consequence: string;
  canvasChange: string;
  recommended: boolean;
};

export const finalOpening = {
  promise: "Learn to build with AI. One clear step at a time.",
  example:
    "Make thirteen decisions for one small page, from rough idea to checked release.",
  reassurance: "No code · nothing real publishes · about 12–15 minutes",
  primaryAction: "Begin the guided build",
  overviewAction: "Preview how the lesson works",
} as const;

export const ideaChoices = [
  {
    id: "facts-email",
    label: "See approved event facts and email the organizer",
    consequence:
      "This is one complete visitor path. It needs approved facts and a standard email link, not a new service.",
    canvasChange: "Adds the first-version brief.",
    recommended: true,
  },
  {
    id: "booking",
    label: "Book a repair slot",
    consequence:
      "Booking adds changing availability, personal data, cancellations, and someone to operate the schedule.",
    canvasChange: "Shows the extra booking systems beneath the idea.",
    recommended: false,
  },
  {
    id: "donation",
    label: "Donate online",
    consequence:
      "Donations add a payment provider, transaction states, receipts, disputes, and an accountable owner.",
    canvasChange: "Shows the extra payment systems beneath the idea.",
    recommended: false,
  },
] as const satisfies readonly FinalChoice<IdeaChoice>[];

export const toolChoices = [
  {
    id: "hosted",
    label: "Faster preview · more dependence on one service",
    consequence:
      "A hosted builder reduces setup, but you must check version history, export, ownership, limits, and cost.",
    canvasChange: "Connects a hosted workspace to saved versions and a host.",
    recommended: true,
  },
  {
    id: "repository",
    label: "More setup · clearer files and recoverable history",
    consequence:
      "A repository route makes files and history clearer, but adds local setup and a separate publishing step.",
    canvasChange: "Connects a repository-aware workspace to Git, GitHub, and a host.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<ToolChoice>[];

export const projectHomeChoices = [
  {
    id: "chat-only",
    label: "Only in this chat",
    consequence:
      "A chat can explain the work, but it is not a dependable home for project files and versions.",
    canvasChange: "Leaves the project without a recoverable home.",
    recommended: false,
  },
  {
    id: "route-home",
    label: "In the project home for my route",
    consequence:
      "The files, instructions, and saved versions survive after the conversation closes.",
    canvasChange: "Adds a route-specific project home and recoverable history.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<ProjectHomeChoice>[];

export const secretChoices = [
  {
    id: "project-files",
    label: "Yes—because AI helped create it",
    consequence:
      "Using AI during the build does not make AI part of the finished page. Adding a key would create cost, privacy, and failure work with no visitor benefit.",
    canvasChange: "Shows an unnecessary runtime AI dependency.",
    recommended: false,
  },
  {
    id: "private-env",
    label: "No—the page uses approved facts and a normal email link",
    consequence:
      "AI helps build the project, but visitors do not need an AI response. This version needs no AI API key.",
    canvasChange: "Keeps runtime AI outside the first version.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<SecretChoice>[];

export const aiFirstChoices = [
  {
    id: "build-everything",
    label: "Build and deploy everything",
    consequence:
      "AI would have to guess about scope, files, checks, and release before you can inspect a small decision.",
    canvasChange: "Shows an oversized, unapproved change.",
    recommended: false,
  },
  {
    id: "inspect-plan",
    label: "Inspect the project, return a small plan, and stop for approval",
    consequence:
      "The project and brief become context. You can see the proposed steps before any file changes.",
    canvasChange: "Adds a bounded work agreement.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<AiFirstChoice>[];

export const planApprovalChoices = [
  {
    id: "revise-step-one",
    label: "Approve all three steps before reviewing again",
    consequence:
      "Several changes would accumulate before you could compare the result with the brief or catch a wrong direction.",
    canvasChange: "Combines three review points into one oversized change.",
    recommended: false,
  },
  {
    id: "approve-step-one",
    label: "Approve step one; review its evidence before step two",
    consequence:
      "AI may make one visible change, report evidence, and stop before the next decision.",
    canvasChange: "Pins one approved step to the work agreement.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<PlanApprovalChoice>[];

export const buildEvidenceChoices = [
  {
    id: "ai-claim",
    label: "Save now—the typecheck passed",
    consequence:
      "A typecheck supports code and type consistency. It does not prove that a visitor can finish the path.",
    canvasChange: "Leaves the reported change unverified.",
    recommended: false,
  },
  {
    id: "preview-only",
    label: "Ask AI to polish the preview again",
    consequence:
      "A preview can show appearance, but a hidden broken action may still block the visitor.",
    canvasChange: "Adds visual evidence but leaves the path unchecked.",
    recommended: false,
  },
  {
    id: "full-evidence",
    label: "Open the preview and try the visitor path",
    consequence:
      "This opens the Check stop, where your next action supplies the missing behavior evidence.",
    canvasChange: "Hands the saved candidate to the visitor-path check.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<BuildEvidenceChoice>[];

export const checkAttemptChoices = [
  {
    id: "try-contact",
    label: "Try the contact action",
    consequence:
      "The polished action does nothing. The observed failure can now be reported without guessing at its cause.",
    canvasChange: "Exposes the inactive contact path beneath the polish.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<CheckAttemptChoice>[];

export const checkRetryChoices = [
  {
    id: "retry-contact",
    label: "Try the repaired email action",
    consequence:
      "Your activation reached the simulated mailto target. No email was sent; a real preview still needs one keyboard and one pointer check.",
    canvasChange: "Records one successful repeat on the checked V4 layer.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<CheckRetryChoice>[];

export const repairChoices = [
  {
    id: "redesign",
    label: "Redesign the contact section",
    consequence:
      "A redesign changes working decisions and makes the small defect harder to isolate.",
    canvasChange: "Shows unnecessary changes spreading across the canvas.",
    recommended: false,
  },
  {
    id: "bounded-repair",
    label: "Apply the bounded repair and try again",
    consequence:
      "The standard email link is repaired while the approved facts, layout, and private boundary stay unchanged.",
    canvasChange: "Repaints only the broken contact layer and records a passing repeat.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<RepairChoice>[];

export const releaseVersionChoices = [
  {
    id: "v3-broken",
    label: "V3 · visual review passed; contact path not run",
    consequence:
      "V3 looks finished, but its known dead-end contact path makes it an unsafe release candidate.",
    canvasChange: "Marks V3 as superseded, not releasable.",
    recommended: false,
  },
  {
    id: "v4-checked",
    label: "V4 · contact repaired; repeated path passed",
    consequence:
      "V4 contains the bounded repair and the repeated human-path check.",
    canvasChange: "Pins V4 as the exact release candidate.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<ReleaseVersionChoice>[];

export const releaseProofChoices = [
  {
    id: "dashboard-success",
    label: "Deployment dashboard · finished",
    consequence:
      "The host completed a deployment, but that does not prove the public address serves the right working path.",
    canvasChange: "Leaves the live layer unverified.",
    recommended: false,
  },
  {
    id: "public-path",
    label: "Public address · important path repeated",
    consequence:
      "A fresh public check proves the chosen version is available and the important visitor path still works.",
    canvasChange: "Adds a verified Live layer while Recovery stays pinned.",
    recommended: true,
  },
] as const satisfies readonly FinalChoice<ReleaseProofChoice>[];

export const improveChoices = [
  {
    id: "page-only",
    label: "Update only the visible page copy",
    consequence:
      "The new statement would have no trusted source, so a later edit could quietly contradict it.",
    canvasChange: "Shows an unsupported fact floating above the saved source.",
    recommended: false,
  },
  {
    id: "source-then-page",
    label: "Update the organizer note, then the page copy",
    consequence:
      "The approved access fact gains a durable home before the public wording changes.",
    canvasChange: "Adds a source-backed V5 layer without erasing V4.",
    recommended: true,
  },
  {
    id: "redesign-everything",
    label: "Redesign the page while adding the fact",
    consequence:
      "A one-fact update does not justify retesting an unrelated redesign.",
    canvasChange: "Shows the request expanding beyond its useful result.",
    recommended: false,
  },
] as const satisfies readonly FinalChoice<ImproveChoice>[];

/**
 * The keys are the thirteen required interactions in route order.
 */
export const finalChoices = {
  idea: ideaChoices,
  tools: toolChoices,
  projectHome: projectHomeChoices,
  secret: secretChoices,
  aiFirst: aiFirstChoices,
  planApproval: planApprovalChoices,
  buildEvidence: buildEvidenceChoices,
  checkAttempt: checkAttemptChoices,
  repair: repairChoices,
  checkRetry: checkRetryChoices,
  releaseVersion: releaseVersionChoices,
  releaseProof: releaseProofChoices,
  improve: improveChoices,
} as const;

export const FINAL_REQUIRED_INTERACTIONS = 13;

export type FinalArtifactId =
  | "first-version-brief"
  | "tool-route"
  | "project-home-checklist"
  | "planning-request"
  | "change-record"
  | "defect-report"
  | "release-card"
  | "update-card";

export type FinalJourneyStop = {
  id: FinalLearningStage;
  number: number;
  navLabel: string;
  heading: string;
  introduction: string;
  savedLabel: string;
  question: string;
  requiredInteractions: 1 | 2 | 3;
  canvasLayer: string;
  reusableRule: string;
  artifactId: FinalArtifactId;
  optionalDepth: string;
};

export const finalJourney = [
  {
    id: "idea",
    number: 1,
    navLabel: "Idea",
    heading: "Start with one finish",
    introduction:
      "Small enough to complete. Useful enough to matter.",
    savedLabel: "one visitor + one complete path",
    question: "What should the first visitor be able to finish?",
    requiredInteractions: 1,
    canvasLayer: "First-version brief",
    reusableRule:
      "A small complete path teaches more than a large unfinished feature list.",
    artifactId: "first-version-brief",
    optionalDepth: "See what booking and payments would add.",
  },
  {
    id: "tools",
    number: 2,
    navLabel: "Tools",
    heading: "Give each tool one job",
    introduction:
      "AI helps build. A project home remembers. A host publishes.",
    savedLabel: "build here + save here + publish here",
    question: "Which tradeoff matters more for your first project?",
    requiredInteractions: 1,
    canvasLayer: "Connected tool route",
    reusableRule: "Choose tools by their jobs, not their product names.",
    artifactId: "tool-route",
    optionalDepth: "Open the tool decoder.",
  },
  {
    id: "project-home",
    number: 3,
    navLabel: "Project home",
    heading: "Make the work survive",
    introduction:
      "Keep the project recoverable. Add runtime AI only if visitors need it.",
    savedLabel: "recoverable files + no unnecessary AI key",
    question: "Where should the work survive after this chat closes?",
    requiredInteractions: 2,
    canvasLayer: "Files, history, remote copy, and private boundary",
    reusableRule:
      "Keep the project recoverable; add AI inside the product only when the visitor truly needs it.",
    artifactId: "project-home-checklist",
    optionalDepth: "Decode Git, GitHub, saved versions, and export.",
  },
  {
    id: "ask-ai",
    number: 4,
    navLabel: "Ask AI",
    heading: "See the plan first",
    introduction:
      "Ask AI to inspect and stop before it edits.",
    savedLabel: "one shown step approved",
    question: "What should AI do first?",
    requiredInteractions: 2,
    canvasLayer: "Work agreement and approved first step",
    reusableRule: "Approve a shown plan one understandable step at a time.",
    artifactId: "planning-request",
    optionalDepth: "Open the full copyable planning request.",
  },
  {
    id: "build",
    number: 5,
    navLabel: "Build",
    heading: "Trust evidence, not “Done”",
    introduction:
      "Inspect, run, try the path, then save.",
    savedLabel: "evidence collected before saving",
    question: "What evidence do you need before saving this version?",
    requiredInteractions: 1,
    canvasLayer: "Visible change and saved V1",
    reusableRule: "Ask → inspect → run → check → save.",
    artifactId: "change-record",
    optionalDepth: "Scrub through the later V2 and V3 saved layers.",
  },
  {
    id: "check",
    number: 6,
    navLabel: "Check",
    heading: "Use it like a visitor",
    introduction:
      "A polished page can still hide a dead end.",
    savedLabel: "failure repaired + same path repeated",
    question: "What happens when you try the contact action?",
    requiredInteractions: 3,
    canvasLayer: "Exposed defect, bounded repair, and checked V4",
    reusableRule:
      "Report what you observed, repair the smallest cause, and repeat the path.",
    artifactId: "defect-report",
    optionalDepth: "Also inspect approved facts and the 390px layout.",
  },
  {
    id: "go-live",
    number: 7,
    navLabel: "Go live",
    heading: "Release what you checked",
    introduction:
      "A deployment is not proof of the public path.",
    savedLabel: "exact version checked in public",
    question: "Which version should go live?",
    requiredInteractions: 2,
    canvasLayer: "Selected V4, verified Live layer, and pinned Recovery",
    reusableRule:
      "A successful deployment is not a release until the public path works.",
    artifactId: "release-card",
    optionalDepth: "Open the release and recovery checklist.",
  },
  {
    id: "improve",
    number: 8,
    navLabel: "Improve",
    heading: "Change one trusted layer",
    introduction:
      "Update the source, then only what depends on it.",
    savedLabel: "source changed before the surface",
    question: "What changes first?",
    requiredInteractions: 1,
    canvasLayer: "Trusted access fact and saved V5",
    reusableRule:
      "Change the trusted source first, then rerun only affected checks.",
    artifactId: "update-card",
    optionalDepth: "Open the complete bounded update request.",
  },
] as const satisfies readonly FinalJourneyStop[];

export const threeRoleMap = [
  {
    id: "ai-workspace",
    label: "AI workspace",
    job: "Helps build",
    plainMeaning: "Proposes and edits project files after you approve the scope.",
  },
  {
    id: "project-home",
    label: "Project home",
    job: "Saves versions",
    plainMeaning: "Keeps files, instructions, and recoverable versions.",
  },
  {
    id: "host",
    label: "Host",
    job: "Serves a version",
    plainMeaning: "Serves one chosen version at a web address.",
  },
] as const;

export type ToolRouteGuidance = {
  id: ToolRoute;
  title: string;
  diagram: readonly [string, string, string];
  buildHere: string;
  keepHere: string;
  publishHere: string;
  firstAction: string;
  watchFor: string;
};

export const toolRouteGuidance = {
  hosted: {
    id: "hosted",
    title: "Fastest first preview",
    diagram: ["Hosted AI workspace", "Saved versions + connection/export", "Host"],
    buildHere: "A hosted AI builder",
    keepHere: "Saved versions, plus a GitHub connection or export",
    publishHere: "Its built-in host or a connected host",
    firstAction: "Create an empty project, add the brief, and ask for a plan.",
    watchFor: "Export access, ownership, usage limits, and hosting cost",
  },
  repository: {
    id: "repository",
    title: "Visible files and history",
    diagram: ["Repository-aware AI workspace", "Folder + Git + GitHub copy", "Web host"],
    buildHere: "A repository-aware AI workspace",
    keepHere: "The project folder, Git history, and a GitHub copy",
    publishHere: "A separate web host",
    firstAction: "Create the folder and brief, ask AI to start version history (Git), then ask for a plan.",
    watchFor: "Setup errors, private files, and releasing an unchecked version",
  },
} as const satisfies Record<ToolRoute, ToolRouteGuidance>;

export type ProjectHomeGuidance = {
  id: ToolRoute;
  path: readonly [string, string, string];
  checklist: readonly [string, string, string, string];
};

export const projectHomeGuidance = {
  hosted: {
    id: "hosted",
    path: ["Hosted project", "Saved versions", "GitHub connection or export"],
    checklist: [
      "Name the project and save the approved brief with it.",
      "Find the saved-version history and its restore action.",
      "Connect GitHub or export a complete copy you can reopen elsewhere.",
      "Keep any future private key in protected Secrets/Environment settings, never chat, browser code, or an export.",
    ],
  },
  repository: {
    id: "repository",
    path: ["Project folder", "Saved history (Git)", "Online copy (GitHub)"],
    checklist: [
      "Create one named folder with README.md (how to run it) and docs/brief.md (what V1 should do).",
      "Ask AI to start recoverable version history (Git); inspect every file before the first saved snapshot (commit).",
      "Upload that reviewed snapshot (push) to an online project copy (a GitHub repository) you control.",
      "If a future project needs a private key, keep its private settings file (.env.local) out of saved history and browser code.",
    ],
  },
} as const satisfies Record<ToolRoute, ProjectHomeGuidance>;

export const firstVersionBriefArtifact = {
  title: "First-version brief",
  path:
    "Nearby visitor → approved facts → decide whether their item fits → email a question",
  notNow:
    "Accounts, booking, payments, live availability, or AI advice",
  trustedFacts: [
    "Saturday, July 25 · 10:00–14:00",
    "West Hall Community Room",
    "Small appliances, clothing, and bicycles",
    "Repairs depend on volunteer availability",
    "Questions: hello@willow-fix.example",
  ],
} as const;

export const vagueBuildRequest =
  "Make the Willow Fix Day page beautiful and deploy everything.";

export const shownThreeStepPlan = [
  "Build the approved page structure; show the files and preview; stop.",
  "Add the email path and phone layout; try both; stop.",
  "Check facts, the visitor path, and 390px layout; prepare one candidate.",
] as const;

export const planningArtifact = {
  title: "Planning request",
  conciseRequest:
    "Inspect the project and docs/brief.md. Return three small steps. Preserve the Not now list. Do not change files or deploy until I approve a shown step.",
  approvedFirstStep:
    "Build the page structure from the approved brief, show the changed files and preview, then stop.",
} as const;

export const buildArtifact = {
  title: "Change record · V1",
  request: planningArtifact.approvedFirstStep,
  changedFiles: ["docs/brief.md", "app/page.tsx"],
  commandResult:
    "npm run typecheck → exited successfully (code/type consistency only)",
  visibleResult: "Approved event facts appear in the visitor’s reading order.",
  visitorCheck: "Open → read the event facts → reach the contact action.",
  savedVersion: "V1 · Clear structure",
  laterLayers: [
    "V2 · Working contact path",
    "V3 · Responsive polish, with a hidden defect not yet checked",
  ],
} as const;

export const evidenceLadder = [
  {
    id: "claimed",
    label: "AI claim",
    proves: "What the tool believes it did",
  },
  {
    id: "files",
    label: "Files",
    proves: "What was actually edited",
  },
  {
    id: "preview",
    label: "Preview",
    proves: "What appeared in the workspace",
  },
  {
    id: "human",
    label: "Human path",
    proves: "What a person could finish in the checked preview",
  },
  {
    id: "public",
    label: "Public path",
    proves: "What a visitor could finish at the live address",
  },
] as const;

export const defectReportArtifact = {
  title: "Defect report",
  fields: [
    {
      label: "Observed",
      value: "The contact action looks ready, but selecting it does nothing.",
    },
    {
      label: "Steps",
      value:
        "Open the page → reach Contact → select the email action by pointer or keyboard.",
    },
    {
      label: "Expected",
      value:
        "Ask the device to open its configured email app addressed to hello@willow-fix.example.",
    },
    {
      label: "Preserve",
      value:
        "Approved facts, page order, phone layout, visible focus, and no stored personal data.",
    },
    {
      label: "Repeat after repair",
      value:
        "Try the simulated contact path again. In a real preview, repeat by pointer and keyboard.",
    },
  ],
  boundedRepair:
    "Use a standard mailto link with the approved address. Do not add a form, package, or redesign.",
  result:
    "The simulated mailto link targets the approved example address in checked V4.",
} as const;

export const releasePipeline = ["Workspace", "Preview", "Live"] as const;

export const releaseArtifact = {
  title: "Release card",
  exactVersion: "V4 · Checked repair",
  publicUrl: "https://willow-fix.example",
  publicCheck:
    "Opened the public address fresh and repeated the facts-to-email visitor path.",
  knownLimit:
    "Information page only; no booking, guaranteed repair, or live availability.",
  restoreAction:
    "Open deployment history, restore the pinned previous working version, then check the public address again.",
  recoveryLabel: "Recovery · V2 · last known working version",
} as const;

export const updateRequest =
  "Add that step-free access is through the side entrance on Willow Lane.";

export const updateArtifact = {
  title: "Update card · V5",
  sourceChange:
    "Add the organizer-approved wording to docs/brief.md first.",
  boundedRequest:
    "Then add the same wording beside the venue. Preserve the event facts, contact path, layout, and Not now list.",
  affectedChecks: [
    "Compare the new wording with docs/brief.md.",
    "Confirm venue and access details are easy to find together.",
    "Run the affected checks, then repeat one core visitor-path smoke check at 390px and by keyboard.",
  ],
  savedVersion: "V5 · Step-free entrance",
} as const;

export const finalArtifacts = {
  firstVersionBrief: firstVersionBriefArtifact,
  toolRoutes: toolRouteGuidance,
  projectHomes: projectHomeGuidance,
  planning: planningArtifact,
  build: buildArtifact,
  defect: defectReportArtifact,
  release: releaseArtifact,
  update: updateArtifact,
} as const;

export type ToolDecoderItem = {
  id:
    | "hosted-builder"
    | "repository-agent"
    | "project-home"
    | "host"
    | "runtime-ai";
  label: string;
  plainMeaning: string;
  askBeforeChoosing: string;
};

export const toolDecoder = [
  {
    id: "hosted-builder",
    label: "Hosted AI builder",
    plainMeaning:
      "Builds and previews in one browser workspace, often with publishing built in.",
    askBeforeChoosing: "Can I recover versions and connect or export my files?",
  },
  {
    id: "repository-agent",
    label: "Repository-aware AI workspace",
    plainMeaning:
      "Changes visible files in a project with Git history you control.",
    askBeforeChoosing: "Can I inspect changes and run the project’s checks?",
  },
  {
    id: "project-home",
    label: "Project home",
    plainMeaning:
      "The files and recoverable history: saved versions or a folder, Git, and GitHub copy.",
    askBeforeChoosing: "Where will the work survive after this chat closes?",
  },
  {
    id: "host",
    label: "Host",
    plainMeaning:
      "Makes one chosen project version available at a preview or public address.",
    askBeforeChoosing: "Which exact version is live, and how can I restore one?",
  },
  {
    id: "runtime-ai",
    label: "AI inside the finished product",
    plainMeaning:
      "Adds model responses for visitors, plus cost, privacy, safety, and failure work.",
    askBeforeChoosing:
      "Does the visitor truly need an AI response? The Willow Fix Day page does not.",
  },
] as const satisfies readonly ToolDecoderItem[];

export const durableHabits = [
  "Choose one complete path and name what is Not now.",
  "Keep files, history, and private settings in the right places.",
  "Ask → inspect → run → check → save in small steps.",
  "Release one checked version, verify it publicly, and preserve recovery.",
] as const;

export const playbookMilestones = [
  "Brief ready",
  "Project home ready",
  "First path working",
  "Candidate checked",
  "Public version checked",
] as const;

export type PlaybookCardId =
  | "brief"
  | "route"
  | "work-loop"
  | "repair"
  | "release-update";

export type PlaybookIndexCard = {
  id: PlaybookCardId;
  title: string;
  summary: string;
  includes: readonly string[];
};

export const playbookIndex = [
  {
    id: "brief",
    title: "Shape the first version",
    summary: "Name the person, useful result, complete path, facts, and boundary.",
    includes: ["First-version brief", "Must-have / Not now", "Finish line"],
  },
  {
    id: "route",
    title: "Choose a route and project home",
    summary: "Decide where AI builds, the work survives, and the version publishes.",
    includes: ["Route card", "Project-home checklist", "Private-file check"],
  },
  {
    id: "work-loop",
    title: "Ask, inspect, and save",
    summary: "Approve one shown step and collect evidence before saving.",
    includes: ["Planning request", "Evidence ladder", "Change record"],
  },
  {
    id: "repair",
    title: "Check and repair",
    summary: "Try the path, report observations, make a bounded repair, and repeat.",
    includes: ["Defect report", "Repair request", "Affected checks"],
  },
  {
    id: "release-update",
    title: "Release and improve",
    summary: "Publish an exact checked version, keep recovery, and update the source first.",
    includes: ["Release card", "Milestones", "Update card"],
  },
] as const satisfies readonly PlaybookIndexCard[];

export type TeachingMirrorFieldKey =
  | "person"
  | "situation"
  | "usefulResult"
  | "completePath"
  | "trustedFacts"
  | "mustHave"
  | "notNow"
  | "doneWhen"
  | "toolRoute";

export type TeachingMirrorField = {
  id: TeachingMirrorFieldKey;
  label: string;
  prompt: string;
  kind: "short-text" | "long-text" | "route";
};

export type TeachingMirrorFieldGroup = {
  step: 1 | 2 | 3 | 4;
  title: string;
  fields: readonly TeachingMirrorField[];
};

export const teachingMirrorFieldGroups = [
  {
    step: 1,
    title: "Person and useful result",
    fields: [
      {
        id: "person",
        label: "Person",
        prompt: "Who should this first version help?",
        kind: "short-text",
      },
      {
        id: "situation",
        label: "Situation",
        prompt: "What are they trying to decide or finish?",
        kind: "short-text",
      },
      {
        id: "usefulResult",
        label: "Useful result",
        prompt: "What should become possible for them?",
        kind: "short-text",
      },
    ],
  },
  {
    step: 2,
    title: "Path and trusted facts",
    fields: [
      {
        id: "completePath",
        label: "Complete path",
        prompt: "Write the beginning → middle → finish.",
        kind: "long-text",
      },
      {
        id: "trustedFacts",
        label: "Trusted facts",
        prompt: "Which approved source can the project use?",
        kind: "long-text",
      },
    ],
  },
  {
    step: 3,
    title: "Must-have and Not now",
    fields: [
      {
        id: "mustHave",
        label: "Must-have",
        prompt: "What is the minimum needed for that path?",
        kind: "long-text",
      },
      {
        id: "notNow",
        label: "Not now",
        prompt: "Which tempting systems can wait?",
        kind: "long-text",
      },
    ],
  },
  {
    step: 4,
    title: "Finish line and route",
    fields: [
      {
        id: "doneWhen",
        label: "Finish line",
        prompt: "What can another person try to prove it works?",
        kind: "long-text",
      },
      {
        id: "toolRoute",
        label: "Starter route",
        prompt: "Choose fastest preview or visible files and history.",
        kind: "route",
      },
    ],
  },
] as const satisfies readonly TeachingMirrorFieldGroup[];
