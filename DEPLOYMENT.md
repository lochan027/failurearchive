# Failure Archive - Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Your Neon PostgreSQL database is already set up

## Deployment Steps

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Failure Archive"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/failurearchive.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`

### 3. Environment Variables

Add these environment variables in Vercel project settings:

```env
# Database
DATABASE_URL=your_neon_postgres_connection_string
DIRECT_URL=your_neon_postgres_direct_connection_string

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_from_.env

# OAuth - GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Service (if using OpenAI)
OPENAI_API_KEY=your_openai_api_key
```

### 4. Update OAuth Redirect URLs

After deployment, update your OAuth app settings:

**GitHub OAuth App:**
- Homepage URL: `https://your-domain.vercel.app`
- Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

**Google OAuth:**
- Authorized JavaScript origins: `https://your-domain.vercel.app`
- Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/callback/google`

### 5. Generate Prisma Client

Vercel will automatically run `prisma generate` during build if you have a `postinstall` script in package.json (already configured).

### 6. Database Migration

Your Neon database already has the schema. If you need to reset or migrate:

```bash
npx prisma db push
```

### 7. Deploy

Click "Deploy" in Vercel. Your site will be live at `https://your-project.vercel.app`

## Post-Deployment

1. Visit your deployed site
2. Sign in with GitHub or Google
3. Test creating a submission
4. Check the dashboard

## Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update NEXTAUTH_URL and OAuth redirect URLs

## Troubleshooting

**Build Fails:**
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify DATABASE_URL is accessible

**OAuth Not Working:**
- Verify callback URLs match exactly
- Check that NEXTAUTH_URL is set correctly
- Ensure NEXTAUTH_SECRET is set

**Database Connection Issues:**
- Verify Neon database is accessible from external IPs
- Check DATABASE_URL format
- Ensure SSL is enabled in connection string

## Monitoring

- View logs in Vercel dashboard under "Deployments" → "Logs"
- Check Neon dashboard for database metrics
- Set up Vercel Analytics (optional)

## Updates

To deploy updates:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically redeploy.
