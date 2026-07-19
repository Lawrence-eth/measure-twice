# Build log and Codex collaboration record

This log distinguishes hackathon-period work, earlier product layers, current implementation, and human decisions. The repository began from an empty project on **July 18, 2026**, during the OpenAI Build Week submission period.

## July 18 — concept exploration

The first explored concept was **Counterproof**, a programming-misconception prototype. The human then clarified that the intended project was not coding education and not a real AI project generator. The goal was deeper: teach a person with no prior experience how to use AI responsibly while taking a small project from idea to something they can understand, inspect, repair, and share.

Codex helped:

- extract the Education-track requirements and judging criteria;
- compare several bounded learning concepts;
- research official OpenAI platform guidance, beginner build workflows, repository and secret safety, accessibility, and learning-science sources; and
- translate the clarified goal into a consequence-driven simulation rather than a passive course.

Human decisions:

- choose the Education track;
- build from an empty repository with Codex as the primary implementation collaborator;
- reject learning-to-code as the subject;
- reject a chatbot, prompt library, and arbitrary app generator;
- define the learner as someone with no prior AI-building, GitHub, testing, or deployment experience;
- make content quality and the complete interactive experience the highest priorities; and
- prefer one deep, transferable mission over several shallow lessons.

## July 18 — Measure Twice foundation

The first working product layer was named **Measure Twice**. It established the core doctrine—AI output is a proposal; evidence makes a project trustworthy—and the TRACE curriculum: Target, Record, Assign, Check, Evolve.

The repository history preserves this layer:

- `e14f32b` — initial evidence-first learning loop;
- `042d9b2` — complete Measure Twice learning simulation;
- `9753d7f` — hosting-project binding;
- `657852f` — Sites production-runtime setup; and
- `ed5f6ce` — Sites metadata copied into the build artifact.

Codex helped design and implement the Repair Café scenario, deterministic progress/evidence model, authored feedback, optional GPT‑5.6 debrief boundary, responsive interface, tests, and Cloudflare-compatible artifact.

The earlier Measure Twice checkpoint had its own passing test/build record. Those results are historical evidence for those commits only; they are not used to claim that the later Pentimento release candidate passes.

## July 18 — Pentimento product correction

The human chose **Pentimento**: a single, artistic name for the visible trace of an earlier version beneath a finished work. The metaphor sharpened both the visual identity and the pedagogy. The interface should reveal the decisions below the polished surface, not resemble another orange AI dashboard or a gamified course.

Human direction for this layer:

- value educational depth over breadth and speed;
- make every instructional item immediately useful to a first-time builder;
- make the experience elegant, modern, interactive, and distinctive;
- remove orange from the visual system; and
- refine content, interaction, accessibility, and evidence integrity down to small details before calling the work finished.

The Pentimento v2 refinement changed more than the name:

- reconciled one canonical defect record across every scene: unsupported guarantee, clipped/inert email action, and empty execution record;
- corrected the inherited baseline from “known good” to **recoverable but unverified**;
- replaced early explanatory answer cards with native radio choices and accessible toggle cards whose feedback remains hidden until commitment;
- made Plan, Implement, Diagnose, Review, Verify, and Explore explicit work modes;
- replaced feature-count scope scoring with Keep / Defer / Needs an answer decisions and visible obligations;
- rebuilt the evidence view around exact results, locations, what a check proves, and what it cannot prove;
- separated diagnosis, approval, repair, and five post-repair reruns tied to one exact version;
- replaced self-attested release claims with ten rows derived from version-matched checks and concrete release actions;
- separated preview verification, explicit approval, simulated publication, live smoke testing, and recovery;
- corrected the transfer spreadsheet to `=SUM(B2:B4)+57.75`, where approved receipts total `$385.15`, and added a learner explanation;
- replaced the generic final replay/score framing with a real **Revision Trace** and qualitative support labels;
- expanded every field note with a trigger, completed example, template, evidence output, and prevented failure;
- added a fourteen-step guide for the learner’s first real AI-assisted project;
- versioned and validated persisted progress, including safe migration from the earlier format;
- added accessible dialogs, native radios, keyboard tabs, semantic tables, focus restoration, and restart confirmation; and
- rebuilt the visual system as a conservation studio using neutral paper/ink, ultramarine, mauve, viridian, and crimson.

## July 19 — beginner-comprehension correction

After using the deployed experience as a general user, the human identified a critical product flaw: the curriculum was deep, but the first screen exposed an unfamiliar artifact, AI claim, choices, confidence controls, progress, and utility actions before plainly explaining what Pentimento was or what the learner should do. On mobile, the preview even appeared before the instructions. The human explicitly prioritized content presentation and interaction quality—not merely adding more text.

