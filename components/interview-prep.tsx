"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
    Bot,
    User,
    Send,
    Play,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Award,
    RefreshCw
} from "lucide-react"

interface InterviewPrepProps {
    jobRole: string
    skillGaps?: string[]
}

interface Question {
    text: string
    userAnswer?: string
    evaluation?: {
        score: number
        feedback: string
        improvedAnswer: string
    }
}

export function InterviewPrep({ jobRole, skillGaps = [] }: InterviewPrepProps) {
    const [started, setStarted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentAnswer, setCurrentAnswer] = useState("")
    const [evaluating, setEvaluating] = useState(false)
    const [finished, setFinished] = useState(false)

    const startInterview = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/interview/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobRole, skillGaps }),
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.error || "Failed to start interview")
            }

            const data = await res.json()
            setQuestions(data.questions.map((q: string) => ({ text: q })))
            setStarted(true)
        } catch (error: any) {
            toast.error(error.message || "Could not generate interview questions. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const submitAnswer = async () => {
        if (!currentAnswer.trim()) return

        setEvaluating(true)
        const currentQ = questions[currentIndex]

        try {
            const res = await fetch("/api/interview/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: currentQ.text,
                    userAnswer: currentAnswer,
                    jobRole
                }),
            })

            if (!res.ok) throw new Error("Failed to evaluate")

            const evaluation = await res.json()

            const updatedQuestions = [...questions]
            updatedQuestions[currentIndex] = {
                ...currentQ,
                userAnswer: currentAnswer,
                evaluation
            }
            setQuestions(updatedQuestions)

        } catch (error) {
            toast.error("Error evaluating answer.")
        } finally {
            setEvaluating(false)
        }
    }

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setCurrentAnswer("")
        } else {
            setFinished(true)
        }
    }

    const calculateAverageScore = () => {
        const scores = questions.map(q => q.evaluation?.score || 0)
        const total = scores.reduce((a, b) => a + b, 0)
        return Math.round(total / questions.length)
    }

    // --- RENDER STATES ---

    // 1. INTRO
    if (!started) {
        return (
            <div className="max-w-3xl mx-auto text-center space-y-8 py-8">
                <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full animate-pulse">
                        <Bot className="w-16 h-16 text-primary" />
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500 mb-4">
                        AI Mock Interviewer
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        I'll act as the Hiring Manager for the <span className="font-semibold text-foreground">{jobRole}</span> role.
                        I've analyzed your profile and will ask you 5 targeted technical questions based on your skill gaps.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
                    <Card className="bg-muted/50 border-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Send className="w-4 h-4 text-blue-500" /> Real-time
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                            Practice with dynamic questions generated just for you.
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/50 border-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Award className="w-4 h-4 text-orange-500" /> Scoring
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                            Get instant 0-10 scores and detailed feedback on every answer.
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/50 border-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Bot className="w-4 h-4 text-green-500" /> Coaching
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                            See how a senior engineer would answer the same question.
                        </CardContent>
                    </Card>
                </div>

                <Button size="lg" onClick={startInterview} disabled={loading} className="w-full md:w-auto min-w-[200px] h-14 text-lg">
                    {loading ? (
                        <>
                            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                            Preparing Interview...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-5 w-5" />
                            Start Interview
                        </>
                    )}
                </Button>
            </div>
        )
    }

    // 3. RESULTS SUMMARY
    if (finished) {
        const avgScore = calculateAverageScore()
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Interview Complete!</CardTitle>
                        <CardDescription>Here's how you performed</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="relative flex items-center justify-center w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-muted/30"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={377}
                                    strokeDashoffset={377 - (377 * avgScore) / 10}
                                    className={`transition-all duration-1000 ${avgScore >= 8 ? "text-green-500" : avgScore >= 5 ? "text-yellow-500" : "text-red-500"
                                        }`}
                                />
                            </svg>
                            <span className="absolute text-3xl font-bold">{avgScore}/10</span>
                        </div>
                        <p className="text-muted-foreground max-w-md text-center">
                            {avgScore >= 8 ? (
                                "Outstanding! You demonstrated strong technical knowledge. You're ready for the real thing."
                            ) : avgScore >= 5 ? (
                                "Good effort! You have the basics down, but there's room to deepen your understanding in some areas."
                            ) : (
                                "Keep practicing. Focus on the concepts where you struggled and try again."
                            )}
                        </p>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button onClick={() => {
                            setStarted(false)
                            setQuestions([])
                            setCurrentIndex(0)
                            setFinished(false)
                        }}>
                            Practice Again
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Question Review</h3>
                    {questions.map((q, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="bg-muted/30 py-3">
                                <div className="flex justify-between items-start gap-4">
                                    <span className="font-semibold text-sm">Q{i + 1}: {q.text}</span>
                                    <Badge variant={
                                        (q.evaluation?.score || 0) >= 8 ? "default" : (q.evaluation?.score || 0) >= 5 ? "secondary" : "destructive"
                                    }>
                                        Score: {q.evaluation?.score}/10
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground font-bold mb-1">Your Answer</p>
                                    <p className="text-sm bg-muted/30 p-2 rounded">{q.userAnswer}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground font-bold mb-1">Feedback</p>
                                    <p className="text-sm text-muted-foreground">{q.evaluation?.feedback}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    // 2. INTERVIEW ACTIVE
    const currentQ = questions[currentIndex]

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Question {currentIndex + 1} of {questions.length}</span>
                    <span>{Math.round(((currentIndex) / questions.length) * 100)}% Complete</span>
                </div>
                <Progress value={((currentIndex) / questions.length) * 100} className="h-2" />
            </div>

            <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Bot className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg leading-relaxed">{currentQ.text}</CardTitle>
                            <CardDescription className="mt-1">
                                Technical Interview Question • {jobRole}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* FEEDBACK MODE */}
                    {currentQ.evaluation ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className={`p-4 rounded-lg border flex gap-4 ${currentQ.evaluation.score >= 7 ? "bg-green-500/10 border-green-500/20" : "bg-yellow-500/10 border-yellow-500/20"
                                }`}>
                                <div className="shrink-0 flex flex-col items-center justify-center p-2 bg-background/50 rounded-lg min-w-[60px]">
                                    <span className="text-2xl font-bold">{currentQ.evaluation.score}</span>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Score</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Feedback</h4>
                                    <p className="text-sm text-muted-foreground">{currentQ.evaluation.feedback}</p>
                                </div>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    Model Answer (How a Senior Dev would answer)
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {currentQ.evaluation.improvedAnswer}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        /* INPUT MODE */
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Type your answer here... Be specific and explain your thought process."
                                className="min-h-[200px] text-base resize-none focus-visible:ring-primary p-4"
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {currentAnswer.length} characters
                            </p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="justify-between bg-muted/20 py-4">
                    {currentQ.evaluation ? (
                        <Button
                            className="ml-auto w-full md:w-auto font-semibold"
                            size="lg"
                            onClick={nextQuestion}
                        >
                            {currentIndex === questions.length - 1 ? "Finish Interview" : "Next Question"}
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            className="ml-auto w-full md:w-auto font-semibold"
                            disabled={!currentAnswer.trim() || evaluating}
                            size="lg"
                            onClick={submitAnswer}
                        >
                            {evaluating ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Evaluating...
                                </>
                            ) : (
                                <>
                                    Submit Answer
                                    <Send className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
