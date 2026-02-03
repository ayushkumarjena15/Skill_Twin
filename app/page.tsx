"use client"

import { useState } from "react"
import { AnalysisForm } from "@/components/analysis-form"
import { ResultsDashboard } from "@/components/results-dashboard"
import { LearningRoadmap } from "@/components/learning-roadmap"
import { Button } from "@/components/ui/button"
import type { StudentProfile, AnalysisResult } from "@/lib/types"
import { Sparkles, ArrowLeft, Zap, Target, BookOpen, Github } from "lucide-react"

export default function Home() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"results" | "roadmap">("results")

  const handleSubmit = async (studentProfile: StudentProfile) => {
    setIsLoading(true)

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
    } catch (error) {
      console.error("Error:", error)
      alert("Analysis failed. Make sure Ollama is running!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setProfile(null)
    setResult(null)
    setActiveTab("results")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">SkillTune</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Skill Gap Analyzer</p>
              </div>
            </div>
            {result && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!result ? (
          <div className="flex flex-col gap-12">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
                Bridge the gap between
                <span className="text-primary"> education </span>
                and
                <span className="text-accent"> employment</span>
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Analyze your skills, discover gaps, and get a personalized learning roadmap
                to become job-ready for your dream role.
              </p>
            </section>

            {/* Features */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center p-4 rounded-lg border border-border/50 bg-card/30">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Instant Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get real-time skill gap analysis powered by AI
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg border border-border/50 bg-card/30">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Job Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Match your skills with industry requirements
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg border border-border/50 bg-card/30">
                <div className="w-12 h-12 rounded-full bg-chart-3/20 flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-chart-3" />
                </div>
                <h3 className="font-semibold mb-1">Learning Path</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized roadmap with curated resources
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg border border-border/50 bg-card/30">
                <div className="w-12 h-12 rounded-full bg-chart-5/20 flex items-center justify-center mb-3">
                  <Github className="h-6 w-6 text-chart-5" />
                </div>
                <h3 className="font-semibold mb-1">GitHub Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Extract skills from your GitHub portfolio
                </p>
              </div>
            </section>

            {/* Form */}
            <section className="max-w-2xl mx-auto w-full">
              <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
            </section>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 rounded-lg bg-secondary/50 w-fit mx-auto">
              <Button
                variant={activeTab === "results" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("results")}
              >
                <Target className="h-4 w-4 mr-2" />
                Results
              </Button>
              <Button
                variant={activeTab === "roadmap" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("roadmap")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Learning Roadmap
              </Button>
            </div>

            {/* Content */}
            {activeTab === "results" ? (
              profile && <ResultsDashboard result={result} profile={profile} />
            ) : (
              <LearningRoadmap result={result} />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Built with AI to bridge the education-employment gap • Powered by Ollama 🦙
          </p>
        </div>
      </footer>
    </main>
  )
}