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
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "DevSecOps Engineer",
  "Data Analyst",
  "AI Engineer",
  "AI and Data Scientist",
  "Data Engineer",
  "Android Developer",
  "iOS Developer",
  "Machine Learning Engineer",
  "PostgreSQL Specialist",
  "Blockchain Developer",
  "QA Engineer",
  "Software Architect",
  "Cyber Security Analyst",
  "UX Designer",
  "Technical Writer",
  "Game Developer",
  "Server Side Game Developer",
  "MLOps Engineer",
  "Product Manager",
  "Engineering Manager",
  "Developer Relations",
  "BI Analyst"
] as const

export const JOB_REQUIREMENTS: Record<string, { core: string[]; bonus: string[] }> = {
  "Frontend Developer": {
    core: ["HTML", "CSS", "JavaScript", "React", "Responsive Design", "Git"],
    bonus: ["TypeScript", "Next.js", "Tailwind CSS", "Testing", "Accessibility"],
  },
  "Backend Developer": {
    core: ["Node.js", "Python", "SQL", "REST API", "Git", "Database Design"],
    bonus: ["Docker", "Redis", "Microservices", "GraphQL", "Kubernetes"],
  },
  "Full Stack Developer": {
    core: ["JavaScript", "React", "Node.js", "SQL", "REST API", "Git"],
    bonus: ["TypeScript", "Docker", "AWS", "MongoDB", "Next.js"],
  },
  "DevOps Engineer": {
    core: ["Linux", "Docker", "CI/CD", "Git", "Cloud Platforms (AWS/GCP)", "Scripting"],
    bonus: ["Kubernetes", "Terraform", "Ansible", "Monitoring (Prometheus)", "Networking"],
  },
  "DevSecOps Engineer": {
    core: ["DevOps", "SAST/DAST", "Security Auditing", "Vault", "Container Security"],
    bonus: ["Compliance (SOC2)", "Network Security", "Cloud Security Implementation"],
  },
  "Data Analyst": {
    core: ["SQL", "Excel", "Data Visualization (Tableau/PowerBI)", "Statistics"],
    bonus: ["Python (Pandas)", "Data Cleaning", "R", "Business Intelligence"],
  },
  "AI Engineer": {
    core: ["Python", "LLMs (OpenAI/Gemini)", "Prompt Engineering", "LangChain", "Vector Databases"],
    bonus: ["Model Fine-tuning", "PyTorch", "RAG Systems", "AI Agents"],
  },
  "AI and Data Scientist": {
    core: ["Python", "Statistics", "Machine Learning", "SQL", "Data Exploration"],
    bonus: ["Deep Learning", "Big Data (Spark)", "Cloud Data Science", "NLP"],
  },
  "Data Engineer": {
    core: ["SQL", "Python", "ETL Pipelines", "Data Warehousing", "Big Data Frameworks"],
    bonus: ["Airflow", "Spark", "Snowflake/Redshift", "Data Governance"],
  },
  "Android Developer": {
    core: ["Kotlin", "Android SDK", "Jetpack Compose", "REST API", "Git"],
    bonus: ["Firebase", "Android Architecture Components", "Unit Testing", "Dagger/Hilt"],
  },
  "iOS Developer": {
    core: ["Swift", "Xcode", "SwiftUI", "iOS SDK", "Git"],
    bonus: ["Combine", "CoreData", "Unit Testing", "App Store Guidelines"],
  },
  "Machine Learning Engineer": {
    core: ["Python", "ML Algorithms", "Scikit-learn", "Statistics", "Deep Learning"],
    bonus: ["PyTorch", "TensorFlow", "MLOps", "Model Deployment", "Neural Networks"],
  },
  "PostgreSQL Specialist": {
    core: ["PostgreSQL", "SQL Optimization", "Indexing", "Database Administration"],
    bonus: ["PL/pgSQL", "Backup & Recovery", "High Availability", "Performance Tuning"],
  },
  "Blockchain Developer": {
    core: ["Solidity", "Smart Contracts", "Ethereum", "Cryptography", "Web3.js"],
    bonus: ["Rust (Solana)", "Hardhat/Truffle", "DeFi Protocols", "Security Auditing"],
  },
  "QA Engineer": {
    core: ["Manual Testing", "Test Automation (Selenium/Playwright)", "Bug Tracking", "SDLC"],
    bonus: ["API Testing", "Performance Testing (JMeter)", "CI/CD Integration"],
  },
  "Software Architect": {
    core: ["System Design", "Scalability", "Design Patterns", "Cloud Architecture"],
    bonus: ["Distributed Systems", "Microservices Strategy", "High Availability Design"],
  },
  "Cyber Security Analyst": {
    core: ["Network Security", "Penetration Testing", "SOC Operations", "Encryption"],
    bonus: ["Ethical Hacking", "Digital Forensics", "Identity & Access Management"],
  },
  "UX Designer": {
    core: ["User Research", "Wireframing (Figma)", "Prototyping", "Usability Testing"],
    bonus: ["Design Systems", "Interaction Design", "Accessibility Design"],
  },
  "Technical Writer": {
    core: ["Technical Documentation", "Markdown", "API Documentation", "Copywriting"],
    bonus: ["Docs-as-Code", "Swagger/OpenAPI", "User Guides Creator"],
  },
  "Game Developer": {
    core: ["C++", "C#", "Unity or Unreal Engine", "Game Math", "Game Physics"],
    bonus: ["Shaders/HLSL", "Multiplayer Development", "Optimization", "Computer Graphics"],
  },
  "Server Side Game Developer": {
    core: ["Node.js/Go", "WebSockets", "Distributed Game Backend", "Redis"],
    bonus: ["Matchmaking Systems", "MMO Architecture", "Scalable Game Servers"],
  },
  "MLOps Engineer": {
    core: ["ML Pipelines", "Docker", "Model Monitoring", "CI/CD for ML"],
    bonus: ["Kubeflow", "MLflow", "Feature Stores", "DVC (Data Version Control)"],
  },
  "Product Manager": {
    core: ["Product Strategy", "User Stories", "Roadmapping", "Agile/Scrum"],
    bonus: ["Data-driven Decision Making", "Stakeholder Management", "Market Analysis"],
  },
  "Engineering Manager": {
    core: ["Team Leadership", "Project Management", "Technical Strategy", "Mentorship"],
    bonus: ["Strategic Planning", "Conflict Resolution", "Hiring & Budgeting"],
  },
  "Developer Relations": {
    core: ["Community Building", "Technical Content Creation", "Public Speaking"],
    bonus: ["Developer Experience (DX)", "SDK/API Advocacy", "Hackathon Organizing"],
  },
  "BI Analyst": {
    core: ["SQL", "Business Intelligence Tools", "Data Modeling", "ETL"],
    bonus: ["Advanced Analytics", "Reporting Automation", "Predictive Modeling"]
  }
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  applyLink: string
  source: string
  postedDate: string
  matchScore?: number
}

export interface CareerAdvice {
  overallAssessment: string
  strengths: string[]
  improvements: string[]
  interviewTips: string[]
  salaryRange?: {
    entry: string
    mid: string
    senior: string
  }
  companiesHiring?: string[]
  alternativeRoles?: string[]
  motivationalMessage: string
}

export interface TimetableEntry {
  day: string
  morning: string
  afternoon: string
  evening: string
}

export interface MultiAgentResult extends AnalysisResult {
  careerAdvice: CareerAdvice
  matchingJobs: Job[]
  agentsUsed: string[]
  allUserSkills?: string[]
  timetable?: TimetableEntry[]
}