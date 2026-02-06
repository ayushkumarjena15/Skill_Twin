import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: NextRequest) {
    try {
        const { question, userAnswer, jobRole } = await request.json();

        if (!question || !userAnswer) {
            return NextResponse.json({ error: "Question and Answer are required" }, { status: 400 });
        }

        const prompt = `
      Roles: 
      - You: Senior Technical Hiring Manager for ${jobRole}.
      - Candidate: Provided an answer to your interview question.

      Question: "${question}"
      Candidate's Answer: "${userAnswer}"

      Task: Evaluate the answer.
      1. Rate it from 0 to 10 based on correctness, depth, and clarity.
      2. Provide specific, constructive feedback (what was good, what to improve).
      3. Provide a "Model Answer" logic (how a senior engineer would answer).

      Output ONLY a JSON object with this format:
      {
        "score": number,
        "feedback": "string",
        "improvedAnswer": "string"
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
                        content: "You are a fair but rigorous technical interviewer. You output ONLY valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3, // Lower temperature for more consistent evaluation
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
        console.error("Interview Evaluation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to evaluate answer" },
            { status: 500 }
        );
    }
}
