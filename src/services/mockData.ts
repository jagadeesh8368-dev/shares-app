import { StockDetails, StockSummary, IndexData, NewsItem, LearnTopic, CapType, SentimentType, RiskLevelType, ResearchSignalType } from '../types';

// Helper: Generate historical price data with 20, 50, and 200 DMAs
const generateHistoricalPrice = (
  basePrice: number,
  days: number = 300,
  volatility: number = 0.015,
  trend: number = 0.0003
) => {
  const data: { date: string; close: number; volume: number; dma20?: number; dma50?: number; dma200?: number }[] = [];
  let currentPrice = basePrice * 0.85; // Start lower to show growth over 300 days
  const baseVolume = 1000000;

  const date = new Date();
  date.setDate(date.getDate() - days);

  for (let i = 0; i < days; i++) {
    const randomShift = (Math.random() - 0.48) * 2; // slight positive bias
    const priceChange = currentPrice * volatility * randomShift + (currentPrice * trend);
    currentPrice = Math.max(1, currentPrice + priceChange);
    
    // Add volume spikes on positive days
    const volMultiplier = randomShift > 0.5 ? 1.8 : (randomShift < -0.5 ? 1.4 : 0.8);
    const volume = Math.floor(baseVolume * (1 + (Math.random() - 0.5) * 0.4) * volMultiplier);

    date.setDate(date.getDate() + 1);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      i--;
      continue;
    }

    data.push({
      date: date.toISOString().split('T')[0],
      close: parseFloat(currentPrice.toFixed(2)),
      volume: volume,
    });
  }

  // Calculate Simple Moving Averages (SMA / DMA)
  for (let i = 0; i < data.length; i++) {
    // 20 DMA
    if (i >= 19) {
      let sum = 0;
      for (let j = i - 19; j <= i; j++) sum += data[j].close;
      data[i].dma20 = parseFloat((sum / 20).toFixed(2));
    }
    // 50 DMA
    if (i >= 49) {
      let sum = 0;
      for (let j = i - 49; j <= i; j++) sum += data[j].close;
      data[i].dma50 = parseFloat((sum / 50).toFixed(2));
    }
    // 200 DMA
    if (i >= 199) {
      let sum = 0;
      for (let j = i - 199; j <= i; j++) sum += data[j].close;
      data[i].dma200 = parseFloat((sum / 200).toFixed(2));
    }
  }

  return data;
};

