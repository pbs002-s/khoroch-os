import React, { useState } from 'react';
import { Transaction } from '../types';
import { INCOME_SOURCES } from '../constants/categories';
import { X } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    onAddTransaction({
      type: 'income',
      desc: desc || source,
      source,
      amount: Number(amount),
      date,
      note,
    });

    onShowToast(`Income of ৳${amount} logged`);
    setDesc('');
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-slide-in">
      <div className="bg-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-md border border-[rgba(255,255,255,0.13)] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
          <span className="text-base font-bold text-[#FFFFFF] font-serif-display">
            Add Income Entry
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71717A] hover:text-[#FFFFFF] hover:bg-[#3F3F46] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-mono-label text-[#71717A] uppercase block mb-1">
              Income Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#09090B] focus:outline-none focus:border-[#00E55F]"
            >
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono-label text-[#71717A] uppercase block mb-1">
              Title / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly Allowance or Physics Tuition"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#09090B] focus:outline-none focus:border-[#00E55F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono-label text-[#71717A] uppercase block mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#09090B] focus:outline-none focus:border-[#00E55F]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono-label text-[#71717A] uppercase block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#09090B] focus:outline-none focus:border-[#00E55F]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono-label text-[#71717A] uppercase block mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Received via Bank transfer"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#09090B] focus:outline-none focus:border-[#00E55F]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgba(255,255,255,0.08)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:bg-[#3F3F46] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00E55F] text-[#062012] hover:bg-[#00E55F]/90 transition-all shadow-xs"
            >
              Save Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
