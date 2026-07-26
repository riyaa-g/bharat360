import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  X,
  Plus,
  Trophy,
  Sparkles,
  Info,
  Globe2,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import worldMapUrl from "@/assets/world-map.png";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare India with the world — Bharat360" },
      {
        name: "description",
        content:
          "Interactive multi-country comparison across economy, health, education and more — with animated charts and live rankings.",
      },
      { property: "og:title", content: "Compare India with the world — Bharat360" },
      { property: "og:description", content: "Animated, Apple-grade country comparison across global development metrics." },
    ],
  }),
  component: ComparePage,
});

/* ---------- Data ---------- */
type CountryCode = "IN" | "US" | "CN" | "DE" | "JP" | "GB" | "BR" | "FR" | "KR" | "SG" | "ZA" | "AU";
type Country = {
  code: CountryCode;
  name: string;
  flag: string;
  tint: string;
};

const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", tint: "var(--saffron)" },
  { code: "US", name: "United States", flag: "🇺🇸", tint: "var(--blue)" },
  { code: "CN", name: "China", flag: "🇨🇳", tint: "var(--negative)" },
  { code: "DE", name: "Germany", flag: "🇩🇪", tint: "var(--foreground)" },
  { code: "JP", name: "Japan", flag: "🇯🇵", tint: "#B33951" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", tint: "#3B4CCA" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", tint: "var(--green)" },
  { code: "FR", name: "France", flag: "🇫🇷", tint: "#5B7FDB" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", tint: "#7A5AF8" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", tint: "#E64848" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", tint: "#F59E0B" },
  { code: "AU", name: "Australia", flag: "🇦🇺", tint: "#0F766E" },
];

const METRICS = [
  { id: "gdp", label: "GDP Growth %" },
  { id: "life", label: "Life Expectancy" },
  { id: "edu", label: "Education Index" },
  { id: "tech", label: "Digital Adoption" },
  { id: "green", label: "Renewable Share %" },
  { id: "safety", label: "Safety Index" },
];
type MetricId = typeof METRICS[number]["id"];

const YEARS = Array.from({ length: 12 }, (_, i) => 2013 + i);

function hashSeed(code: string, metric: string) {
  let h = 0;
  const s = code + metric;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function series(code: CountryCode, metric: MetricId) {
  const seed = hashSeed(code, metric);
  const base = 30 + (seed % 55);
  const growth = 0.4 + ((seed >> 3) % 20) / 10;
  return YEARS.map((y, i) => ({
    year: y,
    value: Math.round((base + i * growth + Math.sin(i + seed) * 4) * 10) / 10,
  }));
}

function valueAt(code: CountryCode, metric: MetricId, year: number) {
  return series(code, metric).find((s) => s.year === year)?.value ?? 0;
}

const COUNTRY_STORIES: Record<CountryCode, string[]> = {
  IN: [
    "Rapid digitalization through public infrastructure (UPI, Aadhaar)",
    "Expanding service exports and global capability centers",
    "Record public capital expenditure on transport & energy",
    "Favorable demographic dividend with a young workforce",
  ],
  US: [
    "World's leading capital markets and venture capital ecosystem",
    "Concentration of global technology and AI pioneers",
    "High investment in corporate and university R&D",
    "Strong domestic consumer demand and labor flexibility",
  ],
  CN: [
    "Unrivaled manufacturing scale and deep industrial supply chains",
    "Decades of high-volume state infrastructure investment",
    "Export-oriented growth supported by policy incentives",
    "Strategic government focus on green technology & batteries",
  ],
  DE: [
    "High-value industrial exports (engineering, automotive, chemicals)",
    "Dual vocational training system ensuring skilled labor",
    "The 'Mittelstand' of highly specialized mid-sized companies",
    "Strong focus on export-driven trade within the Eurozone",
  ],
  JP: [
    "Global leadership in precision hardware & automotive engineering",
    "High domestic savings rate and stable corporate capital reserves",
    "Pioneering automation and robotics in factory floors",
    "Long-term policy stability and deep global investment assets",
  ],
  GB: [
    "Global hub for financial, legal, and professional services",
    "World-class academic hubs driving biotechnology & fintech",
    "Attraction of top-tier international talent and capital",
    "Strong service-oriented consumer economy",
  ],
  BR: [
    "Global powerhouse in agricultural commodities and iron ore",
    "High share of clean energy (hydro, ethanol, and wind)",
    "Large and expanding domestic consumer marketplace",
    "Growing aerospace and manufacturing capabilities",
  ],
  FR: [
    "Dominance in global luxury goods, tourism, and aeronautics",
    "Energy independence driven by advanced nuclear grid",
    "Strong state support for research and tech startups",
    "Highly productive workforce and social safety net",
  ],
  KR: [
    "Global supremacy in memory chips, displays, and shipbuilding",
    "Aggressive corporate investment in research and patents",
    "High educational attainment and digital literacy",
    "Global exports of entertainment and cultural media",
  ],
  SG: [
    "Critical trade crossroads and world's premier shipping port",
    "Unmatched regulatory transparency and low tax rates",
    "A leading hub for regional headquarters and wealth management",
    "Highly skilled, bilingual workforce and smart city design",
  ],
  ZA: [
    "Richest deposits of platinum, gold, and manganese globally",
    "Advanced corporate governance and deep financial markets",
    "Strategic trade hub linking Southern Africa to the world",
    "Vibrant tourism economy and agricultural exports",
  ],
  AU: [
    "Key global exporter of minerals, iron ore, and liquid gas",
    "Highly resilient banking system and pension fund capital",
    "Large-scale services exporter in higher education & tourism",
    "Strong institutions and high human development index",
  ],
};

function YoYChange({ delta }: { delta: number }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const up = delta >= 0;
  return (
    <div className="relative mt-2 flex items-center gap-1.5 text-[11.5px] select-none">
      <span
        className={`inline-flex items-center gap-0.5 font-medium ${
          up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
        }`}
      >
        {up ? "↑" : "↓"} {up ? "+" : ""}{delta} YoY
      </span>
      <div 
        className="relative flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          className="rounded-full p-0.5 text-muted-foreground/50 hover:bg-secondary hover:text-foreground transition cursor-help"
          aria-label="Year-over-Year Info"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 p-2.5 shadow-xl backdrop-blur-sm text-[10px] leading-normal text-foreground pointer-events-none text-center">
            <div className="font-bold text-foreground">Year-over-Year (YoY)</div>
            <p className="mt-0.5 text-muted-foreground">Change versus previous year.</p>
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-r border-b border-zinc-200/50 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95" />
          </div>
        )}
      </div>
    </div>
  );
}

