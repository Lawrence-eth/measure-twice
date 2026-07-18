import type { LessonIdSchema } from "@/lib/contracts";
import type { z } from "zod";

export type LessonId = z.infer<typeof LessonIdSchema>;

export type PredictionOption = {
  id: string;
  order: string;
  belief: string;
};

export type Lesson = {
  id: LessonId;
  eyebrow: string;
  title: string;
  shortTitle: string;
  setup: string;
  question: string;
  code: string;
  predictionOptions: PredictionOption[];
  expectedOutput: string[];
  suggestedExplanation: string;
  transfer: {
    title: string;
    setup: string;
    code: string;
    predictionOptions: Array<{ id: string; order: string }>;
    expectedOutput: string[];
  };
};

const awaitMicrotask: Lesson = {
  id: "await-microtask",
  eyebrow: "Async JavaScript · 4 minutes",
  title: "What does await actually pause?",
  shortTitle: "The await myth",
  setup:
    "Read the program without running it. Commit to an output order, then explain the rule you used.",
  question: "Which output order do you predict?",
  code: `console.log("A");

async function inspect() {
  console.log("B");
  await Promise.resolve();
  console.log("D");
}

inspect();
console.log("C");`,
  predictionOptions: [
    {
      id: "whole-program-pauses",
      order: "A  →  B  →  D  →  C",
      belief: "await pauses all JavaScript until the promise resolves",
    },
    {
      id: "function-pauses",
      order: "A  →  B  →  C  →  D",
      belief: "await pauses only the current async function",
    },
    {
      id: "function-starts-later",
      order: "A  →  C  →  B  →  D",
      belief: "calling an async function defers its entire body",
    },
  ],
  expectedOutput: ["A", "B", "C", "D"],
  suggestedExplanation:
    "I think await blocks the whole program until the promise resolves, so D should print before C.",
  transfer: {
    title: "New code, same mental model",
    setup:
      "Predict this without relying on the letter pattern from the first experiment.",
    code: `console.log("A");

setTimeout(() => console.log("E"), 0);

async function task() {
  console.log("B");
  await 0;
  console.log("D");
}

task();
console.log("C");`,
    predictionOptions: [
      { id: "transfer-correct", order: "A  →  B  →  C  →  D  →  E" },
      { id: "transfer-block", order: "A  →  B  →  D  →  C  →  E" },
      { id: "transfer-timer", order: "A  →  B  →  C  →  E  →  D" },
    ],
    expectedOutput: ["A", "B", "C", "D", "E"],
  },
};

export const lessons: Lesson[] = [awaitMicrotask];

export function getLesson(id: LessonId): Lesson {
  const lesson = lessons.find((candidate) => candidate.id === id);

  if (!lesson) {
    throw new Error(`Unknown lesson: ${id}`);
  }

  return lesson;
}
