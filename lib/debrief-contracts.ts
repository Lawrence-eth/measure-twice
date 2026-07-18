import { z } from "zod";

import { sceneOrder } from "@/lib/mission";

const SceneSchema = z.enum(sceneOrder);
const ConfidenceSchema = z.union([z.literal(0.4), z.literal(0.7), z.literal(0.9)]);
const StringListSchema = z.array(z.string().min(1).max(80)).max(30);

export const DebriefProgressSchema = z.object({
  scene: SceneSchema,
  started: z.boolean(),
  arrivalChoice: z.string().max(80),
  confidence: z.object({
    arrival: ConfidenceSchema.optional(),
    radius: ConfidenceSchema.optional(),
    transfer: ConfidenceSchema.optional(),
  }),
  target: z.object({
    audience: z.string().max(80).optional(),
    outcome: z.string().max(80).optional(),
    proof: z.string().max(80).optional(),
    nonGoal: z.string().max(80).optional(),
  }),
  repository: StringListSchema,
  context: StringListSchema,
  plan: StringListSchema,
  checksRun: StringListSchema,
  repair: z.object({
    observed: z.string().max(80).optional(),
    reproduce: z.string().max(80).optional(),
    expected: z.string().max(80).optional(),
    preserve: z.string().max(80).optional(),
  }),
  repaired: z.boolean(),
  retested: StringListSchema,
  shipGate: StringListSchema,
  transfer: z.object({
    source: z.string().max(80).optional(),
    proof: z.string().max(80).optional(),
    next: z.string().max(80).optional(),
  }),
  attempts: z.partialRecord(SceneSchema, z.number().int().min(0).max(20)),
  hints: z.partialRecord(SceneSchema, z.number().int().min(0).max(3)),
  fieldNotes: StringListSchema,
  reflection: z.string().trim().max(600),
});

export const DebriefRequestSchema = z.object({
  sessionId: z.string().uuid(),
  progress: DebriefProgressSchema,
});

export const PersonalizedDebriefSchema = z.object({
  opening: z.string().min(1).max(280),
  strongestHabit: z.string().min(1).max(280),
  nextHabit: z.string().min(1).max(280),
  nextProjectMoves: z.array(z.string().min(1).max(180)).length(3),
  practiceChallenge: z.string().min(1).max(280),
});

export const DebriefResponseSchema = z.object({
  mode: z.enum(["demo", "live"]),
  score: z.number().int().min(0).max(100),
  level: z.enum(["Developing", "Independent"]),
  result: PersonalizedDebriefSchema,
});

export type PersonalizedDebrief = z.infer<typeof PersonalizedDebriefSchema>;
export type DebriefResponse = z.infer<typeof DebriefResponseSchema>;
