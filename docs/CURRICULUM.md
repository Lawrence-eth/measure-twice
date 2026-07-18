# Curriculum and content standard

## Audience promise

Measure Twice assumes the learner has never used Git, GitHub, a coding agent, a test suite, environment variables, or deployment tooling. It does not assume that “beginner” means incapable. Technical ideas are introduced in plain language, then used immediately in a consequential decision.

The curriculum teaches **build judgment, not prompt tricks**.

## TRACE

TRACE is a transferable project method rather than a model-specific prompt formula.

### Target

Define:

```text
For: [specific person in a specific situation]
Outcome: [what they can decide or do]
Proof: [observable checks]
Not yet: [explicit non-goals]
```

Useful habits:

- Begin with the user’s problem and observable outcome, not an impressive feature list.
- Treat AI-created personas, facts, and statistics as assumptions until supported.
- Define the smallest complete journey: arrival → understanding → meaningful action → visible result.
- Ask what new system each feature creates and what could fail.
- Remove entire systems instead of leaving many half-finished.
- Decide whether AI belongs in the final product or is only useful during construction.

### Record

Plain-language mental model:

- **Local folder:** the current workbench.
- **Git repository:** the project plus recoverable history.
- **GitHub:** a remote collaboration and review copy of that repository.
- **Commit:** a named snapshot of one coherent change.
- **Branch:** a safe alternate line of work.
- **Pull request:** a surface for reviewing a proposed change.
- **README:** the start, run, and handoff manual.
- **`.gitignore`:** files Git must not track.
- **Environment variable:** configuration kept outside source code.

Beginner repository checklist:

```text
□ Create one repository for the project
□ Choose public or private deliberately
□ Add README.md with purpose, scope, setup, checks, and limitations
□ Add .gitignore before creating secret files
□ Add .env.example containing names and placeholders only
□ Add the approved brief and trusted facts
□ Add AGENTS.md for durable agent commands, constraints, and definition of done
□ Choose an explicit license if public reuse is intended
□ Inspect what will be saved
□ Create a setup-only known-good commit
```

Never commit credentials, `.env.local`, real user exports, database dumps, or private logs. A private repository is not a secret manager. If a credential leaks, revoke or rotate it first; removing the visible file does not reliably remove repository history.

### Assign

Use distinct AI work modes:

- **Explore:** compare possibilities; do not modify.
- **Plan:** inspect context and propose steps; do not modify.
- **Implement:** make one bounded change and check it.
- **Diagnose:** reproduce and identify the cause; do not fix yet.
- **Review:** inspect existing changes; do not edit.
- **Verify:** run agreed checks and report evidence.

Reusable Delegation Envelope:

```text
Mode:
Goal:
Trusted context:
One change:
Constraints and non-goals:
You may:
Ask before:
Done when:
Return:
```

Authority rule:

> The harder an action is to reverse, and the more people, money, access, or data it affects, the tighter its approval and evidence must be.

AI can usually inspect files, draft a plan, and run local checks. It should require review before editing broadly or adding dependencies, and explicit human approval before publishing, sending messages, spending money, deleting data, or changing access.

High-value habits:

- Point to trusted files instead of pasting an entire project.
- Ask the AI to inspect existing patterns before inventing a new one.
- Request one coherent slice at a time.
- State constraints, non-goals, authority, and proof-of-done.
- Ask for assumptions and concise rationale—not hidden chain-of-thought.
- Require changed files, checks actually run, evidence, and remaining risks.
- Stop when work crosses the agreed scope.

### Check

> “Done” is a claim. Evidence makes it trustworthy.

Evidence ladder:

1. AI assertion.
2. Artifact such as a diff or screenshot.
3. Reproducible manual check.
4. Automated check.
5. Independent or representative-user evidence.

Higher is not always necessary, but consequential claims need stronger evidence.

Proof Ledger:

```text
Criterion | Evidence method | Evidence location | Result | Remaining gap
```

Before accepting a change, inspect:

- Changed and unexpectedly deleted files.
- New dependencies, configuration, permissions, or environment handling.
- Functionality outside the brief.
- Secrets, personal data, invented facts, and unlicensed materials.
- Whether tests and documentation match the change.

Five test lanes:

1. **Happy:** expected person and valid input.
2. **Empty/error:** no data, invalid input, network failure, denied permission.
3. **Boundary:** mobile, long text, refresh/back, duplicate action, slow connection.
4. **Accessibility:** keyboard, focus, labels, contrast, feedback, responsive layout.
5. **Misuse/access:** wrong user, unexpected input, excessive requests, unauthorized action.