Codex audited the first two minutes as a complete beginner, inspected the real mobile ordering, and rebuilt the interaction architecture around progressive disclosure:

- rewrote the welcome to state that Pentimento is a guided simulation for first-time AI builders;
- added a dedicated case briefing that establishes the learner’s role, human goal, interaction rhythm, and safety boundary before assessment;
- added a contextual resume screen so saved learners are never dropped into unexplained controls;
- reordered mobile content so task instructions always precede the Repair Café artifact;
- split the first layer into observation and decision states, revealing no radio choices until the learner explicitly chooses to decide;
- removed the unexplained confidence gate from the first interaction while preserving calibration at later meaningful boundaries;
- made Target, Record, Assign, Scope, Evolve, Release, and Transfer reveal one focused question, item, or next action at a time;
- collapsed completed decisions into editable trails and moved glossaries and the full release ledger behind labelled disclosures;
- replaced the four-column consequence report with three plain questions: what happened, why it matters, and what to do next;
- grouped ten internal layers into four learner-facing chapters, hid empty field-guide chrome, and added persistent “How this works” help;
- preserved native controls, focus movement, dialog containment, reversible errors, deterministic evidence logic, and the full curriculum depth; and
- added browser assertions for briefing-before-assessment, hidden future controls, mobile instruction order, help, contextual resume, and sequential progression.

This correction is a direct example of the collaboration the project teaches: a polished, passing release was treated as a proposal; observed user confusion became evidence; the team changed the presentation boundary rather than defending the existing artifact; and the revised journey earned its own tests and deployment record.

## Product decisions that remain authoritative

- The curriculum, canonical defects, consequences, gates, and evidence ratings are deterministic.
- GPT‑5.6 may personalize closing language, but it cannot invent lesson truth, change progression, set release readiness, or claim mastery.
- The learner acts before receiving explanatory feedback.
- Wrong choices create a visible consequence and remain recoverable.
- TRACE is the only curriculum mnemonic. Context Lens, Evidence Ledger, and Revision Trace are the only named instruments.
- A version is not “known good” merely because it was saved or generated.
- A release row passes only when the mission has produced the matching evidence.
- Publishing remains a human-approved external action even after technical checks pass.
- One mission reports observed performance and level of support, not durable mastery.
- Judge mode is complete without an OpenAI key.
- No real GitHub mutation, email send, payment, access change, or deployment occurs inside the learning simulation.

## How Codex contributed

Codex served as the primary engineering and design collaborator across:

- concept comparison and product framing;
- official documentation and curriculum research;
- content architecture and consistency audits;
- state-machine and evidence-engine design;
- Next.js/React implementation;
- accessible interaction primitives and responsive behavior;
- OpenAI Responses API and Structured Outputs integration;
- local persistence validation/migration and API hardening;
- unit, API, browser, and production-runtime test design;
- visual refinement and screenshot review;
- build/deployment configuration; and
- README, submission narrative, and demo preparation.

Codex accelerated inspection, implementation, cross-file consistency work, adversarial review, and repetitive verification. The human made the product, audience, pedagogy, scope, identity, visual-direction, and quality-bar decisions and reviewed the resulting behavior.

## How GPT‑5.6 contributes to the product

GPT‑5.6 is used only for the optional Teaching Mirror at completion. The
learner deliberately submits a first-version brief for their own idea and the
starting lane they selected. The model returns a schema-constrained reflection:
one clear strength, exactly two unresolved assumptions, one candidate feature
to postpone with a reason, one honest tool-lane tradeoff, and exactly three
small next moves.

The integration uses the OpenAI Responses API, Zod Structured Outputs,
`store: false`, bounded output, low reasoning effort, a hashed safety
identifier, request limiting, and deterministic fallback. The model never sees
route history, decides lesson correctness, grades the learner, builds a
project, accesses a repository, or performs an external action.

## Initial production evidence record (v1)

This historical record belongs to commit `b762dcedd1a69a49a1ca76b370066da314ad2aa5`, tagged `pentimento-v1`. It shows what the initial production release earned before the beginner-first correction. Those results are not used as evidence for v2.

