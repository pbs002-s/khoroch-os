import React from 'react';
import { Category, Transaction } from '../types';
import { CategoryIcon } from '../constants/icons';
import { Wallet, PieChart, TrendingUp, Layers, ChevronRight, PlusCircle, ArrowUpRight, ArrowDownLeft, Zap, Bot, Receipt, Settings, FileText } from 'lucide-react';

interface DashboardTabProps {
  categories: Category[];
  transactions: Transaction[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  monthlyBudgetLimit: number;
  onNavigateToTxns: () => void;
  onNavigateToTools?: () => void;
  onNavigateToAI?: () => void;
  onNavigateToSettings?: () => void;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  categories,
  transactions,
  selectedCategory,
  onSelectCategory,
  monthlyBudgetLimit,
  onNavigateToTxns,
  onNavigateToTools,
  onNavigateToAI,
  onNavigateToSettings,
  onOpenExpenseModal,
  onOpenIncomeModal,
}) => {
  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const savedRemaining = monthlyBudgetLimit - totalExpense;

  const essentialSpend = transactions
    .filter((t) => t.type === 'expense' && (t.category === 'essentials' || t.category === 'tea'))
    .reduce((acc, t) => acc + t.amount, 0);

  const partnerSpend = transactions
    .filter((t) => t.type === 'expense' && t.category === 'partner')
    .reduce((acc, t) => acc + t.amount, 0);

  // Budget calculations
  const budgetPercent = Math.min(Math.round((totalExpense / monthlyBudgetLimit) * 100), 100);

  // Category Chart Data
  const categoryChartData = categories
    .map((cat) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === cat.id)
        .reduce((acc, t) => acc + t.amount, 0);
      return { ...cat, spent };
    })
    .filter((cat) => cat.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 6);

  const maxCategorySpent = Math.max(...categoryChartData.map((c) => c.spent), 1);

  // Recent 5 transactions
  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-5 pb-24">
      {/* Primary Balance Banner Card */}
      <div className="bg-gradient-to-r from-[#00E55F] to-[#4C8DFF] text-white p-5 rounded-2xl shadow-md flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#27272A]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-center text-xs text-white/80 uppercase font-mono-label tracking-wider">
          <span>Current Net Balance</span>
          <span className="bg-[#27272A]/20 px-2.5 py-0.5 rounded-full text-[10px] text-white font-mono-label">
            BDT
          </span>
        </div>

        <div className="text-4xl sm:text-5xl font-serif-display tracking-tight tabular-nums">
          ৳{currentBalance.toLocaleString('en-BD')}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/15 text-xs">
          <div className="flex flex-col">
            <span className="text-white/70 text-[10px] uppercase font-mono-label">Total Income</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-300" />
              +৳{totalIncome.toLocaleString('en-BD')}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/70 text-[10px] uppercase font-mono-label">Total Expense</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-300" />
              -৳{totalExpense.toLocaleString('en-BD')}
            </span>
          </div>
        </div>
      </div>

      {/* Explore Quick Shortcuts */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onNavigateToTools}
          className="p-2.5 bg-[#27272A] rounded-xl border border-[rgba(255,255,255,0.08)] shadow-2xs hover:bg-[rgba(0,229,95,0.12)] active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,95,0.12)] text-[#00E55F] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono-label uppercase text-[#FFFFFF]">Quick Tools</span>
        </button>

        <button
          onClick={onNavigateToAI}
          className="p-2.5 bg-[#27272A] rounded-xl border border-[rgba(255,255,255,0.08)] shadow-2xs hover:bg-[rgba(0,229,95,0.12)] active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,95,0.12)] text-[#00E55F] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono-label uppercase text-[#FFFFFF]">Finance AI</span>
        </button>

        <button
          onClick={onNavigateToTxns}
          className="p-2.5 bg-[#27272A] rounded-xl border border-[rgba(255,255,255,0.08)] shadow-2xs hover:bg-[rgba(255,107,87,0.12)] active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[rgba(255,107,87,0.12)] text-[#FF6B57] flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono-label uppercase text-[#FFFFFF]">History</span>
        </button>

        <button
          onClick={onNavigateToSettings}
          className="p-2.5 bg-[#27272A] rounded-xl border border-[rgba(255,255,255,0.08)] shadow-2xs hover:bg-[#3F3F46] active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[#3F3F46] text-[#A1A1AA] flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono-label uppercase text-[#FFFFFF]">Budget</span>
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Saved / Remaining */}
        <div className="bg-[#27272A] p-3.5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-mono-label text-[#71717A] uppercase tracking-wider">
            Budget Left
          </span>
          <div className="text-lg font-bold font-serif-display text-[#8B7FF5] mt-1">
            ৳{savedRemaining.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-[#A1A1AA] mt-1">Remaining allowance</span>
        </div>

        {/* Essentials Spend */}
        <div className="bg-[#27272A] p-3.5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-mono-label text-[#71717A] uppercase tracking-wider">
            Essentials & Tea
          </span>
          <div className="text-lg font-bold font-serif-display text-[#52525B] mt-1">
            ৳{essentialSpend.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-[#A1A1AA] mt-1">Daily items spend</span>
        </div>

        {/* Partner & Outings */}
        <div className="bg-[#27272A] p-3.5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono-label text-[#71717A] uppercase tracking-wider">
            Partner / Outings
          </span>
          <div className="text-lg font-bold font-serif-display text-[#E85D8A] mt-1">
            ৳{partnerSpend.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-[#A1A1AA] mt-1">Treats & hangouts</span>
        </div>
      </div>

      {/* Monthly Budget Progress Box */}
      <div className="bg-[#27272A] p-4 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-[#FFFFFF] flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-[#F5A623]" />
            Monthly Budget Meter
          </span>
          <span className="font-semibold text-[#A1A1AA]">
            ৳{totalExpense.toLocaleString('en-BD')} / ৳{monthlyBudgetLimit.toLocaleString('en-BD')}
          </span>
        </div>

        <div className="w-full h-2.5 bg-[#3F3F46] rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${budgetPercent}%`,
              backgroundColor: budgetPercent > 85 ? '#FF6B57' : budgetPercent > 65 ? '#F5A623' : '#00E55F',
            }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-[#A1A1AA]">
          <span>{budgetPercent}% used this month</span>
          <span className={savedRemaining >= 0 ? 'text-[#00E55F] font-bold' : 'text-[#FF6B57] font-bold'}>
            {savedRemaining >= 0 ? `৳${savedRemaining.toLocaleString('en-BD')} available` : 'Over Budget!'}
          </span>
        </div>
      </div>

      {/* Top Expense Category Chart */}
      <div className="bg-[#27272A] p-4 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#FFFFFF]">Top Spending Areas</span>
          <span className="text-[10px] text-[#71717A] font-mono-label uppercase">Live Breakdown</span>
        </div>

        {categoryChartData.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#71717A]">
            No expense categories recorded yet. Add your first expense below!
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2 h-32 pt-4 pb-1 border-b border-[rgba(255,255,255,0.06)]">
            {categoryChartData.map((item, idx) => {
              const heightPercent = Math.max(Math.round((item.spent / maxCategorySpent) * 100), 15);
              return (
                <div key={item.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-semibold text-[#A1A1AA] font-mono-label">
                    ৳{item.spent}
                  </span>
                  <div className="w-full max-w-[36px] bg-[#3F3F46] rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      className="w-full rounded-t-lg animate-float-bar transition-all"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: item.color,
                        animationDelay: `${idx * 0.15}s`,
                      }}
                    />
                  </div>
                  <CategoryIcon name={item.icon} className="w-3.5 h-3.5 text-[#A1A1AA]" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Transactions List Preview */}
      <div className="bg-[#27272A] p-4 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2">
          <span className="text-xs font-bold text-[#FFFFFF]">Recent Activity</span>
          <button
            onClick={onNavigateToTxns}
            className="text-xs font-semibold text-[#00E55F] flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTxns.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#71717A] flex flex-col items-center gap-2">
            <FileText className="w-6 h-6 text-[#3F3F46]" />
            <p className="font-medium text-[#FFFFFF]">No transactions logged yet.</p>
            <p className="text-[11px] text-[#A1A1AA]">
              Tap <span className="text-[#00E55F] font-bold">+ Expense</span> or <span className="text-[#00E55F] font-bold">+ Income</span> to log your first entry.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={onOpenIncomeModal}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00E55F] text-[#062012] hover:bg-[#00E55F]/90 transition-all shadow-2xs"
              >
                + Add Allowance / Income
              </button>
              <button
                onClick={onOpenExpenseModal}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#FF6B57] text-[#FF6B57] hover:bg-[rgba(255,107,87,0.12)] transition-all"
              >
                + Add Expense
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentTxns.map((tx) => {
              const catObj = categories.find((c) => c.id === tx.category);
              const isExpense = tx.type === 'expense';

              return (
                <div
                  key={tx.id}
                  className="p-2.5 rounded-xl bg-[#09090B] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: catObj ? `${catObj.color}20` : '#00E55F20',
                        color: catObj ? catObj.color : '#00E55F',
                      }}
                    >
                      {catObj ? (
                        <CategoryIcon name={catObj.icon} className="w-4 h-4" />
                      ) : isExpense ? (
                        <Receipt className="w-4 h-4" />
                      ) : (
                        <Wallet className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-[#FFFFFF] line-clamp-1">
                        {tx.desc}
                      </span>
                      <span className="text-[10px] text-[#71717A]">
                        {tx.date} {tx.source ? `• ${tx.source}` : ''}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-bold font-serif-display tabular-nums ${
                      isExpense ? 'text-[#FF6B57]' : 'text-[#00E55F]'
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
  );
};
