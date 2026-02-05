"use client"

import { motion } from "framer-motion"

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function ScoreRing({ score, size = 120, strokeWidth = 8 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-500"
    if (s >= 60) return "text-blue-500"
    if (s >= 40) return "text-amber-500"
    return "text-rose-500"
  }

  const colorClass = getColor(score)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        {/* Progress Circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      {/* Text in Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-3xl font-bold ${colorClass}`}
        >
          {score}%
        </motion.span>
      </div>
    </div>
  )
}