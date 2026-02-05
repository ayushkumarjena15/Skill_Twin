"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { AnalysisResult, StudentProfile } from "@/lib/types"
import {
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  GraduationCap,
  Github,
  Award,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

interface ResultsDashboardProps {
  result: AnalysisResult
  profile: StudentProfile
}

export function ResultsDashboard({ result, profile }: ResultsDashboardProps) {
  const scoreData = [
    { name: "Core Skills", value: result.coreSkillsMatch, color: "hsl(270, 60%, 55%)" },
    { name: "Bonus Skills", value: result.bonusSkillsMatch, color: "hsl(165, 40%, 45%)" },
    { name: "CGPA", value: result.cgpaScore, color: "hsl(85, 40%, 55%)" },
    { name: "GitHub", value: result.githubScore, color: "hsl(200, 40%, 50%)" },
  ]

  const skillsData = [
    { name: "Matched", skills: result.matchedSkills.length, fill: "hsl(165, 40%, 45%)" },
    { name: "Missing", skills: result.missingSkills.length, fill: "hsl(25, 60%, 45%)" },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-accent"
    if (score >= 50) return "text-chart-3"
    return "text-destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 75) return "Excellent"
    if (score >= 50) return "Good"
    if (score >= 25) return "Needs Improvement"
    return "Significant Gap"
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Main Score Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Award className="h-6 w-6 text-primary" />
            Employability Score
          </CardTitle>
          <CardDescription>
            Analysis for {profile.jobRole}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(result.employabilityScore / 100) * 440} 440`}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(result.employabilityScore)}`}>
                    {result.employabilityScore}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getScoreLabel(result.employabilityScore)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    Core Skills
                  </div>
                  <Progress value={result.coreSkillsMatch} className="h-2" />
                  <span className="text-sm font-medium">{result.coreSkillsMatch}%</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Bonus Skills
                  </div>
                  <Progress value={result.bonusSkillsMatch} className="h-2" />
                  <span className="text-sm font-medium">{result.bonusSkillsMatch}%</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    Academic Score
                  </div>
                  <Progress value={result.cgpaScore} className="h-2" />
                  <span className="text-sm font-medium">{result.cgpaScore}%</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Github className="h-4 w-4" />
                    GitHub Engagement (commits, activity, repos etc.)
                  </div>
                  <Progress value={result.githubScore} className="h-2" />
                  <span className="text-sm font-medium">{result.githubScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Score Breakdown</CardTitle>
            <CardDescription>Contribution to overall score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Skills Distribution</CardTitle>
            <CardDescription>Matched vs Missing skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} layout="vertical">
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="skills" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Matched Skills
              <Badge variant="secondary" className="ml-auto">
                {result.matchedSkills.length}
              </Badge>
            </CardTitle>
            <CardDescription>Skills you already have</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.length > 0 ? (
                result.matchedSkills.map((skill) => (
                  <Badge key={skill} className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No matched skills found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5 text-destructive" />
              Missing Skills
              <Badge variant="secondary" className="ml-auto">
                {result.missingSkills.length}
              </Badge>
            </CardTitle>
            <CardDescription>Skills you need to develop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.length > 0 ? (
                result.missingSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="bg-destructive/10 text-destructive border-destructive/30"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-accent text-sm font-medium">
                  Congratulations! You have all required skills!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
