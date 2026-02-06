"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Brain, Cpu, Database, Globe, Network, Bot, Zap, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"

export default function AiAgentsPage() {
    const agents = [
        {
            id: "mistral",
            name: "Mistral 7B / Groq",
            type: "Inference Engine",
            role: "High-Speed Processing",
            icon: Zap,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
            description: "Serves as the rapid-response engine for real-time interactions. We use Groq's LPU (Language Processing Unit) infrastructure to run Mistral models at lightning speeds (~500 tokens/s), ensuring zero latency when generating initial insights and UI feedback."
        },
        {
            id: "gemini",
            name: "Google Gemini Pro",
            type: "Reasoning Model",
            role: "Complex Analysis & Roadmap Generation",
            icon: Brain,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            description: "The core brain of SkillTwin. Gemini Pro handles the heavy lifting of curriculum parsing, skill gap analysis, and constructing detailed, step-by-step learning roadmaps. Its superior reasoning capabilities allow it to understand context and nuance in resume data."
        },
        {
            id: "ollama",
            name: "Ollama (Local LLM)",
            type: "Local Model",
            role: "Privacy & Data Filtering",
            icon: Bot,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            description: "Runs specialized quantized models for specific sub-tasks where data privacy is paramount. It acts as a pre-processing layer to sanitize inputs before they reach cloud models, ensuring sensitive personal information is handled securely."
        },
        {
            id: "github",
            name: "GitHub Agent",
            type: "API Integrator",
            role: "Codebase Analysis",
            icon: Database,
            color: "text-slate-500",
            bgColor: "bg-slate-500/10",
            description: "A specialized agent that interfaces with the GitHub GraphQL API. It doesn't just count commits; it analyzes language distribution, repository structure, and code complexity to validate the 'Real Skills' claimed in user profiles."
        },
        {
            id: "jsearch",
            name: "JSearch / LinkedIn",
            type: "Search & Aggregator",
            role: "Live Market Data",
            icon: Search,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            description: "Connects SkillTwin to the real world. This agent continuously scrapes and aggregates live job postings from LinkedIn, Indeed, and Glassdoor. It feeds real-time market requirements back into the analysis engine to ensure roadmaps are relevant."
        }
    ]

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -z-10" />

            {/* Header */}
            <div className="border-b border-white/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <BackButton />
                        <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-lg">SkillTwin Intelligence</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20"
                    >
                        <Network className="h-4 w-4" />
                        <span className="text-sm font-medium">Multi-Agent Architecture</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary/80 to-purple-400 bg-clip-text text-transparent"
                    >
                        The Brains Behind the Build
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground"
                    >
                        SkillTwin isn't just a chatbot. It's a coordinated system of specialized AI agents,
                        each optimized for a specific cognitive task, working in harmony to craft your career path.
                    </motion.p>
                </div>

                {/* Agents Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {agents.map((agent, index) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative h-full bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">

                                {/* Agent Header */}
                                <div className="flex gap-4 items-start mb-6">
                                    <div className={`w-12 h-12 rounded-xl ${agent.bgColor} flex items-center justify-center`}>
                                        <agent.icon className={`h-6 w-6 ${agent.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{agent.name}</h3>
                                        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground border border-white/10 px-2 py-0.5 rounded-full">
                                            {agent.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Role Description */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-primary mb-1">Primary Role</h4>
                                        <p className="font-medium">{agent.role}</p>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {agent.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-4 right-4 text-xs font-mono text-white/10 group-hover:text-white/20 transition-colors">
                                    ID: {agent.id.toUpperCase()}_v1.0
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Architecture Diagram / CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-white/10 text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Experience the Synergy</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            See how these agents work together to transform your raw data into a concrete action plan.
                        </p>
                    </div>

                    {/* Background Beams */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[500px] bg-primary/5 blur-3xl rounded-full animate-pulse" />
                </motion.div>
            </main>
        </div>
    )
}
