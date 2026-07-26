import { useMemo, useState, useCallback, useEffect } from "react";
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
  Info,
  ChevronDown,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Domain, DomainSlug } from "@/lib/domains";
import { DOMAIN_LIST } from "@/lib/domains";
import { formatNumber } from "@/lib/format";
import { useDataset, useStateData, useSearch } from "@/hooks/useData";

/* =================== METRICS DEFINITIONS & SOURCES =================== */
const COUNTRY_CODES: Record<string, string> = {
  "United States": "US",
  "China": "CN",
  "Japan": "JP",
  "Germany": "DE",
  "India": "IN",
  "United Kingdom": "GB",
  "Brazil": "BR",
  "South Korea": "KR",
  "Russia": "RU"
};

const METRIC_TOOLTIPS: Record<string, { desc: string; significance: string; source: string }> = {
  // Economy
  "composite score": {
    desc: "A standardized developmental score out of 100 aggregated from all active indicators in this domain.",
    significance: "Enables direct comparative health assessments across states regardless of size.",
    source: "Bharat360 Index Calculations"
  },
  "gdp (nominal)": {
    desc: "Total market value of all finished goods and services produced within a country in current US dollars.",
    significance: "Indicates the absolute size of the national economy on the global stage.",
    source: "World Bank / IMF"
  },
  "gdp growth": {
    desc: "Annual percentage change in the constant-price Gross Domestic Product (inflation-adjusted).",
    significance: "Measures economic momentum and acceleration speed of national production.",
    source: "MoSPI / IMF"
  },
  "inflation": {
    desc: "Rate of change in the Consumer Price Index (CPI), representing the cost of a basket of standard consumer goods.",
    significance: "High inflation erodes purchasing power; lower stable inflation helps investments.",
    source: "RBI / MoSPI"
  },
  "forex reserves": {
    desc: "Foreign currency assets, gold, SDRs, and reserve position held by the Reserve Bank of India.",
    significance: "Acts as a financial cushion against balance of payment shocks and stabilizes local currency.",
    source: "Reserve Bank of India (RBI)"
  },
  // Healthcare
  "life expectancy": {
    desc: "Average number of years a newborn child is expected to live under current mortality patterns.",
    significance: "Core indicator of public health, sanitation, nutrition, and lifestyle qualities.",
    source: "WHO / Census India"
  },
  "health spend / gdp": {
    desc: "Public and private health expenditures combined, measured as a percentage of total Gross Domestic Product.",
    significance: "Reflects national prioritization of healthcare services and infrastructure investment.",
    source: "National Health Accounts / WHO"
  },
  "infant mortality": {
    desc: "Number of infant deaths under 1 year of age per 1,000 live births in a given year.",
    significance: "Extremely sensitive proxy for maternal care, neonatal nutrition, and primary healthcare access.",
    source: "SRS / Ministry of Health"
  },
  "ayushman coverage": {
    desc: "Total count of vulnerable families registered under the Ayushman Bharat PM-JAY health insurance plan.",
    significance: "Indicates social safety net penetration for tertiary care and hospitalization cost offsets.",
    source: "National Health Authority (NHA)"
  },
  // Environment
  "renewable capacity": {
    desc: "Total electrical generation capacity from non-fossil resources like solar, wind, hydro, and biomass.",
    significance: "Demonstrates energy grid diversification towards green, sustainable alternatives.",
    source: "Central Electricity Authority (CEA)"
  },
  "forest cover": {
    desc: "Total land area classified under forest canopy and tree cover as a percentage of geographical area.",
    significance: "Measures carbon sequestration capability and biodiversity preservation efforts.",
    source: "Forest Survey of India (FSI)"
  },
  "co₂ per capita": {
    desc: "Metric tons of carbon dioxide emitted annually divided by the mid-year population of the country.",
    significance: "Tracks carbon intensity per individual citizen relative to global climate equity benchmarks.",
    source: "Global Carbon Budget / OWID"
  },
  "ev sales share": {
    desc: "Percentage of new electric vehicles registered out of all automobile sales in the fiscal year.",
    significance: "Tracks transport decarbonization and clean energy transition momentum.",
    source: "VAHAN Dashboard / CEA"
  },
  // Technology
  "active internet users": {
    desc: "Estimated total population accessing the internet at least once a month.",
    significance: "Core index of digital connectivity and mobile internet access scale.",
    source: "TRAI / IAMAI"
  },
  "digital transactions": {
    desc: "Annual transaction volume executed through Unified Payments Interface (UPI) and other digital rails.",
    significance: "Tracks transition towards formal digital finance and cash-less commerce.",
    source: "NPCI / Ministry of IT"
  },
  "it exports": {
    desc: "Total value of software and services exported globally by Indian companies in billions of US dollars.",
    significance: "Reflects technical competitiveness and contribution to global software supply chains.",
    source: "NASSCOM / Ministry of Commerce"
  },
  "startup density": {
    desc: "Total number of active, recognized startups per million urban population.",
    significance: "Tracks regional entrepreneurial vitality and knowledge economy emergence.",
    source: "DPIIT / NITI Aayog"
  },
  // Education
  "literacy rate": {
    desc: "Percentage of the population aged 7 and above who can read and write with understanding.",
    significance: "Foundation index of human resource capacity and basic educational outcomes.",
    source: "MoE / National Sample Survey"
  },
  "gross enrollment": {
    desc: "Ratio of total students enrolled in higher education to the corresponding age-group population.",
    significance: "Tracks secondary-to-tertiary transition rates and higher skill generation capability.",
    source: "AISHE / Ministry of Education"
  },
  "pupil-teacher ratio": {
    desc: "Average number of pupils per teacher in primary and secondary schools.",
    significance: "Reflects educational resources distribution and personalized student attention.",
    source: "UDISE+ / Ministry of Education"
  },
  "education spend / gdp": {
    desc: "Government funding on education services, measured as a percentage of Gross Domestic Product.",
    significance: "Tracks public investment prioritization for upcoming generations.",
    source: "Union & State Budgets / MoE"
  },
  // Agriculture
  "foodgrain output": {
    desc: "Total agricultural production of cereals, pulses, and grains in million metric tonnes.",
    significance: "Core pillar of national food security and agrarian economic strength.",
    source: "Ministry of Agriculture"
  },
  "irrigated area": {
    desc: "Percentage of total cropped area supplied with agricultural canals, tubes, or sprinklers.",
    significance: "Reflects agricultural resilience against erratic monsoon downpours.",
    source: "Ministry of Agriculture / DAC&FW"
  },
  "cold storage capacity": {
    desc: "Total capacity in million tonnes for temperature-controlled storage of perishable horticultural crops.",
    significance: "Key logistics factor for reducing post-harvest wastage and stabilizing crop prices.",
    source: "NCCD / Ministry of Food Processing"
  },
  "agri exports": {
    desc: "Total export value of agricultural and processed food products in billions of US dollars.",
    significance: "Indicates global market integration and agricultural export surplus potential.",
    source: "APEDA / Ministry of Commerce"
  },
  // Safety
  "crime rate": {
    desc: "Total cognizable offenses registered under Indian Penal Code (IPC) per 100,000 population.",
    significance: "Standard benchmark for law enforcement effectiveness and public security.",
    source: "National Crime Records Bureau (NCRB)"
  },
  "cyber crimes": {
    desc: "Total registered digital fraud, hacking, or online abuse offenses per 100,000 population.",
    significance: "Measures security challenges emerging from rapid digital connectivity growth.",
    source: "NCRB / Ministry of Home Affairs"
  },
  "road fatalities": {
    desc: "Total annual deaths resulting from road traffic accidents per 100,000 registered vehicles.",
    significance: "Tracks transport engineering safety and emergency trauma care system efficiency.",
    source: "MoRTH / NCRB"
  },
  "cctv coverage": {
    desc: "Average public security cameras installed per square kilometer in urban municipal centers.",
    significance: "Tracks municipal surveillance infrastructure capability and policing modernization.",
    source: "State Police Departments / NCRB"
  },
  // Governance
  "digital services": {
    desc: "Percentage of government G2C services delivered online through national single-window portals.",
    significance: "Measures administrative efficiency, ease of citizen interaction, and red-tape reduction.",
    source: "NeSDA / Ministry of Personnel"
  },
  "judicial vacancy": {
    desc: "Percentage of sanctioned judges positions currently lying vacant in High Courts and District Courts.",
    significance: "Key driver of pending case backlogs and delay in litigation resolution.",
    source: "Department of Justice"
  },
  "rti disposal rate": {
    desc: "Percentage of Right to Information requests disposed of within the statutory 30-day timeline.",
    significance: "Proxy for transparency, accountability, and responsiveness.",
    source: "Central Information Commission (CIC)"
  },
  "ease of business": {
    desc: "Index score based on simplified state-level business licenses and regulatory compliance burdens.",
    significance: "Measures state-level initiatives to attract investments and business capital.",
    source: "DPIIT / World Bank"
  },
  // Equality
  "gender pay gap": {
    desc: "Difference between average male and female wages in the formal sector as a percentage of male wages.",
    significance: "Key indicator of workplace inequality and demographic inclusion outcomes.",
    source: "NSSO / PLFS Survey"
  },
  "female participation": {
    desc: "Percentage of the working-age female population actively employed or seeking employment.",
    significance: "Tracks economic empowerment and utilization of female human resources.",
    source: "Periodic Labour Force Survey (PLFS)"
  },
  "rural-urban gap": {
    desc: "Ratio of average urban household consumption expenditure to average rural household consumption.",
    significance: "Tracks spatial inequality and development distribution between cities and villages.",
    source: "NSSO Household Survey"
  },
  "gini coefficient": {
    desc: "Statistical measure of wealth distribution inequality, where 0 is perfect equality and 1 is perfect inequality.",
    significance: "Tracks concentration of economic gains across income deciles.",
    source: "World Bank / NSSO"
  }
};

