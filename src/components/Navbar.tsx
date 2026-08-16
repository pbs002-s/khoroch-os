import React from 'react';
import { NavTab } from './BottomNav';
import { Home, Zap, Receipt, Bot, Settings, Plus, Wallet } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentMonthYear: string;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentMonthYear,
  onOpenExpenseModal,
  onOpenIncomeModal,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Dashboard', icon: Home },
    { id: 'tools' as NavTab, label: 'Quick Tools', icon: Zap },
    { id: 'txns' as NavTab, label: 'History', icon: Receipt },
    { id: 'ai' as NavTab, label: 'Finance AI', icon: Bot },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#27272A]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] shadow-2xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E55F] to-[#4C8DFF] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <Wallet className="w-5 h-5 text-[#062012]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#FFFFFF] leading-tight tracking-tight">
                TAKA
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono-label uppercase bg-[rgba(0,229,95,0.12)] text-[#00E55F] border border-[#008A39]/50">
                BD Student Finance
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#A1A1AA]">
              {currentMonthYear} Tracker
            </span>
          </div>
        </div>

        {/* Desktop & Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#09090B] p-1.5 rounded-2xl border border-[rgba(255,255,255,0.06)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#27272A] text-[#00E55F] shadow-xs'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A]/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00E55F]' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons (+ Expense, + Income) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExpenseModal}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-[#FF6B57] text-[#FF6B57] hover:bg-[rgba(255,107,87,0.12)] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>

          <button
            onClick={onOpenIncomeModal}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#00E55F] text-[#062012] hover:bg-[#00E55F]/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Income</span>
          </button>
        </div>
      </div>
    </header>
  );
};
