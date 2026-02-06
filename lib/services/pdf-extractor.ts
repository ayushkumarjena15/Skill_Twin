// PDF text extraction and skill parsing

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral"

// Common skills database for quick matching
const COMMON_SKILLS = [
  // Programming Languages
  "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust", "php", "swift", "kotlin", "scala", "r",
  // Frontend
  "react", "angular", "vue", "next.js", "html", "css", "tailwind", "bootstrap", "sass", "redux", "jquery",
  // Backend
  "node.js", "express", "django", "flask", "spring", "fastapi", "laravel", "rails", ".net",
  // Databases
  "sql", "mysql", "postgresql", "mongodb", "redis", "firebase", "oracle", "sqlite", "dynamodb", "cassandra",
  // Cloud & DevOps
  "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "ci/cd", "terraform", "ansible", "linux", "git", "github",
  // Data Science & ML
  "machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn", "nlp", "computer vision", "data analysis",
  // Tools & Others
  "rest api", "graphql", "microservices", "agile", "scrum", "jira", "figma", "postman", "vs code",
  // Soft Skills
  "communication", "teamwork", "leadership", "problem solving", "critical thinking", "time management"
]

// Chat with Ollama for skill extraction
async function chatWithOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: { temperature: 0.2, num_predict: 1000 }
      })
    })

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

// Parse JSON from Ollama response
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

// Quick skill extraction using pattern matching
// Escape special characters for regex
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Quick skill extraction using pattern matching
function quickSkillExtract(text: string): string[] {
  const foundSkills: string[] = []

  for (const skill of COMMON_SKILLS) {
    // Check if skill is purely alphanumeric (plus hyphens/underscores allowed in words)
    // This covers "Java", "Python", "Go", "R", "React", "Terraform" etc.
    const isWord = /^[a-zA-Z0-9_\-]+$/.test(skill)

    let matched = false

    if (isWord) {
      // Use word boundaries for standard words to avoid partial matches
      // e.g. "Go" won't match "Good", "R" won't match "React"
      const regex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i')
      matched = regex.test(text)
    } else {
      // For skills with special chars (C++, C#, .NET, Node.js), fall back to simple inclusion
      // or custom boundary logic could be added here if needed.
      matched = text.toLowerCase().includes(skill.toLowerCase())
    }

    if (matched) {
      // Capitalize first letter of each word for display
      // Special handlings can be added here if needed
      const formatted = skill.split(" ").map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ")
      foundSkills.push(formatted)
    }
  }

  return [...new Set(foundSkills)]
}

// Extract skills using Ollama AI
export async function extractSkillsWithAI(text: string): Promise<{
  skills: string[]
  topics: string[]
  projects: string[]
  education: string
  experience: string
}> {
  // First, do quick pattern matching
  const quickSkills = quickSkillExtract(text)

  // Then use AI for deeper extraction
  const prompt = `
You are an expert resume and syllabus parser. Extract information from this text.

TEXT:
${text.slice(0, 4000)}

Extract and return ONLY this JSON format (no extra text):
{
  "skills": ["skill1", "skill2", "skill3"],
  "topics": ["course1", "course2"],
  "projects": ["project1", "project2"],
  "education": "degree and university if found",
  "experience": "years of experience if found"
}

Rules:
- Extract ALL technical skills (programming languages, frameworks, tools)
- Extract course/subject names from syllabus
- Extract project names if any
- Be thorough, don't miss any skills
- Return empty arrays if not found

JSON:`

  try {
    const response = await chatWithOllama(prompt)
    const parsed = parseJSON(response)

    if (parsed) {
      const aiSkills = (parsed.skills as string[]) || []
      const topics = (parsed.topics as string[]) || []
      const projects = (parsed.projects as string[]) || []
      const education = (parsed.education as string) || ""
      const experience = (parsed.experience as string) || ""

      // Combine AI skills with quick pattern matching
      const allSkills = [...new Set([...aiSkills, ...quickSkills])]

      return {
        skills: allSkills,
        topics,
        projects,
        education,
        experience
      }
    }
  } catch (error) {
    console.error("AI extraction failed:", error)
  }

  // Fallback to quick extraction only
  return {
    skills: quickSkills,
    topics: [],
    projects: [],
    education: "",
    experience: ""
  }
}

// Detect document type
export function detectDocumentType(text: string): "resume" | "syllabus" | "unknown" {
  const textLower = text.toLowerCase()

  const resumeKeywords = ["experience", "employment", "work history", "objective", "summary", "skills", "education", "references", "contact"]
  const syllabusKeywords = ["course", "semester", "credits", "syllabus", "curriculum", "module", "unit", "chapter", "lecture", "examination"]

  let resumeScore = 0
  let syllabusScore = 0

  for (const keyword of resumeKeywords) {
    if (textLower.includes(keyword)) resumeScore++
  }

  for (const keyword of syllabusKeywords) {
    if (textLower.includes(keyword)) syllabusScore++
  }

  if (resumeScore > syllabusScore) return "resume"
  if (syllabusScore > resumeScore) return "syllabus"
  return "unknown"
}