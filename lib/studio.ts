/**
 * Pentimento v3 curriculum
 *
 * This file contains authored teaching content only. UI state and presentation
 * belong elsewhere. The content follows one small project from a rough idea to
 * a live link, and every stop leaves the learner with a practical artifact.
 */

export const studioRoute = [
  "idea",
  "tools",
  "project-home",
  "ask-ai",
  "build",
  "check",
  "go-live",
  "improve",
  "playbook",
] as const;

export type StudioStopId = (typeof studioRoute)[number];

export type PracticalArtifact = {
  name: string;
  description: string;
  format: string;
  usefulAfterLesson: string;
};

export type StudioStop = {
  id: StudioStopId;
  number: number;
  navLabel: string;
  eyebrow: string;
  title: string;
  outcome: string;
  explanation: string;
  actionLabel: string;
  interaction:
    | "sort"
    | "choose"
    | "assemble"
    | "compare"
    | "inspect"
    | "repair"
    | "release"
    | "revise"
    | "collect";
  artifact: PracticalArtifact;
  takeaway: string;
  deeperQuestion: string;
};

export const studioIdentity = {
  name: "Pentimento",
  descriptor: "A guided first AI build",
  headline: "Build your first project with AI—from idea to live link.",
  promise:
    "Follow one small website from a rough note to a tested release. Learn which tools do what, what to ask AI, how GitHub protects your work, and how a project reaches the web.",
  audience: "Someone who has never built a software project before",
  duration: "About 25 minutes",
  reassurance: [
    "No coding experience needed",
    "Nothing real is published",
    "No API key needed",
  ],
  firstAction: "Show me the route",
  meaning:
    "A pentimento is an earlier version visible beneath a finished work. Here, you uncover every decision beneath a finished project.",
} as const;

export const studioStops: readonly StudioStop[] = [
  {
    id: "idea",
    number: 1,
    navLabel: "Idea",
    eyebrow: "Start with a useful finish",
    title: "Turn a wish into a first version",
    outcome:
      "Choose one person, one useful result, and one complete path through the project.",
    explanation:
      "AI can make a vague idea look finished before the important decisions are made. First, make the project small enough to finish and specific enough to check.",
    actionLabel: "Shape the first version",
    interaction: "sort",
    artifact: {
      name: "First-version brief",
      description:
        "A one-page description of the person, goal, trusted facts, boundaries, and finish line.",
      format: "Completed example plus a reusable blank template",
      usefulAfterLesson: "Paste it into any AI building tool before work begins.",
    },
    takeaway:
      "A small complete path teaches more than a large collection of unfinished features.",
    deeperQuestion: "Why should accounts, booking, and chat wait?",
  },
  {
    id: "tools",
    number: 2,
    navLabel: "Tools",
    eyebrow: "Learn roles, not logos",
    title: "Choose a sensible place to start",
    outcome:
      "Understand what the AI workspace, repository, and host each do, then choose a starting lane.",
    explanation:
      "AI products use different names for similar jobs. Choose by the kind of help and ownership you need, not by the longest feature list.",
    actionLabel: "Choose my starting lane",
    interaction: "choose",
    artifact: {
      name: "Tool route card",
      description:
        "A recommended beginner route with its setup, strengths, limits, and next action.",
      format: "Two-route comparison and decision",
      usefulAfterLesson: "Use it when evaluating a new AI coding product.",
    },
    takeaway:
      "The durable map is: an AI workspace builds, a repository remembers, and a host publishes.",
    deeperQuestion: "Does a project built with AI need AI inside it?",
  },
  {
    id: "project-home",
    number: 3,
    navLabel: "Project home",
    eyebrow: "Give the work a safe home",
    title: "Create files you can understand and recover",
    outcome:
      "Recognize the project folder, Git history, GitHub repository, README, and private environment file.",
    explanation:
      "Before asking AI for a polished page, establish where the work lives, what each important file does, and which information must never be published.",
    actionLabel: "Set up the project home",
    interaction: "assemble",
    artifact: {
      name: "Repository starter checklist",
      description:
        "A safe file map, first saved version, GitHub backup, and secret check.",
      format: "Folder diagram and ordered checklist",
      usefulAfterLesson: "Repeat it before the first build request on a new project.",
    },
    takeaway:
      "A folder holds the files, Git remembers versions, and GitHub stores a remote copy of that history.",
    deeperQuestion: "What should never be committed to GitHub?",
  },
  {
    id: "ask-ai",
    number: 4,
    navLabel: "Ask AI",
    eyebrow: "Give AI a workable request",
    title: "Ask for a plan before asking for everything",
    outcome:
      "Build a request with a goal, context, trusted facts, boundaries, finish line, and approval point.",
    explanation:
      "A useful request reduces guessing. It tells AI what success means, what it may use, what must wait, and when it should stop for your review.",
    actionLabel: "Build the first request",
    interaction: "compare",
    artifact: {
      name: "Planning prompt",
      description:
        "A complete, copyable first request grounded in the first-version brief.",
      format: "Prompt parts, weak comparison, and finished example",
      usefulAfterLesson: "Adapt it when starting any AI-built project.",
    },
    takeaway:
      "Specific context and boundaries matter more than complicated prompt tricks.",
    deeperQuestion: "Why ask for a plan before allowing file changes?",
  },
  {
    id: "build",
    number: 5,
    navLabel: "Build",
    eyebrow: "Work in visible steps",
    title: "Build through three small cycles",
    outcome:
      "Repeat ask, inspect, run, check, and save until the first complete path works.",
    explanation:
      "Small cycles make changes easier to understand and mistakes easier to undo. Each cycle should produce one visible improvement and one saved version.",
    actionLabel: "Run the build cycles",
    interaction: "inspect",
    artifact: {
      name: "Three saved build versions",
      description:
        "A readable structure, a working contact path, and a responsive polished version.",
      format: "Prompt, changed files, preview, check, and save record for each cycle",
      usefulAfterLesson: "Use the same loop for every later feature or repair.",
    },
    takeaway:
      "Ask → inspect → run → check → save is the core habit, regardless of the AI tool.",
    deeperQuestion: "What exactly should you inspect if you cannot read code yet?",
  },
  {
    id: "check",
    number: 6,
    navLabel: "Check",
    eyebrow: "Try the result yourself",
    title: "Find and repair what the preview hides",
    outcome:
      "Check trusted facts and the visitor’s full path, then report a defect precisely and verify the repair.",
    explanation:
      "A polished screen is not proof that the project works. Try the important path on the device that matters and compare every factual claim with its source.",
    actionLabel: "Find and repair the defects",
    interaction: "repair",
    artifact: {
      name: "Repair report",
      description:
        "A reproducible defect report, bounded repair prompt, and results from the repeated checks.",
      format: "Observed, steps, expected, preserve, repair, and recheck",
      usefulAfterLesson: "Use it whenever an AI-built result behaves unexpectedly.",
    },
    takeaway:
      "Describe what you observed and how to reproduce it; do not ask AI to guess what 'broken' means.",
    deeperQuestion: "Which checks should run again after a small repair?",
  },
  {
    id: "go-live",
    number: 7,
    navLabel: "Go live",
    eyebrow: "Publish one known version",
    title: "Move safely from your computer to a live link",
    outcome:
      "Distinguish local, GitHub, preview, and live states; publish one checked version and record how to recover.",
    explanation:
      "Publishing is a controlled move, not a magic button. Know which version is being released, test the public link, and keep the previous working version available.",
    actionLabel: "Move the version through release",
    interaction: "release",
    artifact: {
      name: "Release card",
      description:
        "The released version, public URL check, known limits, and recovery instruction.",
      format: "Release stages plus before-and-after checklist",
      usefulAfterLesson: "Complete it every time a project goes live.",
    },
    takeaway:
      "A deployment is complete only after the public version has been tried.",
    deeperQuestion: "What should you do if the live page is worse than the preview?",
  },
  {
    id: "improve",
    number: 8,
    navLabel: "Improve",
    eyebrow: "Change without starting over",
    title: "Handle the first real update",
    outcome:
      "Turn a post-launch request into one bounded change, update its source, and repeat the relevant checks.",
    explanation:
      "Real projects change after launch. A good update preserves what already works, changes the trusted source first, and creates another recoverable version.",
    actionLabel: "Plan the first update",
    interaction: "revise",
    artifact: {
      name: "Post-launch change plan",
      description:
        "One new fact, affected files, a focused request, relevant checks, and a new version label.",
      format: "Completed example and reusable update template",
      usefulAfterLesson: "Use it to keep later requests from quietly expanding.",
    },
    takeaway:
      "Do not rebuild a working project to make one clear change.",
    deeperQuestion: "When does a change deserve a new feature plan?",
  },
  {
    id: "playbook",
    number: 9,
    navLabel: "Playbook",
    eyebrow: "Take the method with you",
    title: "Begin your own project",
    outcome:
      "Collect the route, templates, safety checks, and a seven-day starting plan in one place.",
    explanation:
      "The example matters only if you can transfer it. Replace the Willow Fix Day details with your own person, result, facts, and boundaries.",
    actionLabel: "Create my playbook",
    interaction: "collect",
    artifact: {
      name: "First AI Build Playbook",
      description:
        "Reusable briefs, prompts, checks, glossary, and the first seven actions for a new project.",
      format: "Copyable cards with completed and blank examples",
      usefulAfterLesson: "Keep it beside any AI coding workspace.",
    },
    takeaway:
      "Tools will change; the project route and careful build loop will still transfer.",
    deeperQuestion: "What is the smallest useful project you can finish next?",
  },
] as const;

