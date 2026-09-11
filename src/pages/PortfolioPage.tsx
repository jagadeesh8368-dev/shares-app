import { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, TrendingDown, Plus, Trash2, Search, X } from 'lucide-react';
import { getPortfolio, addPortfolioItem, removePortfolioItem, PortfolioItem } from '../services/db';
import { getStockDetails, searchStocks } from '../services/apiService';
import { StockDetails, StockSummary } from '../types';

interface PortfolioPageProps {
  userId: string | null;
  onSelectStock: (symbol: string) => void;
}

interface EnrichedPortfolioItem extends PortfolioItem {
  currentPrice: number;
  change: number;
  changePercent: number;
  totalValue: number;
  totalReturn: number;
  returnPercent: number;
}

export default function PortfolioPage({ userId, onSelectStock }: PortfolioPageProps) {
  const [holdings, setHoldings] = useState<EnrichedPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSummary[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockSummary | null>(null);
  const [sharesStr, setSharesStr] = useState('');
  const [priceStr, setPriceStr] = useState('');

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const items = await getPortfolio(userId || 'demo');
      const enriched: EnrichedPortfolioItem[] = [];
      
      for (const item of items) {
        const details = await getStockDetails(item.symbol);
        const currentPrice = details?.price || item.averagePrice;
        const change = details?.change || 0;
        const changePercent = details?.changePercent || 0;
        
        const totalValue = currentPrice * item.shares;
        const totalCost = item.averagePrice * item.shares;
        const totalReturn = totalValue - totalCost;
        const returnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
        
        enriched.push({
          ...item,
          currentPrice,
          change,
          changePercent,
          totalValue,
          totalReturn,
          returnPercent
        });
      }
      setHoldings(enriched);
    } catch (error) {
      console.error("Failed to load portfolio", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, [userId]);

  useEffect(() => {
    const doSearch = async () => {
      if (searchQuery.length > 1 && !selectedStock) {
        const results = await searchStocks(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };
    
    const debounce = setTimeout(doSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedStock]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || !sharesStr || !priceStr) return;
    
    const shares = parseFloat(sharesStr);
    const price = parseFloat(priceStr);
    
    if (isNaN(shares) || isNaN(price) || shares <= 0 || price < 0) return;
    
    await addPortfolioItem(userId || 'demo', {
      symbol: selectedStock.symbol,
      shares,
      averagePrice: price
    });
    
    setIsAddModalOpen(false);
    setSelectedStock(null);
    setSearchQuery('');
    setSharesStr('');
    setPriceStr('');
    loadPortfolio();
  };

  const handleRemove = async (symbol: string) => {
    if (window.confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
      await removePortfolioItem(userId || 'demo', symbol);
      loadPortfolio();
    }
  };

  const totalPortfolioValue = holdings.reduce((sum, item) => sum + item.totalValue, 0);
  const totalPortfolioCost = holdings.reduce((sum, item) => sum + (item.shares * item.averagePrice), 0);
  const totalPortfolioReturn = totalPortfolioValue - totalPortfolioCost;
  const totalPortfolioReturnPercent = totalPortfolioCost > 0 ? (totalPortfolioReturn / totalPortfolioCost) * 100 : 0;
  const dayChangeValue = holdings.reduce((sum, item) => sum + (item.change * item.shares), 0);
  const dayChangePercent = totalPortfolioValue > 0 ? (dayChangeValue / (totalPortfolioValue - dayChangeValue)) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-500" />
            My Portfolio
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Track your holdings and performance</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          Add Holding
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#141727] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Value</p>
          <h2 className="text-3xl font-bold">₹{totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h2>
        </div>
        
        <div className="bg-white dark:bg-[#141727] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Day's Change</p>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-2xl font-bold ${dayChangeValue >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {dayChangeValue >= 0 ? '+' : ''}₹{dayChangeValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </h2>
            <span className={`text-sm font-medium ${dayChangePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              ({dayChangePercent >= 0 ? '+' : ''}{dayChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#141727] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Return</p>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-2xl font-bold ${totalPortfolioReturn >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {totalPortfolioReturn >= 0 ? '+' : ''}₹{totalPortfolioReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </h2>
            <span className={`text-sm font-medium ${totalPortfolioReturnPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              ({totalPortfolioReturnPercent >= 0 ? '+' : ''}{totalPortfolioReturnPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="bg-white dark:bg-[#141727] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold">Current Holdings</h2>
        </div>
        
        {loading ? (
          <div className="p-10 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : holdings.length === 0 ? (
          <div className="p-10 text-center text-slate-500 dark:text-slate-400">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">Your portfolio is empty</p>
            <p className="text-sm">Click "Add Holding" to start tracking your investments.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0c0e1a] border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 font-medium text-sm text-slate-500 dark:text-slate-400">Symbol</th>
                  <th className="p-4 font-medium text-sm text-slate-500 dark:text-slate-400 text-right">Shares</th>
                  <th className="p-4 font-medium text-sm text-slate-500 dark:text-slate-400 text-right">Avg Price</th>
                  <th className="p-4 font-medium text-sm text-slate-500 dark:text-slate-400 text-right">LTP</th>
                  <th className="p-4 font-medium text-sm text-slate-500 dark:text-slate-400 text-right">Total Value</th>
                  <th className="p-4 font-medium text-sm text-slate-500 dark:text-slate-400 text-right">Return</th>
                  <th className="p-4 font-medium text-sm text-slate-500 dark:text-slate-400 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {holdings.map((item) => (
                  <tr key={item.symbol} className="hover:bg-slate-50 dark:hover:bg-[#101321]/50 transition-colors">
                    <td className="p-4">
                      <button 
                        onClick={() => onSelectStock(item.symbol)}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {item.symbol}
                      </button>
                    </td>
                    <td className="p-4 text-right font-medium">{item.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                    <td className="p-4 text-right">₹{item.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="p-4 text-right font-medium">
                      ₹{item.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <div className={`text-xs ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold">₹{item.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="p-4 text-right">
                      <div className={`font-bold ${item.totalReturn >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.totalReturn >= 0 ? '+' : ''}₹{item.totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs ${item.returnPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.returnPercent >= 0 ? '+' : ''}{item.returnPercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleRemove(item.symbol)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remove holding"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Holding Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#141727] rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold">Add Holding</h3>
              <button 
                onClick={() => { setIsAddModalOpen(false); setSelectedStock(null); setSearchQuery(''); }}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-4 space-y-4">
              {!selectedStock ? (
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Search Stock</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0c0e1a] border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="Enter symbol or company name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#141727] border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.symbol}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-between items-center"
                          onClick={() => {
                            setSelectedStock(result);
                            setSearchQuery(result.symbol);
                            setSearchResults([]);
                          }}
                        >
                          <div>
                            <div className="font-bold">{result.symbol}</div>
                            <div className="text-xs text-slate-500">{result.name}</div>
                          </div>
                          <div className="text-sm font-medium">₹{result.price}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                    <div>
                      <div className="font-bold">{selectedStock.symbol}</div>
                      <div className="text-xs opacity-80">{selectedStock.name}</div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { setSelectedStock(null); setSearchQuery(''); }}
                      className="text-xs underline hover:opacity-80"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Shares</label>
                      <input
                        type="number"
                        min="0.0001"
                        step="any"
                        required
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c0e1a] border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        placeholder="e.g. 10"
                        value={sharesStr}
                        onChange={(e) => setSharesStr(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Avg Buy Price (₹)</label>
                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        required
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c0e1a] border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        placeholder="e.g. 2500.50"
                        value={priceStr}
                        onChange={(e) => setPriceStr(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setSelectedStock(null); setSearchQuery(''); }}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedStock || !sharesStr || !priceStr}
                  className="px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
