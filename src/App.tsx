import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import AuthPage from './components/Common/AuthPage';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import DashboardPage from './pages/DashboardPage';
import StockDetailPage from './pages/StockDetailPage';
import ScreenerPage from './pages/ScreenerPage';
import ComparePage from './pages/ComparePage';
import WatchlistPage from './pages/WatchlistPage';
import NewsPage from './pages/NewsPage';
import LearnPage from './pages/LearnPage';
import MarketsPage from './pages/MarketsPage';
import PortfolioPage from './pages/PortfolioPage';
import SearchBar from './components/Common/SearchBar';
import MarketStatus from './components/Dashboard/MarketStatus';
import { isLiveAPIDataActive } from './services/apiService';
import { isFirebaseConfigured, subscribeToAuth } from './services/firebase';
import './App.css';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [mockLoggedIn, setMockLoggedIn] = useState(() => localStorage.getItem('mockLoggedIn') === 'true');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isLiveAPI, setIsLiveAPI] = useState(false);

  useEffect(() => {
    setIsLiveAPI(isLiveAPIDataActive());
  }, []);

  const handleMockLogin = () => {
    localStorage.setItem('mockLoggedIn', 'true');
    setMockLoggedIn(true);
  };

  const handleMockLogout = () => {
    localStorage.removeItem('mockLoggedIn');
    setMockLoggedIn(false);
  };

  if (!mockLoggedIn) {
    return <AuthPage onMockLogin={handleMockLogin} />;
  }

  const handleSelectStock = (symbol: string) => {
    setSelectedSymbol(symbol.toUpperCase());
    // Keep activeTab, but show detail page
  };

  const handleBackToDashboard = () => {
    setSelectedSymbol(null);
  };

  const handleAddToCompare = (symbol: string) => {
    const upperSym = symbol.toUpperCase();
    setCompareList((prev) => {
      if (prev.includes(upperSym)) {
        return prev.filter(s => s !== upperSym);
      }
      if (prev.length >= 4) {
        alert("Comparison Console limit reached! You can compare a maximum of 4 stocks side-by-side. Please remove a stock first.");
        return prev;
      }
      return [...prev, upperSym];
    });
  };

  const handleRemoveFromCompare = (symbol: string) => {
    const upperSym = symbol.toUpperCase();
    setCompareList((prev) => prev.filter(s => s !== upperSym));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedSymbol(null); // Clear selected stock when navigating to another tab
  };

  const renderPageContent = () => {
    if (selectedSymbol) {
      return (
        <StockDetailPage
          symbol={selectedSymbol}
          onBackToDashboard={handleBackToDashboard}
          onSelectStock={handleSelectStock}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onSelectStock={handleSelectStock}
            setActiveTab={handleTabChange}
          />
        );
      case 'screener':
        return (
          <ScreenerPage
            onSelectStock={handleSelectStock}
            onAddToCompare={handleAddToCompare}
            compareList={compareList}
          />
        );
      case 'markets':
        return <MarketsPage />;
      case 'compare':
        return (
          <ComparePage
            compareList={compareList}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddToCompare={handleAddToCompare}
            onClearCompare={handleClearCompare}
            onSelectStock={handleSelectStock}
          />
        );
      case 'watchlist':
        return (
          <WatchlistPage
            onSelectStock={handleSelectStock}
          />
        );
      case 'news':
        return (
          <NewsPage
            onSelectStock={handleSelectStock}
          />
        );
      case 'portfolio':
        return (
          <PortfolioPage 
            userId={user?.uid || null}
            onSelectStock={handleSelectStock}
          />
        );
      case 'learn':
        return (
          <LearnPage />
        );
      default:
        return (
          <DashboardPage
            onSelectStock={handleSelectStock}
            setActiveTab={handleTabChange}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-16 lg:pt-0 bg-slate-50 dark:bg-[#101321] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Navigation bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onSelectStock={handleSelectStock}
        user={user}
        onMockLogout={handleMockLogout}
      />

      <div className="lg:ml-[292px] border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#141727] backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <div className="flex-1 max-w-xl hidden sm:block">
            <SearchBar onSelectStock={handleSelectStock} />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <MarketStatus />
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      <main className="flex-grow lg:ml-[292px] max-w-none w-auto mx-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {renderPageContent()}
      </main>

      {/* Footer disclaimers & dispatches */}
      <div className="lg:ml-[292px]"><Footer isLiveAPI={isLiveAPI} /></div>

    </div>
  );
}