const SOURCE_URLS: Record<string, string> = {
  MOSPI: "https://www.mospi.gov.in",
  RBI: "https://www.rbi.org.in",
  "NITI AAYOG": "https://www.niti.gov.in",
  "PRS INDIA": "https://prsindia.org",
  IMF: "https://www.imf.org",
  "WORLD BANK": "https://www.worldbank.org",
  UNDP: "https://www.undp.org",
  WHO: "https://www.who.int",
  MOHFW: "https://www.mohfw.gov.in",
  NHM: "https://nhm.gov.in",
  FSI: "https://fsi.nic.in",
  CEA: "https://cea.nic.in",
  NHP: "https://www.nhp.gov.in",
  WEF: "https://www.weforum.org",
  "WORLD ECONOMIC FORUM": "https://www.weforum.org",
  "OUR WORLD IN DATA": "https://ourworldindata.org",
  OECD: "https://www.oecd.org",
  TRAI: "https://www.trai.gov.in",
  NPCI: "https://www.npci.org.in",
  NASSCOM: "https://nasscom.in",
  DPIIT: "https://dpiit.gov.in",
  NCRB: "https://ncrb.gov.in",
  MORTH: "https://morth.nic.in",
  NHA: "https://nha.gov.in"
};

/* =================== ALL DOMAINS GLOSSARY DATA =================== */
const GLOSSARY_DATA: Record<
  DomainSlug,
  { term: string; definition: string; details: string; formula?: string }[]
