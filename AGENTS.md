# Pentimento contributor guide

## Product invariants

- This is an educational simulation, not a project generator or generic AI course.
- The learner must make a consequential choice before receiving instruction.
- AI output is always presented as a proposal. Only authored evidence can mark work as verified.
- Every field note must change a concrete building behavior and be applied inside the mission.
- Core curriculum, defects, evidence, and scoring stay deterministic. GPT-5.6 may personalize feedback, but it cannot invent the lesson or decide ground truth.

## Commands

- Install: `npm install`
- Develop: `npm run dev`
- Typecheck: `npm run typecheck`
- Test: `npm test`
- Browser test: `npm run test:e2e`
- Production build: `npm run build`

Run typechecking and tests for every behavior change. Run the production build before a demo or deployment.

## Engineering conventions

- Keep OpenAI API calls server-side under `app/api`.
- Validate every model and client boundary with Zod.
- Maintain deterministic demo fixtures so judges can test without an API key.
- Never let a model fabricate whether a test ran, what evidence showed, or whether a learner is ready to ship.
- Prefer small, named domain functions in `lib/` over business logic embedded in components.
- Keep the complete mission keyboard-usable and usable on a 390px-wide screen.
- Treat `docs/QUALITY_STANDARD.md` as the release acceptance contract; evidence in the exact built and deployed revision must support every completion claim.
- Keep release rows derived from version-matched checks and concrete actions. Never replace them with learner self-attestation.
- Respect reduced-motion preferences and never rely on drag as the only interaction.
- Do not commit credentials, learner-identifying data, or generated session transcripts.
