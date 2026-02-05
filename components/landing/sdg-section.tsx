"use client"

import { motion } from "framer-motion"
import { BookOpen, TrendingUp, Globe } from "lucide-react"

const sdgs = [
  {
    number: 4,
    title: "Quality Education",
    description: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
    icon: BookOpen,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    link: "https://data.unicef.org/sdgs/goal-4-quality-education/",
    image: "/images/sdg/sdg-4.png"
  },
  {
    number: 8,
    title: "Decent Work & Economic Growth",
    description: "Promote sustained, inclusive and sustainable economic growth, full and productive employment.",
    icon: TrendingUp,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    link: "https://www.un.org/sustainabledevelopment/economic-growth/",
    image: "/images/sdg/sdg-8.png"
  }
]

export function SDGSection() {
  return (
    <section id="sdg" className="py-24 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(142_76%_36%/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(142_76%_36%/0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Animated Moving Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 h-[2px] w-full bg-gradient-to-r from-transparent via-green-500/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 h-[2px] w-full bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
        />
        <motion.div
          className="absolute top-3/4 h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-red-500/30' : 'bg-pink-500/30'}`}
            style={{ left: `${15 + i * 18}%`, top: `${25 + (i % 3) * 25}%` }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3.5 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 mb-6 border border-green-500/20"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">UN SDG Alignment</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {"Building a Better Future".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="inline-block mr-3 last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground"
          >
            SkillTwin directly contributes to the United Nations Sustainable Development Goals
            by bridging the education-employment gap.
          </motion.p>
        </div>

        {/* SDG Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {sdgs.map((sdg, index) => (
            <motion.div
              key={sdg.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                y: -10,
                zIndex: 10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative z-0"
            >
              <a
                href={sdg.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-8 rounded-2xl border ${sdg.borderColor} bg-zinc-900 h-full transition-all duration-300 hover:shadow-2xl cursor-pointer`}
                style={{ boxShadow: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 25px 50px -12px ${sdg.number === 4 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* SDG Number Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className={`w-16 h-16 rounded-xl ${sdg.bgColor} flex items-center justify-center border ${sdg.borderColor} overflow-hidden p-2`}
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <img src={sdg.image} alt={`SDG ${sdg.number}`} className="w-full h-full object-contain" />
                  </motion.div>
                  <div>
                    <div className={`text-xs font-medium ${sdg.color} mb-1`}>SDG {sdg.number}</div>
                    <h3 className="text-xl font-semibold text-white">{sdg.title}</h3>
                  </div>
                </div>

                <p className="text-zinc-400">{sdg.description}</p>

                {/* Impact Points */}
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <div className="text-sm font-medium mb-3 text-white">SkillTwin Impact:</div>
                  <ul className="space-y-2">
                    {sdg.number === 4 ? (
                      <>
                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                          <span className={sdg.color}>✓</span>
                          Personalized learning paths
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                          <span className={sdg.color}>✓</span>
                          Curriculum gap identification
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                          <span className={sdg.color}>✓</span>
                          Free access to resources
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                          <span className={sdg.color}>✓</span>
                          Improved employability
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                          <span className={sdg.color}>✓</span>
                          Real job market insights
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                          <span className={sdg.color}>✓</span>
                          Career guidance support
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}