export type SystemRoleId = "ai-workspace" | "repository" | "host";

export type SystemRole = {
  id: SystemRoleId;
  plainName: string;
  job: string;
  keeps: string;
  doesNotGuarantee: string;
  beginnerQuestion: string;
};

export const systemRoles: readonly SystemRole[] = [
  {
    id: "ai-workspace",
    plainName: "AI workspace",
    job: "Reads your request, creates or changes project files, explains work, and may run checks.",
    keeps: "The current conversation and the files it can access.",
    doesNotGuarantee:
      "That every claim is correct, every path was tried, or the result is publicly available.",
    beginnerQuestion: "Can I see the files it changed and preview the result?",
  },
  {
    id: "repository",
    plainName: "Repository",
    job: "Stores the project files and a recoverable history. Git creates the history; GitHub can keep a remote copy.",
    keeps: "Named versions, changed files, documentation, and collaboration history.",
    doesNotGuarantee:
      "That the project runs, is safe to publish, or is automatically a website.",
    beginnerQuestion: "Can I see what changed and return to an earlier version?",
  },
  {
    id: "host",
    plainName: "Web host",
    job: "Turns one chosen version into a preview or public web address.",
    keeps: "Deployed versions, settings, public files, and sometimes server-side secrets.",
    doesNotGuarantee:
      "That the public version matches the preview or that a broken release repairs itself.",
    beginnerQuestion: "Which version is live, and how would I restore the previous one?",
  },
] as const;

export type ToolCategoryId =
  | "chat-assistant"
  | "hosted-builder"
  | "repository-agent"
  | "cloud-task-agent"
  | "runtime-ai";

export type ToolCategory = {
  id: ToolCategoryId;
  label: string;
  examples: readonly string[];
  bestFor: string;
  givesYou: string;
  startingRequirement: string;
  tradeoff: string;
  beginnerGuidance: string;
  projectNeedsRuntimeAI: boolean;
};

export const toolCategories: readonly ToolCategory[] = [
  {
    id: "chat-assistant",
    label: "Chat assistant",
    examples: ["ChatGPT chat", "Claude chat", "Gemini chat"],
    bestFor: "Exploring an idea, learning terms, drafting a brief, and asking questions.",
    givesYou: "Conversation, explanations, and text you can carry into a building tool.",
    startingRequirement: "A question or rough idea",
    tradeoff:
      "It may not own a complete project folder, run the result, or publish it.",
    beginnerGuidance:
      "Use it to clarify the project, but confirm where the actual files will live.",
    projectNeedsRuntimeAI: false,
  },
  {
    id: "hosted-builder",
    label: "Hosted AI app builder",
    examples: ["Replit Agent", "Lovable", "v0"],
    bestFor:
      "Making and previewing a small web project in one browser workspace with little setup.",
    givesYou:
      "An AI conversation, project files behind the interface, a preview, and often a publish button.",
    startingRequirement: "An account and a clear first-version brief",
    tradeoff:
      "Fast setup can hide how files, versions, hosting, export, and billing work.",
    beginnerGuidance:
      "Choose this route for the shortest path to a first prototype. Check that you can export or connect a repository.",
    projectNeedsRuntimeAI: false,
  },
  {
    id: "repository-agent",
    label: "Repository-aware coding agent",
    examples: ["Codex", "Cursor Agent", "Claude Code"],
    bestFor:
      "Building in real project files while learning the durable folder, Git, test, and review workflow.",
    givesYou:
      "Visible file changes, commands, checks, and work grounded in a repository.",
    startingRequirement:
      "A project folder, Git repository, development environment, and usually a separate host",
    tradeoff:
      "There is more setup and more unfamiliar vocabulary at the beginning.",
    beginnerGuidance:
      "Choose this route when ownership, transferable habits, and a judgeable repository matter most.",
    projectNeedsRuntimeAI: false,
  },
  {
    id: "cloud-task-agent",
    label: "Cloud task agent",
    examples: ["GitHub Copilot coding agent", "Codex cloud tasks"],
    bestFor:
      "Completing a clear, bounded task in a project that already has files, instructions, and checks.",
    givesYou:
      "A proposed set of changes that can be reviewed and merged into an existing repository.",
    startingRequirement: "An existing repository and a specific task",
    tradeoff:
      "The distance from the running workspace can make a blank-page project harder to understand.",
    beginnerGuidance:
      "Learn the project route first. Use this category later for well-described changes.",
    projectNeedsRuntimeAI: false,
  },
  {
    id: "runtime-ai",
    label: "AI API or SDK",
    examples: ["OpenAI API", "Anthropic API", "Gemini API"],
    bestFor:
      "Giving the finished product an AI behavior its visitors actually need.",
    givesYou:
      "Model responses inside your own application, usually billed by usage.",
    startingRequirement:
      "A server-side integration, protected API key, usage limits, and a plan for failures and unsafe input",
    tradeoff:
      "Adds cost, latency, privacy, safety, and reliability responsibilities.",
    beginnerGuidance:
      "Do not add it merely because AI helped build the project. The Willow Fix Day page does not need it.",
    projectNeedsRuntimeAI: true,
  },
] as const;

export type StartingLaneId = "hosted" | "repository";

export const startingLanes = [
  {
    id: "hosted",
    label: "Shortest setup",
    plainTitle: "Everything in one website",
    route: "Hosted builder → connected repository or export → built-in or separate host",
    chooseWhen:
      "You want to experience the full idea-to-preview route before learning local setup.",
    beCarefulAbout:
      "Export access, ownership, usage limits, hosting cost, and whether the project can move elsewhere.",
    firstAction:
      "Create an empty project, paste the planning prompt, and require a plan before changes.",
  },
  {
    id: "repository",
    label: "Most transferable",
    plainTitle: "Files and history you control",
    route: "Repository-aware agent → Git and GitHub → separate web host",
    chooseWhen:
      "You want visible files, durable version habits, and a repository others can inspect.",
    beCarefulAbout:
      "Local setup, command errors, secret files, and publishing a different version than the one you checked.",
    firstAction:
      "Create the folder and repository, add the brief and README, then ask AI to inspect and plan.",
  },
] as const satisfies readonly {
  id: StartingLaneId;
  label: string;
  plainTitle: string;
  route: string;
  chooseWhen: string;
  beCarefulAbout: string;
  firstAction: string;
}[];

export const toolChoiceQuestions = [
  {
    question: "Do I need the finished product itself to answer with AI?",
    guidance:
      "If no, you do not need an AI API, visitor usage charges, or an API key in the product.",
  },
  {
    question: "Do I want the least setup or the clearest view of real files?",
    guidance:
      "Choose a hosted builder for least setup; choose a repository agent for the most transferable workflow.",
  },
  {
    question: "Can I export the files or connect them to GitHub?",
    guidance:
      "A recoverable repository prevents one product from becoming the only home of your work.",
  },
  {
    question: "Who pays for building, hosting, storage, and AI usage?",
    guidance:
      "Read the current limits before connecting payment details or publishing a public app.",
  },
] as const;

export const repairCafeRoughIdea = {
  note:
    "Make a beautiful website for our Willow Fix Day. Add bookings, volunteer accounts, live repair availability, chat, donations, reminders, an AI repair helper, and anything else useful. Make it impressive.",
  whyItFeelsAttractive:
    "It describes an exciting destination and gives AI freedom to produce something visual quickly.",
  whyItIsNotBuildableYet: [
    "It never names the first visitor or their most important decision.",
    "It mixes an information page with identity, scheduling, payments, live data, messaging, and AI systems.",
    "It provides no trusted event facts.",
    "There is no finish line another person can check.",
    "The word 'impressive' cannot tell AI which tradeoffs are acceptable.",
  ],
} as const;

export type BriefFieldId =
  | "person"
  | "situation"
  | "useful-result"
  | "complete-path"
  | "trusted-facts"
  | "must-have"
  | "not-now"
  | "done-when";

export type BriefField = {
  id: BriefFieldId;
  label: string;
  prompt: string;
  repairCafeAnswer: string | readonly string[];
  blankStarter: string;
};

