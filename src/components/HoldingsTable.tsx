"use client";

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
import type { Holding } from "@/lib/parse13f";

interface HoldingsTableProps {
  holdings: Holding[];
  isLoading?: boolean;
}

export function HoldingsTable({ holdings, isLoading }: HoldingsTableProps) {
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
            <TableHead>Class</TableHead>
            <TableHead>CUSIP</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Shares</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding, index) => (
            <TableRow key={`${holding.cusip}-${index}`}>
              <TableCell className="font-medium">
                {holding.nameOfIssuer}
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
                {formatValue(holding.value)}
              </TableCell>
              <TableCell className="text-right">
                {formatShares(holding.shares)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}