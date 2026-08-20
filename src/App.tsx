import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import { CATEGORIES, SEED_TRANSACTIONS } from './constants/categories';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav, NavTab } from './components/BottomNav';
import { FAB } from './components/FAB';
import { BentoDashboard } from './components/BentoDashboard';
import { CigaretteSmartSuggestion } from './components/CigaretteSmartSuggestion';
import { RomanceTab } from './components/RomanceTab';
import { TransactionsTab } from './components/TransactionsTab';
import { AIPanel } from './components/AIPanel';
import { SettingsTab } from './components/SettingsTab';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AddIncomeModal } from './components/AddIncomeModal';
import { Toast } from './components/Toast';
import { X } from 'lucide-react';

export default function App() {
  // 1. Transactions State (Persisted under key 'txns')
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('txns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse txns from localStorage', e);
    }
    return SEED_TRANSACTIONS;
  });

  // 2. Active Tab State ('home' | 'cgrt' | 'romance' | 'txns' | 'ai' | 'settings')
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Selected Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Monthly Budget limit state (persisted in localStorage)
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('monthly_budget_limit');
      if (saved) {
        const num = Number(saved);
        if (num > 0) return num;
      }
    } catch (e) {}
    return 20000;
  });

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('txns', JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed to save txns to localStorage', e);
    }
  }, [transactions]);

  // Sync monthly budget to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('monthly_budget_limit', monthlyBudgetLimit.toString());
    } catch (e) {}
  }, [monthlyBudgetLimit]);

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Handlers
  const handleAddTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...t,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAllData = () => {
    setTransactions([]);
    try {
      localStorage.removeItem('txns');
    } catch (e) {}
  };

  const handleLoadSampleData = () => {
    setTransactions(SEED_TRANSACTIONS);
  };

  // Format Current Month & Year
  const currentMonthYear = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#FFFFFF] flex flex-row font-sans selection:bg-emerald-500/25 selection:text-emerald-300 antialiased overflow-x-hidden relative">
      {/* ── AMBIENT BACKGROUND GLOW & ANIMATED ORBS ── */}
      <div className="ambient-bg-glow">
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      </div>

      {/* 1. Desktop Fixed Sidebar */}
      <div className="hidden lg:flex shrink-0 h-screen sticky top-0 z-20">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          categories={CATEGORIES}
          transactions={transactions}
          monthlyBudgetLimit={monthlyBudgetLimit}
          onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
          onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* 2. Mobile Slide-over Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div
            className="w-[270px] h-full bg-[#0F1016] border-r border-white/[0.08] shadow-2xl animate-slide-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              categories={CATEGORIES}
              transactions={transactions}
              monthlyBudgetLimit={monthlyBudgetLimit}
              onOpenExpenseModal={() => {
                setIsMobileSidebarOpen(false);
                setIsExpenseModalOpen(true);
              }}
              onOpenIncomeModal={() => {
                setIsMobileSidebarOpen(false);
                setIsIncomeModalOpen(true);
              }}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>
      )}

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Top Clean Navbar */}
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentMonthYear={currentMonthYear}
          onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
          onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Workspace View Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          {/* TAB 1: MINIMAL BENTO DASHBOARD (Core Metrics Only) */}
          {activeTab === 'home' && (
            <BentoDashboard
              categories={CATEGORIES}
              transactions={transactions}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              monthlyBudgetLimit={monthlyBudgetLimit}
              onNavigateToTxns={() => setActiveTab('txns')}
              onNavigateToCgrt={() => setActiveTab('cgrt')}
              onNavigateToRomance={() => setActiveTab('romance')}
              onNavigateToAI={() => setActiveTab('ai')}
              onNavigateToSettings={() => setActiveTab('settings')}
              onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
              onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
              onShowToast={showToast}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {/* TAB 2: ESSENTIALS & CIGARETTES SMART HUB */}
          {activeTab === 'cgrt' && (
            <div className="flex flex-col gap-4 pb-20 animate-slide-in">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white font-display">
                  Daily Essentials & Mixed Combos Hub
                </h2>
                <p className="text-xs text-zinc-400">
                  Build multi-brand combos (1 Advance + 2 Camel), calculate daily budget combinations and optimize your burn rate.
                </p>
              </div>

              <CigaretteSmartSuggestion
                onAddTransaction={handleAddTransaction}
                onShowToast={showToast}
                monthlyBudgetLimit={monthlyBudgetLimit}
                transactions={transactions}
              />
            </div>
          )}

          {/* TAB 3: ROMANCE & SOCIAL OUTINGS HUB */}
          {activeTab === 'romance' && (
            <RomanceTab
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onShowToast={showToast}
              monthlyBudgetLimit={monthlyBudgetLimit}
            />
          )}

          {/* TAB 4: TRANSACTIONS LEDGER */}
          {activeTab === 'txns' && (
            <TransactionsTab
              categories={CATEGORIES}
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
              onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {/* TAB 5: AI FINANCIAL ADVISOR */}
          {activeTab === 'ai' && (
            <AIPanel
              transactions={transactions}
              monthlyBudgetLimit={monthlyBudgetLimit}
              isFullTab={true}
            />
          )}

          {/* TAB 6: SETTINGS & BUDGETS */}
          {activeTab === 'settings' && (
            <SettingsTab
              categories={CATEGORIES}
              transactions={transactions}
              monthlyBudgetLimit={monthlyBudgetLimit}
              onUpdateMonthlyBudget={setMonthlyBudgetLimit}
              onClearAllData={handleClearAllData}
              onLoadSampleData={handleLoadSampleData}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Floating Action Button (Mobile) */}
      <FAB
        onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
        onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
      />

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        categories={CATEGORIES}
        onClose={() => setIsExpenseModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        onShowToast={showToast}
      />

      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
