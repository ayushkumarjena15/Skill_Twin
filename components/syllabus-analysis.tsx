"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import {
    Upload,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    BookOpen,
    ArrowRight,
    RefreshCw,
    Search,
    School
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { JOB_REQUIREMENTS, normalizeSkill, areSkillsEquivalent } from "@/lib/types"

interface SyllabusAnalysisProps {
    jobRole: string
    initialSyllabusTopics?: string[]
}

interface ComparisonItem {
    skill: string
    isCore: boolean
    isMatch: boolean
    source?: string // "Subject" or "Skill" or undefined
}

export function SyllabusAnalysis({ jobRole, initialSyllabusTopics }: SyllabusAnalysisProps) {
    // State
    const [file, setFile] = useState<File | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Results
    const [extractedTopics, setExtractedTopics] = useState<string[]>(initialSyllabusTopics || [])
    const [extractedSkills, setExtractedSkills] = useState<string[]>([])
    const [comparison, setComparison] = useState<ComparisonItem[]>([])
    const [matchPercentage, setMatchPercentage] = useState(0)
    const [hasAnalyzed, setHasAnalyzed] = useState(false)

    // Get requirements for the role
    const requirements = JOB_REQUIREMENTS[jobRole] || { core: [], bonus: [] }

    // Upload Handler
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0]
        if (uploadedFile) {
            await handleUpload(uploadedFile)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024 // 10MB
    })

    const handleUpload = async (uploadedFile: File) => {
        setFile(uploadedFile)
        setIsAnalyzing(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append("file", uploadedFile)

            const response = await fetch("/api/extract-pdf", {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to analyze syllabus")
            }

            const topics = data.topics || []
            const skills = data.skills || []

            setExtractedTopics(topics)
            setExtractedSkills(skills)

            // Perform Comparison
            performComparison(topics, skills)
            setHasAnalyzed(true)

        } catch (err: any) {
            console.error("Syllabus analysis error:", err)
            setError(err.message || "An unexpected error occurred")
        } finally {
            setIsAnalyzing(false)
        }
    }

    // Comparison Logic
    const performComparison = (topics: string[], skills: string[]) => {
        const allExtracted = [...topics, ...skills]
        const comparisonResults: ComparisonItem[] = []

        let matchedCount = 0
        let totalCount = 0

        // Check Core Skills
        requirements.core.forEach(req => {
            totalCount++
            const match = allExtracted.find(extracted =>
                areSkillsEquivalent(extracted, req) || extracted.toLowerCase().includes(req.toLowerCase())
            )

            const isMatch = !!match
            if (isMatch) matchedCount++

            comparisonResults.push({
                skill: req,
                isCore: true,
                isMatch,
                source: match ? (topics.includes(match) ? "Subject" : "Skill") : undefined
            })
        })

        // Check Bonus Skills
        requirements.bonus.forEach(req => {
            totalCount++
            const match = allExtracted.find(extracted =>
                areSkillsEquivalent(extracted, req) || extracted.toLowerCase().includes(req.toLowerCase())
            )

            const isMatch = !!match
            if (isMatch) matchedCount++

            comparisonResults.push({
                skill: req,
                isCore: false,
                isMatch,
                source: match ? (topics.includes(match) ? "Subject" : "Skill") : undefined
            })
        })

        setComparison(comparisonResults)
        setMatchPercentage(Math.round((matchedCount / totalCount) * 100))
    }

    const resetAnalysis = () => {
        setFile(null)
        setHasAnalyzed(false)
        setExtractedTopics([])
        setExtractedSkills([])
        setComparison([])
        setError(null)
    }

    // Initial Analysis Effect
    useEffect(() => {
        if (initialSyllabusTopics && initialSyllabusTopics.length > 0 && !hasAnalyzed) {
            performComparison(initialSyllabusTopics, [])
            setHasAnalyzed(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSyllabusTopics, jobRole])

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <School className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                            Syllabus Gap Analysis
                        </h2>
                    </div>
                    <p className="text-muted-foreground">
                        Compare your academic curriculum against {jobRole} industry standards.
                    </p>
                </div>

                {hasAnalyzed && (
                    <Button variant="outline" onClick={resetAnalysis} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Analyze New File
                    </Button>
                )}
            </div>

            {!hasAnalyzed ? (
                // Upload State
                <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div
                            {...getRootProps()}
                            className={`flex flex-col items-center justify-center p-12 text-center cursor-pointer transition-all rounded-xl ${isDragActive ? "bg-primary/10 scale-[0.99]" : "hover:bg-primary/10"
                                }`}
                        >
                            <input {...getInputProps()} />

                            {isAnalyzing ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
                                    <h3 className="text-xl font-semibold mb-2">Analyzing Syllabus...</h3>
                                    <p className="text-muted-foreground">Extracting subjects and matching skills</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                                        <Upload className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Upload Syllabus / Transcript</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                                        Drag & drop your PDF here, or click to select. We'll identify what skills your curriculum covers.
                                    </p>
                                    <Button>Select PDF File</Button>
                                </>
                            )}
                        </div>

                        {error && (
                            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                // Results State
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Comparison Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Match Score Card */}
                        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                        Curriculum Coverage
                                    </h3>
                                    <Badge variant={matchPercentage > 70 ? "default" : matchPercentage > 40 ? "secondary" : "destructive"}>
                                        {matchPercentage}% Match
                                    </Badge>
                                </div>
                                <Progress value={matchPercentage} className="h-3 mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Your syllabus covers <strong>{comparison.filter(c => c.isMatch).length}</strong> out of <strong>{comparison.length}</strong> key industry skills for {jobRole}.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Comparison Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skill Gap Analysis</CardTitle>
                                <CardDescription>
                                    Detailed breakdown of Industry Requirements vs. Extracted Syllabus Content
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground px-2">
                                        <div className="col-span-1 text-center">Status</div>
                                        <div className="col-span-5">Industry Skill</div>
                                        <div className="col-span-2 text-center">Type</div>
                                        <div className="col-span-4 text-right">Match Source</div>
                                    </div>

                                    {/* Table Body */}
                                    <ScrollArea className="h-[400px] pr-4">
                                        <div className="space-y-2">
                                            {comparison.sort((a, b) => (a.isMatch === b.isMatch ? 0 : a.isMatch ? -1 : 1)).map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-colors ${item.isMatch
                                                        ? "bg-green-500/5 border-green-500/20"
                                                        : "bg-red-500/5 border-red-500/20"
                                                        }`}
                                                >
                                                    {/* Status Icon */}
                                                    <div className="col-span-1 flex justify-center">
                                                        {item.isMatch ? (
                                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-red-500" />
                                                        )}
                                                    </div>

                                                    {/* Skill Name */}
                                                    <div className="col-span-5 font-medium">
                                                        {item.skill}
                                                    </div>

                                                    {/* Type */}
                                                    <div className="col-span-2 flex justify-center">
                                                        <Badge variant={item.isCore ? "default" : "outline"} className="text-xs">
                                                            {item.isCore ? "Core" : "Bonus"}
                                                        </Badge>
                                                    </div>

                                                    {/* Source */}
                                                    <div className="col-span-4 text-right text-sm text-muted-foreground">
                                                        {item.isMatch ? (
                                                            <span className="flex items-center justify-end gap-1 text-green-600">
                                                                Found in {item.source}
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-500/70 py-1 px-2 rounded-md bg-red-500/10 text-xs">
                                                                Missing
                                                            </span>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Extracted Artifacts Sidebar */}
                    <div className="space-y-6">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Search className="h-4 w-4 text-primary" />
                                    Extracted Subjects
                                </CardTitle>
                                <CardDescription>
                                    Topics identified from your PDF
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[500px]">
                                    <div className="flex flex-wrap gap-2">
                                        {extractedTopics.length > 0 ? (
                                            extractedTopics.map((topic, i) => (
                                                <Badge key={i} variant="secondary" className="px-3 py-1 text-sm bg-muted/50 hover:bg-muted">
                                                    {topic}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">
                                                No distinct subjects found.
                                            </p>
                                        )}
                                    </div>

                                    {extractedSkills.length > 0 && (
                                        <>
                                            <div className="my-4 border-t" />
                                            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Extracted Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {extractedSkills.map((skill, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            )}
        </div>
    )
}
