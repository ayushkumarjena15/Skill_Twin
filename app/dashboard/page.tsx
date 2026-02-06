"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { AnalysisForm } from "@/components/analysis-form"
import { ResultsDashboard } from "@/components/results-dashboard"
import { LearningRoadmap } from "@/components/learning-roadmap"
import { JobListings } from "@/components/job-listings"
import { CareerAdviceCard } from "@/components/career-advice"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { saveAnalysis } from "@/lib/db"
import type { StudentProfile, MultiAgentResult } from "@/lib/types"
import { BackButton } from "@/components/ui/back-button"
import { ProgressTracker } from "@/components/progress-tracker"
import { InterviewPrep } from "@/components/interview-prep"
import { ResumeTailor } from "@/components/resume-tailor"

import {
  ArrowLeft,
  Target,
  BookOpen,
  Briefcase,
  Brain,
  Bot,
  Home,
  FileText,
  Github,
  GraduationCap,
  Search,
  Route,
  History,
  CheckCircle,
  ClipboardList
} from "lucide-react"
import Link from "next/link"

const analysisSteps = [
  { icon: FileText, label: "Curriculum Parsing", color: "text-blue-500" },
  { icon: Github, label: "GitHub Engagement (commits, activity, repos etc.)", color: "text-gray-500" },
  { icon: GraduationCap, label: "CGPA Weighting", color: "text-yellow-500" },
  { icon: Briefcase, label: "Job Market Extraction", color: "text-green-500" },
  { icon: Search, label: "Gap Detection", color: "text-orange-500" },
  { icon: Route, label: "Roadmap Generation", color: "text-primary" }
]

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [result, setResult] = useState<MultiAgentResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [activeTab, setActiveTab] = useState<"results" | "roadmap" | "jobs" | "advice" | "progress" | "interview" | "resume">("results")
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (studentProfile: StudentProfile) => {
    setIsLoading(true)
    setCurrentStep(0)
    setSaved(false)

    // Simulate step progress
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) return prev + 1
        return prev
      })
    }, 1500)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentProfile)
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const analysisResult = await response.json()
      setProfile(studentProfile)
      setResult(analysisResult)

      // Save to database if user is logged in
      if (user) {
        try {
          const { error: saveError } = await saveAnalysis(user.id, {
            job_role: studentProfile.jobRole,
            cgpa: studentProfile.cgpa,
            syllabus_topics: studentProfile.syllabusTopics,
            projects: studentProfile.projects,
            github_username: studentProfile.githubUsername,
            employability_score: analysisResult.employabilityScore,
            matched_skills: analysisResult.matchedSkills,
            missing_skills: analysisResult.missingSkills,
            core_skills_match: analysisResult.coreSkillsMatch,
            bonus_skills_match: analysisResult.bonusSkillsMatch,
            cgpa_score: analysisResult.cgpaScore,
            github_score: analysisResult.githubScore,
            roadmap: analysisResult.roadmap,
            resources: analysisResult.resources,
            career_advice: analysisResult.careerAdvice,
            matching_jobs: analysisResult.matchingJobs,
            agents_used: analysisResult.agentsUsed || []
          })

          if (saveError) {
            console.error("Failed to save analysis:", saveError)
          } else {
            setSaved(true)
          }
        } catch (saveError) {
          console.error("Unexpected error saving analysis:", saveError)
        }
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Analysis failed. Make sure Ollama is running!")
    } finally {
      clearInterval(stepInterval)
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setProfile(null)
    setResult(null)
    setActiveTab("results")
    setCurrentStep(0)
    setSaved(false)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background - Luminous Void Grid */}
      <div className="absolute inset-0 bg-zinc-950 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none mix-blend-screen animate-pulse duration-[10s]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none mix-blend-screen animate-pulse duration-[15s]" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, boxShadow: "0 0 0px rgba(139, 92, 246, 0)" }}
                  animate={{
                    scale: [0.5, 1.2, 0.9, 1.1, 1],
                    opacity: [0, 1, 0.7, 1, 1],
                    rotate: [0, -10, 10, -5, 0],
                    boxShadow: [
                      "0 0 0px rgba(139, 92, 246, 0)",
                      "0 0 30px rgba(139, 92, 246, 0.8)",
                      "0 0 15px rgba(139, 92, 246, 0.5)",
                      "0 0 25px rgba(139, 92, 246, 0.6)",
                      "0 0 20px rgba(139, 92, 246, 0.4)"
                    ]
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  whileHover={{
                    rotate: 10,
                    scale: 1.1,
                    boxShadow: "0 0 35px rgba(139, 92, 246, 0.8)"
                  }}
                  className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20"
                >
                  <img src="/logo.png" alt="SkillTwin Logo" className="w-full h-full object-cover" />
                </motion.div>
                <span className="font-bold text-xl group-hover:text-primary transition-colors">SkillTwin</span>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Link>
              </Button>
              <ThemeToggle />
              {result && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              )}
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto mb-6 flex justify-start">
          <BackButton />
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          >
            <div className="text-center max-w-md mx-auto p-8">
              {/* Analysis Steps */}
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  {analysisSteps.map((step, index) => (
                    <motion.div
                      key={step.label}
                      initial={{ scale: 0.8, opacity: 0.3 }}
                      animate={{
                        scale: currentStep === index ? 1.2 : 1,
                        opacity: currentStep >= index ? 1 : 0.3
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center mx-1 ${currentStep >= index ? 'bg-primary/20' : 'bg-muted'
                        }`}
                    >
                      <step.icon className={`h-5 w-5 ${currentStep >= index ? step.color : 'text-muted-foreground'}`} />
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-medium mb-2"
                >
                  {analysisSteps[currentStep]?.label}
                </motion.div>
              </div>

              <TextShimmer
                text="Analyzing curriculum gaps and skill mismatches..."
                className="text-muted-foreground"
                duration={2}
              />

              <p className="text-sm text-muted-foreground mt-4">
                Multi-agent AI system working...
              </p>
            </div>
          </motion.div>
        )}

        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Page Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Skill Gap Analysis</h1>
              <p className="text-muted-foreground">
                Enter your profile to get personalized insights
              </p>
            </div>

            {/* Analysis Form */}
            <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Saved Badge */}
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-green-500"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Analysis saved to your history</span>
              </motion.div>
            )}

            {/* Agents Used Badge */}
            {result.agentsUsed && result.agentsUsed.length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Powered by:</span>
                {result.agentsUsed.map((agent, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {agent}
                  </Badge>
                ))}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 rounded-lg bg-muted/50 w-fit mx-auto flex-wrap justify-center relative z-20 border border-border/50 shadow-sm">
              <Button
                variant={activeTab === "results" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("results")}
                className="transition-all"
              >
                <Target className="h-4 w-4 mr-2" />
                Results
              </Button>
              <Button
                variant={activeTab === "roadmap" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("roadmap")}
                className="transition-all"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Roadmap
              </Button>
              <Button
                variant={activeTab === "jobs" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("jobs")}
                className="transition-all"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Jobs ({result.matchingJobs?.length || 0})
              </Button>
              <Button
                variant={activeTab === "advice" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("advice")}
                className="transition-all"
              >
                <Brain className="h-4 w-4 mr-2" />
                Career Advice
              </Button>
              <Button
                variant={activeTab === "progress" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("progress")}
                className="transition-all"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Track Progress
              </Button>
              <Button
                variant={activeTab === "interview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("interview")}
                className="transition-all"
              >
                <Bot className="h-4 w-4 mr-2" />
                Interview Prep
              </Button>
              <Button
                variant={activeTab === "resume" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("resume")}
                className="transition-all"
              >
                <FileText className="h-4 w-4 mr-2" />
                Resume Optimizer
              </Button>
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "results" && profile && (
                <ResultsDashboard result={result} profile={profile} />
              )}

              {activeTab === "roadmap" && (
                <LearningRoadmap
                  result={result}
                  userId={user?.id}
                  jobRole={profile?.jobRole}
                />
              )}

              {activeTab === "jobs" && (
                <JobListings
                  jobs={result.matchingJobs || []}
                  userSkills={[...(profile?.syllabusTopics || []), ...(profile?.projects || [])]}
                />
              )}

              {activeTab === "advice" && result.careerAdvice && (
                <CareerAdviceCard advice={result.careerAdvice} />
              )}

              {activeTab === "progress" && (
                <ProgressTracker result={result} />
              )}

              {activeTab === "interview" && profile && (
                <InterviewPrep jobRole={profile.jobRole} skillGaps={result.missingSkills} />
              )}

              {activeTab === "resume" && (
                <ResumeTailor />
              )}
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
