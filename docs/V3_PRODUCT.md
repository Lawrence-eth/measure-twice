# Pentimento V3 — product and curriculum specification

## Product promise

**Pentimento shows a complete beginner how one AI-built project moves from a rough idea to a tested live link.**

The learner follows one small website from nothing to release, sees the decisions and files beneath the finished surface, and leaves with a reusable **First AI Build Playbook**. Pentimento is an authored educational experience, not a coding course, project generator, tool ranking, or substitute for a real development environment.

The literal explanation must precede the artistic metaphor:

> A finished project is only the visible surface. Pentimento reveals the idea, tool choices, project files, AI requests, checks, and saved versions underneath it.

## Audience and problem

### Primary learner

An adult with an idea but no experience with AI coding tools, project folders, Git, GitHub, previews, hosting, APIs, or deployment. They can use a browser and write ordinary language. No coding vocabulary is assumed.

### Problem to solve

AI building products expose different buttons, names, and combinations of capabilities. Beginners therefore struggle with the durable questions:

- Which kind of tool should I begin with?
- What should I build first, and what should I postpone?
- Where does the project actually live?
- What should I ask AI to do first?
- What do I inspect after AI changes something?
- How does a local result become a public link?
- When are GitHub, a database, login, an API, or runtime AI actually needed?
- What should I do when something fails?

Pentimento teaches the underlying project lifecycle so the learner can transfer the method between products.

### End-of-journey outcomes

The learner can:

1. choose an appropriate tool category and explain the tradeoff;
2. define one safe, small, complete first version;
3. distinguish a project folder, Git, GitHub, an AI workspace, and a host;
4. give AI a bounded, useful first request;
5. repeat the **ask → inspect → run → check → save** build loop;
6. report a defect with reproducible evidence;
7. distinguish local, preview, and live states;
8. protect credentials and know when extra systems are justified;
9. publish one exact version and name a recovery path; and
10. begin a second iteration without rebuilding everything.

One journey is practice, not proof of lasting mastery.

## Product principles

- Teach roles and lifecycle before product names.
- Use one coherent case from blank page to live link; do not present disconnected lessons.
- Explain what the learner is doing, why it matters, and what they will keep before asking them to act.
- Let learners construct, compare, inspect, and revise. Multiple-choice questions are secondary.
- Reveal one decision at a time. Depth is available on demand, never dumped before it is useful.
- Make every core action produce a reusable artifact in the Playbook.
- Keep practical guidance available from the beginning; it is not a reward to unlock.
- Use plain words first and introduce a technical term only when it solves the current problem.
- Show uncertainty and tradeoffs. Do not imply that one tool or workflow is universally best.
- The case is safe and simulated: no real repository, email, purchase, account, or deployment is created.
- Using AI to build a product does not imply that the finished product needs an AI API.

## The case

The learner builds a one-page website for a fictional neighborhood Willow Fix Day.

The starting note is intentionally rough:

> We need a page for next Saturday’s Willow Fix Day. People should know what they can bring and how to contact us. Make it welcoming.

The first complete version helps one nearby resident:

1. arrive from a shared link;
2. understand the date, place, accepted items, and availability limit;
3. decide whether the event fits their need; and
4. contact the organizer by email.

It requires no account, database, payment, personal-data store, or runtime AI. This makes the full lifecycle understandable while still allowing meaningful scope, source, phone-layout, link, accessibility, version, and release decisions.

## Opening 60 seconds

The opening has two calm screens before the first project decision.

### 0–20 seconds: welcome

Required copy hierarchy:

> **Build your first project with AI—from idea to live link.**
>
> Follow one small website from a rough note to a tested release. Learn which tools do what, what to ask AI, how GitHub protects your work, and how a project reaches the web.

Visible reassurance:

> No coding experience needed · About 25 minutes · Nothing real is published

Primary action: **Show me the route**

The screen must also show the eight-stop route as a simple line:

> Idea → Tools → Project home → Ask AI → Build → Check → Go live → Improve

No project choices, assessment language, unexplained terms, or dense navigation appear here.

### 20–45 seconds: the three-role mental model

Show only three essential roles:

1. **AI workspace** — helps plan, creates or changes project files, and explains its work.
2. **Project home** — keeps the files and saved versions. In this journey, that is a project folder with Git and GitHub.
3. **Web host** — turns one chosen version into a link other people can visit.

Required connection:

> **AI helps build → the project home remembers → the host publishes.**

Clarify that one product may combine several roles. The roles remain useful even when the buttons and product names change.

