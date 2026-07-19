# OpenAI Build Week submission guide

Category: **Education**

Submission deadline: **July 21, 2026 at 5:00 PM Pacific** (**July 22 at 8:00 AM GMT+8**)

Judging begins: **July 22, 2026**

The official rules and Devpost form remain the source of truth. This file translates the requirements into a Pentimento-specific closeout.

## Eligibility and project status

- [x] Project created during the submission period on July 18, 2026
- [x] Education track selected
- [x] Complete, consequence-driven educational mission implemented
- [x] Codex used as the primary build collaborator
- [x] GPT‑5.6 integrated through an optional server-side evidence debrief
- [x] Deterministic, key-free judge mode implemented
- [x] Repository includes an MIT license and English documentation
- [x] Public repository URL prepared
- [x] Public custom domain prepared
- [x] Freeze and tag the exact submitted commit
- [x] Run the full local and generated-Worker quality contract on the release candidate
- [x] Deploy that exact artifact to the public domain
- [x] Confirm the public page, metadata, and favicon all carry the final Pentimento identity
- [x] Record desktop, mobile, 320px, 390px, and 768px hosted smoke-test evidence

## Required Devpost fields

- [ ] Select **Education** as the category
- [ ] Add the final project description
- [ ] Add the public YouTube demo URL
- [ ] Confirm the video is under three minutes; judges need not watch beyond three minutes
- [ ] Include audible explanation of both Codex and GPT‑5.6 usage
- [ ] Add the repository URL
- [ ] Add the public test URL and concise testing instructions
- [ ] Add the primary Codex project thread’s `/feedback` Session ID
- [ ] Submit before the deadline and capture confirmation

Repository requirement: keep it public with the relevant licence, or—if it becomes private—share it with both `testing@devpost.com` and `build-week-event@openai.com` before submission.

## Final repository closeout

- [x] README explains purpose, audience, experience, setup, verification, privacy, limitations, Codex collaboration, and GPT‑5.6 boundary
- [x] Product, curriculum, build history, and quality contract are documented
- [x] No account, payment, API key, or rebuilding is required to judge the hosted experience
- [x] Supported environments and key-free mode are documented
- [x] The finished learning artifact uses invented/public information and sends no real email
- [x] Update all screenshots from the exact final visual system; no stale orange image remains in submitted materials
- [x] Confirm no credential, token, `.env.local`, personal information, or generated learner transcript is tracked
- [x] Run `git diff --check` and inspect the final diff and tracked-file list
- [x] Run dependency audit on the exact final lockfile
- [x] Put the exact local and generated-Worker verification results in `docs/BUILD_LOG.md`
- [ ] Replace every remaining **TODO before submission** marker

## Exact verification sequence

Run these after the final content/code change and before deployment:

```bash
npm ci
npm run typecheck
npm test
npm run test:e2e
npm run build:next
npm run build
npm run start
```

Then verify the generated Worker locally, deploy the unchanged `dist` artifact, and run:

```bash
PLAYWRIGHT_BASE_URL=https://pentimento.aethe.me npm run test:e2e
```

Manual evidence still matters. At 320px, 390px, 768px, desktop, and 200% zoom, inspect the landing page and representative mission states. On the hosted URL, complete the main path with keyboard only; inspect focus, dialogs, radio behavior, tabs, horizontal overflow, reduced motion, release-table derivation, exact `mailto:hello@repair-cafe.example`, and the real Revision Trace.

Passing a local dev journey does not prove the generated Worker, and passing the Worker does not prove the deployed custom domain. Record each environment separately.

## Judge testing instructions

Use this text in the Devpost testing field, adjusting only if the final behavior changes:

> Open `https://pentimento.aethe.me` in a current desktop or mobile browser. No account or API key is required. Choose **See how the lesson works** and read the one-screen case briefing; it establishes the learner’s role and the safe simulation boundary before any choice appears. Continue through the Repair Café project one focused decision at a time. Deliberately making a plausible incomplete choice is safe: Pentimento shows what happened and lets you revise it. In Check, run independent evidence tools and inspect what each result does and does not prove. In Evolve, diagnose before approving the bounded repair and rerun all five version-matched checks. In Release, perform the next missing release action; the optional ten-row table is derived from evidence and cannot be passed by ticking claims. Complete the spreadsheet transfer and inspect the Revision Trace and practical guide. The release, public URLs, commits, and email inside the lesson are simulated; the hosted app performs no external mutation.

Local fallback:

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Keep `DEMO_MODE=true` or omit the API key for the deterministic debrief.

## Draft project description

