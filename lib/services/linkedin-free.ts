// lib/services/linkedin-free.ts
// 100% FREE - No API keys needed!

import puppeteer from "puppeteer"
import * as cheerio from "cheerio"

export interface LinkedInProfile {
  name: string
  headline: string
  location: string
  about: string
  skills: string[]
  experience: {
    title: string
    company: string
    duration: string
  }[]
  education: {
    school: string
    degree: string
  }[]
}

// Validate LinkedIn URL
export function isValidLinkedInUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i
  return pattern.test(url.trim())
}

// Normalize URL
export function normalizeUrl(url: string): string {
  let normalized = url.trim()
  
  if (!normalized.startsWith("http")) {
    normalized = "https://" + normalized
  }
  
  if (!normalized.includes("www.")) {
    normalized = normalized.replace("linkedin.com", "www.linkedin.com")
  }
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, "")
  
  return normalized
}

// Main scraping function - 100% FREE
export async function scrapeLinkedInProfile(linkedinUrl: string): Promise<LinkedInProfile | null> {
  const url = normalizeUrl(linkedinUrl)
  console.log("Scraping LinkedIn (FREE):", url)

  let browser = null

  try {
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080"
      ]
    })

    const page = await browser.newPage()

    // Set realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 })

    // Navigate to profile
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000
    })

    // Wait for content to load
    await page.waitForSelector("body", { timeout: 10000 })

    // Get page content
    const html = await page.content()

    // Parse with Cheerio
    const profile = parseLinkedInHtml(html)

    console.log("Scraping successful! Found", profile.skills.length, "skills")

    return profile

  } catch (error) {
    console.error("Puppeteer scraping error:", error)
    return null
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Parse LinkedIn HTML
function parseLinkedInHtml(html: string): LinkedInProfile {
  const $ = cheerio.load(html)

  // Extract name
  const name = $("h1").first().text().trim() ||
    $('[class*="top-card"] h1').text().trim() ||
    $('[class*="profile"] h1').text().trim() ||
    ""

  // Extract headline
  const headline = $('[class*="headline"]').first().text().trim() ||
    $('[class*="top-card"] [class*="subline"]').text().trim() ||
    $("h2").first().text().trim() ||
    ""

  // Extract location
  const location = $('[class*="location"]').first().text().trim() ||
    $('[class*="top-card"] [class*="location"]').text().trim() ||
    ""

  // Extract about/summary
  const about = $('[class*="about"] [class*="content"]').text().trim() ||
    $('[class*="summary"]').text().trim() ||
    $('section[class*="about"] p').text().trim() ||
    ""

  // Extract skills
  const skills: string[] = []
  
  // Try multiple selectors for skills
  $('[class*="skill"] span, [class*="skills"] li, [class*="skill-name"]').each((_, el) => {
    const skill = $(el).text().trim()
    if (skill && skill.length > 1 && skill.length < 50 && !skills.includes(skill)) {
      skills.push(skill)
    }
  })

  // Also extract from page text using patterns
  const pageText = $("body").text()
  const extractedSkills = extractSkillsFromText(pageText)
  extractedSkills.forEach(skill => {
    if (!skills.includes(skill)) {
      skills.push(skill)
    }
  })

  // Extract experience
  const experience: LinkedInProfile["experience"] = []
  $('[class*="experience"] li, [class*="position"]').each((_, el) => {
    const title = $(el).find('[class*="title"], h3').first().text().trim()
    const company = $(el).find('[class*="company"], [class*="subtitle"]').first().text().trim()
    const duration = $(el).find('[class*="date"], [class*="duration"]').first().text().trim()

    if (title || company) {
      experience.push({ title, company, duration })
    }
  })

  // Extract education
  const education: LinkedInProfile["education"] = []
  $('[class*="education"] li, [class*="school"]').each((_, el) => {
    const school = $(el).find('[class*="school"], h3').first().text().trim()
    const degree = $(el).find('[class*="degree"], [class*="field"]').first().text().trim()

    if (school) {
      education.push({ school, degree })
    }
  })

  return {
    name,
    headline,
    location,
    about,
    skills: skills.slice(0, 50), // Limit to 50 skills
    experience: experience.slice(0, 5),
    education: education.slice(0, 3)
  }
}

// Extract skills from text using pattern matching
function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    // Programming Languages
    "javascript", "typescript", "python", "java", "c\\+\\+", "c#", "ruby", "go", "golang", "rust", "php", "swift", "kotlin", "scala", "r",
    // Frontend
    "react", "reactjs", "react.js", "angular", "vue", "vuejs", "vue.js", "next.js", "nextjs", "nuxt", "svelte",
    "html", "html5", "css", "css3", "sass", "scss", "less", "tailwind", "tailwindcss", "bootstrap", "material ui", "chakra",
    // Backend
    "node.js", "nodejs", "node", "express", "expressjs", "django", "flask", "fastapi", "spring", "spring boot", "laravel", "rails", "ruby on rails",
    ".net", "asp.net", "asp.net core",
    // Databases
    "sql", "mysql", "postgresql", "postgres", "mongodb", "mongo", "redis", "firebase", "dynamodb", "elasticsearch", "cassandra", "oracle", "sqlite",
    // Cloud & DevOps
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "jenkins", "terraform", "ansible", "ci/cd", "cicd",
    "linux", "unix", "bash", "shell", "powershell",
    // Tools
    "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack", "trello", "notion",
    "vscode", "visual studio", "intellij", "eclipse",
    // Data & ML
    "machine learning", "deep learning", "artificial intelligence", "ai", "ml",
    "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn",
    "pandas", "numpy", "matplotlib", "seaborn", "jupyter",
    "data science", "data analysis", "data engineering", "big data",
    "spark", "hadoop", "kafka", "airflow",
    "power bi", "tableau", "looker",
    "nlp", "natural language processing", "computer vision", "opencv",
    // Mobile
    "react native", "flutter", "ionic", "xamarin", "android", "ios", "swift", "kotlin",
    // APIs & Architecture
    "rest", "rest api", "restful", "graphql", "grpc", "soap",
    "microservices", "api design", "system design",
    // Testing
    "jest", "mocha", "cypress", "selenium", "pytest", "junit", "testing", "tdd", "bdd",
    // Other
    "agile", "scrum", "kanban", "project management",
    "figma", "sketch", "adobe xd", "photoshop", "illustrator",
    "blockchain", "ethereum", "solidity", "web3",
    "seo", "google analytics"
  ]

  const textLower = text.toLowerCase()
  const found: string[] = []

  commonSkills.forEach(skill => {
    // Create regex pattern (handle special characters)
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    
    if (pattern.test(textLower)) {
      // Format skill name properly
      const formatted = skill
        .split(/[\s-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
        .replace("\\+\\+", "++")
        .replace("\\#", "#")
      
      if (!found.includes(formatted)) {
        found.push(formatted)
      }
    }
  })

  return found
}

// Simplified extraction for API
export async function extractLinkedInSkills(linkedinUrl: string): Promise<{
  success: boolean
  name: string
  headline: string
  skills: string[]
  experience: string[]
  education: string
  error?: string
}> {
  try {
    const profile = await scrapeLinkedInProfile(linkedinUrl)

    if (!profile) {
      return {
        success: false,
        name: "",
        headline: "",
        skills: [],
        experience: [],
        education: "",
        error: "Failed to scrape LinkedIn profile. The profile might be private or the URL is incorrect."
      }
    }

    return {
      success: true,
      name: profile.name,
      headline: profile.headline,
      skills: profile.skills,
      experience: profile.experience.map(e => `${e.title} at ${e.company}`).filter(Boolean),
      education: profile.education.map(e => `${e.degree} from ${e.school}`).filter(Boolean).join(", ")
    }

  } catch (error) {
    console.error("LinkedIn extraction error:", error)
    return {
      success: false,
      name: "",
      headline: "",
      skills: [],
      experience: [],
      education: "",
      error: "An error occurred while scraping. Please try again."
    }
  }
}