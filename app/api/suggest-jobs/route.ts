import { NextRequest, NextResponse } from "next/server"
import { suggestJobRolesFromSkills, extractSkillsFromResume } from "@/lib/services/ollama"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skills, resumeText } = body

    // Validate input
    if (!skills && !resumeText) {
      return NextResponse.json(
        { error: "Either 'skills' array or 'resumeText' is required" },
        { status: 400 }
      )
    }

    console.log("Job suggestion request received:")
    console.log("- Skills provided:", skills?.length || 0)
    console.log("- Resume text length:", resumeText?.length || 0)

    // Get job suggestions
    const result = await suggestJobRolesFromSkills(
      skills || [],
      resumeText
    )

    console.log("Job suggestions generated:")
    console.log("- Detected skills:", result.detectedSkills.length)
    console.log("- Suggested roles:", result.suggestedRoles.length)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Job suggestion error:", error)
    
    // Return helpful error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    return NextResponse.json(
      { 
        error: "Failed to suggest jobs",
        details: errorMessage,
        suggestedRoles: [],
        detectedSkills: []
      },
      { status: 500 }
    )
  }
}