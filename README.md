# Job Tracker — Thong Hao Hong

A personal job application tracking dashboard built with Next.js, Supabase and NextAuth. Access restricted to haohong0127@gmail.com via Google OAuth.

## Pages

- **Overview** — stats, charts, recent applications
- **Applications** — full table with live status updates
- **Companies** — research briefings for every company applied to
- **Interview Prep** — anticipated questions and suggested answers, filterable by company and category
- **Skills** — full skill snapshot from profile, add new skills anytime

## Setup in 5 steps

### 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `job-applicator.skill → references/supabase-schema.sql`
3. Copy your **Project URL** and **anon key** from Settings → API

### 2. Set up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Enable the **Google+ API**
4. Go to **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorised redirect URIs: add `https://your-app.vercel.app/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Supabase URL, anon key, Google credentials and a random NextAuth secret (`openssl rand -base64 32`).

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL   # set to your https://your-app.vercel.app URL
```

### 5. Update Google OAuth redirect URI

After deploying, go back to Google Cloud Console and add your Vercel URL to the authorised redirect URIs.

## Local development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Seeding your skills

On first visit to the Skills page, click **Load from Profile** to seed all 40+ skills from your resume in one click. You can then update proficiency levels or add new skills as you learn them.

## How the job-applicator skill populates this dashboard

When you use the `job-applicator` Cowork skill to apply for jobs, it automatically logs to:
- `companies` — company research and briefings
- `applications` — role, status, cover letter used
- `interview_prep` — 10 anticipated questions per application

The dashboard reads these in real time. No manual entry needed.
