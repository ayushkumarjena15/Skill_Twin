"use client"

import { Sparkles, Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const footerLinks = {
  product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#" },
    { label: "FAQ", href: "/faq" }
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Roadmap", href: "#" },
    { label: "Changelog", href: "#" }
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" }
  ]
}

const socialLinks = [
  { icon: Github, href: "/team", label: "GitHub" },
  { icon: Twitter, href: "/team", label: "Twitter" },
  { icon: Linkedin, href: "/team", label: "LinkedIn" }
]

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900 relative overflow-hidden">
      {/* Animated Moving Line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
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
                className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20"
              >
                <img src="/logo.png" alt="SkillTwin Logo" className="w-full h-full object-cover" />
              </motion.div>
              <span className="font-bold text-xl text-white group-hover:text-primary transition-colors">SkillTwin</span>
            </Link>
            <div className="relative mb-6 max-w-xs overflow-hidden">
              {/* Animated Moving Line */}
              <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
              <p className="text-sm text-zinc-400 relative">
                Bridge the gap between education and employment with AI-powered skill analysis.
              </p>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} SkillTwin. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Made with ❤️ by</span>
            <Link href="/team" className="font-medium text-primary hover:underline">
              Team Liquid
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
