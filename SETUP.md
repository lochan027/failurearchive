# SETUP GUIDE

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and fill in:
   # - DATABASE_URL (PostgreSQL connection string)
   # - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
   # - OAuth credentials (optional)
   # - AI API key (optional)
   ```

3. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000**

## Database Setup Options

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL locally, then:
DATABASE_URL="postgresql://postgres:password@localhost:5432/failurearchive"
```

### Option 2: Docker PostgreSQL
```bash
docker run --name failurearchive-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=failurearchive \
  -p 5432:5432 \
  -d postgres:15

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/failurearchive"
```

### Option 3: Cloud (Supabase, Neon, Railway)
Use their provided PostgreSQL connection string.

## OAuth Setup (Optional)

### GitHub OAuth
1. Go to https://github.com/settings/developers
2. Create New OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret to .env

### Google OAuth
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to .env

## AI Features Setup (Optional)

The app uses OpenAI-compatible API for:
- Content moderation
- Knowledge extraction
- Pre-mortem analysis

```bash
AI_API_KEY="sk-..."
AI_API_URL="https://api.openai.com/v1"
```

You can use:
- OpenAI
- Azure OpenAI
- Local LLM with OpenAI-compatible API (e.g., LocalAI, Ollama with proxy)

## Troubleshooting

### Database Connection Errors
```bash
# Test connection
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

### Module Not Found Errors
```bash
npm install
npx prisma generate
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

## Project Structure

```
app/
├── api/              # API routes
│   ├── auth/         # NextAuth
│   ├── submissions/  # Failure CRUD
│   ├── reuse/        # Reuse tracking
│   ├── dashboard/    # User data
│   └── premortem/    # Analysis
├── gallery/          # Browse failures
├── submit/           # Submission form
├── dashboard/        # User dashboard
├── submission/[id]/  # View failure
├── premortem/        # Pre-mortem tool
└── auth/signin/      # Sign in page

components/           # React components
lib/                  # Core logic
prisma/              # Database schema
types/               # TypeScript types
```

## Features Checklist

✅ Next.js 15 with App Router
✅ TypeScript
✅ Tailwind CSS
✅ PostgreSQL + Prisma
✅ NextAuth (Email, GitHub, Google)
✅ 6 Failure Record Types
✅ Structured Failure Form
✅ Mandatory Licensing (CC0 + MIT)
✅ Gallery with Filters
✅ Reuse System
✅ Dashboard
✅ Pre-Mortem Tool
✅ AI Moderation (abstracted)
✅ AI Knowledge Extraction
✅ Academic Design System

## Next Steps

1. Generate a secure NEXTAUTH_SECRET
2. Set up PostgreSQL database
3. Configure OAuth providers (optional)
4. Add AI API key (optional)
5. Run migrations
6. Start development server
7. Create your first failure submission!

## Production Deployment

Before deploying:

1. Set production DATABASE_URL
2. Set production NEXTAUTH_URL
3. Generate new NEXTAUTH_SECRET
4. Run `npm run build`
5. Set up proper PostgreSQL backups
6. Configure environment variables in hosting platform

Recommended platforms:
- Vercel (easiest for Next.js)
- Railway
- Fly.io
- AWS/GCP/Azure
