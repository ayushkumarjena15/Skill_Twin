export interface StudentProfile {
  jobRole: string
  cgpa: number
  syllabusTopics: string[]
  projects: string[]
  githubUsername: string
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
}

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

export const JOB_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "ML Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile App Developer",
  "Cloud Architect",
] as const

export const JOB_REQUIREMENTS: Record<string, { core: string[]; bonus: string[] }> = {
  "Full Stack Developer": {
    core: ["JavaScript", "React", "Node.js", "SQL", "REST API", "Git"],
    bonus: ["TypeScript", "Docker", "AWS", "MongoDB", "GraphQL"],
  },
  "Frontend Developer": {
    core: ["HTML", "CSS", "JavaScript", "React", "Responsive Design", "Git"],
    bonus: ["TypeScript", "Next.js", "Tailwind CSS", "Testing", "Accessibility"],
  },
  "Backend Developer": {
    core: ["Python", "Java", "SQL", "REST API", "Git", "Database Design"],
    bonus: ["Docker", "Kubernetes", "Message Queues", "Caching", "Microservices"],
  },
  "ML Engineer": {
    core: ["Python", "Machine Learning", "TensorFlow", "Data Processing", "Statistics", "Git"],
    bonus: ["Deep Learning", "NLP", "Computer Vision", "MLOps", "Cloud ML"],
  },
  "Data Scientist": {
    core: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Pandas"],
    bonus: ["Deep Learning", "Big Data", "R", "Tableau", "A/B Testing"],
  },
  "DevOps Engineer": {
    core: ["Linux", "Docker", "CI/CD", "Git", "Scripting", "Cloud Platforms"],
    bonus: ["Kubernetes", "Terraform", "Monitoring", "Security", "Networking"],
  },
  "Mobile App Developer": {
    core: ["React Native", "JavaScript", "Mobile UI/UX", "REST API", "Git", "App Store"],
    bonus: ["Swift", "Kotlin", "Firebase", "Performance Optimization", "Testing"],
  },
  "Cloud Architect": {
    core: ["AWS", "Cloud Design", "Networking", "Security", "DevOps", "Infrastructure"],
    bonus: ["Multi-cloud", "Cost Optimization", "Disaster Recovery", "Compliance", "Automation"],
  },
}
