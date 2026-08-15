'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { STARTER_PROJECTS } from '@/lib/templates';
import { 
  Sparkles, 
  X, 
  Gamepad2, 
  StickyNote, 
  Layout, 
  Globe,
  BarChart3,
  Check,
  Layers
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
  const [template, setTemplate] = useState('nextjs-app');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    const projName = name.trim() || 'New VibedCoding Project';
    const id = projName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    const foundStarter = STARTER_PROJECTS.find(p => p.template === template);
    let starterFiles: Record<string, any> = {};

    if (foundStarter) {
      starterFiles = JSON.parse(JSON.stringify(foundStarter.files));
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
    body { background: #000000; color: #fff; font-family: sans-serif; }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6 text-center">
  <div class="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl max-w-sm w-full space-y-4">
    <div class="w-12 h-12 mx-auto rounded-2xl bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center text-xl font-bold">
      ✨
    </div>
    <h1 class="text-xl font-bold text-white">${projName}</h1>
    <p class="text-xs text-zinc-400">Created with VibedCoding!</p>
    <button onclick="alert('Vibe coded on mobile!')" class="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md">
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
      description: description.trim() || `Created with VibedCoding (${template})`,
      template,
      files: starterFiles,
      activeFilePath: Object.keys(starterFiles)[0] || 'index.html',
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
          author: 'VibedCoding'
        }
      ]
    };

    onCreateProject(newProj);
    onClose();
    if (soundEnabled) playVibeTone('success');
  };

  const templates = [
    {
      id: 'nextjs-app',
      label: 'Next.js 15 App Router',
      desc: 'React 19, client state hooks, modern layout & Tailwind CSS',
      icon: Layers,
      badge: 'Popular'
    },
    {
      id: 'static-web',
      label: 'Static Website & Landing',
      desc: 'High-converting responsive landing page, interactive pricing & contact modal',
      icon: Globe,
      badge: 'Static'
    },
    {
      id: 'dashboard-app',
      label: 'Analytics Dashboard',
      desc: 'Live telemetry chart canvas, revenue KPIs, events table & CSV export',
      icon: BarChart3,
      badge: 'SaaS'
    },
    {
      id: 'canvas-game',
      label: 'Neon Arcade 2088 Game',
      desc: 'Canvas 60fps retro racer with Web Audio synthesis & touch controls',
      icon: Gamepad2,
      badge: 'Game'
    },
    {
      id: 'utility-app',
      label: 'AI Notes & Idea Matrix',
      desc: 'Mobile audio memos, tag filtering, markdown sync & search',
      icon: StickyNote,
      badge: 'Utility'
    },
    {
      id: 'blank-tailwind',
      label: 'Minimal Tailwind Skeleton',
      desc: 'Clean starter shell with Tailwind CSS v4 & touch interactions',
      icon: Layout,
      badge: 'Minimal'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Vibed Project</h3>
              <p className="text-[11px] text-zinc-400">Mobile-optimized workspace by VibedCoding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Name */}
        <div className="space-y-1 shrink-0">
          <label className="text-xs font-mono font-semibold text-zinc-300">PROJECT NAME</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Next.js Marketplace, AI SaaS Dashboard"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        {/* Templates */}
        <div className="space-y-1.5 flex-1 min-h-0 flex flex-col">
          <label className="text-xs font-mono font-semibold text-zinc-300 shrink-0">STARTER TEMPLATE</label>
          <div className="space-y-1.5 overflow-y-auto pr-1">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = template === tpl.id;

              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplate(tpl.id)}
                  className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-zinc-800 border-zinc-600 shadow-md'
                      : 'bg-zinc-900/70 border-zinc-800 hover:bg-zinc-800/70'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 shrink-0 text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-100">{tpl.label}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {tpl.badge}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{tpl.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg active:scale-95 transition-all"
          >
            Initialize Project
          </button>
        </div>
      </div>
    </div>
  );
}