### 45–60 seconds: reveal the layers

Show the finished Willow Fix Day page. A reveal control exposes the rough note, brief, files, AI request, checks, and saved release beneath it. Provide buttons as an equivalent to dragging.

Required copy:

> You will rebuild these layers in order. At every stop, you will make one practical decision and add one reusable page to your Playbook.

Primary action: **Begin with the idea**

## Durable tool-role map

The core curriculum uses role categories, not brand rankings.

| Role | What it does | Use it when | Output to look for | Main caution |
| --- | --- | --- | --- | --- |
| Thinking assistant | Helps explore an idea, compare options, and draft a brief | The problem or audience is still unclear | Assumptions, questions, options, first-version brief | A conversation is not automatically the project or a verified source |
| Hosted AI builder | Combines prompting, project editing, preview, and sometimes hosting | Low setup and a quick visual prototype matter most | Editable project, preview, export/version options | Check ownership, export, limits, privacy, and recovery before committing |
| Repository-aware coding agent | Reads and changes real project files and can run checks | Transferable files, version history, or custom work matter | Plan, changed files, check results, remaining risks | Bound the task and inspect changes; AI claims are not proof |
| Project home | Stores files and saved history; commonly a folder with Git and a remote repository | Work must be recoverable, reviewable, or shared | Files, commits, differences, README, remote copy | A private repository is not a secret manager |
| Cloud task agent | Works on a bounded task in an existing repository and proposes changes | A repository and clearly described task already exist | Branch or proposed change, report, checks | It is usually not the clearest blank-page starting point |
| Web host | Builds or serves one chosen version at a preview or public URL | Other people need to visit the result | Preview link, live link, deployment record, rollback option | “Deployed” does not prove the visitor path works |
| External API | Supplies data or performs an action in another service | The outcome truly depends on that service | Documented request, response, errors, limits | Keys stay server-side; account for cost, failure, privacy, and terms |
| Runtime AI | Adds generation, interpretation, or semantic behavior for the product’s users | Fixed content or ordinary rules cannot deliver the user outcome | Defined input/output, safety and failure behavior, evaluation | Do not add it merely because AI was used during development |

### Starting-lane decision

Pentimento presents two legitimate beginner lanes:

- **All-in-one browser lane:** choose a hosted AI builder when minimal setup and fast visual iteration matter most. Before relying on it, check project export, version history, privacy, cost, and hosting limits.
- **Repository lane:** choose a repository-aware agent + project folder/GitHub + host when ownership, portability, reviewable history, or custom integrations matter more than setup speed.

Pentimento demonstrates the repository lane because it makes the lifecycle visible. It must state that this is a teaching choice, not a universal recommendation.

### “Do I need another system?” guide

- **Database:** only when information must persist and be shared across sessions, devices, or people. Static facts do not need one.
- **Login:** only when identity or permissions change what someone may see or do. Do not add login for decoration.
- **External API:** only when the project needs data or an action owned by another service.
- **Runtime AI:** only when the user outcome requires generation or interpretation that simpler logic or verified content cannot provide.
- **Payment:** only after price, fulfillment, refunds, security, support, and legal responsibilities are understood.

For a first project, prefer one user, one complete path, non-sensitive information, reversible actions, and no payment or permissions. Explicitly flag accounts, private data, financial or medical decisions, multi-role access, real-time collaboration, native app stores, and autonomous external actions as later-stage complexity.

## Exact learning route

Internal stop IDs should be stable for implementation and persistence:

`idea`, `tools`, `home`, `ask`, `build`, `check`, `live`, `improve`.

| Stop | Learner action in the Willow Fix Day case | Concept taught | Playbook output |
| --- | --- | --- | --- |
| **1. Idea** | Turn the rough note into one person, one result, one complete path, trusted facts, and a “later” list | A first version is the smallest complete useful journey, not the longest feature list | First-version brief + safe-project filter |
| **2. Tools** | Compare the two starting lanes, choose the repository lane for the case, and connect the three roles | Tools differ, but workspace → project home → host is durable | Tool plan + selection questions |
| **3. Project home** | Assemble the folder, `README.md`, approved facts, `.gitignore`, Git history, and GitHub copy in a visible file tree | Files, Git, GitHub, commits, differences, and secrets have distinct jobs | Setup checklist + plain-language glossary |
| **4. Ask AI** | Compare “make me a beautiful site” with a bounded planning request, then assemble the useful request | Context, limits, approval points, and proof of done are more useful than magic wording | Planning request + one-change request |
| **5. Build** | Watch one small cycle: inspect → plan → approve → change → run → compare → save; then order the next cycle | AI work becomes manageable in small observable slices | Build-loop card + return-report template |
| **6. Check** | Find an unsupported promise and a clipped phone contact action, reproduce the defect, write the report, inspect the change, and rerun the affected path | Looking finished, building successfully, and working for a person are different claims | Defect report + practical verification checklist |
| **7. Go live** | Move one exact saved version from local to preview to live; test the public link and select a recovery version | Local, preview, and live are different environments; publication is a reversible human decision | Launch and recovery checklist |
| **8. Improve** | Evaluate a request for registration accounts, postpone the unnecessary system, and make one evidence-backed content improvement | Feedback begins a new small loop; iteration is not a rebuild | Seven-day starter plan + complete Playbook |

