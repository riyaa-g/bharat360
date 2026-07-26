import { createFileRoute, Link } from "@tanstack/react-router";
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
  CloudRain,
  IndianRupee,
  ArrowUp,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import indiaHero from "@/assets/india-hero.png";
import { useOverview } from "@/hooks/useData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bharat360 — India's progress, measured through data" },
      {
        name: "description",
        content:
          "A premium data platform exploring India's performance across global development indicators — economy, health, education, environment and more.",
      },
      { property: "og:title", content: "Bharat360 — India's progress, measured through data" },
      {
        property: "og:description",
        content:
          "Explore global rankings, compare nations and uncover insights on India's journey through trusted international datasets.",
      },
    ],
  }),
  component: Home,
});


/* ---------- smooth inline sparkline ---------- */
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
  
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 6) - 3;
    return { x, y };
  });

  let d = "";
  if (coords.length > 0) {
    d = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1.toFixed(1)},${cpY1.toFixed(1)} ${cpX2.toFixed(1)},${cpY2.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
    }
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Home() {
  const { overview } = useOverview();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="relative z-10 flex flex-col min-w-0 flex-1">
        {/* Top Section: Extended saffron/Tiranga gradient and grid noise, limited to Navbar + Hero */}
        <div className="relative overflow-hidden border-b hairline bg-background">
          <div aria-hidden className="absolute inset-0 grid-noise pointer-events-none opacity-60 z-0" />
          <div
            aria-hidden
            className="absolute -top-32 left-1/2 h-[750px] w-[1100px] -translate-x-1/2 rounded-full opacity-[0.28] blur-3xl pointer-events-none z-0"
            style={{ background: "var(--gradient-tiranga)" }}
          />
          <div className="relative z-10">
            <Navbar />
            <Hero overview={overview} />
          </div>
        </div>
        <Highlights />
        <AtAGlance />
        <Snapshot />
        <Domains />
        <Footer />
      </div>
    </div>
  );
}

/* ============================================================
   1. HERO
   ============================================================ */
function Hero({ overview }: { overview: any }) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pt-16 pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pt-24 lg:pb-32">
        {/* Left */}
        <div className="min-w-0">
          <span className="chip">
            {overview ? `Updated for ${overview.lastUpdated}` : "Loading..."}
          </span>

          <h1 className="mt-6 text-[46px] leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[76px]">
            India's progress,
            <br />
            <span className="text-[52px] sm:text-7xl lg:text-[88px] font-bold">measured</span>
            <br />
            through data.
          </h1>

          <p className="mt-7 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
            Explore global rankings, compare nations, uncover key insights, and
            understand India's journey through trusted international datasets — brought
            together in one editorial view.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard/$domain"
              params={{ domain: "economy" }}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] font-medium text-background transition hover:opacity-90"
            >
              Explore Dashboard
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 rounded-full border hairline bg-background px-5 py-3 text-[14px] font-medium text-foreground transition hover:bg-secondary"
            >
              Compare Countries
            </Link>
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
              Powered by <span className="text-foreground">{overview ? overview.totalDatasets : "..."}</span> datasets from <span className="text-foreground">{overview ? overview.sources.length : "..."}</span> global sources
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
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   2. HEADLINES & HIGHLIGHTS (spacious, editorial rows)
   ============================================================ */
