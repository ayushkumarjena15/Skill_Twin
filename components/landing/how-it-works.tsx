"use client"

import { motion } from "framer-motion"
import {
  FileText,
  Github,
  GraduationCap,
  Briefcase,
  Search,
  Route,
  CheckCircle2
} from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Curriculum Parsing",
    description: "Enter your syllabus topics and courses",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: Github,
    title: "GitHub Portfolio Scan",
    description: "Analyze your real projects and code",
    color: "text-gray-500",
    bgColor: "bg-gray-500/10"
  },
  {
    icon: GraduationCap,
    title: "CGPA Weighting",
    description: "Factor in your academic performance",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10"
  },
  {
    icon: Briefcase,
    title: "Job Market Extraction",
    description: "Scrape live job requirements",
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    icon: Search,
    title: "Gap Detection",
    description: "AI identifies missing skills",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  },
  {
    icon: Route,
    title: "Roadmap Generation",
    description: "Personalized learning path created",
    color: "text-primary",
    bgColor: "bg-primary/10"
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Animated Moving Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-2/3 h-[2px] w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{ left: `${20 + i * 20}%`, top: `${30 + (i % 2) * 40}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20 shadow-lg shadow-primary/5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">How It Works</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {"Six Steps to Your Perfect Roadmap".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="inline-block mr-3 last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground"
          >
            Our multi-agent AI system analyzes your profile from every angle
            to create the most accurate skill gap analysis.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line with animation */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 overflow-hidden">
            <motion.div
              className="w-full h-full bg-primary/40"
              initial={{ x: "-100%" }}
              whileInView={{ x: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
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
                className="relative z-0"
              >
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-medium text-white">
                    Step {index + 1}
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 rounded-xl ${step.bgColor} flex items-center justify-center mb-4 mt-2`}
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <step.icon className={`h-7 w-7 ${step.color}`} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-sm text-zinc-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Agents Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-zinc-500 mb-4">Powered by Multiple AI Agents</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900 text-sm text-white">
              🦙 Ollama
            </div>
            <div className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900 text-sm text-white">
              🤖 Groq
            </div>
            <div className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900 text-sm text-white">
              🧠 Gemini
            </div>
            <div className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900 text-sm text-white">
              🐙 GitHub API
            </div>
            <div className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900 text-sm text-white">
              💼 JSearch
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}