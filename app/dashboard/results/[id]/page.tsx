"use client"

import { useState, useEffect, use } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { ResultsDashboard } from "@/components/results-dashboard"
import { LearningRoadmap } from "@/components/learning-roadmap"
import { JobListings } from "@/components/job-listings"
import { CareerAdviceCard } from "@/components/career-advice"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/ui/back-button"
import { StreakCounter } from "@/components/streak-counter"
import { ProgressTracker } from "@/components/progress-tracker"
import { InterviewPrep } from "@/components/interview-prep"
import { ResumeTailor } from "@/components/resume-tailor"
import { SyllabusAnalysis } from "@/components/syllabus-analysis"
import { getAnalysisById } from "@/lib/db"
import type { StudentProfile, MultiAgentResult } from "@/lib/types"

import {
    ArrowLeft,
    Target,
    BookOpen,
    Briefcase,
    Brain,
    Bot,
    FileText,
    ClipboardList,
    Loader2,
    AlertCircle,
    History,
    School
} from "lucide-react"
import Link from "next/link"

interface ResultsPageProps {
    params: Promise<{ id: string }>
}

export default function ResultsPage({ params }: ResultsPageProps) {
    return (
        <ProtectedRoute>
            <ResultsContent params={params} />
        </ProtectedRoute>
    )
}

function ResultsContent({ params }: ResultsPageProps) {
    const resolvedParams = use(params)
    const { user } = useAuth()
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [result, setResult] = useState<MultiAgentResult | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"results" | "syllabus" | "roadmap" | "jobs" | "advice" | "progress" | "interview" | "resume">("results")

    useEffect(() => {
        if (user && resolvedParams.id) {
            loadAnalysis(resolvedParams.id)
        }
    }, [user, resolvedParams.id])

    const loadAnalysis = async (id: string) => {
        try {
            setIsLoading(true)
            setError(null)

            const { data, error: fetchError } = await getAnalysisById(id)

            if (fetchError) {
                setError("Failed to load analysis. Please try again.")
                console.error("Failed to load analysis:", fetchError)
                return
            }

            if (!data) {
                setError("Analysis not found.")
                return
            }

            // Convert database record to profile and result format
            const loadedProfile: StudentProfile = {
                jobRole: data.job_role,
                cgpa: data.cgpa,
                syllabusTopics: data.syllabus_topics || [],
                projects: data.projects || [],
                githubUsername: data.github_username
            }

            const loadedResult: MultiAgentResult = {
                employabilityScore: data.employability_score,
                matchedSkills: data.matched_skills || [],
                missingSkills: data.missing_skills || [],
                coreSkillsMatch: data.core_skills_match,
                bonusSkillsMatch: data.bonus_skills_match,
                cgpaScore: data.cgpa_score,
                githubScore: data.github_score,
                roadmap: data.roadmap as MultiAgentResult["roadmap"],
                resources: data.resources as MultiAgentResult["resources"],
                careerAdvice: data.career_advice as MultiAgentResult["careerAdvice"],
                matchingJobs: data.matching_jobs as MultiAgentResult["matchingJobs"],
                agentsUsed: []
            }

            setProfile(loadedProfile)
            setResult(loadedResult)
        } catch (err) {
            console.error("Unexpected error loading analysis:", err)
            setError("An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
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
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20"
                                >
                                    <img src="/logo.png" alt="SkillTwin Logo" className="w-full h-full object-cover" />
                                </motion.div>
                                <span className="font-bold text-xl group-hover:text-primary transition-colors">SkillTwin</span>
                            </Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <StreakCounter />
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/history">
                                    <History className="h-4 w-4 mr-2" />
                                    History
                                </Link>
                            </Button>
                            <ThemeToggle />
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/dashboard">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    New Analysis
                                </Link>
                            </Button>
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
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading analysis...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="max-w-md mx-auto text-center py-20">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Error</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button asChild>
                            <Link href="/history">Back to History</Link>
                        </Button>
                    </div>
                )}

                {/* Results Content */}
                {!isLoading && !error && result && profile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Title */}
                        <div className="text-center mb-4">
                            <Badge variant="outline" className="mb-2">
                                <History className="h-3 w-3 mr-1" />
                                Saved Analysis
                            </Badge>
                            <h1 className="text-2xl font-bold">{profile.jobRole}</h1>
                            <p className="text-muted-foreground text-sm">Viewing saved analysis results</p>
                        </div>

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
                                variant={activeTab === "syllabus" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveTab("syllabus")}
                                className="transition-all"
                            >
                                <School className="h-4 w-4 mr-2" />
                                Syllabus Check
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
                            {activeTab === "results" && (
                                <ResultsDashboard result={result} profile={profile} />
                            )}

                            {activeTab === "syllabus" && (
                                <SyllabusAnalysis
                                    jobRole={profile.jobRole}
                                    initialSyllabusTopics={profile.syllabusTopics}
                                />
                            )}

                            {activeTab === "roadmap" && (
                                <LearningRoadmap
                                    result={result}
                                    userId={user?.id}
                                    jobRole={profile.jobRole}
                                />
                            )}

                            {activeTab === "jobs" && (
                                <JobListings
                                    jobs={result.matchingJobs || []}
                                    userSkills={[...(profile.syllabusTopics || []), ...(profile.projects || [])]}
                                />
                            )}

                            {activeTab === "advice" && result.careerAdvice && (
                                <CareerAdviceCard advice={result.careerAdvice} />
                            )}

                            {activeTab === "progress" && (
                                <ProgressTracker result={result} />
                            )}

                            {activeTab === "interview" && (
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
