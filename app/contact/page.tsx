"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Mail, MapPin, Send, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { useState } from "react"
import { toast } from "sonner"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = e.currentTarget
        const formData = new FormData(form)
        const data = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error("Failed to send message")

            toast.success("Message sent successfully!")
            // Reset form
            form.reset()
        } catch (error) {
            toast.error("Failed to send message. Please try again.")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <section className="pt-32 pb-16 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-8">
                        <BackButton />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Have questions about SkillTwin? We're here to help you bridge the gap between education and employment.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <Card className="h-full border-primary/10 bg-primary/5">
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                    <CardDescription>
                                        Reach out to us through any of these channels.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">Email Us</h3>
                                            <p className="text-sm text-muted-foreground mb-1">General Inquiries:</p>
                                            <div className="flex flex-col gap-1 text-sm">
                                                <a href="mailto:ahalyajena28@gmail.com" className="text-primary hover:underline">ahalyajena28@gmail.com</a>
                                                <a href="mailto:anshmannayak737@gmail.com" className="text-primary hover:underline">anshmannayak737@gmail.com</a>
                                                <a href="mailto:ankeetnaikk@gmail.com" className="text-primary hover:underline">ankeetnaikk@gmail.com</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">Visit Us</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Central Library, GIET University<br />
                                                Gunupur, Rayagada, Odisha, India<br />
                                                Pin: 765022
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send us a Message</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll reply within 24 hours.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">First Name</label>
                                                <Input name="firstName" placeholder="Enter your first name" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Last Name</label>
                                                <Input name="lastName" placeholder="Enter your last name" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email</label>
                                            <Input name="email" type="email" placeholder="Enter your gmail" required />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Subject</label>
                                            <Input name="subject" placeholder="How can we help?" required />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Message</label>
                                            <Textarea name="message" placeholder="Tell us more about your inquiry..." className="min-h-[120px]" required />
                                        </div>

                                        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
