import React, { useState } from 'react';
import { 
  Flame, 
  Coffee, 
  Sparkles, 
  TrendingDown, 
  CheckCircle, 
  Plus, 
  Minus,
  Info,
  Zap,
  ArrowRight,
  ShieldAlert,
  Percent,
  Calculator,
  Sliders,
  Award,
  Wallet,
  Layers,
  Shuffle
} from 'lucide-react';
import { Transaction } from '../types';
import { AnimatedNumber } from './AnimatedNumber';

export interface CigaretteBrand {
  id: string;
  name: string;
  price: number; // in BDT
  tier: 'premium' | 'standard' | 'budget';
  tagline: string;
}

export const ALL_CIGARETTE_BRANDS: CigaretteBrand[] = [
  { id: 'advance', name: 'Marlboro Advance', price: 23, tier: 'premium', tagline: 'The modern youth favourite blend' },
  { id: 'camel', name: 'Camel (Yellow / Blue)', price: 16, tier: 'standard', tagline: 'Smooth rich Turkish-American tobacco' },
  { id: 'benson', name: 'Benson & Hedges', price: 23, tier: 'premium', tagline: 'The classic aristocrat campus choice' },
  { id: 'dunhill', name: 'Dunhill Switch', price: 25, tier: 'premium', tagline: 'Cool capsule click luxury' },
  { id: 'goldleaf', name: 'Gold Leaf', price: 18, tier: 'standard', tagline: 'The national student staple standard' },
  { id: 'luckystrike', name: 'Lucky Strike', price: 12, tier: 'budget', tagline: 'Pocket-friendly toasted campus staple' },
  { id: 'manchester', name: 'Manchester Special', price: 15, tier: 'standard', tagline: 'Sleek aromatic campus alternative' },
  { id: 'djarum', name: 'Djarum Black / Ice', price: 25, tier: 'premium', tagline: 'Clove spicy kick for exam night' },
  { id: 'star', name: 'Star Filter', price: 10, tier: 'budget', tagline: 'Maximum stick volume on a tight budget' },
  { id: 'navy', name: 'Navy / Sheikh', price: 8, tier: 'budget', tagline: 'Hardcore survival budget tier' },
];

export const POPULAR_BEVERAGES = [
  { id: 'milktea', name: 'Hot Milk Tea (দুধ চা)', price: 15 },
  { id: 'rongcha', name: 'Raw / Lemon Tea (রং চা)', price: 8 },
  { id: 'coffee', name: 'Espresso Coffee (কফি)', price: 40 },
  { id: 'none', name: 'No Beverage', price: 0 },
];

// Popular Mixed Combo Presets (e.g. 1 Advance + 2 Camel)
export const MIXED_COMBO_PRESETS = [
  {
    id: 'mc1',
    title: '1 Advance + 2 Camel Classic',
    subtitle: 'The ultimate balanced student dual-blend',
    items: [
      { brandId: 'advance', count: 1 },
      { brandId: 'camel', count: 2 },
    ],
    beverageId: 'none',
    totalPrice: 23 * 1 + 16 * 2, // ৳55
    badge: 'Trending Combo 🔥',
  },
  {
    id: 'mc2',
    title: '1 Advance + 2 Camel + Milk Tea',
    subtitle: 'Afternoon campus hangout full package',
    items: [
      { brandId: 'advance', count: 1 },
      { brandId: 'camel', count: 2 },
    ],
    beverageId: 'milktea',
    totalPrice: 23 * 1 + 16 * 2 + 15, // ৳70
    badge: 'Best Hangout Combo ☕',
  },
  {
    id: 'mc3',
    title: '1 Benson + 2 Gold Leaf (VIP Shift)',
    subtitle: 'Morning luxury smoke + afternoon grind',
    items: [
      { brandId: 'benson', count: 1 },
      { brandId: 'goldleaf', count: 2 },
    ],
    beverageId: 'milktea',
    totalPrice: 23 * 1 + 18 * 2 + 15, // ৳74
    badge: 'Campus Aristocrat 👑',
  },
  {
    id: 'mc4',
    title: '2 Advance + 1 Dunhill + Raw Tea (All-Nighter)',
    subtitle: 'Zero sleep, 100% exam focus session',
    items: [
      { brandId: 'advance', count: 2 },
      { brandId: 'dunhill', count: 1 },
    ],
    beverageId: 'rongcha',
    totalPrice: 23 * 2 + 25 * 1 + 8, // ৳79
    badge: 'Exam Rush ⚡',
  },
];

