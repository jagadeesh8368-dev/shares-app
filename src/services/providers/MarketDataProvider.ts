import { StockSummary, StockDetails, IndexData, NewsItem, LearnTopic } from '../../types';

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

export interface IMarketDataProvider {
  getIndices(): Promise<IndexData[]>;
  searchStocks(query: string): Promise<StockSummary[]>;
  getStockDetails(symbol: string): Promise<StockDetails | null>;
  getNews(symbol?: string): Promise<NewsItem[]>;
  getLearnTopics(): Promise<LearnTopic[]>;
  getScreenerStocks(filters: ScreenerFilters, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<StockDetails[]>;
  compareStocks(symbols: string[]): Promise<StockDetails[]>;
}
