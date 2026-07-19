# OpenAI Build Week submission guide

Category: **Education**

Submission deadline: **July 21, 2026 at 5:00 PM Pacific** (**July 22 at 8:00 AM GMT+8**)

The Official Rules, Devpost form, and notices on [openai.devpost.com](https://openai.devpost.com) remain the source of truth. This file translates the requirements into a Pentimento-specific closeout.

## Project summary

**Name:** Pentimento

**Tagline:** Build your first project with AI—from idea to live link.

**Audience:** A person with an idea and no experience with AI coding tools, project repositories, GitHub, checks, hosting, or deployment.

**Format:** A roughly 25-minute interactive educational simulation with an always-available reusable Playbook and an optional GPT‑5.6 Teaching Mirror.

**Public experience:** [pentimento.aethe.me](https://pentimento.aethe.me)

**Repository:** [github.com/Lawrence-eth/measure-twice](https://github.com/Lawrence-eth/measure-twice)

## Requirement fit

- [x] Fits the **Education** track.
- [x] Created during the submission period.
- [x] Built with Codex as the primary implementation collaborator.
- [x] Uses GPT‑5.6 through a bounded, optional Teaching Mirror.
- [x] Provides a complete deterministic path without credentials or model availability.
- [ ] Verify the final v3 hosted experience requires no account, payment, rebuilding, or external mutation.
- [x] Includes English setup, testing, privacy, limitations, and collaboration documentation.
- [x] Includes an MIT license.
- [x] Repository is prepared to remain public for judging.
- [ ] Freeze the exact submission commit and tag after final verification.
- [ ] Verify and deploy the unchanged production artifact.
- [ ] Record the exact final evidence in `docs/BUILD_LOG.md`.

If the repository becomes private, share it with both `testing@devpost.com` and `build-week-event@openai.com` before submission.

## Required Devpost fields

- [ ] Select **Education**.
- [ ] Add the final project description.
- [ ] Add the public test URL.
- [ ] Add concise judge testing instructions.
- [ ] Add the repository URL.
- [ ] Upload a public YouTube demonstration shorter than three minutes.
- [ ] Confirm the video includes audio explaining both Codex and GPT‑5.6 usage.
- [ ] Add the primary project thread’s `/feedback` Session ID.
- [ ] Submit before the deadline.
- [ ] Capture the Devpost confirmation.

User-controlled submission values:

- YouTube demo URL: **TODO — entrant upload**
- `/feedback` Session ID: **TODO — entrant runs `/feedback` in the primary project thread**
- Devpost confirmation: **TODO — entrant submits and records confirmation**

## Draft project description

> Pentimento is an interactive education experience for people who want to build with AI but do not know where to start. Instead of teaching coding syntax, prompt tricks, or a ranking of products, it follows one fictional Repair Café website through a durable lifecycle. The learner narrows an overloaded idea, distinguishes an AI workspace from a project home and host, compares two starting lanes, creates recoverable project context, assembles a bounded planning request, and works through three small build cycles. They then find factual, phone-layout, and contact-path defects; write a reproducible repair request; verify one exact version; move it from local to GitHub to preview to live; record recovery; and handle the first post-launch update. Every stop contributes a reusable template to an always-available First AI Build Playbook. The core experience is authored, accessible, and key-free. At completion, the learner may explicitly submit their own first-version brief and selected lane to a bounded GPT‑5.6 Teaching Mirror, which returns useful questions and next moves without grading, generating a project, controlling progression, or taking an external action. Codex was the primary collaborator across curriculum design, implementation, accessibility, testing, and deployment.

## Short description

> An elegant, interactive first AI-build journey that teaches the roles, files, requests, checks, saved versions, publication boundary, and recovery path beneath one finished project.

## Judge testing instructions

Use this text in the Devpost testing field, adjusting only if final verified behavior changes:

> Open `https://pentimento.aethe.me` in a current desktop or mobile browser. No account, API key, or setup is required. Choose **Show me the route**: the welcome explains the goal, time, safety boundary, eight stops, and final Playbook before any project decision. Continue through the three-role map and use the layer reveal, then guide the fictional Repair Café from Idea through Improve one focused action at a time. Open **My Playbook** at any point to inspect and copy all ten reusable templates. In Build, follow three ask → inspect → run → check → save cycles. In Check, run the three simulated lenses, assemble the bounded repair request, and compare the saved versions. In Go live, record Local, GitHub, Preview, Live, and Recovery separately. At completion, optionally open the GPT‑5.6 Teaching Mirror and submit a safe first-version brief for your own idea; it reflects a strength, unresolved assumptions, one postpone candidate, a lane tradeoff, and three next moves. Every repository, email, URL, version, and release action inside the lesson is simulated; the hosted experience performs no real external mutation.

Local fallback:

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Keep `DEMO_MODE=true` or omit `OPENAI_API_KEY` for a deterministic Teaching Mirror response.

## Under-three-minute demo storyboard

Aim for **2:40–2:50**, leaving margin below the three-minute limit.

### 0:00–0:20 — literal hook

- Show: “Build your first project with AI—from idea to live link.”
- Show the eight-stop route, “No coding experience needed,” “Nothing real is published,” and the Playbook promise.
- Say: “Pentimento is for someone with an idea who does not know which AI tool to open, where the files live, or how a generated result becomes a checked public link.”

### 0:20–0:40 — distinctive mental model

- Show the three-role map.
- Say: “Tools change, but the durable map is: AI helps build, the project home remembers, and the host publishes.”
- Use the layer reveal to expose the brief, files, requests, checks, and versions beneath the finished page.

### 0:40–1:05 — narrow the idea and choose a lane

- Sort the Repair Café’s event information into version one and defer accounts, booking, payment, live data, chat, and AI advice.
- Show the hosted-builder and repository-aware lanes.
- Say: “Pentimento teaches tradeoffs, not a winner badge. We demonstrate the repository lane because its files and history are visible.”

### 1:05–1:30 — make the project buildable

- Advance the project-home file tree through the folder, brief, Git, commit, and GitHub copy.
- Contrast the vague request with the assembled planning request.
- Highlight trusted facts, not-now boundaries, checks, and “stop before editing.”

### 1:30–1:55 — build and inspect

- Sweep through one ask → inspect → run → check → save cycle.
- Show the three named versions.
- Say: “AI’s completion message is a report. The learner still reads the changed files, tries the path, and saves one understandable state.”

### 1:55–2:18 — defect and repair

- Run the facts, 390px, and contact-path lenses.
- Show the unsupported guarantee, clipped action, and inactive destination.
- Assemble the repair request and reveal checked V4.
- Say: “A useful defect report records what happened, how to reproduce it, what should happen, what must stay, and which checks to repeat.”

### 2:18–2:35 — release and improve

- Move V4 through Local → GitHub → Preview → Live → Recovery.
- Show the simulated release card and one approved post-launch access update.
- Say: “A deployment is not complete until the public path is tried, and a small update should not rebuild a working project.”

### 2:35–2:48 — Playbook, Codex, and GPT‑5.6

- Open the complete First AI Build Playbook.
- Open the optional Teaching Mirror result.
- Say: “Codex helped us research, design, implement, audit, test, and deploy the entire learning experience. GPT‑5.6 is deliberately bounded: the learner explicitly submits only their own brief and lane, and it returns one strength, two unresolved assumptions, one feature to postpone, a tool tradeoff, and three next moves. It never grades, builds, controls progression, or takes an external action.”

Use original narration and interface footage. Do not include copyrighted music, third-party trademarks, credentials, personal information, browser bookmarks, private tabs, or terminal secrets.

## How Codex was used

Codex was the primary build collaborator across:

- concept comparison and Education-track framing;
- current platform and AI-tool-role research;
- beginner problem analysis and curriculum architecture;
- authored Repair Café facts, scope decisions, templates, defects, checks, and releases;
- typed content and versioned progress modeling;
- Next.js and React implementation;
- responsive editorial design and accessible interaction primitives;
- structured GPT‑5.6 boundary design;
- unit, API, browser, Worker, and hosted verification;
- Cloudflare production preparation; and
- README, submission copy, and demo planning.

Codex accelerated implementation, cross-file consistency work, adversarial review, accessibility inspection, test construction, and deployment verification.

The human made the consequential decisions: Education rather than coding instruction, complete beginners as the audience, one coherent project rather than disconnected lessons, tool roles rather than brand rankings, practical content available from the beginning, the Pentimento identity, the editorial visual direction, the bounded model role, and the final quality bar.

## How GPT‑5.6 was used

GPT‑5.6 powers the optional Teaching Mirror at completion.

The learner deliberately supplies:

- their own first-version brief; and
- their hosted-builder or repository-aware lane.

The model returns a schema-constrained reflection:

- one clear strength;
- exactly two unresolved assumptions;
- one candidate feature to postpone with reason;
- one honest selected-lane tradeoff; and
- exactly three small next moves.

It cannot:

- score, grade, or claim mastery;
- decide lesson correctness or progression;
- decide whether the learner’s idea is good;
- rank brands;
- generate code or a real project;
- access a repository;
- request credentials;
- publish; or
- perform an external action.

The server validates input and output, keeps the key private, uses `store: false`, treats the brief as untrusted data, and returns authored fallback content when a live response is unavailable. This lets judges complete and test the entire experience without a credential while keeping GPT‑5.6’s contribution useful, visible, and pedagogically honest.

## Judging-criteria evidence

### Technological implementation

- Versioned, validated v3 learning state with exact mid-stop restoration
- Typed authored curriculum spanning tool roles, files, prompts, cycles, defects, versions, releases, glossary, and Playbook
- Non-trivial interactive route with sequential construction rather than static content pages
- Accessible dialog, range, selection, version, copy, focus, and resume behavior
- Protected Teaching Mirror endpoint with strict input/output schemas, server-only credential, bounded output, safety identifier, request limiting, and deterministic fallback
- Unit, API, desktop/mobile browser, conventional Next, generated Worker, and hosted-runtime verification contract

### Design

- Plain explanation and eight-stop orientation before the first decision
- Coherent conservation-studio visual language rather than a generic AI dashboard or course shell
- Artistic layer reveal tied directly to the educational argument
- One focused action at a time with a visible project, file, prompt, version, or release consequence
- Always-available Playbook with ten copyable real-world templates
- Keyboard, focus, reduced-motion, 320px, 390px, tablet, desktop, and 200% zoom acceptance criteria

### Potential impact

- Specific audience: people ready to try AI building but unable to locate a trustworthy starting point
- Specific problem: a fragmented tool landscape that can produce polished output without teaching ownership, scope, inspection, publication, or recovery
- Transferable outcome: a tool-independent mental model and Playbook a learner can use beside any AI coding workspace
- Concrete safety value: unnecessary accounts, data, payment, and runtime AI are postponed until their obligations are understood

### Quality of the idea

- Teaches the entire idea-to-live project lifecycle rather than syntax, prompt tricks, or a project generator
- Uses one complete case so every decision changes a visible artifact
- Makes hidden decisions and earlier versions visible through the pentimento metaphor
- Treats AI building and runtime AI as separate choices
- Ends with reusable artifacts and a bounded reflection rather than a score or certificate

## Final repository closeout

- [ ] Confirm README, Product, Curriculum, Quality Standard, Hackathon copy, screenshots, demo, and deployed behavior agree.
- [ ] Recapture every submitted screenshot from the exact final artifact.
- [ ] Confirm no token, `.env.local`, private brief, learner transcript, or personal information is tracked.
- [ ] Run `git diff --check` and inspect the tracked-file list.
- [ ] Run a dependency audit on the exact final lockfile.
- [ ] Run the complete verification sequence below.
- [ ] Record exact evidence in `docs/BUILD_LOG.md`.
- [ ] Freeze and tag the verified commit.
- [ ] Deploy the unchanged artifact.
- [ ] Rerun hosted verification.
- [ ] Complete the three entrant-controlled TODOs above.

## Exact verification sequence

Run after the final content and code change:

```bash
npm ci
npm run typecheck
npm test
npm run test:e2e
npm run build:next
npm run build
npm run start
```

Test the generated Worker locally, deploy the unchanged `dist` artifact, then run:

```bash
PLAYWRIGHT_BASE_URL=https://pentimento.aethe.me npm run test:e2e
```

Manual review still matters. At 320px, 390px, 768px, desktop, and 200% zoom:

- inspect the opening, map, and first action;
- complete the journey by keyboard;
- inspect focus movement and both dialogs;
- confirm no task-blocking horizontal overflow;
- confirm reduced-motion behavior;
- copy the complete Playbook;
- submit a safe Teaching Mirror brief;
- confirm the deterministic fallback remains usable;
- verify the exact public title, description, favicon, and canonical URL; and
- confirm every simulated external action is labelled as simulated.

Passing local development does not prove the generated Worker, and passing the Worker does not prove the deployed custom domain. Final evidence must identify the exact artifact under test.

## Final production record

The release owner will add the exact verified commit, tag, Worker version, traffic assignment, verification results, and hosted-test time after the final artifact exists. Do not infer those values from an earlier Pentimento release.
