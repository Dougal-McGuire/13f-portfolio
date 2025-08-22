"use client";

import useSWR from "swr";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { AlertTriangle, RefreshCw } from "lucide-react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export default function Home() {
  const { dedupe, setDedupe } = usePortfolioStore();
  const { data, isLoading, error, mutate } = useSWR(
    `/api/portfolio?dedupe=${dedupe ? "1" : "0"}`, 
    fetcher, 
    { 
      revalidateOnFocus: false,
      refreshInterval: 0,
      errorRetryCount: 3,
      errorRetryInterval: 5000
    }
  );

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">13F Top-Holding Portfolio</h1>
        </header>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Portfolio</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            There was an error loading the 13F portfolio data. This could be due to SEC API limits or network issues.
          </p>
          <Button onClick={() => mutate()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">13F Top-Holding Portfolio</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm">De-duplicate tickers</span>
          <Switch checked={dedupe} onCheckedChange={setDedupe} />
        </div>
      </header>

      {data && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Updated: {new Date(data.updatedAt).toLocaleString()}</span>
          <Badge variant="outline">{data.count} positions</Badge>
          {data.successRate < 1 && (
            <Badge variant="secondary">
              {Math.round(data.successRate * 100)}% success rate
            </Badge>
          )}
        </div>
      )}

      <PortfolioGrid 
        picks={data?.picks ?? []} 
        weight={data?.weightPerPosition ?? 0} 
        isLoading={isLoading} 
      />

      <footer className="border-t pt-6">
        <p className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This app aggregates public Form 13F data, which is delayed and limited in scope. 
          13F filings are due within 45 days of quarter-end and show US-listed long positions only. 
          Holdings may have changed since reporting. This is not investment advice.
        </p>
      </footer>
    </div>
  );
}