A build check indicates code health, not user success. A screenshot proves one visible state, not interaction. A green suite only proves the behaviors it actually covers.

### Evolve

Reusable Bug Capsule:

```text
Observed:
How to reproduce:
Expected:
Exact evidence:
Environment / URL / commit:
Last known good:
What changed shortly before:
Must preserve:
After the smallest repair, rerun:
```

Recovery loop:

```text
Reproduce → narrow → form a hypothesis → smallest fix →
rerun the original case → check nearby behavior → save a verified commit
```

Do not paraphrase exact errors into “broken,” change several possible causes at once, suppress an error merely to get a green check, or continue stacking work on a failing state.

Ship gate:

```text
□ Production build succeeds
□ Core journey manually works on desktop and phone
□ Keyboard and accessibility checks pass
□ Loading, empty, error, and unauthorized states are understood
□ Environment-variable names are configured in the correct environment
□ No secrets or private data appear in the client or repository
□ README and known limitations are current
□ Exact release commit is recorded
□ Post-deployment smoke test is complete
□ Previous known-good version and rollback method are known
```

Local, preview, and production are different environments. Test the preview before replacing the live version and rerun the core path after deployment. Code rollback may not reverse a data migration.

## Content quality gate

Every content item must answer all five questions:

1. What situation triggers this advice?
2. What exact action should the learner take?
3. What evidence shows it worked?
4. What costly mistake does it prevent?
5. Is the lesson transferable across tools?

If it cannot, it is removed.

Measure Twice deliberately omits AI history timelines, model catalogs, “secret prompts,” role-play cosmetics, prompt scores, framework debates, coding syntax lessons, exhaustive Git commands, generic quizzes, streaks, badges, motivational filler, fake market statistics, and long AI-generated explanations disconnected from learner action.

## Learning design

The interaction loop is:

```text
Predict → commit → experience consequence → diagnose evidence →
explain → repair → apply again in a new context
```

Scaffolding fades across the mission: Target is a worked comparison, Record and Assign are partially supported, Check and Evolve require independent investigation, and Transfer removes the TRACE labels. Hints progress from a goal cue to a strategy cue to an exact worked action.

Assessment records observable evidence across outcome targeting, durable context, bounded delegation, critical inspection, independent verification, precise revision, and transfer. A security or secret-handling failure blocks shipping until repaired. One mission can demonstrate developing or independent performance; durable mastery requires later retrieval and transfer across multiple projects.

## Sources translated into the product

- [UNESCO AI competency framework for students](https://www.unesco.org/en/articles/ai-competency-framework-students): human agency, accountability, problem scoping, responsible creation, and authentic projects.
- [OECD/EU AI literacy framework](https://www.oecd.org/en/publications/empowering-learners-for-the-age-of-ai_65cd27d4-en.html): understanding, critical evaluation, ethical use, and creative application.
- [ICAP framework](https://education.asu.edu/sites/default/files/lcl/chiwylie2014icap_2.pdf): constructive and interactive learner activity instead of passive exposure.
- [Shute, formative feedback](https://doi.org/10.3102/0034654307313795): timely, specific, supportive feedback that changes the next action.
- [Chi et al., self-explanation](https://doi.org/10.1207/s15516709cog1302_1): learners explain why evidence changes the rule.
- [Roediger and Karpicke, retrieval practice](https://pubmed.ncbi.nlm.nih.gov/16507066/): final transfer and reconstruction rather than another summary.
- [National Academies, evidence-centered assessment](https://www.nationalacademies.org/read/18409/chapter/5): capability claim → observable evidence → task designed to elicit it.
- [GitHub Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world), [commits](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/about-commits), and [README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes): repository, branch, review, commit, and documentation mental models.
- [GitHub sensitive-data remediation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository): revoke exposed secrets first; deleting a file is not enough.
- [OpenAI safety best practices](https://developers.openai.com/api/docs/guides/safety-best-practices): human review, adversarial testing, and clear limitations.
- [OpenAI API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety): server-side keys and environment variables.
- [W3C accessibility design tips](https://www.w3.org/WAI/tips/designing/) and [forms tutorial](https://www.w3.org/WAI/tutorials/forms/): keyboard access, labels, feedback, contrast, and responsive behavior.
- [Vercel Git deployments](https://vercel.com/docs/git), [environment variables](https://vercel.com/docs/environment-variables), and [rollback](https://vercel.com/docs/instant-rollback): preview/production separation, scoped configuration, and recoverable releases.
