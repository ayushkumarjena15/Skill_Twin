"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Book, Code, FileText, Shield, Layers, Search, Terminal, Database, Server, GitBranch, Cpu, Globe, Rocket, Zap, Github, Brain, Target, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"

export default function DocumentationPage() {
    const sections = [
        {
            id: "introduction",
            title: "Introduction",
            icon: Book,
            content: (
                <div className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                        SkillTwin is an AI-powered skill gap analyzer designed to bridge the gap between academic curriculum and industry demands.
                    </p>
                    <div className="bg-card border border-border/50 rounded-xl p-6">
                        <p className="text-muted-foreground mb-4">
                            Students often graduate with skills that don't perfectly align with the current job market. SkillTwin solves this by analyzing three key data points:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                <h4 className="font-semibold mb-1 flex items-center gap-2 text-primary">
                                    <FileText className="h-4 w-4" />
                                    Academic Syllabus
                                </h4>
                                <p className="text-xs text-muted-foreground">What universities teach.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                <h4 className="font-semibold mb-1 flex items-center gap-2 text-primary">
                                    <Code className="h-4 w-4" />
                                    Practical Experience
                                </h4>
                                <p className="text-xs text-muted-foreground">What students built (GitHub/Projects).</p>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                <h4 className="font-semibold mb-1 flex items-center gap-2 text-primary">
                                    <Globe className="h-4 w-4" />
                                    Market Demand
                                </h4>
                                <p className="text-xs text-muted-foreground">What companies actually want (Live Job Data).</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "architecture",
            title: "System Architecture",
            icon: Layers,
            content: (
                <div className="space-y-8">
                    <p className="text-muted-foreground">
                        SkillTwin employs a sophisticated Multi-Agent Architecture to ensure accurate analysis and recommendations.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50">
                            <div className="bg-muted/50 px-4 py-3 border-b border-border/50 font-medium flex items-center gap-2">
                                <Brain className="h-4 w-4 text-purple-500" />
                                AI Core
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                                    <div>
                                        <h5 className="font-medium text-sm">Groq (Llama 3)</h5>
                                        <p className="text-sm text-muted-foreground">High-speed job market extraction and parsing.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                                    <div>
                                        <h5 className="font-medium text-sm">Gemini Pro</h5>
                                        <p className="text-sm text-muted-foreground">Multimodal analysis and reasoning.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                                    <div>
                                        <h5 className="font-medium text-sm">Ollama</h5>
                                        <p className="text-sm text-muted-foreground">Local fallback and privacy-focused processing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50">
                            <div className="bg-muted/50 px-4 py-3 border-b border-border/50 font-medium flex items-center gap-2">
                                <Server className="h-4 w-4 text-green-500" />
                                Infrastructure
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2" />
                                    <div>
                                        <h5 className="font-medium text-sm">Next.js 15</h5>
                                        <p className="text-sm text-muted-foreground">App Router, Server Actions.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                    <div>
                                        <h5 className="font-medium text-sm">Supabase</h5>
                                        <p className="text-sm text-muted-foreground">PostgreSQL, Auth, Realtime.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2" />
                                    <div>
                                        <h5 className="font-medium text-sm">Resend</h5>
                                        <p className="text-sm text-muted-foreground">Transactional emails.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "features",
            title: "Key Features",
            icon: Zap,
            content: (
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl border border-border/50 bg-card hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <h4 className="font-semibold mb-2">Smart Resume Parsing</h4>
                        <p className="text-sm text-muted-foreground">Extracts skills, projects, and structured data from PDFs using custom parsers.</p>
                    </div>

                    <div className="p-5 rounded-xl border border-border/50 bg-card hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center mb-3">
                            <Github className="h-5 w-5 text-slate-500" />
                        </div>
                        <h4 className="font-semibold mb-2">GitHub Portfolio Scan</h4>
                        <p className="text-sm text-muted-foreground">Analyzes repositories, languages, and commit history to gauge practical expertise.</p>
                    </div>

                    <div className="p-5 rounded-xl border border-border/50 bg-card hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                            <Globe className="h-5 w-5 text-green-500" />
                        </div>
                        <h4 className="font-semibold mb-2">Live Market Analysis</h4>
                        <p className="text-sm text-muted-foreground">Scrapes real-time job postings to identify trending skills for specific roles.</p>
                    </div>

                    <div className="p-5 rounded-xl border border-border/50 bg-card hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                            <Rocket className="h-5 w-5 text-purple-500" />
                        </div>
                        <h4 className="font-semibold mb-2">Roadmap Generation</h4>
                        <p className="text-sm text-muted-foreground">Creates personalized learning paths integrated with roadmap.sh.</p>
                    </div>
                </div>
            )
        },
        {
            id: "setup",
            title: "Developer Setup",
            icon: Terminal,
            content: (
                <div className="space-y-6">
                    <p className="text-muted-foreground">
                        Follow these steps to set up SkillTwin locally.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">1</div>
                                Clone & Install
                            </h4>
                            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 font-mono text-sm overflow-x-auto">
                                <pre className="text-zinc-300">
                                    {`git clone https://github.com/yourusername/skilltwin.git
cd skilltwin
npm install`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">2</div>
                                Configure Environment
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">Create a <code className="bg-muted px-1 py-0.5 rounded text-xs">.env.local</code> file in the root directory:</p>
                            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 font-mono text-sm overflow-x-auto">
                                <pre className="text-zinc-300">
                                    {`# AI Services
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...
OLLAMA_HOST=http://localhost:11434

# Database & Auth
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Integration
RESEND_API_KEY=re_...`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">3</div>
                                Run Development Server
                            </h4>
                            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 font-mono text-sm overflow-x-auto">
                                <pre className="text-zinc-300">
                                    {`npm run dev`}
                                </pre>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">Open http://localhost:3000 to view the application.</p>
                        </div>
                    </div>
                </div>
            )
        }
    ]

    return (
        <div className="min-h-screen bg-background relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Header */}
            <div className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <BackButton />
                            <div className="h-6 w-[1px] bg-border" />
                            <div className="flex items-center gap-2">
                                <Book className="h-5 w-5 text-primary" />
                                <span className="font-semibold">SkillTwin Docs</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search docs..."
                                    className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <GitBranch className="h-3.5 w-3.5" />
                                v1.0.2
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-[240px_1fr] gap-10">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-4">
                        <nav className="space-y-8">
                            <div>
                                <h5 className="mb-3 font-semibold text-xs text-primary/80 uppercase tracking-widest">Overview</h5>
                                <ul className="space-y-1">
                                    <li>
                                        <a href="#introduction" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-md bg-secondary/50 font-medium">
                                            Introduction
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#features" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 rounded-md transition-colors">
                                            Key Features
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="mb-3 font-semibold text-xs text-primary/80 uppercase tracking-widest">Technical</h5>
                                <ul className="space-y-1">
                                    <li>
                                        <a href="#architecture" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 rounded-md transition-colors">
                                            System Architecture
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#setup" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 rounded-md transition-colors">
                                            Developer Setup
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="space-y-16 pb-24">
                        <div className="space-y-4 border-b border-border/50 pb-8">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Documentation</h1>
                            <p className="text-xl text-muted-foreground max-w-2xl">Comprehensive guide to SkillTwin's architecture, features, and setup.</p>
                        </div>

                        {sections.map((section) => (
                            <section key={section.id} id={section.id} className="scroll-mt-24 space-y-6">
                                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <section.icon className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold">{section.title}</h2>
                                </div>
                                <div className="pl-0 lg:pl-1">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                    </main>
                </div>
            </div>
        </div>
    )
}

