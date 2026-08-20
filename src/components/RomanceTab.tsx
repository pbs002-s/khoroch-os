import React from 'react';
import { Transaction } from '../types';
import { PARTNER_PRESETS } from '../constants/categories';
import { 
  Heart, 
  Sparkles, 
  Smile, 
  PartyPopper, 
  Plus, 
  Zap, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CategoryIcon } from '../constants/icons';
import { AnimatedNumber } from './AnimatedNumber';

interface RomanceTabProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
  monthlyBudgetLimit?: number;
}

export const RomanceTab: React.FC<RomanceTabProps> = ({
  transactions,
  onAddTransaction,
  onShowToast,
  monthlyBudgetLimit = 20000,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate Partner total spend
  const partnerSpend = transactions
    .filter((t) => t.type === 'expense' && t.category === 'partner')
    .reduce((acc, t) => acc + t.amount, 0);

  const partnerBudgetPercent = monthlyBudgetLimit > 0
    ? Math.round((partnerSpend / monthlyBudgetLimit) * 100)
    : 0;

  // Handle Preset Quick Add
  const handleAddPreset = (name: string, price: number, note?: string) => {
    onAddTransaction({
      type: 'expense',
      desc: name,
      category: 'partner',
      amount: price,
      date: todayStr,
      note: note || 'Romantic & Social Outings entry',
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
      date: todayStr,
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
      date: todayStr,
      note: 'Rickshaw (৳280) + Lake Fuska (৳160) + Beli Phul (৳110) + Tea (৳30)',
    });
    onShowToast(`Rainy Dhanmondi Romance logged (৳${bundleAmount}) 🌧️💕`);
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-24 animate-slide-in">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white font-display">
          Partner & Social Romance Hub
        </h2>
        <p className="text-xs text-zinc-400">
          The calculated financial cost of being deeply in love (and keeping peace) in Dhaka
        </p>
      </div>

      {/* Main Romance Bento Card */}
      <div className="bento-card p-5 sm:p-6 flex flex-col gap-5 bg-[#12131A] relative overflow-hidden">
        {/* Pink Glow Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Header Metric Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white font-display">
                  Dhaka Romance & Date Budget
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-nums font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  Simp Score: 100% 💕
                </span>
              </div>
              <span className="text-xs text-zinc-400">
                Witty date night presets, student treat packages & emergency peace treaties
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bento-inner-box px-3.5 py-2 self-start sm:self-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-mono-nums">Month Love Spend</span>
              <span className="text-base font-extrabold text-rose-400 font-mono-nums">
                <AnimatedNumber value={partnerSpend} prefix="৳" />
              </span>
            </div>
            <div className="w-px h-7 bg-white/[0.08]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-mono-nums">Budget Share</span>
              <span className="text-base font-extrabold text-white font-mono-nums">
                {partnerBudgetPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Funny Presets Grid */}
        <div className="flex flex-col gap-2.5 relative z-10">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>1-Tap Romance Presets:</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  onClick={() => handleAddPreset(preset.name, preset.price, preset.tagline)}
                  className="w-full py-1.5 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log This Date</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Romantic Bundles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 relative z-10">
          {/* Bundle 1 */}
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

          {/* Bundle 2 */}
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
    </div>
  );
};
