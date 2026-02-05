"use client"

import React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JOB_ROLES, type StudentProfile } from "@/lib/types"
import {
  X,
  Plus,
  Briefcase,
  GraduationCap,
  Code,
  Github,
  Sparkles,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface AnalysisFormProps {
  onSubmit: (profile: StudentProfile) => void
  isLoading: boolean
}

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [jobRole, setJobRole] = useState("")
  const [cgpa, setCgpa] = useState("")
  const [syllabusInput, setSyllabusInput] = useState("")
  const [syllabusTopics, setSyllabusTopics] = useState<string[]>([])
  const [projectInput, setProjectInput] = useState("")
  const [projects, setProjects] = useState<string[]>([])
  const [githubUsername, setGithubUsername] = useState("")

  // PDF Upload states
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addSyllabusTopic = (topicToAdd?: string) => {
    const input = topicToAdd || syllabusInput.trim()
    // Check for duplicates (case-insensitive)
    if (input && !syllabusTopics.some(s => s.toLowerCase() === input.toLowerCase())) {
      setSyllabusTopics([...syllabusTopics, input])
      if (!topicToAdd) {
        setSyllabusInput("")
      }
    }
  }

  const removeSyllabusTopic = (topic: string) => {
    setSyllabusTopics(syllabusTopics.filter((t) => t !== topic))
  }

  const addProject = () => {
    const input = projectInput.trim()
    if (input && !projects.some(p => p.toLowerCase() === input.toLowerCase())) {
      setProjects([...projects, input])
      setProjectInput("")
    }
  }

  const removeProject = (project: string) => {
    setProjects(projects.filter((p) => p !== project))
  }

  // Handle PDF Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadStatus("error")
      setUploadMessage("Please upload a PDF file only")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error")
      setUploadMessage("File size must be less than 10MB")
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")
    setUploadMessage("")
    setUploadedFileName(file.name)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process PDF")
      }

      // Add extracted skills (filtering duplicates)
      if (data.skills && data.skills.length > 0) {
        setSyllabusTopics(prev => {
          // Combine existing + new skills
          const allSkills = [...prev, ...data.skills]
          // Filter duplicates (case-insensitive)
          const uniqueSkills = allSkills.filter((skill, index, self) =>
            index === self.findIndex((t) => (
              t.toLowerCase() === skill.toLowerCase()
            ))
          )
          return uniqueSkills
        })
      }

      // Add extracted topics
      if (data.topics && data.topics.length > 0) {
        setSyllabusTopics(prev => {
          const allTopics = [...prev, ...data.topics]
          const uniqueTopics = allTopics.filter((topic, index, self) =>
            index === self.findIndex((t) => (
              t.toLowerCase() === topic.toLowerCase()
            ))
          )
          return uniqueTopics
        })
      }

      // Add extracted projects
      if (data.projects && data.projects.length > 0) {
        setProjects(prev => {
          const allProjects = [...prev, ...data.projects]
          const uniqueProjects = allProjects.filter((project, index, self) =>
            index === self.findIndex((p) => (
              p.toLowerCase() === project.toLowerCase()
            ))
          )
          return uniqueProjects
        })
      }

      setUploadStatus("success")
      setUploadMessage(
        `Extracted ${data.skills?.length || 0} skills from ${data.documentType || "document"}`
      )

    } catch (error: any) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setUploadMessage(error.message || "Failed to process PDF")
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobRole || !cgpa || syllabusTopics.length === 0) return

    onSubmit({
      jobRole,
      cgpa: parseFloat(cgpa),
      syllabusTopics,
      projects,
      githubUsername,
    })
  }

  const handleKeyPress = (
    e: React.KeyboardEvent,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
      action()
    }
  }

  const suggestedTopics = ["Python", "Java", "JavaScript", "SQL", "DBMS", "Data Structures", "Web Development", "Machine Learning"]

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-primary" />
          Skill Analysis
        </CardTitle>
        <CardDescription>
          Enter your profile details or upload your resume/syllabus to analyze skill gaps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Job Role */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="jobRole" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Target Job Role
            </Label>
            <Select value={jobRole} onValueChange={setJobRole}>
              <SelectTrigger id="jobRole" className="bg-input">
                <SelectValue placeholder="Select your target role" />
              </SelectTrigger>
              <SelectContent>
                {JOB_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CGPA */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cgpa" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              CGPA (out of 10)
            </Label>
            <Input
              id="cgpa"
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g., 8.5"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="bg-input"
            />
          </div>

          {/* PDF Upload Section */}
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-muted-foreground" />
              Upload Resume or Syllabus (PDF)
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>

            <div className="flex flex-col gap-3">
              {/* Upload Button */}
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                  transition-colors hover:border-primary/50 hover:bg-primary/5
                  ${isUploading ? "border-primary bg-primary/5" : "border-border"}
                  ${uploadStatus === "success" ? "border-green-500 bg-green-500/5" : ""}
                  ${uploadStatus === "error" ? "border-red-500 bg-red-500/5" : ""}
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      Extracting skills from {uploadedFileName}...
                    </p>
                  </div>
                ) : uploadStatus === "success" ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <p className="text-sm text-green-600">{uploadMessage}</p>
                    <p className="text-xs text-muted-foreground">Click to upload another file</p>
                  </div>
                ) : uploadStatus === "error" ? (
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-sm text-red-600">{uploadMessage}</p>
                    <p className="text-xs text-muted-foreground">Click to try again</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload PDF (Resume or Syllabus)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max 10MB • Skills will be auto-extracted
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Syllabus Topics / Skills */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="syllabus" className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              Syllabus Topics / Skills
            </Label>
            <div className="flex gap-2">
              <Input
                id="syllabus"
                placeholder="e.g., Python, Data Structures"
                value={syllabusInput}
                onChange={(e) => setSyllabusInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, addSyllabusTopic)}
                className="bg-input"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => addSyllabusTopic()}
                disabled={!syllabusInput.trim()}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add topic</span>
              </Button>
            </div>
            {syllabusTopics.length === 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="text-xs text-muted-foreground">Suggestions:</span>
                {suggestedTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => addSyllabusTopic(topic)}
                    className="text-xs text-primary hover:underline"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
            {syllabusTopics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {syllabusTopics.map((topic, index) => (
                  <Badge
                    key={`${topic}-${index}`} // Ensure unique keys
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeSyllabusTopic(topic)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {topic}</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="projects" className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              Projects / Additional Skills
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="projects"
                placeholder="e.g., React calculator, Django blog"
                value={projectInput}
                onChange={(e) => setProjectInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, addProject)}
                className="bg-input"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={addProject}
                disabled={!projectInput.trim()}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add project</span>
              </Button>
            </div>
            {projects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {projects.map((project, index) => (
                  <Badge
                    key={`${project}-${index}`} // Ensure unique keys
                    variant="outline"
                    className="flex items-center gap-1 pr-1"
                  >
                    {project}
                    <button
                      type="button"
                      onClick={() => removeProject(project)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {project}</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* GitHub Username */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <Github className="h-4 w-4 text-muted-foreground" />
              GitHub Username
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="github"
              placeholder="Enter your github username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="bg-input"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            disabled={!jobRole || !cgpa || syllabusTopics.length === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-pulse">Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze My Skills
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}