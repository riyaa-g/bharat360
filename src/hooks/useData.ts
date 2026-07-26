import { useState, useEffect } from "react";

const DOMAIN_DATASET_MAP: Record<string, string> = {
  economy: "/data/economy/gdp.json",
  healthcare: "/data/healthcare/life_expectancy.json",
  education: "/data/education/literacy.json",
  environment: "/data/environment/co2.json",
  technology: "/data/technology/innovation.json",
  equality: "/data/equality/gini.json",
  society: "/data/society/happiness.json",
  overview: "/data/overview/hdi.json",
  agriculture: "/data/economy/gdp_growth.json", // fallback for agriculture if no specific one
  safety: "/data/equality/gini.json", // fallback for safety
  governance: "/data/overview/hdi.json" // fallback for governance
};

export type TrendDataPoint = {
  year: string;
  [country: string]: string | number;
};

export type BarDataPoint = {
  name: string;
  value: number;
};

export type DatasetResponse = {
  title: string;
  source: string;
  unit: string;
  lastUpdated: string;
  countries: string[];
  years: number[];
  data: Array<{ country: string } & Record<string, number>>;
};

export type ProcessedDataset = {
  raw: DatasetResponse;
  trendData: TrendDataPoint[];
  barData: BarDataPoint[];
  latestYear: string;
  indiaLatestValue: number;
  indiaYoYGrowth: number;
};

export function useDataset(domainSlug: string) {
  const [data, setData] = useState<ProcessedDataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDataset = async () => {
      setLoading(true);
      setError(null);
      
      const filepath = DOMAIN_DATASET_MAP[domainSlug];
      if (!filepath) {
        if (isMounted) {
          setError("No dataset mapping found for this domain.");
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(filepath);
        if (!res.ok) {
          throw new Error(`Failed to fetch dataset: ${res.statusText}`);
        }
        
        const json: DatasetResponse = await res.json();
        
        if (!json.data || json.data.length === 0) {
          throw new Error("Dataset is empty.");
        }

        // Process trendData for LineChart
        const trendData: TrendDataPoint[] = [];
        json.years.forEach(year => {
          const point: TrendDataPoint = { year: year.toString() };
          json.data.forEach(row => {
            if (row[year.toString()] !== undefined) {
              point[row.country] = row[year.toString()];
            }
          });
          trendData.push(point);
        });

        // Process barData for BarChart (latest year)
        const latestYear = json.lastUpdated;
        const barData: BarDataPoint[] = [];
        json.data.forEach(row => {
          if (row[latestYear] !== undefined) {
            barData.push({ name: row.country, value: row[latestYear] });
          }
        });
        barData.sort((a, b) => b.value - a.value); // Sort descending

        // Calculate KPI values for India
        const indiaRow = json.data.find(r => r.country === "India");
        let indiaLatestValue = 0;
        let indiaYoYGrowth = 0;
        
        if (indiaRow) {
          indiaLatestValue = indiaRow[latestYear] || 0;
          
          // find previous year to calc growth
          const sortedYears = [...json.years].sort();
          const latestIdx = sortedYears.indexOf(Number(latestYear));
          if (latestIdx > 0) {
            const prevYear = sortedYears[latestIdx - 1].toString();
            const prevValue = indiaRow[prevYear];
            if (prevValue && prevValue !== 0) {
              indiaYoYGrowth = ((indiaLatestValue - prevValue) / prevValue) * 100;
            }
          }
        }

        if (isMounted) {
          setData({
            raw: json,
            trendData,
            barData,
            latestYear,
            indiaLatestValue,
            indiaYoYGrowth
          });
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error(err);
          setError(err.message || "No data available for this metric.");
          setLoading(false);
        }
      }
    };

    fetchDataset();
    return () => { isMounted = false; };
  }, [domainSlug]);

  return { data, loading, error };
}

export function useStateData(domainSlug: string) {
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStates = async () => {
      setLoading(true);
      try {
        // In the future, this will check for domain-specific state data.
        // For now, it falls back to the mock_states.json file.
        const res = await fetch("/data/states/mock_states.json");
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setStates(json);
          }
        }
      } catch (err) {
        console.error("Failed to load state data", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStates();
    return () => { isMounted = false; };
  }, [domainSlug]);

  return { states, loading };
}

export function useOverview() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/data/overview.json")
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setOverview(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return { overview, loading };
}

export function useSearch(query: string) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [allDatasets, setAllDatasets] = useState<any[]>([]);

  // Load datasets.json once
  useEffect(() => {
    fetch("/data/datasets.json")
      .then(res => res.json())
      .then(data => setAllDatasets(data))
      .catch(err => console.error("Failed to load datasets index for search", err));
  }, []);

  useEffect(() => {
    if (!query || query.trim() === "") {
      setResults([]);
      return;
    }
    
    setLoading(true);
    const q = query.toLowerCase();
    
    const filtered = allDatasets.filter(ds => 
      ds.title.toLowerCase().includes(q) ||
      ds.category.toLowerCase().includes(q) ||
      ds.source.toLowerCase().includes(q) ||
      ds.description.toLowerCase().includes(q) ||
      (ds.tags && ds.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
    
    setResults(filtered);
    setLoading(false);
  }, [query, allDatasets]);

  return { results, loading };
}
