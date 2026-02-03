import type { StudentProfile, AnalysisResult, RoadmapPhase, LearningResource } from "@/lib/types"
import { JOB_REQUIREMENTS } from "@/lib/types"
import { analyzeGitHub } from "./github"

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral"

// Chat with Ollama
async function chatWithOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: { temperature: 0.3 }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`)
    }

    const data = await response.json()
    return data.response || ""
  } catch (error) {
    console.error("Ollama connection error:", error)
    throw error
  }
}

// Parse JSON from Ollama response
function parseJSON(text: string): Record<string, unknown> | null {
  try {
    // Clean the response
    let cleaned = text.trim()
    
    // Find JSON object
    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}") + 1
    
    if (start !== -1 && end > start) {
      cleaned = cleaned.slice(start, end)
      
      // Fix common JSON issues
      cleaned = cleaned
        .replace(/,\s*}/g, "}") // Remove trailing commas
        .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
        .replace(/'/g, '"')     // Replace single quotes
        .replace(/\n/g, " ")    // Remove newlines
      
      console.log("Parsed JSON:", cleaned)
      return JSON.parse(cleaned)
    }
  } catch (error) {
    console.error("JSON parse error:", error)
    console.error("Raw text:", text)
  }
  return null
}

// Main analysis function using Ollama
export async function analyzeWithOllama(profile: StudentProfile): Promise<AnalysisResult> {
  const requirements = JOB_REQUIREMENTS[profile.jobRole]

  if (!requirements) {
    throw new Error(`Unknown job role: ${profile.jobRole}`)
  }

  const studentSkills = [...profile.syllabusTopics, ...profile.projects]

  // Analyze GitHub profile (Real API)
  const githubData = await analyzeGitHub(profile.githubUsername)
  console.log("GitHub Analysis:", githubData)

  // Combine student skills with GitHub skills
  const allStudentSkills = [...new Set([...studentSkills, ...githubData.skills])]

  // Prompt for skill analysis
  const analysisPrompt = `
You are a career skill analyzer. Analyze this student profile against job requirements.

STUDENT PROFILE:
- Target Role: ${profile.jobRole}
- CGPA: ${profile.cgpa}/10
- Skills/Topics: ${allStudentSkills.join(", ")}
- GitHub Username: ${profile.githubUsername || "Not provided"}
- GitHub Languages: ${githubData.languages.join(", ") || "None"}
- GitHub Repos: ${githubData.totalRepos}
- GitHub Stars: ${githubData.totalStars}

JOB REQUIREMENTS:
- Core Skills: ${requirements.core.join(", ")}
- Bonus Skills: ${requirements.bonus.join(", ")}

TASK: Match student skills with job requirements. Consider synonyms:
- "JS" = "JavaScript"
- "ML" = "Machine Learning"
- "DBMS" = "SQL" = "Database"
- "Node" = "Node.js"
- "React" = "ReactJS"
- "Python" = "Py"

Return ONLY this JSON format (no extra text):
{
  "matchedSkills": ["matched skill 1", "matched skill 2"],
  "missingSkills": ["missing skill 1", "missing skill 2"],
  "coreMatched": 3,
  "coreTotal": 6,
  "bonusMatched": 2,
  "bonusTotal": 5,
  "strengths": ["strength 1", "strength 2"],
  "advice": "Brief career advice"
}