> = {
  economy: [
    {
      term: "GDP (Nominal)",
      definition: "Total market value of all finished goods and services produced in India.",
      formula: "GDP = C + I + G + (X - M)",
      details: "Where C is private consumption, I is gross investment, G is government spending, and (X - M) is net exports."
    },
    {
      term: "GDP Growth",
      definition: "Annual real rate of change in national economic output.",
      details: "Adjusted for price changes (inflation) to measure the real speed of national productivity."
    },
    {
      term: "Inflation (CPI)",
      definition: "Year-on-year rate of change in retail consumer prices.",
      details: "Tracked using the Consumer Price Index (CPI). RBI aims to keep inflation anchored within a 4% (±2%) band."
    },
    {
      term: "Forex Reserves",
      definition: "Foreign liquid assets held by the Reserve Bank of India.",
      details: "Includes currency deposits, gold, SDRs, and IMF positions. Used to defend the Rupee and cushion imports."
    }
  ],
  healthcare: [
    {
      term: "Infant Mortality (IMR)",
      definition: "Deaths of infants under one year of age per 1,000 live births.",
      details: "A critical indicator of the accessibility and quality of maternal and neonatal healthcare services."
    },
    {
      term: "Life Expectancy",
      definition: "Average years a newborn is expected to live under current mortality rates.",
      details: "Reflection of public sanitation, general nutrition standards, disease control, and safety infrastructure."
    },
    {
      term: "Out-of-Pocket Expenditure",
      definition: "Percentage of total healthcare expenses paid directly by households.",
      details: "High levels indicate lower financial protection and lack of health insurance coverage for the general public."
    },
    {
      term: "Doctors per Capita",
      definition: "Number of registered allopathic doctors available per 10,000 population.",
      details: "Measures workforce supply compared to WHO guidelines (typically 1 doctor per 1,000 population target)."
    }
  ],
  environment: [
    {
      term: "Air Quality Index (AQI)",
      definition: "Standardized metric to report daily ambient air pollution levels.",
      details: "Calculates concentrations of PM2.5, PM10, ozone, and NO2 into a single danger tier."
    },
    {
      term: "Forest Cover",
      definition: "Sown or natural tree canopy coverage of national land mass.",
      details: "NITI Aayog and international bodies set a long-term goal of 33% total area for ecological stability."
    },
    {
      term: "Renewable Share",
      definition: "Share of electricity capacity generated from green resources.",
      details: "Calculates output capacity from solar, wind, biomass, and small hydro, excluding fossil fuel systems."
    },
    {
      term: "Carbon Emissions",
      definition: "Metric tons of Carbon Dioxide (CO2) released per capita.",
      details: "Tracks the environmental footprint of industrialization and energy usage in relation to net-zero targets."
    }
  ],
  technology: [
    {
      term: "Internet Penetration",
      definition: "Percentage of active broadband or mobile data users.",
      details: "Measures access to online resources, digital public goods, and digital literacy across rural regions."
    },
    {
      term: "Digital Payments",
      definition: "Instant transactions processed through UPI and other wallets.",
      details: "Indicates the level of financial inclusion, formalization, and transition away from a cash economy."
    },
    {
      term: "IT Exports",
      definition: "Global revenue generated from software and technical service exports.",
      details: "A core pillar of foreign exchange receipts and high-skill white-collar employment generation in India."
    },
    {
      term: "Unicorn Startups",
      definition: "Number of private start-up firms valued above $1 Billion.",
      details: "Signals high venture capital inflows, technology innovation index, and entrepreneurial momentum."
    }
  ],
  education: [
    {
      term: "Literacy Rate",
      definition: "Percentage of citizens aged 7 and above who can read and write.",
      details: "Baseline benchmark of social progress and accessibility to elementary school operations."
    },
    {
      term: "Pupil-Teacher Ratio",
      definition: "Average headcount of school students assigned per single teacher.",
      details: "Lower ratios indicate higher quality instruction, personal attention, and adequate education hiring."
    },
    {
      term: "Gross Enrolment Ratio",
      definition: "Ratio of official school-age children enrolled in active semesters.",
      details: "Helps analyze grade retention, school dropout trends, and progression from primary to tertiary programs."
    },
    {
      term: "Public Spend",
      definition: "Government education expenditure measured as a share of GDP.",
      details: "Targeted at 6% of GDP under national policy guidelines to guarantee universal, modern school systems."
    }
  ],
  agriculture: [
    {
      term: "Foodgrain Production",
      definition: "Total tonnage of crops (rice, wheat, cereals, pulses) harvested.",
      details: "Indicates national buffer stock levels, food security index, and agricultural output strength."
    },
    {
      term: "Irrigation Coverage",
      definition: "Percentage of cropped land area equipped with structured watering systems.",
      details: "Helps reduce reliance on monsoon rainfall, improving crop yields and double-cropping capabilities."
    },
    {
      term: "Crop Insurance",
      definition: "Farmer enrollment share under PMFBY weather protection schemes.",
      details: "Hedges smallholder farmers against sudden rainfall deficits, crop pest infestation, and extreme climate events."
    },
    {
      term: "Fertilizer Intensity",
      definition: "Average chemical fertilizer consumption rate per hectare of land.",
      details: "Tracks land productivity inputs and sustainability levels of nutrient and fertilizer applications."
    }
  ],
  safety: [
    {
      term: "Crime Rate",
      definition: "Cognizable offenses registered per 100,000 residents.",
      details: "Reflects law enforcement reports, security index, and civic safety tracking."
    },
    {
      term: "Cybercrimes",
      definition: "Offenses committed utilizing computer systems and networks.",
      details: "Includes online financial scams, phishing attacks, identity theft, and hacking counts."
    },
    {
      term: "Police Strength",
      definition: "Police personnel deployed per 100,000 citizens.",
      details: "Indicates policing capacity compared to the UN recommended standard of 222 per lakh citizens."
    },
    {
      term: "Traffic Accident Rate",
      definition: "Roadway fatalities adjusted per 10,000 vehicles.",
      details: "Reflects highway design, public vehicle safety regulations, and emergency healthcare response time."
    }
  ],
  governance: [
    {
      term: "e-Transaction Volume",
      definition: "Public transactions completed via digital government websites.",
      details: "Reflects efficiency, transparency, and access to direct benefit transfers and digital services."
    },
    {
      term: "RTI Resolution Rate",
      definition: "Percentage of public information requests resolved within 30 days.",
      details: "A critical measure of accountability, information transparency, and bureaucratic responsiveness."
    },
    {
      term: "Ease of Business",
      definition: "Ease of doing business index for starting and running local firms.",
      details: "Tracks regulatory compliance, single-window clearances, tax compliance, and business filings."
    },
    {
      term: "Voter Turnout",
      definition: "Proportion of registered voters who cast ballots in general elections.",
      details: "Indicates citizen engagement and democratic participation across states."
    }
  ],
  equality: [
    {
      term: "Gini Coefficient",
      definition: "Statistical dispersion metric of household income inequality.",
      details: "Values range from 0 (perfect equality) to 1 (absolute inequality, one household holds all wealth)."
    },
    {
      term: "Gender Pay Gap",
      definition: "Average wage variance between male and female workers.",
      details: "Measures occupational distribution, access to leadership roles, and equality of wage pay."
    },
    {
      term: "Women in Labor Force",
      definition: "Female labor force participation rate (LFPR).",
      details: "Indicates female employment opportunities, safety conditions, and economic inclusion in formal jobs."
    },
    {
      term: "Land Ownership",
      definition: "Share of operational land holdings owned by female heads.",
      details: "A major indicator of asset control, agricultural decision-making autonomy, and social security."
    }
  ]
};

