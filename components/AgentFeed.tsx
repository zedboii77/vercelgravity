'use client';

import React, { useState } from 'react';
import { 
  ChatMessage, 
  ToolCallData,
  ProjectFile 
} from '@/lib/types';
import { 
  Bot, 
  User, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Code2, 
  Play, 
  FileCode, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Layers,
  ArrowRight,
  BrainCircuit
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

  const toggleThinking = (msgId: string) => {
    setExpandedThinking((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
    if (soundEnabled) playVibeTone('tap');
  };

  const toggleDiff = (tcId: string) => {
    setExpandedDiffs((prev) => ({ ...prev, [tcId]: !prev[tcId] }));
    if (soundEnabled) playVibeTone('tap');
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    if (soundEnabled) playVibeTone('tap');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 max-w-3xl mx-auto w-full">
      {messages.length === 0 && (
        <div className="text-center py-12 px-4 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-pink-500/20 border border-cyan-500/30 flex items-center justify-center shadow-xl shadow-cyan-500/10">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">Antigravity 2.0 Agent</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Mobile-first vibe coding runtime. Tap the quick chips below or speak your prompt to build, refactor, and prepare your app for Vercel deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-left">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 mb-1">
                <BrainCircuit className="w-4 h-4" /> Gemini 3.7 Thinking
              </div>
              <p className="text-[11px] text-slate-400">Step-by-step reasoning chain with surgical code edits.</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                <Terminal className="w-4 h-4" /> Vercel & Production Ready
              </div>
              <p className="text-[11px] text-slate-400">Export as ZIP bundle or deploy directly to Vercel in seconds.</p>
            </div>
          </div>
        </div>
      )}

      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        return (
          <div
            key={msg.id}
            className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
          >
            {/* Header Badge */}
            <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400 font-mono">
              {isUser ? (
                <>
                  <span>You (Vibe Prompt)</span>
                  <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                    <User className="w-2.5 h-2.5" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
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
              className={`rounded-2xl p-3.5 max-w-[92%] sm:max-w-[85%] text-sm shadow-md transition-all ${
                isUser
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-sm shadow-cyan-600/10'
                  : 'bg-[#101628] border border-slate-700/70 text-slate-200 rounded-tl-sm'
              }`}
            >
              {/* Attached Images */}
              {msg.attachedImages && msg.attachedImages.length > 0 && (
                <div className="flex gap-2 mb-2.5 overflow-x-auto pb-1">
                  {msg.attachedImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Attachment"
                      className="w-24 h-24 object-cover rounded-xl border border-white/20 shadow-sm shrink-0"
                    />
                  ))}
                </div>
              )}

              {/* Thinking Reasoning Section (Agent only) */}
              {!isUser && msg.thinking && (
                <div className="mb-3 rounded-xl bg-slate-900/90 border border-slate-800/90 overflow-hidden">
                  <button
                    onClick={() => toggleThinking(msg.id)}
                    className="w-full px-3 py-2 flex items-center justify-between text-xs font-mono text-cyan-400/90 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span className="font-semibold">Reasoning Process</span>
                    </div>
                    {expandedThinking[msg.id] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {expandedThinking[msg.id] && (
                    <div className="px-3 py-2.5 text-xs text-slate-300 font-mono bg-black/40 border-t border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                      {msg.thinking}
                    </div>
                  )}
                </div>
              )}

              {/* Main Text Content */}
              <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>

              {/* Tool Execution Cards */}
              {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/90 space-y-2">
                  <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Applied Workspace Changes</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                      {msg.toolCalls.length} Actions
                    </span>
                  </div>

                  {msg.toolCalls.map((tc) => (
                    <div
                      key={tc.id}
                      className="rounded-xl bg-slate-900/90 border border-slate-800 p-2.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                            {tc.tool === 'run_command' ? (
                              <Terminal className="w-3.5 h-3.5" />
                            ) : (
                              <FileCode className="w-3.5 h-3.5" />
                            )}
                          </span>
                          <div className="truncate">
                            <span className="font-mono text-xs text-slate-200 font-semibold truncate block">
                              {tc.targetPath || tc.command || 'Action'}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {tc.summary}
                            </span>
                          </div>
                        </div>

                        {tc.diff && (
                          <div className="flex items-center gap-1 text-[10px] font-mono">
                            <span className="text-emerald-400 font-bold">+{tc.diff.added}</span>
                            <span className="text-rose-400 font-bold">-{tc.diff.removed}</span>
                          </div>
                        )}
                      </div>

                      {/* Quick File Action Buttons */}
                      {tc.targetPath && tc.content && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onOpenEditorForFile(tc.targetPath!)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>View in Editor</span>
                          </button>

                          <button
                            onClick={() => toggleDiff(tc.id)}
                            className="py-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                          >
                            {expandedDiffs[tc.id] ? 'Hide Code' : 'Code'}
                          </button>
                        </div>
                      )}

                      {/* Code preview accordion */}
                      {expandedDiffs[tc.id] && tc.content && (
                        <div className="mt-2 rounded-lg bg-black/60 border border-slate-800 p-2 overflow-hidden">
                          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                            <span>{tc.targetPath}</span>
                            <button
                              onClick={() => copyCode(tc.content!, tc.id)}
                              className="text-cyan-400 flex items-center gap-1"
                            >
                              {copiedId === tc.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === tc.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 p-1">
                            {tc.content}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* One-tap Preview CTA */}
                  <div className="pt-1">
                    <button
                      onClick={onOpenPreview}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Test & Play in Live Sandbox</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="flex items-start gap-2 animate-in fade-in duration-200">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-[#101628] border border-cyan-500/30 p-3 text-xs text-slate-300 space-y-2 max-w-[85%]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="font-mono text-cyan-400 font-semibold">Antigravity 2.0 is reasoning...</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Generating surgical mobile code updates and preparing file modifications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
