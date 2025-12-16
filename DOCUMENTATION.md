# Failure Archive - Complete Documentation

## Overview

Failure Archive is a research-grade platform for submitting and exploring failed projects, research, and ideas. It treats failures as structured, reusable knowledge rather than social content.

## Core Principles

1. **NOT a Social Network**
   - No likes, comments, followers, or trending pages
   - No engagement metrics or gamification
   - Pure knowledge repository

2. **Structured Knowledge**
   - Every failure follows a rigorous format
   - Hypothesis → Method → Failure Point → Key Misunderstanding
   - Evidence-based submissions

3. **Open by Default**
   - All text: CC0 1.0 (Public Domain)
   - All code: MIT License
   - Mandatory license acceptance on submission

4. **Academic Design**
   - Neutral, minimal UI
   - Focus on clarity and readability
   - No animations for engagement

## Features

### Authentication & Identity

**Login Methods:**
- Email/password
- GitHub OAuth
- Google OAuth
- Anonymous submission token

**Identity Modes:**
- `ANONYMOUS` - No attribution
- `PSEUDONYMOUS` - Display as "FA-XXXX"
- `DELAYED_30/90/180` - Attribution after 30/90/180 days
- `ATTRIBUTED` - Full attribution

### Failure Record Types

1. **Technical Project**
   - GitHub repository required
   - Architecture and stack details
   - Where it broke
   - Invalidated assumptions

2. **Research Paper (Negative Result)**
   - PDF upload
   - Hypothesis and method
   - Why negative result matters
   - Research-grade evidence

3. **Research Idea (Pre-Mortem)**
   - Why unlikely to work today
   - Missing theory/data/tooling
   - Weakest assumptions

4. **Business Idea**
   - Target user and value proposition
   - Failed assumptions:
     - Market size
     - User behavior
     - Distribution
     - Cost structure
     - Timing

5. **Future Tech Idea**
   - Vision description
   - Blocking limitations
   - Required breakthroughs
   - Why current tech insufficient

6. **AI Project**
   - Model and data details
   - Evaluation method
   - Where generalization failed
   - Why scaling didn't help

### Structured Failure Form

**Required Fields:**
- **Hypothesis**: "We believed ___ would work because ___"
- **Method**: What was built or tested
- **Failure Points** (multi-select):
  - Assumption invalidated
  - Data bias
  - Technical ceiling
  - User behavior mismatch
  - Market illusion
  - Timing mismatch
  - Scaling failure
  - Distribution failure
  - Cost structure
- **Key Misunderstanding**: "We assumed ___, but reality was ___"
- **Salvageable Knowledge**: What can others reuse?

**Evidence Levels:**
- `NONE` - No supporting evidence
- `ANECDOTAL` - Personal experience
- `METRICS` - Data-backed
- `RESEARCH_GRADE` - Rigorous methodology
- `REPRODUCIBLE` - Can be independently verified

### Gallery

**NOT a Feed** - Card-based gallery with:

**Filters:**
- Failure type
- Domain (ML, Healthcare, Web3, etc.)
- Failure mechanism
- Evidence level
- Stage (idea, prototype, scale)

**Sorting:**
- Most reused
- Most referenced
- Newest
- By relevance (when searching)

### Reuse System

Instead of comments, users can:

1. **Mark as Reused** (↻)
   - Built upon this failure
   - Learned from the approach

2. **Mark as Avoided** (✓)
   - Prevented making same mistake
   - Changed direction based on this

3. **Mark as Referenced** (📚)
   - Cited in research
   - Used in documentation

**Private Notes:**
- Each reuse can have private notes
- Only visible to the user who marked it
- No public discussion threads

### Dashboard

**GitHub-Inspired Layout:**

**My Submissions:**
- Published failures with stats
- View reuse counts
- Track impact

**Drafts:**
- Incomplete submissions
- Continue editing

**Archived / Withdrawn:**
- Removed submissions
- Historical record

**Reuse Notifications:**
- "Your failure was reused"
- "Your failure was avoided"
- "Your failure was referenced"
- No social notifications

