import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { SEED_TRANSACTIONS } from '../constants/categories';
import { Settings, Shield, Download, Upload, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
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
    downloadAnchor.setAttribute('download', `takar_hishab_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Backup file downloaded');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all transactions and reset data? This cannot be undone.')) {
      onClearAllData();
      onShowToast('All data cleared.');
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-5 pb-24">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[#FFFFFF] font-serif-display">
          App Settings & Preferences
        </h2>
        <p className="text-xs text-[#A1A1AA]">
          Manage monthly allowance limits, data backups, and budget configuration.
        </p>
      </div>

      {/* 1. Monthly Budget Goal Settings */}
      <div className="bg-[#27272A] p-4.5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col gap-3">
        <span className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#00E55F]" />
          Monthly Allowance & Budget Limit
        </span>

        <form onSubmit={handleSaveBudget} className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717A]">
              ৳
            </span>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border border-[rgba(255,255,255,0.13)] bg-[#09090B] focus:outline-none focus:border-[#00E55F]"
              placeholder="e.g. 20000"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#00E55F] text-[#062012] text-xs font-bold hover:bg-[#00E55F]/90 transition-all shadow-2xs"
          >
            Save Target
          </button>
        </form>
      </div>

      {/* 2. Data Backup & Reset */}
      <div className="bg-[#27272A] p-4.5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col gap-3">
        <span className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#8B7FF5]" />
          Data Management & Storage
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Export JSON */}
          <button
            onClick={handleExportData}
            className="p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#09090B] hover:bg-[rgba(139,127,245,0.12)] text-xs font-bold text-[#FFFFFF] flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#8B7FF5]" />
              <span>Export Backup JSON</span>
            </div>
            <span className="text-[10px] text-[#71717A]">Save file</span>
          </button>

          {/* Load Sample Data */}
          <button
            onClick={() => {
              onLoadSampleData();
              onShowToast('Sample data loaded');
            }}
            className="p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#09090B] hover:bg-[rgba(0,229,95,0.12)] text-xs font-bold text-[#FFFFFF] flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#00E55F]" />
              <span>Load Sample Test Data</span>
            </div>
            <span className="text-[10px] text-[#71717A]">Demo entries</span>
          </button>
        </div>

        {/* Clear All Data */}
        <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#FF6B57]">Reset All Data</span>
            <span className="text-[10px] text-[#71717A]">
              Delete all logged transactions and start with a clean slate
            </span>
          </div>

          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl border border-[#FF6B57] text-[#FF6B57] hover:bg-[rgba(255,107,87,0.12)] text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* 3. Category Budgets Reference */}
      <div className="bg-[#27272A] p-4.5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xs flex flex-col gap-3">
        <span className="text-sm font-bold text-[#FFFFFF]">
          Default Category Budget Limits
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-2.5 rounded-xl bg-[#09090B] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" style={{ color: cat.color }} />
                <span className="font-semibold text-[#FFFFFF]">{cat.name}</span>
              </div>
              <span className="font-bold text-[#A1A1AA]">
                ৳{cat.budget.toLocaleString('en-BD')}/mo
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Credit */}
      <div className="pt-2 pb-1 flex items-center justify-center">
        <span className="app-credit">
          Built by{' '}
          <a href="https://github.com/pbs002-s" target="_blank" rel="noopener noreferrer">
            @pbs002-s
          </a>
        </span>
      </div>
    </div>
  );
};
