import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface MarketTimeStatus {
  status: 'OPEN' | 'CLOSED' | 'PRE_MARKET' | 'POST_MARKET';
  label: string;
  color: string;
}

export default function MarketStatus() {
  const [timeStatus, setTimeStatus] = useState<MarketTimeStatus>({
    status: 'CLOSED',
    label: 'Market Closed',
    color: 'bg-rose-500'
  });
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateMarketStatus = () => {
      // Calculate IST time (UTC + 5:30)
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istTime = new Date(utcTime + (3600000 * 5.5));
      
      const day = istTime.getDay(); // 0 = Sun, 6 = Sat
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const currentTimeDecimal = hours + minutes / 60;

      // Format time string for display
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      };
      setTimeString(new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST');

      const isWeekend = day === 0 || day === 6;

      if (isWeekend) {
        setTimeStatus({
          status: 'CLOSED',
          label: 'Market Closed (Weekend)',
          color: 'bg-rose-500'
        });
        return;
      }

      // Pre-market: 9:00 AM - 9:15 AM
      if (currentTimeDecimal >= 9.0 && currentTimeDecimal < 9.25) {
        setTimeStatus({
          status: 'PRE_MARKET',
          label: 'Pre-Market Session',
          color: 'bg-amber-500 animate-pulse'
        });
      }
      // Normal Trading Hours: 9:15 AM - 3:30 PM
      else if (currentTimeDecimal >= 9.25 && currentTimeDecimal < 15.5) {
        setTimeStatus({
          status: 'OPEN',
          label: 'Market Open',
          color: 'bg-emerald-500 animate-ping-slow' // custom helper class
        });
      }
      // Post-market: 3:30 PM - 4:00 PM
      else if (currentTimeDecimal >= 15.5 && currentTimeDecimal < 16.0) {
        setTimeStatus({
          status: 'POST_MARKET',
          label: 'Post-Market Session',
          color: 'bg-amber-400'
        });
      }
      // Market Closed
      else {
        setTimeStatus({
          status: 'CLOSED',
          label: 'Market Closed',
          color: 'bg-rose-500'
        });
      }
    };

    updateMarketStatus();
    const interval = setInterval(updateMarketStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel flex items-center justify-between px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm grow-0 shrink-0 select-none">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {timeStatus.status === 'OPEN' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          {timeStatus.status === 'PRE_MARKET' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${timeStatus.color}`}></span>
        </span>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
          {timeStatus.label}
        </span>
      </div>
      <div className="flex items-center gap-1.5 pl-4 border-l border-slate-200 dark:border-slate-850 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <Clock className="w-3.5 h-3.5 text-indigo-500" />
        <span>{timeString}</span>
      </div>
    </div>
  );
}
