"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { saveJob, removeSavedJob } from "@/lib/db"
import {
  Briefcase,
  MapPin,
  DollarSign,
  ExternalLink,
  Clock,
  Building,
  Bookmark,
  BookmarkCheck,
  Loader2
} from "lucide-react"
import type { Job } from "@/lib/types"

interface JobListingsProps {
  jobs: Job[]
  userSkills: string[]
}

export function JobListings({ jobs, userSkills }: JobListingsProps) {
  const { user } = useAuth()
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set())
  const [savingJobId, setSavingJobId] = useState<string | null>(null)

  const handleSaveJob = async (job: Job) => {
    if (!user) {
      alert("Please login to save jobs")
      return
    }

    setSavingJobId(job.id)

    try {
      if (savedJobIds.has(job.id)) {
        // Remove job
        const { error } = await removeSavedJob(user.id, job.id)
        if (error) {
          console.error("Failed to remove job:", error)
          return
        }
        setSavedJobIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(job.id)
          return newSet
        })
      } else {
        // Save job
        const { error } = await saveJob(user.id, {
          job_id: job.id,
          job_title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          apply_link: job.applyLink,
          source: job.source,
          match_score: job.matchScore || 0
        })
        if (error) {
          console.error("Failed to save job:", error)
          return
        }
        setSavedJobIds(prev => new Set(prev).add(job.id))
      }
    } catch (err) {
      console.error("Unexpected error handling job save:", err)
    } finally {
      setSavingJobId(null)
    }
  }

  const getMatchBadgeColor = (score: number | undefined) => {
    if (!score) return "bg-muted text-muted-foreground"
    if (score >= 70) return "bg-green-500/10 text-green-500 border-green-500/20"
    if (score >= 40) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No matching jobs found.</p>
            <p className="text-sm mt-2">Try adding more skills to find relevant jobs.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Matching Jobs ({jobs.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4" />
                    {job.company}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {job.matchScore !== undefined && (
                    <Badge
                      variant="outline"
                      className={getMatchBadgeColor(job.matchScore)}
                    >
                      {job.matchScore}% Match
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.postedDate}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {job.source}
                </Badge>
                <div className="flex items-center gap-2">
                  {/* Save Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveJob(job)}
                    disabled={savingJobId === job.id}
                    className={savedJobIds.has(job.id) ? "text-primary border-primary" : ""}
                  >
                    {savingJobId === job.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : savedJobIds.has(job.id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 mr-2" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>

                  {/* Apply Button */}
                  <Button asChild size="sm">
                    <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}