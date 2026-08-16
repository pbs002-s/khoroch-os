import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { Search, Filter, Trash2, ArrowUpRight, ArrowDownLeft, Receipt, Wallet } from 'lucide-react';
import { CategoryIcon } from '../constants/icons';

interface TransactionsTabProps {
  categories: Category[];
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  onShowToast: (msg: string) => void;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  categories,
  transactions,
  onDeleteTransaction,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string | null>(null);

  // Filter transactions
  const filteredTxns = transactions.filter((tx) => {
    // Type filter
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

    // Category filter
    if (selectedCatFilter && tx.category !== selectedCatFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const descMatch = tx.desc.toLowerCase().includes(q);
      const noteMatch = tx.note?.toLowerCase().includes(q);
      const sourceMatch = tx.source?.toLowerCase().includes(q);
      const amountMatch = tx.amount.toString().includes(q);
      return descMatch || noteMatch || sourceMatch || amountMatch;
    }

    return true;
  });

  const totalFilteredIncome = filteredTxns
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalFilteredExpense = filteredTxns
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const handleDelete = (id: string, desc: string) => {
    if (window.confirm(`Delete transaction "${desc}"?`)) {
      onDeleteTransaction(id);
      onShowToast('Transaction deleted');
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-4 pb-24">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#FFFFFF]">
            Transaction History
          </h2>
          <p className="text-xs text-[#A1A1AA]">
            {filteredTxns.length} records found
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenIncomeModal}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#00E55F] text-[#062012] hover:bg-[#00E55F]/90 transition-all shadow-2xs"
          >
            + Income
          </button>
          <button
            onClick={onOpenExpenseModal}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-[#FF6B57] text-[#FF6B57] hover:bg-[rgba(255,107,87,0.12)] transition-all"
          >
            + Expense
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search transactions by title, note, or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#27272A] focus:outline-none focus:border-[#00E55F]"
        />
      </div>

      {/* Filter Tabs (All / Expenses / Income) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTypeFilter('all')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            typeFilter === 'all'
              ? 'bg-[#00E55F] text-[#062012] shadow-2xs'
              : 'bg-[#3F3F46] text-[#A1A1AA] hover:bg-[rgba(0,229,95,0.12)]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setTypeFilter('expense')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            typeFilter === 'expense'
              ? 'bg-[#FF6B57] text-white shadow-2xs'
              : 'bg-[#3F3F46] text-[#A1A1AA] hover:bg-[rgba(255,107,87,0.12)]'
          }`}
        >
          Expenses Only
        </button>
        <button
          onClick={() => setTypeFilter('income')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            typeFilter === 'income'
              ? 'bg-[#00E55F] text-[#062012] shadow-2xs'
              : 'bg-[#3F3F46] text-[#A1A1AA] hover:bg-[rgba(0,229,95,0.12)]'
          }`}
        >
          Income Only
        </button>
      </div>

      {/* Category Chips Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 touch-action-pan-x">
        <button
          onClick={() => setSelectedCatFilter(null)}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
            selectedCatFilter === null
              ? 'bg-[#00E55F] text-[#062012]'
              : 'bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:bg-[#3F3F46]'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setSelectedCatFilter(selectedCatFilter === cat.id ? null : cat.id)
            }
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedCatFilter === cat.id
                ? 'bg-[#00E55F] text-[#062012]'
                : 'bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:bg-[#3F3F46]'
            }`}
          >
            <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Summary Row */}
      <div className="bg-[#09090B] p-3 rounded-xl border border-[rgba(255,255,255,0.06)] flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 text-[#00E55F] font-bold">
          <ArrowDownLeft className="w-3.5 h-3.5" />
          <span>Income: ৳{totalFilteredIncome.toLocaleString('en-BD')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#FF6B57] font-bold">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Expense: ৳{totalFilteredExpense.toLocaleString('en-BD')}</span>
        </div>
      </div>

      {/* Transaction List */}
      {filteredTxns.length === 0 ? (
        <div className="py-12 bg-[#27272A] rounded-2xl border border-[rgba(255,255,255,0.08)] p-6 text-center text-xs flex flex-col items-center gap-2">
          <Receipt className="w-8 h-8 text-[#71717A]" />
          <p className="font-bold text-[#FFFFFF]">No matching transactions found.</p>
          <p className="text-[11px] text-[#A1A1AA]">
            Try resetting your filters or add a new transaction.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredTxns.map((tx) => {
            const catObj = categories.find((c) => c.id === tx.category);
            const isExpense = tx.type === 'expense';

            return (
              <div
                key={tx.id}
                className="p-3 bg-[#27272A] rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex items-center justify-between text-xs hover:border-[#00E55F]/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: catObj ? `${catObj.color}20` : '#00E55F20',
                      color: catObj ? catObj.color : '#00E55F',
                    }}
                  >
                    {catObj ? (
                      <CategoryIcon name={catObj.icon} className="w-4.5 h-4.5" />
                    ) : isExpense ? (
                      <Receipt className="w-4.5 h-4.5" />
                    ) : (
                      <Wallet className="w-4.5 h-4.5" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-bold text-[#FFFFFF] text-sm">
                      {tx.desc}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-[#71717A] mt-0.5">
                      <span>{tx.date}</span>
                      {tx.source && <span>• {tx.source}</span>}
                      {catObj && <span>• {catObj.name}</span>}
                    </div>
                    {tx.note && (
                      <span className="text-[10px] text-[#A1A1AA] italic mt-0.5">
                        "{tx.note}"
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold font-serif-display text-sm tabular-nums ${
                      isExpense ? 'text-[#FF6B57]' : 'text-[#00E55F]'
                    }`}
                  >
                    {isExpense ? '-' : '+'}৳{tx.amount.toLocaleString('en-BD')}
                  </span>

                  <button
                    onClick={() => handleDelete(tx.id, tx.desc)}
                    className="p-1.5 rounded-lg text-[#71717A] hover:text-[#FF6B57] hover:bg-[rgba(255,107,87,0.12)] active:scale-95 transition-all"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
