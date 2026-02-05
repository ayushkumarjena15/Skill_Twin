import type { StudentProfile, AnalysisResult, RoadmapPhase, LearningResource, CareerAdvice, TimetableEntry, MultiAgentResult } from "@/lib/types"
import { JOB_REQUIREMENTS } from "@/lib/types"
import { analyzeGitHub } from "./github"
import { generateRoadmapWithGroq } from "./groq"
import { getCareerAdviceWithGemini } from "./gemini"
import { searchJobs, calculateJobMatch, type Job } from "./jobs"

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral"

// Chat with Ollama (Agent 1: Skill Analysis)
async function chatWithOllama(prompt: string): Promise<string> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout

    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1, // Lowered for better JSON consistency
          num_predict: 500
        }
      }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`)
    }

    const data = await response.json()
    return data.response || ""
  } catch (error) {
    console.error("Ollama error:", error)
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
      cleaned = cleaned
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .replace(/'/g, '"')
        .replace(/\n/g, " ")

      return JSON.parse(cleaned)
    }
  } catch (error) {
    console.error("JSON parse error:", error)
  }
  return null
}

// Fallback skill matching (fast, no AI)
function fallbackSkillMatch(
  studentSkills: string[],
  requirements: { core: string[]; bonus: string[] }
) {
  const allSkillsLower = studentSkills.map(s => s.toLowerCase())

  const matchedCore = requirements.core.filter(skill =>
    allSkillsLower.some(s =>
      s.includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(s)
    )
  )

  const matchedBonus = requirements.bonus.filter(skill =>
    allSkillsLower.some(s =>
      s.includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(s)
    )
  )

  const missingCore = requirements.core.filter(s => !matchedCore.includes(s))
  const missingBonus = requirements.bonus.filter(s => !matchedBonus.includes(s))

  return {
    matchedSkills: [...matchedCore, ...matchedBonus],
    missingSkills: [...missingCore, ...missingBonus],
    coreSkillsMatch: requirements.core.length > 0 ? Math.round((matchedCore.length / requirements.core.length) * 100) : 100,
    bonusSkillsMatch: requirements.bonus.length > 0 ? Math.round((matchedBonus.length / requirements.bonus.length) * 100) : 100
  }
}

// Generate fallback roadmap (no AI)
function fallbackRoadmap(missingSkills: string[]): RoadmapPhase[] {
  if (missingSkills.length === 0) {
    return [{
      phase: 1,
      title: "Interview Prep",
      skills: ["Interview Skills", "Portfolio"],
      duration: "2 weeks",
      description: "You have all skills! Focus on interview prep."
    }]
  }

  const skillsPerPhase = Math.ceil(missingSkills.length / 3)
  return [
    {
      phase: 1,
      title: "Foundation",
      skills: missingSkills.slice(0, skillsPerPhase),
      duration: `${skillsPerPhase * 2} weeks`,
      description: "Build core knowledge"
    },
    {
      phase: 2,
      title: "Application",
      skills: missingSkills.slice(skillsPerPhase, skillsPerPhase * 2),
      duration: `${skillsPerPhase * 2} weeks`,
      description: "Apply through projects"
    },
    {
      phase: 3,
      title: "Mastery",
      skills: missingSkills.slice(skillsPerPhase * 2),
      duration: `${skillsPerPhase * 2} weeks`,
      description: "Advanced concepts"
    }
  ].filter(phase => phase.skills.length > 0)
}

// Generate resources (no AI)
function generateResources(missingSkills: string[]): LearningResource[] {
  if (missingSkills.length === 0) return []

  const platforms = [
    { name: "YouTube", baseUrl: "https://youtube.com/results?search_query=" },
    { name: "freeCodeCamp", baseUrl: "https://freecodecamp.org/news/search/?query=" },
    { name: "Coursera", baseUrl: "https://coursera.org/search?query=" }
  ]

  return missingSkills.slice(0, 6).map((skill, index) => {
    const platform = platforms[index % platforms.length]
    return {
      skill,
      platform: platform.name,
      url: `${platform.baseUrl}${encodeURIComponent(skill + " tutorial")}`,
      duration: `${Math.floor(Math.random() * 15 + 5)} hours`
    }
  })
}

// Generate a weekly timetable
function generateTimetable(missingSkills: string[]): TimetableEntry[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timetable: TimetableEntry[] = []

  const primarySkill = missingSkills[0] || "Review Core Concepts"
  const secondarySkill = missingSkills[1] || "Project Work"
  const tertiarySkill = missingSkills[2] || "Interview Prep"

  days.forEach((day, index) => {
    if (index < 5) { // Weekdays
      timetable.push({
        day,
        morning: `Mastering ${primarySkill} - Concepts & Theory`,
        afternoon: `Hands-on Practice: ${secondarySkill}`,
        evening: `Refining Projects or ${tertiarySkill}`
      })
    } else { // Weekends
      timetable.push({
        day,
        morning: `Weekly Review & Deep Dive: ${primarySkill}`,
        afternoon: "Open Source Contribution / Portfolio Building",
        evening: "Mock Interviews & Soft Skills"
      })
    }
  })

  return timetable
}

// Main Multi-Agent Analysis (PARALLEL & FAST)
export async function analyzeWithMultipleAgents(
  profile: StudentProfile
): Promise<MultiAgentResult> {
  console.log("🚀 Starting Multi-Agent Analysis (Parallel Mode)...")
  console.time("⏱️ Total Analysis Time")

  const agentsUsed: string[] = []
  const requirements = JOB_REQUIREMENTS[profile.jobRole]

  if (!requirements) {
    throw new Error(`Unknown job role: ${profile.jobRole}`)
  }

  // ═══════════════════════════════════════════════════
  // STEP 1: GitHub Analysis (Fast, do first)
  // ═══════════════════════════════════════════════════
  console.time("🐙 GitHub")
  const githubData = await analyzeGitHub(profile.githubUsername)
  console.timeEnd("🐙 GitHub")

  const studentSkills = [...profile.syllabusTopics, ...profile.projects]
  const allStudentSkills = [...new Set([...studentSkills, ...githubData.skills])]
  agentsUsed.push("GitHub API")

  // ═══════════════════════════════════════════════════
  // STEP 2: Baseline Matching (Deterministic Context)
  // ═══════════════════════════════════════════════════
  const baseline = fallbackSkillMatch(allStudentSkills, requirements)
  const baselineScore = Math.min(100, Math.round(
    baseline.coreSkillsMatch * 0.6 +
    baseline.bonusSkillsMatch * 0.2 +
    (profile.cgpa / 10) * 10 +
    githubData.score * 0.1
  ))

  // ═══════════════════════════════════════════════════
  // STEP 3: Run AI Agents in PARALLEL (with Context)
  // ═══════════════════════════════════════════════════
  console.log("⚡ Running agents in parallel with context...")

  // Prepare Ollama prompt
  const analysisPrompt = `
