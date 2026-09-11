import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getIndices } from '../../services/apiService';
import { IndexData } from '../../types';

export default function MarketIndices() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchIndices() {
      try {
        const data = await getIndices();
        setIndices(data);
      } catch (e) {
        console.error("Failed to load indices:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchIndices();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel h-[110px] rounded-2xl p-4 animate-pulse flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-1.5"></div>
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {indices.map((idx) => {
        const isPositive = idx.change >= 0;
        // Transform history data for Recharts
        const chartData = idx.history.map((val, index) => ({ index, val }));

        return (
          <div
            key={idx.name}
            className={`glass-panel rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.01] transition-transform cursor-default ${
              isPositive ? 'hover:glow-green/20' : 'hover:glow-red/20'
            }`}
          >
            {/* Top row */}
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-250 tracking-tight">
                {idx.name}
              </span>
              <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold tracking-wider">
                {idx.symbol}
              </span>
            </div>

            {/* Bottom Row (Info + Sparkline Chart) */}
            <div className="flex justify-between items-end h-[60px] gap-2">
              <div className="text-left shrink-0">
                <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                  {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1 mt-1 font-semibold text-xs leading-none">
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span className={isPositive ? 'text-emerald-500' : 'text-rose-500'}>
                    {isPositive ? '+' : ''}
                    {idx.change.toFixed(2)} ({isPositive ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Sparkline line graph */}
              <div className="w-24 sm:w-28 h-10 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
                    <Line
                      type="monotone"
                      dataKey="val"
                      stroke={isPositive ? '#10b981' : '#ef4444'}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
