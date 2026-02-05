"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BackButton } from "@/components/ui/back-button"
import { ArrowRight, Target, Lightbulb, Users, Sparkles, Rocket } from "lucide-react"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[100px] -z-10" />

                <div className="container px-4 mx-auto">
                    <div className="mb-8 pl-4 lg:pl-0">
                        <BackButton />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-medium">Our Story</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
                            Empowering the Next Generation of <span className="text-primary">Tech Talent</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                            SkillTwin is on a mission to bridge the gap between academic education and industry requirements through AI-powered personalization.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors shadow-lg shadow-primary/5"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                                <Target className="h-6 w-6 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To democratize career guidance and skill development for students worldwide. We believe every student deserves access to personalized, data-driven insights to help them achieve their career goals, regardless of their background or institution.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors shadow-lg shadow-primary/5"
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                                <Lightbulb className="h-6 w-6 text-purple-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                A world where the "permissionless apprenticeship" is the norm. We envision a future where skills matter more than degrees, and where AI acts as a personal mentor for every aspiring learner, guiding them from novice to expert.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24">
                <div className="container px-4 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4">Why We Build</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Core values that drive our product and engineering decisions.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Users,
                                title: "Student First",
                                desc: "Every feature we build starts with the question: 'How does this help the student?'"
                            },
                            {
                                icon: Rocket,
                                title: "Innovation",
                                desc: "We leverage cutting-edge AI (Ollama, Groq, Gemini) to solve age-old education problems."
                            },
                            {
                                icon: Sparkles,
                                title: "Quality",
                                desc: "We don't just aggregate content; we curate high-quality learning paths for real impact."
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6"
                            >
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                                    <value.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-muted-foreground">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team CTA */}
            <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

                <div className="container px-4 mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Built by Team Liquid</h2>
                        <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
                            We are a group of passionate developers, designers, and AI enthusiasts committed to transforming education technology.
                        </p>
                        <Button asChild size="lg" variant="secondary" className="text-primary font-semibold">
                            <Link href="/team">
                                Meet the Team
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
