# Development Guide

This guide covers local development setup, environment configuration, and development workflow for the 13F Portfolio Tracker.

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Optional: OpenFIGI API key for enhanced ticker mapping

### Initial Setup

1. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/Dougal-McGuire/13f-portfolio.git
   cd 13f-portfolio
   npm install
   ```

2. **Environment configuration**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   # Required for SEC API compliance
   SEC_USER_AGENT="YourAppName (your-email@domain.com)"
   
   # Optional: Better CUSIP-to-ticker mapping
   OPENFIGI_API_KEY="your-api-key-here"
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/
│   │   ├── portfolio/      # Main portfolio endpoint
│   │   └── 13f/[cik]/     # Individual manager data
│   ├── managers/[slug]/    # Manager detail pages
│   ├── globals.css         # Tailwind CSS imports
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── PortfolioGrid.tsx   # Main portfolio display
│   ├── ManagerCard.tsx     # Individual manager cards
│   └── HoldingsTable.tsx   # Detailed holdings view
├── lib/
│   ├── edgar.ts           # SEC EDGAR API integration
│   ├── parse13f.ts        # XML parsing for 13F filings
│   ├── mapping.ts         # CUSIP-to-ticker conversion
│   ├── investors.ts       # Fund manager definitions
│   └── types.ts           # TypeScript interfaces
└── store/
    └── usePortfolioStore.ts # Zustand state management
```

## 🔌 API Endpoints

### GET `/api/portfolio`
Returns aggregated portfolio data from all 10 managers.

**Query Parameters:**
- `dedupe=1` - Remove duplicate tickers (optional)

**Response:**
```json
{
  "updatedAt": "2025-01-15T10:30:00Z",
  "count": 10,
  "weightPerPosition": 0.1,
  "successRate": 1.0,
  "picks": [
    {
      "manager": "Berkshire Hathaway",
      "managerSlug": "berkshire-hathaway",
      "cik": "0000315066",
      "reportDate": "2024-12-31",
      "cusip": "030420103",
      "name": "APPLE INC",
      "valueK": 174500000,
      "shares": 915562500,
      "ticker": "AAPL"
    }
  ]
}
```

### GET `/api/13f/[cik]`
Returns detailed holdings for a specific manager.

## 🧪 Testing Data Flow

1. **Test SEC API**: Check individual manager endpoints:
   ```bash
   curl "http://localhost:3000/api/13f/0000315066" # Berkshire Hathaway
   ```

2. **Test Portfolio Aggregation**:
   ```bash
   curl "http://localhost:3000/api/portfolio"
   curl "http://localhost:3000/api/portfolio?dedupe=1"
   ```

3. **Verify CUSIP Mapping**: Check that tickers are resolved correctly

## 🐛 Common Issues

### SEC API Errors
- **Missing User-Agent**: Ensure `SEC_USER_AGENT` is set
- **Rate Limiting**: SEC API has built-in delays, be patient
- **Filing Not Found**: Some managers may not have recent 13F filings

### Build Issues
- **Tailwind CSS**: Make sure you're using Tailwind CSS v4 syntax
- **TypeScript Errors**: Check that all types are properly imported

### Environment Variables
- **SEC_USER_AGENT**: Must include app name and email for SEC compliance
- **OPENFIGI_API_KEY**: Optional but recommended for better ticker mapping

## 📊 Data Sources

### SEC EDGAR API
- **Submissions**: `https://data.sec.gov/submissions/CIK{cik}.json`
- **Filing Documents**: `https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/`
- **Rate Limiting**: Built-in delays per SEC requirements

### OpenFIGI API (Optional)
- **CUSIP Mapping**: Converts CUSIP identifiers to stock tickers
- **Fallback**: App works without API key, uses basic mapping
- **Rate Limits**: 250 requests per minute (free tier)

## 🔄 Development Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/your-feature
   # Make changes
   npm run lint
   npm run build
   git commit -m "Add your feature"
   git push origin feature/your-feature
   ```

2. **Create Pull Request**: Opens preview deployment automatically

3. **Testing**: Use preview URL to test changes

4. **Production Release**: Create GitHub release when ready