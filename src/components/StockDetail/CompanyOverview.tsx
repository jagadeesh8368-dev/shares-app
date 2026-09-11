import { Landmark, Calendar, MapPin, Briefcase, Percent } from 'lucide-react';
import { StockDetails } from '../../types';

interface CompanyOverviewProps {
  stock: StockDetails;
}

export default function CompanyOverview({ stock }: CompanyOverviewProps) {
  const {
    description,
    foundedYear,
    headquarters,
    sector,
    industry,
    promoterHolding,
    institutionalHolding,
    publicHolding,
  } = stock;

  const holdings = [
    { label: 'Promoter Holding', val: promoterHolding, color: 'bg-indigo-500', text: 'text-indigo-500' },
    { label: 'Institutional Holding', val: institutionalHolding, color: 'bg-cyan-400', text: 'text-cyan-500' },
    { label: 'Public Holding', val: publicHolding, color: 'bg-slate-350 dark:bg-slate-650', text: 'text-slate-500' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Description & Profile */}
      <div className="glass-panel rounded-3xl p-6 lg:col-span-2 text-left space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
          <Briefcase className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Company Business Profile
          </h2>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-3 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Founded</span>
              <span className="text-slate-800 dark:text-slate-200">{foundedYear}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Headquarters</span>
              <span className="text-slate-800 dark:text-slate-200">{headquarters}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Sector</span>
              <span className="text-slate-800 dark:text-slate-200">{sector}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Industry</span>
              <span className="text-slate-800 dark:text-slate-200">{industry}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shareholding Pattern */}
      <div className="glass-panel rounded-3xl p-6 text-left flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
            <Percent className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Shareholding Pattern
            </h2>
          </div>

          {/* Stacking percentage bar */}
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            {holdings.map((h) => (
              <div
                key={h.label}
                className={h.color}
                style={{ width: `${h.val}%` }}
                title={`${h.label}: ${h.val}%`}
              ></div>
            ))}
          </div>

          <div className="space-y-3.5 pt-2">
            {holdings.map((h) => (
              <div key={h.label} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-400">
                  <span className={`w-2.5 h-2.5 rounded-full ${h.color}`}></span>
                  <span>{h.label}</span>
                </div>
                <span className={`font-black ${h.text}`}>
                  {h.val.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-550 border-t border-slate-100 dark:border-slate-850 pt-3 mt-4">
          High promoter holding (&gt;50%) or institutional backing indicates corporate governance confidence and funding safety.
        </div>
      </div>

    </div>
  );
}
