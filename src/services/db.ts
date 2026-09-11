import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';

export interface WatchlistData {
  symbols: string[];
}

export const getUserWatchlist = async (userId: string): Promise<string[]> => {
  if (!db) return [];
  try {
    const docRef = doc(db, 'users', userId, 'watchlists', 'default');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return (docSnap.data() as WatchlistData).symbols || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
};

export const addToWatchlist = async (userId: string, symbol: string): Promise<boolean> => {
  if (!db) return false;
  try {
    const docRef = doc(db, 'users', userId, 'watchlists', 'default');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        symbols: arrayUnion(symbol)
      });
    } else {
      await setDoc(docRef, {
        symbols: [symbol]
      });
    }
    return true;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return false;
  }
};

export const removeFromWatchlist = async (userId: string, symbol: string): Promise<boolean> => {
  if (!db) {
    // Local storage fallback for Demo Mode
    const stored = localStorage.getItem(`watchlist_${userId || 'demo'}`);
    if (stored) {
      const symbols = JSON.parse(stored).filter((s: string) => s !== symbol);
      localStorage.setItem(`watchlist_${userId || 'demo'}`, JSON.stringify(symbols));
    }
    return true;
  }
  try {
    const docRef = doc(db, 'users', userId, 'watchlists', 'default');
    await updateDoc(docRef, {
      symbols: arrayRemove(symbol)
    });
    return true;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return false;
  }
};

export interface PortfolioItem {
  symbol: string;
  shares: number;
  averagePrice: number;
}

export const getPortfolio = async (userId: string): Promise<PortfolioItem[]> => {
  if (!db) {
    const stored = localStorage.getItem(`portfolio_${userId || 'demo'}`);
    return stored ? JSON.parse(stored) : [];
  }
  try {
    const docRef = doc(db, 'users', userId, 'portfolios', 'default');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return (docSnap.data().items as PortfolioItem[]) || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return [];
  }
};

export const addPortfolioItem = async (userId: string, item: PortfolioItem): Promise<boolean> => {
  if (!db) {
    const stored = localStorage.getItem(`portfolio_${userId || 'demo'}`);
    let items: PortfolioItem[] = stored ? JSON.parse(stored) : [];
    
    // Check if symbol already exists
    const existingIndex = items.findIndex(i => i.symbol === item.symbol);
    if (existingIndex >= 0) {
      const existing = items[existingIndex];
      const newShares = existing.shares + item.shares;
      const newAvgPrice = ((existing.shares * existing.averagePrice) + (item.shares * item.averagePrice)) / newShares;
      items[existingIndex] = { symbol: item.symbol, shares: newShares, averagePrice: newAvgPrice };
    } else {
      items.push(item);
    }
    
    localStorage.setItem(`portfolio_${userId || 'demo'}`, JSON.stringify(items));
    return true;
  }
  
  try {
    const docRef = doc(db, 'users', userId, 'portfolios', 'default');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentItems = (docSnap.data().items as PortfolioItem[]) || [];
      const existingIndex = currentItems.findIndex(i => i.symbol === item.symbol);
      
      let newItems = [...currentItems];
      if (existingIndex >= 0) {
        const existing = newItems[existingIndex];
        const newShares = existing.shares + item.shares;
        const newAvgPrice = ((existing.shares * existing.averagePrice) + (item.shares * item.averagePrice)) / newShares;
        newItems[existingIndex] = { symbol: item.symbol, shares: newShares, averagePrice: newAvgPrice };
      } else {
        newItems.push(item);
      }
      
      await updateDoc(docRef, { items: newItems });
    } else {
      await setDoc(docRef, { items: [item] });
    }
    return true;
  } catch (error) {
    console.error("Error adding to portfolio:", error);
    return false;
  }
};

export const removePortfolioItem = async (userId: string, symbol: string): Promise<boolean> => {
  if (!db) {
    const stored = localStorage.getItem(`portfolio_${userId || 'demo'}`);
    if (stored) {
      const items = JSON.parse(stored).filter((i: PortfolioItem) => i.symbol !== symbol);
      localStorage.setItem(`portfolio_${userId || 'demo'}`, JSON.stringify(items));
    }
    return true;
  }
  
  try {
    const docRef = doc(db, 'users', userId, 'portfolios', 'default');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentItems = (docSnap.data().items as PortfolioItem[]) || [];
      const newItems = currentItems.filter(i => i.symbol !== symbol);
      await updateDoc(docRef, { items: newItems });
    }
    return true;
  } catch (error) {
    console.error("Error removing from portfolio:", error);
    return false;
  }
};
