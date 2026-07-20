# Pentimento v9 experience contract

This document is the implementation contract for the verified six-folio,
page-by-page release. Earlier release results remain historical evidence in
[BUILD_LOG.md](BUILD_LOG.md); the exact v9 evidence is recorded there
separately.

## Product truth

Pentimento is a 15-minute interactive field lesson in which a complete beginner
directs one fictional AI-built website from a convincing surface to a checked,
recoverable release.

It is an authored educational simulation—not a coding course, prompt library,
tool ranking, project generator, repository, or development environment. It
does not build or publish a learner’s real project.

> **AI can make it look finished. Learn to make it trustworthy.**

The learner directs four responsibilities:

1. **Promise** — the one result this version must finish.
2. **Project home** — the files and history the learner can recover.
3. **Evidence** — what a person actually tried and observed.
4. **Release** — the exact checked version that is live and the version that
   can be restored.

The visible project, underlayers, lesson receipts, and version thread make those
responsibilities concrete.

## Six-folio opening

The opening is six full-page compositions in the document’s root scroll. It is
not a nested scroller, dashboard, feature menu, or preliminary carousel.

| Folio | Name | Job |
| --- | --- | --- |
| **00** | What this is | Explain Pentimento, its audience, duration, boundary, and five takeaways |
| **01** | The claim | Present a polished Willow Fix Day preview and the untested AI claim |
| **02** | The test | Let the learner test the only important visitor action |
| **03** | The layers | Reveal Promise, Project home, Evidence, and Release |
| **04** | The method | Make Shape, Ground, Direct, and Prove interactive |
| **05** | Your lesson | Hand the learner into the eight-stop field lesson |

Folio 00 must answer before asking:

- **What is this?** An interactive field lesson for first-time AI builders.
- **What will I do?** Direct a fictional site from rough idea to checked public
  version without writing code.
- **Why does it matter?** A polished surface cannot prove behavior, custody,
  release identity, or recovery.
- **What will I keep?** A V1 brief, tool map, AI work agreement, evidence
  ladder, and release-and-recovery card.
- **What is safe?** The project is fictional; no email is sent and nothing is
  published.

Folio 01 makes no spoiler. **Ready to publish** remains visibly labelled as an
AI report with untested evidence.

Folio 02 is the real evidence event. The learner selects **Email the
organizer**, receives the visible observation **Nothing happened**, and can
distinguish how the preview looked from how it behaved. The failure is not
announced before the click.

Folio 03 exposes the four underlayers only after evidence has been produced.
Folio 04 lets the learner inspect each part of the method and its consequence,
not merely read four slogans. Folio 05 says exactly what the eight-stop lesson
will ask and offers **Begin with the first promise** as the primary action.
**Preview the 8-stop route** is secondary.

## Page-scroll contract

- The browser document owns vertical scrolling. No folio creates a second
  wheel, touch, or keyboard scroll region.
- Tall desktop with a fine pointer may use mandatory one-page settlement.
- Touch layouts use proximity; short viewports, high zoom, and reduced-motion
  layouts use normal scrolling.
- A six-step rail exposes current position and direct navigation with
  meaningful accessible names.
- The active folio changes only after the next page’s prose crosses the reading
  line; the rail must not announce content before it is visible.
- Desktop may keep one specimen beside folios 01–04. Mobile and tablet place a
  purpose-built specimen in the reading flow.
- Sticky interface elements never cover headings, actions, failure text, or
  focus.
- Reverse scrolling and native keyboard scrolling always work.
- Reduced motion preserves every state and removes non-essential transitions.

One component owns each transition. Full-scene changes do not stack a native
root snapshot over destination entrance animation. Local state changes may use
short transitions when they preserve a stable header and artifact.

## Remembered evidence

The opening and lesson form one causal journey. When folio 02 produces the
failure, the app persists `introFailureObserved: true` in the existing versioned
progress record.

- If the learner observed the failure, Check starts with **You found this
  failure earlier; now record it** and shows the observed state.
- If the learner entered without observing it, Check still requires the initial
  Email trial.
- Both branches require an observed-versus-expected defect, a bounded repair,
  and a retry.
- Restart clears the remembered evidence with the rest of the learning record.

This prevents the same failure from being staged in an opening, a separate
inspection, and Check.

## Route

The authored route contains four chapters, eight stops, and 14 consequential
decisions.

| Chapter | Stops | Learner capability |
| --- | --- | --- |
| **Shape the promise** | First version | Define one supportable visitor path |
| **Ground the work** | Tools · Project home | Assign tool roles and preserve the work |
| **Direct the build** | Ask AI · Build | Bound AI changes and collect evidence |
| **Prove the release** | Check · Go live · Improve | Repair, release, recover, and update |

### Stops

- **First version:** choose one complete, supportable path and a Not now
  boundary.
- **Tools:** compare one browser workspace with visible files plus saved
  history; state the speed, ownership, setup, and recovery tradeoffs.
- **Project home:** reject chat-only custody, choose a recoverable home, and
  decide whether visitors actually need runtime AI.
- **Ask AI:** ask for inspection and three small steps, preserve trusted facts
  and boundaries, name a stopping point, and approve one shown step.
- **Build:** distinguish AI report, changed files, automated checks, preview,
  and a complete visitor-path test.
- **Check:** use remembered or newly produced evidence, record the defect,
  repair only the failed link, and retry it.
