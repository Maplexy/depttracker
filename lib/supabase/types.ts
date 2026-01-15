export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
      };
      loans: {
        Row: {
          amount: number;
          borrower_id: string;
          created_at: string;
          due_date: string | null;
          id: string;
          issue_date: string;
          lender_id: string;
          notes: string | null;
          remaining_amount: number;
          status: "active" | "paid" | "cancelled";
          updated_at: string;
        };
        Insert: {
          amount: number;
          borrower_id: string;
          created_at?: string;
          due_date?: string | null;
          id?: string;
          issue_date: string;
          lender_id: string;
          notes?: string | null;
          remaining_amount?: number;
          status?: "active" | "paid" | "cancelled";
          updated_at?: string;
        };
        Update: {
          amount?: number;
          borrower_id?: string;
          created_at?: string;
          due_date?: string | null;
          id?: string;
          issue_date?: string;
          lender_id?: string;
          notes?: string | null;
          remaining_amount?: number;
          status?: "active" | "paid" | "cancelled";
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          amount: number;
          created_at: string;
          created_by: string;
          id: string;
          loan_id: string;
          notes: string | null;
          payment_date: string;
          payment_method: "bank_transfer" | "cash" | "other";
        };
        Insert: {
          amount: number;
          created_at?: string;
          created_by: string;
          id?: string;
          loan_id: string;
          notes?: string | null;
          payment_date: string;
          payment_method: "bank_transfer" | "cash" | "other";
        };
        Update: {
          amount?: number;
          created_at?: string;
          created_by?: string;
          id?: string;
          loan_id?: string;
          notes?: string | null;
          payment_date?: string;
          payment_method?: "bank_transfer" | "cash" | "other";
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
