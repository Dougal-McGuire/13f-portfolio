export async function cusipToTicker(cusip: string): Promise<string | null> {
  try {
    const body = [{ idType: "ID_CUSIP", idValue: cusip }];
    const headers: Record<string,string> = { "Content-Type":"application/json" };
    
    if (process.env.OPENFIGI_API_KEY) {
      headers["X-OPENFIGI-APIKEY"] = process.env.OPENFIGI_API_KEY;
    }
    
    const res = await fetch("https://api.openfigi.com/v3/mapping", { 
      method:"POST", 
      headers, 
      body: JSON.stringify(body) 
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    const r = data?.[0]?.data?.[0];
    
    // prefer composite ticker if present
    return (r?.ticker ?? null) as string | null;
  } catch (error) {
    console.error('Error mapping CUSIP to ticker:', error);
    return null;
  }
}

// Fallback mapping for common CUSIPs when OpenFIGI fails
const KNOWN_CUSIPS: Record<string, string> = {
  "037833100": "AAPL",     // Apple Inc
  "060505104": "BAC",      // Bank of America Corp
  "57636Q104": "MA",       // Mastercard Inc
  "30303M102": "META",     // Meta Platforms Inc
  "02079K305": "GOOGL",    // Alphabet Inc Class A
  "02079K107": "GOOG",     // Alphabet Inc Class C
  "235851102": "DHR",      // Danaher Corp
  "532457108": "LLY",      // Eli Lilly and Co
  "55261F104": "MSGE",     // Madison Square Garden Entertainment Corp
  "136069101": "CNQ",      // Canadian Natural Resources Ltd
};

export async function cusipToTickerWithFallback(cusip: string): Promise<string | null> {
  // Try OpenFIGI first
  const ticker = await cusipToTicker(cusip);
  if (ticker) return ticker;
  
  // Fallback to known mappings
  return KNOWN_CUSIPS[cusip] || null;
}