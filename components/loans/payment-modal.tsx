"use client";

import { useState } from "react";
import { X, Save, Calendar, Banknote, CreditCard, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  remainingAmount: number;
  onSubmit: (data: PaymentFormData) => void;
}

export interface PaymentFormData {
  amount: number;
  payment_date: string;
  payment_method: "bank_transfer" | "cash" | "other";
  notes: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  loanId,
  remainingAmount,
  onSubmit,
}: PaymentModalProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: 0,
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "bank_transfer",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Log Payment
            </h2>
            <p className="text-muted-foreground text-sm font-normal leading-normal mt-1">
              Record a new installment for this loan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount Paid</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <span className="text-lg font-semibold">$</span>
              </div>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={remainingAmount}
                placeholder="0.00"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                className="pl-10 pr-4 text-xl font-bold"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum: ${remainingAmount.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="payment_date">Payment Date</Label>
            <Input
              id="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={(e) =>
                setFormData({ ...formData, payment_date: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Payment Method</Label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  formData.payment_method === "bank_transfer"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setFormData({ ...formData, payment_method: "bank_transfer" })}
              >
                <CreditCard className="size-4" />
                Bank Transfer
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  formData.payment_method === "cash"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setFormData({ ...formData, payment_method: "cash" })}
              >
                <Banknote className="size-4" />
                Cash
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  formData.payment_method === "other"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setFormData({ ...formData, payment_method: "other" })}
              >
                <MoreHorizontal className="size-4" />
                Other
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add a description..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-[2] shadow-lg shadow-primary/20"
            >
              <Save className="size-4 mr-2" />
              Save Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
