import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import indiaHero from "@/assets/india-hero.png";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, ExternalLink, Activity, ArrowLeft } from "lucide-react";
import { excelling, attention } from "@/lib/mockInsights";

// Combine the two arrays to simulate "Latest Updates"
const sharedUpdates = [...excelling, ...attention].slice(0, 5);

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "India Insights — Premium Editorial & Analysis" },
      {
        name: "description",
        content: "Understanding India's progress beyond the numbers. Read the latest updates, data stories, and analytical takeaways.",
      },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    fetch("/data/insights.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load insights");
        return res.json();
      })
      .then((json) => {
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50/25 via-blue-50/10 via-white/80 to-green-50/20 dark:from-orange-950/10 dark:via-blue-950/5 dark:via-zinc-900/50 dark:to-green-950/10 selection:bg-saffron/20">
      <Navbar />
      
      {/* Back Link */}
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-10 lg:px-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-foreground dark:text-white hover:opacity-80 transition-opacity w-fit">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 px-6 lg:px-10 border-b border-zinc-200/50 dark:border-zinc-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-2/3 lg:w-1/2 opacity-20 dark:opacity-10 pointer-events-none mix-blend-luminosity">
          <img src={indiaHero} alt="India Hero Map" className="w-full h-full object-contain object-right [mask-image:linear-gradient(to_left,black,transparent)]" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="chip bg-secondary/80 text-muted-foreground font-semibold border-none text-[10.5px] py-1 px-3 uppercase tracking-widest mb-6 inline-flex">
            Editorial Insights
          </div>
          <h1 className="font-sans font-bold text-4xl lg:text-6xl tracking-tight text-foreground max-w-3xl leading-tight">
            {loading ? "Loading insights..." : data?.hero.title}
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {loading ? "Please wait while we prepare the latest data story." : data?.hero.subtext}
          </p>
        </div>
      </section>

      <main className="relative mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        {loading ? (
          <div className="animate-pulse flex flex-col gap-8">
            <div className="h-64 bg-secondary/50 rounded-2xl w-full" />
            <div className="h-32 bg-secondary/50 rounded-2xl w-full" />
          </div>
        ) : error ? (
          <div className="p-8 bg-red-500/10 text-red-500 rounded-2xl text-center font-medium">
            Error: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Main Editorial Column */}
            <div className="lg:col-span-8 space-y-16">
              
              <article>
                <div className="flex items-center gap-2 mb-6 text-saffron">
                  <Activity className="h-5 w-5" />
                  <h2 className="text-xl font-bold tracking-tight">The Data Story</h2>
                </div>
                <div 
                  className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-[17.5px] md:prose-p:text-[18px] prose-p:leading-[1.8] prose-p:text-muted-foreground prose-strong:text-foreground prose-strong:font-bold prose-mark:bg-saffron/40 dark:prose-mark:bg-saffron/80 prose-mark:text-black dark:prose-mark:text-black prose-mark:rounded prose-mark:px-1.5 prose-mark:py-0.5"
                  dangerouslySetInnerHTML={{ __html: data.story }}
                />
              </article>

              <section>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-6">Key Takeaways</h3>
                <div className="bg-secondary/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[var(--radius-xl)] p-8">
                  <ul className="space-y-4">
                    {data.takeaways.map((point: string, idx: number) => (
                      <li key={idx} className="flex gap-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-[11px] font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-[15.5px] leading-relaxed text-foreground mt-0.5">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-4">Looking Ahead</h3>
                <p className="text-[16.5px] leading-[1.8] text-muted-foreground p-6 border-l-2 border-saffron bg-saffron-soft/10 dark:bg-saffron-soft/5">
                  {data.ahead}
                </p>
              </section>

              <section className="pt-8 border-t border-zinc-200/50 dark:border-zinc-800/80">
                <h3 className="text-[12px] uppercase tracking-widest font-bold text-muted-foreground mb-4">Referenced Sources</h3>
                <ul className="space-y-3">
                  {data.sources.map((src: any, idx: number) => (
                    <li key={idx}>
                      <a href={src.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[14px] text-foreground hover:text-saffron transition-colors group font-medium">
                        <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                        {src.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

            </div>

            {/* Sidebar Column: Latest Updates */}
            <aside className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="sticky top-24">
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground mb-8 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" /> Latest Updates
                </h2>
                
                <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 space-y-10 pb-4">
                  {sharedUpdates.map((update: any, idx: number) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-background border-[3px] border-saffron" />
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-saffron">{update.category}</span>
                        <span className="text-[11px] text-muted-foreground font-medium">• Recent</span>
                      </div>
                      
                      <h4 className="text-[15.5px] font-bold leading-snug text-foreground mb-2">
                        {update.title}
                      </h4>
                      <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-3">
                        {update.desc}
                      </p>
                      
                      <button className="inline-flex items-center gap-1 text-[11px] font-bold text-foreground hover:text-saffron transition-colors group uppercase tracking-wide">
                        Read More <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
