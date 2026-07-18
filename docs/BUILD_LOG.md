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

GPT‑5.6 is used only for an optional closing debrief. After the server validates the complete v2 mission and recomputes its deterministic evidence profile, the model receives those derived observations plus the learner’s optional reflection. It returns schema-constrained language describing a strongest observed habit, the next habit to repeat, concrete next-project moves, and a practice challenge.

The integration uses the OpenAI Responses API, Zod Structured Outputs, `store: false`, bounded output, low reasoning effort, a hashed safety identifier, and deterministic fallback. The model never decides whether the learner was correct or whether a release is ready.

## Final-candidate evidence record

The exact Pentimento release commit must earn its own evidence. This record belongs to the candidate tagged `pentimento-v1`; the tag and Sites version metadata resolve to the immutable submitted SHA without creating a self-referential commit hash inside the commit itself. Results are not carried forward from Measure Twice or an earlier Pentimento edit.

| Evidence | Exact result for submitted commit |
| --- | --- |
| Submitted commit | Annotated release tag `pentimento-v1`; exact SHA also recorded by the Sites version |
| `npm run typecheck` | PASS · TypeScript completed with no diagnostics · July 18, 2026 15:55 UTC |
| `npm test` | PASS · 82/82 unit, schema-boundary, migration, release-evidence, and API tests |
| `npm run test:e2e` | PASS · 8/8 Chromium journeys across desktop and mobile projects; includes Axe scans, wrong paths, keyboard dialogs, native controls, release derivation, and debrief |
| `npm run build:next` | PASS · Next.js 16.2.10 production build; static page, icon, and dynamic debrief route classified |
| `npm run build` | PASS · five Vinext environments built; Sites metadata copied into `dist/.openai/hosting.json` |
| Local generated-Worker smoke test | PASS · unchanged `dist` Worker at `127.0.0.1:8787`; 8/8 E2E including `/api/debrief` |
| Dependency audit | PASS · `npm audit --audit-level=high` reported 0 vulnerabilities |
| 320 / 390 / 768 / desktop screenshot review | PASS · no document overflow; 390px defect is intentionally clipped inside its device frame; eight final screenshots recaptured from the Worker artifact |
| Hosted desktop/mobile core-path smoke test | Pending until the exact Sites version is deployed; never inferred from local evidence |
| Public URL and deployed commit agree | Pending until Sites returns a successful deployment record and the custom-domain smoke test passes |

The implementation acceptance contract is [QUALITY_STANDARD.md](QUALITY_STANDARD.md), and the submission closeout is [HACKATHON.md](HACKATHON.md).

## Required submission evidence

- Primary Codex `/feedback` Session ID: **TODO before submission**
- Public repository: [github.com/Lawrence-eth/measure-twice](https://github.com/Lawrence-eth/measure-twice)
- Public experience: [pentimento.aethe.me](https://pentimento.aethe.me)
- Public YouTube demo under three minutes: **TODO before submission**
