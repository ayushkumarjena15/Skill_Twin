"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BackButton } from "@/components/ui/back-button"
import { RoadmapTimeline, type RoadmapMilestone } from "@/components/ui/roadmap-components"
import { getAnalysisHistory } from "@/lib/db"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PersonalizedRoadmapPage() {
    const { user, loading: authLoading } = useAuth()
    const [roadmapData, setRoadmapData] = useState<RoadmapMilestone[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [metadata, setMetadata] = useState<{ totalWeeks?: number, generatedAt?: string, jobRole?: string } | null>(null)

    useEffect(() => {
        async function fetchRoadmap() {
            if (authLoading) return
            if (!user) {
                setLoading(false)
                return
            }

            try {
                // Fetch latest analysis
                const history = await getAnalysisHistory(user.id, 1) // Get latest 1

                if (history && history.data && history.data.length > 0) {
                    const latestAnalysis = history.data[0]
                    const rawRoadmap = latestAnalysis.roadmap as any

                    if (rawRoadmap && rawRoadmap.phases) {
                        // It's the AI structure
                        const milestones = rawRoadmap.phases.map((phase: any, idx: number) => ({
                            id: phase.id || `phase-${idx}`,
                            quarter: `Phase ${idx + 1}`,
                            title: phase.title,
                            description: phase.goal,
                            status: phase.status as "completed" | "in-progress" | "upcoming",
                            features: phase.focusTopics,
                            date: `${phase.durationWeeks} Weeks`
                        }))
                        setRoadmapData(milestones)
                        setMetadata({
                            totalWeeks: rawRoadmap.totalDurationWeeks,
                            generatedAt: rawRoadmap.generatedAt,
                            jobRole: latestAnalysis.job_role
                        })
                    } else if (Array.isArray(rawRoadmap)) {
                        // Fallback for old structure if any
                        const milestones = rawRoadmap.map((phase: any, idx: number) => ({
                            id: `phase-${phase.phase}`,
                            quarter: `Phase ${phase.phase}`,
                            title: phase.title,
                            description: phase.description,
                            status: (idx === 0 ? "in-progress" : "upcoming") as "completed" | "in-progress" | "upcoming",
                            features: phase.skills,
                            date: phase.duration
                        }))
                        setRoadmapData(milestones)
                        setMetadata({
                            jobRole: latestAnalysis.job_role
                        })
                    } else {
                        setError("No valid roadmap data found in your latest analysis.")
                    }
                } else {
                    setError("No analysis history found.")
                }
            } catch (err: any) {
                console.error(err)
                setError("Failed to load your roadmap.")
            } finally {
                setLoading(false)
            }
        }

        fetchRoadmap()
    }, [user, authLoading])

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold">Please Log In</h1>
                        <p className="text-muted-foreground">You need to be logged in to view your personalized roadmap.</p>
                        <Link href="/login">
                            <Button>Log In</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (error || !roadmapData) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="text-center space-y-4 max-w-md">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                        <h1 className="text-2xl font-bold">No Roadmap Found</h1>
                        <p className="text-muted-foreground">
                            {error || "We couldn't find a generated roadmap for you yet."}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Please generate a new analysis and roadmap from the dashboard first.
                        </p>
                        <Link href="/dashboard">
                            <Button>Go to Dashboard</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <BackButton />
                        {metadata?.generatedAt && (
                            <span className="text-xs text-muted-foreground font-mono">
                                Generated on: {new Date(metadata.generatedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-block mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                                {metadata?.jobRole || "Career Path"}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600">
                            Your Personalized Roadmap
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            A tailored execution plan designed to take you from your current skill level to job-ready mastery.
                            {metadata?.totalWeeks && <span className="block mt-2 font-semibold text-foreground">Estimated Duration: ~{metadata.totalWeeks} Weeks</span>}
                        </p>
                    </motion.div>

                    <div className="bg-zinc-950/30 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                        <RoadmapTimeline
                            title="Execution Strategy"
                            description="Follow this step-by-step guide to bridge your skill gaps."
                            milestones={roadmapData}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
