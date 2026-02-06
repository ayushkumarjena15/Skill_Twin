"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  TrendingUp,
  Target,
  Building,
  DollarSign,
  MessageCircle,
  Zap,
  Globe,
  Briefcase,
  Rocket,
  ArrowUpRight
} from "lucide-react"
import type { CareerAdvice } from "@/lib/types"

interface CareerAdviceProps {
  advice: CareerAdvice
}

export function CareerAdviceCard({ advice }: CareerAdviceProps) {
  if (!advice) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12"
    >
      {/* Hero Section / Overall Assessment */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <Rocket className="h-48 w-48 rotate-12" />
          </div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Lightbulb className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Career Strategy & Outlook</CardTitle>
            </div>
            <CardDescription className="text-lg leading-relaxed text-muted-foreground max-w-3xl">
              {advice.overallAssessment}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        {advice.strengths && advice.strengths.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="h-full border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <div className="p-1.5 rounded-md bg-emerald-500/20">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  Core Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {advice.strengths.map((strength, i) => (
                    <Badge
                      key={i}
                      className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 px-3 py-1"
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Improvements Card */}
        {advice.improvements && advice.improvements.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="h-full border-orange-500/20 bg-orange-500/5 backdrop-blur-md hover:border-orange-500/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <div className="p-1.5 rounded-md bg-orange-500/20">
                    <Target className="h-5 w-5" />
                  </div>
                  Development Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {advice.improvements.map((item, i) => (
                    <Badge
                      key={i}
                      className="bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20 px-3 py-1"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Interview & Prep Strategy */}
      {advice.interviewTips && advice.interviewTips.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-card/40 backdrop-blur-md overflow-hidden relative">
            <div className="absolute top-4 right-4 text-primary/10">
              <Zap className="h-12 w-12" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600">
                  <Lightbulb className="h-5 w-5" />
                </div>
                Interview Masterclass Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {advice.interviewTips.map((tip, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/40 border border-border/50 group hover:border-primary/30 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Market Insights & Earnings */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Salary Projections */}
        {advice.salaryRange && (
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="h-full border-primary/20 bg-card/30 backdrop-blur-md">
              <CardHeader className="pb-3 text-center">
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  Salary Projections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { label: "Entry", val: advice.salaryRange.entry, color: "text-blue-500" },
                    { label: "Mid", val: advice.salaryRange.mid, color: "text-primary" },
                    { label: "Senior", val: advice.salaryRange.senior, color: "text-emerald-500" }
                  ].map((level) => (
                    <div key={level.label} className="p-3 rounded-xl bg-background/50 border border-border/50 flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{level.label} Level</span>
                      <span className={`text-xl font-black ${level.color}`}>{level.val}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Industry Matchmaking */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="h-full border-border/50 bg-card/30 backdrop-blur-md flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <Building className="h-5 w-5" />
                </div>
                Industry Matchmaking
              </CardTitle>
              <CardDescription>Top ecosystems hiring for your profile</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="grid grid-cols-2 gap-3">
                {advice.companiesHiring && advice.companiesHiring.map((company, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-background/60 border border-border/50 hover:border-blue-500/30 transition-all group">
                    <Globe className="h-4 w-4 text-blue-400 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-semibold truncate">{company}</span>
                    <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {advice.alternativeRoles && advice.alternativeRoles.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                    <Briefcase className="h-3 w-3" />
                    Alternative Career Pivots
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {advice.alternativeRoles.map((role, i) => (
                      <Badge key={i} variant="outline" className="bg-background/50 hover:bg-primary/10 transition-colors pointer-events-none">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Motivational Footer */}
      {advice.motivationalMessage && (
        <motion.div variants={itemVariants}>
          <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-background to-blue-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/5 mask-image-linear-gradient" />
            <CardContent className="pt-8 pb-8 text-center relative">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <MessageCircle className="h-6 w-6" />
                </div>
              </div>
              <p className="text-xl md:text-2xl font-medium italic text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                "{advice.motivationalMessage}"
              </p>
              <div className="mt-6">
                {/* Icon removed */}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}