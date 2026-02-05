"use client"

import { motion } from "framer-motion"
import { 
  Briefcase, 
  Star, 
  ChevronRight, 
  Sparkles, 
  Target, 
  AlertCircle,
  CheckCircle,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SuggestedRole {
  role: string
  matchScore: number
  reason: string
  requiredSkills: string[]
  matchedSkills?: string[]
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
    if (score >= 80) return "text-green-500 bg-green-500/10 border-green-500/30"
    if (score >= 60) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
    if (score >= 40) return "text-orange-500 bg-orange-500/10 border-orange-500/30"
    return "text-red-500 bg-red-500/10 border-red-500/30"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match"
    if (score >= 60) return "Good Match"
    if (score >= 40) return "Fair Match"
    return "Learning Path"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />
    if (score >= 60) return <TrendingUp className="h-4 w-4" />
    return <Target className="h-4 w-4" />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mb-6"
        />
        <motion.p 
          className="text-lg font-medium mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          AI is analyzing your skills...
        </motion.p>
        <p className="text-sm text-muted-foreground">
          Matching with job market requirements
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Detected Skills Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Skills Detected from Your Resume
            <Badge variant="secondary" className="ml-2">
              {detectedSkills.length} skills
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {detectedSkills.slice(0, 20).map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <Badge 
                  variant="secondary" 
                  className="text-xs py-1 px-2 bg-background"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
            {detectedSkills.length > 20 && (
              <Badge variant="outline" className="text-xs">
                +{detectedSkills.length - 20} more
              </Badge>
            )}
          </div>
          {detectedSkills.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No skills detected. Please try a different resume or enter skills manually.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Suggested Roles Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          AI Recommended Career Paths
        </h3>
        <p className="text-sm text-muted-foreground">
          Based on your skills, here are the best matching job roles. Click to select.
        </p>

        {suggestions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium">No suggestions available</p>
              <p className="text-sm text-muted-foreground mb-4">
                Please try uploading a different resume or enter skills manually
              </p>
              <Button onClick={onSkipToManual}>
                Enter Manually
              </Button>
            </CardContent>
          </Card>
        ) : (
          suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.role}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-[1.01] ${
                  index === 0 ? 'border-primary/40 bg-gradient-to-r from-primary/5 to-transparent ring-1 ring-primary/20' : ''
                }`}
                onClick={() => onSelectRole(suggestion.role)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Left: Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        {index === 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs font-medium">
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
                      <h4 className="font-bold text-xl mb-2">{suggestion.role}</h4>

                      {/* Reason */}
                      <p className="text-sm text-muted-foreground mb-4">
                        {suggestion.reason}
                      </p>

                      {/* Matched Skills */}
                      {suggestion.matchedSkills && suggestion.matchedSkills.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium text-green-600">
                              Skills you have:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.matchedSkills.slice(0, 5).map(skill => (
                              <Badge 
                                key={skill} 
                                variant="secondary" 
                                className="text-xs bg-green-500/10 text-green-600 border-green-500/20"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {suggestion.matchedSkills.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{suggestion.matchedSkills.length - 5}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Missing Skills */}
                      {suggestion.missingSkills.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span className="text-xs font-medium text-orange-600">
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
                                +{suggestion.missingSkills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Score Circle */}
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-3 ${getScoreColor(suggestion.matchScore)}`}
                      >
                        <span className="text-2xl font-bold">{suggestion.matchScore}%</span>
                      </div>
                      <div className={`flex items-center gap-1 mt-2 text-xs ${getScoreColor(suggestion.matchScore).split(' ')[0]}`}>
                        {getScoreIcon(suggestion.matchScore)}
                        <span>{getScoreLabel(suggestion.matchScore)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="flex items-center justify-end mt-4 pt-3 border-t">
                    <Button variant="ghost" size="sm" className="text-primary">
                      Select this role
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Manual Selection Option */}
      <div className="text-center pt-6 border-t border-border/50">
        <p className="text-sm text-muted-foreground mb-3">
          Have a specific role in mind? Or don't see what you're looking for?
        </p>
        <Button variant="outline" onClick={onSkipToManual} className="gap-2">
          <Briefcase className="h-4 w-4" />
          Choose a Different Role Manually
        </Button>
      </div>
    </motion.div>
  )
}