export const firstVersionBrief: readonly BriefField[] = [
  {
    id: "person",
    label: "One person",
    prompt: "Who should this first version help?",
    repairCafeAnswer: "A nearby resident with an item that might be repairable",
    blankStarter: "A [specific person] who...",
  },
  {
    id: "situation",
    label: "Their situation",
    prompt: "Where are they and what are they trying to decide?",
    repairCafeAnswer:
      "They are checking from a phone and want to know whether Saturday’s event fits their item and schedule.",
    blankStarter: "They are [situation] and need to...",
  },
  {
    id: "useful-result",
    label: "Useful result",
    prompt: "What should become possible after using the project?",
    repairCafeAnswer:
      "They can decide whether to attend and contact the organizer with one tap.",
    blankStarter: "After using it, they can...",
  },
  {
    id: "complete-path",
    label: "One complete path",
    prompt: "What is the beginning, middle, and end of that result?",
    repairCafeAnswer:
      "Open page → read when, where, and accepted items → understand the availability limit → email a question.",
    blankStarter: "Open... → understand... → do...",
  },
  {
    id: "trusted-facts",
    label: "Trusted facts",
    prompt: "Which statements may the project present as true?",
    repairCafeAnswer: [
      "Saturday, July 25 · 10:00–14:00",
      "West Hall Community Room",
      "Small appliances, clothing, and bicycles",
      "Repairs depend on volunteer availability",
      "Questions: hello@willow-fix.example",
    ],
    blankStarter: "Copy only facts approved by...",
  },
  {
    id: "must-have",
    label: "Must be in version one",
    prompt: "What is the minimum needed to complete the chosen path?",
    repairCafeAnswer: [
      "Clear event summary",
      "Accepted-item list",
      "Honest availability wording",
      "Working email action",
      "Readable phone layout",
    ],
    blankStarter: "Version one must include...",
  },
  {
    id: "not-now",
    label: "Not now",
    prompt: "Which tempting systems would add work beyond the chosen result?",
    repairCafeAnswer: [
      "Accounts",
      "Booking",
      "Payments or donations",
      "Live availability",
      "Chat and notifications",
      "AI repair advice",
    ],
    blankStarter: "Version one will not include...",
  },
  {
    id: "done-when",
    label: "Finish line",
    prompt: "What can another person try to decide whether version one works?",
    repairCafeAnswer:
      "All public facts match the approved list, the complete path works by keyboard, and the email action opens correctly at desktop and 390px widths.",
    blankStarter: "Version one is complete when someone can...",
  },
] as const;

export type ObligationId =
  | "identity"
  | "personal-data"
  | "live-data"
  | "money"
  | "ai-runtime"
  | "operations";

export const featureObligations = [
  {
    id: "identity",
    plainName: "Identity",
    createdBy: "Accounts, sign-in, member-only pages, and permissions",
    workAdded:
      "Account recovery, access rules, deletion, security updates, and support",
  },
  {
    id: "personal-data",
    plainName: "Personal data",
    createdBy: "Booking forms, profiles, contact forms, and saved conversations",
    workAdded:
      "Consent, safe storage, limited access, retention, deletion, and breach response",
  },
  {
    id: "live-data",
    plainName: "Changing data",
    createdBy: "Inventories, schedules, availability, dashboards, and databases",
    workAdded:
      "A source of truth, editing controls, stale-data handling, backups, and recovery",
  },
  {
    id: "money",
    plainName: "Money",
    createdBy: "Payments, donations, subscriptions, and refunds",
    workAdded:
      "Provider setup, transaction states, receipts, disputes, tax questions, and fraud handling",
  },
  {
    id: "ai-runtime",
    plainName: "AI inside the product",
    createdBy: "Chat, generation, classification, or advice shown to visitors",
    workAdded:
      "Protected keys, usage cost, limits, unsafe-input handling, unreliable outputs, and fallbacks",
  },
  {
    id: "operations",
    plainName: "Ongoing operations",
    createdBy: "Reminders, moderation, support queues, and promises about availability",
    workAdded:
      "A responsible person, monitoring, response times, failure handling, and maintenance",
  },
] as const satisfies readonly {
  id: ObligationId;
  plainName: string;
  createdBy: string;
  workAdded: string;
}[];

export type FeatureDecision = {
  feature: string;
  decision: "build-now" | "later" | "needs-answer";
  reason: string;
  obligations: readonly ObligationId[];
};

export const repairCafeFeatureDecisions: readonly FeatureDecision[] = [
  {
    feature: "Event facts and accepted-item list",
    decision: "build-now",
    reason: "They directly support the visitor’s decision and need no stored data.",
    obligations: [],
  },
  {
    feature: "Email link",
    decision: "build-now",
    reason:
      "It completes the chosen path without collecting or storing the message in this project.",
    obligations: [],
  },
  {
    feature: "Booking system",
    decision: "later",
    reason:
      "A booking promise needs capacity rules, changing data, cancellations, personal data, and someone to operate it.",
    obligations: ["personal-data", "live-data", "operations"],
  },
  {
    feature: "Volunteer accounts",
    decision: "later",
    reason:
      "Version one has no member-only action, so identity and recovery work would not improve its chosen path.",
    obligations: ["identity", "personal-data", "operations"],
  },
  {
    feature: "Donations",
    decision: "needs-answer",
    reason:
      "The organizer must choose a payment provider, legal recipient, refund policy, and owner before implementation.",
    obligations: ["money", "personal-data", "operations"],
  },
  {
    feature: "AI repair advice",
    decision: "later",
    reason:
      "The public page only needs approved information. Advice could be wrong or unsafe and creates ongoing usage cost.",
    obligations: ["ai-runtime", "operations"],
  },
] as const;

export type ProjectConceptId =
  | "project-folder"
  | "git"
  | "repository"
  | "github"
  | "commit"
  | "readme";

export const projectConcepts = [
  {
    id: "project-folder",
    name: "Project folder",
    plainLanguage: "The files on the computer or workspace where the project runs.",
    questionItAnswers: "Where is the work right now?",
  },
  {
    id: "git",
    name: "Git",
    plainLanguage:
      "The version tool that records chosen snapshots and shows what changed.",
    questionItAnswers: "What changed, and can I return to an earlier state?",
  },
  {
    id: "repository",
    name: "Repository",
    plainLanguage:
      "The project folder plus its Git history, instructions, and shared context.",
    questionItAnswers: "What belongs to this project?",
  },
  {
    id: "github",
    name: "GitHub",
    plainLanguage:
      "A service that can store the repository away from your computer and let others review it.",
    questionItAnswers: "Where is the recoverable remote copy?",
  },
  {
    id: "commit",
    name: "Commit",
    plainLanguage:
      "A named saved version containing selected file changes and a short explanation.",
    questionItAnswers: "Which exact state do I mean?",
  },
  {
    id: "readme",
    name: "README",
    plainLanguage:
      "The front-page instructions that explain what the project is and how to run it.",
    questionItAnswers: "Could another person understand and try this project?",
  },
] as const satisfies readonly {
  id: ProjectConceptId;
  name: string;
  plainLanguage: string;
  questionItAnswers: string;
}[];

export type ProjectFile = {
  path: string;
  job: string;
  learnerShouldCheck: string;
  safeToCommit: boolean;
  example?: string;
};

export const repairCafeProjectFiles: readonly ProjectFile[] = [
  {
    path: "README.md",
    job: "Explains the project, its first version, how to run it, and known limits.",
    learnerShouldCheck:
      "A new person can tell what the project does and reach the local preview.",
    safeToCommit: true,
  },
  {
    path: "docs/brief.md",
    job: "Stores the approved first-version brief and trusted event facts.",
    learnerShouldCheck:
      "The page uses only these facts and the not-now list remains explicit.",
    safeToCommit: true,
  },
  {
    path: "app/page.tsx",
    job: "Assembles the visible Willow Fix Day page.",
    learnerShouldCheck:
      "The visible sections follow the visitor’s complete path.",
    safeToCommit: true,
  },
  {
    path: "app/styles.css",
    job: "Controls layout, spacing, type, colors, focus visibility, and phone behavior.",
    learnerShouldCheck:
      "Text and actions remain readable at 390px and with keyboard focus.",
    safeToCommit: true,
  },
  {
    path: "public/",
    job: "Holds images and other files that may be served publicly.",
    learnerShouldCheck:
      "Every asset is owned or licensed, useful, compressed, and free of private information.",
    safeToCommit: true,
  },
  {
    path: "package.json",
    job: "Lists project dependencies and named commands such as dev, test, and build.",
    learnerShouldCheck:
      "AI did not add an unnecessary package and the documented commands exist.",
    safeToCommit: true,
  },
  {
    path: ".gitignore",
    job: "Names generated or private files Git must not save.",
    learnerShouldCheck:
      ".env.local, dependency folders, and generated build output are excluded.",
    safeToCommit: true,
    example: ".env.local\nnode_modules/\n.next/",
  },
  {
    path: ".env.local",
    job: "Stores private settings or API keys for local development.",
    learnerShouldCheck:
      "It contains no real value for this project and appears in .gitignore if later used.",
    safeToCommit: false,
    example: "SERVICE_API_KEY=replace_with_your_own_value",
  },
] as const;

