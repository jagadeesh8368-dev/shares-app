import { BarChart3, Info } from 'lucide-react';
import MarketIndices from '../components/Dashboard/MarketIndices';
import MarketStatus from '../components/Dashboard/MarketStatus';
import { isLiveAPIDataActive } from '../services/apiService';

export default function MarketsPage() {
  const isLiveAPI = isLiveAPIDataActive();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            Indian Market Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Benchmark and sector indices for NSE and BSE research.
          </p>
        </div>
        <MarketStatus />
      </div>

      <div className="glass-panel rounded-2xl border border-amber-200/70 dark:border-amber-950/40 p-4 flex gap-3 text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          {isLiveAPI
            ? 'Live index data is supplied by the configured market-data provider. Values may be delayed.'
            : 'Demo index data is displayed for development. Connect a market-data provider before treating values as current.'}
        </p>
      </div>

      <MarketIndices />
    </div>
  );
}
