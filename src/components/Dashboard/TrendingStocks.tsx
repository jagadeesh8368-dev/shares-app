import { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, ChevronRight } from 'lucide-react';
import { baseStocksData } from '../../services/mockData';
import { StockSummary } from '../../types';

interface TrendingStocksProps {
  onSelectStock: (symbol: string) => void;
}

export default function TrendingStocks({ onSelectStock }: TrendingStocksProps) {
  const mapToSummary = (s: any): StockSummary => ({
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
  });

  const [gainers] = useState<StockSummary[]>(() => 
    [...baseStocksData].map(mapToSummary).filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 4)
  );
  const [losers] = useState<StockSummary[]>(() => 
    [...baseStocksData].map(mapToSummary).filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 4)
  );
  const [active] = useState<StockSummary[]>(() => 
    [...baseStocksData].sort((a, b) => b.volume - a.volume).slice(0, 4).map(mapToSummary)
  );
  const [mobileTab, setMobileTab] = useState<'gainers' | 'losers' | 'active'>('gainers');

  const renderStockRow = (stock: StockSummary, _type: 'gainer' | 'loser' | 'active') => {
    const isPositive = stock.change >= 0;
    return (
      <div
        key={stock.symbol}
        onClick={() => onSelectStock(stock.symbol)}
        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm text-slate-850 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              {stock.symbol}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium max-w-[130px] truncate">
              {stock.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-250">
              ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span
              className={`text-xs font-bold ${
                isPositive ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {isPositive ? '+' : ''}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-350 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Market Activity
        </h2>
      </div>

      {/* Mobile Tab Toggles */}
      <div className="flex lg:hidden bg-slate-100 dark:bg-slate-950 p-1 rounded-xl mb-4 border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setMobileTab('gainers')}
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            mobileTab === 'gainers'
              ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Gainers
        </button>
        <button
          onClick={() => setMobileTab('losers')}
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            mobileTab === 'losers'
              ? 'bg-white dark:bg-slate-900 text-rose-500 shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          Losers
        </button>
        <button
          onClick={() => setMobileTab('active')}
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            mobileTab === 'active'
              ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Active
        </button>
      </div>

      {/* Grid Content for Desktop & Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Gainers Card */}
        <div className={`glass-panel rounded-2xl p-4 flex flex-col justify-between ${mobileTab === 'gainers' ? 'block' : 'hidden lg:flex'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-155 dark:border-slate-800/80 mb-3.5">
            <span className="font-bold text-sm text-emerald-500 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Top Gainers
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
              NSE Today
            </span>
          </div>
          <div className="space-y-1.5">
            {gainers.length > 0 ? (
              gainers.map(s => renderStockRow(s, 'gainer'))
            ) : (
              <div className="text-sm text-slate-400 dark:text-slate-500 p-4 text-center">No gainers today</div>
            )}
          </div>
        </div>

        {/* Top Losers Card */}
        <div className={`glass-panel rounded-2xl p-4 flex flex-col justify-between ${mobileTab === 'losers' ? 'block' : 'hidden lg:flex'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-155 dark:border-slate-800/80 mb-3.5">
            <span className="font-bold text-sm text-rose-500 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              Top Losers
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 font-semibold uppercase">
              NSE Today
            </span>
          </div>
          <div className="space-y-1.5">
            {losers.length > 0 ? (
              losers.map(s => renderStockRow(s, 'loser'))
            ) : (
              <div className="text-sm text-slate-400 dark:text-slate-500 p-4 text-center">No losers today</div>
            )}
          </div>
        </div>

        {/* Volume Leaders / Most Active Card */}
        <div className={`glass-panel rounded-2xl p-4 flex flex-col justify-between ${mobileTab === 'active' ? 'block' : 'hidden lg:flex'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-155 dark:border-slate-800/80 mb-3.5">
            <span className="font-bold text-sm text-indigo-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              Most Active
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
              By Volume
            </span>
          </div>
          <div className="space-y-1.5">
            {active.length > 0 ? (
              active.map(s => renderStockRow(s, 'active'))
            ) : (
              <div className="text-sm text-slate-400 dark:text-slate-500 p-4 text-center">No active stocks</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