function Highlights() {
  return (
    <section className="relative border-t hairline bg-gradient-to-br from-orange-50/25 via-blue-50/10 via-white/80 to-green-50/20 dark:from-orange-950/10 dark:via-blue-950/5 dark:via-zinc-900/50 dark:to-green-950/10">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 lg:px-10">
        {/* Header */}
        <div className="flex items-center border-b hairline pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-saffron" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Headlines &amp; Highlights
            </h2>
          </div>
        </div>

        {/* Stacked News: No outer card, no border, only internal hairline separators */}
        <div className="mt-4 divide-y divide-zinc-200/50 dark:divide-zinc-800/80">
          
          {/* 1. Innovation Section */}
          <article className="group relative flex flex-col md:flex-row md:items-center justify-between py-8">
            <div className="flex flex-col md:flex-row items-start gap-5 min-w-0 flex-1">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-saffron text-white shadow-md shadow-saffron/10">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-saffron">
                  Innovation
                </span>
                <h3 className="mt-1.5 text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
                  India climbs 2 places in Global Innovation Index 2024
                </h3>
                <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                  Ranked 39th among 133 economies in 2024, reflecting strong improvements in R&D, patents, and technology adoption.
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end shrink-0 md:pl-6">
              <div className="flex items-center gap-1.5 text-[22px] font-bold text-positive">
                <ArrowUp className="h-5 w-5" /> 2
              </div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">
                vs last update
              </span>
            </div>

            <div className="absolute bottom-6 right-6 md:static mt-4 md:mt-0 md:self-end text-[11.5px] text-muted-foreground flex gap-1.5 shrink-0 md:pl-6">
              <span>2h ago</span>
              <span>•</span>
              <span>Global Update</span>
            </div>
            {/* Spacer for mobile */}
            <div className="h-4 md:hidden" />
          </article>

          {/* 2. Environment Section */}
          <article className="group relative flex flex-col md:flex-row md:items-center justify-between py-8">
            <div className="flex flex-col md:flex-row items-start gap-5 min-w-0 flex-1">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-green text-white shadow-md shadow-green/10">
                <CloudRain className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-green">
                  Environment
                </span>
                <h3 className="mt-1.5 text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
                  Delhi AQI reaches Severe category
                </h3>
                <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                  Air quality in Delhi deteriorates due to rising pollution levels and unfavorable weather conditions.
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-6 shrink-0 md:pl-6">
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">AQI</span>
                <div className="text-3xl font-bold text-negative leading-none mt-1">
                  412
                </div>
                <span className="text-[11px] text-negative font-semibold mt-1">
                  Severe
                </span>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 md:static mt-4 md:mt-0 md:self-end text-[11.5px] text-muted-foreground flex gap-1.5 shrink-0 md:pl-6">
              <span>4h ago</span>
              <span>•</span>
              <span>India Update</span>
            </div>
            {/* Spacer for mobile */}
            <div className="h-4 md:hidden" />
          </article>

          {/* 3. Energy & 4. Economy Split Column Section */}
          <div className="grid grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-zinc-200/50 dark:divide-zinc-800/80 md:grid-cols-2">
            
            {/* Energy Column */}
            <article className="group relative flex flex-col justify-between py-8 md:pr-8">
              <div>
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green text-white shadow-sm">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-green">
                      Energy
                    </span>
                    <h3 className="text-base font-bold tracking-tight text-foreground mt-0.5">
                      Renewable energy capacity reaches new record
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                  India's total installed renewable energy capacity crosses 200 GW mark in April 2024.
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div className="text-[11.5px] text-muted-foreground flex gap-1.5">
                  <span>6h ago</span>
                  <span>•</span>
                  <span>India Update</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-0.5 text-[12.5px] font-bold text-positive">
                    <ArrowUp className="h-3.5 w-3.5" /> 18.6%
                  </span>
                </div>
              </div>
            </article>

            {/* Economy Column */}
            <article className="group relative flex flex-col justify-between py-8 md:pl-8">
              <div>
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue text-white shadow-sm">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue">
                      Economy
                    </span>
                    <h3 className="text-base font-bold tracking-tight text-foreground mt-0.5">
                      GDP growth among world's fastest
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                  India's real GDP growth estimated at 7.8% in FY24, outperforming major global economies.
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div className="text-[11.5px] text-muted-foreground flex gap-1.5">
                  <span>8h ago</span>
                  <span>•</span>
                  <span>Economic Update</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-0.5 text-[12.5px] font-bold text-blue">
                    <ArrowUp className="h-3.5 w-3.5" /> 7.8%
                  </span>
                </div>
              </div>
            </article>

          </div>
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
              India at a <span className="font-bold text-foreground">glance</span>
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] text-muted-foreground">
              A composite view of India across the indicators that matter most —
              rankings, categories, and momentum.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 lg:gap-5">
          {/* KPI row */}
          <Kpi label="GDP (Nominal)" value="$3.7T" delta="+7.8%" positive gradient="bg-gradient-to-br from-orange-100/90 via-card to-amber-100/30 dark:from-orange-950/40 dark:via-zinc-900 dark:to-amber-950/15 border-orange-200/80 dark:border-orange-900/40" tooltip={{ full: "Gross Domestic Product", desc: "Total market value of all finished goods and services produced." }} />
          <Kpi label="Population" value="1.43B" delta="+0.8%" positive gradient="bg-gradient-to-br from-blue-100/90 via-card to-indigo-100/30 dark:from-blue-950/40 dark:via-zinc-900 dark:to-indigo-950/15 border-blue-200/80 dark:border-blue-900/40" />
          <Kpi label="Per Capita Income" value="$2,663" delta="+6.1%" positive gradient="bg-gradient-to-br from-green-100/90 via-card to-emerald-100/30 dark:from-green-950/40 dark:via-zinc-900 dark:to-emerald-950/15 border-green-200/80 dark:border-green-900/40" tooltip={{ full: "Income per Person", desc: "Average income earned per person in a given area in a specified year." }} />
          <Kpi label="HDI Rank" value="132" delta="↑ 5" positive gradient="bg-gradient-to-br from-purple-100/90 via-card to-violet-100/30 dark:from-purple-950/40 dark:via-zinc-900 dark:to-violet-950/15 border-purple-200/80 dark:border-purple-900/40" tooltip={{ full: "Human Development Index", desc: "A statistic composite index of life expectancy, education, and per capita income." }} />

          {/* Global Position — dark hero tile */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 rounded-[var(--radius-2xl)] p-7 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800/80 text-white relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-[0.05] blur-3xl"
              style={{ background: "var(--gradient-tiranga)" }}
            />
            <p className="text-[11px] uppercase tracking-wider text-zinc-400">Global Position</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-6xl font-semibold tracking-tight text-white">39</span>
              <span className="text-sm text-zinc-400">/167</span>
            </div>
            <p className="mt-2 text-[13px] text-zinc-300">Overall Index</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" /> Up 2 places
            </p>
          </div>

          {/* Category distribution */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 card-surface p-7">
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-lg font-medium tracking-tight">Category distribution</h3>
                <p className="text-[12.5px] text-muted-foreground">Performance by pillar (out of 100)</p>
              </div>
              <button onClick={() => document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' })} className="text-[12.5px] text-muted-foreground hover:text-foreground cursor-pointer">View all →</button>
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
          <div className="col-span-12 lg:col-span-3 bg-gradient-to-br from-blue-100/70 via-card to-indigo-100/40 dark:from-blue-950/30 dark:via-zinc-900 dark:to-indigo-950/15 border border-zinc-200/60 dark:border-zinc-800/80 p-6 rounded-[var(--radius-2xl)] flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Trend Overview</p>
              <p className="mt-1 text-[13px] text-muted-foreground">India's progress over time</p>
              <div className="mt-4">
                <p className="text-[12.5px] text-muted-foreground">Overall Index</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-positive">+8.4%</p>
                <p className="text-[12px] text-muted-foreground">vs last year</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between text-[11px] text-muted-foreground">
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
                <div key={p.name} className="rounded-2xl border hairline p-4 flex flex-col justify-between min-h-[92px]">
                  <p className="text-[12px] text-muted-foreground">{p.name}</p>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold tracking-tight">{p.rank}</span>
                    <span className="text-[11.5px] text-muted-foreground">/167</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Regional comparison */}
          <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-amber-100/70 via-card to-orange-100/40 dark:from-orange-950/30 dark:via-zinc-900 dark:to-orange-950/15 border border-zinc-200/60 dark:border-zinc-800/80 p-6 rounded-[var(--radius-2xl)]">
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
  gradient,
  tooltip,
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  gradient?: string;
  tooltip?: { full: string; desc: string };
}) {
  const cardBg = gradient || "card-surface";
  return (
    <div className={`col-span-6 md:col-span-3 p-5 rounded-[var(--radius-2xl)] border transition hover:shadow-md relative group ${cardBg}`}>
      <div className="flex items-center gap-1.5">
        {tooltip ? (
          <div className="group/tooltip relative flex items-center justify-center">
            <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground underline decoration-dashed decoration-muted-foreground/50 underline-offset-4 cursor-help hover:text-foreground transition-colors">{label}</p>
            <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-opacity z-50">
              <div className="rounded-lg bg-zinc-900 dark:bg-zinc-100 p-2 text-left text-[11px] text-zinc-100 dark:text-zinc-900 shadow-xl">
                <div className="font-bold mb-0.5">{tooltip.full}</div>
                <div className="opacity-90 leading-tight">{tooltip.desc}</div>
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">{label}</p>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl text-foreground">{value}</p>
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
  const topExcelling = excelling.slice(0, 3);
  const topAttention = attention.slice(0, 3);

  return (
    <section className="border-t border-b border-zinc-200/50 dark:border-zinc-800/85 bg-gradient-to-br from-orange-50/25 via-blue-50/10 via-white/80 to-green-50/20 dark:from-orange-950/10 dark:via-blue-950/5 dark:via-zinc-900/50 dark:to-green-950/10">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
        {/* Header */}
        <div className="mb-12">
          <span className="chip">The balance sheet</span>
          <h2 className="mt-4 text-3xl tracking-tight sm:text-4xl text-foreground">
            India's <span className="font-bold text-foreground">snapshot</span>
          </h2>
          <p className="mt-2 max-w-xl text-[14.5px] text-muted-foreground">
            Where the country is pulling ahead — and where the numbers still need work.
          </p>
        </div>

        {/* Row 1: India Excelling */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-green/10 text-green dark:bg-green-950/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-green-soft" style={{ color: "oklch(0.55 0.13 155)" }}>
              India Excelling
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topExcelling.map((it) => (
              <div
                key={it.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 bg-gradient-to-br from-green-50/10 via-card to-emerald-50/5 p-6 transition hover:-translate-y-0.5 hover:shadow-md hover:border-green/20"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-[16px] font-bold tracking-tight text-foreground">
                      {it.title}
                    </h4>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                    {it.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider Spacer */}
        <div className="my-12 h-px bg-zinc-200/50 dark:bg-zinc-800/80" />

        {/* Row 2: Needs Attention (with RED color to draw attention!) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-red-500/10 text-red-500 dark:bg-red-950/20">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-red-500">
              Needs Attention &amp; Focus
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topAttention.map((it) => (
              <div
                key={it.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-red-150/60 dark:border-red-950/25 bg-gradient-to-br from-red-50/15 via-card to-rose-50/5 dark:from-red-950/10 dark:to-zinc-900/10 p-6 transition hover:-translate-y-0.5 hover:shadow-md hover:border-red-300 dark:hover:border-red-900/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-[16px] font-bold tracking-tight text-foreground group-hover:text-red-500 transition-colors">
                      {it.title}
                    </h4>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-red-400 transition-transform group-hover:text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                    {it.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
    <section id="domains" className="border-t hairline">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="chip">Deep dives</span>
            <h2 className="mt-4 text-3xl tracking-tight sm:text-4xl">
              Explore <span className="font-bold text-foreground">domains</span>
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

  const domainStyles: Record<string, string> = {
    Economy: "bg-orange-50/70 border-orange-100/60 dark:bg-orange-950/15 dark:border-orange-900/30",
    Healthcare: "bg-blue-50/70 border-blue-100/60 dark:bg-blue-950/15 dark:border-blue-900/30",
    Environment: "bg-green-50/70 border-green-100/60 dark:bg-green-950/15 dark:border-green-900/30",
    Technology: "bg-zinc-900 border-zinc-800 text-white dark:bg-zinc-950 dark:border-zinc-850",
    Education: "bg-purple-50/70 border-purple-100/60 dark:bg-purple-950/15 dark:border-purple-900/30",
    Agriculture: "bg-amber-50/70 border-amber-100/60 dark:bg-amber-950/15 dark:border-amber-900/30",
    Safety: "bg-rose-50/70 border-rose-100/60 dark:bg-rose-950/15 dark:border-rose-900/30",
    Governance: "bg-indigo-50/70 border-indigo-100/60 dark:bg-indigo-950/15 dark:border-indigo-900/30",
    Equality: "bg-pink-50/70 border-pink-100/60 dark:bg-pink-950/15 dark:border-pink-900/30",
  };

  const cardStyle = domainStyles[d.name] || "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-foreground";
  const textClass = isDark ? "text-white" : "text-foreground";
  const mutedTextClass = isDark ? "text-zinc-300" : "text-muted-foreground";

  return (
    <article
      className={`${d.span} group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[var(--radius-2xl)] border p-6 transition hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] ${cardStyle}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full opacity-[0.08] dark:opacity-[0.12] blur-3xl"
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
          <h3 className={`text-[17px] font-semibold tracking-tight ${textClass}`}>{d.name}</h3>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-3 gap-3">
        {d.metrics.map((m) => (
          <div key={m.label} className="min-w-0">
            <p className={`truncate text-[10.5px] uppercase tracking-wider ${mutedTextClass}`}>
              {m.label}
            </p>
            <p className={`mt-1 text-lg font-semibold tracking-tight sm:text-xl ${textClass}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-5 flex items-end justify-end">
        <Link
          to="/dashboard/$domain"
          params={{ domain: d.name.toLowerCase() }}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-medium transition"
          style={{
            background: isDark ? "oklch(0.97 0.003 90)" : "oklch(0.16 0.02 265)",
            color: isDark ? "oklch(0.14 0.02 265)" : "oklch(0.98 0.003 90)",
          }}
        >
          Explore <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
