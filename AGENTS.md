# Counterproof contributor guide

## Product invariant

Counterproof must help a learner revise a mental model through observable evidence. It must not collapse into an answer-generating chat interface.

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
- Treat runtime output as evidence. Never let a model fabricate whether code passed or what it printed.
- Prefer small, named domain functions in `lib/` over business logic embedded in components.
- Keep the primary learning loop usable on a 390px-wide screen.
- Do not commit credentials, learner-identifying data, or generated session transcripts.
