"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import {
  Upload,
  FileText,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Linkedin,
  User,
  Briefcase,
  GraduationCap,
  Info,
  Github,
  ClipboardPaste,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Brain
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobSuggestions } from "@/components/ui/job-suggestions"
import { JOB_REQUIREMENTS } from "@/lib/types"
import type { StudentProfile } from "@/lib/types"

interface AnalysisFormProps {
  onSubmit: (profile: StudentProfile) => void
  isLoading: boolean
}

type FormStep = "upload" | "suggestions" | "details"
type ImportMethod = "resume" | "linkedin" | "manual"

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  // Step management
  const [step, setStep] = useState<FormStep>("upload")
  const [importMethod, setImportMethod] = useState<ImportMethod>("resume")

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false)
  const [resumeError, setResumeError] = useState("")

  // LinkedIn state
  const [linkedinText, setLinkedinText] = useState("")
  const [isExtractingLinkedin, setIsExtractingLinkedin] = useState(false)
  const [linkedinError, setLinkedinError] = useState("")
  const [showLinkedinInstructions, setShowLinkedinInstructions] = useState(false)
  const [linkedinResult, setLinkedinResult] = useState<{
    name: string
    headline: string
    skills: string[]
    experience: string[]
    education: string
  } | null>(null)

  // AI suggestions state
  const [detectedSkills, setDetectedSkills] = useState<string[]>([])
  const [suggestedRoles, setSuggestedRoles] = useState<any[]>([])
  const [documentType, setDocumentType] = useState<string>("")

  // Form fields
  const [jobRole, setJobRole] = useState("")
  const [cgpa, setCgpa] = useState("")
  const [syllabusTopics, setSyllabusTopics] = useState("")
  const [projects, setProjects] = useState("")
  const [githubUsername, setGithubUsername] = useState("")

  // Available job roles
  const availableRoles = Object.keys(JOB_REQUIREMENTS)

  // ==========================================
  // RESUME UPLOAD HANDLERS
  // ==========================================

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      await handleResumeUpload(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"]
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  })

  const handleResumeUpload = async (file: File) => {
    setResumeFile(file)
    setResumeError("")
    setIsAnalyzingResume(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("Uploading PDF:", file.name)

      const extractResponse = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData
      })

      const extractData = await extractResponse.json()
      console.log("PDF Extraction Response:", extractData)

      if (!extractResponse.ok) {
        throw new Error(extractData.error || "Failed to extract text from PDF")
      }

      const extractedSkills = extractData.skills || []
      const extractedTopics = extractData.topics || []
      const extractedProjects = extractData.projects || []

      setDocumentType(extractData.documentType || "unknown")

      const allSkills = [...new Set([...extractedSkills, ...extractedTopics])]

      if (allSkills.length === 0) {
        throw new Error("No skills found in the PDF. Please try a different file or enter manually.")
      }

      setSyllabusTopics(allSkills.slice(0, 20).join(", "))
      if (extractedProjects.length > 0) {
        setProjects(extractedProjects.slice(0, 5).join(", "))
      }

      setDetectedSkills(allSkills)

      // Get job suggestions
      await fetchJobSuggestions(allSkills)

      setStep("suggestions")

    } catch (error) {
      console.error("Resume analysis error:", error)
      setResumeError(error instanceof Error ? error.message : "Failed to analyze resume")
    } finally {
      setIsAnalyzingResume(false)
    }
  }

  const clearResume = () => {
    setResumeFile(null)
    setResumeError("")
  }

  // ==========================================
  // LINKEDIN HANDLERS
  // ==========================================

  const handleLinkedinPaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setLinkedinText(text)
      setLinkedinError("")
    } catch {
      setLinkedinError("Could not access clipboard. Please paste manually using Ctrl+V")
    }
  }

  const handleLinkedinExtract = async () => {
    if (!linkedinText.trim()) {
      setLinkedinError("Please paste your LinkedIn profile content")
      return
    }

    if (linkedinText.length < 100) {
      setLinkedinError("Text is too short. Please copy your complete LinkedIn profile.")
      return
    }

    setIsExtractingLinkedin(true)
    setLinkedinError("")
    setLinkedinResult(null)

    try {
      const response = await fetch("/api/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinText: linkedinText })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract data")
      }

      const result = {
        name: data.name || "",
        headline: data.headline || "",
        skills: data.skills || [],
        experience: data.experience || [],
        education: data.education || ""
      }

      setLinkedinResult(result)

      // Update form fields
      const currentSkills = syllabusTopics.split(",").map(s => s.trim()).filter(Boolean)
      const combined = [...new Set([...currentSkills, ...result.skills])]
      setSyllabusTopics(combined.join(", "))

      if (result.experience.length > 0 && !projects.trim()) {
        setProjects(result.experience.slice(0, 5).join(", "))
      }

      setDetectedSkills(result.skills)

      // Get job suggestions
      if (result.skills.length > 0) {
        await fetchJobSuggestions(result.skills)
      }

      setStep("suggestions")

    } catch (err) {
      setLinkedinError(err instanceof Error ? err.message : "Failed to extract data")
    } finally {
      setIsExtractingLinkedin(false)
    }
  }

  const clearLinkedin = () => {
    setLinkedinText("")
    setLinkedinError("")
    setLinkedinResult(null)
  }

  // ==========================================
  // JOB SUGGESTIONS
  // ==========================================

  const fetchJobSuggestions = async (skills: string[]) => {
    try {
      const response = await fetch("/api/suggest-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills })
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestedRoles(data.suggestedRoles || [])
      } else {
        console.error("Failed to fetch job suggestions")
        setSuggestedRoles([])
      }
    } catch (error) {
      console.error("Job suggestions error:", error)
      setSuggestedRoles([])
    }
  }

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  const handleSelectRole = (role: string) => {
    setJobRole(role)
    setStep("details")
  }

  const handleSkipToManual = () => {
    setStep("details")
  }

  const handleBack = () => {
    if (step === "details") {
      if (suggestedRoles.length > 0 || detectedSkills.length > 0) {
        setStep("suggestions")
      } else {
        setStep("upload")
      }
    } else if (step === "suggestions") {
      setStep("upload")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const profile: StudentProfile = {
      jobRole: jobRole.trim(),
      cgpa: parseFloat(cgpa),
      syllabusTopics: syllabusTopics
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      projects: projects
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      githubUsername: githubUsername.trim() || undefined
    }

    onSubmit(profile)
  }

  const resetAll = () => {
    setStep("upload")
    setImportMethod("resume")
    setResumeFile(null)
    setResumeError("")
    setLinkedinText("")
    setLinkedinError("")
    setLinkedinResult(null)
    setDetectedSkills([])
    setSuggestedRoles([])
    setDocumentType("")
    setJobRole("")
    setCgpa("")
    setSyllabusTopics("")
    setProjects("")
    setGithubUsername("")
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>
            {step === "upload" && "Start Your Analysis"}
            {step === "suggestions" && "AI Career Recommendations"}
            {step === "details" && "Complete Your Profile"}
          </CardTitle>
        </div>
        <CardDescription>
          {step === "upload" && "Import your skills from Resume, LinkedIn, or enter manually"}
          {step === "suggestions" && `Found ${detectedSkills.length} skills! Here are the best career paths`}
          {step === "details" && "Review and complete your profile for accurate gap analysis"}
        </CardDescription>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 pt-4">
          {["upload", "suggestions", "details"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step === s
                  ? "bg-primary text-primary-foreground"
                  : i < ["upload", "suggestions", "details"].indexOf(step)
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {i < ["upload", "suggestions", "details"].indexOf(step) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-0.5 mx-1 ${i < ["upload", "suggestions", "details"].indexOf(step)
                    ? "bg-primary"
                    : "bg-muted"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">

          {/* ==================== */}
          {/* STEP 1: UPLOAD/IMPORT */}
          {/* ==================== */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Import Method Tabs */}
              <Tabs value={importMethod} onValueChange={(v) => setImportMethod(v as ImportMethod)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resume" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Resume / Syllabus
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="gap-2">
                    <User className="h-4 w-4" />
                    Manual
                  </TabsTrigger>
                </TabsList>

                {/* ===== RESUME TAB ===== */}
                <TabsContent value="resume" className="space-y-4 mt-4">
                  <div
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragActive
                      ? "border-primary bg-primary/10"
                      : isAnalyzingResume
                        ? "border-primary/50 bg-primary/5"
                        : resumeError
                          ? "border-red-500/50 bg-red-500/5"
                          : resumeFile
                            ? "border-green-500/50 bg-green-500/5"
                            : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                  >
                    <input {...getInputProps()} />

                    {isAnalyzingResume ? (
                      <div className="flex flex-col items-center py-4">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <p className="font-medium text-lg">Analyzing Resume...</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Extracting skills with AI
                        </p>
                      </div>
                    ) : resumeFile && !resumeError ? (
                      <div className="flex flex-col items-center py-4">
                        <div className="relative">
                          <FileText className="h-12 w-12 text-green-500 mb-4" />
                          <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-green-500 bg-background rounded-full" />
                        </div>
                        <p className="font-medium text-green-600">{resumeFile.name}</p>
                        <p className="text-sm text-muted-foreground">Click to change</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            clearResume()
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-medium text-lg">
                          {isDragActive ? "Drop here" : "Upload Resume / Syllabus"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PDF only, max 5MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Resume Error */}
                  {resumeError && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-red-600">{resumeError}</span>
                    </div>
                  )}
                </TabsContent>

                {/* ===== LINKEDIN TAB ===== */}
                <TabsContent value="linkedin" className="space-y-4 mt-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-green-500 text-white">100% FREE</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLinkedinInstructions(!showLinkedinInstructions)}
                      className="text-xs gap-1"
                    >
                      How to use
                      {showLinkedinInstructions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </div>

                  {/* Instructions */}
                  <AnimatePresence>
                    {showLinkedinInstructions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <Card className="border-blue-500/20 bg-blue-500/5">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-500" />
                              How to Copy Your LinkedIn Profile
                            </h4>
                            <ol className="text-sm text-muted-foreground space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">1</span>
                                <span>
                                  Open your LinkedIn profile
                                  <a
                                    href="https://www.linkedin.com/in/me/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline ml-1 inline-flex items-center gap-1"
                                  >
                                    (Click here) <ExternalLink className="h-3 w-3" />
                                  </a>
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">2</span>
                                <span>Scroll down to see all sections</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">3</span>
                                <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+A</kbd> to select all</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">4</span>
                                <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+C</kbd> to copy</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">5</span>
                                <span>Click "Paste from Clipboard" below</span>
                              </li>
                            </ol>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Paste Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleLinkedinPaste}
                      className="gap-2"
                      disabled={isExtractingLinkedin}
                    >
                      <ClipboardPaste className="h-4 w-4" />
                      Paste from Clipboard
                    </Button>
                    {linkedinText && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearLinkedin}
                        className="text-muted-foreground"
                      >
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Text Area */}
                  <Textarea
                    placeholder="Paste your LinkedIn profile content here...

Example:
John Doe
Full Stack Developer at Google

About
Passionate developer with 5+ years experience...

Experience
Senior Software Engineer at Google

Skills
JavaScript · React · Node.js · Python · AWS"
                    value={linkedinText}
                    onChange={(e) => {
                      setLinkedinText(e.target.value)
                      setLinkedinError("")
                    }}
                    rows={6}
                    className="font-mono text-sm"
                    disabled={isExtractingLinkedin}
                  />

                  {/* Extract Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {linkedinText.length > 0 ? `${linkedinText.length} characters` : "Paste your profile"}
                    </span>
                    <Button
                      onClick={handleLinkedinExtract}
                      disabled={isExtractingLinkedin || linkedinText.length < 50}
                      className="gap-2"
                    >
                      {isExtractingLinkedin ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          Suggest Skills
                        </>
                      )}
                    </Button>
                  </div>

                  {/* LinkedIn Error */}
                  {linkedinError && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-red-600">{linkedinError}</span>
                    </div>
                  )}

                  {/* LinkedIn Success */}
                  {linkedinResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="border-green-500/30 bg-green-500/5">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Extracted Successfully!</span>
                          </div>

                          {(linkedinResult.name || linkedinResult.headline) && (
                            <div className="flex items-center gap-3 pb-3 border-b">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-semibold">{linkedinResult.name}</div>
                                <div className="text-sm text-muted-foreground">{linkedinResult.headline}</div>
                              </div>
                            </div>
                          )}

                          {linkedinResult.skills.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2">
                                Skills ({linkedinResult.skills.length})
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {linkedinResult.skills.slice(0, 12).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {linkedinResult.skills.length > 12 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{linkedinResult.skills.length - 12}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>

                {/* ===== MANUAL TAB ===== */}
                <TabsContent value="manual" className="space-y-4 mt-4">
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-medium">Enter Details Manually</p>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Skip importing and fill in your skills directly
                    </p>
                    <Button onClick={handleSkipToManual} className="gap-2">
                      Continue to Form
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Continue Button (shown after successful extraction) */}
              {(detectedSkills.length > 0 || linkedinResult) && (
                <div className="pt-4 border-t">
                  <Button onClick={() => setStep("suggestions")} className="w-full gap-2">
                    Continue to Job Suggestions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* ====================== */}
          {/* STEP 2: JOB SUGGESTIONS */}
          {/* ====================== */}
          {step === "suggestions" && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Document Type Badge */}
              {documentType && documentType !== "unknown" && (
                <div className="flex justify-center">
                  <Badge variant="outline">
                    Detected: {documentType.charAt(0).toUpperCase() + documentType.slice(1)}
                  </Badge>
                </div>
              )}

              {/* Detected Skills */}
              {detectedSkills.length > 0 && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <span className="font-medium">Detected Skills ({detectedSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedSkills.slice(0, 20).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {detectedSkills.length > 20 && (
                        <Badge variant="outline" className="text-xs">
                          +{detectedSkills.length - 20} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Job Suggestions */}
              {suggestedRoles.length > 0 ? (
                <JobSuggestions
                  suggestions={suggestedRoles}
                  detectedSkills={detectedSkills}
                  onSelectRole={handleSelectRole}
                  onSkipToManual={handleSkipToManual}
                />
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium">No suggestions available</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Continue to select a job role manually
                  </p>
                  <Button onClick={handleSkipToManual}>
                    Select Role Manually
                  </Button>
                </div>
              )}

              {/* Back Button */}
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Import
                </Button>
              </div>
            </motion.div>
          )}

          {/* ==================== */}
          {/* STEP 3: DETAILS FORM */}
          {/* ==================== */}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Job Role */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Target Job Role <span className="text-red-500">*</span>
                    {jobRole && suggestedRoles.length > 0 && (
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        AI Recommended
                      </Badge>
                    )}
                  </Label>
                  <Select value={jobRole} onValueChange={setJobRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* CGPA */}
                <div className="space-y-2">
                  <Label>
                    CGPA (out of 10) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="e.g., 8.5"
                    required
                  />
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Skills / Topics <span className="text-red-500">*</span>
                    {detectedSkills.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {detectedSkills.length} extracted
                      </Badge>
                    )}
                  </Label>
                  <Textarea
                    value={syllabusTopics}
                    onChange={(e) => setSyllabusTopics(e.target.value)}
                    placeholder="e.g., Python, JavaScript, React, Node.js, SQL"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of skills
                  </p>
                </div>

                {/* Projects */}
                <div className="space-y-2">
                  <Label>Projects (optional)</Label>
                  <Textarea
                    value={projects}
                    onChange={(e) => setProjects(e.target.value)}
                    placeholder="e.g., E-commerce website, Chat app, ML classifier"
                    rows={2}
                  />
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Username (optional)
                  </Label>
                  <Input
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="enter your github user name"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll analyze your repos for additional skills
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading || !jobRole || !cgpa || !syllabusTopics}
                    className="flex-1 gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}