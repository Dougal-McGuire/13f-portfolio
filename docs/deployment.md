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

## Deployment Strategy

The workflow now supports three deployment types:

### 1. Preview Deployments (Default)
- **Trigger**: Push to `main` branch
- **Environment**: Preview URL (not production)
- **Purpose**: Test changes before going live
- **Linting**: Non-blocking (continues on errors)

### 2. Pull Request Previews
- **Trigger**: Any pull request to `main`
- **Environment**: Unique preview URL per PR
- **Purpose**: Review changes in isolation
- **Linting**: Non-blocking

### 3. Production Deployments
- **Trigger**: GitHub release (tag)
- **Environment**: Production domain
- **Purpose**: Official releases only
- **Linting**: Blocking (must pass to deploy)

## Workflow Features

The GitHub Actions workflow will:
- ✅ Install dependencies and build project
- ✅ Run linting (blocking for production, non-blocking for previews)
- ✅ Deploy to appropriate Vercel environment
- ✅ Generate unique preview URLs for testing

## Creating Production Releases

To deploy to production, create a GitHub release:

### Option 1: GitHub UI
1. Go to your repository → Releases → "Create a new release"
2. Create a new tag (e.g., `v1.0.0`, `v1.1.0`)
3. Add release notes describing changes
4. Click "Publish release"
5. Production deployment will trigger automatically

### Option 2: Command Line
```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0

# Then create release from the tag in GitHub UI
```

### Option 3: GitHub CLI
```bash
gh release create v1.0.0 --title "Version 1.0.0" --notes "Initial production release"
```

## Manual Deployment

You can still deploy manually using:
```bash
# Preview deployment
npx vercel

# Production deployment
npx vercel --prod
```