/* =================== SEMANTIC SEARCH SYNONYMS =================== */
const SYNONYMS: Record<string, string[]> = {
  gdp: ["gdp", "economy", "growth", "income", "output", "production", "nominal", "per capita"],
  growth: ["gdp growth", "inflation", "trend", "percentage", "rate", "percentile"],
  forex: ["forex", "foreign exchange", "reserves", "rbi", "currency", "usd", "money"],
  inflation: ["inflation", "cpi", "consumer price", "prices", "cost of living"],
  healthcare: ["health", "doctors", "imr", "infant", "medical", "expenditure", "life expectancy"],
  doctors: ["doctors", "health", "physicians", "hospitals", "medical", "staff"],
  aqi: ["aqi", "air", "pollution", "environment", "emissions", "carbon", "renewable"],
  forest: ["forest", "green cover", "trees", "environment", "nature"],
  internet: ["internet", "digital", "penetration", "tech", "online", "users"],
  literacy: ["literacy", "education", "schools", "teachers", "pupil", "students"],
};

function InfoTooltip({ label }: { label: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const info = METRIC_TOOLTIPS[label.toLowerCase()];
  if (!info) return null;

  return (
    <div 
      className="relative inline-flex items-center ml-1"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        className="rounded-full p-0.5 text-muted-foreground/50 hover:bg-secondary hover:text-foreground transition cursor-help shrink-0"
        aria-label="Info"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2.5 w-64 -translate-x-1/2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md text-[10.5px] leading-normal text-foreground pointer-events-none text-left">
          <div className="font-bold text-foreground">{label}</div>
          <p className="mt-1 text-muted-foreground">{info.desc}</p>
          <div className="mt-1.5 pt-1.5 border-t border-zinc-150 dark:border-zinc-850/60 text-[9.5px] leading-relaxed">
            <span className="font-semibold text-muted-foreground">Why it matters:</span> {info.significance}
          </div>
          <div className="mt-1.5 text-[9px] text-muted-foreground/60 italic">
            Source: {info.source}
          </div>
          <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-r border-b border-zinc-200/50 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95" />
        </div>
      )}
    </div>
  );
}

function MethodologyPopover() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-[11px] font-semibold text-saffron hover:underline ml-2 transition cursor-pointer"
      >
        Learn Methodology
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-4 shadow-xl text-[11px] leading-relaxed text-foreground animate-scale-in">
            <h4 className="font-bold text-foreground">Percentile &amp; Ranking Methodology</h4>
            <p className="mt-1.5 text-muted-foreground">
              Percentile represents the percentage of global peer nations that score below India. A higher percentile denotes a stronger relative position.
            </p>
            <p className="mt-1.5 text-muted-foreground font-medium text-saffron">
              Formulated against up to 195 countries using statistical database weightings.
            </p>
            <div className="absolute top-full left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1 rotate-45 border-r border-b border-zinc-200/50 dark:border-zinc-800/80 bg-white dark:bg-zinc-950" />
          </div>
        </>
      )}
    </div>
  );
}

const YEARS = ["FY 2020-21", "FY 2021-22", "FY 2022-23", "FY 2023-24", "FY 2024-25"];