export const projectHomeSteps = [
  {
    order: 1,
    action: "Create one project folder with a clear name.",
    check: "The AI workspace is opened inside that folder, not a broad personal directory.",
  },
  {
    order: 2,
    action: "Add README.md and docs/brief.md before asking for a full interface.",
    check: "The purpose, first-version boundary, trusted facts, and run command have a home.",
  },
  {
    order: 3,
    action: "Start Git and inspect which files are about to be saved.",
    check: "Generated files and private settings are excluded by .gitignore.",
  },
  {
    order: 4,
    action: "Save the brief as the first named version.",
    check: "The saved message explains the project decision, not just 'updates'.",
  },
  {
    order: 5,
    action: "Create a private or public GitHub repository and push the saved version.",
    check: "The remote repository shows README.md and docs/brief.md, but no secret file.",
  },
] as const;

export const safeVersionCommands = [
  {
    purpose: "See the current files and changes",
    command: "git status",
    explain:
      "Read the full list before selecting anything. A new private file should not appear.",
  },
  {
    purpose: "Read the actual changes",
    command: "git diff",
    explain:
      "Look for unexpected text, removed content, invented facts, and secret values.",
  },
  {
    purpose: "Select only the files you reviewed",
    command: "git add README.md docs/brief.md",
    explain:
      "Naming files is safer for a beginner than selecting every changed file at once.",
  },
  {
    purpose: "Save a named version",
    command: 'git commit -m "docs: define Willow Fix Day first version"',
    explain:
      "The message says what changed and why this version is useful.",
  },
  {
    purpose: "Send saved versions to GitHub",
    command: "git push",
    explain:
      "This sends commits; it does not prove that a website is deployed.",
  },
] as const;

export const secretSafety = {
  rule:
    "A secret belongs in a protected environment setting, never in a prompt, screenshot, public file, commit, or browser-delivered code.",
  thisProject:
    "The Willow Fix Day page needs no API, database, sign-in, or secret. Do not invent one.",
  safeExample: {
    place: ".env.local or the host’s protected secret settings",
    value: "SERVICE_API_KEY=replace_with_your_own_value",
    note:
      "Use a placeholder in teaching material. A real key should never appear in this repository.",
  },
  unsafeExamples: [
    "Pasting a real key into an AI conversation",
    "Writing a key directly in app/page.tsx",
    "Adding .env.local to Git",
    "Showing a dashboard key in a demo video or screenshot",
    "Putting a server key in a variable exposed to browser code",
  ],
  beforeSaving: [
    "Run git status and read every file name.",
    "Open the selected changes and search for passwords, tokens, and private data.",
    "Confirm private environment files are ignored.",
    "Select only the reviewed files.",
  ],
  ifExposed: [
    "Revoke or rotate the exposed credential at its provider immediately.",
    "Remove it from the project and Git history; deleting only the visible line is not enough.",
    "Replace it with a new credential stored in the correct protected setting.",
    "Check provider logs and billing for unexpected use.",
  ],
} as const;

export type PromptPartId =
  | "role"
  | "goal"
  | "person"
  | "facts"
  | "complete-path"
  | "boundaries"
  | "quality"
  | "work-mode"
  | "finish-line"
  | "approval";

export type PromptPart = {
  id: PromptPartId;
  label: string;
  purpose: string;
  repairCafeText: string;
  weakAlternative: string;
};

export const buildablePromptParts: readonly PromptPart[] = [
  {
    id: "role",
    label: "Your situation",
    purpose: "Calibrates explanations and avoids assuming coding experience.",
    repairCafeText:
      "I am building my first project and need plain-language explanations of unfamiliar files or commands.",
    weakAlternative: "You are a genius senior developer.",
  },
  {
    id: "goal",
    label: "Useful goal",
    purpose: "Names the result, not a style adjective.",
    repairCafeText:
      "Plan a small public information page for a neighborhood Willow Fix Day.",
    weakAlternative: "Make an amazing modern app.",
  },
  {
    id: "person",
    label: "Person and situation",
    purpose: "Guides hierarchy, wording, device checks, and the main action.",
    repairCafeText:
      "The first visitor is a nearby resident checking from a phone.",
    weakAlternative: "It is for everyone.",
  },
  {
    id: "facts",
    label: "Trusted facts",
    purpose: "Prevents AI from filling missing event details with plausible inventions.",
    repairCafeText:
      "Use only the event facts in docs/brief.md. If a fact is missing, ask me.",
    weakAlternative: "Add whatever details make it realistic.",
  },
  {
    id: "complete-path",
    label: "Complete path",
    purpose: "Keeps the work centered on one end-to-end outcome.",
    repairCafeText:
      "The visitor must understand the event and open an email to the approved address.",
    weakAlternative: "Add all the usual sections.",
  },
  {
    id: "boundaries",
    label: "Not now",
    purpose: "Prevents hidden expansion into costly or sensitive systems.",
    repairCafeText:
      "Do not add accounts, booking, payments, live data, chat, analytics, or runtime AI.",
    weakAlternative: "Add anything useful.",
  },
  {
    id: "quality",
    label: "Quality constraints",
    purpose: "Turns 'good' into concrete design and access expectations.",
    repairCafeText:
      "Keep the page fast, readable, keyboard usable, and comfortable at 390px.",
    weakAlternative: "Make it polished.",
  },
  {
    id: "work-mode",
    label: "Work mode",
    purpose: "Controls whether AI plans, edits, runs, or explains.",
    repairCafeText:
      "First inspect the repository and propose a three-cycle plan. Do not edit files yet.",
    weakAlternative: "Start now.",
  },
  {
    id: "finish-line",
    label: "Finish line",
    purpose: "Makes completion observable by someone other than the AI.",
    repairCafeText:
      "Name the files likely to change and the checks that will show the path works.",
    weakAlternative: "Tell me when it is done.",
  },
  {
    id: "approval",
    label: "Approval point",
    purpose: "Gives the learner a moment to understand and narrow the plan.",
    repairCafeText:
      "Stop after the plan and wait for my approval before changing files.",
    weakAlternative: "Do everything autonomously.",
  },
] as const;

export const weakFirstPrompt =
  "Build me a beautiful, innovative Willow Fix Day app. Make every useful feature and deploy it.";

export const completePlanningPrompt = `I am building my first project and need plain-language explanations of unfamiliar files or commands.

Plan a small public information page for a neighborhood Willow Fix Day.

The first visitor is a nearby resident checking from a phone. They need to understand when and where the event happens, decide whether their item fits, understand that a repair is not guaranteed, and open an email to the organizer.

Use only the approved event facts in docs/brief.md. If a fact is missing or two instructions conflict, ask me instead of inventing an answer.

Version one must include:
- a clear event summary;
- accepted item types;
- the honest volunteer-availability limit;
- a working email action; and
- a readable, keyboard-usable layout at desktop and 390px.

Do not add accounts, booking, payments, donations, a database, live availability, chat, notifications, analytics, tracking, or AI inside the finished page.

First inspect the repository and propose three small build cycles. For each cycle, explain:
1. the visible result;
2. the files likely to change;
3. what I should inspect in the preview;
4. the check you will run; and
5. the saved-version message.

Do not edit files yet. Stop after the plan and wait for my approval.`;

export const promptReviewQuestions = [
  "Could AI identify one person and one useful result?",
  "Are the trusted facts named or stored in a file?",
  "Does the request say what must not be added?",
  "Can another person observe the finish line?",
  "Does AI know whether to plan, edit, run, or explain?",
  "Is there a clear point where AI must stop for review?",
] as const;

export type BuildCycle = {
  id: "structure" | "main-path" | "responsive-finish";
  number: number;
  title: string;
  visibleResult: string;
  request: string;
  expectedFiles: readonly string[];
  inspectWithoutReadingCode: readonly string[];
  run: readonly string[];
  check: readonly string[];
  save: {
    select: string;
    message: string;
    reason: string;
  };
  artifact: string;
};

