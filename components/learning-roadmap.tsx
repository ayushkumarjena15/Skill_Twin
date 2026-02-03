"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AnalysisResult } from "@/lib/types"
import {
  Map,
  Clock,
  BookOpen,
  ExternalLink,
  CheckCircle,
  Circle,
  ArrowRight,
} from "lucide-react"

interface LearningRoadmapProps {
  result: AnalysisResult
}

export function LearningRoadmap({ result }: LearningRoadmapProps) {
  const phaseColors = [
    "from-primary/20 to-primary/5 border-primary/30",
    "from-accent/20 to-accent/5 border-accent/30",
    "from-chart-3/20 to-chart-3/5 border-chart-3/30",
  ]

  const phaseIcons = [
    <Circle key="foundation" className="h-5 w-5" />,
    <CheckCircle key="application" className="h-5 w-5" />,
    <CheckCircle key="mastery" className="h-5 w-5" />,
  ]

  if (result.missingSkills.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Map className="h-6 w-6 text-primary" />
            Learning Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-16 w-16 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">You are all set!</h3>
            <p className="text-muted-foreground max-w-md">
              Congratulations! You have all the required skills for this role.
              Focus on gaining practical experience and building projects.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Roadmap Header */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Map className="h-6 w-6 text-primary" />
            Personalized Learning Roadmap
          </CardTitle>
          <CardDescription>
            Your step-by-step guide to becoming job-ready
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Roadmap Phases */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

        <div className="flex flex-col gap-6">
          {result.roadmap.map((phase, index) => (
            <Card
              key={phase.phase}
              className={`border-border/50 bg-gradient-to-br ${phaseColors[index]} backdrop-blur relative overflow-hidden`}
            >
              {/* Phase Number Badge */}
              <div className="absolute -left-4 md:left-4 top-6 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center z-10 hidden md:flex">
                <span className="text-sm font-bold">{phase.phase}</span>
              </div>

              <CardHeader className="md:pl-16">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {phaseIcons[index]}
                    Phase {phase.phase}: {phase.title}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit">
                    <Clock className="h-3 w-3 mr-1" />
                    {phase.duration}
                  </Badge>
                </div>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent className="md:pl-16">
                <div className="flex flex-wrap gap-2">
                  {phase.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              {/* Arrow to next phase */}
              {index < result.roadmap.length - 1 && (
                <div className="hidden md:flex absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-background rounded-full p-1 border border-border">
                    <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Resources */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-primary" />
            Recommended Resources
          </CardTitle>
          <CardDescription>
            Curated learning materials to help you fill your skill gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.resources.map((resource, index) => (
              <Card
                key={`${resource.skill}-${index}`}
                className="border-border/30 bg-secondary/30"
              >
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{resource.skill}</h4>
                      <p className="text-sm text-muted-foreground">
                        {resource.platform}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {resource.duration}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn Now
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-primary/30 bg-primary/5 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">
                Total Estimated Time to Job-Ready
              </h3>
              <p className="text-muted-foreground">
                Following this roadmap consistently will prepare you for your target role
              </p>
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Clock className="h-6 w-6" />
              {result.roadmap.reduce((acc, phase) => {
                const weeks = parseInt(phase.duration) || 0
                return acc + weeks
              }, 0)}{" "}
              weeks
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
