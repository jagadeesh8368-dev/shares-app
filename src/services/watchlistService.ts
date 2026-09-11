// LocalStorage-based Watchlist Service

const WATCHLIST_KEY = 'investinsight_watchlist';
const DEFAULT_WATCHLIST = ['RELIANCE', 'TCS', 'HDFCBANK'];

// Get all watchlisted symbols
export const getWatchlistSymbols = (): string[] => {
  const data = localStorage.getItem(WATCHLIST_KEY);
  if (!data) {
    // Initialize with default list on first load
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(DEFAULT_WATCHLIST));
    return DEFAULT_WATCHLIST;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_WATCHLIST;
  }
};

// Add a stock to the watchlist
export const addToWatchlist = (symbol: string): string[] => {
  const current = getWatchlistSymbols();
  const upperSymbol = symbol.toUpperCase();
  
  if (!current.includes(upperSymbol)) {
    const updated = [...current, upperSymbol];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    return updated;
  }
  return current;
};

// Remove a stock from the watchlist
export const removeFromWatchlist = (symbol: string): string[] => {
  const current = getWatchlistSymbols();
  const upperSymbol = symbol.toUpperCase();
  
  const updated = current.filter(s => s !== upperSymbol);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  return updated;
};

// Check if a stock is watchlisted
export const isWatchlisted = (symbol: string): boolean => {
  const current = getWatchlistSymbols();
  return current.includes(symbol.toUpperCase());
};
