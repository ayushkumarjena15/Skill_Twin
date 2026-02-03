import type { StudentProfile, AnalysisResult, RoadmapPhase, LearningResource } from "./types"
import { JOB_REQUIREMENTS } from "./types"

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim()
}

function skillMatches(studentSkill: string, requiredSkill: string): boolean {
  const student = normalizeSkill(studentSkill)
  const required = normalizeSkill(requiredSkill)
  
  // Direct match
  if (student === required) return true
  
  // Contains match
  if (student.includes(required) || required.includes(student)) return true
  
  // Common synonyms
  const synonyms: Record<string, string[]> = {
    "javascript": ["js", "es6", "ecmascript"],
    "typescript": ["ts"],
    "python": ["py"],
    "react": ["reactjs", "react.js"],
    "node.js": ["nodejs", "node"],
    "sql": ["mysql", "postgresql", "postgres", "sqlite", "database", "dbms"],
    "machine learning": ["ml", "ai", "artificial intelligence"],
    "deep learning": ["dl", "neural networks"],
    "git": ["github", "version control", "gitlab"],
    "docker": ["containerization", "containers"],
    "aws": ["amazon web services", "cloud"],
    "rest api": ["api", "restful", "web services"],
    "html": ["html5"],
    "css": ["css3", "styling"],
  }
  
  for (const [key, values] of Object.entries(synonyms)) {
    if (
      (required === key || values.includes(required)) &&
      (student === key || values.includes(student))
    ) {
      return true
    }
  }
  
  return false
}

function findMatchedSkills(studentSkills: string[], requiredSkills: string[]): string[] {
  const matched: string[] = []
  
  for (const required of requiredSkills) {
    for (const student of studentSkills) {
      if (skillMatches(student, required)) {
        matched.push(required)
        break
      }
    }
  }
  
  return matched
}

function generateRoadmap(missingSkills: string[], jobRole: string): RoadmapPhase[] {
  const skillsPerPhase = Math.ceil(missingSkills.length / 3)
  const phases: RoadmapPhase[] = []
  
  const phaseDescriptions = [
    "Build foundational knowledge and get started with basics",
    "Apply skills through hands-on projects and exercises",
    "Master advanced concepts and prepare for job applications",
  ]
  
  for (let i = 0; i < 3 && i * skillsPerPhase < missingSkills.length; i++) {
    const phaseSkills = missingSkills.slice(i * skillsPerPhase, (i + 1) * skillsPerPhase)
    phases.push({
      phase: i + 1,
      title: i === 0 ? "Foundation" : i === 1 ? "Application" : "Mastery",
      skills: phaseSkills,
      duration: `${phaseSkills.length * 2} weeks`,
      description: phaseDescriptions[i],
    })
  }
  
  return phases
}

function generateResources(missingSkills: string[]): LearningResource[] {
  const platforms = [
    { name: "Udemy", baseUrl: "https://udemy.com/courses/search/?q=" },
    { name: "Coursera", baseUrl: "https://coursera.org/search?query=" },
    { name: "freeCodeCamp", baseUrl: "https://freecodecamp.org/learn" },
    { name: "YouTube", baseUrl: "https://youtube.com/results?search_query=" },
  ]
  
  return missingSkills.slice(0, 6).map((skill, index) => {
    const platform = platforms[index % platforms.length]
    return {
      skill,
      platform: platform.name,
      url: `${platform.baseUrl}${encodeURIComponent(skill)}`,
      duration: `${Math.floor(Math.random() * 20 + 10)} hours`,
    }
  })
}

export function analyzeProfile(profile: StudentProfile): AnalysisResult {
  const requirements = JOB_REQUIREMENTS[profile.jobRole]
  
  if (!requirements) {
    throw new Error(`Unknown job role: ${profile.jobRole}`)
  }
  
  const studentSkills = [...profile.syllabusTopics, ...profile.projects]
  
  const matchedCore = findMatchedSkills(studentSkills, requirements.core)
  const matchedBonus = findMatchedSkills(studentSkills, requirements.bonus)
  
  const missingCore = requirements.core.filter(skill => !matchedCore.includes(skill))
  const missingBonus = requirements.bonus.filter(skill => !matchedBonus.includes(skill))
  
  // Calculate scores
  const coreSkillsMatch = (matchedCore.length / requirements.core.length) * 100
  const bonusSkillsMatch = (matchedBonus.length / requirements.bonus.length) * 100
  const cgpaScore = (profile.cgpa / 10) * 100
  const githubScore = profile.githubUsername ? 75 : 0 // Simulated GitHub analysis
  
  // Weighted employability score
  const employabilityScore = Math.round(
    coreSkillsMatch * 0.6 +
    bonusSkillsMatch * 0.2 +
    cgpaScore * 0.1 +
    githubScore * 0.1
  )
  
  const roadmap = generateRoadmap([...missingCore, ...missingBonus], profile.jobRole)
  const resources = generateResources([...missingCore, ...missingBonus])
  
  return {
    employabilityScore: Math.min(100, employabilityScore),
    matchedSkills: [...matchedCore, ...matchedBonus],
    missingSkills: [...missingCore, ...missingBonus],
    coreSkillsMatch: Math.round(coreSkillsMatch),
    bonusSkillsMatch: Math.round(bonusSkillsMatch),
    cgpaScore: Math.round(cgpaScore),
    githubScore,
    roadmap,
    resources,
  }
}
