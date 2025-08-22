import { NextResponse } from "next/server";
import { getLatest13F, getInfoTableXMLURL, UA } from "@/lib/edgar";
import { parse13F } from "@/lib/parse13f";

export async function GET(
  _: Request, 
  { params }: { params: Promise<{ cik: string }> }
) {
  try {
    const { cik } = await params;
    
    // Validate CIK format
    if (!cik || !/^\d{1,10}$/.test(cik)) {
      return NextResponse.json(
        { error: 'Invalid CIK format. Must be numeric.' }, 
        { status: 400 }
      );
    }
    
    const cik10 = cik.padStart(10, "0");
    
    const latest = await getLatest13F(cik10);
    const infoUrl = await getInfoTableXMLURL(latest.cikNoLead, latest.accNoPlain);
    
    const response = await fetch(infoUrl, { headers: UA() });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch XML: ${response.status} ${response.statusText}`);
    }
    
    const xml = await response.text();
    const holdings = parse13F(xml);
    
    return NextResponse.json({ 
      cik: cik10, 
      reportDate: latest.reportDate, 
      filingDate: latest.filingDate, 
      accession: latest.accession, 
      infoUrl, 
      holdings 
    });
  } catch (error) {
    console.error('Error fetching 13F data:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('No 13F filings found')) {
      return NextResponse.json(
        { error: 'No 13F filings found for this CIK' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch 13F data', details: errorMessage }, 
      { status: 500 }
    );
  }
}