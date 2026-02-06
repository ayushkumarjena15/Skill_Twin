"use client"

import { useState, useEffect } from "react"
import { Flame } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function StreakCounter() {
    const [streak, setStreak] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [justIncreased, setJustIncreased] = useState(false)

    useEffect(() => {
        // 1. Check/Update Streak on Mount (Login Streak Logic)
        checkAndUpdateStreak()

        // 2. Listen for manually triggered updates (e.g. completing a mission)
        window.addEventListener("skilltwin-streak-update", loadStreakOnly)

        return () => {
            window.removeEventListener("skilltwin-streak-update", loadStreakOnly)
        }
    }, [])

    const loadStreakOnly = () => {
        try {
            const stored = localStorage.getItem("skilltwin_streak")
            if (stored) {
                const data = JSON.parse(stored)
                const count = data.currentStreak || data.count || 0
                setStreak(count)

                // Trigger animation for visual feedback
                setJustIncreased(true)
                setIsAnimating(true)
                setTimeout(() => setJustIncreased(false), 2000)
            }
        } catch (e) {
            console.error("Failed to load streak", e)
        }
    }

    const checkAndUpdateStreak = () => {
        const today = new Date().toDateString()
        const stored = localStorage.getItem("skilltwin_streak")

        // Default to a fresh state
        let data = { currentStreak: 0, lastDate: "" }

        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                // Normalize data structure handling old formats
                data.currentStreak = parsed.currentStreak || parsed.count || 0
                data.lastDate = parsed.lastDate || ""
            } catch (e) {
                console.error("Streak data corrupted, resetting")
            }
        }

        // If already counted for today, just load it
        if (data.lastDate === today) {
            setStreak(data.currentStreak)
            return
        }

        // --- New Day Logic ---
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()

        if (data.lastDate === yesterdayStr) {
            // Consecutive day! Increment
            data.currentStreak += 1
            triggerAnimation()
        } else if (data.lastDate === "") {
            // First time ever
            data.currentStreak = 1
            triggerAnimation()
        } else {
            // Broken streak (missed a day or more)
            // Reset to 1 (since they are here today)
            data.currentStreak = 1
            triggerAnimation()
        }

        // Save updated streak
        data.lastDate = today
        localStorage.setItem("skilltwin_streak", JSON.stringify(data))
        setStreak(data.currentStreak)

        // Also sync with other components (like ProgressTracker)
        window.dispatchEvent(new Event("skilltwin-streak-update"))
    }

    const triggerAnimation = () => {
        setJustIncreased(true)
        setIsAnimating(true)
        setTimeout(() => setJustIncreased(false), 2000)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 cursor-help select-none pt-2 hover:bg-orange-500/20 transition-colors">
                        <div className="relative">
                            <Flame
                                className={`h-5 w-5 ${streak > 0 ? "text-orange-500 fill-orange-500" : "text-muted-foreground"}`}
                            />
                            <AnimatePresence>
                                {justIncreased && (
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0, y: 0 }}
                                        animate={{ scale: 1.5, opacity: 0, y: -20 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 text-orange-500"
                                    >
                                        <Flame className="h-5 w-5 fill-orange-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col h-[20px] justify-center overflow-hidden">
                            <motion.span
                                key={streak}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="font-bold text-sm text-orange-600 dark:text-orange-400 leading-none"
                            >
                                {streak}
                            </motion.span>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent align="end">
                    <p className="font-semibold">Daily Streak</p>
                    <p className="text-xs text-muted-foreground">Log in daily to keep your streak alive!</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