// Base definitions for 10 major Indian stocks
export const baseStocksData: {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number; // Crores
  capType: CapType;
  sector: string;
  industry: string;
  researchScore: number;
  riskLevel: RiskLevelType;
  sentiment: SentimentType;
  description: string;
  foundedYear: number;
  headquarters: string;
  promoterHolding: number;
  institutionalHolding: number;
  publicHolding: number;
  peRatio: number;
  pbRatio: number;
  pegRatio: number;
  evEbitda: number;
  eps: number;
  dividendYield: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  currentRatio: number;
  interestCoverage: number;
  freeCashFlow: number;
  high52Week: number;
  low52Week: number;
  volume: number;
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; risks: string[] };
  investmentSignal: { status: ResearchSignalType; reasons: string[] };
  futureOutlook: { outlook: 'Positive' | 'Neutral' | 'Cautious'; drivers: string[]; catalysts: string[]; risks: string[]; metricsToWatch: string[]; industryOutlook: string };
  sentimentAnalysis: { score: number; signal: SentimentType; explanation: string; bullishFactors: string[]; bearishFactors: string[] };
  risksAnalysis: { overallRisk: RiskLevelType; businessRisk: RiskLevelType; financialRisk: RiskLevelType; valuationRisk: RiskLevelType; marketRisk: RiskLevelType; regulatoryRisk: RiskLevelType; explanation: string };
}[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 3012.45,
    change: 45.80,
    changePercent: 1.54,
    marketCap: 2038450,
    capType: "Large Cap",
    sector: "Energy & Conglomerates",
    industry: "Oil, Gas & Telecom",
    researchScore: 82,
    riskLevel: "Moderate",
    sentiment: "Positive",
    description: "Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai. Its businesses include energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles. Reliance is the largest public company in India by market capitalization.",
    foundedYear: 1958,
    headquarters: "Mumbai, Maharashtra",
    promoterHolding: 50.39,
    institutionalHolding: 38.25,
    publicHolding: 11.36,
    peRatio: 26.8,
    pbRatio: 2.5,
    pegRatio: 2.1,
    evEbitda: 14.5,
    eps: 112.40,
    dividendYield: 0.33,
    roe: 9.6,
    roce: 10.8,
    debtToEquity: 0.38,
    currentRatio: 1.25,
    interestCoverage: 6.8,
    freeCashFlow: 18240,
    high52Week: 3217.90,
    low52Week: 2220.30,
    volume: 3850000,
    swot: {
      strengths: ["Market leader in retail and digital telecommunications (Jio)", "Robust refining margins and integrated energy operations", "Strong cash flows from traditional Oil-to-Chemicals (O2C) segment", "Low financing cost due to high credit rating"],
      weaknesses: ["High capital expenditure requirements for 5G rollout and green energy assets", "Susceptibility to global crude oil price fluctuations", "Lower Return on Equity (ROE) compared to tech-focused peers"],
      opportunities: ["Huge growth in Green Energy sector (Gigafactories in Jamnagar)", "Potential monetization of Retail and Jio IPOs in the future", "Increasing digital services monetization (JioAirFiber, Cloud offerings)"],
      risks: ["Regulatory risks regarding tariff controls in telecom", "Slower global growth affecting export refinery margins", "Execution risk in transitioning to a net-zero carbon company by 2035"]
    },
    investmentSignal: {
      status: "Strong Fundamentals",
      reasons: ["Market leadership across major sectors", "Massive value unlocking potential from retail/telecom spin-offs", "Healthy cash generation backing aggressive green transition"]
    },
    futureOutlook: {
      outlook: "Positive",
      drivers: ["Telecom tariff hikes boosting Jio's average revenue per user (ARPU)", "Retail store expansion and e-commerce scale-up", "Commercialization of new energy gigafactories"],
      catalysts: ["Spin-off and IPO announcements for Jio and Reliance Retail", "Discovery of new gas reserves in KG-D6 basin", "Policy support for domestic clean energy production"],
      risks: ["Unexpected telecom price wars", "Extended commodity price downturn", "Over-leverage if green capex fails to yield returns on time"],
      metricsToWatch: ["Jio ARPU growth rate", "Retail EBITDA margins", "Net Debt to EBITDA ratio"],
      industryOutlook: "India's digital economy and organized retail are expanding rapidly. Traditional energy will see peak demand, while renewable energy transition holds massive long-term potential."
    },
    sentimentAnalysis: {
      score: 78,
      signal: "Positive",
      explanation: "Market sentiment is positive, backed by strong subscriber additions in Jio and steady refining margins. The green energy transition is highly anticipated.",
      bullishFactors: ["Strong institutional buying support", "Upgrades in target prices by global brokerages", "Steady performance of the retail segment"],
      bearishFactors: ["Concerns about high capital expenditure", "Marginal decline in petchem margins due to global oversupply"]
    },
    risksAnalysis: {
      overallRisk: "Moderate",
      businessRisk: "Low",
      financialRisk: "Moderate",
      valuationRisk: "Moderate",
      marketRisk: "Moderate",
      regulatoryRisk: "Moderate",
      explanation: "While the traditional energy business has low volatility, the heavy debt taken for 5G and green energy expansions creates moderate financial risk. High valuation ratios also reflect built-in growth expectations."
    }
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    price: 4120.50,
    change: 85.30,
    changePercent: 2.11,
    marketCap: 1492300,
    capType: "Large Cap",
    sector: "Information Technology",
    industry: "IT Services & Consulting",
    researchScore: 86,
    riskLevel: "Low",
    sentiment: "Positive",
    description: "Tata Consultancy Services Limited is an Indian multinational information technology services and consulting company headquartered in Mumbai. It is a part of the Tata Group and operates in 150 locations across 46 countries. TCS is the second-largest Indian company by market capitalization.",
    foundedYear: 1968,
    headquarters: "Mumbai, Maharashtra",
    promoterHolding: 72.41,
    institutionalHolding: 21.80,
    publicHolding: 5.79,
    peRatio: 31.2,
    pbRatio: 12.8,
    pegRatio: 2.8,
    evEbitda: 22.4,
    eps: 132.06,
    dividendYield: 1.21,
    roe: 48.2,
    roce: 58.4,
    debtToEquity: 0.05,
    currentRatio: 2.40,
    interestCoverage: 88.0,
    freeCashFlow: 42350,
    high52Week: 4560.00,
    low52Week: 3150.00,
    volume: 1850000,
    swot: {
      strengths: ["World-class execution capability with massive global client base", "Extremely strong cash reserves and high shareholder returns (dividends & buybacks)", "Industry-leading ROE (48.2%) and ROCE (58.4%)", "Low operational leverage with minimal debt"],
      weaknesses: ["Dependence on US and European banking/insurance client budgets", "Rising attrition and employee replacement costs", "Slower growth in large legacy maintenance contracts compared to agile competitors"],
      opportunities: ["Surging demand for Generative AI, cloud migration, and cybersecurity", "Market share gains from vendor consolidation", "Expansion in continental Europe and Middle East markets"],
      risks: ["Macroeconomic slowdown in US/Europe causing delay in IT spending", "Adverse visa regulations in western markets", "Rapid technological obsolescence requiring constant talent retraining"]
    },
    investmentSignal: {
      status: "Strong Fundamentals",
      reasons: ["Virtually debt-free balance sheet", "Outstanding return ratios (ROE ~48%)", "Strong defensive play during volatile market cycles"]
    },
    futureOutlook: {
      outlook: "Positive",
      drivers: ["AI and cloud transformations", "Vendor consolidation in favor of large scale players like TCS", "Cost optimization deals replacing discretionary spend"],
      catalysts: ["Federal Reserve interest rate cuts leading to recovery in BFSI discretionary spending", "Large multi-year deal wins ($1B+ total contract value)", "Favorable currency depreciation (USD to INR)"],
      risks: ["Prolonged economic recession in key Western markets", "Wage inflation eating into operating margins", "Aggressive pricing pressure from mid-tier IT players"],
      metricsToWatch: ["Order Book TCV (Total Contract Value)", "Operating Margin (EBIT Margin)", "Attrition rate"],
      industryOutlook: "Global enterprise IT spending is shifting from discretionary digital projects to efficiency, automation, and AI. TCS is well positioned as a core transformation partner."
    },
    sentimentAnalysis: {
      score: 83,
      signal: "Positive",
      explanation: "Market sentiment is positive due to high dividend payouts, strong order bookings, and leadership in AI-driven enterprise applications.",
      bullishFactors: ["Consistent dividend yield and share buybacks", "Strong cash conversion efficiency", "Resilient margin defense during sector slowdown"],
      bearishFactors: ["Slowing revenue growth rate in constant currency terms", "Delay in decision-making by US banking clients"]
    },
    risksAnalysis: {
      overallRisk: "Low",
      businessRisk: "Low",
      financialRisk: "Low",
      valuationRisk: "Moderate",
      marketRisk: "Low",
      regulatoryRisk: "Moderate",
      explanation: "TCS has exceptional financial strength with near-zero debt, mitigating financial risks. The primary risk is a global slowdown in tech spending or high valuation premium relative to history."
    }
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    price: 1845.30,
    change: -12.45,
    changePercent: -0.67,
    marketCap: 765400,
    capType: "Large Cap",
    sector: "Information Technology",
    industry: "IT Services & Consulting",
    researchScore: 81,
    riskLevel: "Low",
    sentiment: "Neutral",
    description: "Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services. The company was founded in Pune and is headquartered in Bangalore.",
    foundedYear: 1981,
    headquarters: "Bengaluru, Karnataka",
    promoterHolding: 14.94,
    institutionalHolding: 71.30,
    publicHolding: 13.76,
    peRatio: 28.5,
    pbRatio: 9.8,
    pegRatio: 2.4,
    evEbitda: 18.2,
    eps: 64.75,
    dividendYield: 1.84,
    roe: 32.4,
    roce: 40.1,
    debtToEquity: 0.08,
    currentRatio: 2.10,
    interestCoverage: 62.0,
    freeCashFlow: 21500,
    high52Week: 1990.00,
    low52Week: 1355.00,
    volume: 4500000,
    swot: {
      strengths: ["Strong digital transformation portfolio (Infosys Cobalt)", "High corporate governance standards and brand equity", "Excellent return on capital with high payout ratios"],
      weaknesses: ["Relatively high client concentration in BFSI and retail sectors", "Historically higher attrition compared to TCS", "Vulnerability to management changes and internal leadership transitions"],
      opportunities: ["Strong pipeline in Generative AI (Infosys Topaz)", "Cost efficiency and automation solutions for telecom/manufacturing clients", "Strategic acquisitions in Europe for local delivery capabilities"],
      risks: ["Intensifying price competition in standard software development services", "Uncertainties in European geopolitical situation", "Strict immigration and labor laws in North America"]
    },
    investmentSignal: {
      status: "Healthy",
      reasons: ["Consistent growth, though slightly lower than TCS", "Strong cash generation backing high dividend yield (1.84%)", "Valuation is more reasonable than its immediate peer TCS"]
    },
    futureOutlook: {
      outlook: "Neutral",
      drivers: ["Cloud migration and application modernization", "Adoption of generative AI platforms in operations", "Growth in European markets"],
      catalysts: ["Large enterprise digital contract announcements", "Improvement in BFSI clients' discretionary IT spends", "Stabilization of operating margins"],
      risks: ["Client bankruptcies in the US retail or mortgage sector", "Significant client insourcing of tech capabilities", "Sudden salary hikes impacting competitive pricing"],
      metricsToWatch: ["Large deal contract values", "Utilization rates", "Digital services share of revenue"],
      industryOutlook: "The Indian IT services industry is moving through a phase of transition from simple labor arbitrage to complex AI and engineering partnerships."
    },
    sentimentAnalysis: {
      score: 68,
      signal: "Neutral",
      explanation: "Sentiment is neutral. Solid margins are offset by a slight downgrade in short-term revenue guidance due to delayed client projects.",
      bullishFactors: ["Infosys Topaz AI gaining traction", "Healthy operating cash flows", "Attractive valuation multiples relative to peak levels"],
      bearishFactors: ["Cautious commentary on tech budgets by management", "Recent senior leadership departures"]
    },
    risksAnalysis: {
      overallRisk: "Low",
      businessRisk: "Low",
      financialRisk: "Low",
      valuationRisk: "Moderate",
      marketRisk: "Moderate",
      regulatoryRisk: "Moderate",
      explanation: "Extremely strong cash backing, minimal debt, and broad geographic reach insulate Infosys from severe financial distress. Global economic volatility and tech spending budgets remain the key risk factors."
    }
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    price: 1622.75,
    change: 14.10,
    changePercent: 0.88,
    marketCap: 1234500,
    capType: "Large Cap",
    sector: "Financial Services",
    industry: "Private Sector Bank",
    researchScore: 84,
    riskLevel: "Low",
    sentiment: "Positive",
    description: "HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai. It is India's largest private sector bank by assets and the world's tenth-largest bank by market capitalization as of April 2024.",
    foundedYear: 1994,
    headquarters: "Mumbai, Maharashtra",
    promoterHolding: 0.00, // Fully public / institutional held after merger
    institutionalHolding: 82.45,
    publicHolding: 17.55,
    peRatio: 18.2,
    pbRatio: 2.6,
    pegRatio: 1.5,
    evEbitda: 11.2, // Banks usually don't use EV/EBITDA but provided for standard format
    eps: 89.16,
    dividendYield: 1.17,
    roe: 17.5,
    roce: 18.2,
    debtToEquity: 7.20, // High leverage is normal for banks (deposits counted)
    currentRatio: 1.15,
    interestCoverage: 2.8,
    freeCashFlow: 35000,
    high52Week: 1794.00,
    low52Week: 1363.00,
    volume: 12400000,
    swot: {
      strengths: ["Unrivaled retail lending franchise and low-cost deposit base (CASA)", "Best-in-class asset quality with consistently low Non-Performing Assets (NPAs)", "Post-merger scale as a comprehensive financial giant", "Strong corporate governance standards"],
      weaknesses: ["Short-term pressure on Net Interest Margins (NIM) due to merger with parent HDFC", "Relatively high credit-to-deposit ratio post-merger", "Aggressive technology upgrades required to fix digital banking glitches"],
      opportunities: ["Cross-selling banking products to millions of existing HDFC home loan customers", "Expansion in semi-urban and rural areas of India", "Digital-first banking services (PayZapp, SmartBuy)"],
      risks: ["Macroeconomic slowdown in India affecting retail credit repayment", "Intense competition for deposits forcing interest rate hikes", "Systemic banking system liquidity constraints"]
    },
    investmentSignal: {
      status: "Strong Fundamentals",
      reasons: ["Asset quality remains extremely resilient", "Valuations are near historical lows (PB ~ 2.6x)", "Unmatched scale in Indian banking sector"]
    },
    futureOutlook: {
      outlook: "Positive",
      drivers: ["Merger synergy realizations boosting cross-sell ratios", "Gradual recovery in NIMs as high-cost liabilities mature", "Credit growth in retail and MSME segments"],
      catalysts: ["Faster-than-expected deposit growth rates", "Improvement in Return on Assets (ROA) towards 2.0%", "Potential rate cuts by RBI easing funding costs"],
      risks: ["Prolonged compression of net interest margins", "Sudden uptick in unsecured retail defaults", "Regulatory penalties due to digital downtime"],
      metricsToWatch: ["Net Interest Margin (NIM)", "Gross NPA ratio", "Deposit growth rate vs credit growth rate"],
      industryOutlook: "Indian banking sector is well-capitalized with clean balance sheets. Private sector banks are positioned to grab market share, backed by credit demand."
    },
    sentimentAnalysis: {
      score: 75,
      signal: "Positive",
      explanation: "Market sentiment has turned positive as NIM compression bottomed out, and deposit mobilization picked up pace.",
      bullishFactors: ["Strong institutional accumulation by FIIs", "Stabilization of NPAs at record lows", "Synergy benefits beginning to flow from HDFC merger"],
      bearishFactors: ["Margin pressure concern remains in the medium term", "Slower credit growth compared to mid-sized private banks"]
    },
    risksAnalysis: {
      overallRisk: "Low",
      businessRisk: "Low",
      financialRisk: "Low", // Regulated capital adequacy ratios are very healthy
      valuationRisk: "Low",
      marketRisk: "Moderate",
      regulatoryRisk: "Moderate",
      explanation: "HDFC Bank maintains strong Capital Adequacy Ratios well above regulatory minimums. Primary risks are macro credit defaults and regulatory oversight by RBI."
    }
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    price: 1180.20,
    change: 18.40,
    changePercent: 1.58,
    marketCap: 825600,
    capType: "Large Cap",
    sector: "Financial Services",
    industry: "Private Sector Bank",
    researchScore: 88,
    riskLevel: "Low",
    sentiment: "Positive",
    description: "ICICI Bank Limited is an Indian multinational banking and financial services company headquartered in Mumbai. It offers a wide range of banking products and financial services for corporate and retail customers.",
    foundedYear: 1994,
    headquarters: "Mumbai, Maharashtra",
    promoterHolding: 0.00, // Fully public / institutional held
    institutionalHolding: 89.20,
    publicHolding: 10.80,
    peRatio: 17.5,
    pbRatio: 3.1,
    pegRatio: 1.1,
    evEbitda: 9.8,
    eps: 67.44,
    dividendYield: 0.85,
    roe: 18.5,
    roce: 19.1,
    debtToEquity: 6.80,
    currentRatio: 1.18,
    interestCoverage: 3.1,
    freeCashFlow: 24500,
    high52Week: 1220.00,
    low52Week: 910.00,
    volume: 9800000,
    swot: {
      strengths: ["Highly digitized operations (iMobile Pay app) driving retail acquisition", "Diversified loan book with robust retail and corporate mix", "Consistent improvement in Net Interest Margins (NIM)", "Strong capital adequacy ratio"],
      weaknesses: ["Slightly higher cost of funds compared to SBI and HDFC Bank", "Historical vulnerability to legacy corporate NPA cycles (though clean now)"],
      opportunities: ["Increasing corporate capex cycle driving wholesale credit demand", "Wealth management and insurance cross-sell growth", "Digital lending to small and medium enterprises (MSMEs)"],
      risks: ["Interest rate volatility affecting treasury income", "Competition from FinTech apps in payment and credit services", "Asset quality deterioration in retail auto or personal loan portfolios"]
    },
    investmentSignal: {
      status: "Strong Fundamentals",
      reasons: ["Top performer in return ratios among large banks (ROE ~18.5%)", "Industry-leading digital capabilities and retail growth", "Clean balance sheet with minimal NPA baggage"]
    },
    futureOutlook: {
      outlook: "Positive",
      drivers: ["Robust growth in retail and SME credit segments", "Operating leverage through digital-only services", "Sustained high margins through risk-calibrated pricing"],
      catalysts: ["Credit rating upgrades", "Consistent quarterly profit growth exceeding expectations", "Decline in credit costs"],
      risks: ["Systemic inflation reducing retail discretionary borrowing", "Regulatory tightening on retail unsecured loans", "Intensified deposit competition"],
      metricsToWatch: ["Core operating profit growth", "Net NPA ratio", "Net Interest Margin (NIM)"],
      industryOutlook: "Private banking continues to outpace public counterparts in customer acquisition and technology integration, driving robust asset growth."
    },
    sentimentAnalysis: {
      score: 87,
      signal: "Positive",
      explanation: "Market sentiment is highly positive. ICICI Bank is widely considered the top large-cap bank pick due to superior return ratios and steady execution.",
      bullishFactors: ["Outstanding earnings consistency", "Superior return ratios compared to peers", "Consistently low provisions required"],
      bearishFactors: ["Valuations are trading at a premium compared to historical averages"]
    },
    risksAnalysis: {
      overallRisk: "Low",
      businessRisk: "Low",
      financialRisk: "Low",
      valuationRisk: "Moderate",
      marketRisk: "Moderate",
      regulatoryRisk: "Moderate",
      explanation: "ICICI Bank is extremely well-capitalized with a Capital Adequacy Ratio of ~18%. High valuation premium is the only minor risk for entry."
    }
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 815.40,
    change: -8.20,
    changePercent: -1.00,
    marketCap: 728400,
    capType: "Large Cap",
    sector: "Financial Services",
    industry: "Public Sector Bank",
    researchScore: 79,
    riskLevel: "Moderate",
    sentiment: "Neutral",
    description: "State Bank of India is an Indian multinational public sector bank and financial services statutory body headquartered in Mumbai. SBI is the largest bank in India with a 23% market share in assets.",
    foundedYear: 1955,
    headquarters: "Mumbai, Maharashtra",
    promoterHolding: 57.49, // Government of India
    institutionalHolding: 31.85,
    publicHolding: 10.66,
    peRatio: 10.5,
    pbRatio: 1.7,
    pegRatio: 0.8,
    evEbitda: 8.5,
    eps: 77.65,
    dividendYield: 1.68,
    roe: 16.8,
    roce: 15.2,
    debtToEquity: 12.50, // Higher leverage common for PSU banks
    currentRatio: 1.10,
    interestCoverage: 2.1,
    freeCashFlow: 45000,
    high52Week: 896.00,
    low52Week: 543.00,
    volume: 18500000,
    swot: {
      strengths: ["Massive domestic network (22,000+ branches) and largest deposit base", "Strong government backing ensuring absolute deposit safety", "Great digital tool YONO with over 60 million registered users", "Vast subsidiary value (SBI Life, SBI Cards, SBI Mutual Fund)"],
      weaknesses: ["Higher operational costs due to large staff and legacy branches", "Susceptibility to government-directed developmental lending", "Lower margins on large corporate accounts"],
      opportunities: ["Monetization of key insurance and mutual fund subsidiaries", "Infrastructure credit demand driven by government capex plans", "Increasing digital loan originations via YONO"],
      risks: ["Agricultural and MSME loan defaults during monsoon failures", "Treasury losses from sudden rising bond yields", "PSU status limitations in executive salary structures affecting talent retention"]
    },
    investmentSignal: {
      status: "Healthy",
      reasons: ["Attractively valued at 1.7x PB relative to private peers", "ROE is now comparable to top private banks", "Unmatched deposit franchise protects funding costs"]
    },
    futureOutlook: {
      outlook: "Neutral",
      drivers: ["Government spending on infrastructure boosting credit book", "Reduction in wage revision provisions", "Growth in retail mortgage segment"],
      catalysts: ["Substantial corporate credit growth pick-up", "IPO of subsidiaries like YONO or SBI Mutual Fund", "Rate cuts improving bond portfolio valuation"],
      risks: ["Increase in slippages from small business loans", "High salary and pension revisions squeezing operating profit", "Increase in credit cost provisions"],
      metricsToWatch: ["Gross and Net NPA", "Slippage ratio", "YONO transaction volume growth"],
      industryOutlook: "Public sector banks have undergone massive cleanup. SBI leads the pack with corporate recovery and technology updates, keeping pace with private sector."
    },
    sentimentAnalysis: {
      score: 65,
      signal: "Neutral",
      explanation: "Sentiment is neutral due to recent wage revision provisions impacting profitability in the short term, but fundamental recovery remains intact.",
      bullishFactors: ["Cheap valuation relative to private banks", "Strong systemic credit growth share", "High dividend payout expectations"],
      bearishFactors: ["Concerns about wage hikes eating margins", "Marginally higher slippages in rural credit portfolios"]
    },
    risksAnalysis: {
      overallRisk: "Moderate",
      businessRisk: "Moderate",
      financialRisk: "Moderate",
      valuationRisk: "Low",
      marketRisk: "Moderate",
      regulatoryRisk: "Moderate",
      explanation: "Although backed by the government, the bank's exposure to volatile sectors like agriculture and public infra projects introduces moderate credit risk. Leverage is also slightly higher."
    }
  },
  {
    symbol: "ITC",
    name: "ITC Ltd",
    price: 495.20,
    change: 5.15,
    changePercent: 1.05,
    marketCap: 618200,
    capType: "Large Cap",
    sector: "FMCG & Conglomerates",
    industry: "Tobacco, Hotels & Packaged Foods",
    researchScore: 84,
    riskLevel: "Low",
    sentiment: "Positive",
    description: "ITC Limited is an Indian conglomerate company headquartered in Kolkata. ITC has a diversified presence across industries such as FMCG, Hotels, Software, Packaging, Paperboards, Specialty Papers, and Agribusiness.",
    foundedYear: 1910,
    headquarters: "Kolkata, West Bengal",
    promoterHolding: 0.00, // No promoter, board-managed (held by institutions/LIC/BAT)
    institutionalHolding: 85.50,
    publicHolding: 14.50,
    peRatio: 29.5,
    pbRatio: 8.5,
    pegRatio: 2.7,
    evEbitda: 20.8,
    eps: 16.78,
    dividendYield: 2.78,
    roe: 29.2,
    roce: 38.5,
    debtToEquity: 0.01,
    currentRatio: 2.85,
    interestCoverage: 120.0,
    freeCashFlow: 15400,
    high52Week: 512.00,
    low52Week: 399.00,
    volume: 8500000,
    swot: {
      strengths: ["Near-monopoly in the Indian cigarette market generating massive cash flows", "High brand equity in packaged foods (Aashirvaad, Sunfeast, Yippee)", "Virtually debt-free status with huge cash reserves", "Outstanding dividend yield (2.78%) and payout history"],
      weaknesses: ["Cigarette business faces high and unpredictable taxation", "Hotel and paperboard segments are highly capital intensive", "ESG rating pressure due to tobacco operations affecting international fund inflows"],
      opportunities: ["Demerger of the Hotels business to improve return on capital (ROC)", "Export growth in agribusiness and packaging materials", "Increasing premiumization of FMCG portfolios"],
      risks: ["Increase in NCCD (National Calamity Contingent Duty) on cigarettes by government", "Sharp rise in raw material prices (wheat, edible oil, pulp)", "Stiff competition from local and global FMCG brands in packaged foods"]
    },
    investmentSignal: {
      status: "Strong Fundamentals",
      reasons: ["Demerger of Hotel business is value accretive", "Excellent defensive stock with stable cash flow", "High return on equity (29%) and zero debt"]
    },
    futureOutlook: {
      outlook: "Positive",
      drivers: ["Demerger of Hotels business unlocking capital", "Volume growth in cigarette segment with tax stability", "Expansion of FMCG-others margin towards double digits"],
      catalysts: ["GST Council decisions keeping tobacco taxes stable", "Hotel demerger listing approval", "Good monsoon boosting rural FMCG consumption"],
      risks: ["Sudden steep hike in cigarette taxes", "Unfavorable commodity prices", "Decline in agri-exports due to government bans"],
      metricsToWatch: ["Cigarette volume growth", "FMCG EBIT margin", "Dividend payout ratio"],
      industryOutlook: "FMCG sector is seeing steady premiumization. Cigarette volumes show stability due to containment of illicit trade, while hotels are in a strong post-pandemic cycle."
    },
    sentimentAnalysis: {
      score: 80,
      signal: "Positive",
      explanation: "Market sentiment is positive as the proposed Hotels demerger is expected to reduce capital expenditure and boost overall return ratios.",
      bullishFactors: ["Value unlocking through Hotels spin-off", "Excellent dividend yield defense", "Strong FMCG brand market share gains"],
      bearishFactors: ["Occasional concerns over tobacco tax hikes during Union Budgets"]
    },
    risksAnalysis: {
      overallRisk: "Low",
      businessRisk: "Moderate", // Tobacco regulatory risk is high
      financialRisk: "Low", // Near zero debt, huge cash balance
      valuationRisk: "Moderate",
      marketRisk: "Low",
      regulatoryRisk: "High",
      explanation: "Financially, ITC is one of the safest companies in India. The business risk is concentrated in cigarette regulation and tobacco taxation, which is a major regulatory concern."
    }
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    price: 985.20,
    change: 32.10,
    changePercent: 3.37,
    marketCap: 362400,
    capType: "Large Cap",
    sector: "Automobile",
    industry: "Passenger & Commercial Vehicles",
    researchScore: 83,
    riskLevel: "Moderate",
    sentiment: "Positive",
    description: "Tata Motors Limited is an Indian multinational automotive manufacturing company headquartered in Mumbai. It is a part of the Tata Group and produces passenger cars, trucks, vans, coaches, buses, luxury cars, sports cars, and construction equipment.",
    foundedYear: 1945,
    headquarters: "Mumbai, Maharashtra",
    promoterHolding: 46.36,
    institutionalHolding: 35.80,
    publicHolding: 17.84,
    peRatio: 18.5,
    pbRatio: 4.8,
    pegRatio: 0.9,
    evEbitda: 8.2,
    eps: 53.25,
    dividendYield: 0.61,
    roe: 24.2,
    roce: 20.8,
    debtToEquity: 1.15,
    currentRatio: 0.98,
    interestCoverage: 5.4,
    freeCashFlow: 12500,
    high52Week: 1179.00,
    low52Week: 585.00,
    volume: 7800000,
    swot: {
      strengths: ["Market leader in India's electric vehicle (EV) market with >70% share", "Strong recovery in Jaguar Land Rover (JLR) profitability and order book", "Robust commercial vehicle (CV) business with structural margins", "Tata Group backing and operational synergies"],
      weaknesses: ["Higher debt-to-equity ratio compared to peers like Maruti Suzuki", "Low margins in domestic passenger vehicle (PV) segment without EVs", "Heavy dependence on JLR for overall corporate profits"],
      opportunities: ["Rapid adoption of EV cars in India backed by government subsidies", "Expansion of JLR luxury EV lineup (Range Rover EV)", "Export potential of domestic EV models to Europe and developing nations"],
      risks: ["Global slowdown affecting luxury car sales (JLR) in China and US", "Rise in chip and lithium battery material costs", "Intense competition from domestic (Mahindra) and foreign (Hyundai/BYD) automakers"]
    },
    investmentSignal: {
      status: "Healthy",
      reasons: ["Massive turnaround in JLR cash flow and debt reduction", "First-mover advantage in Indian EV passenger segment", "Reasonable valuation relative to high growth"]
    },
    futureOutlook: {
      outlook: "Positive",
      drivers: ["JLR deleveraging towards net debt-free status", "New EV launches (Curvv, Harrier EV)", "Steady infrastructure growth boosting heavy truck sales"],
      catalysts: ["Demerger of PV and CV businesses into separate entities", "Monetization of JLR EV battery joint ventures", "Reduction in net debt ahead of schedule"],
      risks: ["Slowdown in EV adoption due to charging infrastructure bottlenecks", "Sudden commodity price hikes (steel, rubber)", "Currency translation losses from JLR"],
      metricsToWatch: ["JLR EBITDA margin", "EV market share percentage", "Net debt level"],
      industryOutlook: "The global automotive industry is in a historic transition to electrification and software-defined vehicles. Domestically, premiumization is driving higher car prices."
    },
    sentimentAnalysis: {
      score: 85,
      signal: "Positive",
      explanation: "Market sentiment is positive on account of JLR deleveraging, strong EV leadership, and the proposed split of the PV and CV businesses into two listed companies.",
      bullishFactors: ["Record profits in JLR business", "Clear roadmap for debt reduction", "Excitement about upcoming demerger"],
      bearishFactors: ["Stagnation in domestic commercial vehicle sales volume"]
    },
    risksAnalysis: {
      overallRisk: "Moderate",
      businessRisk: "Moderate", // Cyclical automotive market
      financialRisk: "Moderate", // High but falling debt
      valuationRisk: "Moderate",
      marketRisk: "High",
      regulatoryRisk: "Moderate",
      explanation: "Automobile manufacturing is capital-intensive and highly cyclical. The presence of significant debt (though rapidly reducing) and global exposure through JLR places it in the moderate risk category."
    }
  },
  {
    symbol: "BHARTIALIRT",
    name: "Bharti Airtel Ltd",
    price: 1420.60,
    change: 22.40,
    changePercent: 1.60,
    marketCap: 812300,
    capType: "Large Cap",
    sector: "Telecommunication",
    industry: "Telecom Services",
    researchScore: 80,
    riskLevel: "Moderate",
    sentiment: "Positive",
    description: "Bharti Airtel Limited is an Indian multinational telecommunications services company based in New Delhi. It operates in 18 countries across South Asia and Africa, as well as the Channel Islands.",
    foundedYear: 1995,
    headquarters: "New Delhi, Delhi",
    promoterHolding: 54.73,
    institutionalHolding: 36.20,
    publicHolding: 9.07,
    peRatio: 45.2,
    pbRatio: 7.2,
    pegRatio: 1.8,
    evEbitda: 10.4,
    eps: 31.42,
    dividendYield: 0.56,
    roe: 16.5,
    roce: 14.8,
    debtToEquity: 1.85,
    currentRatio: 0.65,
    interestCoverage: 3.5,
    freeCashFlow: 16800,
    high52Week: 1540.00,
    low52Week: 865.00,
    volume: 5600000,
    swot: {
      strengths: ["Premium subscriber base with highest Industry ARPU", "Robust African operations providing geographic hedge", "Strong fiber-to-the-home (FTTH) and enterprise business segments", "Extensive spectrum holdings across 4G and 5G bands"],
      weaknesses: ["High debt due to spectrum auctions and 5G infrastructure capex", "Low current ratio (0.65) typical for telcos but requires management", "Relatively low return on capital (ROCE ~ 14%)"],
      opportunities: ["Further telecom tariff hikes to boost margins", "Monetization of payment bank and digital offerings", "Data center business growth under Nxtra"],
      risks: ["Intense price competition from Reliance Jio", "High interest rate environment raising refinancing costs", "Regulatory changes in statutory levies (AGR dues)"]
    },
    investmentSignal: {
      status: "Healthy",
      reasons: ["Consistent tariff hikes leading to sector health improvement", "Excellent execution in getting high-paying postpaid users", "African business showing resilient growth"]
    },
    futureOutlook: {
      outlook: "Positive",
      drivers: ["Industry consolidation leaving Airtel in a duopoly position", "Increasing data usage and postpaid conversions", "Growth in broadband and B2B services"],
      catalysts: ["Further mobile tariff hikes of 15-20%", "Deleveraging through sale of tower assets or cash flows", "Listing of Airtel Africa or Airtel Digital businesses"],
      risks: ["Heavy spectrum renewal costs in future auctions", "Any government support to Vodafone Idea shifting competitive dynamics", "Currency depreciation in African markets (e.g. Nigeria)"],
      metricsToWatch: ["ARPU (Average Revenue Per User)", "Churn rate percentage", "Net Debt to EBITDA"],
      industryOutlook: "Indian telecom is structurally stable after years of tariff wars. Two dominant players control 90%+ market share, leading to improved pricing power."
    },
    sentimentAnalysis: {
      score: 79,
      signal: "Positive",
      explanation: "Market sentiment is positive following recent tariff hikes and a growing postpaid customer base.",
      bullishFactors: ["Industry ARPU trend is pointing upward", "Consistent institutional backing", "Resilient home broadband growth"],
      bearishFactors: ["High debt overhang from past spectrum payments"]
    },
    risksAnalysis: {
      overallRisk: "Moderate",
      businessRisk: "Low", // Duopoly market
      financialRisk: "High", // High debt-to-equity and interest costs
      valuationRisk: "Moderate",
      marketRisk: "Moderate",
      regulatoryRisk: "Moderate",
      explanation: "High leverage and heavy spectrum payment obligations present financial risk. However, stable duopolistic operations and cash generation mitigate business concerns."
    }
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd",
    price: 3540.80,
    change: -15.20,
    changePercent: -0.43,
    marketCap: 498300,
    capType: "Large Cap",
    sector: "Infrastructure",
    industry: "Engineering & Construction",
    researchScore: 82,
    riskLevel: "Moderate",
    sentiment: "Positive",
    description: "Larsen & Toubro Limited, commonly known as L&T, is an Indian multinational conglomerate company, with business interests in engineering, construction, manufacturing, technology, information technology and financial services.",
    foundedYear: 1946,
    headquarters: "Mumbai, Maharashtra",
    promoterHolding: 0.00, // No promoter, institution and public held (L&T employees trust holds shares)
    institutionalHolding: 78.40,
    publicHolding: 21.60,
    peRatio: 38.4,
    pbRatio: 5.4,
    pegRatio: 2.3,
    evEbitda: 18.5,
    eps: 92.20,
    dividendYield: 0.82,
    roe: 15.2,
    roce: 13.5,
    debtToEquity: 1.35, // Includes financial subsidiary debt
    currentRatio: 1.38,
    interestCoverage: 4.8,
    freeCashFlow: 9500,
    high52Week: 3948.00,
    low52Week: 2650.00,
    volume: 1200000,
    swot: {
      strengths: ["Unrivaled proxy for India's capital expenditure and infrastructure growth", "Record-high order book exceeding ₹4.5 Lakh Crore", "Strong execution capabilities in mega-scale defense, power, and metro projects", "Valuable IT subsidiaries (LTIMindtree, LTTS) providing tech cash flow"],
      weaknesses: ["Working capital intensive engineering business slowing cash conversion", "Low operating margins in infrastructure segment (~7-8%)", "Dependence on Middle East contracts which are sensitive to oil prices"],
      opportunities: ["Indian government's massive National Infrastructure Pipeline (NIP)", "Green hydrogen and solar EPC contract expansion", "Defense manufacturing order wins under 'Make in India' policy"],
      risks: ["Execution delays due to land acquisition or environmental clearances", "Rise in raw materials (steel, cement) compressing fixed-price contract margins", "Geopolitical issues in the Middle East slowing project approvals"]
    },
    investmentSignal: {
      status: "Healthy",
      reasons: ["Record order book provides 3+ years of revenue visibility", "Strong execution track record", "Direct beneficiary of domestic public capex"]
    },
    futureOutlook: {
      outlook: "Positive",
      drivers: ["Domestic infrastructure push (highways, railways, water networks)", "Middle East hydrocarbon and infrastructure orders (Saudi Vision 2030)", "Expansion in defense electronics and systems"],
      catalysts: ["Announcements of mega infrastructure project wins ($500M+)", "Successful monetization of non-core assets (e.g. Hyderabad Metro)", "Reduction in working capital cycle time"],
      risks: ["Slowdown in government capital allocations post elections", "Prolonged high interest rates affecting corporate capital spend", "Labor shortage at mega construction sites"],
      metricsToWatch: ["Order Inflow growth rate", "Working Capital as % of Sales", "Infrastructure segment margin"],
      industryOutlook: "Infrastructure and engineering sectors are experiencing a major upcycle in India and the Gulf region, backed by government capital outlays and private capex."
    },
    sentimentAnalysis: {
      score: 77,
      signal: "Positive",
      explanation: "Market sentiment is positive due to continuous order wins and strong execution guidance, though valuation limits upside slightly.",
      bullishFactors: ["Record order book value", "Defense orders picking up pace", "Solid IT subsidiary performance"],
      bearishFactors: ["Margin pressure due to legacy low-margin projects"]
    },
    risksAnalysis: {
      overallRisk: "Moderate",
      businessRisk: "Moderate", // Execution and commodity dependencies
      financialRisk: "Moderate",
      valuationRisk: "Moderate",
      marketRisk: "Moderate",
      regulatoryRisk: "Moderate",
      explanation: "L&T faces moderate business risk from project delays and raw material pricing. Financial risk is moderate since part of the debt belongs to its financial services division which is self-funding."
    }
  }
];