### Stop 1: canonical first-version brief

```text
Person and situation:
Problem now:
Useful result:
Smallest complete path:
Trusted facts or sources:
Not in the first version:
Does the finished product need AI? Why or why not?
How we will check it:
```

The interaction moves tempting extras—registration, accounts, live inventory, payments, and chat—into a visible **Later** area. The consequence is a shorter project map with fewer systems to operate.

### Stop 2: canonical tool plan

```text
AI workspace:
Project home:
Preview / public host:
Why this lane fits:
Before starting, check: ownership/export, privacy, cost limits,
version history, supported platform, and recovery
```

Tool selection must be based on constraints, not a winner badge or popularity claim.

### Stop 3: canonical project home

Minimum visible files:

```text
willow-fix/
├── README.md          purpose, setup, checks, limitations
├── brief.md           agreed first version
├── facts.md           approved event facts
├── src/               project files
├── public/            intentionally used assets and credits
└── .gitignore         generated, local, and secret-bearing files not to save
```

Teach these distinctions in the moment:

- **Project folder:** the files on this computer.
- **Git:** saves named versions and shows what changed.
- **Repository:** the files plus Git history.
- **GitHub:** a remote place to store, share, and review that repository.
- **Commit:** one named saved version of a coherent change.
- **Difference/diff:** what was added, removed, or edited.

Secrets, real user exports, database dumps, and private logs never enter the repository. If a key leaks, revoke or rotate it; deleting a file is not enough.

### Stop 4: canonical AI requests

Planning request:

```text
First, inspect and plan. Do not change files yet.
Goal:
Use these trusted files:
First-version path:
Keep out of scope:
Ask before:
Done means:
Return: assumptions, proposed steps, likely files, checks, and open questions.
```

One-change request:

```text
Make only this agreed change:
Preserve:
Do not add:
Run these checks:
Ask before any external or hard-to-reverse action.
Return: changed files, actual check results, assumptions, and remaining gaps.
```

The learner must see why each line changes the resulting plan. Do not teach prompt length as quality.

### Stop 5: canonical build loop

> **Ask → inspect the plan → approve one slice → inspect the changes → run it → check the human path → save a named version**

The interface shows three synchronized surfaces:

- the AI conversation and stated plan;
- the files and highlighted differences; and
- the running preview.

AI’s summary is labelled **reported by AI** until the learner observes the files or result. Saving a version records a state; it does not prove that state is correct.

### Stop 6: canonical defect and check templates

```text
Observed:
Steps to reproduce:
Expected:
URL / environment / saved version:
Evidence:
Must preserve:
After the change, rerun:
```

Practical checks:

1. Does content match the trusted source?
2. Can the intended person complete the main path?
3. Does it work at phone and desktop sizes?
4. Can it be used by keyboard, with visible focus and clear labels?
5. What happens with missing, long, invalid, slow, or failed input where relevant?
6. What exactly changed, including packages, permissions, configuration, and network calls?
7. Which named version was checked, and what remains untested?

### Stop 7: canonical launch record

```text
Exact saved version:
Production build result:
Preview link and check result:
Known limitations:
Human approval for this version and access level:
Public link and live-path result:
Recovery version and procedure:
```

Teach:

- **Local** runs on the builder’s computer.
- **Preview** is a hosted candidate for checking and sharing privately.
- **Live** is the public or intended audience version.

The learner approves a simulated publication only after seeing version, results, limitations, and recovery. A successful deployment is followed by a public-path check.

### Stop 8: canonical next-week plan

