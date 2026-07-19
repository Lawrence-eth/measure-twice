# Pentimento final experience contract

This document is the implementation contract for the submission release after
the July 19 cognitive-load audit. It supersedes any earlier screen architecture
that conflicts with it.

## Why another rebuild is required

The current curriculum is useful, but the interface exposes too much of it at
once.

Measured at 390 × 844:

- the pre-route Tool Map is 2,173px tall;
- the first meaningful action appears at y=1,147 in Idea, y=1,197 in Project
  home, y=1,291 in Ask AI, y=1,919 in Build, y=1,378 in Check, y=1,330 in Go
  live, and y=1,499 in Improve;
- Tools contains 370 words and 17 controls in one state; and
- completion contains roughly 1,965 words, 45 controls, and 6,838px of content.

The required route also uses roughly 64 button actions. Many only acknowledge
text or advance a simulation. This creates activity without enough educational
agency.

The problem is structural, not typographic. The final release must change what
is shown, when it is shown, and what each interaction means.

## Product promise

> Learn to build with AI, one clear step at a time.

The learner guides one small Willow Fix Day website from a rough idea to a checked
live link. They do not learn coding syntax and Pentimento does not build a real
project for them.

Honest core-route time: **about 12–15 minutes**.

## One learning loop on every stop

Every stop must:

1. ask the learner to predict, choose, or try something;
2. change the project canvas in response;
3. reveal one reusable rule;
4. save one practical artifact; and
5. keep deeper explanation optional.

Remove any required click that does not change the project canvas, route,
artifact, evidence, or learner understanding.

## Density and interaction limits

- No blocking conceptual screen before Idea.
- No more than **14 required meaningful interactions** after Start.
- No more than **45 words before the primary task**.
- No more than **three choices in a core state**.
- The primary task must begin inside the first 390 × 844 viewport.
- A stage introduction uses one short heading and one sentence.
- Full prompts, commands, glossaries, checklists, and product catalogues are
  closed by default.
- Optional depth is never required to continue.
- One concept has one primary home; later stops apply it rather than repeat it.
- Completion shows outcomes first, not the entire handbook.

## The persistent Pentimento interaction

The layer metaphor must remain visible through the route instead of appearing
once in onboarding.

The same project canvas accumulates layers:

1. **Idea** adds the first-version brief.
2. **Tools** connects the AI workspace, project home, and host.
3. **Project home** adds recoverable files and separates build-time AI from
   runtime AI.
4. **Ask AI** adds the work agreement and an approved first step.
5. **Build** paints one visible change and saves it.
6. **Check** exposes a defect beneath the polished surface and repairs it.
7. **Go live** selects one exact checked layer for release.
8. **Improve** adds a new source-backed layer without erasing the old one.

The visual consequence should carry more teaching than another paragraph.

## Route architecture

### Opening

Show:

- a literal explanation that this is a guided simulation for complete beginners;
- one sentence explaining the 13-decision worked example;
- “No code · nothing real publishes · about 12–15 minutes”; and
- **Begin the guided build**.

The eight-stop overview is secondary. The three-role map moves into Tools. The
one-off layer-reveal screen is removed; its idea becomes the persistent canvas.

### 1. Idea

Question:

> What should the first visitor be able to finish?

Choices:

- see approved event facts and email the organizer;
- book a repair slot; or
- donate online.

Booking and donation reveal the systems they introduce. The smallest complete
path builds the approved first-version brief on the canvas.

Artifact:

> Nearby visitor → approved facts → one working email
> Not now: accounts, booking, payments, live availability, or AI advice.

Required interactions: **1**.

### 2. Tools

Teach the three durable roles visually:

> AI workspace builds → project home remembers → host publishes

Question:

> Which tradeoff matters more for your first project?

Choices:

- fastest first preview; or
- visible files and recoverable history.

The selected route immediately rewires the diagram. Product-name decoding is a
secondary reference after the decision. The Willow Fix Day does not need AI inside
the finished page.

Artifact:

```text
Build here:
Keep files/history here:
Publish here:
First action:
Watch for:
```

Required interactions: **1**.

### 3. Project home

Question:

> Where should the work survive after this chat closes?

The correct choice creates a route-specific project home:

- repository lane: folder → Git history → GitHub copy;
- hosted lane: hosted project → saved versions → GitHub connection/export.

Then confront a common misconception: because AI helped build the page, does
the finished visitor experience need an AI API key? It does not—the visitor
only reads approved facts and uses a normal email link. Future secret-storage
guidance remains optional depth.

Artifact: a four-item project-home checklist tailored to the selected lane.

Required interactions: **2**.

### 4. Ask AI

Show one vague request.

Question:

> What should AI do first?

Choices:

- build and deploy everything; or
- inspect the project, return a small plan, and stop for approval.

After the bounded choice, show the AI’s actual three-step plan. The learner may
then approve **step one only**. Never ask the learner to approve a plan that has
not been shown.

Artifact: a concise planning request plus the approved first step.

Required interactions: **2**.

### 5. Build

Show AI reporting “Done.”

Question:

> Which action earns the next evidence level?

The first three levels—AI claim, files, and preview—are already visible. The
useful next action is:

> open the preview and try the visitor path.

Practice ask → inspect → run → check → save once. Show cycles two and three as
later saved layers rather than replaying fifteen phase clicks. The version
scrubber remains optional direct manipulation.

Artifact: one change record with request, changed files, observed result,
checks, and saved version.

Required interactions: **1**.

### 6. Check

Do not name a defect before discovery.

The learner directly tries the contact action in the polished preview. It does
nothing. That failure builds:

```text
Observed:
Steps:
Expected:
Preserve:
Repeat after repair:
```

Applying the bounded repair visibly changes the same canvas, and the learner
tries the path again. Facts and 390px layout remain optional extra lenses.

Show the evidence ladder:

> AI claimed it → files changed → preview showed it → human path worked → public
> path worked

Artifact: one completed defect report.

Required interactions: **3** (try, repair, retry).

### 7. Go live

Question one:

> Which version should go live?

Choices:

- polished but broken V3; or
- checked V4.

After choosing V4, the learner directly opens a simulated fresh public address
and repeats the important path. The dashboard remains visible only as weaker
evidence.

Use:

> Workspace → Preview → Live

Keep the previous working version visibly pinned as Recovery. GitHub belongs in
the project-home route rather than pretending to be a universal hosting step.

Artifact: release card with exact version, public URL, public check, known
limit, and restore action.

Required interactions: **2**.

### 8. Improve

Request:

> Add that step-free access is through the side entrance on Willow Lane.

Question:

> What changes first?

Choices:

- only the visible page;
- the trusted source, then the page; or
- the entire design.

The source-first choice adds one new visible Pentimento layer and reruns only
the affected checks.

Artifact: source change, bounded request, affected checks, and saved V5.

Required interactions: **1**.

Total required route interactions: **13**.

## Completion

Show outcomes and next actions first:

1. **Shape my own V1 brief**;
2. **Open my 5-card Playbook**;
3. a route-specific three-step **Start today** card; and
4. the four durable habits in a closed review section.

The repository route defines its first technical terms at the moment of use:
project folder, run note (`README.md`), saved brief (`docs/brief.md`), version
history (Git), saved snapshot (commit), and reviewed online copy (push to
GitHub). Its project-home Playbook card includes a copyable, step-by-step AI
setup request that asks for plain-language explanations and evidence after each
step.

Do not render ten cards, 21 glossary terms, and a fixed seven-day schedule
inline.

The Playbook opens as a five-card index with one milestone shown at a time. On
mobile, choosing a card replaces the index until the learner returns. Replace
fixed days with milestones:

- Brief ready
- Project home ready
- First path working
- Candidate checked
- Public version checked

The optional Teaching Mirror becomes a four-step transfer flow:

1. person, situation, and useful result;
2. complete path and trusted facts;
3. must-have and Not now;
4. finish line and selected tool route.

Only one field group appears at once. The flow first creates a complete,
copyable V1 brief locally. Model-assisted teaching reflection is a separate,
explicitly optional action after that artifact exists.

## Visual system

- Preserve paper, ink, ultramarine, viridian evidence, mauve underpainting, and
  crimson defects.
- Reduce stage-heading scale so the task—not the title—owns the viewport.
- Use whitespace to separate decisions, not to push actions below the fold.
- Make the canvas the dominant visual on desktop and the task itself on mobile.
- Use concise labels and diagrams before prose.
- Animate layer addition, route connection, defect exposure, and version
  selection with restrained transform/opacity motion.
- Respect `prefers-reduced-motion`.
- Never use animation as the only explanation of a state change.

## Accessibility and responsive contract

- Native controls first.
- Every visual state change has adjacent text and an `aria-live` announcement
  where useful.
- Focus moves to the next meaningful question after a stage change.
- Dialogs trap focus, close predictably, and return focus to their opener.
- Completed stages remain revisitable through a compact route sheet rather than
  eight simultaneous navigation buttons.
- At 320px, the optional overview keeps its start action in a sticky dialog
  footer while the three phase cards remain scrollable.
- At 320px, 390px, 768px, desktop, and 200% zoom:
  - no document-level horizontal overflow;
  - no clipped primary action;
  - no sticky element hiding focused content;
  - touch targets are at least 44px where practical; and
  - the task begins in the first viewport.

## Public-runtime contract

- Core learning never depends on a model call.
- The Teaching Mirror remains explicitly optional and bounded.
- Repeated ordinary page loads must not trigger a site-wide temporary ban at a
  rate a judge or browser suite could reasonably produce.
- Root, assets, valid debrief, invalid debrief, and unrelated write paths keep
  their intended status behavior.

## Completion evidence

The final release is not proven until:

- a fresh beginner walkthrough confirms every primary task is visible before
  scrolling;
- the required route completes in 13 meaningful interactions;
- all content/correctness issues in this contract are resolved;
- desktop and mobile screenshots of every initial stage are visually inspected;
- keyboard-only, Axe, reduced-motion, 200% zoom, 320/390/768/1440, persistence,
  restart, optional Playbook, and Teaching Mirror flows pass;
- the generated Worker passes the same browser contract;
- the unchanged production artifact passes hosted verification; and
- the release evidence identifies the exact commit, version, and rollback.