| Evidence | Exact result for submitted commit |
| --- | --- |
| Submitted commit | `b762dcedd1a69a49a1ca76b370066da314ad2aa5` · annotated tag `pentimento-v1` |
| `npm run typecheck` | PASS · TypeScript completed with no diagnostics · July 18, 2026 15:55 UTC |
| `npm test` | PASS · 82/82 unit, schema-boundary, migration, release-evidence, and API tests |
| `npm run test:e2e` | PASS · 8/8 Chromium journeys across desktop and mobile projects; includes Axe scans, wrong paths, keyboard dialogs, native controls, release derivation, and debrief |
| `npm run build:next` | PASS · Next.js 16.2.10 production build; static page, icon, and dynamic debrief route classified |
| `npm run build` | PASS · five Vinext environments built; Sites metadata copied into `dist/.openai/hosting.json` |
| Local generated-Worker smoke test | PASS · unchanged `dist` Worker at `127.0.0.1:8787`; 8/8 E2E including `/api/debrief` |
| Dependency audit | PASS · `npm audit --audit-level=high` reported 0 vulnerabilities |
| 320 / 390 / 768 / desktop screenshot review | PASS · no document overflow; 390px defect is intentionally clipped inside its device frame; eight final screenshots recaptured from the Worker artifact |
| Hosted desktop/mobile core-path smoke test | PASS · 8/8 Playwright journeys against `https://pentimento.aethe.me` in 42.4s · July 19, 2026 03:20 UTC |
| Public URL and deployed commit agree | PASS · Worker version `38752a8b-2032-49df-8042-71e61a431e3e` carries deployment message `Pentimento b762dce verified Build Week release`; root/title/tagline/favicon/API verified at the custom domain |

### Production routing record

- Worker: `pentimento`
- Route: `pentimento.aethe.me/*`
- DNS: the existing CNAME target remains `custom-domains.chatgpt.site`; proxying is enabled so the Worker route executes, preserving a reversible origin record
- Security boundary: the zone still blocks non-read methods everywhere except the exact `POST pentimento.aethe.me/api/debrief` path; malformed debrief input returns the application’s JSON `400`, while an unrelated POST returns Cloudflare `403`
- Recovery: disable the Worker route and return the CNAME to DNS-only to restore the earlier Sites origin

## Beginner-first production evidence record (v2)

Observed beginner confusion triggered a presentation redesign rather than a content reduction. The exact corrected application is commit `8acdddb1ed9491f30e061f38a6bb6a057854eca2`, tagged `pentimento-v2`. The generated Worker was tested before upload, uploaded once as an immutable version, assigned 100% of production traffic, and then tested again through the public custom domain.

| Evidence | Exact result for beginner-first release |
| --- | --- |
| Deployed application commit | `8acdddb1ed9491f30e061f38a6bb6a057854eca2` · annotated tag `pentimento-v2` |
| `npm run typecheck` | PASS · TypeScript completed with no diagnostics |
| `npm test` | PASS · 82/82 unit, schema-boundary, migration, persistence, release-evidence, and API tests |
| `npm audit --audit-level=high` | PASS · 0 vulnerabilities |
| `npm run build:next` | PASS · conventional Next.js production build completed |
| `npm run build` | PASS · Cloudflare-compatible generated Worker completed |
| Generated-Worker acceptance test | PASS · unchanged `dist` Worker at `127.0.0.1:8787`; 14/14 Playwright journeys in 2.0m across desktop and mobile |
| Beginner and accessibility acceptance | PASS · pre-assessment briefing, one-task progression, recoverable wrong choices, exact saved-state restoration, focus handoffs, Axe scans, and 320 / 390 / 768px layouts are covered by the browser contract |
| Screenshot review | PASS · ten desktop/mobile captures recaptured from the generated Worker and visually inspected |
| Hosted acceptance test | PASS · 14/14 Playwright journeys against `https://pentimento.aethe.me` in 2.0m · July 19, 2026 06:01 UTC |
| Public URL and deployed commit agree | PASS · Worker version `6ad39402-8aae-4070-a2c3-95c194bbf063` carries tag `release-8acdddb` and deployment message `Pentimento 8acdddb beginner-first release`; Cloudflare reports 100% traffic and the public root returns HTTP 200 |

## July 19 — complete AI-build route correction

The beginner-first v2 opening fixed presentation order, but a second general-user
review exposed a deeper issue: the experience still began from an unfamiliar
artifact and taught the project through its defects. A first-time builder needed
the whole route from nothing—what kind of tool to open, where the work lives,
what to ask, how to build in small changes, how to check it, and how one saved
version becomes a public link.

The human clarified that Pentimento must be a deep educational experience, not
a project generator or a real tool that builds on the learner’s behalf. Content
quality and interaction quality remained the primary bar.

