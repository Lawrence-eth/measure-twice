# Pentimento curriculum and content standard

This document is the long-form content bank behind the current v9 experience.
The exact screen order, interaction count, and progressive-disclosure contract
live in [FINAL_EXPERIENCE.md](FINAL_EXPERIENCE.md). Templates and examples below
may appear as contextual field notes or in the five-guide Build kit; they are not
all required actions in the 15-minute route.

The current delivery groups the same lifecycle into four chapters:

| Chapter | Stops |
| --- | --- |
| **Shape the promise** | Idea |
| **Ground the work** | Tools · Project home |
| **Direct the build** | Ask AI · Build |
| **Prove the release** | Check · Go live · Improve |

The learner makes 14 consequential decisions. After each stop, successful
feedback remains visible until the learner selects **Save this lesson** and
opens one **Lesson receipt**. Eight stop-level receipts connect to the existing
five-guide take-home Build kit; they do not create eight additional guides.

The six-folio opening is part of the curriculum, not a marketing prelude. It
orients the learner, distinguishes an AI claim from evidence, lets the learner
produce the first failure observation, reveals the four project layers, makes
the four-part method explorable, and then begins the lesson. If that failure was
observed, Check reuses it as prior evidence instead of staging it again.

## Audience promise

Pentimento assumes the learner has never used Git, GitHub, an AI coding agent, a project repository, a test suite, environment variables, preview hosting, or deployment tooling.

The curriculum teaches **how to build a project with AI, not how to write code**. It does not substitute prompt vocabulary for understanding. Each technical idea appears in plain language at the moment it changes a real decision.

By the end of the authored route, a learner should have practiced how to:

- turn a broad idea into one complete and checkable first version;
- choose a tool role based on setup, ownership, visibility, and recovery;
- give the work a durable home outside an AI conversation;
- ask AI to plan before editing and stop at an approval point;
- build in small, observable, recoverable slices;
- inspect work even when they cannot read every line of code;
- report a defect through observation rather than guessing at its cause;
- publish one exact version and test it after publication;
- identify when another system creates more responsibility than value; and
- make the next change without reopening the whole project.

One guided project supplies practice, not a claim of mastery.

## Governing ideas

### Teach roles before products

Product names, feature sets, prices, and interfaces change. The curriculum begins with durable jobs:

| Role | Plain job | Does not guarantee |
| --- | --- | --- |
| **AI workspace** | Helps plan, changes files, explains work, and may run checks | Correct facts, a tried visitor path, a saved history, or a public result |
| **Project home** | Keeps files and recoverable versions; commonly a folder with Git and a GitHub copy | That the project runs, is safe, or is deployed |
| **Web host** | Turns one chosen version into a preview or public link | That the public path works or matches the checked version |

The durable connection is:

> **AI helps build → the project home remembers → the host publishes.**

One product may combine these roles. The learner should still ask what files exist, where history lives, which version is hosted, and how that version can be recovered.

### Teach a lifecycle, not a magic prompt

The route is:

> **Idea → Tools → Project home → Ask AI → Build → Check → Go live → Improve**

Prompts are work specifications. Their value comes from useful context, trusted sources, boundaries, approval points, and observable checks—not length, role-play, or secret wording.

### Teach complete paths before feature lists

A first version is the smallest complete useful journey, not the greatest number of visible features.

For the Willow Fix Day:

```text
Nearby resident on a phone
→ reads when, where, and accepted items
→ understands repair is not guaranteed
→ opens an email to the organizer
```

The path needs no account, booking system, payment, database, stored personal data, live inventory, chat, or runtime AI.

### Separate saved, built, previewed, live, and working

- **Saved** means one state has a name in version history.
- **Built** means the production-build command produced a host-ready artifact.
- **Previewed** means one hosted candidate was opened and checked.
- **Live** means the intended public address serves a selected version.
- **Working** is always relative to a named path and current evidence.

No one state silently proves another.

## Safe first-project filter

A good first project usually has:

- one person;
- one complete path;
- non-sensitive information;
- reversible actions;
- a result visible in a browser;
- no payment or permission system; and
- facts with a named owner or source.

Pause and narrow when a first idea includes:

- accounts, identity, or multiple permission roles;
- private, medical, financial, or children’s data;
- payment, refunds, or financial decisions;
- live collaboration, real-time availability, or complex databases;
- autonomous messages or external actions;
- app-store distribution;
- generated advice that could cause physical, legal, medical, or financial harm; or
- operations no person has agreed to maintain.

