import { Project } from './types';

export const STARTER_PROJECTS: Project[] = [
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
        message: 'feat: initial high-speed mobile synthwave racer engine',
        timestamp: 1723740000000,
        filesChanged: 3,
        author: 'Antigravity 2.0'
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
  <title>Neon Cyber Racer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; touch-action: none; user-select: none; }
    body { background: #070913; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; display: flex; flex-direction: column; height: 100vh; }
    #header { padding: 12px 16px; background: rgba(13, 17, 34, 0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 0, 128, 0.3); display: flex; justify-content: space-between; align-items: center; z-index: 10; }
    .title { font-weight: 800; font-size: 16px; letter-spacing: 1px; color: #ff007f; text-shadow: 0 0 10px rgba(255,0,127,0.5); }
    .stats { display: flex; gap: 12px; font-size: 13px; font-weight: 600; font-family: monospace; }
    .score { color: #00f0ff; text-shadow: 0 0 8px rgba(0,240,255,0.4); }
    .speed { color: #ffe600; }
    #game-container { flex: 1; position: relative; width: 100%; height: 100%; }
    canvas { width: 100%; height: 100%; display: block; }
    #touch-controls { position: absolute; bottom: 16px; left: 0; right: 0; padding: 0 16px; display: flex; justify-content: space-between; z-index: 20; }
    .ctrl-btn { width: 68px; height: 68px; border-radius: 20px; background: rgba(255,255,255,0.08); border: 2px solid rgba(0,240,255,0.4); color: #00f0ff; font-size: 24px; font-weight: bold; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); box-shadow: 0 4px 15px rgba(0,0,0,0.5); active:scale-95 transition: transform 0.1s; }
    .ctrl-btn:active { transform: scale(0.92); background: rgba(0,240,255,0.25); border-color: #00f0ff; }
    .turbo-btn { border-color: rgba(255,0,127,0.5); color: #ff007f; }
    .turbo-btn:active { background: rgba(255,0,127,0.3); border-color: #ff007f; }
    #overlay { position: absolute; inset: 0; background: rgba(7, 9, 19, 0.88); backdrop-filter: blur(8px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 30; gap: 16px; padding: 24px; text-align: center; }
    .glow-btn { padding: 14px 32px; background: linear-gradient(135deg, #ff007f, #7928ca); border: none; border-radius: 14px; color: #fff; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; cursor: pointer; box-shadow: 0 0 25px rgba(255,0,127,0.6); }
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
      <h1 style="font-size: 28px; color: #00f0ff; text-shadow: 0 0 15px rgba(0,240,255,0.7);">ANTIGRAVITY DRIFT</h1>
      <p style="font-size: 14px; color: #94a3b8; max-width: 280px;">Tap Left/Right or tilt your phone to steer. Hit Turbo to trigger synth hyperdrive!</p>
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
    let particles = [];
    let roadOffset = 0;

    // Audio synth
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

    // Input handlers
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

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') steerLeft = true;
      if (e.key === 'ArrowRight' || e.key === 'd') steerRight = true;
      if (e.key === ' ' || e.key === 'Shift') turboActive = true;
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') steerLeft = false;
      if (e.key === 'ArrowRight' || e.key === 'd') steerRight = false;
      if (e.key === ' ' || e.key === 'Shift') turboActive = false;
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
          color: Math.random() > 0.5 ? '#ff0055' : '#00f0ff',
          width: 0.25
        });
      }
    }

    function gameLoop() {
      if (!isRunning) return;

      const w = canvas.width;
      const h = canvas.height;

      // Update
      const currentSpeed = turboActive ? 220 : 120;
      speed = currentSpeed;
      score += turboActive ? 4 : 2;
      scoreEl.innerText = 'SCORE: ' + score;
      speedEl.innerText = speed + ' KM/H';

      if (steerLeft) targetCarX -= 0.035;
      if (steerRight) targetCarX += 0.035;
      targetCarX = Math.max(-0.8, Math.min(0.8, targetCarX));
      carX += (targetCarX - carX) * 0.18;

      roadOffset = (roadOffset + currentSpeed * 0.02) % 40;
      spawnObstacle();

      // Clear Canvas
      ctx.fillStyle = '#070913';
      ctx.fillRect(0, 0, w, h);

      // Cyber Grid Horizon
      const horizonY = h * 0.45;
      const gradient = ctx.createLinearGradient(0, 0, 0, horizonY);
      gradient.addColorStop(0, '#0c0f24');
      gradient.addColorStop(1, '#2b0938');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, horizonY);

      // Glowing Sun
      ctx.beginPath();
      ctx.arc(w * 0.5, horizonY - 10, w * 0.18, Math.PI, 0);
      const sunGrad = ctx.createLinearGradient(0, horizonY - w * 0.18, 0, horizonY);
      sunGrad.addColorStop(0, '#ff007f');
      sunGrad.addColorStop(1, '#ffe600');
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Road Perspective
      ctx.fillStyle = '#0f1424';
      ctx.beginPath();
      ctx.moveTo(w * 0.4, horizonY);
      ctx.lineTo(w * 0.6, horizonY);
      ctx.lineTo(w * 0.95, h);
      ctx.lineTo(w * 0.05, h);
      ctx.closePath();
      ctx.fill();

      // Road Borders & Grid Lines
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Road Segments
      for (let i = 0; i < 15; i++) {
        const y = horizonY + Math.pow(i / 15, 2) * (h - horizonY);
        const yNext = horizonY + Math.pow((i + 0.5) / 15, 2) * (h - horizonY);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 0, 128, 0.4)' : 'rgba(0, 240, 255, 0.2)';
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
          // Check collision
          const screenCarX = (carX + 1) * 0.5;
          const obScreenX = (ob.x + 1) * 0.5;
          if (Math.abs(screenCarX - obScreenX) < 0.15) {
            // Collision!
            playBeep(120, 'sawtooth', 0.4);
            isRunning = false;
            overlay.innerHTML = \`
              <h1 style="font-size: 28px; color: #ff0055;">SYSTEM CRASH</h1>
              <p style="font-size: 16px; color: #00f0ff;">FINAL SCORE: \${score}</p>
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

        ctx.fillStyle = ob.color;
        ctx.shadowColor = ob.color;
        ctx.shadowBlur = 15;
        ctx.fillRect(obX - obSize * 0.5, obY - obSize, obSize, obSize);
        ctx.shadowBlur = 0;
      }

      // Player Hovercraft
      const playerY = h * 0.82;
      const playerX = w * 0.5 + carX * (w * 0.38);
      const carW = 64;
      const carH = 34;

      // Thruster Flame
      ctx.fillStyle = turboActive ? '#ffe600' : '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(playerX - 12, playerY + carH * 0.5);
      ctx.lineTo(playerX + 12, playerY + carH * 0.5);
      ctx.lineTo(playerX, playerY + carH * 0.5 + (turboActive ? 30 : 15) + Math.random() * 8);
      ctx.closePath();
      ctx.fill();

      // Car Body
      ctx.fillStyle = '#ff007f';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(playerX - carW * 0.5, playerY - carH * 0.5, carW, carH, 8);
      ctx.fill();

      // Cockpit Glow
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();
      ctx.roundRect(playerX - 14, playerY - 10, 28, 16, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

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
      },
      'server.js': {
        path: 'server.js',
        language: 'javascript',
        updatedAt: 1723750000000,
        content: `// Antigravity 2.0 VPS Production Server
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), vibe: 'maximum' });
});

app.listen(PORT, () => {
  console.log(\`⚡ Neon Racer running on http://localhost:\${PORT}\`);
});`
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
        author: 'Antigravity 2.0'
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
  <title>Vibe Notes & Idea Matrix</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { background: #0b0f19; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }
    .pulse-record { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .7; transform: scale(1.08); } }
  </style>
</head>
<body class="min-h-screen flex flex-col pb-24">
  <!-- Top Bar -->
  <header class="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
        <i class="fa-solid fa-brain text-sm"></i>
      </div>
      <div>
        <h1 class="text-base font-bold tracking-tight text-white">IDEA MATRIX</h1>
        <p class="text-[10px] font-mono text-cyan-400">VIBE MEMOS // V2.0</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span id="note-count" class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">0 Notes</span>
    </div>
  </header>

  <!-- Tag Filter Chips -->
  <div class="px-4 py-2.5 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-800/50 bg-[#0d1322]">
    <button onclick="filterNotes('all')" class="tag-btn active text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shrink-0">All Vibes</button>
    <button onclick="filterNotes('startup')" class="tag-btn text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">🚀 Startup</button>
    <button onclick="filterNotes('code')" class="tag-btn text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">⚡ Code</button>
    <button onclick="filterNotes('shower-thought')" class="tag-btn text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">💡 Shower Thought</button>
  </div>

  <!-- Notes List -->
  <main class="flex-1 px-4 py-4 space-y-3" id="notes-container">
    <!-- Dynamic Cards -->
  </main>

  <!-- Bottom Floating Voice & Input Bar -->
  <div class="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40 bg-[#151c2e]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl shadow-black/80 flex items-center gap-2">
    <button id="mic-btn" onclick="toggleVoice()" class="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/30 active:scale-95 transition-all">
      <i class="fa-solid fa-microphone text-lg" id="mic-icon"></i>
    </button>
    <input id="note-input" type="text" placeholder="Type or dictate a vibe idea..." class="flex-1 bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" onkeydown="if(event.key==='Enter') saveNote()">
    <button onclick="saveNote()" class="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 font-bold flex items-center justify-center shrink-0 active:scale-95 transition-all">
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  </div>

  <script>
    let notes = JSON.parse(localStorage.getItem('vibe_notes') || '[]');
    if (notes.length === 0) {
      notes = [
        { id: 1, text: "Build a micro-SaaS for mobile vibe coders with one-click VPS deployment.", tag: "startup", time: "Just now", color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/30" },
        { id: 2, text: "Use Web Audio API to create retro 8-bit sound effects on button clicks.", tag: "code", time: "10m ago", color: "from-purple-500/10 to-pink-500/10 border-purple-500/30" },
        { id: 3, text: "What if code editors had a dedicated thumb dial for selecting variables?", tag: "shower-thought", time: "1h ago", color: "from-amber-500/10 to-orange-500/10 border-amber-500/30" }
      ];
    }

    let currentFilter = 'all';
    let isRecording = false;

    function renderNotes() {
      const container = document.getElementById('notes-container');
      const filtered = currentFilter === 'all' ? notes : notes.filter(n => n.tag === currentFilter);
      document.getElementById('note-count').innerText = \`\${notes.length} Notes\`;

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="text-center py-16 text-slate-500">
            <i class="fa-solid fa-feather text-3xl mb-2 opacity-40"></i>
            <p class="text-sm">No notes found in this vibe category.</p>
          </div>\`;
        return;
      }

      container.innerHTML = filtered.map(note => \`
        <div class="bg-gradient-to-r \${note.color || 'from-slate-800/40 to-slate-800/20 border-slate-700/60'} border rounded-2xl p-4 shadow-sm relative group">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 uppercase tracking-wider">#\${note.tag}</span>
            <span class="text-[11px] text-slate-500 font-mono">\${note.time}</span>
          </div>
          <p class="text-sm text-slate-200 leading-relaxed">\${note.text}</p>
          <div class="mt-3 pt-2 border-t border-slate-800/40 flex justify-end gap-2">
            <button onclick="deleteNote(\${note.id})" class="text-xs text-rose-400/80 hover:text-rose-400 px-2 py-1 rounded">
              <i class="fa-solid fa-trash-can mr-1"></i> Delete
            </button>
          </div>
        </div>
      \`).join('');
    }

    function saveNote() {
      const input = document.getElementById('note-input');
      const text = input.value.trim();
      if (!text) return;

      const tags = ['startup', 'code', 'shower-thought'];
      const randomTag = tags[Math.floor(Math.random() * tags.length)];

      const newNote = {
        id: Date.now(),
        text: text,
        tag: randomTag,
        time: 'Just now',
        color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30'
      };

      notes.unshift(newNote);
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
        b.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/40');
        b.classList.add('bg-slate-800', 'text-slate-400', 'border-slate-700/60');
      });
      event.target.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/40');
      event.target.classList.remove('bg-slate-800', 'text-slate-400');
      renderNotes();
    }

    function toggleVoice() {
      const micBtn = document.getElementById('mic-btn');
      const micIcon = document.getElementById('mic-icon');
      const input = document.getElementById('note-input');

      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        input.value = "Speech recognition is active in vibe simulation mode: 'Next big app idea!'";
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (!isRecording) {
        recognition.start();
        isRecording = true;
        micBtn.classList.add('pulse-record', 'ring-4', 'ring-rose-500/40');
        micIcon.className = "fa-solid fa-stop text-lg";

        recognition.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
          input.value = transcript;
          saveNote();
        };

        recognition.onend = () => {
          isRecording = false;
          micBtn.classList.remove('pulse-record', 'ring-4', 'ring-rose-500/40');
          micIcon.className = "fa-solid fa-microphone text-lg";
        };
      } else {
        recognition.stop();
        isRecording = false;
        micBtn.classList.remove('pulse-record', 'ring-4', 'ring-rose-500/40');
        micIcon.className = "fa-solid fa-microphone text-lg";
      }
    }

    renderNotes();
  </script>
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
    id: 'cyberpunk-dark',
    label: '✨ Cyberpunk Glow',
    icon: 'Sparkles',
    prompt: 'Re-theme this app with a dark cyberpunk neon aesthetic: glowing cyan (#00f0ff), hot pink (#ff007f), dark slate backgrounds, and glassmorphic panels.',
    category: 'design'
  },
  {
    id: 'fix-bugs',
    label: '🐛 Surgical Debug & Lint',
    icon: 'Bug',
    prompt: 'Inspect current project files, fix any console errors, optimize performance, and ensure smooth 60fps rendering on mobile browsers.',
    category: 'fix'
  },
  {
    id: 'vps-deploy',
    label: '🚀 Generate VPS Deploy Config',
    icon: 'Server',
    prompt: 'Write an optimized Dockerfile, docker-compose.yml, and PM2 ecosystem config so I can deploy this project onto my Ubuntu VPS with a single curl command.',
    category: 'devops'
  }
];