Codex then rebuilt the product around eight literal stops:

1. reduce an overloaded idea to one complete first version;
2. distinguish an AI workspace, project home, and web host;
3. create a recoverable folder, Git history, and GitHub copy;
4. assemble a bounded planning request before edits;
5. work through three ask → inspect → run → check → save cycles;
6. find and repair factual, phone-layout, and contact-path defects;
7. distinguish local, GitHub, preview, live, and recovery states; and
8. make one approved post-launch update without rebuilding the project.

The correction also:

- replaced technical lane names with the beginner-facing choices “Everything in
  one website” and “Files and history you control” while preserving the real
  tradeoffs underneath;
- introduced a current product-name decoder only after the durable three-role
  map;
- made all ten First AI Build Playbook cards, the glossary, and the first
  seven-day route available from the beginning;
- kept one coherent Repair Café project across every stop;
- added strict v3 saved-state parsing and exact sub-step restoration;
- made the mobile route keep the current stop visible;
- rebuilt the optional GPT‑5.6 boundary as a Teaching Mirror for the learner’s
  own first-version brief, with no score, generation, publication, repository
  access, or external action; and
- recaptured the final desktop/mobile gallery from the public production
  artifact.

## Complete-route production evidence record (v3)

The exact deployed application is commit
`93135b6133fc0cf153a0fabf6856792a078204a5`, preserved by annotated tag
`pentimento-v3`. Its generated Worker was tested locally before upload,
uploaded as an immutable Cloudflare version, assigned 100% of production
traffic, and then tested again through the public custom domain.

| Evidence | Exact result for complete-route release |
| --- | --- |
| Deployed application commit | `93135b6133fc0cf153a0fabf6856792a078204a5` · annotated tag `pentimento-v3` |
| `npm ci` | PASS · 233 packages installed from the exact lockfile; audit reported 0 vulnerabilities |
| `npm run typecheck` | PASS · TypeScript completed with no diagnostics |
| `npm test` | PASS · 90/90 authored-state, persistence, schema-boundary, fallback, and API tests |
| Development acceptance | PASS · 14/14 desktop/mobile Playwright journeys in 1.1m |
| `npm run build:next` | PASS · Next.js 16.2.10 production build; static root/icon and dynamic debrief route classified |
| `npm run build` | PASS · all five Vinext environments built; Sites metadata copied into `dist/.openai/hosting.json` |
| Generated-Worker acceptance | PASS · unchanged `dist` Worker at `127.0.0.1:8787`; 14/14 desktop/mobile journeys in 57.0s |
| Dependency and diff review | PASS · 0 audit vulnerabilities; `git diff --check` clean; no credential file tracked |
| Screenshot review | PASS · nine v3 desktop/mobile captures recaptured from `https://pentimento.aethe.me` and visually inspected; 320px/390px browser contract reports no document overflow |
| Hosted acceptance | PASS · 14/14 Playwright journeys against `https://pentimento.aethe.me` in 53.3s · July 19, 2026 08:05 UTC |
| Public URL and deployed commit agree | PASS · Worker version `d13e8f31-5853-47fb-b5fe-9c9e8d4aeacd` carries tag `release-93135b6` and deployment message `Pentimento 93135b6 AI project studio release`; deployment `897ee240-ee50-4adc-8bd3-ebc441fec98f` assigns it 100% traffic |
| Public boundary checks | PASS · root and icon return `200`; valid Teaching Mirror request returns structured authored fallback; malformed request returns application `400`; unrelated POST remains blocked with Cloudflare `403` |

Production currently returns the explicitly labelled authored Teaching Mirror
fallback because the Worker has no server-side OpenAI key. The `gpt-5.6`
Responses API path, strict input/output schemas, `store: false`, bounded output,
hashed safety identifier, rate limit, and deterministic failure fallback are
implemented and tested. Live mode can be enabled with the documented
server-only variables without changing the authored route.

The previous production Worker version
`6ad39402-8aae-4070-a2c3-95c194bbf063` remains the known rollback target.

The implementation acceptance contract is [QUALITY_STANDARD.md](QUALITY_STANDARD.md), and the submission closeout is [HACKATHON.md](HACKATHON.md).

## Required submission evidence

- Primary Codex `/feedback` Session ID: **TODO before submission**
- Public repository: [github.com/Lawrence-eth/measure-twice](https://github.com/Lawrence-eth/measure-twice)
- Public experience: [pentimento.aethe.me](https://pentimento.aethe.me)
- Public YouTube demo under three minutes: **TODO before submission**
