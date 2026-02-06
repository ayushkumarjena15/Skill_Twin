import { NextRequest, NextResponse } from "next/server"
import { extractSkillsWithAI, detectDocumentType } from "@/lib/services/pdf-extractor"

// Use pdf-parse with workaround import to handle edge cases
async function extractTextFromPdf(buffer: Buffer): Promise<{ text: string; success: boolean; error?: string }> {
  // Try multiple approaches to handle various PDF formats

  // Approach 1: Try pdf-parse first (handles most standard PDFs)
  try {
    const pdf = (await import("pdf-parse")).default
    const data = await pdf(buffer, {
      // Increase max buffer size for parsing
      max: 0,
    })

    if (data.text && data.text.trim().length > 0) {
      console.log("pdf-parse succeeded, extracted", data.text.length, "characters")
      return { text: data.text, success: true }
    }
  } catch (error: any) {
    console.log("pdf-parse attempt failed:", error.message)

    // If it's NOT a structural error, don't try alternatives
    if (error.message?.includes("password") || error.message?.includes("Encrypted")) {
      return {
        text: "",
        success: false,
        error: "This PDF is password-protected. Please upload an unprotected version."
      }
    }
  }

  // Approach 2: Try pdfjs-dist (handles more complex PDFs, including some corrupted ones)
  try {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs")

    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer)

    // Load the PDF document with permissive settings
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      stopAtErrors: false,
      // Try to recover from errors
      verbosity: 0,
    })

    const pdfDocument = await loadingTask.promise
    const numPages = pdfDocument.numPages

    console.log(`pdfjs-dist: Processing ${numPages} pages`)

    let fullText = ""

    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdfDocument.getPage(pageNum)
        const textContent = await page.getTextContent()

        // Combine text items with proper spacing
        const pageText = textContent.items
          .map((item: any) => {
            // Handle different item types
            if (typeof item.str === 'string') {
              return item.str
            }
            return ""
          })
          .join(" ")

        fullText += pageText + "\n"
      } catch (pageError: any) {
        console.warn(`Warning: Page ${pageNum} extraction failed:`, pageError.message)
        // Continue with other pages
      }
    }

    if (fullText.trim().length > 0) {
      console.log("pdfjs-dist succeeded, extracted", fullText.length, "characters")
      return { text: fullText, success: true }
    }
  } catch (error: any) {
    console.log("pdfjs-dist attempt failed:", error.message)
  }

  // All approaches failed
  return {
    text: "",
    success: false,
    error: "Unable to extract text from this PDF. This could be because:\n• The PDF contains only images (scanned document)\n• The PDF is corrupted or uses an unsupported format\n\nPlease try:\n1. Using a different PDF version of your resume\n2. Creating a new PDF by exporting from Word/Google Docs\n3. Using the 'Print to PDF' option in your browser\n4. Entering your information manually using the Manual tab"
  }
}

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

    // Check minimum file size
    if (buffer.length < 100) {
      return NextResponse.json(
        { error: "The uploaded file is too small to be a valid PDF." },
        { status: 400 }
      )
    }

    // Check PDF header - be lenient since some PDFs have extra bytes before header
    const headerCheck = buffer.slice(0, 1024).toString("utf-8")
    if (!headerCheck.includes("%PDF")) {
      return NextResponse.json(
        { error: "The file does not appear to be a valid PDF. Please ensure you're uploading an actual PDF file." },
        { status: 400 }
      )
    }

    console.log(`Processing PDF: ${file.name}, size: ${buffer.length} bytes`)

    // Extract text with multiple fallback approaches
    const parseResult = await extractTextFromPdf(buffer)

    if (!parseResult.success) {
      console.error("PDF Parse Error:", parseResult.error)
      return NextResponse.json(
        { error: parseResult.error },
        { status: 400 }
      )
    }

    let text = parseResult.text

    // Clean text - normalize whitespace
    text = text.replace(/\s+/g, " ").trim()

    if (text.length < 50) {
      return NextResponse.json(
        { error: "Very little text was extracted from this PDF. The document might be image-based (scanned). Please try a text-based PDF or use the Manual entry option." },
        { status: 400 }
      )
    }

    console.log(`Successfully extracted ${text.length} characters from PDF`)

    // AI Extraction
    const extracted = await extractSkillsWithAI(text)
    const documentType = detectDocumentType(text)

    return NextResponse.json({
      success: true,
      documentType,
      fileName: file.name,
      text, // Return full extracted text for Resume Tailor
      ...extracted
    })

  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Server processing failed. Please try again or use the Manual entry option." },
      { status: 500 }
    )
  }
}