"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { getSavedJobs, removeSavedJob } from "@/lib/db"
import type { SavedJob } from "@/lib/supabase"
import { BackButton } from "@/components/ui/back-button"
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Trash2,
  Bookmark,
  MapPin,
  DollarSign,
  ExternalLink,
  Building,
  AlertCircle,
  Clock
} from "lucide-react"
import Link from "next/link"

export default function SavedJobsPage() {
  return (
    <ProtectedRoute>
      <SavedJobsContent />
    </ProtectedRoute>
  )
}

function SavedJobsContent() {
  const { user } = useAuth()
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadSavedJobs()
    }
  }, [user])

  const loadSavedJobs = async () => {
    if (!user) return

    try {
      const { data, error } = await getSavedJobs(user.id)
      if (error) {
        console.error("Failed to load saved jobs:", error)
        return
      }
      if (data) setSavedJobs(data as SavedJob[])
    } catch (err) {
      console.error("Unexpected error loading saved jobs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (jobId: string) => {
    if (!user) return

    setRemovingId(jobId)

    try {
      const { error } = await removeSavedJob(user.id, jobId)
      if (error) {
        console.error("Failed to remove job:", error)
        return
      }
      setSavedJobs(prev => prev.filter(job => job.job_id !== jobId))
    } catch (err) {
      console.error("Unexpected error removing job:", err)
    } finally {
      setRemovingId(null)
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 70) return "bg-green-500/10 text-green-500 border-green-500/20"
    if (score >= 40) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl">SkillTwin</span>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <BackButton label="Dashboard" href="/dashboard" />
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Title */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bookmark className="h-8 w-8 text-primary" />
                Saved Jobs
              </h1>
              <p className="text-muted-foreground mt-2">
                Jobs you've saved for later
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard">Find More Jobs</Link>
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && savedJobs.length === 0 && (
            <Card className="border-border/50">
              <CardContent className="py-16 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Saved Jobs</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't saved any jobs yet. Run an analysis to find matching jobs.
                </p>
                <Button asChild>
                  <Link href="/dashboard">Find Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Saved Jobs List */}
          {!isLoading && savedJobs.length > 0 && (
            <div className="space-y-4">
              {savedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        {/* Job Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Building className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{job.job_title}</h3>
                              <p className="text-muted-foreground">{job.company}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location || "Remote"}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary || "Not disclosed"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Saved {new Date(job.saved_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {job.source}
                            </Badge>
                            {job.match_score > 0 && (
                              <Badge variant="outline" className={`text-xs ${getScoreBadge(job.match_score)}`}>
                                {job.match_score}% Match
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button asChild size="sm">
                            <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                              Apply Now
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(job.job_id)}
                            disabled={removingId === job.job_id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {removingId === job.job_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}