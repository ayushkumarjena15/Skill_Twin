"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    format,
    addWeeks,
    eachDayOfInterval,
    endOfMonth,
    startOfMonth,
    isSameDay,
    isToday,
    isFuture,
    subDays
} from "date-fns"
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    Trophy,
    Target,
    ArrowRight,
    TrendingUp,
    Clock,
    Flame,
    XCircle,
    Check,
    Zap
} from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface ProgressTrackerProps {
    result: AnalysisResult
}

export function ProgressTracker({ result }: ProgressTrackerProps) {
    // --- Checklist State ---
    const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({})

    // --- Calendar/Streak State ---
    const [checkedDates, setCheckedDates] = useState<string[]>([])
    const [currentStreak, setCurrentStreak] = useState(0)
    const [startDate] = useState<Date>(new Date())

    // Load Data on Mount
    useEffect(() => {
        // 1. Checklist
        const savedProgress = localStorage.getItem("skilltwin_progress")
        if (savedProgress) setCompletedItems(JSON.parse(savedProgress))

        // 2. Streak Data (Dates)
        const savedDates = localStorage.getItem("skilltwin_streak_dates")
        let dates: string[] = []
        if (savedDates) {
            try {
                dates = JSON.parse(savedDates)
                setCheckedDates(dates)
            } catch (e) { console.error(e) }
        }

        // 3. Calculate Streak based on dates
        calculateAndSyncStreak(dates)
    }, [])

    const calculateAndSyncStreak = (titles: string[]) => {
        // Sort dates descending
        const sorted = [...titles].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

        if (sorted.length === 0) {
            updateGlobalStreak(0)
            return
        }

        // Check if Today is done
        const todayStr = new Date().toDateString()
        const lastCheckIn = sorted[0]

        // Logic: 
        // If last check-in is today -> Streak is 'consecutive days ending today'
        // If last check-in is yesterday -> Streak is 'consecutive days ending yesterday'
        // If last check-in is older -> Streak is 0 (broken)

        let streakCount = 0
        let checkDate = new Date()

        // If we haven't checked in today, start checking from yesterday to see existing streak
        if (lastCheckIn !== todayStr) {
            checkDate = subDays(new Date(), 1)
            // If the last checkin wasn't yesterday either, then streak is definitely 0
            if (lastCheckIn !== checkDate.toDateString()) {
                updateGlobalStreak(0)
                return
            }
        }

        // Count backwards
        for (let i = 0; i < sorted.length; i++) {
            // We expect sorted[i] to match checkDate
            if (sorted[i] === checkDate.toDateString()) {
                streakCount++
                checkDate = subDays(checkDate, 1)
            } else {
                break // Sequence broken
            }
        }

        updateGlobalStreak(streakCount)
    }

    const updateGlobalStreak = (count: number) => {
        setCurrentStreak(count)
        // Save to global key for the Header Component with metadata
        localStorage.setItem("skilltwin_streak", JSON.stringify({
            currentStreak: count,
            lastDate: new Date().toDateString()
        }))
        // Dispatch event for StreakCounter in header
        window.dispatchEvent(new Event("skilltwin-streak-update"))
    }

    const toggleCheckIn = () => {
        const today = new Date()
        const todayStr = today.toDateString()

        let newDates = [...checkedDates]
        const isChecked = newDates.includes(todayStr)

        if (isChecked) {
            // Uncheck (remove)
            newDates = newDates.filter(d => d !== todayStr)
        } else {
            // Check
            newDates = [todayStr, ...newDates] // Add to start
        }

        setCheckedDates(newDates)
        localStorage.setItem("skilltwin_streak_dates", JSON.stringify(newDates))
        calculateAndSyncStreak(newDates)
    }


    // --- Checklist Helpers ---
    const toggleItem = (id: string) => {
        const newItems = { ...completedItems, [id]: !completedItems[id] }
        setCompletedItems(newItems)
        localStorage.setItem("skilltwin_progress", JSON.stringify(newItems))
    }

    // --- Derived Metrics ---
    const allMilestones = result.roadmap.flatMap((phase, phaseIdx) =>
        phase.skills.map((skill, skillIdx) => ({
            id: `p${phaseIdx}-s${skillIdx}`,
            phaseIdx,
            skill,
            phaseTitle: phase.title
        }))
    )
    const totalItems = allMilestones.length
    const completedCount = Object.values(completedItems).filter(Boolean).length
    const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

    // Timeline
    const parseDurationWeeks = (durationStr: string): number => {
        const lower = durationStr.toLowerCase()
        if (lower.includes("week")) return parseInt(lower) || 1
        if (lower.includes("month")) return (parseInt(lower) || 1) * 4
        return 1
    }
    const totalWeeks = result.roadmap.reduce((acc, phase) => acc + parseDurationWeeks(phase.duration), 0)
    const projectedEndDate = addWeeks(startDate, totalWeeks)


    // --- Calendar Grid Generation ---
    const today = new Date()
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // --- Mission Generation ---
    // Simple deterministic mission based on day of month to simulate variety
    const missions = [
        "Review 1 skill from Phase 1",
        "Complete 1 checklist item",
        "Read an article on your top skill gap",
        "Update your LinkedIn profile",
        "Practice a coding problem",
        "Reach 100% on a Phase",
        "Share your progress on LinkedIn"
    ]
    const todaysMission = missions[today.getDate() % missions.length]


    return (
        <div className="space-y-8">
            {/* 1. HERO SECTION: MISSION + CALENDAR */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* DAILY MISSION CARD */}
                <Card className="bg-gradient-to-br from-violet-500/10 via-background to-background border-violet-500/20 md:col-span-1 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-4 opacity-10">
                        <Zap className="w-32 h-32 text-violet-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                            <Zap className="h-5 w-5 fill-current" />
                            Daily Mission
                        </CardTitle>
                        <CardDescription>Complete this to boost your growth</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center gap-4">
                        <div className="p-4 rounded-xl bg-background/50 border border-violet-500/20 backdrop-blur-sm text-center">
                            <p className="font-bold text-lg leading-tight">{todaysMission}</p>
                        </div>

                        <div className="text-center">
                            {checkedDates.includes(today.toDateString()) ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold border border-green-500/20">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Mission Complete
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-600 rounded-full text-xs font-bold border border-violet-500/20 animate-pulse">
                                    <div className="h-2 w-2 rounded-full bg-violet-500" />
                                    In Progress
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* STREAK CALENDAR */}
                <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-background to-background overflow-hidden relative md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Flame className="w-64 h-64 text-orange-500" />
                    </div>
                    <CardHeader className="text-center pb-2">
                        <div className="flex flex-col items-center gap-2">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Flame className={`h-6 w-6 ${checkedDates.includes(today.toDateString()) ? "text-orange-500 fill-orange-500 animate-pulse" : "text-muted-foreground"}`} />
                                {currentStreak} Day Streak
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                            {/* Calendar Grid */}
                            <div className="flex-1 max-w-sm">
                                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                        <div key={d} className="text-muted-foreground font-medium text-xs py-1">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                                        <div key={`pad-${i}`} />
                                    ))}

                                    {daysInMonth.map((day) => {
                                        const dateStr = day.toDateString()
                                        const isChecked = checkedDates.includes(dateStr)
                                        const isTodayDate = isToday(day)
                                        const isFutureDate = isFuture(day)

                                        return (
                                            <button
                                                key={dateStr}
                                                disabled={isFutureDate}
                                                onClick={() => isTodayDate && toggleCheckIn()}
                                                className={cn(
                                                    "aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all relative overflow-hidden",
                                                    isTodayDate && !isChecked && "ring-2 ring-orange-500 ring-offset-2 animate-pulse bg-background",
                                                    isChecked && "bg-orange-500 text-white shadow-lg shadow-orange-500/20",
                                                    !isChecked && !isFutureDate && !isTodayDate && "bg-muted text-muted-foreground opacity-50",
                                                    isFutureDate && "opacity-20 cursor-not-allowed",
                                                    isTodayDate && !isChecked && "hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                                )}
                                            >
                                                {day.getDate()}
                                                {isChecked && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute inset-0 bg-orange-500 flex items-center justify-center"
                                                    >
                                                        <Check className="h-3 w-3 text-white" />
                                                    </motion.div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex-shrink-0 w-full md:w-auto">
                                <Button
                                    size="lg"
                                    onClick={toggleCheckIn}
                                    className={cn(
                                        "w-full md:w-48 h-16 font-bold transition-all text-wrap",
                                        checkedDates.includes(today.toDateString())
                                            ? "bg-green-500 hover:bg-green-600 text-white"
                                            : "bg-orange-500 hover:bg-orange-600 text-white animate-bounce"
                                    )}
                                >
                                    {checkedDates.includes(today.toDateString()) ? (
                                        <span className="flex flex-col items-center">
                                            <CheckCircle2 className="h-6 w-6 mb-1" />
                                            Done!
                                        </span>
                                    ) : (
                                        <span className="flex flex-col items-center">
                                            <Flame className="h-6 w-6 fill-white mb-1" />
                                            Mark Complete
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 2. PROGRESS & TIMELINE (Compact) */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Progress */}
                <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Overall Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-3xl font-bold">{progressPercentage}%</span>
                            <span className="text-sm text-muted-foreground mb-1">{completedCount} / {totalItems} Skills</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            Estimated Finish
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">If you start now:</p>
                                <p className="text-xl font-bold text-foreground mt-1">
                                    {format(projectedEndDate, "MMM d, yyyy")}
                                </p>
                            </div>
                            <CalendarIcon className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. ORIGINAL CHECKLIST (Simpler Style) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Your Action Plan
                    </CardTitle>
                    <CardDescription>
                        Step-by-step roadmap to your goal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {result.roadmap.map((phase, pIdx) => (
                            <div key={pIdx} className="relative pl-6 border-l-2 border-muted hover:border-primary/30 transition-colors">
                                {/* Phase Marker */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground/30 group-hover:border-primary transition-colors" />

                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        Phase {phase.phase}: {phase.title}
                                        <Badge variant="outline" className="text-xs font-normal ml-2">
                                            {phase.duration}
                                        </Badge>
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    {phase.skills.map((skill, sIdx) => {
                                        const id = `p${pIdx}-s${sIdx}`
                                        return (
                                            <div
                                                key={sIdx}
                                                className={`
                          flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
                          ${completedItems[id]
                                                        ? "bg-green-500/5 border-green-500/20"
                                                        : "bg-card border-border hover:border-primary/30"
                                                    }
                        `}
                                                onClick={() => toggleItem(id)}
                                            >
                                                <Checkbox
                                                    checked={!!completedItems[id]}
                                                    onCheckedChange={() => toggleItem(id)}
                                                    className={completedItems[id] ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" : ""}
                                                />
                                                <span className={`text-sm ${completedItems[id] ? "text-muted-foreground line-through decoration-green-500/50" : "font-medium"}`}>
                                                    {skill}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