// Generate index data for the dashboard
export const getIndicesData = (): IndexData[] => [
  {
    name: "NIFTY 50",
    symbol: "^NSEI",
    value: 24350.20,
    change: 180.45,
    changePercent: 0.75,
    history: [24150, 24200, 24110, 24280, 24310, 24290, 24350],
  },
  {
    name: "SENSEX",
    symbol: "^BSESN",
    value: 79820.50,
    change: 540.30,
    changePercent: 0.68,
    history: [79200, 79400, 79150, 79650, 79700, 79600, 79820],
  },
  {
    name: "NIFTY Bank",
    symbol: "^NSEBANK",
    value: 50850.80,
    change: 485.60,
    changePercent: 0.96,
    history: [50200, 50400, 50100, 50600, 50750, 50620, 50850],
  },
  {
    name: "NIFTY IT",
    symbol: "CNXIT",
    value: 39420.15,
    change: 620.45,
    changePercent: 1.60,
    history: [38600, 38900, 38700, 39100, 39250, 39100, 39420],
  },
  {
    name: "NIFTY Auto",
    symbol: "CNXAUTO",
    value: 25480.60,
    change: 320.15,
    changePercent: 1.27,
    history: [25100, 25250, 25150, 25300, 25400, 25350, 25480],
  },
  {
    name: "NIFTY Pharma",
    symbol: "CNXPHARMA",
    value: 21150.35,
    change: -45.20,
    changePercent: -0.21,
    history: [21250, 21200, 21280, 21210, 21190, 21230, 21150],
  },
  {
    name: "NIFTY Financial Services",
    symbol: "CNXFIN",
    value: 23680.40,
    change: 195.80,
    changePercent: 0.83,
    history: [23450, 23520, 23410, 23590, 23640, 23580, 23680]
  }
];

