import { Link } from "@tanstack/react-router";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    const root = window.document.documentElement;
    if (next === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="relative z-50 bg-transparent">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6 lg:px-10">
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

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border hairline bg-background/40 backdrop-blur-md text-muted-foreground transition hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition hover:opacity-90">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}

