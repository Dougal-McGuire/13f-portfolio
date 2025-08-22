# 13F Portfolio Tracker

[![Deploy to Vercel](https://github.com/Dougal-McGuire/13f-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dougal-McGuire/13f-portfolio/actions/workflows/deploy.yml)

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

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Optional: OpenFIGI API key for better ticker mapping

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add:
   ```
   SEC_USER_AGENT="YourAppName (your-email@domain.com)"
   OPENFIGI_API_KEY="your-api-key" # Optional
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `SEC_USER_AGENT`: Required for SEC API compliance
   - `OPENFIGI_API_KEY`: Optional, improves ticker mapping

3. Deploy - the app includes a `vercel.json` with cron jobs for automatic updates

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