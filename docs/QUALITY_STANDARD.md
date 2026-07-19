# Pentimento quality standard

This document is the acceptance contract for the Build Week submission. Pentimento is ready only when the product itself follows the evidence discipline it teaches.

## Product promise

Pentimento teaches a complete beginner how to take a small AI-assisted project from an idea to a version they can explain, constrain, inspect, repair, and safely share. It is an educational simulation, not a project generator and not a coding course. The finished Repair Café page does not require AI, an API key, or a model at runtime.

## Learning integrity

- The learner defines a specific person, outcome, observable checks, and explicit non-goals before granting edit permission.
- Git, GitHub, repository, commit, before-and-after changes (diff), environment variable, preview, live version, and recovery are defined in plain language at first use.
- No answer explains its own correctness before the learner commits. Distractors are plausible incomplete decisions, not jokes.
- Wrong decisions create a visible human or project consequence and remain recoverable.
- The canonical initial evidence is consistent everywhere:
  - unsupported repair guarantee;
  - contact action is clipped at 390px;
  - contact action has no destination;
  - AI says checks passed while the execution record is empty;
  - keyboard order and tracked-file safety currently pass.
- The baseline is called recoverable but unverified. “Known good” is reserved for a version supported by current checks.
- The repaired contact action visibly has `mailto:hello@repair-cafe.example`, fits at 390px, and can be reached and activated by keyboard.
- Post-repair evidence reruns facts, phone visibility, link destination, keyboard behavior, and final-file safety.
- Release status is derived from evidence produced in the mission. A learner cannot manufacture a pass by ticking a claim.
- Publishing is a distinct authority boundary: preview verification, explicit approval, exact version, live smoke test, and recovery method are all visible.
- Spreadsheet transfer uses `=SUM(B2:B4)+57.75`, requires a trusted source and independent recalculation, and includes a learner explanation.
- The final Revision Trace reflects the learner’s real initial choice, later confidence decisions, attempts, hints, consequences, repairs, checks, and transfer reasoning.
- Assessment reports demonstrated independently / after revision / with support / not yet demonstrated. Help-seeking is visible, not secretly punished by a dominant score.

## Reusable value

- TRACE is the only curriculum mnemonic. Context Lens, Evidence Ledger, and Revision Trace are the only other signature names.
- Every working note includes: when to use it, a completed Repair Café example, a blank template, the evidence it should produce, and the common failure it prevents.
- The manual includes a safe first-project route, AI work modes (Explore, Plan, Implement, Diagnose, Review, Verify), authority boundaries, repository setup, secret handling, asset/data responsibility, checks, preview/live release, and recovery.
- Technical terms never replace plain-language instructions.

## Interaction and accessibility

- Within the opening moments, a new learner can identify what Pentimento is, their role, what they will learn, and the single next action.
- A dedicated case briefing appears before any assessed choice and states that the experience is simulated, reversible, code-free, and unable to publish or send email.
- Instructions precede artifacts and decisions at every width; mobile never places the Repair Café preview before the first task explanation.
- Dense layers reveal one focused question, item, or next action at a time. Future controls are not rendered or keyboard-focusable.
- Completed choices remain visible in compact editable trails; comprehensive reference content moves behind labelled disclosures rather than disappearing.
- A persistent “How this works” action can restate the learner’s role and interaction rhythm. Returning learners receive a contextual resume screen.
- Every scene transition scrolls to the beginning and moves focus to the new scene heading.
- Single-choice controls use native radio behavior; tabs use the WAI-ARIA tabs pattern or ordinary button semantics.
- Dialogs contain focus, support Escape when dismissal is safe, hide/inert the background, and restore focus.
- Restart requires confirmation and remains available at 320px through the persistent Help panel.
- Progress groups the ten internal layers into four learner-facing chapters and communicates the current chapter visually and to assistive technology at every width.
- The signature instrument remains reachable near the decision on mobile through a compact status/tray.
- Status never relies on color alone. Tables use table semantics; traces use list semantics.
- Copy success/failure and asynchronous debrief state are announced.
- Essential touch targets are at least 44px. Meaningful copy is at least 12px and meets WCAG AA contrast.
- The product works at 320, 390, 768, and desktop widths; 200% zoom does not hide content or controls.
- Motion is triggered by learner action, has no perpetual glow/pulse, and respects `prefers-reduced-motion`.

## Visual identity

- The visible product name is Pentimento with the line “See the decisions beneath the finished surface.”
- Orange is absent from tokens, literal colors, imagery, screenshots, and state language.
- The palette separates current/selected (ultramarine), AI/provisional (mauve), verified (viridian), failed (crimson), and neutral/untested states.
- Underlayers, registration marks, marginal notes, and one continuous evidence thread express the pentimento metaphor without paint-splatter or museum kitsch.
- Artifact frames share one coherent conservation-instrument grammar.

## Technical and submission quality

- Persisted state is versioned, validated, migratable or safely recoverable, and save failures do not break the mission.
- Deterministic authored feedback works without an API key. Live GPT-5.6 debriefing remains constrained, transparent, and optional.
- Unit tests cover every gate and persistence validator.
- End-to-end tests cover an independent path, a repair path, exact contact destination, evidence-derived release, real Revision Trace, scene focus/scroll, dialog keyboard behavior, mobile reflow, and production Worker runtime.
- Typecheck, unit tests, production build, Worker smoke tests, browser tests, dependency audit, and screenshot review all pass from the exact deployed commit.
- README, product/curriculum docs, screenshots, demo claims, repository state, and deployed behavior agree.
