import { Project } from './types';

export const STARTER_PROJECTS: Project[] = [
  {
    id: 'nextjs-starter',
    name: 'Next.js 15 App Router',
    description: 'Full-stack Next.js 15 template with React 19 interactive components, state hooks, responsive mobile navigation, and Tailwind CSS.',
    template: 'nextjs-app',
    createdAt: 1723745000000,
    updatedAt: 1723750000000,
    activeFilePath: 'app/page.tsx',
    envVars: {
      NEXT_PUBLIC_APP_NAME: 'Vibed Next.js App',
      NODE_ENV: 'development'
    },
    commits: [
      {
        id: 'n1x89f',
        message: 'feat: initialize Next.js 15 App Router with Tailwind CSS',
        timestamp: 1723745000000,
        filesChanged: 4,
        author: 'VibedCoding'
      }
    ],
    files: {
      'app/page.tsx': {
        path: 'app/page.tsx',
        language: 'typescript',
        updatedAt: 1723750000000,
        content: `'use client';

import React, { useState } from 'react';

export default function HomePage() {
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    { title: 'Server & Client Components', desc: 'Optimized hybrid rendering architecture.', icon: '⚡' },
    { title: 'Tailwind CSS v4', desc: 'Utility-first modern responsive styles.', icon: '🎨' },
    { title: 'VibedCoding Ready', desc: 'Instant live reloading and AI agent refactoring.', icon: '✨' }
  ];

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-lg font-bold">
              ▲
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Next.js 15 App</h1>
              <p className="text-[11px] font-mono text-zinc-400">App Router // React 19</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
            v15.2
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 gap-1">
          {['overview', 'counter', 'features'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all \${
                activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }\`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Welcome to your Next.js application generated with <span className="text-white font-semibold">VibedCoding</span>. You can prompt the AI agent to build full-stack routes, add state, or restyle components.
            </p>
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-300">
              <code>app/page.tsx &rarr; ready for edits</code>
            </div>
          </div>
        )}

        {activeTab === 'counter' && (
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-3 animate-in fade-in duration-150">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Interactive Client State</span>
            <div className="text-3xl font-bold font-mono text-white">{count}</div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setCount((c) => c - 1)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
              >
                -1
              </button>
              <button
                onClick={() => setCount(0)}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-mono"
              >
                Reset
              </button>
              <button
                onClick={() => setCount((c) => c + 1)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs"
              >
                +1
              </button>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-2 animate-in fade-in duration-150">
            {features.map((f, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-2.5">
                <span className="text-base">{f.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">{f.title}</div>
                  <div className="text-[10px] text-zinc-400">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Created with VibedCoding</span>
          <span className="text-zinc-400">SSR + Client Hydrated</span>
        </div>
      </div>
    </main>
  );
}
`
      },
      'app/layout.tsx': {
        path: 'app/layout.tsx',
        language: 'typescript',
        updatedAt: 1723750000000,
        content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js 15 App - VibedCoding',
  description: 'Built with VibedCoding mobile-first environment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-zinc-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
`
      },
      'package.json': {
        path: 'package.json',
        language: 'json',
        updatedAt: 1723750000000,
        content: JSON.stringify({
          name: 'vibed-nextjs-app',
          version: '0.1.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start'
          },
          dependencies: {
            next: '^15.1.0',
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            'lucide-react': '^0.468.0'
          },
          devDependencies: {
            typescript: '^5.0.0',
            '@types/node': '^20.0.0',
            '@types/react': '^19.0.0',
            '@types/react-dom': '^19.0.0',
            tailwindcss: '^4.0.0'
          }
        }, null, 2)
      },
      'index.html': {
        path: 'index.html',
        language: 'html',
        updatedAt: 1723750000000,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Next.js 15 App Preview - VibedCoding</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #000000; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
  <div class="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-lg font-bold">
          ▲
        </div>
        <div>
          <h1 class="text-base font-bold text-white">Next.js 15 App</h1>
          <p class="text-[11px] font-mono text-zinc-400">App Router // React 19</p>
        </div>
      </div>
      <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
        v15.2
      </span>
    </div>

    <div class="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 gap-1" id="tab-bar">
      <button onclick="switchTab('overview')" id="btn-overview" class="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize bg-zinc-800 text-white shadow-sm transition-all">Overview</button>
      <button onclick="switchTab('counter')" id="btn-counter" class="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize text-zinc-400 hover:text-zinc-200 transition-all">Counter</button>
      <button onclick="switchTab('features')" id="btn-features" class="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize text-zinc-400 hover:text-zinc-200 transition-all">Features</button>
    </div>

    <div id="tab-overview" class="space-y-3">
      <p class="text-xs text-zinc-400 leading-relaxed">
        Welcome to your Next.js application generated with <span class="text-white font-semibold">VibedCoding</span>. You can prompt the AI agent to build full-stack routes, add state, or restyle components.
      </p>
      <div class="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-300">
        <code>app/page.tsx &rarr; ready for edits</code>
      </div>
    </div>

    <div id="tab-counter" class="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-3 hidden">
      <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Interactive Client State</span>
      <div class="text-3xl font-bold font-mono text-white" id="count-val">0</div>
      <div class="flex gap-2 justify-center">
        <button onclick="changeCount(-1)" class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs active:scale-95 transition-all">-1</button>
        <button onclick="changeCount(0)" class="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-mono active:scale-95 transition-all">Reset</button>
        <button onclick="changeCount(1)" class="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs active:scale-95 transition-all">+1</button>
      </div>
    </div>

    <div id="tab-features" class="space-y-2 hidden">
      <div class="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-2.5">
        <span class="text-base">⚡</span>
        <div class="min-w-0">
          <div className="text-xs font-bold text-white">Server & Client Components</div>
          <div className="text-[10px] text-zinc-400">Optimized hybrid rendering architecture.</div>
        </div>
      </div>
      <div class="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-2.5">
        <span class="text-base">🎨</span>
        <div class="min-w-0">
          <div class="text-xs font-bold text-white">Tailwind CSS v4</div>
          <div class="text-[10px] text-zinc-400">Utility-first modern responsive styles.</div>
        </div>
      </div>
      <div class="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-2.5">
        <span class="text-base">✨</span>
        <div class="min-w-0">
          <div class="text-xs font-bold text-white">VibedCoding Ready</div>
          <div class="text-[10px] text-zinc-400">Instant live reloading and AI agent refactoring.</div>
        </div>
      </div>
    </div>

    <div class="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
      <span>Created with VibedCoding</span>
      <span class="text-zinc-400">SSR + Client Hydrated</span>
    </div>
  </div>

  <script>
    let currentCount = 0;
    function changeCount(delta) {
      if (delta === 0) currentCount = 0;
      else currentCount += delta;
      document.getElementById('count-val').innerText = currentCount;
    }

    function switchTab(tabName) {
      ['overview', 'counter', 'features'].forEach(t => {
        document.getElementById('tab-' + t).classList.add('hidden');
        document.getElementById('btn-' + t).className = 'flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize text-zinc-400 hover:text-zinc-200 transition-all';
      });
      document.getElementById('tab-' + tabName).classList.remove('hidden');
      document.getElementById('btn-' + tabName).className = 'flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize bg-zinc-800 text-white shadow-sm transition-all';
    }
  </script>
</body>
</html>`
      }
    }
  },
  {
    id: 'static-landing',
    name: 'Modern SaaS Static Website',
    description: 'High-converting responsive static website with hero, interactive feature tabs, pricing calculator, and contact modal.',
    template: 'static-web',
    createdAt: 1723742000000,
    updatedAt: 1723750000000,
    activeFilePath: 'index.html',
    envVars: {
      SITE_TITLE: 'Aura SaaS',
      NODE_ENV: 'production'
    },
    commits: [
      {
        id: 's1t99b',
        message: 'feat: modern responsive static website template',
        timestamp: 1723742000000,
        filesChanged: 3,
        author: 'VibedCoding'
      }
    ],
    files: {
      'index.html': {
        path: 'index.html',
        language: 'html',
        updatedAt: 1723750000000,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Aura - Intelligent Cloud Architecture</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #000000; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-black text-zinc-100">
  <!-- Navigation Header -->
  <header class="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-xl bg-white text-black font-extrabold flex items-center justify-center text-sm shadow-md">
        A
      </div>
      <span class="text-sm font-bold tracking-tight text-white">AURA CLOUD</span>
    </div>
    <div class="flex items-center gap-2">
      <button onclick="toggleModal()" class="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200">Contact</button>
      <button class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md">Get Started</button>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-1 px-4 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto w-full space-y-8">
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
        <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        Built for Modern Web Scale
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
        Next-Generation Cloud Infrastructure Without the Complexity.
      </h1>
      <p class="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
        Deploy distributed edge workers, serverless databases, and real-time event streams with zero config and global multi-region caching.
      </p>
      <div class="flex items-center justify-center gap-3 pt-2">
        <button class="px-6 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg active:scale-95 transition-all">
          Deploy in 30 Seconds
        </button>
        <button class="px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs active:scale-95 transition-all">
          Read Documentation
        </button>
      </div>
    </div>

    <!-- Interactive Pricing Calculator -->
    <div class="p-5 sm:p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-white">Interactive Cost Estimator</h2>
          <p class="text-[11px] text-zinc-400">Slide to preview monthly compute costs</p>
        </div>
        <div class="text-right">
          <div class="text-xl font-bold font-mono text-white" id="price-display">$29/mo</div>
          <span class="text-[10px] text-zinc-500 font-mono" id="requests-display">1M Requests</span>
        </div>
      </div>

      <input 
        type="range" 
        min="1" 
        max="50" 
        value="5" 
        id="compute-slider" 
        oninput="updatePricing(this.value)"
        class="w-full accent-white cursor-pointer"
      >

      <div class="grid grid-cols-3 gap-2 pt-2 text-center">
        <div class="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div class="text-xs font-bold text-white">99.99%</div>
          <div class="text-[10px] text-zinc-500">Uptime SLA</div>
        </div>
        <div class="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div class="text-xs font-bold text-white">&lt; 15ms</div>
          <div class="text-[10px] text-zinc-500">Edge Latency</div>
        </div>
        <div class="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div class="text-xs font-bold text-white">Global</div>
          <div class="text-[10px] text-zinc-500">Anycast CDN</div>
        </div>
      </div>
    </div>
  </main>

  <!-- Contact Modal -->
  <div id="contact-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-zinc-950 border border-zinc-800 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-white">Contact Team</h3>
        <button onclick="toggleModal()" class="text-zinc-400 hover:text-white">&times;</button>
      </div>
      <p class="text-xs text-zinc-400">Send a direct message to our engineering team.</p>
      <input type="text" placeholder="Your name" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
      <textarea rows="3" placeholder="Tell us about your project..." class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"></textarea>
      <button onclick="toggleModal(); alert('Message sent successfully!')" class="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold">Submit</button>
    </div>
  </div>

  <script>
    function updatePricing(val) {
      const price = val * 6 - 1;
      const reqs = val * 200;
      document.getElementById('price-display').innerText = '$' + price + '/mo';
      document.getElementById('requests-display').innerText = (reqs >= 1000 ? (reqs/1000).toFixed(1) + 'M' : reqs + 'k') + ' Requests';
    }

    function toggleModal() {
      const modal = document.getElementById('contact-modal');
      modal.classList.toggle('hidden');
      modal.classList.toggle('flex');
    }
  </script>
</body>
</html>`
      }
    }
  },
  {
    id: 'saas-dashboard',
    name: 'Analytics & Telemetry Dashboard',
    description: 'Responsive SaaS analytics dashboard with real-time chart canvas, metric KPIs, telemetry data table, and CSV export.',
    template: 'dashboard-app',
    createdAt: 1723741000000,
    updatedAt: 1723750000000,
    activeFilePath: 'index.html',
    envVars: {
      APP_NAME: 'VibedAnalytics',
      NODE_ENV: 'production'
    },
    commits: [
      {
        id: 'd1b89a',
        message: 'feat: interactive analytics metrics & chart canvas',
        timestamp: 1723741000000,
        filesChanged: 2,
        author: 'VibedCoding'
      }
    ],
    files: {
      'index.html': {
        path: 'index.html',
        language: 'html',
        updatedAt: 1723750000000,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Analytics & Telemetry Dashboard - VibedCoding</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #000000; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-black text-zinc-100 p-3 sm:p-6 pb-20">
  <!-- Top Bar -->
  <header class="flex items-center justify-between pb-4 border-b border-zinc-800">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
        📊
      </div>
      <div>
        <h1 class="text-sm font-bold text-white">TELEMETRY MATRIX</h1>
        <p class="text-[10px] font-mono text-zinc-400">Live Traffic & Conversion</p>
      </div>
    </div>
    <button onclick="refreshData()" class="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 active:scale-95 transition-all">
      ↻ Refresh
    </button>
  </header>

  <!-- Metric KPIs -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
    <div class="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
      <span class="text-[10px] font-mono text-zinc-500 uppercase">Monthly Revenue</span>
      <div class="text-base sm:text-lg font-bold font-mono text-white" id="mrr-val">$48,250</div>
      <span class="text-[10px] text-emerald-400 font-mono">+14.2% &uarr;</span>
    </div>
    <div class="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
      <span class="text-[10px] font-mono text-zinc-500 uppercase">Active Sessions</span>
      <div class="text-base sm:text-lg font-bold font-mono text-white" id="sessions-val">12,840</div>
      <span class="text-[10px] text-emerald-400 font-mono">+8.7% &uarr;</span>
    </div>
    <div class="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
      <span class="text-[10px] font-mono text-zinc-500 uppercase">Avg Response</span>
      <div class="text-base sm:text-lg font-bold font-mono text-white">42 ms</div>
      <span class="text-[10px] text-zinc-400 font-mono">Edge Cached</span>
    </div>
    <div class="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
      <span class="text-[10px] font-mono text-zinc-500 uppercase">Error Rate</span>
      <div class="text-base sm:text-lg font-bold font-mono text-white">0.01%</div>
      <span class="text-[10px] text-emerald-400 font-mono">Optimal</span>
    </div>
  </div>

  <!-- Chart Canvas -->
  <div class="p-4 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3 mb-4">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-white">Traffic Trend (Last 7 Days)</span>
      <span class="text-[10px] font-mono text-zinc-400">Events / Hour</span>
    </div>
    <canvas id="chartCanvas" height="140" class="w-full rounded-xl bg-zinc-900/50"></canvas>
  </div>

  <!-- Recent Events Table -->
  <div class="p-4 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2.5">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-white">Recent Telemetry Streams</span>
      <button onclick="exportCSV()" class="text-[11px] text-zinc-400 hover:text-white font-mono">Export CSV</button>
    </div>
    <div class="space-y-1.5" id="events-list">
      <!-- Dynamic list -->
    </div>
  </div>

  <script>
    const events = [
      { type: 'POST /api/checkout', status: 200, time: '1s ago', duration: '34ms' },
      { type: 'GET /dashboard/metrics', status: 200, time: '4s ago', duration: '18ms' },
      { type: 'POST /auth/token', status: 200, time: '12s ago', duration: '45ms' },
      { type: 'GET /v1/telemetry', status: 200, time: '28s ago', duration: '22ms' }
    ];

    function renderEvents() {
      const container = document.getElementById('events-list');
      container.innerHTML = events.map(e => \`
        <div class="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800/80 text-[11px]">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="font-mono text-zinc-200">\${e.type}</span>
          </div>
          <div class="flex items-center gap-3 font-mono text-zinc-400 text-[10px]">
            <span>\${e.duration}</span>
            <span>\${e.time}</span>
          </div>
        </div>
      \`).join('');
    }

    function drawChart() {
      const canvas = document.getElementById('chartCanvas');
      const ctx = canvas.getContext('2d');
      const w = canvas.width = canvas.parentElement.clientWidth * window.devicePixelRatio;
      const h = canvas.height = 140 * window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);
      const points = [20, 35, 28, 60, 52, 78, 65, 90, 84, 98];
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      points.forEach((p, idx) => {
        const x = (idx / (points.length - 1)) * (w - 40) + 20;
        const y = h - (p / 100) * (h - 40) - 20;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw dots
      points.forEach((p, idx) => {
        const x = (idx / (points.length - 1)) * (w - 40) + 20;
        const y = h - (p / 100) * (h - 40) - 20;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function refreshData() {
      document.getElementById('mrr-val').innerText = '$' + (48000 + Math.floor(Math.random() * 2000)).toLocaleString();
      document.getElementById('sessions-val').innerText = (12000 + Math.floor(Math.random() * 1500)).toLocaleString();
      drawChart();
    }

    function exportCSV() {
      alert('Exported telemetry records to CSV.');
    }

    window.addEventListener('resize', drawChart);
    drawChart();
    renderEvents();
  </script>
</body>
</html>`
      }
    }
  },
  {
    id: 'vibe-racer',
    name: 'Neon Cyber Racer 2088',
    description: 'Touch-optimized cyberpunk canvas arcade racer with procedural tracks, turbo boosts, and Web Audio synthesizer.',
    template: 'canvas-game',
    createdAt: 1723740000000,
    updatedAt: 1723750000000,
    activeFilePath: 'index.html',
    envVars: {
      APP_NAME: 'Neon Racer',
      VIBE_LEVEL: 'MAXIMUM',
      NODE_ENV: 'production'
    },
    commits: [
      {
        id: 'c1a89f',
        message: 'feat: high-speed mobile synthwave racer engine',
        timestamp: 1723740000000,
        filesChanged: 3,
        author: 'VibedCoding'
      }
    ],
    files: {
      'index.html': {
        path: 'index.html',
        language: 'html',
        updatedAt: 1723750000000,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Neon Cyber Racer - VibedCoding</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; touch-action: none; user-select: none; }
    body { background: #070913; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; display: flex; flex-direction: column; height: 100vh; }
    #header { padding: 12px 16px; background: rgba(13, 17, 34, 0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.2); display: flex; justify-content: space-between; align-items: center; z-index: 10; }
    .title { font-weight: 800; font-size: 16px; letter-spacing: 1px; color: #fff; }
    .stats { display: flex; gap: 12px; font-size: 13px; font-weight: 600; font-family: monospace; }
    .score { color: #ffffff; }
    .speed { color: #a1a1aa; }
    #game-container { flex: 1; position: relative; width: 100%; height: 100%; }
    canvas { width: 100%; height: 100%; display: block; }
    #touch-controls { position: absolute; bottom: 16px; left: 0; right: 0; padding: 0 16px; display: flex; justify-content: space-between; z-index: 20; }
    .ctrl-btn { width: 68px; height: 68px; border-radius: 20px; background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.4); color: #fff; font-size: 24px; font-weight: bold; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); box-shadow: 0 4px 15px rgba(0,0,0,0.5); active:scale-95 transition: transform 0.1s; }
    .ctrl-btn:active { transform: scale(0.92); background: rgba(255,255,255,0.25); border-color: #fff; }
    .turbo-btn { border-color: rgba(255,255,255,0.6); color: #fff; }
    #overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(8px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 30; gap: 16px; padding: 24px; text-align: center; }
    .glow-btn { padding: 14px 32px; background: #fff; border: none; border-radius: 14px; color: #000; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; cursor: pointer; }
  </style>
</head>
<body>
  <div id="header">
    <div class="title">⚡ NEON RACER '88</div>
    <div class="stats">
      <span class="score" id="score-display">SCORE: 0</span>
      <span class="speed" id="speed-display">120 KM/H</span>
    </div>
  </div>

  <div id="game-container">
    <canvas id="gameCanvas"></canvas>

    <div id="touch-controls">
      <div style="display: flex; gap: 12px;">
        <button class="ctrl-btn" id="btn-left">◀</button>
        <button class="ctrl-btn" id="btn-right">▶</button>
      </div>
      <button class="ctrl-btn turbo-btn" id="btn-turbo">🚀</button>
    </div>

    <div id="overlay">
      <h1 style="font-size: 28px; color: #fff;">VIBEDCODING DRIFT</h1>
      <p style="font-size: 14px; color: #a1a1aa; max-width: 280px;">Tap Left/Right to steer. Hit Turbo to trigger synth hyperdrive!</p>
      <button class="glow-btn" id="start-btn">START RACE</button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score-display');
    const speedEl = document.getElementById('speed-display');
    const overlay = document.getElementById('overlay');
    const startBtn = document.getElementById('start-btn');

    let isRunning = false;
    let score = 0;
    let speed = 120;
    let carX = 0;
    let targetCarX = 0;
    let turboActive = false;
    let obstacles = [];
    let roadOffset = 0;

    let audioCtx = null;
    function playBeep(freq, type = 'sine', duration = 0.1) {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch(e){}
    }

    function resize() {
      canvas.width = canvas.parentElement.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.parentElement.clientHeight * window.devicePixelRatio;
    }
    window.addEventListener('resize', resize);
    resize();

    let steerLeft = false;
    let steerRight = false;
    const btnL = document.getElementById('btn-left');
    const btnR = document.getElementById('btn-right');
    const btnT = document.getElementById('btn-turbo');

    const handleTouch = (btn, setFn) => {
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); setFn(true); playBeep(300, 'triangle', 0.05); });
      btn.addEventListener('touchend', (e) => { e.preventDefault(); setFn(false); });
      btn.addEventListener('mousedown', () => { setFn(true); playBeep(300, 'triangle', 0.05); });
      btn.addEventListener('mouseup', () => setFn(false));
      btn.addEventListener('mouseleave', () => setFn(false));
    };

    handleTouch(btnL, (v) => steerLeft = v);
    handleTouch(btnR, (v) => steerRight = v);
    handleTouch(btnT, (v) => {
      turboActive = v;
      if (v) playBeep(580, 'sawtooth', 0.25);
    });

    startBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
      isRunning = true;
      score = 0;
      obstacles = [];
      carX = 0;
      targetCarX = 0;
      playBeep(440, 'square', 0.15);
      requestAnimationFrame(gameLoop);
    });

    function spawnObstacle() {
      if (Math.random() < 0.035) {
        obstacles.push({
          x: (Math.random() * 2 - 1) * 0.7,
          z: 1000,
          color: '#ffffff',
          width: 0.25
        });
      }
    }

    function gameLoop() {
      if (!isRunning) return;
      const w = canvas.width;
      const h = canvas.height;

      const currentSpeed = turboActive ? 220 : 120;
      speed = currentSpeed;
      score += turboActive ? 4 : 2;
      scoreEl.innerText = 'SCORE: ' + score;
      speedEl.innerText = speed + ' KM/H';

      if (steerLeft) targetCarX -= 0.035;
      if (steerRight) targetCarX += 0.035;
      targetCarX = Math.max(-0.8, Math.min(0.8, targetCarX));
      carX += (targetCarX - carX) * 0.18;

      spawnObstacle();

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      const horizonY = h * 0.45;
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, w, horizonY);

      // Road Perspective
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.moveTo(w * 0.4, horizonY);
      ctx.lineTo(w * 0.6, horizonY);
      ctx.lineTo(w * 0.95, h);
      ctx.lineTo(w * 0.05, h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Road Segments
      for (let i = 0; i < 15; i++) {
        const y = horizonY + Math.pow(i / 15, 2) * (h - horizonY);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(w * 0.5 - (w * 0.4 * (y - horizonY) / (h - horizonY)), y);
        ctx.lineTo(w * 0.5 + (w * 0.4 * (y - horizonY) / (h - horizonY)), y);
        ctx.stroke();
      }

      // Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const ob = obstacles[i];
        ob.z -= currentSpeed * 0.12;

        if (ob.z <= 0) {
          const screenCarX = (carX + 1) * 0.5;
          const obScreenX = (ob.x + 1) * 0.5;
          if (Math.abs(screenCarX - obScreenX) < 0.15) {
            playBeep(120, 'sawtooth', 0.4);
            isRunning = false;
            overlay.innerHTML = \`
              <h1 style="font-size: 28px; color: #fff;">SYSTEM CRASH</h1>
              <p style="font-size: 16px; color: #a1a1aa;">FINAL SCORE: \${score}</p>
              <button class="glow-btn" id="retry-btn">RETRY RUN</button>
            \`;
            overlay.style.display = 'flex';
            document.getElementById('retry-btn').addEventListener('click', () => {
              overlay.style.display = 'none';
              isRunning = true;
              score = 0;
              obstacles = [];
              carX = 0;
              targetCarX = 0;
              requestAnimationFrame(gameLoop);
            });
            return;
          }
          obstacles.splice(i, 1);
          continue;
        }

        const scale = (1000 - ob.z) / 1000;
        const obY = horizonY + Math.pow(scale, 2) * (h - horizonY);
        const roadW = (w * 0.8) * Math.pow(scale, 2);
        const obX = w * 0.5 + ob.x * (roadW * 0.5);
        const obSize = 30 * scale;

        ctx.fillStyle = '#71717a';
        ctx.fillRect(obX - obSize * 0.5, obY - obSize, obSize, obSize);
      }

      // Player Car
      const playerY = h * 0.82;
      const playerX = w * 0.5 + carX * (w * 0.38);
      const carW = 64;
      const carH = 34;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(playerX - carW * 0.5, playerY - carH * 0.5, carW, carH, 8);
      ctx.fill();

      requestAnimationFrame(gameLoop);
    }
  </script>
</body>
</html>`
      },
      'package.json': {
        path: 'package.json',
        language: 'json',
        updatedAt: 1723750000000,
        content: JSON.stringify({
          name: 'neon-cyber-racer',
          version: '2.0.0',
          private: true,
          scripts: {
            start: 'node server.js',
            dev: 'node server.js'
          },
          dependencies: {
            express: '^4.19.2'
          }
        }, null, 2)
      }
    }
  },
  {
    id: 'vibe-ideas',
    name: 'AI Voice Notes & Idea Matrix',
    description: 'Mobile audio journal with instant speech-to-text, mood tagging, AI concept expansion, and markdown sync.',
    template: 'utility-app',
    createdAt: 1723730000000,
    updatedAt: 1723750000000,
    activeFilePath: 'index.html',
    envVars: {
      APP_NAME: 'Idea Matrix',
      STORAGE_KEY: 'vibe_ideas_v1'
    },
    commits: [
      {
        id: '9b2c3d',
        message: 'feat: mobile voice memos & instant tag filtering',
        timestamp: 1723730000000,
        filesChanged: 2,
        author: 'VibedCoding'
      }
    ],
    files: {
      'index.html': {
        path: 'index.html',
        language: 'html',
        updatedAt: 1723750000000,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Vibe Notes & Idea Matrix - VibedCoding</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { background: #000000; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }
    .pulse-record { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .7; transform: scale(1.08); } }
  </style>
</head>
<body class="min-h-screen flex flex-col pb-24 bg-black text-zinc-100">
  <header class="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
        <i class="fa-solid fa-brain text-sm"></i>
      </div>
      <div>
        <h1 class="text-sm font-bold tracking-tight text-white">IDEA MATRIX</h1>
        <p class="text-[10px] font-mono text-zinc-400">VIBEDCODING // V2.0</p>
      </div>
    </div>
    <span id="note-count" class="text-xs px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 font-mono border border-zinc-800">0 Notes</span>
  </header>

  <div class="px-4 py-2.5 flex gap-2 overflow-x-auto no-scrollbar border-b border-zinc-800 bg-zinc-950">
    <button onclick="filterNotes('all')" class="tag-btn active text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-800 text-white border border-zinc-600 shrink-0">All Ideas</button>
    <button onclick="filterNotes('startup')" class="tag-btn text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-900 text-zinc-400 border border-zinc-800 shrink-0">🚀 Startup</button>
    <button onclick="filterNotes('code')" class="tag-btn text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-900 text-zinc-400 border border-zinc-800 shrink-0">⚡ Code</button>
    <button onclick="filterNotes('product')" class="tag-btn text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-900 text-zinc-400 border border-zinc-800 shrink-0">💡 Product</button>
  </div>

  <main class="flex-1 px-4 py-4 space-y-3" id="notes-container">
  </main>

  <div class="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-2.5 shadow-2xl flex items-center gap-2">
    <button id="mic-btn" onclick="toggleVoice()" class="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center shrink-0 active:scale-95 transition-all">
      <i class="fa-solid fa-microphone text-base" id="mic-icon"></i>
    </button>
    <input id="note-input" type="text" placeholder="Type or dictate an idea..." class="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500" onkeydown="if(event.key==='Enter') saveNote()">
    <button onclick="saveNote()" class="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center shrink-0 active:scale-95 transition-all">
      <i class="fa-solid fa-arrow-up text-xs"></i>
    </button>
  </div>

  <script>
    let notes = JSON.parse(localStorage.getItem('vibe_notes') || '[]');
    if (notes.length === 0) {
      notes = [
        { id: 1, text: "Build a micro-SaaS with Next.js 15 and VibedCoding agent integration.", tag: "startup", time: "Just now" },
        { id: 2, text: "Use Web Audio API for feedback on tactile mobile button presses.", tag: "code", time: "10m ago" }
      ];
    }

    let currentFilter = 'all';

    function renderNotes() {
      const container = document.getElementById('notes-container');
      const filtered = currentFilter === 'all' ? notes : notes.filter(n => n.tag === currentFilter);
      document.getElementById('note-count').innerText = notes.length + ' Notes';

      if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center py-16 text-zinc-500 text-xs">No notes found in this category.</div>';
        return;
      }

      container.innerHTML = filtered.map(note => \`
        <div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 uppercase tracking-wider">#\${note.tag}</span>
            <span class="text-[10px] text-zinc-500 font-mono">\${note.time}</span>
          </div>
          <p class="text-xs text-zinc-200 leading-relaxed">\${note.text}</p>
          <div class="pt-1.5 border-t border-zinc-800 flex justify-end">
            <button onclick="deleteNote(\${note.id})" class="text-[11px] text-zinc-400 hover:text-white">Delete</button>
          </div>
        </div>
      \`).join('');
    }

    function saveNote() {
      const input = document.getElementById('note-input');
      const text = input.value.trim();
      if (!text) return;

      const tags = ['startup', 'code', 'product'];
      const randomTag = tags[Math.floor(Math.random() * tags.length)];

      notes.unshift({
        id: Date.now(),
        text: text,
        tag: randomTag,
        time: 'Just now'
      });

      localStorage.setItem('vibe_notes', JSON.stringify(notes));
      input.value = '';
      renderNotes();
    }

    function deleteNote(id) {
      notes = notes.filter(n => n.id !== id);
      localStorage.setItem('vibe_notes', JSON.stringify(notes));
      renderNotes();
    }

    function filterNotes(tag) {
      currentFilter = tag;
      document.querySelectorAll('.tag-btn').forEach(b => {
        b.classList.remove('bg-zinc-800', 'text-white', 'border-zinc-600');
        b.classList.add('bg-zinc-900', 'text-zinc-400', 'border-zinc-800');
      });
      event.target.classList.add('bg-zinc-800', 'text-white', 'border-zinc-600');
      event.target.classList.remove('bg-zinc-900', 'text-zinc-400');
      renderNotes();
    }

    function toggleVoice() {
      const input = document.getElementById('note-input');
      input.value = "New feature idea logged via VibedCoding voice assistant";
      saveNote();
    }

    renderNotes();
  </script>
</body>
</html>`
      }
    }
  },
  {
    id: 'blank-tailwind',
    name: 'Minimal Tailwind Clean Skeleton',
    description: 'Clean, lightning-fast starter shell with Tailwind CSS v4, touch button interactions, and responsive layout.',
    template: 'blank-tailwind',
    createdAt: 1723730000000,
    updatedAt: 1723750000000,
    activeFilePath: 'index.html',
    envVars: {
      APP_NAME: 'Vibed Skeleton'
    },
    commits: [
      {
        id: 'b1a2c3',
        message: 'feat: minimal starter shell',
        timestamp: 1723730000000,
        filesChanged: 1,
        author: 'VibedCoding'
      }
    ],
    files: {
      'index.html': {
        path: 'index.html',
        language: 'html',
        updatedAt: 1723750000000,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Minimal App - VibedCoding</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #000000; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black text-zinc-100">
  <div class="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl max-w-sm w-full space-y-4">
    <div class="w-12 h-12 mx-auto rounded-2xl bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center text-xl font-bold">
      ✨
    </div>
    <h1 class="text-lg font-bold text-white">VibedCoding Skeleton</h1>
    <p class="text-xs text-zinc-400">Ready for vibe coding with the AI agent!</p>
    <button onclick="alert('Vibe coded with VibedCoding!')" class="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition-all active:scale-95">
      Test Touch Action
    </button>
  </div>
</body>
</html>`
      }
    }
  }
];

export const VIBE_PRESETS = [
  {
    id: 'mobile-opt',
    label: '📱 Mobile Touch Polish',
    icon: 'Smartphone',
    prompt: 'Refactor the UI to be 100% thumb-friendly for phone screens with haptic feedback, 48px touch targets, and bottom sheet dialogs.',
    category: 'design'
  },
  {
    id: 'add-audio',
    label: '🎵 Web Audio FX',
    icon: 'Volume2',
    prompt: 'Add reactive synthesizer sound effects (sine/sawtooth chimes) using the Web Audio API on clicks, scores, and interactions.',
    category: 'feature'
  },
  {
    id: 'clean-architecture',
    label: '⚡ Next.js & Clean Architecture',
    icon: 'Layers',
    prompt: 'Refactor this project with clean modular architecture, reactive state synchronization, defensive error boundaries, and optimal mobile performance.',
    category: 'feature'
  },
  {
    id: 'fix-bugs',
    label: '🐛 Surgical Debug & Lint',
    icon: 'Bug',
    prompt: 'Inspect current project files, fix any console errors, optimize performance, and ensure smooth 60fps rendering on mobile browsers.',
    category: 'fix'
  }
];
