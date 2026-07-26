import { Link } from "@tanstack/react-router";
import { Sun, Moon, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition hover:opacity-90"
          >
            About Bharat360
          </button>
        </div>
      </div>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[480px] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute right-6 top-6 grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                style={{ background: "var(--gradient-tiranga)" }}
              >
                <span className="h-3.5 w-3.5 rounded-full bg-background" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">About Bharat360</h2>
            </div>
            
            <div className="space-y-4 text-[14.5px] leading-relaxed text-muted-foreground">
              <p>
                Bharat360 is an interactive data storytelling platform that brings together trusted global datasets to help users understand India's progress across multiple development indicators.
              </p>
              <p>
                Instead of presenting isolated charts, Bharat360 transforms data into contextual insights through visualizations, comparisons, AI-assisted narratives, and transparent source attribution.
              </p>
            </div>
            
            <div className="mt-8 rounded-2xl bg-secondary/50 p-4 border hairline">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Data Sources</h3>
              <p className="text-[13px] font-medium text-foreground">
                World Bank • WHO • UNDP • Yale EPI • Oxford Insights • WIPO • Our World in Data
              </p>
            </div>
            
            <div className="mt-8 text-center text-[12px] text-muted-foreground/60 font-medium tracking-wide">
              Version 1.0
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

