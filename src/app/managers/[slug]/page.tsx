"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { MANAGERS } from "@/lib/investors";
import { HoldingsTable } from "@/components/HoldingsTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ManagerPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const manager = MANAGERS.find(m => m.slug === slug);
  
  const { data, isLoading, error } = useSWR(
    manager ? `/api/13f/${manager.cik}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (!manager) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Manager Not Found</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Data</h1>
          <p className="text-muted-foreground mb-4">
            Failed to load 13F data for {manager.name}
          </p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalValue = data?.holdings?.reduce((sum: number, h: { value: number }) => sum + h.value, 0) || 0;
  const formatValue = (valueK: number) => {
    if (valueK >= 1000000) {
      return `$${(valueK / 1000000).toFixed(1)}B`;
    }
    if (valueK >= 1000) {
      return `$${(valueK / 1000).toFixed(1)}M`;
    }
    return `$${valueK}K`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{manager.name}</h1>
          {data && (
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary">
                {data.holdings?.length || 0} holdings
              </Badge>
              <Badge variant="outline">
                Total: {formatValue(totalValue)}
              </Badge>
            </div>
          )}
        </div>
      </header>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Report Date</div>
            <div className="font-semibold">
              {new Date(data.reportDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Filing Date</div>
            <div className="font-semibold">
              {new Date(data.filingDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Accession</div>
            <div className="font-mono text-sm">{data.accession}</div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Holdings</h2>
        <HoldingsTable 
          holdings={data?.holdings || []} 
          isLoading={isLoading} 
        />
      </div>

      <footer className="border-t pt-6">
        <p className="text-xs text-muted-foreground">
          Data sourced from SEC Form 13F filing. Values shown in USD thousands as reported. 
          Filing may include amendments and represents positions as of the report date.
        </p>
      </footer>
    </div>
  );
}