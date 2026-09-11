import { useState, useEffect } from 'react';
import { BookOpen, Search, HelpCircle, Code, Award, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { getLearnTopics } from '../services/apiService';
import { LearnTopic } from '../types';

export default function LearnPage() {
  const [topics, setTopics] = useState<LearnTopic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('l1'); // Default first item open
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      setIsLoading(true);
      try {
        const data = await getLearnTopics();
        setTopics(data);
      } catch (e) {
        console.error("Failed to load topics:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadTopics();
  }, []);

  const filteredTopics = searchQuery.trim() === ''
    ? topics
    : topics.filter((t) => {
        const q = searchQuery.toLowerCase().trim();
        return t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q);
      });

  const toggleExpand = (id: string) => {
    setExpandedTopicId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 text-left">
      
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-550 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            Stock Research Academy
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Learn how to analyze stocks using professional ratios, indicators, and formulas. Designed for beginners.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-550" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search definitions or metrics..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
          />
        </div>
      </div>

      {/* Topics list */}
      {isLoading ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3.5 animate-pulse">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
          <span className="text-sm font-semibold text-slate-400">Loading educational library...</span>
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="space-y-4">
          {filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            return (
              <div
                key={topic.id}
                className={`glass-panel rounded-3xl overflow-hidden border transition-all duration-200 ${
                  isExpanded 
                    ? 'border-indigo-500/80 shadow-md shadow-indigo-500/5 dark:shadow-indigo-950/20' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleExpand(topic.id)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none select-none"
                >
                  <div className="space-y-1 pr-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 uppercase tracking-wide">
                      {topic.category}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-850 dark:text-slate-100">{topic.title}</h3>
                    {!isExpanded && (
                      <p className="text-xs text-slate-450 dark:text-slate-500 line-clamp-1">{topic.summary}</p>
                    )}
                  </div>
                  <div className="p-1 rounded-full bg-slate-50 dark:bg-slate-850 text-slate-450 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-6 border-t border-slate-100 dark:border-slate-850/60 pt-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
                    
                    {/* Main content body */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Description</span>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {topic.content}
                      </p>
                    </div>

                    {/* Formula */}
                    {topic.formula && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 space-y-1">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5" />
                          Mathematical Formula
                        </span>
                        <code className="block text-[11px] sm:text-xs text-slate-800 dark:text-slate-350 font-bold whitespace-pre-wrap leading-relaxed">
                          {topic.formula}
                        </code>
                      </div>
                    )}

                    {/* Example */}
                    {topic.example && (
                      <div className="p-3.5 rounded-2xl bg-indigo-50/15 dark:bg-indigo-950/5 border border-indigo-100/50 dark:border-indigo-950/20 space-y-1">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          Practical Example
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-405 leading-relaxed font-semibold">
                          {topic.example}
                        </p>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty search state */
        <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
          <HelpCircle className="w-10 h-10 text-slate-350 dark:text-slate-650 mx-auto" />
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">No glossary terms found</h2>
          <p className="text-xs text-slate-405 max-w-sm mx-auto">
            No terms in the research academy match search query "{searchQuery}". Try searching basic terms like "PE", "ROE", or "CAP".
          </p>
        </div>
      )}

      {/* Basic Guidelines checklist */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <CheckCircle2 className="w-5 h-5 text-indigo-500" />
          Fundamental Rule of Research
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
          Never judge a stock on a single ratio! A low P/E could indicate undervaluation, or it could mean the business model is failing (value trap). A high debt level might be fine for utility sectors but dangerous for tech firms. Always analyze P/E, ROE, ROCE, and Debt-to-Equity side-by-side, comparing against industry peers.
        </p>
      </div>

    </div>
  );
}
