'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { STARTER_PROJECTS } from '@/lib/templates';
import { 
  Plus, 
  Sparkles, 
  X, 
  Gamepad2, 
  StickyNote, 
  Layout, 
  Server, 
  Code2,
  Check
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
  soundEnabled: boolean;
}

export function NewProjectModal({
  isOpen,
  onClose,
  onCreateProject,
  soundEnabled
}: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('canvas-game');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    const projName = name.trim() || 'New Vibe Project';
    const id = projName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    let starterFiles: Record<string, any> = {};

    if (template === 'canvas-game') {
      starterFiles = STARTER_PROJECTS[0].files;
    } else if (template === 'utility-app') {
      starterFiles = STARTER_PROJECTS[1].files;
    } else {
      starterFiles = {
        'index.html': {
          path: 'index.html',
          language: 'html',
          updatedAt: Date.now(),
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${projName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #070a14; color: #fff; font-family: sans-serif; }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6 text-center">
  <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl max-w-sm w-full space-y-4">
    <div class="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-bold">
      ⚡
    </div>
    <h1 class="text-xl font-bold text-white">${projName}</h1>
    <p class="text-xs text-slate-400">Ready for vibe coding with Antigravity 2.0!</p>
    <button onclick="alert('Vibe coded on mobile!')" class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30">
      Tap Interaction
    </button>
  </div>
</body>
</html>`
        }
      };
    }

    const newProj: Project = {
      id,
      name: projName,
      description: description.trim() || 'Created with Antigravity 2.0 Mobile Vibe Coder',
      template,
      files: starterFiles,
      activeFilePath: 'index.html',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      envVars: {
        APP_NAME: projName,
        NODE_ENV: 'production'
      },
      commits: [
        {
          id: Math.random().toString(16).substring(2, 8),
          message: `feat: initialize ${projName}`,
          timestamp: Date.now(),
          filesChanged: Object.keys(starterFiles).length,
          author: 'Antigravity 2.0'
        }
      ]
    };

    onCreateProject(newProj);
    onClose();
    if (soundEnabled) playVibeTone('success');
  };

  const templates = [
    {
      id: 'canvas-game',
      label: '🚀 Neon Arcade Game',
      desc: 'Canvas 60fps arcade racer with Web Audio synthesis & touch buttons',
      icon: Gamepad2,
      color: 'text-fuchsia-400 border-fuchsia-500/30'
    },
    {
      id: 'utility-app',
      label: '💡 AI Voice Notes & Matrix',
      desc: 'Mobile audio memos, mood tags, markdown sync & search',
      icon: StickyNote,
      color: 'text-cyan-400 border-cyan-500/30'
    },
    {
      id: 'blank-tailwind',
      label: '⚡ Blank Tailwind App',
      desc: 'Minimal clean mobile starter with Tailwind CSS & responsive shell',
      icon: Layout,
      color: 'text-emerald-400 border-emerald-500/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0d1222] border border-slate-700/90 w-full max-w-lg rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Vibe Project</h3>
              <p className="text-[11px] text-slate-400">Mobile-optimized workspace for Antigravity 2.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Name */}
        <div className="space-y-1">
          <label className="text-xs font-mono font-semibold text-slate-300">PROJECT NAME</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Cyberpunk Soundboard, Crypto Matrix"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Templates */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300">STARTER TEMPLATE</label>
          <div className="space-y-2">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = template === tpl.id;

              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplate(tpl.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/70'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-slate-800 shrink-0 ${tpl.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{tpl.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{tpl.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            Initialize Project
          </button>
        </div>
      </div>
    </div>
  );
}
