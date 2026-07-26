import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { Search, Database, ArrowUpRight, Filter, ChevronDown, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/datasets')({
  component: DatasetsExplorer,
})

// These are the datasets we actually have JSON data files for.
const AVAILABLE_DATASETS = [
  'gdp', 'co2', 'gini', 'hdi', 'life_expectancy', 'literacy', 'innovation', 'happiness', 'gdp_growth'
];

const getSourceUrl = (source: string) => {
  switch(source.toUpperCase()) {
    case 'WORLDBANK': return 'https://data.worldbank.org/';
    case 'OWID': return 'https://ourworldindata.org/';
    case 'UNDP': return 'https://hdr.undp.org/data-center';
    case 'WHO': return 'https://www.who.int/data/gho';
    case 'OXFORD': return 'https://www.bsg.ox.ac.uk/';
    default: return 'https://www.google.com/search?q=' + encodeURIComponent(source + ' data');
  }
};

function DatasetsExplorer() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  useEffect(() => {
    fetch('/data/datasets.json')
      .then(res => res.json())
      .then(data => {
        setDatasets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load datasets', err);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(datasets.map(d => d.category));
    return ['All', ...Array.from(cats)].sort();
  }, [datasets]);

  const sources = useMemo(() => {
    const srcs = new Set(datasets.map(d => d.source));
    return ['All', ...Array.from(srcs)].sort();
  }, [datasets]);

  const filteredDatasets = useMemo(() => {
    return datasets.filter(d => {
      const matchQuery = 
        !query || 
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase()) ||
        d.source.toLowerCase().includes(query.toLowerCase()) ||
        d.description.toLowerCase().includes(query.toLowerCase()) ||
        (d.tags && d.tags.some((t: string) => t.toLowerCase().includes(query.toLowerCase())));
        
      const matchCategory = categoryFilter === 'All' || d.category === categoryFilter;
      const matchSource = sourceFilter === 'All' || d.source === sourceFilter;

      return matchQuery && matchCategory && matchSource;
    });
  }, [datasets, query, categoryFilter, sourceFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-12 lg:px-10">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-foreground dark:text-white hover:opacity-80 transition-opacity w-fit">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-saffron/10 text-saffron">
                <Database className="h-5 w-5" />
              </span>
              Dataset Repository
            </h1>
            <p className="text-muted-foreground max-w-2xl text-[15px] leading-relaxed">
              Explore the complete catalog of global datasets powering Bharat360. 
              Search by title, filter by category or source, and access raw data dashboards to uncover deeper insights.
            </p>
          </div>

          {/* Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full rounded-2xl border hairline bg-card/50 backdrop-blur-md px-10 py-3 text-[14px] outline-none transition-colors focus:border-saffron/50 focus:bg-background placeholder:text-muted-foreground/70"
              />
            </div>
            
            <div className="flex gap-4 sm:w-auto w-full">
              <div className="relative shrink-0 sm:w-48 w-1/2">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="w-full appearance-none rounded-2xl border hairline bg-card/50 backdrop-blur-md px-4 py-3 text-[13.5px] outline-none transition-colors focus:border-saffron/50 focus:bg-background cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              
              <div className="relative shrink-0 sm:w-48 w-1/2">
                <select
                  value={sourceFilter}
                  onChange={e => setSourceFilter(e.target.value)}
                  className="w-full appearance-none rounded-2xl border hairline bg-card/50 backdrop-blur-md px-4 py-3 text-[13.5px] outline-none transition-colors focus:border-saffron/50 focus:bg-background cursor-pointer"
                >
                  {sources.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sources' : s}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border hairline bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b hairline bg-secondary/40 text-muted-foreground">
                    <th className="font-semibold px-6 py-4">Dataset Name</th>
                    <th className="font-semibold px-6 py-4">Category</th>
                    <th className="font-semibold px-6 py-4">Source</th>
                    <th className="font-semibold px-6 py-4 whitespace-nowrap">Years Covered</th>
                    <th className="font-semibold px-6 py-4 whitespace-nowrap">Countries</th>
                    <th className="font-semibold px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y hairline divide-zinc-200 dark:divide-zinc-800/80">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        Loading datasets...
                      </td>
                    </tr>
                  ) : filteredDatasets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No datasets found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDatasets.map(ds => {
                      const isAvailable = AVAILABLE_DATASETS.includes(ds.id);
                      const yearsStr = ds.years && ds.years.length > 0 
                        ? `${Math.min(...ds.years)} - ${Math.max(...ds.years)}`
                        : 'N/A';
                      const countriesCount = ds.countries ? ds.countries.length : 0;

                      return (
                        <tr key={ds.id} className="hover:bg-white/40 dark:hover:bg-zinc-900/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-foreground mb-1 flex items-center gap-2">
                              {ds.title}
                              {!isAvailable && (
                                <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap border hairline">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            <div className="text-[11.5px] text-muted-foreground line-clamp-1 max-w-[280px]">
                              {ds.description}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
                              {ds.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {ds.source}
                          </td>
                          <td className="px-6 py-4 font-mono text-[12px] text-muted-foreground">
                            {yearsStr}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {countriesCount > 0 ? `${countriesCount} Nations` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              {isAvailable ? (
                                <Link
                                  to="/dashboard/$domain"
                                  params={{ domain: ds.category.toLowerCase() }}
                                  className="text-[12px] font-medium text-saffron hover:text-saffron/80 transition-colors"
                                >
                                  Open Dashboard
                                </Link>
                              ) : (
                                <span className="text-[12px] font-medium text-muted-foreground/50 cursor-not-allowed">
                                  Open Dashboard
                                </span>
                              )}
                              <a
                                href={getSourceUrl(ds.source)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[12px] font-medium text-foreground hover:text-saffron transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                Source <ArrowUpRight className="h-3 w-3" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </main>
        <Footer />
      </div>
    </div>
  );
}
