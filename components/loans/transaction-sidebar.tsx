"use client";

import { X, Download, Plus, TrendingDown, TrendingUp, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { Database } from "@/lib/supabase/types";

type Payment = Database["public"]["Tables"]["payments"]["Row"];

interface TransactionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  amount: number;
  remainingAmount: number;
  payments: Payment[];
  onAddPayment: () => void;
}

export default function TransactionSidebar({
  isOpen,
  onClose,
  loanId,
  amount,
  remainingAmount,
  payments,
  onAddPayment,
}: TransactionSidebarProps) {
  const paidAmount = amount - remainingAmount;
  const percentage = calculatePercentage(paidAmount, amount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1" onClick={onClose} />
      <div className="w-full max-w-md h-screen bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold tracking-tight">Loan Details</h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-6" />
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="size-16 rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border flex items-center justify-center text-primary">
              <Calendar className="size-8" />
            </div>
            <div className="flex flex-col">
              <p className="text-foreground text-lg font-bold leading-tight">
                ID: #{loanId.slice(0, 8)}
              </p>
              <p className="text-muted-foreground text-sm font-normal">
                Private Lending Management
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-xl p-4 border border-border bg-muted/50">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Remaining
              </p>
              <p className="text-foreground text-xl font-bold">
                {formatCurrency(remainingAmount)}
              </p>
              <div className="flex items-center gap-1 text-destructive text-xs font-medium">
                <TrendingDown className="size-3" />
                -{100 - percentage}%
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-4 border border-border bg-muted/50">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Total Paid
              </p>
              <p className="text-foreground text-xl font-bold">{formatCurrency(paidAmount)}</p>
              <div className="flex items-center gap-1 text-primary text-xs font-medium">
                <TrendingUp className="size-3" />
                +{percentage}%
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 py-2">
            <div className="flex justify-between items-end">
              <p className="text-muted-foreground text-sm font-medium">
                Repayment Progress
              </p>
              <p className="text-primary text-sm font-bold">{percentage}%</p>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-border mx-6 my-6" />

        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
          <h3 className="text-foreground text-sm font-semibold mb-6 flex items-center gap-2">
            Payment History
            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">
              {payments.length} Transactions
            </span>
          </h3>

          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-4 w-px bg-border" />
            <div className="space-y-8 relative">
              {payments.map((payment, index) => (
                <div key={payment.id} className="flex gap-4">
                  <div className="relative z-10 bg-card py-1">
                    <CheckCircle className="size-5.5 text-primary fill-primary/20" />
                  </div>
                  <div className="flex flex-col flex-1 pb-2">
                    <div className="flex justify-between items-start">
                      <p className="text-foreground text-sm font-medium">
                        Received Payment
                      </p>
                      <p className="text-primary font-bold text-sm">
                        +{formatCurrency(payment.amount)}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(payment.payment_date).toLocaleDateString()} •{" "}
                      {payment.payment_method.replace("_", " ")}
                    </p>
                    {payment.notes && (
                      <p className="text-muted-foreground text-xs mt-1 italic">
                        {payment.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-card/80 backdrop-blur-sm space-y-3">
          <Button className="w-full shadow-lg shadow-primary/20" onClick={onAddPayment}>
            <Plus className="size-4 mr-2" />
            Record New Payment
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="size-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}
