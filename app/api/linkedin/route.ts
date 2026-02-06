// app/api/linkedin/route.ts
// Uses AI to extract from pasted LinkedIn content

import { NextRequest, NextResponse } from "next/server"

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral"

// Common skills for pattern matching (fallback)
const COMMON_SKILLS = [
  // Programming
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "php", "swift", "kotlin", "scala", "r",
  // Frontend
  "react", "angular", "vue", "next.js", "html", "css", "tailwind", "bootstrap", "sass", "redux",
  // Backend
  "node.js", "express", "django", "flask", "spring", "fastapi", "laravel", "rails", ".net",
  // Database
  "sql", "mysql", "postgresql", "mongodb", "redis", "firebase", "dynamodb", "elasticsearch",
  // Cloud & DevOps
  "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ansible", "ci/cd", "linux", "git",
  // Data & ML
  "machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn", "nlp", "computer vision",
  // Tools
  "jira", "figma", "postman", "agile", "scrum"
]

// Extract skills using AI
async function extractWithAI(text: string): Promise<{
  name: string
  headline: string
  skills: string[]
  experience: string[]
  education: string
}> {
  try {
    const prompt = `
You are an expert at extracting professional information from LinkedIn profiles.

Analyze this LinkedIn profile text and extract:
1. Person's full name
2. Professional headline/title
3. ALL technical and professional skills (programming languages, frameworks, tools, soft skills)
4. Work experience (job title + company name)
5. Education

LINKEDIN PROFILE TEXT:
${text.slice(0, 4000)}

Return ONLY valid JSON in this exact format:
{
  "name": "Full Name",
  "headline": "Professional Title at Company",
  "skills": ["JavaScript", "React", "Python", "Machine Learning", "AWS"],
  "experience": ["Software Engineer at Google", "Intern at Microsoft"],
  "education": "B.Tech in Computer Science from IIT Delhi"
}

IMPORTANT:
- Extract ALL skills mentioned anywhere in the text
- Look for skills in: headline, about section, experience descriptions, skills section
- Include programming languages, frameworks, tools, databases, cloud platforms
- Be thorough - don't miss any skills

JSON:`

    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: { temperature: 0.2 }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.response || ""

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        name: parsed.name || "",
        headline: parsed.headline || "",
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
        education: typeof parsed.education === "string" ? parsed.education : ""
      }
    }

    throw new Error("Could not parse AI response")
  } catch (error) {
    console.error("AI extraction failed:", error)
    // Return fallback extraction
    return fallbackExtraction(text)
  }
}

// Helper for regex escaping
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Fallback: Pattern-based extraction
function fallbackExtraction(text: string): {
  name: string
  headline: string
  skills: string[]
  experience: string[]
  education: string
} {
  const skills: string[] = []

  // Extract skills using pattern matching
  COMMON_SKILLS.forEach(skill => {
    // Check if skill is purely alphanumeric (plus hyphens/underscores allowed in words)
    const isWord = /^[a-zA-Z0-9_\-]+$/.test(skill)

    let matched = false

    if (isWord) {
      // Use word boundaries for standard words to avoid partial matches
      const regex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i')
      matched = regex.test(text)
    } else {
      // For skills with special chars (C++, C#, .NET), fall back to simple inclusion
      matched = text.toLowerCase().includes(skill.toLowerCase())
    }

    if (matched) {
      // Capitalize properly
      const formatted = skill.split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      skills.push(formatted)
    }
  })

  // Try to extract name (usually first line)
  const lines = text.split("\n").filter(l => l.trim())
  const name = lines[0]?.trim().slice(0, 50) || ""

  // Try to extract headline (usually second line or after name)
  const headline = lines[1]?.trim().slice(0, 100) || ""

  return {
    name,
    headline,
    skills: [...new Set(skills)],
    experience: [],
    education: ""
  }
}

// Validate if text looks like LinkedIn content
function isLinkedInContent(text: string): boolean {
  const linkedInKeywords = [
    "experience", "education", "skills", "about",
    "connections", "followers", "posts",
    "linkedin", "profile", "headline"
  ]

  const textLower = text.toLowerCase()
  const matchCount = linkedInKeywords.filter(kw => textLower.includes(kw)).length

  return matchCount >= 2 || text.length > 200
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { linkedinUrl, linkedinText } = body

    // Method 1: If user pasted text directly
    if (linkedinText && linkedinText.trim().length > 50) {
      console.log("Processing pasted LinkedIn text, length:", linkedinText.length)

      if (!isLinkedInContent(linkedinText)) {
        return NextResponse.json(
          { error: "Text doesn't appear to be from LinkedIn. Please copy your complete profile." },
          { status: 400 }
        )
      }

      const result = await extractWithAI(linkedinText)

      if (result.skills.length === 0) {
        return NextResponse.json(
          { error: "Could not extract skills. Please make sure to copy your complete LinkedIn profile including the Skills section." },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        method: "paste",
        name: result.name,
        headline: result.headline,
        skills: result.skills,
        experience: result.experience,
        education: result.education,
        skillCount: result.skills.length
      })
    }

    // Method 2: If user provided URL, ask them to paste instead
    if (linkedinUrl) {
      return NextResponse.json({
        success: false,
        error: "Direct URL scraping is not available. Please copy and paste your LinkedIn profile content instead.",
        hint: "Go to your LinkedIn profile → Select all (Ctrl+A) → Copy (Ctrl+C) → Paste in the text area",
        requiresPaste: true
      }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Please provide LinkedIn profile text" },
      { status: 400 }
    )

  } catch (error) {
    console.error("LinkedIn API error:", error)
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    )
  }
}