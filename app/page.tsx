"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SDGSection } from "@/components/landing/sdg-section"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { SectionDivider } from "@/components/landing/section-divider"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // We removed the automatic redirect here so the Back button works
  // and users can actually see the landing page while logged in.

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <SectionDivider />
      <Problem />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <SDGSection />
      <SectionDivider />
      <CTA />
      <Footer />
    </main>
  )
}