import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { searchStocks } from '../../services/apiService';
import { StockSummary } from '../../types';

interface SearchBarProps {
  onSelectStock: (symbol: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ onSelectStock, placeholder = "Search stocks (e.g. TCS, Reliance)...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockSummary[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch results when query changes
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const searchResults = await searchStocks(query);
        setResults(searchResults.slice(0, 5)); // Limit to top 5
      } catch (error) {
        console.error("Search failed:", error);
      }
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex].symbol);
      } else if (results.length > 0) {
        handleSelect(results[0].symbol);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {isOpen && (query.trim() !== '') && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <ul className="py-1.5">
              {results.map((stock, idx) => {
                const isSelected = stock.change >= 0;
                return (
                  <li
                    key={stock.symbol}
                    onClick={() => handleSelect(stock.symbol)}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                      idx === activeIndex
                        ? 'bg-indigo-50/75 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-50'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{stock.symbol}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {stock.capType}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{stock.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">₹{stock.price.toLocaleString('en-IN')}</div>
                      <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isSelected ? '+' : ''}{stock.changePercent}%
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-slate-400 dark:text-slate-500">
              No stocks found matching "{query}"
            </div>
          )}
        </div>
      )}

      {/* Popular searches suggestions when search is empty but focused */}
      {isOpen && !query && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl backdrop-blur-xl p-4 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            Popular Research Searches
          </div>
          <div className="flex flex-wrap gap-2">
            {['RELIANCE', 'TCS', 'INFY', 'HDFCBANK'].map(sym => (
              <button
                key={sym}
                onClick={() => handleSelect(sym)}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
