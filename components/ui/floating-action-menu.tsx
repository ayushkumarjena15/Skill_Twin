"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Users, Mail, Info, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FloatingActionMenu() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    const menuItems = [
        { label: "About Us", icon: Info, href: "/about", color: "bg-blue-500" },
        { label: "Team Liquid", icon: Users, href: "/team", color: "bg-purple-500" },
        { label: "Contact Us", icon: Mail, href: "/contact", color: "bg-indigo-500" },
    ]

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none">
            {/* Menu Items */}
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col items-end gap-3 pointer-events-auto pb-2">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{
                                    duration: 0.2,
                                    delay: (menuItems.length - 1 - index) * 0.05,
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                            >
                                <Link href={item.href} className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                                    <span className="bg-background/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm group-hover:bg-accent transition-colors">
                                        {item.label}
                                    </span>
                                    <div className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center pointer-events-auto transition-colors duration-300 ${isOpen ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                onClick={toggleMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <Plus className="w-7 h-7" />
                </motion.div>
            </motion.button>
        </div>
    )
}
