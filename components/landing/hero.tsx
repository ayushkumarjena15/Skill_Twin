"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"


function Counter({ value, suffix = "" }: { value: string, suffix?: string }) {
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/[^0-9]/g, ''))
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && !isNaN(target)) {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return <span ref={ref}>{isNaN(target) ? value : `${count}${suffix}`}</span>
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24">

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -5, 0], // Continuous floating animation
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.2 },
              scale: { duration: 0.5, delay: 0.2 },
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-8 shadow-lg shadow-primary/10 ring-1 ring-primary/20 hover:ring-primary/40 transition-all cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">Multi-Agent AI Powered</span>
          </motion.div>

          {/* Headline with Animated Background Lines */}
          <div className="relative">
            {/* Multiple Animated Moving Lines */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* Line 1 - Horizontal */}
              <motion.div
                className="absolute top-1/4 h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent dark:via-primary/60"
                animate={{
                  x: ["-100%", "100%"],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              {/* Line 2 - Horizontal (opposite direction) */}
              <motion.div
                className="absolute top-1/2 h-[2px] w-full bg-gradient-to-r from-transparent via-purple-600 to-transparent dark:via-purple-500/50"
                animate={{
                  x: ["100%", "-100%"],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
              />
              {/* Line 3 - Horizontal */}
              <motion.div
                className="absolute top-3/4 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/80 to-transparent dark:via-primary/40"
                animate={{
                  x: ["-100%", "100%"],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5,
                }}
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 relative"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Bridge the gap between{" "}
              </motion.span>
              <motion.span
                className="text-primary inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(139, 92, 246, 0.8)" }}
              >
                education
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                {" "}and{" "}
              </motion.span>
              <motion.span
                className="text-primary inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(139, 92, 246, 0.8)" }}
              >
                employment
              </motion.span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            SkillTwin analyzes your curriculum, GitHub portfolio, and CGPA against
            live job market demands to create your personalized bridge-course roadmap.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="text-base px-8 shadow-lg shadow-primary/20">
                <Link href="/dashboard">
                  Analyze My Skills
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="lg" className="text-base px-8 border-primary/20 hover:border-primary/50">
                <Link href="#how-it-works">
                  See How It Works
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-border/50"
          >
            {[
              { value: "4", suffix: "+", label: "AI Agents", icon: "🤖", color: "text-blue-500", bgColor: "bg-blue-500/10" },
              { value: "Live", suffix: "", label: "Job Data", icon: "📊", color: "text-green-500", bgColor: "bg-green-500/10" },
              { value: "Real", suffix: "", label: "GitHub Analysis", icon: "💻", color: "text-primary", bgColor: "bg-primary/10" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.08,
                  y: -10,
                  zIndex: 10,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="relative z-0"
              >
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg text-center transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/30 cursor-pointer">
                  {/* Icon */}
                  <motion.div
                    className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-2xl">{stat.icon}</span>
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-1`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </motion.div>

                  {/* Label */}
                  <div className="text-sm text-zinc-400">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}