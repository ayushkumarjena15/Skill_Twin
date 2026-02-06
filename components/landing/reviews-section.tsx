"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getReviews } from "@/lib/db"
import { Review } from "@/lib/supabase"
import { Star, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([])

    useEffect(() => {
        // Initial fetch
        getReviews().then(({ data }) => {
            if (data) setReviews(data)
        })

        // Real-time subscription
        const channel = supabase
            .channel('reviews')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'reviews' },
                (payload) => {
                    setReviews((current) => [payload.new as Review, ...current])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    if (reviews.length === 0) return null

    return (
        <section className="py-24 bg-zinc-950/50 overflow-hidden relative">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        What Our Community Says
                    </h2>
                    <p className="text-muted-foreground">
                        Real feedback from students transforming their careers
                    </p>
                </div>

                <div className="relative">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

                    {/* Marquee Animation */}
                    <div className="flex overflow-hidden">
                        <motion.div
                            className="flex gap-6 py-4"
                            initial={{ x: "-50%" }}
                            animate={{ x: "0%" }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: Math.max(20, reviews.length * 5)
                            }}
                            style={{ width: "fit-content" }}
                        >
                            {/* Duplicate reviews to create seamless loop */}
                            {[...reviews, ...reviews, ...reviews].map((review, i) => (
                                <div
                                    key={`${review.id}-${i}`}
                                    className="w-[300px] md:w-[350px] shrink-0 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                                >
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-zinc-700"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-zinc-300 mb-6 line-clamp-4 text-sm leading-relaxed">
                                        "{review.message}"
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 bg-primary/20">
                                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                                {review.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-sm font-medium text-white">{review.name}</div>
                                            <div className="text-xs text-zinc-500">{review.designation || "Student"}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
