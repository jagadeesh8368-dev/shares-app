import { StockDetails, StockSummary, IndexData, NewsItem, LearnTopic } from '../types';
import { baseStocksData, getIndicesData, getFullStockDetails, mockNewsData, mockLearnTopics } from './mockData';
import { fetchGlobalQuote, fetchCompanyOverview } from './alphaVantageService';
import { isLiveNewsActive, fetchMarketNews, fetchCompanyNews } from './newsService';

export interface ScreenerFilters {
  capType?: string[];
  sector?: string[];
  peRange?: [number, number]; // [min, max]
  roeMin?: number;
  roceMin?: number;
  debtToEquityMax?: number;
  dividendYieldMin?: number;
  rsiRange?: [number, number];
  aboveDma50?: boolean;
  aboveDma200?: boolean;
}

// Check if we are running in Live API mode or Mock/Demo mode
export const isLiveAPIDataActive = (): boolean => {
  const provider = import.meta.env.VITE_DATA_PROVIDER;
  return provider !== 'DEMO' && !!import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
};

// Fetch Market Indices
export const getIndices = async (): Promise<IndexData[]> => {
  // Simulating API Latency
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getIndicesData();
};

// Search Stocks by symbol, name, sector, or industry
export const searchStocks = async (query: string): Promise<StockSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  
  let baseList = baseStocksData;
  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    baseList = baseStocksData.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q)
    );
  }

  const results = baseList.map(s => ({
    symbol: s.symbol,
    name: s.name,
    price: s.price,
    change: s.change,
    changePercent: s.changePercent,
    marketCap: s.marketCap,
    capType: s.capType,
    sector: s.sector,
    industry: s.industry,
    researchScore: s.researchScore,
    riskLevel: s.riskLevel,
    sentiment: s.sentiment
  }));

  // Optionally fetch live prices for search results if needed.
  // Warning: This could hit rate limits very quickly on Alpha Vantage.
  // We'll skip live price fetching for search to save quota, or just fetch the first 2.
  if (isLiveAPIDataActive() && results.length > 0) {
    try {
      // Just fetch for top 2 to avoid instant rate limiting
      for (let i = 0; i < Math.min(2, results.length); i++) {
        const quote = await fetchGlobalQuote(results[i].symbol);
        if (quote) {
          results[i].price = quote.price;
          results[i].change = quote.change;
          results[i].changePercent = quote.changePercent;
        }
      }
    } catch(e) {
      console.warn("Rate limit on search live fetch", e);
    }
  }

  return results;
};

// Fetch Detailed Stock Data
export const getStockDetails = async (symbol: string): Promise<StockDetails | null> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const details = getFullStockDetails(symbol);
  
  if (!details) return null;

  if (isLiveAPIDataActive()) {
    try {
      const quote = await fetchGlobalQuote(symbol);
      const overview = await fetchCompanyOverview(symbol);

      if (quote) {
        details.price = quote.price;
        details.change = quote.change;
        details.changePercent = quote.changePercent;
        details.volume = quote.volume;
        details.high52Week = Math.max(details.high52Week, quote.high);
        details.low52Week = Math.min(details.low52Week, quote.low);
      }
      
      if (overview) {
        // Convert market cap to roughly Crores if needed, or just use raw. Mock data uses Crores.
        // Assuming Alpha Vantage returns standard USD. For demo, we just use the API values directly.
        details.marketCap = overview.marketCap ? overview.marketCap / 10000000 : details.marketCap; 
        details.peRatio = overview.peRatio || details.peRatio;
        details.dividendYield = overview.dividendYield || details.dividendYield;
        details.pbRatio = overview.pbRatio || details.pbRatio;
        details.roe = overview.roe || details.roe;
        details.eps = overview.eps || details.eps;
      }
    } catch (error) {
      console.warn("Alpha Vantage API fetch failed or rate limited. Falling back to mock data.", error);
    }
  }

  return details;
};

