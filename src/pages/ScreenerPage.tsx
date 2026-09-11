import { useState, useEffect } from 'react';
import { Layers, SlidersHorizontal, ChevronDown, ChevronUp, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import { getScreenerStocks } from '../services/apiService';
import { StockDetails } from '../types';

interface ScreenerPageProps {
  onSelectStock: (symbol: string) => void;
  onAddToCompare: (symbol: string) => void;
  compareList: string[];
}

export default function ScreenerPage({ onSelectStock, onAddToCompare, compareList }: ScreenerPageProps) {
  const [stocks, setStocks] = useState<StockDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [capTypes, setCapTypes] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [peRange, setPeRange] = useState<[number, number]>([0, 100]);
  const [roeMin, setRoeMin] = useState<number>(0);
  const [debtMax, setDebtMax] = useState<number>(15);
  const [divMin, setDivMin] = useState<number>(0);
  const [aboveDma50, setAboveDma50] = useState(false);
  const [aboveDma200, setAboveDma200] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<string>('researchScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const availableSectors = [
    'Energy & Conglomerates',
    'Information Technology',
    'Financial Services',
    'FMCG & Conglomerates',
    'Automobile',
    'Telecommunication',
    'Infrastructure'
  ];

  // Load stocks when filters/sorting change
  useEffect(() => {
    async function loadScreenedStocks() {
      setIsLoading(true);
      try {
        const filters = {
          capType: capTypes.length > 0 ? capTypes : undefined,
          sector: selectedSectors.length > 0 ? selectedSectors : undefined,
          peRange: peRange[0] !== 0 || peRange[1] !== 100 ? peRange : undefined,
          roeMin: roeMin > 0 ? roeMin : undefined,
          debtToEquityMax: debtMax < 15 ? debtMax : undefined,
          dividendYieldMin: divMin > 0 ? divMin : undefined,
          aboveDma50: aboveDma50 ? true : undefined,
          aboveDma200: aboveDma200 ? true : undefined,
        };

        const results = await getScreenerStocks(filters, sortBy, sortOrder);
        setStocks(results);
      } catch (e) {
        console.error("Screening failed:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadScreenedStocks();
  }, [capTypes, selectedSectors, peRange, roeMin, debtMax, divMin, aboveDma50, aboveDma200, sortBy, sortOrder]);

  const handleCapToggle = (cap: string) => {
    setCapTypes(prev => 
      prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]
    );
  };

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const resetFilters = () => {
    setCapTypes([]);
    setSelectedSectors([]);
    setPeRange([0, 100]);
    setRoeMin(0);
    setDebtMax(15);
    setDivMin(0);
    setAboveDma50(false);
    setAboveDma200(false);
    setSortBy('researchScore');
    setSortOrder('desc');
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const renderSortArrow = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-700 ml-1 inline" />;
    return sortOrder === 'desc' 
      ? <ChevronDown className="w-3.5 h-3.5 text-indigo-500 ml-1 inline" />
      : <ChevronUp className="w-3.5 h-3.5 text-indigo-500 ml-1 inline" />;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-500" />
          Indian Stock Screener
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Filter and screen Indian blue chips using structural fundamentals, financial efficiency, valuation multiples, and technical indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Filters Side Panel */}
        <div className="glass-panel rounded-3xl p-5 space-y-6 lg:col-span-1 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2.5">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              Screener Filters
            </span>
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5 select-none"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Market Cap Checkboxes */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Market Capitalization</span>
            <div className="space-y-2 text-xs font-semibold text-slate-650 dark:text-slate-350">
              {['Large Cap', 'Mid Cap', 'Small Cap'].map(cap => (
                <label key={cap} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={capTypes.includes(cap)}
                    onChange={() => handleCapToggle(cap)}
                    className="w-4 h-4 rounded text-indigo-500 border-slate-300 focus:ring-indigo-500"
                  />
                  <span>{cap}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sectors list */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Sectors</span>
            <div className="space-y-2 text-xs font-semibold text-slate-650 dark:text-slate-350 max-h-[140px] overflow-y-auto pr-1">
              {availableSectors.map(sec => (
                <label key={sec} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSectors.includes(sec)}
                    onChange={() => handleSectorToggle(sec)}
                    className="w-4 h-4 rounded text-indigo-500 border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="truncate">{sec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* PE slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              <span>PE Ratio Max</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">{peRange[1] === 100 ? 'Any' : peRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={peRange[1]}
              onChange={(e) => setPeRange([0, parseInt(e.target.value)])}
              className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>0 (Cheapest)</span>
              <span>100 (Premium)</span>
            </div>
          </div>

          {/* ROE minimum */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              <span>Minimum ROE (%)</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">{roeMin}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="5"
              value={roeMin}
              onChange={(e) => setRoeMin(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>0%</span>
              <span>45%+</span>
            </div>
          </div>

          {/* Debt-to-Equity maximum */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              <span>Max Debt-to-Equity</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">{debtMax === 15 ? 'Any' : debtMax}</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.1"
              value={debtMax}
              onChange={(e) => setDebtMax(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>0.0 (Debt Free)</span>
              <span>1.5+ (High leverage)</span>
            </div>
          </div>

          {/* Technical overlays checkbox */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Technical Conditions</span>
            <div className="space-y-2 text-xs font-semibold text-slate-650 dark:text-slate-350">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aboveDma50}
                  onChange={(e) => setAboveDma50(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-500 border-slate-300 focus:ring-indigo-500"
                />
                <span>Above 50 DMA (Bullish)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aboveDma200}
                  onChange={(e) => setAboveDma200(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-500 border-slate-300 focus:ring-indigo-500"
                />
                <span>Above 200 DMA (Long Trend)</span>
              </label>
            </div>
          </div>

        </div>

        {/* Screener Results Panel */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Showing <strong className="text-slate-700 dark:text-slate-300">{stocks.length}</strong> matching securities</span>
            <span>Sorted by {sortBy === 'researchScore' ? 'Research Score' : sortBy.toUpperCase()}</span>
          </div>

          {isLoading ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-3.5">
              <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
              <span className="text-sm font-semibold text-slate-400">Running database screening factors...</span>
            </div>
          ) : stocks.length > 0 ? (
            <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[700px] border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-150 dark:border-slate-850 text-slate-500 dark:text-slate-400">
                      <th className="px-4 py-3 text-left font-bold w-1/4">Company</th>
                      <th className="px-4 py-3 text-right font-bold cursor-pointer hover:text-indigo-500" onClick={() => handleSort('price')}>
                        LTP (₹) {renderSortArrow('price')}
                      </th>
                      <th className="px-4 py-3 text-right font-bold cursor-pointer hover:text-indigo-500" onClick={() => handleSort('peRatio')}>
                        P/E Ratio {renderSortArrow('peRatio')}
                      </th>
                      <th className="px-4 py-3 text-right font-bold cursor-pointer hover:text-indigo-500" onClick={() => handleSort('roe')}>
                        ROE (%) {renderSortArrow('roe')}
                      </th>
                      <th className="px-4 py-3 text-right font-bold cursor-pointer hover:text-indigo-500" onClick={() => handleSort('debtToEquity')}>
                        Debt/Equity {renderSortArrow('debtToEquity')}
                      </th>
                      <th className="px-4 py-3 text-right font-bold cursor-pointer hover:text-indigo-500" onClick={() => handleSort('researchScore')}>
                        Research Score {renderSortArrow('researchScore')}
                      </th>
                      <th className="px-4 py-3 text-center font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => {
                      const isPositive = stock.change >= 0;
                      const isInCompareList = compareList.includes(stock.symbol);

                      return (
                        <tr 
                          key={stock.symbol}
                          className="border-b border-slate-100 dark:border-slate-850/40 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors"
                        >
                          {/* Symbol details */}
                          <td className="px-4 py-3.5 text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-800 dark:text-slate-150">{stock.symbol}</span>
                              <span className="text-[9px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
                                {stock.capType.split(' ')[0]}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block max-w-[170px] truncate">{stock.name}</span>
                          </td>

                          {/* Price */}
                          <td className="px-4 py-3.5 text-right font-semibold">
                            <div>₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                            <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </span>
                          </td>

                          {/* PE */}
                          <td className="px-4 py-3.5 text-right font-semibold">{stock.peRatio}</td>

                          {/* ROE */}
                          <td className="px-4 py-3.5 text-right text-emerald-550 dark:text-emerald-450 font-semibold">{stock.roe}%</td>

                          {/* Debt/Equity */}
                          <td className="px-4 py-3.5 text-right">{stock.debtToEquity}</td>

                          {/* Research Score */}
                          <td className="px-4 py-3.5 text-right font-black">
                            <span className={`px-2 py-0.5 rounded text-xs font-black ${
                              stock.researchScore >= 80 
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                            }`}>
                              {stock.researchScore}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-center space-x-2 shrink-0">
                            <button
                              onClick={() => onSelectStock(stock.symbol)}
                              className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-full text-xs font-bold transition-all shadow-sm inline-block"
                            >
                              Analyze
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCompare(stock.symbol);
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                                isInCompareList 
                                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                                  : 'border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              {isInCompareList ? 'Compared' : 'Compare'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-3.5">
              <Filter className="w-10 h-10 text-slate-350 dark:text-slate-650 mx-auto" />
              <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">No matching stocks found</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No stocks in the database match your exact filter criteria. Try relaxing your ROE minimums, expanding the PE limit, or selecting more sectors.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
