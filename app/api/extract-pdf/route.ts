import { NextRequest, NextResponse } from "next/server"
import { extractSkillsWithAI, detectDocumentType } from "@/lib/services/pdf-extractor"
import pdf from "pdf-parse"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files allowed" }, { status: 400 })
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text
    let text = ""
    try {
      const data = await pdf(buffer)
      text = data.text
    } catch (parseError) {
      console.error("PDF Parse Error:", parseError)
      return NextResponse.json(
        { error: "Failed to read PDF content" }, 
        { status: 500 }
      )
    }

    // Clean text
    text = text.replace(/\s+/g, " ").trim()

    if (text.length < 50) {
      return NextResponse.json(
        { error: "No readable text found in PDF (might be an image)" }, 
        { status: 400 }
      )
    }

    // AI Extraction
    const extracted = await extractSkillsWithAI(text)
    const documentType = detectDocumentType(text)

    return NextResponse.json({
      success: true,
      documentType,
      fileName: file.name,
      ...extracted
    })

  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Server processing failed" },
      { status: 500 }
    )
  }
}