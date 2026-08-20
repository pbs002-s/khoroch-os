import React from 'react';
import { 
  LayoutGrid, 
  Flame, 
  Heart, 
  Receipt, 
  Bot, 
  Settings, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight,
  Wallet,
  TrendingUp
} from 'lucide-react';
import { Category, Transaction } from '../types';
import { NavTab } from './BottomNav';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  categories: Category[];
  transactions: Transaction[];
  monthlyBudgetLimit: number;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  categories,
  transactions,
  monthlyBudgetLimit,
  onOpenExpenseModal,
  onOpenIncomeModal,
  isCollapsed,
  onToggleCollapse,
  selectedCategory,
  onSelectCategory,
}) => {
  // Calculations
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const budgetPercent = Math.min(Math.round((totalExpense / monthlyBudgetLimit) * 100), 100);
  const budgetRemaining = monthlyBudgetLimit - totalExpense;

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Bento Dashboard', icon: LayoutGrid },
    { id: 'cgrt', label: 'Essentials & Combos', icon: Flame },
    { id: 'romance', label: 'Romance & Outings', icon: Heart },
    { id: 'txns', label: 'Transactions Ledger', icon: Receipt },
    { id: 'ai', label: 'AI Financial Advisor', icon: Bot },
    { id: 'settings', label: 'Settings & Budgets', icon: Settings },
  ];

  return (
    <aside
      className={`bg-[#0F1016] border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Top Brand & Navigation */}
      <div className="flex flex-col gap-5 p-3.5">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1.5 py-1">
          <button
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Wallet className="w-5 h-5 text-[#041E11]" strokeWidth={2.4} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white tracking-tight text-sm font-display">
                    TAKA
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-nums font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    BENTO
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium truncate">
                  Personal Finance
                </span>
              </div>
            )}
          </button>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={onOpenExpenseModal}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 active:scale-98 transition-all ${
              isCollapsed ? 'px-0 w-full' : 'px-3'
            }`}
            title="Add Expense"
          >
            <ArrowUpRight className="w-4 h-4 text-rose-400 shrink-0" />
            {!isCollapsed && <span>Log Expense</span>}
          </button>

          <button
            onClick={onOpenIncomeModal}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-[#041E11] font-bold hover:bg-emerald-400 active:scale-98 shadow-md shadow-emerald-500/10 transition-all ${
              isCollapsed ? 'px-0 w-full' : 'px-3'
            }`}
            title="Add Income"
          >
            <ArrowDownLeft className="w-4 h-4 shrink-0 stroke-[2.5]" />
            {!isCollapsed && <span>Add Income</span>}
          </button>
        </div>

        {/* Main Navigation Items */}
        <nav className="flex flex-col gap-1 mt-1">
          <div className={`px-2 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase ${isCollapsed ? 'hidden' : 'block'}`}>
            Sections
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Monthly Allowance Meter */}
      {!isCollapsed ? (
        <div className="p-3.5 flex flex-col gap-3 border-t border-white/[0.08] bg-[#0B0C10]/60">
          <div className="bg-[#14151E] p-3 rounded-xl border border-white/[0.07] flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Monthly Budget
              </span>
              <span className="text-white font-mono-nums font-semibold">
                {budgetPercent}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetPercent > 85
                    ? 'bg-rose-500'
                    : budgetPercent > 65
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono-nums">
              <span>৳{totalExpense.toLocaleString('en-BD')}</span>
              <span className={budgetRemaining >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {budgetRemaining >= 0 ? `৳${budgetRemaining.toLocaleString('en-BD')} left` : 'Over limit!'}
              </span>
            </div>
          </div>

          {/* Local Status */}
          <div className="flex items-center justify-between px-1 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono-nums text-[10px] text-zinc-300">Local Synced</span>
            </div>
            <button
              onClick={() => onTabChange('settings')}
              className="text-zinc-400 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 flex flex-col items-center gap-3 border-t border-white/[0.08]">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Online & Synced" />
        </div>
      )}
    </aside>
  );
};
