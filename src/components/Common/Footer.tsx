import { ShieldAlert, Info, Database } from 'lucide-react';

interface FooterProps {
  isLiveAPI: boolean;
}

export default function Footer({ isLiveAPI }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Disclaimers & Alert Banner */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-6 border border-amber-200/60 dark:border-amber-950/40 glow-primary">
          <div className="flex gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-left text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">Financial Disclaimer:</span>
              This application is for informational and educational purposes only. It does not provide personalized financial advice, investment recommendations, or guaranteed predictions. Stock markets involve inherent financial risk. Users should conduct their own independent research or consult a qualified financial professional before making any investment decisions. Never invest money you cannot afford to lose.
            </div>
          </div>
        </div>

        {/* Data Source & Status Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Database className="w-4 h-4 text-indigo-500" />
            <span>
              Data Feed Mode:{' '}
              <strong className={isLiveAPI ? 'text-emerald-500' : 'text-amber-500 font-semibold'}>
                {isLiveAPI ? 'Live API (AlphaVantage)' : 'Development Demo Data'}
              </strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>NSE / BSE Listed Securities Only</span>
          </div>
          
          <div className="flex items-center gap-2 justify-center md:justify-end">
            <Info className="w-4 h-4 text-indigo-500" />
            <span>{isLiveAPI ? 'Market data may be delayed up to 15 minutes.' : 'Demo data is not real-time market data.'} Last updated: 21 Aug 2026, 6:30 PM IST</span>
          </div>
        </div>

        {/* Copyright and links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-400 dark:text-slate-500">
          <div>
            © {currentYear} InvestInsight India. Built for professional stock research, fundamental screening, and market analysis.
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-indigo-500 transition-colors">Terms of Use</a>
            <a href="#contact" className="hover:text-indigo-500 transition-colors">Research Methodology</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
