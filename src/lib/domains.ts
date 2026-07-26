import {
  Coins,
  HeartPulse,
  Leaf,
  Cpu,
  GraduationCap,
  Wheat,
  ShieldCheck,
  Landmark,
  Scale,
  type LucideIcon,
} from "lucide-react";

export type DomainSlug =
  | "economy"
  | "healthcare"
  | "environment"
  | "technology"
  | "education"
  | "agriculture"
  | "safety"
  | "governance"
  | "equality";

export type KPI = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  hint: string;
  spark: number[];
};

export type Ranking = {
  label: string;
  value: string;
  source?: string;
  tooltip?: string;
};

export type Domain = {
  slug: DomainSlug;
  name: string;
  tagline: string;
  icon: LucideIcon;
  accent: "saffron" | "green" | "blue" | "navy";
  rank: number;
  outOf: number;
  rankDelta: number;
  format: "currency" | "percentage" | "compact";
  kpis: KPI[];
  rankings: Ranking[]; 
  trend: { year: number; india: number; world: number }[];
  topCountries: { code: string; name: string; value: number }[];
  states: { code: string; name: string; value: number }[];
  story: {
    title: string;
    body: string;
    insights: string[];
    recommendations: string[];
    whyItMatters: string;
  };
  related: { title: string; kind: string; source: string }[];
  sources: { name: string; url: string; updated: string }[];
};

const spark = (seed: number, n = 12) =>
  Array.from({ length: n }, (_, i) => 50 + Math.sin(i / 1.6 + seed) * 18 + i * 1.4);

const years = Array.from({ length: 12 }, (_, i) => 2013 + i);

const trend = (base: number, growth: number, worldOffset = -5) => [] as any;

const indiaStates = [
  ["MH", "Maharashtra"],
  ["KA", "Karnataka"],
  ["TN", "Tamil Nadu"],
  ["GJ", "Gujarat"],
  ["UP", "Uttar Pradesh"],
  ["WB", "West Bengal"],
  ["DL", "Delhi"],
  ["TG", "Telangana"],
  ["KL", "Kerala"],
  ["RJ", "Rajasthan"],
  ["PB", "Punjab"],
  ["HR", "Haryana"],
  ["AP", "Andhra Pradesh"],
  ["MP", "Madhya Pradesh"],
  ["OD", "Odisha"],
  ["BR", "Bihar"],
  ["AS", "Assam"],
  ["JH", "Jharkhand"],
] as const;

const statesFor = (seed: number) => [] as any;

