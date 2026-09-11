import { CheckCircle2, XCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { SWOT } from '../../types';

interface SwotAnalysisProps {
  swot: SWOT;
}

export default function SwotAnalysis({ swot }: SwotAnalysisProps) {
  const { strengths, weaknesses, opportunities, risks } = swot;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      
      {/* Strengths */}
      <div className="glass-panel rounded-3xl p-5 border border-emerald-100 dark:border-emerald-950/20 hover:glow-green/10 transition-all">
        <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2 mb-3.5">
          <CheckCircle2 className="w-5 h-5" />
          Key Strengths (Internal Pros)
        </h3>
        <ul className="space-y-3">
          {strengths.map((str, i) => (
            <li key={i} className="flex gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="glass-panel rounded-3xl p-5 border border-rose-100 dark:border-rose-950/20 hover:glow-red/10 transition-all">
        <h3 className="text-sm font-bold text-rose-500 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2 mb-3.5">
          <XCircle className="w-5 h-5" />
          Core Weaknesses (Internal Cons)
        </h3>
        <ul className="space-y-3">
          {weaknesses.map((weak, i) => (
            <li key={i} className="flex gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-550 mt-1.5 shrink-0"></span>
              <span>{weak}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="glass-panel rounded-3xl p-5 border border-blue-100 dark:border-blue-950/20 hover:glow-primary transition-all">
        <h3 className="text-sm font-bold text-indigo-500 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2 mb-3.5">
          <TrendingUp className="w-5 h-5" />
          Growth Opportunities (External Pros)
        </h3>
        <ul className="space-y-3">
          {opportunities.map((opp, i) => (
            <li key={i} className="flex gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-550 mt-1.5 shrink-0"></span>
              <span>{opp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risks / Threats */}
      <div className="glass-panel rounded-3xl p-5 border border-amber-100 dark:border-amber-950/20 transition-all">
        <h3 className="text-sm font-bold text-amber-600 dark:text-amber-405 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2 mb-3.5">
          <AlertTriangle className="w-5 h-5" />
          Major Risks (External Cons)
        </h3>
        <ul className="space-y-3">
          {risks.map((risk, i) => (
            <li key={i} className="flex gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
