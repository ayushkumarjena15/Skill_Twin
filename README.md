# SkillTwin - AI-Powered Career Navigator 🚀

**SkillTwin** is a cutting-edge, AI-driven platform designed to bridge the gap between education and employment. It analyzes a user's current skills (via resume upload or manual input), compares them against target job roles, identifying skill gaps, and generates a personalized, week-by-week learning roadmap using advanced LLMs.

Built by **Team Liquid**.

![SkillTwin Banner](/public/hero-image.png) *(Replace with actual screenshot if available)*

---

## ✨ Key Features

-   **🔍 AI Skill Gap Analysis**: extract skills from resumes (PDF) and compare them with industry standards for target roles.
-   **🗺️ Personalized AI Roadmaps**: Generates detailed, week-by-week learning paths using **Groq (Llama 3)** to bridge identified skill gaps.
-   **🐙 GitHub Profile Analysis**: Integrates with GitHub to analyze code quality, repository stats, and commit history to build a comprehensive developer profile.
-   **💬 Real-Time Community Reviews**: Live, ticker-style review system powered by **Supabase Realtime**, allowing users to share feedback instantly.
-   **emploi Live Job Matching**: Fetches relevant job openings (via RapidAPI) that match the user's growing skill set.
-   **🎨 Dynamic UI/UX**: Features glassmorphism, smooth animations (**Framer Motion**), and interactive hero sections (Aurora, Particles, Orbit).
-   **🔐 Secure Authentication**: Robust user management using **Supabase Auth** (Email, Google, GitHub).

---

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/), TSParticles
-   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Realtime, Storage)
-   **AI & ML**:
    -   **Groq Cloud** (Llama 3-70b) - *Primary Roadmap Engine*
    -   **Google Gemini** - *Analysis & Chat*
    -   **Ollama** - *Local AI Support (Optional)*
-   **APIs**:
    -   **GitHub API** - *Profile Data*
    -   **RapidAPI** - *Job Listings*
    -   **Resend** - *Email Notifications*

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   **Node.js** (v18 or higher)
-   **npm** or **pnpm**
-   A **Supabase** project
-   API Keys for Groq, Gemini, and RapidAPI

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skilltwin.git
cd skilltwin
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add the following variables:

```env
# --- Supabase Configuration ---
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# --- AI Providers ---
# Groq (Used for Roadmap Generation)
GROQ_API_KEY=gsk_...

# Google Gemini (Used for Analysis)
GEMINI_API_KEY=AIza...

# Ollama (Local AI - Optional)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral

# --- External Services ---
# GitHub (For Profile Analysis)
GITHUB_TOKEN=ghp_...

# RapidAPI (For Job Search)
RAPIDAPI_KEY=...

# Resend (For Emails)
RESEND_API_KEY=re_...
```

### 4. Database Setup (Supabase)

To enable the **Real-Time Reviews** feature and other functionalities, run the following SQL queries in your Supabase SQL Editor:

**Enable Reviews Table & Realtime:**

```sql
-- Create Reviews Table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  designation text default 'Student',
  rating integer not null check (rating >= 1 and rating <= 5),
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Security & Realtime
alter table public.reviews enable row level security;
alter publication supabase_realtime add table public.reviews;

-- Open Access Policies (Adjust for production)
create policy "Reviews are public" on public.reviews for select using (true);
create policy "Anyone can submit reviews" on public.reviews for insert with check (true);
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
├── app/
│   ├── api/            # Next.js API Routes (Roadmap Gen, Reviews, etc.)
│   ├── dashboard/      # User Dashboard (Analysis Results)
│   ├── roadmap/        # Personalized Roadmap Page
│   └── page.tsx        # Landing Page
├── components/
│   ├── landing/        # Landing page sections (Hero, Features, Reviews)
│   ├── ui/             # Reusable UI components (Buttons, Dialogs, etc.)
│   └── ...
├── lib/
│   ├── db.ts           # Database helper functions
│   ├── supabase.ts     # Supabase client configuration
│   └── utils.ts        # Utility functions
├── public/             # Static assets (images, icons)
└── ...
```

---

## 💡 How It Works

1.  **Sign Up/Login**: Create an account via email or GitHub.
2.  **Input Profile**: Upload your resume or manually enter your target role (e.g., "Full Stack Developer") and current skills.
3.  **Get Analysis**: The AI analyzes your profile against the target role.
4.  **Generate Roadmap**: Click "Generate AI Plan". The system uses Llama 3 (via Groq) to build a custom 8-12 week learning plan.
5.  **Track Progress**: Mark milestones as complete as you learn.
6.  **Community**: Leave a review and see it appear live on the homepage!

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Made with ❤️ by Team Liquid**