// Helper: Programmatically generate financial statements
const generateFinancialStatements = (
  baseRevenue: number, 
  operatingMarginPercent: number, 
  netMarginPercent: number, 
  symbol: string
) => {
  const annual: any[] = [];
  const quarterly: any[] = [];

  const years = ["FY2021", "FY2022", "FY2023", "FY2024", "FY2025"];
  const quarters = ["Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26"];

  // Generate Annual
  let rev = baseRevenue * 0.7; // Start lower in FY2021
  years.forEach((yr, idx) => {
    // Standard growth rate of ~10% to 25% depending on stock
    const growth = 1.08 + (idx * 0.03) + (symbol === "TATAMOTORS" || symbol === "RELIANCE" ? 0.08 : 0.03);
    rev = parseFloat((rev * growth).toFixed(2));
    
    const opProfit = parseFloat((rev * (operatingMarginPercent / 100)).toFixed(2));
    const expenses = parseFloat((rev - opProfit).toFixed(2));
    const interest = parseFloat((opProfit * (symbol === "BHARTIALIRT" || symbol === "SBIN" ? 0.25 : 0.05)).toFixed(2));
    const pbt = parseFloat((opProfit - interest).toFixed(2));
    const netProfit = parseFloat((pbt * (netMarginPercent / operatingMarginPercent)).toFixed(2));
    const eps = parseFloat((netProfit / (baseRevenue / 100)).toFixed(2)); // approximation

    // Balance Sheet items
    const assets = parseFloat((rev * 1.5).toFixed(2));
    const equity = parseFloat((assets * 0.4).toFixed(2));
    const debt = parseFloat((equity * (symbol === "BHARTIALIRT" ? 1.5 : (symbol === "RELIANCE" ? 0.4 : 0.05))).toFixed(2));
    const liabilities = parseFloat((assets - equity).toFixed(2));
    const cash = parseFloat((assets * 0.08).toFixed(2));

    // Cash flow items
    const operatingCashFlow = parseFloat((netProfit * 1.25).toFixed(2));
    const investingCashFlow = parseFloat((-operatingCashFlow * 0.6).toFixed(2));
    const financingCashFlow = parseFloat((-operatingCashFlow * 0.3).toFixed(2));
    const freeCashFlow = parseFloat((operatingCashFlow + investingCashFlow).toFixed(2));

    annual.push({
      period: yr,
      revenue: rev,
      expenses,
      operatingProfit: opProfit,
      interest,
      profitBeforeTax: pbt,
      netProfit,
      eps,
      assets,
      liabilities,
      equity,
      debt,
      cash,
      operatingCashFlow,
      investingCashFlow,
      financingCashFlow,
      freeCashFlow
    });
  });

  // Generate Quarterly
  quarters.forEach((qtr) => {
    const qRev = parseFloat((rev / 4 * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2));
    const qOpProfit = parseFloat((qRev * (operatingMarginPercent / 100)).toFixed(2));
    const qExpenses = parseFloat((qRev - qOpProfit).toFixed(2));
    const qInterest = parseFloat((qOpProfit * (symbol === "BHARTIALIRT" || symbol === "SBIN" ? 0.25 : 0.05)).toFixed(2));
    const qPbt = parseFloat((qOpProfit - qInterest).toFixed(2));
    const qNetProfit = parseFloat((qPbt * (netMarginPercent / operatingMarginPercent)).toFixed(2));
    const qEps = parseFloat((qNetProfit / (baseRevenue / 400)).toFixed(2));

    const assets = parseFloat((qRev * 4 * 1.5).toFixed(2));
    const equity = parseFloat((assets * 0.4).toFixed(2));
    const debt = parseFloat((equity * (symbol === "BHARTIALIRT" ? 1.5 : (symbol === "RELIANCE" ? 0.4 : 0.05))).toFixed(2));
    const liabilities = parseFloat((assets - equity).toFixed(2));
    const cash = parseFloat((assets * 0.08).toFixed(2));

    const operatingCashFlow = parseFloat((qNetProfit * 1.25).toFixed(2));
    const investingCashFlow = parseFloat((-operatingCashFlow * 0.6).toFixed(2));
    const financingCashFlow = parseFloat((-operatingCashFlow * 0.3).toFixed(2));
    const freeCashFlow = parseFloat((operatingCashFlow + investingCashFlow).toFixed(2));

    quarterly.push({
      period: qtr,
      revenue: qRev,
      expenses: qExpenses,
      operatingProfit: qOpProfit,
      interest: qInterest,
      profitBeforeTax: qPbt,
      netProfit: qNetProfit,
      eps: qEps,
      assets,
      liabilities,
      equity,
      debt,
      cash,
      operatingCashFlow,
      investingCashFlow,
      financingCashFlow,
      freeCashFlow
    });
  });

  return { annual, quarterly };
};

