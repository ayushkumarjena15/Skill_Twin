"use client"

import { motion } from "framer-motion"
import {
    Brain,
    Target,
    Rocket,
    TrendingUp,
    BookOpen,
    Zap,
    Github,
    BarChart3,
    CheckCircle2
} from "lucide-react"

const features = [
    {
        icon: Brain,
        title: "AI-Powered Analysis",
        description: "Advanced multi-agent AI system analyzes your skills using",
        services: [
            { name: "Ollama", color: "bg-slate-700" },
            { name: "Groq", color: "bg-orange-600" },
            { name: "Gemini", color: "bg-blue-600" }
        ],
        descriptionEnd: "to provide comprehensive insights.",
        gradient: "from-purple-500 to-pink-500",
        benefits: ["Semantic skill matching", "Real-time analysis", "Intelligent recommendations"],
        iconLogos: [
            { name: "Ollama", bgColor: "bg-slate-700" },
            { name: "Groq", bgColor: "bg-orange-600" },
            { name: "Gemini", bgColor: "bg-blue-600" }
        ]
    },
    {
        icon: Target,
        title: "Skill Gap Detection",
        description: "Identify exactly what skills you're missing for your dream job with precision matching against live job requirements.",
        gradient: "from-blue-500 to-cyan-500",
        benefits: ["Job market alignment", "Core vs. bonus skills", "Priority-based learning"],
        iconLogos: [
            { icon: Target, bgColor: "bg-blue-600" },
            { icon: CheckCircle2, bgColor: "bg-cyan-600" }
        ]
    },
    {
        icon: Rocket,
        title: "Personalized Roadmaps",
        description: "Get custom learning paths tailored to your current skills, goals, and timeline with curated resources.",
        gradient: "from-orange-500 to-red-500",
        benefits: ["Phase-wise learning", "Resource recommendations", "Milestone tracking"],
        iconLogos: [
            { icon: Rocket, bgColor: "bg-orange-600" },
            { icon: BookOpen, bgColor: "bg-red-600" }
        ]
    },
    {
        icon: Github,
        title: "GitHub Integration",
        description: "Automatically analyze your",
        services: [
            { name: "GitHub", color: "bg-gray-800", icon: Github }
        ],
        descriptionEnd: "portfolio to assess practical coding skills and project experience.",
        gradient: "from-green-500 to-emerald-500",
        benefits: ["Repository analysis", "Language proficiency", "Contribution insights"],
        iconLogos: [
            { name: "GitHub", icon: Github, bgColor: "bg-gray-800" }
        ]
    },
    {
        icon: TrendingUp,
        title: "Live Job Matching",
        description: "Real-time job listings from",
        services: [
            { name: "LinkedIn", color: "bg-blue-700" },
            { name: "Indeed", color: "bg-blue-500" },
            { name: "Glassdoor", color: "bg-green-600" }
        ],
        descriptionEnd: "with match percentages based on your skills.",
        gradient: "from-indigo-500 to-purple-500",
        benefits: ["Smart job matching", "Salary insights", "Direct application links"],
        iconLogos: [
            { name: "Li", bgColor: "bg-blue-700", textColor: "text-white" },
            { name: "In", bgColor: "bg-blue-500", textColor: "text-white" },
            { name: "Gd", bgColor: "bg-green-600", textColor: "text-white" }
        ]
    },
    {
        icon: BarChart3,
        title: "Progress Tracking",
        description: "Monitor your skill development journey with detailed analytics and employability scores over time.",
        gradient: "from-pink-500 to-rose-500",
        benefits: ["Skill evolution", "Employability metrics", "Achievement milestones"],
        iconLogos: [
            { icon: BarChart3, bgColor: "bg-pink-600" },
            { icon: TrendingUp, bgColor: "bg-rose-600" }
        ]
    }
]

export function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">

                        <span className="text-sm font-medium">Powerful Features</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                        Everything You Need to <span className="text-primary">Succeed</span>
                    </h2>

                    <p className="text-lg text-muted-foreground">
                        Our comprehensive platform combines cutting-edge AI technology with real-world job market data
                        to accelerate your career growth.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="h-full p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                                {/* Icon */}
                                <div className="relative mb-6">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5`}>
                                        <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                                            {feature.iconLogos ? (
                                                <div className="flex flex-wrap items-center justify-center gap-0.5 p-1">
                                                    {feature.iconLogos.map((logo, i) => (
                                                        ('icon' in logo && logo.icon) ? (
                                                            <div key={i} className={`${logo.bgColor} rounded p-1`}>
                                                                <logo.icon className="h-3 w-3 text-white" />
                                                            </div>
                                                        ) : ('name' in logo) ? (
                                                            <div
                                                                key={i}
                                                                className={`${logo.bgColor} ${('textColor' in logo && logo.textColor) || 'text-white'} rounded px-1 text-[8px] font-bold`}
                                                            >
                                                                {logo.name}
                                                            </div>
                                                        ) : null
                                                    ))}
                                                </div>
                                            ) : (
                                                <feature.icon className={`h-7 w-7 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Glow Effect on Hover */}
                                    <div className={`absolute inset-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>

                                {/* Description with Service Badges */}
                                <div className="text-muted-foreground mb-4 leading-relaxed">
                                    <span>{feature.description} </span>
                                    {feature.services && (
                                        <span className="inline-flex flex-wrap items-center gap-1.5 my-1">
                                            {feature.services.map((service, i) => (
                                                <span
                                                    key={service.name}
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${service.color} text-white text-xs font-semibold`}
                                                >
                                                    {('icon' in service && service.icon) && <service.icon className="h-3 w-3" />}
                                                    {service.name}
                                                </span>
                                            ))}
                                        </span>
                                    )}
                                    {feature.descriptionEnd && <span>{feature.descriptionEnd}</span>}
                                </div>

                                {/* Benefits List */}
                                <ul className="space-y-2">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Hover Border Effect */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
                            </div>
                        </motion.div>
                    ))}
                </div>


            </div>
        </section>
    )
}
