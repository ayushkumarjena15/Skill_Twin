"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BackButtonProps {
    className?: string
    label?: string
    variant?: "default" | "ghost" | "outline" | "secondary"
    href?: string
}

export function BackButton({ className, label = "Back", variant = "ghost", href }: BackButtonProps) {
    const router = useRouter()

    const handleClick = () => {
        if (href) {
            router.push(href)
        } else {
            router.back()
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={cn("inline-block", className)}
        >
            <Button
                variant={variant}
                size="sm"
                onClick={handleClick}
                className="group hover:bg-primary/10 hover:text-primary transition-all duration-300 gap-2 pl-2 rounded-full"
            >
                <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <ArrowLeft className="h-4 w-4" />
                </motion.div>
                <span className="font-medium">{label}</span>
            </Button>
        </motion.div>
    )
}
