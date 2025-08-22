# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build` (uses Turbopack)
- **Production start**: `npm start`
- **Lint**: `eslint`

## Architecture Overview

This is a Next.js 15 app that tracks 13F filings from 10 fund managers to construct an equal-weight portfolio of their top holdings.

### Key Data Flow
1. **Data Source**: SEC EDGAR API for 13F filings
2. **Processing**: Parse XML information tables to extract holdings
3. **Mapping**: Convert CUSIP identifiers to stock tickers via OpenFIGI API
4. **Storage**: Zustand state management for client-side data
5. **Updates**: Vercel cron jobs refresh data after quarterly 13F deadlines

### Core Architecture Components

**API Routes** (`src/app/api/`):
- `/api/portfolio` - Main endpoint that aggregates top picks from all managers
- `/api/13f/[cik]` - Fetches and parses individual manager's 13F filings

**Data Layer** (`src/lib/`):
- `investors.ts` - Static list of 10 tracked fund managers with CIK identifiers
- `edgar.ts` - SEC EDGAR API integration and 13F filing retrieval
- `parse13f.ts` - XML parsing for 13F information tables
- `mapping.ts` - CUSIP-to-ticker conversion via OpenFIGI
- `types.ts` - TypeScript interfaces for portfolio and holdings data

**State Management** (`src/store/`):
- Uses Zustand for client-side portfolio state
- SWR for data fetching and caching

**UI Components** (`src/components/`):
- Built with shadcn/ui and Radix primitives
- `PortfolioGrid.tsx` - Main portfolio display
- `ManagerCard.tsx` - Individual manager cards
- `HoldingsTable.tsx` - Detailed holdings view

### Environment Variables
- `SEC_USER_AGENT` (Required) - Must include app name and email for SEC API compliance
- `OPENFIGI_API_KEY` (Optional) - For better CUSIP-to-ticker mapping

### Deployment Notes
- Configured for Vercel with `vercel.json`
- Automatic data refresh via cron jobs on 13F deadlines (Feb 14, May 15, Aug 14, Nov 14)
- Uses proper SEC API rate limiting and User-Agent headers