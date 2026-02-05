import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import "@/app/globals.css" // Ensure this path is correct, might need to be just "./globals.css" if moved back

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkillTwin - Bridge the Gap Between Education & Employment",
  description: "AI-powered skill gap analyzer that creates personalized bridge-course roadmaps for students.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}