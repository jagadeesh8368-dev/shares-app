import { Rocket, AlertTriangle, Activity } from 'lucide-react';
import { StockDetails } from '../../types';

interface FutureOutlookWidgetProps {
  stock: StockDetails;
}

export default function FutureOutlookWidget({ stock }: FutureOutlookWidgetProps) {
  const { futureOutlook } = stock;
  const { outlook, drivers, catalysts, risks, metricsToWatch, industryOutlook } = futureOutlook;

  const getOutlookColor = (state: string) => {
    if (state === 'Positive') return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250';
    if (state === 'Cautious') return 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 border-rose-250';
    return 'text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200';
  };

  // Generate mock short-term / mid-term / long-term horizons
  const horizons = [
    {
      title: 'Short-Term Horizon',
      period: '1 to 6 Months',
      outlook: outlook === 'Positive' ? 'Positive' : 'Neutral',
      description: `Focus on immediate earnings reports, raw material cost changes, and short-term demand trends. Technical momentum support near S1 level is key to price support.`,
    },
    {
      title: 'Medium-Term Horizon',
      period: '6 to 24 Months',
      outlook: outlook,
      description: `Influenced by project execution speeds, contract wins, and industry capital expenditure trends. Central bank rate movements will affect borrowing costs.`,
    },
    {
      title: 'Long-Term Horizon',
      period: '2 to 5+ Years',
      outlook: outlook,
      description: `Driven by core market leadership retention, technological transition (like AI or green energy implementations), and general Indian GDP expansion.`,
    }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Short/Mid/Long Term View Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {horizons.map((h) => (
          <div key={h.title} className="glass-panel rounded-3xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-2 mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{h.title}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">{h.period}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getOutlookColor(h.outlook)}`}>
                  {h.outlook}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
                {h.description}
              </p>
            </div>
            <div className="text-[9px] text-slate-400 dark:text-slate-550 pt-2 border-t border-slate-100 dark:border-slate-850">
              *Not a guaranteed prediction. Viewpoint based on structural parameters.
            </div>
          </div>
        ))}
      </div>

      {/* SWOT Detail Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Growth Drivers & Catalysts */}
        <div className="glass-panel rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
            <Rocket className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Future Growth Catalysts & Drivers</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-2">Growth Drivers</span>
              <ul className="space-y-2">
                {drivers.map((d, i) => (
                  <li key={i} className="text-xs font-semibold text-slate-650 dark:text-slate-350 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-2">Upcoming Catalysts</span>
              <ul className="space-y-2">
                {catalysts.map((c, i) => (
                  <li key={i} className="text-xs font-semibold text-slate-650 dark:text-slate-350 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Risks & Metrics to Monitor */}
        <div className="glass-panel rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
            <AlertTriangle className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Key Risks & Metrics to Monitor</h3>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block mb-2">Risk Triggers</span>
              <ul className="space-y-2">
                {risks.map((r, i) => (
                  <li key={i} className="text-xs font-semibold text-slate-650 dark:text-slate-350 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-2">Metrics to Monitor</span>
              <ul className="space-y-2">
                {metricsToWatch.map((m, i) => (
                  <li key={i} className="text-xs font-semibold text-slate-650 dark:text-slate-350 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Industry Outlook */}
      <div className="glass-panel rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-850 dark:text-slate-150 flex items-center gap-1.5">
          <Activity className="w-5 h-5 text-indigo-500" />
          General Sector/Industry Environment
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {industryOutlook}
        </p>
      </div>

    </div>
  );
}
