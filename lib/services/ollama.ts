import type { StudentProfile, AnalysisResult, RoadmapPhase, LearningResource } from "@/lib/types"
import { JOB_REQUIREMENTS } from "@/lib/types"
import { analyzeGitHub } from "./github"

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral"

// =============================================
// CORE OLLAMA FUNCTIONS
// =============================================

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

// =============================================
// TYPES
// =============================================

export interface SuggestedRole {
  role: string
  matchScore: number
  reason: string
  requiredSkills: string[]
  matchedSkills: string[]
  missingSkills: string[]
}

export interface JobSuggestionResult {
  suggestedRoles: SuggestedRole[]
  detectedSkills: string[]
  experienceLevel: string
  domains: string[]
}

// =============================================
// SKILL EXTRACTION FROM RESUME
// =============================================

export async function extractSkillsFromResume(resumeText: string): Promise<{
  skills: string[]
  experienceLevel: string
  education: string
  domains: string[]
}> {
  const prompt = `
You are an expert resume parser. Extract all technical and professional skills.

RESUME TEXT:
${resumeText.slice(0, 4000)}

Return ONLY this JSON:
{
  "skills": ["Python", "JavaScript", "React", "Node.js"],
  "experienceLevel": "fresher|junior|mid|senior",
  "education": "B.Tech Computer Science",
  "domains": ["web development", "backend"]
}

JSON:`

  const response = await chatWithOllama(prompt)
  const result = parseJSON(response)

  if (result) {
    return {
      skills: (result.skills as string[]) || [],
      experienceLevel: (result.experienceLevel as string) || "fresher",
      education: (result.education as string) || "Not specified",
      domains: (result.domains as string[]) || []
    }
  }

  return {
    skills: [],
    experienceLevel: "fresher",
    education: "Not detected",
    domains: []
  }
}

// =============================================
// JOB ROLE SUGGESTION (SINGLE DEFINITION)
// =============================================

export async function suggestJobRolesFromSkills(
  skills: string[],
  resumeText?: string
): Promise<JobSuggestionResult> {
  
  let detectedSkills = skills
  let experienceLevel = "fresher"
  let domains: string[] = []

  // Extract skills from resume if provided and no skills given
  if (resumeText && skills.length === 0) {
    const extracted = await extractSkillsFromResume(resumeText)
    detectedSkills = extracted.skills
    experienceLevel = extracted.experienceLevel
    domains = extracted.domains
  }

  // Return default if no skills
  if (detectedSkills.length === 0) {
    return {
      suggestedRoles: [{
        role: "Software Engineer",
        matchScore: 50,
        reason: "General entry-level role",
        requiredSkills: ["Programming", "Problem Solving"],
        matchedSkills: [],
        missingSkills: ["Programming Language", "Version Control"]
      }],
      detectedSkills: [],
      experienceLevel: "fresher",
      domains: []
    }
  }

  // AI matching
  const prompt = `
You are a career advisor. Suggest TOP 3 job roles for these skills.

SKILLS: ${detectedSkills.join(", ")}

AVAILABLE ROLES:
1. Full Stack Developer - React, Node.js, JavaScript, SQL, Git
2. Frontend Developer - React/Vue/Angular, JavaScript, CSS, HTML
3. Backend Developer - Node.js/Python/Java, SQL, REST APIs, Docker
4. Data Scientist - Python, ML, Statistics, SQL, Pandas
5. Machine Learning Engineer - Python, TensorFlow/PyTorch, ML
6. DevOps Engineer - Docker, Kubernetes, AWS, CI/CD, Linux
7. Mobile App Developer - React Native/Flutter/Swift/Kotlin
8. Cloud Architect - AWS/Azure/GCP, Networking, Terraform
9. Data Analyst - SQL, Excel, Python, Tableau/PowerBI
10. Software Engineer - Any programming, DSA, Git

Return ONLY this JSON:
{
  "suggestedRoles": [
    {
      "role": "Full Stack Developer",
      "matchScore": 75,
      "reason": "Strong frontend and backend skills",
      "requiredSkills": ["React", "Node.js", "JavaScript", "SQL"],
      "matchedSkills": ["React", "JavaScript"],
      "missingSkills": ["Node.js", "SQL"]
    }
  ]
}

JSON:`

  const response = await chatWithOllama(prompt)
  const result = parseJSON(response)

  if (result && Array.isArray(result.suggestedRoles)) {
    const roles = (result.suggestedRoles as SuggestedRole[])
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)

    return {
      suggestedRoles: roles,
      detectedSkills,
      experienceLevel,
      domains
    }
  }

  // Fallback matching
  const fallbackRoles: SuggestedRole[] = []
  const skillsLower = detectedSkills.map(s => s.toLowerCase())

  for (const [role, requirements] of Object.entries(JOB_REQUIREMENTS)) {
    const coreMatches = requirements.core.filter(skill =>
      skillsLower.some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s))
    )
    const matchScore = Math.round((coreMatches.length / requirements.core.length) * 100)

    if (matchScore > 30) {
      fallbackRoles.push({
        role,
        matchScore,
        reason: `Matches ${coreMatches.length} of ${requirements.core.length} core skills`,
        requiredSkills: requirements.core,
        matchedSkills: coreMatches,
        missingSkills: requirements.core.filter(s => !coreMatches.includes(s))
      })
    }
  }

  fallbackRoles.sort((a, b) => b.matchScore - a.matchScore)

  return {
    suggestedRoles: fallbackRoles.slice(0, 3),
    detectedSkills,
    experienceLevel,
    domains
  }
}

