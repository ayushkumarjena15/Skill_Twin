# 🔥 SkillTwin — AI-Powered Career Navigator  
### *Turning Degrees into Job-Ready Skills*

**SkillTwin** is an AI-first career intelligence platform that bridges the brutal gap between **what students learn** and **what companies actually hire for**.

It builds a **digital Skill Twin** of a user by analyzing resumes, GitHub activity, and target job roles — then uses **state-of-the-art LLMs** to identify skill gaps and generate a **personalized, week-by-week roadmap** to become job-ready.

> 🎯 From confusion → clarity  
> 🎯 From degree → employability  

Built with ❤️ by **Team Liquid**.

---

## 🚨 The Problem

- Graduates leave college with **degrees, not employable skills**
- Curriculums update in **years**, industry skills change in **months**
- Students don’t know **what exactly they’re missing**
- Companies spend heavily retraining new hires

> **Education certifies completion. Industry demands capability.**  
> SkillTwin connects the two.

---

## ✨ What SkillTwin Does

- 🔍 Analyzes current skills (Resume + GitHub)
- 🎯 Matches users to real job roles
- 🧠 Detects exact skill gaps using AI
- 🗺️ Generates personalized learning roadmaps
- 💼 Recommends live jobs aligned to skills
- ⚡ Updates continuously as the market evolves

---

## 🧠 Core Features

### 🔍 AI Skill Gap Analysis  
Upload your resume (PDF) or manually enter skills. SkillTwin extracts, normalizes, and compares them against **real industry requirements** for your target role.

---

### 🗺️ Personalized AI Roadmaps  
Powered by **Groq (Llama-3 70B)**, SkillTwin generates **8–12 week actionable learning plans** — focused on *outcomes*, not generic courses.

---

### 🐙 GitHub Profile Intelligence  
SkillTwin goes beyond resumes:
- Repository analysis  
- Commit history  
- Activity & consistency  

This creates a **true developer skill profile**, not just self-reported claims.

---

### 💬 Real-Time Community Reviews  
Built with **Supabase Realtime**, users can post reviews that appear instantly on the homepage — building trust and social proof live.

---

### 💼 Live Job Matching  
Fetches relevant job listings via **RapidAPI**, dynamically aligned with a user’s **current and upcoming skills**.

---

### 🎨 Premium UI / UX  
- Glassmorphism design  
- Smooth animations using **Framer Motion**  
- Interactive hero effects (Aurora, Particles, Orbit)  
- Built to feel like a real AI product, not a demo

---

### 🔐 Secure Authentication  
Powered by **Supabase Auth**:
- Email  
- Google  
- GitHub  

Secure, scalable, production-ready.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**, TSParticles

### Backend & Infrastructure
- **Supabase** (PostgreSQL, Auth, Realtime, Storage)

### AI Stack
- **Groq Cloud (Llama-3 70B)** — Roadmap Generation  
- **Google Gemini** — Analysis & Chat  
- **Ollama** — Optional Local AI

### Integrations
- **GitHub API** — Developer analysis  
- **RapidAPI** — Job listings  
- **Resend** — Email notifications

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+**
- npm or pnpm
- Supabase project
- API keys for Groq, Gemini, RapidAPI

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/skilltwin.git
cd skilltwin