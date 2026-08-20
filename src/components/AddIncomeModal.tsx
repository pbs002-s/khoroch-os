import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { INCOME_SOURCES } from '../constants/categories';
import { X, Plus, ArrowDownLeft } from 'lucide-react';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
}

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  onShowToast,
}) => {
  const [source, setSource] = useState(INCOME_SOURCES[0]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
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
    if (!amount || Number(amount) <= 0) return;

    onAddTransaction({
      type: 'income',
      desc: desc.trim() || source,
      source,
      amount: Number(amount),
      date,
      note: note.trim(),
    });

    onShowToast(`Income of ৳${amount} recorded`);
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
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-base font-bold text-white font-display">
              Add Income / Allowance
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
              Income Category / Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s} className="bg-[#13141B] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono-nums text-zinc-300 uppercase tracking-wider block mb-1">
              Title / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly Allowance from Home or Physics Tuition"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono-nums text-zinc-300 uppercase tracking-wider block mb-1">
                Amount (৳ BDT)
              </label>
              <input
                type="number"
                placeholder="e.g. 15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-emerald-500 font-mono-nums placeholder:text-zinc-500"
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
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-emerald-500 font-mono-nums"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono-nums text-zinc-300 uppercase tracking-wider block mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Received via bKash / Bank transfer"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-[#041E11] hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
            >
              Save Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
