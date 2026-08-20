import React, { useState, useEffect } from 'react';
import { Category, Transaction } from '../types';
import { X, Plus, ArrowUpRight } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  categories,
  onClose,
  onAddTransaction,
  onShowToast,
}) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount || Number(amount) <= 0) return;

    onAddTransaction({
      type: 'expense',
      desc: desc.trim(),
      category,
      amount: Number(amount),
      date,
      note: note.trim(),
    });

    onShowToast(`Expense of ৳${amount} recorded`);
    setDesc('');
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-slide-in">
      <div className="bg-[#13141B] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/[0.12] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-base font-bold text-white font-display">
              Log New Expense
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="text-[10px] font-mono-nums text-zinc-300 uppercase tracking-wider block mb-1">
              Description / Item Name
            </label>
            <input
              type="text"
              placeholder="e.g. Hall Khichuri Lunch or CNG Fare"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-500"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono-nums text-zinc-300 uppercase tracking-wider block mb-1">
                Amount (৳ BDT)
              </label>
              <input
                type="number"
                placeholder="e.g. 250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-rose-500 font-mono-nums placeholder:text-zinc-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono-nums text-zinc-300 uppercase tracking-wider block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-rose-500 font-mono-nums"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono-nums text-zinc-300 uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#13141B] text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono-nums text-zinc-300 uppercase tracking-wider block mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via bKash / Shared with batchmates"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-rose-500 placeholder:text-zinc-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-400 active:scale-95 transition-all shadow-md shadow-rose-500/20"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
