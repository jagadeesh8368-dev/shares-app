import { useState, useEffect } from 'react';
import { Heart, ArrowUpRight, ShieldAlert, Sparkles, AlertCircle, Bookmark } from 'lucide-react';
import { StockSummary } from '../../types';
import { isWatchlisted, addToWatchlist, removeFromWatchlist } from '../../services/watchlistService';

interface StockCardProps {
  stock: StockSummary;
  onSelectStock: (symbol: string) => void;
  onWatchlistChange?: () => void;
}

export default function StockCard({ stock, onSelectStock, onWatchlistChange }: StockCardProps) {
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    setIsWatched(isWatchlisted(stock.symbol));
  }, [stock.symbol]);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWatched) {
      removeFromWatchlist(stock.symbol);
      setIsWatched(false);
    } else {
      addToWatchlist(stock.symbol);
      setIsWatched(true);
    }
    if (onWatchlistChange) {
      onWatchlistChange();
    }
  };

  const isPositive = stock.change >= 0;

  // Determine colors based on scores, risk, sentiment
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20';
    if (score >= 70) return 'text-indigo-500 border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20';
    if (score >= 60) return 'text-amber-500 border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20';
    return 'text-rose-500 border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/30';
    if (risk === 'Moderate') return 'text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/30';
    return 'text-rose-600 dark:text-rose-450 bg-rose-100/50 dark:bg-rose-950/30';
  };

  return (
    <div
      onClick={() => onSelectStock(stock.symbol)}
      className="glass-panel rounded-2xl p-5 hover:shadow-xl hover:scale-[1.01] hover:border-slate-300 dark:hover:border-slate-700/80 cursor-pointer transition-all duration-300 group flex flex-col justify-between h-full select-none"
    >
      {/* Top Header info */}
      <div className="flex justify-between items-start mb-3">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              {stock.symbol}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-450">
              {stock.capType}
            </span>
          </div>
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1 max-w-[150px] truncate">
            {stock.name}
          </h3>
        </div>

        {/* Watchlist Toggle */}
        <button
          onClick={handleWatchlistClick}
          className={`p-2 rounded-full border border-slate-100 dark:border-slate-850 hover:bg-slate-55 dark:hover:bg-slate-800 transition-all ${
            isWatched 
              ? 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-950/40' 
              : 'text-slate-400 hover:text-rose-450 dark:text-slate-500'
          }`}
          title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Heart className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Sector and Industry */}
      <div className="text-left text-xs font-medium text-slate-500 dark:text-slate-405 mb-4">
        <span>{stock.sector}</span>
        <span className="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
        <span className="truncate inline-block max-w-[130px] align-bottom">{stock.industry}</span>
      </div>

      {/* Pricing Information */}
      <div className="flex items-baseline justify-between mb-4 border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="text-left">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
            LTP
          </span>
          <span className="text-xl font-black text-slate-800 dark:text-slate-150">
            ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
            Change
          </span>
          <div className={`flex items-center gap-1 font-bold text-sm ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : ''}
            {stock.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Research Score, Risk, Sentiment */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center ${getScoreColor(stock.researchScore)}`}>
          <span className="text-[9px] font-bold opacity-75 uppercase tracking-wider mb-0.5">Score</span>
          <span className="text-sm font-extrabold">{stock.researchScore}</span>
        </div>
        
        <div className={`flex flex-col items-center justify-center p-2 rounded-xl text-center ${getRiskColor(stock.riskLevel)}`}>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Risk</span>
          <span className="text-xs font-bold truncate max-w-full">{stock.riskLevel}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-center">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-0.5">Sentiment</span>
          <span className={`text-[10px] font-bold ${
            stock.sentiment === 'Positive' ? 'text-emerald-500' : (stock.sentiment === 'Negative' ? 'text-rose-500' : 'text-slate-500')
          }`}>
            {stock.sentiment}
          </span>
        </div>
      </div>

      {/* Analyze Link */}
      <div className="flex items-center justify-between text-xs font-bold text-indigo-500 dark:text-indigo-400 pt-1 group-hover:underline">
        <span>Detailed Analysis</span>
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>

    </div>
  );
}
