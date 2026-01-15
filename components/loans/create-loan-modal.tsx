"use client";

import { useState } from "react";
import { X, User, DollarSign, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface CreateLoanFormData {
  borrower_email: string;
  amount: number;
  issue_date: string;
  due_date: string;
  notes: string;
}

interface CreateLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLoanFormData) => Promise<{ success: boolean; error?: string }>;
}

export default function CreateLoanModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateLoanModalProps) {
  const [formData, setFormData] = useState<CreateLoanFormData>({
    borrower_email: "",
    amount: 0,
    issue_date: new Date().toISOString().split("T")[0],
    due_date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await onSubmit(formData);

    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Failed to create loan");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Create New Loan
            </h2>
            <p className="text-muted-foreground text-sm font-normal leading-normal mt-1">
              Set up a new lending record for a borrower.
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
            <Label htmlFor="borrower_email">Borrower's Email</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <User className="size-5" />
              </div>
              <Input
                id="borrower_email"
                type="email"
                placeholder="borrower@example.com"
                value={formData.borrower_email}
                onChange={(e) =>
                  setFormData({ ...formData, borrower_email: e.target.value })
                }
                className="pl-11"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The borrower must be a registered user
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Loan Amount</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <span className="text-lg font-semibold">$</span>
              </div>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                className="pl-10 text-xl font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Calendar className="size-4" />
                </div>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) =>
                    setFormData({ ...formData, issue_date: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="due_date">Due Date (Optional)</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Calendar className="size-4" />
                </div>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <div className="relative group">
              <div className="absolute top-3 left-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <FileText className="size-4" />
              </div>
              <Textarea
                id="notes"
                placeholder="Add any additional details about this loan..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="pl-10"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-[2] shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <DollarSign className="size-4 mr-2" />
                  Create Loan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
