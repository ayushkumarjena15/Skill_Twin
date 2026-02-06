"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Loader2 } from "lucide-react"
import { addReview } from "@/lib/db"
import { motion, AnimatePresence } from "framer-motion"

interface ReviewDialogProps {
    className?: string
    children?: React.ReactNode
}

export function ReviewDialog({ className, children }: ReviewDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)
    const [name, setName] = useState("")
    const [designation, setDesignation] = useState("")
    const [message, setMessage] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !message) return

        setLoading(true)
        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    designation: designation || "Student", // Default if empty
                    rating,
                    message,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                // Throw the specific error message from the API
                throw new Error(data.error || "Failed to submit review")
            }

            setSuccess(true)
            setTimeout(() => {
                setOpen(false)
                setSuccess(false)
                setName("")
                setDesignation("")
                setMessage("")
                setRating(5)
            }, 2000)
        } catch (error: any) {
            console.error("Failed to submit review:", error)
            alert(error.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button variant="outline" className={className}>Leave a Review</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center py-8 space-y-4"
                        >
                            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                <Star className="h-8 w-8 text-green-500 fill-green-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">Thank You!</h3>
                                <p className="text-muted-foreground">Your review has been submitted.</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <DialogHeader>
                                <DialogTitle>Leava a Review</DialogTitle>
                                <DialogDescription>
                                    Share your experience with SkillTwin. Your feedback helps us improve.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                                <div className="space-y-2">
                                    <Label>Your Rating</Label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none transition-colors"
                                            >
                                                <Star
                                                    className={`h-8 w-8 transition-all ${star <= (hoverRating || rating)
                                                        ? "fill-yellow-400 text-yellow-400 scale-110"
                                                        : "text-zinc-600"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input
                                        id="designation"
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                        placeholder="Enter your designation"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us what you think..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