```text
Day 1: Write the first-version brief and trusted facts.
Day 2: Choose the tool lane and create the project home.
Day 3: Ask for a plan; resolve assumptions before edits.
Day 4: Build the smallest complete path in small saved slices.
Day 5: Check source, phone, keyboard, errors, and exact changes.
Day 6: Test a hosted preview and record limitations and recovery.
Day 7: Publish one approved version, test the live link, and choose one improvement.
```

## Interaction and presentation grammar

Every learning screen uses the same order:

1. **Outcome:** “At this stop, you will…”
2. **Explanation:** no more than roughly 60–75 words before interaction.
3. **Worked example:** the current Willow Fix Day state.
4. **One action:** construct, compare, sort, reveal, inspect, or revise.
5. **Visible consequence:** the project, file tree, preview, or route changes.
6. **Takeaway:** a reusable artifact is added to the Playbook.
7. **Optional depth:** “Why this matters” and “When you may need more.”

Presentation requirements:

- One dominant primary action per viewport.
- Persistent, plain-language status: current stop, what is being made, and the next action.
- Back and edit remain available; revising is normal, not a penalty.
- Any drag interaction also has buttons and keyboard controls.
- Feedback says **what changed, why it matters, and what to do next**.
- Avoid scores, streaks, mastery labels, quiz theatrics, and professional-sounding distractors.
- Avoid a dashboard of choices on arrival. The route is orientation, not navigation homework.
- Use the editorial Pentimento visual identity, but literal instruction always precedes metaphor.
- Technical details open in context; they are not a separate glossary wall.

### First AI Build Playbook

The Playbook is always available and grows visibly after each stop. Each entry contains:

- when to use it;
- the exact action or template;
- the completed Willow Fix Day example;
- a blank reusable version;
- the result it should produce; and
- the failure it helps prevent.

Learners may copy or print the complete Playbook at any time. Core guidance is never locked behind correct answers or completion.

## Core and optional content

### Core authored experience

- The opening, role map, two starting lanes, and full eight-stop route.
- All Willow Fix Day facts, files, AI messages, changes, defects, checks, and releases.
- The Playbook, templates, system-need guide, safety guidance, and seven-day plan.
- Deterministic consequences, hints, and final summary.
- A complete path without login, API key, model availability, or network access after load.

### Optional depth

- Product examples within a role category, clearly labelled as examples rather than rankings.
- Expanded explanations of Git commands, build logs, hosting settings, or accessibility checks.
- “Try it with your idea” fields.
- A GPT‑5.6 Teaching Mirror.

Optional content must not interrupt the main route or contain knowledge required to understand a later core step.

## GPT‑5.6 boundary

GPT‑5.6 is an optional **Teaching Mirror**, not the curriculum, project generator, grader, or source of truth.

After the learner writes a brief for their own idea, the model may return:

- unresolved assumptions phrased as questions;
- systems the idea may be adding and why they create work;
- a suitable tool-role category with explicit tradeoffs;
- candidates to postpone from the first version; and
- a structured seven-day practice plan.

The model must not:

- change route progression or determine correctness;
- rank brands or claim current product capabilities without maintained sources;
- generate or execute a real project;
- publish, create accounts, access repositories, or take external actions;
- request an API key from the learner; or
- present inferred risks or recommendations as facts.

Implementation requirements:

- Keep the OpenAI credential server-side.
- Validate input length and structure; tell learners not to enter secrets or personal data.
- Explain before sending that their entered brief will leave the browser.
- Use structured output and render it as untrusted text.
- Label the result as AI-assisted reflection.
- Provide an authored fallback and blank templates on refusal, timeout, limit, missing key, or invalid response.
- Never make model availability a completion requirement.

## Accessibility, responsiveness, and persistence

### Accessibility

- Semantic heading order, landmarks, lists, forms, buttons, and links.
- Every control has an accessible name and visible focus.
- Full keyboard completion with logical focus movement after each transition.
- Status feedback announced without stealing focus.
- No meaning conveyed by color, position, animation, or drag alone.
- Text alternative for every visual map, file tree, version timeline, and layer reveal.
- Reduced-motion behavior preserves understanding.
- WCAG AA contrast for text, controls, focus, and state indicators.
- Touch targets at least 44 × 44 CSS pixels where practical.
- Usable at 200% zoom and at 320, 390, 768, and desktop widths without task-blocking horizontal scrolling.
- Copy, reveal, sort, and timeline interactions each have a non-pointer equivalent.

### Persistence

