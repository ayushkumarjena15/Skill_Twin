"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"
import { Quote, Loader2 } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-purple-700" />

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col p-10 text-white w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                initial={{ scale: 0.5, opacity: 0, boxShadow: "0 0 0px rgba(255, 255, 255, 0)" }}
                animate={{
                  scale: [0.5, 1.2, 0.9, 1.1, 1],
                  opacity: [0, 1, 0.7, 1, 1],
                  rotate: [0, -10, 10, -5, 0],
                  boxShadow: [
                    "0 0 0px rgba(255, 255, 255, 0)",
                    "0 0 30px rgba(255, 255, 255, 0.8)",
                    "0 0 15px rgba(255, 255, 255, 0.5)",
                    "0 0 25px rgba(255, 255, 255, 0.6)",
                    "0 0 20px rgba(255, 255, 255, 0.4)"
                  ]
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{
                  rotate: 10,
                  scale: 1.1,
                  boxShadow: "0 0 35px rgba(255, 255, 255, 0.8)"
                }}
                className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 overflow-hidden"
              >
                <img src="/logo.png" alt="SkillTwin Logo" className="w-full h-full object-cover" />
              </motion.div>
              <span className="font-bold text-2xl group-hover:text-white/80 transition-colors">SkillTwin</span>
            </Link>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >

              {/* Testimonial */}
              <blockquote className="space-y-8">
                <motion.p
                  className="text-2xl font-light leading-relaxed tracking-wide"
                >
                  {["SkillTwin", "bridges", "the", "gap", "between", "academic", "learning", "and", "industry", "expectations", "by", "delivering", "clear", "skill", "insights", "and", "personalized", "career", "roadmaps."].map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + index * 0.08,
                        ease: "easeOut"
                      }}
                      className={`inline-block mr-2 ${word === "SkillTwin" ? "font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent" :
                        word === "bridges" || word === "gap" ? "text-white font-semibold" :
                          word === "skill" || word === "insights" || word === "roadmaps." ? "text-purple-200 font-medium italic" :
                            "text-white/80"
                        }`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.p>
                <motion.footer
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2 }}
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 overflow-hidden cursor-pointer"
                  >
                    <img src="/team-liquid-logo.png" alt="Team Liquid" className="w-full h-full object-cover" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-lg">Team Liquid</p>
                    <p className="text-white/70">Reshape your career</p>
                  </div>
                </motion.footer>
              </blockquote>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-10 border-t border-white/20"
          >
            <div className="text-center">
              <p className="text-lg font-bold">Real Job</p>
              <p className="text-white/70 text-sm mt-1">Market Insights</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">Skill Gap</p>
              <p className="text-white/70 text-sm mt-1">Identification</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">Personalized</p>
              <p className="text-white/70 text-sm mt-1">Growth Path</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="relative flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:hidden flex justify-center mb-10"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                initial={{ scale: 0.5, opacity: 0, boxShadow: "0 0 0px rgba(139, 92, 246, 0)" }}
                animate={{
                  scale: [0.5, 1.2, 0.9, 1.1, 1],
                  opacity: [0, 1, 0.7, 1, 1],
                  rotate: [0, -10, 10, -5, 0],
                  boxShadow: [
                    "0 0 0px rgba(139, 92, 246, 0)",
                    "0 0 30px rgba(139, 92, 246, 0.8)",
                    "0 0 15px rgba(139, 92, 246, 0.5)",
                    "0 0 25px rgba(139, 92, 246, 0.6)",
                    "0 0 20px rgba(139, 92, 246, 0.4)"
                  ]
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{
                  rotate: 10,
                  scale: 1.1,
                  boxShadow: "0 0 35px rgba(139, 92, 246, 0.8)"
                }}
                className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20"
              >
                <img src="/logo.png" alt="SkillTwin Logo" className="w-full h-full object-cover" />
              </motion.div>
              <span className="font-bold text-2xl group-hover:text-primary transition-colors">SkillTwin</span>
            </Link>
          </motion.div>

          {children}

          {/* Mobile Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:hidden mt-10 pt-6 border-t border-border"
          >
            <div className="flex justify-center gap-8 text-center">
              <div>
                <p className="text-sm font-bold text-primary">Real Job</p>
                <p className="text-xs text-muted-foreground">Market Insights</p>
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Skill Gap</p>
                <p className="text-xs text-muted-foreground">Identification</p>
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Personalized</p>
                <p className="text-xs text-muted-foreground">Growth Path</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
