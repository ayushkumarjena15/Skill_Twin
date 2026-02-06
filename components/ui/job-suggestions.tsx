// components/ui/job-suggestions.tsx

"use client"

import { motion } from "framer-motion"
import {
  Briefcase,
  Star,
  ChevronRight,
  Target,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface SuggestedRole {
  role: string
  matchScore: number
  reason: string
  requiredSkills: string[]
  matchedSkills: string[]
  missingSkills: string[]
}

interface JobSuggestionsProps {
  suggestions: SuggestedRole[]
  detectedSkills: string[]
  onSelectRole: (role: string) => void
  onSkipToManual: () => void
  isLoading?: boolean
}

export function JobSuggestions({
  suggestions,
  detectedSkills,
  onSelectRole,
  onSkipToManual,
  isLoading
}: JobSuggestionsProps) {

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500 bg-green-500/10 border-green-500/30"
    if (score >= 50) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
    if (score >= 30) return "text-orange-500 bg-orange-500/10 border-orange-500/30"
    return "text-red-500 bg-red-500/10 border-red-500/30"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Great Match"
    if (score >= 50) return "Good Match"
    if (score >= 30) return "Fair Match"
    return "Learning Path"
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full mb-4"
        />
        <p className="text-muted-foreground">Analyzing your skills...</p>
      </div>
    )
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="font-medium">No suggestions available</p>
        <p className="text-sm text-muted-foreground mb-4">
          Continue to select a job role manually
        </p>
        <Button onClick={onSkipToManual}>
          Select Role Manually
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Recommended Career Paths</h3>
      </div>

      {/* Suggestion Cards */}
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.role}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${index === 0 ? "border-primary/30 bg-primary/5" : ""
              }`}
            onClick={() => onSelectRole(suggestion.role)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left Content */}
                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-2">
                    {index === 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Best Match
                      </Badge>
                    )}
                    {index === 1 && (
                      <Badge variant="secondary" className="text-xs">
                        2nd Choice
                      </Badge>
                    )}
                    {index === 2 && (
                      <Badge variant="outline" className="text-xs">
                        3rd Choice
                      </Badge>
                    )}
                  </div>

                  {/* Role Title */}
                  <h4 className="font-bold text-lg mb-1">{suggestion.role}</h4>

                  {/* Reason */}
                  <p className="text-sm text-muted-foreground mb-3">
                    {suggestion.reason}
                  </p>

                  {/* Matched Skills */}
                  {suggestion.matchedSkills.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          Your matching skills:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.matchedSkills.slice(0, 5).map(skill => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs bg-green-500/10 text-green-700"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {suggestion.matchedSkills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{suggestion.matchedSkills.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {suggestion.missingSkills.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-600 font-medium">
                          Skills to learn:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.missingSkills.slice(0, 4).map(skill => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs border-orange-500/30 text-orange-600"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {suggestion.missingSkills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{suggestion.missingSkills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Score Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 ${getScoreColor(
                      suggestion.matchScore
                    )}`}
                  >
                    <span className="text-xl font-bold">{suggestion.matchScore}%</span>
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {getScoreLabel(suggestion.matchScore)}
                  </span>
                </div>
              </div>

              {/* Select Button */}
              <div className="flex items-center justify-end mt-3 pt-3 border-t">
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  Select this role
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Manual Selection Option */}
      <div className="text-center pt-4 border-t mt-4">
        <p className="text-sm text-muted-foreground mb-2">
          Don't see what you're looking for?
        </p>
        <Button variant="outline" onClick={onSkipToManual} className="gap-2">
          <Briefcase className="h-4 w-4" />
          Choose a Different Role
        </Button>
      </div>
    </div>
  )
}