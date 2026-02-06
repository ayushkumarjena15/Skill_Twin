// lib/types.ts

// =============================================
// STUDENT PROFILE
// =============================================

export interface StudentProfile {
  jobRole: string
  cgpa: number
  syllabusTopics: string[]
  projects: string[]
  githubUsername?: string
  linkedinUrl?: string
}

// =============================================
// ANALYSIS RESULTS
// =============================================

export interface RoadmapPhase {
  phase: number
  title: string
  skills: string[]
  duration: string
  description: string
}

export interface LearningResource {
  skill: string
  platform: string
  url: string
  duration: string
}

export interface AnalysisResult {
  employabilityScore: number
  matchedSkills: string[]
  missingSkills: string[]
  coreSkillsMatch: number
  bonusSkillsMatch: number
  cgpaScore: number
  githubScore: number
  roadmap: RoadmapPhase[]
  resources: LearningResource[]
  matchingJobs?: Job[]
  careerAdvice?: CareerAdvice
  agentsUsed?: string[]
  githubData?: GitHubData
}

export interface MultiAgentResult extends AnalysisResult {
  matchingJobs?: Job[]
  careerAdvice?: CareerAdvice
  agentsUsed?: string[]
  allUserSkills?: string[]
}

// =============================================
// JOB RELATED
// =============================================

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  description: string
  applyLink: string
  source: string
  postedDate: string
  employmentType: string
  isRemote: boolean
  matchScore?: number
  matchedSkills?: string[]
}

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
  experienceLevel?: string
  domains?: string[]
}

// =============================================
// CAREER ADVICE
// =============================================

export interface CareerAdvice {
  summary: string
  strengths: string[]
  improvements: string[]
  shortTermGoals: string[]
  longTermGoals: string[]
  tips: string[]
}

// =============================================
// LINKEDIN
// =============================================

export interface LinkedInProfile {
  name: string
  headline: string
  location: string
  summary: string
  skills: string[]
  experience: {
    title: string
    company: string
    duration: string
  }[]
  education: {
    school: string
    degree: string
    field?: string
  }[]
  profilePicture?: string
}

// =============================================
// GITHUB
// =============================================

export interface GitHubData {
  username: string
  avatarUrl?: string
  followers: number
  following: number
  bio?: string
  profileUrl?: string
  totalRepos: number
  totalStars: number
  totalForks: number
  languages: string[]
  skills: string[]
  topRepos: {
    name: string
    description: string
    stars: number
    language: string
    url: string
  }[]
  score: number
}

// =============================================
// DATABASE TYPES (Supabase)
// =============================================

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface AnalysisHistory {
  id: string
  user_id: string
  job_role: string
  cgpa: number
  syllabus_topics: string[]
  projects: string[]
  github_username?: string
  linkedin_url?: string
  employability_score: number
  matched_skills: string[]
  missing_skills: string[]
  core_skills_match: number
  bonus_skills_match: number
  cgpa_score: number
  github_score: number
  roadmap: RoadmapPhase[]
  resources: LearningResource[]
  career_advice?: CareerAdvice
  matching_jobs?: Job[]
  agents_used?: string[]
  created_at: string
}

export interface SavedJob {
  id: string
  user_id: string
  job_id: string
  job_title: string
  company: string
  location: string
  salary: string
  apply_link: string
  source: string
  match_score: number
  saved_at: string
}

// =============================================
// JOB REQUIREMENTS DATABASE
// =============================================

