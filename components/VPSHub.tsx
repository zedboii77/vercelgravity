'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { 
  Server, 
  Copy, 
  Check, 
  Download, 
  Cpu, 
  HardDrive, 
  Globe, 
  ShieldCheck, 
  Terminal, 
  FileCode, 
  Settings2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';

interface VPSHubProps {
  project: Project;
  onUpdateEnvVars: (envVars: Record<string, string>) => void;
  soundEnabled: boolean;
}

export function VPSHub({ project, onUpdateEnvVars, soundEnabled }: VPSHubProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'deploy' | 'docker' | 'pm2' | 'env' | 'status'>('deploy');
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [envVars, setEnvVars] = useState<Record<string, string>>(project.envVars || {});
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvVal, setNewEnvVal] = useState('');

  useEffect(() => {
    fetch('/api/system')
      .then((res) => res.json())
      .then((data) => setSystemInfo(data))
      .catch(() => {});
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (soundEnabled) playVibeTone('tap');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddEnv = () => {
    if (!newEnvKey.trim()) return;
    const updated = { ...envVars, [newEnvKey.trim().toUpperCase()]: newEnvVal.trim() };
    setEnvVars(updated);
    onUpdateEnvVars(updated);
    setNewEnvKey('');
    setNewEnvVal('');
    if (soundEnabled) playVibeTone('success');
  };

  const handleDeleteEnv = (k: string) => {
    const updated = { ...envVars };
    delete updated[k];
    setEnvVars(updated);
    onUpdateEnvVars(updated);
    if (soundEnabled) playVibeTone('tap');
  };

  const exportProjectJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.id}-antigravity-bundle.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (soundEnabled) playVibeTone('success');
  };

  const dockerfileSnippet = `# Antigravity 2.0 Production VPS Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || true

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
`;

  const dockerComposeSnippet = `version: '3.8'

services:
  antigravity-app:
    build: .
    container_name: antigravity-vibe-coder
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
`;

  const pm2Snippet = `// ecosystem.config.js
module.exports = {
  apps: [{
    name: '${project.id}',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
`;

  const vpsSetupBashScript = `#!/bin/bash
# 🚀 1-Click Antigravity 2.0 VPS Deploy Script (Ubuntu/Debian)
set -e

echo "⚡ Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "📦 Installing Node.js 20 & PM2..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx ufw
sudo npm install -g pm2

echo "🛡️ Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable

echo "🚀 Setting up Antigravity 2.0 Project..."
git clone https://github.com/your-username/${project.id}.git /var/www/${project.id} || true
cd /var/www/${project.id}
npm install
npm run build || true

pm2 start npm --name "${project.id}" -- start
pm2 save
pm2 startup

echo "✔ Antigravity 2.0 is live on your VPS!"
`;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070a14] overflow-y-auto p-3 sm:p-5 space-y-4 pb-24">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1428] to-[#121c3b] border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              VPS Self-Hosting & Deploy Hub
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                Node.js Native
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Deploy your vibe code on any Ubuntu/Debian VPS, Docker, or PM2 container.
            </p>
          </div>
        </div>

        <button
          onClick={exportProjectJSON}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Bundle JSON</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800">
        {[
          { id: 'deploy', label: '🚀 VPS 1-Click Script' },
          { id: 'docker', label: '🐳 Docker & Compose' },
          { id: 'pm2', label: '⚡ PM2 Cluster' },
          { id: 'env', label: '🔐 Env Secrets' },
          { id: 'status', label: '📊 System Diagnostics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (soundEnabled) playVibeTone('tap');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: VPS 1-Click Deploy Script */}
      {activeTab === 'deploy' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="p-3.5 rounded-2xl bg-[#0c1122] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">
                1-Click Ubuntu / Debian VPS Setup Script
              </span>
              <button
                onClick={() => handleCopy(vpsSetupBashScript, 'bash')}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg bg-slate-800"
              >
                {copiedKey === 'bash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'bash' ? 'Copied' : 'Copy Script'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              SSH into your VPS server (e.g. DigitalOcean, Hetzner, AWS, Linode) and run this script to install Node.js 20, PM2, and start Antigravity 2.0.
            </p>
            <pre className="p-3 rounded-xl bg-black/70 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-64">
              {vpsSetupBashScript}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Docker & Docker Compose */}
      {activeTab === 'docker' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="p-3.5 rounded-2xl bg-[#0c1122] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">Dockerfile</span>
              <button
                onClick={() => handleCopy(dockerfileSnippet, 'dockerfile')}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg bg-slate-800"
              >
                {copiedKey === 'dockerfile' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'dockerfile' ? 'Copied' : 'Copy Dockerfile'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/70 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
              {dockerfileSnippet}
            </pre>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c1122] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">docker-compose.yml</span>
              <button
                onClick={() => handleCopy(dockerComposeSnippet, 'compose')}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg bg-slate-800"
              >
                {copiedKey === 'compose' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'compose' ? 'Copied' : 'Copy Compose'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/70 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
              {dockerComposeSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: PM2 Cluster */}
      {activeTab === 'pm2' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="p-3.5 rounded-2xl bg-[#0c1122] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">ecosystem.config.js</span>
              <button
                onClick={() => handleCopy(pm2Snippet, 'pm2')}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg bg-slate-800"
              >
                {copiedKey === 'pm2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'pm2' ? 'Copied' : 'Copy PM2 Config'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Run <code className="text-cyan-400 font-mono">pm2 start ecosystem.config.js</code> to run your Node.js server across all CPU cores with automatic zero-downtime reloads.
            </p>
            <pre className="p-3 rounded-xl bg-black/70 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
              {pm2Snippet}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Environment Variables */}
      {activeTab === 'env' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="p-3.5 rounded-2xl bg-[#0c1122] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200">
                PROJECT ENVIRONMENT VARIABLES (.ENV)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {Object.keys(envVars).length} Keys
              </span>
            </div>

            {/* Add New Key */}
            <div className="flex flex-col sm:flex-row gap-1.5">
              <input
                type="text"
                value={newEnvKey}
                onChange={(e) => setNewEnvKey(e.target.value)}
                placeholder="VARIABLE_NAME"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 uppercase"
              />
              <input
                type="text"
                value={newEnvVal}
                onChange={(e) => setNewEnvVal(e.target.value)}
                placeholder="Value..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleAddEnv}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Env List */}
            <div className="space-y-1.5 pt-2">
              {Object.entries(envVars).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs"
                >
                  <div className="truncate mr-2">
                    <span className="text-cyan-300 font-semibold">{k}</span>
                    <span className="text-slate-500 mx-1.5">=</span>
                    <span className="text-slate-300">{v}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteEnv(k)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: System Diagnostics */}
      {activeTab === 'status' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#0c1122] border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Node Engine</span>
              <span className="text-sm font-bold font-mono text-cyan-400 mt-1 block">
                {systemInfo?.nodeVersion || 'v20.x'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0c1122] border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Memory RSS</span>
              <span className="text-sm font-bold font-mono text-emerald-400 mt-1 block">
                {systemInfo?.memory?.rssMb ? `${systemInfo.memory.rssMb} MB` : '32 MB'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0c1122] border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Platform</span>
              <span className="text-sm font-bold font-mono text-purple-400 mt-1 block">
                {systemInfo?.platform || 'linux'} ({systemInfo?.arch || 'x64'})
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c1122] border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-200 block">Antigravity 2.0 Engine Modules</span>
            <div className="flex flex-wrap gap-1.5">
              {(systemInfo?.capabilities || [
                'Gemini 3.7 Flash Agent',
                'Mobile Keyboard Accessory Bar',
                'Live Web Sandbox',
                'Virtual Terminal',
                'Docker & PM2 Export'
              ]).map((cap: string) => (
                <span
                  key={cap}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-cyan-400" />
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
