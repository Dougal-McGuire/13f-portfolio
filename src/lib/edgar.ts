export const UA = () => ({ 
  "User-Agent": process.env.SEC_USER_AGENT || "13F-Portfolio-Tracker (contact@13f-portfolio.com)" 
});

type RecentSubmission = {
  form: string[]; 
  accessionNumber: string[]; 
  filingDate: string[];
  reportDate: string[]; 
  primaryDocument: string[];
};

export async function getLatest13F(cik10: string) {
  const res = await fetch(`https://data.sec.gov/submissions/CIK${cik10}.json`, { 
    headers: UA(), 
    next: { revalidate: 60 * 60 * 24 }
  });
  
  if (!res.ok) {
    throw new Error(`SEC submissions failed ${res.status}`);
  }
  
  const data = await res.json() as { filings: { recent: RecentSubmission } };

  // collect 13F forms; prefer most recent filed, pick the most recent for each reportDate, and prefer amendments if they are newer
  const rows = data.filings.recent.form
    .map((form, i) => ({ 
      form, 
      accession: data.filings.recent.accessionNumber[i], 
      reportDate: data.filings.recent.reportDate[i], 
      filingDate: data.filings.recent.filingDate[i] 
    }))
    .filter(r => r.form.toUpperCase().startsWith("13F-HR"));

  // keep the latest filing per reportDate
  const byPeriod = new Map<string, {form:string; accession:string; reportDate:string; filingDate:string}>();
  for (const r of rows) {
    const prev = byPeriod.get(r.reportDate);
    if (!prev || new Date(r.filingDate) > new Date(prev.filingDate)) {
      byPeriod.set(r.reportDate, r);
    }
  }
  
  // choose the single latest period
  const latest = Array.from(byPeriod.values())
    .sort((a,b) => +new Date(b.filingDate) - +new Date(a.filingDate))[0];
    
  if (!latest) {
    throw new Error("No 13F filings found");
  }
  
  const accNoPlain = latest.accession.replace(/-/g, "");
  const cikNoLead = String(Number(cik10)); // strip leading zeros for path
  
  return { ...latest, cikNoLead, accNoPlain };
}

async function checkFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD', 
      headers: UA() 
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getInfoTableXMLURL(cikNoLead: string, accNoPlain: string) {
  // try index.json (if available), else fallback to common filenames
  const base = `https://www.sec.gov/Archives/edgar/data/${cikNoLead}/${accNoPlain}`;
  
  const idx = await fetch(`${base}/index.json`, { 
    headers: UA(),
    next: { revalidate: 60 * 60 * 24 }
  }).then(r => r.ok ? r.json() : null).catch(() => null);
  
  let name: string | null = null;
  
  if (idx?.directory?.item) {
    const files: {name:string}[] = idx.directory.item;
    name =
      files.find(f => /info(table)?\.xml$/i.test(f.name))?.name ||
      files.find(f => /13f.*info.*table.*\.xml$/i.test(f.name))?.name ||
      files.find(f => /form13f.*\.xml$/i.test(f.name))?.name ||
      files.find(f => /.*13f.*\.xml$/i.test(f.name))?.name || // Broader pattern for files with 13F in name
      files.find(f => /^\d+\.xml$/i.test(f.name))?.name || // Look for numbered XML files like 43981.xml
      null;
    
    if (name) {
      return `${base}/${name}`;
    }
  }
  
  // If index.json didn't work, try common fallback filenames
  const fallbackCandidates = [
    "primary_doc.xml",
    "infotable.xml", 
    "form13fInfoTable.xml"
  ];
  
  for (const candidate of fallbackCandidates) {
    const candidateUrl = `${base}/${candidate}`;
    if (await checkFileExists(candidateUrl)) {
      return candidateUrl;
    }
  }
  
  // If no fallback worked, throw an error with details
  throw new Error(`No valid 13F info table XML file found. Tried: ${fallbackCandidates.join(', ')}`);
}