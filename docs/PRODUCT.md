# Product brief

## One sentence

Counterproof turns a learner's programming misconception into executable evidence and verifies that their mental model changed.

## Audience

- Beginner and intermediate programming students
- Bootcamp learners
- Teaching assistants who need to see *why* a learner is stuck

## Problem

Correct answers and fluent explanations are weak evidence of understanding. A learner can copy a fix while preserving the mistaken rule that caused the bug. Generic AI tutors also tend to reveal answers too early.

## Product promise

Every completed session produces a compact evidence chain:

`original belief -> prediction -> observed runtime -> revised rule -> transfer result`

## Hackathon demo lesson

**The await myth**

Misconception: “`await` blocks the whole JavaScript program.”

The learner predicts a log order and explains why. Counterproof isolates the belief, runs a seven-line experiment, visualizes the actual order, asks for a revised explanation, and checks a new timer-versus-microtask case.

## MVP

- One complete, beautiful misconception loop
- Three seeded JavaScript lessons by submission time:
  - `await` and microtask ordering
  - closures and captured bindings
  - mutation versus reassignment
- GPT-5.6 structured diagnosis, teach-back evaluation, and transfer evaluation
- Curated executable probes with server-verified expected output
- Browser execution with captured logs and a hard timeout
- Deterministic judge mode
- Shareable session summary

## Non-goals for Build Week

- Authentication or learner accounts
- LMS integrations
- Arbitrary programming languages
- A general-purpose chat surface
- Grading high-stakes coursework

## Success signal

A first-time viewer should understand the original misconception, see decisive contradictory evidence, and recognize the learner's corrected model in under three minutes.
