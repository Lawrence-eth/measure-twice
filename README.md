# Pentimento

> **Learn to build with AI, one clear step at a time.**

Pentimento is an interactive education experience for complete beginners who
have an idea but do not know how AI-built projects move from a rough request to
a checked release.

The learner guides one fictional **Willow Fix Day** event page through eight
focused stops. Each stop asks for one useful decision or trial, changes a
persistent project canvas, and leaves behind a reusable rule or artifact. The
core route contains **13 meaningful interactions** and takes about **12–15
minutes**.

Pentimento does not teach coding syntax, rank AI products, or build a real
project for the learner. It teaches the durable judgment beneath the tools:
scope one complete path, give files a recoverable home, direct AI in small
steps, distinguish claims from evidence, repair an observed failure, release
one exact version, and improve from a trusted source.

Built for the **Education** track of OpenAI Build Week 2026.

- Live experience: [pentimento.aethe.me](https://pentimento.aethe.me)
- Source: [github.com/Lawrence-eth/measure-twice](https://github.com/Lawrence-eth/measure-twice)
- License: [MIT](LICENSE)

## The education problem

A first-time builder now encounters browser AI builders, coding agents,
editors, Git, GitHub, hosting dashboards, API keys, and model names before they
have a mental model for a project. A polished generated screen can make the
confusion worse: it looks finished even when the files are not recoverable, a
visitor path has never been tried, or the deployed version is not the checked
version.

Pentimento teaches a tool-independent map:

```text
AI workspace helps build → project home remembers → host publishes
```

One product may perform more than one role, but the responsibilities remain
different. A chat is not automatically a project home. A repository is not a
public website. A completed deployment is not proof that a visitor can finish
the important path.

## The v4 learning experience

The experience opens with a literal promise, the time and safety boundary, and
one primary action. There is no prerequisite lecture. The learner starts with
the project immediately, while definitions, full prompts, checklists, and
examples remain available as optional depth.

| Stop | Required actions | What the learner practices | What appears on the canvas |
| --- | ---: | --- | --- |
| **1. Idea** | 1 | Reduce an ambitious wishlist to one person and one supportable finish | A first-version brief with a clear “Not now” boundary |
| **2. Tools** | 1 | Choose between a faster hosted route and a more transferable repository route | Build, save, and publish responsibilities |
| **3. Project home** | 2 | Put the work somewhere recoverable and decide whether the finished page needs runtime AI | Route-specific files/history with no unnecessary runtime dependency |
| **4. Ask AI** | 2 | Ask AI to inspect and plan before editing, then approve one shown step | A bounded work agreement |
| **5. Build** | 1 | Move beyond “AI says done” by opening the preview and trying the visitor path | A change record and saved V1 layer |
| **6. Check** | 3 | Discover a dead contact action, request the smallest repair, and repeat the same path | A defect report and checked V4 layer |
| **7. Go live** | 2 | Select the exact checked version and verify behavior at the public address | Release evidence and a pinned recovery version |
| **8. Improve** | 1 | Change an approved source before changing the page | A source-backed V5 layer without erasing V4 |

Only the current task asks for attention. Completed layers collapse into a
compact trail; the route, project canvas, and optional references remain
available without placing the whole curriculum on one screen.

## What makes the interaction educational

### One consequential action at a time

The core route contains no acknowledgement clicks. A correct action advances
only after it changes the learner's route, artifact, evidence, or understanding.
Wrong choices remain useful: they reveal the extra systems or missing proof
that the choice would introduce.

### A persistent pentimento

A *pentimento* is an earlier layer visible beneath a finished work. The
interface uses that idea literally. The event page is the surface; its brief,
tool route, files, AI request, checks, versions, release proof, and recovery
remain visible underneath it as the learner works.

### Evidence instead of AI confidence

Pentimento separates five levels of evidence:

```text
AI claim → changed files → preview → human path → public path
```

Each level proves something different. A passing typecheck can support code
consistency without proving visitor behavior. A preview can prove appearance
without proving a link works. A deployment dashboard can prove the host
finished without proving the public path serves the right version.

### A real fail → repair → retry loop

The Check stop does not announce the defect. The learner activates the
important contact action and observes that nothing happens. They then choose a
bounded repair that preserves approved facts and working layout, and must
activate the repaired path again before V4 becomes eligible for release.

The email target is fictional and the interaction is simulated. No email is
opened or sent.

### Build-time AI is not automatically runtime AI

AI helps create Pentimento's worked event page, but a visitor to that page only
needs approved facts and a normal email link. The finished page therefore needs
no model call or API key.

This distinction prevents a common beginner mistake: adding runtime cost,
latency, privacy exposure, unsafe input, and another failure mode merely because
AI was useful during development. Runtime AI belongs in a product only when the
visitor's useful result actually requires it.

## Five-card Build-with-AI Playbook

The optional Playbook groups the full method into five milestone cards instead
of presenting a large handbook inline:

1. **Shape the first version**
2. **Choose a route and project home**
3. **Ask, inspect, and save**
4. **Check and repair**
5. **Release and improve**

Each card answers four practical questions: when to use it, what to do, what
counts as proof, and what template to copy. Route-specific guidance changes for
the hosted and repository lanes. Only one card opens at a time.

## Teaching Mirror: transfer the method to a real idea

After the simulation, the learner can open the four-step **Teaching Mirror**.
It first creates a reusable V1 brief locally from:

- person and situation;
- useful result and complete path;
- trusted facts;
- must-have and “Not now” boundaries;
- a repeatable finish line; and
- the selected starter route.

The V1 brief is complete and copyable without a model call. The learner may
then explicitly request an optional bounded GPT reflection. It returns one
strength, exactly two unresolved questions, one feature to postpone, one honest
route tradeoff, and exactly three next moves.

The reflection cannot grade the learner, change lesson progression, generate or
execute a project, access files or repositories, request credentials, publish,
or take any external action. The API validates bounded input and structured
output, keeps the key server-side, sets `store: false`, and falls back to an
authored deterministic reflection if live model access is disabled, limited, or
unavailable.

The configured model comes from `OPENAI_MODEL`; the repository's Build Week
default is `gpt-5.6`. The authored learning route itself is deterministic and
does not depend on model availability.

The current public Worker has no server-side OpenAI key, so its optional
reflection is explicitly served in deterministic fallback mode. The bounded
GPT‑5.6 path is implemented and tested and can be enabled with the server-only
configuration below; fallback output is not presented as a live model result.

## Judge walkthrough

No installation, account, API key, or real deployment is required to evaluate
the submitted experience.

1. Open [pentimento.aethe.me](https://pentimento.aethe.me) in a current desktop
   or mobile browser.
2. Select **Begin the guided build**. Use **Preview how the lesson works** only
   if you want the three-phase overview first.
3. Follow either tool lane. The repository lane makes the folder → Git → GitHub
   → host path most explicit; the hosted lane demonstrates the export and
   ownership tradeoff.
4. In **Check**, try the contact action, choose the bounded link repair, and try
   the repaired action again. The retry is required.
5. In **Go live**, distinguish the checked V4 from the polished but untested V3,
   then repeat the path at the simulated public address.
6. At completion, open one of the five Playbook cards and select **Shape my own
   V1 brief**. The brief works in deterministic demo mode; the GPT reflection is
   explicitly optional.

All Willow Fix Day people, addresses, versions, URLs, releases, and external
actions inside the lesson are fictional or simulated. The lesson never changes
a real repository, sends email, creates an account, or publishes a site.

Progress is saved in the current browser. **Start over** opens a confirmation
dialog before removing the v4 route, project layers, and Teaching Mirror draft
from that device.

## Run locally

Requirements: **Node.js 22 or newer**.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The core route and deterministic Teaching Mirror
fallback work without an account, network model call, or API key.

To make demo behavior explicit:

```bash
cp .env.example .env.local
```

```dotenv
DEMO_MODE=true
OPENAI_MODEL=gpt-5.6
```

### Optional live reflection

To exercise the live Teaching Mirror, keep the credential server-side and set:

```dotenv
OPENAI_API_KEY=your-server-side-key
OPENAI_MODEL=gpt-5.6
DEMO_MODE=false
SAFETY_SALT=replace-with-a-random-server-secret
```

Never use a `NEXT_PUBLIC_` variable for `OPENAI_API_KEY`, place it in browser
code, paste it into a prompt, capture it in a screenshot, or commit it.

## Verify

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build:next
npm run build
```

- `npm test` covers the v4 progress model, saved-state validation, and bounded
  Teaching Mirror API behavior.
- `npm run test:e2e` exercises both tool lanes, the 13-interaction route,
  fail/repair/retry persistence, keyboard-only operation, dialog focus,
  accessibility scans, and 320–1440px layouts.
- `npm run build:next` checks the conventional Next.js production build.
- `npm run build` creates the Cloudflare Workers-compatible `dist` artifact and
  copies its hosting metadata.

Run the generated Worker locally after `npm run build`:

```bash
npm run start
```

Run the browser suite against an already-hosted candidate:

```bash
PLAYWRIGHT_BASE_URL=https://pentimento.aethe.me npm run test:e2e
```

Recapture release screenshots from the exact hosted candidate:

```bash
SCREENSHOT_BASE_URL=https://pentimento.aethe.me node scripts/capture-release-screenshots.mjs
```

## Deploy to Cloudflare Workers

With Wrangler authenticated and the intended Worker/custom-domain settings
confirmed:

```bash
npm run build
npm run start
npm run deploy:vinext
```

`npm run start` is the local generated-artifact check; stop it before running
the deploy command. After deployment, verify the custom domain and rerun the
hosted Playwright suite. A passing development server does not prove that the
generated Worker or exact public version is correct.

## How Codex contributed

Codex was the primary implementation collaborator. It accelerated:

- turning the broad “teach people to build with AI” idea into a bounded
  Education-track curriculum for complete beginners;
- writing and revising the Willow Fix Day case, wrong-choice consequences,
  artifacts, and five-card Playbook;
- replacing an overwhelming interface with the one-task-at-a-time v4 route;
- modeling strict progress, exact substep restoration, and the bounded Teaching
  Mirror boundary;
- implementing the responsive project canvas, dialogs, persistence, API route,
  and Cloudflare build path; and
- adversarial content review, accessibility review, density measurement,
  browser tests, and release preparation.

The human retained the central product and design decisions: choose the
Education track, teach project-building rather than coding, serve people with
no prior experience, teach durable roles rather than rank brands, value useful
content over feature count, use one worked project, make failure and recovery
visible, and present it through the Pentimento layer metaphor.

The core educational content is authored and deterministic. GPT is confined to
the optional post-route reflection described above; it does not decide what is
correct or control progression.

The primary Codex project thread's `/feedback` Session ID must be added to the
Devpost submission form before the deadline.

## Privacy and safety boundary

- Core progress and the unfinished V1 brief are stored in browser
  `localStorage`.
- Nothing from the brief is submitted until the learner explicitly requests the
  optional reflection.
- That request contains only the learner-entered brief, selected route, and a
  random session ID. It does not include route history or repository access.
- The server validates request size and shape, derives a privacy-preserving
  safety identifier for live model calls, rate-limits live reflection, and
  keeps the OpenAI credential server-side.
- Demo mode performs no OpenAI model request and returns the authored fallback.
- Model failure never blocks access to the completed local V1 brief.

## Project map

- [`components/PentimentoFinal.tsx`](components/PentimentoFinal.tsx) — v4
  one-task-at-a-time interface, project canvas, Playbook, and Teaching Mirror
- [`lib/final-journey.ts`](lib/final-journey.ts) — authored eight-stop
  curriculum, choices, artifacts, and five-card index
- [`lib/final-progress.ts`](lib/final-progress.ts) — validated v4 state,
  persistence, reachability, and progression
- [`app/api/debrief/route.ts`](app/api/debrief/route.ts) — bounded demo/live
  reflection boundary
- [`lib/debrief.ts`](lib/debrief.ts) — structured live reflection and authored
  fallback
- [`tests/e2e/final-journey.spec.ts`](tests/e2e/final-journey.spec.ts) — desktop,
  mobile, keyboard, accessibility, persistence, and density coverage
- [`docs/FINAL_EXPERIENCE.md`](docs/FINAL_EXPERIENCE.md) — beginner-first v4
  experience contract
- [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md) — dated collaboration and historical
  release record

## License

[MIT](LICENSE)
