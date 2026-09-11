import { useState } from 'react';
import { AlertCircle, BarChart3, Bot, Search, Star, TrendingUp, Loader2 } from 'lucide-react';
import { isFirebaseConfigured, signInWithGoogle } from '../../services/firebase';

interface AuthPageProps {
  onMockLogin?: () => void;
}

export default function AuthPage({ onMockLogin }: AuthPageProps) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    
    if (email === 'admin@test.com' && password === '123456') {
      if (onMockLogin) {
        onMockLogin();
      }
    } else {
      setError('Invalid credentials. Hint: use admin@test.com / 123456');
    }
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (authError: any) {
      const errorCode = authError?.code || '';
      const errorMessage = authError?.message || '';
      
      if (errorCode === 'auth/operation-not-allowed' || errorMessage.includes('auth/operation-not-allowed')) {
        setError('Google Sign-in is not enabled in your Firebase Console. Please go to Authentication > Sign-in method and enable Google.');
      } else if (errorCode === 'auth/popup-closed-by-user' || errorMessage.includes('auth/popup-closed-by-user')) {
        setError('Sign in was cancelled. Please try again.');
      } else if (errorCode === 'auth/network-request-failed' || errorMessage.includes('auth/network-request-failed')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Authentication failed: ${errorMessage || 'Unknown error'}`);
      }
      console.error('Firebase Auth Error:', authError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[100dvh] py-12 bg-slate-50 px-4 flex flex-col items-center justify-center text-slate-900 font-sans">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        
        {/* Logo */}
        <div className="mb-6 rounded-[1.25rem] bg-indigo-500 p-4 shadow-lg shadow-indigo-500/30">
          <TrendingUp className="h-10 w-10 text-white" strokeWidth={2.5} />
        </div>

        {/* Headings */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">SharesIQ</h1>
        <p className="text-center text-slate-500 max-w-sm sm:max-w-md text-base sm:text-lg mb-10 leading-relaxed font-medium">
          Your AI-powered Indian stock intelligence platform.<br/>Sign in to access your personalized dashboard.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
          <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <BarChart3 className="h-7 w-7 text-emerald-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Market Overview</h3>
            <p className="text-sm text-slate-400 font-medium">Live indices & sentiment</p>
          </div>
          
          <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <Bot className="h-7 w-7 text-indigo-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">AI Signals</h3>
            <p className="text-sm text-slate-400 font-medium">Buy / Hold / Sell insights</p>
          </div>

          <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Watchlist</h3>
            <p className="text-sm text-slate-400 font-medium">Synced across devices</p>
          </div>

          <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <Search className="h-7 w-7 text-slate-700" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Stock Discovery</h3>
            <p className="text-sm text-slate-400 font-medium">Filter & compare stocks</p>
          </div>
        </div>

        {/* Firebase Warning */}
        {!isFirebaseConfigured && (
          <div className="mb-6 flex w-full gap-3 rounded-2xl border border-amber-400/50 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <span>Firebase is not configured yet. Add the Firebase values to your `.env` file.</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 w-full flex flex-col gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailAuth} className="w-full sm:max-w-md flex flex-col gap-4 mb-6">
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="text-center w-full sm:max-w-md mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
        <div className="flex w-full sm:max-w-md items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OR</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={!isFirebaseConfigured || isSubmitting}
          className="flex w-full sm:max-w-md items-center justify-center gap-3 rounded-full bg-white border-[3px] border-slate-900 px-6 py-3.5 font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-800" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          {isSubmitting ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Disclaimer */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-500">
          <span className="text-sm">⚠️</span> For educational purposes only. Not financial advice. All data is simulated/mock.
        </div>
      </div>
    </main>
  );
}
