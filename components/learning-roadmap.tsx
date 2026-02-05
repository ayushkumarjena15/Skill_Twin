"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Map,
  Clock,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Calendar,
  Rocket,
  Play
} from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface LearningRoadmapProps {
  result: AnalysisResult
}

export function LearningRoadmap({ result }: LearningRoadmapProps) {
  if (result.missingSkills.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-emerald-500">
              <CheckCircle className="h-6 w-6" />
              Roadmap Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div
                initial={{ rotate: -15, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="mb-8 p-6 rounded-full bg-emerald-500/20 text-emerald-500"
              >
                <TrendingUp className="h-16 w-16" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">You're Industry Ready!</h3>
              <p className="text-muted-foreground max-w-md text-lg">
                You possess all the skills required for the <span className="text-primary font-semibold">Target Role</span>.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-12"
    >
      {/* Overview Card */}
      <motion.div variants={fadeInUp}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 backdrop-blur-xl overflow-hidden relative group">
          <motion.div
            initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
            animate={{ opacity: 0.05, rotate: 12, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-0 right-0 p-8"
          >
            <Map className="h-40 w-40" />
          </motion.div>
          <CardHeader className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center md:justify-start gap-2"
                >
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">Your Strategic Learning Path</CardTitle>
                </motion.div>
                <CardDescription className="text-lg text-muted-foreground/80 max-w-xl">
                  We've identified <span className="text-primary font-bold">{result.missingSkills.length} transition points</span> to bridge your current profile to the <span className="text-primary font-bold">Target Industry Standard</span>.
                </CardDescription>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center bg-background/50 backdrop-blur-md p-4 px-8 rounded-2xl border border-primary/20 shadow-xl"
              >
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Timeline Projection</p>
                <p className="text-4xl font-black text-primary bg-clip-text">~12 Weeks</p>
              </motion.div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Roadmap Phases */}
      <div className="space-y-6">
        <motion.div variants={fadeInUp} className="flex items-center gap-3 px-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold tracking-tight uppercase tracking-widest text-sm">Step-by-Step Evolution</h3>
        </motion.div>

        <div className="grid gap-6">
          {result.roadmap.map((phase, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="group border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/40 hover:bg-card/60 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-primary/5">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-56 bg-gradient-to-b from-muted/50 to-muted/20 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border/50 relative overflow-hidden">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-2xl mb-4 shadow-xl shadow-primary/20 relative z-10"
                      >
                        {phase.phase}
                      </motion.div>
                      <Badge variant="secondary" className="bg-background/80 font-black tracking-widest text-[10px] uppercase px-4 py-1.5 border-primary/10 relative z-10">
                        {phase.duration}
                      </Badge>
                      {/* Decorative Background Number */}
                      <span className="absolute -bottom-4 -left-4 text-8xl font-black text-black/5 pointer-events-none select-none">
                        {phase.phase}
                      </span>
                    </div>
                    <div className="flex-grow p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-bold group-hover:text-primary transition-colors flex items-center gap-3">
                          {phase.title}
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-primary/50"
                          />
                        </h4>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                        {phase.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {phase.skills.map((skill, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.1, rotate: 2 }}
                          >
                            <Badge
                              variant="outline"
                              className="bg-primary/5 text-primary border-primary/20 px-3 py-1 text-xs font-semibold hover:bg-primary hover:text-white transition-all cursor-default"
                            >
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Resources */}
      <div className="space-y-6">
        <motion.div variants={fadeInUp} className="flex items-center gap-3 px-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold tracking-tight uppercase tracking-widest text-sm">Curated Mastery Tracks</h3>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.resources.map((resource, idx) => (
            <motion.div
              key={idx}
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full border-border/50 bg-card/40 hover:bg-card/70 transition-all duration-500 group relative overflow-hidden shadow-lg hover:shadow-blue-500/10">
                <CardContent className="p-6 flex flex-col h-full relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="p-3 rounded-xl bg-background border border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all shadow-sm"
                    >
                      <Rocket className="h-6 w-6 text-primary" />
                    </motion.div>
                    <Badge variant="outline" className="bg-background/80 text-[10px] font-black uppercase tracking-[0.2em] border-primary/20 text-primary px-3">
                      {resource.platform}
                    </Badge>
                  </div>
                  <h5 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors leading-tight">{resource.skill}</h5>
                  <p className="text-sm text-muted-foreground/70 mb-8 font-medium">Professional grade curriculum designed for full skill acquisition.</p>

                  <div className="mt-auto pt-6 border-t border-border/30">
                    <Button
                      variant="ghost"
                      className="w-full justify-between hover:bg-primary hover:text-white group/btn rounded-xl py-6 transition-all duration-300"
                      asChild
                    >
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <span className="font-bold tracking-wide">Start Learning</span>
                        <Play className="h-4 w-4 fill-current group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <ChevronRight className="h-24 w-24 -mr-8 -mt-8" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Timetable */}
      {("timetable" in result) && (result as any).timetable && (
        <motion.div
          variants={fadeInUp}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight uppercase tracking-widest text-sm">Hyper-Targeted Preparation Schedule</h3>
          </div>
          <Card className="border-border/50 bg-card/10 backdrop-blur-2xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-border/30">
                {(result as any).timetable.map((dayPlan: any, i: number) => (
                  <motion.div
                    key={i}
                    className="flex flex-col group/day hover:bg-primary/[0.02] transition-colors"
                  >
                    <div className="bg-muted/30 p-4 text-center border-b border-border/30 group-hover/day:bg-primary/5 transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover/day:text-primary transition-colors">{dayPlan.day}</span>
                    </div>
                    <div className="p-5 space-y-6">
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase font-black tracking-widest text-primary/60">Morning</p>
                        <p className="text-[13px] font-bold text-muted-foreground leading-tight group-hover/day:text-foreground transition-colors">{dayPlan.morning}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase font-black tracking-widest text-blue-500/60">Afternoon</p>
                        <p className="text-[13px] font-bold text-muted-foreground leading-tight group-hover/day:text-foreground transition-colors">{dayPlan.afternoon}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase font-black tracking-widest text-emerald-500/60">Evening</p>
                        <p className="text-[13px] font-bold text-muted-foreground leading-tight group-hover/day:text-foreground transition-colors">{dayPlan.evening}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
