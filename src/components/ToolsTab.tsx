import React, { useState } from 'react';
import { Transaction } from '../types';
import { ESSENTIAL_PRESETS, PARTNER_PRESETS } from '../constants/categories';
import { Cigarette, Heart, Dices, Plus, Sparkles } from 'lucide-react';
import { CategoryIcon } from '../constants/icons';

interface ToolsTabProps {
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
  transactions: Transaction[];
}

export const ToolsTab: React.FC<ToolsTabProps> = ({
  onAddTransaction,
  onShowToast,
  transactions,
}) => {
  // Tool 1: Daily Limit state
  const [essentialDailyBudget, setEssentialDailyBudget] = useState(150);

  // Tool 3: Gaming & Activity State
  const [gamingAmount, setGamingAmount] = useState<number | ''>('');
  const [gamingType, setGamingType] = useState<'profit' | 'loss'>('loss');
  const [gamingNote, setGamingNote] = useState('');

  // Calculate Net Gaming
  const gamingTransactions = transactions.filter(
    (t) => t.type === 'expense' && t.category === 'gaming'
  );
  const gamingProfits = transactions
    .filter((t) => t.category === 'gaming' && t.note?.toLowerCase().includes('profit'))
    .reduce((acc, t) => acc + t.amount, 0);
  const gamingLosses = gamingTransactions.reduce((acc, t) => acc + t.amount, 0);
  const gamingNet = gamingProfits - gamingLosses;

  // Handle Preset Quick Add
  const handleAddPreset = (name: string, price: number, catId: string) => {
    onAddTransaction({
      type: 'expense',
      desc: name,
      category: catId,
      amount: price,
      date: new Date().toISOString().split('T')[0],
      note: 'Quick preset entry',
    });
    onShowToast(`Added ${name} (৳${price})`);
  };

  // Handle Date Night Bundle
  const handleAddDateBundle = () => {
    const bundleAmount = 180 + 850 + 450; // ৳1480
    onAddTransaction({
      type: 'expense',
      desc: 'Date Night Bundle (Ice Cream + Dinner + Hangout)',
      category: 'partner',
      amount: bundleAmount,
      date: new Date().toISOString().split('T')[0],
      note: 'Combined date night package',
    });
    onShowToast(`Date Night Bundle logged (৳${bundleAmount})`);
  };

  // Handle Gaming Entry
  const handleAddGamingEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gamingAmount || gamingAmount <= 0) return;

    if (gamingType === 'loss') {
      onAddTransaction({
        type: 'expense',
        desc: `Activity / Gaming Entry: ${gamingNote || 'Loss'}`,
        category: 'gaming',
        amount: Number(gamingAmount),
        date: new Date().toISOString().split('T')[0],
        note: `Loss entry: ${gamingNote}`,
      });
      onShowToast(`Activity loss logged (৳${gamingAmount})`);
    } else {
      onAddTransaction({
        type: 'income',
        desc: `Activity / Gaming Win: ${gamingNote || 'Profit'}`,
        source: 'Activity P/L',
        amount: Number(gamingAmount),
        date: new Date().toISOString().split('T')[0],
        note: `Profit entry: ${gamingNote}`,
      });
      onShowToast(`Activity win logged (৳${gamingAmount})`);
    }

    setGamingAmount('');
    setGamingNote('');
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-5 pb-24">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[#FFFFFF]">
          Quick Logging Tools
        </h2>
        <p className="text-xs text-[#A1A1AA]">
          Fast one-tap logging for daily essentials, outings, and activity entries.
        </p>
      </div>

      {/* Tool 1: Cigarette & Daily Essentials Budget */}
      <div className="bg-[#27272A] p-4.5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2.5">
          <span className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
            <Cigarette className="w-4 h-4 text-[#52525B]" />
            Cigarettes & Daily Essentials
          </span>
          <span className="text-[10px] font-mono-label uppercase bg-[#3F3F46] text-[#A1A1AA] px-2 py-0.5 rounded-full">
            1-Tap Add
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#A1A1AA] bg-[#09090B] p-2.5 rounded-xl border border-[rgba(255,255,255,0.06)]">
          <span>Target Daily Limit:</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={essentialDailyBudget}
              onChange={(e) => setEssentialDailyBudget(Number(e.target.value))}
              className="w-16 px-2 py-1 text-xs font-bold rounded border border-[rgba(255,255,255,0.13)] bg-[#27272A] text-right"
            />
            <span className="font-bold text-[#00E55F]">৳/day</span>
          </div>
        </div>

        {/* Preset Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {ESSENTIAL_PRESETS.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#09090B] hover:bg-[#3F3F46] text-xs transition-colors"
            >
              <span className="font-medium text-[#FFFFFF]">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[#A1A1AA] font-bold">৳{item.price}</span>
                <button
                  onClick={() => handleAddPreset(item.name, item.price, item.category)}
                  className="px-2.5 py-1 rounded-lg bg-[#00E55F] text-[#062012] text-[11px] font-bold hover:bg-[#00E55F]/90 active:scale-95 transition-all shadow-2xs"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Combo Box */}
        <div className="bg-[rgba(0,229,95,0.12)] border border-[#008A39] p-3 rounded-xl text-xs text-[#00E55F] flex items-center justify-between mt-1">
          <span className="font-semibold">Suggested Daily Combo:</span>
          <span className="font-bold">1 Stick (৳23) + Milk Tea (৳15) = ৳38</span>
        </div>
      </div>

      {/* Tool 2: Partner & Outings Expenses */}
      <div className="bg-[#27272A] p-4.5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2.5">
          <span className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#E85D8A]" />
            Partner & Outings Expenses
          </span>
          <span className="text-[10px] font-mono-label uppercase bg-[rgba(255,107,87,0.12)] text-[#FF6B57] px-2 py-0.5 rounded-full">
            Treats
          </span>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PARTNER_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#09090B] hover:bg-[#3F3F46] text-xs transition-colors"
            >
              <span className="font-medium text-[#FFFFFF] flex items-center gap-1.5">
                <CategoryIcon name={preset.icon} className="w-3.5 h-3.5 text-[#E85D8A]" />
                <span>{preset.name}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#A1A1AA] font-bold">৳{preset.price}</span>
                <button
                  onClick={() => handleAddPreset(preset.name, preset.price, 'partner')}
                  className="px-2.5 py-1 rounded-lg bg-[#E85D8A] text-white text-[11px] font-bold hover:bg-[#E85D8A]/90 active:scale-95 transition-all shadow-2xs"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Date Night Bundle Button */}
        <button
          onClick={handleAddDateBundle}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E85D8A] to-[#FF6B57] text-white text-xs font-bold shadow-xs hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 mt-1"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>+ Add Date Night Bundle (Ice Cream + Dinner + Hangout = ৳1,480)</span>
        </button>
      </div>

      {/* Tool 3: Activity & Gaming Tracker */}
      <div className="bg-[#27272A] p-4.5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2.5">
          <span className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
            <Dices className="w-4 h-4 text-[#3B9EFF]" />
            Activity & Gaming P/L Tracker
          </span>
          <span className="text-[10px] font-mono-label uppercase bg-[rgba(139,127,245,0.12)] text-[#8B7FF5] px-2 py-0.5 rounded-full">
            Profit/Loss
          </span>
        </div>

        <form onSubmit={handleAddGamingEntry} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono-label text-[#71717A] uppercase block mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={gamingAmount}
                onChange={(e) => setGamingAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#09090B] focus:outline-none focus:border-[#3B9EFF]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono-label text-[#71717A] uppercase block mb-1">
                Entry Type
              </label>
              <select
                value={gamingType}
                onChange={(e) => setGamingType(e.target.value as 'profit' | 'loss')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#09090B] focus:outline-none focus:border-[#3B9EFF]"
              >
                <option value="loss">Loss Entry (-Expense)</option>
                <option value="profit">Win / Profit (+Income)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono-label text-[#71717A] uppercase block mb-1">
              Note / Event Name
            </label>
            <input
              type="text"
              placeholder="e.g. Turf tournament match or FIFA series"
              value={gamingNote}
              onChange={(e) => setGamingNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#09090B] focus:outline-none focus:border-[#3B9EFF]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#3B9EFF] to-[#4C8DFF] text-white text-xs font-bold hover:opacity-95 active:scale-98 transition-all shadow-xs"
          >
            Submit Activity Entry
          </button>
        </form>

        <div className="bg-[#3F3F46] p-3 rounded-xl text-xs flex justify-between items-center text-[#A1A1AA]">
          <span>Month Activity Net Result:</span>
          <span className={`font-bold ${gamingNet >= 0 ? 'text-[#00E55F]' : 'text-[#FF6B57]'}`}>
            {gamingNet >= 0 ? `+৳${gamingNet}` : `-৳${Math.abs(gamingNet)}`}
          </span>
        </div>
      </div>
    </div>
  );
};
