const GROQ_API_KEY = process.env.GROQ_API_KEY || ""
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

export async function chatWithGroq(prompt: string): Promise<string> {
  try {
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
            content: "You are SkillTwin AI - a career roadmap expert. Always respond in valid JSON format only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      throw new Error(`Groq error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("Groq API error:", error)
    throw error
  }
}

// Parse JSON from response
function parseJSON(text: string): Record<string, unknown> | null {
  try {
    let cleaned = text.trim()
    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}") + 1

    if (start !== -1 && end > start) {
      cleaned = cleaned.slice(start, end)
      return JSON.parse(cleaned)
    }
  } catch (error) {
    console.error("JSON parse error:", error)
  }
  return null
}

// Generate roadmap using Groq (Fast!)
export async function generateRoadmapWithGroq(
  missingSkills: string[],
  jobRole: string
): Promise<Record<string, unknown>> {
  if (missingSkills.length === 0) {
    return {
      phases: [{
        phase: 1,
        title: "Interview Prep",
        skills: ["Interview Skills", "Portfolio"],
        duration: "2 weeks",
        description: "You have all skills! Focus on interview prep."
      }]
    }
  }

  const prompt = `
Create a comprehensive, industry-standard learning roadmap similar to roadmap.sh for these missing skills: ${missingSkills.join(", ")}
Target job: ${jobRole}

Instructions:
1. Divide into 3 distinct logical phases (Foundation, Application, Advanced).
2. Ensure skills are ordered sequentially.
3. Provide realistic durations and clear descriptions.

Return ONLY this JSON (no extra text):
{
  "phases": [
    {
      "phase": 1,
      "title": "Phase Name",
      "skills": ["skill1", "skill2"],
      "duration": "X weeks",
      "description": "Clear learning objective"
    }
  ],
  "totalWeeks": X,
  "dailyHours": Y
}

JSON:`

  const response = await chatWithGroq(prompt)
  const data = parseJSON(response)

  console.log("Groq Roadmap:", data)

  return data || { phases: [] }
}