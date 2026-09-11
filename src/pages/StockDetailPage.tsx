import { useState, useEffect } from 'react';
import { getStockDetails, getNews } from '../services/apiService';
import { StockDetails, NewsItem } from '../types';
import StockHeader from '../components/StockDetail/StockHeader';
import ResearchScoreWidget from '../components/StockDetail/ResearchScoreWidget';
import CompanyOverview from '../components/StockDetail/CompanyOverview';
import SwotAnalysis from '../components/StockDetail/SwotAnalysis';
import FundamentalAnalysis from '../components/StockDetail/FundamentalAnalysis';
import FinancialStatements from '../components/StockDetail/FinancialStatements';
import TechnicalAnalysis from '../components/StockDetail/TechnicalAnalysis';
import SentimentWidget from '../components/StockDetail/SentimentWidget';
import FutureOutlookWidget from '../components/StockDetail/FutureOutlookWidget';
import RisksAnalysisWidget from '../components/StockDetail/RisksAnalysisWidget';
import CompetitorComparison from '../components/StockDetail/CompetitorComparison';
import { AlertCircle, FileText, BarChart3, TrendingUp, Sparkles, AlertTriangle, GitCompare, Newspaper, ArrowLeft } from 'lucide-react';

interface StockDetailPageProps {
  symbol: string;
  onBackToDashboard: () => void;
  onSelectStock: (symbol: string) => void;
}

type SubTabType = 'overview' | 'fundamentals' | 'financials' | 'technicals' | 'competitors' | 'sentiment' | 'risks' | 'news';

export default function StockDetailPage({ symbol, onBackToDashboard, onSelectStock }: StockDetailPageProps) {
  const [stock, setStock] = useState<StockDetails | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('overview');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const details = await getStockDetails(symbol);
        const relatedNews = await getNews(symbol);
        setStock(details);
        setNews(relatedNews);
      } catch (error) {
        console.error("Failed to load stock details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
    // Scroll to top on symbol change
    window.scrollTo(0, 0);
  }, [symbol]);

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse text-left">
        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
        {/* Header skeleton */}
        <div className="glass-panel h-36 rounded-3xl p-6 bg-slate-200 dark:bg-slate-800"></div>
        {/* Score skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel h-56 rounded-3xl p-6 bg-slate-200 dark:bg-slate-800"></div>
          <div className="glass-panel h-56 lg:col-span-2 rounded-3xl p-6 bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    );
  }

  // Error/Empty state
  if (!stock) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto my-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Stock Symbol Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The stock ticker "{symbol}" is not currently in our analysis database. Please check the spelling or search another symbol like TCS or RELIANCE.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-indigo-500/15"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'fundamentals', label: 'Fundamentals', icon: BarChart3 },
    { id: 'financials', label: 'Financials', icon: FileText },
    { id: 'technicals', label: 'Technicals', icon: TrendingUp },
    { id: 'competitors', label: 'Competitors', icon: GitCompare },
    { id: 'sentiment', label: 'Sentiment', icon: Sparkles },
    { id: 'risks', label: 'Outlook & Risks', icon: AlertTriangle },
    { id: 'news', label: 'News', icon: Newspaper },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Back button */}
      <div className="flex justify-start">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Market Overview
        </button>
      </div>

      {/* Stock Summary Header */}
      <StockHeader stock={stock} onWatchlistToggle={() => {}} />

      {/* Research Score Widget */}
      <ResearchScoreWidget stock={stock} />

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex space-x-6 min-w-full">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SubTabType)}
                className={`flex items-center gap-1.5 pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-indigo-500 hover:border-slate-300 dark:text-slate-400 dark:hover:text-indigo-400'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab Contents */}
      <div className="space-y-6">
        {activeSubTab === 'overview' && (
          <>
            <CompanyOverview stock={stock} />
            <SwotAnalysis swot={stock.swot} />
          </>
        )}
        
        {activeSubTab === 'fundamentals' && (
          <FundamentalAnalysis stock={stock} />
        )}
        
        {activeSubTab === 'financials' && (
          <FinancialStatements stock={stock} />
        )}
        
        {activeSubTab === 'technicals' && (
          <TechnicalAnalysis stock={stock} />
        )}

        {activeSubTab === 'competitors' && (
          <CompetitorComparison stock={stock} onSelectStock={onSelectStock} />
        )}

        {activeSubTab === 'sentiment' && (
          <SentimentWidget stock={stock} />
        )}

        {activeSubTab === 'risks' && (
          <>
            <RisksAnalysisWidget risksAnalysis={stock.risksAnalysis} />
            <FutureOutlookWidget stock={stock} />
          </>
        )}

        {activeSubTab === 'news' && (
          <div className="space-y-4 text-left">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-indigo-500" />
              Related News for {stock.name}
            </h2>
            
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.map((n) => (
                  <div
                    key={n.id}
                    className="glass-panel rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-800 transition-all text-left"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        <span className="text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded">
                          {n.category}
                        </span>
                        <span>{n.source} • {new Date(n.time).toLocaleDateString('en-IN')}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-850 dark:text-slate-205 leading-snug mb-1.5">
                        {n.title}
                      </h3>
                      <p className="text-xs text-slate-550 dark:text-slate-400">
                        {n.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500">
                No recent news found for this company.
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
