"use client"

import React from "react"

import { useState } from "react"
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
import { X, Plus, Briefcase, GraduationCap, Code, Github, Sparkles } from "lucide-react"

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

  const addSyllabusTopic = () => {
    if (syllabusInput.trim() && !syllabusTopics.includes(syllabusInput.trim())) {
      setSyllabusTopics([...syllabusTopics, syllabusInput.trim()])
      setSyllabusInput("")
    }
  }

  const removeSyllabusTopic = (topic: string) => {
    setSyllabusTopics(syllabusTopics.filter((t) => t !== topic))
  }

  const addProject = () => {
    if (projectInput.trim() && !projects.includes(projectInput.trim())) {
      setProjects([...projects, projectInput.trim()])
      setProjectInput("")
    }
  }

  const removeProject = (project: string) => {
    setProjects(projects.filter((p) => p !== project))
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
          Enter your profile details to analyze your skill gaps and get personalized recommendations
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

          {/* Syllabus Topics */}
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
                onClick={addSyllabusTopic}
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
                    onClick={() => setSyllabusTopics([...syllabusTopics, topic])}
                    className="text-xs text-primary hover:underline"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
            {syllabusTopics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {syllabusTopics.map((topic) => (
                  <Badge
                    key={topic}
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
                {projects.map((project) => (
                  <Badge
                    key={project}
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
              placeholder="e.g., johndoe"
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