These ideas may be valuable. They are simply poor places to hide beginner complexity.

## When another system is justified

| System | Add it only when | Work it creates |
| --- | --- | --- |
| **Database** | Information must persist and be shared across sessions, devices, or people | Source of truth, editing, access, backups, stale data, recovery |
| **Login** | Identity or permission changes what a person may see or do | Account recovery, access rules, security, deletion, support |
| **External API** | The outcome depends on data or an action owned by another service | Credentials, failures, limits, cost, privacy, terms |
| **Runtime AI** | The visitor needs generation or interpretation that simpler rules or verified content cannot supply | Protected keys, usage cost, latency, unsafe input, uncertain output, evaluation, fallback |
| **Payment** | Price, fulfillment, refunds, disputes, security, support, and legal ownership are understood | Transaction states, receipts, fraud, tax questions, operations |

Using AI during development is not a reason to put AI inside the finished product.

## The canonical case

The fictional neighborhood Willow Fix Day uses these approved facts:

```text
Saturday, July 25 · 10:00–14:00
West Hall Community Room
Small appliances, clothing, and bicycles
Repairs depend on volunteer availability
Questions: hello@willow-fix.example
```

The first-version visitor is a nearby resident checking from a phone. The result is to decide whether the event fits their need and contact the organizer.

The complete journey uses one internally consistent sequence:

```text
rough idea
→ approved brief
→ project home
→ bounded planning request
→ three saved build cycles
→ observed defects
→ bounded repair
→ checked V4
→ simulated live V4
→ one approved content update
```

## Stop 1 — Idea

### Learning outcome

Choose one person, one useful result, one complete path, trusted facts, must-haves, a not-now list, and a repeatable finish line.

### Interaction

The learner sorts six tempting features:

- event facts and accepted-item list — first version;
- email link — first version;
- booking system — later;
- volunteer accounts — later;
- donations — needs an answer before any implementation; and
- AI repair advice — later.

The worked recommendation appears after each decision. It names the concrete obligations created by identity, personal data, changing data, money, runtime AI, and ongoing operations.

### Reusable brief

```text
One person:
Their situation:
Useful result:
One complete path:
Trusted facts:
Must be in version one:
Not now:
Complete when:
```

Willow Fix Day example:

```text
One person: A nearby resident with an item that might be repairable
Their situation: Checking from a phone before Saturday
Useful result: Decide whether to attend and email one question
One complete path: Open → understand → decide → email
Trusted facts: The organizer-approved event facts
Must be in version one: Summary, items, limit, email link, phone layout
Not now: Accounts, booking, payment, live data, chat, AI advice
Complete when: Facts match and the path works at desktop and 390px by keyboard
```

### What it prevents

A polished prototype with no clear visitor, invented facts, several unfinished systems, and no observable finish line.

## Stop 2 — Tools

### Learning outcome

Choose a starting lane by constraints instead of product popularity.

### Two legitimate lanes

#### Shortest setup

```text
Hosted AI builder
→ connected repository or export
→ built-in or separate host
```

Choose it when fast visual iteration and minimal setup matter most. Before relying on it, check export, ownership, version history, privacy, cost, hosting limits, and recovery.

#### Most transferable

```text
Repository-aware AI agent
→ project folder, Git, and GitHub
→ separate host
```

Choose it when visible files, reviewable history, portability, and custom work matter more than setup speed. Expect local setup, commands, secret handling, and a separate deployment step.

Pentimento demonstrates this lane to make the lifecycle visible, not to declare a winner.

### Tool plan

```text
AI workspace:
Project home:
Preview / public host:
Why this lane fits:
Before starting, check:
- ownership and export
- privacy
- current costs and limits
- version history
- supported platform
- recovery
```

### Selection questions

1. Does the finished product itself need AI?
2. Do I value least setup or the clearest view of real files?
3. Can I export the files or connect them to GitHub?
4. Who pays for building, hosting, storage, and runtime usage?
5. Can I identify and restore an earlier version?

### What it prevents

Choosing a complex or locked-in stack because a product demo showed more features.

## Stop 3 — Project home

### Learning outcome

Understand where the project lives, how it is saved, what another person needs, and what must remain private.

### Plain-language distinctions

