// app/api/suggest-jobs/route.ts

import { NextRequest, NextResponse } from "next/server"

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral"

// Job role requirements database
const JOB_ROLES = {
  "Full Stack Developer": {
    core: ["JavaScript", "React", "Node.js", "SQL", "Git", "HTML", "CSS"],
    bonus: ["TypeScript", "MongoDB", "Docker", "AWS", "REST API"]
  },
  "Frontend Developer": {
    core: ["JavaScript", "React", "HTML", "CSS", "Git", "Responsive Design"],
    bonus: ["TypeScript", "Vue", "Angular", "Tailwind", "Figma"]
  },
  "Backend Developer": {
    core: ["Python", "Node.js", "SQL", "REST API", "Git", "Database"],
    bonus: ["Docker", "AWS", "MongoDB", "Redis", "Microservices"]
  },
  "Data Scientist": {
    core: ["Python", "Machine Learning", "SQL", "Statistics", "Pandas", "NumPy"],
    bonus: ["TensorFlow", "PyTorch", "Deep Learning", "R", "Tableau"]
  },
  "Machine Learning Engineer": {
    core: ["Python", "Machine Learning", "TensorFlow", "Deep Learning", "SQL"],
    bonus: ["PyTorch", "MLOps", "Docker", "AWS", "Computer Vision"]
  },
  "DevOps Engineer": {
    core: ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD", "Git"],
    bonus: ["Terraform", "Ansible", "Jenkins", "Python", "Monitoring"]
  },
  "Mobile App Developer": {
    core: ["React Native", "JavaScript", "Mobile Development", "Git", "REST API"],
    bonus: ["Flutter", "iOS", "Android", "TypeScript", "Firebase"]
  },
  "Data Analyst": {
    core: ["SQL", "Excel", "Python", "Data Visualization", "Statistics"],
    bonus: ["Tableau", "Power BI", "R", "Pandas", "Machine Learning"]
  },
  "Cloud Engineer": {
    core: ["AWS", "Azure", "Linux", "Networking", "Docker", "Security"],
    bonus: ["Kubernetes", "Terraform", "Python", "CI/CD", "Serverless"]
  },
  "Software Engineer": {
    core: ["Programming", "Data Structures", "Algorithms", "Git", "Problem Solving"],
    bonus: ["System Design", "Testing", "Agile", "Code Review", "Documentation"]
  }
}

// Calculate match score between skills and job requirements
function calculateMatchScore(userSkills: string[], jobRole: string): {
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
} {
  const requirements = JOB_ROLES[jobRole as keyof typeof JOB_ROLES]
  if (!requirements) {
    return { matchScore: 0, matchedSkills: [], missingSkills: [] }
  }

  const userSkillsLower = userSkills.map(s => s.toLowerCase())
  const allRequired = [...requirements.core, ...requirements.bonus]

  const matchedSkills: string[] = []
  const missingSkills: string[] = []

  // Check core skills (weighted higher)
  let coreMatches = 0
  requirements.core.forEach(skill => {
    const isMatch = userSkillsLower.some(userSkill =>
      userSkill.includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill) ||
      areSimilarSkills(userSkill, skill.toLowerCase())
    )
    if (isMatch) {
      matchedSkills.push(skill)
      coreMatches++
    } else {
      missingSkills.push(skill)
    }
  })

  // Check bonus skills
  let bonusMatches = 0
  requirements.bonus.forEach(skill => {
    const isMatch = userSkillsLower.some(userSkill =>
      userSkill.includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill) ||
      areSimilarSkills(userSkill, skill.toLowerCase())
    )
    if (isMatch) {
      matchedSkills.push(skill)
      bonusMatches++
    }
  })

  // Calculate weighted score
  const coreWeight = 0.7
  const bonusWeight = 0.3
  const coreScore = (coreMatches / requirements.core.length) * 100 * coreWeight
  const bonusScore = (bonusMatches / requirements.bonus.length) * 100 * bonusWeight
  const matchScore = Math.round(coreScore + bonusScore)

  return { matchScore, matchedSkills, missingSkills }
}

