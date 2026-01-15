import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to DebtTracker</h1>
        <p className="text-muted-foreground mb-8">
          Secure private lending management
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg h-11 px-4 bg-primary text-primary-foreground text-sm font-bold transition-all hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg h-11 px-4 bg-secondary text-secondary-foreground text-sm font-bold transition-all hover:bg-secondary/80"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
