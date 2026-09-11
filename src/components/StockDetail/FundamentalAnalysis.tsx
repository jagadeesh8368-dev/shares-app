import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HelpCircle, BarChart3 } from 'lucide-react';
import { StockDetails } from '../../types';

interface FundamentalAnalysisProps {
  stock: StockDetails;
}

export default function FundamentalAnalysis({ stock }: FundamentalAnalysisProps) {
  const {
    peRatio,
    pbRatio,
    pegRatio,
    evEbitda,
    eps,
    dividendYield,
    roe,
    roce,
    debtToEquity,
    currentRatio,
    interestCoverage,
    freeCashFlow,
    financials,
  } = stock;

  const metricGroups = [
    {
      title: 'Valuation & Pricing',
      metrics: [
        { label: 'P/E Ratio', value: peRatio, desc: 'Price-to-Earnings. Compares share price to EPS.' },
        { label: 'P/B Ratio', value: pbRatio, desc: 'Price-to-Book. Compares market price to book value.' },
        { label: 'PEG Ratio', value: pegRatio, desc: 'P/E divided by growth rate. < 1.0 is undervalued.' },
        { label: 'EV/EBITDA', value: evEbitda, desc: 'Enterprise Value to EBITDA. Measures acquisition multiple.' },
        { label: 'Dividend Yield', value: `${dividendYield}%`, desc: 'Annual dividend per share relative to price.' },
      ]
    },
    {
      title: 'Efficiency & Profitability',
      metrics: [
        { label: 'Return on Equity (ROE)', value: `${roe}%`, desc: 'Net income generated relative to shareholder equity.' },
        { label: 'Return on Capital (ROCE)', value: `${roce}%`, desc: 'EBIT relative to total capital (equity + debt).' },
        { label: 'Earnings Per Share (EPS)', value: `₹${eps.toFixed(2)}`, desc: 'Net profit divided by total outstanding shares.' },
        { label: 'Free Cash Flow', value: `₹${freeCashFlow.toLocaleString('en-IN')} Cr`, desc: 'Cash generated after all capital expenditures.' },
      ]
    },
    {
      title: 'Solvency & Leverage',
      metrics: [
        { label: 'Debt to Equity', value: debtToEquity, desc: 'Leverage ratio. Zero or low (<0.5) is highly safe.' },
        { label: 'Current Ratio', value: currentRatio, desc: 'Ability to pay short-term liabilities. Ideal is >1.5.' },
        { label: 'Interest Coverage', value: interestCoverage, desc: 'EBIT divided by interest expense. High is safe.' },
      ]
    }
  ];

  // Map 5-year financials for Recharts
  const chartData = financials.incomeStatement.annual.map((item) => ({
    year: item.period,
    Revenue: item.revenue,
    NetProfit: item.netProfit
  }));

  return (
    <div className="space-y-6 text-left">
      
      {/* 5-Year Revenue & Net Profit Trend */}
      <div className="glass-panel rounded-3xl p-6">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-150 flex items-center gap-1.5 mb-4">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          5-Year Historical Performance (Revenue & Net Profit in Crores)
        </h3>
        
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
              {/* Dual Y Axis */}
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} label={{ value: 'Revenue (₹ Cr)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 10 } }} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} label={{ value: 'Net Profit (₹ Cr)', angle: 90, position: 'insideRight', style: { fill: '#94a3b8', fontSize: 10 } }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '12px', color: '#fff' }}
                labelStyle={{ fontWeight: 'bold', fontSize: 12 }}
                itemStyle={{ fontSize: 11 }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, paddingBottom: 10 }} />
              <Bar yAxisId="left" dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={45} name="Total Revenue" />
              <Bar yAxisId="right" dataKey="NetProfit" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ratios Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricGroups.map((group) => (
          <div key={group.title} className="glass-panel rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-850 pb-2">
              {group.title}
            </h3>
            
            <div className="space-y-3.5">
              {group.metrics.map((m) => (
                <div key={m.label} className="flex justify-between items-center group relative">
                  <div className="flex items-center gap-1.5 cursor-default text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{m.label}</span>
                    <div className="relative group/tooltip">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-350 hover:text-indigo-500 cursor-pointer" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 shadow-lg pointer-events-none font-medium leading-relaxed">
                        {m.desc}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-150">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
