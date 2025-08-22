import { XMLParser } from "fast-xml-parser";

export type Holding = {
  nameOfIssuer: string;
  classTitle?: string;
  cusip: string;
  value: number;               // $ thousands per 13F standard
  shares: number;
  putCall?: string | null;
  ticker?: string | null;      // Added by server-side ticker resolution
};

export function parse13F(xml: string): Holding[] {
  const parser = new XMLParser({ 
    ignoreAttributes: false, 
    parseTagValue: true, 
    removeNSPrefix: true, 
    numberParseOptions: { leadingZeros: false, hex: false } 
  });
  
  const j = parser.parse(xml);
  const rows = j.informationTable?.infoTable ?? j["information-table"]?.["info-table"];
  
  if (!rows) return [];
  
  const list = Array.isArray(rows) ? rows : [rows];
  
  return list.map((r: Record<string, unknown>) => ({
    nameOfIssuer: String(r.nameOfIssuer || r["nameOf-issuer"] || ""),
    classTitle: String(r.titleOfClass || r["titleOf-class"] || ""),
    cusip: String(r.cusip || ""),
    value: Number(r.value), // in $000s
    shares: Number((r.shrsOrPrnAmt as Record<string, unknown>)?.sshPrnamt ?? (r.shrsOrPrnAmt as Record<string, unknown>)?.["sshPrnamt"]),
    putCall: r.putCall ? String(r.putCall) : null,
  })).filter(x => !x.putCall || x.putCall.toLowerCase() === "none");
}

export function pickTopHolding(holdings: Holding[]): Holding {
  return [...holdings].sort((a,b) => b.value - a.value)[0];
}