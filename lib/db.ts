import { supabase } from './supabase'
import type { AnalysisHistory, SavedJob } from './supabase'

// =============================================
// AUTH FUNCTIONS
// =============================================

export async function signUp(email: string, password: string, name: string) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      }
    }
  })
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  })
}

export async function signInWithGitHub() {
  return await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  return await supabase.auth.getUser()
}

export async function getSession() {
  return await supabase.auth.getSession()
}

// =============================================
// PROFILE FUNCTIONS
// =============================================

export async function getProfile(userId: string) {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export async function updateProfile(userId: string, updates: {
  name?: string
  github_username?: string
  avatar_url?: string
}) {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
}

export async function uploadAvatar(userId: string, file: File) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.floor(Math.random() * 1000000)}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // 1. Upload the file to Supabase Storage (assumes 'avatars' bucket exists and is public/writable)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profiles') // Common bucket name, can be 'avatars' or 'profiles'
      .upload(filePath, file)

    if (uploadError) return { data: null, error: uploadError }

    // 2. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    // 3. Update the profile with the new avatar_url
    const { data: profileData, error: profileError } = await updateProfile(userId, {
      avatar_url: publicUrl
    })

    // 4. Also update the user metadata for immediate sync across components that use useAuth()
    await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    })

    return { data: { publicUrl, profile: profileData }, error: profileError }
  } catch (err: any) {
    return { data: null, error: err }
  }
}

// =============================================
// ANALYSIS HISTORY FUNCTIONS
// =============================================

export async function saveAnalysis(userId: string, analysis: {
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
  agents_used: string[]
}) {
  return await supabase
    .from('analysis_history')
    .insert({
      user_id: userId,
      ...analysis
    })
    .select()
    .single()
}

export async function getAnalysisHistory(userId: string, limit: number = 10) {
  return await supabase
    .from('analysis_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function getAnalysisById(analysisId: string) {
  return await supabase
    .from('analysis_history')
    .select('*')
    .eq('id', analysisId)
    .single()
}

export async function deleteAnalysis(analysisId: string) {
  return await supabase
    .from('analysis_history')
    .delete()
    .eq('id', analysisId)
}

// =============================================
// SAVED JOBS FUNCTIONS
// =============================================

export async function saveJob(userId: string, job: {
  job_id: string
  job_title: string
  company: string
  location: string
  salary: string
  apply_link: string
  source: string
  match_score: number
}) {
  return await supabase
    .from('saved_jobs')
    .insert({
      user_id: userId,
      ...job
    })
    .select()
    .single()
}

export async function getSavedJobs(userId: string) {
  return await supabase
    .from('saved_jobs')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })
}

export async function removeSavedJob(userId: string, jobId: string) {
  return await supabase
    .from('saved_jobs')
    .delete()
    .eq('user_id', userId)
    .eq('job_id', jobId)
}

export async function isJobSaved(userId: string, jobId: string) {
  return await supabase
    .from('saved_jobs')
    .select('id')
    .eq('user_id', userId)
    .eq('job_id', jobId)
    .single()
}

// =============================================
// ACCOUNT MANAGEMENT FUNCTIONS
// =============================================

export async function deleteUserAccount(userId: string) {
  // 1. Delete Analysis History
  const { error: historyError } = await supabase
    .from('analysis_history')
    .delete()
    .eq('user_id', userId)

  if (historyError) throw historyError

  // 2. Delete Saved Jobs
  const { error: jobsError } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('user_id', userId)

  if (jobsError) throw jobsError

  // 3. Delete Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (profileError) throw profileError

  // NOTE: This only deletes data from the database.
  // Deleting the user from Supabase Auth requires a server-side route
  // with the service role key or usage of supabase.auth.admin.deleteUser()
}