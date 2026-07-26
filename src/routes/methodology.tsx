import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'

export const Route = createFileRoute('/methodology')({
  component: MethodologyPage,
})

function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        
        <main className="flex-1 w-full max-w-[850px] mx-auto px-6 py-16 lg:px-10 lg:py-24">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-foreground dark:text-white hover:opacity-80 transition-opacity w-fit">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </div>

          <article className="prose prose-zinc dark:prose-invert max-w-none">
            
            {/* 1. Story Introduction */}
            <div className="mb-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
                Behind the Numbers
              </h1>
              <p className="text-[17px] leading-relaxed text-muted-foreground/90 max-w-2xl mx-auto italic">
                "Every day we see rankings, reports, and statistics about India's progress. But what do those numbers actually mean? How do they connect with one another, and how can someone understand the bigger picture without reading hundreds of dense reports?"
              </p>
            </div>

            <p className="text-[15.5px] leading-relaxed text-foreground/90 mb-12">
              Bharat360 was built to bridge that gap. We transform trusted public datasets into a seamless, interactive platform designed to make India's development easier to explore, understand, and compare. Our goal isn't just to show you data—it's to help you make sense of it.
            </p>

            <hr className="border-t hairline my-12" />

            {/* 2. Our Approach */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Our Approach</h2>
              <p className="text-[15.5px] leading-relaxed text-foreground/90 mb-4">
                We believe that data is only useful when it answers real questions. That's why Bharat360 is fundamentally designed around three core questions:
              </p>
              <div className="my-6 rounded-2xl bg-saffron/5 border border-saffron/10 p-6">
                <ul className="space-y-3 font-medium text-[15px] text-foreground m-0 list-none pl-0">
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-saffron"></span> Where does India currently stand?</li>
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-saffron"></span> How has India changed over time?</li>
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-saffron"></span> Why do these trends matter?</li>
                </ul>
              </div>
              <p className="text-[15.5px] leading-relaxed text-foreground/90">
                Every single feature on the platform—from our visualizations to our AI-assisted narratives—is carefully built around answering one of these questions.
              </p>
            </section>

            {/* 3. Dashboard Design */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Designing for Discovery</h2>
              <p className="text-[15.5px] leading-relaxed text-foreground/90 mb-4">
                The journey through a domain is intentionally structured. Every dashboard begins with high-level indicators to give you an immediate, clear overview of the current state. From there, historical trend visualizations help you understand the trajectory of progress rather than just isolated numbers.
              </p>
              <p className="text-[15.5px] leading-relaxed text-foreground/90 mb-4">
                Global comparisons place India's performance firmly in an international context, while interactive state-level maps allow you to identify regional differences within the country. 
              </p>
              <p className="text-[15.5px] leading-relaxed text-foreground/90">
                To ensure accessibility, we use tooltips that simplify technical indicators so users from any background can understand the metrics. The layout intentionally moves from a quick summary to exploration, and finally to a deeper, nuanced understanding.
              </p>
            </section>

            {/* 4. Compare Module */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">The Power of Comparison</h2>
              <p className="text-[15.5px] leading-relaxed text-foreground/90 mb-4">
                Understanding a statistic often requires a benchmark. Rather than only knowing India's rank, our Compare module lets you directly contrast India against another country across multiple indicators simultaneously.
              </p>
              <p className="text-[15.5px] leading-relaxed text-foreground/90">
                This helps you understand relative strengths, identify clear areas for improvement, and interpret performance within a realistic global context instead of viewing statistics in a vacuum.
              </p>
            </section>

            {/* 5. Insights Module */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Storytelling with Data</h2>
              <p className="text-[15.5px] leading-relaxed text-foreground/90 mb-4">
                Numbers alone rarely tell the complete story. The Insights section acts as the storytelling layer of Bharat360, weaving multiple datasets, recent developments, and contextual information into readable narratives.
              </p>
              <p className="text-[15.5px] leading-relaxed text-foreground/90">
                These narratives explain why certain trends exist and what they imply for the future. Rather than replacing the raw data, these insights act as a guide to help you interpret the numbers more meaningfully.
              </p>
            </section>

            {/* 6. Data */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Trusted Sources</h2>
              <p className="text-[15.5px] leading-relaxed text-foreground/90 mb-4">
                Bharat360 aggregates and standardizes public datasets from internationally recognized organizations, including the World Bank, WHO, UNDP, Our World in Data, Oxford Insights, WIPO, and the Yale Environmental Performance Index.
              </p>
              <p className="text-[15.5px] leading-relaxed text-foreground/90">
                These datasets are cleaned and transformed into lightweight formats optimized for fast, responsive visualization—always preserving direct links back to the original source.
              </p>
            </section>

            <hr className="border-t hairline my-10" />

            {/* 7. Transparency */}
            <section className="mb-8">
              <p className="text-[16px] font-medium leading-relaxed text-foreground/90 text-center">
                Ultimately, Bharat360 prioritizes transparency by clearly attributing every visualization to its original data source. The platform is designed to help you understand public data—not replace it—and we encourage further exploration through direct access to official datasets.
              </p>
            </section>
            
          </article>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
