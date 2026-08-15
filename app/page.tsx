'use client';

import React, { useState, useEffect } from 'react';
import { Project, ChatMessage, ModelType, ToolCallData, VibeStyle } from '@/lib/types';
import { STARTER_PROJECTS } from '@/lib/templates';
import { Header } from '@/components/Header';
import { BottomNav, TabType } from '@/components/BottomNav';
import { VibeInput } from '@/components/VibeInput';
import { AgentFeed } from '@/components/AgentFeed';
import { MobileCodeEditor } from '@/components/MobileCodeEditor';
import { LivePreview } from '@/components/LivePreview';
import { TerminalRunner } from '@/components/TerminalRunner';
import { VPSHub } from '@/components/VPSHub';
import { NewProjectModal } from '@/components/NewProjectModal';
import { playVibeTone } from '@/lib/audio';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(STARTER_PROJECTS);
  const [currentProjectId, setCurrentProjectId] = useState<string>(STARTER_PROJECTS[0].id);
  const [activeTab, setActiveTab] = useState<TabType>('agent');
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-3.7-flash');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isVPSModalOpen, setIsVPSModalOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'vibe-racer': [
      {
        id: 'msg-init-1',
        role: 'agent',
        content: "👋 Welcome to Antigravity 2.0 Mobile Vibe Coder! I've loaded your Neon Cyber Racer project. Tap the live preview to test the synthwave drift, or tell me what features to code next!",
        timestamp: 1723750000000,
        modelUsed: 'gemini-3.7-flash',
        thinking: 'Initialized mobile workspace with HTML5 canvas game loop, Web Audio synthesizer, and touch controls.'
      }
    ],
    'vibe-ideas': [
      {
        id: 'msg-init-2',
        role: 'agent',
        content: "⚡ Idea Matrix is ready for phone vibe coding. You can dictate notes via voice, tag vibes, or ask me to add markdown sync and cloud export.",
        timestamp: 1723750000000,
        modelUsed: 'gemini-3.7-flash'
      }
    ]
  });

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Save projects to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('antigravity_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const saveProjectsState = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    try {
      localStorage.setItem('antigravity_projects', JSON.stringify(updatedProjects));
    } catch (e) {}
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
    setMessages((prev) => ({
      ...prev,
      [currentProjectId]: [...currentProjectMessages, userMessage]
    }));

    setIsLoading(true);

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

      setMessages((prev) => ({
        ...prev,
        [currentProjectId]: [...(prev[currentProjectId] || []), agentMessage]
      }));

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
      setMessages((prev) => ({
        ...prev,
        [currentProjectId]: [...(prev[currentProjectId] || []), errorMessage]
      }));
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

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070a14] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={(id) => setCurrentProjectId(id)}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onOpenVPSModal={() => setActiveTab('vps')}
        selectedModel={selectedModel}
        onSelectModel={(m) => setSelectedModel(m)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
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

        {/* Tab 4: VPS Terminal */}
        {activeTab === 'terminal' && (
          <TerminalRunner project={currentProject} soundEnabled={soundEnabled} />
        )}

        {/* Tab 5: VPS Deploy Hub */}
        {activeTab === 'vps' && (
          <VPSHub
            project={currentProject}
            onUpdateEnvVars={(envVars) => {
              const updatedProject = { ...currentProject, envVars };
              saveProjectsState(
                projects.map((p) => (p.id === currentProjectId ? updatedProject : p))
              );
            }}
            soundEnabled={soundEnabled}
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