// Generate Full StockDetails using base definitions and generators
export const getFullStockDetails = (symbol: string): StockDetails | undefined => {
  const base = baseStocksData.find(s => s.symbol === symbol.toUpperCase());
  if (!base) return undefined;

  // Revenue benchmarks in Crores
  let baseRevenue = 150000;
  let opMargin = 15;
  let netMargin = 10;

  if (symbol === "RELIANCE") { baseRevenue = 900000; opMargin = 16; netMargin = 8; }
  else if (symbol === "TCS") { baseRevenue = 240000; opMargin = 26; netMargin = 20; }
  else if (symbol === "INFY") { baseRevenue = 150000; opMargin = 22; netMargin = 17; }
  else if (symbol === "HDFCBANK") { baseRevenue = 250000; opMargin = 45; netMargin = 25; }
  else if (symbol === "ICICIBANK") { baseRevenue = 180000; opMargin = 47; netMargin = 27; }
  else if (symbol === "SBIN") { baseRevenue = 400000; opMargin = 32; netMargin = 15; }
  else if (symbol === "ITC") { baseRevenue = 70000; opMargin = 36; netMargin = 28; }
  else if (symbol === "TATAMOTORS") { baseRevenue = 430000; opMargin = 12; netMargin = 7; }
  else if (symbol === "BHARTIALIRT") { baseRevenue = 150000; opMargin = 50; netMargin = 14; }
  else if (symbol === "LT") { baseRevenue = 220000; opMargin = 11; netMargin = 6; }

  const incomeStatement = generateFinancialStatements(baseRevenue, opMargin, netMargin, symbol);
  const balanceSheet = generateFinancialStatements(baseRevenue, opMargin, netMargin, symbol);
  const cashFlow = generateFinancialStatements(baseRevenue, opMargin, netMargin, symbol);

  // Filter out competitors from the 10 base stocks
  const competitors: any[] = baseStocksData
    .filter(s => s.symbol !== symbol && (
      (base.sector === s.sector) || 
      (base.sector.includes("Financial") && s.sector.includes("Financial")) ||
      (base.sector.includes("IT") && s.sector.includes("IT")) ||
      (symbol === "TCS" || symbol === "INFY" ? s.symbol === "TCS" || s.symbol === "INFY" : false) ||
      (symbol === "HDFCBANK" || symbol === "ICICIBANK" || symbol === "SBIN" ? ["HDFCBANK", "ICICIBANK", "SBIN"].includes(s.symbol) : false)
    ))
    .slice(0, 3)
    .map(s => ({
      symbol: s.symbol,
      name: s.name,
      price: s.price,
      marketCap: s.marketCap,
      peRatio: s.peRatio,
      pbRatio: s.pbRatio,
      roe: s.roe,
      roce: s.roce,
      debtToEquity: s.debtToEquity,
      revenueGrowth: s.symbol === "TATAMOTORS" ? 22.5 : 12.4,
      profitGrowth: s.symbol === "TATAMOTORS" ? 45.2 : 11.8,
      dividendYield: s.dividendYield,
      researchScore: s.researchScore
    }));

  // If no sector competitors, grab any 3 large stocks
  if (competitors.length === 0) {
    baseStocksData.filter(s => s.symbol !== symbol).slice(0, 3).forEach(s => {
      competitors.push({
        symbol: s.symbol,
        name: s.name,
        price: s.price,
        marketCap: s.marketCap,
        peRatio: s.peRatio,
        pbRatio: s.pbRatio,
        roe: s.roe,
        roce: s.roce,
        debtToEquity: s.debtToEquity,
        revenueGrowth: 10.5,
        profitGrowth: 9.8,
        dividendYield: s.dividendYield,
        researchScore: s.researchScore
      });
    });
  }

  // Generate technical indicators based on actual current stats
  const priceVs20 = base.price > base.price * 0.98 ? 'Above' : 'Below';
  const priceVs50 = base.price > base.price * 0.96 ? 'Above' : 'Below';
  const priceVs200 = base.price > base.price * 0.92 ? 'Above' : 'Below';

  const technicals = {
    rsi: symbol === "TATAMOTORS" ? 68 : (symbol === "INFY" ? 44 : 58),
    rsiSignal: (symbol === "TATAMOTORS" ? "Overbought" : (symbol === "INFY" ? "Oversold" : "Neutral")) as any,
    macd: {
      macdLine: 4.5,
      signalLine: 2.1,
      histogram: 2.4,
      signal: (symbol === "TATAMOTORS" ? 'Bullish' : (symbol === "INFY" ? 'Bearish' : 'Neutral')) as any
    },
    movingAverages: {
      dma20: parseFloat((base.price * 0.98).toFixed(2)),
      dma50: parseFloat((base.price * 0.96).toFixed(2)),
      dma100: parseFloat((base.price * 0.93).toFixed(2)),
      dma200: parseFloat((base.price * 0.88).toFixed(2)),
      priceVsDma20: priceVs20 as any,
      priceVsDma50: priceVs50 as any,
      priceVsDma200: priceVs200 as any
    },
    supportLevels: [parseFloat((base.price * 0.95).toFixed(2)), parseFloat((base.price * 0.90).toFixed(2))],
    resistanceLevels: [parseFloat((base.price * 1.05).toFixed(2)), parseFloat((base.price * 1.10).toFixed(2))],
    volatility: (symbol === "TATAMOTORS" || symbol === "BHARTIALIRT" ? 'High' : (symbol === "TCS" || symbol === "ITC" ? 'Low' : 'Medium')) as any
  };

  const scoreBreakdown = {
    fundamental: base.researchScore + 2,
    financialHealth: base.debtToEquity < 0.2 ? 90 : (base.debtToEquity > 1.5 ? 65 : 80),
    valuation: base.peRatio < 20 ? 85 : (base.peRatio > 40 ? 55 : 72),
    growth: symbol === "TATAMOTORS" || symbol === "RELIANCE" ? 88 : 78,
    profitability: base.roe > 30 ? 92 : (base.roe > 15 ? 82 : 70),
    technical: technicals.rsi > 60 ? 85 : (technicals.rsi < 45 ? 62 : 75),
    sentiment: base.sentiment === 'Positive' ? 82 : 68,
    risk: base.riskLevel === 'Low' ? 90 : (base.riskLevel === 'High' ? 55 : 75),
    explanation: `InvestInsight overall score of ${base.researchScore} is computed by weighing fundamental strengths (${base.roe}% ROE) against debt obligations and valuation multiples (PE ratio of ${base.peRatio}).`
  };

  return {
    ...base,
    description: base.description,
    foundedYear: base.foundedYear,
    headquarters: base.headquarters,
    promoterHolding: base.promoterHolding,
    institutionalHolding: base.institutionalHolding,
    publicHolding: base.publicHolding,
    peRatio: base.peRatio,
    pbRatio: base.pbRatio,
    pegRatio: base.pegRatio,
    evEbitda: base.evEbitda,
    eps: base.eps,
    dividendYield: base.dividendYield,
    roe: base.roe,
    roce: base.roce,
    debtToEquity: base.debtToEquity,
    currentRatio: base.currentRatio,
    interestCoverage: base.interestCoverage,
    freeCashFlow: base.freeCashFlow,
    high52Week: base.high52Week,
    low52Week: base.low52Week,
    volume: base.volume,
    researchScoreBreakdown: scoreBreakdown,
    financials: {
      incomeStatement: { annual: incomeStatement.annual, quarterly: incomeStatement.quarterly },
      balanceSheet: { annual: balanceSheet.annual, quarterly: balanceSheet.quarterly },
      cashFlow: { annual: cashFlow.annual, quarterly: cashFlow.quarterly }
    },
    technicals,
    swot: base.swot,
    competitors,
    risksAnalysis: base.risksAnalysis,
    futureOutlook: base.futureOutlook,
    sentimentAnalysis: base.sentimentAnalysis,
    historicalPrice: generateHistoricalPrice(base.price)
  };
};

