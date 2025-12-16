# OAuth Setup Guide

## GitHub OAuth Setup

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Failure Archive
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy it
7. Update your `.env` file:
   ```
   GITHUB_ID="your_client_id_here"
   GITHUB_SECRET="your_client_secret_here"
   ```

## Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure consent screen if prompted (use external, add your email as test user)
6. Choose "Web application"
7. Fill in:
   - **Name**: Failure Archive
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
8. Click "Create"
9. Copy the **Client ID** and **Client Secret**
10. Update your `.env` file:
    ```
    GOOGLE_ID="your_client_id_here"
    GOOGLE_SECRET="your_client_secret_here"
    ```

## For Production Deployment

When deploying, add your production URLs:
- GitHub: Add `https://yourdomain.com/api/auth/callback/github`
- Google: Add `https://yourdomain.com` and `https://yourdomain.com/api/auth/callback/google`

## Restart Server

After updating `.env`, restart your dev server:
```bash
npm run dev
```

The OAuth buttons on `/auth/signin` and `/auth/signup` will now work!