- **Project folder:** the files in the current workspace or computer.
- **Git:** the local tool that records named versions and shows differences.
- **Repository:** the project files plus their Git history and instructions.
- **GitHub:** a service that can store and share that repository remotely.
- **Commit:** one named snapshot of selected and reviewed changes.
- **Diff:** what was added, removed, or edited between states.
- **README:** the front-page explanation of purpose, setup, checks, and limits.
- **`.gitignore`:** the list of generated or private files Git must not save.
- **Environment variable:** a setting supplied outside source files.

### Canonical file map

```text
willow-fix/
├── README.md          purpose, setup, checks, limitations
├── docs/brief.md      approved first version and trusted facts
├── app/page.tsx       visible page structure
├── app/styles.css     layout, type, focus, phone behavior
├── public/            intentional public assets and credits
├── package.json       dependencies and named commands
├── .gitignore         generated and private paths not to save
└── .env.local         private local values; never commit
```

### Five foundation steps

1. Create one clearly named project folder.
2. Add `README.md` and the approved brief before requesting a full interface.
3. Start Git and inspect which files are about to be saved.
4. Save the brief as an honestly named first version.
5. Push the reviewed commit to a private or public GitHub repository.

### Minimal safe command route

```bash
git status
git diff
git add README.md docs/brief.md
git commit -m "docs: define Willow Fix Day first version"
git push
```

Each command is taught by purpose. Learners are not expected to memorize an exhaustive Git interface.

### Secret safety

> A secret belongs in a protected environment setting, never in a prompt, screenshot, public file, commit, or browser-delivered code.

Before saving, read every selected file and search for tokens, passwords, private data, and unexpected generated content.

If a credential is exposed:

1. revoke or rotate it at the provider immediately;
2. remove it from the project and repository history;
3. store the replacement in the correct protected setting; and
4. inspect provider usage and billing.

Deleting the visible line is not sufficient.

### What it prevents

Losing work, depending on one conversation as project memory, committing a secret, or being unable to identify the state that was checked.

## Stop 4 — Ask AI

### Learning outcome

Turn a vague request into a bounded planning task.

### Weak request

```text
Build me a beautiful, innovative Willow Fix Day app.
Make every useful feature and deploy it.
```

This does not identify a person, trusted facts, scope, checks, work mode, or approval boundary.

### Planning request

```text
I am building my first project and need plain-language explanations.

Goal:
Person and situation:
Trusted source:
Complete path:
Must include:
Do not add:
Quality constraints:

First inspect the repository and propose three small build cycles.
For each cycle, return:
- visible result
- likely files
- preview check
- command to run
- saved-version message

Do not edit files yet. Stop after the plan and wait for approval.
```

### Review questions

- Can AI identify one person and one useful result?
- Are the trusted facts named or stored in a file?
- Does the request say what must not be added?
- Can another person observe the finish line?
- Does AI know whether to plan, edit, run, or explain?
- Is there a clear point where AI must stop for review?

### One-change request

```text
Implement only:
Preserve:
Do not add:
Run:
Ask before any external or hard-to-reverse action.
Return changed files, actual results, assumptions, and remaining gaps.
Stop for my preview review.
```

### What it prevents

One large, opaque implementation based on unstated assumptions and permission to do everything.

## Stop 5 — Build

### Learning outcome

Build one visible improvement at a time and keep an understandable recovery point.

### Core loop

> **Ask → inspect → run → check → save**

- **Ask:** give one bounded request from the approved plan.
- **Inspect:** read the changed-file list, visible text, package/configuration changes, and AI assumptions.
- **Run:** open the current result and execute the agreed command.
- **Check:** try the important human path and compare facts with their source.
- **Save:** select reviewed files and create one named Git version.

### Willow Fix Day cycles

| Cycle | Visible result | Main check | Saved state |
| --- | --- | --- | --- |
| 1. Information structure | Complete facts in a clear phone-first order | Page loads; every approved fact appears | V1 · readable event information |
| 2. Visitor action | Accepted items and contact path | Exact email destination and keyboard use | V2 · complete visitor path |
| 3. Responsive finish | Elegant phone and desktop presentation | 390px, keyboard, tests, production build | V3 · responsive first version |

The interface keeps three synchronized views: AI request/report, changed files, and running preview.

AI’s summary is labelled as a report until another observation supports it. A saved version records a state; it does not prove that state is correct.

### What a non-coder can inspect

- every new public sentence;
- whether page order matches the complete path;
- the changed-file names and any unexpected file;
- new packages, permissions, network calls, or configuration;
- the desktop and 390px preview;
- the full path by pointer and keyboard; and
- the final result of each agreed command.