// Mock News Data
export const mockNewsData: NewsItem[] = [
  {
    id: "n1",
    title: "Nifty IT Index Gains 1.6% Led by TCS and Infosys Deal Wins",
    source: "Moneycontrol",
    time: "2026-08-21T15:30:00Z",
    summary: "Indian IT stocks surged today after TCS announced a new multi-million dollar cloud transformation contract in Europe and Infosys expanded its Topaz AI partnership.",
    category: "Market",
    url: "https://www.moneycontrol.com"
  },
  {
    id: "n2",
    title: "Reliance Industries Initiates Trial Operations at Jamnagar Green Energy Gigafactories",
    source: "ET Now",
    time: "2026-08-21T12:00:00Z",
    symbol: "RELIANCE",
    summary: "Reliance Industries has commenced trial productions at its new solar panel and green hydrogen electrolyzer gigafactories in Jamnagar, keeping it on track for commercial launch by late 2026.",
    category: "Company",
    url: "https://economictimes.indiatimes.com"
  },
  {
    id: "n3",
    title: "HDFC Bank Mobilizes Over ₹45,000 Crore in Deposits in Q1, NIM Pressure Eases",
    source: "BloombergQuint",
    time: "2026-08-20T09:15:00Z",
    symbol: "HDFCBANK",
    summary: "HDFC Bank reported high deposit mobilization numbers in the recent quarter, easing analyst concerns over credit-to-deposit ratios and signaling margins recovery in upcoming quarters.",
    category: "Earnings",
    url: "https://www.bqprime.com"
  },
  {
    id: "n4",
    title: "TCS Secures Massive $1.5 Billion Strategic Digital Transformation Mandate with EuroCorp",
    source: "CNBC TV18",
    time: "2026-08-20T08:00:00Z",
    symbol: "TCS",
    summary: "Tata Consultancy Services won a major long-term digital platform contract with EuroCorp to streamline operations using enterprise cloud and generative AI systems.",
    category: "Company",
    url: "https://www.cnbctv18.com"
  },
  {
    id: "n5",
    title: "Tata Motors Board Approves PV and CV Business Demerger Ratio",
    source: "Business Standard",
    time: "2026-08-19T14:45:00Z",
    symbol: "TATAMOTORS",
    summary: "The demerger of Tata Motors into Passenger Vehicles and Commercial Vehicles entities is proceeding smoothly, with the board finalizing the share allotment ratio for existing shareholders.",
    category: "Corporate Action" as any,
    url: "https://www.business-standard.com"
  },
  {
    id: "n6",
    title: "RBI Holds Repo Rate at 6.5%, Maintains 'Withdrawal of Accommodation' Stance",
    source: "RBI Press Release",
    time: "2026-08-18T10:00:00Z",
    summary: "The Reserve Bank of India Monetary Policy Committee has decided to keep the repo rate unchanged, citing inflation management as the primary focus while supporting GDP growth projection at 7.2%.",
    category: "Regulatory",
    url: "https://www.rbi.org.in"
  },
  {
    id: "n7",
    title: "ITC Hotstone Demerger Receives Approval From Stock Exchanges",
    source: "Livemint",
    time: "2026-08-18T11:15:00Z",
    symbol: "ITC",
    summary: "ITC Limited's scheme of arrangement to demerge its Hotels business under ITC Hotels Ltd has received 'No Objection' letters from NSE and BSE, paving the way for NCLT filings.",
    category: "Regulatory",
    url: "https://www.livemint.com"
  },
  {
    id: "n8",
    title: "Telecom Tariff Hikes Push Bharti Airtel ARPU Closer to ₹240 Target",
    source: "Financial Express",
    time: "2026-08-17T09:30:00Z",
    symbol: "BHARTIALIRT",
    summary: "Brokerage houses are bullish on Bharti Airtel as recent price hikes across prepaid plans are starting to reflect in higher average revenue per user (ARPU), backing future capex.",
    category: "Sector",
    url: "https://www.financialexpress.com"
  }
];

