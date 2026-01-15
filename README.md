# Loan Tracker App

A production-ready Next.js 14 application for tracking private lending between friends and family, built with Supabase backend.

## Features

- 🎨 **Unified Dark Mode Design**: Consistent Emerald Green theme across all components
- 🔒 **Row Level Security**: Users can only see loans where they are lender or borrower
- 💰 **Automatic Calculations**: Remaining amounts update automatically when payments are logged
- 📊 **Dashboard & Analytics**: View total owed, active loans, and payment history
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Real-time Updates**: Server Actions for instant data updates

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI Components**: Custom shadcn/ui-style components
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   cd "D:\Projects\loan app"
   npm install
   ```

2. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Navigate to the SQL Editor in your Supabase dashboard
   - Copy and run the SQL from `supabase/migrations/001_initial_schema.sql`
   - Enable email confirmation in Supabase Auth settings (optional)

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Authentication

The application now has full authentication support:

- **Sign Up**: Create a new account at `/signup`
- **Sign In**: Login at `/login` with email and password
- **Sign Out**: Click the logout button in the header
- **Protected Routes**: Dashboard routes are protected - unauthenticated users are redirected to login

To test:
1. Visit http://localhost:3000/signup
2. Fill in your details and create an account
3. Check your email for confirmation (if email confirmation is enabled)
4. Sign in at http://localhost:3000/login
5. Access your dashboard at http://localhost:3000/dashboard

## Project Structure

```
app/
├── (auth)/              # Authentication routes (login)
├── (dashboard)/         # Dashboard and loans pages
├── actions/             # Server Actions for data operations
├── components/          # React components
│   ├── ui/              # Base UI components
│   ├── layout/          # Header and footer
│   ├── loans/           # Loan-related components
│   └── stats/           # Statistics components
└── lib/                 # Utilities and Supabase client
```

## Database Schema

### Tables
- **profiles**: User profiles linked to Supabase Auth
- **loans**: Loan records with lender/borrower relationships
- **payments**: Payment transactions linked to loans

### Key Features
- Automatic `remaining_amount` calculation via database triggers
- Row Level Security (RLS) for data isolation
- Automatic profile creation on user signup

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## Color Palette

The application uses a unified dark mode design system:

- **Primary**: Emerald Green (#10b981)
- **Background**: Dark Slate (#09090b)
- **Card**: Zinc (#18181b)
- **Text**: Zinc Grays (#fafafa, #a1a1aa)

See [COLOR_PALETTE.md](./COLOR_PALETTE.md) for complete reference.

## Security

- Row Level Security ensures users can only access their own data
- Server Actions prevent client-side manipulation
- All database queries are protected by RLS policies
- Environment variables for sensitive configuration

## Future Enhancements

- [ ] Email authentication with Supabase Auth
- [ ] Real-time updates using Supabase Realtime
- [ ] Email notifications for late payments
- [ ] PDF/CSV export for reports
- [ ] Multi-currency support
- [ ] Recurring payment tracking

## Contributing

This is a private lending management application. Ensure you follow best practices:

1. Use TypeScript for all new code
2. Follow the existing color palette
3. Implement RLS policies for any new tables
4. Test server actions thoroughly
5. Update the database schema documentation

## License

© 2024 DebtTracker. All rights reserved.

## Support

For issues or questions, please refer to the Supabase documentation:
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Next.js Documentation](https://nextjs.org/docs)