// Fetch News (filtered by symbol if provided)
export const getNews = async (symbol?: string): Promise<NewsItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  if (isLiveNewsActive()) {
    try {
      const liveNews = symbol 
        ? await fetchCompanyNews(symbol) 
        : await fetchMarketNews();
        
      if (liveNews && liveNews.length > 0) {
        return liveNews;
      }
    } catch (error) {
      console.warn("Live news fetch failed, falling back to mock data", error);
    }
  }

  // Fallback to mock data
  if (!symbol) {
    return mockNewsData;
  }
  return mockNewsData.filter(n => n.symbol === symbol.toUpperCase() || !n.symbol);
};

// Get Learn Library Topics
export const getLearnTopics = async (): Promise<LearnTopic[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockLearnTopics;
};

// Run stock screening queries dynamically
export const getScreenerStocks = async (
  filters: ScreenerFilters,
  sortBy: string = 'researchScore',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<StockDetails[]> => {
  
  // Wait to get all details, now using the updated getStockDetails which includes live data
  const detailedStocksPromise = baseStocksData.map(s => getStockDetails(s.symbol));
  const detailedStocksResults = await Promise.all(detailedStocksPromise);
  
  const detailedStocks = detailedStocksResults.filter(s => s !== null) as StockDetails[];
  
  const filtered = detailedStocks.filter(stock => {
    // 1. Cap Type Filter
    if (filters.capType && filters.capType.length > 0) {
      if (!filters.capType.includes(stock.capType)) return false;
    }

    // 2. Sector Filter
    if (filters.sector && filters.sector.length > 0) {
      if (!filters.sector.includes(stock.sector)) return false;
    }

    // 3. PE Range Filter
    if (filters.peRange) {
      const [min, max] = filters.peRange;
      if (stock.peRatio < min || stock.peRatio > max) return false;
    }

    // 4. ROE Minimum
    if (filters.roeMin !== undefined) {
      if (stock.roe < filters.roeMin) return false;
    }

    // 5. ROCE Minimum
    if (filters.roceMin !== undefined) {
      if (stock.roce < filters.roceMin) return false;
    }

    // 6. Debt-to-Equity Maximum
    if (filters.debtToEquityMax !== undefined) {
      if (stock.debtToEquity > filters.debtToEquityMax) return false;
    }

    // 7. Dividend Yield Minimum
    if (filters.dividendYieldMin !== undefined) {
      if (stock.dividendYield < filters.dividendYieldMin) return false;
    }

    // 8. RSI Range Filter
    if (filters.rsiRange) {
      const [min, max] = filters.rsiRange;
      if (stock.technicals.rsi < min || stock.technicals.rsi > max) return false;
    }

    // 9. Moving Averages Status
    if (filters.aboveDma50) {
      if (stock.technicals.movingAverages.priceVsDma50 !== 'Above') return false;
    }
    if (filters.aboveDma200) {
      if (stock.technicals.movingAverages.priceVsDma200 !== 'Above') return false;
    }

    return true;
  });

  // Sort
  filtered.sort((a: any, b: any) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    
    // Handle nested technical sort fields
    if (sortBy === 'rsi') {
      valA = a.technicals.rsi;
      valB = b.technicals.rsi;
    }

    // Compare
    if (valA === undefined) return 1;
    if (valB === undefined) return -1;

    if (typeof valA === 'string') {
      return sortOrder === 'desc' 
        ? valB.localeCompare(valA)
        : valA.localeCompare(valB);
    } else {
      return sortOrder === 'desc' 
        ? valB - valA 
        : valA - valB;
    }
  });

  return filtered;
};

// Compare side-by-side
export const compareStocks = async (symbols: string[]): Promise<StockDetails[]> => {
  const stocks: StockDetails[] = [];
  
  for (const sym of symbols) {
    const detail = await getStockDetails(sym);
    if (detail) {
      stocks.push(detail);
    }
  }
  
  return stocks;
};
