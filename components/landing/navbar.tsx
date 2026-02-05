"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const navLinks = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/about", label: "About Us" },
    { href: "/#features", label: "Features" },
    { href: "/#sdg", label: "SDG Impact" },
    { href: "/faq", label: "FAQ" }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className="container mx-auto px-4 py-4 md:py-6 pointer-events-auto">
        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
          style={{ scaleX }}
        />
        <motion.div
          layout
          className={`mx-auto rounded-2xl border transition-all duration-300 ${isScrolled
            ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-lg shadow-black/5 max-w-5xl px-6 py-2"
            : "bg-transparent border-transparent max-w-7xl px-0 py-0"
            }`}
        >
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
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
                className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20"
              >
                <img src="/logo.png" alt="SkillTwin Logo" className="w-full h-full object-cover" />
              </motion.div>
              <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">
                SkillTwin
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full"
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span className="relative z-10">{link.label}</span>
                  {hoveredLink === link.href && (
                    <motion.span
                      layoutId="navbar-hover"
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <div className="w-px h-6 bg-border mx-1" />
              <UserNav />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </nav>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 p-4 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                <div className="px-4 pt-2">
                  <UserNav />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
