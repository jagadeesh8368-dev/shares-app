import { useState, useEffect } from 'react';
import { GitCompare, X, PlusCircle, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { compareStocks } from '../services/apiService';
import { baseStocksData } from '../services/mockData';
import { StockDetails } from '../types';

interface ComparePageProps {
  compareList: string[];
  onRemoveFromCompare: (symbol: string) => void;
  onAddToCompare: (symbol: string) => void;
  onClearCompare: () => void;
  onSelectStock: (symbol: string) => void;
}

export default function ComparePage({ compareList, onRemoveFromCompare, onAddToCompare, onClearCompare, onSelectStock }: ComparePageProps) {
  const [stocks, setStocks] = useState<StockDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    async function loadComps() {
      if (compareList.length === 0) {
        setStocks([]);
        return;
      }
      setIsLoading(true);
      try {
        const details = await compareStocks(compareList);
        setStocks(details);
      } catch (e) {
        console.error("Comparison load failed:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadComps();
  }, [compareList]);

  const availableStocks = baseStocksData.filter(s => !compareList.includes(s.symbol));

  // Determine comparison summary programmatically
  const getAIComparisonSummary = () => {
    if (stocks.length < 2) return '';

    // Find best scores
    const bestScore = [...stocks].sort((a, b) => b.researchScore - a.researchScore)[0];
    const lowestPe = [...stocks].filter(s => s.peRatio > 0).sort((a, b) => a.peRatio - b.peRatio)[0];
    const highestRoe = [...stocks].sort((a, b) => b.roe - a.roe)[0];
    const lowestDebt = [...stocks].sort((a, b) => a.debtToEquity - b.debtToEquity)[0];

    let summary = `### Peer Research Findings Summary\n\n`;
    summary += `We are comparing **${stocks.map(s => s.symbol).join(', ')}** side-by-side based on core investment research parameters:\n\n`;
    
    summary += `1. **Overall Rating Leader**: **${bestScore.symbol}** leads the peer group with an InvestInsight Research Score of **${bestScore.researchScore}/100**, indicating the strongest all-round rating across growth, returns, and valuation stability.\n`;
    summary += `2. **Valuation Entry Multiplier**: **${lowestPe.symbol}** presents the lowest relative pricing multiple with a trailing P/E of **${lowestPe.peRatio}x**, indicating it could be undervalued compared to peers, provided earnings stability holds.\n`;
    summary += `3. **Shareholder Capital Return**: **${highestRoe.symbol}** demonstrates the highest profitability efficiency, generating an ROE of **${highestRoe.roe}%** on investor equity.\n`;
    summary += `4. **Leverage & Debt Solvency**: **${lowestDebt.symbol}** represents the lowest leverage risk with a Debt-to-Equity ratio of **${lowestDebt.debtToEquity}**.\n\n`;

    summary += `**Conclusion**: If your research prioritizes **valuation safety**, ${lowestPe.symbol} merits closer review. For **operational efficiency & profitability**, ${highestRoe.symbol} stands out. For **all-round blue-chip strength**, ${bestScore.symbol} remains the top-scoring candidate. Always cross-reference with industry catalysts.`;

    return summary;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-indigo-500" />
            Stock Comparison Console
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Compare 2 to 4 companies side-by-side on financials, valuations, return metrics, technicals, and sentiment.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={onClearCompare}
            className="px-4.5 py-2 text-xs font-bold text-rose-500 border border-rose-200/50 hover:bg-rose-50 dark:border-rose-950/20 dark:hover:bg-rose-950/20 rounded-full transition-all select-none self-start sm:self-auto"
          >
            Clear Selected Peers
          </button>
        )}
      </div>

      {/* Comparison Grid */}
      {isLoading ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3.5">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
          <span className="text-sm font-semibold text-slate-400">Loading side-by-side comparison matrix...</span>
        </div>
      ) : stocks.length > 0 ? (
        <div className="space-y-6">
          
          {/* Comparison Matrix Table */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[700px] border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-150 dark:border-slate-850 text-slate-550 dark:text-slate-450">
                    <th className="px-4 py-4 text-left font-bold w-1/5">Research Parameter</th>
                    {stocks.map((stock) => (
                      <th key={stock.symbol} className="px-4 py-4 text-center font-black relative group w-1/5">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-black text-slate-850 dark:text-slate-100">{stock.symbol}</span>
                          <span className="text-[9px] text-slate-400 font-semibold max-w-[120px] truncate">{stock.name}</span>
                          <button
                            onClick={() => onRemoveFromCompare(stock.symbol)}
                            className="absolute -top-1 -right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-105"
                            title="Remove stock"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                    {/* Add Peer Slot if less than 4 */}
                    {stocks.length < 4 && (
                      <th className="px-4 py-4 text-center w-1/5">
                        <button
                          onClick={() => setShowSelector(true)}
                          className="flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/10 transition-colors text-slate-450 hover:text-indigo-500 font-semibold mx-auto w-28 text-center"
                        >
                          <PlusCircle className="w-5 h-5 mb-1 text-indigo-500" />
                          <span className="text-[10px]">Add Stock</span>
                        </button>
                      </th>
                    )}
                    {/* Padding columns to match 5 columns total */}
                    {stocks.length === 4 ? null : (
                      [...Array(3 - stocks.length)].map((_, i) => (
                        <th key={i} className="w-1/5"></th>
                      ))
                    )}
                  </tr>
                </thead>
                
                <tbody>
                  {/* Category Headers & Row items */}
                  <tr className="bg-slate-50/20 dark:bg-slate-900/10 font-bold border-b border-slate-100 dark:border-slate-850">
                    <td colSpan={5} className="px-4 py-2 text-indigo-500 text-[10px] uppercase tracking-wider font-bold">Pricing & Market Size</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Last Traded Price (LTP)</td>
                    {stocks.map(s => (
                      <td key={s.symbol} className="px-4 py-3 text-center font-bold">
                        ₹{s.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        <span className={`block text-[10px] font-semibold mt-0.5 ${s.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {s.change >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                        </span>
                      </td>
                    ))}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Market Capitalization</td>
                    {stocks.map(s => (
                      <td key={s.symbol} className="px-4 py-3 text-center">
                        ₹{s.marketCap.toLocaleString('en-IN')} Cr
                        <span className="block text-[9px] font-bold text-slate-400 uppercase mt-0.5">{s.capType}</span>
                      </td>
                    ))}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>

                  {/* Valuation */}
                  <tr className="bg-slate-50/20 dark:bg-slate-900/10 font-bold border-b border-slate-100 dark:border-slate-850">
                    <td colSpan={5} className="px-4 py-2 text-indigo-500 text-[10px] uppercase tracking-wider font-bold">Valuation Ratios</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">P/E Ratio</td>
                    {stocks.map(s => <td key={s.symbol} className="px-4 py-3 text-center font-bold">{s.peRatio}x</td>)}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">P/B Ratio</td>
                    {stocks.map(s => <td key={s.symbol} className="px-4 py-3 text-center">{s.pbRatio}x</td>)}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">PEG Ratio</td>
                    {stocks.map(s => <td key={s.symbol} className="px-4 py-3 text-center">{s.pegRatio}</td>)}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>

                  {/* Financial quality */}
                  <tr className="bg-slate-50/20 dark:bg-slate-900/10 font-bold border-b border-slate-100 dark:border-slate-850">
                    <td colSpan={5} className="px-4 py-2 text-indigo-500 text-[10px] uppercase tracking-wider font-bold">Returns & leverage</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Return on Equity (ROE)</td>
                    {stocks.map(s => <td key={s.symbol} className="px-4 py-3 text-center font-bold text-emerald-555 dark:text-emerald-450">{s.roe}%</td>)}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Return on Capital (ROCE)</td>
                    {stocks.map(s => <td key={s.symbol} className="px-4 py-3 text-center text-emerald-555 dark:text-emerald-450">{s.roce}%</td>)}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Debt to Equity</td>
                    {stocks.map(s => <td key={s.symbol} className="px-4 py-3 text-center">{s.debtToEquity}</td>)}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Dividend Yield</td>
                    {stocks.map(s => <td key={s.symbol} className="px-4 py-3 text-center">{s.dividendYield}%</td>)}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>

                  {/* Research & Scoring */}
                  <tr className="bg-slate-50/20 dark:bg-slate-900/10 font-bold border-b border-slate-100 dark:border-slate-850">
                    <td colSpan={5} className="px-4 py-2 text-indigo-500 text-[10px] uppercase tracking-wider font-bold">Research Ratings & Sentiment</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Research Rating</td>
                    {stocks.map(s => (
                      <td key={s.symbol} className="px-4 py-3 text-center">
                        <span className="px-2.5 py-0.5 rounded font-black bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                          {s.researchScore} / 100
                        </span>
                      </td>
                    ))}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Risk Profile</td>
                    {stocks.map(s => (
                      <td key={s.symbol} className={`px-4 py-3 text-center font-bold ${
                        s.riskLevel === 'Low' ? 'text-emerald-500' : (s.riskLevel === 'High' ? 'text-rose-500' : 'text-amber-500')
                      }`}>{s.riskLevel}</td>
                    ))}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-850/40 text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">Market Sentiment</td>
                    {stocks.map(s => (
                      <td key={s.symbol} className={`px-4 py-3 text-center font-bold ${
                        s.sentiment === 'Positive' ? 'text-emerald-500' : (s.sentiment === 'Negative' ? 'text-rose-500' : 'text-slate-500')
                      }`}>{s.sentiment}</td>
                    ))}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>

                  {/* Actions */}
                  <tr className="text-slate-650 dark:text-slate-350">
                    <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-200">Full Research Profile</td>
                    {stocks.map(s => (
                      <td key={s.symbol} className="px-4 py-4 text-center">
                        <button
                          onClick={() => onSelectStock(s.symbol)}
                          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 mx-auto"
                        >
                          Analyze
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    ))}
                    {stocks.length < 5 && [...Array(5 - stocks.length)].map((_, i) => <td key={i}></td>)}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* AI consensus analysis summary */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                AI Fundamental Comparative Research Summary
              </h2>
            </div>
            
            <div className="text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {getAIComparisonSummary()}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 flex gap-2 items-start text-[10px] text-slate-450">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Disclaimer:</strong> This comparison summary is generated algorithmically by checking financial ratios. It does not constitute investment advice or target price predictions. Stock markets involve high capital risk. Conduct independent analysis.
              </span>
            </div>
          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto my-8 space-y-5">
          <GitCompare className="w-12 h-12 text-indigo-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">No stocks selected for comparison</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Please add at least 2 and up to 4 Indian stocks to compare their fundamental strengths side-by-side. You can select them below or check the "Compare" checkbox in the Screener.
          </p>
          <button
            onClick={() => setShowSelector(true)}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-indigo-500/15"
          >
            Select Stocks to Compare
          </button>
        </div>
      )}

      {/* Select Stock Checklist Drawer Modal */}
      {showSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-left shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2.5">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Add Stock to Compare</h2>
              <button 
                onClick={() => setShowSelector(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {availableStocks.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-1">
                {availableStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      onAddToCompare(stock.symbol);
                      if (compareList.length + 1 >= 4) {
                        setShowSelector(false);
                      }
                    }}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-550 transition-all text-left"
                  >
                    <div>
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">{stock.symbol}</span>
                      <span className="text-[10px] text-slate-400 block">{stock.name}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                      {stock.capType}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">All available stocks are already in the comparison tray (max 4).</p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSelector(false)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-full text-xs font-bold transition-all"
              >
                Done Selection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