// Learn Topics Data
export const mockLearnTopics: LearnTopic[] = [
  {
    id: "l1",
    title: "What is P/E Ratio (Price-to-Earnings)?",
    category: "Valuation",
    summary: "P/E ratio measures a company's current share price relative to its per-share earnings (EPS). It helps determine if a stock is overvalued or undervalued.",
    content: "The Price-to-Earnings (P/E) ratio is the most widely used valuation metric in the stock market. It tells you how much investors are willing to pay for each rupee of earnings generated by the company. A high P/E ratio could mean that a stock's price is high relative to earnings and possibly overvalued, or it could mean that investors expect high growth rates in the future. Conversely, a low P/E could indicate undervaluation or a sign of trouble in the business model (value trap). It is always best to compare P/E ratios of companies in the same sector (e.g. comparing TCS P/E with Infosys P/E, rather than comparing TCS with HDFC Bank).",
    formula: "P/E Ratio = Market Price per Share / Earnings Per Share (EPS)",
    example: "If TCS is trading at a share price of ₹4,000 and its EPS (Earnings per share) is ₹100, its P/E ratio is 40. This means investors are paying ₹40 for every ₹1 of TCS earnings."
  },
  {
    id: "l2",
    title: "Understanding ROE (Return on Equity)",
    category: "Fundamentals",
    summary: "ROE measures a corporation's profitability by revealing how much profit a company generates with the money shareholders have invested.",
    content: "Return on Equity (ROE) is a measure of financial performance calculated by dividing net income by shareholders' equity. Because shareholders' equity is equal to a company’s assets minus its debt, ROE is considered the return on net assets. ROE is expressed as a percentage and is highly useful for checking how efficiently a company's management is deploying the capital provided by shareholders. A consistently rising ROE indicates that the company is generating high value without requiring heavy capital diluting. Generally, an ROE above 15-20% is considered excellent in Indian markets.",
    formula: "ROE (%) = (Net Income / Shareholders' Equity) * 100",
    example: "If a company has a Net Profit of ₹150 Crore and Shareholders' Equity of ₹1,000 Crore, its ROE is 15%. This means for every ₹100 of equity, the company generated ₹15 in profit."
  },
  {
    id: "l3",
    title: "What is ROCE (Return on Capital Employed)?",
    category: "Fundamentals",
    summary: "ROCE is a financial ratio that measures a company's profitability and capital efficiency. It considers both debt and equity.",
    content: "Return on Capital Employed (ROCE) is a crucial metric, especially for capital-intensive sectors. Unlike ROE which only looks at shareholder equity, ROCE evaluates how well a company generates profits from its total capital employed, which includes both Equity and long-term Debt liabilities. Comparing ROCE with the company's cost of borrowing is critical: if ROCE is lower than the rate at which the company borrows money, the company is destroying value as it expands. It is a highly reliable metric to detect highly efficient businesses and compare companies with different debt levels.",
    formula: "ROCE (%) = (EBIT / Capital Employed) * 100 \n*Where Capital Employed = Total Assets - Current Liabilities (or Equity + Debt)",
    example: "If a company has an EBIT (Earnings before Interest and Taxes) of ₹200 Crore, Total Assets of ₹1,200 Crore, and Current Liabilities of ₹200 Crore, its Capital Employed is ₹1,000 Crore. The ROCE is (200 / 1000) * 100 = 20%."
  },
  {
    id: "l4",
    title: "Market Capitalization: Small, Mid, and Large Cap",
    category: "General",
    summary: "Market capitalization is the total value of a company's shares. In India, SEBI defines classifications based on market cap size ranking.",
    content: "Market capitalization represents the market value of a company's outstanding shares. In the Indian stock market, SEBI (Securities and Exchange Board of India) categorizes stocks into three categories to help mutual funds and retail investors manage risk: \n1. Large Cap: Top 100 companies by market capitalization. These are stable, blue-chip companies with established businesses (e.g. Reliance, TCS, HDFC Bank).\n2. Mid Cap: Companies ranked from 101 to 250 by market capitalization. These have moderate stability but offer higher growth potential.\n3. Small Cap: Companies ranked 251st and below. These are smaller firms, often highly volatile but capable of rapid long-term compound growth. \nLarge Caps offer stability with low risk; Small Caps offer high growth but present high risk of capital loss.",
    formula: "Market Capitalization = Current Share Price * Total Outstanding Shares",
    example: "If a company has 10 Crore shares outstanding and its current stock price is ₹500, its market capitalization is ₹5,000 Crore (which classifies it as a Small Cap in India, where Large-caps are usually above ₹50,000 Crore)."
  },
  {
    id: "l5",
    title: "What is RSI (Relative Strength Index)?",
    category: "Technicals",
    summary: "RSI is a technical momentum indicator that measures the speed and change of price movements to identify overbought or oversold conditions.",
    content: "The Relative Strength Index (RSI) is a popular technical oscillator that ranges from 0 to 100. It is used to determine whether a stock is overbought (RSI > 70) or oversold (RSI < 30). An overbought signal suggests that the stock has run up too fast and may experience a short-term price correction or pullback. An oversold signal suggests that the stock has dropped quickly and might be due for a technical bounce. However, in strong bull markets, a stock can remain overbought for long periods, and in strong bear trends, it can remain oversold, so RSI should always be used alongside other indicators (like MACD or Moving Averages).",
    formula: "RSI = 100 - [100 / (1 + RS)] \n*Where RS (Relative Strength) = Average Gain of Up periods / Average Loss of Down periods",
    example: "If a stock's price has been rising steadily with minor losses over 14 days, the average gain will be much higher than the average loss, pushing the RSI to 75. This flags the stock as technically 'Overbought' in the short term."
  }
];
