import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: NextRequest) {
    try {
        const { resumeText, jobDescription } = await request.json();

        if (!resumeText || !jobDescription) {
            return NextResponse.json({ error: "Missing resume text or job description" }, { status: 400 });
        }

        const prompt = `
      You are an expert Resume Writer and ATS (Applicant Tracking System) specialist.
      
      Task: Rewrite the user's resume content to specifically match the keywords and requirements of the target job description.
      
      User's Resume Content:
      """
      ${resumeText}
      """
      
      Target Job Description:
      """
      ${jobDescription}
      """
      
      Instructions:
      1. Analyze the Job Description for high-value keywords (hard skills, soft skills, tools).
      2. Rewrite the resume bullet points/sentences to naturally incorporate these keywords without lying.
      3. Improve the impact of the sentences (use strong action verbs).
      4. Identify 3-5 specific "Optimized Points" that make the biggest difference.
      
      Output Format: STRICT JSON only. Do not include markdown formatting like \`\`\`json.
      {
        "optimizationScore": number (0-100, estimated match score of the ORIGINAL resume),
        "postOptimizationScore": number (0-100, estimated match score of the NEW resume),
        "keyKeywordsFound": ["string"],
        "missingKeywordsAdded": ["string"],
        "improvements": [
          {
            "original": "Text from original resume (or 'New Addition' if added)",
            "improved": "Rewritten text optimized for the job",
            "reason": "Brief explanation of the change (e.g. 'Added Python keyword')"
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
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a specialized career coach AI. You output ONLY valid JSON. No markdown formatting."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.5,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const rawContent = data.choices[0]?.message?.content;

        if (!rawContent) {
            throw new Error("Empty response from AI");
        }

        // Clean content to ensure valid JSON (remove markdown code blocks if present)
        let cleanedContent = rawContent.trim();
        if (cleanedContent.startsWith("```json")) {
            cleanedContent = cleanedContent.replace(/^```json\n?/, "").replace(/\n?```$/, "");
        } else if (cleanedContent.startsWith("```")) {
            cleanedContent = cleanedContent.replace(/^```\n?/, "").replace(/\n?```$/, "");
        }

        return NextResponse.json(JSON.parse(cleanedContent));

    } catch (error: any) {
        console.error("Resume Optimization Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to optimize resume" },
            { status: 500 }
        );
    }
}
