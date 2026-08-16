'use client';

import React from 'react';
import { 
  MessageSquareCode, 
  Code2, 
  Eye, 
  User
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';
import { Language } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

export type TabType = 'agent' | 'editor' | 'preview' | 'user';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingChangesCount?: number;
  isRunning?: boolean;
  soundEnabled: boolean;
  language?: Language;
}

export function BottomNav({
  activeTab,
  onSelectTab,
  pendingChangesCount = 0,
  isRunning = false,
  soundEnabled,
  language = 'en'
}: BottomNavProps) {
  const t = TRANSLATIONS[language];

  const tabs = [
    {
      id: 'agent' as TabType,
      label: t.navAgent,
      icon: MessageSquareCode,
      badge: pendingChangesCount > 0 ? `${pendingChangesCount}` : null,
      badgeColor: 'bg-white text-black'
    },
    {
      id: 'editor' as TabType,
      label: t.navEditor,
      icon: Code2,
      badge: null
    },
    {
      id: 'preview' as TabType,
      label: t.navPreview,
      icon: Eye,
      badge: isRunning ? 'Live' : null,
      badgeColor: 'bg-zinc-800 text-zinc-200 border border-zinc-700'
    },
    {
      id: 'user' as TabType,
      label: t.navUserHub,
      icon: User,
      badge: null,
      badgeColor: 'bg-zinc-800 text-zinc-300'
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-2xl border-t border-zinc-800 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around select-none shadow-2xl shadow-black">
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
                ? 'text-white font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className="relative">
              <div
                className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                    : 'bg-transparent text-zinc-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {tab.badge && (
                <span
                  className={`absolute -top-1 -right-1.5 px-1 py-0.2 min-w-4 text-[9px] font-mono font-bold rounded-full flex items-center justify-center shadow-sm ${
                    tab.badgeColor || 'bg-white text-black'
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
              <span className="absolute bottom-0 w-8 h-[2px] bg-white rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