Analyze skills match based EXACTLY on these lists. 
Student Skills: ${allStudentSkills.join(", ")}
Target Job Role: ${profile.jobRole}
Required Core Skills: ${requirements.core.join(", ")}
Required Bonus Skills: ${requirements.bonus.join(", ")}

Instructions:
1. 'matchedSkills' = intersection of Student Skills and (Core + Bonus).
2. 'missingSkills' = (Core + Bonus) minus matchedSkills.
3. 'coreMatched' = count of Core Skills matched.
4. 'bonusMatched' = count of Bonus Skills matched.
5. Return ONLY a JSON object.

JSON Format:
{"matchedSkills":["skill1"],"missingSkills":["skill2"],"coreMatched":0,"coreTotal":${requirements.core.length},"bonusMatched":0,"bonusTotal":${requirements.bonus.length}}
`

  // Run all in parallel with Promise.allSettled
  console.time("⚡ Parallel Agents")
  const [ollamaResult, groqResult, geminiResult, jobsResult] = await Promise.allSettled([
    // Agent 1: Ollama (Mistral)
    chatWithOllama(analysisPrompt),

    // Agent 2: Groq (Roadmap)
    generateRoadmapWithGroq(
      baseline.missingSkills,
      profile.jobRole
    ),

    // Agent 3: Gemini (Career Advice)
    getCareerAdviceWithGemini(
      baseline.matchedSkills,
      baseline.missingSkills,
      profile.jobRole,
      baselineScore
    ),

    // Agent 4: Jobs (Search)
    searchJobs(allStudentSkills, profile.jobRole)
  ])
  console.timeEnd("⚡ Parallel Agents")

  // ═══════════════════════════════════════════════════
  // STEP 3: Process Results (DETERMINISTIC & ROBUST)
  // ═══════════════════════════════════════════════════

  // 1. Initialize with baseline matches (already calculated in STEP 2)
  let matchedSkills = baseline.matchedSkills
  let missingSkills = baseline.missingSkills
  let coreSkillsMatch = baseline.coreSkillsMatch
  let bonusSkillsMatch = baseline.bonusSkillsMatch

  // 2. Try to supplement with AI results if available
  if (ollamaResult.status === "fulfilled") {
    const analysis = parseJSON(ollamaResult.value)
    if (analysis) {
      const aiMatched = (analysis.matchedSkills as string[]) || []

      // Combine unique skills from AI and Baseline
      const combinedMatched = [...new Set([...matchedSkills, ...aiMatched])]

      // Re-calculate scores based on combined list to ensure accuracy
      const finalMatchedCore = requirements.core.filter(skill =>
        combinedMatched.some(m => m.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(m.toLowerCase()))
      )
      const finalMatchedBonus = requirements.bonus.filter(skill =>
        combinedMatched.some(m => m.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(m.toLowerCase()))
      )

      matchedSkills = combinedMatched
      missingSkills = [...requirements.core, ...requirements.bonus].filter(s => !matchedSkills.includes(s))

      coreSkillsMatch = requirements.core.length > 0 ? Math.round((finalMatchedCore.length / requirements.core.length) * 100) : 100
      bonusSkillsMatch = requirements.bonus.length > 0 ? Math.round((finalMatchedBonus.length / requirements.bonus.length) * 100) : 100

      agentsUsed.push("Ollama (Mistral)")
    }
  }

  // Process Groq result
  let roadmap: RoadmapPhase[] = []
  if (groqResult.status === "fulfilled" && groqResult.value) {
    const groqData = groqResult.value as Record<string, unknown>
    if (Array.isArray(groqData.phases)) {
      roadmap = groqData.phases as RoadmapPhase[]
      agentsUsed.push("Groq (Llama3)")
    }
  }
  if (roadmap.length === 0) {
    roadmap = fallbackRoadmap(missingSkills)
  }

  // Process Gemini result
  let careerAdvice: CareerAdvice
  if (geminiResult.status === "fulfilled" && geminiResult.value) {
    careerAdvice = geminiResult.value as unknown as CareerAdvice
    agentsUsed.push("Gemini (Google)")
  } else {
    careerAdvice = {
      overallAssessment: "Keep improving your skills!",
      strengths: matchedSkills.slice(0, 3),
      improvements: missingSkills.slice(0, 3),
      interviewTips: ["Practice coding", "Prepare projects"],
      motivationalMessage: "You're on the right path!"
    }
  }

  // Process Jobs result
  let matchingJobs: Job[] = []
  if (jobsResult.status === "fulfilled" && Array.isArray(jobsResult.value)) {
    matchingJobs = jobsResult.value.map(job => ({
      ...job,
      matchScore: calculateJobMatch(allStudentSkills, job.title)
    })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    agentsUsed.push("JSearch (RapidAPI)")
  }

  // Calculate scores
  const githubScore = githubData.score
  const cgpaScore = Math.round((profile.cgpa / 10) * 100)
  const employabilityScore = Math.min(100, Math.round(
    coreSkillsMatch * 0.6 +
    bonusSkillsMatch * 0.2 +
    cgpaScore * 0.1 +
    githubScore * 0.1
  ))

  // Generate resources and timetable
  const resources = generateResources(missingSkills)
  const timetable = generateTimetable(missingSkills)

  console.timeEnd("⏱️ Total Analysis Time")
  console.log("✅ Analysis Complete! Agents used:", agentsUsed)

  return {
    employabilityScore,
    matchedSkills,
    missingSkills,
    coreSkillsMatch,
    bonusSkillsMatch,
    cgpaScore,
    githubScore,
    roadmap,
    resources,
    careerAdvice,
    matchingJobs,
    agentsUsed,
    timetable
  }
}