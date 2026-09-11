import { GitCompare, HelpCircle, ArrowUpRight } from 'lucide-react';
import { CompetitorComparison as CompType, StockDetails } from '../../types';

interface CompetitorComparisonProps {
  stock: StockDetails;
  onSelectStock: (symbol: string) => void;
}

export default function CompetitorComparison({ stock, onSelectStock }: CompetitorComparisonProps) {
  const { competitors, symbol, name, price, marketCap, peRatio, pbRatio, roe, roce, debtToEquity, dividendYield, researchScore } = stock;

  // Add the current stock to the list for comparative table rendering
  const activeStockComp: CompType = {
    symbol,
    name,
    price,
    marketCap,
    peRatio,
    pbRatio,
    roe,
    roce,
    debtToEquity,
    revenueGrowth: 12.5, // approximate
    profitGrowth: 11.2,
    dividendYield,
    researchScore
  };

  const allComps = [activeStockComp, ...competitors];

  // Helper: Find which competitor is cheapest/best for explanation
  const getComparisonSummaryText = () => {
    // Sort by research score
    const bestScore = [...allComps].sort((a, b) => b.researchScore - a.researchScore)[0];
    const lowestPe = [...allComps].filter(c => c.peRatio > 0).sort((a, b) => a.peRatio - b.peRatio)[0];
    const highestRoe = [...allComps].sort((a, b) => b.roe - a.roe)[0];

    return `${name} operates in the same competitive space alongside key players like ${competitors.map(c => c.symbol).join(', ')}. \n\n` +
      `In terms of overall scoring, ${bestScore.symbol === symbol ? 'the company itself' : bestScore.symbol} stands out with the highest research rating of ${bestScore.researchScore}/100. ` +
      `For value-oriented research, ${lowestPe.symbol} offers the lowest entry multiplier with a P/E of ${lowestPe.peRatio}x, while ` +
      `for efficiency analysis, ${highestRoe.symbol} leads the group, generating a return on shareholder equity of ${highestRoe.roe}%. ` +
      `Debt levels are manageable across the peers, with ${allComps.find(c => c.debtToEquity < 0.1)?.symbol || 'the sector'} maintaining the lowest solvency risk.`;
  };

  const summaryText = getComparisonSummaryText();

  return (
    <div className="space-y-6 text-left">
      
      {/* Peer Comparison Table */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
          <GitCompare className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Competitor Peer Comparison Table
          </h2>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-850">
          <table className="w-full min-w-[700px] border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-150 dark:border-slate-850 text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3.5 text-left font-bold w-1/4">Company</th>
                <th className="px-4 py-3.5 text-right font-bold">LTP (₹)</th>
                <th className="px-4 py-3.5 text-right font-bold">Market Cap (Cr)</th>
                <th className="px-4 py-3.5 text-right font-bold">P/E Ratio</th>
                <th className="px-4 py-3.5 text-right font-bold">P/B Ratio</th>
                <th className="px-4 py-3.5 text-right font-bold">ROE (%)</th>
                <th className="px-4 py-3.5 text-right font-bold">ROCE (%)</th>
                <th className="px-4 py-3.5 text-right font-bold">Debt/Equity</th>
                <th className="px-4 py-3.5 text-right font-bold">Div. Yield</th>
                <th className="px-4 py-3.5 text-right font-bold">Score</th>
              </tr>
            </thead>
            <tbody>
              {allComps.map((comp) => {
                const isActive = comp.symbol === symbol;
                return (
                  <tr 
                    key={comp.symbol}
                    onClick={() => !isActive && onSelectStock(comp.symbol)}
                    className={`border-b border-slate-100 dark:border-slate-850/40 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors ${
                      isActive 
                        ? 'bg-indigo-50/20 dark:bg-indigo-950/10 font-bold border-l-4 border-l-indigo-500' 
                        : 'cursor-pointer text-slate-650 dark:text-slate-350'
                    }`}
                  >
                    <td className="px-4 py-3.5 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800 dark:text-slate-150">{comp.symbol}</span>
                        {!isActive && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-350 hover:text-indigo-500 transition-colors shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block max-w-[150px] truncate">{comp.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold">
                      ₹{comp.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      ₹{comp.marketCap.toLocaleString('en-IN')} Cr
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold">{comp.peRatio}</td>
                    <td className="px-4 py-3.5 text-right">{comp.pbRatio}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-emerald-550 dark:text-emerald-450">{comp.roe}%</td>
                    <td className="px-4 py-3.5 text-right text-emerald-550 dark:text-emerald-450">{comp.roce}%</td>
                    <td className="px-4 py-3.5 text-right">{comp.debtToEquity}</td>
                    <td className="px-4 py-3.5 text-right">{comp.dividendYield}%</td>
                    <td className="px-4 py-3.5 text-right font-black">
                      <span className={`px-2 py-0.5 rounded ${
                        comp.researchScore >= 80 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {comp.researchScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peer Summary Card */}
      <div className="glass-panel rounded-3xl p-6 space-y-3.5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-150 flex items-center gap-1.5">
          <HelpCircle className="w-4.5 h-4.5 text-indigo-500" />
          Which peer has stronger fundamentals?
        </h3>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed whitespace-pre-line">
          {summaryText}
        </p>
      </div>

    </div>
  );
}
