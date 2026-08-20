import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { SEED_TRANSACTIONS } from '../constants/categories';
import { 
  Settings, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  CheckCircle,
  Layers,
  Save,
  Database
} from 'lucide-react';
import { CategoryIcon } from '../constants/icons';

interface SettingsTabProps {
  categories: Category[];
  transactions: Transaction[];
  monthlyBudgetLimit: number;
  onUpdateMonthlyBudget: (newLimit: number) => void;
  onClearAllData: () => void;
  onLoadSampleData: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  categories,
  transactions,
  monthlyBudgetLimit,
  onUpdateMonthlyBudget,
  onClearAllData,
  onLoadSampleData,
  onShowToast,
}) => {
  const [budgetInput, setBudgetInput] = useState(monthlyBudgetLimit.toString());

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(budgetInput);
    if (val && val > 0) {
      onUpdateMonthlyBudget(val);
      onShowToast(`Monthly budget updated to ৳${val.toLocaleString('en-BD')}`);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taka_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Backup file downloaded');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all transactions and reset data? This action cannot be undone.')) {
      onClearAllData();
      onShowToast('All data reset.');
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-24 animate-slide-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white font-display">
          Settings & Preferences
        </h2>
        <p className="text-xs text-zinc-400">
          Manage your monthly allowance target, data storage, and category allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Monthly Budget Goal Settings */}
        <div className="bento-card p-5 sm:p-6 flex flex-col gap-4 bg-[#12131A]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white font-display">
              Monthly Allowance Budget Target
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            Set your expected monthly student allowance or income threshold. All budget velocity meters adapt to this goal.
          </p>

          <form onSubmit={handleSaveBudget} className="flex items-center gap-2 mt-1">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                ৳
              </span>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 text-xs font-bold rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-emerald-500 font-mono-nums"
                placeholder="20000"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-[#041E11] text-xs font-bold hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </form>
        </div>

        {/* 2. Data Backup & Reset */}
        <div className="bento-card p-5 sm:p-6 flex flex-col gap-4 bg-[#12131A]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white font-display">
              Data Management & Persistence
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Export JSON */}
            <button
              onClick={handleExportData}
              className="p-3 rounded-xl bento-inner-box hover:border-indigo-500/40 text-xs font-bold text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Export JSON</span>
              </div>
              <span className="text-[10px] text-zinc-400">Save File</span>
            </button>

            {/* Load Sample Data */}
            <button
              onClick={() => {
                onLoadSampleData();
                onShowToast('Sample demo dataset loaded');
              }}
              className="p-3 rounded-xl bento-inner-box hover:border-emerald-500/40 text-xs font-bold text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Load Demo Data</span>
              </div>
              <span className="text-[10px] text-zinc-400">Sample</span>
            </button>
          </div>

          {/* Clear All Data */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-rose-400">Reset Local Storage</span>
              <span className="text-[11px] text-zinc-400">
                Wipe all records and start fresh
              </span>
            </div>

            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* 3. Category Budgets Reference */}
        <div className="md:col-span-2 bento-card p-5 sm:p-6 flex flex-col gap-4 bg-[#12131A]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white font-display">
                Default Category Allocations & Limits
              </span>
            </div>
            <span className="text-xs text-zinc-400 font-mono-nums">
              {categories.length} Registered Categories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 rounded-xl bento-inner-box flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <CategoryIcon name={cat.icon} className="w-4 h-4" style={{ color: cat.color }} />
                  <span className="font-semibold text-white truncate">{cat.name}</span>
                </div>
                <span className="font-bold text-zinc-300 font-mono-nums shrink-0">
                  ৳{cat.budget.toLocaleString('en-BD')}/mo
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credit */}
      <div className="pt-4 flex items-center justify-center text-xs text-zinc-500 font-mono-nums">
        <span>TAKA Personal Finance Platform • Built for Bangladesh students</span>
      </div>
    </div>
  );
};
