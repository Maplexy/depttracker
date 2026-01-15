# Authentication Setup Guide

## Overview
This application now has full Supabase Authentication support. Users can sign up, sign in, and access protected dashboard pages.

## How to Get Started

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in/create an account
2. Create a new project
3. Wait for the project to be ready (usually takes 1-2 minutes)

### Step 2: Run the Database Migration
1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the query

This will create:
- `profiles` table (linked to auth.users)
- `loans` table with RLS policies
- `payments` table with RLS policies
- Automatic triggers for data updates

### Step 3: Configure Environment Variables
1. In your Supabase dashboard, go to **Project Settings** → **API**
2. Copy the **Project URL** and **anon public** key
3. Create a `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 4: Configure Email Settings (Optional)
If you want email confirmation:

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Click on **Email**
3. Enable **Confirm email**
4. Configure your SMTP settings or use the default (works in development)

**Note**: In development, you can skip email confirmation by disabling the toggle.

### Step 5: Create Your Account
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to:
   - **Sign Up**: http://localhost:3000/signup
   - **Sign In**: http://localhost:3000/login

3. Fill in your details and create an account

### Step 6: Access the Dashboard
After signing in, you'll be redirected to:
- http://localhost:3000/dashboard/loans

From there, you can:
- Create new loans
- Log payments
- View transaction history
- Track repayment progress

## Testing Without Email Confirmation

If you want to test quickly without setting up email:

1. In Supabase dashboard, go to **Authentication** → **Providers** → **Email**
2. Disable **Confirm email**
3. Now users can sign in immediately after registration

## Troubleshooting

### "Invalid login credentials"
- Check your email and password are correct
- Make sure you've created an account first

### "User not confirmed"
- Check your email inbox for confirmation link
- Or disable email confirmation in Supabase Auth settings

### "Cannot read properties of undefined"
- Make sure `.env.local` is properly configured
- Restart the development server after creating `.env.local`

### Database errors
- Ensure you've run the migration script in Supabase SQL Editor
- Check that RLS policies are enabled

## Security Features

The authentication system includes:

1. **Row Level Security (RLS)**: Users can only see their own loans and payments
2. **Protected Routes**: Dashboard pages require authentication
3. **Server Actions**: Secure form submissions via Supabase
4. **Session Management**: Automatic session handling with Supabase Auth

## Next Steps

After setting up authentication:

1. Create your first loan
2. Add a friend's email as borrower
3. Log payments to track progress
4. View transaction history in the sidebar
