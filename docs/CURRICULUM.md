# Pentimento curriculum and content standard

## Audience promise

Pentimento assumes the learner has never used Git, GitHub, a coding agent, a test suite, environment variables, preview hosting, or deployment tooling. It does not assume that “beginner” means incapable. Each technical idea appears in plain language at the moment it becomes useful, then immediately changes a consequential decision.

The curriculum teaches **build judgment, not prompt tricks**.

By the end of one mission, a learner should have practiced how to:

- turn an idea into one observable human outcome;
- decide whether AI belongs only in the build process or also in the finished product;
- give a project durable, recoverable context outside a chat;
- separate modes such as planning, implementing, diagnosing, reviewing, and verifying;
- bound what AI may inspect, change, or do externally;
- review the systems and obligations hiding inside a proposed feature;
- connect each completion claim to evidence with known limits;
- diagnose before editing and repair the smallest reproducible gap;
- rerun failed and nearby checks against one exact version; and
- distinguish a verified preview, approval to publish, a live check, and a recovery method.

One mission supplies performance evidence, not a claim of durable mastery.

## TRACE

TRACE is a transferable project method rather than model-specific prompt syntax.

### T · Target

Define:

```text
For: [one person in one situation]
Outcome: [what they can decide or do]
How we will know: [observable, repeatable checks]
Not in this version: [explicit non-goals]
Runtime AI: [needed or not needed, and why]
```

Useful habits:

- Begin with the person’s situation and a useful change, not an impressive feature list.
- Prefer an observable action or decision to a subjective goal such as “feel delighted.”
- Treat AI-created personas, facts, promises, and statistics as assumptions until a trusted source supports them.
- Define the smallest complete journey: arrival → understanding → meaningful action → visible result.
- Ask what new system each feature creates and what that system could fail, expose, or obligate someone to maintain.
- Remove an entire unnecessary system instead of leaving several half-finished systems.
- Decide whether the final product genuinely needs a model. Fixed logic or verified content may solve the problem with less cost, latency, privacy risk, and operational failure.

Repair Café example:

```text
For: A nearby resident checking the event from a phone
Outcome: Decide whether their item fits and contact the organizer
How we will know: Facts match; key event details are present;
                  email works at 390px
Not in this version: Accounts, booking, payment, chat, or live inventory
Runtime AI: Not needed; visitors need verified facts and an email link
```

### R · Record

Plain-language mental model:

- **Project folder:** the project files on the current computer.
- **Git:** a tool that saves named versions and shows before-and-after changes.
- **Repository:** the project files plus the version history Git has recorded.
- **GitHub:** a remote place to store, share, and review a Git repository.
- **Commit:** one named version of a coherent change.
- **Baseline:** a saved starting state; recoverable, but not verified merely because it was saved.
- **Diff:** the additions, removals, and edits between two states.
- **README:** the project’s purpose, setup, checks, limitations, and handoff notes.
- **`.gitignore`:** the list of local, generated, private, or secret-bearing files Git must not save.
- **Environment variable:** a setting supplied outside source files, often by a computer or hosting platform.

Beginner repository route:

```text
□ Create or open one project folder and one Git repository
□ Choose public or private GitHub visibility deliberately
□ Add README.md with purpose, scope, setup, checks, and limitations
□ Add the approved brief and named trusted-source files
□ Add asset licences and credits where needed
□ Add .gitignore before creating local secret-bearing files
□ Add .env.example only when real configuration exists; use names/placeholders only
□ Add AGENTS.md when durable agent commands, constraints, and done criteria help
□ Run the starting project and record the command and actual result
□ Inspect the exact files Git will save
□ Save a baseline labelled “unverified starting state”
```

Call a later version “known good” only after the current checks support that claim.

Never commit credentials, `.env.local`, real user exports, database dumps, private logs, or unrelated transcripts. A private repository is not a secret manager. If a credential leaks, revoke or rotate it first; deleting the visible file does not reliably remove it from repository history.

### A · Assign

Choose the work mode before choosing the words:

| Mode | Meaning | Expected return |
| --- | --- | --- |
| Explore | Compare possibilities; do not modify the project | Options, trade-offs, assumptions, unanswered questions |
| Plan | Inspect context and propose bounded steps; do not modify | Likely files, dependencies, risks, checks, required decisions |
| Implement | Make one agreed change and run the agreed checks | Changed files, actual results, assumptions, remaining risk |
| Diagnose | Reproduce a failure and identify its likely cause; do not fix yet | Reproduction, evidence, hypothesis, uncertainty, repair proposal |
| Review | Inspect existing changes; do not edit | Findings ordered by consequence with evidence locations |
| Verify | Run named checks on an exact version | Procedure, exact result, evidence location, remaining gap |

Reusable handoff:

