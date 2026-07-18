# Counterproof

**Debug your mental model, not just your code.**

Counterproof is an evidence-first programming tutor. It turns a learner's explanation into a falsifiable hypothesis, runs the smallest useful counterexample, and then checks whether the learner can transfer the corrected idea to a new situation.

Built for the **Education** track of OpenAI Build Week 2026.

## Why it exists

AI tutors are good at producing explanations. That does not prove the learner changed the misconception that caused the mistake. Counterproof uses a different loop:

1. **Commit** — explain what you think the program will do.
2. **Counterexample** — GPT-5.6 diagnoses the underlying belief; the lesson pairs it with a small, audited probe.
3. **Observe** — the browser runtime executes the code and records what actually happened.
4. **Repair** — teach the concept back using the observed evidence.
5. **Transfer** — solve a fresh case that requires the corrected mental model.

The model can suggest and explain. Only the runtime can report execution evidence.

## Current checkpoint

- One polished JavaScript lesson about `await` and the event loop
- Deterministic demo mode that works without credentials
- Server-side GPT-5.6 integration through the Responses API
- Structured model output validated with Zod
- Isolated, time-limited browser worker for audited experiment fixtures
- Teach-back and transfer stages

See [the product brief](docs/PRODUCT.md) and [build log](docs/BUILD_LOG.md) for scope and provenance.

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

The example environment enables deterministic demo mode. To use GPT-5.6, put a valid server-side API key in `.env.local` and set:

```dotenv
DEMO_MODE=false
OPENAI_MODEL=gpt-5.6
```

Never expose `OPENAI_API_KEY` through a `NEXT_PUBLIC_` variable.

## Verify

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## How GPT-5.6 is used

Counterproof calls the OpenAI Responses API on the server. GPT-5.6 receives the lesson, prediction, and learner explanation and returns a typed diagnosis: a falsifiable belief hypothesis, likely misconception, discriminating question, confidence, and minimal hint. The executable probes are curated fixtures, so generated code cannot redefine the evidence. A second typed call evaluates the teach-back against server-verified output; a third checks whether both the prediction and causal explanation transfer to unfamiliar code.

The application defaults to the official `gpt-5.6` alias. It uses Structured Outputs so the interface consumes validated learning objects rather than parsing prose.

## How Codex is being used

Codex is the primary engineering collaborator for product framing, architecture, implementation, tests, interface work, documentation, and demo preparation. Human decisions—including the evidence-first learning loop, Education track, JavaScript-only scope, and deterministic judge mode—are recorded in [docs/BUILD_LOG.md](docs/BUILD_LOG.md).

Before submission, the primary Codex thread's `/feedback` Session ID will be added here and to Devpost.

## Judge-friendly testing

The hosted demo will start in clearly labeled seeded mode, so the complete learning loop can be tested without an account, API key, or paid service. The seeded diagnosis uses both the selected prediction and bounded cues from the written explanation. Real GPT-5.6 mode can be enabled by the project owner for the recorded demo.

## License

[MIT](LICENSE)
