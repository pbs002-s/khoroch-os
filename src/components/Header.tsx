import React from 'react';
import { Plus, Github, Sparkles, Wallet } from 'lucide-react';

interface HeaderProps {
  currentMonthYear: string;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  onLoadDemoData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonthYear,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onLoadDemoData,
}) => {
  return (
    <header className="sticky top-0 z-50 h-[60px] bg-[#27272A] border-b border-[rgba(255,255,255,0.08)] px-6 flex items-center justify-between shadow-xs">
      {/* Brand Logo & Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-[34px] h-[34px] rounded-lg bg-[#00E55F] flex items-center justify-center shadow-xs">
          <Wallet className="w-4 h-4 text-[#062012]" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-[#00E55F] leading-tight tracking-tight">
            TAKA
          </span>
          <span className="text-[10px] font-semibold text-[#A1A1AA] tracking-widest uppercase">
            Student Finance Tracker
          </span>
        </div>
      </div>

      {/* Center Month Label */}
      <div className="text-base font-serif-display italic text-[#A1A1AA] tracking-wide">
        {currentMonthYear}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* GitHub Credit Pill */}
        <a
          href="https://github.com/pbs002-s"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[rgba(139,127,245,0.12)] text-[#8B7FF5] hover:bg-[#B4ADF7]/30 transition-all flex items-center gap-1.5"
          title="View GitHub Repository"
        >
          <Github className="w-3.5 h-3.5" />
          <span>Credit</span>
        </a>

        {/* Demo Data Button */}
        <button
          onClick={onLoadDemoData}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#4C8DFF] to-[#00E55F] text-white hover:opacity-95 active:scale-98 transition-all flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Data</span>
        </button>

        {/* Add Expense Button */}
        <button
          onClick={onOpenExpenseModal}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-[#FF6B57] text-[#FF6B57] hover:bg-[rgba(255,107,87,0.12)] transition-all flex items-center gap-1.5 active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </button>

        {/* Add Income Button */}
        <button
          onClick={onOpenIncomeModal}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#00E55F] text-[#062012] hover:bg-[#00E55F]/90 transition-all flex items-center gap-1.5 shadow-xs active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Income</span>
        </button>
      </div>
    </header>
  );
};
