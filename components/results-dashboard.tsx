"use client"

import { motion } from "framer-motion"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CompositionChart } from "@/components/dashboard/composition-chart"
import { SkillRadialChart } from "@/components/dashboard/radial-chart"
import { ScoreRing } from "@/components/dashboard/score-ring"
import {
  CheckCircle2,
  TrendingUp,
  Github,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Cpu,
  Layers,
  Zap,
  Award
} from "lucide-react"
import type { StudentProfile, MultiAgentResult } from "@/lib/types"

interface ResultsDashboardProps {
  result: MultiAgentResult
  profile: StudentProfile | null
}

export function ResultsDashboard({ result, profile }: ResultsDashboardProps) {
  // Prepare data for Radial Chart with new Neon Palette
  const radialData = [
    { name: 'Core Tech', score: result.coreSkillsMatch || 0, fill: 'var(--chart-1)' }, // Indigo/Violet
    { name: 'Bonus Skills', score: result.bonusSkillsMatch || 0, fill: 'var(--chart-5)' }, // Blue
    { name: 'Academics', score: result.cgpaScore || 0, fill: 'var(--chart-3)' }, // Amber
    { name: 'Portfolio', score: result.githubScore || 0, fill: 'var(--chart-2)' }, // Emerald
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 50 }
    }
  }


  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-12 gap-5"
    >
      {/* 1. MAIN SCORE CARD (Bento: Large Square) */}
      <motion.div variants={itemVariant} className="col-span-12 md:col-span-4 lg:col-span-4">
        <SpotlightCard spotlightColor="rgba(139, 92, 246, 0.2)" className="h-full group">
          <div className="flex flex-col h-full bg-zinc-900/30 backdrop-blur-sm">
            <CardHeader className="pb-2 relative z-10 border-b border-white/5">
              <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3 text-violet-400" />
                Employability Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center py-8 relative z-10">
              <div className="relative z-10 scale-110">
                <ScoreRing score={result.employabilityScore} size={200} strokeWidth={8} />
              </div>

              <div className="text-center space-y-1 mt-8">
                <h3 className="text-2xl font-bold text-white tracking-tight animate-in fade-in zoom-in duration-500">
                  {result.employabilityScore >= 80 ? "Top 5% Candidate" :
                    result.employabilityScore >= 60 ? "Strong Potential" :
                      "Developing"}
                </h3>
                <p className="text-xs text-zinc-500 font-mono">
                  {profile?.jobRole} Track
                </p>
              </div>
            </CardContent>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* 2. SKILL COMPOSITION (Bento: Wide Rect) */}
      <motion.div variants={itemVariant} className="col-span-12 md:col-span-8 lg:col-span-5">
        <SpotlightCard spotlightColor="rgba(59, 130, 246, 0.2)" className="h-full">
          <div className="flex flex-col h-full bg-zinc-900/30 backdrop-blur-sm">
            <CardHeader className="pb-2 border-b border-white/5">
              <CardTitle className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-3 h-3 text-blue-400" />
                Composition Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex items-center justify-center flex-1 h-[340px] relative overflow-hidden">
              {/* Grid Background Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

              <CompositionChart data={radialData} />
            </CardContent>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* 3. METRICS COLUMN (Bento: Stacked Small) */}
      <div className="col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
        {/* Core Skills */}
        <motion.div variants={itemVariant}>
          <SpotlightCard spotlightColor="rgba(99, 102, 241, 0.2)" className="hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-zinc-900/30 p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Core Match</span>
                <Briefcase className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-mono font-bold text-white tracking-tighter">{result.coreSkillsMatch}%</span>
              </div>
              <Progress value={result.coreSkillsMatch} className="h-1.5 bg-zinc-800" indicatorClassName="bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Portfolio */}
        <motion.div variants={itemVariant}>
          <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)" className="hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-zinc-900/30 p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Git Activity</span>
                <Github className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-mono font-bold text-white tracking-tighter">{result.githubScore}</span>
                <span className="text-xs text-zinc-600">pts</span>
              </div>
              <Progress value={result.githubScore} className="h-1.5 bg-zinc-800" indicatorClassName="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Academics */}
        <motion.div variants={itemVariant}>
          <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)" className="hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-zinc-900/30 p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">GPA Weight</span>
                <GraduationCap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-mono font-bold text-white tracking-tighter">{profile?.cgpa || 0}</span>
                <span className="text-xs text-zinc-600">/ 10.0</span>
              </div>
              <Progress value={result.cgpaScore} className="h-1.5 bg-zinc-800" indicatorClassName="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            </div>
          </SpotlightCard>
        </motion.div>
      </div>

      {/* 4. GITHUB PROFILE SECTION (Full Width if available) */}
      {result.githubData && result.githubData.username && (
        <motion.div variants={itemVariant} className="col-span-12">
          <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.1)" className="overflow-hidden">
            <div className="bg-zinc-900/30 p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Profile Info */}
                <div className="flex flex-col items-center md:items-start gap-4 shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-700 shadow-xl">
                      {result.githubData.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={result.githubData.avatarUrl}
                          alt={result.githubData.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <Github className="w-10 h-10 text-zinc-500" />
                        </div>
                      )}
                    </div>
                    <Badge className="absolute -bottom-2 -right-2 bg-black border border-zinc-800 text-white">
                      @{result.githubData.username}
                    </Badge>
                  </div>

                  <div className="text-center md:text-left space-y-2 max-w-[200px]">
                    {result.githubData.bio && (
                      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                        {result.githubData.bio}
                      </p>
                    )}
                    <a
                      href={result.githubData.profileUrl || `https://github.com/${result.githubData.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      View Profile <TrendingUp className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Stats & Repos */}
                <div className="flex-1 w-full space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800 text-center">
                      <div className="text-2xl font-bold text-white">{result.githubData.followers}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Followers</div>
                    </div>
                    <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800 text-center">
                      <div className="text-2xl font-bold text-white">{result.githubData.following}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Following</div>
                    </div>
                    <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800 text-center">
                      <div className="text-2xl font-bold text-white">{result.githubData.totalRepos}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Repositories</div>
                    </div>
                    <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800 text-center">
                      <div className="text-2xl font-bold text-white">{result.githubData.totalStars}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Total Stars</div>
                    </div>
                  </div>

                  {/* Top Repos */}
                  {result.githubData.topRepos.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Award className="w-3 h-3" /> Top Repositories
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.githubData.topRepos.slice(0, 4).map((repo) => (
                          <a
                            key={repo.name}
                            href={repo.url || `https://github.com/${result.githubData?.username}/${repo.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group/repo"
                          >
                            <div className="bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 p-3 rounded-lg transition-colors h-full">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-zinc-300 group-hover/repo:text-white truncate">
                                  {repo.name}
                                </span>
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                  {repo.language}
                                </Badge>
                              </div>
                              <p className="text-xs text-zinc-500 line-clamp-1 mb-2">
                                {repo.description || "No description provided"}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                                <span className="flex items-center gap-1">
                                  <Award className="w-3 h-3 text-amber-500/70" /> {repo.stars}
                                </span>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      )}

      {/* 5. SKILLS DECK (Bento: Two Halves) */}
      <motion.div variants={itemVariant} className="col-span-12 md:col-span-6">
        <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.1)" className="h-full">
          <div className="h-full bg-zinc-900/30 flex flex-col">
            <CardHeader className="border-b border-white/5 pb-3">
              <CardTitle className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                Matched Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.length > 0 ? (
                  result.matchedSkills.map((skill, i) => (
                    <motion.div
                      key={skill}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1, rotate: 1 }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-default"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500 italic">No matches found yet.</p>
                )}
              </div>
            </CardContent>
          </div>
        </SpotlightCard>
      </motion.div>

      <motion.div variants={itemVariant} className="col-span-12 md:col-span-6">
        <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.1)" className="h-full">
          <div className="h-full bg-zinc-900/30 flex flex-col">
            <CardHeader className="border-b border-white/5 pb-3">
              <CardTitle className="text-xs font-semibold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                Critical Gaps
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.length > 0 ? (
                  result.missingSkills.map((skill, i) => (
                    <motion.div
                      key={skill}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1, rotate: -1 }}
                    >
                      <Badge
                        variant="outline"
                        className="bg-rose-500/5 text-rose-400 border-rose-500/20 hover:bg-rose-500/10 px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-default"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    <Award className="h-5 w-5" />
                    <span className="text-sm font-medium">All systems go. You have all required skills.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* 5. USER SKILLSET (Bento: Full width footer) */}
      <motion.div variants={itemVariant} className="col-span-12">
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Cpu className="w-3 h-3" />
            <span className="text-[10px] font-mono tracking-widest uppercase">Detected Signature</span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {result.allUserSkills && result.allUserSkills.map((skill, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.7 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                whileHover={{ opacity: 1, scale: 1.1, textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
                className="px-2 py-1 rounded text-[10px] font-mono bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-crosshair transition-all"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

    </motion.div>
  )
}