// Check if two skills are similar (synonyms)
function areSimilarSkills(skill1: string, skill2: string): boolean {
  const synonyms: { [key: string]: string[] } = {
    "javascript": ["js", "es6", "ecmascript"],
    "typescript": ["ts"],
    "python": ["py", "python3"],
    "react": ["reactjs", "react.js"],
    "node.js": ["nodejs", "node"],
    "vue": ["vuejs", "vue.js"],
    "angular": ["angularjs"],
    "mongodb": ["mongo"],
    "postgresql": ["postgres", "psql"],
    "mysql": ["sql", "database"],
    "aws": ["amazon web services", "amazon aws"],
    "gcp": ["google cloud", "google cloud platform"],
    "machine learning": ["ml", "ai", "artificial intelligence"],
    "deep learning": ["dl", "neural networks"],
    "docker": ["containers", "containerization"],
    "kubernetes": ["k8s"],
    "ci/cd": ["cicd", "continuous integration", "devops"],
    "rest api": ["restful", "api", "apis"],
    "html": ["html5"],
    "css": ["css3", "styling"]
  }

  for (const [key, values] of Object.entries(synonyms)) {
    const allTerms = [key, ...values]
    if (allTerms.includes(skill1) && allTerms.includes(skill2)) {
      return true
    }
    if (allTerms.some(t => skill1.includes(t)) && allTerms.some(t => skill2.includes(t))) {
      return true
    }
  }

  return false
}

// Generate reason for the match
function generateReason(matchScore: number, matchedSkills: string[], jobRole: string): string {
  if (matchScore >= 80) {
    return `Excellent match! You have ${matchedSkills.length} key skills for ${jobRole} including ${matchedSkills.slice(0, 3).join(", ")}.`
  } else if (matchScore >= 60) {
    return `Good match with ${matchedSkills.length} relevant skills. Strong foundation in ${matchedSkills.slice(0, 2).join(" and ")}.`
  } else if (matchScore >= 40) {
    return `Moderate match. You have ${matchedSkills.length} skills that align with ${jobRole} requirements.`
  } else {
    return `Potential career path. Learning the core skills would open opportunities in ${jobRole}.`
  }
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skills, resumeText } = body

    console.log("Suggest Jobs API called")
    console.log("Skills received:", skills?.length || 0, skills?.slice(0, 5))

    // Get skills to analyze
    let userSkills: string[] = skills || []

    // If no skills but resumeText provided, extract skills
    if (userSkills.length === 0 && resumeText) {
      userSkills = extractSkillsFromText(resumeText)
    }

    if (userSkills.length === 0) {
      return NextResponse.json({
        suggestedRoles: [],
        detectedSkills: [],
        message: "No skills provided"
      })
    }

    console.log("Analyzing skills:", userSkills.slice(0, 10))

    // Calculate match for each job role
    const suggestions: Array<{
      role: string
      matchScore: number
      reason: string
      requiredSkills: string[]
      matchedSkills: string[]
      missingSkills: string[]
    }> = []

    for (const [role, requirements] of Object.entries(JOB_ROLES)) {
      const { matchScore, matchedSkills, missingSkills } = calculateMatchScore(userSkills, role)

      if (matchScore > 20) { // Only include if at least 20% match
        suggestions.push({
          role,
          matchScore,
          reason: generateReason(matchScore, matchedSkills, role),
          requiredSkills: [...requirements.core],
          matchedSkills,
          missingSkills: missingSkills.slice(0, 5) // Limit missing skills shown
        })
      }
    }

    // Sort by match score (highest first)
    suggestions.sort((a, b) => b.matchScore - a.matchScore)

    // Return top 3 suggestions
    const topSuggestions = suggestions.slice(0, 3)

    console.log("Generated suggestions:", topSuggestions.length)
    console.log("Top match:", topSuggestions[0]?.role, topSuggestions[0]?.matchScore)

    return NextResponse.json({
      suggestedRoles: topSuggestions,
      detectedSkills: userSkills,
      totalRolesAnalyzed: Object.keys(JOB_ROLES).length
    })

  } catch (error) {
    console.error("Suggest Jobs API error:", error)
    return NextResponse.json(
      { error: "Failed to generate suggestions", suggestedRoles: [] },
      { status: 500 }
    )
  }
}

// Extract skills from text (fallback)
function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "php",
    "react", "angular", "vue", "next.js", "node.js", "express", "django", "flask", "spring",
    "html", "css", "sass", "tailwind", "bootstrap",
    "sql", "mysql", "postgresql", "mongodb", "redis", "firebase",
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins",
    "git", "github", "linux", "agile", "scrum",
    "machine learning", "deep learning", "tensorflow", "pytorch",
    "data science", "data analysis", "pandas", "numpy",
    "rest api", "graphql", "microservices"
  ]

  const textLower = text.toLowerCase()
  const found: string[] = []

  commonSkills.forEach(skill => {
    if (textLower.includes(skill)) {
      found.push(skill.charAt(0).toUpperCase() + skill.slice(1))
    }
  })

  return [...new Set(found)]
}