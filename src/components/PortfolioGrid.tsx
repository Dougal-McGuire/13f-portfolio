"use client";

import { ManagerCard } from "./ManagerCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { PortfolioPick } from "@/lib/types";

interface PortfolioGridProps {
  picks: PortfolioPick[];
  weight: number;
  isLoading?: boolean;
}

export function PortfolioGrid({ picks, weight, isLoading }: PortfolioGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {picks.map((pick) => (
        <ManagerCard
          key={pick.managerSlug}
          manager={pick.manager}
          managerSlug={pick.managerSlug}
          ticker={pick.ticker}
          name={pick.name}
          cusip={pick.cusip}
          reportDate={pick.reportDate}
          weight={weight}
        />
      ))}
    </div>
  );
}