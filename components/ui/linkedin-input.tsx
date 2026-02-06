// components/ui/linkedin-input.tsx

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Linkedin,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Info,
  ClipboardPaste,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface LinkedInInputProps {
  onSkillsExtracted: (data: {
    skills: string[]
    experience: string[]
    education: string
    name: string
    headline: string
  }) => void
}

export function LinkedInInput({ onSkillsExtracted }: LinkedInInputProps) {
  const [pastedText, setPastedText] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [error, setError] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)
  const [result, setResult] = useState<{
    name: string
    headline: string
    skills: string[]
    experience: string[]
    education: string
  } | null>(null)

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setPastedText(text)
      setError("")
    } catch {
      setError("Could not access clipboard. Please paste manually using Ctrl+V")
    }
  }

  const handleExtract = async () => {
    if (!pastedText.trim()) {
      setError("Please paste your LinkedIn profile content")
      return
    }

    if (pastedText.length < 100) {
      setError("Text is too short. Please copy your complete LinkedIn profile.")
      return
    }

    setIsExtracting(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinText: pastedText })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract data")
      }

      const extractedResult = {
        name: data.name || "",
        headline: data.headline || "",
        skills: data.skills || [],
        experience: data.experience || [],
        education: data.education || ""
      }

      setResult(extractedResult)
      onSkillsExtracted(extractedResult)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract data")
    } finally {
      setIsExtracting(false)
    }
  }

  const clearAll = () => {
    setPastedText("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Linkedin className="h-5 w-5 text-[#0A66C2]" />
          <Label className="text-base font-medium">Import from LinkedIn</Label>
          <Badge className="text-xs bg-green-500 text-white">100% FREE</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInstructions(!showInstructions)}
          className="text-xs gap-1"
        >
          How to use
          {showInstructions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>

      {/* Instructions */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  How to Copy Your LinkedIn Profile
                </h4>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">1</span>
                    <span>
                      Open your LinkedIn profile
                      <a
                        href="https://www.linkedin.com/in/me/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline ml-1 inline-flex items-center gap-1"
                      >
                        (Click here) <ExternalLink className="h-3 w-3" />
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">2</span>
                    <span>Scroll down to see all sections (About, Experience, Skills)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">3</span>
                    <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+A</kbd> to select all</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">4</span>
                    <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+C</kbd> to copy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium shrink-0">5</span>
                    <span>Click "Paste from Clipboard" below or press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+V</kbd></span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paste Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handlePasteFromClipboard}
          className="gap-2"
          disabled={isExtracting}
        >
          <ClipboardPaste className="h-4 w-4" />
          Paste from Clipboard
        </Button>
        {pastedText && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Text Area */}
      <Textarea
        placeholder="Paste your LinkedIn profile content here...

Example:
John Doe
Full Stack Developer at Google
San Francisco Bay Area

About
Passionate developer with 5+ years of experience...

Experience
Senior Software Engineer
Google · Full-time
Jan 2022 - Present

Skills
JavaScript · React · Node.js · Python · AWS..."
        value={pastedText}
        onChange={(e) => {
          setPastedText(e.target.value)
          setError("")
        }}
        rows={8}
        className="font-mono text-sm"
        disabled={isExtracting}
      />

      {/* Character Count & Extract Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {pastedText.length > 0 ? `${pastedText.length} characters` : "Paste your profile content"}
        </span>
        <Button
          onClick={handleExtract}
          disabled={isExtracting || pastedText.length < 50}
          className="gap-2"
        >
          {isExtracting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Extracting with AI...
            </>
          ) : (
            <>
              Generate Analysis
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <span className="text-sm text-red-600">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="p-4 space-y-4">
                {/* Success Header */}
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Extracted Successfully!</span>
                </div>

                {/* Profile Info */}
                {(result.name || result.headline) && (
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      {result.name && <div className="font-semibold">{result.name}</div>}
                      {result.headline && <div className="text-sm text-muted-foreground">{result.headline}</div>}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {result.skills.length > 0 && (
                  <div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <span className="text-sm font-medium">Skills ({result.skills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.skills.slice(0, 15).map((skill, i) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <Badge variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                      {result.skills.length > 15 && (
                        <Badge variant="outline" className="text-xs">
                          +{result.skills.length - 15} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {result.experience.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Experience</span>
                    </div>
                    <div className="space-y-1">
                      {result.experience.slice(0, 3).map((exp, i) => (
                        <div key={i} className="text-xs text-muted-foreground">• {exp}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {result.education && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Education</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{result.education}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}