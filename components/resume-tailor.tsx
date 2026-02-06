"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    FileText,
    Briefcase,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Copy,
    RefreshCw,
    Search
} from "lucide-react"
import { toast } from "sonner"
import type { Job } from "@/lib/types"
import { SAMPLE_JDS } from "@/lib/sample-jds"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ResumeTailorProps {
    initialJob?: Job | null
}

interface OptimizationResult {
    optimizationScore: number
    postOptimizationScore: number
    keyKeywordsFound: string[]
    missingKeywordsAdded: string[]
    improvements: {
        original: string
        improved: string
        reason: string
    }[]
}

export function ResumeTailor({ initialJob }: ResumeTailorProps) {
    const [jobDescription, setJobDescription] = useState(initialJob?.description || "")
    const [resumeText, setResumeText] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<OptimizationResult | null>(null)

    // Handle preset JD selection
    const handleRoleSelect = (role: string) => {
        const jd = SAMPLE_JDS[role]
        if (jd) {
            setJobDescription(jd)
            toast.info(`Loaded JD for ${role}`)
        }
    }

    const handleOptimize = async () => {
        if (!resumeText.trim() || !jobDescription.trim()) {
            toast.error("Please provide both your resume content and the job description.")
            return
        }

        setIsAnalyzing(true)
        setResult(null)

        try {
            const response = await fetch("/api/resume/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText, jobDescription }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || "Optimization failed")
            }

            const data = await response.json()
            setResult(data)
            toast.success("Resume optimized successfully!")
        } catch (error: any) {
            toast.error(error.message || "Failed to generate optimization. Please try again.")
            console.error(error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast("Copied to clipboard")
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                    AI Resume Tailor
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Paste your current resume and select a target job description. Our AI will rewrite your bullet points to match the job's keywords and pass ATS filters.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* INPUT: RESUME */}
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Your Resume
                        </CardTitle>
                        <CardDescription>Paste your specific bullet points or full resume text here</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="flex flex-col w-full gap-2">
                            <input
                                type="file"
                                id="resume-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return

                                    const formData = new FormData()
                                    formData.append("file", file)

                                    const toastId = toast.loading("Extracting text from PDF...")

                                    try {
                                        const res = await fetch("/api/extract-pdf", {
                                            method: "POST",
                                            body: formData
                                        })

                                        if (!res.ok) throw new Error("Extraction failed")

                                        const data = await res.json()

                                        if (data.text) {
                                            setResumeText(data.text)
                                            toast.success("Resume loaded!", { id: toastId })
                                        } else {
                                            toast.error("Could not read text from PDF", { id: toastId })
                                        }
                                    } catch (err) {
                                        toast.error("Failed to upload PDF", { id: toastId })
                                        console.error(err)
                                    }
                                }}
                            />
                            <Button variant="outline" size="sm" className="w-full" onClick={() => document.getElementById("resume-upload")?.click()}>
                                <FileText className="mr-2 h-4 w-4" />
                                Upload Resume (PDF)
                            </Button>
                            <div className="relative flex items-center w-full py-2">
                                <div className="flex-grow border-t border-muted"></div>
                                <span className="flex-shrink-0 mx-2 text-xs text-muted-foreground uppercase">Or paste text</span>
                                <div className="flex-grow border-t border-muted"></div>
                            </div>
                        </div>

                        <Textarea
                            placeholder="• Developed a comprehensive React application...&#10;• Managed a team of 5 developers...&#10;• Reduced load times by 40%..."
                            className="h-[300px] font-mono text-sm resize-none"
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* INPUT: JOB DESCRIPTION */}
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-green-500" />
                                Target Job
                            </CardTitle>
                            {/* ROLE SELECTOR */}
                            <div className="w-full sm:w-[280px]">
                                <Select onValueChange={handleRoleSelect}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select Role..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(SAMPLE_JDS).map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <CardDescription>Select a standard role or paste a custom JD</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Textarea
                            placeholder="We are looking for a Senior Frontend Engineer with experience in Next.js, TypeScript, and performance optimization..."
                            className="h-[300px] font-mono text-sm resize-none"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleOptimize}
                    disabled={isAnalyzing}
                    className="w-full md:w-auto min-w-[200px] font-bold text-lg h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20"
                >
                    {isAnalyzing ? (
                        <>
                            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                            Optimizing...
                        </>
                    ) : (
                        <>
                            Tailor My Resume
                        </>
                    )}
                </Button>
            </div>

            {/* RESULTS DISPLAY */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* SCORES HEADER */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="bg-muted/50 border-zinc-200 dark:border-zinc-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Original Match</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-zinc-500">{result.optimizationScore}%</span>
                                    </div>
                                    <Progress value={result.optimizationScore} className="h-2 mt-2 bg-zinc-200 dark:bg-zinc-800" />
                                </CardContent>
                            </Card>

                            <Card className="bg-green-500/5 border-green-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-2">
                                        Optimized Match
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-green-600 dark:text-green-400">{result.postOptimizationScore}%</span>
                                        <span className="text-sm font-bold text-green-600/70">
                                            (+{result.postOptimizationScore - result.optimizationScore}%)
                                        </span>
                                    </div>
                                    <Progress value={result.postOptimizationScore} className="h-2 mt-2 bg-green-200 dark:bg-green-900/50" />
                                </CardContent>
                            </Card>

                            <Card className="bg-blue-500/5 border-blue-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Keywords Added</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywordsAdded.slice(0, 5).map((kw, i) => (
                                            <Badge key={i} variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                                {kw}
                                            </Badge>
                                        ))}
                                        {result.missingKeywordsAdded.length > 5 && (
                                            <Badge variant="outline">+{result.missingKeywordsAdded.length - 5} more</Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* IMPROVEMENTS LIST */}
                        <div className="grid gap-6">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                Suggested Improvements
                            </h3>

                            {result.improvements.map((item, idx) => (
                                <Card key={idx} className="overflow-hidden border-muted group hover:border-violet-500/30 transition-all">
                                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                                        {/* ORIGINAL */}
                                        <div className="p-6 bg-red-500/5 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-xs text-red-600/70 uppercase tracking-wider">Original</h4>
                                                <AlertCircle className="h-4 w-4 text-red-400" />
                                            </div>
                                            <p className="text-sm text-muted-foreground line-through decoration-red-400/30">
                                                {item.original}
                                            </p>
                                        </div>

                                        {/* IMPROVED */}
                                        <div className="p-6 bg-green-500/5 space-y-4 relative">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-xs text-green-600/70 uppercase tracking-wider">Optimized</h4>
                                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-none">ATS Ready</Badge>
                                                </div>
                                                <p className="text-base font-medium text-foreground">
                                                    {item.improved}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-green-500/10 flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground italic">
                                                    <span className="font-semibold text-green-600/80">Why:</span> {item.reason}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600"
                                                    onClick={() => copyToClipboard(item.improved)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