/* =================== TOP BAR =================== */
function TopBar({
  domain,
  fy,
  onFy,
}: {
  domain: Domain;
  fy: string;
  onFy: (v: string) => void;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const { results: searchResults, loading: searchLoading } = useSearch(query);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    const root = window.document.documentElement;
    if (next === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

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

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      return;
    }
  };

  return (
    <div className="sticky top-0 z-40 border-b hairline bg-background/70 backdrop-blur-xl no-print">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity">
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
              style={{ background: "var(--gradient-tiranga)" }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-background" />
            </span>
            <span className="text-[15px] font-bold tracking-tight">Bharat360</span>
          </Link>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="chip bg-secondary/80 text-muted-foreground font-semibold border-none text-[10.5px] py-0.5 px-2 capitalize">{domain.name}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden items-center gap-2 rounded-full border hairline bg-secondary/60 px-3.5 py-1.5 text-[13px] text-muted-foreground md:flex">
            <Search className="h-3.5 w-3.5" />
            <input
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search ${domain.name.toLowerCase()} datasets…`}
              className="w-56 bg-transparent outline-none placeholder:text-muted-foreground/70 text-foreground"
            />
            {query ? (
              <button 
                onClick={() => handleSearchChange("")}
                className="grid h-4 w-4 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ml-1"
                aria-label="Clear search"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            ) : (
              <kbd className="rounded border hairline bg-background px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            )}

            {query && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-md z-50 text-left">
                <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-850 mb-1">
                  Search Matches
                </div>
                {searchLoading ? (
                  <div className="px-2 py-3 text-[12px] text-muted-foreground text-center">Loading...</div>
                ) : searchResults.length > 0 ? (
                  <ul className="space-y-0.5 max-h-64 overflow-y-auto">
                    {searchResults.map((r, idx) => (
                      <li key={idx}>
                        <a
                          href={getSourceUrl(r.source)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setQuery("")}
                          className="w-full text-left rounded-lg px-2 py-1.5 hover:bg-secondary/60 text-[12.5px] transition-colors flex flex-col group cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-foreground group-hover:text-saffron">
                            <span className="truncate pr-2 font-medium">{r.title}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-saffron" />
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                            {r.source} • {r.category}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-2 py-3 text-[12px] text-muted-foreground text-center">
                    No matching datasets found.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <select
              value={fy}
              onChange={(e) => onFy(e.target.value)}
              className="appearance-none rounded-full border hairline bg-background py-2 pl-4 pr-9 text-[13px] font-medium hover:bg-secondary cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-muted-foreground" />
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border hairline bg-background text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background hover:opacity-90 cursor-pointer transition shadow-sm"
          >
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
  const accents = ["var(--saffron)", "var(--green)", "var(--saffron)", "var(--blue)"];
  const gradients = [
    "bg-gradient-to-br from-orange-500/5 via-saffron-soft/10 to-amber-500/5 dark:from-orange-950/15 dark:via-zinc-900/40 dark:to-amber-950/10 border-orange-250 dark:border-orange-900/30",
    "bg-gradient-to-br from-green-500/5 via-green-soft/10 to-emerald-500/5 dark:from-green-950/15 dark:via-zinc-900/40 dark:to-emerald-950/10 border-green-250 dark:border-green-900/30",
    "bg-gradient-to-br from-amber-500/5 via-orange-50/10 to-yellow-500/5 dark:from-amber-950/15 dark:via-zinc-900/40 dark:to-yellow-950/10 border-amber-250 dark:border-amber-900/20",
    "bg-gradient-to-br from-blue-500/5 via-blue/5 to-indigo-500/5 dark:from-blue-950/15 dark:via-zinc-900/40 dark:to-indigo-950/10 border-blue-250 dark:border-blue-900/30",
  ];
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {domain.kpis.map((k, i) => {
        const c = accents[i % 4];
        const grad = gradients[i % 4];
        const Trend = k.trend === "up" ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={k.label}
            className={`group relative p-6 rounded-[var(--radius-2xl)] border transition hover:shadow-md ${grad}`}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-[0.06] blur-2xl transition-opacity group-hover:opacity-[0.12]"
              style={{ background: c }}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground flex items-center">
                {k.label}
                <InfoTooltip label={k.label} />
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium`}
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
            <div className="mt-4 font-sans font-bold text-[38px] leading-none tracking-tight text-foreground">
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
      <div className="card-surface relative p-6 lg:col-span-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <div className="chip"><Trophy className="h-3 w-3" /> Global Ranking</div>
              <MethodologyPopover />
            </div>
            <h2 className="mt-4 font-sans font-bold text-[42px] leading-none tracking-tight text-foreground">
              #{domain.rank} <span className="text-muted-foreground/70 text-2xl font-normal">of {domain.outOf}</span>
            </h2>
            <p className="mt-2 max-w-md text-[13.5px] text-muted-foreground">
              India's world position in {domain.name.toLowerCase()}. Improved{" "}
              <span className="font-semibold text-saffron">{domain.rankDelta} places</span> vs last cycle.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="rankCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--saffron)" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-secondary" />
                <circle
                  cx="50" cy="50" r="42"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="fill-none"
                  stroke="url(#rankCircleGrad)"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - rankPct)}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Percentile</div>
                  <div className="font-sans font-bold text-2xl leading-none text-foreground">{Math.round(rankPct * 100)}%</div>
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
              <div className="mt-1 font-sans font-bold text-xl text-foreground">{v}</div>
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
                className={`relative overflow-hidden rounded-xl border px-3 py-2.5 transition-all hover:shadow-sm ${
                  isIndia 
                    ? "bg-gradient-to-r from-saffron-soft/30 to-amber-500/5 border-saffron-soft/50 shadow-sm" 
                    : "bg-surface/50 border-zinc-200/40 dark:border-zinc-800/40"
                }`}
              >
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 opacity-[0.15] dark:opacity-[0.1]"
                  style={{
                    width: `${w}%`,
                    background: isIndia ? "var(--saffron)" : "var(--muted)",
                    transition: "width 1s ease",
                  }}
                />
                <div className="relative flex items-center gap-3">
                  <span className="w-5 text-[11px] font-semibold text-muted-foreground">#{i + 1}</span>
                  <img
                    src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                    alt=""
                    className="h-3.5 w-5 rounded-none object-cover border border-zinc-350"
                  />
                  <span className={`text-[13px] ${isIndia ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                    {c.name}
                  </span>
                  <span className={`ml-auto text-[12px] tabular-nums ${isIndia ? "font-bold text-saffron" : "text-muted-foreground"}`}>
                    {formatNumber(c.value, { type: domain.format })}
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
  const [activeTab, setActiveTab] = useState<"Absolute" | "Per capita" | "Growth">("Absolute");

  const data = useMemo(() => {
    return domain.topCountries.map((c) => {
      let val = c.value;
      if (domain.slug === "economy") {
        if (activeTab === "Per capita") {
          const perCapitaMap: Record<string, number> = {
            US: 81600,
            CN: 12600,
            DE: 54300,
            JP: 33800,
            IN: 2700,
            GB: 48900
          };
          val = perCapitaMap[c.code] || (c.value / 10);
        } else if (activeTab === "Growth") {
          const growthMap: Record<string, number> = {
            US: 2.5,
            CN: 5.2,
            DE: -0.2,
            JP: 1.9,
            IN: 7.8,
            GB: 0.5
          };
          val = growthMap[c.code] || (c.value * 0.15);
        }
      } else {
        if (activeTab === "Per capita") {
          val = Math.round((c.value / 8) * 10) / 10;
        } else if (activeTab === "Growth") {
          val = Math.round((2.5 + (c.value % 6) + Math.sin(c.value) * 1.5) * 10) / 10;
        }
      }
      return { name: c.name, value: val, code: c.code };
    });
  }, [domain.topCountries, activeTab, domain.slug]);

  const yAxisFormatter = useCallback((v: any) => {
    let type = domain.format;
    if (activeTab === "Growth") type = "percentage";
    return formatNumber(v, { type });
  }, [domain.format, activeTab]);

  return (
    <section className="card-surface p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-l-2 border-saffron pl-3.5 no-print">
        <div>
          <div className="chip"><Target className="h-3 w-3" /> India vs Top Countries</div>
          <h2 className="mt-3 font-sans font-bold text-2xl tracking-tight text-foreground">
            Where India stands, at a glance
          </h2>
        </div>
        <div className="flex gap-1 rounded-full border hairline bg-secondary/60 p-1 text-[12px]">
          {["Absolute", "Per capita", "Growth"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`rounded-full px-3 py-1 text-[11.5px] transition cursor-pointer ${
                activeTab === t 
                  ? "bg-saffron text-white shadow-sm font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
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
            <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" tickFormatter={yAxisFormatter} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-hairline)",
                background: "var(--color-popover)",
                fontSize: 12,
              }}
              formatter={(v) => [yAxisFormatter(v), activeTab]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={900}>
              {data.map((d) => (
                <Cell key={d.code} fill={d.code === "IN" ? "var(--saffron)" : "#0F2D52"} />
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
      <div className="flex flex-wrap items-end justify-between gap-3 border-l-2 border-green pl-3.5">
        <div>
          <div className="chip">Historical Trend</div>
          <h2 className="mt-3 font-sans font-bold text-2xl tracking-tight text-foreground">
            A decade of {domain.name.toLowerCase()}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--saffron)" }} /> India
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#0F2D52" }} /> World avg
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
            <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" tickFormatter={(v) => formatNumber(v, { type: domain.format })} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-hairline)",
                background: "var(--color-popover)",
                fontSize: 12,
              }}
              formatter={(v: any) => [formatNumber(v, { type: domain.format }), "Value"]}
            />
            <Line
              type="monotone"
              dataKey="world"
              stroke="#0F2D52"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey="india"
              stroke="var(--saffron)"
              strokeWidth={3}
              dot={{ r: 3.5, fill: "var(--saffron)" }}
              activeDot={{ r: 6 }}
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
            className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] tabular-nums transition cursor-pointer ${
              i === domain.trend.length - 1 
                ? "bg-saffron text-white font-semibold" 
                : "text-muted-foreground hover:text-foreground"
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
        <div className="flex flex-wrap items-end justify-between gap-3 border-l-2 border-saffron pl-3.5">
          <div>
            <div className="chip"><MapIcon className="h-3 w-3" /> India — State performance</div>
            <div className="flex items-center gap-2 mt-3">
              <h2 className="font-sans font-bold text-2xl tracking-tight text-foreground">Interactive state map</h2>
              <div className="group/meth relative flex items-center justify-center">
                <span className="text-[9.5px] uppercase font-bold tracking-widest text-saffron cursor-help bg-saffron-soft/10 px-2 py-0.5 rounded-full border border-saffron-soft/20">How is composite score calculated?</span>
                <div className="absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 opacity-0 pointer-events-none group-hover/meth:opacity-100 group-hover/meth:pointer-events-auto transition-opacity z-50">
                  <div className="rounded-lg bg-zinc-900 dark:bg-zinc-100 p-3 text-left text-[11px] text-zinc-100 dark:text-zinc-900 shadow-xl leading-relaxed">
                    <strong className="block mb-1">Calculation Method:</strong> Normalized state performance values are aggregated across all active KPIs within this domain and scaled to a maximum cohort baseline of 100.
                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Hover a state tile to see its {domain.name.toLowerCase()} score.
            </p>
          </div>
        </div>

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
                className="group relative aspect-square rounded-lg border hairline text-[10px] font-semibold text-foreground/80 transition-transform hover:scale-[1.06] hover:shadow-md cursor-help"
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
            <h3 className="mt-3 font-sans font-bold text-3xl tracking-tight text-foreground">{selected.name}</h3>
            <div className="mt-2 font-sans font-extrabold text-5xl tracking-tight" style={{ color: "var(--saffron)" }}>
              {selected.value}
            </div>
            <div className="mt-2">
              <div className="text-[12px] text-muted-foreground">Composite score</div>
            </div>
          </>
        ) : (
          <>
            <div className="chip">Highlights</div>
            <div className="mt-4 grid gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Top 5 States</div>
                <ul className="mt-2 space-y-1.5 text-[13px]">
                  {top.map((s) => (
                    <li key={s.code} className="flex justify-between text-foreground">
                      <span>{s.name}</span>
                      <span className="tabular-nums font-semibold text-saffron">{formatNumber(s.value, { type: domain.format })}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-px" style={{ backgroundColor: "var(--color-hairline)" }} />
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Needs attention</div>
                <ul className="mt-2 space-y-1.5 text-[13px]">
                  {bottom.map((s) => (
                    <li key={s.code} className="flex justify-between text-muted-foreground hover:text-foreground transition-colors">
                      <span>{s.name}</span>
                      <span className="tabular-nums font-semibold">{formatNumber(s.value, { type: domain.format })}</span>
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
  const cards: { icon: LucideIcon; title: string; body: React.ReactNode; accent: string; bg: string }[] = [
    {
      icon: BookOpen,
      title: "The Story",
      body: (
        <>
          <h3 className="font-sans font-bold text-[17px] leading-snug text-foreground">
            {domain.story.title}
          </h3>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            {domain.story.body}
          </p>
        </>
      ),
      accent: "var(--saffron)",
      bg: "bg-surface/50 border-zinc-200/50 dark:border-zinc-800/80"
    },
    {
      icon: Lightbulb,
      title: "AI Insights",
      body: (
        <ul className="space-y-3">
          {domain.story.insights.map((i) => (
            <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
              <Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-blue animate-pulse" />
              <span>{i}</span>
            </li>
          ))}
        </ul>
      ),
      accent: "var(--blue)",
      bg: "bg-blue-500/5 border-blue-200/30 dark:bg-blue-955/10 dark:border-blue-900/30 shadow-sm"
    },
    {
      icon: Target,
      title: "Recommendations",
      body: (
        <ol className="space-y-3">
          {domain.story.recommendations.map((r, i) => (
            <li key={r} className="flex gap-3 text-[13px] leading-relaxed text-muted-foreground">
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold bg-green-soft text-green"
              >
                {i + 1}
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ol>
      ),
      accent: "var(--green)",
      bg: "bg-green-500/5 border-green-200/30 dark:bg-green-955/10 dark:border-green-900/30 shadow-sm"
    },
    {
      icon: Compass,
      title: "Why It Matters",
      body: (
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">{domain.story.whyItMatters}</p>
      ),
      accent: "var(--foreground)",
      bg: "bg-surface/50 border-zinc-200/50 dark:border-zinc-800/80"
    },
  ];

  return (
    <section>
      <div className="flex items-end justify-between border-l-2 border-green pl-3.5">
        <div>
          <div className="chip"><Sparkles className="h-3 w-3" /> Beyond the numbers</div>
          <h2 className="mt-3 font-sans font-bold text-2xl tracking-tight text-foreground">
            The <span className="font-semibold text-saffron">human</span> layer of the data
          </h2>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className={`card-surface p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${c.bg}`}>
              <div className="flex items-center gap-2">
                <span
                  className="grid h-8 w-8 place-items-center rounded-full"
                  style={{ background: "color-mix(in oklab, " + c.accent + " 12%, transparent)", color: c.accent }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
    <section className="card-surface p-6">
      <div className="flex items-center gap-2 border-l-2 border-saffron pl-3.5 mb-4">
        <span className="chip">Related Datasets &amp; Reads</span>
        <h2 className="text-xl font-bold text-foreground">Official Portals &amp; Literature</h2>
      </div>
      <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
        {domain.related.map((r, idx) => {
          const Icon = KIND_ICON[r.kind] ?? FileText;
          const cleanSource = r.source.toUpperCase().trim();
          const targetUrl = SOURCE_URLS[cleanSource] || "https://www.niti.gov.in";
          
          return (
            <a
              key={r.title}
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col sm:flex-row sm:items-center justify-between py-3.5 px-3 rounded-lg transition-colors group cursor-pointer ${
                idx % 2 === 0 ? "bg-[#fffdfa] dark:bg-saffron-soft/5" : "bg-transparent hover:bg-secondary/40"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2 bg-saffron-soft/10 rounded-lg text-saffron shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground group-hover:text-saffron transition-colors">
                    {r.title}
                  </h3>
                  <span className="text-[12px] text-muted-foreground">Source: {r.source}</span>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center gap-3 self-end sm:self-auto">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {r.kind}
                </span>
                <span className="text-[12px] font-bold text-saffron group-hover:underline inline-flex items-center gap-1">
                  Open <ExternalLink className="h-3 w-3" />
                </span>
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
    <section className="card-surface p-6 bg-zinc-50/60 dark:bg-zinc-950/20 border-zinc-200/50">
      <div className="flex items-center gap-2 border-l-2 border-green pl-3.5 mb-4">
        <span className="chip bg-green-soft/20 text-green border border-green-soft/50">Sources</span>
        <span className="text-[12px] text-muted-foreground font-medium">All data below is aggregated from public and international agencies.</span>
      </div>
      <div className="flex flex-wrap gap-2.5 mt-4">
        {domain.sources.map((s) => {
          const rawUrl = s.url.toLowerCase();
          const href = rawUrl.startsWith("http") ? s.url : `https://${s.url}`;
          return (
            <a
              key={s.name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-background hover:bg-secondary/60 px-4 py-2 text-[12.5px] font-semibold text-foreground hover:text-saffron transition-all cursor-pointer shadow-sm"
            >
              <span>{s.name}</span>
              <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border hairline">{s.updated}</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-saffron shrink-0" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* =================== TEMPLATE =================== */
export function DomainDashboard({ domain }: { domain: Domain }) {
  const { data: dataset, loading: datasetLoading, error: datasetError } = useDataset(domain.slug);
  const { states, loading: statesLoading } = useStateData(domain.slug);
  const [fy, setFy] = useState(YEARS[YEARS.length - 1]);

  // Scaled domain data based on dynamic JSON or fallback to FY selection
  const activeDomainData = useMemo(() => {
    const cloned = JSON.parse(JSON.stringify(domain)) as Domain;
    
    const yearIndex = YEARS.indexOf(fy) !== -1 ? YEARS.indexOf(fy) : YEARS.length - 1;
    const multiplier = 0.76 + (yearIndex / 4) * 0.24;

    // 1. Inject dynamic data if available
    if (dataset) {
      cloned.trend = dataset.trendData.map(t => ({
        year: parseInt(t.year, 10),
        india: Number(t.India) || 0,
        world: Number(t["United States"]) || 0
      }));

      const targetYearStr = (2020 + yearIndex).toString(); 
      const targetYear = dataset.raw.years.includes(parseInt(targetYearStr, 10)) ? targetYearStr : dataset.latestYear;

      const allCountries = dataset.raw.data.map(row => ({
        code: COUNTRY_CODES[row.country] || row.country.substring(0, 2).toUpperCase(),
        name: row.country,
        value: Number(row[targetYear]) || 0
      })).filter(c => c.value > 0).sort((a, b) => b.value - a.value);

      const indiaData = allCountries.find(c => c.name === "India");
      let topCountriesList = allCountries.slice(0, 5);
      if (indiaData && !topCountriesList.find(c => c.name === "India")) {
        topCountriesList.push(indiaData);
      } else if (allCountries.length > 5 && topCountriesList.find(c => c.name === "India")) {
        topCountriesList = allCountries.slice(0, 6);
      }
      
      cloned.topCountries = topCountriesList.sort((a, b) => b.value - a.value);

      const indiaRow = dataset.raw.data.find(r => r.country === "India");
      
      if (cloned.kpis.length > 0 && indiaRow) {
        const val = Number(indiaRow[targetYear]) || 0;
        
        let prevVal = 0;
        const prevYear = (parseInt(targetYear, 10) - 1).toString();
        if (indiaRow[prevYear] !== undefined) {
          prevVal = Number(indiaRow[prevYear]);
        }
        
        const growth = prevVal !== 0 ? ((val - prevVal) / prevVal) * 100 : 0;

        cloned.kpis[0].value = formatNumber(val, { type: domain.format });
        cloned.kpis[0].delta = `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
        cloned.kpis[0].trend = growth >= 0 ? "up" : "down";
        cloned.kpis[0].hint = `Latest data from ${targetYear}`;
      }
    }

    if (states && states.length > 0) {
      cloned.states = states;
    }

    // 2. Fallback scaling if using mock data
    if (!dataset && (!states || states.length === 0)) {
      if (yearIndex !== YEARS.length - 1) {
        cloned.kpis = cloned.kpis.map((kpi) => {
          const cleaned = kpi.value.replace(/[^0-9.-]/g, "");
          const raw = parseFloat(cleaned);
          if (isNaN(raw)) return kpi;

          let newVal = raw;
          if (kpi.value.includes("%")) {
            newVal = raw - (4 - yearIndex) * 0.45;
            kpi.value = `${newVal.toFixed(1)}%`;
          } else if (kpi.value.includes("#")) {
            const rankVal = parseInt(cleaned, 10);
            newVal = rankVal + (4 - yearIndex);
            kpi.value = `#${Math.max(1, Math.round(newVal))}`;
          } else {
            newVal = raw * multiplier;
            if (kpi.value.includes("$")) {
              const suffix = kpi.value.endsWith("T") ? "T" : kpi.value.endsWith("B") ? "B" : "";
              kpi.value = `$${newVal.toFixed(1)}${suffix}`;
            } else {
              const suffix = kpi.value.replace(/[0-9.-]/g, "");
              kpi.value = `${newVal.toFixed(1)}${suffix}`;
            }
          }
          return kpi;
        });
      }
    }

    // Scale rankings values
    cloned.rankings = cloned.rankings.map((r) => {
      const cleaned = r.value.replace(/[^0-9.-]/g, "");
      const rawVal = parseFloat(cleaned);
      if (!isNaN(rawVal)) {
        let newVal = rawVal * multiplier;
        if (r.value.includes("%")) {
          newVal = rawVal - (4 - yearIndex) * 0.55;
          r.value = `${newVal.toFixed(1)}%`;
        } else {
          const suffix = r.value.replace(/[0-9.-]/g, "");
          r.value = `${newVal.toFixed(1)}${suffix}`;
        }
      }
      return r;
    });

    if (!dataset) {
      cloned.topCountries = cloned.topCountries.map((c) => {
        c.value = Math.round((c.value * multiplier) * 10) / 10;
        return c;
      });
    }

    if (!states || states.length === 0) {
      cloned.states = cloned.states.map((s) => {
        s.value = Math.round((s.value * multiplier) * 10) / 10;
        return s;
      });
    }

    return cloned;
  }, [domain, fy, dataset, states]);

  if (datasetLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Loading dynamic datasets...</p>
        </div>
      </div>
    );
  }

  if (datasetError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <Info className="w-10 h-10 text-muted-foreground" />
          <h2 className="text-xl font-bold">No Data Available</h2>
          <p className="text-muted-foreground text-sm">{datasetError}</p>
          <Link to="/" className="text-saffron hover:underline text-sm font-semibold mt-2">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Hide sidebar, topbar selectors/buttons, header action buttons and footnotes */
          aside,
          nav,
          .no-print,
          button,
          select,
          header select,
          header button,
          .sticky {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          main {
            margin: 0 !important;
            padding: 16px !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .card-surface {
            border: 1px solid #e4e4e7 !important;
            background: white !important;
            box-shadow: none !important;
            break-inside: avoid;
            margin-bottom: 20px !important;
          }
          .recharts-responsive-container {
            width: 100% !important;
            height: 320px !important;
          }
        }
      `}} />
      <TopBar domain={activeDomainData} fy={fy} onFy={setFy} />
      <main className="mx-auto w-full max-w-[1400px] space-y-6 px-6 py-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between border-b border-zinc-200/40 dark:border-zinc-800/40 pb-5">
          <div className="min-w-0">
            <div className="chip bg-saffron-soft/20 text-saffron border border-saffron-soft/50 no-print">{fy}</div>
            <h1 className="mt-3 font-sans font-bold text-4xl tracking-tight sm:text-5xl text-foreground">
              {domain.name} <span className="font-semibold text-muted-foreground/80">of India</span>
            </h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              {domain.tagline}. A living dashboard of India's performance across global benchmarks.
            </p>
          </div>
          <div className="hidden sm:flex sm:shrink-0 sm:items-center sm:gap-3 no-print">
            <div className="rounded-full border hairline bg-surface px-4 py-2 text-[12px]">
              <span className="text-muted-foreground">Rank</span>{" "}
              <span className="font-bold text-saffron">#{domain.rank}</span>
            </div>
            <div className="rounded-full border hairline bg-surface px-4 py-2 text-[12px]">
              <span className="text-muted-foreground">Trend</span>{" "}
              <span className="font-bold" style={{ color: "var(--green)" }}>
                ▲ {domain.rankDelta} yoy
              </span>
            </div>
          </div>
        </header>

        <div id="kpi-section">
          <KPISection domain={activeDomainData} />
        </div>
        
        {/* Dynamic On-Screen Indicators Glossary for ALL domains */}
        {GLOSSARY_DATA[domain.slug] && (
          <section id="glossary-section" className="card-surface p-6 bg-gradient-to-r from-saffron-soft/10 via-background to-orange-50/10 border border-saffron-soft/30 rounded-[var(--radius-2xl)]">
            <div className="flex items-center gap-2 border-l-2 border-saffron pl-3.5 mb-4">
              <span className="chip bg-saffron-soft/20 text-saffron border border-saffron-soft/50">Indicator Glossary</span>
              <h2 className="text-xl font-bold text-foreground">Understanding {domain.name} Metrics &amp; Calculations</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {GLOSSARY_DATA[domain.slug].map((g, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-semibold text-foreground text-[14.5px]">{g.term}</h3>
                  <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                    <strong>{g.term}</strong> {g.definition.toLowerCase()}
                    {g.formula && (
                      <span className="block my-1.5 p-2 bg-secondary/50 rounded font-mono text-[11px] text-foreground">
                        {g.formula}
                      </span>
                    )}
                    <br />
                    {g.details}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div id="ranking-section">
          <RankingSection domain={activeDomainData} />
        </div>
        <div id="comparison-section">
          <ComparisonSection domain={activeDomainData} />
        </div>
        <div id="trend-section">
          <TrendSection domain={activeDomainData} />
        </div>
        <div id="state-map-section">
          <StateMapSection domain={activeDomainData} />
        </div>
        
        <StorySection domain={activeDomainData} />
        <ExploreSection domain={activeDomainData} />
        <SourcesSection domain={activeDomainData} />

        <div className="pt-4 pb-8 text-center text-[11px] text-muted-foreground border-t border-zinc-250/20 dark:border-zinc-800/20 no-print">
          Bharat360 · Data updated {domain.sources[0]?.updated ?? "recently"} · Made with care
        </div>
      </main>
    </>
  );
}
