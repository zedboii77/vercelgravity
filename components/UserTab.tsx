'use client';

import React, { useState } from 'react';
import { Project, ChatMessage, UserProfile, ModelType } from '@/lib/types';
import { 
  User, 
  Mail, 
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
  CheckCircle2
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';

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
  onOpenAgentTab
}: UserTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'profile' | 'preferences'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [roleInput, setRoleInput] = useState(userProfile.role);
  const [confirmClearId, setConfirmClearId] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

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
    downloadAnchor.setAttribute('download', `antigravity-all-chat-history.json`);
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
    <div className="flex-1 flex flex-col h-full bg-[#070a14] overflow-y-auto p-2.5 sm:p-4 space-y-3 pb-24 text-slate-100">
      {/* User Header Profile Card */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1428] to-[#121c3b] border border-slate-800 shadow-xl flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[2px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-cyan-300 font-bold text-sm sm:text-base">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" title="Online" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] xs:max-w-[180px]">{userProfile.name}</h2>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  {userProfile.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono truncate max-w-[180px] xs:max-w-none mt-0.5">
                <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">{userProfile.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Server Sync Status Pill & Force Sync Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] sm:text-[11px]">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="font-mono text-slate-300 truncate">
              {isSyncing ? 'Syncing...' : lastSyncedAt ? `Synced ${formatTimeAgo(lastSyncedAt)}` : 'Server Synced'}
            </span>
          </div>

          <button
            onClick={() => {
              onForceSyncChats();
              if (soundEnabled) playVibeTone('tap');
            }}
            disabled={isSyncing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px] transition-all active:scale-95 disabled:opacity-50 shrink-0"
            title="Sync all chats with server now"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Now</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800">
        {[
          { id: 'history', label: `💬 Chats (${totalServerMessages})` },
          { id: 'profile', label: '👤 Profile' },
          { id: 'preferences', label: '⚙️ Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id as any);
              if (soundEnabled) playVibeTone('tap');
            }}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
              activeSubTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Toast */}
      {copiedNotification && (
        <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1.5 animate-in fade-in duration-200">
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
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-[#0c1122] border border-slate-800 rounded-xl pl-8 pr-2.5 py-1.5 text-[11px] sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              onClick={handleExportAllChats}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-[11px] active:scale-95 transition-all shrink-0"
              title="Export all chat conversations to JSON"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span className="hidden xs:inline">Export All</span>
            </button>
          </div>

          {/* Chat Sessions List Grouped by Project */}
          <div className="space-y-2.5">
            {filteredProjects.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0c1122] border border-slate-800 text-center space-y-1.5">
                <MessageSquare className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-[11px] text-slate-400 font-medium">No saved conversations matched your search.</p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const projectMsgs = allChats[project.id] || [];
                const lastMsg = projectMsgs[projectMsgs.length - 1];
                const isCurrent = project.id === currentProjectId;

                return (
                  <div
                    key={project.id}
                    className={`p-3 rounded-xl bg-[#0c1122] border transition-all ${
                      isCurrent
                        ? 'border-cyan-500/50 shadow-md shadow-cyan-500/5'
                        : 'border-slate-800 hover:border-slate-700'
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
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold shrink-0">
                              Active
                            </span>
                          )}
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 shrink-0">
                            {projectMsgs.length} msgs
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{project.description}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleExportChat(project.id)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                          title="Export conversation history"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setConfirmClearId(project.id)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Clear conversation history"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Latest Message Preview */}
                    {lastMsg && (
                      <div className="mt-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                          <span className="capitalize text-cyan-400 font-semibold">{lastMsg.role}</span>
                          <span>{formatTimeAgo(lastMsg.timestamp)}</span>
                        </div>
                        <p className="text-slate-300 line-clamp-2 leading-relaxed">
                          {lastMsg.content}
                        </p>
                      </div>
                    )}

                    {/* Open in Chat Button */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Synced
                      </span>
                      <button
                        onClick={() => {
                          onSelectProject(project.id);
                          onOpenAgentTab();
                          if (soundEnabled) playVibeTone('tap');
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-[11px] font-semibold text-cyan-300 border border-cyan-500/20 transition-colors group shrink-0"
                      >
                        <span>Open Chat</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    {/* Clear Confirmation Modal Inline */}
                    {confirmClearId === project.id && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-2 animate-in fade-in duration-150">
                        <p className="text-[11px] text-rose-200 font-medium">
                          Clear {projectMsgs.length} messages for {project.name}?
                        </p>
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => setConfirmClearId(null)}
                            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              await onClearChatHistory(project.id);
                              setConfirmClearId(null);
                              if (soundEnabled) playVibeTone('tap');
                            }}
                            className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
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
          <div className="p-3 sm:p-4 rounded-xl bg-[#0c1122] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                USER PROFILE
              </span>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditingProfile ? (
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Display Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Developer Role</label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs active:scale-95 transition-all"
                >
                  Save Profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Account Email</span>
                  <span className="text-[11px] font-bold text-white font-mono truncate block" title={userProfile.email}>
                    {userProfile.email}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Developer Role</span>
                  <span className="text-[11px] font-bold text-cyan-300 truncate block">{userProfile.role}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Total Prompts</span>
                  <span className="text-[11px] font-bold text-emerald-400 font-mono block">{userProfile.totalPromptsSent} Prompts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Total Files</span>
                  <span className="text-[11px] font-bold text-purple-400 font-mono block">{userProfile.totalFilesGenerated} Files</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VIBE PREFERENCES & SYSTEM SETTINGS */}
      {activeSubTab === 'preferences' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="p-3 sm:p-4 rounded-xl bg-[#0c1122] border border-slate-800 space-y-3">
            <span className="text-[11px] font-mono font-bold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              DEFAULT AGENT BRAIN & AUDIO
            </span>

            {/* Model Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-300 font-medium block">Default AI Model</label>
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
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{m.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound FX Setting */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-white block">8-Bit Audio Synth</span>
                <span className="text-[10px] text-slate-400 block leading-tight">Responsive audio feedback on clicks and code operations</span>
              </div>
              <button
                onClick={onToggleSound}
                className={`p-2 rounded-xl border transition-all shrink-0 ${
                  soundEnabled
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
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
