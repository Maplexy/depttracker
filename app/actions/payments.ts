"use server";

import { logPayment } from "./loans";
import type { PaymentFormData } from "@/components/loans/payment-modal";

export async function handlePaymentSubmit(data: PaymentFormData & { loanId: string }) {
  const result = await logPayment({
    loan_id: data.loanId,
    amount: data.amount,
    payment_date: data.payment_date,
    payment_method: data.payment_method,
    notes: data.notes,
  });

  return result;
}