// =============================================
// MAIN ANALYSIS FUNCTION
// =============================================

export async function analyzeWithOllama(profile: StudentProfile): Promise<AnalysisResult> {
  const requirements = JOB_REQUIREMENTS[profile.jobRole]

  if (!requirements) {
    throw new Error(`Unknown job role: ${profile.jobRole}`)
  }

  const studentSkills = [...profile.syllabusTopics, ...profile.projects]
  const githubData = await analyzeGitHub(profile.githubUsername)
  const allStudentSkills = [...new Set([...studentSkills, ...githubData.skills])]

  const analysisPrompt = `
You are a career skill analyzer. Analyze this student profile.

STUDENT:
- Target Role: ${profile.jobRole}
- CGPA: ${profile.cgpa}/10
- Skills: ${allStudentSkills.join(", ")}
- GitHub Repos: ${githubData.totalRepos}

JOB REQUIREMENTS:
- Core: ${requirements.core.join(", ")}
- Bonus: ${requirements.bonus.join(", ")}

Consider synonyms: JS=JavaScript, ML=Machine Learning, DBMS=SQL

Return ONLY this JSON:
{
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "coreMatched": 3,
  "coreTotal": 6,
  "bonusMatched": 2,
  "bonusTotal": 5
}

JSON:`

  const analysisResponse = await chatWithOllama(analysisPrompt)
  const analysis = parseJSON(analysisResponse)

  let matchedSkills: string[] = []
  let missingSkills: string[] = []
  let coreSkillsMatch = 0
  let bonusSkillsMatch = 0

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
    // Fallback
    const allSkillsLower = allStudentSkills.map(s => s.toLowerCase())
    
    matchedSkills = requirements.core.filter(skill => 
      allSkillsLower.some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s))
    )
    
    missingSkills = requirements.core.filter(skill => !matchedSkills.includes(skill))
    coreSkillsMatch = Math.round((matchedSkills.length / requirements.core.length) * 100)
  }

  const cgpaScore = Math.round((profile.cgpa / 10) * 100)
  const githubScore = githubData.score
  
  const employabilityScore = Math.min(100, Math.round(
    coreSkillsMatch * 0.6 +
    bonusSkillsMatch * 0.2 +
    cgpaScore * 0.1 +
    githubScore * 0.1
  ))

  const roadmap = await generateRoadmap(missingSkills, profile.jobRole)
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

// =============================================
// ROADMAP GENERATION
// =============================================

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
Create 3-phase roadmap for: ${missingSkills.join(", ")}
Target: ${jobRole}

Return ONLY this JSON:
{
  "phases": [
    {"phase": 1, "title": "Foundation", "skills": ["skill1"], "duration": "4 weeks", "description": "Learn basics"},
    {"phase": 2, "title": "Application", "skills": ["skill2"], "duration": "4 weeks", "description": "Build projects"},
    {"phase": 3, "title": "Mastery", "skills": ["skill3"], "duration": "4 weeks", "description": "Advanced topics"}
  ]
}

JSON:`

  const response = await chatWithOllama(prompt)
  const data = parseJSON(response)

  if (data && Array.isArray(data.phases)) {
    return data.phases as RoadmapPhase[]
  }

  // Fallback
  const perPhase = Math.ceil(missingSkills.length / 3)
  return [
    { phase: 1, title: "Foundation", skills: missingSkills.slice(0, perPhase), duration: "4 weeks", description: "Core knowledge" },
    { phase: 2, title: "Application", skills: missingSkills.slice(perPhase, perPhase * 2), duration: "4 weeks", description: "Build projects" },
    { phase: 3, title: "Mastery", skills: missingSkills.slice(perPhase * 2), duration: "4 weeks", description: "Advanced concepts" }
  ].filter(p => p.skills.length > 0)
}

// =============================================
// RESOURCES GENERATION
// =============================================

async function generateResources(missingSkills: string[]): Promise<LearningResource[]> {
  if (missingSkills.length === 0) return []

  const skills = missingSkills.slice(0, 5)

  const prompt = `
Recommend FREE resources for: ${skills.join(", ")}

Return ONLY this JSON:
{
  "resources": [
    {"skill": "React", "platform": "YouTube", "url": "https://youtube.com/...", "duration": "10 hours"}
  ]
}

JSON:`

  const response = await chatWithOllama(prompt)
  const data = parseJSON(response)

  if (data && Array.isArray(data.resources)) {
    return data.resources as LearningResource[]
  }

  // Fallback
  return skills.map(skill => ({
    skill,
    platform: "YouTube",
    url: `https://youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial")}`,
    duration: "10 hours"
  }))
}