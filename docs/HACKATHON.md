# Pentimento — OpenAI Build Week submission pack

Category: **Education**

Submission deadline: **July 21, 2026 at 5:00 PM Pacific** (**July 22 at
8:00 AM GMT+8**).

The Official Rules, Devpost form, and notices on
[openai.devpost.com](https://openai.devpost.com) are the source of truth. This
file contains submission-ready copy for the final Pentimento v4 release; every
TBD must be resolved before submission.

## Devpost summary

**Project name:** Pentimento

**Tagline:** Learn how to build a project with AI. From rough idea to checked
release.

**Category:** Education

**Audience:** Complete beginners who have an idea but no reliable mental model
for AI coding tools, project files, version history, checking, hosting, or
release.

**Experience:** An authored 12–15 minute guided simulation with eight stops and
exactly 13 meaningful interactions.

**Target public experience:** [pentimento.aethe.me](https://pentimento.aethe.me)
— verified v4 production release.

**Repository:** [github.com/Lawrence-eth/measure-twice](https://github.com/Lawrence-eth/measure-twice)

## Final project description

> Pentimento is an interactive education experience for complete beginners who
> want to build with AI but do not know where to start. Instead of teaching
> coding syntax, prompt tricks, or a ranking of products, it gives learners a
> durable map: an AI workspace helps build, a project home remembers, and a host
> publishes.
>
> The learner guides one fictional Willow Fix Day event page through eight
> focused stops and exactly 13 meaningful interactions: shape one supportable
> first version, choose a tool route, create a recoverable project home, direct
> AI with a bounded plan, inspect a build, discover and repair a failed visitor
> path, release one checked version, and improve it from a trusted source. Every
> choice changes a persistent project canvas and leaves behind a reusable rule
> or artifact. The visual idea comes from a pentimento—earlier layers remain
> visible beneath the finished work—so scope, files, prompts, evidence, defects,
> versions, and recovery never disappear behind a polished screen.
>
> The core lesson is authored, deterministic, and key-free. Completion unlocks
> a five-card Build-with-AI Playbook and a four-step Teaching Mirror. The Mirror
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
environment; the Playbook and locally generated V1 brief let the learner apply
the method to any later project or AI workspace.

The required route is deliberately small:

| Stop | Meaningful interactions | Learning move |
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

Use this copy only after the final v4 candidate is verified at the public URL:

> Open https://pentimento.aethe.me in a current desktop or mobile browser. No
> account, API key, installation, or real deployment is required. Select
> **Start with the first decision**; **See the 8-stop journey** is an optional
> overview. Follow either tool route through all eight stops. In **Check**, try
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

Open http://localhost:3000 with Node.js 22 or newer. The core route, Playbook,
local V1 brief, and deterministic reflection fallback require no credential.

## Under-three-minute demo script

Target **2:45–2:55**. Use original narration and interface footage. Do not show
credentials, personal information, private tabs, copyrighted music, or
third-party trademarks.

### 0:00–0:18 — the beginner problem

**Show:** Welcome, the promise, time, and safety boundary.

**Say:** “AI can produce a polished screen before a beginner understands where
the files live, what has actually been checked, or how that screen becomes a
recoverable public version. Pentimento teaches that missing project-building
judgment.”

### 0:18–0:45 — scope and tool roles

**Show:** Choose the smallest supportable path in First version, compare the two
Tools routes, and reveal the Project home layer.

**Say:** “The learner guides one fictional event page through eight stops and
exactly 13 useful interactions. Tools may change, but the responsibilities stay
clear: AI helps build, the project home remembers, and the host publishes. AI
used during development does not mean this simple finished page needs a model
or API key at runtime.”

### 0:45–1:10 — direct AI and collect evidence

**Show:** Ask AI, approve step one, then open the Build preview and evidence
ladder.

**Say:** “A useful request gives AI trusted facts, a Not now boundary, a finish
line, and permission for one shown step. An AI completion message is only the
first evidence level: the learner still needs changed files, a preview, a human
path, and eventually the public path.”

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

**Show:** Completion, the route-specific Start today card, and one of the five
Playbook cards.

**Say:** “Completion turns the lesson into action: a tailored first three
moves, five milestone cards, proof standards, and copyable templates. The
learner opens only the card needed beside their own AI workspace.”

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

**Show:** The completed canvas with earlier layers visible.

**Say:** “Pentimento helps a first-time builder move from a rough idea to a
checked release they can explain, test, and recover.”

If production is using the authored fallback, label it as the fallback in the
video; do not describe authored output as a live GPT-5.6 response. A live
recording may use a locally configured server-only key, but no credential may
appear in the footage.

## Judging-criteria mapping

| Criterion | Evidence to show |
| --- | --- |
| **Technological Implementation** | Typed and validated v4 progress with exact substep restoration; two route-dependent curricula; a persistent eight-layer canvas; a bounded server-only reflection endpoint with structured input/output and deterministic fallback; unit, API, responsive browser, accessibility, Worker, and hosted-runtime verification paths. The README documents how Codex shaped and accelerated the implementation. |
| **Design** | A literal beginner promise and one primary action; one consequential task at a time; a visual pentimento that preserves earlier decisions; useful wrong-choice consequences; mobile/desktop layouts; native controls, managed dialog focus, reduced-motion support, and a five-card Playbook that reveals one milestone at a time. |
| **Potential Impact** | A specific audience—people with an idea and no AI-building mental model—and a specific risk: polished output without ownership, evidence, or recovery. Learners finish with reusable rules, route-specific next actions, templates, and their own local V1 brief. |
| **Quality of the Idea** | A full idea-to-release education experience rather than a coding course, prompt library, tool ranking, or project generator. It separates build-time AI from runtime AI, makes evidence levels tangible, requires a fail → repair → retry loop, and uses earlier visible layers as the core teaching metaphor. |

## Submission and release checklist

### Repository and README

- [x] Repository URL is included.
- [x] MIT license is included.
- [x] README explains the audience, education problem, eight stops, exact
  13-interaction route, five-card Playbook, Teaching Mirror boundary, local
  setup, verification commands, deployment path, privacy, and Codex
  collaboration.
- [x] Confirm the final repository is public with relevant licensing, or share a
  private repository with both testing@devpost.com and
  build-week-event@openai.com.
- [x] Confirm the Devpost repository URL resolves for a signed-out judge.
- [x] Freeze and record the exact final v4 commit and release tag.

### Public experience

- [x] Deploy the unchanged final v4 artifact to pentimento.aethe.me.
- [x] Run the full hosted desktop/mobile suite against that exact artifact.
- [x] Verify the eight-stop route, 13 interactions, Playbook, local V1
  brief, optional reflection boundary, restart, keyboard path, focus,
  reduced-motion behavior, and 320px layout.
- [x] Record the final Worker/deployment version, hosted test result, date, and
  rollback version in docs/BUILD_LOG.md.
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

Do not invent or copy old v3 release values into the final form.

| Field | Final value |
| --- | --- |
| Public YouTube demo URL | **TBD — entrant uploads and verifies public visibility** |
| Primary Codex /feedback Session ID | **TBD — entrant obtains it from the primary build thread** |
| Exact final v4 commit and release tag | `3555cfdc3e28d554b11facee4028a8303d6ac603` · `pentimento-v4` |
| Final Worker/deployment version | Worker `698bc602-2f46-470e-8fe5-6c06b0eecd24` · deployment `41f90155-db69-474e-a781-5572bcfbc736` · 100% traffic |
| Hosted v4 acceptance result and timestamp | 28/28 Playwright checks passed in 1.7m · July 19, 2026 10:39 UTC |
| Rollback version confirmed for final release | `d13e8f31-5853-47fb-b5fe-9c9e8d4aeacd` (`pentimento-v3`) |
| Production reflection mode and evidence | Deterministic authored fallback; valid request returned two questions and three moves; no Worker OpenAI key installed |
| Repository public-access or private-sharing confirmation | Public signed-out request returned `200`; MIT license visible |
| Devpost submission confirmation | **TBD — entrant submits and records it** |

The primary build thread's /feedback Session ID and the public YouTube URL are
entrant-controlled requirements. They cannot be inferred from source code,
deployment metadata, or an earlier Codex session.
