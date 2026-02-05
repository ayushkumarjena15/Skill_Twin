"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextShimmerProps {
  text: string
  className?: string
  duration?: number
}

export function TextShimmer({ 
  text, 
  className,
  duration = 2 
}: TextShimmerProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <span className="relative">
          <span className="text-muted-foreground">{text}</span>
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </span>
      </motion.div>
    </div>
  )
}