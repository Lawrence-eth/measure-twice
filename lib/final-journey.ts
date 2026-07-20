/**
 * Authored content for the final Pentimento journey.
 *
 * The core route is deliberately small: eight stops, fourteen meaningful
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
export type AffectedCheckChoice =
  | "affected-plus-smoke"
  | "surface-only"
  | "retest-redesign";

export type FinalChoice<Id extends string> = {
  id: Id;
  label: string;
  consequence: string;
  canvasChange: string;
  recommended: boolean;
};

export const finalOpening = {
  kicker: "An interactive field lesson for first-time AI builders",
  promise: "AI can make it look finished.",
  destination:
    "Pentimento teaches you how to turn an AI-made preview into a project you can test, trust, and release.",
  explanation:
    "Direct one fictional site from idea to a checked public version—without writing code.",
  payoff:
    "Finish with five reusable tools: a V1 brief, tool map, AI work agreement, evidence ladder, and release-and-recovery card.",
  reassurance: "Fictional project · no email sent · nothing published",
  primaryAction: "Begin with the first promise",
  overviewAction: "Preview the 8-stop route",
} as const;

export const welcomePrologueBeats = [
  {
    id: "claim",
    number: "01",
    eyebrow: "The claim",
    title: "AI says this page is ready.",
    body:
      "The event details are clear. The email button looks complete. But a polished screen cannot prove the project is ready to publish.",
    margin: "AI report · “Ready to publish.”",
  },
  {
    id: "observation",
    number: "02",
    eyebrow: "The observation",
    title: "Appearance is not behavior.",
    body:
      "Click the visitor’s only important action and nothing happens. The preview showed how the page looked; the click revealed how it behaved.",
    margin: "Observed · Email action — nothing happened",
  },
  {
    id: "underpainting",
    number: "03",
    eyebrow: "The underpainting",
    title: "The screen is only the top layer.",
    body:
      "A reliable project keeps more than its visible page. It keeps a clear promise, recoverable files, evidence that the important path works, and the exact version that was released.",
    margin: "Trust is the connection between the layers—not the shine of the surface.",
  },
  {
    id: "method",
    number: "04",
    eyebrow: "The method",
    title: "Building with AI is not mainly a prompting skill.",
    body:
      "AI can accelerate the making. You still decide what the project promises, where its work survives, what counts as proof, and which version is ready to release.",
    margin: "Learn the judgment between prompt and publish.",
  },
] as const;

export const welcomeAuditLayers = [
  {
    id: "promise",
    label: "Promise",
    issue: "The one result this version must finish.",
  },
  {
    id: "custody",
    label: "Project home",
    issue: "The files and history you can recover.",
  },
  {
    id: "evidence",
    label: "Evidence",
    issue: "What a person actually tried and observed.",
  },
  {
    id: "release",
    label: "Release",
    issue: "The exact checked version that is live—and the version you can restore.",
  },
] as const;

export const welcomeOutcomes = [
  {
    title: "Shape a first version you can finish",
    detail: "Turn a feature wishlist into one person, one complete path, and a clear Not now boundary.",
  },
  {
    title: "Choose tools by responsibility",
    detail: "Know where AI builds, where the work survives, and which host serves the chosen version.",
  },
  {
    title: "Control AI work",
    detail: "Use a copyable work agreement that names context, boundaries, evidence, and a stopping point.",
  },
  {
    title: "Prove and release",
    detail: "Separate confident claims from evidence, repair an observed failure, publish an exact version, and keep recovery.",
  },
] as const;

export const finalChapters = [
  {
    id: "shape",
    number: 1,
    title: "Shape the promise",
    summary: "Decide what this first version can honestly finish.",
    stages: ["idea"],
  },
  {
    id: "ground",
    number: 2,
    title: "Ground the work",
    summary: "Give the tools clear jobs and the project a recoverable home.",
    stages: ["tools", "project-home"],
  },
  {
    id: "direct",
    number: 3,
    title: "Direct the build",
    summary: "Control AI changes and demand evidence before trust.",
    stages: ["ask-ai", "build"],
  },
  {
    id: "prove",
    number: 4,
    title: "Prove the release",
    summary: "Repair what fails, publish the checked layer, and update its source.",
    stages: ["check", "go-live", "improve"],
  },
] as const;

export const ideaChoices = [
  {
    id: "facts-email",
    label: "Read the event details, decide if the item fits, and email a question",
    consequence:
      "Complete and supportable. It uses only approved facts and a normal email link, so the whole visitor path can work today.",
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
    label: "One browser workspace—fastest preview; verify versions and export",
    consequence:
      "This is the fastest route to a first preview, but more of the project depends on one service. Check version history, export, ownership, limits, and cost.",
    canvasChange: "Connects a hosted workspace to saved versions and a host.",
    recommended: true,
  },
  {
    id: "repository",
    label: "Visible files + saved history—more setup; clearer ownership and recovery",
    consequence:
      "This route makes files and recoverable history clearer, but adds local setup and a separate publishing step.",
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
    label: "No—AI helps build it; visitors only need facts and email",
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
    label: "Try the complete visitor path yourself",
    consequence:
      "Correct next action. The preview proves appearance; human-path evidence is still pending.",
    canvasChange: "Marks the preview as a candidate awaiting a visitor-path check.",
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

export const affectedCheckChoices = [
  {
    id: "affected-plus-smoke",
    label: "Compare the source, read the changed access fact, then quickly repeat the core path",
    consequence:
      "The checks follow the dependency: source first, affected reading second, one core-path check for accidental breakage.",
    canvasChange: "Adds three targeted checks to the V5 update record.",
    recommended: true,
  },
  {
    id: "surface-only",
    label: "Check only that the visible sentence changed",
    consequence:
      "The sentence may look right while contradicting its source—or while the main visitor path has broken.",
    canvasChange: "Leaves source agreement and core behavior unproven.",
    recommended: false,
  },
  {
    id: "retest-redesign",
    label: "Retest every screen and redesign anything that feels dated",
    consequence:
      "The fact update expands into unrelated work, making the new risk harder to understand.",
    canvasChange: "Spreads a one-fact change across unrelated layers.",
    recommended: false,
  },
] as const satisfies readonly FinalChoice<AffectedCheckChoice>[];

/**
 * The keys are the fourteen required interactions in route order.
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
  affectedChecks: affectedCheckChoices,
} as const;

export const FINAL_REQUIRED_INTERACTIONS = 14;

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
  stakes: string;
  artifact: string;
  fieldUse: string;
  failurePrevented: string;
  artifactId: FinalArtifactId;
  optionalDepth: string;
};

export const finalJourney = [
  {
    id: "idea",
    number: 1,
    navLabel: "First version",
    heading: "Choose one promise you can keep",
    introduction:
      "For Willow Fix Day, approved event details and organizer email are ready. No one can run bookings or payments.",
    savedLabel: "one visitor → one complete, supportable path",
    question: "What should a visitor be able to do from start to finish?",
    requiredInteractions: 1,
    canvasLayer: "First-version brief",
    reusableRule:
      "A small complete path teaches more than a large unfinished feature list.",
    stakes:
      "A visible feature is also a promise about data, people, operations, and failure states. Beginners often commit to those invisible obligations by accident.",
    artifact:
      "A V1 brief naming one person, one complete path, approved facts, a Not now boundary, and an observable finish line.",
    fieldUse:
      "Use it before asking AI to build anything that contains several audiences, features, or uncertain facts.",
    failurePrevented:
      "An impressive feature list that never becomes complete or supportable.",
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
    question: "Which starting route fits how you want to work?",
    requiredInteractions: 1,
    canvasLayer: "Tool route · who builds, remembers, and publishes",
    reusableRule: "Choose tools by their jobs, not their product names.",
    stakes:
      "Tool names change quickly. The responsibilities—who builds, where the work survives, and what publishes it—do not.",
    artifact:
      "A route receipt showing where AI builds, where versions survive, how files can leave, and which host publishes.",
    fieldUse:
      "Use it whenever a tool promises to build and publish in one click.",
    failurePrevented:
      "A project trapped in one service with unclear ownership, export, cost, or recovery.",
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
    stakes:
      "A conversation can disappear, and a generated preview can outlive the only copy you control.",
    artifact:
      "A route-specific project-home checklist covering files, run notes, saved history, remote copy, restore, and private settings.",
    fieldUse:
      "Use it before substantial work or before placing an API key anywhere.",
    failurePrevented:
      "Losing the project with the chat—or adding cost, privacy, and failure work that visitors never needed.",
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
    stakes:
      "A vague request transfers hidden product decisions to AI and lets unrelated changes accumulate before review.",
    artifact:
      "A copyable work agreement with source, finish, boundaries, preserve list, evidence, and a stopping point.",
    fieldUse:
      "Use it whenever AI is about to change more than one file or make a product decision for you.",
    failurePrevented:
      "A large confident change whose scope, assumptions, and evidence you cannot inspect.",
    artifactId: "planning-request",
    optionalDepth: "Open the full copyable planning request.",
  },
  {
    id: "build",
    number: 5,
    navLabel: "Build",
    heading: "Trust evidence, not “Done”",
    introduction:
      "AI changed the files, passed a typecheck, and opened a preview. The visitor path is still untried.",
    savedLabel: "V1 preview candidate · human-path evidence pending",
    question: "The preview is open. What must happen before this candidate can be trusted?",
    requiredInteractions: 1,
    canvasLayer: "V1 candidate · preview awaiting a human check",
    reusableRule:
      "A preview is a candidate, not proof that the visitor path works.",
    stakes:
      "AI confidence, changed files, automated checks, previews, and human behavior are different kinds of evidence.",
    artifact:
      "A candidate change record and evidence ladder separating what AI claimed, what changed, what appeared, and what a person actually finished.",
    fieldUse:
      "Use it every time AI says “Done,” especially before saving or publishing.",
    failurePrevented:
      "Treating a typecheck, screenshot, or tool claim as proof that a person can finish the important path.",
    artifactId: "change-record",
    optionalDepth: "Compare this candidate with the later V2 and V3 saved layers.",
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
    stakes:
      "A polished interface can hide a dead end that screenshots and build logs never reveal.",
    artifact:
      "A defect note with Observed, Steps, Expected, Preserve, Repair only, and Repeat after repair.",
    fieldUse:
      "Use it when behavior fails, a fact looks wrong, or AI proposes a broad redesign as the repair.",
    failurePrevented:
      "Guessing at causes, changing working behavior, and declaring success without repeating the failed path.",
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
    stakes:
      "A host can finish successfully while serving the wrong version or a broken public path.",
    artifact:
      "A release card naming the exact version, public result, known limit, and one recovery action.",
    fieldUse:
      "Use it for every public release, even when the hosting dashboard is green.",
    failurePrevented:
      "Publishing a mood—“the latest one looks right”—instead of a checked, recoverable version.",
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
    requiredInteractions: 2,
    canvasLayer: "Trusted access fact and saved V5",
    reusableRule:
      "Change the trusted source first, then rerun only affected checks.",
    stakes:
      "Editing the visible surface without its source creates quiet contradictions and makes later updates unsafe.",
    artifact:
      "A source-backed update card naming the source change, bounded request, affected checks, and saved version.",
    fieldUse:
      "Use it when a fact, requirement, or policy changes after release.",
    failurePrevented:
      "Source drift, unnecessary redesign, and retesting everything without knowing what the change affected.",
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
  title: "Candidate change record · V1",
  request: planningArtifact.approvedFirstStep,
  changedFiles: ["docs/brief.md", "app/page.tsx"],
  commandResult:
    "npm run typecheck → exited successfully (code/type consistency only)",
  visibleResult: "Approved event facts appear in the visitor’s reading order.",
  visitorCheck:
    "Pending · open → read the event facts → reach and try the contact action.",
  savedVersion: "Not saved · awaiting human-path evidence",
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
    "Run the affected checks, then quickly repeat one core visitor path at 390px and by keyboard.",
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