export const JOB_REQUIREMENTS: Record<string, { core: string[]; bonus: string[] }> = {
  "Full Stack Developer": {
    core: ["JavaScript", "React", "Node.js", "SQL", "Git", "HTML", "CSS"],
    bonus: ["TypeScript", "MongoDB", "Docker", "AWS", "REST API", "GraphQL", "Redis"]
  },
  "Frontend Developer": {
    core: ["JavaScript", "React", "HTML", "CSS", "Git", "Responsive Design"],
    bonus: ["TypeScript", "Vue", "Angular", "Tailwind", "Figma", "Testing", "Webpack"]
  },
  "Backend Developer": {
    core: ["Python", "Node.js", "SQL", "REST API", "Git", "Database Design"],
    bonus: ["Docker", "AWS", "MongoDB", "Redis", "Microservices", "GraphQL", "Kafka"]
  },
  "Data Scientist": {
    core: ["Python", "Machine Learning", "SQL", "Statistics", "Pandas", "NumPy"],
    bonus: ["TensorFlow", "PyTorch", "Deep Learning", "R", "Tableau", "NLP", "Scikit-learn"]
  },
  "Machine Learning Engineer": {
    core: ["Python", "Machine Learning", "TensorFlow", "Deep Learning", "SQL"],
    bonus: ["PyTorch", "MLOps", "Docker", "AWS", "Computer Vision", "NLP", "Kubernetes"]
  },
  "DevOps Engineer": {
    core: ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD", "Git"],
    bonus: ["Terraform", "Ansible", "Jenkins", "Python", "Monitoring", "Security", "Azure"]
  },
  "Mobile App Developer": {
    core: ["React Native", "JavaScript", "Mobile Development", "Git", "REST API"],
    bonus: ["Flutter", "iOS", "Android", "TypeScript", "Firebase", "Redux", "Swift"]
  },
  "Data Analyst": {
    core: ["SQL", "Excel", "Python", "Data Visualization", "Statistics"],
    bonus: ["Tableau", "Power BI", "R", "Pandas", "Machine Learning", "ETL"]
  },
  "Cloud Engineer": {
    core: ["AWS", "Azure", "Linux", "Networking", "Docker", "Security"],
    bonus: ["Kubernetes", "Terraform", "Python", "CI/CD", "Serverless", "GCP"]
  },
  "Software Engineer": {
    core: ["Programming", "Data Structures", "Algorithms", "Git", "Problem Solving", "OOP"],
    bonus: ["System Design", "Testing", "Agile", "Code Review", "Documentation", "Design Patterns"]
  },
  "UI/UX Designer": {
    core: ["Figma", "User Research", "Prototyping", "UI Design", "UX Design", "Wireframing"],
    bonus: ["Adobe XD", "Sketch", "CSS", "Design Systems", "Accessibility", "User Testing"]
  },
  "Cybersecurity Analyst": {
    core: ["Security", "Networking", "Linux", "Python", "Vulnerability Assessment"],
    bonus: ["Penetration Testing", "SIEM", "Firewall", "Encryption", "Compliance", "Forensics"]
  },
  "AI Engineer": {
    core: ["Python", "Deep Learning", "TensorFlow", "NLP", "Machine Learning"],
    bonus: ["PyTorch", "Computer Vision", "LLMs", "MLOps", "Transformers", "Hugging Face"]
  },
  "Blockchain Developer": {
    core: ["Solidity", "Ethereum", "JavaScript", "Web3", "Smart Contracts"],
    bonus: ["Rust", "DeFi", "NFT", "Cryptography", "Node.js", "React"]
  },
  "Game Developer": {
    core: ["Unity", "C#", "Game Design", "3D Math", "Physics"],
    bonus: ["Unreal Engine", "C++", "Blender", "Shader Programming", "Multiplayer"]
  },
  "QA Engineer": {
    core: ["Testing", "Selenium", "Test Automation", "Bug Tracking", "Agile"],
    bonus: ["Cypress", "Jest", "Performance Testing", "API Testing", "CI/CD", "Python"]
  },
  "Database Administrator": {
    core: ["SQL", "MySQL", "PostgreSQL", "Database Design", "Performance Tuning"],
    bonus: ["MongoDB", "Oracle", "Backup & Recovery", "Replication", "Cloud Databases"]
  },
  "Network Engineer": {
    core: ["Networking", "TCP/IP", "Routing", "Switching", "Firewall"],
    bonus: ["Cisco", "Cloud Networking", "VPN", "Load Balancing", "SDN", "Security"]
  },
  "Product Manager": {
    core: ["Product Strategy", "Roadmapping", "User Research", "Agile", "Data Analysis"],
    bonus: ["SQL", "A/B Testing", "Wireframing", "Jira", "Market Research", "Stakeholder Management"]
  },
  "Technical Writer": {
    core: ["Technical Writing", "Documentation", "API Documentation", "Markdown"],
    bonus: ["DITA", "Git", "Developer Experience", "Video Tutorials", "Diagrams"]
  }
}

// =============================================
// SKILL SYNONYMS (for matching)
// =============================================