- Use a versioned V3 local progress record.
- Save the exact stop, substep, constructed artifacts, open optional panels, hints used, and learner-entered drafts after meaningful actions.
- On return, show: “You were at **[stop]**, working on **[artifact]**. Next: **[specific action]**.”
- Resume focuses the restored task; restart requires confirmation and states what will be removed.
- V2 progress must never be silently interpreted as V3. Show a brief curriculum-change notice and start V3 cleanly after confirmation.
- Invalid or partial storage falls back safely without a blank or impossible state.
- Learner-entered text remains local unless they explicitly invoke the Teaching Mirror.

## Beginner acceptance criteria

V3 is ready only when all are true:

### Orientation

- Within 20 seconds, a first-time visitor can say that Pentimento teaches how an AI-built project goes from idea to live link.
- Before the first decision, the learner knows the time, safety boundary, case, route, and final takeaway.
- The first interactive task has one obvious action and no unexplained prerequisite.

### Understanding and transfer

- After Tools, the learner can distinguish AI workspace, project home, and host and can describe both starting lanes.
- After Project home, the learner can distinguish folder, Git, repository, GitHub, commit, and secret.
- After Ask AI, the learner can improve a vague request using goal, context, boundaries, approval points, and checks.
- After Build, the learner can state the ask → inspect → run → check → save loop without a branded term.
- After Check, the learner can produce a reproducible defect report and name what a build or screenshot does not prove.
- After Go live, the learner can distinguish local, preview, and live and name the tested version and recovery path.
- The final Playbook is useful without replaying the course and contains every canonical template in this document.

### Experience

- No core screen asks more than one new decision at once.
- No core explanation exceeds 75 words before an example or action without an explicit learner-controlled expansion.
- Every new technical term is defined at first meaningful use.
- Wrong or incomplete work is revisable and produces specific guidance, not a dead end.
- The whole journey can be completed without GPT‑5.6, an account, an API key, or a real external action.
- Exact mid-stop progress survives refresh on desktop and mobile.
- Keyboard-only and reduced-motion journeys complete successfully.

### Validation

- Moderated testing with at least five people matching the primary audience: four of five independently explain the product after the opening and complete the first two stops without facilitator instruction.
- At least four of five correctly order the lifecycle and choose a justified starting lane at the end.
- No participant encounters a blocking accessibility issue at 320px, 200% zoom, or by keyboard.
- Automated tests cover route progression, exact persistence, V2 handling, Playbook generation, optional-model fallback, and the complete desktop/mobile journey.

## Content quality gate

Every instructional item must pass all six checks:

1. **Use moment:** says when the learner would use it.
2. **Action:** gives an exact, executable next step.
3. **Example:** shows the completed Willow Fix Day version.
4. **Reuse:** supplies a blank or adaptable version.
5. **Observable result:** says what the action should produce.
6. **Prevention:** names the mistake, risk, or wasted work it prevents.

Additional editorial gates:

- A sentence must change a decision, action, mental model, or interpretation of evidence; otherwise remove it.
- Literal meaning comes before metaphor, and plain language before jargon.
- Advice must show tradeoffs or conditions; avoid “always use” claims unless the safety rule is genuinely universal.
- Brand-specific examples must be secondary, time-stamped when needed, and never treated as the durable lesson.
- Do not describe a vendor as best, easiest, most powerful, or universally beginner-friendly.
- Separate trusted facts, learner observations, AI reports, and inferences in both copy and visuals.
- Prompts are taught as work specifications, not magic incantations.
- Examples remain internally consistent across brief, facts, files, preview, checks, and release.
- Never invent proof: “saved,” “built,” “previewed,” “published,” and “works” are distinct states.
- Safety guidance must be concrete: what not to expose, where a secret belongs, and what to do after leakage.
- Copy must be reviewed by reading only the headings, actions, and takeaways; that reduced path should still tell a coherent story.

## Out of scope for V3

- A real code editor, terminal, repository connection, or deployment service.
- Automatic project creation or autonomous external action.
- A broad catalog or leaderboard of AI products.
- Coding syntax instruction.
- Accounts, social features, cohorts, certificates, scores, or competitive gamification.
- Claims that one short experience establishes mastery.
- Multiple full case studies before the primary journey is complete.

## Release decision

V3 replaces the current mission architecture rather than adding another onboarding layer. Existing visual identity and well-tested interaction infrastructure may be reused, but old chapter structure, assessment mechanics, confidence scoring, and release-ledger ceremony must not determine the new route.

The implementation is successful when the experience answers, in order:

> **What is this? → Where do I start? → What does each tool do? → What should I ask? → What changed? → How do I know it works? → How does it become live? → What do I do next?**
