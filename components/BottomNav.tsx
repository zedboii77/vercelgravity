'use client';

import React from 'react';
import { 
  MessageSquareCode, 
  Code2, 
  Eye, 
  User
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';

export type TabType = 'agent' | 'editor' | 'preview' | 'user';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingChangesCount?: number;
  isRunning?: boolean;
  soundEnabled: boolean;
}

export function BottomNav({
  activeTab,
  onSelectTab,
  pendingChangesCount = 0,
  isRunning = false,
  soundEnabled
}: BottomNavProps) {
  const tabs = [
    {
      id: 'agent' as TabType,
      label: 'Agent 2.0',
      icon: MessageSquareCode,
      badge: pendingChangesCount > 0 ? `${pendingChangesCount}` : null,
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'editor' as TabType,
      label: 'Editor',
      icon: Code2,
      badge: null
    },
    {
      id: 'preview' as TabType,
      label: 'Live Preview',
      icon: Eye,
      badge: isRunning ? 'Live' : null,
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 'user' as TabType,
      label: 'User Hub',
      icon: User,
      badge: null,
      badgeColor: 'bg-cyan-600'
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#090d16]/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around select-none shadow-2xl shadow-black">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              onSelectTab(tab.id);
              if (soundEnabled) playVibeTone('tap');
            }}
            className={`relative flex-1 py-1 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-150 ${
              isActive
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <div
                className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20'
                    : 'bg-transparent text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {tab.badge && (
                <span
                  className={`absolute -top-1 -right-1.5 px-1 py-0.2 min-w-4 text-[9px] font-bold text-white rounded-full flex items-center justify-center ${
                    tab.badgeColor || 'bg-cyan-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            <span className="text-[10px] tracking-tight whitespace-nowrap">
              {tab.label}
            </span>

            {isActive && (
              <span className="absolute bottom-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