JSON:`

  // Get analysis from Ollama
  const analysisResponse = await chatWithOllama(analysisPrompt)
  const analysis = parseJSON(analysisResponse)

  console.log("Ollama Analysis Result:", analysis)

  // Calculate scores
  let matchedSkills: string[] = []
  let missingSkills: string[] = []
  let coreSkillsMatch = 0
  let bonusSkillsMatch = 0
  let githubScore = githubData.score

  if (analysis) {
    matchedSkills = (analysis.matchedSkills as string[]) || []
    missingSkills = (analysis.missingSkills as string[]) || []
    
    const coreMatched = (analysis.coreMatched as number) || matchedSkills.length
    const coreTotal = (analysis.coreTotal as number) || requirements.core.length
    const bonusMatched = (analysis.bonusMatched as number) || 0
    const bonusTotal = (analysis.bonusTotal as number) || requirements.bonus.length
    
    coreSkillsMatch = Math.round((coreMatched / Math.max(coreTotal, 1)) * 100)
    bonusSkillsMatch = Math.round((bonusMatched / Math.max(bonusTotal, 1)) * 100)
  } else {
    // Fallback: Use basic matching if Ollama fails
    console.log("Using fallback matching...")
    
    const allSkillsLower = allStudentSkills.map(s => s.toLowerCase())
    
    matchedSkills = requirements.core.filter(skill => 
      allSkillsLower.some(s => 
        s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s)
      )
    )
    
    const matchedBonus = requirements.bonus.filter(skill => 
      allSkillsLower.some(s => 
        s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s)
      )
    )
    
    matchedSkills = [...matchedSkills, ...matchedBonus]
    missingSkills = [
      ...requirements.core.filter(skill => !matchedSkills.includes(skill)),
      ...requirements.bonus.filter(skill => !matchedSkills.includes(skill))
    ]
    
    coreSkillsMatch = Math.round((matchedSkills.filter(s => requirements.core.includes(s)).length / requirements.core.length) * 100)
    bonusSkillsMatch = Math.round((matchedSkills.filter(s => requirements.bonus.includes(s)).length / requirements.bonus.length) * 100)
  }

  const cgpaScore = Math.round((profile.cgpa / 10) * 100)
  
  // Calculate employability score
  const employabilityScore = Math.min(100, Math.round(
    coreSkillsMatch * 0.6 +
    bonusSkillsMatch * 0.2 +
    cgpaScore * 0.1 +
    githubScore * 0.1
  ))

  // Generate roadmap with Ollama
  const roadmap = await generateRoadmap(missingSkills, profile.jobRole)
  
  // Generate resources with Ollama
  const resources = await generateResources(missingSkills)

  return {
    employabilityScore,
    matchedSkills,
    missingSkills,
    coreSkillsMatch,
    bonusSkillsMatch,
    cgpaScore,
    githubScore,
    roadmap,
    resources
  }
}

// Generate learning roadmap using Ollama
async function generateRoadmap(missingSkills: string[], jobRole: string): Promise<RoadmapPhase[]> {
  if (missingSkills.length === 0) {
    return [{
      phase: 1,
      title: "Polish & Apply",
      skills: ["Interview Prep", "Portfolio"],
      duration: "2 weeks",
      description: "You have all required skills! Focus on interview prep."
    }]
  }

  const prompt = `
Create a 3-phase learning roadmap for these missing skills: ${missingSkills.join(", ")}
Target role: ${jobRole}

Return ONLY this JSON format (no extra text):
{
  "phases": [
    {
      "phase": 1,
      "title": "Foundation",
      "skills": ["skill1", "skill2"],
      "duration": "4 weeks",
      "description": "What to learn and why"
    },
    {
      "phase": 2,
      "title": "Application",
      "skills": ["skill3"],
      "duration": "4 weeks",
      "description": "What to learn and why"
    },
    {
      "phase": 3,
      "title": "Mastery",
      "skills": ["skill4"],
      "duration": "4 weeks",
      "description": "What to learn and why"
    }
  ]
}

JSON:`

  const response = await chatWithOllama(prompt)
  const data = parseJSON(response)

  if (data && Array.isArray(data.phases)) {
    return data.phases as RoadmapPhase[]
  }

  // Fallback roadmap
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

// Generate learning resources using Ollama
async function generateResources(missingSkills: string[]): Promise<LearningResource[]> {
  if (missingSkills.length === 0) return []

  const skillsToLearn = missingSkills.slice(0, 5)

  const prompt = `
Recommend the best FREE learning resources for these skills: ${skillsToLearn.join(", ")}

Return ONLY this JSON format (no extra text):
{
  "resources": [
    {
      "skill": "skill name",
      "platform": "YouTube/Coursera/freeCodeCamp/Udemy",
      "url": "https://actual-url.com",
      "duration": "10 hours"
    }
  ]
}

Use REAL URLs from:
- YouTube tutorials
- freeCodeCamp
- Coursera (free courses)
- Official documentation

JSON:`

  const response = await chatWithOllama(prompt)
  const data = parseJSON(response)

  if (data && Array.isArray(data.resources)) {
    return data.resources as LearningResource[]
  }

  // Fallback resources
  const platforms = [
    { name: "YouTube", baseUrl: "https://youtube.com/results?search_query=" },
    { name: "freeCodeCamp", baseUrl: "https://freecodecamp.org/news/search/?query=" },
    { name: "Coursera", baseUrl: "https://coursera.org/search?query=" }
  ]

  return skillsToLearn.map((skill, index) => {
    const platform = platforms[index % platforms.length]
    return {
      skill,
      platform: platform.name,
      url: `${platform.baseUrl}${encodeURIComponent(skill + " tutorial")}`,
      duration: `${Math.floor(Math.random() * 15 + 5)} hours`
    }
  })
}