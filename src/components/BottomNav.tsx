import React from 'react';
import { LayoutGrid, Flame, Heart, Receipt, Bot, Settings } from 'lucide-react';

export type NavTab = 'home' | 'cgrt' | 'romance' | 'txns' | 'ai' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadAiBadge?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadAiBadge,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Overview', icon: LayoutGrid },
    { id: 'cgrt' as NavTab, label: 'Essentials', icon: Flame },
    { id: 'romance' as NavTab, label: 'Romance', icon: Heart },
    { id: 'txns' as NavTab, label: 'Ledger', icon: Receipt },
    { id: 'ai' as NavTab, label: 'Advisor', icon: Bot, badge: unreadAiBadge },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-[#0F1016]/95 backdrop-blur-xl border-t border-white/[0.08] shadow-2xl px-2 py-2 flex items-center justify-around select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              isActive
                ? 'text-emerald-400 font-bold'
                : 'text-zinc-400 font-medium hover:text-white'
            }`}
          >
            {isActive && (
              <span className="absolute inset-0 bg-emerald-500/15 rounded-xl border border-emerald-500/30 -z-10 animate-slide-in" />
            )}

            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4] text-emerald-400' : 'stroke-[1.8]'}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0F1016] animate-pulse" />
              )}
            </div>

            <span className="text-[10px] tracking-tight mt-1 font-mono-nums">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
