import { Link } from "@tanstack/react-router";
import { Search, Bell } from "lucide-react";

const nav = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard/$domain", params: { domain: "economy" } },
  { label: "Compare", to: "/compare" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-8 px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{ background: "var(--gradient-tiranga)" }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-background" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Bharat360</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-full px-3.5 py-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border hairline bg-secondary/60 px-3.5 py-1.5 text-[13px] text-muted-foreground sm:flex">
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="ml-2 rounded border hairline bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>
          <button
            aria-label="Notifications"
            className="grid h-9 w-9 place-items-center rounded-full border hairline bg-background text-muted-foreground transition hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition hover:opacity-90">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
