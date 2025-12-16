# Failure Archive 🚀

A research-grade platform for documenting, sharing, and learning from failed projects, experiments, and ideas. Turn your failures into structured, reusable knowledge that helps others avoid the same mistakes.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

### Core Functionality
- **Structured Failure Documentation** - Template-based submission forms with type-specific fields
- **Multiple Submission Types** - Research papers, technical projects, business ideas, AI projects, research ideas, future tech concepts
- **Smart Identity Modes** - Anonymous, pseudonymous, attributed, or time-delayed attribution
- **Rich Metadata** - Domain tags, failure points, evidence levels, and salvageable knowledge extraction
- **Public Gallery** - Browse, filter, and search through documented failures
- **Personal Dashboard** - Track your submissions and their impact

### Authentication & Security
- **OAuth Integration** - Sign in with GitHub or Google
- **Session Management** - Secure NextAuth.js implementation
- **Role-based Access** - Public viewing, authenticated submission, author-only editing

### Advanced Features
- **AI-Powered Moderation** - Automated content screening (optional)
- **Knowledge Extraction** - AI-assisted insights from failure reports (optional)
- **Type-Specific Forms** - Custom fields for each failure type (research journals, tech stacks, business models, etc.)
- **File Uploads** - PDF support for research papers
- **Reusability Tracking** - Mark failures as "learned from" to track impact

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 5.22
- **Authentication:** NextAuth.js 4
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (we recommend [Neon](https://neon.tech))
- GitHub OAuth App ([create here](https://github.com/settings/developers))
- Google OAuth credentials ([create here](https://console.cloud.google.com))
- OpenAI API key (optional, for AI features)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/failurearchive.git
cd failurearchive
npm install
```

### 2. Environment Setup

Create `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth - GitHub
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# OAuth - Google  
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# AI (Optional)
OPENAI_API_KEY="your_openai_api_key"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Mock Data (Optional)

```bash
npx tsx scripts/seed-mock-data.ts
```

This creates 10 realistic failure submissions for demo purposes.

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📦 Project Structure

```
failurearchive/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── submissions/  # Submission CRUD
│   │   ├── dashboard/    # User dashboard API
│   │   └── reuse/        # Reusability tracking
│   ├── auth/             # Auth pages (signin/signup)
│   ├── dashboard/        # User dashboard
│   ├── gallery/          # Public gallery
│   ├── submit/           # Submission form
│   └── submission/[id]/  # Submission detail view
├── components/           # Shared React components
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   ├── ai-service.ts    # AI moderation & extraction
│   └── utils.ts         # Helper functions
├── prisma/
│   └── schema.prisma    # Database schema
├── scripts/
│   └── seed-mock-data.ts # Mock data generator
└── types/               # TypeScript definitions
```

## 🗄️ Database Schema

### Key Models

- **User** - Authentication and profile
- **FailureRecord** - Core submission data
  - Type: RESEARCH_PAPER | TECHNICAL_PROJECT | BUSINESS_IDEA | AI_PROJECT | RESEARCH_IDEA | FUTURE_TECH_IDEA
  - Identity: ANONYMOUS | ATTRIBUTED | PSEUDONYMOUS | DELAYED_30 | DELAYED_90 | DELAYED_180
  - Evidence: NONE | ANECDOTAL | METRICS | RESEARCH_GRADE | REPRODUCIBLE
- **ModerationRecord** - AI moderation results
- **ReuseRecord** - Track who learned from failures

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/failurearchive.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js settings
4. Add environment variables (copy from `.env`)
5. Deploy!

### 3. Update OAuth Callbacks

**GitHub OAuth:**
- Homepage: `https://your-app.vercel.app`
- Callback: `https://your-app.vercel.app/api/auth/callback/github`

**Google OAuth:**
- Origins: `https://your-app.vercel.app`
- Redirect: `https://your-app.vercel.app/api/auth/callback/google`

### 4. Update NEXTAUTH_URL

In Vercel environment variables:
```
NEXTAUTH_URL=https://your-app.vercel.app
```

Redeploy after adding environment variables.

## 🎨 Customization

### Add New Failure Types

1. Update `prisma/schema.prisma` enum `FailureRecordType`
2. Run `npx prisma db push`
3. Add type-specific form fields in `app/submit/page.tsx`
4. Update type display logic in gallery/dashboard

### Customize Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Components: `components/` directory

### Add AI Features

Set `OPENAI_API_KEY` in environment:
- **AI Moderation** - Automatic content screening
- **Knowledge Extraction** - AI-generated insights

## 📝 License

This project is licensed under the MIT License.

### Content Licenses
- **Text Submissions:** CC0 1.0 (Public Domain)
- **Code References:** MIT License

All user-submitted content is openly licensed to maximize knowledge sharing.

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🐛 Troubleshooting

**Build fails:**
- Verify all environment variables are set
- Check DATABASE_URL connection string
- Run `npx prisma generate`

**OAuth errors:**
- Verify callback URLs match exactly
- Check client ID/secret are correct
- Ensure NEXTAUTH_SECRET is set

**Database errors:**
- Confirm database is accessible
- Check SSL mode in connection string
- Verify schema is up to date: `npx prisma db push`

## 📧 Support

For issues and questions:
- Open a GitHub issue
- Check existing issues for solutions

## 🌟 Philosophy

**This is NOT a social network.**
- No likes, comments, or engagement metrics
- Failure is framed as invalidated assumptions, not personal shortcomings
- UX is neutral, academic, and precise
- All content is openly licensed to maximize knowledge sharing

---

**Made with ❤️ for the failure-positive community**

