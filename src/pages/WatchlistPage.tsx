import { useState } from 'react';
import { Heart, Grid, List, Trash2, Plus } from 'lucide-react';
import { getWatchlistSymbols, removeFromWatchlist } from '../services/watchlistService';
import { baseStocksData } from '../services/mockData';
import { StockSummary } from '../types';
import StockCard from '../components/Common/StockCard';

interface WatchlistPageProps {
  onSelectStock: (symbol: string) => void;
}

export default function WatchlistPage({ onSelectStock }: WatchlistPageProps) {
  const [watchlist, setWatchlist] = useState<StockSummary[]>(() => {
    const symbols = getWatchlistSymbols();
    return baseStocksData
      .filter(s => symbols.includes(s.symbol))
      .map(s => ({
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
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const loadWatchlistData = () => {
    const symbols = getWatchlistSymbols();
    const data = baseStocksData
      .filter(s => symbols.includes(s.symbol))
      .map(s => ({
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
    setWatchlist(data);
  };

  const handleRemove = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWatchlist(symbol);
    loadWatchlistData();
  };

  const isPositive = (val: number) => val >= 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 text-left">
      
      {/* Header & View Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/10" />
            My Research Watchlist
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Keep track of companies you are currently analyzing for potential investment research decisions.
          </p>
        </div>

        {watchlist.length > 0 && (
          <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto select-none">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {watchlist.length > 0 ? (
        viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {watchlist.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                onSelectStock={onSelectStock}
                onWatchlistChange={loadWatchlistData}
              />
            ))}
          </div>
        ) : (
          /* Compact Table View */
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[700px] border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-150 dark:border-slate-850 text-slate-500 dark:text-slate-400">
                    <th className="px-4 py-3 text-left font-bold w-1/4">Company</th>
                    <th className="px-4 py-3 text-right font-bold">LTP (₹)</th>
                    <th className="px-4 py-3 text-right font-bold">Market Cap</th>
                    <th className="px-4 py-3 text-right font-bold">Research Score</th>
                    <th className="px-4 py-3 text-right font-bold">Risk Level</th>
                    <th className="px-4 py-3 text-right font-bold">Sentiment</th>
                    <th className="px-4 py-3 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((stock) => {
                    const pos = isPositive(stock.change);
                    return (
                      <tr 
                        key={stock.symbol}
                        onClick={() => onSelectStock(stock.symbol)}
                        className="border-b border-slate-100 dark:border-slate-850/40 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3.5 text-left">
                          <span className="font-extrabold text-slate-800 dark:text-slate-150">{stock.symbol}</span>
                          <span className="text-[10px] text-slate-400 block max-w-[150px] truncate">{stock.name}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-semibold">
                          <div>₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                          <span className={`text-[10px] font-bold ${pos ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {pos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-slate-650 dark:text-slate-350">
                          ₹{stock.marketCap.toLocaleString('en-IN')} Cr
                        </td>
                        <td className="px-4 py-3.5 text-right font-black">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 font-extrabold">
                            {stock.researchScore}
                          </span>
                        </td>
                        <td className={`px-4 py-3.5 text-right font-bold ${
                          stock.riskLevel === 'Low' ? 'text-emerald-500' : (stock.riskLevel === 'High' ? 'text-rose-500' : 'text-amber-500')
                        }`}>{stock.riskLevel}</td>
                        <td className={`px-4 py-3.5 text-right font-bold ${
                          stock.sentiment === 'Positive' ? 'text-emerald-500' : (stock.sentiment === 'Negative' ? 'text-rose-500' : 'text-slate-500')
                        }`}>{stock.sentiment}</td>
                        <td className="px-4 py-3.5 text-center space-x-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectStock(stock.symbol)}
                            className="px-3.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-full text-xs font-bold transition-all shadow-sm"
                          >
                            Analyze
                          </button>
                          
                          <button
                            onClick={(e) => handleRemove(stock.symbol, e)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 rounded-full transition-colors inline-block align-middle"
                            title="Remove from watchlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty Watchlist State */
        <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto my-12 space-y-5">
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-650 mx-auto" />
          <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">Your Watchlist is empty</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Start adding companies to your watchlist by searching for symbols like TCS, RELIANCE, or INFY, or choose candidates from the popular list below.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {['RELIANCE', 'TCS', 'HDFCBANK', 'TATAMOTORS'].map((sym) => (
              <button
                key={sym}
                onClick={() => {
                  removeFromWatchlist(sym); // reset if any
                  const upperSym = sym.toUpperCase();
                  // add
                  const symbols = getWatchlistSymbols();
                  if (!symbols.includes(upperSym)) {
                    localStorage.setItem('investinsight_watchlist', JSON.stringify([...symbols, upperSym]));
                  }
                  loadWatchlistData();
                }}
                className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-500 rounded-full text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Track {sym}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
