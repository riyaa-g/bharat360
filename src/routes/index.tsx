import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Lightbulb,
  Wind,
  Leaf,
  Building2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Globe2,
  Coins,
  HeartPulse,
  Cpu,
  GraduationCap,
  Wheat,
  ShieldCheck,
  Landmark,
  Scale,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import indiaHero from "@/assets/india-hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bharat360 — India's progress, measured through data" },
      {
        name: "description",
        content:
          "A premium, AI-powered data platform exploring India's performance across global development indicators — economy, health, education, environment and more.",
      },
      { property: "og:title", content: "Bharat360 — India's progress, measured through data" },
      {
        property: "og:description",
        content:
          "Explore global rankings, compare nations and uncover AI insights on India's journey through trusted international datasets.",
      },
    ],
  }),
  component: Home,
});

/* ---------- tiny inline sparkline ---------- */
function Sparkline({
  points,
  stroke = "currentColor",
  className,
}: {
  points: number[];
  stroke?: string;
  className?: string;
}) {
  const w = 100;
  const h = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Highlights />
      <AtAGlance />
      <Snapshot />
      <Domains />
      <Footer />
    </div>
  );
}

/* ============================================================
   1. HERO
   ============================================================ */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 grid-noise opacity-60" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "var(--gradient-tiranga)" }}
      />
      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pt-16 pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pt-24 lg:pb-32">
        {/* Left */}
        <div className="min-w-0">
          <span className="chip">
            <Sparkles className="h-3 w-3" />
            AI-powered · Updated for FY24
          </span>

          <h1 className="mt-6 text-[46px] leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[76px]">
            India's progress,
            <br />
            <span className="font-editorial text-[52px] sm:text-7xl lg:text-[88px]">measured</span>
            <br />
            through data.
          </h1>

          <p className="mt-7 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
            Explore global rankings, compare nations, uncover AI-powered insights, and
            understand India's journey through trusted international datasets — brought
            together in one editorial view.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] font-medium text-background transition hover:opacity-90">
              Explore Dashboard
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border hairline bg-background px-5 py-3 text-[14px] font-medium text-foreground transition hover:bg-secondary">
              Compare Countries
            </button>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[
                "oklch(0.78 0.17 55)",
                "oklch(0.6 0.18 250)",
                "oklch(0.58 0.14 155)",
                "oklch(0.18 0.03 265)",
              ].map((c, i) => (
                <span
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-background"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span className="text-[13px] text-muted-foreground">
              Trusted by <span className="text-foreground">2,500+</span> data explorers
            </span>
          </div>
        </div>

        {/* Right — India map + floating stat cards */}
        <div className="relative min-h-[520px]">
          <img
            src={indiaHero}
            alt="Silhouette of India filled with a flowing saffron-white-green gradient"
            width={1200}
            height={1408}
            className="mx-auto h-auto w-[86%] max-w-[560px] drop-shadow-[0_40px_80px_oklch(0.16_0.02_265/0.15)]"
          />

          {/* Global Rank card */}
          <div className="card-glass absolute right-2 top-6 w-[190px] p-4 lg:right-6">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Global Rank</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">39</span>
              <span className="text-[13px] text-muted-foreground">/167</span>
            </div>
            <p className="mt-1 text-[11.5px] text-muted-foreground">Overall Index</p>
            <p className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-positive">
              <TrendingUp className="h-3 w-3" /> 2 places
            </p>
          </div>

          {/* GDP card */}
          <div className="card-glass absolute right-6 top-1/2 hidden w-[210px] p-4 sm:block">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">GDP Growth (FY24)</p>
            <div className="mt-1 text-3xl font-semibold tracking-tight">7.8%</div>
            <p className="mt-1 text-[11.5px] text-muted-foreground">
              Among world's <span className="text-foreground">fastest</span>
            </p>
            <Sparkline
              points={[3, 4, 3.5, 5, 6, 5.5, 7, 7.8]}
              stroke="oklch(0.58 0.14 155)"
              className="mt-2 h-6 w-full text-green"
            />
          </div>

          {/* HDI card */}
          <div className="card-glass absolute -bottom-2 left-2 w-[220px] p-4 lg:left-6">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">HDI Rank</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight">132</span>
              <span className="text-[13px] text-muted-foreground">/193</span>
            </div>
            <p className="mt-1 inline-flex items-center gap-1 text-[11.5px] text-positive">
              <TrendingUp className="h-3 w-3" /> 5 places
            </p>
            <Sparkline
              points={[140, 138, 137, 135, 134, 133, 132]}
              stroke="oklch(0.58 0.18 250)"
              className="mt-2 h-6 w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   2. HEADLINES & HIGHLIGHTS  (spacious, editorial rows)
   ============================================================ */
const highlights = [
  {
    category: "Innovation",
    title: "India climbs 2 places in Global Innovation Index",
    time: "2h ago",
    trend: [1, 2, 2, 3, 3, 4, 5],
    trendColor: "oklch(0.58 0.14 155)",
    delta: "+2",
    positive: true,
    icon: Lightbulb,
    tone: "saffron" as const,
  },
  {
    category: "Environment",
    title: "Delhi AQI reaches severe category once again",
    time: "4h ago",
    trend: [3, 3, 4, 3, 5, 6, 5],
    trendColor: "oklch(0.6 0.19 30)",
    delta: "AQI 412",
    positive: false,
    icon: Wind,
    tone: "negative" as const,
  },
  {
    category: "Energy",
    title: "Renewable energy capacity reaches a new record",
    time: "6h ago",
    trend: [2, 3, 3, 4, 5, 6, 7],
    trendColor: "oklch(0.58 0.14 155)",
    delta: "180 GW",
    positive: true,
    icon: Leaf,
    tone: "green" as const,
  },
  {
    category: "Economy",
    title: "GDP growth among the world's fastest this quarter",
    time: "6h ago",
    trend: [3, 4, 4, 5, 5, 6, 7],
    trendColor: "oklch(0.58 0.18 250)",
    delta: "7.8%",
    positive: true,
    icon: Building2,
    tone: "blue" as const,
  },
];

function Highlights() {
  return (
    <section className="relative border-t hairline bg-surface/60">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="chip">The pulse</span>
            <h2 className="mt-4 text-3xl tracking-tight sm:text-4xl">
              Headlines &amp; <span className="font-editorial">highlights</span>
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] text-muted-foreground">
              A curated mix of what's moving India's numbers today — the wins and
              the warnings, side by side.
            </p>
          </div>
          <a
            href="#"
            className="hidden items-center gap-1.5 text-[13.5px] font-medium text-foreground hover:opacity-70 sm:inline-flex"
          >
            View all <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {highlights.map((h) => {
            const Icon = h.icon;
            const toneBg =
              h.tone === "saffron"
                ? "oklch(0.94 0.06 65)"
                : h.tone === "green"
                  ? "oklch(0.94 0.05 155)"
                  : h.tone === "blue"
                    ? "oklch(0.94 0.04 250)"
                    : "oklch(0.96 0.03 30)";
            const toneFg =
              h.tone === "saffron"
                ? "oklch(0.55 0.15 55)"
                : h.tone === "green"
                  ? "oklch(0.45 0.14 155)"
                  : h.tone === "blue"
                    ? "oklch(0.5 0.17 250)"
                    : "oklch(0.55 0.19 30)";
            return (
              <article
                key={h.title}
                className="card-glass group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 p-5 transition hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] sm:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:gap-8 sm:p-6"
              >
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                  style={{ background: toneBg, color: toneFg }}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: toneFg }}
                    >
                      {h.category}
                    </span>
                    <span className="text-[11.5px] text-muted-foreground">{h.time}</span>
                  </div>
                  <h3 className="mt-1 text-[16.5px] font-medium leading-snug tracking-tight text-foreground sm:text-[17.5px]">
                    {h.title}
                  </h3>
                </div>

                <div className="hidden items-center gap-4 sm:flex">
                  <Sparkline
                    points={h.trend}
                    stroke={h.trendColor}
                    className="h-8 w-28"
                  />
                  <span
                    className={`inline-flex items-center gap-1 text-[13px] font-medium ${
                      h.positive ? "text-positive" : "text-negative"
                    }`}
                  >
                    {h.positive ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {h.delta}
                  </span>
                </div>

                <button className="inline-flex items-center gap-1.5 rounded-full border hairline bg-background px-3.5 py-2 text-[12.5px] font-medium text-foreground transition group-hover:bg-foreground group-hover:text-background">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   3. INDIA AT A GLANCE — bento
   ============================================================ */
function AtAGlance() {
  return (
    <section className="border-t hairline">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="chip">Overview</span>
            <h2 className="mt-4 text-3xl tracking-tight sm:text-4xl">
              India at a <span className="font-editorial">glance</span>
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] text-muted-foreground">
              A composite view of India across the indicators that matter most —
              rankings, categories, and momentum.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 lg:gap-5">
          {/* KPI row */}
          <Kpi label="GDP (Nominal)" value="$3.7T" delta="+7.8%" positive />
          <Kpi label="Population" value="1.43B" delta="+0.8%" positive />
          <Kpi label="Per Capita Income" value="$2,663" delta="+6.1%" positive />
          <Kpi label="HDI Rank" value="132" delta="↑ 5" positive />

          {/* Global Position — dark hero tile */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 rounded-[var(--radius-2xl)] p-7 text-background relative overflow-hidden"
            style={{ background: "var(--gradient-ink)" }}>
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--gradient-tiranga)" }}
            />
            <p className="text-[11px] uppercase tracking-wider text-background/60">Global Position</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-6xl font-semibold tracking-tight">39</span>
              <span className="text-sm text-background/60">/167</span>
            </div>
            <p className="mt-2 text-[13px] text-background/70">Overall Index</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-green-soft" style={{ color: "oklch(0.85 0.13 155)" }}>
              <TrendingUp className="h-3.5 w-3.5" /> Up 2 places
            </p>

            <div className="mt-6 h-24 w-full">
              <Sparkline
                points={[52, 48, 47, 45, 44, 42, 41, 39]}
                stroke="oklch(0.85 0.13 155)"
                className="h-24 w-full"
              />
            </div>
          </div>

          {/* Category distribution */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 card-surface p-7">
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-lg font-medium tracking-tight">Category distribution</h3>
                <p className="text-[12.5px] text-muted-foreground">Performance by pillar (out of 100)</p>
              </div>
              <a href="#" className="text-[12.5px] text-muted-foreground hover:text-foreground">View all →</a>
            </div>

            <ul className="mt-6 space-y-3.5">
              {[
                { name: "Economy", value: 72, color: "oklch(0.58 0.14 155)" },
                { name: "Innovation", value: 68, color: "oklch(0.74 0.17 55)" },
                { name: "Education", value: 64, color: "oklch(0.62 0.15 90)" },
                { name: "Health", value: 61, color: "oklch(0.58 0.18 250)" },
                { name: "Environment", value: 58, color: "oklch(0.55 0.12 190)" },
                { name: "Governance", value: 56, color: "oklch(0.68 0.15 70)" },
                { name: "Safety", value: 54, color: "oklch(0.55 0.16 250)" },
              ].map((row) => (
                <li key={row.name} className="grid grid-cols-[110px_minmax(0,1fr)_32px] items-center gap-3">
                  <span className="text-[13px] text-muted-foreground">{row.name}</span>
                  <div className="h-1.5 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${row.value}%`, background: row.color }}
                    />
                  </div>
                  <span className="text-right text-[13px] tabular-nums text-foreground">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trend overview */}
          <div className="col-span-12 lg:col-span-3 card-surface p-6 flex flex-col">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Trend Overview</p>
            <p className="mt-1 text-[13px] text-muted-foreground">India's progress over time</p>
            <div className="mt-4">
              <p className="text-[12.5px] text-muted-foreground">Overall Index</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-positive">+8.4%</p>
              <p className="text-[12px] text-muted-foreground">vs last year</p>
            </div>
            <Sparkline
              points={[40, 42, 44, 46, 48, 51, 55]}
              stroke="oklch(0.58 0.14 155)"
              className="mt-auto h-16 w-full pt-4"
            />
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>2019</span><span>2021</span><span>2024</span>
            </div>
          </div>

          {/* Pillars mini row */}
          <div className="col-span-12 lg:col-span-8 card-surface p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-base font-medium tracking-tight">Global Rank (by pillar)</h3>
                <p className="text-[12.5px] text-muted-foreground">India's rank across key pillars</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { name: "Economy", rank: 42, color: "oklch(0.58 0.14 155)" },
                { name: "Innovation", rank: 40, color: "oklch(0.74 0.17 55)" },
                { name: "Education", rank: 101, color: "oklch(0.58 0.18 250)" },
                { name: "Health", rank: 110, color: "oklch(0.55 0.16 200)" },
              ].map((p) => (
                <div key={p.name} className="rounded-2xl border hairline p-4">
                  <p className="text-[12px] text-muted-foreground">{p.name}</p>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold tracking-tight">{p.rank}</span>
                    <span className="text-[11.5px] text-muted-foreground">/167</span>
                  </p>
                  <Sparkline
                    points={[p.rank + 6, p.rank + 4, p.rank + 3, p.rank + 1, p.rank]}
                    stroke={p.color}
                    className="mt-2 h-6 w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Regional comparison */}
          <div className="col-span-12 lg:col-span-4 card-surface p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-base font-medium tracking-tight">Regional comparison</h3>
                <p className="text-[12.5px] text-muted-foreground">vs Asia average</p>
              </div>
              <Globe2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-5 space-y-4">
              {[
                { name: "India", value: 62.4, color: "var(--gradient-saffron)" },
                { name: "Asia Avg", value: 53.1, color: "oklch(0.85 0.005 265)" },
              ].map((r) => (
                <div key={r.name}>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">{r.name}</span>
                    <span className="tabular-nums">{r.value}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full" style={{ width: `${r.value}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}) {
  return (
    <div className="col-span-6 md:col-span-3 card-surface p-5">
      <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
      <p
        className={`mt-1 inline-flex items-center gap-1 text-[12px] ${
          positive ? "text-positive" : "text-negative"
        }`}
      >
        {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {delta}
      </p>
    </div>
  );
}

/* ============================================================
   4. INDIA'S SNAPSHOT — Excelling / Needs Attention
   ============================================================ */
const excelling = [
  { title: "Digital public infrastructure", desc: "UPI, Aadhaar and DigiLocker set global benchmarks." },
  { title: "Renewable energy capacity", desc: "Solar and wind additions among the world's fastest." },
  { title: "Startup ecosystem", desc: "3rd largest globally with 100+ unicorns." },
  { title: "Space & science", desc: "Cost-efficient missions raise India's global standing." },
];
const attention = [
  { title: "Air quality in major cities", desc: "Winter AQI repeatedly enters severe category." },
  { title: "Female labour participation", desc: "Still below global and regional averages." },
  { title: "Learning outcomes", desc: "Foundational literacy and numeracy remain a gap." },
  { title: "Healthcare spending", desc: "Public health spend lags peer economies." },
];

function Snapshot() {
  return (
    <section className="border-t hairline bg-surface/60">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mb-10">
          <span className="chip">The balance sheet</span>
          <h2 className="mt-4 text-3xl tracking-tight sm:text-4xl">
            India's <span className="font-editorial">snapshot</span>
          </h2>
          <p className="mt-2 max-w-xl text-[14.5px] text-muted-foreground">
            Where the country is pulling ahead — and where the numbers still need work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SnapshotColumn
            tone="green"
            eyebrow="India Excelling"
            items={excelling}
            Icon={CheckCircle2}
          />
          <SnapshotColumn
            tone="saffron"
            eyebrow="Needs Attention"
            items={attention}
            Icon={AlertTriangle}
          />
        </div>
      </div>
    </section>
  );
}

function SnapshotColumn({
  tone,
  eyebrow,
  items,
  Icon,
}: {
  tone: "green" | "saffron";
  eyebrow: string;
  items: { title: string; desc: string }[];
  Icon: typeof CheckCircle2;
}) {
  const bg = tone === "green" ? "oklch(0.94 0.05 155)" : "oklch(0.95 0.06 65)";
  const fg = tone === "green" ? "oklch(0.45 0.14 155)" : "oklch(0.55 0.15 55)";
  return (
    <div className="card-surface p-7">
      <div className="flex items-center gap-3">
        <span
          className="grid h-9 w-9 place-items-center rounded-xl"
          style={{ background: bg, color: fg }}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <h3 className="text-lg font-medium tracking-tight">{eyebrow}</h3>
      </div>
      <ul className="mt-6 divide-y hairline">
        {items.map((it) => (
          <li key={it.title} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
            <div className="min-w-0">
              <p className="text-[15px] font-medium tracking-tight">{it.title}</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{it.desc}</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-full border hairline bg-background px-3 py-1.5 text-[12px] font-medium hover:bg-secondary">
              Explore <ArrowRight className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   5. EXPLORE DOMAINS — bento with varied sizes, toned down
   ============================================================ */
type Domain = {
  name: string;
  Icon: typeof Coins;
  tint: string;      // subtle background wash
  accent: string;    // stroke / accent
  metrics: { label: string; value: string }[];
  spark: number[];
  span: string;      // grid classes
};

const domains: Domain[] = [
  {
    name: "Economy",
    Icon: Coins,
    tint: "oklch(0.97 0.03 65)",
    accent: "oklch(0.74 0.17 55)",
    metrics: [
      { label: "GDP Growth", value: "7.8%" },
      { label: "GDP", value: "$3.7T" },
      { label: "Global Rank", value: "42" },
    ],
    spark: [3, 4, 4, 5, 6, 6, 7, 7.8],
    span: "col-span-12 lg:col-span-7",
  },
  {
    name: "Healthcare",
    Icon: HeartPulse,
    tint: "oklch(0.97 0.02 155)",
    accent: "oklch(0.58 0.14 155)",
    metrics: [
      { label: "Life Expectancy", value: "69.4" },
      { label: "Doctors / 1k", value: "2.1" },
      { label: "Global Rank", value: "110" },
    ],
    spark: [65, 66, 67, 68, 68.5, 69, 69.4],
    span: "col-span-12 md:col-span-6 lg:col-span-5",
  },
  {
    name: "Technology",
    Icon: Cpu,
    tint: "oklch(0.18 0.03 265)",
    accent: "oklch(0.85 0.02 250)",
    metrics: [
      { label: "Startup Rank", value: "3rd" },
      { label: "Tech Funding", value: "$31B" },
      { label: "Global Rank", value: "38" },
    ],
    spark: [20, 22, 25, 27, 29, 32, 38],
    span: "col-span-12 md:col-span-6 lg:col-span-4",
  },
  {
    name: "Education",
    Icon: GraduationCap,
    tint: "oklch(0.96 0.03 250)",
    accent: "oklch(0.58 0.18 250)",
    metrics: [
      { label: "Literacy", value: "78%" },
      { label: "Gross Enrol.", value: "26M" },
      { label: "Global Rank", value: "101" },
    ],
    spark: [70, 72, 73, 75, 76, 77, 78],
    span: "col-span-12 md:col-span-6 lg:col-span-4",
  },
  {
    name: "Agriculture",
    Icon: Wheat,
    tint: "oklch(0.96 0.04 120)",
    accent: "oklch(0.55 0.14 130)",
    metrics: [
      { label: "Agri to GDP", value: "15.3%" },
      { label: "Workforce", value: "289M" },
      { label: "Global Rank", value: "63" },
    ],
    spark: [12, 13, 14, 14.5, 15, 15.2, 15.3],
    span: "col-span-12 md:col-span-6 lg:col-span-4",
  },
  {
    name: "Environment",
    Icon: Leaf,
    tint: "oklch(0.96 0.04 155)",
    accent: "oklch(0.55 0.13 165)",
    metrics: [
      { label: "Renewable Share", value: "48%" },
      { label: "AQI (avg)", value: "44.7" },
      { label: "Global Rank", value: "58" },
    ],
    spark: [30, 33, 36, 40, 43, 46, 48],
    span: "col-span-12 md:col-span-6 lg:col-span-6",
  },
  {
    name: "Safety",
    Icon: ShieldCheck,
    tint: "oklch(0.97 0.02 30)",
    accent: "oklch(0.6 0.16 30)",
    metrics: [
      { label: "Safety Index", value: "55.1" },
      { label: "Global Rank", value: "54" },
      { label: "Change", value: "+3" },
    ],
    spark: [50, 51, 52, 52, 53, 54, 55.1],
    span: "col-span-6 lg:col-span-3",
  },
  {
    name: "Governance",
    Icon: Landmark,
    tint: "oklch(0.97 0.01 265)",
    accent: "oklch(0.5 0.06 265)",
    metrics: [
      { label: "Effectiveness", value: "53.2" },
      { label: "Global Rank", value: "45" },
      { label: "Change", value: "+1" },
    ],
    spark: [48, 49, 50, 51, 52, 53, 53.2],
    span: "col-span-6 lg:col-span-3",
  },
  {
    name: "Equality",
    Icon: Scale,
    tint: "oklch(0.97 0.02 320)",
    accent: "oklch(0.55 0.1 300)",
    metrics: [
      { label: "Gender Index", value: "0.642" },
      { label: "Global Rank", value: "52" },
      { label: "Change", value: "−2" },
    ],
    spark: [0.66, 0.655, 0.65, 0.648, 0.645, 0.643, 0.642],
    span: "col-span-12 lg:col-span-6",
  },
];

function Domains() {
  return (
    <section className="border-t hairline">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="chip">Deep dives</span>
            <h2 className="mt-4 text-3xl tracking-tight sm:text-4xl">
              Explore <span className="font-editorial">domains</span>
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] text-muted-foreground">
              Dive into the areas shaping India's global story — from economy to
              equality, each with its own dedicated dashboard.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 lg:gap-5">
          {domains.map((d) => (
            <DomainCard key={d.name} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DomainCard({ d }: { d: Domain }) {
  const isDark = d.name === "Technology";
  const Icon = d.Icon;
  return (
    <article
      className={`${d.span} group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[var(--radius-2xl)] border hairline p-6 transition hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)]`}
      style={{
        background: d.tint,
        color: isDark ? "oklch(0.97 0.003 90)" : undefined,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full opacity-30 blur-3xl"
        style={{ background: d.accent }}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl border hairline"
            style={{
              background: isDark ? "oklch(0.22 0.03 265)" : "oklch(1 0 0 / 0.7)",
              color: d.accent,
            }}
          >
            <Icon className="h-4.5 w-4.5" />
          </span>
          <h3 className="text-[17px] font-medium tracking-tight">{d.name}</h3>
        </div>
        <ArrowUpRight
          className="h-4 w-4 opacity-60 transition group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>

      <div className="relative mt-6 grid grid-cols-3 gap-3">
        {d.metrics.map((m) => (
          <div key={m.label} className="min-w-0">
            <p
              className="truncate text-[10.5px] uppercase tracking-wider"
              style={{ color: isDark ? "oklch(0.7 0.02 265)" : "oklch(0.5 0.02 265)" }}
            >
              {m.label}
            </p>
            <p className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-5 flex items-end justify-between gap-4">
        <Sparkline points={d.spark} stroke={d.accent} className="h-8 w-32 opacity-90" />
        <button
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-medium transition"
          style={{
            background: isDark ? "oklch(0.97 0.003 90)" : "oklch(0.16 0.02 265)",
            color: isDark ? "oklch(0.14 0.02 265)" : "oklch(0.98 0.003 90)",
          }}
        >
          Explore <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}
