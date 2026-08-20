import React, { useState } from 'react';
import { Plus, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface FABProps {
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
}

export const FAB: React.FC<FABProps> = ({
  onOpenExpenseModal,
  onOpenIncomeModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2.5">
      {/* Quick Menu items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-slide-in">
          {/* Income Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenIncomeModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-500 text-[#041E11] text-xs font-bold shadow-xl hover:bg-emerald-400 active:scale-95 transition-all"
          >
            <span>+ Add Income</span>
            <div className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </button>

          {/* Expense Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenExpenseModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-rose-500 text-white text-xs font-bold shadow-xl hover:bg-rose-400 active:scale-95 transition-all"
          >
            <span>- Log Expense</span>
            <div className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all duration-250 ${
          isOpen 
            ? 'bg-zinc-800 text-zinc-300 rotate-90 border border-white/[0.1]' 
            : 'bg-emerald-500 text-[#041E11] hover:bg-emerald-400 shadow-emerald-500/25'
        }`}
        title="Add Transaction"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Plus className="w-6 h-6 stroke-[2.8]" />}
      </button>
    </div>
  );
};
