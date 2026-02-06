"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

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

import { AlertTriangle, GraduationCap, Briefcase, TrendingDown } from "lucide-react"

const problems = [
  {
    icon: GraduationCap,
    title: "Outdated Curriculum",
    description: "University syllabus lags 3-5 years behind industry trends"
  },
  {
    icon: TrendingDown,
    title: "Low Employability",
    description: "High grades but missing real-world skills employers need"
  },
  {
    icon: Briefcase,
    title: "Skill Mismatch",
    description: "70% of graduates lack job-ready technical skills"
  }
]

export function Problem() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--destructive)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--destructive)/0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Animated Moving Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 h-[2px] w-full bg-gradient-to-r from-transparent via-destructive/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-3/4 h-[2px] w-full bg-gradient-to-r from-transparent via-destructive/30 to-transparent"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
        />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-6">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">The Problem</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            The "Degree Factory" Syndrome
          </h2>

          <p className="text-lg text-muted-foreground">
            Students graduate with impressive grades but struggle to land jobs.
            The gap between what universities teach and what industry needs is widening every year.
          </p>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.08,
                y: -10,
                zIndex: 10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative group z-0"
            >
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900 h-full transition-all duration-300 hover:border-destructive/50 hover:shadow-2xl hover:shadow-destructive/20 cursor-pointer">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center mb-6"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <problem.icon className="h-6 w-6 text-destructive" />
                </motion.div>

                <h3 className="text-xl font-semibold mb-3 text-white">{problem.title}</h3>
                <p className="text-zinc-400">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900 max-w-4xl mx-auto"
        >
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { value: "47", suffix: "%", label: "Graduates are unemployable in their field" },
              { value: "3", suffix: "-5 yrs", label: "Average curriculum lag behind industry" },
              { value: "80", suffix: "%", label: "Companies report skill gap issues" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <div className="text-4xl font-bold text-destructive mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}