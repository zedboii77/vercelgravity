'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Project, ChatMessage, ModelType, ToolCallData, VibeStyle, UserProfile } from '@/lib/types';
import { STARTER_PROJECTS } from '@/lib/templates';
import { Header } from '@/components/Header';
import { BottomNav, TabType } from '@/components/BottomNav';
import { VibeInput } from '@/components/VibeInput';
import { AgentFeed } from '@/components/AgentFeed';
import { MobileCodeEditor } from '@/components/MobileCodeEditor';
import { LivePreview } from '@/components/LivePreview';
import { UserTab } from '@/components/UserTab';
import { NewProjectModal } from '@/components/NewProjectModal';
import { playVibeTone } from '@/lib/audio';

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'vibe-racer': [
    {
      id: 'msg-init-1',
      role: 'agent',
      content: "👋 Welcome to Antigravity 2.0 Mobile Vibe Coder! I've loaded your Neon Cyber Racer project. Tap the live preview to test the game, edit files directly, or ask me for new features.",
      timestamp: 1723750000000,
      modelUsed: 'gemini-3.7-flash',
      thinking: 'Initialized mobile workspace with HTML5 canvas game loop, Web Audio synthesizer, and touch controls.'
    }
  ],
  'vibe-ideas': [
    {
      id: 'msg-init-2',
      role: 'agent',
      content: "⚡ Idea Matrix is ready for phone vibe coding. You can dictate notes via voice, organize tags, or ask me to add features.",
      timestamp: 1723750000000,
      modelUsed: 'gemini-3.7-flash'
    }
  ]
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(STARTER_PROJECTS);
  const [currentProjectId, setCurrentProjectId] = useState<string>(STARTER_PROJECTS[0].id);
  const [activeTab, setActiveTab] = useState<TabType>('agent');
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-3.7-flash');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Mobile Vibe Coder',
    email: 'zedboii77@gmail.com',
    role: 'Full-Stack Creator',
    vibeStyle: 'builder',
    soundEnabled: true,
    totalPromptsSent: 14,
    totalFilesGenerated: 28,
    joinedAt: 1723750000000,
    lastActiveAt: Date.now()
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Helper to sync chat state to the server
  const syncChatsToServer = useCallback(async (allChatsPayload: Record<string, ChatMessage[]>) => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allChats: allChatsPayload })
      });
      const data = await res.json();
      if (data.success) {
        setLastSyncedAt(data.lastSyncedAt || Date.now());
      }
    } catch (err) {
      console.warn('Background server chat sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initial Load: Fetch Projects, Synced Chats, and User Profile from Server & Local Storage
  useEffect(() => {
    // 1. Load Local Projects
    try {
      const savedProjects = localStorage.getItem('antigravity_projects');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        }
      }
    } catch (e) {}

    // 2. Fetch server-synced chats
    const loadServerData = async () => {
      try {
        setIsSyncing(true);
        // Load chats
        const chatRes = await fetch('/api/chats');
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          if (chatData.chats && Object.keys(chatData.chats).length > 0) {
            setMessages(chatData.chats);
            setLastSyncedAt(chatData.lastSyncedAt || Date.now());
          } else {
            // Check local fallback
            const localChats = localStorage.getItem('antigravity_chats');
            if (localChats) {
              const parsed = JSON.parse(localChats);
              setMessages(parsed);
              syncChatsToServer(parsed);
            }
          }
        }

        // Load user profile
        const userRes = await fetch('/api/user');
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.user) {
            setUserProfile((prev) => ({ ...prev, ...userData.user }));
            setSoundEnabled(userData.user.soundEnabled ?? true);
          }
        }
      } catch (err) {
        console.warn('Initial server sync warning:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    loadServerData();
  }, [syncChatsToServer]);

  // Persist projects state
  const saveProjectsState = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    try {
      localStorage.setItem('antigravity_projects', JSON.stringify(updatedProjects));
    } catch (e) {}
  };

  // Persist and sync chat messages
  const updateAndSyncMessages = (updatedMessages: Record<string, ChatMessage[]>) => {
    setMessages(updatedMessages);
    try {
      localStorage.setItem('antigravity_chats', JSON.stringify(updatedMessages));
    } catch (e) {}
    syncChatsToServer(updatedMessages);
  };

  // Update user profile
  const handleUpdateUserProfile = async (partial: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...partial };
    setUserProfile(updated);
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial)
      });
    } catch (e) {}
  };

  // Force manual sync
  const handleForceSyncChats = async () => {
    await syncChatsToServer(messages);
  };

  // Clear chat history on server and locally
  const handleClearChatHistory = async (projectId?: string) => {
    try {
      setIsSyncing(true);
      const url = projectId ? `/api/chats?projectId=${encodeURIComponent(projectId)}` : '/api/chats';
      await fetch(url, { method: 'DELETE' });

      if (projectId) {
        const updated = { ...messages, [projectId]: [] };
        setMessages(updated);
        try {
          localStorage.setItem('antigravity_chats', JSON.stringify(updated));
        } catch (e) {}
      } else {
        setMessages({});
        try {
          localStorage.removeItem('antigravity_chats');
        } catch (e) {}
      }
      setLastSyncedAt(Date.now());
    } catch (err) {
      console.error('Failed to clear chat history', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle agent prompt send
  const handleSendMessage = async (
    promptText: string,
    attachedImages?: string[],
    vibeStyle?: VibeStyle
  ) => {
    if (!promptText && (!attachedImages || attachedImages.length === 0)) return;

    const userMessageId = `usr-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
      attachedImages: attachedImages || [],
      vibeStyle: vibeStyle || 'builder'
    };

    const currentProjectMessages = messages[currentProjectId] || [];
    const updatedChatsWithUser = {
      ...messages,
      [currentProjectId]: [...currentProjectMessages, userMessage]
    };

    setMessages(updatedChatsWithUser);
    setIsLoading(true);

    // Increment prompt count
    const updatedPromptCount = userProfile.totalPromptsSent + 1;
    handleUpdateUserProfile({ totalPromptsSent: updatedPromptCount });

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          model: selectedModel,
          files: currentProject.files,
          attachedImages: attachedImages || [],
          thinking: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to communicate with Antigravity 2.0 backend');
      }

      const agentMessageId = `agt-${Date.now()}`;
      const agentMessage: ChatMessage = {
        id: agentMessageId,
        role: 'agent',
        content: data.explanation || 'Updated your project files according to your vibe prompt.',
        timestamp: Date.now(),
        thinking: data.thoughts,
        toolCalls: data.toolCalls || [],
        modelUsed: data.modelUsed || selectedModel
      };

      const finalUpdatedChats = {
        ...updatedChatsWithUser,
        [currentProjectId]: [...(updatedChatsWithUser[currentProjectId] || []), agentMessage]
      };

      updateAndSyncMessages(finalUpdatedChats);

      // Automatically apply tool calls to project files
      if (data.toolCalls && data.toolCalls.length > 0) {
        applyToolCalls(data.toolCalls);
      }

      if (soundEnabled) playVibeTone('success');
    } catch (err: any) {
      console.error('Agent message failed', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'agent',
        content: `⚠️ Error: ${err.message || 'Could not connect to Antigravity 2.0 runtime. Please verify API key.'}`,
        timestamp: Date.now()
      };
      const finalUpdatedChats = {
        ...updatedChatsWithUser,
        [currentProjectId]: [...(updatedChatsWithUser[currentProjectId] || []), errorMessage]
      };
      updateAndSyncMessages(finalUpdatedChats);
      if (soundEnabled) playVibeTone('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply tool modifications directly to project state
  const applyToolCalls = (toolCalls: ToolCallData[]) => {
    const updatedFiles = { ...currentProject.files };

    for (const tc of toolCalls) {
      if (tc.targetPath && tc.content) {
        const ext = tc.targetPath.split('.').pop() || 'txt';
        const langMap: Record<string, string> = {
          html: 'html',
          js: 'javascript',
          ts: 'typescript',
          json: 'json',
          css: 'css',
          md: 'markdown'
        };

        updatedFiles[tc.targetPath] = {
          path: tc.targetPath,
          content: tc.content,
          language: langMap[ext] || 'text',
          updatedAt: Date.now()
        };
      }
    }

    const updatedProject: Project = {
      ...currentProject,
      files: updatedFiles,
      updatedAt: Date.now()
    };

    const newProjects = projects.map((p) => (p.id === currentProjectId ? updatedProject : p));
    saveProjectsState(newProjects);
  };

  const handleUpdateFile = (path: string, content: string) => {
    const updatedFiles = {
      ...currentProject.files,
      [path]: {
        ...currentProject.files[path],
        content,
        updatedAt: Date.now()
      }
    };

    const updatedProject: Project = {
      ...currentProject,
      files: updatedFiles,
      updatedAt: Date.now()
    };

    const newProjects = projects.map((p) => (p.id === currentProjectId ? updatedProject : p));
    saveProjectsState(newProjects);
  };

  const handleCreateFile = (path: string) => {
    const ext = path.split('.').pop() || 'txt';
    const langMap: Record<string, string> = {
      html: 'html',
      js: 'javascript',
      ts: 'typescript',
      json: 'json',
      css: 'css',
      md: 'markdown'
    };

    const updatedFiles = {
      ...currentProject.files,
      [path]: {
        path,
        content: `// ${path}\n`,
        language: langMap[ext] || 'text',
        updatedAt: Date.now()
      }
    };

    const updatedProject: Project = {
      ...currentProject,
      files: updatedFiles,
      activeFilePath: path,
      updatedAt: Date.now()
    };

    const newProjects = projects.map((p) => (p.id === currentProjectId ? updatedProject : p));
    saveProjectsState(newProjects);
  };

  const handleDeleteFile = (path: string) => {
    const updatedFiles = { ...currentProject.files };
    delete updatedFiles[path];

    const firstRemaining = Object.keys(updatedFiles)[0] || 'index.html';

    const updatedProject: Project = {
      ...currentProject,
      files: updatedFiles,
      activeFilePath: firstRemaining,
      updatedAt: Date.now()
    };

    const newProjects = projects.map((p) => (p.id === currentProjectId ? updatedProject : p));
    saveProjectsState(newProjects);
  };

  const handleSelectActiveFile = (path: string) => {
    const updatedProject: Project = {
      ...currentProject,
      activeFilePath: path
    };
    const newProjects = projects.map((p) => (p.id === currentProjectId ? updatedProject : p));
    saveProjectsState(newProjects);
  };

  const handleCreateProject = (newProject: Project) => {
    const newProjects = [newProject, ...projects];
    saveProjectsState(newProjects);
    setCurrentProjectId(newProject.id);
    setActiveTab('agent');
  };

  const handleAskAgentForFile = (filePath: string, promptText: string) => {
    setActiveTab('agent');
    handleSendMessage(`In file ${filePath}: ${promptText}`);
  };

  const handleToggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    handleUpdateUserProfile({ soundEnabled: nextSound });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070a14] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={(id) => setCurrentProjectId(id)}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onOpenUserTab={() => setActiveTab('user')}
        selectedModel={selectedModel}
        onSelectModel={(m) => setSelectedModel(m)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Tab Content */}
      <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {/* Tab 1: Vibe Agent Chat */}
        {activeTab === 'agent' && (
          <div className="flex-1 flex flex-col min-h-0">
            <AgentFeed
              messages={messages[currentProjectId] || []}
              onApplyToolCalls={applyToolCalls}
              onOpenEditorForFile={(file) => {
                handleSelectActiveFile(file);
                setActiveTab('editor');
                if (soundEnabled) playVibeTone('tap');
              }}
              onOpenPreview={() => {
                setActiveTab('preview');
                if (soundEnabled) playVibeTone('tap');
              }}
              isLoading={isLoading}
              soundEnabled={soundEnabled}
            />
            <VibeInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {/* Tab 2: Mobile Code Editor */}
        {activeTab === 'editor' && (
          <MobileCodeEditor
            project={currentProject}
            onUpdateFile={handleUpdateFile}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onSelectActiveFile={handleSelectActiveFile}
            onAskAgentForFile={handleAskAgentForFile}
            onOpenPreview={() => {
              setActiveTab('preview');
              if (soundEnabled) playVibeTone('tap');
            }}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Tab 3: Live Preview Sandbox */}
        {activeTab === 'preview' && (
          <LivePreview project={currentProject} soundEnabled={soundEnabled} />
        )}

        {/* Tab 4: User Hub & Synced Chat History */}
        {activeTab === 'user' && (
          <UserTab
            userProfile={userProfile}
            onUpdateUserProfile={handleUpdateUserProfile}
            projects={projects}
            currentProjectId={currentProjectId}
            onSelectProject={(id) => setCurrentProjectId(id)}
            allChats={messages}
            onClearChatHistory={handleClearChatHistory}
            onForceSyncChats={handleForceSyncChats}
            isSyncing={isSyncing}
            lastSyncedAt={lastSyncedAt}
            selectedModel={selectedModel}
            onSelectModel={(m) => setSelectedModel(m)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenAgentTab={() => setActiveTab('agent')}
          />
        )}
      </main>

      {/* Bottom Thumb Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isRunning={true}
        soundEnabled={soundEnabled}
      />

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