export const repairCafeBuildCycles: readonly BuildCycle[] = [
  {
    id: "structure",
    number: 1,
    title: "Make the information readable",
    visibleResult:
      "A plain but complete page with event details in the order a phone visitor needs them.",
    request: `Implement only cycle 1 from the approved plan.

Create the page structure using the trusted facts in docs/brief.md. Show the event name, date and time, place, accepted items, availability limit, and contact area. Prefer clear HTML structure and readable text over decoration.

Do not add new packages, images, forms, accounts, data storage, or tracking. Explain each changed file in plain language, run the agreed code check, then stop so I can inspect the preview.`,
    expectedFiles: ["app/page.tsx", "app/styles.css"],
    inspectWithoutReadingCode: [
      "Read every visible sentence and compare names, times, place, item types, and limitations with docs/brief.md.",
      "Cover the page title with your hand: can you still tell what the event is from the first screen?",
      "Check that the most important visitor information appears before decorative or background text.",
      "Confirm no booking, guarantee, donation, or AI feature appeared.",
    ],
    run: ["npm run typecheck", "npm run dev"],
    check: [
      "The page loads without an error screen.",
      "All five approved facts are visible and unchanged.",
      "The information has a clear reading order.",
    ],
    save: {
      select: "git add app/page.tsx app/styles.css",
      message: 'git commit -m "feat: add Willow Fix Day information structure"',
      reason: "Creates a recoverable version before interaction or visual refinement.",
    },
    artifact: "Version 1 · readable event information",
  },
  {
    id: "main-path",
    number: 2,
    title: "Complete the visitor’s action",
    visibleResult:
      "The visitor can understand accepted items and open an email to the approved address.",
    request: `Implement only cycle 2.

Keep the approved text and existing reading order. Make the accepted-item list easy to scan, and turn the contact action into a real email link to hello@willow-fix.example. The visible label must explain the action without relying on an icon.

Do not add a contact form, stored personal data, booking, JavaScript behavior, or another dependency. Run the relevant checks and stop for preview review.`,
    expectedFiles: ["app/page.tsx", "app/styles.css"],
    inspectWithoutReadingCode: [
      "Select the email action and confirm the device prepares an email to hello@willow-fix.example.",
      "Read the link without nearby text: its purpose should still be clear.",
      "Use the Tab key from the top of the page; a visible focus marker should reach the email action.",
      "Confirm the availability limit remains next to the decision-making information.",
    ],
    run: ["npm run typecheck", "npm test"],
    check: [
      "The email destination is exactly hello@willow-fix.example.",
      "The action works with keyboard input.",
      "No form or visitor-data storage was added.",
    ],
    save: {
      select: "git add app/page.tsx app/styles.css",
      message: 'git commit -m "feat: complete visitor contact path"',
      reason: "Names the useful behavior added in this cycle.",
    },
    artifact: "Version 2 · complete visitor path",
  },
  {
    id: "responsive-finish",
    number: 3,
    title: "Make the complete path comfortable",
    visibleResult:
      "An elegant page whose text and action remain usable on a narrow phone and large screen.",
    request: `Implement only cycle 3.

Refine spacing, type, color, and layout without changing the approved facts or adding content. Make the page comfortable at 390px and desktop widths. Long text and the email action must wrap instead of clipping. Keep keyboard focus visible and respect reduced-motion preferences.

Use the existing project setup. Do not add a design library, animation dependency, tracking, or a new feature. Run typecheck, tests, and the production build, then summarize what I should inspect.`,
    expectedFiles: ["app/styles.css"],
    inspectWithoutReadingCode: [
      "Resize to 390px and scan from top to bottom without horizontal scrolling.",
      "Increase browser text size and confirm important content remains available.",
      "Tab to the email action and look for a visible focus marker.",
      "Compare all visible facts again; visual refinement must not rewrite them.",
    ],
    run: ["npm run typecheck", "npm test", "npm run build"],
    check: [
      "No content or action is clipped at 390px.",
      "The main path still works by keyboard.",
      "All automated checks and the production build complete successfully.",
    ],
    save: {
      select: "git add app/styles.css",
      message: 'git commit -m "style: finish responsive visitor experience"',
      reason: "Keeps visual refinement separate from the working-path version.",
    },
    artifact: "Version 3 · responsive first version",
  },
] as const;

export const buildLoop = [
  {
    verb: "Ask",
    learnerAction: "Request one bounded result and name what must stay unchanged.",
  },
  {
    verb: "Inspect",
    learnerAction: "Read the changed-file list, visible text, and AI explanation.",
  },
  {
    verb: "Run",
    learnerAction: "Open the project and run the agreed automated commands.",
  },
  {
    verb: "Check",
    learnerAction: "Try the important human path and compare facts with their source.",
  },
  {
    verb: "Save",
    learnerAction: "Select reviewed files and create a named Git version.",
  },
] as const;

export type DefectId =
  | "unsupported-promise"
  | "clipped-contact"
  | "inactive-email";

export type Defect = {
  id: DefectId;
  friendlyName: string;
  observed: string;
  reproduce: readonly string[];
  expected: string;
  consequence: string;
  preserve: readonly string[];
  smallestRepair: string;
};

export const repairCafeDefects: readonly Defect[] = [
  {
    id: "unsupported-promise",
    friendlyName: "The page promises too much",
    observed:
      "The page says, “Every walk-in gets a repair,” but docs/brief.md says repairs depend on volunteer availability.",
    reproduce: [
      "Open the page.",
      "Read the sentence under the accepted-item list.",
      "Compare it with the availability line in docs/brief.md.",
    ],
    expected:
      "The public sentence should use the approved volunteer-availability wording without adding a guarantee.",
    consequence:
      "A visitor may travel to the event expecting a result the organizer cannot promise.",
    preserve: [
      "Date, time, place, item types, and email address",
      "Existing page order and visual design",
      "No booking or live-availability feature",
    ],
    smallestRepair:
      "Replace only the unsupported sentence with the approved availability statement.",
  },
  {
    id: "clipped-contact",
    friendlyName: "The phone layout hides the action",
    observed:
      "At a 390px viewport, the right side of the long email action is outside the visible page.",
    reproduce: [
      "Open the responsive preview.",
      "Set the viewport to 390px wide.",
      "Scroll to the contact area.",
      "Observe the action and try to read its full label.",
    ],
    expected:
      "The action should fit or wrap within the viewport without horizontal scrolling.",
    consequence:
      "A phone visitor may miss the only way to contact the organizer.",
    preserve: [
      "The visible action wording",
      "The approved email destination",
      "Desktop spacing and visible keyboard focus",
    ],
    smallestRepair:
      "Adjust the contact action’s narrow-screen sizing and wrapping without redesigning the page.",
  },
  {
    id: "inactive-email",
    friendlyName: "The action looks real but goes nowhere",
    observed:
      "Selecting the contact action does not open an email draft or navigate to a mailto address.",
    reproduce: [
      "Open the page.",
      "Select the contact action with a pointer.",
      "Repeat with the keyboard.",
      "Inspect the destination shown by the browser.",
    ],
    expected:
      "Both methods should open a new email addressed to hello@willow-fix.example.",
    consequence:
      "The page explains the event but fails at the final step of its chosen path.",
    preserve: [
      "No contact form or data storage",
      "The visible page content",
      "The keyboard focus style",
    ],
    smallestRepair:
      "Use a standard mailto link with the approved address and existing visible label.",
  },
] as const;

export type CheckKind = "source" | "human-path" | "layout" | "access" | "code";

export type ProjectCheck = {
  id: string;
  kind: CheckKind;
  name: string;
  how: string;
  passWhen: string;
  rerunAfter: readonly DefectId[];
};

export const repairCafeChecks: readonly ProjectCheck[] = [
  {
    id: "approved-facts",
    kind: "source",
    name: "Approved facts",
    how: "Compare every public date, time, place, item type, availability statement, and address with docs/brief.md.",
    passWhen: "Every statement matches and the page adds no guarantee.",
    rerunAfter: ["unsupported-promise"],
  },
  {
    id: "complete-path",
    kind: "human-path",
    name: "Visitor’s complete path",
    how: "Begin at the top, decide whether a bicycle fits, find the limitation, and open the email action.",
    passWhen:
      "A first-time visitor can complete the path without guessing or reaching a dead end.",
    rerunAfter: ["unsupported-promise", "clipped-contact", "inactive-email"],
  },
  {
    id: "phone-390",
    kind: "layout",
    name: "390px phone",
    how: "Use a 390px viewport, read every section, and activate the contact action.",
    passWhen:
      "Nothing important clips, overlaps, disappears, or requires horizontal scrolling.",
    rerunAfter: ["clipped-contact"],
  },
  {
    id: "keyboard",
    kind: "access",
    name: "Keyboard path",
    how: "Reload the page and use Tab, Shift+Tab, Enter, and visible focus only.",
    passWhen:
      "The email action is reachable, identifiable, and usable without a pointer.",
    rerunAfter: ["clipped-contact", "inactive-email"],
  },
  {
    id: "typecheck",
    kind: "code",
    name: "Type check",
    how: "Run npm run typecheck and read the final exit result.",
    passWhen: "The command exits successfully with no type error.",
    rerunAfter: ["unsupported-promise", "clipped-contact", "inactive-email"],
  },
  {
    id: "tests",
    kind: "code",
    name: "Automated tests",
    how: "Run npm test and confirm the number of passing and failing tests.",
    passWhen: "All expected tests pass and none are skipped unexpectedly.",
    rerunAfter: ["unsupported-promise", "clipped-contact", "inactive-email"],
  },
  {
    id: "production-build",
    kind: "code",
    name: "Production build",
    how: "Run npm run build and read the final exit result.",
    passWhen: "The host-ready build completes successfully.",
    rerunAfter: ["unsupported-promise", "clipped-contact", "inactive-email"],
  },
] as const;

