'use client';

import React from 'react';
import { Project, ModelType, Language } from '@/lib/types';
import { 
  Sparkles, 
  ChevronDown, 
  Plus, 
  User, 
  Cpu,
  Languages
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';
import { TRANSLATIONS } from '@/lib/translations';

interface HeaderProps {
  currentProject: Project;
  projects: Project[];
  onSelectProject: (id: string) => void;
  onOpenNewProjectModal: () => void;
  onOpenUserTab: () => void;
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export function Header({
  currentProject,
  projects,
  onSelectProject,
  onOpenNewProjectModal,
  onOpenUserTab,
  selectedModel,
  onSelectModel,
  soundEnabled,
  onToggleSound,
  language,
  onToggleLanguage
}: HeaderProps) {
  const [showProjectMenu, setShowProjectMenu] = React.useState(false);
  const [showModelMenu, setShowModelMenu] = React.useState(false);
  const t = TRANSLATIONS[language];

  const modelLabels: Record<ModelType, { label: string; badge: string; color: string }> = {
    'gemini-3.7-flash': { label: 'Gemini 3.7 Flash', badge: 'Thinking', color: 'text-zinc-200 bg-zinc-800/80 border-zinc-700' },
    'gemini-3.7-flash-fast': { label: '3.7 Flash Speed', badge: 'Turbo', color: 'text-zinc-300 bg-zinc-800/80 border-zinc-700' },
    'gemini-3.1-pro-preview': { label: 'Gemini 3.1 Pro', badge: 'Reasoning', color: 'text-zinc-100 bg-zinc-800/90 border-zinc-600' },
  };

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-800 px-2.5 sm:px-3 py-2 flex items-center justify-between gap-1.5 sm:gap-2 select-none">
      {/* Brand & Project Selector */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-800 border border-zinc-700 p-[1px] shrink-0 shadow-md">
          <div className="w-full h-full bg-black rounded-[9px] sm:rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
        </div>

        {/* Project Switcher Dropdown */}
        <div className="relative min-w-0">
          <button
            onClick={() => {
              setShowProjectMenu(!showProjectMenu);
              setShowModelMenu(false);
              if (soundEnabled) playVibeTone('tap');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-left transition-all max-w-[145px] xs:max-w-[170px] sm:max-w-[220px]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-zinc-100 truncate block">
                  {currentProject.name}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
              </div>
              <span className="text-[10px] text-zinc-400 font-mono block truncate">
                {t.modelTag}
              </span>
            </div>
          </button>

          {showProjectMenu && (
            <div className="absolute left-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Projects</span>
                <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">{projects.length}</span>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1 my-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      setShowProjectMenu(false);
                      if (soundEnabled) playVibeTone('tap');
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      p.id === currentProject.id
                        ? 'bg-zinc-800 text-white font-semibold border border-zinc-600'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate">{p.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{p.template}</div>
                    </div>
                    {p.id === currentProject.id && (
                      <span className="w-2 h-2 rounded-full bg-white shrink-0"></span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowProjectMenu(false);
                  onOpenNewProjectModal();
                  if (soundEnabled) playVibeTone('tap');
                }}
                className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.newProject}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Language Button, Model Switcher & User Hub */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Language Switch Button */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold active:scale-95 transition-all shadow-sm"
          title={language === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
        >
          <Languages className="w-3.5 h-3.5 text-zinc-300" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
            {language === 'en' ? 'EN' : 'ID'}
          </span>
        </button>

        {/* Model Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowModelMenu(!showModelMenu);
              setShowProjectMenu(false);
              if (soundEnabled) playVibeTone('tap');
            }}
            className={`hidden xs:flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-mono font-medium border ${modelLabels[selectedModel].color} transition-all`}
          >
            <Cpu className="w-3 h-3 text-zinc-300" />
            <span className="hidden sm:inline">{modelLabels[selectedModel].label}</span>
            <span className="sm:hidden">{modelLabels[selectedModel].badge}</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-70" />
          </button>

          {showModelMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase font-mono">
                Agent Brain
              </div>
              <div className="space-y-1 mt-1">
                {(Object.keys(modelLabels) as ModelType[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      onSelectModel(m);
                      setShowModelMenu(false);
                      if (soundEnabled) playVibeTone('tap');
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex flex-col gap-0.5 ${
                      m === selectedModel
                        ? 'bg-zinc-800 text-white font-semibold border border-zinc-600'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{modelLabels[m].label}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {modelLabels[m].badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Hub & Profile Button */}
        <button
          onClick={() => {
            onOpenUserTab();
            if (soundEnabled) playVibeTone('tap');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold transition-all active:scale-95 shadow-sm"
          title="User Profile & Synced Chat History"
        >
          <User className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">{t.navUserHub}</span>
        </button>
      </div>
    </header>
  );
}
