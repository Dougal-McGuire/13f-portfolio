# GitHub Actions Deployment Setup

This repository is configured to automatically deploy to Vercel on every push to the `main` branch using GitHub Actions.

## Required Secrets

To enable automatic deployment, you need to configure the following secrets in your GitHub repository:

### 1. Get Vercel Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token with appropriate permissions
3. Add it as `VERCEL_TOKEN` in GitHub repository secrets

### 2. Get Organization ID and Project ID
Run these commands in your project directory:

```bash
npx vercel login
npx vercel link
npx vercel env pull .env.local
```

Or get them from your Vercel project settings:
- **Organization ID**: Found in your Vercel team/account settings
- **Project ID**: Found in your project settings on Vercel

### 3. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

| Secret Name | Description | Where to find |
|-------------|-------------|---------------|
| `VERCEL_TOKEN` | Vercel API token | [Vercel Account Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Your Vercel organization/team ID | Vercel project settings or `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Vercel project settings or `.vercel/project.json` |

### 4. Environment Variables for Production

Don't forget to configure these environment variables in your Vercel project settings:

- `SEC_USER_AGENT` - Required for SEC API compliance (format: "AppName (email@domain.com)")
- `OPENFIGI_API_KEY` - Optional but recommended for better CUSIP-to-ticker mapping

## Workflow Features

The GitHub Action workflow will:
- ✅ Install dependencies
- ✅ Run linting (non-blocking)
- ✅ Build the project
- ✅ Deploy to Vercel automatically
- ✅ Work for both pushes and pull requests

## Manual Deployment

You can still deploy manually using:
```bash
npx vercel --prod
```