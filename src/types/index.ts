// TypeScript interfaces for InvestInsight India Stock Research App

export interface IndexData {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  history: number[]; // Sparkline data points
}

export type CapType = 'Large Cap' | 'Mid Cap' | 'Small Cap';
export type SentimentType = 'Positive' | 'Neutral' | 'Negative';
export type RiskLevelType = 'Low' | 'Moderate' | 'High';
export type ResearchSignalType = 'Strong Fundamentals' | 'Healthy' | 'Watchlist' | 'Caution' | 'High Risk';
export type OutlookType = 'Positive' | 'Neutral' | 'Cautious';

export interface StockSummary {
  symbol: string;
  bseCode?: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number; // in Crores
  capType: CapType;
  sector: string;
  industry: string;
  researchScore: number;
  riskLevel: RiskLevelType;
  sentiment: SentimentType;
}

export interface MetricDetail {
  label: string;
  value: string | number;
  category: 'Valuation' | 'Profitability' | 'Growth' | 'Financial Health' | 'Technical';
  explanation?: string;
}

export interface FinancialItem {
  period: string; // e.g. "FY2025" or "Q1 FY26"
  revenue: number; // in Crores
  expenses: number;
  operatingProfit: number;
  interest: number;
  profitBeforeTax: number;
  netProfit: number;
  eps: number;
  // Balance sheet items
  assets?: number;
  liabilities?: number;
  equity?: number;
  debt?: number;
  cash?: number;
  // Cash flow items
  operatingCashFlow?: number;
  investingCashFlow?: number;
  financingCashFlow?: number;
  freeCashFlow?: number;
}

export interface FinancialsGroup {
  annual: FinancialItem[];
  quarterly: FinancialItem[];
}

export interface TechnicalIndicators {
  rsi: number;
  rsiSignal: 'Oversold' | 'Neutral' | 'Overbought';
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
    signal: 'Bullish' | 'Neutral' | 'Bearish';
  };
  movingAverages: {
    dma20: number;
    dma50: number;
    dma100: number;
    dma200: number;
    priceVsDma20: 'Above' | 'Below';
    priceVsDma50: 'Above' | 'Below';
    priceVsDma200: 'Above' | 'Below';
  };
  supportLevels: number[];
  resistanceLevels: number[];
  volatility: 'Low' | 'Medium' | 'High';
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
}

export interface CompetitorComparison {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  revenueGrowth: number;
  profitGrowth: number;
  dividendYield: number;
  researchScore: number;
}

export interface RiskAnalysis {
  overallRisk: RiskLevelType;
  businessRisk: RiskLevelType;
  financialRisk: RiskLevelType;
  valuationRisk: RiskLevelType;
  marketRisk: RiskLevelType;
  sectorRisk?: RiskLevelType;
  regulatoryRisk: RiskLevelType;
  explanation: string;
}

export interface TimeHorizonAnalysis {
  longTerm: {
    outlook: OutlookType;
    positiveFactors: string[];
    negativeFactors: string[];
    catalysts: string[];
    risks: string[];
    metricsToWatch: string[];
  };
  midTerm: {
    outlook: OutlookType;
    positiveFactors: string[];
    negativeFactors: string[];
    catalysts: string[];
    risks: string[];
    metricsToWatch: string[];
  };
  shortTerm: {
    outlook: OutlookType;
    positiveFactors: string[];
    negativeFactors: string[];
    catalysts: string[];
    risks: string[];
    metricsToWatch: string[];
  };
}

export interface FutureOutlook {
  outlook: OutlookType;
  drivers: string[];
  catalysts: string[];
  risks: string[];
  metricsToWatch: string[];
  industryOutlook: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  summary: string;
  symbol?: string; // empty for general market news
  category: 'Company' | 'Market' | 'Sector' | 'Earnings' | 'Regulatory';
  url: string;
}

export interface SentimentAnalysis {
  score: number; // 0-100
  signal: SentimentType;
  explanation: string;
  bullishFactors: string[];
  bearishFactors: string[];
}

export interface GrowthTrend {
  period: string; // "FY2021", "FY2022" etc.
  revenue: number;
  netProfit: number;
  eps: number;
  operatingMargin: number;
  netMargin: number;
}

export interface AlertConfig {
  id: string;
  symbol: string;
  type: 'price_above' | 'price_below' | 'earnings' | 'news' | '52w_high' | '52w_low' | 'volume_spike' | 'fundamental_change';
  threshold?: number;
  enabled: boolean;
  createdAt: string;
  label: string;
}

export interface StockDetails extends StockSummary {
  description: string;
  foundedYear: number;
  headquarters: string;
  promoterHolding: number; // percentage
  institutionalHolding: number; // percentage
  publicHolding: number; // percentage
  
  // Ratios
  peRatio: number;
  pbRatio: number;
  pegRatio: number;
  evEbitda: number;
  eps: number;
  dividendYield: number; // percentage
  roe: number; // percentage
  roce: number; // percentage
  debtToEquity: number;
  currentRatio: number;
  interestCoverage: number;
  freeCashFlow: number; // in Crores
  
  // Range
  high52Week: number;
  low52Week: number;
  volume: number;

  // Data transparency
  lastUpdated?: string; // ISO date string

  // Analysis Breakdown
  researchScoreBreakdown: {
    fundamental: number;
    financialHealth: number;
    valuation: number;
    growth: number;
    profitability: number;
    technical: number;
    sentiment: number;
    risk: number;
    explanation: string;
  };

  investmentSignal: {
    status: ResearchSignalType;
    reasons: string[];
  };

  // Sections
  financials: {
    incomeStatement: FinancialsGroup;
    balanceSheet: FinancialsGroup;
    cashFlow: FinancialsGroup;
  };
  technicals: TechnicalIndicators;
  swot: SWOT;
  competitors: CompetitorComparison[];
  risksAnalysis: RiskAnalysis;
  futureOutlook: FutureOutlook;
  sentimentAnalysis: SentimentAnalysis;
  timeHorizon?: TimeHorizonAnalysis;
  growthTrends?: GrowthTrend[];
  
  // Charts
  historicalPrice: {
    date: string;
    close: number;
    volume: number;
    dma20?: number;
    dma50?: number;
    dma100?: number;
    dma200?: number;
  }[];
}

export interface LearnTopic {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Valuation' | 'Technicals' | 'General';
  summary: string;
  content: string;
  formula?: string;
  example?: string;
}
