import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Moon,
  Sun,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Globe2,
  Map as MapIcon,
  BookOpen,
  Lightbulb,
  Target,
  Compass,
  ExternalLink,
  FileText,
  Database,
  Newspaper,
  Link2,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Domain, DomainSlug } from "@/lib/domains";
import { DOMAIN_LIST } from "@/lib/domains";

const YEARS = ["FY 2020-21", "FY 2021-22", "FY 2022-23", "FY 2023-24", "FY 2024-25"];

/* =================== SIDEBAR =================== */
function Sidebar({
  active,
  collapsed,
  onToggle,
}: {
  active: DomainSlug;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`${collapsed ? "w-[72px]" : "w-[248px]"} shrink-0 border-r hairline bg-surface/60 backdrop-blur-xl transition-[width] duration-300`}
    >
      <div className="sticky top-0 flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center gap-2 border-b hairline px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
              style={{ background: "var(--gradient-tiranga)" }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-background" />
            </span>
            {!collapsed && (
              <span className="truncate text-[15px] font-semibold tracking-tight">Bharat360</span>
            )}
          </Link>
          <button
            onClick={onToggle}
            className="ml-auto grid h-7 w-7 place-items-center rounded-full border hairline text-muted-foreground hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {!collapsed && (
            <div className="px-2 pb-2 pt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Domains
            </div>
          )}
          <ul className="space-y-1">
            {DOMAIN_LIST.map((d) => {
              const Icon = d.icon;
              const isActive = d.slug === active;
              return (
                <li key={d.slug}>
                  <Link
                    to="/dashboard/$domain"
                    params={{ domain: d.slug }}
                    className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{d.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {!collapsed && (
            <>
              <div className="px-2 pb-2 pt-6 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Explore
              </div>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/compare"
                    className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Globe2 className="h-4 w-4" /> Compare
                  </Link>
                </li>
              </ul>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}

/* =================== TOP BAR =================== */
function TopBar({
  domain,
  fy,
  onFy,
  dark,
  onDark,
}: {
  domain: Domain;
  fy: string;
  onFy: (v: string) => void;
  dark: boolean;
  onDark: () => void;
}) {
  return (
    <div className="sticky top-0 z-40 border-b hairline bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="chip">Dashboard</span>
          <h1 className="truncate text-[15px] font-semibold tracking-tight">{domain.name}</h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border hairline bg-secondary/60 px-3.5 py-1.5 text-[13px] text-muted-foreground md:flex">
            <Search className="h-3.5 w-3.5" />
            <input
              placeholder={`Search ${domain.name.toLowerCase()} datasets…`}
              className="w-56 bg-transparent outline-none placeholder:text-muted-foreground/70"
            />
            <kbd className="rounded border hairline bg-background px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </div>

          <div className="relative">
            <select
              value={fy}
              onChange={(e) => onFy(e.target.value)}
              className="appearance-none rounded-full border hairline bg-background py-2 pl-4 pr-9 text-[13px] font-medium hover:bg-secondary"
            >
              {YEARS.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-muted-foreground" />
          </div>

          <button
            onClick={onDark}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border hairline bg-background text-muted-foreground hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            aria-label="Notifications"
            className="grid h-9 w-9 place-items-center rounded-full border hairline bg-background text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background hover:opacity-90">
            <Download className="h-3.5 w-3.5" /> Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================== SPARK =================== */
function Spark({ data, color = "currentColor" }: { data: number[]; color?: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sg-${color})`}
            isAnimationActive
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* =================== KPI CARDS =================== */
function KPISection({ domain }: { domain: Domain }) {
  const accents = ["var(--saffron)", "var(--green)", "var(--blue)", "var(--foreground)"];
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {domain.kpis.map((k, i) => {
        const c = accents[i % 4];
        const Trend = k.trend === "up" ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={k.label}
            className="group card-surface relative overflow-hidden p-6 transition hover:shadow-md"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-[0.06] blur-2xl transition-opacity group-hover:opacity-[0.12]"
              style={{ background: c }}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {k.label}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  k.trend === "up" ? "bg-green-soft text-green" : "bg-saffron-soft text-saffron"
                }`}
                style={{
                  backgroundColor:
                    k.trend === "up" ? "var(--green-soft)" : "var(--saffron-soft)",
                  color: k.trend === "up" ? "var(--green)" : "var(--saffron)",
                }}
              >
                <Trend className="h-3 w-3" />
                {k.delta}
              </span>
            </div>
            <div className="mt-4 font-display text-[42px] leading-none tracking-tight">
              {k.value}
            </div>
            <div className="mt-1 text-[12.5px] text-muted-foreground">{k.hint}</div>
            <div className="mt-4" style={{ color: c }}>
              <Spark data={k.spark} color={c} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* =================== GLOBAL RANKING =================== */
function RankingSection({ domain }: { domain: Domain }) {
  const rankPct = 1 - domain.rank / domain.outOf;
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* World position hero */}
      <div className="card-surface relative overflow-hidden p-6 lg:col-span-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="chip"><Trophy className="h-3 w-3" /> Global Ranking</div>
            <h2 className="mt-4 font-display text-[46px] leading-none tracking-tight">
              #{domain.rank} <span className="text-muted-foreground/70">of {domain.outOf}</span>
            </h2>
            <p className="mt-2 max-w-md text-[13.5px] text-muted-foreground">
              India's world position in {domain.name.toLowerCase()}. Improved{" "}
              <span className="font-medium text-foreground">{domain.rankDelta} places</span> vs last cycle.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-secondary" />
                <circle
                  cx="50" cy="50" r="42"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="fill-none"
                  stroke="var(--saffron)"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - rankPct)}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Percentile</div>
                  <div className="font-display text-2xl leading-none">{Math.round(rankPct * 100)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 h-px w-full bg-hairline" style={{ backgroundColor: "var(--color-hairline)" }} />
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[
            ["Last year", `#${domain.rank + domain.rankDelta}`],
            ["Peak", `#${Math.max(1, domain.rank - 3)}`],
            ["Regional", "#2 in Asia"],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{l}</div>
              <div className="mt-1 font-display text-2xl">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ladder */}
      <div className="card-surface p-6">
        <div className="chip"><Globe2 className="h-3 w-3" /> Ranking Ladder</div>
        <ul className="mt-4 space-y-2">
          {domain.topCountries.map((c, i) => {
            const max = Math.max(...domain.topCountries.map((x) => x.value));
            const w = (c.value / max) * 100;
            const isIndia = c.code === "IN";
            return (
              <li
                key={c.code}
                className={`relative overflow-hidden rounded-xl border hairline px-3 py-2.5 ${
                  isIndia ? "bg-saffron-soft" : "bg-surface"
                }`}
                style={{ backgroundColor: isIndia ? "var(--saffron-soft)" : undefined }}
              >
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 opacity-30"
                  style={{
                    width: `${w}%`,
                    background: isIndia ? "var(--saffron)" : "var(--muted)",
                    transition: "width 1s ease",
                  }}
                />
                <div className="relative flex items-center gap-3">
                  <span className="w-5 text-[11px] font-medium text-muted-foreground">#{i + 1}</span>
                  <span className="grid h-6 w-8 place-items-center rounded-md border hairline bg-background text-[10px] font-semibold">
                    {c.code}
                  </span>
                  <span className={`text-[13.5px] ${isIndia ? "font-semibold" : ""}`}>
                    {c.name}
                  </span>
                  <span className="ml-auto text-[12.5px] tabular-nums text-muted-foreground">
                    {c.value}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* =================== COMPARISON CHART =================== */
function ComparisonSection({ domain }: { domain: Domain }) {
  const data = domain.topCountries.map((c) => ({ name: c.name, value: c.value, code: c.code }));
  return (
    <section className="card-surface p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="chip"><Target className="h-3 w-3" /> India vs Top Countries</div>
          <h2 className="mt-3 font-display text-3xl tracking-tight">
            Where India stands, at a glance
          </h2>
        </div>
        <div className="flex gap-1 rounded-full border hairline bg-secondary/60 p-1 text-[12px]">
          {["Absolute", "Per capita", "Growth"].map((t, i) => (
            <button
              key={t}
              className={`rounded-full px-3 py-1 ${i === 0 ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 h-[320px] w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-hairline)",
                background: "var(--color-popover)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} animationDuration={900}>
              {data.map((d) => (
                <Cell key={d.code} fill={d.code === "IN" ? "var(--saffron)" : "var(--muted)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/* =================== TREND SECTION =================== */
function TrendSection({ domain }: { domain: Domain }) {
  return (
    <section className="card-surface p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="chip">Historical Trend</div>
          <h2 className="mt-3 font-display text-3xl tracking-tight">
            A decade of {domain.name.toLowerCase()}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: "var(--saffron)" }} /> India
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50" /> World avg
          </span>
        </div>
      </div>
      <div className="mt-6 h-[340px] w-full">
        <ResponsiveContainer>
          <LineChart data={domain.trend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="indiaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--saffron)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--saffron)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-hairline)",
                background: "var(--color-popover)",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="world"
              stroke="var(--color-muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey="india"
              stroke="var(--saffron)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--saffron)" }}
              activeDot={{ r: 5 }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline */}
      <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-1">
        {domain.trend.map((t, i) => (
          <button
            key={t.year}
            className={`shrink-0 rounded-full border hairline px-3 py-1 text-[11.5px] tabular-nums ${
              i === domain.trend.length - 1 ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.year}
          </button>
        ))}
      </div>
    </section>
  );
}

/* =================== STATE MAP (heatmap grid) =================== */
function StateMapSection({ domain }: { domain: Domain }) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...domain.states.map((s) => s.value));
  const min = Math.min(...domain.states.map((s) => s.value));
  const top = [...domain.states].sort((a, b) => b.value - a.value).slice(0, 5);
  const bottom = [...domain.states].sort((a, b) => a.value - b.value).slice(0, 5);
  const selected = domain.states.find((s) => s.code === hover);

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="card-surface p-6 lg:col-span-3">
        <div className="chip"><MapIcon className="h-3 w-3" /> India — State performance</div>
        <h2 className="mt-3 font-display text-2xl tracking-tight">Interactive state map</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Hover a state tile to see its {domain.name.toLowerCase()} score.
        </p>

        <div className="mt-6 grid grid-cols-6 gap-1.5 sm:grid-cols-9">
          {domain.states.map((s) => {
            const t = (s.value - min) / (max - min || 1);
            const bg =
              domain.accent === "green"
                ? `color-mix(in oklab, var(--green) ${20 + t * 70}%, var(--surface))`
                : domain.accent === "blue"
                ? `color-mix(in oklab, var(--blue) ${20 + t * 70}%, var(--surface))`
                : domain.accent === "navy"
                ? `color-mix(in oklab, var(--navy) ${15 + t * 65}%, var(--surface))`
                : `color-mix(in oklab, var(--saffron) ${20 + t * 70}%, var(--surface))`;
            return (
              <button
                key={s.code}
                onMouseEnter={() => setHover(s.code)}
                onMouseLeave={() => setHover(null)}
                className="group relative aspect-square rounded-lg border hairline text-[10px] font-semibold text-foreground/80 transition-transform hover:scale-[1.06] hover:shadow-md"
                style={{ backgroundColor: bg }}
                aria-label={`${s.name}: ${s.value}`}
              >
                {s.code}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>Low</span>
          <span
            className="h-1.5 w-full rounded-full"
            style={{
              background: `linear-gradient(90deg, color-mix(in oklab, var(--${domain.accent === "navy" ? "navy" : domain.accent}) 20%, var(--surface)), var(--${domain.accent === "navy" ? "navy" : domain.accent}))`,
            }}
          />
          <span>High</span>
        </div>
      </div>

      <div className="card-surface p-6 lg:col-span-2">
        {selected ? (
          <>
            <div className="chip">{selected.code} • Selected</div>
            <h3 className="mt-3 font-display text-3xl tracking-tight">{selected.name}</h3>
            <div className="mt-2 font-display text-5xl tracking-tight" style={{ color: "var(--saffron)" }}>
              {selected.value}
            </div>
            <div className="text-[12px] text-muted-foreground">Composite score</div>
          </>
        ) : (
          <>
            <div className="chip">Highlights</div>
            <div className="mt-4 grid gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Top 5</div>
                <ul className="mt-2 space-y-1.5 text-[13px]">
                  {top.map((s) => (
                    <li key={s.code} className="flex justify-between">
                      <span>{s.name}</span>
                      <span className="tabular-nums font-medium">{s.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-px" style={{ backgroundColor: "var(--color-hairline)" }} />
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Needs attention</div>
                <ul className="mt-2 space-y-1.5 text-[13px]">
                  {bottom.map((s) => (
                    <li key={s.code} className="flex justify-between text-muted-foreground">
                      <span>{s.name}</span>
                      <span className="tabular-nums">{s.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* =================== BEYOND THE NUMBERS =================== */
function StorySection({ domain }: { domain: Domain }) {
  const cards: { icon: LucideIcon; title: string; body: React.ReactNode; accent: string }[] = [
    {
      icon: BookOpen,
      title: "The Story",
      body: (
        <>
          <h3 className="font-display text-2xl leading-tight tracking-tight">
            {domain.story.title}
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {domain.story.body}
          </p>
        </>
      ),
      accent: "var(--saffron)",
    },
    {
      icon: Lightbulb,
      title: "AI Insights",
      body: (
        <ul className="space-y-3">
          {domain.story.insights.map((i) => (
            <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--blue)" }} />
              <span>{i}</span>
            </li>
          ))}
        </ul>
      ),
      accent: "var(--blue)",
    },
    {
      icon: Target,
      title: "Recommendations",
      body: (
        <ol className="space-y-3">
          {domain.story.recommendations.map((r, i) => (
            <li key={r} className="flex gap-3 text-[13.5px] leading-relaxed">
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: "var(--green-soft)", color: "var(--green)" }}
              >
                {i + 1}
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ol>
      ),
      accent: "var(--green)",
    },
    {
      icon: Compass,
      title: "Why It Matters",
      body: (
        <p className="text-[14px] leading-relaxed text-muted-foreground">{domain.story.whyItMatters}</p>
      ),
      accent: "var(--foreground)",
    },
  ];

  return (
    <section>
      <div className="flex items-end justify-between">
        <div>
          <div className="chip"><Sparkles className="h-3 w-3" /> Beyond the numbers</div>
          <h2 className="mt-3 font-display text-3xl tracking-tight">
            The <span className="font-editorial">human</span> layer of the data
          </h2>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="card-surface p-6">
              <div className="flex items-center gap-2">
                <span
                  className="grid h-8 w-8 place-items-center rounded-full"
                  style={{ background: "color-mix(in oklab, " + c.accent + " 12%, transparent)", color: c.accent }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {c.title}
                </span>
              </div>
              <div className="mt-4">{c.body}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =================== CONTINUE EXPLORING =================== */
const KIND_ICON: Record<string, LucideIcon> = {
  Dataset: Database,
  Report: FileText,
  Article: Newspaper,
  Source: Link2,
};
function ExploreSection({ domain }: { domain: Domain }) {
  return (
    <section>
      <div className="flex items-end justify-between">
        <div>
          <div className="chip">Continue exploring</div>
          <h2 className="mt-3 font-display text-3xl tracking-tight">Related datasets & reads</h2>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {domain.related.map((r, i) => {
          const Icon = KIND_ICON[r.kind] ?? FileText;
          return (
            <a
              key={r.title}
              href="#"
              className={`bento bento-hover flex flex-col justify-between ${i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-1" : ""}`}
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <Icon className="h-3.5 w-3.5" /> {r.kind}
              </div>
              <div className="mt-6">
                <h3 className="font-display text-2xl leading-tight tracking-tight">{r.title}</h3>
                <div className="mt-2 text-[12.5px] text-muted-foreground">via {r.source}</div>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium">
                Open <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* =================== SOURCES =================== */
function SourcesSection({ domain }: { domain: Domain }) {
  return (
    <section className="card-surface p-6">
      <div className="flex items-center gap-2">
        <span className="chip">Sources</span>
        <span className="text-[12px] text-muted-foreground">All data below is aggregated from public and international agencies.</span>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {domain.sources.map((s) => (
          <li
            key={s.name}
            className="flex items-center justify-between rounded-xl border hairline bg-surface px-3.5 py-3"
          >
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium">{s.name}</div>
              <div className="truncate text-[11.5px] text-muted-foreground">{s.url}</div>
            </div>
            <div className="ml-2 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">{s.updated}</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* =================== TEMPLATE =================== */
export function DomainDashboard({ domain }: { domain: Domain }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [fy, setFy] = useState(YEARS[YEARS.length - 1]);

  const containerClass = useMemo(() => (dark ? "dark" : ""), [dark]);

  return (
    <div className={containerClass}>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar active={domain.slug} collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar domain={domain} fy={fy} onFy={setFy} dark={dark} onDark={() => setDark((v) => !v)} />
          <main className="mx-auto w-full max-w-[1400px] space-y-6 px-6 py-8">
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
              <div className="min-w-0">
                <div className="chip">{fy}</div>
                <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
                  {domain.name} <span className="font-editorial text-muted-foreground/80">of India</span>
                </h1>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                  {domain.tagline}. A living dashboard of India's performance across global benchmarks.
                </p>
              </div>
              <div className="hidden sm:flex sm:shrink-0 sm:items-center sm:gap-3">
                <div className="rounded-full border hairline bg-surface px-4 py-2 text-[12px]">
                  <span className="text-muted-foreground">Rank</span>{" "}
                  <span className="font-semibold">#{domain.rank}</span>
                </div>
                <div className="rounded-full border hairline bg-surface px-4 py-2 text-[12px]">
                  <span className="text-muted-foreground">Trend</span>{" "}
                  <span className="font-semibold" style={{ color: "var(--green)" }}>
                    ▲ {domain.rankDelta} yoy
                  </span>
                </div>
              </div>
            </header>

            <KPISection domain={domain} />
            <RankingSection domain={domain} />
            <ComparisonSection domain={domain} />
            <TrendSection domain={domain} />
            <StateMapSection domain={domain} />
            <StorySection domain={domain} />
            <ExploreSection domain={domain} />
            <SourcesSection domain={domain} />

            <div className="pt-4 pb-8 text-center text-[11px] text-muted-foreground">
              Bharat360 · Data updated {domain.sources[0]?.updated ?? "recently"} · Made with care
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
