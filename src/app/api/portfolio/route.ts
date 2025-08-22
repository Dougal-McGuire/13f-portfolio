import { NextResponse } from "next/server";
import { MANAGERS } from "@/lib/investors";
import { cusipToTickerWithFallback } from "@/lib/mapping";
import { parse13F } from "@/lib/parse13f";
import { getInfoTableXMLURL, getLatest13F, UA } from "@/lib/edgar";
import type { PortfolioPick, PortfolioResponse } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dedupe = searchParams.get("dedupe") === "1";

    const rows = await Promise.all(MANAGERS.map(async (m): Promise<PortfolioPick | null> => {
      try {
        const latest = await getLatest13F(m.cik);
        const infoUrl = await getInfoTableXMLURL(latest.cikNoLead, latest.accNoPlain);
        
        const response = await fetch(infoUrl, { headers: UA() });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const xml = await response.text();
        const holdings = parse13F(xml);
        const top = holdings.sort((a,b) => b.value - a.value)[0];
        
        if (!top) {
          console.warn(`No holdings found for ${m.name}`);
          return null;
        }
        
        const ticker = await cusipToTickerWithFallback(top.cusip);
        
        return { 
          manager: m.name, 
          managerSlug: m.slug, 
          cik: m.cik, 
          reportDate: latest.reportDate, 
          accession: latest.accession, 
          cusip: top.cusip, 
          name: top.nameOfIssuer, 
          valueK: top.value, 
          shares: top.shares, 
          ticker: ticker || undefined
        };
      } catch (error) {
        console.error(`Error fetching data for ${m.name}:`, error);
        return null;
      }
    }));

    let picks = rows.filter((pick): pick is PortfolioPick => pick !== null);
    
    // Warn if we have significantly fewer picks than expected
    if (picks.length < MANAGERS.length * 0.5) {
      console.warn(`Only ${picks.length} of ${MANAGERS.length} managers returned data`);
    }
    
    if (dedupe) {
      const seen = new Set<string>();
      const originalCount = picks.length;
      picks = picks.filter(p => {
        const key = (p.ticker || p.cusip).toUpperCase();
        if (seen.has(key)) return false;
        seen.add(key); 
        return true;
      });
      
      if (picks.length < originalCount) {
        console.info(`Deduplication reduced portfolio from ${originalCount} to ${picks.length} positions`);
      }
    }

    // equal-weight across whatever count (usually 10)
    const weight = picks.length ? 1 / picks.length : 0;
    const successRate = picks.length / MANAGERS.length;
    
    const response: PortfolioResponse = {
      updatedAt: new Date().toISOString(), 
      count: picks.length, 
      weightPerPosition: weight, 
      successRate,
      picks 
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error building portfolio:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to build portfolio', details: errorMessage }, 
      { status: 500 }
    );
  }
}