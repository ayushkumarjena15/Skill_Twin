import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: NextRequest) {
    try {
        const { jobRole, skillGaps } = await request.json();

        if (!jobRole) {
            return NextResponse.json({ error: "Job Role is required" }, { status: 400 });
        }

        const prompt = `
      You are a strict technical hiring manager for a ${jobRole} position.
      A candidate has applied who specifically lacks these skills: ${skillGaps?.join(", ") || "None specified"}.
      
      Your task: Generate exactly 5 relevant technical interview questions.
      - 2 questions should focus on their **skill gaps** to test if they have basic awareness or to challenge them.
      - 2 questions should be **core fundamental** questions for this role.
      - 1 question should be a **scenario/problem-solving** question.
      
      Output ONLY a JSON object with this format:
      {
        "questions": [
           "Question 1 text...",
           "Question 2 text...",
           ...
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
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a specialized technical interviewer. You output ONLY valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Groq API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error("Empty response from AI");
        }

        // Clean content to ensure valid JSON (remove markdown code blocks if present)
        let cleanedContent = content.trim();
        if (cleanedContent.startsWith("```json")) {
            cleanedContent = cleanedContent.replace(/^```json\n?/, "").replace(/\n?```$/, "");
        } else if (cleanedContent.startsWith("```")) {
            cleanedContent = cleanedContent.replace(/^```\n?/, "").replace(/\n?```$/, "");
        }

        return NextResponse.json(JSON.parse(cleanedContent));

    } catch (error: any) {
        console.error("Interview Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate interview" },
            { status: 500 }
        );
    }
}
