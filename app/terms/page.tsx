"use client"

import { motion } from "framer-motion"
import { ArrowLeft, FileText, Shield, Users, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"

export default function TermsPage() {
    const sections = [
        {
            icon: FileText,
            title: "1. Acceptance of Terms",
            content: `By accessing and using SkillTwin ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.`
        },
        {
            icon: Users,
            title: "2. Description of Service",
            content: `SkillTwin is an AI-powered platform that provides skill analysis, career roadmaps, and job matching services. The Service analyzes your academic background, projects, and GitHub repositories to provide personalized career guidance and skill development recommendations.`
        },
        {
            icon: Shield,
            title: "3. User Accounts",
            content: `To use certain features of the Service, you must register for an account. You agree to:
      
• Provide accurate, current, and complete information during registration
• Maintain the security of your password and account
• Notify us immediately of any unauthorized use of your account
• Accept responsibility for all activities that occur under your account

You may not use another person's account without permission. We reserve the right to suspend or terminate accounts that violate these terms.`
        },
        {
            icon: AlertCircle,
            title: "4. User Data and Privacy",
            content: `We collect and process your data as described in our Privacy Policy. By using the Service, you consent to:

• Collection of your academic information, projects, and GitHub data
• Analysis of your data using AI and machine learning algorithms
• Storage of your analysis history and preferences
• Use of anonymized data to improve our services

We are committed to protecting your privacy and will never sell your personal information to third parties.`
        },
        {
            icon: FileText,
            title: "5. Intellectual Property",
            content: `The Service and its original content, features, and functionality are owned by SkillTwin and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

Your uploaded content (resumes, project descriptions, etc.) remains your property. By uploading content, you grant us a license to use, store, and process it solely for providing the Service.`
        },
        {
            icon: Shield,
            title: "6. AI-Generated Content",
            content: `SkillTwin uses artificial intelligence to generate career roadmaps, skill recommendations, and job matches. While we strive for accuracy:

• AI-generated content is provided for informational purposes only
• Recommendations should not be considered professional career advice
• We do not guarantee the accuracy or completeness of AI-generated content
• Users should verify information and use their own judgment

We are not liable for decisions made based on AI-generated recommendations.`
        },
        {
            icon: AlertCircle,
            title: "7. Third-Party Services",
            content: `SkillTwin integrates with third-party services including:

• GitHub for repository analysis
• Job boards (LinkedIn, Indeed, Glassdoor) for job matching
• AI providers (Groq, Gemini, Ollama) for analysis

Your use of these third-party services is subject to their respective terms and conditions. We are not responsible for the content, policies, or practices of third-party services.`
        },
        {
            icon: Users,
            title: "8. Acceptable Use",
            content: `You agree not to:

• Use the Service for any illegal purpose or in violation of any laws
• Attempt to gain unauthorized access to the Service or related systems
• Interfere with or disrupt the Service or servers
• Upload malicious code, viruses, or harmful content
• Impersonate any person or entity
• Scrape, crawl, or harvest data from the Service
• Use the Service to spam or send unsolicited communications
• Reverse engineer or attempt to extract source code

Violation of these terms may result in immediate termination of your account.`
        },
        {
            icon: Shield,
            title: "9. Disclaimer of Warranties",
            content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

• Warranties of merchantability or fitness for a particular purpose
• Warranties that the Service will be uninterrupted or error-free
• Warranties regarding the accuracy or reliability of content

We do not warrant that the Service will meet your requirements or that defects will be corrected.`
        },
        {
            icon: AlertCircle,
            title: "10. Limitation of Liability",
            content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, SKILLTWIN SHALL NOT BE LIABLE FOR:

• Any indirect, incidental, special, consequential, or punitive damages
• Loss of profits, data, use, or other intangible losses
• Damages resulting from unauthorized access to your account
• Damages resulting from reliance on AI-generated content

Our total liability shall not exceed the amount you paid for the Service in the past 12 months, or $100, whichever is greater.`
        },
        {
            icon: FileText,
            title: "11. Modifications to Service",
            content: `We reserve the right to:

• Modify or discontinue the Service at any time
• Change pricing and features with reasonable notice
• Update these Terms of Service periodically

Continued use of the Service after changes constitutes acceptance of the modified terms. We will notify users of significant changes via email or in-app notification.`
        },
        {
            icon: Users,
            title: "12. Termination",
            content: `We may terminate or suspend your account and access to the Service immediately, without prior notice, for:

• Violation of these Terms of Service
• Fraudulent or illegal activity
• Requests by law enforcement or government agencies
• Extended periods of inactivity

Upon termination, your right to use the Service will immediately cease. You may delete your account at any time through your profile settings.`
        },
        {
            icon: Shield,
            title: "13. Governing Law",
            content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.

Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996.`
        },
        {
            icon: FileText,
            title: "14. Contact Information",
            content: `If you have any questions about these Terms of Service, please contact us at:

Email: support@skilltwin.com
Website: www.skilltwin.com

For privacy-related inquiries, please refer to our Privacy Policy or contact our Data Protection Officer.`
        }
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <BackButton />
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-semibold">SkillTwin</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-background border-b border-border">
                <div className="container mx-auto px-4 py-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Please read these terms carefully before using SkillTwin
                        </p>
                        <p className="text-sm text-muted-foreground mt-4">
                            Last Updated: February 5, 2026
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-8"
                >
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <section.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Agreement Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg"
                >
                    <h3 className="text-lg font-semibold mb-3">Agreement</h3>
                    <p className="text-muted-foreground mb-4">
                        By clicking "I agree" during signup or by using SkillTwin, you acknowledge that you have read,
                        understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/signup">
                            <Button>
                                Create Account
                            </Button>
                        </Link>
                        <Link href="/privacy">
                            <Button variant="outline">
                                View Privacy Policy
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="border-t border-border mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>© 2026 SkillTwin. All rights reserved.</p>
                        <div className="flex justify-center gap-4 mt-2">
                            <Link href="/privacy" className="hover:text-primary transition-colors">
                                Privacy Policy
                            </Link>
                            <span>•</span>
                            <Link href="/terms" className="hover:text-primary transition-colors">
                                Terms of Service
                            </Link>
                            <span>•</span>
                            <Link href="/about" className="hover:text-primary transition-colors">
                                About Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
