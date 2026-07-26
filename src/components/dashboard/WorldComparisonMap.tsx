import { useMemo, useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Info, X, Globe2, ZoomIn, ZoomOut, RotateCcw, MapPin } from "lucide-react";

// TopoJSON map of the world
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// The indicators we support
const INDICATORS = [
  { id: "gdp", label: "GDP Growth (%)", desc: "Annual percentage growth rate of GDP", source: "World Bank" },
  { id: "hdi", label: "Human Development Index", desc: "Composite index of life expectancy, education, and per capita income", source: "UNDP" },
  { id: "innovation", label: "Innovation Index", desc: "Global ranking of innovation capabilities", source: "WIPO" },
  { id: "epi", label: "Environmental Performance", desc: "State of sustainability and environmental health", source: "Yale University" },
  { id: "life", label: "Life Expectancy", desc: "Average number of years a newborn is expected to live", source: "WHO" },
] as const;

type IndicatorId = typeof INDICATORS[number]["id"];

// Our Mock Data for ~30 major economies
const MOCK_MAP_DATA: Record<string, { code: string; gdp: number; hdi: number; innovation: number; epi: number; life: number; summary: string }> = {
  "India": { code: "IN", gdp: 7.2, hdi: 0.633, innovation: 40, epi: 18.9, life: 67.2, summary: "Fastest-growing major economy with massive digital infrastructure expansion." },
  "United States of America": { code: "US", gdp: 2.1, hdi: 0.921, innovation: 2, epi: 51.1, life: 77.2, summary: "World's largest economy with leading innovation and capital markets." },
  "China": { code: "CN", gdp: 5.2, hdi: 0.768, innovation: 11, epi: 28.4, life: 78.2, summary: "Manufacturing powerhouse rapidly transitioning to high-tech and green energy." },
  "Germany": { code: "DE", gdp: -0.3, hdi: 0.942, innovation: 8, epi: 62.4, life: 81.3, summary: "European industrial engine undergoing structural energy transition." },
  "Japan": { code: "JP", gdp: 1.0, hdi: 0.925, innovation: 13, epi: 57.2, life: 84.6, summary: "Technological leader facing demographic challenges with an aging population." },
  "United Kingdom": { code: "GB", gdp: 0.5, hdi: 0.929, innovation: 4, epi: 77.7, life: 81.2, summary: "Global financial hub with world-class academic and research institutions." },
  "Brazil": { code: "BR", gdp: 2.9, hdi: 0.754, innovation: 54, epi: 55.2, life: 75.3, summary: "Resource-rich economy with significant agricultural and green energy potential." },
  "France": { code: "FR", gdp: 0.9, hdi: 0.903, innovation: 12, epi: 62.5, life: 82.3, summary: "Diversified European economy with strong aerospace, luxury, and nuclear sectors." },
  "South Korea": { code: "KR", gdp: 1.4, hdi: 0.925, innovation: 6, epi: 46.9, life: 83.5, summary: "High-tech manufacturing export leader with deep focus on R&D." },
  "Australia": { code: "AU", gdp: 1.5, hdi: 0.951, innovation: 25, epi: 60.1, life: 83.2, summary: "Advanced economy driven by vast natural resources and high living standards." },
  "Canada": { code: "CA", gdp: 1.1, hdi: 0.936, innovation: 15, epi: 50.0, life: 82.7, summary: "Resource-rich advanced economy deeply integrated with US supply chains." },
  "Italy": { code: "IT", gdp: 0.7, hdi: 0.895, innovation: 28, epi: 57.7, life: 83.0, summary: "Historic manufacturing base with strong luxury and automotive exports." },
  "Spain": { code: "ES", gdp: 2.5, hdi: 0.905, innovation: 29, epi: 56.6, life: 83.2, summary: "Service-oriented European economy with massive tourism and renewable energy." },
  "Mexico": { code: "MX", gdp: 3.2, hdi: 0.758, innovation: 58, epi: 46.4, life: 70.2, summary: "Major manufacturing hub benefiting heavily from nearshoring trends." },
  "Indonesia": { code: "ID", gdp: 5.0, hdi: 0.705, innovation: 75, epi: 28.3, life: 71.3, summary: "Rapidly growing Southeast Asian giant leveraging critical mineral reserves." },
  "Netherlands": { code: "NL", gdp: 0.2, hdi: 0.941, innovation: 5, epi: 61.1, life: 81.5, summary: "Highly developed logistics and agricultural hub with leading tech companies." },
  "Saudi Arabia": { code: "SA", gdp: 1.5, hdi: 0.875, innovation: 51, epi: 42.8, life: 75.3, summary: "Global energy leader aggressively diversifying into tech and tourism." },
  "Turkey": { code: "TR", gdp: 4.5, hdi: 0.838, innovation: 37, epi: 42.6, life: 78.5, summary: "Strategic transcontinental economy with strong industrial and construction sectors." },
  "Switzerland": { code: "CH", gdp: 0.8, hdi: 0.962, innovation: 1, epi: 65.9, life: 83.8, summary: "Global leader in innovation, finance, and pharmaceutical research." },
  "Sweden": { code: "SE", gdp: -0.2, hdi: 0.947, innovation: 3, epi: 72.7, life: 83.0, summary: "Nordic welfare state with leading green tech and startup ecosystems." },
  "Poland": { code: "PL", gdp: 0.2, hdi: 0.876, innovation: 38, epi: 50.6, life: 77.9, summary: "Fast-growing Central European hub integrating rapidly with Western markets." },
  "Argentina": { code: "AR", gdp: -2.5, hdi: 0.842, innovation: 69, epi: 41.1, life: 77.3, summary: "Resource-rich South American nation undergoing profound economic restructuring." },
  "Belgium": { code: "BE", gdp: 1.4, hdi: 0.937, innovation: 26, epi: 58.2, life: 81.9, summary: "Central European logistics and chemical manufacturing hub." },
  "Thailand": { code: "TH", gdp: 1.9, hdi: 0.800, innovation: 43, epi: 38.1, life: 78.7, summary: "Export-oriented Southeast Asian economy heavily reliant on tourism and autos." },
  "Nigeria": { code: "NG", gdp: 2.9, hdi: 0.535, innovation: 114, epi: 28.3, life: 53.6, summary: "Africa's largest economy with a rapidly growing, young, and entrepreneurial population." },
  "Egypt": { code: "EG", gdp: 4.2, hdi: 0.731, innovation: 89, epi: 35.5, life: 70.2, summary: "Strategic North African economy with major infrastructure and energy investments." },
  "South Africa": { code: "ZA", gdp: 0.6, hdi: 0.713, innovation: 61, epi: 37.2, life: 64.9, summary: "Most industrialized African economy facing structural energy and labor challenges." },
  "Singapore": { code: "SG", gdp: 1.1, hdi: 0.939, innovation: 7, epi: 50.9, life: 83.4, summary: "Highly developed global financial and logistics hub." },
  "Russia": { code: "RU", gdp: 3.6, hdi: 0.822, innovation: 47, epi: 43.8, life: 71.3, summary: "Commodity-driven economy deeply rich in energy and mineral resources." },
};

