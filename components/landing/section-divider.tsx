"use client"

import { motion } from "framer-motion"

export function SectionDivider() {
    return (
        <div className="relative h-16 overflow-hidden">
            {/* Static gradient line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent dark:via-border/50" />

            {/* Animated moving line */}
            <motion.div
                className="absolute top-1/2 h-[2px] w-32 bg-gradient-to-r from-transparent via-primary to-transparent"
                animate={{ x: ["-100%", "100vw"] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Center dot */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    )
}
