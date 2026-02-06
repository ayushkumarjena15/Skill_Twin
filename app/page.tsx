"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// Navbar & Footer
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

// Landing Page Sections
import { Problem } from "@/components/landing/problem"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { SDGSection } from "@/components/landing/sdg-section"
import { ReviewsSection } from "@/components/landing/reviews-section"
import { CTA } from "@/components/landing/cta"
import { SectionDivider } from "@/components/landing/section-divider"

// ===========================================
// 🎨 ALL HERO OPTIONS
// ===========================================
import { Hero } from "@/components/landing/hero"
import { HeroParticles } from "@/components/landing/hero-particles"
import { HeroOrbit } from "@/components/landing/hero-orbit"
import { HeroAurora } from "@/components/landing/hero-aurora"

// ===========================================
// 🎯 CHOOSE YOUR HERO DESIGN HERE
// ===========================================
// Options: "original" | "particles" | "orbit" | "aurora"

const HERO_DESIGN: "original" | "particles" | "orbit" | "aurora" = "aurora"

// ===========================================

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // We removed the automatic redirect here so the Back button works
  // and users can actually see the landing page while logged in.

  // Render selected hero design
  const renderHero = () => {
    switch (HERO_DESIGN) {
      case "particles":
        return <HeroParticles />
      case "orbit":
        return <HeroOrbit />
      case "aurora":
        return <HeroAurora />
      case "original":
      default:
        return <Hero />
    }
  }

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section - Switchable Design */}
      {renderHero()}

      {/* Divider */}
      <SectionDivider />

      {/* Problem Section */}
      <Problem />
      <SectionDivider />

      {/* How It Works */}
      <HowItWorks />
      <SectionDivider />

      {/* Features Section */}
      <Features />
      <SectionDivider />

      <SDGSection />
      <SectionDivider />

      {/* Reviews Section */}
      <ReviewsSection />
      <SectionDivider />

      {/* Call to Action */}
      <CTA />

      {/* Footer */}
      <Footer />
    </main>
  )
}