### What it prevents

Large unreviewable changes, silent scope expansion, and saving several unrelated changes as one impossible-to-explain version.

## Stop 6 — Check

### Learning outcome

Distinguish a polished result from a tried result, then write a reproducible and bounded repair request.

### Canonical defects

1. The page promises “Every walk-in gets a repair,” while the approved source says repairs depend on volunteer availability.
2. At 390px, the contact action extends outside the visible page.
3. Selecting the contact action does not open an email to the approved address.

### Defect report

```text
Observed:
Steps to reproduce:
Expected:
Environment / URL / version:
Evidence:
Must preserve:
After the change, repeat:
```

Describe observable behavior before naming a technical cause.

### Practical checks

1. Do all public facts match the trusted source?
2. Can the intended person complete the main path?
3. Does it work at phone and desktop sizes?
4. Can it be used by keyboard with visible focus and clear labels?
5. What happens with missing, long, invalid, slow, or failed input where relevant?
6. What exactly changed, including files, packages, permissions, configuration, and network calls?
7. Which named version was checked, and what remains untested?

### Evidence limits

| Evidence | Supports | Does not establish |
| --- | --- | --- |
| Source comparison | Whether public claims match approved facts | Whether interaction works |
| Diff review | What files and configuration changed | Whether behavior succeeds |
| Production build | Whether exact code produces a host-ready artifact | Whether a visitor completes the path |
| Automated test | Whether encoded behaviors pass | Requirements the test omitted |
| Screenshot | One visible state at one size | Keyboard use, link destination, or other sizes |
| Representative path | What one person observed in one environment | Every untried path |
| AI summary | What AI intended or reports | What the project actually does |

### Recovery loop

```text
reproduce → narrow → approve the smallest repair →
repeat the original case → check nearby behavior → save a new version
```

The repaired V4 repeats approved facts, complete path, 390px, keyboard, typecheck, tests, and production build checks.

### What it prevents

Vague “fix it” requests, diagnosis by guesswork, unrelated rewrites, and a repaired defect that returns because no one repeated the failing case.

## Stop 7 — Go live

### Learning outcome

Move one exact checked version into public use and know how to recover.

### Release states

| State | Meaning | Learner action |
| --- | --- | --- |
| **Local** | Private development result | Complete the path, inspect changes, run checks |
| **GitHub** | Remote repository and history | Push the selected commit; confirm no private file |
| **Preview** | Hosted release candidate | Open outside the development tab and repeat important checks |
| **Live** | Intended public address | Publish V4 and try the public path fresh |
| **Recovery** | Known restore route | Record the prior version and host restore action |

### Release card

```text
Project:
Exact saved version / commit:
Production build result:
Preview URL and check:
Known limitations:
Human approval:
Public URL and live-path result:
Previous working version:
Recovery procedure:
```

A successful host deployment is followed by a public-path check. Preview success does not prove production, and GitHub is not the public application URL.

### What it prevents

Publishing the wrong commit, treating deployment success as visitor success, or discovering there is no recovery procedure during a failure.

## Stop 8 — Improve

### Learning outcome

Make one post-launch change without reopening every product decision.

### Canonical update

Approved request:

> Step-free access is through the side entrance on Willow Lane.

The sequence is:

1. confirm the change supports the existing visitor result;
2. update `docs/brief.md`, the trusted source;
3. name the public file that should change;
4. preserve facts, contact path, phone layout, and keyboard use;
5. request only the approved wording change;
6. repeat facts, complete path, 390px, keyboard, tests, and build;
7. save, preview, publish, and check a new version.

### Post-launch template

```text
New approved fact or request:
Why it belongs now:
Trusted source update:
Change only:
Preserve:
Repeat these checks:
New saved-version label:
```

If the update introduces identity, money, private data, live operations, or runtime AI, it deserves a new brief and first-version decision.

### What it prevents

A small content request quietly becoming a redesign, new platform, or unreviewed system.

## Persistent five-guide Build kit

The **Build kit** is available beside the current task and opens five milestone
guides:

1. Shape the first version.
2. Choose a route and project home.
3. Ask, inspect, and save.
4. Check and repair.
5. Release and improve.

Each card may combine several of the templates in this content bank. Every card
contains:

- **Use moment:** when the learner needs it.
- **Exact action:** an executable sequence.
- **Worked example:** the completed Willow Fix Day version.
- **Reuse:** a blank adaptable template.
- **Observable result:** what the action should produce.
- **Prevention:** the mistake, risk, or wasted work it helps avoid.

