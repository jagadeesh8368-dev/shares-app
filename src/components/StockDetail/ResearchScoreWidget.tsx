import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { StockDetails } from '../../types';

interface ResearchScoreWidgetProps {
  stock: StockDetails;
}

export default function ResearchScoreWidget({ stock }: ResearchScoreWidgetProps) {
  const { researchScore, researchScoreBreakdown, investmentSignal } = stock;
  
  // Calculate SVG stroke parameters for circular score ring
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (researchScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 70) return 'text-indigo-500 stroke-indigo-500';
    if (score >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getSignalBadgeColor = (status: string) => {
    switch (status) {
      case 'Strong Fundamentals':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-250 dark:border-emerald-900/30';
      case 'Healthy':
        return 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-250 dark:border-indigo-900/30';
      case 'Watchlist':
        return 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-250 dark:border-blue-900/30';
      case 'Caution':
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-405 border-amber-250 dark:border-amber-900/30';
      case 'High Risk':
        return 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 border-rose-250 dark:border-rose-900/30';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const breakdownFields = [
    { label: 'Fundamental Strength', val: researchScoreBreakdown.fundamental },
    { label: 'Financial Health', val: researchScoreBreakdown.financialHealth },
    { label: 'Valuation Rating', val: researchScoreBreakdown.valuation },
    { label: 'Growth Momentum', val: researchScoreBreakdown.growth },
    { label: 'Profitability Core', val: researchScoreBreakdown.profitability },
    { label: 'Technical Trend', val: researchScoreBreakdown.technical },
    { label: 'Market Sentiment', val: researchScoreBreakdown.sentiment },
    { label: 'Risk Protection', val: researchScoreBreakdown.risk },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Circle Gauge & Signal */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          Overall Research Rating
        </span>

        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center w-36 h-36 mb-4">
          <svg className="w-full h-full -rotate-95">
            {/* Background ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Value ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className={`transition-all duration-1000 ease-out animate-ring ${getScoreColor(researchScore)}`}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-800 dark:text-slate-50">{researchScore}</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">Scale 100</span>
          </div>
        </div>

        {/* Signal Badge */}
        <div className={`px-4 py-1.5 rounded-full border text-xs font-extrabold tracking-wide uppercase mb-2 ${getSignalBadgeColor(investmentSignal.status)}`}>
          {investmentSignal.status}
        </div>
        
        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic max-w-[200px]">
          Score evaluated using multi-factor fundamental & technical algorithms.
        </p>
      </div>

      {/* Why? (Signal Explanation) */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between text-left lg:col-span-2">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Why this Research Signal?
            </h2>
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            {researchScoreBreakdown.explanation}
          </p>

          <ul className="space-y-2.5">
            {investmentSignal.reasons.map((reason, i) => (
              <li key={i} className="flex gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer warning */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 flex gap-2 items-start text-[10px] text-slate-400 dark:text-slate-500">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Research score represents relative quantitative rank. It is not a valuation assessment or financial recommendation to buy, sell, or hold. Past performance does not guarantee future results.
          </span>
        </div>
      </div>

      {/* Score Breakdown Sliders */}
      <div className="glass-panel rounded-3xl p-6 lg:col-span-3 text-left">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-150 flex items-center gap-1.5 mb-4">
          <Info className="w-4 h-4 text-indigo-500" />
          Multi-Factor Rating Breakdown
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          {breakdownFields.map((field) => (
            <div key={field.label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-550 dark:text-slate-400">
                <span>{field.label}</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{field.val}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    field.val >= 80 
                      ? 'bg-emerald-500' 
                      : (field.val >= 70 ? 'bg-indigo-500' : (field.val >= 60 ? 'bg-amber-500' : 'bg-rose-500'))
                  }`} 
                  style={{ width: `${field.val}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