export const repairReportTemplate = {
  fields: [
    {
      label: "Observed",
      prompt: "What did you see, without guessing at the cause?",
      starter: "At [place or screen size], I observed...",
    },
    {
      label: "Reproduce",
      prompt: "Which exact steps make it happen again?",
      starter: "1. Open... 2. Set... 3. Select...",
    },
    {
      label: "Expected",
      prompt: "What should happen instead?",
      starter: "The visitor should be able to...",
    },
    {
      label: "Preserve",
      prompt: "What already works and must remain unchanged?",
      starter: "Keep the existing...",
    },
    {
      label: "Check again",
      prompt: "Which checks will show the repair worked?",
      starter: "After the change, repeat...",
    },
  ],
  principle:
    "Report observable behavior first. Let the agent inspect the files before naming a technical cause.",
} as const;

export const completeRepairPrompt = `Repair three defects in the current Willow Fix Day page. Keep the change limited to these defects.

Defect 1 — unsupported public promise
Observed: the page says “Every walk-in gets a repair.”
Source: docs/brief.md says “Repairs depend on volunteer availability.”
Expected: use the approved wording without adding a guarantee.

Defect 2 — contact action clipped on a phone
Reproduce:
1. Open the page.
2. Set the viewport to 390px wide.
3. Scroll to the contact area.
Observed: the right side of the email action is outside the visible page.
Expected: the full action fits or wraps without horizontal scrolling.

Defect 3 — contact action does nothing
Reproduce:
1. Open the page.
2. Select the email action with a pointer.
3. Repeat with the keyboard and inspect its destination.
Observed: no email draft opens and the action has no mailto destination.
Expected: both methods open a new email addressed to hello@willow-fix.example.

Preserve the date, time, place, accepted items, approved email address, current reading order, desktop layout, and visible keyboard focus. Do not add a booking system, form, dependency, or unrelated redesign.

First explain the likely files involved. Then make the smallest repair. Run typecheck and tests. Afterward, tell me exactly how to repeat the approved-facts, 390px, complete-path, and keyboard checks.`;

export type VersionRibbonItem = {
  id: string;
  label: string;
  state: "draft" | "saved" | "previewed" | "released" | "superseded";
  contains: string;
  humanCheck: string;
  recoveryUse: string;
};

export const versionRibbon: readonly VersionRibbonItem[] = [
  {
    id: "brief",
    label: "Brief",
    state: "saved",
    contains: "Person, useful result, trusted facts, first-version boundary, and finish line",
    humanCheck: "The organizer approves the facts and the not-now list.",
    recoveryUse: "Return here if later work is solving the wrong problem.",
  },
  {
    id: "v1",
    label: "V1 · Structure",
    state: "saved",
    contains: "Readable event information in the correct order",
    humanCheck: "Every public fact matches the brief.",
    recoveryUse: "Restore if later interaction work disrupts the basic content.",
  },
  {
    id: "v2",
    label: "V2 · Main path",
    state: "saved",
    contains: "Working accepted-item and email path",
    humanCheck: "The visitor can finish the chosen action by pointer and keyboard.",
    recoveryUse: "Restore if visual refinement makes the action unusable.",
  },
  {
    id: "v3",
    label: "V3 · Responsive",
    state: "superseded",
    contains: "Polished desktop and phone layout before the discovered defects were repaired",
    humanCheck: "The 390px review exposed clipping and the fact review exposed a promise.",
    recoveryUse:
      "Keep for comparison, but do not release because known defects remain.",
  },
  {
    id: "v4",
    label: "V4 · Repaired",
    state: "previewed",
    contains: "Approved wording, repaired phone action, and passing repeated checks",
    humanCheck: "Facts, complete path, 390px, keyboard, tests, and build pass.",
    recoveryUse: "This is the exact candidate chosen for release.",
  },
  {
    id: "live-1",
    label: "Live · V4",
    state: "released",
    contains: "The same V4 candidate at the public URL",
    humanCheck: "The public page repeats the important preview checks.",
    recoveryUse: "The previous working deployment remains available to restore.",
  },
] as const;

export type ReleaseStageId =
  | "local"
  | "github"
  | "preview"
  | "live"
  | "recovery";

export type ReleaseStage = {
  id: ReleaseStageId;
  label: string;
  plainMeaning: string;
  learnerAction: string;
  readyWhen: string;
  commonMistake: string;
  artifact: string;
};

export const releaseStages: readonly ReleaseStage[] = [
  {
    id: "local",
    label: "Local",
    plainMeaning:
      "The project is running in the private development workspace or on your computer.",
    learnerAction:
      "Complete the chosen path, review the changed files, and run the full agreed checks.",
    readyWhen:
      "The exact saved version is understandable, complete, and has no known release-blocking defect.",
    commonMistake:
      "Assuming a local preview means another person can open the project.",
    artifact: "Saved candidate: V4 · Repaired",
  },
  {
    id: "github",
    label: "GitHub",
    plainMeaning:
      "The reviewed commit and its history have a remote repository home.",
    learnerAction:
      "Push the selected commit and confirm no private file or secret appears.",
    readyWhen:
      "The repository shows the intended commit, README instructions, and no unreviewed change.",
    commonMistake:
      "Treating a GitHub repository URL as the public application URL.",
    artifact: "Remote commit selected for deployment",
  },
  {
    id: "preview",
    label: "Preview",
    plainMeaning:
      "A hosted but not yet public-to-everyone copy of one chosen version.",
    learnerAction:
      "Open the preview URL on a separate browser or device and repeat the important checks.",
    readyWhen:
      "Facts, the complete path, phone layout, keyboard path, and console show no release blocker.",
    commonMistake:
      "Testing the local tab while believing it is the hosted preview.",
    artifact: "Checked preview URL and version",
  },
  {
    id: "live",
    label: "Live",
    plainMeaning:
      "The public address now serves the chosen version.",
    learnerAction:
      "Publish V4, open the public URL fresh, and repeat the facts and complete visitor path.",
    readyWhen:
      "The host identifies V4 as live and the public path works outside the signed-in workspace.",
    commonMistake:
      "Stopping when the host says deployment succeeded without trying the public result.",
    artifact: "Public URL check with time and version",
  },
  {
    id: "recovery",
    label: "Recovery",
    plainMeaning:
      "The known action for returning to the previous working deployment.",
    learnerAction:
      "Record the previous version and locate the host’s restore or rollback control before launch.",
    readyWhen:
      "Another person could follow the note without relying on memory.",
    commonMistake:
      "Discovering the rollback process only after visitors report a problem.",
    artifact: "Previous version and restore instruction",
  },
] as const;

export const releaseChecklist = {
  before: [
    "The first-version brief still matches the page.",
    "The intended commit is saved and pushed.",
    "No secret or private data appears in the files or history.",
    "Facts, complete path, 390px layout, keyboard path, tests, and production build pass.",
    "The preview URL was opened outside the development tab.",
    "Known limits are written in the README.",
    "The previous working deployment and recovery action are known.",
  ],
  after: [
    "Open the public URL in a fresh browser session.",
    "Confirm the host reports the intended version as live.",
    "Read the event facts and complete the email path.",
    "Repeat the 390px and keyboard checks.",
    "Record the URL, version, check time, and remaining limits.",
    "If a release-blocking defect appears, restore the previous version before investigating.",
  ],
} as const;

export const exampleReleaseCard = {
  project: "Willow Fix Day page",
  releasedVersion: "V4 · Repaired",
  publicUrl: "https://willow-fix.example",
  publicCheck:
    "Facts, accepted items, availability limit, email path, 390px layout, and keyboard path checked after release.",
  checkedAt: "Record the real date and time when publishing",
  knownLimits: [
    "Information page only",
    "No booking or guaranteed repair",
    "Organizer answers questions through email",
  ],
  recovery:
    "Use the host’s deployment history to restore the previous working version, then confirm the public URL again.",
} as const;

export type PostLaunchChange = {
  request: string;
  decision: string;
  sourceChange: string;
  preserve: readonly string[];
  likelyFiles: readonly string[];
  focusedPrompt: string;
  checks: readonly string[];
  savedVersion: string;
  whyItStaysSmall: string;
};