interface CigaretteSmartSuggestionProps {
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
  monthlyBudgetLimit: number;
  transactions: Transaction[];
  compact?: boolean;
}

export const CigaretteSmartSuggestion: React.FC<CigaretteSmartSuggestionProps> = ({
  onAddTransaction,
  onShowToast,
  monthlyBudgetLimit,
  transactions,
  compact = false,
}) => {
  // Navigation Mode
  const [activeSubTab, setActiveSubTab] = useState<'mixed' | 'budget_allocator' | 'single'>('mixed');

  // Mode 1: Daily Budget Allocator state
  const [userDailyBudget, setUserDailyBudget] = useState<number>(80);

  // Mode 2: Custom Multi-Brand Mixed Builder state (Brand ID -> count)
  const [mixedCounts, setMixedCounts] = useState<Record<string, number>>({
    advance: 1,
    camel: 2,
  });
  const [mixedBeverageId, setMixedBeverageId] = useState('none');

  // Mode 3: Single Brand Selector state
  const [selectedBrandId, setSelectedBrandId] = useState('advance');
  const [singleStickCount, setSingleStickCount] = useState(3);
  const [singleBeverageId, setSingleBeverageId] = useState('milktea');

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate mixed total cost
  const mixedSticksCost = Object.entries(mixedCounts).reduce((acc: number, [brandId, count]) => {
    const brand = ALL_CIGARETTE_BRANDS.find((b) => b.id === brandId);
    return acc + (brand ? brand.price * Number(count) : 0);
  }, 0);

  const selectedMixedBeverage = POPULAR_BEVERAGES.find((b) => b.id === mixedBeverageId) || POPULAR_BEVERAGES[3];
  const totalMixedCost = mixedSticksCost + selectedMixedBeverage.price;
  const totalMixedSticks = Object.values(mixedCounts).reduce((a: number, b: number) => a + Number(b), 0);

  // Update count helper for mixed brand builder
  const handleUpdateMixedCount = (brandId: string, delta: number) => {
    setMixedCounts((prev) => {
      const current = prev[brandId] || 0;
      const next = Math.max(current + delta, 0);
      return { ...prev, [brandId]: next };
    });
  };

  // 1-Tap Log Mixed Custom Combo
  const handleLogMixedCustom = () => {
    const activeItems = Object.entries(mixedCounts)
      .filter(([_, count]) => Number(count) > 0)
      .map(([brandId, count]) => {
        const b = ALL_CIGARETTE_BRANDS.find((brand) => brand.id === brandId);
        return `${count}x ${b ? b.name.split(' ')[0] : brandId}`;
      });

    if (activeItems.length === 0 && selectedMixedBeverage.price === 0) {
      onShowToast('Please select at least 1 item');
      return;
    }

    const bevText = selectedMixedBeverage.price > 0 ? ` + ${selectedMixedBeverage.name.split(' (')[0]}` : '';
    const desc = `${activeItems.join(' + ')}${bevText}`;

    onAddTransaction({
      type: 'expense',
      desc,
      category: 'essentials',
      amount: totalMixedCost,
      date: todayStr,
      note: `Mixed Cigarette Combo (${totalMixedSticks} sticks total)`,
    });

    onShowToast(`Logged Combo: ${desc} (৳${totalMixedCost})`);
  };

  // 1-Tap Log Preset Combo
  const handleLogPreset = (preset: typeof MIXED_COMBO_PRESETS[0]) => {
    onAddTransaction({
      type: 'expense',
      desc: preset.title,
      category: 'essentials',
      amount: preset.totalPrice,
      date: todayStr,
      note: `Preset: ${preset.subtitle}`,
    });
    onShowToast(`Logged: ${preset.title} (৳${preset.totalPrice})`);
  };

  // Log from Budget Allocator recommendation
  const handleLogRecommendation = (brand: CigaretteBrand, count: number, totalCost: number) => {
    const desc = `${count}x ${brand.name}`;
    onAddTransaction({
      type: 'expense',
      desc,
      category: 'essentials',
      amount: totalCost,
      date: todayStr,
      note: `Daily Budget Allocation (৳${userDailyBudget}/day)`,
    });
    onShowToast(`Logged: ${desc} (৳${totalCost})`);
  };

  // Today's actual logged cigarette/tea expenses
  const todayLoggedEssentials = transactions
    .filter((t) => t.date === todayStr && (t.category === 'essentials' || t.category === 'tea'))
    .reduce((acc, t) => acc + t.amount, 0);

  // Generate recommendations based on userDailyBudget
  const budgetRecommendations = ALL_CIGARETTE_BRANDS.map((brand) => {
    const maxSticks = Math.floor(userDailyBudget / brand.price);
    const sticksCost = maxSticks * brand.price;
    const change = userDailyBudget - sticksCost;

    return {
      brand,
      maxSticks,
      sticksCost,
      change,
      monthlyBurn: sticksCost * 30,
    };
  }).filter((r) => r.maxSticks > 0);

  return (
    <div className={`bento-card p-5 sm:p-6 flex flex-col gap-4.5 bg-[#12131A] relative overflow-hidden ${compact ? 'border-white/[0.08]' : ''}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shadow-md shadow-amber-500/10">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-display">
                Cigarette & Mixed Brand Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-nums font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Advance + Camel + Benson Engine
              </span>
            </div>
            <span className="text-xs text-zinc-400">
              Mix multiple brands (e.g. 1 Advance + 2 Camel), budget allocator & smart cutback suggestions
            </span>
          </div>
        </div>

        {/* Tab Navigation Pill Selector */}
        <div className="flex items-center gap-1 bg-[#0E0F15] p-1 rounded-xl border border-white/[0.08] self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setActiveSubTab('mixed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'mixed'
                ? 'bg-amber-500 text-[#041E11] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Mixed Combos (1 Adv + 2 Camel)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('budget_allocator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'budget_allocator'
                ? 'bg-amber-500 text-[#041E11] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Budget Matcher</span>
          </button>

          <button
            onClick={() => setActiveSubTab('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'single'
                ? 'bg-amber-500 text-[#041E11] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Single Brand</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SUB-TAB 1: MULTI-BRAND MIXED COMBOS (1 Advance + 2 Camel, etc.)
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'mixed' && (
        <div className="flex flex-col gap-4.5 animate-slide-in">
          {/* Popular Mixed Presets Cards */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Popular Mixed Combos (1-Tap Direct Log):</span>
              </span>
              <span className="text-[11px] text-zinc-400 font-mono-nums">Top Student Pairings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MIXED_COMBO_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="bento-inner-box p-3.5 rounded-xl hover:border-amber-500/40 transition-all flex flex-col justify-between gap-3 bg-[#111219] group"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-mono-nums font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        {preset.badge}
                      </span>
                      <span className="text-xs font-extrabold text-amber-400 font-mono-nums">
                        ৳{preset.totalPrice}
                      </span>
                    </div>

                    <span className="font-bold text-white text-xs leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {preset.title}
                    </span>

                    <span className="text-[10px] text-zinc-400 line-clamp-2">
                      "{preset.subtitle}"
                    </span>
                  </div>

                  <button
                    onClick={() => handleLogPreset(preset)}
                    className="w-full py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-[#041E11] text-[11px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Log (৳{preset.totalPrice})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Multi-Brand Custom Mixer */}
          <div className="bento-inner-box p-4 rounded-xl flex flex-col gap-3.5 bg-[#0E0F15]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Multi-Brand Mixer: Build Any Combination</span>
              </span>
              <span className="text-[11px] text-zinc-400 font-mono-nums">
                {totalMixedSticks} sticks total
              </span>
            </div>

            {/* Brands Counter Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {ALL_CIGARETTE_BRANDS.slice(0, 5).map((b) => {
                const count = mixedCounts[b.id] || 0;
                return (
                  <div key={b.id} className="bento-inner-box p-2.5 rounded-xl flex flex-col justify-between gap-2 bg-[#14151F]">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white truncate">{b.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono-nums">৳{b.price}/stick</span>
                    </div>

                    <div className="flex items-center justify-between bg-[#0E0F15] p-1 rounded-lg border border-white/[0.06]">
                      <button
                        onClick={() => handleUpdateMixedCount(b.id, -1)}
                        className="w-6 h-6 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-extrabold text-white font-mono-nums">
                        {count}
                      </span>
                      <button
                        onClick={() => handleUpdateMixedCount(b.id, 1)}
                        className="w-6 h-6 rounded-md bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-[#041E11] flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Beverage Pairing Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">Add Beverage:</span>
                <select
                  value={mixedBeverageId}
                  onChange={(e) => setMixedBeverageId(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-white/[0.12] bg-[#14151F] text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {POPULAR_BEVERAGES.map((bev) => (
                    <option key={bev.id} value={bev.id} className="bg-[#12131A] text-white">
                      {bev.name} {bev.price > 0 ? `(+৳${bev.price})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Calculation & Log Action */}
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-1 text-right">
                  <span className="text-xs text-zinc-400">Total Combo:</span>
                  <span className="text-lg font-extrabold text-amber-400 font-mono-nums">
                    ৳{totalMixedCost}
                  </span>
                </div>

                <button
                  onClick={handleLogMixedCustom}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-[#041E11] text-xs font-extrabold hover:opacity-95 active:scale-98 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-[#041E11]" />
                  <span>Log This Mixed Combo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-TAB 2: DAILY BUDGET ALLOCATOR & MATCHER
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'budget_allocator' && (
        <div className="flex flex-col gap-4 animate-slide-in">
          {/* Daily Budget Input Box */}
          <div className="bento-inner-box p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0E0F15]">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>What is your daily budget for cigarettes & tea?</span>
              </label>
              <span className="text-[11px] text-zinc-400">
                Type an amount or tap quick chips to see what brands and counts you can afford:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">
                  ৳
                </span>
                <input
                  type="number"
                  value={userDailyBudget}
                  onChange={(e) => setUserDailyBudget(Math.max(Number(e.target.value) || 0, 0))}
                  className="w-28 pl-7 pr-3 py-2 text-sm font-extrabold rounded-xl border border-amber-500/40 bg-[#161722] text-white focus:outline-none focus:border-amber-400 font-mono-nums text-right shadow-inner"
                  placeholder="80"
                  min="0"
                />
              </div>
              <span className="text-xs font-bold text-zinc-400 font-mono-nums">/day</span>
            </div>
          </div>

          {/* Quick Budget Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono-nums uppercase text-zinc-400 font-semibold">
              Quick Budget Caps:
            </span>
            {[32, 50, 64, 80, 100, 120, 150].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setUserDailyBudget(amt)}
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono-nums transition-all ${
                  userDailyBudget === amt
                    ? 'bg-amber-500 text-[#041E11] shadow-md shadow-amber-500/20'
                    : 'bento-inner-box text-zinc-300 hover:text-white hover:border-amber-500/30'
                }`}
              >
                ৳{amt}
              </button>
            ))}
          </div>

          {/* Dynamic Budget Matcher Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {budgetRecommendations.map((rec) => (
              <div
                key={rec.brand.id}
                className="bento-inner-box p-3.5 rounded-xl hover:border-amber-500/40 transition-all flex flex-col justify-between gap-3 bg-[#111219] group"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate pr-1">
                      {rec.brand.name}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono-nums font-bold">
                      ৳{rec.brand.price}/ea
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-white font-mono-nums">
                        {rec.maxSticks}
                      </span>
                      <span className="text-xs text-zinc-400">sticks/day</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400 font-mono-nums">
                      ৳{rec.sticksCost} total
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-300 flex items-center gap-1.5 pt-1 border-t border-white/[0.06]">
                    {rec.change >= 15 ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <Coffee className="w-3 h-3" />
                        <span>+৳{rec.change} left (Can buy Milk Tea!)</span>
                      </span>
                    ) : rec.change >= 8 ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <Coffee className="w-3 h-3" />
                        <span>+৳{rec.change} left (Can buy Raw Tea!)</span>
                      </span>
                    ) : (
                      <span className="text-zinc-400">
                        ৳{rec.change} change remaining
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleLogRecommendation(rec.brand, rec.maxSticks, rec.sticksCost)}
                  className="w-full py-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-[#041E11] text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Log {rec.maxSticks}x {rec.brand.name.split(' ')[0]} (৳{rec.sticksCost})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUB-TAB 3: SINGLE BRAND + TEA SIMULATOR
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'single' && (
        <div className="flex flex-col gap-4 animate-slide-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono-nums text-zinc-400 uppercase tracking-wider block mb-1.5">
                Brand
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {ALL_CIGARETTE_BRANDS.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#12131A] text-white">
                    {b.name} — ৳{b.price}/stick
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono-nums text-zinc-400 uppercase tracking-wider block mb-1.5">
                Daily Sticks
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setSingleStickCount(cnt)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono-nums transition-all ${
                      singleStickCount === cnt
                        ? 'bg-amber-500 text-[#041E11] shadow-sm'
                        : 'bento-inner-box text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cnt}x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono-nums text-zinc-400 uppercase tracking-wider block mb-1.5">
                Tea / Beverage Pairing
              </label>
              <select
                value={singleBeverageId}
                onChange={(e) => setSingleBeverageId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {POPULAR_BEVERAGES.map((bev) => (
                  <option key={bev.id} value={bev.id} className="bg-[#12131A] text-white">
                    {bev.name} {bev.price > 0 ? `(+৳${bev.price})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
