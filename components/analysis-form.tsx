"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { 
  Upload, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JobSuggestions } from "@/components/ui/job-suggestions"
import { JOB_REQUIREMENTS } from "@/lib/types"
import type { StudentProfile } from "@/lib/types"

interface AnalysisFormProps {
  onSubmit: (profile: StudentProfile) => void
  isLoading: boolean
}

type FormStep = "upload" | "suggestions" | "details"

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  // Step management
  const [step, setStep] = useState<FormStep>("upload")
  
  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false)
  const [resumeError, setResumeError] = useState("")
  
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

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      await handleResumeUpload(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  // Handle resume upload and analysis
  const handleResumeUpload = async (file: File) => {
    setResumeFile(file)
    setResumeError("")
    setIsAnalyzingResume(true)

    try {
      // Step 1: Extract skills from PDF
      const formData = new FormData()
      formData.append("file", file)

      console.log("Uploading PDF:", file.name, file.size, "bytes")

      const extractResponse = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData
      })

      const extractData = await extractResponse.json()
      console.log("PDF Extraction Response:", extractData)

      // Check for errors
      if (!extractResponse.ok) {
        throw new Error(extractData.error || "Failed to extract text from PDF")
      }

      // Your API returns { success, skills, topics, projects, education, experience, documentType }
      const extractedSkills = extractData.skills || []
      const extractedTopics = extractData.topics || []
      const extractedProjects = extractData.projects || []
      
      setDocumentType(extractData.documentType || "unknown")

      // Combine skills and topics
      const allSkills = [...new Set([...extractedSkills, ...extractedTopics])]

      console.log("Extracted skills:", allSkills.length, allSkills.slice(0, 10))

      if (allSkills.length === 0) {
        throw new Error("No skills found in the PDF. The file might be image-based or empty.")
      }

      // Pre-fill form fields
      setSyllabusTopics(allSkills.slice(0, 20).join(", "))
      if (extractedProjects.length > 0) {
        setProjects(extractedProjects.slice(0, 5).join(", "))
      }

      // Step 2: Get job suggestions based on extracted skills
      console.log("Getting job suggestions for skills:", allSkills.slice(0, 5))

      const suggestResponse = await fetch("/api/suggest-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          skills: allSkills,
          resumeText: "" // Skills already extracted
        })
      })

      if (!suggestResponse.ok) {
        console.warn("Job suggestion API failed, continuing with extracted skills only")
        setDetectedSkills(allSkills)
        setSuggestedRoles([])
        setStep("suggestions")
        return
      }

      const suggestions = await suggestResponse.json()
      console.log("Job Suggestions Response:", suggestions)

      // Set state
      setDetectedSkills(allSkills)
      setSuggestedRoles(suggestions.suggestedRoles || [])

      // Move to suggestions step
      setStep("suggestions")

    } catch (error) {
      console.error("Resume analysis error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze resume"
      setResumeError(errorMessage)
      // Don't change step - let user retry or skip
    } finally {
      setIsAnalyzingResume(false)
    }
  }

  // Clear resume and start over
  const clearResume = () => {
    setResumeFile(null)
    setResumeError("")
    setDetectedSkills([])
    setSuggestedRoles([])
    setDocumentType("")
  }

  // Handle role selection from suggestions
  const handleSelectRole = (role: string) => {
    setJobRole(role)
    setStep("details")
  }

  // Skip to manual entry
  const handleSkipToManual = () => {
    setStep("details")
  }

  // Form submission
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

  // Available job roles
  const availableRoles = Object.keys(JOB_REQUIREMENTS)

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>
            {step === "upload" && "Start Your Analysis"}
            {step === "suggestions" && "AI Career Recommendations"}
            {step === "details" && "Complete Your Profile"}
          </CardTitle>
        </div>
        <CardDescription>
          {step === "upload" && "Upload your resume or syllabus for AI-powered skill extraction"}
          {step === "suggestions" && `Found ${detectedSkills.length} skills! Here are the best career paths for you`}
          {step === "details" && "Review and complete your profile for accurate gap analysis"}
        </CardDescription>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 pt-4">
          {["upload", "suggestions", "details"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step === s 
                    ? 'bg-primary text-primary-foreground' 
                    : i < ["upload", "suggestions", "details"].indexOf(step)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < ["upload", "suggestions", "details"].indexOf(step) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && (
                <div className={`w-12 h-0.5 mx-1 ${
                  i < ["upload", "suggestions", "details"].indexOf(step)
                    ? 'bg-primary'
                    : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          
          {/* ==================== */}
          {/* STEP 1: Resume Upload */}
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
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragActive 
                    ? 'border-primary bg-primary/10' 
                    : isAnalyzingResume
                      ? 'border-primary/50 bg-primary/5'
                      : resumeError
                        ? 'border-red-500/50 bg-red-500/5'
                        : resumeFile
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <input {...getInputProps()} />
                
                {isAnalyzingResume ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                    <p className="font-medium text-lg">Analyzing Your Document...</p>
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
                    <p className="text-sm text-muted-foreground">
                      Click or drop to change file
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-500 hover:text-red-600"
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
                      {isDragActive ? "Drop your file here" : "Upload Resume or Syllabus"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drag & drop or click to browse (PDF, max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {resumeError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-600">{resumeError}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You can try a different file or enter your skills manually below.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground">
                    or continue without upload
                  </span>
                </div>
              </div>

              {/* Skip Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleSkipToManual}
                  className="w-full sm:w-auto"
                >
                  Enter Details Manually
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ====================== */}
          {/* STEP 2: Job Suggestions */}
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
                  <Badge variant="outline" className="text-sm">
                    Detected: {documentType.charAt(0).toUpperCase() + documentType.slice(1)}
                  </Badge>
                </div>
              )}

              <JobSuggestions
                suggestions={suggestedRoles}
                detectedSkills={detectedSkills}
                onSelectRole={handleSelectRole}
                onSkipToManual={handleSkipToManual}
                isLoading={isAnalyzingResume}
              />
              
              {/* Back Button */}
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => {
                    clearResume()
                    setStep("upload")
                  }}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Upload Different File
                </Button>
              </div>
            </motion.div>
          )}

          {/* ==================== */}
          {/* STEP 3: Details Form */}
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
                  <Label htmlFor="jobRole" className="flex items-center gap-2">
                    Target Job Role 
                    <span className="text-red-500">*</span>
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
                      {availableRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* CGPA */}
                <div className="space-y-2">
                  <Label htmlFor="cgpa">
                    CGPA (out of 10) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cgpa"
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

                {/* Skills/Syllabus */}
                <div className="space-y-2">
                  <Label htmlFor="syllabusTopics" className="flex items-center gap-2">
                    Skills / Syllabus Topics <span className="text-red-500">*</span>
                    {detectedSkills.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {detectedSkills.length} extracted
                      </Badge>
                    )}
                  </Label>
                  <Textarea
                    id="syllabusTopics"
                    value={syllabusTopics}
                    onChange={(e) => setSyllabusTopics(e.target.value)}
                    placeholder="e.g., Python, JavaScript, React, Node.js, SQL"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of skills and technologies
                  </p>
                </div>

                {/* Projects */}
                <div className="space-y-2">
                  <Label htmlFor="projects">Projects (optional)</Label>
                  <Textarea
                    id="projects"
                    value={projects}
                    onChange={(e) => setProjects(e.target.value)}
                    placeholder="e.g., E-commerce website, Chat app, ML classifier"
                    rows={2}
                  />
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <Label htmlFor="githubUsername">GitHub Username (optional)</Label>
                  <Input
                    id="githubUsername"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g., johndoe"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {suggestedRoles.length > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("suggestions")}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Suggestions
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("upload")}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Upload Document
                    </Button>
                  )}
                  
                  {/* Submit Button */}
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
                        <Sparkles className="h-4 w-4" />
                        Analyze My Profile
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