export const repairCafePostLaunchChange: PostLaunchChange = {
  request:
    "Please add that step-free access is through the side entrance on Willow Lane.",
  decision:
    "Add it now because it is an organizer-approved access fact that helps visitors decide whether they can attend. It needs no new system.",
  sourceChange:
    "Add the approved wording to docs/brief.md before changing the public page.",
  preserve: [
    "Existing event facts",
    "Accepted-item and email path",
    "No booking or personal-data collection",
    "Phone and keyboard usability",
  ],
  likelyFiles: ["docs/brief.md", "app/page.tsx"],
  focusedPrompt: `Make one post-launch content update.

The organizer approved this new fact: “Step-free access is through the side entrance on Willow Lane.”

First add the exact wording to docs/brief.md. Then place it near the venue information where a visitor deciding whether to attend will find it. Preserve every existing event fact, the email path, page structure, phone layout, and keyboard behavior.

Do not add a map, location tracking, form, booking, new package, or visual redesign. Show me the changed files, run typecheck and tests, and tell me how to repeat the facts, complete-path, 390px, and keyboard checks.`,
  checks: [
    "New wording exactly matches the organizer-approved source.",
    "Venue and access details are easy to find together.",
    "Complete visitor path still works.",
    "390px and keyboard checks still pass.",
    "Typecheck, tests, and production build pass before release.",
  ],
  savedVersion: 'git commit -m "content: add step-free entrance details"',
  whyItStaysSmall:
    "It updates one approved fact and its visible presentation without creating a map, data source, or new visitor action.",
};

export type GlossaryEntry = {
  term: string;
  meaning: string;
  useItWhen: string;
};

export const studioGlossary: readonly GlossaryEntry[] = [
  {
    term: "AI coding tool",
    meaning:
      "A product that can create, change, explain, or test software from a conversation or task.",
    useItWhen: "Choosing where the building work will happen.",
  },
  {
    term: "API",
    meaning:
      "A defined way for one piece of software to request something from another.",
    useItWhen:
      "The finished product needs an outside service such as AI, maps, email delivery, or payments.",
  },
  {
    term: "API key",
    meaning:
      "A private credential that identifies and may charge an account when software uses a service.",
    useItWhen:
      "Connecting a server to a service; never place it in public browser code or GitHub.",
  },
  {
    term: "Build",
    meaning:
      "Either the act of creating the project or the command that prepares it for hosting.",
    useItWhen: "Checking whether a host-ready version can be produced.",
  },
  {
    term: "Commit",
    meaning: "A named Git snapshot of selected, reviewed file changes.",
    useItWhen: "Saving a recoverable point after one understandable result.",
  },
  {
    term: "Dependency",
    meaning:
      "Outside software your project relies on, usually installed and recorded in package.json.",
    useItWhen:
      "AI proposes a package; ask what job it performs and whether the project already has a solution.",
  },
  {
    term: "Deploy",
    meaning:
      "Send one project version to a host so it can run at a hosted address.",
    useItWhen: "Moving a checked candidate to preview or live.",
  },
  {
    term: "Environment variable",
    meaning:
      "A setting supplied outside the source files, often used for deployment configuration or secrets.",
    useItWhen: "A value differs between local, preview, and live environments.",
  },
  {
    term: "Git",
    meaning:
      "A local version system that records changes and can restore earlier project states.",
    useItWhen: "Reviewing, saving, comparing, or recovering work.",
  },
  {
    term: "GitHub",
    meaning:
      "A service that stores Git repositories remotely and supports review and collaboration.",
    useItWhen: "Backing up, sharing, reviewing, or connecting a repository to a host.",
  },
  {
    term: "Host",
    meaning:
      "The service that runs or serves a project at a network address.",
    useItWhen: "Creating preview and public versions.",
  },
  {
    term: "Local",
    meaning:
      "Running in your current private development environment, not yet at a public address.",
    useItWhen: "Building and checking before hosted release.",
  },
  {
    term: "Production",
    meaning:
      "The live environment intended for real visitors.",
    useItWhen: "Talking about the public version and its operational risk.",
  },
  {
    term: "Prompt",
    meaning:
      "The context, goal, boundaries, and requested action you give an AI system.",
    useItWhen: "Planning, building, checking, explaining, or repairing a bounded task.",
  },
  {
    term: "Preview",
    meaning:
      "A hosted version used to inspect changes before they reach the main public address.",
    useItWhen: "Checking real hosting behavior without replacing production.",
  },
  {
    term: "Repository",
    meaning:
      "A project folder whose files and history are tracked together.",
    useItWhen: "Giving the project one understandable and recoverable home.",
  },
  {
    term: "Responsive",
    meaning:
      "Able to remain readable and usable across different screen sizes and text settings.",
    useItWhen: "Checking phones, tablets, desktops, and enlarged text.",
  },
  {
    term: "Rollback",
    meaning:
      "Restore a previous working deployment when a newer release causes harm.",
    useItWhen: "Recovering service before investigating a bad live release.",
  },
  {
    term: "Runtime AI",
    meaning:
      "AI that the finished product calls while visitors are using it.",
    useItWhen:
      "The visitor’s result genuinely requires generation, classification, or conversation—not merely because AI built the product.",
  },
  {
    term: "Secret",
    meaning:
      "A private credential or value whose exposure could grant access, spend money, or reveal protected information.",
    useItWhen:
      "Configuring a service; store it in protected environment settings and rotate it if exposed.",
  },
  {
    term: "Test",
    meaning:
      "A repeatable check of expected behavior, performed by a person or command.",
    useItWhen: "Deciding whether a change works and whether it broke something else.",
  },
] as const;

export type PlaybookCardId =
  | "tool-choice"
  | "first-version"
  | "project-home"
  | "planning-prompt"
  | "small-change"
  | "inspect"
  | "repair"
  | "secret-safety"
  | "release"
  | "post-launch";

export type PlaybookCard = {
  id: PlaybookCardId;
  title: string;
  useWhen: string;
  exactActions: readonly string[];
  completedExample: string;
  reusableTemplate: string;
  expectedResult: string;
  prevents: string;
};