```text
Mode:
Outcome:
Trusted context:
One change:
Constraints / non-goals:
You may:
Ask before:
Done when:
Return: files changed or proposed, assumptions, checks actually run,
        evidence, and remaining risk
```

Authority rule:

> The harder an action is to reverse—and the more people, money, access, or data it affects—the tighter its approval and evidence must be.

AI can usually inspect named local files, explain, draft a plan, and run agreed local checks. Broad edits, dependency changes, deletion, network use, or new configuration deserve review. Publishing, sending messages, spending money, changing access, and mutating important data require explicit human approval for the exact action.

High-value habits:

- Point to trusted files instead of pasting an entire project or unrelated directory.
- State what is authoritative when sources conflict.
- Ask the AI to inspect existing patterns before proposing a new one.
- Request one coherent slice at a time.
- Name constraints, non-goals, permission boundaries, and proof of done.
- Ask for assumptions and concise rationale, not hidden chain-of-thought.
- Require a return report containing changed files, checks actually run, concrete evidence, and remaining uncertainty.
- Stop when work crosses the agreed boundary; revise the plan before expanding permission.

#### Review the proposed scope

Every plan item receives one of three dispositions:

- **Keep** — directly serves the chosen outcome and has a clear check.
- **Defer** — creates obligations the first complete version does not need.
- **Needs an answer** — may matter, but the trusted brief does not define it well enough to build safely.

Do not reduce scope to a file count. Make the obligations visible: user data, identity, permissions, dependencies, network calls, error states, recovery, accessibility, moderation, ongoing support, and evidence required if built.

### C · Check

> “Done” is a claim. Evidence makes it trustworthy.

Evidence strength depends on the claim. Useful evidence types include:

| Evidence | Supports | Does not establish |
| --- | --- | --- |
| Trusted-source comparison | Whether project claims match an approved source | Whether the interface works |
| Diff review | What files, dependencies, configuration, and behavior changed | Whether the new behavior succeeds |
| Production build | Whether exact code/configuration produces an artifact | Whether a visitor can complete the main path |
| Automated test | Whether the behaviors encoded in that test pass | Requirements the test never encoded |
| Screenshot | What one visual state looked like at one size | Keyboard use, destination, data flow, or other sizes |
| Representative path | What a user could observe while doing the important task | Untried paths or environments |
| AI summary | What AI intended, believes, or says it ran | What the project actually does |

An AI explanation can help select the next check. It cannot independently verify its own work.

The Evidence Ledger records:

```text
Claim:
Method or check:
Exact URL / environment / version:
Result: pass / fail / not run
Evidence location:
What this proves:
What it does not prove:
Remaining gap:
```

Before accepting a change, inspect:

- changed and unexpectedly deleted files;
- new dependencies, configuration, permissions, network calls, or environment handling;
- functionality outside the brief;
- secrets, personal data, invented facts, and unlicensed materials;
- whether the important path works at representative sizes and by keyboard;
- whether empty, error, denied, duplicate, refresh, and slow states matter for this project; and
- whether tests, documentation, and the AI summary match the exact version being reviewed.

Five practical test lanes:

1. **Happy:** expected person and valid input.
2. **Empty/error:** no data, invalid input, network failure, denied permission.
3. **Boundary:** phone width, long text, refresh/back, duplicate action, slow connection.
4. **Accessibility:** keyboard, focus, labels, contrast, feedback, zoom, responsive layout.
5. **Misuse/access:** wrong user, unexpected input, excessive requests, unauthorized action.

A green suite only supports behaviors it actually covers. A build indicates code and configuration health. A screenshot proves one visible state. None of them alone proves the whole human outcome.

### E · Evolve

Begin with diagnosis, not permission to edit:

```text
Mode: Diagnose first; do not edit yet
Observed:
How to reproduce:
Expected:
Evidence anchor:
Environment / URL / version:
Must preserve:
Smallest permitted change:
After repair, rerun:
```

Recovery loop:

```text
reproduce → narrow → form a hypothesis → approve the smallest fix →
rerun the original case → check nearby behavior → save a verified version
```

Do not paraphrase exact evidence into “broken,” change several possible causes at once, suppress an error merely to get a green check, or continue stacking work on a failing state.

In the Repair Café case, the bounded patch:

- replaces the unsupported guarantee with approved availability wording;
- removes the fixed minimum width that clips the action; and
- connects the visible action to `mailto:hello@repair-cafe.example`.

It adds no package, form, database, personal-data collection, or runtime AI. The learner then reruns five checks against the same version: facts, 390px visibility, email destination, keyboard behavior, and final saved-file safety.

## Release is an evidence boundary

The learner does not declare release readiness by checking claims. The release table reads evidence produced by the mission.

A complete release record contains:

