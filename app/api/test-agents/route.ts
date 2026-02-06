
import { NextResponse } from "next/server"

export async function GET() {
    const results = {
        ollama: { status: "unknown", message: "" },
        groq: { status: "unknown", message: "" },
        gemini: { status: "unknown", message: "" },
        github: { status: "unknown", message: "" },
        rapidApi: { status: "unknown", message: "" }
    }

    // 1. Check Ollama
    try {
        const host = process.env.OLLAMA_HOST || "http://localhost:11434"
        const res = await fetch(`${host}/api/tags`)
        if (res.ok) {
            results.ollama = { status: "operational", message: "Connected to Ollama" }
        } else {
            results.ollama = { status: "error", message: `HTTP ${res.status}` }
        }
    } catch (error: any) {
        results.ollama = { status: "failed", message: "Could not connect. Is Ollama running?" }
    }

    // 2. Check Groq
    try {
        const apiKey = process.env.GROQ_API_KEY
        if (!apiKey) {
            results.groq = { status: "missing_key", message: "GROQ_API_KEY not set" }
        } else {
            // Minimal call
            const res = await fetch("https://api.groq.com/openai/v1/models", {
                headers: { Authorization: `Bearer ${apiKey}` }
            })
            if (res.ok) {
                results.groq = { status: "operational", message: "Connected to Groq API" }
            } else {
                const err = await res.json()
                results.groq = { status: "error", message: JSON.stringify(err) }
            }
        }
    } catch (error: any) {
        results.groq = { status: "failed", message: error.message }
    }

    // 3. Check Gemini
    try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            results.gemini = { status: "missing_key", message: "GEMINI_API_KEY not set" }
        } else {
            // Minimal probing is harder with Gemini URL structure requiring models, but we can verify the key existence effectively. 
            // Or try a list models call if available, or just a dummy generate.
            const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
            const res = await fetch(url)
            if (res.ok) {
                results.gemini = { status: "operational", message: "Connected to Gemini API" }
            } else {
                const err = await res.json()
                results.gemini = { status: "error", message: `HTTP ${res.status}: ${JSON.stringify(err)}` }
            }
        }
    } catch (error: any) {
        results.gemini = { status: "failed", message: error.message }
    }

    // 4. Check GitHub
    try {
        // Not strictly required for all features, but good to check
        const token = process.env.GITHUB_ACCESS_TOKEN
        // We can hit public API without token, but with token is better. 
        const headers: HeadersInit = { "User-Agent": "SkillTwin" }
        if (token) headers["Authorization"] = `token ${token}`

        const res = await fetch("https://api.github.com/zen", { headers })
        if (res.ok) {
            results.github = { status: "operational", message: token ? "Authenticated" : "Public Access (Rate limits lower)" }
        } else {
            results.github = { status: "error", message: `HTTP ${res.status}` }
        }
    } catch (error: any) {
        results.github = { status: "failed", message: error.message }
    }

    // 5. Short check on RapidAPI (JSearch)
    try {
        const apiKey = process.env.RAPID_API_KEY
        if (!apiKey) {
            results.rapidApi = { status: "missing_key", message: "RAPID_API_KEY not set" }
        } else {
            // Just verifying key presence mostly, actual call costs quota
            results.rapidApi = { status: "configured", message: "Key present (Skipping quota usage)" }
        }
    } catch (error) { }


    return NextResponse.json(results)
}