export const SKILL_SYNONYMS: Record<string, string[]> = {
  "javascript": ["js", "es6", "es2015", "ecmascript", "vanilla js"],
  "typescript": ["ts"],
  "python": ["py", "python3", "python2"],
  "react": ["reactjs", "react.js", "react js"],
  "node.js": ["nodejs", "node", "node js"],
  "vue": ["vuejs", "vue.js", "vue js"],
  "angular": ["angularjs", "angular.js"],
  "next.js": ["nextjs", "next"],
  "express": ["expressjs", "express.js"],
  "mongodb": ["mongo", "mongoose"],
  "postgresql": ["postgres", "psql", "pg"],
  "mysql": ["my sql"],
  "sql": ["structured query language", "database", "rdbms"],
  "aws": ["amazon web services", "amazon aws", "amazon cloud"],
  "azure": ["microsoft azure", "ms azure"],
  "gcp": ["google cloud", "google cloud platform"],
  "docker": ["containers", "containerization", "dockerfile"],
  "kubernetes": ["k8s", "kube"],
  "machine learning": ["ml", "machine-learning"],
  "deep learning": ["dl", "neural networks", "deep-learning"],
  "artificial intelligence": ["ai"],
  "natural language processing": ["nlp"],
  "computer vision": ["cv", "image processing"],
  "tensorflow": ["tf"],
  "pytorch": ["torch"],
  "ci/cd": ["cicd", "continuous integration", "continuous deployment", "devops pipeline"],
  "rest api": ["restful", "restful api", "rest"],
  "graphql": ["graph ql"],
  "html": ["html5", "hypertext markup language"],
  "css": ["css3", "cascading style sheets", "styling"],
  "sass": ["scss"],
  "tailwind": ["tailwindcss", "tailwind css"],
  "bootstrap": ["twitter bootstrap"],
  "figma": ["figma design"],
  "git": ["version control", "github", "gitlab", "bitbucket"],
  "linux": ["unix", "ubuntu", "centos", "debian"],
  "agile": ["scrum", "kanban", "sprint"],
  "data structures": ["dsa", "ds", "data structures and algorithms"],
  "algorithms": ["algo", "algorithmic thinking"],
  "object oriented programming": ["oop", "object-oriented"],
  "functional programming": ["fp"],
  "microservices": ["micro services", "microservice architecture"],
  "serverless": ["lambda", "cloud functions"],
  "redis": ["redis cache", "caching"],
  "elasticsearch": ["elastic", "elk"],
  "kafka": ["apache kafka", "message queue"],
  "rabbitmq": ["rabbit mq", "message broker"],
  "jenkins": ["ci server"],
  "terraform": ["infrastructure as code", "iac"],
  "ansible": ["configuration management"],
  "prometheus": ["monitoring"],
  "grafana": ["dashboards", "visualization"]
}

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Normalize a skill name for comparison
 */
export function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim()
}

/**
 * Check if two skills are equivalent (considering synonyms)
 */
export function areSkillsEquivalent(skill1: string, skill2: string): boolean {
  const s1 = normalizeSkill(skill1)
  const s2 = normalizeSkill(skill2)

  // Direct match
  if (s1 === s2) return true

  // Check synonyms
  for (const [main, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    const allVariants = [main, ...synonyms]
    if (allVariants.includes(s1) && allVariants.includes(s2)) {
      return true
    }
  }

  // Partial match (one contains the other)
  if (s1.includes(s2) || s2.includes(s1)) {
    return true
  }

  return false
}

/**
 * Find matching skills between user skills and required skills
 */
export function findMatchingSkills(
  userSkills: string[],
  requiredSkills: string[]
): { matched: string[]; missing: string[] } {
  const matched: string[] = []
  const missing: string[] = []

  for (const required of requiredSkills) {
    const isMatch = userSkills.some(userSkill =>
      areSkillsEquivalent(userSkill, required)
    )

    if (isMatch) {
      matched.push(required)
    } else {
      missing.push(required)
    }
  }

  return { matched, missing }
}

/**
 * Calculate match percentage
 */
export function calculateMatchPercentage(
  userSkills: string[],
  coreSkills: string[],
  bonusSkills: string[]
): { coreMatch: number; bonusMatch: number; totalMatch: number } {
  const coreResult = findMatchingSkills(userSkills, coreSkills)
  const bonusResult = findMatchingSkills(userSkills, bonusSkills)

  const coreMatch = Math.round((coreResult.matched.length / coreSkills.length) * 100)
  const bonusMatch = bonusSkills.length > 0
    ? Math.round((bonusResult.matched.length / bonusSkills.length) * 100)
    : 0

  // Weighted total (core 70%, bonus 30%)
  const totalMatch = Math.round(coreMatch * 0.7 + bonusMatch * 0.3)

  return { coreMatch, bonusMatch, totalMatch }
}

/**
 * Get all available job roles
 */
export function getAvailableJobRoles(): string[] {
  return Object.keys(JOB_REQUIREMENTS)
}

/**
 * Get requirements for a specific job role
 */
export function getJobRequirements(jobRole: string): { core: string[]; bonus: string[] } | null {
  return JOB_REQUIREMENTS[jobRole] || null
}