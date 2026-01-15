"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logPayment(data: {
  loan_id: string;
  amount: number;
  payment_date: string;
  payment_method: "bank_transfer" | "cash" | "other";
  notes?: string;
}) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session || !session.user) {
    return { error: "Unauthorized - Please log in again" };
  }

  const { error } = await (supabase.from("payments") as any).insert({
    loan_id: data.loan_id,
    amount: data.amount,
    payment_date: data.payment_date,
    payment_method: data.payment_method,
    notes: data.notes || null,
    created_by: session.user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/loans");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function getLoans() {
  console.log("getLoans called");
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session || !session.user) {
    console.log("No session in getLoans");
    return { error: "Unauthorized - Please log in again" };
  }

  console.log("Fetching loans for user:", session.user.id);

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

  if (error) {
    console.error("Error fetching loans:", error);
    return { error: error.message };
  }

  console.log("Loans fetched:", data?.length || 0);

  return { loans: data || [] };
}

export async function getPayments(loanId: string) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session || !session.user) {
    return { error: "Unauthorized - Please log in again" };
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("loan_id", loanId)
    .order("payment_date", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { payments: data || [] };
}

export async function createLoan(data: {
  borrower_email: string;
  amount: number;
  issue_date: string;
  due_date?: string;
  notes?: string;
}) {
  console.log("createLoan called with:", data);

  const supabase = await createClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Session error:", sessionError);
    return { error: `Session error: ${sessionError.message}` };
  }

  if (!session || !session.user) {
    console.error("No session found");
    return { error: "Unauthorized - Please log in again" };
  }

  console.log("User authenticated:", session.user.id);

  const { data: borrowerProfile, error: profileError } = await (supabase
    .from("profiles") as any)
    .select("id")
    .eq("email", data.borrower_email)
    .maybeSingle();

  if (profileError) {
    console.error("Profile lookup error:", profileError);
    return { error: `Profile lookup failed: ${profileError.message}` };
  }

  if (!borrowerProfile) {
    console.log("Borrower not found for email:", data.borrower_email);
    return { error: "Borrower not found - The user must be registered" };
  }

  console.log("Borrower profile found:", borrowerProfile.id);

  const { error: insertError } = await (supabase.from("loans") as any).insert({
    lender_id: session.user.id,
    borrower_id: borrowerProfile.id,
    amount: data.amount,
    remaining_amount: data.amount,
    issue_date: data.issue_date,
    due_date: data.due_date || null,
    notes: data.notes || null,
  });

  if (insertError) {
    console.error("Loan insert error:", insertError);
    return { error: insertError.message };
  }

  console.log("Loan created successfully");

  revalidatePath("/dashboard/loans");
  revalidatePath("/dashboard");

  return { success: true };
}
