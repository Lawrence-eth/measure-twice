import { z } from "zod";

const boundedText = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum);

const boundedList = (maximumItems: number) =>
  z.array(boundedText(2, 180)).min(1).max(maximumItems);

/**
 * The learner sends only the brief they deliberately wrote for this
 * reflection. Studio progress, browser history, and repository access are
 * deliberately outside this contract.
 */
export const FirstVersionBriefSchema = z
  .object({
    person: boundedText(2, 180),
    situation: boundedText(2, 240),
    usefulResult: boundedText(2, 240),
    completePath: boundedText(2, 360),
    trustedFacts: boundedList(8),
    mustHave: boundedList(8),
    notNow: boundedList(10),
    doneWhen: boundedText(2, 360),
  })
  .strict();

export const DebriefRequestSchema = z
  .object({
    sessionId: z.string().uuid(),
    toolLane: z.enum(["hosted", "repository"]),
    firstVersionBrief: FirstVersionBriefSchema,
  })
  .strict();

export const FeatureToPostponeSchema = z
  .object({
    feature: boundedText(1, 180),
    reason: boundedText(1, 320),
  })
  .strict();

/**
 * GPT-5.6 is a Teaching Mirror: it reflects useful questions and next moves.
 * There is intentionally no score, level, verdict, or claim of mastery.
 */
export const TeachingMirrorResultSchema = z
  .object({
    clearStrength: boundedText(1, 320),
    unresolvedAssumptions: z.array(boundedText(1, 280)).length(2),
    featureToPostpone: FeatureToPostponeSchema,
    toolTradeoff: boundedText(1, 320),
    nextMoves: z.array(boundedText(1, 240)).length(3),
  })
  .strict();

const RawDebriefResponseSchema = z
  .object({
    mode: z.enum(["demo", "live"]),
    result: TeachingMirrorResultSchema,
  })
  .strict();

/**
 * The transform keeps the retired v2 component type-safe while v3 replaces
 * it. These aliases are created only when that old client parses a response;
 * the API itself returns only the bounded Teaching Mirror fields above.
 */
export const DebriefResponseSchema = RawDebriefResponseSchema.transform((response) => ({
  ...response,
  result: {
    ...response.result,
    opening: "Your Teaching Mirror is ready.",
    strongestHabit: response.result.clearStrength,
    nextHabit: response.result.unresolvedAssumptions.join(" "),
    nextProjectMoves: response.result.nextMoves,
    practiceChallenge: `${response.result.featureToPostpone.feature}: ${response.result.featureToPostpone.reason}`,
  },
}));

export type FirstVersionBrief = z.infer<typeof FirstVersionBriefSchema>;
export type DebriefRequest = z.infer<typeof DebriefRequestSchema>;
export type TeachingMirrorResult = z.infer<typeof TeachingMirrorResultSchema>;
export type DebriefResponse = z.infer<typeof DebriefResponseSchema>;
