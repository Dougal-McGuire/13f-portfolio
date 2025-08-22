export interface PortfolioPick {
  manager: string;
  managerSlug: string;
  cik: string;
  reportDate: string;
  accession: string;
  cusip: string;
  name: string;
  valueK: number;
  shares: number;
  ticker?: string;
}

export interface PortfolioResponse {
  updatedAt: string;
  count: number;
  weightPerPosition: number;
  successRate: number;
  picks: PortfolioPick[];
}

export interface ManagerHoldingsResponse {
  cik: string;
  reportDate: string;
  filingDate: string;
  accession: string;
  infoUrl: string;
  holdings: import('./parse13f').Holding[];
}