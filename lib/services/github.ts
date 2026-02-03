const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""

interface GitHubRepo {
  name: string
  language: string | null
  stargazers_count: number
  topics: string[]
  fork: boolean
  updated_at: string
}

interface GitHubUser {
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface GitHubAnalysis {
  score: number
  languages: string[]
  totalRepos: number
  totalStars: number
  topRepos: string[]
  skills: string[]
  error?: string
}

export async function analyzeGitHub(username: string): Promise<GitHubAnalysis> {
  if (!username) {
    return {
      score: 0,
      languages: [],
      totalRepos: 0,
      totalStars: 0,
      topRepos: [],
      skills: []
    }
  }

  try {
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json"
    }

    if (GITHUB_TOKEN) {
      headers["Authorization"] = `token ${GITHUB_TOKEN}`
    }

    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers })
    
    if (!userRes.ok) {
      throw new Error(`User not found: ${username}`)
    }

    const user: GitHubUser = await userRes.json()

    // Fetch repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    )

    if (!reposRes.ok) {
      throw new Error("Failed to fetch repos")
    }

    const repos: GitHubRepo[] = await reposRes.json()

    // Filter out forks
    const ownRepos = repos.filter(repo => !repo.fork)

    // Extract languages
    const languageCount: Record<string, number> = {}
    let totalStars = 0

    ownRepos.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1
      }
      totalStars += repo.stargazers_count
    })

    // Sort languages by usage
    const languages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang)
      .slice(0, 5)

    // Get top repos by stars
    const topRepos = ownRepos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map(repo => repo.name)

    // Extract skills from topics
    const allTopics = ownRepos.flatMap(repo => repo.topics || [])
    const uniqueSkills = [...new Set(allTopics)].slice(0, 10)

    // Calculate score (0-100)
    const score = calculateGitHubScore({
      repoCount: ownRepos.length,
      totalStars,
      languageCount: languages.length,
      hasRecentActivity: checkRecentActivity(ownRepos),
      followers: user.followers
    })

    return {
      score,
      languages,
      totalRepos: ownRepos.length,
      totalStars,
      topRepos,
      skills: [...languages, ...uniqueSkills]
    }

  } catch (error) {
    console.error("GitHub API error:", error)
    return {
      score: 0,
      languages: [],
      totalRepos: 0,
      totalStars: 0,
      topRepos: [],
      skills: [],
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

function checkRecentActivity(repos: GitHubRepo[]): boolean {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  return repos.some(repo => new Date(repo.updated_at) > threeMonthsAgo)
}

function calculateGitHubScore(data: {
  repoCount: number
  totalStars: number
  languageCount: number
  hasRecentActivity: boolean
  followers: number
}): number {
  let score = 0

  // Repos (max 30 points)
  score += Math.min(data.repoCount * 3, 30)

  // Stars (max 25 points)
  score += Math.min(data.totalStars * 5, 25)

  // Languages (max 20 points)
  score += Math.min(data.languageCount * 5, 20)

  // Recent activity (15 points)
  if (data.hasRecentActivity) {
    score += 15
  }

  // Followers (max 10 points)
  score += Math.min(data.followers, 10)

  return Math.min(score, 100)
}