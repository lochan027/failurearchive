# Failure Archive

A research-grade platform for submitting and exploring failed projects, research, and ideas, where failures are treated as structured, reusable knowledge.

## Core Philosophy

**This is NOT a social network.**

- No likes, comments, followers, trending pages, or engagement metrics
- Failure is framed as invalidated assumptions, not personal shortcomings
- Every submission is shared under a clear, enforceable open license
- UX is neutral, academic, and precise

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth (Email + GitHub + Google)
- **AI:** OpenAI-compatible API for moderation and knowledge extraction

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (optional, for AI features)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- OAuth credentials (optional): `GITHUB_ID`, `GITHUB_SECRET`, `GOOGLE_ID`, `GOOGLE_SECRET`
- AI API (optional): `AI_API_KEY`, `AI_API_URL`

3. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Key Features

- **6 Failure Types:** Technical Project, Research Paper, Research Idea, Business Idea, Future Tech, AI Project
- **Structured Forms:** Hypothesis, Method, Failure Point, Key Misunderstanding, Evidence
- **Identity Modes:** Anonymous, Pseudonymous, Delayed Attribution (30/90/180 days)
- **Mandatory Licensing:** CC0 for text, MIT for code
- **Reuse System:** Mark failures as reused/avoided instead of commenting
- **AI Moderation:** Auto-scan for policy violations
- **Pre-Mortem Tool:** Analyze ideas against historical failures

## Database Management

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

## License

- **Codebase:** MIT License
- **Platform Content:** Text (CC0 1.0), Code (MIT)

This is a knowledge archive, not a startup showcase.

