# 13F Portfolio Tracker

[![Deploy to Vercel](https://github.com/Dougal-McGuire/13f-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dougal-McGuire/13f-portfolio/actions/workflows/deploy.yml)

🔥 **Live Demo**: The app automatically deploys the latest changes from this repository.

A Next.js application that tracks top holdings from legendary investment managers using SEC 13F filings. The app constructs an equal-weight portfolio from the largest position of 10 prominent fund managers.

## Features

- **Real-time 13F Data**: Fetches latest filings directly from SEC EDGAR API
- **Equal-Weight Portfolio**: Displays top holding from each of 10 fund managers
- **Interactive UI**: Toggle to deduplicate positions by ticker
- **Manager Detail Pages**: View complete holdings for each fund manager
- **Automatic Updates**: Vercel cron jobs refresh data after 13F deadlines
- **SEC Compliant**: Proper User-Agent headers and rate limiting

## Fund Managers Tracked

1. First Eagle Investment Management
2. Yacktman Asset Management  
3. Primecap Management
4. Ariel Investments
5. Himalaya Capital Management
6. Harris Associates
7. Dorsey Asset Management
8. Akre Capital Management
9. Wedgewood Partners
10. Berkshire Hathaway

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: SWR
- **APIs**: SEC EDGAR, OpenFIGI (optional)
- **Deployment**: Vercel with cron jobs

## 📚 Documentation

For comprehensive guides and detailed information, see the [`docs/`](./docs/) directory:

- **[📖 Getting Started](./docs/development.md)** - Local setup and development workflow
- **[🚀 Deployment Guide](./docs/deployment.md)** - GitHub Actions and Vercel setup
- **[🏗️ Architecture Overview](./docs/architecture.md)** - System design and data flow
- **[📋 Full Documentation Index](./docs/README.md)** - Complete documentation hub

## 🚀 Quick Start

1. **Clone and setup**:
   ```bash
   git clone https://github.com/Dougal-McGuire/13f-portfolio.git
   cd 13f-portfolio
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with SEC_USER_AGENT (required)
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

📖 **For detailed setup instructions, see [docs/development.md](./docs/development.md)**

## 🚀 Deployment

The app uses GitHub Actions for automated deployments:
- **Push to `main`** → Preview deployment
- **Create release** → Production deployment

🔧 **For complete deployment setup, see [docs/deployment.md](./docs/deployment.md)**

### Environment Variables

- **SEC_USER_AGENT** (Required): User-Agent header for SEC API requests
- **OPENFIGI_API_KEY** (Optional): For CUSIP-to-ticker mapping

## Data Sources

- **SEC EDGAR**: Form 13F filings and information tables
- **OpenFIGI**: CUSIP-to-ticker symbol mapping (with fallback)

## Update Schedule

The app automatically refreshes via Vercel cron jobs after typical 13F deadlines:
- February 14 (Q4 filings)
- May 15 (Q1 filings)  
- August 14 (Q2 filings)
- November 14 (Q3 filings)

## Disclaimers

- 13F data is delayed up to 45 days after quarter-end
- Shows US-listed long positions only
- Holdings may have changed since reporting
- Not investment advice

## License

MIT License