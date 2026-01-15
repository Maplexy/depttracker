-- Migration: 001_initial_schema.sql
-- Description: Create tables for profiles, loans, and payments with RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lender_id UUID REFERENCES profiles(id) NOT NULL,
  borrower_id UUID REFERENCES profiles(id) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  remaining_amount DECIMAL(12, 2) NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'cash', 'other')),
  notes TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_loans_lender ON loans(lender_id);
CREATE INDEX IF NOT EXISTS idx_loans_borrower ON loans(borrower_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_payments_loan ON payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON loans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for loans
CREATE POLICY "Users can view loans where they are lender or borrower"
  ON loans FOR SELECT
  USING (
    auth.uid() = lender_id
    OR auth.uid() = borrower_id
  );

CREATE POLICY "Users can create loans"
  ON loans FOR INSERT
  WITH CHECK (
    auth.uid() = lender_id
    OR auth.uid() = borrower_id
  );

CREATE POLICY "Users can update loans where they are lender"
  ON loans FOR UPDATE
  USING (auth.uid() = lender_id)
  WITH CHECK (auth.uid() = lender_id);

CREATE POLICY "Users can delete loans where they are lender"
  ON loans FOR DELETE
  USING (auth.uid() = lender_id);

-- RLS Policies for payments
CREATE POLICY "Users can view payments for their loans"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = payments.loan_id
      AND (auth.uid() = loans.lender_id OR auth.uid() = loans.borrower_id)
    )
  );

CREATE POLICY "Users can create payments for their loans"
  ON payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = payments.loan_id
      AND (auth.uid() = loans.lender_id OR auth.uid() = loans.borrower_id)
    )
    AND auth.uid() = created_by
  );

-- Create function to update loan remaining_amount
CREATE OR REPLACE FUNCTION update_loan_remaining_amount()
RETURNS TRIGGER AS $$
DECLARE
  total_paid DECIMAL(12, 2);
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Calculate total paid for this loan
    SELECT COALESCE(SUM(amount), 0) INTO total_paid
    FROM payments
    WHERE loan_id = NEW.loan_id;

    -- Update loan remaining amount
    UPDATE loans
    SET remaining_amount = (SELECT amount FROM loans WHERE id = NEW.loan_id) - total_paid,
        updated_at = NOW()
    WHERE id = NEW.loan_id;

    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    -- Recalculate total paid for this loan
    SELECT COALESCE(SUM(amount), 0) INTO total_paid
    FROM payments
    WHERE loan_id = OLD.loan_id;

    -- Update loan remaining amount
    UPDATE loans
    SET remaining_amount = (SELECT amount FROM loans WHERE id = OLD.loan_id) - total_paid,
        updated_at = NOW()
    WHERE id = OLD.loan_id;

    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger for payments
CREATE TRIGGER update_remaining_amount_on_payment
  AFTER INSERT OR DELETE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_loan_remaining_amount();

-- Create function to create profile after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
