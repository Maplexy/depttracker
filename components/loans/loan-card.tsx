"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { DollarSign, MoreHorizontal, History } from "lucide-react";
import { Database } from "@/lib/supabase/types";

type Loan = Database["public"]["Tables"]["loans"]["Row"] & {
  profiles: {
    full_name: string | null;
  } | null;
};

interface LoanCardProps {
  loan: Loan;
  onLogPayment: (loanId: string) => void;
  onViewHistory: (loanId: string) => void;
}

export default function LoanCard({ loan, onLogPayment, onViewHistory }: LoanCardProps) {
  const paidAmount = loan.amount - loan.remaining_amount;
  const percentage = calculatePercentage(paidAmount, loan.amount);
  const initials = loan.profiles?.full_name
    ? loan.profiles.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <Card className="group overflow-hidden hover:border-primary/50 transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-foreground">
                {loan.profiles?.full_name || "Unknown"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Issued {new Date(loan.issue_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="size-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Remaining Balance
          </p>
          <h4 className="text-4xl font-black text-foreground tabular-nums mt-1">
            {formatCurrency(loan.remaining_amount)}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            of {formatCurrency(loan.amount)} original
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-end">
            <span className="text-xs font-medium text-muted-foreground">
              Repayment Progress
            </span>
            <span className="text-xs font-bold text-primary">{percentage}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onLogPayment(loan.id)}
          >
            <DollarSign className="size-4 mr-1" />
            Log Payment
          </Button>
          <Button
            variant="outline"
            onClick={() => onViewHistory(loan.id)}
          >
            <History className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
