import { NextResponse } from 'next/server';

export async function GET() {
  const memory = process.memoryUsage();
  const uptime = process.uptime();

  return NextResponse.json({
    status: 'online',
    version: 'Antigravity 2.0 Mobile Engine',
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: {
      rssMb: Math.round(memory.rss / 1024 / 1024),
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
    },
    uptimeSeconds: Math.round(uptime),
    vpsReady: true,
    capabilities: [
      'Gemini 3.7 Flash Agent',
      'Mobile Keyboard Bar',
      'Live Web Sandbox',
      'Virtual Terminal',
      'Docker & PM2 Export'
    ]
  });
}
