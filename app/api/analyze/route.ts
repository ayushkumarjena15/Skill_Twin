import { NextRequest, NextResponse } from "next/server"
import { analyzeWithMultipleAgents } from "@/lib/services/agents"
import type { StudentProfile } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request
    const profile: StudentProfile = {
      jobRole: body.jobRole,
      cgpa: body.cgpa,
      syllabusTopics: body.syllabusTopics || [],
      projects: body.projects || [],
      githubUsername: body.githubUsername || ""
    }

    if (!profile.jobRole || !profile.cgpa) {
      return NextResponse.json(
        { error: "jobRole and cgpa are required" },
        { status: 400 }
      )
    }

    console.log("📥 Analysis Request:", profile)

    // Analyze with Multiple Agents
    const result = await analyzeWithMultipleAgents(profile)

    console.log("📤 Analysis Complete!")

    return NextResponse.json(result)

  } catch (error) {
    console.error("Analysis error:", error)
    
    return NextResponse.json(
      { error: "Analysis failed. Check if Ollama is running." },
      { status: 500 }
    )
  }
}