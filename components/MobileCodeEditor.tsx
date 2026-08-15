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
    <div className="flex-1 flex flex-col h-full bg-[#090d16] overflow-hidden">
      {/* Top File Bar */}
      <div className="bg-[#0e1322] border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
            if (soundEnabled) playVibeTone('tap');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-semibold border border-slate-700 transition-all active:scale-95"
        >
          <Folder className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate max-w-[120px]">{activeFile}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPromptModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/40 text-purple-300 text-xs font-semibold active:scale-95 transition-all"
            title="Ask Antigravity 2.0 to edit this file"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Refactor</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              isSaved
                ? 'bg-slate-800 text-slate-500 cursor-default'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={onOpenPreview}
            className="p-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 active:scale-95 transition-all"
            title="Run in Live Sandbox"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* File Drawer Overlay */}
      {isDrawerOpen && (
        <div className="bg-[#0e1424] border-b border-slate-800 p-3 space-y-2.5 animate-in slide-in-from-top-2 duration-150 shrink-0 shadow-2xl z-20">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-400">
            <span>PROJECT FILES ({Object.keys(project.files).length})</span>
            <button
              onClick={() => setIsCreatingFile(true)}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
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
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateNewFile();
                  if (e.key === 'Escape') setIsCreatingFile(false);
                }}
              />
              <button
                onClick={handleCreateNewFile}
                className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingFile(false)}
                className="p-1.5 bg-slate-800 text-slate-400 rounded-xl"
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
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <button
                  onClick={() => handleSelectFile(path)}
                  className="flex items-center gap-1.5 min-w-0 flex-1 truncate text-left"
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{path}</span>
                </button>
                {Object.keys(project.files).length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(path);
                      if (soundEnabled) playVibeTone('tap');
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1 shrink-0"
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
      <div className="flex-1 relative flex flex-col min-h-0 bg-[#070a12]">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 w-full p-3 font-mono text-xs sm:text-sm text-slate-200 bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-cyan-500/30 overflow-y-auto pb-28"
          placeholder="Code here..."
        />
      </div>

      {/* Mobile Programming Accessory Bar (Floating above keyboard) */}
      <div className="bg-[#0b0f1d] border-t border-slate-800/90 px-2 py-1.5 pb-20 overflow-x-auto no-scrollbar flex items-center gap-1 select-none shrink-0 shadow-lg">
        {accessoryKeys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => handleInsertSymbol(k === 'Tab' ? '  ' : k)}
            className="shrink-0 h-9 min-w-9 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center active:scale-90 transition-transform shadow-sm"
          >
            {k}
          </button>
        ))}
      </div>

      {/* Quick Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-700 w-full max-w-md rounded-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Refactor {activeFile}</h3>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Tell Antigravity 2.0 what changes or animations to add to <span className="font-mono text-cyan-300">{activeFile}</span>.
            </p>

            <input
              type="text"
              value={quickPromptText}
              onChange={(e) => setQuickPromptText(e.target.value)}
              placeholder="e.g., Add smooth touch gestures and sound effects"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
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
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
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
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-md"
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
