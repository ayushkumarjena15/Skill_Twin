"use client"

import { motion } from "framer-motion"

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function ScoreRing({ score, size = 160, strokeWidth = 8 }: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-400"
    if (s >= 60) return "text-indigo-400"
    if (s >= 40) return "text-amber-400"
    return "text-rose-400"
  }

  const glowColor = (s: number) => {
    if (s >= 80) return "drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]"
    if (s >= 60) return "drop-shadow-[0_0_15px_rgba(129,140,248,0.6)]"
    if (s >= 40) return "drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
    return "drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]"
  }

  const colorClass = getColor(score)
  const glowClass = glowColor(score)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>

      {/* Container for SVG */}
      <svg className="w-full h-full absolute inset-0 text-white">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Outer Rotating Dashed Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"
      >
        <svg className="w-full h-full overflow-visible">
          <circle
            cx="50%"
            cy="50%"
            r={radius + 15}
            stroke="currentColor"
            strokeWidth="1"
            fill="transparent"
            strokeDasharray="4 6"
            className="text-white"
          />
        </svg>
      </motion.div>

      {/* Inner Rotating Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30"
      >
        <svg className="w-full h-full overflow-visible">
          <circle
            cx="50%"
            cy="50%"
            r={radius - 20}
            stroke="currentColor"
            strokeWidth="1"
            fill="transparent"
            strokeDasharray="20 40"
            className={colorClass}
          />
        </svg>
      </motion.div>

      {/* Main Progress Ring */}
      <svg className="transform -rotate-90 w-full h-full overflow-visible relative z-10">
        {/* Background Track */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        {/* Animated value Ring */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className={`${colorClass} ${glowClass}`}
        />
      </svg>

      {/* Center Text with Glow */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center"
        >
          <span className={`text-5xl font-mono font-bold tracking-tighter text-foreground ${glowClass}`}>
            {score}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono tracking-widest mt-1 uppercase">Score</span>
        </motion.div>
      </div>
    </div>
  )
}