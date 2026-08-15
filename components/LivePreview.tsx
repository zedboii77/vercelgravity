'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Project } from '@/lib/types';
import { 
  RotateCw, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Terminal, 
  ExternalLink, 
  Maximize2, 
  Play, 
  CheckCircle,
  AlertTriangle,
  Info,
  Bug
} from 'lucide-react';
import { playVibeTone } from '@/lib/audio';

interface LivePreviewProps {
  project: Project;
  soundEnabled: boolean;
}

type DeviceMode = 'mobile-iphone' | 'mobile-pixel' | 'tablet' | 'full';

interface ConsoleLog {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export function LivePreview({ project, soundEnabled }: LivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile-iphone');
  const [isLandscape, setIsLandscape] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate bundled HTML string for the iframe
  const generatePreviewSrcDoc = () => {
    let mainHtml = project.files['index.html']?.content || '';

    if (!mainHtml) {
      mainHtml = `
        <!DOCTYPE html>
        <html>
        <head><style>body{background:#0a0e1a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}</style></head>
        <body><h3>No index.html found in project</h3></body>
        </html>
      `;
    }

    // Inject console capturing script into iframe head
    const consoleCaptureScript = `
      <script>
        (function() {
          const originalLog = console.log;
          const originalWarn = console.warn;
          const originalError = console.error;
          const originalInfo = console.info;

          function sendLog(type, args) {
            try {
              const msg = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
              window.parent.postMessage({ type: 'antigravity-console', logType: type, message: msg }, '*');
            } catch(e) {}
          }

          console.log = function() { sendLog('log', arguments); originalLog.apply(console, arguments); };
          console.warn = function() { sendLog('warn', arguments); originalWarn.apply(console, arguments); };
          console.error = function() { sendLog('error', arguments); originalError.apply(console, arguments); };
          console.info = function() { sendLog('info', arguments); originalInfo.apply(console, arguments); };

          window.onerror = function(msg, url, line) {
            sendLog('error', [msg + ' (line ' + line + ')']);
          };
        })();
      </script>
    `;

    return mainHtml.replace('<head>', `<head>${consoleCaptureScript}`);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'antigravity-console') {
        setConsoleLogs((prev) => [
          ...prev.slice(-40),
          {
            id: `${Date.now()}-${Math.random()}`,
            type: event.data.logType || 'log',
            message: event.data.message || '',
            timestamp: new Date().toLocaleTimeString().split(' ')[0]
          }
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setConsoleLogs([]);
    if (soundEnabled) playVibeTone('tap');
  };

  const getDeviceDimensions = () => {
    if (deviceMode === 'full') return 'w-full h-full';

    let width = 393;
    let height = 852;

    if (deviceMode === 'mobile-pixel') {
      width = 412;
      height = 890;
    } else if (deviceMode === 'tablet') {
      width = 768;
      height = 1024;
    }

    if (isLandscape) {
      const temp = width;
      width = height;
      height = temp;
    }

    return {
      maxWidth: `${width}px`,
      maxHeight: `${height}px`,
      aspectRatio: `${width}/${height}`
    };
  };

  const dimensions = getDeviceDimensions();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050811] overflow-hidden">
      {/* Top Preview Controls */}
      <div className="bg-[#0b101e] border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 shrink-0 select-none">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => { setDeviceMode('mobile-iphone'); if (soundEnabled) playVibeTone('tap'); }}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === 'mobile-iphone'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="iPhone 16 Pro (393px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => { setDeviceMode('tablet'); if (soundEnabled) playVibeTone('tap'); }}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === 'tablet'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => { setDeviceMode('full'); if (soundEnabled) playVibeTone('tap'); }}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === 'full'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Full Screen Viewport"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              showConsole
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Bug className="w-3 h-3" />
            <span className="text-[11px]">{consoleLogs.length}</span>
          </button>

          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-90 transition-all"
            title="Reload Sandbox"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Live Iframe Sandbox Container */}
      <div className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden pb-20">
        <div
          style={typeof dimensions === 'object' ? dimensions : undefined}
          className={`w-full h-full rounded-2xl sm:rounded-3xl border-2 border-slate-800/80 bg-black shadow-2xl overflow-hidden relative flex flex-col transition-all duration-200 ${
            typeof dimensions === 'string' ? dimensions : ''
          }`}
        >
          {/* Mobile Bezel Header if simulated device */}
          {deviceMode !== 'full' && (
            <div className="h-4 bg-[#0a0e1c] flex items-center justify-center shrink-0">
              <div className="w-16 h-2 bg-slate-800 rounded-full" />
            </div>
          )}

          <iframe
            key={refreshKey}
            ref={iframeRef}
            srcDoc={generatePreviewSrcDoc()}
            title="Antigravity 2.0 Live Preview Sandbox"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full flex-1 border-none bg-[#070913]"
          />
        </div>
      </div>

      {/* Live Console Drawer */}
      {showConsole && (
        <div className="bg-[#0b0f1e] border-t border-slate-800 max-h-44 flex flex-col shrink-0 shadow-2xl z-30 pb-20">
          <div className="px-3 py-1.5 bg-slate-900 flex items-center justify-between border-b border-slate-800 text-[11px] font-mono font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>LIVE BROWSER CONSOLE</span>
            </div>
            <button
              onClick={() => setConsoleLogs([])}
              className="text-[10px] text-slate-400 hover:text-slate-200"
            >
              Clear Logs
            </button>
          </div>

          <div className="p-2 overflow-y-auto font-mono text-[11px] space-y-1 bg-black/60 flex-1">
            {consoleLogs.length === 0 ? (
              <div className="text-slate-600 text-center py-3">No console messages logged yet.</div>
            ) : (
              consoleLogs.map((log) => (
                <div
                  key={log.id}
                  className={`px-1.5 py-0.5 rounded flex items-start gap-1.5 ${
                    log.type === 'error'
                      ? 'text-rose-400 bg-rose-500/10'
                      : log.type === 'warn'
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 text-[9px] shrink-0">{log.timestamp}</span>
                  <span className="break-all">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