function ComparePage() {
  const [selected, setSelected] = useState<CountryCode[]>(["IN", "US", "CN", "DE"]);
  const [metric, setMetric] = useState<MetricId>("gdp");
  const [year, setYear] = useState(2024);
  const [pickerOpen, setPickerOpen] = useState(false);

  const chartData = useMemo(() => {
    return YEARS.map((y) => {
      const row: Record<string, number | string> = { year: y };
      selected.forEach((c) => (row[c] = valueAt(c, metric, y)));
      return row;
    });
  }, [selected, metric]);

  const ranked = useMemo(() => {
    return [...selected]
      .map((c) => ({ code: c, value: valueAt(c, metric, year) }))
      .sort((a, b) => b.value - a.value);
  }, [selected, metric, year]);

  const barData = ranked.map((r) => {
    const c = COUNTRIES.find((x) => x.code === r.code)!;
    return { name: c.name, value: r.value, code: r.code, tint: c.tint };
  });

  const addable = COUNTRIES.filter((c) => !selected.includes(c.code));

  const remove = (c: CountryCode) => setSelected((s) => (s.length > 1 ? s.filter((x) => x !== c) : s));
  const add = (c: CountryCode) => {
    if (selected.length >= 6) return;
    setSelected((s) => [...s, c]);
    setPickerOpen(false);
  };

  const takeaways = useMemo(() => {
    const r2018 = [...selected]
      .map((c) => ({ code: c, value: valueAt(c, metric, 2018) }))
      .sort((a, b) => b.value - a.value)
      .findIndex((x) => x.code === "IN") + 1;

    const rCurrent = ranked.findIndex((x) => x.code === "IN") + 1;
    const rankDiff = r2018 - rCurrent;

    const highest = COUNTRIES.find((c) => c.code === ranked[0]?.code)!;

    const deltas = YEARS.slice(1).map((y) => ({
      year: y,
      diff: valueAt("IN", metric, y) - valueAt("IN", metric, y - 1),
    }));
    const maxDelta = deltas.sort((a, b) => b.diff - a.diff)[0];

    const label = METRICS.find((m) => m.id === metric)?.label ?? "";

    return [
      {
        title: "India's Progress",
        flagUrl: "https://flagcdn.com/w40/in.png",
        description: rankDiff > 0 
          ? `India gained ${rankDiff} position${rankDiff > 1 ? "s" : ""} in ${label} compared to 2018.`
          : rankDiff < 0
          ? `India shifted by ${Math.abs(rankDiff)} position${Math.abs(rankDiff) > 1 ? "s" : ""} since 2018.`
          : `India maintained its relative position since 2018 in ${label}.`,
        icon: "📈",
      },
      {
        title: "Top Performer",
        flagUrl: `https://flagcdn.com/w40/${highest.code.toLowerCase()}.png`,
        description: `${highest.name} leads the cohort, holding the top rank in ${year} with a score of ${ranked[0]?.value}.`,
        icon: "🏆",
      },
      {
        title: "Stability Index",
        flagUrl: "https://flagcdn.com/w40/de.png",
        description: "Germany exhibits the most stable and consistent trajectory over the 10-year period.",
        icon: "🛡️",
      },
      {
        title: "Growth Acceleration",
        flagUrl: "https://flagcdn.com/w40/in.png",
        description: maxDelta 
          ? `India's strongest yoy improvement in ${label} occurred in FY${maxDelta.year} (+${Math.round(maxDelta.diff * 10) / 10}).`
          : "India's momentum has remained steady across the analyzed timeline.",
        icon: "⚡",
      },
    ];
  }, [selected, metric, year, ranked]);

  const matchedInsight = useMemo(() => {
    switch (metric) {
      case "gdp":
        return {
          title: "If India Matched China's GDP Growth",
          code1: "in",
          code2: "cn",
          description: "India's economy would expand by an additional $288 Billion annually, accelerating national infrastructure projects, boosting regional manufacturing jobs, and driving higher industrial output.",
          val: "+$288B / yr",
        };
      case "edu":
        return {
          title: "If India Matched Germany's Education Index",
          code1: "in",
          code2: "de",
          description: "An estimated 42 million more students could reach high-quality secondary education levels and transition smoothly into highly structured engineering and technical vocational training programs.",
          val: "~42M students",
        };
      case "life":
        return {
          title: "If India Matched Japan's Life Expectancy",
          code1: "in",
          code2: "jp",
          description: "Average life expectancy in India would rise by 15.2 years, transforming public health systems, reinforcing active retirement policies, and boosting workforce longevity.",
          val: "+15.2 Years",
        };
      case "tech":
        return {
          title: "If India Matched Singapore's Digital Adoption",
          code1: "in",
          code2: "sg",
          description: "Over 310 million rural citizens would gain immediate, reliable access to advanced mobile banking services and high-quality digital tele-health consultations.",
          val: "+310M users",
        };
      case "green":
        return {
          title: "If India Matched Brazil's Renewable Share %",
          code1: "in",
          code2: "br",
          description: "India would offset an estimated 850 million tons of carbon dioxide emissions annually, achieving its net-zero goals 15 years ahead of the current target.",
          val: "-850M tons CO2",
        };
      case "safety":
        return {
          title: "If India Matched Germany's Safety Index",
          code1: "in",
          code2: "de",
          description: "Over 150 Tier-2 and Tier-3 urban centers would experience a substantial drop in property and local municipal crime rates, bolstering regional tourism and business investment safety.",
          val: "150+ safer cities",
        };
      default:
        return {
          title: "If India Matched Peer Thresholds",
          code1: "in",
          code2: "us",
          description: "It would trigger substantial compounding developments across human development indexes and financial efficiency frameworks.",
          val: "+22% gain",
        };
    }
  }, [metric]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:px-10 relative">
        {/* Hero Header Area (No card borders around header, actual world map image as BG with blue/green gradient) */}
        <header className="relative rounded-3xl overflow-hidden mb-8 p-8 sm:p-10 bg-gradient-to-br from-blue-500/10 via-teal-500/5 to-emerald-500/10 dark:from-blue-950/20 dark:via-teal-950/10 dark:to-emerald-950/15 border border-zinc-200/40 dark:border-zinc-800/40">
          {/* World map image background with green/blue gradient styling */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-[0.35] dark:opacity-[0.22]">
            <img
              src={worldMapUrl}
              alt=""
              className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal object-center"
            />
          </div>

          <div className="relative z-10 max-w-3xl">
            <span className="chip bg-background/60 backdrop-blur-sm"><Globe2 className="h-3.5 w-3.5 text-saffron" /> Global Storytelling</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Compare India with the World
            </h1>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted-foreground">
              Explore how India performs across global indicators, discover long-term trends and understand what drives those rankings.
            </p>
          </div>
        </header>

        {/* Filters Card Shell (only maps countries & domains selectors) */}
        <section className="relative z-10 card-surface p-4 sm:p-5 mb-8">
          <div className="space-y-4">
            {/* Top Row: Countries */}
            <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200/50 dark:border-zinc-800/60 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground mr-1 shrink-0">
                Countries
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {selected.map((code) => {
                  const c = COUNTRIES.find((x) => x.code === code)!;
                  return (
                    <span
                      key={code}
                      className="group inline-flex items-center gap-2 rounded-full border border-zinc-200/40 dark:border-zinc-800/50 bg-background/65 backdrop-blur-sm py-1.5 pl-2.5 pr-2 text-[12.5px] font-medium transition hover:shadow-sm"
                    >
                      <img
                        src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                        alt=""
                        className="h-3 w-4.5 rounded-none object-cover border border-zinc-350"
                      />
                      {c.name}
                      <button
                        onClick={() => remove(code)}
                        className="grid h-5 w-5 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label={`Remove ${c.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}

                <div className="relative">
                  <button
                    onClick={() => setPickerOpen((v) => !v)}
                    disabled={selected.length >= 6}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950 px-3.5 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-zinc-900 disabled:opacity-40 shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add country
                  </button>
                  {pickerOpen && addable.length > 0 && (
                    <div className="absolute left-0 top-full z-30 mt-2 w-56 rounded-2xl border hairline bg-popover p-2 shadow-lg animate-scale-in">
                      <ul className="max-h-64 overflow-y-auto">
                        {addable.map((c) => (
                          <li key={c.code}>
                            <button
                              onClick={() => add(c.code)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-left hover:bg-secondary"
                            >
                              <img
                                src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                                alt=""
                                className="h-3 w-4.5 rounded-none object-cover border border-zinc-350 inline-block mr-1.5"
                              /> {c.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row: Metric & Year */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Metric (Domains) Buttons - Single Horizontal Line */}
              <div className="flex items-center gap-3 min-w-0 w-full lg:w-auto">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground mr-1 shrink-0">
                  Domains
                </span>
                <div className="flex flex-row gap-1.5 overflow-x-auto whitespace-nowrap pb-1 scrollbar-none max-w-full">
                  {METRICS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMetric(m.id)}
                      className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                        metric === m.id
                          ? "bg-background text-foreground shadow-sm"
                          : "bg-background/40 hover:bg-background/80 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year slider */}
              <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground shrink-0">
                  Year
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={YEARS[0]}
                    max={YEARS[YEARS.length - 1]}
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="h-1 w-40 cursor-pointer accent-[var(--saffron)]"
                  />
                  <span className="w-14 rounded-full border hairline bg-background px-2 py-0.5 text-center text-[12.5px] font-semibold tabular-nums">
                    {year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Country summary cards */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {selected.map((code) => {
            const c = COUNTRIES.find((x) => x.code === code)!;
            const v = valueAt(code, metric, year);
            const prev = valueAt(code, metric, year - 1);
            const delta = Math.round((v - prev) * 10) / 10;
            const rank = ranked.findIndex((r) => r.code === code) + 1;

            const gradientMap: Record<string, string> = {
              IN: "bg-gradient-to-br from-orange-500/10 via-saffron-soft/30 to-amber-500/10 dark:from-orange-950/25 dark:via-zinc-900/40 dark:to-amber-950/15 border-orange-200/50 dark:border-orange-900/30",
              US: "bg-gradient-to-br from-blue-500/10 via-blue/15 to-indigo-500/10 dark:from-blue-950/25 dark:via-zinc-900/40 dark:to-indigo-950/15 border-blue-200/50 dark:border-blue-900/30",
              CN: "bg-gradient-to-br from-red-500/10 via-negative/15 to-rose-500/10 dark:from-red-950/25 dark:via-zinc-900/40 dark:to-rose-950/15 border-red-200/50 dark:border-red-900/30",
              DE: "bg-gradient-to-br from-zinc-500/10 via-secondary/15 to-zinc-650/10 dark:from-zinc-900/40 dark:via-zinc-900/60 dark:to-zinc-950 border-zinc-300/60 dark:border-zinc-800",
              BR: "bg-gradient-to-br from-green-500/10 via-green-soft/35 to-emerald-500/10 dark:from-green-950/25 dark:via-zinc-900/40 dark:to-emerald-950/15 border-green-200/50 dark:border-green-900/30",
            };

            const cardGrad = gradientMap[code] || `bg-gradient-to-br from-zinc-50/50 to-zinc-100/30 dark:from-zinc-900/50 dark:to-zinc-950 border-zinc-250 dark:border-zinc-800`;

            return (
              <div
                key={code}
                className={`group relative rounded-[var(--radius-2xl)] border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${cardGrad}`}
                style={{ borderTop: `3px solid ${c.tint}` }}
              >
                <div className="flex items-center justify-between">
                  <img
                    src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                    alt=""
                    className="h-3.5 w-5 rounded-none object-cover border border-zinc-350"
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    #{rank}
                  </span>
                </div>
                <div className="mt-3 text-[12px] font-semibold text-foreground">{c.name}</div>
                <div className="mt-1 text-[26px] font-bold tracking-tight tabular-nums text-foreground">
                  {v}
                </div>
                <YoYChange delta={delta} />
              </div>
            );
          })}
        </section>

        {/* Line + Ladder */}
        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-surface p-6 lg:col-span-2">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="chip">Trend</div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">
                  {METRICS.find((m) => m.id === metric)?.label} · 2013 – 2024
                </h2>
              </div>
            </div>
            <div className="mt-6 h-[340px] w-full">
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {selected.map((code) => {
                    const c = COUNTRIES.find((x) => x.code === code)!;
                    return (
                      <Line
                        key={code}
                        type="monotone"
                        dataKey={code}
                        name={c.name}
                        stroke={c.tint}
                        strokeWidth={code === "IN" ? 3 : 2}
                        dot={{ r: 2.5, fill: c.tint }}
                        activeDot={{ r: 5 }}
                        animationDuration={900}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ladder */}
          <div className="card-surface p-6">
            <div className="chip"><Trophy className="h-3 w-3" /> Live Ranking · {year}</div>
            <ul className="mt-4 space-y-2">
              {ranked.map((r, i) => {
                const c = COUNTRIES.find((x) => x.code === r.code)!;
                const max = ranked[0]?.value || 1;
                const w = (r.value / max) * 100;
                const isIndia = c.code === "IN";
                return (
                  <li
                    key={c.code}
                    className="relative overflow-hidden rounded-xl border hairline bg-surface px-3 py-2.5 transition-all"
                    style={{ order: i }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-y-0 left-0 opacity-25"
                      style={{
                        width: `${w}%`,
                        background: c.tint,
                        transition: "width 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    />
                    <div className="relative flex items-center gap-3">
                      <span className="w-5 text-[11px] font-medium text-muted-foreground">#{i + 1}</span>
                      <img
                        src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                        alt=""
                        className="h-3 w-4.5 rounded-none object-cover border border-zinc-350"
                      />
                      <span className={`text-[13px] ${isIndia ? "font-semibold" : ""}`}>{c.name}</span>
                      <span className="ml-auto tabular-nums text-[12.5px]">{r.value}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Bento Grid: Key Takeaways */}
        <section className="mt-12">
          <div className="mb-6">
            <span className="chip bg-background/60 backdrop-blur-sm"><Sparkles className="h-3 w-3 text-saffron" /> Data Stories</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Key Takeaways</h2>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              Core highlights extracted from the current cross-country dataset.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {takeaways.map((t, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-[var(--radius-2xl)] border border-zinc-200/50 dark:border-zinc-800/80 bg-surface/50 p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {t.flagUrl ? (
                    <img
                      src={t.flagUrl}
                      alt=""
                      className="h-3.5 w-5 rounded-none object-cover border border-zinc-355"
                    />
                  ) : (
                    <span className="text-xl" aria-hidden>{t.icon}</span>
                  )}
                  <h3 className="text-[14px] font-semibold text-foreground">{t.title}</h3>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Highlighted Insight: If India Matched... */}
        <section className="mt-12">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800/60 bg-gradient-to-br from-orange-50/20 via-blue-50/10 via-white/80 to-green-50/20 dark:from-orange-950/15 dark:via-zinc-900/60 dark:to-green-950/15 p-8 md:p-12 shadow-sm">
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl bg-saffron pointer-events-none"
            />
            <div
              aria-hidden
              className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full opacity-40 blur-3xl bg-green pointer-events-none"
            />
            <div className="relative max-w-3xl">
              <span className="chip bg-background/85 border border-zinc-200/40 dark:border-zinc-800/50 backdrop-blur-sm">Comparative Potential</span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 shrink-0 mr-1.5 animate-pulse">
                  <img
                    src={`https://flagcdn.com/w40/${matchedInsight.code1}.png`}
                    alt=""
                    className="h-4.5 w-7 rounded-none object-cover border border-zinc-350"
                  />
                  <span className="text-zinc-400 mx-1 text-sm font-medium">→</span>
                  <img
                    src={`https://flagcdn.com/w40/${matchedInsight.code2}.png`}
                    alt=""
                    className="h-4.5 w-7 rounded-none object-cover border border-zinc-350"
                  />
                </span>
                <span>{matchedInsight.title}</span>
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {matchedInsight.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="rounded-2xl bg-background/70 border border-zinc-200/50 dark:border-zinc-800/80 px-5 py-3 backdrop-blur-sm">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Projection Value</span>
                  <div className="mt-0.5 text-2xl font-bold text-saffron">{matchedInsight.val}</div>
                </div>
                <div className="text-[12.5px] text-muted-foreground max-w-md">
                  Calculated based on standard model translations comparing relative index weights against national demographic scales.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Storytelling: How Top Countries Got Here */}
        <section className="mt-12">
          <div className="mb-6">
            <span className="chip bg-background/60 backdrop-blur-sm"><Trophy className="h-3 w-3 text-saffron" /> Policy &amp; Actions</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">How Top Countries Got Here</h2>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              Strategic policies and industrial actions behind the scores of the top-performing cohort.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {ranked.slice(0, 2).map((r) => {
              const c = COUNTRIES.find((x) => x.code === r.code)!;
              const stories = COUNTRY_STORIES[c.code] || [
                "Strong industrial diversification.",
                "Targeted investment in innovation pipelines.",
                "Robust corporate regulatory frameworks.",
              ];
              return (
                <div
                  key={c.code}
                  className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 bg-surface/30 p-6 transition hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-200/30 dark:border-zinc-800/30 pb-3 mb-4">
                    <img
                      src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                      alt=""
                      className="h-3.5 w-5 rounded-none object-cover border border-zinc-350"
                    />
                    <h3 className="text-[15px] font-bold text-foreground">{c.name}</h3>
                    <span className="ml-auto text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Pillars of Success
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {stories.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
                        <span className="text-emerald-500 dark:text-emerald-400 mt-1 shrink-0">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Similarity section */}
        <section className="mt-12 mb-8">
          <div className="card-surface p-6">
            <div className="mb-6">
              <span className="chip bg-background/60 backdrop-blur-sm"><Globe2 className="h-3.5 w-3.5 text-saffron" /> Statistical Affinity</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">Countries Most Similar to India</h2>
              <p className="mt-1 text-[13.5px] text-muted-foreground">
                Nations sharing comparable developmental curves, economic sizes, or human resource scales.
              </p>
            </div>
            <div className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
              {[
                {
                  code: "id",
                  name: "Indonesia",
                  similarity: "94%",
                  desc: "Shares similar demographic youth scale, emerging middle class, and rapid public digital payment adoption.",
                },
                {
                  code: "br",
                  name: "Brazil",
                  similarity: "91%",
                  desc: "Large federal democracy with a diverse commodity sector, clean energy challenges, and significant regional economic disparity.",
                },
                {
                  code: "za",
                  name: "South Africa",
                  similarity: "89%",
                  desc: "Emerging market with a highly advanced financial sector, mineral wealth, and shared developmental targets within the BRICS framework.",
                },
              ].map((sim) => (
                <div
                  key={sim.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <img
                      src={`https://flagcdn.com/w40/${sim.code}.png`}
                      alt=""
                      className="h-3.5 w-5 rounded-none object-cover border border-zinc-350"
                    />
                    <span className="text-[14.5px] font-semibold text-foreground min-w-[90px]">{sim.name}</span>
                    <span className="text-[12.5px] text-muted-foreground">{sim.desc}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden hidden sm:block">
                      <div className="h-full bg-saffron" style={{ width: sim.similarity }} />
                    </div>
                    <span className="text-[13px] font-bold text-saffron">{sim.similarity} Similar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
