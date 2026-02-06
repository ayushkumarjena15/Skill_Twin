"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { getProfile, updateProfile, deleteUserAccount, uploadAvatar } from "@/lib/db"
import { BackButton } from "@/components/ui/back-button"
import {
  User,
  Mail,
  Github,
  Save,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Camera,
  Trash2,
  AlertTriangle
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { StreakCounter } from "@/components/streak-counter"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { user, session, signOut } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github_username: "",
    avatar_url: ""
  })

  useEffect(() => {
    if (user) {
      // Load profile data
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      const { data: profile, error } = await getProfile(user.id)

      if (profile) {
        setFormData({
          name: profile.name || user.user_metadata?.name || "",
          email: profile.email || user.email || "",
          github_username: profile.github_username || "",
          avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || ""
        })
      } else {
        // Profile might not exist yet, use auth data
        setFormData({
          name: user.user_metadata?.name || "",
          email: user.email || "",
          github_username: "",
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || ""
        })
      }
    } catch (err) {
      console.error("Error loading profile:", err)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file size (e.g., 2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const { data, error: uploadError } = await uploadAvatar(user.id, file)

      if (uploadError) {
        throw uploadError
      }

      if (data?.publicUrl) {
        setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }))
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
      }
    } catch (err: any) {
      console.error("Avatar upload error:", err)
      setError(err.message || "Failed to upload avatar. Make sure a 'profiles' bucket exists in Supabase Storage.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError("")
    setIsSaved(false)

    try {
      const { error } = await updateProfile(user.id, {
        name: formData.name,
        github_username: formData.github_username
      })

      if (error) throw error

      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    setIsDeleting(true)
    setError("")

    try {
      // 1. Delete data from DB
      await deleteUserAccount(user.id)

      // 2. Delete user from Auth (via API route)
      const response = await fetch("/api/auth/delete-user", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fully delete account auth records")
      }

      // 3. Sign out locally
      await signOut()

      // 4. Redirect
      router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete account")
      setIsDeleting(false)
    }
  }

  const avatarUrl = formData.avatar_url
  const initials = formData.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <motion.div
                initial={{ scale: 0.5, opacity: 0, boxShadow: "0 0 0px rgba(139, 92, 246, 0)" }}
                animate={{
                  scale: [0.5, 1.2, 0.9, 1.1, 1],
                  opacity: [0, 1, 0.7, 1, 1],
                  rotate: [0, -10, 10, -5, 0],
                  boxShadow: [
                    "0 0 0px rgba(139, 92, 246, 0)",
                    "0 0 30px rgba(139, 92, 246, 0.8)",
                    "0 0 15px rgba(139, 92, 246, 0.5)",
                    "0 0 25px rgba(139, 92, 246, 0.6)",
                    "0 0 20px rgba(139, 92, 246, 0.4)"
                  ]
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{
                  rotate: 10,
                  scale: 1.1,
                  boxShadow: "0 0 35px rgba(139, 92, 246, 0.8)"
                }}
                className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20"
              >
                <img src="/logo.png" alt="SkillTwin Logo" className="w-full h-full object-cover" />
              </motion.div>
              <span className="font-bold text-xl group-hover:text-primary transition-colors">SkillTwin</span>
            </Link>

            <div className="flex items-center gap-3">
              <StreakCounter />
              <ThemeToggle />
              <BackButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Title */}
          <div className="mb-8 font-outfit">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <Card className="border-border/50 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
            <CardHeader className="-mt-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={formData.name}
                      className={`w-24 h-24 rounded-full object-cover border-4 border-background shadow-xl ${isUploading ? 'opacity-50' : ''}`}
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-xl ${isUploading ? 'opacity-50' : ''}`}>
                      {initials}
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  )}
                  <button
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all border-2 border-background shadow-lg group disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="text-center sm:text-left flex-grow pb-2">
                  <CardTitle className="text-2xl">{formData.name || "Your Name"}</CardTitle>
                  <CardDescription className="flex items-center gap-1 justify-center sm:justify-start">
                    <Mail className="h-3 w-3" />
                    {formData.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-3 border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Success Message */}
              {isSaved && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 text-green-500 text-sm flex items-center gap-3 border border-green-500/20 animate-in fade-in slide-in-from-top-1">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase font-bold tracking-wider text-muted-foreground ml-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 h-12 rounded-xl bg-muted/30 focus:bg-background transition-all"
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase font-bold tracking-wider text-muted-foreground ml-1">Email Address</Label>
                  <div className="relative opacity-70">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 h-12 rounded-xl bg-muted"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-1 italic">
                    Connected email cannot be changed
                  </p>
                </div>

                {/* GitHub Username */}
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-xs uppercase font-bold tracking-wider text-muted-foreground ml-1 text-primary">GitHub Profile</Label>
                  <div className="relative group">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="github"
                      type="text"
                      placeholder="Enter your github username"
                      value={formData.github_username}
                      onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                      className="pl-10 h-12 rounded-xl bg-muted/30 focus:bg-background transition-all border-primary/10"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-1">
                    Used to fetch and analyze your technical projects
                  </p>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        UPDATING PROFILE...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        SAVE PROFILE
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Analytics & Info */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xl font-black">Active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Verified via {user?.app_metadata?.provider || "Email"}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Member Since</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-black">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">ID: {user?.id?.slice(0, 8)}...</p>
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-destructive/20">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Irreversible actions for your account security
              </p>
            </div>

            <Card className="border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-bold text-foreground">Delete Account Permanently</h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      This will erase your analysis history, saved jobs, and profile data from our servers. This action cannot be undone.
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="rounded-xl h-12 px-6 font-bold shadow-lg shadow-destructive/20 w-full sm:w-auto">
                        <Trash2 className="h-4 w-4 mr-2" />
                        DELETE ACCOUNT
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0A0A0B] border-white/10 rounded-[24px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                          <AlertTriangle className="h-6 w-6 text-destructive" />
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground text-lg">
                          This action is <span className="text-destructive font-bold underline">permanent</span>. All your data, including career growth history and saved job matches, will be completely wiped from SkillTwin.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-8 gap-4">
                        <AlertDialogCancel className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 h-12">
                          Keep Account
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12 font-bold px-8 shadow-lg shadow-destructive/20"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              DELETING...
                            </>
                          ) : (
                            "YES, DELETE EVERYTHING"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
