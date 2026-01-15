"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoanCard from "@/components/loans/loan-card";
import StatsSummary from "@/components/stats/stats-summary";
import PaymentModal, { PaymentFormData } from "@/components/loans/payment-modal";
import TransactionSidebar from "@/components/loans/transaction-sidebar";
import CreateLoanModal, { CreateLoanFormData } from "@/components/loans/create-loan-modal";
import { Plus, Wallet, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Loan = Database["public"]["Tables"]["loans"]["Row"] & {
  profiles: {
    full_name: string | null;
  } | null;
};

type Payment = Database["public"]["Tables"]["payments"]["Row"];

export default function DashboardPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Record<string, Payment[]>>({});
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCreateLoanModal, setShowCreateLoanModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("loans")
      .select(`
        *,
        profiles!loans_borrower_id_fkey (
          full_name
        )
      `)
      .or(`lender_id.eq.${session.user.id},borrower_id.eq.${session.user.id}`)
      .eq("status", "active")
      .order("issue_date", { ascending: false });

    if (!error && data) {
      setLoans(data as Loan[]);
    }
    setLoading(false);
  };

  const loadPayments = async (loanId: string) => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("loan_id", loanId)
      .order("payment_date", { ascending: false });

    if (!error && data) {
      setPayments((prev) => ({ ...prev, [loanId]: data }));
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

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await (supabase.from("payments") as any).insert({
      loan_id: selectedLoan.id,
      amount: data.amount,
      payment_date: data.payment_date,
      payment_method: data.payment_method,
      notes: data.notes || null,
      created_by: session.user.id,
    });

    if (!error) {
      await loadLoans();
      if (selectedLoan) {
        await loadPayments(selectedLoan.id);
      }
    }

    return { success: !error, error: error?.message };
  };

  const handleAddNewLoan = () => {
    setShowCreateLoanModal(true);
  };

  const handleCreateLoanSubmit = async (data: CreateLoanFormData) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    const { data: borrowerProfile, error: profileError } = await (supabase
      .from("profiles") as any)
      .select("id")
      .eq("email", data.borrower_email)
      .maybeSingle();

    if (profileError || !borrowerProfile) {
      return { success: false, error: "Borrower not found - The user must be registered" };
    }

    const { error: insertError } = await (supabase.from("loans") as any).insert({
      lender_id: session.user.id,
      borrower_id: borrowerProfile.id,
      amount: data.amount,
      remaining_amount: data.amount,
      issue_date: data.issue_date,
      due_date: data.due_date || null,
      notes: data.notes || null,
    });

    if (!insertError) {
      await loadLoans();
      return { success: true };
    } else {
      return { success: false, error: insertError.message };
    }
  };

  const handleDeleteLoan = async (loanId: string) => {
    setDeleting(loanId);
    const { error } = await supabase
      .from("loans")
      .delete()
      .eq("id", loanId);

    if (!error) {
      await loadLoans();
    }
    setDeleting(null);
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
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Overview of your lending activities
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard/loans")}>
              <BarChart3 className="size-4 mr-2" />
              View All Loans
            </Button>
            <Button onClick={handleAddNewLoan}>
              <Plus className="size-4 mr-2" />
              Add New Loan
            </Button>
          </div>
        </div>

        <StatsSummary
          totalOwed={totalOwed}
          activeLoans={loans.length}
          latestPayment={latestPayment}
          latestPaymentFrom={latestPaymentFrom}
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading dashboard...</p>
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
            {loans.slice(0, 6).map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onLogPayment={handleLogPayment}
                onViewHistory={handleViewHistory}
                onDelete={handleDeleteLoan}
              />
            ))}
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