export const playbookCards: readonly PlaybookCard[] = [
  {
    id: "tool-choice",
    title: "Choose a starting lane",
    useWhen: "You have an idea but do not know which kind of AI tool to open.",
    exactActions: [
      "Decide whether the finished product itself needs AI.",
      "Choose least setup or most transferable files.",
      "Confirm repository export or GitHub connection.",
      "Check current building, hosting, storage, and usage limits.",
    ],
    completedExample:
      "Willow Fix Day: repository-aware agent + GitHub + static web host; no runtime AI.",
    reusableTemplate:
      "My product [does / does not] need AI at runtime. I value [least setup / visible ownership]. My files will live in ____. The project will be published by ____.",
    expectedResult:
      "One tool route, its tradeoff, and the exact first action—not a shopping list of products.",
    prevents:
      "Choosing a complex stack because a product demo showed more features.",
  },
  {
    id: "first-version",
    title: "Define the first complete version",
    useWhen: "The idea contains many audiences, features, or unclear goals.",
    exactActions: [
      "Name one person in one situation.",
      "Name one useful result.",
      "Write the shortest complete path.",
      "List trusted facts and must-have behavior.",
      "Move every extra system to Not now.",
      "Write checks another person can repeat.",
    ],
    completedExample:
      "A phone visitor reads approved Willow Fix Day details, decides whether their item fits, and opens an email.",
    reusableTemplate:
      "For [person] in [situation], help them [result] through [complete path]. Use only [sources]. Include [must-haves]. Do not include [not-now]. Complete when [checks].",
    expectedResult: "A brief small enough to finish and specific enough to check.",
    prevents:
      "A beautiful prototype with no clear user, unreliable facts, and several unfinished systems.",
  },
  {
    id: "project-home",
    title: "Create a recoverable project home",
    useWhen: "You are about to let an AI tool create the first files.",
    exactActions: [
      "Open one clearly named project folder.",
      "Add README.md and the approved brief.",
      "Start Git and add a .gitignore.",
      "Inspect the file list before the first commit.",
      "Push the saved version to a GitHub repository.",
    ],
    completedExample:
      "willow-fix/ with README.md, docs/brief.md, .gitignore, and an initial GitHub commit.",
    reusableTemplate:
      "Project folder: ____. Brief path: ____. Run command: ____. Ignored private files: ____. Repository URL: ____.",
    expectedResult:
      "Files have one known location, a named starting point, instructions, and a remote copy.",
    prevents:
      "Losing work, committing secrets, or depending on one AI conversation as the project’s memory.",
  },
  {
    id: "planning-prompt",
    title: "Ask AI to plan",
    useWhen: "The brief is ready but no implementation work has started.",
    exactActions: [
      "State your experience level.",
      "Paste or point to the brief.",
      "Name the person, path, facts, and exclusions.",
      "Ask for small cycles, likely files, and checks.",
      "Require AI to stop before editing.",
    ],
    completedExample:
      "The complete Willow Fix Day planning prompt produces three reviewable build cycles.",
    reusableTemplate:
      "I am [experience]. Plan [goal] for [person]. Use [source]. Include [must-have]. Exclude [not-now]. Propose [number] cycles with result, files, preview check, command, and save message. Do not edit yet.",
    expectedResult:
      "A plan you can question, reorder, or reduce before files change.",
    prevents:
      "One large, opaque implementation based on unstated assumptions.",
  },
  {
    id: "small-change",
    title: "Request one build cycle",
    useWhen: "A plan is approved and you are ready for the next visible result.",
    exactActions: [
      "Name one result from the plan.",
      "State what must remain unchanged.",
      "Forbid unrelated features and dependencies.",
      "Ask for changed-file explanations and relevant commands.",
      "Require a stop for preview review.",
    ],
    completedExample:
      "Cycle 2 adds only the accepted-item and email path, with no form or stored data.",
    reusableTemplate:
      "Implement only [cycle/result]. Preserve [working parts]. Do not add [boundaries]. Explain changed files, run [checks], and stop for my preview review.",
    expectedResult:
      "One understandable improvement that is easy to inspect and save.",
    prevents:
      "A small request quietly becoming a redesign or platform migration.",
  },
  {
    id: "inspect",
    title: "Inspect without reading every line of code",
    useWhen: "AI says a change is complete and shows a preview.",
    exactActions: [
      "Read the changed-file list.",
      "Read every new public sentence.",
      "Compare trusted facts with their source.",
      "Try the full human path by pointer and keyboard.",
      "Resize to the important phone width.",
      "Run the agreed commands and read their final results.",
    ],
    completedExample:
      "At 390px, the learner finds the clipped email action that a desktop preview missed.",
    reusableTemplate:
      "Changed files reviewed: ____. Facts compared: ____. Full path tried: ____. Phone width: ____. Keyboard result: ____. Commands and results: ____.",
    expectedResult:
      "A specific list of what worked, what failed, and what remains uncertain.",
    prevents:
      "Treating a polished preview or AI completion message as a working result.",
  },
  {
    id: "repair",
    title: "Report and repair a defect",
    useWhen: "Something looks wrong, behaves unexpectedly, or conflicts with a source.",
    exactActions: [
      "Write what you observed.",
      "List exact reproduction steps.",
      "State the expected behavior.",
      "Name what already works and must stay.",
      "Ask for the smallest repair.",
      "Repeat affected checks and the complete path.",
    ],
    completedExample:
      "Replace the unsupported repair promise and fix only the 390px wrapping problem.",
    reusableTemplate:
      "Observed: ____. Reproduce: ____. Expected: ____. Preserve: ____. Make the smallest repair. Repeat: ____.",
    expectedResult:
      "A focused change whose success can be observed, not merely asserted.",
    prevents:
      "Vague 'fix it' requests, unrelated rewrites, and repaired defects that return.",
  },
  {
    id: "secret-safety",
    title: "Protect credentials and private data",
    useWhen: "A tool asks for an API key, password, database URL, or visitor information.",
    exactActions: [
      "Ask whether the feature is necessary in the first version.",
      "Keep real values out of prompts, public files, screenshots, and commits.",
      "Use a protected local or host environment setting.",
      "Confirm the private file is ignored before saving.",
      "If exposed, revoke first, then remove and replace.",
    ],
    completedExample:
      "Willow Fix Day needs no secret; the static email link replaces a contact database and mail service.",
    reusableTemplate:
      "Secret needed for: ____. Server-side setting: ____. Ignored local file: ____. Browser receives secret? No. Rotation owner: ____.",
    expectedResult:
      "The smallest necessary private surface with a known storage and recovery plan.",
    prevents:
      "Credential theft, surprise spending, private-data leaks, and permanent exposure in Git history.",
  },
  {
    id: "release",
    title: "Publish one checked version",
    useWhen: "The local project works and someone else needs a hosted link.",
    exactActions: [
      "Select and save the exact candidate.",
      "Push it to the remote repository.",
      "Check the hosted preview outside the development tab.",
      "Record the previous working deployment.",
      "Publish the candidate.",
      "Repeat the important path at the public URL.",
    ],
    completedExample:
      "Willow Fix Day V4 moves from local to GitHub to preview to live, then receives a public phone check.",
    reusableTemplate:
      "Candidate: ____. Commit: ____. Preview: ____. Live URL: ____. Public checks: ____. Known limits: ____. Restore: ____.",
    expectedResult:
      "A public version whose identity, checks, limits, and recovery action are known.",
    prevents:
      "Publishing the wrong commit or discovering there is no recovery path during an incident.",
  },
  {
    id: "post-launch",
    title: "Make a safe post-launch update",
    useWhen: "A stakeholder requests a change after the project is live.",
    exactActions: [
      "Decide whether it supports the chosen result.",
      "Update the trusted source first.",
      "Name affected files and preserved behavior.",
      "Request one bounded change.",
      "Repeat relevant and full-path checks.",
      "Save, preview, release, and check the new version.",
    ],
    completedExample:
      "Add the approved step-free entrance fact without introducing a map or redesign.",
    reusableTemplate:
      "New approved fact/request: ____. Why now: ____. Source update: ____. Preserve: ____. Change only: ____. Repeat checks: ____.",
    expectedResult:
      "A new recoverable version that improves the product without reopening every decision.",
    prevents:
      "Small content requests becoming new systems or breaking an already working path.",
  },
] as const;

export const firstSevenDays = [
  {
    day: 1,
    action: "Choose one person, one useful result, and one small project.",
    artifact: "Rough first-version brief",
  },
  {
    day: 2,
    action:
      "Confirm trusted facts, move expensive features to Not now, and choose a tool lane.",
    artifact: "Approved brief and tool route",
  },
  {
    day: 3,
    action:
      "Create the project folder, README, brief, .gitignore, Git history, and GitHub repository.",
    artifact: "Recoverable project home",
  },
  {
    day: 4,
    action:
      "Ask AI for a small-cycle plan, question it, and approve only the first cycle.",
    artifact: "Reviewed plan",
  },
  {
    day: 5,
    action: "Build, inspect, run, check, and save the first complete path.",
    artifact: "Working local version",
  },
  {
    day: 6,
    action:
      "Try the path on a phone and keyboard, repair observed defects, and rerun checks.",
    artifact: "Checked release candidate",
  },
  {
    day: 7,
    action:
      "Create a hosted preview, release one known version, check the public link, and record recovery.",
    artifact: "Live link and release card",
  },
] as const;

export const runtimeAIExplanation = {
  headline: "AI can build the project without living inside the project.",
  repairCafeDecision: "No runtime AI",
  reason:
    "Visitors need approved event information and a normal email link. Those work without model responses, an API key, or per-visitor AI cost.",
  addRuntimeAIOnlyWhen: [
    "The visitor’s useful result genuinely requires generation, classification, or conversation.",
    "A normal rule, search, form, or static explanation cannot provide the result reliably.",
    "The team can protect keys and private input on a server.",
    "Usage cost, limits, slow responses, unsafe input, unreliable output, and outages have plans.",
    "The interface clearly communicates uncertainty and offers a safe fallback.",
  ],
} as const;

export const screenWritingRules = {
  sequence: [
    "One clear outcome",
    "One short explanation",
    "One worked example",
    "One learner action",
    "One visible consequence",
    "One reusable takeaway",
    "Optional depth behind a clear question",
  ],
  mainCopyTarget:
    "Keep the main explanation near 60–75 words before asking for an action.",
  contentRule:
    "Every teaching item must state when to use it, the exact action, a completed example or observable result, and the failure it prevents.",
  interactionRule:
    "Prefer constructing, sorting, comparing, inspecting, and revising over guessing an author’s preferred answer.",
  languageRule:
    "Introduce a technical term only when it answers the learner’s current question, then define it in plain language.",
} as const;

export const curriculumCompletion = {
  learnerCan: [
    "Explain what an AI workspace, repository, GitHub, and web host each do.",
    "Choose between a hosted-builder route and a repository-agent route.",
    "Decide whether the finished product needs runtime AI.",
    "Turn a broad idea into one person, one result, one path, and a not-now list.",
    "Create a project home with a README, brief, Git history, GitHub copy, and safe secret handling.",
    "Write a planning request that reduces guessing and stops for approval.",
    "Repeat the ask, inspect, run, check, and save loop.",
    "Check trusted facts, phone layout, keyboard access, and the complete human path.",
    "Report a defect with observed behavior, reproduction steps, expected result, and preserved behavior.",
    "Distinguish local, preview, and live versions and record a recovery action.",
    "Handle one post-launch change without rebuilding the whole project.",
  ],
  transferPrompt:
    "Replace the Willow Fix Day with your own idea. What is the smallest complete result one person could use by the end of this week?",
  successStatement:
    "I know where to start, what to ask AI, how to check the work, and how one saved version becomes a live project.",
} as const;
