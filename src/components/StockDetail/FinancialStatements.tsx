import { useState } from 'react';
import { FileText, Coins, CalendarDays } from 'lucide-react';
import { StockDetails, FinancialItem } from '../../types';

interface FinancialStatementsProps {
  stock: StockDetails;
}

type StatementType = 'income' | 'balance' | 'cashflow';
type PeriodType = 'annual' | 'quarterly';

export default function FinancialStatements({ stock }: FinancialStatementsProps) {
  const [statement, setStatement] = useState<StatementType>('income');
  const [periodType, setPeriodType] = useState<PeriodType>('annual');

  const { financials } = stock;

  // Retrieve current active items based on period type
  const getActiveItems = (): FinancialItem[] => {
    switch (statement) {
      case 'income':
        return periodType === 'annual' 
          ? financials.incomeStatement.annual 
          : financials.incomeStatement.quarterly;
      case 'balance':
        return periodType === 'annual' 
          ? financials.balanceSheet.annual 
          : financials.balanceSheet.quarterly;
      case 'cashflow':
        return periodType === 'annual' 
          ? financials.cashFlow.annual 
          : financials.cashFlow.quarterly;
    }
  };

  const activeItems = getActiveItems();

  // Define rows to render for each statement type
  const renderRows = () => {
    switch (statement) {
      case 'income':
        return [
          { label: 'Revenue (₹ Cr)', key: 'revenue', bold: true },
          { label: 'Expenses (₹ Cr)', key: 'expenses', bold: false },
          { label: 'Operating Profit / EBITDA (₹ Cr)', key: 'operatingProfit', bold: true },
          { label: 'Finance Interest (₹ Cr)', key: 'interest', bold: false },
          { label: 'Profit Before Tax / PBT (₹ Cr)', key: 'profitBeforeTax', bold: false },
          { label: 'Net Profit (₹ Cr)', key: 'netProfit', bold: true },
          { label: 'Earnings Per Share / EPS (₹)', key: 'eps', formatCurrencySymbol: '₹', bold: true },
        ];
      case 'balance':
        return [
          { label: 'Total Assets (₹ Cr)', key: 'assets', bold: true },
          { label: 'Shareholder Equity (₹ Cr)', key: 'equity', bold: true },
          { label: 'Total Debt (₹ Cr)', key: 'debt', bold: false },
          { label: 'Total Liabilities (₹ Cr)', key: 'liabilities', bold: false },
          { label: 'Cash & Balances (₹ Cr)', key: 'cash', bold: true },
        ];
      case 'cashflow':
        return [
          { label: 'Operating Cash Flow (₹ Cr)', key: 'operatingCashFlow', bold: true },
          { label: 'Investing Cash Flow (₹ Cr)', key: 'investingCashFlow', bold: false },
          { label: 'Financing Cash Flow (₹ Cr)', key: 'financingCashFlow', bold: false },
          { label: 'Free Cash Flow (₹ Cr)', key: 'freeCashFlow', bold: true },
        ];
    }
  };

  const rows = renderRows();

  return (
    <div className="glass-panel rounded-3xl p-6 text-left space-y-6">
      
      {/* Tab Controls & Period Switch */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
        
        {/* Statement Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatement('income')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shrink-0 transition-colors ${
              statement === 'income'
                ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Income Statement
          </button>
          <button
            onClick={() => setStatement('balance')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shrink-0 transition-colors ${
              statement === 'balance'
                ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Balance Sheet
          </button>
          <button
            onClick={() => setStatement('cashflow')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shrink-0 transition-colors ${
              statement === 'cashflow'
                ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Cash Flow
          </button>
        </div>

        {/* Period toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 select-none">
          <button
            onClick={() => setPeriodType('annual')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              periodType === 'annual'
                ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Annual
          </button>
          <button
            onClick={() => setPeriodType('quarterly')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              periodType === 'quarterly'
                ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Quarterly
          </button>
        </div>

      </div>

      {/* Financial Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-850">
        <table className="w-full min-w-[500px] border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-850">
              <th className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400 w-1/3">
                Line Item
              </th>
              {activeItems.map((item) => (
                <th key={item.period} className="px-4 py-3 text-right font-black text-slate-700 dark:text-slate-350">
                  {item.period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr 
                key={row.key} 
                className={`border-b border-slate-100/60 dark:border-slate-850/40 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 ${
                  row.bold ? 'font-bold bg-slate-50/15 dark:bg-slate-900/5' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <td className={`px-4 py-3 text-left ${row.bold ? 'text-slate-850 dark:text-slate-205 font-bold' : ''}`}>
                  {row.label}
                </td>
                {activeItems.map((item: any) => {
                  const val = item[row.key];
                  return (
                    <td key={item.period} className={`px-4 py-3 text-right ${row.bold ? 'text-slate-850 dark:text-slate-200' : ''}`}>
                      {val !== undefined 
                        ? (row.formatCurrencySymbol || '') + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : '-'
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-550 border-t border-slate-100 dark:border-slate-850 pt-3">
        <span>*Values listed in Crores (₹ Cr) except per-share metrics (EPS).</span>
        <span>Source: SEC & NSE filings.</span>
      </div>

    </div>
  );
}