```text
Release version:
Post-repair facts, phone, destination, keyboard, and safety evidence:
README / limitations review:
Production-build record:
Hosted-preview URL and smoke-test time:
Explicit approval for this exact version and access mode:
Public URL and post-release result:
Recovery version and concrete procedure:
```

Local, preview, and live are different environments. Test the hosted preview before making it public, ask for explicit approval after evidence and limitations are visible, and rerun the core path after publication. Deployment success does not prove visitor success. Code rollback may also fail to reverse a data migration, which is why a recovery procedure must match the system being changed.

## Transfer case

The final challenge hides the TRACE labels and changes medium. A community budget contains approved receipts of `$240.00`, `$86.40`, and `$58.75`. The AI changes the total formula to:

```text
=SUM(B2:B4)+57.75
```

and claims the `$442.90` total is verified. The learner must return to the original receipts and approved rule, inspect the formula, independently calculate `$385.15`, preserve the original, limit the repair to B5, rerun the calculation, and explain both what the evidence proves and what remains uncertain.

The different surface tests whether the method transfers beyond a website or remembered vocabulary.

## Content quality gate

Every instructional item must answer all five questions:

1. What situation triggers this advice?
2. What exact action should the learner take?
3. What evidence shows that action worked?
4. What costly mistake does it prevent?
5. Does the lesson transfer across tools?

If it cannot, it is removed.

Pentimento deliberately omits AI history timelines, model catalogs, “secret prompts,” role-play cosmetics, prompt scores, framework debates, coding syntax lessons, exhaustive Git commands, generic quizzes, streaks, badges, motivational filler, fake market statistics, and long AI-generated explanations disconnected from learner action.

## Learning design

The interaction loop is:

```text
predict → commit → experience consequence → diagnose evidence →
explain → repair → apply again in a new context
```

Scaffolding fades across the mission:

- Target begins with structured comparisons.
- Record and Assign introduce plain-language concepts in the decision itself.
- Scope requires the learner to expose obligations rather than count features.
- Check asks the learner to choose independent evidence and inspect its limits.
- Evolve separates diagnosis, human approval, repair, and five reruns.
- Release derives status from evidence rather than accepting self-report.
- Transfer removes the TRACE labels and requires a written explanation.

Hints progress from a goal cue to a strategy cue to a worked action. Hints and revisions remain visible in the final record; they are not secretly converted into a punitive score.

Assessment records observable evidence across outcome targeting, durable context, bounded delegation, critical inspection, independent verification, precise revision, release judgment, and transfer. The qualitative labels are **without support**, **after revision**, **with worked support**, and **not yet demonstrated**. Later retrieval and new projects are required before making stronger competence claims.

## Sources translated into product decisions

- [UNESCO AI competency framework for students](https://www.unesco.org/en/articles/ai-competency-framework-students): human agency, accountability, problem scoping, responsible creation, and authentic projects.
- [OECD/EU AI literacy framework](https://www.oecd.org/en/publications/empowering-learners-for-the-age-of-ai_65cd27d4-en.html): understanding, critical evaluation, ethical use, and creative application.
- [ICAP framework](https://education.asu.edu/sites/default/files/lcl/chiwylie2014icap_2.pdf): constructive and interactive learner activity instead of passive exposure.
- [Shute, formative feedback](https://doi.org/10.3102/0034654307313795): timely, specific, supportive feedback that changes the next action.
- [Chi et al., self-explanation](https://doi.org/10.1207/s15516709cog1302_1): learners explain why evidence changes the rule.
- [Roediger and Karpicke, retrieval practice](https://pubmed.ncbi.nlm.nih.gov/16507066/): reconstruction and transfer rather than another passive summary.
- [National Academies, evidence-centered assessment](https://www.nationalacademies.org/read/18409/chapter/5): capability claim → observable evidence → task designed to elicit it.
- [GitHub Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world), [commits](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/about-commits), and [README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes): repository, branch, review, commit, and documentation mental models.
- [GitHub sensitive-data remediation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository): revoke exposed secrets first; deleting a file is not enough.
- [OpenAI safety best practices](https://developers.openai.com/api/docs/guides/safety-best-practices): human review, adversarial testing, and clear limitations.
- [OpenAI API-key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety): server-side keys and environment variables.
- [W3C accessibility design tips](https://www.w3.org/WAI/tips/designing/) and [forms tutorial](https://www.w3.org/WAI/tutorials/forms/): keyboard access, labels, feedback, contrast, and responsive behavior.
- [Vercel Git deployments](https://vercel.com/docs/git), [environment variables](https://vercel.com/docs/environment-variables), and [rollback](https://vercel.com/docs/instant-rollback): preview/live separation, scoped configuration, and recoverable releases.

The implementation acceptance contract is [QUALITY_STANDARD.md](QUALITY_STANDARD.md). This curriculum must be revised whenever the implemented evidence story changes.
