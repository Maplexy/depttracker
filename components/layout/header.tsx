"use client";

import Link from "next/link";
import { Wallet, Search, Bell, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    isActive(path)
      ? "text-foreground text-sm font-medium border-b-2 border-primary pb-0.5"
      : "text-muted-foreground hover:text-primary text-sm font-medium transition-colors";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Wallet className="size-6" />
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              DebtTracker
            </h2>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={navLinkClass("/dashboard")}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/loans"
              className={navLinkClass("/dashboard/loans")}
            >
              Loans
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <input
              className="w-64 bg-muted border-none rounded-lg py-1.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              placeholder="Search friends or loans..."
              type="text"
            />
          </div>
          <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg">
            <Bell className="size-5" />
          </button>
          <form action={signOut}>
            <button
              type="submit"
              className="p-2 text-muted-foreground hover:bg-muted hover:text-destructive rounded-lg"
              title="Sign out"
            >
              <LogOut className="size-5" />
            </button>
          </form>
          <div className="h-8 w-8 rounded-full bg-muted border border-input" />
        </div>
      </div>
    </header>
  );
}