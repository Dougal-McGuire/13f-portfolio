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
// Removed cusipToTickerWithFallback import - tickers now come from server
import type { Holding } from "@/lib/parse13f";

interface AggregatedHolding extends Holding {
  aggregatedValue: number;
  aggregatedShares: number;
  percentage: number;
  // ticker already included in Holding type
}

interface HoldingsTableProps {
  holdings: Holding[];
  isLoading?: boolean;
}

export function HoldingsTable({ holdings, isLoading }: HoldingsTableProps) {
  // Aggregate holdings synchronously (tickers are already resolved by server)
  const aggregatedHoldings = useMemo(() => {
    if (!holdings.length) return [];

    // Calculate total value for percentage calculation
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    
    // Group by CUSIP to aggregate duplicates
    const grouped = holdings.reduce((acc, holding) => {
      const existing = acc.get(holding.cusip);
      if (existing) {
        existing.aggregatedValue += holding.value;
        existing.aggregatedShares += holding.shares;
        // Keep the ticker from the first occurrence (they should be the same)
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