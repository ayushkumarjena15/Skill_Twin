"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import {
    Code2,
    Server,
    Layers,
    Cloud,
    Shield,
    BarChart3,
    Brain,
    Database,
    Smartphone,
    Cpu,
    Lock,
    Palette,
    FileText,
    Gamepad2,
    Users,
    Target,
    Blocks,
    LineChart,
    Settings,
    Workflow
} from "lucide-react"
import Link from "next/link"
import { PlatformRoadmap } from "@/components/landing/platform-roadmap"
import { BackButton } from "@/components/ui/back-button"

const roadmaps = [
    {
        title: "Frontend",
        description: "Master modern web development with React, Vue, and cutting-edge frontend technologies",
        icon: Code2,
        color: "from-blue-500 to-cyan-500",
        skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Next.js"],
        href: "https://roadmap.sh/frontend"
    },
    {
        title: "Backend",
        description: "Build robust server-side applications with Node.js, Python, and database management",
        icon: Server,
        color: "from-green-500 to-emerald-500",
        skills: ["Node.js", "Python", "APIs", "Databases", "Authentication", "Security"],
        href: "https://roadmap.sh/backend"
    },
    {
        title: "Full Stack",
        description: "Combine frontend and backend expertise to build complete web applications",
        icon: Layers,
        color: "from-purple-500 to-pink-500",
        skills: ["React", "Node.js", "Databases", "DevOps", "Testing", "Deployment"],
        href: "https://roadmap.sh/full-stack"
    },
    {
        title: "DevOps",
        description: "Automate infrastructure, CI/CD pipelines, and cloud deployments",
        icon: Cloud,
        color: "from-orange-500 to-red-500",
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Monitoring", "Terraform"],
        href: "https://roadmap.sh/devops"
    },
    {
        title: "DevSecOps",
        description: "Integrate security practices into DevOps workflows and automation",
        icon: Shield,
        color: "from-red-500 to-rose-500",
        skills: ["Security", "Docker", "Kubernetes", "Compliance", "Scanning", "Monitoring"],
        href: "https://roadmap.sh/devsecops"
    },
    {
        title: "Data Analyst",
        description: "Transform raw data into actionable insights using analytics and visualization",
        icon: BarChart3,
        color: "from-teal-500 to-cyan-500",
        skills: ["SQL", "Python", "Excel", "Tableau", "Statistics", "Data Viz"],
        href: "https://roadmap.sh/data-analyst"
    },
    {
        title: "AI Engineer",
        description: "Design and deploy AI systems, models, and intelligent applications",
        icon: Brain,
        color: "from-violet-500 to-purple-500",
        skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "MLOps"],
        href: "https://roadmap.sh/ai-engineer"
    },
    {
        title: "AI and Data Scientist",
        description: "Apply machine learning and statistical methods to solve complex problems",
        icon: Brain,
        color: "from-indigo-500 to-blue-500",
        skills: ["Python", "Statistics", "ML", "Deep Learning", "R", "Data Mining"],
        href: "https://roadmap.sh/ai-data-scientist"
    },
    {
        title: "Data Engineer",
        description: "Build and maintain data pipelines, warehouses, and ETL processes",
        icon: Database,
        color: "from-cyan-500 to-blue-500",
        skills: ["SQL", "Python", "Spark", "Airflow", "ETL", "Data Warehousing"],
        href: "https://roadmap.sh/data-engineer"
    },
    {
        title: "Android",
        description: "Create native Android applications with Kotlin and modern Android SDK",
        icon: Smartphone,
        color: "from-green-500 to-lime-500",
        skills: ["Kotlin", "Java", "Android SDK", "Jetpack Compose", "Material Design", "Firebase"],
        href: "https://roadmap.sh/android"
    },
    {
        title: "Machine Learning",
        description: "Build predictive models and intelligent systems using ML algorithms",
        icon: Cpu,
        color: "from-pink-500 to-rose-500",
        skills: ["Python", "Scikit-learn", "TensorFlow", "Neural Networks", "Statistics", "Algorithms"],
        href: "https://roadmap.sh/machine-learning"
    },
    {
        title: "PostgreSQL",
        description: "Master PostgreSQL database administration, optimization, and management",
        icon: Database,
        color: "from-blue-600 to-indigo-600",
        skills: ["SQL", "PostgreSQL", "Performance Tuning", "Backup", "Replication", "Security"],
        href: "https://roadmap.sh/postgresql-dba"
    },
    {
        title: "iOS",
        description: "Develop native iOS applications with Swift and SwiftUI",
        icon: Smartphone,
        color: "from-gray-600 to-gray-800",
        skills: ["Swift", "SwiftUI", "UIKit", "Xcode", "iOS SDK", "App Store"],
        href: "https://roadmap.sh/ios"
    },
    {
        title: "Blockchain",
        description: "Build decentralized applications and smart contracts on blockchain",
        icon: Blocks,
        color: "from-yellow-500 to-orange-500",
        skills: ["Solidity", "Ethereum", "Web3", "Smart Contracts", "DeFi", "NFTs"],
        href: "https://roadmap.sh/blockchain"
    },
    {
        title: "QA",
        description: "Ensure software quality through testing, automation, and quality assurance",
        icon: Target,
        color: "from-emerald-500 to-teal-500",
        skills: ["Testing", "Selenium", "Automation", "CI/CD", "Test Plans", "Bug Tracking"],
        href: "https://roadmap.sh/qa"
    },
    {
        title: "Software Architect",
        description: "Design scalable system architectures and technical solutions",
        icon: Workflow,
        color: "from-purple-600 to-indigo-600",
        skills: ["System Design", "Patterns", "Microservices", "Cloud", "Security", "Scalability"],
        href: "https://roadmap.sh/software-architect"
    },
    {
        title: "Cyber Security",
        description: "Protect systems and networks from cyber threats and vulnerabilities",
        icon: Lock,
        color: "from-red-600 to-pink-600",
        skills: ["Network Security", "Penetration Testing", "Cryptography", "Compliance", "SIEM", "Forensics"],
        href: "https://roadmap.sh/cyber-security"
    },
    {
        title: "UX Design",
        description: "Create intuitive and delightful user experiences through research and design",
        icon: Palette,
        color: "from-pink-500 to-purple-500",
        skills: ["User Research", "Wireframing", "Prototyping", "Figma", "Usability", "Design Systems"],
        href: "https://roadmap.sh/ux-design"
    },
    {
        title: "Technical Writer",
        description: "Create clear documentation, guides, and technical content",
        icon: FileText,
        color: "from-slate-500 to-gray-600",
        skills: ["Documentation", "API Docs", "Markdown", "Git", "Technical Writing", "Communication"],
        href: "https://roadmap.sh/technical-writer"
    },
    {
        title: "Game Developer",
        description: "Build engaging games with Unity, Unreal Engine, and game design principles",
        icon: Gamepad2,
        color: "from-violet-600 to-purple-600",
        skills: ["Unity", "C#", "Game Design", "3D Graphics", "Physics", "Animation"],
        href: "https://roadmap.sh/game-developer"
    },
    {
        title: "Server Side Game Developer",
        description: "Build multiplayer game servers, matchmaking, and backend systems",
        icon: Server,
        color: "from-indigo-600 to-blue-600",
        skills: ["Node.js", "WebSockets", "Networking", "Databases", "Scalability", "Real-time"],
        href: "https://roadmap.sh/server-side-game-developer"
    },
    {
        title: "MLOps",
        description: "Deploy, monitor, and maintain machine learning models in production",
        icon: Settings,
        color: "from-cyan-600 to-teal-600",
        skills: ["ML Deployment", "Docker", "Kubernetes", "Monitoring", "CI/CD", "Model Versioning"],
        href: "https://roadmap.sh/mlops"
    },
    {
        title: "Product Manager",
        description: "Lead product strategy, roadmap, and cross-functional team collaboration",
        icon: Users,
        color: "from-amber-500 to-orange-500",
        skills: ["Product Strategy", "Roadmapping", "Analytics", "User Research", "Agile", "Communication"],
        href: "https://roadmap.sh/product-manager"
    },
    {
        title: "Engineering Manager",
        description: "Lead engineering teams, manage projects, and drive technical excellence",
        icon: Users,
        color: "from-blue-500 to-indigo-500",
        skills: ["Leadership", "Team Management", "Agile", "Hiring", "Performance", "Strategy"],
        href: "https://roadmap.sh/engineering-manager"
    },
    {
        title: "Developer Relations",
        description: "Bridge the gap between developers and products through advocacy and community",
        icon: Users,
        color: "from-green-600 to-emerald-600",
        skills: ["Community", "Content Creation", "Public Speaking", "Technical Writing", "Networking", "Advocacy"],
        href: "https://roadmap.sh/devrel"
    },
    {
        title: "BI Analyst",
        description: "Transform business data into insights using BI tools and analytics",
        icon: LineChart,
        color: "from-purple-500 to-violet-500",
        skills: ["SQL", "Power BI", "Tableau", "Data Modeling", "ETL", "Business Intelligence"],
        href: "https://roadmap.sh/bi-analyst"
    }
]

