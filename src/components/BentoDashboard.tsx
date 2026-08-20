import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Receipt, 
  Plus, 
  ChevronRight, 
  Globe, 
  Sparkles, 
  Layers, 
  Percent, 
  Flame 
} from 'lucide-react';
import { Category, Transaction } from '../types';
import { CategoryIcon } from '../constants/icons';
import { AnimatedNumber } from './AnimatedNumber';

interface BentoDashboardProps {
  categories: Category[];
  transactions: Transaction[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  monthlyBudgetLimit: number;
  onNavigateToTxns: () => void;
  onNavigateToCgrt: () => void;
  onNavigateToRomance: () => void;
  onNavigateToAI: () => void;
  onNavigateToSettings: () => void;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  onShowToast: (msg: string) => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({
  categories,
  transactions,
  selectedCategory,
  onSelectCategory,
  monthlyBudgetLimit,
  onNavigateToTxns,
  onNavigateToCgrt,
  onNavigateToRomance,
  onNavigateToAI,
  onNavigateToSettings,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onShowToast,
  onAddTransaction,
}) => {
  // Live Exchange Rates state
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    USD: 0.00818,
    EUR: 0.00702,
    GBP: 0.00602,
    SAR: 0.0306,
  });
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [targetCurrency, setTargetCurrency] = useState<string>('USD');