- **Go live:** choose checked V4 over polished-but-untested V3, test the
  simulated public path, and preserve recovery.
- **Improve:** change the trusted source first, update only affected output and
  checks, then save V5 without erasing V4.

## Compact lesson shell

The required reading order is:

```text
chapter and stop → why it matters → one current decision →
consequence → lesson receipt → next stop
```

- The header has one secondary navigation action: **Lesson map**.
- The center header status is informational, not a duplicate button.
- The mobile header is one compact row rather than two stacked control bars.
- Desktop keeps the project artifact beside the decision.
- On narrow screens **Project layer updated** is closed initially. The learner
  can open it when reference is useful, without pushing the current task below
  the first screen.
- Completed layers remain available, but only the current task asks for
  attention.

Correct feedback stays on screen with the consequence and working rule. There
is no delayed automatic scroll. The learner explicitly selects **Save this
lesson**. The task becomes:

```text
Lesson receipt · practice saved · n / 8
```

The receipt states the transferable rule, when to use it, and the failure it
prevents. A predictable action continues to the next stop. The wording never
claims each receipt creates a new Build-kit guide.

Wrong answers show a literal `×`, explain the cost or missing evidence, and
remain revisable. Recommended choices show a literal `✓`; color and animation
are supplementary.

## Persistent learning objects

### Project layers

The project canvas exposes:

- **Visitor surface** — the visible page and important action.
- **Layers underneath** — brief, tool route, project home, work agreement,
  evidence, version thread, release proof, and recovery.

Every meaningful decision changes at least one project state. Earlier layers
remain visible instead of being erased.

### Build kit

The Build kit is available during the lesson and at completion:

1. Shape the first version.
2. Choose a route and project home.
3. Ask, inspect, and save.
4. Check and repair.
5. Release and improve.

Each guide includes when to use it, the exact action, what counts as proof, and
a copyable template. The kit is not described as newly unlocked at completion.

### Evidence ladder

```text
AI claim → changed files → preview → human path → public path
```

The interface explains what each rung proves and does not prove.

### Version thread

Release preserves the causal thread from V1 scope through V5 improvement. V3
remains visibly polished but untested; V4 is repaired and checked; V5 updates
the trusted source without erasing the recovery layer.

## Completion

Completion says the learner **practiced** the method and now has a method to
reuse. It does not claim durable transfer or mastery from one journey.

The primary action is **Create my V1 brief**. **Open my build kit** is secondary.
The page also shows:

- a four-part method recap;
- route-specific actions to start today;
- four reusable habits; and
- the final project layer.

## V1 brief workshop

The workshop is optional and learner-initiated. Four short passes collect:

1. person, situation, and useful result;
2. complete path and trusted facts;
3. must-have and Not now boundaries; and
4. observable finish line and starter route.

Plain-language examples remain available. Validation focuses the first
incomplete field and explains what is missing; it does not silently disable the
only forward action. Step and result headings stay visible at 320×568 and at
high zoom. Workshop changes do not combine native document snapshots with a
second destination animation.

The complete, copyable V1 brief exists locally before any optional request. The
result offers **Edit my answers** and preserves the local artifact if reflection
fails.

## Authored/live reflection boundary

The interface must expose its reflection mode before the learner requests it
and label the returned result:

- **Authored example · deterministic, no live AI call**
- **GPT-5.6 reflection · live**

Demo mode is not called “AI-generated,” “GPT-powered,” or a live response. If a
live request fails or is rate-limited, the response changes to the authored
label.

Both modes return the same bounded teaching shape:

- one clear strength;
- exactly two unresolved questions;
- one feature to postpone and why;
- one route tradeoff; and
- exactly three next moves.

The reflection cannot grade, claim mastery, decide lesson progress, access files
or repositories, execute or publish a project, request credentials, or take an
external action. The authored route, local brief, and Build kit are complete
without model access.

Live mode keeps credentials server-side, validates shape and size, uses
structured output with `store: false`, bounds output, derives a
privacy-preserving safety identifier, and rate-limits requests.

## Visual system

Pentimento uses a restrained conservation-lab language:

- Instrument Sans for instruction and controls;
- serif for artifact titles and distilled rules only;
- carbon, lab silver, cobalt, viridian, and oxide with consistent meaning;
- ruled plates, registration marks, and the underpainting metaphor;
- 44px minimum primary interactive targets;
- flat controls without hover lift, perpetual glow, confetti, or decorative
  card shadows; and
- oxide only for observed failure, viridian for checked states, cobalt for
  focus and direction.

Motion connects cause to consequence. Stable objects stay stable. Focus, color,
text, and motion never disagree.

## Acceptance contract

The v9 release is acceptable only when:

- unit, API, state, and type checks pass;
- the complete desktop and mobile journeys pass;
- all six folios work by pointer and keyboard;
- opening evidence persists into Check and restart clears it;
- both route lanes complete all 14 decisions and eight explicit lesson saves;
- authored demo and live reflection modes are truthfully labelled;
- Axe reports no serious or critical violations through the route and workshop;
- 320, 390, 768, and 1440px layouts have no task-blocking overlap or horizontal
  overflow;
- short viewports, 200% zoom, reduced motion, refresh restoration, dialog focus,
  and focus return pass;
- performance and dependency audits are recorded for the exact candidate;
- the production URL serves the exact saved Sites source version; and
- README, product brief, quality standard, hackathon copy, screenshots, video,
  repository state, and hosted behavior agree.