> Pentimento is a guided simulation that teaches a complete beginner how to lead an AI-built project without mistaking polish for proof. It first establishes the learner as project lead, explains the human goal and safe interaction model, then reveals one focused decision at a time. A fictional Repair Café page looks finished and the AI says every check passed—but it contains an unsupported guarantee, a phone contact action that is clipped and goes nowhere, and an empty execution record. The learner builds a testable outcome, durable repository context, bounded AI authority and scope, independent evidence, a precise repair, five reruns, and an evidence-derived release. A transfer challenge hides the method inside a flawed budget spreadsheet. The final Revision Trace reconstructs real decisions and support rather than awarding a hollow score. Core truth is deterministic; optional GPT‑5.6 personalizes only the closing evidence debrief. Codex was the primary collaborator across concept, curriculum, interaction architecture, implementation, accessibility, testing, and deployment.

## Under-three-minute demo storyboard

Aim for roughly **2:40–2:50**, leaving margin below the three-minute limit.

### 0:00–0:20 — hook

- Show the Pentimento landing line: “See the decisions beneath the finished surface.”
- Flash the case briefing—“You are the project lead”—then show that the first task appears before the polished Repair Café preview on phone and desktop.
- Say: “Pentimento teaches first-time builders the judgment behind trustworthy AI-assisted projects—not coding and not prompt tricks.”

### 0:20–0:45 — consequence

- Choose or mention a plausible unsafe decision, then show that it remains recoverable.
- Reveal the three canonical gaps: unsupported guarantee, clipped/inert 390px contact action, and empty execution record.
- State the doctrine: “AI output is a proposal. Evidence makes the project trustworthy.”

### 0:45–1:20 — TRACE and distinctive interaction

- Sweep through Target, Record, and Assign.
- Show the plain-language repository model, Plan mode, and Context Lens.
- Show Keep / Defer / Needs an answer with the hidden obligations behind accounts or live availability.

### 1:20–1:55 — evidence and repair

- Run one independent evidence tool and inspect result, evidence location, what it proves, and its limit.
- Diagnose before editing, approve the three-change patch, and show the five exact post-repair reruns tied to one version.
- Briefly activate the repaired `mailto:hello@repair-cafe.example` action.

### 1:55–2:20 — release integrity

- Show the ten-row release table changing because version, README, build, preview, approval, publication, live check, and recovery evidence exist.
- Say: “The learner cannot manufacture readiness by checking a box; the state is derived from evidence.”

### 2:20–2:40 — transfer and outcome

- Show `=SUM(B2:B4)+57.75` versus the receipt-backed `$385.15` total.
- End on the real Revision Trace and reusable first-project field manual.

### 2:40–2:50 — required technology explanation

- Say: “Codex helped us research, architect, implement, audit, test, and deploy the experience. GPT‑5.6 is deliberately bounded: it may personalize the closing debrief from server-validated evidence, but it can never decide correctness or release readiness.”

Use original narration and interface footage. Do not include copyrighted music, third-party trademarks, credentials, personal information, browser bookmarks, terminal tokens, or private tabs.

## Judging-criteria evidence

### Technological implementation

- Non-trivial, versioned deterministic state/evidence engine with validation and v1 migration
- Evidence-derived release computation tied to one exact version
- Protected server endpoint with request limits, server recomputation, structured output, and deterministic fallback
- Accessible radio, tabs, dialogs, tables, persistence, and responsive interaction primitives
- Unit, API, browser, Next build, generated-Worker, and hosted-runtime verification plan

### Design

- Coherent conservation-studio visual language rather than a generic course dashboard
- Plain first-use explanation and case briefing before assessment; one focused decision at a time thereafter
- Four learner-facing chapters, editable decision trails, on-demand reference depth, contextual resume, and persistent help
- Earlier decisions remain visible as underlayers and one continuous evidence thread
- Consequence-first feedback, recoverable revision, semantic instruments, and a complete reusable manual
- Desktop, phone, keyboard, focus, zoom, and reduced-motion behavior included in the acceptance contract

### Potential impact

- Specific audience: first-time builders who can generate output with AI but do not yet know what to trust
- Specific failure pattern: unsupported facts, over-broad authority, invisible scope, insufficient checks, and unsafe release confidence
- Transfer beyond the website scenario is directly elicited through a spreadsheet and written explanation

### Quality of the idea

- Teaches evidence-centered build judgment rather than prompts, syntax, or a real generator
- Makes the hidden causal layers of AI-assisted work visible through the pentimento metaphor
- Treats release as generated evidence and authority—not a badge, checkbox ceremony, or AI self-report

## Submission-day record

- Final release commit: `8acdddb1ed9491f30e061f38a6bb6a057854eca2` · tag `pentimento-v2`
- Deployed artifact: Cloudflare Worker version `6ad39402-8aae-4070-a2c3-95c194bbf063` · 100% production traffic
- Public acceptance test: July 19, 2026 06:01 UTC · 14/14 hosted Playwright journeys passed in 2.0m across desktop and mobile
- YouTube URL: pending entrant upload
- `/feedback` Session ID: pending entrant command in the primary Codex thread
- Devpost submission confirmation: pending entrant submission
