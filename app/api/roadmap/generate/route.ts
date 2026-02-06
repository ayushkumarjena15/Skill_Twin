import { NextRequest, NextResponse } from "next/server";
import { RoadmapSchema } from "@/lib/schemas";
import { updateUserRoadmap } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function generateAIRoadmap(jobRole: string, missingSkills: string[], currentSkills: string[]) {
    // If Groq key is missing, throw specific error
    if (!GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not defined");
    }

    const prompt = `
    You are an expert technical career coach and engineering lead. Your task is to create a highly practical, "real-world" learning roadmap for a user targeting the role of: ${jobRole}.
    
    User Context:
    - Target Role: ${jobRole}
    - Skills needed to bridge the gap: ${missingSkills.join(", ")}
    - Current Skills (Context): ${currentSkills.join(", ")}

    Instructions for the Roadmap:
    1. **Practical & Real**: Focus on building real-world projects.
    2. **Customized**: Tailor the schedule specifically to mastering the missing skills.
    3. **Duration**: Calculate a realistic total duration in weeks.
    4. **Phases**: Break the roadmap into logical phases (e.g., Fundamentals, Deep Dive, Project Application).
    5. **Output**: Return STRICT JSON only, matching the schema below.

    JSON Schema:
    {
      "totalDurationWeeks": number,
      "generatedAt": "ISO Date String",
      "phases": [
        {
          "id": "UUID",
          "title": "Phase Title",
          "goal": "Phase Goal (Focus on outcome)",
          "durationWeeks": number (min 1),
          "status": "upcoming" | "in-progress" | "completed",
          "focusTopics": ["topic1", "topic2", ...],
          "resources": [{"label": "Resource Name", "url": "Optional URL"}]
        }
      ]
    }
  `;

    const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile", // Using latest versatile model
            messages: [
                {
                    role: "system",
                    content: "You are a specialized career coach AI. You output ONLY valid JSON. No markdown formatting, no generic text."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.5, // Lower temperature for more stable JSON
        })
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
        throw new Error("Empty response from AI");
    }

    try {
        return JSON.parse(content);
    } catch (e) {
        // Fallback: cleaning duplicate JSON markers if any
        const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, jobRole, missingSkills, currentSkills } = body;

        if (!userId || !jobRole || !missingSkills) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Generate Roadmap
        const rawRoadmap = await generateAIRoadmap(jobRole, missingSkills, currentSkills || []);

        // 2. Validate with Zod
        // Ensure IDs are present, if not add them
        if (rawRoadmap.phases) {
            rawRoadmap.phases = rawRoadmap.phases.map((p: any) => ({
                ...p,
                id: p.id || uuidv4(),
                status: p.status || "upcoming"
            }));
        }

        // Set first phase to in-progress if not set
        if (rawRoadmap.phases && rawRoadmap.phases.length > 0 && rawRoadmap.phases[0].status === "upcoming") {
            rawRoadmap.phases[0].status = "in-progress";
        }

        const validation = RoadmapSchema.safeParse(rawRoadmap);

        if (!validation.success) {
            console.error("Schema Validation Error:", validation.error);
            return NextResponse.json({
                error: "AI generated invalid roadmap format",
                details: validation.error
            }, { status: 422 });
        }

        const validRoadmap = validation.data;

        // 3. Persist to DB
        await updateUserRoadmap(userId, validRoadmap);

        return NextResponse.json(validRoadmap);

    } catch (error: any) {
        console.error("Roadmap Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate roadmap" },
            { status: 500 }
        );
    }
}
