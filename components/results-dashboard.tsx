"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SkillRadialChart } from "@/components/dashboard/radial-chart"
import { ScoreRing } from "@/components/dashboard/score-ring"
import { 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Award, 
  Github, 
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Code
} from "lucide-react"
import type { StudentProfile, MultiAgentResult } from "@/lib/types"

interface ResultsDashboardProps {
  result: MultiAgentResult
  profile: StudentProfile | null
}

export function ResultsDashboard({ result, profile }: ResultsDashboardProps) {
  // Prepare data for Radial Chart
  const radialData = [
    { name: 'Core Tech', score: result.coreSkillsMatch || 0, fill: '#6366f1' }, // Indigo
    { name: 'Bonus Skills', score: result.bonusSkillsMatch || 0, fill: '#8b5cf6' }, // Violet
    { name: 'Academics', score: result.cgpaScore || 0, fill: '#eab308' }, // Yellow
    { name: 'Portfolio', score: result.githubScore || 0, fill: '#10b981' }, // Emerald
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Top Row: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Score Card */}
        <motion.div variants={item} className="md:col-span-4">
          <Card className="h-full border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Employability Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <ScoreRing score={result.employabilityScore} />
              <div className="mt-4 text-center">
                <h3 className="font-semibold text-lg text-foreground">
                  {result.employabilityScore >= 80 ? "Industry Ready" : 
                   result.employabilityScore >= 60 ? "Job Potential" : 
                   "Needs Improvement"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {profile?.jobRole} requirements
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radial Chart */}
        <motion.div variants={item} className="md:col-span-8">
          <Card className="h-full shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Skill Composition Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SkillRadialChart data={radialData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Middle Row: Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Skills Metric */}
        <motion.div variants={item}>
          <Card className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Core Skills</p>
                  <h3 className="text-2xl font-bold mt-1">{result.coreSkillsMatch}%</h3>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <Progress value={result.coreSkillsMatch} className="h-2 bg-blue-100" />
              <p className="text-xs text-muted-foreground mt-3">
                {result.matchedSkills.length} matched core skills
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* GitHub Metric */}
        <motion.div variants={item}>
          <Card className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio Strength</p>
                  <h3 className="text-2xl font-bold mt-1">{result.githubScore}/100</h3>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                  <Github className="h-5 w-5" />
                </div>
              </div>
              <Progress value={result.githubScore} className="h-2 bg-emerald-100" />
              <p className="text-xs text-muted-foreground mt-3">
                Based on repos, stars & languages
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Academic Metric */}
        <motion.div variants={item}>
          <Card className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Academic Score</p>
                  <h3 className="text-2xl font-bold mt-1">{profile?.cgpa || 0}/10</h3>
                </div>
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <Progress value={result.cgpaScore} className="h-2 bg-yellow-100" />
              <p className="text-xs text-muted-foreground mt-3">
                Weighted GPA contribution
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row: Skills Lists (3 Boxes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. All User Skills */}
        <motion.div variants={item}>
          <Card className="h-full border-t-4 border-t-slate-500 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="h-5 w-5 text-slate-500" />
                Your Skillset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.allUserSkills && result.allUserSkills.length > 0 ? (
                  result.allUserSkills.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No skills found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. Matched Skills */}
        <motion.div variants={item}>
          <Card className="h-full border-t-4 border-t-green-500 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Matched Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.length > 0 ? (
                  result.matchedSkills.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No matching skills found for this role.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Missing Skills */}
        <motion.div variants={item}>
          <Card className="h-full border-t-4 border-t-red-500 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Skills to Acquire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.length > 0 ? (
                  result.missingSkills.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="border-red-200 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <Award className="h-5 w-5" />
                    <span className="text-sm font-medium">Great job! You have all required skills.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}