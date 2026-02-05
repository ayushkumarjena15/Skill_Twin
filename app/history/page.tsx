"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { getAnalysisHistory, deleteAnalysis } from "@/lib/db"
import type { AnalysisHistory } from "@/lib/supabase"
import { BackButton } from "@/components/ui/back-button"
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Trash2,
  Calendar,
  Briefcase,
  TrendingUp,
  Eye,
  History as HistoryIcon,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  )
}

function HistoryContent() {
  const { user } = useAuth()
  const [history, setHistory] = useState<AnalysisHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadHistory()
    }
  }, [user])

  const loadHistory = async () => {
    if (!user) return

    try {
      const { data, error } = await getAnalysisHistory(user.id, 20)
      if (error) {
        console.error("Failed to load history:", error)
        return
      }
      if (data) setHistory(data)
    } catch (err) {
      console.error("Unexpected error loading history:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return

    setDeletingId(id)

    try {
      const { error } = await deleteAnalysis(id)
      if (error) {
        console.error("Failed to delete:", error)
        return
      }
      setHistory(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error("Unexpected error deleting:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    if (score >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-500 border-green-500/20"
    if (score >= 60) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    if (score >= 40) return "bg-orange-500/10 text-orange-500 border-orange-500/20"
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
                <HistoryIcon className="h-8 w-8 text-primary" />
                Analysis History
              </h1>
              <p className="text-muted-foreground mt-2">
                View your past skill gap analyses
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard">New Analysis</Link>
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && history.length === 0 && (
            <Card className="border-border/50">
              <CardContent className="py-16 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't performed any skill gap analysis yet.
                </p>
                <Button asChild>
                  <Link href="/dashboard">Start Your First Analysis</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* History List */}
          {!isLoading && history.length > 0 && (
            <div className="space-y-4">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left Side */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-lg">{item.job_role}</h3>
                            <Badge variant="outline" className={getScoreBadge(item.employability_score)}>
                              {item.employability_score}% Match
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              Core: {item.core_skills_match}%
                            </span>
                            <span>
                              {item.matched_skills?.length || 0} matched, {item.missing_skills?.length || 0} missing
                            </span>
                          </div>

                          {/* Skills Preview */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.matched_skills?.slice(0, 4).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="bg-green-500/10 text-green-600 text-xs">
                                ✓ {skill}
                              </Badge>
                            ))}
                            {item.missing_skills?.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="bg-red-500/10 text-red-500 text-xs">
                                ✗ {skill}
                              </Badge>
                            ))}
                            {(item.matched_skills?.length || 0) + (item.missing_skills?.length || 0) > 7 && (
                              <Badge variant="outline" className="text-xs">
                                +{(item.matched_skills?.length || 0) + (item.missing_skills?.length || 0) - 7} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Right Side - Actions */}
                        <div className="flex items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/history/${item.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {deletingId === item.id ? (
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