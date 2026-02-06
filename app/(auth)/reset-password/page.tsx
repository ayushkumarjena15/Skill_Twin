"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/lib/db"
import { Eye, EyeOff, Loader2, CheckCircle2, Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export default function ResetPasswordPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })

    // Redirect if no user session (invalid/expired reset link)
    useEffect(() => {
        if (!user) {
            // Give a moment for auth to load
            const timer = setTimeout(() => {
                if (!user) {
                    setError("Invalid or expired reset link. Please request a new one.")
                }
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [user])

    const validatePassword = (password: string) => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long"
        }
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        // Validate password strength
        const passwordError = validatePassword(formData.password)
        if (passwordError) {
            setError(passwordError)
            setIsLoading(false)
            return
        }

        try {
            const { error } = await updatePassword(formData.password)

            if (error) {
                console.error("Password update error:", error)
                setError(error.message || "Failed to update password. Please try again.")
                setIsLoading(false)
                return
            }

            setSuccess(true)

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login")
            }, 2000)
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

                <h1 className="text-2xl font-bold tracking-tight mb-2">Password updated!</h1>
                <p className="text-muted-foreground mb-6">
                    Your password has been successfully reset.
                </p>

                <p className="text-sm text-muted-foreground">
                    Redirecting to login...
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
                <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
                <p className="text-muted-foreground mt-2">
                    Your new password must be different from previously used passwords
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
                {/* New Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pl-10 pr-10 h-11"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Must be at least 6 characters
                    </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="pl-10 pr-10 h-11"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !user}
                    className="w-full h-11"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating password...
                        </>
                    ) : (
                        "Reset password"
                    )}
                </Button>
            </form>

            {/* Back to login */}
            <Link href="/login">
                <Button variant="ghost" className="w-full mt-4">
                    Back to login
                </Button>
            </Link>
        </motion.div>
    )
}
