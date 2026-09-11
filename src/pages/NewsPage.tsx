import { useState, useEffect } from 'react';
import { Newspaper, Search, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getNews, isLiveAPIDataActive } from '../services/apiService';
import { NewsItem } from '../types';

interface NewsPageProps {
  onSelectStock: (symbol: string) => void;
}

type NewsCategoryFilter = 'ALL' | 'Company' | 'Market' | 'Sector' | 'Earnings' | 'Regulatory';

export default function NewsPage({ onSelectStock }: NewsPageProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState<NewsCategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const isLiveAPI = isLiveAPIDataActive();

  useEffect(() => {
    async function loadNews() {
      setIsLoading(true);
      try {
        const data = await getNews();
        setNews(data);
      } catch (e) {
        console.error("Failed to load news:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadNews();
  }, []);

  // Filter news when category or search changes
  let filteredNews = [...news];
  if (category !== 'ALL') {
    filteredNews = filteredNews.filter(n => n.category === category);
  }
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filteredNews = filteredNews.filter(
      n =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        (n.symbol && n.symbol.toLowerCase().includes(q))
    );
  }

  const categories: { id: NewsCategoryFilter; label: string }[] = [
    { id: 'ALL', label: 'All News' },
    { id: 'Company', label: 'Companies' },
    { id: 'Market', label: 'Market Overview' },
    { id: 'Sector', label: 'Sector Analysis' },
    { id: 'Earnings', label: 'Earnings Reports' },
    { id: 'Regulatory', label: 'Regulatory / RBI' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-indigo-500" />
          Indian Financial News Desk
        </h1>
        <p className="text-xs text-slate-405 dark:text-slate-500 mt-0.5">
          {isLiveAPI ? 'Live news is supplied by the configured provider and may be delayed.' : 'Demo news is shown for development; live news is currently unavailable.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        
        {/* Category Toggles */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full no-scrollbar select-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-colors ${
                category === cat.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                  : 'text-slate-505 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-550" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news or symbols..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
          />
        </div>

      </div>

      {/* News Grid */}
      {isLoading ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3.5 animate-pulse">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
          <span className="text-sm font-semibold text-slate-400">Fetching financial news feeds...</span>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((n) => (
            <div
              key={n.id}
              className="glass-panel rounded-3xl p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-800 transition-all text-left group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-xs font-semibold">
                  <span className="text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded">
                    {n.category}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">
                    {n.source} • {new Date(n.time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-slate-200 leading-snug mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                  {n.summary}
                </p>
              </div>

              {/* Research Link / Symbol */}
              {n.symbol && (
                <div 
                  onClick={() => onSelectStock(n.symbol!)}
                  className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs font-bold text-slate-450 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  <span>Research Stock: <strong className="text-indigo-500 dark:text-indigo-400">{n.symbol}</strong></span>
                  <span className="flex items-center gap-0.5 group-hover:underline">
                    Analyze fundamentals
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
          <AlertCircle className="w-10 h-10 text-slate-350 dark:text-slate-650 mx-auto" />
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">No news articles found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No articles match category "{category}" or search query "{searchQuery}". Try searching simple terms or selecting "All News".
          </p>
        </div>
      )}

      {/* Live News warning */}
      <div className="glass-panel p-4.5 rounded-2xl border border-slate-150 dark:border-slate-850 text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/20 flex gap-2">
        <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <span>
          <strong>Data transparency note:</strong> {isLiveAPI ? 'News availability and timing depend on the configured licensed provider.' : 'Live news data is currently unavailable. The headlines shown are development/demo records and must not be treated as current market news.'}
        </span>
      </div>

    </div>
  );
}
