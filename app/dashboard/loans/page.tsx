"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoanCard from "@/components/loans/loan-card";
import StatsSummary from "@/components/stats/stats-summary";
import PaymentModal, { PaymentFormData } from "@/components/loans/payment-modal";
import TransactionSidebar from "@/components/loans/transaction-sidebar";
import CreateLoanModal, { CreateLoanFormData } from "@/components/loans/create-loan-modal";
import { getLoans, getPayments, createLoan } from "@/app/actions/loans";
import { handlePaymentSubmit } from "@/app/actions/payments";
import { Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/supabase/types";

type Loan = Database["public"]["Tables"]["loans"]["Row"] & {
  profiles: {
    full_name: string | null;
  } | null;
};

type Payment = Database["public"]["Tables"]["payments"]["Row"];

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Record<string, Payment[]>>({});
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCreateLoanModal, setShowCreateLoanModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    setLoading(true);
    const result = await getLoans();
    if (result.loans) {
      setLoans(result.loans);
    }
    setLoading(false);
  };

  const loadPayments = async (loanId: string) => {
    const result = await getPayments(loanId);
    if (result.payments) {
      setPayments((prev) => ({ ...prev, [loanId]: result.payments }));
    }
  };

  const handleLogPayment = (loanId: string) => {
    setSelectedLoan(loans.find((l) => l.id === loanId) || null);
    loadPayments(loanId);
    setShowPaymentModal(true);
  };

  const handleViewHistory = (loanId: string) => {
    setSelectedLoan(loans.find((l) => l.id === loanId) || null);
    loadPayments(loanId);
    setShowSidebar(true);
  };

  const handlePaymentSubmitModal = async (data: PaymentFormData) => {
    if (!selectedLoan) return;

    const result = await handlePaymentSubmit({
      ...data,
      loanId: selectedLoan.id,
    });

    if (result.success) {
      await loadLoans();
      if (selectedLoan) {
        await loadPayments(selectedLoan.id);
      }
    }
  };

  const handleAddNewLoan = () => {
    setShowCreateLoanModal(true);
  };

  const handleCreateLoanSubmit = async (data: CreateLoanFormData) => {
    const result = await createLoan({
      borrower_email: data.borrower_email,
      amount: data.amount,
      issue_date: data.issue_date,
      due_date: data.due_date,
      notes: data.notes,
    });

    if (result.success) {
      await loadLoans();
      return { success: true };
    } else {
      console.error("Create loan failed:", result.error);
      return { success: false, error: result.error };
    }
  };

  const totalOwed = loans.reduce((sum, loan) => sum + loan.remaining_amount, 0);
  const latestPayment =
    payments[loans[0]?.id]?.[0]?.amount || 0;
  const latestPaymentFrom = loans[0]?.profiles?.full_name || undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto px-6 py-8 flex-1 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              My Loans
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your private lending activities with friends.
            </p>
          </div>
          <Button onClick={handleAddNewLoan}>
            <Plus className="size-4 mr-2" />
            Add New Loan
          </Button>
        </div>

        <StatsSummary
          totalOwed={totalOwed}
          activeLoans={loans.length}
          latestPayment={latestPayment}
          latestPaymentFrom={latestPaymentFrom}
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading loans...</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 min-h-[400px]">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
              <Wallet className="size-6" />
            </div>
            <p className="font-bold text-foreground text-lg">No loans yet</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Start by creating your first loan to track lending activities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onLogPayment={handleLogPayment}
                onViewHistory={handleViewHistory}
              />
            ))}
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 min-h-[340px] hover:border-primary/50 transition-all cursor-pointer group"
              onClick={handleAddNewLoan}
            >
              <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors mb-4">
                <Plus className="size-6" />
              </div>
              <p className="font-bold text-foreground">Create New Loan</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Set up a new lending record for a friend or family member.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {showPaymentModal && selectedLoan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          loanId={selectedLoan.id}
          remainingAmount={selectedLoan.remaining_amount}
          onSubmit={handlePaymentSubmitModal}
        />
      )}

      {showSidebar && selectedLoan && (
        <TransactionSidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          loanId={selectedLoan.id}
          amount={selectedLoan.amount}
          remainingAmount={selectedLoan.remaining_amount}
          payments={payments[selectedLoan.id] || []}
          onAddPayment={() => {
            setShowSidebar(false);
            setShowPaymentModal(true);
          }}
        />
      )}

      {showCreateLoanModal && (
        <CreateLoanModal
          isOpen={showCreateLoanModal}
          onClose={() => setShowCreateLoanModal(false)}
          onSubmit={handleCreateLoanSubmit}
        />
      )}
    </div>
  );
}
