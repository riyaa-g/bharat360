import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  Globe2,
  Home,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Lightbulb,
} from "lucide-react";
import { DOMAIN_LIST } from "@/lib/domains";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentPath?: string;
  activeDomain?: string;
}

export function Sidebar({ collapsed, onToggle, activeDomain }: SidebarProps) {
  const [domainsExpanded, setDomainsExpanded] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");

      const observer = new MutationObserver(() => {
        setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
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
    <aside
      className={`${
        collapsed ? "w-[72px]" : "w-[248px]"
      } shrink-0 border-r border-zinc-800/80 bg-[#0a1122] dark:bg-[#050914] backdrop-blur-xl transition-[width] duration-300 z-30`}
    >
      <div className="sticky top-0 flex h-full max-h-screen flex-col">
        {/* Toggle Button Only */}
        <div className="flex h-16 items-center px-4 border-b border-zinc-800/50 justify-center lg:justify-start">
          <button
            onClick={onToggle}
            className={`grid h-9 w-9 place-items-center rounded-xl border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-white transition hover:bg-white/5 ${
              collapsed ? "mx-auto" : "ml-auto"
            }`}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {/* Home Link */}
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white [&.active]:bg-white/10 [&.active]:text-white"
                activeOptions={{ exact: true }}
              >
                <Home className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">Home</span>}
              </Link>
            </li>

            {/* Explore Section */}
            <li className="pt-4">
              {!collapsed ? (
                <div className="px-2 pb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-550">
                  Explore
                </div>
              ) : (
                <div className="mx-auto my-1 h-px w-8 bg-zinc-800/60" />
              )}
            </li>

            {/* Domains collapsible group */}
            <li>
              {!collapsed ? (
                <div>
                  <button
                    onClick={() => setDomainsExpanded(!domainsExpanded)}
                    className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[13.5px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span className="flex items-center gap-3 font-medium">
                      Domains
                    </span>
                    {domainsExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {domainsExpanded && (
                    <ul className="mt-1 pl-4 space-y-1 border-l border-zinc-800/60 ml-4">
                      {DOMAIN_LIST.map((d) => {
                        const Icon = d.icon;
                        const isActive = d.slug === activeDomain;
                        return (
                          <li key={d.slug}>
                            <Link
                              to="/dashboard/$domain"
                              params={{ domain: d.slug }}
                              className={`flex items-center gap-3 rounded-xl px-2.5 py-1.5 text-[13px] transition-colors ${
                                isActive
                                  ? "bg-white/15 text-white"
                                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{d.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ) : (
                // Collapsed: just render list of domain icons directly
                <ul className="space-y-1">
                  {DOMAIN_LIST.map((d) => {
                    const Icon = d.icon;
                    const isActive = d.slug === activeDomain;
                    return (
                      <li key={d.slug}>
                        <Link
                          to="/dashboard/$domain"
                          params={{ domain: d.slug }}
                          title={d.name}
                          className={`flex items-center justify-center rounded-xl p-2 transition-colors ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "text-zinc-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            {/* Compare Link */}
            <li className="pt-2">
              <Link
                to="/compare"
                className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white [&.active]:bg-white/10 [&.active]:text-white"
              >
                <Globe2 className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">Compare</span>}
              </Link>
            </li>

            {/* Insights Link */}
            <li>
              <Link
                to="/insights"
                className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white [&.active]:bg-white/10 [&.active]:text-white"
              >
                <Lightbulb className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">India Insights</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Theme Toggle Footer */}
        <div className="p-3 border-t border-zinc-800/50 mt-auto">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 w-full rounded-xl px-2.5 py-2 text-[13px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white ${
              collapsed ? "justify-center" : ""
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 shrink-0 text-amber-500" />
                {!collapsed && <span className="truncate">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">Dark Mode</span>}
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
