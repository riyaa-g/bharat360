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
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Cell,
  PolarRadiusAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  X,
  Plus,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare India with the world — Bharat360" },
      {
        name: "description",
        content:
          "Interactive multi-country comparison across economy, health, education and more — with animated charts, radar overlays and live rankings.",
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

function radarData(codes: CountryCode[], year: number) {
  return METRICS.map((m) => {
    const row: Record<string, number | string> = { metric: m.label };
    codes.forEach((c) => (row[c] = valueAt(c, m.id, year)));
    return row;
  });
}

/* ---------- Page ---------- */
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:px-10">
        {/* Header */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <div className="chip"><Sparkles className="h-3 w-3" /> Country Comparison</div>
            <h1 className="mt-3 font-display text-5xl leading-none tracking-tight sm:text-6xl">
              Compare India with the <span className="font-editorial">world</span>
            </h1>
            <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
              Pick up to six countries and a metric. Every chart animates as filters change — trend
              lines glide, bars re-order, and the ranking ladder recomputes in real time.
            </p>
          </div>
        </header>

        {/* Filters */}
        <section className="mt-8 card-surface p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Countries */}
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Countries
              </span>
              {selected.map((code) => {
                const c = COUNTRIES.find((x) => x.code === code)!;
                return (
                  <span
                    key={code}
                    className="group inline-flex items-center gap-2 rounded-full border hairline bg-surface py-1 pl-2 pr-1.5 text-[12.5px] font-medium transition hover:shadow-sm"
                    style={{ borderColor: "color-mix(in oklab, " + c.tint + " 30%, var(--color-hairline))" }}
                  >
                    <span aria-hidden>{c.flag}</span>
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed hairline px-3 py-1 text-[12.5px] text-muted-foreground hover:text-foreground disabled:opacity-40"
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
                            <span>{c.flag}</span> {c.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Metric */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Metric
              </span>
              <div className="flex flex-wrap gap-1 rounded-full border hairline bg-secondary/60 p-1">
                {METRICS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMetric(m.id)}
                    className={`rounded-full px-3 py-1 text-[12px] transition ${
                      metric === m.id ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Year */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
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
                <span className="w-14 rounded-full border hairline bg-background px-2 py-0.5 text-center text-[12.5px] font-medium tabular-nums">
                  {year}
                </span>
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
            const up = delta >= 0;
            const rank = ranked.findIndex((r) => r.code === code) + 1;
            return (
              <div
                key={code}
                className="group card-surface relative overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5"
                  style={{ background: c.tint }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[18px]" aria-hidden>{c.flag}</span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    #{rank}
                  </span>
                </div>
                <div className="mt-3 text-[12px] font-medium">{c.name}</div>
                <div className="mt-1 font-display text-[28px] leading-none tracking-tight tabular-nums">
                  {v}
                </div>
                <div
                  className={`mt-1 inline-flex items-center gap-1 text-[11.5px] ${
                    up ? "text-[var(--green)]" : "text-[var(--negative)]"
                  }`}
                >
                  {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {up ? "+" : ""}{delta} yoy
                </div>
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
                <h2 className="mt-3 font-display text-2xl tracking-tight">
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
                const max = ranked[0].value;
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
                      <span aria-hidden>{c.flag}</span>
                      <span className={`text-[13px] ${isIndia ? "font-semibold" : ""}`}>{c.name}</span>
                      <span className="ml-auto tabular-nums text-[12.5px]">{r.value}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Radar + Bar */}
        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="card-surface p-6">
            <div className="chip">Multi-metric profile</div>
            <h2 className="mt-3 font-display text-2xl tracking-tight">Radar overlay · {year}</h2>
            <div className="mt-6 h-[360px] w-full">
              <ResponsiveContainer>
                <RadarChart data={radarData(selected, year)} outerRadius="75%">
                  <PolarGrid stroke="var(--color-hairline)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} stroke="var(--color-hairline)" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-hairline)",
                      background: "var(--color-popover)",
                      fontSize: 12,
                    }}
                  />
                  {selected.map((code) => {
                    const c = COUNTRIES.find((x) => x.code === code)!;
                    return (
                      <Radar
                        key={code}
                        name={c.name}
                        dataKey={code}
                        stroke={c.tint}
                        fill={c.tint}
                        fillOpacity={0.12}
                        strokeWidth={code === "IN" ? 2.5 : 1.5}
                        isAnimationActive
                        animationDuration={900}
                      />
                    );
                  })}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="chip">Head-to-head</div>
            <h2 className="mt-3 font-display text-2xl tracking-tight">
              {METRICS.find((m) => m.id === metric)?.label} · {year}
            </h2>
            <div className="mt-6 h-[360px] w-full">
              <ResponsiveContainer>
                <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-hairline)",
                      background: "var(--color-popover)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]} animationDuration={800}>
                    {barData.map((d) => (
                      <Cell key={d.code} fill={d.tint} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
