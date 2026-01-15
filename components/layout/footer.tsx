export default function Footer() {
  return (
    <footer className="border-t py-6 mt-12 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © 2024 DebtTracker. Secure private lending management.
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
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
