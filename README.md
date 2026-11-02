# KnowMe — Your friends know you. But HOW well?

A complete, modern, social quiz web application inspired by the concept of BlockTest.me. **KnowMe** lets users create personalized quizzes about their habits, secrets, bucket lists, and favorites, share unique unguessable links with friends, and discover who actually knows them best via real-time scoreboards, live leaderboards, and detailed analytics.

---

## 🚀 Key Features

- **Personalized Quiz Studio**:
  - Creators can enter display name, custom title, description, and select aesthetic themes (*Midnight Violet*, *Cyber Pink*, *Ocean Breeze*, *Sunset Glow*, *Emerald Night*).
  - Add, edit, delete, and re-order multiple-choice (2–6 choices) and true/false questions.
  - Interactive **Sample Question Library** with one-click presets covering favorite foods, dream destinations, irrational fears, hobbies, and catchphrases.
  - Live participant preview before publishing.
  - Configurable settings: anonymous answers, answer reviews, retakes, and public vs. private leaderboards.
- **Frictionless Friend Experience**:
  - Friends do **not** need an account to play! They simply enter their name (or choose anonymous mode) and start playing immediately.
  - Single question flow with animated progress bar, responsive touch buttons, and answer state preservation.
- **Server-Side Scoring & Anti-Cheating**:
  - The answer key is **never exposed** in client HTML or public quiz payloads.
  - A secure PostgreSQL database function (`submit_quiz_answers`) calculates points, percentages, and saves submission answers on the server.
- **Podium Leaderboards & Analytics**:
  - Real-time leaderboard with Gold, Silver, and Bronze badges for 1st, 2nd, and 3rd place.
  - Highlights the current player's row upon completion.
  - Creator analytics dashboard displaying total attempts, average score, score distribution charts, most-missed questions, and individual participant breakdowns.
- **Viral Social Sharing**:
  - One-tap WhatsApp sharing with custom challenge copy.
  - Web Share API integration with automatic fallback to clipboard copy.
  - Score card sharing ("I scored 8/10 on Alex's KnowMe quiz! Can you beat my score?").
- **Celebratory Confetti & Score Messages**:
  - Dynamic score tier messages (from *"Best Friend Material!"* to *"Do You Even Know This Person?"*).
  - Confetti burst on top scores.
- **Dual-Engine Persistence**:
  - Connects seamlessly to **Supabase PostgreSQL** with full Row Level Security (RLS) when credentials are provided in `.env`.
  - When keys are not yet configured, automatically operates in **Local Simulation Mode** with pre-seeded playable quizzes so users can test all features right out of the box!

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Styling & Design** | Tailwind CSS + Glassmorphism + Custom Radial Gradients |
| **Icons** | Lucide React |
| **Routing** | React Router v7 |
| **Forms & Validation** | React Hook Form + Zod |
| **Notifications** | Custom Toast Notification Context (Glowing alert popups) |
| **Effects** | Canvas Confetti |
| **Backend & Database** | Supabase (PostgreSQL with Row Level Security & RPC Stored Procedures) |
| **Deployment** | Vercel Compatible |

---

## 📋 Prerequisites

- **Node.js**: v20.18.0 or later (LTS recommended)
- **NPM**: v10+ or equivalent package manager
- *(Optional)* A free **Supabase** account (for cloud PostgreSQL backend)

---

## ⚡ Quick Start & Development Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/knowme.git
cd knowme
npm install
```

### 2. Configure Environment Variables

Copy the example environment template:

```bash
cp .env.example .env
```

Open `.env` in your text editor:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Note**: If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are left blank, KnowMe automatically runs in **Local High-Fidelity Mode**, allowing you to test quiz creation, taking, scoring, leaderboards, and dashboard metrics without cloud configuration.

### 3. Run Development Server

```bash
npm run dev
```

The application will be live at `http://localhost:5173/`.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

To use your live Supabase cloud database:

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project (e.g. `knowme-db`).
3. Navigate to **SQL Editor** in the left sidebar.
4. Click **New Query**, open the file `supabase/schema.sql` from this repository, copy its entire contents, and paste it into the editor.
5. Click **Run**.
6. This script creates:
   - `profiles` table (synced automatically with `auth.users` on signup)
   - `quizzes` table with custom themes and visibility settings
   - `questions` table (with `correct_answer` protected by RLS)
   - `submissions` & `submission_answers` tables
   - `get_quiz_for_taking(p_slug)` RPC function (hides correct answers)
   - `submit_quiz_answers(...)` RPC function (trusted server-side scoring)
   - Row Level Security (RLS) policies
7. Copy your **Project URL** and **Anon API Key** from **Project Settings -> API** and add them to your `.env` file.

---

## 🧪 Testing the End-to-End Workflow

1. **Sign Up / Log In**:
   - Go to `http://localhost:5173/signup` or click **Sign Up** in the header.
   - Enter your name (e.g., `Ruturaj`), email, and password.
2. **Create a Quiz**:
   - Navigate to `/create`.
   - Set title (e.g., `How Well Do You Know Ruturaj?`).
   - Select your theme and customize questions (use the **Sample Questions Library** for instant inspiration).
   - Click the green radio checkmark on each option to mark your true answer.
   - Click **Publish Quiz**.
3. **Share the Link**:
   - Copy the generated URL (`http://localhost:5173/quiz/[unique-slug]`).
   - Test sharing via WhatsApp or copying the link.
4. **Take the Quiz as a Friend**:
   - Open the link in an incognito window or second browser tab.
   - Enter a friend's nickname (e.g., `Jessica`).
   - Answer the questions and click **Submit Quiz**.
5. **View Results & Leaderboard**:
   - Observe the score card, percentage, custom result message, and celebratory confetti.
   - Inspect the real-time leaderboard with Jessica placed in 1st place!
6. **Creator Analytics**:
   - Return to your creator dashboard at `/dashboard` to view updated metrics.
   - Click the **Analytics** icon to inspect score distribution charts and question-by-question accuracy.

---

## 🌐 Deploying to Vercel

KnowMe is configured for seamless deployment to Vercel:

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Framework Preset to **Vite**.
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

For single-page routing on Vercel, a `vercel.json` rewrite file is included:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🔒 Security Best Practices

- **Never Commit Secrets**: Do not commit `.env` or service role keys.
- **Strict Client-Side Sanitization**: Answers and participant nicknames are validated against Zod schemas.
- **Server Scoring**: The client never calculates its own score; all point evaluation happens inside the PostgreSQL function `submit_quiz_answers`.
- **Private Leaderboard Option**: Creators can set their leaderboard to `creator_only`, which uses RLS to hide scores from unauthorized visitors.

---

## 📄 License

This project is licensed under the MIT License.
