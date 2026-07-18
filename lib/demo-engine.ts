import type {
  Diagnosis,
  TeachbackEvaluation,
  TransferEvaluation,
} from "@/lib/contracts";
import type { Lesson } from "@/lib/lessons";

export function buildDemoDiagnosis(
  lesson: Lesson,
  predictionId: string,
  explanation: string,
): Diagnosis {
  const prediction = lesson.predictionOptions.find(
    (option) => option.id === predictionId,
  );

  const normalized = explanation.toLowerCase();
  const belief = /whole program|everything|all (?:the )?(?:code|javascript)|block(?:s|ed)? (?:the )?(?:program|thread)/.test(
    normalized,
  )
    ? "await pauses all JavaScript until the promise resolves"
    : /entire (?:async )?function (?:starts|runs) later|async function.*defer/.test(normalized)
      ? "calling an async function defers its entire body"
      : (prediction?.belief ?? "the output order follows source order");

  if (belief === "await pauses only the current async function") {
    return {
      hypothesis: `Your explanation suggests that ${belief}.`,
      misconception:
        "Your prediction is strong, but the explanation may still be brittle.",
      whyItFeelsRight:
        "The word “pause” is useful shorthand, but it can hide which execution context is suspended and when continuation is queued.",
      discriminatingQuestion:
        "Can synchronous code after the async function call run before that function resumes?",
      hint:
        "Track the async function and the surrounding script as two separate paths.",
      confidence: 0.73,
    };
  }

  if (belief === "calling an async function defers its entire body") {
    return {
      hypothesis: `Your explanation suggests that ${belief}.`,
      misconception:
        "Async function bodies do not wait to begin; they run synchronously until the first await.",
      whyItFeelsRight:
        "Promises are associated with later work, so it is easy to assume every line inside an async function is deferred.",
      discriminatingQuestion:
        "Does B happen before or after control returns from inspect()?",
      hint: "Separate what happens before await from what happens after it.",
      confidence: 0.91,
    };
  }

  return {
    hypothesis: `Your explanation suggests that ${belief}.`,
    misconception:
      "You are treating await like a program-wide stop sign instead of a suspension point inside one async function.",
    whyItFeelsRight:
      "The source reads top to bottom, and “await” sounds like an instruction for the whole program to wait.",
    discriminatingQuestion:
      "While inspect() is suspended, can the surrounding script continue to console.log(\"C\")?",
    hint:
      "Watch what happens to the code outside inspect() before the promise continuation runs.",
    confidence: 0.96,
  };
}

export function evaluateDemoTeachback(
  teachback: string,
  observation: string[],
): TeachbackEvaluation {
  const normalized = teachback.toLowerCase();
  const signals = [
    /async function|current function|inspect|task/,
    /resume|continuation|microtask|later/,
    /outside|surrounding|other code|synchronous|c (?:prints|runs|appears|happens) before d/,
    /pause|suspend/,
  ];
  const signalCount = signals.filter((signal) => signal.test(normalized)).length;
  const citesObservation =
    /a\s*(?:→|,|then| )\s*b\s*(?:→|,|then| )\s*c\s*(?:→|,|then| )\s*d/.test(normalized) ||
    /c (?:prints|runs|appears|happens) before d/.test(normalized);
  const evidenceUsed = observation.length && citesObservation
    ? [`Observed order: ${observation.join(" → ")}`]
    : [];

  if (signalCount >= 3) {
    return {
      status: "revised",
      feedback:
        "That rule distinguishes the paused async function from the surrounding script and explains the observation.",
      evidenceUsed,
      correctedRule:
        "await suspends the current async function; surrounding synchronous code continues, and the function resumes from a queued continuation.",
    };
  }

  if (signalCount >= 1) {
    return {
      status: "partial",
      feedback:
        "You are moving in the right direction. Name exactly what pauses and connect that rule to why C appeared before D.",
      evidenceUsed,
      correctedRule:
        "await suspends only the current async function, not the surrounding JavaScript program.",
    };
  }

  return {
    status: "unchanged",
    feedback:
      "Your new explanation does not yet account for the observed order. Use C before D as evidence and identify which function was suspended.",
    evidenceUsed,
    correctedRule:
      "await suspends only the current async function while surrounding synchronous code continues.",
  };
}

export function evaluateDemoTransfer(
  predictionId: string,
  rationale: string,
): TransferEvaluation {
  const normalized = rationale.toLowerCase();
  const causalSignals = [
    /await|async function/,
    /microtask|continuation|resume/,
    /timer|settimeout/,
    /surrounding|synchronous|continues|does not block/,
  ];
  const signalCount = causalSignals.filter((signal) => signal.test(normalized)).length;

  if (predictionId === "transfer-correct" && signalCount >= 2) {
    return {
      status: "verified",
      feedback:
        "Your prediction matched execution, and your reason transferred the suspension rule to a new timer-versus-microtask case.",
      causalLink:
        "The async function yields at await, surrounding synchronous code finishes, its continuation runs as a microtask, and the timer runs afterward.",
    };
  }

  if (predictionId === "transfer-correct") {
    return {
      status: "partial",
      feedback:
        "The prediction matched, but the explanation does not yet distinguish the async continuation from the timer. A correct guess is not transfer evidence.",
      causalLink:
        "Connect await to the microtask continuation, then compare that queue with the timer queue.",
    };
  }

  return {
    status: "missed",
    feedback:
      "The runtime contradicted this prediction. Revisit what continues synchronously and which queued work runs before the timer.",
    causalLink:
      "After await yields, synchronous code finishes; the async continuation runs before the zero-delay timer.",
  };
}
