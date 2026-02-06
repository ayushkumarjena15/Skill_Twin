"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/db"
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const { error } = await resetPassword(email)

            if (error) {
                console.error("Password reset error:", error)
                setError(error.message || "Failed to send reset email. Please try again.")
                setIsLoading(false)
                return
            }

            setSuccess(true)
            setIsLoading(false)
        } catch (err: any) {
            console.error("Unexpected error:", err)
            setError("An unexpected error occurred. Please try again.")
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                </motion.div>

                <h1 className="text-2xl font-bold tracking-tight mb-2">Check your email</h1>
                <p className="text-muted-foreground mb-6">
                    We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </p>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Click the link in the email to reset your password. The link will expire in 1 hour.
                    </p>

                    <Link href="/login">
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to login
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                        onClick={() => {
                            setSuccess(false)
                            setEmail("")
                        }}
                        className="text-primary hover:underline font-medium"
                    >
                        try again
                    </button>
                </p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
                <p className="text-muted-foreground mt-2">
                    No worries, we'll send you reset instructions
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your gmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-11"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Send reset link"
                    )}
                </Button>
            </form>

            {/* Back to login */}
            <Link href="/login">
                <Button variant="ghost" className="w-full mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                </Button>
            </Link>
        </motion.div>
    )
}
