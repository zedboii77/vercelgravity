'use client';

import React, { useState } from 'react';
import { ChatMessage, ToolCallData } from '@/lib/types';
import { 
  Bot, 
  User, 
  Sparkles, 
  Code2, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Copy, 
  BrainCircuit, 
  Terminal, 
  FileCode,
  ExternalLink,
  Layers,
  Database
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';

interface AgentFeedProps {
  messages: ChatMessage[];
  onApplyToolCalls: (toolCalls: ToolCallData[]) => void;
  onOpenEditorForFile: (filePath: string) => void;
  onOpenPreview: () => void;
  isLoading: boolean;
  soundEnabled: boolean;
}

export function AgentFeed({
  messages,
  onApplyToolCalls,
  onOpenEditorForFile,
  onOpenPreview,
  isLoading,
  soundEnabled
}: AgentFeedProps) {
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const [expandedDiffs, setExpandedDiffs] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleThinking = (id: string) => {
    setExpandedThinking((prev) => ({ ...prev, [id]: !prev[id] }));
    if (soundEnabled) playVibeTone('tap');
  };

  const toggleDiff = (id: string) => {
    setExpandedDiffs((prev) => ({ ...prev, [id]: !prev[id] }));
    if (soundEnabled) playVibeTone('tap');
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    if (soundEnabled) playVibeTone('tap');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-2.5 sm:px-3 py-3 space-y-3 max-w-3xl mx-auto w-full">
      {messages.length === 0 && (
        <div className="text-center py-8 px-3 space-y-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-pink-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">Antigravity 2.0 Agent</h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Mobile-first vibe coding runtime. Tap the quick chips below or dictate your prompt to create apps, refactor code, and test instantly in live preview.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-left max-w-md mx-auto">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 mb-0.5">
                <BrainCircuit className="w-3.5 h-3.5" /> Gemini 3.7 Thinking
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Step-by-step reasoning chain with surgical code edits.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-0.5">
                <Database className="w-3.5 h-3.5" /> Server-Synced Chats
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Persistent chat history and workspace file sync.</p>
            </div>
          </div>
        </div>
      )}

      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        return (
          <div
            key={msg.id}
            className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
          >
            {/* Header Badge */}
            <div className="flex items-center gap-1.5 px-1 text-[10px] sm:text-[11px] text-slate-400 font-mono">
              {isUser ? (
                <>
                  <span>You (Vibe Prompt)</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                    <User className="w-2.5 h-2.5" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
                    <Bot className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-semibold text-cyan-400">Antigravity 2.0</span>
                  {msg.modelUsed && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {msg.modelUsed.replace('-preview', '')}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Message Bubble Container */}
            <div
              className={`rounded-2xl p-3 max-w-[95%] sm:max-w-[85%] text-xs sm:text-sm shadow-md transition-all ${
                isUser
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-sm shadow-cyan-600/10'
                  : 'bg-[#101628] border border-slate-700/70 text-slate-200 rounded-tl-sm'
              }`}
            >
              {/* Attached Images */}
              {msg.attachedImages && msg.attachedImages.length > 0 && (
                <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
                  {msg.attachedImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Attachment"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-white/20 shadow-sm shrink-0"
                    />
                  ))}
                </div>
              )}

              {/* Thinking Reasoning Section (Agent only) */}
              {!isUser && msg.thinking && (
                <div className="mb-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 overflow-hidden">
                  <button
                    onClick={() => toggleThinking(msg.id)}
                    className="w-full px-2.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-cyan-400/90 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <BrainCircuit className="w-3 h-3 text-cyan-400 animate-pulse" />
                      <span className="font-semibold">Reasoning Process</span>
                    </div>
                    {expandedThinking[msg.id] ? (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    )}
                  </button>

                  {expandedThinking[msg.id] && (
                    <div className="px-2.5 py-2 text-[10px] sm:text-[11px] text-slate-300 font-mono bg-black/40 border-t border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                      {msg.thinking}
                    </div>
                  )}
                </div>
              )}

              {/* Main Text Content */}
              <div className="leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">{msg.content}</div>

              {/* Tool Execution Cards */}
              {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-800/90 space-y-2">
                  <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Applied Changes</span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full">
                      {msg.toolCalls.length} Actions
                    </span>
                  </div>

                  {msg.toolCalls.map((tc) => (
                    <div
                      key={tc.id}
                      className="rounded-xl bg-slate-900/90 border border-slate-800 p-2 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                            {tc.tool === 'run_command' ? (
                              <Terminal className="w-3 h-3" />
                            ) : (
                              <FileCode className="w-3 h-3" />
                            )}
                          </span>
                          <div className="truncate min-w-0">
                            <span className="font-mono text-[11px] text-slate-200 font-semibold truncate block">
                              {tc.targetPath || tc.command || 'Action'}
                            </span>
                            <span className="text-[9px] text-slate-400 truncate block">
                              {tc.summary}
                            </span>
                          </div>
                        </div>

                        {tc.diff && (
                          <div className="flex items-center gap-1 text-[9px] font-mono shrink-0">
                            <span className="text-emerald-400 font-bold">+{tc.diff.added}</span>
                            <span className="text-rose-400 font-bold">-{tc.diff.removed}</span>
                          </div>
                        )}
                      </div>

                      {/* Quick File Action Buttons */}
                      {tc.targetPath && tc.content && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <button
                            onClick={() => onOpenEditorForFile(tc.targetPath!)}
                            className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                          >
                            <Code2 className="w-3 h-3 text-cyan-400" />
                            <span>Editor</span>
                          </button>

                          <button
                            onClick={() => toggleDiff(tc.id)}
                            className="py-1 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] font-mono shrink-0"
                          >
                            {expandedDiffs[tc.id] ? 'Hide' : 'Code'}
                          </button>
                        </div>
                      )}

                      {/* Code preview accordion */}
                      {expandedDiffs[tc.id] && tc.content && (
                        <div className="mt-1.5 rounded-lg bg-black/60 border border-slate-800 p-2 overflow-hidden">
                          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[9px] font-mono text-slate-400">
                            <span className="truncate mr-2">{tc.targetPath}</span>
                            <button
                              onClick={() => copyCode(tc.content!, tc.id)}
                              className="text-cyan-400 flex items-center gap-1 shrink-0"
                            >
                              {copiedId === tc.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === tc.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto max-h-48 leading-tight">
                            <code>{tc.content}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading Indicator with Thinking animation */}
      {isLoading && (
        <div className="flex items-center gap-2 text-cyan-400 p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 max-w-[90%] sm:max-w-[75%] animate-pulse">
          <BrainCircuit className="w-4 h-4 animate-spin text-cyan-300 shrink-0" />
          <div className="text-[11px] font-mono">
            <span className="font-semibold">Antigravity 2.0 reasoning...</span>
            <span className="text-[9px] text-cyan-400/70 block">Synthesizing code architecture</span>
          </div>
        </div>
      )}
    </div>
  );
}
