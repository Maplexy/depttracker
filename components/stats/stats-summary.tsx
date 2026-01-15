"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface StatsSummaryProps {
  totalOwed: number;
  activeLoans: number;
  latestPayment: number;
  latestPaymentFrom?: string;
}

export default function StatsSummary({
  totalOwed,
  activeLoans,
  latestPayment,
  latestPaymentFrom,
}: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Total Owed to You</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {formatCurrency(totalOwed)}
            </span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              +5.2%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {activeLoans}
            </span>
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              0%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Latest Payment</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tabular-nums text-primary">
              +{formatCurrency(latestPayment)}
            </span>
            {latestPaymentFrom && (
              <span className="text-xs font-semibold text-muted-foreground">
                from {latestPaymentFrom}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
