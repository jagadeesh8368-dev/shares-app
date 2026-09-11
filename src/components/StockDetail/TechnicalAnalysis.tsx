import { useState } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart, Activity, Gauge, HelpCircle } from 'lucide-react';
import { StockDetails } from '../../types';

interface TechnicalAnalysisProps {
  stock: StockDetails;
}

type TimeframeType = '1W' | '1M' | '6M' | '1Y' | 'MAX';

export default function TechnicalAnalysis({ stock }: TechnicalAnalysisProps) {
  const { technicals, historicalPrice } = stock;
  const [timeframe, setTimeframe] = useState<TimeframeType>('1Y');
  const [showDma20, setShowDma20] = useState(false);
  const [showDma50, setShowDma50] = useState(false);
  const [showDma200, setShowDma200] = useState(false);

  // Filter historical data based on selected timeframe
  const getFilteredChartData = () => {
    const totalPoints = historicalPrice.length;
    switch (timeframe) {
      case '1W':
        return historicalPrice.slice(totalPoints - 5);
      case '1M':
        return historicalPrice.slice(totalPoints - 22);
      case '6M':
        return historicalPrice.slice(totalPoints - 125);
      case '1Y':
        return historicalPrice.slice(totalPoints - 250);
      case 'MAX':
      default:
        return historicalPrice;
    }
  };

  const chartData = getFilteredChartData();

  const timeframes: TimeframeType[] = ['1W', '1M', '6M', '1Y', 'MAX'];

  const getRsiColor = (rsi: number) => {
    if (rsi >= 70) return 'text-rose-500';
    if (rsi <= 30) return 'text-emerald-500';
    return 'text-indigo-500';
  };

  const getMacdSignalColor = (sig: string) => {
    if (sig === 'Bullish') return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-950/40';
    if (sig === 'Bearish') return 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-950/40';
    return 'text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800';
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Interactive Chart Container */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        
        {/* Chart Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
          
          {/* Timeframes */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 select-none">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicators Overlays */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400 select-none">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mr-1">DMA Overlays:</span>
            
            <button
              onClick={() => setShowDma20(!showDma20)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                showDma20 
                  ? 'bg-red-50 dark:bg-red-950/10 text-red-500 border-red-200/50 dark:border-red-950/30' 
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              20 DMA
            </button>
            
            <button
              onClick={() => setShowDma50(!showDma50)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                showDma50 
                  ? 'bg-amber-50 dark:bg-amber-950/10 text-amber-500 border-amber-200/50 dark:border-amber-950/30' 
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              50 DMA
            </button>

            <button
              onClick={() => setShowDma200(!showDma200)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                showDma200 
                  ? 'bg-emerald-50 dark:bg-emerald-950/10 text-emerald-550 border-emerald-200/50 dark:border-emerald-950/30' 
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              200 DMA
            </button>
          </div>

        </div>

        {/* Main Chart */}
        <div className="w-full h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '12px', color: '#fff' }}
                labelStyle={{ fontWeight: 'bold', fontSize: 11 }}
                itemStyle={{ fontSize: 11 }}
              />
              
              {/* Main Price Area */}
              <Area type="monotone" dataKey="close" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" name="LTP" />
              
              {/* Optional DMA Lines */}
              {showDma20 && <Line type="monotone" dataKey="dma20" stroke="#ef4444" strokeWidth={1.5} dot={false} name="20 DMA" />}
              {showDma50 && <Line type="monotone" dataKey="dma50" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="50 DMA" />}
              {showDma200 && <Line type="monotone" dataKey="dma200" stroke="#10b981" strokeWidth={2} dot={false} name="200 DMA" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technical Indicators Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* RSI Indicator Card */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2 mb-3">
              <Gauge className="w-4.5 h-4.5 text-indigo-500" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Relative Strength Index (RSI)</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${getRsiColor(technicals.rsi)}`}>{technicals.rsi}</span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                ({technicals.rsiSignal})
              </span>
            </div>
            
            {/* Visual Slider */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden relative">
              <div className="absolute left-[30%] right-[30%] h-full bg-slate-200 dark:bg-slate-700"></div>
              <div 
                className="absolute w-3 h-3 bg-indigo-500 rounded-full -top-0.5 border border-white"
                style={{ left: `calc(${technicals.rsi}% - 6px)` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-semibold">
              <span>0 (OVERSOLD &lt;30)</span>
              <span>NEUTRAL</span>
              <span>100 (OVERBOUGHT &gt;70)</span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-450 dark:text-slate-500 italic">
            Current RSI represents a {technicals.rsiSignal.toLowerCase()} momentum.
          </p>
        </div>

        {/* MACD Indicator Card */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2 mb-3">
              <Activity className="w-4.5 h-4.5 text-indigo-500" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">MACD Indicator</span>
            </div>
            
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">MACD Line:</span>
                <span className="text-slate-800 dark:text-slate-200">{technicals.macd.macdLine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Signal Line:</span>
                <span className="text-slate-800 dark:text-slate-200">{technicals.macd.signalLine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Histogram:</span>
                <span className="text-slate-800 dark:text-slate-200">{technicals.macd.histogram}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3">
            <span className="text-xs font-bold text-slate-400">Signal:</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-black border ${getMacdSignalColor(technicals.macd.signal)}`}>
              {technicals.macd.signal}
            </span>
          </div>
        </div>

        {/* Support & Resistance levels */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2 mb-3">
              <LineChart className="w-4.5 h-4.5 text-indigo-500" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Key Pivot Levels</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-rose-500 block uppercase tracking-wider">Resistance</span>
                {technicals.resistanceLevels.map((res, i) => (
                  <div key={i} className="text-sm font-black text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg py-1 px-2.5 text-center shadow-sm">
                    R{i+1}: ₹{res.toLocaleString('en-IN')}
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-500 block uppercase tracking-wider">Support</span>
                {technicals.supportLevels.map((sup, i) => (
                  <div key={i} className="text-sm font-black text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg py-1 px-2.5 text-center shadow-sm">
                    S{i+1}: ₹{sup.toLocaleString('en-IN')}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-550 border-t border-slate-100 dark:border-slate-850 pt-2 flex items-center justify-between">
            <span>Volatility: <strong>{technicals.volatility}</strong></span>
            <span>Pivot points calculated weekly.</span>
          </div>
        </div>

      </div>

      {/* Warning Disclaimer */}
      <div className="glass-panel p-4.5 rounded-2xl border border-rose-200/50 dark:border-rose-950/20 text-xs text-slate-500 dark:text-slate-450 leading-relaxed bg-rose-50/15 dark:bg-rose-950/5 flex gap-2">
        <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <span>
          <strong>Technical analysis notice:</strong> Technical trend indicators are computed using historical mathematical price trends and volume oscillations. They represent mathematical calculations, not guaranteed directional movements. Markets are highly volatile, and prices can move contrary to technical signals. Use alongside core fundamentals.
        </span>
      </div>

    </div>
  );
}
