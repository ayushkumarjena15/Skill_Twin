"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

interface ScrollLinkProps {
    href: string
    children: React.ReactNode
    className?: string
}

export function ScrollLink({ href, children, className }: ScrollLinkProps) {
    const router = useRouter()
    const pathname = usePathname()

    const scrollToElement = (sectionId: string, retries = 0) => {
        const element = document.getElementById(sectionId)
        if (element) {
            // Add offset for fixed navbar
            const offset = 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            })
        } else if (retries < 10) {
            // Retry if element not found (page might still be loading)
            setTimeout(() => scrollToElement(sectionId, retries + 1), 100)
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Check if it's a hash link (e.g., /#features, /#faq, /#how-it-works)
        if (href.startsWith("/#")) {
            e.preventDefault()
            const sectionId = href.substring(2) // Remove "/#" to get the section ID

            // If we're already on the home page, just scroll
            if (pathname === "/") {
                scrollToElement(sectionId)
            } else {
                // If we're on a different page, navigate to home first, then scroll
                router.push("/")
                // Wait for navigation to complete, then scroll with retry mechanism
                setTimeout(() => {
                    scrollToElement(sectionId)
                }, 300)
            }
        }
        // For regular links, let Next.js handle it normally
    }

    return (
        <Link href={href} onClick={handleClick} className={className}>
            {children}
        </Link>
    )
}
