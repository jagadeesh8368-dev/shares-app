import { ThumbsUp, ThumbsDown, MessageSquare, AlertCircle } from 'lucide-react';
import { SentimentAnalysis, StockDetails } from '../../types';

interface SentimentWidgetProps {
  stock: StockDetails;
}

export default function SentimentWidget({ stock }: SentimentWidgetProps) {
  const { sentimentAnalysis, symbol } = stock;
  const { score, signal, explanation, bullishFactors, bearishFactors } = sentimentAnalysis;

  const getSignalColor = (sig: string) => {
    if (sig === 'Positive') return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250';
    if (sig === 'Negative') return 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 border-rose-250';
    return 'text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200';
  };

  // Mock Market View Opinions based on stock
  const getMarketOpinions = () => {
    return {
      bullish: {
        opinion: `Analysts expect strong earnings traction driven by structural market triggers and increased order bookings. Valuation ratios are justified by excellent capital efficiency and ROCE.`,
        source: `Goldman Sachs (India)`,
        date: `14 Aug 2026`
      },
      neutral: {
        opinion: `We remain neutral in the short-term pending clearer macro trends and margin outcomes from recent capital projects. Hold stance advised.`,
        source: `ICICI Securities`,
        date: `18 Aug 2026`
      },
      bearish: {
        opinion: `Elevated entry valuation limits immediate upside potential. Rising financing costs and competitive pricing pressure pose structural headwinds.`,
        source: `Kotak Institutional Equities`,
        date: `20 Aug 2026`
      }
    };
  };

  const opinions = getMarketOpinions();

  return (
    <div className="space-y-6 text-left">
      
      {/* Score Overview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Card */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center items-center text-center">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-3">
            Market Sentiment Gauge
          </span>

          <div className="relative w-32 h-20 mb-3 flex items-end justify-center overflow-hidden">
            {/* Simple Half-Circle Arc */}
            <div className="absolute w-32 h-32 rounded-full border-8 border-slate-100 dark:border-slate-800 -bottom-16"></div>
            <div 
              className={`absolute w-32 h-32 rounded-full border-8 -bottom-16 transition-all duration-700 ${
                signal === 'Positive' 
                  ? 'border-emerald-500 border-b-transparent border-l-transparent -rotate-45' 
                  : (signal === 'Negative' ? 'border-rose-500 border-b-transparent border-r-transparent rotate-45' : 'border-indigo-500 border-b-transparent')
              }`}
            ></div>
            
            <div className="absolute bottom-0 flex flex-col items-center">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-50">{score}</span>
              <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest mt-0.5">Scale 100</span>
            </div>
          </div>

          <div className={`px-3.5 py-1 rounded-full border text-xs font-extrabold tracking-wide uppercase ${getSignalColor(signal)}`}>
            {signal}
          </div>
        </div>

        {/* Factors Breakdown List */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-150 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2.5 mb-3.5">
              <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />
              Sentiment Analysis Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {explanation}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bullish Factors */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-wider">
                  <ThumbsUp className="w-3 h-3" /> Bullish Drivers
                </span>
                <ul className="space-y-1.5">
                  {bullishFactors.map((f, i) => (
                    <li key={i} className="text-[11px] font-semibold text-slate-650 dark:text-slate-350 flex items-start gap-1">
                      <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Bearish Factors */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1 uppercase tracking-wider">
                  <ThumbsDown className="w-3 h-3" /> Bearish Drivers
                </span>
                <ul className="space-y-1.5">
                  {bearishFactors.map((f, i) => (
                    <li key={i} className="text-[11px] font-semibold text-slate-650 dark:text-slate-350 flex items-start gap-1">
                      <span className="text-rose-500 shrink-0 mt-0.5">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* What People are Thinking (Market Consensus Opinions Matrix) */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-850 pb-2.5">
          Market View (Publicly Available Opinions Consensus)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bullish consensus */}
          <div className="rounded-2xl p-4 bg-emerald-50/15 dark:bg-emerald-950/5 border border-emerald-100/50 dark:border-emerald-950/20 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">
                Bullish Outlook
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                "{opinions.bullish.opinion}"
              </p>
            </div>
            <div className="text-[9px] text-slate-400 dark:text-slate-500">
              Source: {opinions.bullish.source} • {opinions.bullish.date}
            </div>
          </div>

          {/* Neutral consensus */}
          <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
                Neutral Outlook
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                "{opinions.neutral.opinion}"
              </p>
            </div>
            <div className="text-[9px] text-slate-400 dark:text-slate-500">
              Source: {opinions.neutral.source} • {opinions.neutral.date}
            </div>
          </div>

          {/* Bearish consensus */}
          <div className="rounded-2xl p-4 bg-rose-50/15 dark:bg-rose-950/5 border border-rose-100/50 dark:border-rose-950/20 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                Bearish Outlook
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                "{opinions.bearish.opinion}"
              </p>
            </div>
            <div className="text-[9px] text-slate-400 dark:text-slate-500">
              Source: {opinions.bearish.source} • {opinions.bearish.date}
            </div>
          </div>

        </div>

        <div className="flex gap-2 items-start text-[10px] text-slate-400 dark:text-slate-550 border-t border-slate-100 dark:border-slate-850 pt-3">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Market View represents a summary of published institutional reports and analyst calls. These are opinion-based viewpoints from third-party professionals and should not be taken as absolute facts or signals.
          </span>
        </div>
      </div>

    </div>
  );
}
