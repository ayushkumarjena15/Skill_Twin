"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { SuggestionsDialog } from "@/components/suggestions-dialog"
import { Shield, Lock, Eye, Database, UserCheck, FileText, AlertCircle } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

const privacyPolicies = [
    {
        icon: Database,
        title: "Data Collection",
        description: "We collect minimal data necessary to provide our services:",
        points: [
            "Account information (name, email) when you sign up",
            "Resume/CV data you upload for skill analysis",
            "GitHub username (optional) for portfolio analysis",
            "Analysis results and learning roadmaps generated for you",
            "Usage analytics to improve our platform"
        ]
    },
    {
        icon: Lock,
        title: "Data Security",
        description: "Your data is protected with industry-standard security measures:",
        points: [
            "All data transmitted using HTTPS encryption",
            "Passwords hashed using bcrypt algorithm",
            "Secure database hosted on Supabase with row-level security",
            "Regular security audits and updates",
            "No third-party access to your personal data"
        ]
    },
    {
        icon: Eye,
        title: "Data Usage",
        description: "We use your data solely to provide and improve our services:",
        points: [
            "Analyze your skills against job market requirements",
            "Generate personalized learning roadmaps",
            "Match you with relevant job opportunities",
            "Improve our AI models and algorithms",
            "Send important service updates (you can opt-out)"
        ]
    },
    {
        icon: UserCheck,
        title: "Your Rights",
        description: "You have full control over your data:",
        points: [
            "Access your data at any time through your profile",
            "Download all your analysis history and results",
            "Delete your account and all associated data permanently",
            "Opt-out of analytics and marketing communications",
            "Request data correction or updates"
        ]
    },
    {
        icon: FileText,
        title: "Data Retention",
        description: "We retain your data only as long as necessary:",
        points: [
            "Active accounts: Data retained while account is active",
            "Deleted accounts: All data permanently deleted within 30 days",
            "Analysis results: Stored until you delete them or your account",
            "Anonymous analytics: Retained for service improvement",
            "Legal compliance: Some data may be retained as required by law"
        ]
    },
    {
        icon: AlertCircle,
        title: "Third-Party Services",
        description: "We use trusted third-party services with strong privacy commitments:",
        points: [
            "Supabase: Database and authentication (GDPR compliant)",
            "Google OAuth: Optional login method (Google Privacy Policy applies)",
            "GitHub API: Public repository data only (no private data access)",
            "Resend: Email delivery service (GDPR compliant)",
            "No data sold or shared with advertisers"
        ]
    }
]

export default function PrivacyPage() {
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)

    return (
        <>
            <main className="min-h-screen bg-background">
                <Navbar />

                {/* Hero Section */}
                <section className="pt-32 pb-16 relative overflow-hidden">
                    {/* Background Gradient */}
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
                                <Shield className="h-4 w-4" />
                                <span className="text-sm font-medium">Privacy Policy</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
                                Your Privacy is <span className="text-primary">Our Priority</span>
                            </h1>

                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                                We believe in transparency. Here's exactly how we collect, use, and protect your data.
                            </p>

                            <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50 max-w-2xl mx-auto">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Privacy Policies */}
                <section className="py-16">
                    <div className="container px-4 mx-auto max-w-6xl">
                        <div className="space-y-8">
                            {privacyPolicies.map((policy, index) => (
                                <motion.div
                                    key={policy.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors shadow-lg shadow-primary/5"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <policy.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold mb-3">{policy.title}</h2>
                                            <p className="text-muted-foreground mb-4">{policy.description}</p>
                                            <ul className="space-y-2">
                                                {policy.points.map((point, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                        <span className="text-muted-foreground">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-16 p-8 rounded-2xl bg-primary/10 border border-primary/20 text-center"
                        >
                            <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
                            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                If you have any questions about our privacy practices or want to exercise your data rights, we're here to help.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => setIsSuggestionsOpen(true)}
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    Contact Us
                                </button>
                                <a
                                    href="/profile"
                                    className="px-6 py-3 bg-background border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                                >
                                    Manage Your Data
                                </a>
                            </div>
                        </motion.div>

                        {/* GDPR Compliance Notice */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-8 p-6 rounded-xl bg-muted/50 border border-border/50"
                        >
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold mb-2">GDPR & Privacy Compliance</h4>
                                    <p className="text-sm text-muted-foreground">
                                        SkillTwin is committed to protecting your privacy and complying with applicable data protection laws, including GDPR.
                                        We process your data lawfully, fairly, and transparently. You have the right to access, rectify, erase, restrict processing,
                                        data portability, and to object to processing of your personal data.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </main>

            {/* Suggestions Dialog */}
            <SuggestionsDialog
                isOpen={isSuggestionsOpen}
                onClose={() => setIsSuggestionsOpen(false)}
            />
        </>
    )
}
