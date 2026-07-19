# Pentimento v5 quality standard

This is the acceptance contract for the current OpenAI Build Week candidate.
Pentimento is ready only when the product follows the careful build discipline
it teaches. A passing result from v1–v4 is not evidence for v5.

## Product truth

- Pentimento identifies itself as a 15-minute interactive field guide for
  first-time AI builders.
- Its thesis is clear: AI can make the surface quickly; a human must direct and
  verify the project underneath.
- It is described as an authored educational simulation, not a coding course,
  prompt library, product ranking, project generator, repository, or deployment
  service.
- The complete route requires no account, API key, payment, external action, or
  coding knowledge.
- One completed journey is practice, not proof of mastery.

## Opening comprehension and Reveal

- A new learner can say what Pentimento is, why it matters, what they will make,
  and what to do first without opening a route dialog.
- The opening names the approximate duration, no-code/no-setup safety boundary,
  and take-home artifacts.
- The primary action is **Test the finished-looking project** and moves focus to
  the interactive preview; it does not bypass the Reveal.
- After the Reveal, **Learn the method that catches this** starts the route.
- **See exactly what you will learn** opens a secondary chapter overview with
  **Start with the first promise** as its final action.
- The learner can test the polished preview's important action.
- The test visibly fails before the learner is told the lesson.
- **Reveal the project underneath** exposes four text-labelled layers:
  Promise, Project home, Evidence, and Release.
- The Reveal states that the screen is the surface and building means directing
  and checking everything underneath it.
- Four capability previews and four chapters explain the value without showing
  every future control.
- No unexplained dashboard, confidence control, technical glossary, assessment
  framing, or wall of options appears on arrival.

## Curriculum integrity

- The route remains Idea → Tools → Project home → Ask AI → Build → Check → Go
  live → Improve.
- The header groups those stops into Shape the promise, Ground the work, Direct
  the build, and Prove the release.
- The required curriculum contains exactly 13 consequential decisions.
- Willow Fix Day facts, files, defect, repair, versions, release, and update
  remain consistent.
- Idea selects one complete supportable visitor path and names a Not now
  boundary.
- Tools distinguishes build, project-home, and publish responsibilities and
  presents both tool lanes as tradeoffs.
- Project home rejects chat-only custody and separates build-time AI from
  runtime AI.
- Ask AI requires inspection, a small plan, a stopping point, and approval of
  one shown step.
- Build distinguishes an AI claim, changed files, preview, and human-path
  evidence.
- Check requires observed failure → bounded repair → retry; the retry cannot be
  skipped.
- Go live distinguishes a checked version from a polished untested version and
  deployment status from public-path evidence.
- Improve changes the trusted source first and preserves the earlier checked
  layer.
- The finished Willow Fix Day page does not require runtime AI.

## Decide, inspect, save

- Every stop names why the decision matters and what the learner will leave
  with.
- A core action changes the project, its evidence, its route, or its release
  state.
- Correct feedback remains visible; it never auto-advances before the learner
  can inspect it.
- The stop-level Playbook note states the reusable rule, when to use it, and the
  failure it prevents.
- The learner explicitly saves that note with a meaningfully named checkpoint
  before the next stop.
- Eight stop-level notes accumulate into the existing five-card take-home
  Playbook; the product never implies that eight new cards were created.
- Wrong choices explain a concrete cost, missing proof, or additional system
  and remain recoverable.
- There are no scores, streaks, badges, mastery labels, trick distractors, or
  confetti.

## Useful depth

Every instructional item should answer the applicable questions:

1. **Why:** which decision does this change?
2. **Make:** what exact action, artifact, or template should the learner use?
3. **Proof:** what observable result should it produce?
4. **Avoid:** which failure or wasted work does it prevent?

Additional gates:

- A sentence changes a decision, action, mental model, or interpretation;
  filler is removed.
- Plain language comes before jargon.
- Advice names conditions and tradeoffs rather than declaring one universal
  tool or workflow.
- Prompts are work specifications, not magic wording.
- Trusted facts, learner observations, AI reports, and inferences remain
  distinct.
- “Saved,” “built,” “previewed,” “published,” and “works” remain distinct
  claims.
- Optional depth never becomes required to guess a core answer.

## Persistent Field Guide

- **Field guide** is reachable beside the current task.
- It opens five cards: Shape the first version; Choose a route and project home;
  Ask, inspect, and save; Check and repair; Release and improve.
- Each card includes when to use it, what to do, what counts as proof, and a
  copyable template.
- The guide is not locked until completion.
- Completion may call the same reference the learner's **5-card Playbook**.
- Copy success is announced to assistive technology.

## Surface and underlayers canvas

