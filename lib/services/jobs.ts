const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ""
const RAPIDAPI_HOST = "jsearch.p.rapidapi.com"

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

export async function searchJobs(
  skills: string[],
  jobRole: string,
  location: string = "India"
): Promise<Job[]> {
  try {
    // Create search query
    const query = `${jobRole} ${skills.slice(0, 3).join(" ")}`
    
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=in`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST
        }
      }
    )

    if (!response.ok) {
      throw new Error(`JSearch error: ${response.status}`)
    }

    const data = await response.json()
    
    console.log("Jobs API Response:", data)

    // Parse jobs
    const jobs: Job[] = (data.data || []).slice(0, 10).map((job: Record<string, unknown>) => ({
      id: job.job_id as string || String(Math.random()),
      title: job.job_title as string || "Unknown Title",
      company: job.employer_name as string || "Unknown Company",
      location: job.job_city as string || job.job_country as string || "India",
      salary: formatSalary(job),
      applyLink: job.job_apply_link as string || "#",
      source: job.job_publisher as string || "Unknown",
      postedDate: formatDate(job.job_posted_at_datetime_utc as string)
    }))

    return jobs

  } catch (error) {
    console.error("Jobs API error:", error)
    return []
  }
}

// Calculate match score between user skills and job
export function calculateJobMatch(
  userSkills: string[],
  jobTitle: string,
  jobDescription?: string
): number {
  const userSkillsLower = userSkills.map(s => s.toLowerCase())
  const jobText = `${jobTitle} ${jobDescription || ""}`.toLowerCase()
  
  let matchCount = 0
  
  for (const skill of userSkillsLower) {
    if (jobText.includes(skill)) {
      matchCount++
    }
  }
  
  const score = Math.round((matchCount / Math.max(userSkills.length, 1)) * 100)
  return Math.min(score, 100)
}

// Format salary from job data
function formatSalary(job: Record<string, unknown>): string {
  const min = job.job_min_salary as number
  const max = job.job_max_salary as number
  const currency = job.job_salary_currency as string || "INR"
  const period = job.job_salary_period as string || "YEAR"
  
  if (min && max) {
    if (currency === "INR" || currency === "₹") {
      return `₹${formatLPA(min)}-${formatLPA(max)} LPA`
    }
    return `${currency} ${min.toLocaleString()}-${max.toLocaleString()}/${period.toLowerCase()}`
  }
  
  return "Not disclosed"
}

// Convert to LPA format
function formatLPA(amount: number): string {
  if (amount >= 100000) {
    return (amount / 100000).toFixed(1)
  }
  return amount.toLocaleString()
}

// Format date
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Recently"
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  } catch {
    return "Recently"
  }
}