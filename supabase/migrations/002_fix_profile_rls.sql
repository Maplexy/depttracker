-- Migration: Add profile lookup policy for loan creation
-- Description: Allow users to view other profiles when creating loans

-- Drop existing restrictive profile view policy
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new policy that allows viewing all profiles (needed for loan creation)
-- Email addresses are already public in auth.users, so this is safe
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);
