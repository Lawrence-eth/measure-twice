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

Codex helped design and implement the Willow Fix Day scenario, deterministic progress/evidence model, authored feedback, optional GPT‑5.6 debrief boundary, responsive interface, tests, and Cloudflare-compatible artifact.

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
- reordered mobile content so task instructions always precede the Willow Fix Day artifact;
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
- kept one coherent Willow Fix Day project across every stop;
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

## July 19 — cognitive-load and transfer correction

The human reviewed v3 as a general user and found that, despite its depth, it
still exposed too much curriculum at once and did not make the first useful
action obvious enough. The correction was not to remove the method. It was to
make the method learnable: one promise, one current task, one visible action,
and optional depth only when the learner asks for it.

Codex rebuilt the product as the v4 guided simulation:

- a literal opening promise — “Learn to build with AI. One clear step at a
  time.” — with time, safety boundary, and one primary action;
- eight stops and exactly thirteen consequential interactions;
- one persistent Willow Fix Day project whose earlier decisions remain visible
  as Pentimento layers;
- a mobile-first current task, with the project canvas collapsed until opened;
- short, causal wrong-choice consequences instead of generic correction;
- a five-level evidence ladder and a required fail → bounded repair → retry
  sequence;
- a truthful separation between build-time AI and runtime AI;
- route-specific completion guidance that defines folder, README, brief, Git,
  commit, push, and GitHub in plain language;
- a five-card Playbook with one milestone open at a time and a copyable,
  step-by-step project-home request;
- a local-first four-step Teaching Mirror that creates the reusable V1 brief
  before any optional network request; and
- explicit focus restoration, 44px mobile targets, reduced-motion behavior,
  and a 320px sticky overview action.

Independent beginner and accessibility audits found and closed the final
transfer, focus, reflow, touch-target, and small-screen dead-end issues before
the production candidate was frozen.

## Calm guided-simulation production evidence record (v4)

The exact application release is commit
`3555cfdc3e28d554b11facee4028a8303d6ac603`, preserved by annotated tag
`pentimento-v4`. The generated Worker was tested before upload, uploaded once
as an immutable version, assigned 100% of production traffic, and then tested
again through the public custom domain.

| Evidence | Exact result for v4 |
| --- | --- |
| Deployed application commit | `3555cfdc3e28d554b11facee4028a8303d6ac603` · annotated tag `pentimento-v4` · pushed to public `main` |
| `npm run typecheck` | PASS · TypeScript completed with no diagnostics |
| `npm test` | PASS · 96/96 progress, persistence, schema-boundary, authored-fallback, and API tests |
| `npm run build:next` | PASS · Next.js 16.2.10 production build; static root/icon and dynamic debrief route classified |
| `npm run build` | PASS · all five Vinext environments built; hosting metadata copied into the generated Cloudflare artifact |
| Dependency audit | PASS · `npm audit --audit-level=high` reported 0 vulnerabilities |
| Density contract | PASS on development, generated Worker, and public host · zero threshold violations; every core task and action starts in the first 390×844 viewport; no horizontal overflow |
| Beginner clarity gate | PASS at 320×844 and 390×844 · no P0/P1 comprehension blockers; repository handoff defines unfamiliar terms and supplies a copyable first setup request |
| Accessibility/reflow gate | PASS · Axe A/AA, complete keyboard route, dialog focus/return, reduced motion, 44px visible mobile controls, 320/390/768/1440 widths, and 200%-zoom-equivalent layout |
| Generated-Worker acceptance | PASS · unchanged `dist` Worker at `127.0.0.1:8787`; 28/28 desktop/mobile Playwright checks in 1.8m |
| Hosted acceptance | PASS · 28/28 desktop/mobile Playwright checks against `https://pentimento.aethe.me` in 1.7m · July 19, 2026 10:39 UTC |
| Public boundary matrix | PASS · root `200`; icon `200`; valid Teaching Mirror request `200` with two questions and three moves; invalid request `400`; unrelated POST blocked by Cloudflare `403` |
| Burst availability check | PASS · 60/60 rapid public HEAD requests returned `200`; Pentimento is excluded from the unrelated zone-wide 40-request/10-second rule while the rest of `aethe.me` remains protected |
| Hosted screenshot review | PASS · nine desktop/mobile release captures regenerated from the exact public artifact and visually inspected |
| Public repository | PASS · signed-out HTTP request returned `200` and exposed the MIT-licensed `Lawrence-eth/measure-twice` repository |
| Public URL and deployed commit agree | PASS · Worker version `698bc602-2f46-470e-8fe5-6c06b0eecd24`, tagged `release-3555cfd`, carries the v4 deployment message; deployment `41f90155-db69-474e-a781-5572bcfbc736` assigns it 100% traffic |

