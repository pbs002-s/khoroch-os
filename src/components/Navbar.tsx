import React from 'react';
import { NavTab } from './BottomNav';
import { 
  Menu, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Globe,
  Wallet
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentMonthYear: string;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentMonthYear,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onToggleMobileSidebar,
}) => {
  const getTabHeading = () => {
    switch (activeTab) {
      case 'home':
        return { title: 'Bento Dashboard', subtitle: 'Core financial overview & balance metrics' };
      case 'cgrt':
        return { title: 'Essentials & Combos', subtitle: 'Advance + Camel mixed combinations & daily budget matcher' };
      case 'romance':
        return { title: 'Romance & Outings', subtitle: 'Relationship presets, date night deals & peace treaties' };
      case 'txns':
        return { title: 'Transactions Ledger', subtitle: 'Search, filter and export all financial records' };
      case 'ai':
        return { title: 'AI Financial Advisor', subtitle: 'Intelligent budget forecasting & smart financial guidance' };
      case 'settings':
        return { title: 'Settings & Budgets', subtitle: 'Monthly allowance, category limits and backups' };
      default:
        return { title: 'Financial Dashboard', subtitle: 'Overview' };
    }
  };

  const { title, subtitle } = getTabHeading();

  return (
    <header className="sticky top-0 z-30 bg-[#0F1016]/92 backdrop-blur-xl border-b border-white/[0.08] select-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Active Section Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-zinc-300 hover:text-white bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] active:scale-95 transition-all"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
                {title}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono-nums font-semibold bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                {currentMonthYear}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium hidden xs:block truncate">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Right Side: Action Buttons & Live Rate */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Currency Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#13141B] border border-white/[0.08] text-xs text-zinc-300 font-mono-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-400">BDT Base</span>
            <span className="text-white font-semibold">1 USD ≈ ৳122.2</span>
          </div>

          {/* Action: Add Expense */}
          <button
            onClick={onOpenExpenseModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 active:scale-95 transition-all shadow-sm"
          >
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 stroke-[2.5]" />
            <span className="font-bold">Expense</span>
          </button>

          {/* Action: Add Income */}
          <button
            onClick={onOpenIncomeModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-emerald-500 text-[#041E11] hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/15"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            <span>Income</span>
          </button>
        </div>
      </div>
    </header>
  );
};