export default function RoadmapPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white relative overflow-hidden pt-20">
                {/* Back Button */}
                <div className="absolute top-24 left-4 z-50 md:left-8">
                    <BackButton variant="secondary" className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:bg-zinc-800 transition-colors" />
                </div>
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                    {/* Animated Moving Lines */}
                    <motion.div
                        className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute top-2/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Floating Particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-primary/30 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-20 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block mb-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                <div className="relative bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-full px-6 py-2">
                                    <span className="text-primary font-semibold">Career Roadmaps</span>
                                </div>
                            </div>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-purple-500 bg-clip-text text-transparent">
                            Choose Your Path
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                            Explore comprehensive learning roadmaps for 26+ tech careers. Each roadmap provides a structured path to master the skills you need.
                        </p>
                    </motion.div>

                    {/* Roadmap Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roadmaps.map((roadmap, index) => (
                            <motion.a
                                key={roadmap.title}
                                href={roadmap.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${roadmap.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                {/* Icon */}
                                <div className="relative mb-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${roadmap.color} p-3 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <roadmap.icon className="w-full h-full text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative">
                                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
                                        {roadmap.title}
                                    </h3>
                                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                                        {roadmap.description}
                                    </p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2">
                                        {roadmap.skills.slice(0, 4).map((skill) => (
                                            <span
                                                key={skill}
                                                className="text-xs px-2 py-1 rounded-md bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 group-hover:border-primary/30 group-hover:text-primary/80 transition-colors"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {roadmap.skills.length > 4 && (
                                            <span className="text-xs px-2 py-1 rounded-md bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
                                                +{roadmap.skills.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow Icon */}
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                    <svg
                                        className="w-6 h-6 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {/* Platform Roadmap Section */}
                    <div className="mt-32">
                        <PlatformRoadmap />
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-20 text-center"
                    >
                        <div className="inline-block bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
                            <p className="text-zinc-400 mb-6 max-w-2xl">
                                Upload your resume to SkillTwin and get personalized recommendations based on your current skills and career goals.
                            </p>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                            >
                                Get Started
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    )
}
