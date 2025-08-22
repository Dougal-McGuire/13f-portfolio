"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ManagerCardProps {
  manager: string;
  managerSlug: string;
  ticker?: string;
  name: string;
  cusip: string;
  reportDate: string;
  weight: number;
}

export function ManagerCard({
  manager,
  managerSlug,
  ticker,
  name,
  cusip,
  reportDate,
  weight,
}: ManagerCardProps) {
  return (
    <Link href={`/managers/${managerSlug}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="text-lg font-semibold mb-1">
                {ticker ?? name}
                <Badge variant="secondary" className="ml-2">
                  {(weight * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-1">
                {ticker ? name : null}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {cusip}
              </div>
            </div>
          </div>
          <div className="border-t pt-3">
            <div className="text-sm font-medium">{manager}</div>
            <div className="text-xs text-muted-foreground">
              Report Date: {new Date(reportDate).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}