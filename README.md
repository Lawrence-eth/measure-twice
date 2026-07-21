# Pentimento

> **AI can make it look finished. Learn to make it trustworthy.**

Pentimento is a 15-minute interactive field lesson for complete beginners who
want to build with AI but do not yet have a mental model for everything between
a prompt and a trustworthy release.

The learner directs one fictional **Willow Fix Day** site from a convincing
preview to a checked, recoverable public version. The experience teaches the
human judgment beneath AI building: shape a supportable first promise, keep the
work in a project home, bound AI changes, collect evidence, repair an observed
failure, release an exact version, and preserve recovery.

Pentimento is an authored educational simulation. It is not a coding course,
prompt library, product ranking, project generator, repository, or deployment
service. It never sends an email, edits a real project, or publishes a real
site.

Built for the **Education** track of OpenAI Build Week 2026.

- Public demo:
  [pentimento.aethe.me](https://pentimento.aethe.me)
- Native ChatGPT Sites address:
  [pentimento.law-ender.chatgpt.site](https://pentimento.law-ender.chatgpt.site)
- Source:
  [github.com/Lawrence-eth/measure-twice](https://github.com/Lawrence-eth/measure-twice)
- License: [MIT](LICENSE)

For submission copy, the landing-only video plan, judge instructions, and the
remaining entrant-controlled fields, start with
[`docs/HACKATHON.md`](docs/HACKATHON.md). The release-by-release collaboration
and verification record is in [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md).

## Why this lesson exists

A first-time builder can now encounter browser AI builders, coding agents,
editors, project folders, Git, GitHub, hosts, API keys, and model names before
they understand what a project needs. A polished generated screen can make that
confusion worse: the surface looks complete even when the important path has
never been tried, the files are not recoverable, or the public version is not
the version someone checked.

Pentimento teaches a tool-independent responsibility map:

```text
AI workspace helps build → project home remembers → host publishes
```

One product can perform more than one role, but the responsibilities stay
different. A chat is not automatically a project home. A repository is not a
public site. A successful deployment is not proof that a visitor can complete
the important path.

## The six-page opening

The opening is six deliberately composed folios, numbered 01–06. It uses the
page itself as the scroller—there is no nested story panel. Each folio answers
one question and advances one visual idea:

| Folio | Question answered | Learner action |
| --- | --- | --- |
| **01 · What this is** | What is Pentimento, who is it for, and what will I keep? | Understand the 15-minute, no-experience-required lesson |
| **02 · The claim** | What does the polished AI report actually prove? | Separate appearance from tested behavior |
| **03 · The test** | Does the project’s important visitor action work? | Select **Email the organizer** and create an evidence record |
| **04 · The layers** | What does the finished surface hide? | Explore Promise, Project home, Evidence, and Release |
| **05 · The method** | What is the learner’s role around AI? | Explore Shape, Ground, Direct, and Prove |
| **06 · Your lesson** | What happens next? | Begin the eight-stop field lesson or inspect its map |

The editorial rule is one question, one meaningful artifact, and one next move
per page. Explanations appear where a choice changes their meaning—in the
failure receipt and selected layer or method panel—rather than as repeated
introductory copy. This keeps the landing readable while preserving the deeper
curriculum behind interaction.

On desktop, each deliberate wheel or keyboard gesture settles one full folio,
including compact short-height layouts. Tall tablet and phone layouts also
settle by page; short narrow screens, high zoom, and reduced motion return to
forgiving natural scrolling. The persistent page counter communicates position;
in-flow next actions, normal root scrolling, and Page Up/Page Down/Home/End
provide navigation without an edge rail covering the compositions. Claim,
evidence, layers, and method each have a dedicated responsive artifact—no
text-bearing mockup is scaled or cropped to fit. Tablet layouts keep the
explanation and artifact side by side; phones recompose the same material into
one reading flow.

The opening does not reveal the failure before the learner tests it. The test
on folio 03 is the actual evidence check—not a teaser for a duplicate
inspection. When the learner sees the failure and begins the lesson,
`introFailureObserved` is persisted. The later **Check** stop therefore begins
with **You found this failure earlier; now record it**. A learner who skips the
test still performs it in Check. The same failure is never staged three times.

## Four chapters, eight stops

| Chapter | Stops | Decisions | Reusable outcome |
| --- | --- | ---: | --- |
| **1. Shape the promise** | First version | 1 | One person, one complete path, approved facts, and a Not now boundary |
| **2. Ground the work** | Tools · Project home | 3 | A tool route, recoverable project home, and honest runtime-AI decision |
| **3. Direct the build** | Ask AI · Build | 3 | A bounded work agreement and an evidenced saved version |
| **4. Prove the release** | Check · Go live · Improve | 7 | A repaired path, checked release, recovery layer, and source-backed update |
| **Total** | **8 stops** | **14** | **A complete idea → evidence → release method** |

The lesson shell is intentionally compact. The header identifies the current
chapter and exposes one secondary action, **Lesson map**. On small screens the
project canvas is a closed disclosure, **Project layer updated**, so the
current decision appears before reference material. Opening it reveals the same
**Visitor surface** and **Layers underneath** available on desktop.

Every stop follows one causal rhythm:

```text
why it matters → meaningful choice or trial → visible consequence →
Save this lesson → Lesson receipt → next stop
```

Correct feedback stays in place; there is no delayed auto-scroll or automatic
advance. The receipt names the reusable rule and one practical place to use it.
Receipts are marked **Lesson receipt · practice saved · n / 8**. They do not
pretend to create eight separate tools: the complete Build kit contains five
durable guides.

Wrong choices are educational rather than punitive. Each explains the added
system, missing proof, or unnecessary risk and remains recoverable. There are
no scores, streaks, badges, trick distractors, confetti, or mastery claims.

## The durable method

### A persistent pentimento

A *pentimento* is an earlier version still visible beneath a finished painting.
The interface uses that idea literally. The visitor page is the surface; its
brief, tool route, files, AI request, checks, versions, release proof, and
recovery remain visible underneath as the learner works.

### Evidence instead of confidence

Pentimento separates five evidence levels:

```text
AI claim → changed files → preview → human path → public path
```

Each level proves something different. A preview can prove appearance without
proving behavior. A passing automated check can support code consistency
without proving visitor behavior. A host dashboard can prove a deployment
finished without proving the public path serves the checked version.

### Fail → record → repair → retry

If the opening failure was observed, Check starts from that remembered evidence
instead of asking the learner to manufacture it again. The learner records
observed versus expected behavior, chooses a bounded link repair that preserves
approved facts and layout, and must retry the important action before the
checked version can move toward release.

The email target and response are fictional and simulated. No mail client opens
and no email is sent.

### Build-time AI is not automatically runtime AI

AI helps create the worked event page, but visitors only need approved facts
and a normal email link. The finished example therefore needs no model call or
API key. Runtime AI adds cost, latency, privacy, safety, and another failure
mode; it belongs only when the visitor’s useful result requires it.

### Exact release and recovery

The release lesson makes the version thread visible:

```text
V1 scoped → V2 built → V3 polished but untested →
V4 repaired and checked → V5 source-backed update
```

The learner releases the checked version, tests the important path at the
public address, and keeps the prior trusted version as the recovery layer.

## Five-guide Build kit

The **Build kit** is available during the lesson and at completion:

1. **Shape the first version**
2. **Choose a route and project home**
3. **Ask, inspect, and save**
4. **Check and repair**
5. **Release and improve**

Each guide explains when to use it, the exact action, what counts as proof, and
a copyable template. Hosted and repository-aware routes show their tradeoffs
without declaring one universal winner.

## V1 brief workshop

Completion accurately says the learner practiced the method; it does not claim
one simulation proves mastery. The learner can select **Create my V1 brief** to
apply the method to an idea in four short passes:

1. person, situation, and useful result;
2. complete path and trusted facts;
3. must-have and Not now boundaries; and
4. observable finish line and starter route.

The complete brief is generated locally and can be copied before any network
request. The learner can edit their answers and keep the brief even if the
optional reflection fails.

### Authored example versus live GPT-5.6

The interface names the active reflection mode before and after the request:

- **Authored example · deterministic, no live AI call** in demo mode.
- **GPT-5.6 reflection · live** only when the server is configured for a
  successful live request.

Both modes use the same bounded shape: one clear strength, exactly two unresolved
questions, one feature to postpone with a reason, one route tradeoff, and
exactly three next moves. The reflection is read-only. It cannot grade the
learner, change lesson progress, access files or repositories, execute a
project, request credentials, publish, or take an external action.

The public judging configuration is designed to work in deterministic demo
mode. Demo output must always be described as an authored example, never as a
live GPT-5.6 response. Live mode uses the server-side `OPENAI_API_KEY`, the
configured `OPENAI_MODEL` (Build Week default `gpt-5.6`), structured output,
`store: false`, bounded input/output, rate limiting, and a privacy-preserving
safety identifier. Provider failure falls back to the clearly labelled authored
example without blocking the local brief.

## Recommended demo flow

The under-three-minute submission video is designed around the six-page
opening. It demonstrates the complete thesis without rushing through the
longer practice route:

1. On **01 · What this is**, establish the audience, problem, and five things
   the learner keeps.
2. On **02 · The claim**, show that a finished-looking preview proves
   appearance, not behavior.
3. On **03 · The test**, select **Email the organizer** and hold long enough for
   the observed-failure receipt to be legible.
4. On **04 · The layers**, select at least **Evidence** and **Release** to show
   that trust depends on decisions beneath the surface.
5. On **05 · The method**, move through Shape, Ground, Direct, and Prove; pause
   on **Prove** so the exact-version idea lands.
6. On **06 · Your lesson**, show the four-chapter, eight-stop route and the five
   reusable tools. End before starting the long-form lesson.

The landing is not a decorative trailer. Folio 03 produces evidence that is
carried into the lesson when the learner starts, and folios 04–05 use
keyboard-operable tabs with meaningful artifacts and proof. The complete
eight-stop lesson remains available for judging and repository testing; the
video simply uses the opening as its deliberate, self-contained story. A timed
narration script is in
[`docs/HACKATHON.md`](docs/HACKATHON.md).

All Willow Fix Day people, addresses, versions, URLs, releases, and external
actions are fictional or simulated. Progress is stored in the current browser.
**Start over** asks for confirmation before removing the saved lesson, project
layers, and workshop draft from that device.

## Sample data and supported environment

No external dataset or seed import is required. The fictional Willow Fix Day
case, project versions, evidence records, choices, feedback, and Build kit are
authored in the repository, so a judge receives the complete experience on the
first load.

Pentimento is a responsive web application intended for current desktop and
mobile browsers. Automated browser acceptance uses Chromium desktop and mobile
profiles, with explicit contracts at 320, 390, 768, and 1440 pixels. Keyboard,
focus, reduced-motion, and route-wide Axe checks are part of the browser suite.

## Run locally

Requirements: **Node.js 22 or newer**.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. The complete lesson, Build kit, local V1 brief,
and authored reflection example work without an account, API key, or live model
call.

To make the authored mode explicit:

```bash
cp .env.example .env.local
```

```dotenv
DEMO_MODE=true
OPENAI_MODEL=gpt-5.6
```

To enable the optional live reflection:

```dotenv
OPENAI_API_KEY=your-server-side-key
OPENAI_MODEL=gpt-5.6
DEMO_MODE=false
SAFETY_SALT=replace-with-a-random-server-secret
```

Never expose `OPENAI_API_KEY` through a `NEXT_PUBLIC_` variable, browser code,
screenshots, prompts, or commits.

## Verify

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build:next
npm run build
npm audit --omit=dev
```

- Unit/API tests cover versioned progress, persisted opening evidence,
  restoration, bounded reflection validation, authored mode, and live failure
  fallback.
- Browser tests cover the six-folio opening, both tool lanes, 14 decisions,
  remembered failure, repair/retry, lesson receipts, workshop, keyboard
  operation, accessibility, reduced motion, and 320–1440px layouts.
- `npm run build` creates the ChatGPT Sites/Cloudflare-compatible `dist`
  artifact and copies its hosting metadata.

Run the generated Worker locally after `npm run build`:

```bash
npm run start
```

Run the browser suite against a hosted candidate:

```bash
PLAYWRIGHT_BASE_URL=https://pentimento.aethe.me npm run test:e2e
```

## Deploy with ChatGPT Sites

Pentimento is connected to its existing Sites project through
`.openai/hosting.json`. Before publishing, verify the exact candidate, push the
reviewed Git state, push that exact source state to Sites, save a version with
its exact commit SHA, and deploy only the saved version. Every Sites deployment
URL is production. Re-run the hosted journey after propagation; a passing local
server does not prove the public release.

## How Codex and GPT-5.6 contributed

Codex was the primary implementation collaborator. It accelerated:

- turning “teach people to build with AI” into one deep, beginner-first
  Education-track lesson;
- writing and revising the Willow Fix Day case, wrong-choice consequences,
  lesson receipts, and five-guide Build kit;
- auditing the earlier opening and replacing duplicate, overwhelming content
  with six composed folios and one remembered evidence event;
- implementing the compact lesson shell, surface/underlayers canvas, versioned
  persistence, V1 brief workshop, and bounded server route;
- finding stacked page-transition, mobile focus, density, target-size, and
  scroll-composition defects; and
- running adversarial content, accessibility, responsive, performance, and
  release checks.

The human retained the consequential product and design decisions: choose
Education, teach building rather than coding, serve people with no prior
experience, value useful content over feature count, teach durable roles rather
than rank brands, make failure and recovery visible, use the Pentimento
underpainting metaphor, and demand an elegant page-by-page experience.

The authored curriculum—not a model—decides what is correct and how progression
works. GPT-5.6 has one optional, explicitly labelled role after the learner’s
local V1 brief already exists.

The primary Codex project thread’s `/feedback` Session ID must be entered in the
Devpost submission form before the deadline.

## Privacy and safety

- Core progress and the unfinished V1 brief use browser `localStorage`.
- No brief text leaves the browser until the learner explicitly requests the
  optional reflection.
- The request includes only the brief, selected route, and a random session ID;
  it does not include route history or repository access.
- Server validation bounds request shape and size.
- Live credentials stay server-side.
- Demo mode makes no OpenAI model request.
- A missing, limited, invalid, or failed live response falls back to the
  labelled authored example and never blocks the local brief.

## Project map

- [`components/PentimentoFinal.tsx`](components/PentimentoFinal.tsx) — six-folio
  opening, compact lesson shell, project layers, Build kit, completion, and V1
  brief workshop
- [`lib/final-journey.ts`](lib/final-journey.ts) — authored eight-stop
  curriculum, decisions, consequences, artifacts, and five-guide index
- [`lib/final-progress.ts`](lib/final-progress.ts) — validated versioned state,
  persisted opening evidence, reachability, and restoration
- [`app/api/debrief/route.ts`](app/api/debrief/route.ts) — explicit
  authored/live reflection boundary
- [`lib/debrief.ts`](lib/debrief.ts) — structured live reflection and authored
  example
- [`tests/e2e/final-journey.spec.ts`](tests/e2e/final-journey.spec.ts) —
  responsive, keyboard, accessibility, persistence, and full-journey coverage
- [`docs/FINAL_EXPERIENCE.md`](docs/FINAL_EXPERIENCE.md) — experience
  contract
- [`docs/CURRICULUM.md`](docs/CURRICULUM.md) — learning rationale, teaching
  sequence, misconceptions, and source notes
- [`docs/QUALITY_STANDARD.md`](docs/QUALITY_STANDARD.md) — content, product,
  accessibility, evidence, and release-quality bar
- [`docs/HACKATHON.md`](docs/HACKATHON.md) — submission copy, judge path,
  landing-only video script, criteria mapping, and checklist
- [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md) — dated design, collaboration, and
  release evidence

## Hackathon provenance

This repository began from an empty project on **July 18, 2026**, inside the
OpenAI Build Week submission period. It is therefore new hackathon work rather
than a pre-existing product with an added feature. The dated design history,
commit references, human decisions, Codex contribution, and immutable release
evidence are recorded in [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md).

The core curriculum and judging path are authored and deterministic. Codex was
the primary implementation collaborator. GPT-5.6 is integrated only through
the optional, bounded Teaching Mirror after the local brief exists; the public
judge deployment can remain in deterministic demo mode and must not be
described as making a live model call. The Devpost submission must separately
include the primary Codex thread's `/feedback` Session ID and describe the
model shown in the video exactly as its visible mode label states.

## License

[MIT](LICENSE)