  useEffect(() => {
    fetch('/api/rates')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setExchangeRates(data.rates);
        }
      })
      .catch((err) => console.warn('Could not fetch rates:', err));
  }, []);

  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const budgetRemaining = monthlyBudgetLimit - totalExpense;
  const budgetPercent = Math.min(Math.round((totalExpense / monthlyBudgetLimit) * 100), 100);

  // Safe daily spend remaining
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate() || 1;
  const remainingDays = Math.max(daysInMonth - currentDay + 1, 1);
  const safeDailySpend = Math.max(Math.round(budgetRemaining / remainingDays), 0);

  const savingsRate = totalIncome > 0 
    ? Math.max(Math.round(((totalIncome - totalExpense) / totalIncome) * 100), 0)
    : 0;

  // Category Spend Matrix
  const categoryChartData = categories
    .map((cat) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === cat.id)
        .reduce((acc, t) => acc + t.amount, 0);
      const percent = totalExpense > 0 ? Math.round((spent / totalExpense) * 100) : 0;
      return { ...cat, spent, percent };
    })
    .filter((cat) => cat.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  const convertedValue = exchangeRates[targetCurrency]
    ? (calcAmount * exchangeRates[targetCurrency]).toFixed(2)
    : (calcAmount * 0.0082).toFixed(2);

  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="w-full flex flex-col gap-4.5 pb-24">
      {/* ─────────────────────────────────────────────────────────────
          MINIMAL BENTO GRID (CORE ESSENTIALS ONLY)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4.5">
        
        {/* ── CARD 1: HERO NET BALANCE & INFLOW/OUTFLOW (8 cols) ── */}
        <div className="md:col-span-8 bento-card p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#13151F] via-[#10121A] to-[#0D0E15] animate-fade-in-up stagger-1">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="flex flex-col gap-5 relative z-10">
            {/* Header Badge & Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono-nums font-semibold bg-white/[0.06] text-zinc-300 border border-white/[0.08] flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  Net Liquid Balance
                </span>
                {savingsRate > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono-nums font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <Percent className="w-3 h-3" />
                    {savingsRate}% Saved
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenIncomeModal}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 active:scale-95 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Income</span>
                </button>
                <button
                  onClick={onOpenExpenseModal}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 active:scale-95 transition-all flex items-center gap-1"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Expense</span>
                </button>
              </div>
            </div>

            {/* Main Balance Display */}
            <div className="flex flex-col gap-0.5">
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-display font-mono-nums">
                <AnimatedNumber value={currentBalance} prefix="৳" />
              </div>
              <span className="text-xs text-zinc-400 font-medium">
                Current available funds across all student records
              </span>
            </div>

            {/* Inflow / Outflow Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3.5 border-t border-white/[0.08]">
              {/* Total Income */}
              <div className="bento-inner-box p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                      Total Inflow
                    </span>
                    <span className="text-sm font-bold text-emerald-400 font-mono-nums">
                      +<AnimatedNumber value={totalIncome} prefix="৳" />
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono-nums">
                  {transactions.filter((t) => t.type === 'income').length} entries
                </span>
              </div>

              {/* Total Expense */}
              <div className="bento-inner-box p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                      Total Outflow
                    </span>
                    <span className="text-sm font-bold text-rose-400 font-mono-nums">
                      -<AnimatedNumber value={totalExpense} prefix="৳" />
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono-nums">
                  {transactions.filter((t) => t.type === 'expense').length} entries
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 2: MONTHLY BUDGET VELOCITY GAUGE (4 cols) ── */}
        <div className="md:col-span-4 bento-card p-6 flex flex-col justify-between bg-[#12131A] animate-fade-in-up stagger-2">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-2 uppercase tracking-wider">
                <PieChart className="w-4 h-4 text-amber-400" />
                Budget Velocity
              </span>
              <button
                onClick={onNavigateToSettings}
                className="text-[11px] text-zinc-400 hover:text-white transition-colors"
                title="Edit Budget"
              >
                Set Limit
              </button>
            </div>

            {/* Spent vs Budget Limit */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-nums">
                  <AnimatedNumber value={budgetPercent} suffix="%" />
                </span>
                <span className="text-xs text-zinc-400 font-mono-nums">
                  ৳{totalExpense.toLocaleString('en-BD')} / ৳{monthlyBudgetLimit.toLocaleString('en-BD')}
                </span>
              </div>

              {/* Progress Meter */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    budgetPercent > 85
                      ? 'bg-rose-500'
                      : budgetPercent > 65
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
            </div>

            {/* Safe Daily Spend Metric */}
            <div className="bento-inner-box p-3 flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Daily Safe Spend:
                </span>
                <span className="font-bold text-white font-mono-nums text-xs sm:text-sm">
                  <AnimatedNumber value={safeDailySpend} prefix="৳" suffix="/day" />
                </span>
              </div>
              <span className="text-[10px] text-zinc-500">
                {remainingDays} days remaining in cycle
              </span>
            </div>
          </div>

          {/* Remaining Allowance Status */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-zinc-400">Status:</span>
            <span
              className={`font-semibold font-mono-nums px-2.5 py-0.5 rounded-full text-[11px] ${
                budgetRemaining >= 0
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {budgetRemaining >= 0 ? `৳${budgetRemaining.toLocaleString('en-BD')} left` : 'Over Budget!'}
            </span>
          </div>
        </div>

        {/* ── CARD 3: TOP SPENDING CATEGORIES (6 cols) ── */}
        <div className="md:col-span-6 bento-card p-5 sm:p-6 flex flex-col justify-between bg-[#12131A] animate-fade-in-up stagger-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">
                  Top Spending Areas
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono-nums">
                {categoryChartData.length} Active
              </span>
            </div>

            {categoryChartData.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                No expense category data logged yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {categoryChartData.slice(0, 4).map((cat) => (
                  <div key={cat.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-semibold text-zinc-200">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono-nums">
                        <span className="text-zinc-400 text-[11px]">{cat.percent}%</span>
                        <span className="font-bold text-white">৳{cat.spent.toLocaleString('en-BD')}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percent}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onNavigateToTxns}
            className="w-full mt-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore All Transactions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── CARD 4: LIVE FOREIGN EXCHANGE TICKER (6 cols) ── */}
        <div className="md:col-span-6 bento-card p-5 sm:p-6 flex flex-col justify-between bg-[#12131A] animate-fade-in-up stagger-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">
                  Live FX Rates
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-nums font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Live Feed
              </span>
            </div>

            {/* Quick Live Rate Badges */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bento-inner-box p-2 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-zinc-400 font-semibold">USD</span>
                <span className="text-xs font-bold text-white font-mono-nums">
                  ৳{exchangeRates.USD ? (1 / exchangeRates.USD).toFixed(1) : '122.2'}
                </span>
              </div>
              <div className="bento-inner-box p-2 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-zinc-400 font-semibold">EUR</span>
                <span className="text-xs font-bold text-white font-mono-nums">
                  ৳{exchangeRates.EUR ? (1 / exchangeRates.EUR).toFixed(1) : '142.3'}
                </span>
              </div>
              <div className="bento-inner-box p-2 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-zinc-400 font-semibold">GBP</span>
                <span className="text-xs font-bold text-white font-mono-nums">
                  ৳{exchangeRates.GBP ? (1 / exchangeRates.GBP).toFixed(1) : '166.0'}
                </span>
              </div>
              <div className="bento-inner-box p-2 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-zinc-400 font-semibold">SAR</span>
                <span className="text-xs font-bold text-white font-mono-nums">
                  ৳{exchangeRates.SAR ? (1 / exchangeRates.SAR).toFixed(1) : '32.6'}
                </span>
              </div>
            </div>

            {/* Mini Quick Converter */}
            <div className="bento-inner-box p-2.5 flex items-center gap-2 mt-1">
              <div className="flex-1 flex items-center gap-1.5 bg-[#171822] px-3 py-1.5 rounded-xl border border-white/[0.08]">
                <span className="text-xs font-bold text-zinc-400">৳ BDT</span>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none text-right font-mono-nums"
                  placeholder="1000"
                />
              </div>

              <span className="text-zinc-500 font-bold text-xs">=</span>

              <div className="flex-1 flex items-center justify-between bg-[#171822] px-3 py-1.5 rounded-xl border border-white/[0.08]">
                <span className="text-xs font-bold text-emerald-400 font-mono-nums">
                  {convertedValue}
                </span>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="bg-transparent text-xs font-bold text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="USD" className="bg-[#12131A] text-white">USD</option>
                  <option value="EUR" className="bg-[#12131A] text-white">EUR</option>
                  <option value="GBP" className="bg-[#12131A] text-white">GBP</option>
                  <option value="SAR" className="bg-[#12131A] text-white">SAR</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 5: RECENT ACTIVITY LEDGER (12 cols) ── */}
        <div className="md:col-span-12 bento-card p-5 sm:p-6 flex flex-col gap-3.5 bg-[#12131A] animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">
                Recent Transactions
              </span>
            </div>
            <button
              onClick={onNavigateToTxns}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>View Full Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentTxns.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No transactions logged yet. Tap "+ Expense" or "+ Income" above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {recentTxns.map((tx) => {
                const catObj = categories.find((c) => c.id === tx.category);
                const isExpense = tx.type === 'expense';

                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bento-inner-box hover:border-white/[0.15] transition-all flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3 truncate pr-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: catObj ? `${catObj.color}20` : isExpense ? '#F43F5E20' : '#10B98120',
                          color: catObj ? catObj.color : isExpense ? '#F43F5E' : '#10B981',
                        }}
                      >
                        {catObj ? (
                          <CategoryIcon name={catObj.icon} className="w-4 h-4" />
                        ) : isExpense ? (
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </div>

                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-white truncate text-xs">
                          {tx.desc}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono-nums">
                          {tx.date} {catObj ? `• ${catObj.name}` : tx.source ? `• ${tx.source}` : ''}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-bold font-mono-nums text-xs sm:text-sm shrink-0 ${
                        isExpense ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}৳{tx.amount.toLocaleString('en-BD')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
