"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cusipToTickerWithFallback } from "@/lib/mapping";
import type { Holding } from "@/lib/parse13f";

interface AggregatedHolding extends Holding {
  aggregatedValue: number;
  aggregatedShares: number;
  percentage: number;
  ticker?: string;
}

interface HoldingsTableProps {
  holdings: Holding[];
  isLoading?: boolean;
}

export function HoldingsTable({ holdings, isLoading }: HoldingsTableProps) {
  const [aggregatedHoldings, setAggregatedHoldings] = useState<AggregatedHolding[]>([]);
  const [processingTickers, setProcessingTickers] = useState(false);

  // First, aggregate holdings synchronously
  const aggregated = useMemo(() => {
    if (!holdings.length) return [];

    // Calculate total value for percentage calculation
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    
    // Group by CUSIP to aggregate duplicates
    const grouped = holdings.reduce((acc, holding) => {
      const existing = acc.get(holding.cusip);
      if (existing) {
        existing.aggregatedValue += holding.value;
        existing.aggregatedShares += holding.shares;
      } else {
        acc.set(holding.cusip, {
          ...holding,
          aggregatedValue: holding.value,
          aggregatedShares: holding.shares,
          percentage: 0, // Will calculate after aggregation
        });
      }
      return acc;
    }, new Map<string, AggregatedHolding>());

    // Convert to array and add percentages
    const result = Array.from(grouped.values()).map(holding => ({
      ...holding,
      percentage: (holding.aggregatedValue / totalValue) * 100
    }));

    // Sort by aggregated value descending
    return result.sort((a, b) => b.aggregatedValue - a.aggregatedValue);
  }, [holdings]);

  // Then resolve tickers asynchronously
  useEffect(() => {
    if (!aggregated.length) {
      setAggregatedHoldings([]);
      return;
    }

    const processTickers = async () => {
      setProcessingTickers(true);
      
      try {
        const withTickers = await Promise.all(
          aggregated.map(async (holding) => ({
            ...holding,
            ticker: await cusipToTickerWithFallback(holding.cusip)
          }))
        );
        
        setAggregatedHoldings(withTickers);
      } catch (error) {
        console.error('Error resolving tickers:', error);
        // Fall back to holdings without tickers
        setAggregatedHoldings(aggregated);
      } finally {
        setProcessingTickers(false);
      }
    };

    processTickers();
  }, [aggregated]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const formatValue = (valueK: number) => {
    if (valueK >= 1000000) {
      return `$${(valueK / 1000000).toFixed(1)}B`;
    }
    if (valueK >= 1000) {
      return `$${(valueK / 1000).toFixed(1)}M`;
    }
    return `$${valueK}K`;
  };

  const formatShares = (shares: number) => {
    if (shares >= 1000000) {
      return `${(shares / 1000000).toFixed(1)}M`;
    }
    if (shares >= 1000) {
      return `${(shares / 1000).toFixed(1)}K`;
    }
    return shares.toLocaleString();
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issuer</TableHead>
            <TableHead>Ticker</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>CUSIP</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">% of Total</TableHead>
            <TableHead className="text-right">Shares</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {aggregatedHoldings.map((holding) => (
            <TableRow key={holding.cusip}>
              <TableCell className="font-medium">
                {holding.nameOfIssuer}
              </TableCell>
              <TableCell>
                {holding.ticker ? (
                  <Badge variant="default">{holding.ticker}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                {holding.classTitle && (
                  <Badge variant="outline">{holding.classTitle}</Badge>
                )}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {holding.cusip}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatValue(holding.aggregatedValue)}
              </TableCell>
              <TableCell className="text-right">
                <span className="font-medium">{holding.percentage.toFixed(1)}%</span>
              </TableCell>
              <TableCell className="text-right">
                {formatShares(holding.aggregatedShares)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}