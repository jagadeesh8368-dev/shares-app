import { useState, useEffect } from 'react';
import { Heart, Landmark, Calendar, MapPin, Share2 } from 'lucide-react';
import { StockDetails } from '../../types';
import { isWatchlisted, addToWatchlist, removeFromWatchlist } from '../../services/watchlistService';

interface StockHeaderProps {
  stock: StockDetails;
  onWatchlistToggle?: () => void;
}

export default function StockHeader({ stock, onWatchlistToggle }: StockHeaderProps) {
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    setIsWatched(isWatchlisted(stock.symbol));
  }, [stock.symbol]);

  const handleWatchlistClick = () => {
    if (isWatched) {
      removeFromWatchlist(stock.symbol);
      setIsWatched(false);
    } else {
      addToWatchlist(stock.symbol);
      setIsWatched(true);
    }
    if (onWatchlistToggle) {
      onWatchlistToggle();
    }
  };

  const isPositive = stock.change >= 0;
  
  // Calculate position of current price in 52-week range
  const rangeTotal = stock.high52Week - stock.low52Week;
  const currentDiff = stock.price - stock.low52Week;
  const rangePercent = Math.min(100, Math.max(0, (currentDiff / rangeTotal) * 100));

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:glow-primary transition-all duration-300">
      
      {/* Name and Meta */}
      <div className="text-left space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-none">
            {stock.name}
          </h1>
          <span className="font-extrabold text-sm px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350">
            {stock.symbol}
          </span>
          <span className="text-xs font-bold px-2 py-1 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            {stock.capType}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5 text-indigo-500" />
            {stock.sector}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>{stock.industry}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            {stock.headquarters}
          </span>
        </div>
      </div>

      {/* 52-Week Range Progress (Desktop Center) */}
      <div className="hidden lg:block w-48 text-left text-xs font-semibold text-slate-400 dark:text-slate-550 shrink-0">
        <div className="flex justify-between mb-1">
          <span>52W L: ₹{stock.low52Week.toLocaleString('en-IN')}</span>
          <span>52W H: ₹{stock.high52Week.toLocaleString('en-IN')}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-indigo-500 rounded-full" 
            style={{ width: `${rangePercent}%` }}
          ></div>
        </div>
        <div className="text-center mt-1 text-[10px] text-indigo-500 dark:text-indigo-400">
          Price position: {rangePercent.toFixed(0)}% from low
        </div>
      </div>

      {/* Pricing and Watchlist button */}
      <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
        
        {/* Prices */}
        <div className="text-right">
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100 leading-none">
            ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 justify-end mt-1.5 font-bold text-sm">
            <span className={isPositive ? 'text-emerald-500' : 'text-rose-500'}>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
            <span className="text-slate-400 dark:text-slate-600 font-medium">|</span>
            <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Vol: {(stock.volume / 100000).toFixed(1)}L</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleWatchlistClick}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              isWatched
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10'
                : 'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white shadow-indigo-500/10'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWatched ? 'fill-current' : ''}`} />
            {isWatched ? 'Watched' : 'Watchlist'}
          </button>
        </div>

      </div>

    </div>
  );
}
