"use client"

import { useState } from "react"
import { AnalysisForm } from "@/components/analysis-form"
import { ResultsDashboard } from "@/components/results-dashboard"
import { LearningRoadmap } from "@/components/learning-roadmap"
import { Button } from "@/components/ui/button"
import type { StudentProfile, AnalysisResult } from "@/lib/types"
import {
  Sparkles,
  ArrowLeft,
  Zap,
  Target,
  BookOpen,
  Github
} from "lucide-react"

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

      if (!response.ok) throw new Error("Analysis failed")

      const analysisResult = await response.json()
      setProfile(studentProfile)
      setResult(analysisResult)
    } catch (error) {
      console.error(error)
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
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SkillTune</h1>
              <p className="text-xs text-muted-foreground">
                AI-Powered Skill Gap Analyzer
              </p>
            </div>
          </div>

          {result && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {!result ? (
          <div className="flex flex-col gap-16">
            {/* Hero */}
            <section className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Bridge the gap between
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}education{" "}
                </span>
                and
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  {" "}employment
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Analyze your skills, identify gaps, and receive a personalized
                roadmap to become job-ready faster.
              </p>
            </section>

            {/* Features */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "Instant Analysis",
                  desc: "AI-powered real-time skill gap detection"
                },
                {
                  icon: Target,
                  title: "Job Matching",
                  desc: "Align your skills with industry roles"
                },
                {
                  icon: BookOpen,
                  title: "Learning Path",
                  desc: "Personalized roadmap & resources"
                },
                {
                  icon: Github,
                  title: "GitHub Insights",
                  desc: "Extract skills from your repositories"
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-border/50 bg-card/30 text-center"
                >
                  <item.icon className="h-6 w-6 mx-auto text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </section>

            {/* Form */}
            <section className="max-w-2xl mx-auto w-full">
              <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
            </section>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Tabs */}
            <div className="flex gap-2 mx-auto bg-secondary/50 p-1 rounded-lg">
              <Button
                size="sm"
                variant={activeTab === "results" ? "default" : "ghost"}
                onClick={() => setActiveTab("results")}
              >
                <Target className="h-4 w-4 mr-2" />
                Results
              </Button>
              <Button
                size="sm"
                variant={activeTab === "roadmap" ? "default" : "ghost"}
                onClick={() => setActiveTab("roadmap")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Roadmap
              </Button>
            </div>

            {activeTab === "results" ? (
              profile && <ResultsDashboard profile={profile} result={result} />
            ) : (
              <LearningRoadmap result={result} />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/40 mt-24">
        <div className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="font-bold text-lg mb-2">SkillTune</h3>
            <p className="text-sm text-muted-foreground">
              Helping students become industry-ready using AI-driven insights.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Our Mission</li>
              <li>How It Works</li>
              <li>Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">FAQ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Is it free?</li>
              <li>How accurate is AI?</li>
              <li>GitHub analysis?</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Docs</li>
              <li>Privacy Policy</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground border-t border-border/50 py-6">
          Built with ❤️ • Powered by Ollama 🦙
        </div>
      </footer>
    </main>
  )
}
