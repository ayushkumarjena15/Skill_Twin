import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables!")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Set" : "Missing")
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing")
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
)

// Types for our database
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
  employability_score: number
  matched_skills: string[]
  missing_skills: string[]
  core_skills_match: number
  bonus_skills_match: number
  cgpa_score: number
  github_score: number
  roadmap: object
  resources: object
  career_advice: object
  matching_jobs: object
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