const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Helper to handle rate limits
const fetchWithRetry = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Alpha Vantage rate limit message
    if (data.Information && data.Information.includes('rate limit')) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }
    
    // Alpha Vantage invalid API key message
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchGlobalQuote = async (symbol: string) => {
  // Use session storage for basic caching to avoid hitting rate limits too fast
  const cacheKey = `quote_${symbol}`;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    // Cache for 5 minutes
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
  }

  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
  const data = await fetchWithRetry(url);
  
  if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
    const quote = data['Global Quote'];
    const result = {
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume'], 10),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low'])
    };
    
    sessionStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: result
    }));
    
    return result;
  }
  
  return null;
};

export const fetchCompanyOverview = async (symbol: string) => {
  const cacheKey = `overview_${symbol}`;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    // Cache for 24 hours (company overview doesn't change fast)
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      return data;
    }
  }

  const url = `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`;
  const data = await fetchWithRetry(url);
  
  if (data && Object.keys(data).length > 0 && !data.Information) {
    const result = {
      marketCap: parseFloat(data.MarketCapitalization) || 0,
      peRatio: parseFloat(data.PERatio) || 0,
      dividendYield: parseFloat(data.DividendYield) * 100 || 0,
      sector: data.Sector || 'Unknown',
      industry: data.Industry || 'Unknown',
      description: data.Description || '',
      eps: parseFloat(data.EPS) || 0,
      high52Week: parseFloat(data['52WeekHigh']) || 0,
      low52Week: parseFloat(data['52WeekLow']) || 0,
      pbRatio: parseFloat(data.PriceToBookRatio) || 0,
      roe: parseFloat(data.ReturnOnEquityTTM) * 100 || 0,
      pegRatio: parseFloat(data.PEGRatio) || 0
    };
    
    sessionStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: result
    }));
    
    return result;
  }
  
  return null;
};
