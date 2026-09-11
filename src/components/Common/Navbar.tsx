import { useState } from 'react';
import type { User } from 'firebase/auth';
import { Menu, X, Landmark, Layers, TrendingUp, Heart, BookOpen, Newspaper, GitCompare, BarChart3, LogOut, Briefcase } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { logOut } from '../../services/firebase';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectStock: (symbol: string) => void;
  user: User | null;
  onMockLogout?: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onSelectStock, user, onMockLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Landmark },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'markets', label: 'Markets', icon: BarChart3 },
    { id: 'screener', label: 'Screener', icon: Layers },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'watchlist', label: 'Watchlist', icon: Heart },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'learn', label: 'Education', icon: BookOpen },
  ];

  return (
    <header className="fixed inset-y-0 left-0 z-40 w-full lg:w-[292px] border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#171a2b] transition-colors">
      <div className="h-full px-4 sm:px-6 lg:px-5">
        <div className="flex h-16 lg:h-full lg:flex-col items-center lg:items-stretch justify-between gap-4 lg:gap-0">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 cursor-pointer select-none shrink-0 lg:pt-2 lg:pb-10" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2 rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/25">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base leading-none text-slate-900 dark:text-slate-50 tracking-tight">SharesIQ</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-1">Stock Intelligence</span>
            </div>
          </div>

          {/* Autocomplete Search Bar in Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4 lg:hidden">
            <SearchBar onSelectStock={onSelectStock} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex lg:flex-col items-stretch gap-2 font-medium shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-950/70 text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Theme, User Profile and Mobile Menu Button */}
          <div className="flex items-center gap-2 shrink-0 lg:mt-auto lg:pb-5">
            <ThemeToggle />
            
            {/* User Profile Badge (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                {(user?.displayName ?? user?.email ?? 'D').slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="max-w-32 truncate text-xs font-bold leading-none text-slate-700 dark:text-slate-300">{user?.displayName ?? user?.email ?? 'Demo mode'}</span>
                { (user || onMockLogout) && <button onClick={() => { if (onMockLogout) { onMockLogout(); } else { void logOut(); } }} className="mt-1 flex items-center gap-1 text-left text-[9px] font-medium text-rose-500 hover:text-rose-400"><LogOut className="h-3 w-3" /> Sign out</button>}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-4 space-y-3 animate-in slide-in-from-top duration-200">
          
          {/* Autocomplete Search Bar in Mobile */}
          <div className="block md:hidden w-full pb-2">
            <SearchBar onSelectStock={onSelectStock} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-3 text-sm rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-bold shadow-sm'
                      : 'text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Profile Badge (Mobile Drawer) */}
          <div className="flex sm:hidden items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
              {(user?.displayName ?? user?.email ?? 'D').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="max-w-48 truncate text-sm font-bold text-slate-850 dark:text-slate-250">{user?.displayName ?? user?.email ?? 'Demo mode'}</span>
              { (user || onMockLogout) && <button onClick={() => { if (onMockLogout) { onMockLogout(); } else { void logOut(); } }} className="flex items-center gap-1 text-left text-xs font-medium text-rose-500"><LogOut className="h-3 w-3" /> Sign out</button>}
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