The complete Build kit adds a plain-language glossary and seven-day starting
route:

```text
Day 1 · one person, result, and small project
Day 2 · trusted facts, not-now list, and tool lane
Day 3 · folder, README, brief, .gitignore, Git, and GitHub
Day 4 · reviewed small-cycle plan
Day 5 · first complete local path
Day 6 · phone, keyboard, repair, and reruns
Day 7 · hosted preview, approved release, live check, and recovery
```

## Authored/live teaching reflection

The reflection appears only after the authored journey and after a complete,
copyable local V1 brief exists. It is optional and initiated explicitly by the
learner.

### Learner input

- their own first-version brief; and
- their selected hosted-builder or repository-aware lane.

The interface explains that this submitted text will leave the browser and tells the learner not to include secrets or personal information.

### Structured output

- one specific strength;
- exactly two unresolved assumptions phrased as questions;
- one feature to postpone with a concrete reason;
- one honest tradeoff for the selected lane; and
- exactly three small next moves.

### Boundary

Neither the authored example nor GPT‑5.6 can:

- grade, score, give a level, or claim mastery;
- decide correctness or route progression;
- decide whether the learner’s idea is good;
- rank brands or assert current product capabilities;
- generate code or build the project;
- access a repository;
- request an API key or credential;
- create an account, publish, or take an external action; or
- convert an inference into a fact.

The interface exposes which mode is active and labels the result:

- **Authored example · deterministic, no live AI call**; or
- **GPT-5.6 reflection · live**.

An authored example is not described as an AI-assisted or live model response.
Structured validation, bounded input, server-side credentials, `store: false`,
and a clearly labelled authored fallback keep the core outcome deterministic.

## Learning design

The interaction grammar is:

```text
why it matters → take one consequential action → observe the consequence →
Save this lesson → inspect the Lesson receipt → continue
```

Scaffolding changes across the route:

- folio 00 identifies the learner, time, activity, and take-home artifacts;
- folio 01 presents an untested claim without spoiling the defect;
- folio 02 lets the learner test the polished action and observe the failure;
- folio 03 reveals Promise, Project home, Evidence, and Release beneath the
  visitor surface;
- folio 04 lets the learner explore Shape, Ground, Direct, and Prove;
- folio 05 states the lesson and begins with the first promise;
- Idea narrows one tempting wishlist to a complete first-version path;
- Tools compares two tradeoffs rather than presenting a winner;
- Project home establishes recoverable custody and the runtime-AI boundary;
- Ask AI creates a bounded agreement and one approval point;
- Build requires evidence beyond AI's completion claim;
- Check moves from observed failure to bounded repair to required retry;
- Go live distinguishes an exact checked version from deployment status;
- Improve updates a trusted source before its visible surface; and
- eight Lesson receipts connect to five reusable milestone guides.

Future controls are not rendered as a wall of choices. Completed steps remain
revisitable. A correct decision does not auto-advance: its causal consequence,
use moment, and prevented failure remain visible until the learner saves the
note. Optional depth answers “Why this matters,” “Make,” “Proof,” and “Avoid”
without becoming required reading.

## Content quality gate

Every instructional item must pass all six checks:

1. **Use moment:** says when the learner would use it.
2. **Action:** gives an exact next step.
3. **Example:** shows the completed Willow Fix Day version.
4. **Reuse:** supplies a blank or adaptable form.
5. **Observable result:** says what the action should produce.
6. **Prevention:** names the costly mistake or wasted work it prevents.

Editorial rules:

- A sentence must change a decision, action, mental model, or interpretation; otherwise remove it.
- Literal meaning comes before metaphor and plain language before jargon.
- Advice states its conditions and tradeoffs.
- Product examples, if added, are secondary and never presented as timeless rankings.
- Trusted facts, learner observations, AI reports, and inferences remain visibly distinct.
- Prompts are work specifications, not incantations.
- Examples remain consistent across brief, files, preview, checks, release, and update.
- “Saved,” “built,” “previewed,” “published,” and “works” remain distinct.
- Safety guidance states what not to expose, where it belongs, and what to do after leakage.
- Reading only headings, actions, and takeaways should still reveal a coherent route.

Pentimento deliberately omits model-history timelines, exhaustive tool catalogs, secret prompts, prompt scores, framework debates, coding syntax, generic quizzes, streaks, badges, fake market statistics, and motivational filler disconnected from an action.
