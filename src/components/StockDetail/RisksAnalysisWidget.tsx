import { AlertTriangle, ShieldCheck, ShieldAlert, Activity } from 'lucide-react';
import { RiskAnalysis } from '../../types';

interface RisksAnalysisWidgetProps {
  risksAnalysis: RiskAnalysis;
}

export default function RisksAnalysisWidget({ risksAnalysis }: RisksAnalysisWidgetProps) {
  const { overallRisk, businessRisk, financialRisk, valuationRisk, marketRisk, regulatoryRisk, explanation } = risksAnalysis;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250';
      case 'Moderate':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-250';
      case 'High':
        return 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 border-rose-250';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-500';
      case 'Moderate':
        return 'bg-amber-500';
      case 'High':
        return 'bg-rose-500';
      default:
        return 'bg-slate-350';
    }
  };

  const getWidthPercent = (level: string) => {
    switch (level) {
      case 'Low':
        return '25%';
      case 'Moderate':
        return '60%';
      case 'High':
        return '90%';
      default:
        return '50%';
    }
  };

  const riskFactors = [
    { label: 'Business Model Risk', level: businessRisk, desc: 'Risk of operational failure, demand decline, or brand erosion.' },
    { label: 'Financial / Liquidity Risk', level: financialRisk, desc: 'Debt solvency, debt interest coverage, and working capital cash cycle.' },
    { label: 'Valuation Premium Risk', level: valuationRisk, desc: 'Risk of multiple compression if earnings fail to meet expectations.' },
    { label: 'Market Volatility Risk', level: marketRisk, desc: 'Price fluctuations, low trading volumes, or beta vulnerability.' },
    { label: 'Sector / Industry Cyclicality', level: regulatoryRisk, desc: 'Commodity cycles, technology disruptions, or demand saturation.' },
    { label: 'Regulatory & Government Policy', level: regulatoryRisk, desc: 'Tariffs, GST rate changes, export bans, or environment clearances.' }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Overall Risk Banner */}
      <div className="glass-panel rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Risk Badge */}
        <div className="flex flex-col items-center justify-center text-center p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-850">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Overall Risk Rating
          </span>
          <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-2">
            {overallRisk === 'High' ? (
              <ShieldAlert className="w-8 h-8 text-rose-500" />
            ) : overallRisk === 'Low' ? (
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            )}
          </div>
          <span className={`px-4 py-1 rounded-full border text-sm font-black tracking-wide uppercase ${getRiskColor(overallRisk)}`}>
            {overallRisk} Risk
          </span>
        </div>

        {/* Explanation */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-105 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-500" />
            Risk Factor Commentary
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {explanation}
          </p>
        </div>

      </div>

      {/* Categorized Risk Progress Sliders */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-850 pb-2.5">
          Detailed Risk Factor Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {riskFactors.map((rf) => (
            <div key={rf.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-750">
                <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                  <span>{rf.label}</span>
                </div>
                <span className={`font-black ${
                  rf.level === 'High' ? 'text-rose-500' : (rf.level === 'Low' ? 'text-emerald-500' : 'text-amber-500')
                }`}>{rf.level}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${getProgressColor(rf.level)}`}
                  style={{ width: getWidthPercent(rf.level) }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
                {rf.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
