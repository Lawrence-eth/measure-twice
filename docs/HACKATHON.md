# Pentimento — OpenAI Build Week submission pack

Category: **Education**

Submission deadline: **July 21, 2026 at 5:00 PM Pacific** (**July 22 at
8:00 AM GMT+8**).

The Official Rules, Devpost form, and notices on
[openai.devpost.com](https://openai.devpost.com) are the source of truth. This
file contains submission-ready copy for the Pentimento v5 candidate; every TBD
must be resolved against the exact final commit and deployment before
submission.

## Devpost summary

**Project name:** Pentimento

**Tagline:** AI can make it look finished. Learn to make it trustworthy.

**Category:** Education

**Audience:** Complete beginners who have an idea but no reliable mental model
for AI coding tools, project files, version history, checking, hosting, or
release.

**Experience:** An authored 15-minute interactive field guide with a Reveal
opening, four chapters, eight stops, 13 consequential decisions, and an
explicit Playbook-note checkpoint after each stop.

**Target public experience:**
[pentimento.law-ender.chatgpt.site](https://pentimento.law-ender.chatgpt.site)
— native ChatGPT Sites address; the v5 candidate must be verified there before
this copy is submitted.

**Repository:** [github.com/Lawrence-eth/measure-twice](https://github.com/Lawrence-eth/measure-twice)

## Final project description

> Pentimento is a 15-minute interactive field guide for complete beginners who
> want to build with AI but do not know what happens between a prompt and a
> trustworthy release. Instead of teaching coding syntax, prompt tricks, or a
> ranking of products, it teaches the durable human decisions beneath every
> tool: define a supportable promise, keep custody of the work, control AI
> changes, demand evidence, and preserve recovery.
>
> The opening first presents a polished AI-made event page and asks the learner
> to try its only important action. It fails. A raking-light Reveal exposes four
> hidden layers: promise, project home, evidence, and release. The learner
> then guides the Willow Fix Day page through four chapters, eight stops, and 13
> consequential decisions: shape one supportable first version, choose a tool
> route, create a recoverable project home, direct AI with a bounded plan,
> inspect a build, discover and repair a failed visitor path, release one
> checked version, and improve it from a trusted source. After each stop,
> successful feedback remains visible until the learner inspects and saves its
> reusable Playbook note. The eight stop-level notes accumulate into the
> existing five-card take-home Playbook.
>
> A persistent canvas switches between the visitor surface and the project
> underneath, so scope, files, prompts, evidence, defects, versions, and
> recovery never disappear behind polish. A five-card Field Guide is available
> throughout. The core lesson is authored, deterministic, and key-free.
> Completion offers a four-step Teaching Mirror. The Mirror
> creates a complete, copyable V1 brief locally before offering a separate,
> explicitly optional GPT-5.6 reflection. That bounded reflection returns one
> strength, two unresolved questions, one feature to postpone, one route
> tradeoff, and three next moves. It cannot grade the learner, control lesson
> progress, access files or accounts, build a project, publish, or perform any
> external mutation. Codex was the primary implementation collaborator across
> curriculum refinement, typed state, interface development, accessibility,
> testing, and release preparation.

## Why this belongs in Education

Pentimento teaches judgment, not button sequences. Its learner leaves with a
transferable way to scope a useful first version, separate tool roles, protect
recoverable work, direct AI in reviewable steps, distinguish claims from
evidence, repair an observed failure, publish an exact checked version, and
update the source before the surface. The simulation is the practice
environment; the Field Guide, saved Playbook notes, and locally generated V1 brief
let the learner apply
the method to any later project or AI workspace.

The required route is deliberately small:

| Stop | Consequential decisions | Learning move |
| --- | ---: | --- |
| First version | 1 | Choose one person and one complete, supportable path |
| Tools | 1 | Choose a faster hosted route or more transferable repository route |
| Project home | 2 | Preserve the work and separate build-time AI from runtime AI |
| Ask AI | 2 | Request a plan, inspect it, and approve one shown step |
| Build | 1 | Move from an AI claim toward human-path evidence |
| Check | 3 | Try the path, make the smallest repair, and retry it |
| Go live | 2 | Select the checked version and repeat the path publicly |
| Improve | 1 | Update the trusted source before the page |
| **Total** | **13** | **First version → checked release → source-backed improvement** |

## Public judge testing instructions

Use this copy only after the final v5 candidate is verified at the public URL:

> Open https://pentimento.law-ender.chatgpt.site in a current desktop or mobile
> browser. No account, API key, installation, or real deployment is required.
> First select **Test the only important action**, observe the failure, and use
> **Reveal the project underneath**. Then select **Learn the method that catches
> this**. **See exactly what you will learn** is an optional four-chapter
> overview ending with **Start with the first promise**. Follow either tool route through
> all eight stops. After each correct stop, inspect the consequence and Playbook
> note before saving the layer. The persistent **Field guide** remains available
> beside the task. In **Check**, try
> the contact action, choose the bounded repair, and try the repaired action
> again—the retry is required. In **Go live**, choose checked V4 instead of the
> polished but untested V3, then repeat the path at the simulated public
> address. At completion, open any card in the **5-card Playbook**, then select
> **Shape my own V1 brief**. The four-step Teaching Mirror creates a complete,
> copyable brief on the device before any optional reflection request. The core
> route remains usable when live model access is unavailable.
>
> All Willow Fix Day people, addresses, versions, URLs, email actions, releases,
> and repository actions are fictional or simulated. Pentimento does not send
> email, create an account, change a repository, publish a website, or otherwise
> mutate an external system. Progress and the unfinished brief are saved only
> in this browser unless the learner explicitly requests the optional,
> read-only teaching reflection.

Local fallback:

~~~bash
npm install
npm run dev
~~~

Open http://localhost:3000 with Node.js 22 or newer. The core route, Field Guide,
local V1 brief, and deterministic reflection fallback require no credential.

## Under-three-minute demo script

Target **2:45–2:55**. Use original narration and interface footage. Do not show
credentials, personal information, private tabs, copyrighted music, or
third-party trademarks.

### 0:00–0:18 — the beginner problem

**Show:** The polished generated preview. Select **Test the only important
action**, observe the failure, and begin the raking-light Reveal.

**Say:** “AI can make a page look finished before a beginner has defined its
promise, kept custody of its files, tested its important path, or named the
released version. Pentimento turns those hidden responsibilities into a
15-minute field lesson.”

### 0:18–0:45 — scope and tool roles

**Show:** Reveal Promise, Project home, Evidence, and Release; then choose
the smallest supportable path in First version and save its Playbook note.

**Say:** “The screen is the surface. Building means directing and checking
everything underneath it. Four chapters turn 13 consequential decisions into
reusable Playbook notes. First, the learner narrows the promise. Then tools get
clear jobs: AI helps build, the project home remembers, and the host
publishes.”

### 0:45–1:10 — direct AI and collect evidence

**Show:** Switch the persistent canvas between **Visitor surface** and
**Project underneath**, open the Field Guide, then approve the Ask AI work
agreement and inspect its checkpoint.

**Say:** “A useful request gives AI trusted facts, a Not now boundary, a finish
line, and permission for one shown step. Correct choices do not disappear:
the learner inspects what changed, when to reuse the rule, and what failure it
prevents before saving the Playbook note. An AI completion message is only the
first evidence level.”

### 1:10–1:38 — fail, repair, retry

**Show:** Activate the broken contact action, apply the bounded repair, and
activate it again.

**Say:** “Pentimento does not announce the defect. The learner observes the
failure, preserves working decisions, asks for the smallest repair, and repeats
the same path. The fictional email target is simulated; no email is opened or
sent.”

### 1:38–1:58 — release and improve

**Show:** Select checked V4, perform the simulated public-path check, then
update the approved source before the page.

**Say:** “A finished deployment is weaker evidence than a working public path.
The release card keeps the exact version and recovery version visible. A later
fact change starts at its trusted source and creates a new layer without
erasing the checked one.”

### 1:58–2:20 — transfer the method

**Show:** Completion, the route-specific Start today card, and the same
five-card Field Guide that was available during the route.

**Say:** “The Field Guide is not a completion reward. It stays beside the
current task and gives the learner five milestone cards, proof standards, and
copyable templates to use with their own AI workspace.”

### 2:20–2:48 — Codex and GPT-5.6

**Show:** Create the local V1 brief first, then show the optional reflection
boundary and a real GPT-5.6 result only if live mode is actually enabled.

**Say:** “Codex was our primary implementation collaborator. It helped turn the
beginner problem into a typed eight-stop curriculum, implement the responsive
React experience and bounded API, and build the state, accessibility, browser,
and deployment tests. I retained the audience, educational method, product,
and design decisions. GPT-5.6 has one deliberate teaching role after the local
artifact already exists: an optional structured reflection with one strength,
two open questions, one feature to postpone, one route tradeoff, and three next
moves. It never grades, generates the project, controls progression, accesses
accounts, publishes, or takes an external action.”

### 2:48–2:55 — close

**Show:** The completed canvas switching from the visitor surface to its saved
underlayers.

**Say:** “Pentimento teaches first-time builders to look beneath AI polish and
direct a release they can explain, test, and recover.”

If production is using the authored fallback, label it as the fallback in the
video; do not describe authored output as a live GPT-5.6 response. A live
recording may use a locally configured server-only key, but no credential may
appear in the footage.

## Judging-criteria mapping

| Criterion | Evidence to show |
| --- | --- |
| **Technological Implementation** | Typed and validated progress with exact substep restoration; two route-dependent curricula; 13 consequential decisions plus explicit Playbook-note checkpoints; a persistent surface/underlayers canvas; a bounded server-only reflection endpoint with structured input/output and deterministic fallback; unit, API, responsive browser, accessibility, Worker, and hosted-runtime verification paths. The README documents how Codex shaped and accelerated the implementation. |
| **Design** | An interactive Reveal that proves the problem before explaining it; four chapters across eight stops; successful feedback that remains visible until the learner saves the artifact; a persistent Field Guide; useful wrong-choice consequences; mobile/desktop layouts; native controls, managed focus, reduced-motion support, and a literal pentimento that preserves earlier decisions. |
| **Potential Impact** | A specific audience—people with an idea and no AI-building mental model—and a specific risk: polished output without ownership, evidence, or recovery. Learners finish with reusable rules, route-specific next actions, templates, and their own local V1 brief. |
| **Quality of the Idea** | A full idea-to-release education experience rather than a coding course, prompt library, tool ranking, or project generator. It separates build-time AI from runtime AI, makes evidence levels tangible, requires a fail → repair → retry loop, and uses earlier visible layers as the core teaching metaphor. |

## Submission and release checklist

### Repository and README

- [x] Repository URL is included.
- [x] MIT license is included.
- [x] README explains the audience, education problem, Reveal, four chapters,
  eight stops, 13 decisions plus Playbook-note checkpoints, persistent Field
  Guide, Teaching Mirror boundary, local setup, verification commands,
  deployment path, privacy, and Codex collaboration.
- [x] Confirm the final repository is public with relevant licensing, or share a
  private repository with both testing@devpost.com and
  build-week-event@openai.com.
- [x] Confirm the Devpost repository URL resolves for a signed-out judge.
- [x] Freeze and record the exact final v5 commit and release/version metadata.

### Public experience

- [x] Deploy the final verified v5 artifact to
  pentimento.law-ender.chatgpt.site.
- [x] Run the full hosted desktop/mobile suite against that exact artifact.
- [x] Verify the Reveal, four chapters, eight-stop route, 13 decisions,
  Playbook-note checkpoints, persistent Field Guide, two canvas lenses, local V1
  brief, optional reflection boundary, restart, keyboard path, focus,
  reduced-motion behavior, and narrow layouts.
- [x] Record the final Sites version/deployment, hosted test result, date, and
  rollback target in docs/BUILD_LOG.md.
- [x] Confirm whether the submitted deployment uses live GPT-5.6 or the
  deterministic fallback, and describe it accurately.

### Devpost

- [x] Select **Education**.
- [ ] Paste the final project description.
- [ ] Paste the verified public testing instructions.
- [ ] Add the repository URL and public experience URL.
- [ ] Upload a public YouTube video shorter than three minutes.
- [ ] Confirm the video audio explicitly explains how Codex and GPT-5.6 were
  used.
- [ ] Add the primary project thread’s /feedback Session ID.
- [ ] Submit before the deadline and capture the confirmation.

## Values that must remain TBD until verified

Do not invent or copy v3/v4 release values into the final v5 form. Historical
values remain in [BUILD_LOG.md](BUILD_LOG.md).

| Field | Final value |
| --- | --- |
| Public YouTube demo URL | **TBD — entrant uploads and verifies public visibility** |
| Primary Codex /feedback Session ID | **TBD — entrant obtains it from the primary build thread** |
| Exact final v5 deployed source | `0ac40c9b7f08acafa687322cd4d4188785f03f44` |
| Final Sites deployment version | Version 4 · deployment `appgdep_6a5cf7cfa3e081919637286b10e33854` |
| Hosted v5 acceptance result and timestamp | PASS · 30/30 local desktop/mobile Chromium checks plus 5/5 hosted critical-path checks · July 19, 2026 16:15 UTC |
| Rollback version confirmed for final release | Sites version 3 · `84304ce0440ff6ab2a606b4902b4dfe197203b6e` |
| Production reflection mode and evidence | Deterministic demo fallback · no Sites runtime environment entries · hosted endpoint returned `mode: "demo"` with the required 2 questions and 3 next moves |
| Repository public-access or private-sharing confirmation | Public signed-out request returned `200`; MIT license visible |
| Devpost submission confirmation | **TBD — entrant submits and records it** |

The primary build thread's /feedback Session ID and the public YouTube URL are
entrant-controlled requirements. They cannot be inferred from source code,
deployment metadata, or an earlier Codex session.
