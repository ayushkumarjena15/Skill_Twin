"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Github, Twitter, Linkedin, Instagram, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

import { BackButton } from "@/components/ui/back-button"

const teamMembers = [
    {
        name: "Mr. Ayush Kumar Jena",
        role: "Team Lead",
        image: "/team/team-member-1.jpg", // Placeholder for user to add image later
        bio: "Vision-driven leader responsible for strategic planning, team coordination, and ensuring timely delivery of high-impact solutions.",
        socials: {
            linkedin: "https://www.linkedin.com/in/ayush-kumar-jena-b19151321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            twitter: "#",
            instagram: "https://www.instagram.com/ig_ayush099?igsh=MTh1dWJoNWUzemJ1Zg==",
            github: "#"
        }
    },
    {
        name: "Mr. Ankit Naik",
        role: "ML Developer",
        image: "/team/ankit-naik.jpg",
        bio: "Specializes in building intelligent machine learning models, data-driven solutions, and AI systems aligned with real-world industry needs.",
        socials: {
            linkedin: "https://www.linkedin.com/in/ankit-naik-387092321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            twitter: "#",
            instagram: "https://www.instagram.com/ankiitt_0008?igsh=MXNmMzV2ZXk2OHc4OQ==",
            github: "#"
        }
    },
    {
        name: "Mr. Anshuman Nayak",
        role: "Backend Developer",
        image: "/team/anshuman-nayak.jpg",
        bio: "Focuses on designing scalable backend architectures, APIs, and secure server-side systems to power robust applications.",
        socials: {
            linkedin: "https://www.linkedin.com/in/anshuman-nayak-16432a246?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            twitter: "#",
            instagram: "https://www.instagram.com/anshuman_nayak2?igsh=dXV5MnR4N2V5M3Q2",
            github: "#"
        }
    }
]

export default function TeamPage() {
    const router = useRouter()

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <section className="pt-32 pb-16">
                <div className="container px-4 mx-auto">
                    <div className="max-w-6xl mx-auto mb-8">
                        <div className="max-w-6xl mx-auto mb-8">
                            <BackButton />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 flex items-center justify-center gap-4">
                            <span>Meet the Team Liquid</span>
                            <motion.div
                                className="relative"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 15,
                                    delay: 0.3
                                }}
                                whileHover={{
                                    scale: 1.15,
                                    rotate: [0, -5, 5, 0],
                                    transition: { duration: 0.4 }
                                }}
                            >
                                {/* Glowing ring effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-violet-400 to-purple-600 blur-md opacity-60"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.6, 0.8, 0.6],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    style={{ width: 70, height: 70, left: -5, top: -5 }}
                                />
                                {/* Logo container with border */}
                                <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-purple-400/50 bg-background/80 backdrop-blur-sm p-1.5 shadow-lg shadow-purple-500/20">
                                    <Image
                                        src="/team-liquid-logo.png"
                                        alt="Team Liquid Logo"
                                        fill
                                        className="object-contain p-1"
                                        unoptimized
                                    />
                                </div>
                                {/* Sparkle effects */}
                                <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-violet-400 rounded-full"
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: 0.5,
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full"
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: 1,
                                    }}
                                />
                            </motion.div>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            The passionate individuals behind SkillTwin working to bridge the education-employment gap.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center hover:border-primary/50 transition-colors group"
                            >
                                {/* Photo Placeholder */}
                                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-primary/50" />
                                    )}
                                </div>

                                {/* Info */}
                                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                                <div className="text-primary font-medium mb-4">{member.role}</div>
                                <p className="text-muted-foreground mb-6 text-sm">
                                    {member.bio}
                                </p>

                                {/* Social Links */}
                                <div className="flex items-center justify-center gap-4">
                                    <a
                                        href={member.socials.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-muted hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                        <span className="sr-only">LinkedIn</span>
                                    </a>
                                    <a
                                        href={member.socials.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-muted hover:bg-sky-500/10 hover:text-sky-500 transition-colors"
                                    >
                                        <Twitter className="w-5 h-5" />
                                        <span className="sr-only">Twitter</span>
                                    </a>
                                    <a
                                        href={member.socials.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-muted hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                                    >
                                        <Instagram className="w-5 h-5" />
                                        <span className="sr-only">Instagram</span>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
