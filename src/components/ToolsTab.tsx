import React, { useState } from 'react';
import { Transaction } from '../types';
import { ESSENTIAL_PRESETS, PARTNER_PRESETS } from '../constants/categories';
import { 
  Heart, 
  Dices, 
  Plus, 
  Sparkles, 
  Coffee, 
  Flame, 
  UtensilsCrossed, 
  Zap, 
  Smile, 
  PartyPopper,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { CategoryIcon } from '../constants/icons';
import { CigaretteSmartSuggestion } from './CigaretteSmartSuggestion';

interface ToolsTabProps {
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
  transactions: Transaction[];
  monthlyBudgetLimit?: number;
}

export const ToolsTab: React.FC<ToolsTabProps> = ({
  onAddTransaction,
  onShowToast,
  transactions,
  monthlyBudgetLimit = 20000,
}) => {
  // Activity / Gaming State
  const [gamingAmount, setGamingAmount] = useState<number | ''>('');
  const [gamingType, setGamingType] = useState<'profit' | 'loss'>('loss');
  const [gamingNote, setGamingNote] = useState('');

  // Calculate Partner total spend
  const partnerSpend = transactions
    .filter((t) => t.type === 'expense' && t.category === 'partner')
    .reduce((acc, t) => acc + t.amount, 0);

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
  const handleAddPreset = (name: string, price: number, catId: string, note?: string) => {
    onAddTransaction({
      type: 'expense',
      desc: name,
      category: catId,
      amount: price,
      date: new Date().toISOString().split('T')[0],
      note: note || 'Quick romantic/social preset entry',
    });
    onShowToast(`Logged: ${name} (৳${price}) 💕`);
  };

  // Handle Emergency Patch-up Bundle
  const handleAddPatchUpBundle = () => {
    const bundleAmount = 380 + 850 + 250; // ৳1480
    onAddTransaction({
      type: 'expense',
      desc: 'The "I Messed Up / Peace Treaty" Deluxe Date',
      category: 'partner',
      amount: bundleAmount,
      date: new Date().toISOString().split('T')[0],
      note: 'Emergency Date: Boba (৳380) + Dinner (৳850) + Beli Phul (৳250) = 100% Peace Restored',
    });
    onShowToast(`"I Messed Up" Deluxe Peace Treaty logged (৳${bundleAmount}) 💕`);
  };

  // Handle Rainy Dhanmondi Romance Bundle
  const handleAddRainyRomanceBundle = () => {
    const bundleAmount = 280 + 160 + 110 + 30; // ৳580
    onAddTransaction({
      type: 'expense',
      desc: 'Rainy Day Dhanmondi Hood-Down Romance',
      category: 'partner',
      amount: bundleAmount,
      date: new Date().toISOString().split('T')[0],
      note: 'Rickshaw (৳280) + Lake Fuska (৳160) + Beli Phul (৳110) + Tea (৳30)',
    });
    onShowToast(`Rainy Dhanmondi Romance logged (৳${bundleAmount}) 🌧️💕`);
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
    <div className="w-full flex flex-col gap-6 pb-24 animate-slide-in">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white font-display">
          Quick Logging & Smart Presets
        </h2>
        <p className="text-xs text-zinc-400">
          Fast 1-tap logging for daily essentials, cigarette budget matchers, romantic dates, and recreation entries.
        </p>
      </div>

      {/* 1. Full Cigarette & Daily Essentials Smart Suggestion & Budget Allocator */}
      <div className="animate-fade-in-up stagger-1">
        <CigaretteSmartSuggestion
          onAddTransaction={onAddTransaction}
          onShowToast={onShowToast}
          monthlyBudgetLimit={monthlyBudgetLimit}
          transactions={transactions}
        />
      </div>

      {/* 2. Partner & Social Outings (Romantic, Funny & Witty) */}
      <div className="bento-card p-5 sm:p-6 flex flex-col gap-4.5 bg-[#12131A] animate-fade-in-up stagger-2 relative overflow-hidden">
        {/* Subtle romantic ambient pink glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white font-display">
                  Partner & Social Romance Tracker
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-nums font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  Simp Score: 100% 💕
                </span>
              </div>
              <span className="text-xs text-zinc-400">
                The calculated financial cost of being deeply in love (and keeping peace) in Dhaka
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-nums self-start sm:self-auto">
            <span className="text-zinc-400">Month Love Spend:</span>
            <span className="font-extrabold text-rose-400">
              ৳{partnerSpend.toLocaleString('en-BD')}
            </span>
          </div>
        </div>

        {/* Funny Romance Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
          {PARTNER_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bento-inner-box p-3.5 rounded-xl hover:border-rose-500/40 transition-all flex flex-col justify-between gap-2.5 bg-[#111219] group"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                    <CategoryIcon name={preset.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-rose-400 font-mono-nums">
                    ৳{preset.price}
                  </span>
                </div>

                <span className="font-bold text-white text-xs leading-snug line-clamp-1 group-hover:text-rose-300 transition-colors">
                  {preset.name}
                </span>

                {preset.tagline && (
                  <span className="text-[10px] text-zinc-400 italic line-clamp-2 leading-relaxed">
                    "{preset.tagline}"
                  </span>
                )}
              </div>

              <button
                onClick={() => handleAddPreset(preset.name, preset.price, 'partner', preset.tagline)}
                className="w-full py-1.5 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log This Date</span>
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Romantic Bundles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 relative z-10">
          {/* Bundle 1: "I Messed Up / Peace Treaty" Deluxe */}
          <div className="bento-inner-box p-4 border border-rose-500/30 bg-rose-500/5 rounded-xl flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>The "I Messed Up / Peace Treaty" Deluxe</span>
                </span>
                <span className="text-xs font-extrabold text-rose-400 font-mono-nums">৳1,480</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Boba Drink (৳380) + Aesthetic Dinner (৳850) + Beli Phul (৳250) = 100% Guaranteed Peace & Forgiveness.
              </p>
            </div>

            <button
              onClick={handleAddPatchUpBundle}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>+ Log Emergency Peace Treaty (৳1,480)</span>
            </button>
          </div>

          {/* Bundle 2: Rainy Day Dhanmondi Hood-Down Rickshaw Romance */}
          <div className="bento-inner-box p-4 border border-sky-500/30 bg-sky-500/5 rounded-xl flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-sky-400" />
                  <span>Rainy Day Dhanmondi Hood-Down Romance</span>
                </span>
                <span className="text-xs font-extrabold text-sky-400 font-mono-nums">৳580</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Hood-down Rickshaw (৳280) + Lake Fuska (৳160) + Beli Phul (৳110) + 2x Hot Milk Tea (৳30).
              </p>
            </div>

            <button
              onClick={handleAddRainyRomanceBundle}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <PartyPopper className="w-4 h-4" />
              <span>+ Log Rainy Dhanmondi Romance (৳580)</span>
            </button>
          </div>
        </div>

        {/* Witty Relationship Financial Advice Footer */}
        <div className="bento-inner-box p-3 text-[11px] text-zinc-300 border border-white/[0.08] flex items-center gap-2 bg-[#0E0F15] rounded-xl relative z-10">
          <span className="text-rose-400 text-sm">💡</span>
          <span>
            <strong className="text-white">Romance ROI Formula:</strong> A ৳250 Beli Phul bouquet today prevents a ৳2,500 anger-induced fancy restaurant dinner next week. Financial literacy at its finest!
          </span>
        </div>
      </div>

      {/* 3. Activity & Gaming P/L Tracker */}
      <div className="bento-card p-5 sm:p-6 flex flex-col gap-4 bg-[#12131A] animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Dices className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white font-display">
              Activity, Sports & Recreation P/L Tracker
            </span>
          </div>
          <span className="text-[10px] font-mono-nums font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
            P/L Tracker
          </span>
        </div>

        <form onSubmit={handleAddGamingEntry} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono-nums text-zinc-400 uppercase tracking-wider block mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={gamingAmount}
                onChange={(e) => setGamingAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-indigo-500 font-mono-nums"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono-nums text-zinc-400 uppercase tracking-wider block mb-1">
                Entry Type
              </label>
              <select
                value={gamingType}
                onChange={(e) => setGamingType(e.target.value as 'profit' | 'loss')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="loss">Loss Entry (-Expense)</option>
                <option value="profit">Win / Profit (+Income)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono-nums text-zinc-400 uppercase tracking-wider block mb-1">
              Event / Match Name
            </label>
            <input
              type="text"
              placeholder="e.g. Turf football match share or tournament"
              value={gamingNote}
              onChange={(e) => setGamingNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="bento-inner-box px-3 py-2 text-xs flex items-center gap-2 text-zinc-400">
              <span>Net Result:</span>
              <span className={`font-bold font-mono-nums ${gamingNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {gamingNet >= 0 ? `+৳${gamingNet.toLocaleString('en-BD')}` : `-৳${Math.abs(gamingNet).toLocaleString('en-BD')}`}
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 active:scale-98 transition-all shadow-md shadow-indigo-600/20"
            >
              Submit Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
