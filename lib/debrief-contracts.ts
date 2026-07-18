import { z } from "zod";

export const DebriefRequestSchema = z.object({
  sessionId: z.string().uuid(),
  // The evidence engine owns the versioned mission schema and performs the
  // authoritative parse after this envelope is validated.
  progress: z.unknown(),
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
