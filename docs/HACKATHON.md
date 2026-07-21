# Pentimento — OpenAI Build Week submission pack

Category: **Education**

Submission deadline: **July 21, 2026 at 5:00 PM Pacific** (**July 22 at
8:00 AM GMT+8**).

The Official Rules, Devpost form, and notices on
[openai.devpost.com](https://openai.devpost.com) are the source of truth. This
file contains submission-ready copy and the latest fully verified custom-domain
release evidence. The sole submitted testing URL is the branded deployment.

## Devpost summary

**Project name:** Pentimento

**Tagline:** AI can make it look finished. Learn to make it trustworthy.

**Category:** Education

**Audience:** Complete beginners who have an idea but no reliable mental model
for AI coding tools, project files, version history, checking, hosting, or
release.

**Experience:** An authored 15-minute interactive field lesson in a
contemporary Conservation Lab. Its six-page opening moves from orientation to
an untested AI claim, a learner-produced failure, the hidden project layers,
the four-part method, and a clear view of the longer lesson. The full practice
route then continues through four chapters, eight stops, 14
consequential decisions, and an in-place lesson receipt after each stop.

**Target public experience:**
[pentimento.aethe.me](https://pentimento.aethe.me) — verified branded public
address and sole Devpost testing URL.

**Repository:** [github.com/Lawrence-eth/measure-twice](https://github.com/Lawrence-eth/measure-twice)

## Final project description

> Pentimento is a 15-minute interactive project for complete beginners who
> want to build with AI but do not know what happens between a prompt and a
> trustworthy release. Instead of teaching coding syntax, prompt tricks, or a
> ranking of products, it teaches the durable human decisions beneath every
> tool: define a supportable promise, keep custody of the work, control AI
> changes, demand evidence, and preserve recovery.
>
> The opening is six composed pages, not a dashboard of unexplained choices.
> **01 · What this is** explains the audience, the problem, and what the
> learner keeps. **02 · The claim** presents AI’s untested ready-state without
> spoiling the defect. On **03 · The test**, the learner selects **Email the
> organizer** and personally observes that the important path is broken.
> **04 · The layers** reveals Promise, Project home, Evidence, and Release;
> **05 · The method** makes Shape → Ground → Direct → Prove interactive; and
> **06 · Your lesson** shows the complete practice route before the learner
> decides whether to begin.
>
> The opening evidence persists into the lesson. Check later says **You found
> this failure earlier; now record it**, so the same failure is not restaged as
> a separate inspection. The learner then guides the Willow Fix Day page
> through four chapters, eight stops, and 14
> consequential decisions: shape one supportable first version, choose a tool
> route, create a recoverable project home, direct AI with a bounded plan,
> recognize a preview as a candidate, discover and repair a failed visitor
> path, release one checked version, and improve it from a trusted source.
> Each task becomes a concise lesson receipt in the same place after **Save
> this lesson**, so the learner
> sees the decision, its visible consequence, and the reusable rule before
> continuing. The eight receipts connect to the existing five-guide Build kit.
>
> A persistent canvas switches between **Visitor surface** and **Layers
> underneath**, so scope, files, prompts, evidence, defects, versions, and
> recovery never disappear behind polish. The compact lesson header exposes one
> **Lesson map** action, while small screens keep the project layer in a closed
> disclosure until it is useful. A five-guide **Build kit** is available
> throughout. The core lesson is authored, deterministic, and key-free.
> Completion offers a four-step **V1 brief workshop**. The workshop
> creates a complete, copyable V1 brief locally before offering a separate,
> optional reflection. Demo mode is explicitly labelled **Authored example ·
> deterministic, no live AI call**. Only a successful model request is labelled
> **GPT-5.6 reflection · live**. Either bounded result contains one
> strength, two unresolved questions, one feature to postpone, one route
> tradeoff, and three next moves. It cannot grade the learner, control lesson
> progress, access files or accounts, build a project, publish, or perform any
> external mutation. Codex was the primary implementation collaborator across
> curriculum refinement, typed state, interface development, accessibility,
> testing, and release preparation.

## What is new for Build Week

The repository began from an empty project on **July 18, 2026**, during the
submission period. All product, curriculum, code, visual design, tests, and
deployment work represented here is new hackathon work. The chronological
record in [`docs/BUILD_LOG.md`](BUILD_LOG.md) distinguishes abandoned concepts,
superseded product layers, human decisions, Codex contributions, exact commits,
and the evidence earned by each release. Earlier releases are retained as
history and rollback evidence; their test results are never used to certify a
later commit.

## AI-use boundary

The lesson’s truth, answers, consequences, progression, and release gates are
authored and deterministic. This makes the complete judge path work without an
account, an API key, or network-dependent model output.

Codex with GPT-5.6 was the primary build collaborator for curriculum
architecture, React and TypeScript implementation, responsive interaction,
accessibility, automated testing, visual QA, and release preparation. The
entrant retained the audience, pedagogy, scope, product, and design decisions.

GPT-5.6 has one bounded optional product role after the learner has already
created a complete local V1 brief. When the server is configured for live mode,
the Teaching Mirror sends only that brief and chosen route to a server-side
OpenAI Responses API call and requests schema-constrained reflection. In the
public deterministic configuration, no live model request is made and the UI
labels the result **Authored example · deterministic, no live AI call**. A
submission or recording must describe the mode it actually shows; configured
model intent is not evidence of a live call.

## Why this belongs in Education

Pentimento teaches judgment, not button sequences. Its learner leaves with a
transferable way to scope a useful first version, separate tool roles, protect
recoverable work, direct AI in reviewable steps, distinguish claims from
evidence, repair an observed failure, publish an exact checked version, and
update the source before the surface. The simulation is the practice
environment; the Build kit, saved lesson receipts, and locally generated V1
brief let the learner apply the method to any later project or AI workspace.

The required route is deliberately small:

| Stop | Consequential decisions | Learning move |
| --- | ---: | --- |
| First version | 1 | Choose one person and one complete, supportable path |
| Tools | 1 | Choose a faster hosted route or more transferable repository route |
| Project home | 2 | Preserve the work and separate build-time AI from runtime AI |
| Ask AI | 2 | Request a plan, inspect it, and approve one shown step |
| Build | 1 | Treat the preview as a candidate and hand it to a visitor-path check |
| Check | 3 | Try the path, make the smallest repair, and retry it |
| Go live | 2 | Select the checked version and repeat the path publicly |
| Improve | 2 | Update the trusted source, then target the affected reading and check |
| **Total** | **14** | **First version → checked release → source-backed improvement** |

## Implementation architecture

```text
Six-page React opening
        │ creates intro evidence
        ▼
Eight-stop deterministic lesson ──► validated local progress
        │                                  │
        ├──► five-guide Build kit          └──► exact resume / restart
        └──► local V1 brief
                    │ learner explicitly requests reflection
                    ▼
          /api/debrief ──► authored fallback
                    └────► optional GPT-5.6 structured response
```

| Layer | Responsibility | Primary files |
| --- | --- | --- |
| Experience | Six-page intro, lesson shell, project canvas, Build kit, completion, and brief workshop | `app/page.tsx`, `components/PentimentoFinal.tsx`, `app/atelier.css` |
| Curriculum | Authored stops, choices, consequences, artifacts, evidence ladder, and five guides | `lib/final-journey.ts` |
| State | Versioned progress, ordered reachability, persisted opening evidence, safe parsing, resume, and restart | `lib/final-progress.ts` |
| Optional reflection | Validated request boundary, deterministic fallback, rate limiting, hashed safety identifier, server-only credential, Responses API, and Zod structured output | `app/api/debrief/route.ts`, `lib/debrief-contracts.ts`, `lib/debrief.ts` |
| Verification | Unit/API contracts plus full responsive, keyboard, focus, persistence, reduced-motion, and Axe browser journeys | `tests/*.test.ts`, `tests/e2e/final-journey.spec.ts` |
| Delivery | Next.js source, Vinext-generated Worker artifact, and Cloudflare custom-domain runtime | `next.config.ts`, `wrangler.jsonc`, `scripts/` |

The application has no database and no account system. Core lesson state and
the unfinished brief remain in the current browser. The optional model endpoint
is read-only with respect to external systems: it cannot access a repository,
edit files, send email, create accounts, or publish.

## Public judge testing instructions

Verified public testing instructions for the v10.3 hosted release:

> Open https://pentimento.aethe.me in a current desktop or mobile
> browser. No account, API key, installation, or real deployment is required.
> Move through pages 01–06: What this is, The claim, The test, The layers, The
> method, and Your lesson. On The test, select **Email the organizer** and
> observe the failure receipt. Explore the layer and method controls, then
> select **Start: shape the promise**. **View all 8 stops** opens the optional
> lesson map. Follow either tool route through all eight stops. After each
> correct stop, select **Save this lesson**, inspect the in-place receipt and
> reusable rule, then continue. The persistent **Build kit** remains available
> beside the task. In **Check**, record the failure remembered from the opening,
> choose the bounded repair, and try the repaired action—the retry is required.
> In **Go live**, choose checked
> V4 instead of the polished but untested V3, then repeat the path at the
> simulated public address. At completion, open any guide in the **Build kit**,
> then select
> **Create my V1 brief**. The four-step workshop creates a complete,
> copyable brief on the device before any optional reflection request. The core
> route remains usable when live model access is unavailable. If reflection is
> shown, read the visible authored/live mode label aloud.
>
> All Willow Fix Day people, addresses, versions, URLs, email actions, releases,
> and repository actions are fictional or simulated. Pentimento does not send
> email, create an account, change a repository, publish a website, or otherwise
> mutate an external system. Progress and the unfinished brief are saved only
> in this browser unless the learner explicitly requests the optional,
> read-only teaching reflection.

Local fallback:

~~~bash
npm ci
npm run dev
~~~

Open http://localhost:3000 with Node.js 22 or newer. The core route, Build kit,
local V1 brief, and deterministic reflection fallback require no credential.

## Under-three-minute demo script

Target **2:35–2:50**. The visual recording stays entirely within the six-page
opening; the audio explains the larger working lesson and the build process.
Use original narration and interface footage. Do not show credentials, personal
information, private tabs, copyrighted music, or third-party trademarks.

Recommended recording setup:

- use the verified public URL in a clean browser window at 100% zoom;
- clear Pentimento site storage first so the test begins in its unobserved
  state;
- record at 1080p and 60 fps when available;
- use one in-page next action per transition and allow each page to settle
  before narrating its detail;
- keep the cursor still while text is being read, then make one deliberate
  selection at a time; and
- confirm the final export is public on YouTube, shorter than three minutes,
  audible without headphones, and legible at normal playback speed.

### 0:00–0:25 — 01 · What this is

**Show:** Start at the top. Let the title, one-sentence outcome, time,
experience level, and five reusable tools become readable before advancing.

**Say:** “AI can make a project look finished before a first-time builder knows
what to decide or test. Pentimento is a guided field lesson about the judgment
between an AI preview and a release you can explain, test, and recover.”

### 0:25–0:47 — 02 · The claim

**Show:** Advance once and hold on the finished-looking Willow Fix Day project
and its AI-ready state.

**Say:** “A polished preview proves appearance. It does not prove that the
visitor’s important action works, that the files are recoverable, or that the
checked version is the one that went live.”

### 0:47–1:12 — 03 · The test

**Show:** Advance once, select **Email the organizer**, then pause on the full
observed-failure receipt.

**Say:** “Here the learner acts before the lesson explains. No email opens
because the button has no address. That click becomes evidence, and Pentimento
remembers it for the later repair lesson. Nothing is actually sent.”

### 1:12–1:42 — 04 · The layers

**Show:** Advance once. Select **Project home**, **Evidence**, and **Release**;
pause briefly on the decision and artifact for each.

**Say:** “The finished surface hides four responsibilities: one supportable
promise, a project home with recoverable history, human-path evidence, and an
exact release with a recovery version. Products can combine roles; the
responsibilities do not disappear.”

### 1:42–2:12 — 05 · The method

**Show:** Advance once. Move deliberately through Shape, Ground, Direct, and
Prove, ending on **Prove**.

**Say:** “Prompting is one move. Direction is the skill: Shape one complete
result. Ground the files and history. Direct AI with a boundary, evidence, and
a stopping point. Prove the important path on the exact version that is live.”

### 2:12–2:38 — 06 · Your lesson

**Show:** Advance once. Let the four-chapter, eight-stop route and five-tool
Build kit settle. Do not start the long-form lesson.

**Say:** “The full experience turns this method into eight consequential
stops—from first promise to checked release and source-backed improvement. The
learner keeps a V1 brief, tool map, AI work agreement, evidence ladder, and
release card.”

### 2:38–2:50 — implementation close

**Show:** Keep the final landing page visible and still; end on the title or
four-chapter route rather than switching to unrelated footage.

**Say:** “Codex with GPT-5.6 was my primary collaborator across curriculum,
typed state, responsive interaction, accessibility, testing, and release
preparation. GPT-5.6 also powers the optional bounded Teaching Mirror after the
local brief exists. This public demo uses the authored no-live-call mode, so
judges need no key. Pentimento teaches people to look beneath AI polish.”

If the recorded deployment visibly reports **GPT-5.6 reflection · live**, the
last two sentences may instead say: “The optional Teaching Mirror uses GPT-5.6
for a bounded reflection after the local brief exists. It cannot grade,
publish, access files, or control progression.” Never describe an authored
result as a live model response. The source repository and `/feedback` Session
ID provide the separate implementation record required by the hackathon.

## Judging-criteria mapping

| Criterion | Evidence to show |
| --- | --- |
| **Technological Implementation** | Typed and validated progress with exact restoration and persisted opening evidence; adaptive root-scroll folios; two route-dependent branches; 14 consequential decisions plus in-place lesson receipts; a responsive Visitor surface/Layers underneath canvas; an explicit authored/live reflection endpoint with structured input/output and safe fallback; unit, API, responsive browser, accessibility, performance, Worker, and hosted-runtime verification paths. |
| **Design** | Six deliberately composed pages move from orientation to untested claim, learner-produced evidence, underlayers, interactive method, and lesson handoff. A compact stable shell keeps one decision visible; task-to-receipt transitions preserve cause and consequence; touch/short/reduced-motion layouts adapt scroll behavior; the Pentimento underpainting remains functional rather than decorative. |
| **Potential Impact** | A specific audience—people with an idea and no AI-building mental model—and a specific risk: polished output without ownership, evidence, or recovery. Learners finish with reusable rules, route-specific next actions, templates, and their own local V1 brief. |
| **Quality of the Idea** | A full idea-to-release education experience rather than a coding course, prompt library, tool ranking, or project generator. It separates build-time AI from runtime AI, makes evidence levels tangible, requires a fail → repair → retry loop, and uses earlier visible layers as the core teaching metaphor. |

## Submission and release checklist

### Repository and README

- [x] Repository URL is included.
- [x] MIT license is included.
- [x] README explains the audience, education problem, six-folio opening,
  remembered evidence, compact lesson shell, four chapters, eight stops, 14
  decisions, lesson receipts, Build kit, V1 workshop, authored/live boundary,
  local setup, verification, privacy, and Codex collaboration.
- [x] Confirm the final repository is public with relevant licensing, or share a
  private repository with both testing@devpost.com and
  build-week-event@openai.com.
- [x] Confirm the Devpost repository URL resolves for a signed-out judge.
- [x] Freeze and record the last fully verified v10.3 custom-domain commit and
  release metadata.

### Public experience

- [x] Deploy and verify the exact v10.3 artifact at pentimento.aethe.me.
- [ ] Publish the final reviewed landing artifact to pentimento.aethe.me.
- [ ] Run the hosted desktop/mobile acceptance checks against that exact final
  artifact.
- [x] Verify all six folios, persisted opening evidence, four chapters,
  eight-stop route, 14 decisions, in-place receipts, Build kit, project-layer
  views, V1 brief, authored/live labels, restart, keyboard path, focus,
  reduced-motion behavior, and narrow layouts.
- [ ] Record the final custom-domain Worker identity, hosted test result, date,
  and rollback target in docs/BUILD_LOG.md.
- [x] Confirm whether the submitted deployment uses live GPT-5.6 or the
  authored deterministic example, and describe it accurately.

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

### Final compliance review

- [x] Submission materials and testing instructions are written in English.
- [x] Judges can use the public experience without payment, an account, an API
  key, sample-data import, or private hardware.
- [x] The repository includes setup instructions, runtime configuration,
  architecture, testing commands, public URLs, license, and Codex/GPT-5.6 use.
- [x] The simulation identifies its fictional data and does not perform the
  email, repository, account, or deployment actions it teaches.
- [ ] Entrant confirms eligibility and final ownership/licensing of every
  submitted source, screenshot, font package, and video element.
- [ ] Final video contains no unlicensed music, third-party trademarks,
  credentials, personal information, or private browser content.
- [ ] Public repository, public site, and public YouTube link all resolve from a
  signed-out browser immediately before submission.
- [ ] Devpost draft names the exact public runtime mode shown in the recording
  and does not imply a live GPT-5.6 call when the authored fallback is shown.

## Verified release and final hand-in values

The custom-domain v10.3 fields below come from exact-source deployment and
hosted verification. Replace them only with evidence earned by the final
candidate.

| Field | Final value |
| --- | --- |
| Public YouTube demo URL | **TBD — entrant uploads and verifies public visibility** |
| Primary Codex /feedback Session ID | **TBD — entrant obtains it from the primary build thread** |
| Last verified custom-domain source | `430bd85234f2975fa1642cd9dc4f0a80a05f26c9` |
| Last verified custom-domain Worker release | Deployment `b49b53b8-4efb-4a69-a9a1-534f108eb247` · version `65644dee-accc-4826-9318-62eab9abb6dd` · 100% traffic |
| Hosted v10.3 acceptance result and timestamp | PASS · 34/34 desktop/mobile browser checks; all six folios; 14-decision routes; V1 workshop; route-wide Axe; keyboard, reduced motion, persistence, restart, and 320/390/768/1440px reflow · July 21, 2026 06:40 UTC |
| Production reflection mode and evidence | PASS · endpoint returned `mode: "demo"`; UI labels the result **Authored example · deterministic, no live AI call** |
| Repository public-access or private-sharing confirmation | PASS · signed-out GitHub request returned HTTP `200` |
| Devpost submission confirmation | **TBD — entrant submits and records it** |
| Verified rollback source | `1a76a2c4b1bf483509b73fcfc16221dde7119b85` |
| Verified rollback Worker version | `25c70ee1-7859-4bf7-bfa2-b3fa7a6b61ce` |

The primary build thread's /feedback Session ID and the public YouTube URL are
entrant-controlled requirements. They cannot be inferred from source code,
deployment metadata, or an earlier Codex session.
