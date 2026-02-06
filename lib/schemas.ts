import { z } from "zod";

export const PhaseSchema = z.object({
    id: z.string().uuid().or(z.string()), // Allow plain string ID if UUID fails generation in LLM for some reason, but prefer UUID
    title: z.string(), // e.g., "Foundations of System Design"
    goal: z.string(), // e.g., "Master caching strategies"
    durationWeeks: z.number().int().min(1),
    status: z.enum(["completed", "in-progress", "upcoming"]),
    focusTopics: z.array(z.string()),
    resources: z.array(z.object({ label: z.string(), url: z.string().optional() })).optional()
});

export const RoadmapSchema = z.object({
    totalDurationWeeks: z.number(),
    generatedAt: z.string().datetime().or(z.string()), // Relaxed datetime check for safety
    phases: z.array(PhaseSchema)
});

export type AIPhase = z.infer<typeof PhaseSchema>;
export type AIRoadmap = z.infer<typeof RoadmapSchema>;