**Stats (NOT Gamified):**
- Total submissions
- Times reused
- Times avoided
- Times referenced

### AI Features

**Moderation (Automatic):**
Scans for:
- Illegal content
- Malware links
- Scam patterns
- Hate or harassment
- Plagiarism risk
- Fake citations

Flagged submissions go to manual review.

**Knowledge Extraction (Background):**
- Normalizes hypotheses
- Auto-generates taxonomy tags
- Identifies similar failures
- Extracts common patterns

**Pre-Mortem Tool:**
Input: Your idea
Output:
- Related historical failures
- Common failure patterns
- Likely invalid assumptions
- Risk level (LOW/MEDIUM/HIGH)
- Actionable recommendations

## API Routes

### Authentication
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

### Submissions
- `POST /api/submissions` - Create submission
- `GET /api/submissions` - List submissions (with filters)
- `GET /api/submissions/[id]` - Get single submission

### Reuse
- `POST /api/reuse` - Mark failure as reused/avoided
- `GET /api/reuse` - Get user's reuse records

### Dashboard
- `GET /api/dashboard` - Get user dashboard data

### Pre-Mortem
- `POST /api/premortem` - Analyze an idea

## Database Schema

**Key Models:**

**User:**
- Email, password, OAuth accounts
- Sessions
- Submissions and reuse records

**FailureRecord:**
- Type, status, identity mode
- Structured fields (hypothesis, method, etc.)
- Evidence level
- Domain and tags
- Reuse counters

**ReuseRecord:**
- Links user to failure
- Type (reused/avoided/referenced)
- Private notes

**ReuseNotification:**
- Notifies authors of reuse
- Read/unread status

**ModerationRecord:**
- AI scan results
- Manual review notes
- Status and flags

**AIKnowledgeExtraction:**
- Normalized hypothesis
- Auto-generated tags
- Similar failure IDs
- Common patterns

## Environment Variables

### Required
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### Optional - OAuth
```
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_ID=""
GOOGLE_SECRET=""
```

### Optional - AI
```
AI_API_KEY="sk-..."
AI_API_URL="https://api.openai.com/v1"
```

## Development Workflow

### 1. Setup
```bash
npm install
cp .env.example .env
# Edit .env with your values
npx prisma generate
npx prisma db push
```

### 2. Development
```bash
npm run dev
# Open http://localhost:3000
```

### 3. Database Management
```bash
npx prisma studio  # Visual database editor
npx prisma generate  # Regenerate client
npx prisma db push  # Push schema changes
```

### 4. Type Checking
```bash
npm run build  # Check for TypeScript errors
```

## Deployment

### Prerequisites
1. PostgreSQL database (Supabase, Neon, Railway, etc.)
2. Node.js hosting (Vercel, Railway, Fly.io, etc.)

### Steps
1. Set production environment variables
2. Run database migrations: `npx prisma db push`
3. Build application: `npm run build`
4. Deploy to hosting platform

### Recommended: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

## Design System

### Colors
```css
--background: #fafafa (light) / #0a0a0a (dark)
--foreground: #1a1a1a (light) / #ededed (dark)
--border: #e5e5e5 (light) / #262626 (dark)
--muted: #737373 (light) / #a3a3a3 (dark)
--accent: #3b82f6 (blue)
--destructive: #dc2626 (red)
```

### Typography
- Font: System font stack
- Base size: 15px
- Line height: 1.6
- Headings: 600 weight, -0.025em letter-spacing

### Components
- Buttons: Minimal, border-based
- Forms: Simple, clear labels
- Cards: Border-based, no shadows
- No animations (except 0.1s transitions)

## License

**Codebase:** MIT License

**Platform Content:**
- Text: CC0 1.0 (Public Domain)
- Code: MIT License

## Philosophy

> Failure is not a personal shortcoming. It is an invalidated assumption.

This platform exists to:
1. Normalize failure as a learning mechanism
2. Structure failures as reusable knowledge
3. Prevent repeated mistakes
4. Advance research through negative results
5. Build a comprehensive failure taxonomy

**This is a knowledge archive, not a startup showcase.**
