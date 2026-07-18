import { z } from "zod";

export const LessonIdSchema = z.enum(["await-microtask"]);

export const DiagnosisSchema = z.object({
  hypothesis: z.string().min(1).max(360),
  misconception: z.string().min(1).max(360),
  whyItFeelsRight: z.string().min(1).max(500),
  discriminatingQuestion: z.string().min(1).max(300),
  hint: z.string().min(1).max(300),
  confidence: z.number().min(0).max(1),
});

export type Diagnosis = z.infer<typeof DiagnosisSchema>;

export const TeachbackEvaluationSchema = z.object({
  status: z.enum(["revised", "partial", "unchanged"]),
  feedback: z.string().min(1).max(500),
  evidenceUsed: z.array(z.string().max(200)).max(8),
  correctedRule: z.string().min(1).max(400),
});

export type TeachbackEvaluation = z.infer<
  typeof TeachbackEvaluationSchema
>;

export const TransferEvaluationSchema = z.object({
  status: z.enum(["verified", "partial", "missed"]),
  feedback: z.string().min(1).max(500),
  causalLink: z.string().min(1).max(400),
});

export type TransferEvaluation = z.infer<typeof TransferEvaluationSchema>;

const SessionIdSchema = z.string().uuid();

const DiagnoseRequestSchema = z.object({
  action: z.literal("diagnose"),
  sessionId: SessionIdSchema,
  lessonId: LessonIdSchema,
  predictionId: z.string().min(1).max(80),
  explanation: z.string().trim().min(12).max(1_200),
});

const EvaluateTeachbackRequestSchema = z.object({
  action: z.literal("evaluate_teachback"),
  sessionId: SessionIdSchema,
  lessonId: LessonIdSchema,
  originalExplanation: z.string().trim().min(12).max(1_200),
  teachback: z.string().trim().min(12).max(1_200),
  observation: z.array(z.string().max(200)).min(1).max(30),
});

const EvaluateTransferRequestSchema = z.object({
  action: z.literal("evaluate_transfer"),
  sessionId: SessionIdSchema,
  lessonId: LessonIdSchema,
  predictionId: z.string().min(1).max(80),
  rationale: z.string().trim().min(12).max(1_200),
  observation: z.array(z.string().max(200)).min(1).max(30),
});

export const TutorRequestSchema = z.discriminatedUnion("action", [
  DiagnoseRequestSchema,
  EvaluateTeachbackRequestSchema,
  EvaluateTransferRequestSchema,
]);

export type TutorRequest = z.infer<typeof TutorRequestSchema>;

export const TutorResponseSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("diagnose"),
    mode: z.enum(["demo", "live"]),
    result: DiagnosisSchema,
  }),
  z.object({
    action: z.literal("evaluate_teachback"),
    mode: z.enum(["demo", "live"]),
    result: TeachbackEvaluationSchema,
  }),
  z.object({
    action: z.literal("evaluate_transfer"),
    mode: z.enum(["demo", "live"]),
    result: TransferEvaluationSchema,
  }),
]);

export type TutorResponse = z.infer<typeof TutorResponseSchema>;
