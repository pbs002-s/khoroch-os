import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { 
  Search, 
  Filter, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Receipt, 
  Wallet,
  Download,
  Calendar,
  X,
  FileSpreadsheet
} from 'lucide-react';
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

  const handleExportCSV = () => {
    if (filteredTxns.length === 0) {
      onShowToast('No transactions to export');
      return;
    }

    const headers = ['ID', 'Type', 'Description', 'Category/Source', 'Amount (BDT)', 'Date', 'Note'];
    const rows = filteredTxns.map((t) => [
      t.id,
      t.type,
      `"${t.desc.replace(/"/g, '""')}"`,
      `"${t.category || t.source || ''}"`,
      t.amount,
      t.date,
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `taka_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('CSV exported successfully');
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-24 animate-slide-in">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white font-display">
            Transactions Ledger
          </h2>
          <p className="text-xs text-zinc-400">
            {filteredTxns.length} records found • Detailed inflow and outflow activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#181A24] text-zinc-300 border border-white/[0.08] hover:text-white hover:border-white/[0.15] transition-all flex items-center gap-1.5"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenIncomeModal}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-[#041E11] hover:bg-emerald-400 transition-all shadow-sm"
          >
            + Income
          </button>
          <button
            onClick={onOpenExpenseModal}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all"
          >
            + Expense
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bento-card p-4 flex flex-col gap-3 bg-[#12131A]">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, category, note, or exact amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-[#0E0F15] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === 'all'
                  ? 'bg-emerald-500 text-[#041E11] shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === 'income'
                  ? 'bg-emerald-500 text-[#041E11] shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          {/* Quick Summary Pill */}
          <div className="flex items-center gap-3 text-xs font-mono-nums">
            <span className="text-emerald-400 font-semibold">
              +৳{totalFilteredIncome.toLocaleString('en-BD')} In
            </span>
            <span className="text-rose-400 font-semibold">
              -৳{totalFilteredExpense.toLocaleString('en-BD')} Out
            </span>
          </div>
        </div>

        {/* Category Chips Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCatFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCatFilter === null
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bento-inner-box text-zinc-400 hover:text-white'
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
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCatFilter === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bento-inner-box text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List Cards */}
      {filteredTxns.length === 0 ? (
        <div className="py-16 bento-card p-6 text-center text-xs flex flex-col items-center gap-2 bg-[#12131A]">
          <Receipt className="w-9 h-9 text-zinc-600" />
          <p className="text-white font-bold text-sm">No matching transactions found</p>
          <p className="text-zinc-400 text-xs max-w-sm">
            Try adjusting your search criteria or filter tags to find what you're looking for.
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
                className="p-3.5 bento-card hover:border-white/[0.18] transition-all flex items-center justify-between text-xs bg-[#12131A]"
              >
                <div className="flex items-center gap-3.5 truncate pr-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: catObj ? `${catObj.color}20` : isExpense ? '#F43F5E20' : '#10B98120',
                      color: catObj ? catObj.color : isExpense ? '#F43F5E' : '#10B981',
                    }}
                  >
                    {catObj ? (
                      <CategoryIcon name={catObj.icon} className="w-5 h-5" />
                    ) : isExpense ? (
                      <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </div>

                  <div className="flex flex-col truncate">
                    <span className="font-bold text-white text-sm truncate">
                      {tx.desc}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono-nums mt-0.5">
                      <span>{tx.date}</span>
                      {tx.source && <span>• {tx.source}</span>}
                      {catObj && <span>• {catObj.name}</span>}
                    </div>
                    {tx.note && (
                      <span className="text-[11px] text-zinc-400 italic mt-0.5 truncate">
                        "{tx.note}"
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`font-extrabold font-mono-nums text-sm sm:text-base ${
                      isExpense ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {isExpense ? '-' : '+'}৳{tx.amount.toLocaleString('en-BD')}
                  </span>

                  <button
                    onClick={() => handleDelete(tx.id, tx.desc)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all"
                    title="Delete transaction"
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
