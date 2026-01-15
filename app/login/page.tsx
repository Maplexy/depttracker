"use client";

import { useState } from "react";
import { Lock, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/app/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    const result = await signIn(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="text-primary size-6 flex items-center justify-center">
            <Wallet className="size-6" />
          </div>
          <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight">
            Debt Tracker
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/signup"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px] bg-card border border-border rounded-xl shadow-2xl p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 p-3 bg-primary/10 rounded-full text-primary">
              <Lock className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your credentials to manage your portfolio
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@firm.com"
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  className="text-xs font-medium text-primary hover:underline underline-offset-4"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In with Email"}
            </Button>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Security notice
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a
                className="text-primary font-medium hover:underline underline-offset-4 ml-1"
                href="/signup"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 px-6 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <p className="text-xs text-muted-foreground">
            © 2024 Debt Tracker Inc. All rights reserved. Built for private
            lending institutions.
          </p>
          <div className="flex gap-6">
            <a
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
              href="#"
            >
              Security Standards
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
