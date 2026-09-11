import { Newspaper, GraduationCap, Flame, ArrowRight, ArrowUpRight } from 'lucide-react';
import MarketStatus from '../components/Dashboard/MarketStatus';
import MarketIndices from '../components/Dashboard/MarketIndices';
import TrendingStocks from '../components/Dashboard/TrendingStocks';
import TopOpportunities from '../components/Dashboard/TopOpportunities';
import SearchBar from '../components/Common/SearchBar';
import { mockNewsData, mockLearnTopics } from '../services/mockData';

interface DashboardPageProps {
  onSelectStock: (symbol: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function DashboardPage({ onSelectStock, setActiveTab }: DashboardPageProps) {
  // Get top 3 news items
  const recentNews = mockNewsData.slice(0, 3);
  // Get top 2 learn topics
  const featuredLearn = mockLearnTopics.slice(0, 2);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden py-12 px-6 sm:px-12 text-center bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl glow-primary">
        {/* Ambient light effects */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-[100px]"></div>

        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-indigo-400 fill-current animate-pulse" />
            Empowering Smarter Decisions
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            Understand Stocks. <br className="hidden sm:inline" />
            Analyze Better. Invest Smarter.
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
            Research Indian stocks listed on NSE & BSE using in-depth fundamentals, technical trends, risk metrics, and real market sentiment.
          </p>

          {/* Search bar inside hero */}
          <div className="max-w-lg mx-auto pt-2">
            <SearchBar 
              onSelectStock={onSelectStock} 
              placeholder="Search Indian stocks (e.g. TCS, RELIANCE, HDFCBANK)..."
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
            <span className="font-semibold">Quick Research:</span>
            {['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATAMOTORS'].map((sym) => (
              <button
                key={sym}
                onClick={() => onSelectStock(sym)}
                className="hover:text-indigo-300 hover:underline transition-colors font-medium"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Market Overview Segment */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-left">
            <h2 className="text-lg font-black text-slate-805 dark:text-slate-100">
              Indian Stock Markets
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Major benchmark and sectoral indices performance.
            </p>
          </div>
          <MarketStatus />
        </div>
        <MarketIndices />
      </section>

      {/* Trending Section */}
      <section>
        <TrendingStocks onSelectStock={onSelectStock} />
      </section>

      {/* Top Opportunities */}
      <section>
        <TopOpportunities 
          onSelectStock={onSelectStock} 
          onNavigateToScreener={() => setActiveTab('screener')} 
        />
      </section>

      {/* Two Column News & Learn Highlights */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* News Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-indigo-500" />
              Latest Financial News
            </h2>
            <button
              onClick={() => setActiveTab('news')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-1"
            >
              All News
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {recentNews.map((news) => (
              <div
                key={news.id}
                onClick={() => news.symbol && onSelectStock(news.symbol)}
                className="glass-panel rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-800 transition-all text-left cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs font-semibold">
                    <span className="text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                      {news.category}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {news.source} • {new Date(news.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-850 dark:text-slate-205 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-1.5">
                    {news.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-2">
                    {news.summary}
                  </p>
                </div>
                {news.symbol && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
                    <span>Research Related: <strong className="text-indigo-500 dark:text-indigo-400">{news.symbol}</strong></span>
                    <span className="flex items-center gap-0.5 text-indigo-500 dark:text-indigo-400 group-hover:underline">
                      Analyze
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education Library Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              Beginners Learning Hub
            </h2>
            <button
              onClick={() => setActiveTab('learn')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-1"
            >
              Browse Library
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {featuredLearn.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setActiveTab('learn')}
                className="glass-panel rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-800 transition-all text-left cursor-pointer group"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2 inline-block">
                    {topic.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-850 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-tight mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-3 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>
                
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs font-bold text-indigo-500 dark:text-indigo-400 group-hover:underline">
                  <span>Read Article & Example</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
