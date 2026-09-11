import { NewsItem } from '../types';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export const isLiveNewsActive = (): boolean => {
  return !!API_KEY;
};

const mapFinnhubToNewsItem = (item: any, isCompanyNews: boolean, symbol?: string): NewsItem => {
  const date = new Date(item.datetime * 1000);
  
  // Format a human-readable relative time string
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  let timeStr = date.toISOString();
  if (diffMins < 60) {
    timeStr = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    timeStr = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays <= 7) {
    timeStr = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    timeStr = date.toISOString().split('T')[0];
  }
  
  return {
    id: String(item.id),
    title: item.headline,
    source: item.source,
    time: timeStr,
    summary: item.summary,
    symbol: isCompanyNews ? symbol : undefined,
    category: isCompanyNews ? 'Company' : 'Market',
    url: item.url
  };
};

export const fetchMarketNews = async (): Promise<NewsItem[]> => {
  const cacheKey = `news_market`;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    // Cache market news for 30 minutes
    if (Date.now() - timestamp < 30 * 60 * 1000) {
      return data;
    }
  }

  try {
    const response = await fetch(`${BASE_URL}/news?category=general&token=${API_KEY}`);
    const rawData = await response.json();
    
    if (Array.isArray(rawData)) {
      const newsItems = rawData.slice(0, 20).map(item => mapFinnhubToNewsItem(item, false));
      
      sessionStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: newsItems
      }));
      
      return newsItems;
    }
  } catch (error) {
    console.warn("Failed to fetch market news from Finnhub", error);
  }
  
  return [];
};

export const fetchCompanyNews = async (symbol: string): Promise<NewsItem[]> => {
  const cacheKey = `news_company_${symbol}`;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    // Cache company news for 30 minutes
    if (Date.now() - timestamp < 30 * 60 * 1000) {
      return data;
    }
  }

  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30); // last 30 days
  
  const to = toDate.toISOString().split('T')[0];
  const from = fromDate.toISOString().split('T')[0];

  try {
    const response = await fetch(`${BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`);
    const rawData = await response.json();
    
    if (Array.isArray(rawData)) {
      const newsItems = rawData.slice(0, 10).map(item => mapFinnhubToNewsItem(item, true, symbol));
      
      sessionStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: newsItems
      }));
      
      return newsItems;
    }
  } catch (error) {
    console.warn(`Failed to fetch company news for ${symbol} from Finnhub`, error);
  }
  
  return [];
};