export const DOMAINS: Record<DomainSlug, Domain> = {
  economy: {
    slug: "economy",
    name: "Economy",
    format: "currency",
    tagline: "GDP, trade & fiscal strength",
    icon: Coins,
    accent: "saffron",
    rank: 5,
    outOf: 195,
    rankDelta: 4,
    kpis: [
      { label: "GDP (Nominal)", value: "$3.94T", delta: "+7.2%", trend: "up", hint: "5th largest economy", spark: spark(1) },
      { label: "GDP Growth", value: "7.8%", delta: "+0.4 pp", trend: "up", hint: "Fastest major economy", spark: spark(2) },
      { label: "Inflation", value: "4.9%", delta: "-0.6 pp", trend: "down", hint: "Within RBI band", spark: spark(3) },
      { label: "Forex Reserves", value: "$652B", delta: "+$18B", trend: "up", hint: "4th globally", spark: spark(4) },
    ],

    rankings: [
  { label: "Global GDP Rank", value: "#5" },
  { label: "Ease of Doing Business", value: "#63" },
  { label: "Global Competitiveness", value: "#40" },
  { label: "Economic Freedom", value: "#84" },
],
    trend: trend(60, 2.2),
    topCountries: [
      { code: "US", name: "United States", value: 27.72 },
      { code: "CN", name: "China", value: 17.79 },
      { code: "DE", name: "Germany", value: 4.53 },
      { code: "JP", name: "Japan", value: 4.21 },
      { code: "IN", name: "India", value: 3.94 },
      { code: "GB", name: "United Kingdom", value: 3.34 },
    ],
    states: statesFor(7),
    story: {
      title: "From fragile five to fastest growing",
      body:
        "India's economy has more than doubled since 2014, driven by digital infrastructure, a young workforce, and a manufacturing push. It now anchors global growth as advanced economies slow.",
      insights: [
        "Services contribute 53% of GDP but manufacturing is the fastest growing segment.",
        "Digital payments now exceed 12B transactions per month — highest in the world.",
        "Formal workforce participation crossed 30% for the first time in FY24.",
      ],
      recommendations: [
        "Deepen bond markets to fund infrastructure without fiscal stress.",
        "Expand PLI schemes to labour-intensive sectors like leather and textiles.",
        "Simplify GST to a two-slab structure to boost compliance.",
      ],
      whyItMatters:
        "Sustained 7%+ growth is essential for India to become a developed nation by 2047 and lift 200M people into the middle class.",
    },
    related: [
      { title: "State GDP Explorer", kind: "Dataset", source: "MoSPI" },
      { title: "Union Budget 2025 Analysis", kind: "Report", source: "PRS India" },
      { title: "Manufacturing PLI Impact", kind: "Article", source: "NITI Aayog" },
      { title: "IMF World Economic Outlook", kind: "Source", source: "IMF" },
    ],
    sources: [
      { name: "World Bank — WDI", url: "worldbank.org", updated: "Oct 2025" },
      { name: "IMF WEO Database", url: "imf.org", updated: "Oct 2025" },
      { name: "RBI Statistics", url: "rbi.org.in", updated: "Nov 2025" },
    ],
  },
  healthcare: {
    slug: "healthcare",
    name: "Healthcare",
    format: "compact",
    tagline: "Life expectancy, access & outcomes",
    icon: HeartPulse,
    accent: "green",
    rank: 112,
    outOf: 195,
    rankDelta: 8,
    kpis: [
      { label: "Life Expectancy", value: "70.8 yrs", delta: "+1.4", trend: "up", hint: "vs 72.8 world avg", spark: spark(5) },
      { label: "Health Spend / GDP", value: "2.1%", delta: "+0.3 pp", trend: "up", hint: "Target: 2.5%", spark: spark(6) },
      { label: "Infant Mortality", value: "26.6", delta: "-3.2", trend: "down", hint: "per 1,000 births", spark: spark(7) },
      { label: "Ayushman Coverage", value: "550M", delta: "+72M", trend: "up", hint: "Beneficiaries", spark: spark(8) },
    ],

    rankings: [
  { label: "Healthcare Index", value: "#112" },
  { label: "Life Expectancy Rank", value: "#125" },
  { label: "Universal Health Coverage", value: "61%" },
  { label: "Infant Mortality Rank", value: "#108" },
],

    trend: trend(58, 1.1, 8),
    topCountries: [
      { code: "JP", name: "Japan", value: 84.6 },
      { code: "CH", name: "Switzerland", value: 84.0 },
      { code: "KR", name: "South Korea", value: 83.5 },
      { code: "US", name: "United States", value: 79.1 },
      { code: "CN", name: "China", value: 78.2 },
      { code: "IN", name: "India", value: 70.8 },
    ],
    states: statesFor(11),
    story: {
      title: "The world's largest health assurance experiment",
      body:
        "Ayushman Bharat now covers 550M citizens — more people than the entire population of the EU. Combined with rising life expectancy and falling infant mortality, India's health story is one of scale meeting outcomes.",
      insights: [
        "Rural PHC coverage improved 34% since 2019 through Health & Wellness Centres.",
        "Non-communicable diseases now account for 66% of deaths — a new frontier.",
        "Doctor-to-patient ratio reached 1:834, meeting WHO's minimum standard.",
      ],
      recommendations: [
        "Raise public health spend to 2.5% of GDP as per NHP 2017.",
        "Expand mental health parity in insurance products.",
        "Deploy AI-assisted diagnostics in Tier-3 towns via telehealth.",
      ],
      whyItMatters:
        "A healthy population is India's demographic dividend. Every year added to life expectancy adds ~1% to lifetime GDP contribution.",
    },
    related: [
      { title: "NFHS-6 Preliminary Results", kind: "Dataset", source: "MoHFW" },
      { title: "State Health Index", kind: "Report", source: "NITI Aayog" },
      { title: "WHO Global Health Observatory", kind: "Source", source: "WHO" },
      { title: "PMJAY Utilization Study", kind: "Article", source: "The Lancet" },
    ],
    sources: [
      { name: "WHO GHO", url: "who.int/data", updated: "Sep 2025" },
      { name: "MoHFW NHM", url: "nhm.gov.in", updated: "Nov 2025" },
    ],
  },
  environment: {
    slug: "environment",
    name: "Environment",
    format: "compact",
    tagline: "Emissions, forest cover & clean energy",
    icon: Leaf,
    accent: "green",
    rank: 128,
    outOf: 180,
    rankDelta: 3,
    kpis: [
      { label: "Renewable Capacity", value: "203 GW", delta: "+18%", trend: "up", hint: "4th globally", spark: spark(9) },
      { label: "Forest Cover", value: "24.6%", delta: "+0.3 pp", trend: "up", hint: "of land area", spark: spark(10) },
      { label: "CO₂ per capita", value: "1.9 t", delta: "+0.1", trend: "up", hint: "1/8th of US", spark: spark(11) },
      { label: "EV Sales Share", value: "7.4%", delta: "+3.1 pp", trend: "up", hint: "2W dominant", spark: spark(12) },
    ],

    rankings: [
  { label: "Environmental Performance Index", value: "#128" },
  { label: "Climate Change Performance", value: "#7" },
  { label: "Renewable Energy Rank", value: "#4" },
  { label: "Forest Cover", value: "24.6%" },
],


    trend: trend(35, 1.8),
    topCountries: [
      { code: "SE", name: "Sweden", value: 78 },
      { code: "DE", name: "Germany", value: 62 },
      { code: "BR", name: "Brazil", value: 58 },
      { code: "IN", name: "India", value: 45 },
      { code: "CN", name: "China", value: 42 },
      { code: "US", name: "United States", value: 40 },
    ],
    states: statesFor(2),
    story: {
      title: "The renewables super-power in the making",
      body:
        "India is on track to hit 500 GW of non-fossil capacity by 2030 — five years ahead of Paris commitments. The Green Hydrogen Mission and PLI for solar are reshaping the energy stack.",
      insights: [
        "Solar tariffs are the world's lowest at ₹2.18 / kWh.",
        "Air quality remains critical — 39 of the world's 50 most-polluted cities are in India.",
        "Mangrove cover expanded 17 sq km — a natural carbon sink.",
      ],
      recommendations: [
        "Accelerate battery storage deployment to 60 GWh by 2030.",
        "Introduce mandatory ESG disclosure for top-1000 listed firms.",
        "Scale afforestation via CAMPA funds with tribal community leadership.",
      ],
      whyItMatters:
        "Climate action determines whether the next generation inherits a habitable subcontinent — and shapes ₹15 lakh crore of green investment flow.",
    },
    related: [
      { title: "India State of Forest Report", kind: "Report", source: "FSI" },
      { title: "CEA Renewable Dashboard", kind: "Dataset", source: "CEA" },
      { title: "Global Carbon Atlas", kind: "Source", source: "GCP" },
    ],
    sources: [
      { name: "IEA World Energy", url: "iea.org", updated: "Oct 2025" },
      { name: "CEA Dashboard", url: "cea.nic.in", updated: "Nov 2025" },
    ],
  },
  technology: {
    slug: "technology",
    name: "Technology",
    format: "compact",
    tagline: "Digital infra, R&D & innovation",
    icon: Cpu,
    accent: "blue",
    rank: 39,
    outOf: 132,
    rankDelta: 2,
    kpis: [
      { label: "UPI Transactions", value: "16.6B/mo", delta: "+42%", trend: "up", hint: "World's largest", spark: spark(13) },
      { label: "Internet Users", value: "881M", delta: "+58M", trend: "up", hint: "2nd globally", spark: spark(14) },
      { label: "Unicorns", value: "118", delta: "+6", trend: "up", hint: "3rd globally", spark: spark(15) },
      { label: "R&D / GDP", value: "0.7%", delta: "+0.05", trend: "up", hint: "Target: 2%", spark: spark(16) },
    ],
    rankings: [
  { label: "Global Innovation Index", value: "#39" },
  { label: "Network Readiness Index", value: "#49" },
  { label: "AI Readiness Index", value: "#36" },
  { label: "Startup Ecosystem Rank", value: "#3" },
],
    trend: trend(45, 3.4),
    topCountries: [
      { code: "US", name: "United States", value: 92 },
      { code: "CN", name: "China", value: 88 },
      { code: "KR", name: "South Korea", value: 84 },
      { code: "DE", name: "Germany", value: 80 },
      { code: "IN", name: "India", value: 68 },
      { code: "BR", name: "Brazil", value: 55 },
    ],
    states: statesFor(4),
    story: {
      title: "A billion people, one digital stack",
      body:
        "India has rapidly expanded its digital ecosystem through increasing internet penetration, digital payments, startup growth, and IT exports. Continued investment in AI, semiconductors, and digital infrastructure positions the country among the world's fastest-growing technology economies.",
      insights: [
        "UPI processes more transactions than Visa and Mastercard combined domestically.",
        "AI talent pool is 420,000 — 2nd only to the US.",
        "Semiconductor mission attracted ₹1.5 lakh crore in three fab commitments.",
      ],
      recommendations: [
        "Scale AI compute infrastructure to 25,000 GPUs by 2027.",
        "Establish deep-tech patent fast-track under IPR Policy 2.0.",
        "Bridge the rural digital-skill gap with vernacular AI tutors.",
      ],
      whyItMatters:
        "Technology leadership determines geopolitical leverage. India's DPI is now a soft-power asset on par with its diaspora.",
    },
    related: [
      { title: "NPCI UPI Data", kind: "Dataset", source: "NPCI" },
      { title: "Global Innovation Index", kind: "Report", source: "WIPO" },
      { title: "India AI Mission Brief", kind: "Article", source: "MeitY" },
    ],
    sources: [
      { name: "WIPO GII", url: "wipo.int", updated: "Sep 2025" },
      { name: "NPCI Stats", url: "npci.org.in", updated: "Nov 2025" },
    ],
  },
  education: {
    slug: "education",
    name: "Education",
    format: "percentage",
    tagline: "Literacy, enrolment & outcomes",
    icon: GraduationCap,
    accent: "saffron",
    rank: 94,
    outOf: 180,
    rankDelta: 5,
    kpis: [
      { label: "Literacy Rate", value: "77.7%", delta: "+3.4 pp", trend: "up", hint: "15+ years", spark: spark(17) },
      { label: "GER Higher Ed", value: "28.4%", delta: "+1.6 pp", trend: "up", hint: "Target: 50% by 2035", spark: spark(18) },
      { label: "Female Enrolment", value: "48.9%", delta: "+2.1 pp", trend: "up", hint: "Near parity", spark: spark(19) },
      { label: "Ed Spend / GDP", value: "2.9%", delta: "+0.1 pp", trend: "up", hint: "Target: 6%", spark: spark(20) },
    ],

    rankings: [
  { label: "Education Index", value: "#94" },
  { label: "Literacy Rate", value: "77.7%" },
  { label: "Higher Education Rank", value: "#29" },
  { label: "University Quality", value: "#52" },
],

    trend: trend(52, 1.5),
    topCountries: [
      { code: "FI", name: "Finland", value: 88 },
      { code: "KR", name: "South Korea", value: 86 },
      { code: "SG", name: "Singapore", value: 85 },
      { code: "US", name: "United States", value: 78 },
      { code: "CN", name: "China", value: 72 },
      { code: "IN", name: "India", value: 61 },
    ],
    states: statesFor(6),
    story: {
      title: "The classroom of a billion aspirations",
      body:
        "NEP 2020 is the most ambitious education reform in a generation — restructuring school, higher ed, and vocational tracks. Digital-first delivery via DIKSHA reaches 200M+ learners.",
      insights: [
        "Female GER now exceeds male GER in higher education for the first time.",
        "Foundational literacy targets under NIPUN reached 68% of Grade-3 students.",
        "Skill India certified 14M youth in FY24 — a record year.",
      ],
      recommendations: [
        "Anchor teacher training to outcome-linked incentives.",
        "Expand multilingual EdTech to 22 scheduled languages.",
        "Cross-list Indian universities on global exchange programmes.",
      ],
      whyItMatters:
        "Every 1% rise in literacy correlates with 2.5% GDP uplift over a generation — education is India's compounding engine.",
    },
    related: [
      { title: "UDISE+ Dashboard", kind: "Dataset", source: "Ministry of Education" },
      { title: "ASER 2024", kind: "Report", source: "Pratham" },
      { title: "NEP Implementation Tracker", kind: "Article", source: "CPR" },
    ],
    sources: [
      { name: "UNESCO UIS", url: "uis.unesco.org", updated: "Aug 2025" },
      { name: "UDISE+", url: "udiseplus.gov.in", updated: "Oct 2025" },
    ],
  },
  agriculture: {
    slug: "agriculture",
    name: "Agriculture",
    format: "compact",
    tagline: "Food security & rural incomes",
    icon: Wheat,
    accent: "green",
    rank: 22,
    outOf: 195,
    rankDelta: 3,
    kpis: [
      { label: "Foodgrain Output", value: "332 MT", delta: "+2.9%", trend: "up", hint: "All-time high", spark: spark(21) },
      { label: "Agri Exports", value: "$48.9B", delta: "+8.4%", trend: "up", hint: "Rice, marine, spices", spark: spark(22) },
      { label: "Irrigated Area", value: "52%", delta: "+1.8 pp", trend: "up", hint: "of net sown", spark: spark(23) },
      { label: "Farmer Income", value: "₹13,661", delta: "+11%", trend: "up", hint: "Monthly avg", spark: spark(24) },
    ],

    rankings: [
  { label: "Food Production Rank", value: "#2" },
  { label: "Agricultural Output", value: "#2" },
  { label: "Food Security Index", value: "#68" },
  { label: "Agri Exports", value: "$48.9B" },
],

    trend: trend(48, 1.9),
    topCountries: [
      { code: "CN", name: "China", value: 95 },
      { code: "IN", name: "India", value: 88 },
      { code: "US", name: "United States", value: 85 },
      { code: "BR", name: "Brazil", value: 80 },
      { code: "RU", name: "Russia", value: 70 },
    ],
    states: statesFor(9),
    story: {
      title: "Feeding a billion, and then some",
      body:
        "India is the world's largest producer of milk, pulses and jute — and the 2nd largest for rice, wheat, sugarcane, cotton, and vegetables. The next chapter is value addition and precision farming.",
      insights: [
        "Direct Benefit Transfers reached 110M farmers under PM-KISAN.",
        "Drone subsidies covered 15,000 women SHGs under Namo Drone Didi.",
        "Millet exports doubled after IYM 2023 international campaign.",
      ],
      recommendations: [
        "Complete land record digitisation to unlock formal credit.",
        "Expand solar pumps under KUSUM to 3M farmers by 2027.",
        "Scale FPO ecosystem to 20,000 with export linkages.",
      ],
      whyItMatters:
        "Agriculture employs 45% of the workforce. Its productivity determines both inflation and rural aspiration.",
    },
    related: [
      { title: "Agri Statistics at a Glance", kind: "Dataset", source: "DAC&FW" },
      { title: "FAO Food Outlook", kind: "Source", source: "FAO" },
      { title: "State of Indian Agriculture", kind: "Report", source: "ICRIER" },
    ],
    sources: [
      { name: "FAOSTAT", url: "fao.org/faostat", updated: "Sep 2025" },
      { name: "DAC&FW", url: "agricoop.gov.in", updated: "Nov 2025" },
    ],
  },
  safety: {
    slug: "safety",
    name: "Safety",
    format: "compact",
    tagline: "Crime, road safety & disaster resilience",
    icon: ShieldCheck,
    accent: "navy",
    rank: 76,
    outOf: 163,
    rankDelta: 4,
    kpis: [
      { label: "Safety Index", value: "58.4", delta: "+2.6", trend: "up", hint: "Numbeo scale", spark: spark(25) },
      { label: "Road Fatalities", value: "168k", delta: "+1.2%", trend: "up", hint: "Needs action", spark: spark(26) },
      { label: "Disaster Response", value: "94%", delta: "+3 pp", trend: "up", hint: "NDRF reach", spark: spark(27) },
      { label: "Women Safety Score", value: "62.1", delta: "+1.8", trend: "up", hint: "Composite index", spark: spark(28) },
    ],

    rankings: [
  { label: "Global Peace Index", value: "#116" },
  { label: "Safety Index", value: "#76" },
  { label: "Disaster Preparedness", value: "94%" },
  { label: "Road Safety Rank", value: "#121" },
],

    trend: trend(50, 1.2),
    topCountries: [
      { code: "IS", name: "Iceland", value: 93 },
      { code: "DK", name: "Denmark", value: 90 },
      { code: "JP", name: "Japan", value: 89 },
      { code: "SG", name: "Singapore", value: 87 },
      { code: "IN", name: "India", value: 58 },
    ],
    states: statesFor(13),
    story: {
      title: "Safer cities, safer roads — a work in progress",
      body:
        "Crime rates have declined in metros while road safety remains a national concern. Nirbhaya-funded fast-track courts and 112 emergency response are showing measurable impact.",
      insights: [
        "Cybercrime up 24% — reflects both incidence and reporting.",
        "112 unified emergency line now active in 34 states/UTs.",
        "Disaster fatalities down 62% since 2005 despite 3x more events.",
      ],
      recommendations: [
        "Mandate ADAS on all new commercial vehicles by 2027.",
        "Scale I4C to municipal cybercrime cells in all Tier-2 cities.",
        "Institutionalise safety audits every 5 km of national highway.",
      ],
      whyItMatters:
        "Safety is the invisible layer that unlocks women's workforce participation, tourism, and inbound investment.",
    },
    related: [
      { title: "NCRB Crime in India", kind: "Report", source: "NCRB" },
      { title: "MoRTH Road Accidents", kind: "Dataset", source: "MoRTH" },
      { title: "Global Peace Index", kind: "Source", source: "IEP" },
    ],
    sources: [
      { name: "NCRB", url: "ncrb.gov.in", updated: "Jul 2025" },
      { name: "IEP GPI", url: "visionofhumanity.org", updated: "Jun 2025" },
    ],
  },
  governance: {
    slug: "governance",
    name: "Governance",
    format: "compact",
    tagline: "Public services, corruption & rule of law",
    icon: Landmark,
    accent: "navy",
    rank: 85,
    outOf: 180,
    rankDelta: 6,
    kpis: [
      { label: "Ease of Doing Biz", value: "63", delta: "+14", trend: "up", hint: "World Bank rank", spark: spark(29) },
      { label: "e-Gov Services", value: "1,632", delta: "+128", trend: "up", hint: "on DigiLocker/UMANG", spark: spark(30) },
      { label: "Corruption Perceptions", value: "39/100", delta: "+2", trend: "up", hint: "Higher = cleaner", spark: spark(31) },
      { label: "Voter Turnout", value: "66.8%", delta: "+0.4 pp", trend: "up", hint: "GE 2024", spark: spark(32) },
    ],

    rankings: [
  { label: "Rule of Law Index", value: "#79" },
  { label: "Corruption Perception", value: "#96" },
  { label: "Government Effectiveness", value: "#85" },
  { label: "Digital Governance", value: "#28" },
],

    trend: trend(46, 1.4),
    topCountries: [
      { code: "DK", name: "Denmark", value: 90 },
      { code: "SG", name: "Singapore", value: 84 },
      { code: "DE", name: "Germany", value: 78 },
      { code: "US", name: "United States", value: 69 },
      { code: "IN", name: "India", value: 55 },
    ],
    states: statesFor(15),
    story: {
      title: "Digitising the state, one citizen at a time",
      body:
        "The JAM trinity (Jan Dhan, Aadhaar, Mobile) has plugged leakage worth ₹3.48 lakh crore. DBT is now the default for 300+ schemes across 53 ministries.",
      insights: [
        "97% of adults hold a bank account — up from 35% in 2011.",
        "e-Courts Phase III to digitise 1,400+ complexes by 2026.",
        "Right to Information disposals average 68 days — down from 156.",
      ],
      recommendations: [
        "Legislate data protection subordinate rules under DPDP Act.",
        "Expand lateral entry into central services to 500 posts / year.",
        "Publish outcome-linked scheme dashboards as default open data.",
      ],
      whyItMatters:
        "Governance quality is the multiplier on every rupee spent. Better delivery unlocks trust — the currency of a mature democracy.",
    },
    related: [
      { title: "Good Governance Index", kind: "Report", source: "DARPG" },
      { title: "TI Corruption Perceptions", kind: "Source", source: "Transparency Intl" },
      { title: "Public Affairs Index", kind: "Report", source: "PAC" },
    ],
    sources: [
      { name: "WGI World Bank", url: "govindicators.org", updated: "Sep 2025" },
      { name: "DARPG GGI", url: "darpg.gov.in", updated: "Oct 2025" },
    ],
  },
  equality: {
    slug: "equality",
    name: "Equality",
    format: "compact",
    tagline: "Gender, income & social inclusion",
    icon: Scale,
    accent: "saffron",
    rank: 129,
    outOf: 146,
    rankDelta: 2,
    kpis: [
      { label: "Female LFPR", value: "37.0%", delta: "+4.2 pp", trend: "up", hint: "PLFS 2024", spark: spark(33) },
      { label: "Gini Coefficient", value: "0.36", delta: "-0.01", trend: "down", hint: "Lower = better", spark: spark(34) },
      { label: "Women in Parliament", value: "13.6%", delta: "+0.3 pp", trend: "up", hint: "17th Lok Sabha", spark: spark(35) },
      { label: "SC/ST Rep in Higher Ed", value: "23%", delta: "+1.5 pp", trend: "up", hint: "AISHE", spark: spark(36) },
    ],
    rankings: [
  { label: "Global Gender Gap Rank", value: "#129" },
  { label: "Gender Equality Score", value: "64.1%" },
  { label: "Women in Parliament", value: "13.6%" },
  { label: "Income Equality Rank", value: "#103" },
],

    trend: trend(40, 1.1),
    topCountries: [
      { code: "IS", name: "Iceland", value: 91 },
      { code: "NO", name: "Norway", value: 88 },
      { code: "FI", name: "Finland", value: 87 },
      { code: "DE", name: "Germany", value: 79 },
      { code: "US", name: "United States", value: 74 },
      { code: "IN", name: "India", value: 58 },
    ],
    states: statesFor(17),
    story: {
      title: "Bridging the last mile of opportunity",
      body:
        "Women's Reservation Act (2023) mandates 33% legislative seats — the boldest structural shift in decades. Yet workforce participation and unpaid care remain persistent gaps.",
      insights: [
        "MUDRA loans: 68% of 47 crore beneficiaries are women.",
        "STEM enrolment among women is 43% — higher than G20 average.",
        "Wage gap has narrowed 6 pp since 2018 but remains at 27%.",
      ],
      recommendations: [
        "Universalise creche access under Palna scheme to Panchayat level.",
        "Tie CSR to measurable diversity outcomes, not just spend.",
        "Introduce paternity leave floor of 12 weeks nationally.",
      ],
      whyItMatters:
        "Closing the gender gap alone could add $770B to India's GDP by 2030 (McKinsey). Equality is an economic imperative.",
    },
    related: [
      { title: "Global Gender Gap Report", kind: "Source", source: "WEF" },
      { title: "PLFS Annual Report", kind: "Dataset", source: "MoSPI" },
      { title: "State of Working India", kind: "Report", source: "Azim Premji Univ" },
    ],
    sources: [
      { name: "WEF GGGR", url: "weforum.org", updated: "Jun 2025" },
      { name: "PLFS MoSPI", url: "mospi.gov.in", updated: "Oct 2025" },
    ],
  },
};

export const DOMAIN_LIST = Object.values(DOMAINS);
