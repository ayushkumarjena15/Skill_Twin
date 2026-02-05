const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function chatWithGemini(prompt: string): Promise<string> {
  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0]?.content?.parts[0]?.text || ""
  } catch (error) {
    console.error("Gemini API error:", error)
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

// Get career advice using Gemini (Smart!)
export async function getCareerAdviceWithGemini(
  matchedSkills: string[],
  missingSkills: string[],
  jobRole: string,
  employabilityScore: number
): Promise<Record<string, unknown>> {
  const prompt = `
You are an elite Career Strategist and Technical Recruiter. Analyze this student's unique profile for the role of ${jobRole}.

CURRENT PROFILE:
- Target Role: ${jobRole}
- Match Level: ${employabilityScore}%
- Current Skills: ${matchedSkills.join(", ") || "Newcomer"}
- Skill Gaps: ${missingSkills.join(", ") || "None (Ready for Mastery)"}

Your goal is to provide HIGHLY DYNAMIC, specific, and non-generic career advice. 

Instructions:
1. 'overallAssessment': Don't use templates. Analyze the synergy between what they have and what they lack. Mention the ${jobRole} market specifically.
2. 'strengths': Identify unique "power patterns" in their current skills. How does their existing background give them an edge?
3. 'improvements': Be direct. Tell them exactly which gap is most critical for ${jobRole} right now.
4. 'interviewTips': Provide 3-4 advanced technical or behavioral questions specific to ${jobRole} and their skill gaps.
5. 'salaryRange': Provide realistic data in ₹ LPA (Lakhs Per Annum) for the Indian market, reflecting the complexity of the ${jobRole} role.
6. 'alternativeRoles': Based on their CURRENT skills, what are 2 other high-paying roles they could pivot to immediately?
7. 'motivationalMessage': A punchy, personalized 1-sentence closer.

Return EXACTLY this JSON format:
{
  "overallAssessment": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "interviewTips": ["...", "..."],
  "salaryRange": { "entry": "₹X-Y LPA", "mid": "₹X-Y LPA", "senior": "₹X-Y LPA" },
  "companiesHiring": ["...", "..."],
  "alternativeRoles": ["...", "..."],
  "motivationalMessage": "..."
}

JSON:`

  const response = await chatWithGemini(prompt)
  const data = parseJSON(response)

  console.log("Gemini Career Advice:", data)

  return data || {
    overallAssessment: "Keep learning and improving!",
    strengths: [],
    improvements: missingSkills,
    interviewTips: ["Practice coding", "Prepare for behavioral questions"],
    salaryRange: { entry: "₹3-6 LPA", mid: "₹6-12 LPA", senior: "₹12-25 LPA" },
    companiesHiring: ["TCS", "Infosys", "Wipro"],
    alternativeRoles: [],
    motivationalMessage: "You're on the right track. Keep going!"
  }
}