'use client';

import React, { useState } from 'react';
import { Project, ChatMessage, UserProfile, ModelType, Language } from '@/lib/types';
import { 
  User, 
  Shield, 
  RefreshCw, 
  Check, 
  MessageSquare, 
  Download, 
  Trash2, 
  Sliders, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  Search,
  CheckCircle2,
  Languages,
  Globe
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';
import { TRANSLATIONS } from '@/lib/translations';

interface UserTabProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: Partial<UserProfile>) => void;
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  allChats: Record<string, ChatMessage[]>;
  onClearChatHistory: (projectId?: string) => Promise<void>;
  onForceSyncChats: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: number | null;
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAgentTab: () => void;
  language?: Language;
  onSelectLanguage?: (lang: Language) => void;
}

export function UserTab({
  userProfile,
  onUpdateUserProfile,
  projects,
  currentProjectId,
  onSelectProject,
  allChats,
  onClearChatHistory,
  onForceSyncChats,
  isSyncing,
  lastSyncedAt,
  selectedModel,
  onSelectModel,
  soundEnabled,
  onToggleSound,
  onOpenAgentTab,
  language = 'en',
  onSelectLanguage
}: UserTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'profile' | 'preferences'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [roleInput, setRoleInput] = useState(userProfile.role);
  const [confirmClearId, setConfirmClearId] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  const handleSaveProfile = () => {
    onUpdateUserProfile({
      name: nameInput.trim() || userProfile.name,
      role: roleInput.trim() || userProfile.role
    });
    setIsEditingProfile(false);
    if (soundEnabled) playVibeTone('success');
  };

  const handleExportChat = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    const messages = allChats[projectId] || [];
    const exportData = {
      project: project?.name || projectId,
      projectId,
      exportedAt: new Date().toISOString(),
      messages
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${projectId}-chat-history.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (soundEnabled) playVibeTone('success');
    setCopiedNotification(`Exported ${project?.name || projectId} chats`);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const handleExportAllChats = () => {
    const exportData = {
      user: userProfile.email,
      exportedAt: new Date().toISOString(),
      chats: allChats,
      projects: projects.map((p) => ({ id: p.id, name: p.name, description: p.description }))
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vibedcoding-all-chat-history.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (soundEnabled) playVibeTone('success');
    setCopiedNotification('Exported all conversations');
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  // Calculate total messages across all projects
  let totalServerMessages = 0;
  for (const msgs of Object.values(allChats)) {
    totalServerMessages += msgs.length;
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.max(0, Date.now() - timestamp);
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Filter projects by search query
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesName = p.name.toLowerCase().includes(q);
    const messages = allChats[p.id] || [];
    const matchesMessage = messages.some((m) => m.content.toLowerCase().includes(q));
    return matchesName || matchesMessage;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-black overflow-y-auto p-3 sm:p-4 space-y-3.5 pb-28 text-zinc-100">
      {/* User Header Profile Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl flex flex-col gap-2.5 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-800 border border-zinc-700 p-[2px] shadow-md">
                <div className="w-full h-full rounded-[10px] bg-zinc-900 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white border-2 border-black" title="Online" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] xs:max-w-[180px]">{userProfile.name}</h2>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                  {userProfile.role}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono truncate max-w-[180px] xs:max-w-none mt-0.5">
                <Shield className="w-3 h-3 text-zinc-400 shrink-0" />
                <span className="text-zinc-400">Private Workspace</span>
              </p>
            </div>
          </div>
        </div>

        {/* Server Sync Status Pill & Force Sync Bar */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] sm:text-[11px]">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSyncing ? 'bg-zinc-400 animate-pulse' : 'bg-white'}`} />
            <span className="font-mono text-zinc-300 truncate">
              {isSyncing ? 'Syncing...' : lastSyncedAt ? `Synced ${formatTimeAgo(lastSyncedAt)}` : 'Server Synced'}
            </span>
          </div>

          <button
            onClick={() => {
              onForceSyncChats();
              if (soundEnabled) playVibeTone('tap');
            }}
            disabled={isSyncing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-[11px] transition-all active:scale-95 disabled:opacity-50 shrink-0"
            title="Sync all chats with server now"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Now</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Segment Control */}
      <div className="bg-zinc-950 p-1 rounded-2xl border border-zinc-800 flex gap-1 shrink-0">
        {[
          { id: 'history', label: `${t.tabChats} (${totalServerMessages})` },
          { id: 'profile', label: t.tabProfile },
          { id: 'preferences', label: t.tabSettings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id as any);
              if (soundEnabled) playVibeTone('tap');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] sm:text-xs font-semibold text-center transition-all ${
              activeSubTab === tab.id
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Toast */}
      {copiedNotification && (
        <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-[11px] flex items-center gap-1.5 animate-in fade-in duration-200 shrink-0">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{copiedNotification}</span>
        </div>
      )}

      {/* TAB 1: SAVED CHAT HISTORY & SERVER SYNC */}
      {activeSubTab === 'history' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Controls Bar: Search & Batch Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchConversations}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-2.5 py-1.5 text-[11px] sm:text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <button
              onClick={handleExportAllChats}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-[11px] active:scale-95 transition-all shrink-0"
              title="Export all chat conversations to JSON"
            >
              <Download className="w-3 h-3 text-zinc-300" />
              <span className="hidden xs:inline">{t.exportAll}</span>
            </button>
          </div>

          {/* Chat Sessions List Grouped by Project */}
          <div className="space-y-2.5">
            {filteredProjects.length === 0 ? (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1.5">
                <MessageSquare className="w-6 h-6 text-zinc-600 mx-auto" />
                <p className="text-[11px] text-zinc-400 font-medium">No saved conversations matched your search.</p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const projectMsgs = allChats[project.id] || [];
                const lastMsg = projectMsgs[projectMsgs.length - 1];
                const isCurrent = project.id === currentProjectId;

                return (
                  <div
                    key={project.id}
                    className={`p-3 rounded-xl bg-zinc-950 border transition-all ${
                      isCurrent
                        ? 'border-zinc-600 shadow-md'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Project Header & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
                            {project.name}
                          </h3>
                          {isCurrent && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold shrink-0">
                              Active
                            </span>
                          )}
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 shrink-0 border border-zinc-800">
                            {projectMsgs.length} msgs
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">{project.description}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleExportChat(project.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Export conversation history"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setConfirmClearId(project.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Clear conversation history"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Latest Message Preview */}
                    {lastMsg && (
                      <div className="mt-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                          <span className="capitalize text-zinc-300 font-semibold">{lastMsg.role}</span>
                          <span>{formatTimeAgo(lastMsg.timestamp)}</span>
                        </div>
                        <p className="text-zinc-300 line-clamp-2 leading-relaxed">
                          {lastMsg.content}
                        </p>
                      </div>
                    )}

                    {/* Open in Chat Button */}
                    <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-zinc-400 shrink-0" /> Synced
                      </span>
                      <button
                        onClick={() => {
                          onSelectProject(project.id);
                          onOpenAgentTab();
                          if (soundEnabled) playVibeTone('tap');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-[11px] font-semibold text-zinc-200 border border-zinc-700 transition-colors group shrink-0"
                      >
                        <span>Open Chat</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    {/* Clear Confirmation Modal Inline */}
                    {confirmClearId === project.id && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 space-y-2 animate-in fade-in duration-150">
                        <p className="text-[11px] text-zinc-200 font-medium">
                          Clear {projectMsgs.length} messages for {project.name}?
                        </p>
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => setConfirmClearId(null)}
                            className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-[10px] font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              await onClearChatHistory(project.id);
                              setConfirmClearId(null);
                              if (soundEnabled) playVibeTone('tap');
                            }}
                            className="px-2 py-1 rounded-lg bg-white hover:bg-zinc-200 text-black text-[10px] font-bold"
                          >
                            Confirm Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: USER PROFILE & IDENTITY */}
      {activeSubTab === 'profile' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="p-3 sm:p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-zinc-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                USER PROFILE
              </span>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-[11px] font-semibold text-zinc-300 hover:text-white"
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditingProfile ? (
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">Display Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">Developer Role</label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 active:scale-95 transition-all"
                >
                  Save Profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">Privacy Status</span>
                  <span className="text-[11px] font-bold text-white font-mono truncate block">
                    Protected & Private
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">Developer Role</span>
                  <span className="text-[11px] font-bold text-zinc-200 truncate block">{userProfile.role}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">Total Prompts</span>
                  <span className="text-[11px] font-bold text-white font-mono block">{userProfile.totalPromptsSent} Prompts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">Total Files</span>
                  <span className="text-[11px] font-bold text-white font-mono block">{userProfile.totalFilesGenerated} Files</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VIBE PREFERENCES & SYSTEM SETTINGS */}
      {activeSubTab === 'preferences' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Language Selection Card */}
          <div className="p-3 sm:p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <span className="text-[11px] font-mono font-bold text-zinc-200 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-zinc-400" />
              {t.languageSetting}
            </span>

            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-300 font-medium block">
                {t.changeLanguage}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectLanguage) onSelectLanguage('en');
                    if (soundEnabled) playVibeTone('tap');
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    language === 'en'
                      ? 'bg-zinc-800 border-zinc-600 text-white font-semibold shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{t.languageEn}</span>
                    {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">Default (US / Global)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectLanguage) onSelectLanguage('id');
                    if (soundEnabled) playVibeTone('tap');
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    language === 'id'
                      ? 'bg-zinc-800 border-zinc-600 text-white font-semibold shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{t.languageId}</span>
                    {language === 'id' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">Bahasa Indonesia</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <span className="text-[11px] font-mono font-bold text-zinc-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              DEFAULT AGENT BRAIN & AUDIO
            </span>

            {/* Model Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-300 font-medium block">Default AI Model</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', desc: 'Reasoning & speed' },
                  { id: 'gemini-3.7-flash-fast', name: '3.7 Flash Fast', desc: 'Low-latency code' },
                  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', desc: 'Deep surgical logic' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id as ModelType);
                      if (soundEnabled) playVibeTone('tap');
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedModel === m.id
                        ? 'bg-zinc-800 border-zinc-600 text-white font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{m.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound FX Setting */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-white block">8-Bit Audio Synth</span>
                <span className="text-[10px] text-zinc-400 block leading-tight">Responsive audio feedback on clicks and code operations</span>
              </div>
              <button
                onClick={onToggleSound}
                className={`p-2 rounded-xl border transition-all shrink-0 ${
                  soundEnabled
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