- The persistent canvas provides **Visitor surface** and **Project underneath**
  controls.
- The surface shows the visitor-facing state and important action.
- The underlayers show the brief, tool route, files, work agreement, evidence,
  versions, release proof, and recovery.
- Each successful stop changes the canvas.
- Earlier layers remain visible rather than being erased by the latest state.
- The canvas remains open and reachable on narrow screens.
- Every layer and state has a meaningful text equivalent.

## Teaching Mirror integrity

- The Teaching Mirror is optional and learner-initiated at completion.
- A complete local V1 brief exists before any optional network request.
- Before sending, the interface says that submitted brief text will leave the
  browser and warns against secrets or personal information.
- The request excludes route history and repository access.
- Input length and structure are validated server-side.
- Output contains one strength, exactly two unresolved questions, one postpone
  candidate with reason, one route tradeoff, and exactly three next moves.
- The model cannot grade, claim mastery, decide progression, generate or
  execute the project, access files, request credentials, publish, or take an
  external action.
- Live credentials remain server-side; live requests use structured output,
  `store: false`, bounded output, and a privacy-preserving safety identifier.
- Missing credentials, refusal, invalid output, limits, timeout, or provider
  failure preserve the outcome through authored fallback.
- The authored route and Playbook remain complete without model access.

## Accessibility and responsiveness

- Semantic landmarks, headings, lists, forms, buttons, links, definition lists,
  code blocks, and dialogs match their meaning.
- Every control has an accessible name, visible focus, and keyboard operation.
- Feedback and Playbook-note checkpoints receive useful focus without hiding
  content before it can be read.
- Dialogs contain focus, support safe dismissal, and restore focus.
- Status updates and copy results are announced without stealing focus.
- Selection, failure, saved state, and release state never rely on color alone.
- Reveal, canvas lenses, evidence ladder, and release sequence have text
  equivalents.
- The route works at 320px, 390px, 768px, desktop, and 200% zoom without
  task-blocking horizontal scrolling.
- Narrow layouts preserve instruction, action, feedback, and the persistent
  canvas.
- Reduced-motion mode removes non-essential animation while preserving meaning.

## Persistence and privacy

- Progress uses the dedicated versioned key `pentimento-studio-v4`.
- The exact stop, decision state, selected route, check/repair state, release
  state, improvement, saved Playbook notes, and completion survive refresh.
- Invalid or partial storage falls back to a usable state.
- Storage failure does not prevent the authored journey.
- Returning learners receive contextual resume information.
- Restart removes only the current local learning record after confirmation.
- Learner content remains local unless the learner explicitly invokes the
  Teaching Mirror.
- The application has no authentication, analytics database, GitHub OAuth,
  arbitrary code execution, or real external mutation.

## Visual identity

- The visual language is editorial and conservation-inspired rather than a
  generic learning dashboard or chatbot.
- Warm paper, dark ink, ultramarine, mauve, viridian, crimson, raking light,
  underlayers, registration marks, and marginal notes form one coherent system.
- Literal labels accompany color, position, and motion cues.
- The artistic metaphor supports comprehension rather than replacing it.
- Orange, perpetual glow, paint splatter, confetti, badges, and decorative
  motion are absent.

## Technical and release quality

- Unit tests cover progress creation, validation, restoration, progression,
  checkpoint behavior, and safe fallback.
- API tests cover Teaching Mirror validation, deterministic fallback,
  structured response, limits, and live failure fallback.
- Browser tests cover the Reveal, four chapters, all eight stops, 13 decisions,
  Playbook-note checkpoints, Field Guide availability, both canvas lenses,
  fail/repair/retry, complete desktop/mobile paths, restoration, dialogs,
  keyboard operation, focus, accessibility scans, and narrow layouts.
- Typecheck, unit tests, production builds, generated-artifact checks, hosted
  browser tests, dependency audit, and visual review run in proportion to the
  exact release candidate.
- A passing earlier commit is never used as evidence for a later candidate.
- README, product brief, curriculum, quality standard, hackathon copy, demo
  claims, repository state, and deployed behavior agree.
- Final commit, version, deployment, hosted result, video URL, `/feedback`
  Session ID, and Devpost confirmation are recorded only after they exist.

## Beginner validation target

When moderated testing is available, use at least five people matching the
primary audience:

- four of five independently explain the product after the opening Reveal;
- four of five complete the first chapter without facilitator instruction;
- four of five can explain the surface/underlayers distinction and the
  build/remember/publish role map; and
- no participant encounters a blocking issue at 320px, 200% zoom, or
  keyboard-only use.

This target is a separate human-understanding signal. Automated accessibility
and browser checks do not substitute for it.
