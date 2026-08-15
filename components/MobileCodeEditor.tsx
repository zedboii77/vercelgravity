'use client';

import React, { useState, useRef } from 'react';
import { Project, ProjectFile } from '@/lib/types';
import { 
  FileCode, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  Folder, 
  FilePlus, 
  Check, 
  Copy, 
  Play, 
  ChevronRight, 
  ChevronDown,
  Undo,
  Redo,
  CornerDownLeft,
  X
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';

interface MobileCodeEditorProps {
  project: Project;
  onUpdateFile: (path: string, content: string) => void;
  onCreateFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
  onSelectActiveFile: (path: string) => void;
  onAskAgentForFile: (path: string, prompt: string) => void;
  onOpenPreview: () => void;
  soundEnabled: boolean;
}

export function MobileCodeEditor({
  project,
  onUpdateFile,
  onCreateFile,
  onDeleteFile,
  onSelectActiveFile,
  onAskAgentForFile,
  onOpenPreview,
  soundEnabled
}: MobileCodeEditorProps) {
  const [activeFile, setActiveFile] = useState<string>(project.activeFilePath || Object.keys(project.files)[0] || 'index.html');
  const [content, setContent] = useState<string>(project.files[activeFile]?.content || '');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [quickPromptText, setQuickPromptText] = useState('');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync if project changes
  React.useEffect(() => {
    if (project.files[activeFile]) {
      setContent(project.files[activeFile].content);
      setIsSaved(true);
    } else {
      const firstKey = Object.keys(project.files)[0];
      if (firstKey) {
        setActiveFile(firstKey);
        setContent(project.files[firstKey].content);
      }
    }
  }, [project, activeFile]);

  const handleSelectFile = (path: string) => {
    setActiveFile(path);
    onSelectActiveFile(path);
    setContent(project.files[path]?.content || '');
    setIsDrawerOpen(false);
    setIsSaved(true);
    if (soundEnabled) playVibeTone('tap');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    onUpdateFile(activeFile, content);
    setIsSaved(true);
    if (soundEnabled) playVibeTone('success');
  };

  const handleInsertSymbol = (symbol: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newContent = content.substring(0, start) + symbol + content.substring(end);
    setContent(newContent);
    setIsSaved(false);
    if (soundEnabled) playVibeTone('code');

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start + symbol.length;
        textareaRef.current.selectionEnd = start + symbol.length;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleCreateNewFile = () => {
    if (!newFileName.trim()) return;
    const cleanPath = newFileName.trim();
    onCreateFile(cleanPath);
    setActiveFile(cleanPath);
    setNewFileName('');
    setIsCreatingFile(false);
    setIsDrawerOpen(false);
    if (soundEnabled) playVibeTone('success');
  };

  const accessoryKeys = [
    '{', '}', '(', ')', '[', ']', '=>', '=', ';', ':', '"', "'", '`', '$', '<', '>', '/', '.', '_', '!', '&', '|', 'Tab'
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-black overflow-hidden">
      {/* Top File Bar */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
            if (soundEnabled) playVibeTone('tap');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-mono text-xs font-semibold border border-zinc-700 transition-all active:scale-95"
        >
          <Folder className="w-3.5 h-3.5 text-zinc-400" />
          <span className="truncate max-w-[120px]">{activeFile}</span>
          <ChevronDown className="w-3 h-3 text-zinc-400" />
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPromptModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold active:scale-95 transition-all"
            title="Ask VibedCoding to edit this file"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="hidden xs:inline">Refactor</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              isSaved
                ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-default'
                : 'bg-white hover:bg-zinc-200 text-black font-bold shadow-md'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={onOpenPreview}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white active:scale-95 transition-all"
            title="Run in Live Sandbox"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* File Drawer Overlay */}
      {isDrawerOpen && (
        <div className="bg-zinc-950 border-b border-zinc-800 p-3 space-y-2.5 animate-in slide-in-from-top-2 duration-150 shrink-0 shadow-2xl z-20">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-zinc-400">
            <span>PROJECT FILES ({Object.keys(project.files).length})</span>
            <button
              onClick={() => setIsCreatingFile(true)}
              className="flex items-center gap-1 text-white hover:text-zinc-300"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>New File</span>
            </button>
          </div>

          {isCreatingFile && (
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g., styles.css, app.js"
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateNewFile();
                  if (e.key === 'Escape') setIsCreatingFile(false);
                }}
              />
              <button
                onClick={handleCreateNewFile}
                className="px-3 py-1.5 bg-white text-black font-bold rounded-xl text-xs hover:bg-zinc-200"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingFile(false)}
                className="p-1.5 bg-zinc-800 text-zinc-400 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
            {Object.keys(project.files).map((path) => (
              <div
                key={path}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono transition-all ${
                  path === activeFile
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-600'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <button
                  onClick={() => handleSelectFile(path)}
                  className="flex items-center gap-1.5 min-w-0 flex-1 truncate text-left"
                >
                  <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{path}</span>
                </button>
                {Object.keys(project.files).length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(path);
                      if (soundEnabled) playVibeTone('tap');
                    }}
                    className="text-zinc-500 hover:text-white p-1 shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Editor Body */}
      <div className="flex-1 relative flex flex-col min-h-0 bg-black">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 w-full p-3 font-mono text-xs sm:text-sm text-zinc-200 bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-zinc-700 overflow-y-auto pb-28"
          placeholder="Code here..."
        />
      </div>

      {/* Mobile Programming Accessory Bar (Floating above keyboard) */}
      <div className="bg-zinc-950 border-t border-zinc-800 px-2 py-1.5 pb-20 overflow-x-auto no-scrollbar flex items-center gap-1 select-none shrink-0 shadow-lg">
        {accessoryKeys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => handleInsertSymbol(k === 'Tab' ? '  ' : k)}
            className="shrink-0 h-9 min-w-9 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-xs font-bold flex items-center justify-center active:scale-90 transition-transform shadow-sm"
          >
            {k}
          </button>
        ))}
      </div>

      {/* Quick Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold text-white">Refactor {activeFile}</h3>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Tell VibedCoding what changes or modifications to add to <span className="font-mono text-white">{activeFile}</span>.
            </p>

            <input
              type="text"
              value={quickPromptText}
              onChange={(e) => setQuickPromptText(e.target.value)}
              placeholder="e.g., Add smooth touch gestures and sound effects"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && quickPromptText.trim()) {
                  onAskAgentForFile(activeFile, quickPromptText.trim());
                  setShowPromptModal(false);
                  setQuickPromptText('');
                }
              }}
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!quickPromptText.trim()) return;
                  onAskAgentForFile(activeFile, quickPromptText.trim());
                  setShowPromptModal(false);
                  setQuickPromptText('');
                }}
                className="px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md"
              >
                Execute Refactor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
