'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Project, TerminalLog } from '@/lib/types';
import { 
  Terminal as TerminalIcon, 
  Trash2, 
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';

interface TerminalRunnerProps {
  project: Project;
  soundEnabled: boolean;
}

const INITIAL_LOGS: TerminalLog[] = [
  {
    id: 'init-1',
    type: 'info',
    text: 'Antigravity 2.0 VPS Runner (Node.js v20.18.0 - Linux x86_64)',
    timestamp: 1723750000000
  },
  {
    id: 'init-2',
    type: 'success',
    text: '✔ Loaded project workspace into mobile sandbox',
    timestamp: 1723750002000
  },
  {
    id: 'init-3',
    type: 'output',
    text: 'Ready for VPS commands. Tap the quick snippets below or type custom bash commands.',
    timestamp: 1723750005000
  }
];

export function TerminalRunner({ project, soundEnabled }: TerminalRunnerProps) {
  const [logs, setLogs] = useState<TerminalLog[]>(INITIAL_LOGS);
  const [commandInput, setCommandInput] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    const cleanCmd = cmd.trim();
    const now = Date.now();

    const newLogs: TerminalLog[] = [
      ...logs,
      {
        id: `cmd-${now}`,
        type: 'input',
        text: `antigravity@vps:~/app$ ${cleanCmd}`,
        timestamp: now
      }
    ];

    if (soundEnabled) playVibeTone('code');

    // Simulate realistic outputs for standard developer commands
    if (cleanCmd === 'npm run dev' || cleanCmd === 'npm start' || cleanCmd === 'node server.js') {
      newLogs.push(
        { id: `res-${now}-1`, type: 'info', text: `> ${project.name}@2.0.0 start`, timestamp: now },
        { id: `res-${now}-2`, type: 'info', text: `> node server.js`, timestamp: now },
        { id: `res-${now}-3`, type: 'success', text: `⚡ Antigravity 2.0 Web Server listening on port 3000`, timestamp: now },
        { id: `res-${now}-4`, type: 'output', text: `  ➜ Local:   http://localhost:3000/\n  ➜ Network: http://0.0.0.0:3000/ (VPS Public IP)`, timestamp: now }
      );
    } else if (cleanCmd === 'git status') {
      newLogs.push(
        { id: `res-${now}-1`, type: 'info', text: 'On branch main\nYour branch is up to date with \'origin/main\'.', timestamp: now },
        { id: `res-${now}-2`, type: 'output', text: `Changes tracked in ${Object.keys(project.files).length} files\nnothing to commit, working tree clean`, timestamp: now }
      );
    } else if (cleanCmd.startsWith('git commit')) {
      const hash = Math.random().toString(16).substring(2, 8);
      newLogs.push(
        { id: `res-${now}-1`, type: 'success', text: `[main ${hash}] ${cleanCmd.replace(/git commit -m ?['"]?/, '').replace(/['"]?$/, '') || 'vibe update'}`, timestamp: now },
        { id: `res-${now}-2`, type: 'output', text: ` ${Object.keys(project.files).length} files changed, ${Math.floor(Math.random() * 40) + 10} insertions(+)`, timestamp: now }
      );
    } else if (cleanCmd === 'pm2 list' || cleanCmd === 'pm2 status') {
      newLogs.push({
        id: `res-${now}-1`,
        type: 'output',
        text: `┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐\n│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │\n├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤\n│ 0  │ antigravity-app    │ fork     │ 0    │ online    │ 0.4%     │ 38.2mb   │\n└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘`,
        timestamp: now
      });
    } else if (cleanCmd === 'pm2 restart all' || cleanCmd === 'pm2 restart 0') {
      newLogs.push(
        { id: `res-${now}-1`, type: 'info', text: '[PM2] Applying action restartProcessId on app [antigravity-app](ids: [ 0 ])', timestamp: now },
        { id: `res-${now}-2`, type: 'success', text: '[PM2] [antigravity-app](0) ✓ online', timestamp: now }
      );
    } else if (cleanCmd === 'ls' || cleanCmd === 'ls -la') {
      const fileList = Object.keys(project.files).join('  ');
      newLogs.push({
        id: `res-${now}-1`,
        type: 'output',
        text: `total 48\ndrwxr-xr-x  6 vps-user  staff   192 Aug 15 20:28 .\ndrwxr-xr-x  3 vps-user  staff    96 Aug 15 20:28 ..\n${fileList}  Dockerfile  ecosystem.config.js`,
        timestamp: now
      });
    } else if (cleanCmd === 'node -v') {
      newLogs.push({ id: `res-${now}-1`, type: 'output', text: 'v20.18.0', timestamp: now });
    } else if (cleanCmd === 'npm test') {
      newLogs.push(
        { id: `res-${now}-1`, type: 'info', text: '> test\n> vitest run', timestamp: now },
        { id: `res-${now}-2`, type: 'success', text: '✓ tests/app.spec.ts (4 tests passed)\nTest Files  1 passed (1)\nTests  4 passed (4)\nDuration  412ms', timestamp: now }
      );
    } else if (cleanCmd.includes('curl')) {
      newLogs.push({
        id: `res-${now}-1`,
        type: 'output',
        text: 'HTTP/1.1 200 OK\nServer: nginx/1.24.0 (Ubuntu)\nContent-Type: text/html; charset=UTF-8\nConnection: keep-alive\nETag: "66be24a1-1b8"',
        timestamp: now
      });
    } else {
      newLogs.push({
        id: `res-${now}-1`,
        type: 'output',
        text: `Executed: ${cleanCmd}\n[exit code 0]`,
        timestamp: now
      });
    }

    setLogs(newLogs);
    setCommandInput('');
  };

  const quickSnippets = [
    'npm run dev',
    'git status',
    "git commit -m 'feat: vibe upgrade'",
    'pm2 list',
    'pm2 restart all',
    'ls -la',
    'node -v',
    'npm test',
    'curl -I localhost:3000'
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050811] overflow-hidden">
      {/* Top Terminal Status Header */}
      <div className="bg-[#0b101f] border-b border-slate-800 px-3 py-2 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            VPS BASH SHELL
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>

        <button
          onClick={() => {
            setLogs([]);
            if (soundEnabled) playVibeTone('tap');
          }}
          className="p-1 text-slate-400 hover:text-slate-200"
          title="Clear terminal"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal Output Logs */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 bg-[#04060d]">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`leading-relaxed whitespace-pre-wrap ${
              log.type === 'input'
                ? 'text-cyan-300 font-bold'
                : log.type === 'success'
                ? 'text-emerald-400'
                : log.type === 'error'
                ? 'text-rose-400'
                : log.type === 'info'
                ? 'text-indigo-400'
                : 'text-slate-300'
            }`}
          >
            {log.text}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Quick Snippets Carousel */}
      <div className="bg-[#090d1a] border-t border-slate-800/80 px-2 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar select-none shrink-0">
        {quickSnippets.map((snippet) => (
          <button
            key={snippet}
            onClick={() => executeCommand(snippet)}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700/80 font-mono text-[11px] font-medium transition-all active:scale-95 shadow-sm"
          >
            {snippet}
          </button>
        ))}
      </div>

      {/* Interactive Command Input Bar */}
      <div className="bg-[#0b101f] border-t border-slate-800 p-2 pb-20 flex items-center gap-2 shrink-0">
        <span className="text-emerald-400 font-mono text-xs pl-1">❯</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') executeCommand(commandInput);
          }}
          placeholder="Type VPS bash command..."
          className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-slate-600"
        />
        <button
          onClick={() => executeCommand(commandInput)}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold font-mono text-xs active:scale-95 transition-all shadow-md shadow-emerald-500/20"
        >
          Run
        </button>
      </div>
    </div>
  );
}
