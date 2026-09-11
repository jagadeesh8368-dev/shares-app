import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import StockCard from '../Common/StockCard';
import { baseStocksData } from '../../services/mockData';
import { StockSummary } from '../../types';

interface TopOpportunitiesProps {
  onSelectStock: (symbol: string) => void;
  onNavigateToScreener: () => void;
}

export default function TopOpportunities({ onSelectStock, onNavigateToScreener }: TopOpportunitiesProps) {
  const [opportunities] = useState<StockSummary[]>(() => {
    return [...baseStocksData]
      .sort((a, b) => b.researchScore - a.researchScore)
      .slice(0, 4)
      .map(s => ({
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
      }));
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <div className="text-left">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-500/10" />
            Top Research Opportunities
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Highly-rated companies based on fundamental financial strength, growth, and returns.
          </p>
        </div>
        <button
          onClick={onNavigateToScreener}
          className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-350 transition-colors"
        >
          View All Screener
          <ArrowRight className="w-3.5 h-3.5 animate-in slide-in-from-left duration-300" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {opportunities.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            onSelectStock={onSelectStock}
          />
        ))}
      </div>
    </div>
  );
}