### v4 production routing and recovery

- Worker: `pentimento`
- Route: `pentimento.aethe.me/*`
- DNS: proxied CNAME to `custom-domains.chatgpt.site`; the Worker route serves
  the application
- Write boundary: Cloudflare blocks non-read methods except the exact
  `POST /api/debrief` path; the application validates shape and size and
  rate-limits live reflection
- Production reflection mode: explicitly labelled deterministic fallback; no
  server-side OpenAI key is installed in the Worker
- Rollback version: `d13e8f31-5853-47fb-b5fe-9c9e8d4aeacd` (`pentimento-v3`)

The public v4 experience is complete without a key. Live GPT‑5.6 reflection
remains implemented behind the documented server-only configuration and must
be described as optional; authored fallback output must never be presented as
a live model result.

The current implementation acceptance contract is
[FINAL_EXPERIENCE.md](FINAL_EXPERIENCE.md), and the submission closeout is
[HACKATHON.md](HACKATHON.md). The current quality gates are in
[QUALITY_STANDARD.md](QUALITY_STANDARD.md); every dated evidence record in this
log remains scoped to the exact release that earned it.

## Required submission evidence

- Primary Codex `/feedback` Session ID: **TODO before submission**
- Public repository: [github.com/Lawrence-eth/measure-twice](https://github.com/Lawrence-eth/measure-twice)
- Public experience:
  [pentimento.law-ender.chatgpt.site](https://pentimento.law-ender.chatgpt.site)
- Public YouTube demo under three minutes: **TODO before submission**

## Native ChatGPT Sites migration — July 19, 2026

The repository was rebound from an inaccessible Sites project in the
`eason9504315` namespace to a new project created under the currently connected
Sites identity with the intended `pentimento` slug. The old deployment was not
deleted.

| Check | Result |
| --- | --- |
| New native production URL | PASS · `https://pentimento.law-ender.chatgpt.site` returned HTTP `200` |
| Site access | PASS · public |
| Source binding | PASS · `.openai/hosting.json` points to the new Sites project |
| Typecheck | PASS |
| Unit tests | PASS · 96/96 |
| Sites-compatible production build | PASS |
| Hosted acceptance | PASS · 28/28 desktop/mobile Playwright checks against the new native URL · July 19, 2026 13:50 UTC |

## July 19 — Reveal and learning-transfer correction (v5 candidate)

Another general-user review found that v4 was calmer but still did not earn the
learner's attention. It stated the route without making the underlying risk
felt, successful answers advanced before their teaching could be absorbed, and
the mobile layout hid the central project canvas by default. The human asked
for more useful depth, clearer importance, stronger step-by-step motivation,
and a more elegant interactive experience—not simply more copy.

Codex audited the implemented journey, separated content depth from required
screen density, and rebuilt the candidate around a stronger educational arc:

- an opening **Reveal** presents a polished AI-made page, lets the learner
  observe its important action fail, and exposes Promise, Project home,
  Evidence, and Release beneath the surface;
- the thesis is now explicit: AI can make the surface quickly, while the human
  must decide what to build first, where the work lives, how to ask for changes,
  what counts as proof, which version publishes, and how it can be recovered;
- eight stops are grouped into four chapters—Shape the promise, Ground the
  work, Direct the build, and Prove the release—so the route has a memorable
  conceptual structure;
- correct decisions no longer auto-advance; causal feedback stays visible
  while the learner inspects a reusable rule, its use moment, and the failure it
  prevents;
- each stop ends with an explicitly named Playbook-note checkpoint, and the
  eight stop-level notes accumulate into the existing five-card take-home
  Playbook rather than implying eight new cards;
- the persistent **Field guide** makes those five milestone cards reachable
  beside the current task;
- the project canvas switches between **Visitor surface** and **Project
  underneath**, keeping the Pentimento metaphor interactive and available on
  narrow screens; and
- contextual field notes organize detailed instruction around Why, Make, Proof,
  and Avoid so comprehensive content remains useful without becoming a wall of
  text.

Codex contributed the beginner audit, information architecture, authored
content refinement, interaction-state correction, component and visual-system
implementation, accessibility-minded focus behavior, test adaptation, and
documentation alignment. The human made the decisive product judgments: the
site must first explain itself, demonstrate why the problem matters, value
content quality over feature count, preserve a beginner's agency, and use an
elegant interaction rather than a conventional course interface.

Local v5 candidate verification completed on July 19, 2026 at 14:55 UTC:

| Check | Result |
| --- | --- |
| Typecheck | PASS |
| Unit tests | PASS · 96/96 |
| Full browser suite | PASS · 30/30 across desktop and mobile Chromium |
| Core keyboard route | PASS · desktop and mobile |
| Automated accessibility | PASS · no Axe violations across the core route |
| Responsive overflow | PASS · complete route at 320, 390, 768, and 1440px |
| Experience-density audit | PASS · desktop and mobile · zero threshold violations |
| Sites-compatible production build | PASS |
| Visual review | PASS · opening, Reveal, first decision, checkpoint, and default-open mobile canvas |

The exact candidate was then saved and verified in production on July 19, 2026
at 15:05 UTC:

| Check | Result |
| --- | --- |
| Deployed source | PASS · `84304ce0440ff6ab2a606b4902b4dfe197203b6e` |
| Sites version | PASS · version 3 |
| Production deployment | PASS · `appgdep_6a5ce5ef6e588191a682e7a37d5e65d5` |
| Native public URL | PASS · `https://pentimento.law-ender.chatgpt.site` returned HTTP `200` |
| Hosted browser suite | PASS · 30/30 desktop/mobile Chromium checks |
| Hosted interaction coverage | PASS · Reveal, four chapters, 13 decisions, eight Playbook-note saves, Field Guide, canvas lenses, persistence, restart, keyboard, Axe, reduced motion, and 320/390/768/1440px overflow |
| Production reflection mode | PASS · no runtime environment entries; `/api/debrief` returned `mode: "demo"` with two questions and three next moves |
| Rollback target | PASS · Sites version 2 · `ada4a48615f7931324dc3afc70d99880ec4e2b1d` |

## July 19 — Refined interaction release

A final user review identified a presentation-quality problem rather than a
curriculum problem: the two opening actions felt crowded, motion felt abrupt,
and several controls still looked like generic interface components. Codex
treated this as a system-level interaction pass rather than adding more
content.

The release gives the primary and overview actions distinct visual roles and a
measured vertical separation, replaces hard offset effects with quieter depth,
adds restrained state transitions to choices, feedback, dialogs, route
controls, and the surface/underlayers lens, and gives the opening Reveal a
deliberate inspection sequence. Focus now moves to the next available audit
action, reduced-motion users receive automatic rather than smooth scrolling,
forced-colors states remain explicit, and decorative button glyphs do not alter
accessible names. The initial entrance uses movement without fading text, so
content is immediately readable and cannot be sampled at reduced contrast.

The exact refinement was verified and published on July 19, 2026 at 16:15 UTC:

| Check | Result |
| --- | --- |
| Deployed source | PASS · `0ac40c9b7f08acafa687322cd4d4188785f03f44` |
| Sites version | PASS · version 4 |
| Production deployment | PASS · `appgdep_6a5cf7cfa3e081919637286b10e33854` |
| Native public URL | PASS · `https://pentimento.law-ender.chatgpt.site` |
| Typecheck and build | PASS |
| Unit tests | PASS · 96/96 |
| Local browser suite | PASS · 30/30 across desktop and mobile Chromium |
| Local experience-density audit | PASS · desktop and mobile · zero gated violations |
| Production critical path | PASS · 5/5 hosted Playwright checks covering Reveal, reduced motion, and core-route Axe |
| Production action separation | PASS · 22px at 320/390px; 24px at 768/1440px |
| Production responsive overflow | PASS · zero opening overflow at 320, 390, 768, and 1440px |
| Rollback target | PASS · Sites version 3 · `84304ce0440ff6ab2a606b4902b4dfe197203b6e` |

## July 20 — Conservation Lab v6 production release

The final presentation pass rebuilt Pentimento as a quieter Conservation Lab:
a single orientation screen, one worked spectral inspection, a deliberately
separated primary and optional opening action, restrained motion, flatter
controls, and a more explicit eight-stop learning contract. The content,
interaction, and responsive checks were frozen before the release artifact was
built.

The exact application source was committed, pushed to the public GitHub
repository and the configured Sites source branch, built once from that source,
saved as immutable Sites version 5, and deployed to the existing public
Pentimento address.

| Check | Result |
| --- | --- |
| Deployed source | PASS · `f0934095791555d3bc7c089a9136599a47595df4` · annotated tag `pentimento-v6` |
| Sites version | PASS · version 5 · `appgprj_6a5cd40f4f5c81919c4fcd84e7ef2709~appgver_6b8e33c852d08191aa022bf4799d4d0b` |
| Production deployment | PASS · `appgdep_6a5d9f4f207481919ff4869f65d00b8e` |
| Native public URL | PASS · `https://pentimento.law-ender.chatgpt.site` returned HTTP `200` |
| Typecheck | PASS · no diagnostics |
| Unit tests | PASS · 96/96 |
| Next.js production build | PASS |
| Sites-compatible Vinext build | PASS · 514 client modules; 73-file deploy artifact |
| Dependency audit | PASS · 0 high-severity vulnerabilities |
| Local browser suite | PASS · 30/30 desktop/mobile Chromium checks |
| Local experience-density audit | PASS · zero gated violations |
| Generated Worker | PASS · root/icon `200`, invalid reflection `400`, valid reflection `200` |
| Production endpoint boundary | PASS · root/icon `200`, invalid reflection `400`, valid reflection `200` |
| Hosted browser suite | PASS · 30/30 desktop/mobile Chromium · July 20, 2026 04:20 UTC |
| Hosted interaction coverage | PASS · both tool lanes, 13 decisions, eight note saves, Build kit, V1 brief workshop, persistence, fail/repair/retry, restart, keyboard-only route, dialog focus, Axe, reduced motion, and full 320/390/768/1440px reflow |
| Hosted experience-density audit | PASS · desktop and mobile · zero gated violations and no horizontal overflow |
| Production reflection mode | PASS · deterministic fallback; valid response reported `mode: "demo"`, two unresolved questions, and three next moves |
| Public repository | PASS · signed-out GitHub request returned HTTP `200` |
| Rollback target | PASS · Sites version 4 · `0ac40c9b7f08acafa687322cd4d4188785f03f44` |

The first hosted matrix began while production edge propagation was still
settling: one browser received the previous v4 opening while 29 v5 checks
passed. After propagation, the affected route passed five consecutive
fresh-browser repetitions and the complete hosted matrix passed 30/30. The
final acceptance result above is the clean post-propagation run.

## July 20 — Interaction rhythm refinement

A final general-user review found that the Conservation Lab still felt more
static than interactive and that several adjacent controls read as one crowded
cluster. The refinement keeps the curriculum intact while giving decisions,
feedback, dialogs, and workshop steps a coherent motion and spacing language.

Choice rows now behave like deliberate instruments: they have distinct
boundaries, a restrained selection rail, and an arrow-to-check state change.
Consequences expand in place instead of appearing abruptly. Stage, task,
canvas, Build kit, and workshop transitions share one easing system; explicit
scrolls respect reduced motion. Primary, secondary, text, header, completion,
and restart actions now use consistent separation and state feedback.

The pass also corrected the less visible interaction details:

- the Build kit no longer scrolls its own title and close control out of view
  on a 720px-high desktop;
- the mobile route overview footer follows the final chapter with a measured
  17px gap instead of covering it;
- mobile lesson chrome was tightened without reducing the 10px separation
  between decision controls;
- live-region feedback no longer announces the same state twice; and
- each V1 workshop step re-enters as a distinct, focused scene.

The exact refinement was saved and published on July 20, 2026 at 05:20 UTC:

| Check | Result |
| --- | --- |
| Deployed source | PASS · `e468794af3c214a30afb742ef3a572b852e79677` |
| Sites version | PASS · version 6 · `appgprj_6a5cd40f4f5c81919c4fcd84e7ef2709~appgver_87e40fb7ee7c8191acdbbdd0c39c314d` |
| Production deployment | PASS · `appgdep_6a5dafe545c081919dd279abca80bc58` |
| Native public URL | PASS · `https://pentimento.law-ender.chatgpt.site` returned HTTP `200` |
| Typecheck | PASS · no diagnostics |
| Unit tests | PASS · 96/96 |
| Next.js and Sites-compatible Vinext builds | PASS |
| Runtime dependency audit | PASS · zero vulnerabilities |
| Local interaction coverage | PASS · core route, Build kit, workshop, persistence, repair/retry, restart, keyboard, Axe, and reduced motion |
| Local responsive matrix | PASS · 320, 390, 768, and 1440px; zero horizontal overflow |
| Generated Worker | PASS · root/icon `200`, invalid reflection `400`, valid reflection `200` |
| Hosted critical paths | PASS · desktop and mobile core journey, Build kit, workshop, reduced motion, and Axe |
| Hosted experience-density audit | PASS · desktop and mobile · zero gated violations |
| Production endpoint boundary | PASS · root/icon `200`, invalid reflection `400`, valid reflection `200` |
| Short-desktop Build kit geometry | PASS · `0px` position and scroll shift before/open/close at 1440×720 |
| Mobile route overview | PASS · `17px` chapter-to-footer gap and `0px` overlap at 390×844 |
| Rollback target | PASS · Sites version 5 · `f0934095791555d3bc7c089a9136599a47595df4` |

## July 20 — Deliberately authored v7 production release

A second general-user review found that smoother controls alone did not create
a smoother lesson. Pentimento v7 therefore rebuilt the reading rhythm around
one repeatable sequence: make a decision, inspect its visible consequence,
open a concise lesson receipt in the same place, and deliberately continue.
The route no longer grows by appending a separate checkpoint below every task.
Native view transitions preserve the learner's reading position while
task-to-receipt, stage, canvas, dialog, and workshop changes share one motion
grammar.

The curriculum now contains 14 consequential interactions. A preview is
explicitly a candidate rather than human evidence; Check requires the learner
to observe the broken action, make one bounded repair, and repeat the exact
path; Go live requires opening and using the public version; and Improve adds
an affected-reading and smoke-check decision. The Tools stop begins with the
three durable responsibilities—build, remember, publish—before asking for a
route. The V1 workshop carries the learner's person, moment, result, path,
facts, boundaries, and observable finish line forward with persistent examples
and a live brief summary.

The exact source was pushed to GitHub and the configured Sites source branch,
built as a 73-file Vinext artifact, saved as immutable Sites version 7, and
deployed to the existing public Pentimento address on July 20, 2026 at 07:26
UTC.

| Check | Result |
| --- | --- |
| Deployed source | PASS · `c87603c7ca77c3d086c7d5b09048a52b47720a95` |
| Sites version | PASS · version 7 · `appgprj_6a5cd40f4f5c81919c4fcd84e7ef2709~appgver_d37545258b2c819186fc8860d07843a7` |
| Production deployment | PASS · `appgdep_6a5dcd8729ec81919d7671083d9651c1` |
| Native public URL | PASS · `https://pentimento.law-ender.chatgpt.site` returned HTTP `200` |
| Typecheck | PASS · no diagnostics |
| Unit and API tests | PASS · 96/96 |
| Sites-compatible Vinext build | PASS · 514 client modules; 73-file deploy artifact |
| Generated Worker boundary | PASS · root/icon `200`; invalid reflection `400` |
| Local core-route acceptance | PASS · desktop and mobile 14-decision journeys |
| Local route-wide accessibility | PASS · desktop and mobile Axe |
| Local responsive matrix | PASS · 320, 390, 768, and 1440px; zero horizontal overflow |
| Production endpoint boundary | PASS · root/icon `200`; invalid reflection `400` |
| Hosted core-route acceptance | PASS · mobile route plus two consecutive fresh desktop routes after propagation |
| Hosted route-wide accessibility | PASS · desktop and mobile Axe |
| Production reflection mode | PASS · deterministic fallback |
| Rollback target | PASS · Sites version 6 · `e468794af3c214a30afb742ef3a572b852e79677` |

The first production matrix overlapped edge propagation: one desktop browser
received the previous version 6 lesson receipt while the other three routes
passed. After propagation, the affected desktop journey passed twice in
consecutive fresh browser contexts. The final acceptance evidence above uses
the clean post-propagation results.

## July 20 — Editorial prologue v8 production release

Judge-facing review showed that the lesson still asked for attention before it
had earned it. Pentimento v8 replaces the static welcome with a natural-scroll
editorial prologue. One Willow Fix Day artifact stays present while four beats
change its meaning: AI’s polished claim, an observed failed action, four hidden
project responsibilities, and the Shape → Ground → Direct → Prove method. The
closing threshold states the work, duration, safety boundary, and five
take-home tools before handing the visible Build kit into the first evidence
check.

The implementation preserves ordinary scrolling and reverse scrolling. It
uses a deterministic Intersection Observer only to synchronize the persistent
artifact; all teaching text remains semantic and readable without motion.
Desktop uses a 55/45 sticky composition. Tablet and mobile place the artifact
above the current beat and keep headings clear of it. The scroll cue moves
keyboard focus beneath the sticky header, the skip path focuses the evidence
check, reduced-motion mode removes the spectral scan and View Transitions, and
the final shared-object handoff avoids the browser’s default ghosted
cross-fade.

The exact source was pushed to GitHub and the configured Sites source branch,
built as a 73-file Vinext artifact, saved as immutable Sites version 8, and
deployed to the existing public Pentimento address on July 20, 2026 at 15:13
UTC.

| Check | Result |
| --- | --- |
| Deployed source | PASS · `fc0b4f5e85095236edf471cad1750e89235e6809` |
| Sites version | PASS · version 8 · `appgprj_6a5cd40f4f5c81919c4fcd84e7ef2709~appgver_decac58e4d6481919b185f9147022827` |
| Production deployment | PASS · `appgdep_6a5e3af13d9481918bbf071f5bb669ac` |
| Native public URL | PASS · `https://pentimento.law-ender.chatgpt.site` returned HTTP `200` |
| Typecheck | PASS · no diagnostics |
| Unit and API tests | PASS · 96/96 |
| Next.js and Sites-compatible Vinext builds | PASS · 514 client modules; 73-file deploy artifact |
| Local browser suite | PASS · 30/30 desktop/mobile Chromium checks in 11.1 minutes |
| Editorial-prologue coverage | PASS · all four beats, scroll/focus transfer, skip path, shared handoff, and first evidence check |
| Local responsive matrix | PASS · prologue and full route at 320, 390, 768, and 1440px; zero horizontal overflow and no sticky-heading overlap |
| Local accessibility and motion | PASS · route-wide Axe, keyboard-only journey, reduced motion, focus return, and text-equivalent states |
| Generated Worker boundary | PASS · root/icon `200`; valid reflection `200` with `mode: "demo"` |
| Hosted opening and core route | PASS · fresh desktop/mobile prologue and 14-decision journeys after edge propagation |
| Hosted route-wide accessibility | PASS · desktop and mobile Axe |
| Production endpoint boundary | PASS · root/icon `200`; valid reflection reported `mode: "demo"` |
| Rollback target | PASS · Sites version 7 · `c87603c7ca77c3d086c7d5b09048a52b47720a95` |

The first hosted check overlapped edge propagation: three browser contexts
received the previous v7 opening while the other three v8 journeys, including
both route-wide Axe runs, passed. Repeated asset probes then resolved
exclusively to the v8 bundle. The affected fresh desktop/mobile opening and
complete 14-decision journeys all passed in the clean post-propagation run.

## July 20 — Six-folio v9 production release

Another complete beginner review found two remaining product problems. First,
the v8 opening still required six to eight mobile viewports before the learner
reached the lesson, disclosed the email failure in prose, and then staged the
same failure again in a separate inspection and later Check. Second, its
continuous scroll, stacked transitions, tall mobile canvas, and dense header
made the experience feel like a long page rather than a deliberately composed
field lesson.

The v9 release rebuilds the opening as six numbered folios in the root page
scroll:

1. What Pentimento is.
2. The untested AI claim.
3. The learner’s actual Email test.
4. The four hidden project layers.
5. The interactive Shape/Ground/Direct/Prove method.
6. The handoff into the eight-stop lesson.

The claim no longer spoils the failure. The Email action on folio 02 is the one
opening evidence event. When observed, it persists as
`introFailureObserved`; Check later begins by asking the learner to record the
failure they already found. Entering without that evidence still preserves a
complete Check path.

The browser document owns scrolling. Mandatory page settlement is restricted to
tall fine-pointer layouts, touch uses proximity, and short or reduced-motion
layouts use normal scrolling. Desktop preserves one specimen beside the middle
folios; mobile uses compact inline specimens. The folio rail changes only after
new prose enters the reading line.

The lesson shell now has one secondary **Lesson map** action, a compact mobile
header, a closed narrow-screen **Project layer updated** disclosure, and shorter
previous-receipt framing. Correct consequences stay in place with no delayed
automatic scroll. **Save this lesson** produces
**Lesson receipt · practice saved · n / 8**. The wording no longer implies that
each receipt creates another guide; five Build-kit guides remain available.

Completion now says the learner practiced a method rather than claiming
transfer or mastery. It leads with **Create my V1 brief**. The workshop accepts
useful concise answers, focuses the first incomplete field, keeps actions
visible on short viewports, supports editing, and identifies the reflection
source explicitly. Demo results are labelled
**Authored example · deterministic, no live AI call**; only successful live
results may say **GPT-5.6 reflection · live**.

The earlier full-root View Transition was removed from scene changes so the
stable shell and destination entrance cannot create double, blank, or ghost
frames. Motion is owned by one layer at a time.

The exact source was pushed to GitHub and the configured Sites source branch,
built as a 73-file Vinext artifact, saved as immutable Sites version 9, and
deployed to the existing public Pentimento address on July 20, 2026 at 17:10
UTC. Fresh desktop and mobile browser contexts then completed the hosted
opening, complete 14-decision route, and route-wide Axe checks. The desktop
hosted matrix also completed the full V1 workshop.

| Check | Result |
| --- | --- |
| Deployed source | PASS · `c79b989c9df8253298d0eb807d2a5e516fca3bff` |
| Sites version | PASS · version 9 · `appgprj_6a5cd40f4f5c81919c4fcd84e7ef2709~appgver_328f62416d6c81918db6ef5fb27595f7` |
| Production deployment | PASS · `appgdep_6a5e5663bdc88191a21301e7bca6cf52` |
| Native public URL | PASS · `https://pentimento.law-ender.chatgpt.site` returned HTTP `200` |
| Typecheck | PASS · no diagnostics |
| Unit and API tests | PASS · 97/97 |
| Runtime dependency audit | PASS · zero vulnerabilities |
| Sites-compatible Vinext build | PASS · 514 client modules; 73-file deploy artifact |
| Local interaction matrix | PASS · 15 focused Chromium scenarios; both tool lanes, full route, persistence, repair/retry, restart, keyboard, reduced motion, Axe, workshop, and narrow layouts |
| Local responsive matrix | PASS · 320, 390, 768, and 1440px; no horizontal overflow or blocked action |
| Exact production artifact | PASS · all six JS/CSS assets `200`; hydrated desktop 6/6 and mobile 3/3 critical journeys |
| Exact-artifact Lighthouse | PASS · mobile 91/100/100/100; desktop 100/100/100/100 for performance/accessibility/best practices/SEO |
| Hosted desktop acceptance | PASS · six-folio evidence path, 14-decision route, V1 workshop, and route-wide Axe |
| Hosted mobile acceptance | PASS · six-folio evidence path, 14-decision route, and route-wide Axe |
| Hosted accessibility | PASS · zero automated Axe violations in desktop and mobile route sweeps |
| Production endpoint boundary | PASS · root/icon/assets `200`; invalid reflection `400`; valid authored reflection `200` with `mode: "demo"` |
| Hosted Lighthouse | PASS · mobile 91/100/81/100; desktop 100/100/81/100 |
| Rollback target | PASS · Sites version 8 · `fc0b4f5e85095236edf471cad1750e89235e6809` |

The hosted Best Practices score is 81 because the ChatGPT Sites delivery layer
injects a Cloudflare challenge script that Lighthouse flags for three
deprecated browser APIs and serves the document with `cache-control: no-store`.
The same exact application artifact scores 100 locally for Best Practices,
logs no console errors, and has no Inspector issues; the hosting-layer findings
are not emitted by Pentimento source.

## July 21 — Responsive folio v10.3 production release

A full release audit found that the six-folio concept was correct but its
smallest presentation still needed exacting finish work. Pentimento v10.3
keeps every opening folio page-sized down to 320×640, gives the browser one
clear snap destination per page, and preserves the complete teaching layer
when Evidence, Release, or Prove is expanded. The failed Email state now keeps
its evidence styling on hover, and the folio rail changes color without a
transient reduced-motion contrast frame.

The final source was pushed to GitHub and the configured ChatGPT Sites source
branch, built once as a 73-file Vinext artifact, saved as immutable Sites
version 7, and published through both ChatGPT Sites and the existing
`pentimento.aethe.me` Cloudflare Worker route. The branded domain serves the
same verified CSS and JavaScript bytes as the accepted build.

| Check | Result |
| --- | --- |
| Deployed source | PASS · `430bd85234f2975fa1642cd9dc4f0a80a05f26c9` |
| ChatGPT Sites version | PASS · version 7 · `appgprj_6a5b7bb5c4d881918b82a25beee7b6ff~appgver_f6701b8732288191b8521a38f0f18902` |
| ChatGPT Sites deployment | PASS · `appgdep_6a5f1108f43081918545f50350dce587` |
| Native Sites URL | PASS · `https://measure-twice.eason9504315.chatgpt.site` |
| Branded public URL | PASS · `https://pentimento.aethe.me` |
| Cloudflare Worker deployment | PASS · `b49b53b8-4efb-4a69-a9a1-534f108eb247` |
| Cloudflare Worker version | PASS · `65644dee-accc-4826-9318-62eab9abb6dd` at 100% traffic |
| Typecheck | PASS · no diagnostics |
| Unit and API tests | PASS · 97/97 |
| Sites-compatible Vinext build | PASS · 514 client modules; 73-file artifact |
| Generated-artifact acceptance | PASS · 10/10 focused journey, short-phone, Axe, keyboard, and reduced-motion checks |
| Hosted browser matrix | PASS · 34/34 desktop/mobile checks in 10.2 minutes |
| Live visual acceptance | PASS · 320×640, 390×667, and 1440×650; 0px snap error; no clipping, collision, or horizontal overflow |
| Live accessibility acceptance | PASS · zero Axe violations in tested states; visible keyboard focus; controls at least 44px; reduced-motion transitions disabled |
| Exact production assets | PASS · all six referenced JS/CSS files byte-match the generated artifact |
| Production endpoint boundary | PASS · root and API mode `200`; invalid reflection `400`; valid authored reflection `200`; unrelated root POST `403` |
| Production reflection mode | PASS · deterministic `demo` response; no runtime API key required |
| Rollback target | PASS · Worker `25c70ee1-7859-4bf7-bfa2-b3fa7a6b61ce`; Sites version 6 · `1a76a2c4b1bf483509b73fcfc16221dde7119b85` |

Final hosted acceptance completed July 21, 2026 at 06:40 UTC. The earlier
responsive Worker remains an explicit one-version rollback; DNS, routes, and
security rules were unchanged.