interface WorldComparisonMapProps {
  onCompare: (countryCode: string) => void;
}

export function WorldComparisonMap({ onCompare }: WorldComparisonMapProps) {
  const [indicator, setIndicator] = useState<IndicatorId>("gdp");
  const [tooltipContent, setTooltipContent] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  // Map interaction state
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation to center on India
    const timer = setTimeout(() => {
      setPosition({ coordinates: [80, 22], zoom: 2 });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (isMapInteractive && mapContainerRef.current && !mapContainerRef.current.contains(event.target as Node)) {
        setIsMapInteractive(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (isMapInteractive && event.key === "Escape") {
        setIsMapInteractive(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMapInteractive]);

  // Completely freeze wheel/touch events from reaching d3-zoom when inactive
  // This guarantees normal page scrolling works without the map interfering.
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const stopIfInactive = (e: Event) => {
      if (!isMapInteractive) {
        e.stopPropagation();
      }
    };

    const handleDoubleClick = (e: MouseEvent) => {
      if (!isMapInteractive) {
        setIsMapInteractive(true);
        e.stopPropagation();
      }
    };

    el.addEventListener("wheel", stopIfInactive, { capture: true });
    el.addEventListener("touchstart", stopIfInactive, { capture: true });
    el.addEventListener("touchmove", stopIfInactive, { capture: true });
    el.addEventListener("dblclick", handleDoubleClick, { capture: true });

    return () => {
      el.removeEventListener("wheel", stopIfInactive, { capture: true });
      el.removeEventListener("touchstart", stopIfInactive, { capture: true });
      el.removeEventListener("touchmove", stopIfInactive, { capture: true });
      el.removeEventListener("dblclick", handleDoubleClick, { capture: true });
    };
  }, [isMapInteractive]);

  const handleZoomIn = () => {
    if (position.zoom >= 5) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [80, 22], zoom: 2 });
  };

  const handleCenterIndia = () => {
    setPosition({ coordinates: [80, 22], zoom: 4 });
  };

  const currentIndicator = INDICATORS.find((i) => i.id === indicator)!;

  // Compute ranks for the active indicator
  const rankedCountries = useMemo(() => {
    const list = Object.entries(MOCK_MAP_DATA).map(([name, data]) => ({
      name,
      ...data,
      val: data[indicator as keyof typeof data] as number,
    }));
    // Determine sort direction (innovation rank lower is better, others higher is better)
    if (indicator === "innovation") {
      list.sort((a, b) => a.val - b.val);
    } else {
      list.sort((a, b) => b.val - a.val);
    }
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [indicator]);

  // Color Scale Generator
  const colorScale = useMemo(() => {
    const vals = rankedCountries.map((c) => c.val);
    const min = Math.min(...vals);
    const max = Math.max(...vals);

    if (indicator === "innovation") {
      // Lower is better (darker green for lower rank)
      return scaleLinear<number, string>().domain([min, max]).range(["#10b981", "#fbbf24"]);
    } else if (indicator === "gdp") {
      // Negative is red, positive is green
      return scaleLinear<number, string>().domain([min, 0, max]).range(["#ef4444", "#fef3c7", "#10b981"]);
    } else {
      // Higher is better
      return scaleLinear<number, string>().domain([min, max]).range(["#fef3c7", "#10b981"]);
    }
  }, [indicator, rankedCountries]);

  const handleMouseEnter = (geo: any, evt: React.MouseEvent) => {
    const countryName = geo.properties.name;
    const data = rankedCountries.find((c) => c.name === countryName);
    
    if (data) {
      setTooltipContent({
        name: countryName,
        val: data.val,
        rank: data.rank,
        source: currentIndicator.source,
      });
      setTooltipPos({ x: evt.clientX, y: evt.clientY });
    } else {
      setTooltipContent(null);
    }
  };

  const handleMouseMove = (evt: React.MouseEvent) => {
    if (tooltipContent) {
      setTooltipPos({ x: evt.clientX, y: evt.clientY });
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  const handleClick = (geo: any) => {
    const countryName = geo.properties.name;
    const data = rankedCountries.find((c) => c.name === countryName);
    
    if (data && data.code !== "IN") {
      setSelectedCountry(data);
    }
  };

  return (
    <section className="relative w-full mx-auto mb-12 animate-fade-in">
      <div className="card-surface rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/60 shadow-sm relative flex flex-col xl:flex-row">
        
        {/* Main Map Area */}
        <div 
          ref={mapContainerRef}
          className="flex-1 relative min-h-[500px] bg-gradient-to-br from-sky-50/50 to-transparent dark:from-sky-950/10 dark:to-transparent"
        >
          
          {/* Header & Controls Overlay */}
          <div className="absolute top-0 left-0 right-0 p-5 z-20 flex flex-col sm:flex-row gap-4 justify-between items-start pointer-events-none">
            <div className="pointer-events-auto">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-saffron" />
                Where Does India Stand Globally?
              </h2>
              <p className="text-[13px] text-muted-foreground mt-1 max-w-md">
                Explore India's position across key global indicators and compare it with leading economies.
              </p>
            </div>
            
            <div className="pointer-events-auto relative shrink-0">
              <select
                value={indicator}
                onChange={(e) => setIndicator(e.target.value as IndicatorId)}
                className="appearance-none rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-2.5 pl-4 pr-10 text-[13px] font-medium hover:bg-secondary cursor-pointer shadow-sm outline-none focus:ring-2 focus:ring-saffron/30 transition-all text-foreground"
              >
                {INDICATORS.map((i) => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Map Render */}
          <ComposableMap 
            projection="geoMercator" 
            projectionConfig={{ scale: 120 }}
            className={`w-full h-[500px] xl:h-[600px] outline-none transition-opacity ${!isMapInteractive ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}`}
          >
            <ZoomableGroup 
              center={position.coordinates} 
              zoom={position.zoom} 
              onMoveEnd={(pos) => setPosition({ coordinates: pos.coordinates as [number, number], zoom: pos.zoom })}
              disablePanning={!isMapInteractive}
              disableZooming={!isMapInteractive}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name;
                    const isIndia = countryName === "India";
                    const data = rankedCountries.find((c) => c.name === countryName);
                    
                    let fillColor = "#e4e4e7"; // zinc-200 default
                    if (document.documentElement.classList.contains("dark")) {
                      fillColor = "#27272a"; // zinc-800 default dark
                    }
                    
                    if (data) {
                      fillColor = colorScale(data.val) as string;
                    }

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(e) => handleMouseEnter(geo, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(geo)}
                        className="outline-none"
                        style={{
                          default: {
                            fill: fillColor,
                            stroke: isIndia ? "var(--saffron)" : "#ffffff40",
                            strokeWidth: isIndia ? 2 : 0.5,
                            outline: "none",
                            transition: "all 250ms",
                          },
                          hover: {
                            fill: data ? (isIndia ? "var(--saffron)" : "#f59e0b") : "#a1a1aa",
                            stroke: "#fff",
                            strokeWidth: 1,
                            outline: "none",
                            cursor: data ? "pointer" : "default"
                          },
                          pressed: {
                            fill: data ? "#d97706" : "#a1a1aa",
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
              {/* India pulse ring marker (approx coordinate for India) */}
              <g transform="translate(685, 275)">
                 <circle r="8" fill="var(--saffron)" fillOpacity="0.4" className="animate-ping" />
                 <circle r="4" fill="var(--saffron)" />
              </g>
            </ZoomableGroup>
          </ComposableMap>

          {/* Interactive State Overlay Badge */}
          {isMapInteractive ? (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fade-in">
              <div className="bg-zinc-900/90 dark:bg-white/90 text-white dark:text-black px-4 py-2 rounded-full text-[12px] font-medium flex items-center gap-2 shadow-lg backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Map Controls Enabled
                <span className="text-zinc-400 dark:text-zinc-500 ml-1 font-normal border-l border-zinc-700 dark:border-zinc-300 pl-3">Press Esc or click outside to exit</span>
              </div>
            </div>
          ) : (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fade-in">
              <div className="bg-white/80 dark:bg-zinc-900/80 text-foreground px-4 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-2 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md">
                Double click to activate map
              </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute right-4 bottom-4 z-30 flex flex-col gap-2">
            <div className="bg-background/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 p-1.5 rounded-2xl shadow-sm flex flex-col gap-1">
              <button onClick={handleZoomIn} disabled={!isMapInteractive} className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-secondary text-foreground transition disabled:opacity-50 disabled:hover:bg-transparent" title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button onClick={handleZoomOut} disabled={!isMapInteractive} className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-secondary text-foreground transition disabled:opacity-50 disabled:hover:bg-transparent" title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <div className="h-px bg-zinc-200/50 dark:bg-zinc-800/50 my-0.5 mx-1" />
              <button onClick={handleReset} disabled={!isMapInteractive} className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-secondary text-foreground transition disabled:opacity-50 disabled:hover:bg-transparent" title="Reset View">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={handleCenterIndia} disabled={!isMapInteractive} className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-secondary text-foreground transition disabled:opacity-50 disabled:hover:bg-transparent" title="Center on India">
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Custom Tooltip */}
          {tooltipContent && (
            <div 
              className="fixed z-50 pointer-events-none rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md min-w-[160px] animate-scale-in"
              style={{ left: tooltipPos.x + 15, top: tooltipPos.y + 15 }}
            >
              <div className="font-bold text-[14px] text-foreground border-b border-zinc-100 dark:border-zinc-800 pb-1.5 mb-1.5 flex justify-between items-center gap-4">
                {tooltipContent.name}
                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">Rank #{tooltipContent.rank}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{currentIndicator.label}</div>
                  <div className="font-mono font-bold text-[16px] text-saffron mt-0.5">
                    {tooltipContent.val}
                    {indicator === 'gdp' && '%'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
            <div className="bg-background/80 backdrop-blur-md rounded-xl p-3 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2 tracking-wider">Legend</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Min</span>
                <div className="h-2 w-24 rounded-full bg-gradient-to-r from-red-500 via-amber-100 to-emerald-500" />
                <span className="text-[10px] text-muted-foreground">Max</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel (renders only when a country is selected) */}
        {selectedCountry && (
          <div className="w-full xl:w-[320px] bg-background border-t xl:border-t-0 xl:border-l border-zinc-200/50 dark:border-zinc-800/60 p-6 flex flex-col relative animate-fade-in z-20">
            <button 
              onClick={() => setSelectedCountry(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="mb-6 pr-8">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">{selectedCountry.name}</h3>
              <div className="inline-flex items-center gap-1.5 bg-saffron/10 text-saffron px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider mt-2">
                Global Rank: #{selectedCountry.rank}
              </div>
            </div>

            <div className="space-y-5 flex-1">
              <div className="bg-secondary/50 rounded-2xl p-4 border hairline">
                <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{currentIndicator.label}</div>
                <div className="text-3xl font-bold font-mono mt-1 text-foreground">
                  {selectedCountry.val}
                  {indicator === 'gdp' && '%'}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Source: {currentIndicator.source}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-foreground mb-2">Executive Summary</div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {selectedCountry.summary}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <button
                onClick={() => {
                  onCompare(selectedCountry.code);
                  setSelectedCountry(null);
                }}
                className="w-full rounded-xl bg-foreground text-background py-3 text-[14px] font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                Compare with India
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
