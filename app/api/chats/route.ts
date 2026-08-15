import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage } from '@/lib/types';

// In-memory persistent server store for chat histories
// Seeded with initial clean starter chat history
let serverChatStore: Record<string, ChatMessage[]> = {
  'vibe-racer': [
    {
      id: 'msg-init-1',
      role: 'agent',
      content: "👋 Welcome to Antigravity 2.0 Mobile Vibe Coder! I've loaded your Neon Cyber Racer project. Tap the live preview to test the game, edit files directly, or ask me for new features.",
      timestamp: 1723750000000,
      modelUsed: 'gemini-3.7-flash',
      thinking: 'Initialized mobile workspace with HTML5 canvas game loop, Web Audio synthesizer, and touch controls.'
    }
  ],
  'vibe-ideas': [
    {
      id: 'msg-init-2',
      role: 'agent',
      content: "⚡ Idea Matrix is ready for phone vibe coding. You can dictate notes via voice, organize tags, or ask me to add features.",
      timestamp: 1723750000000,
      modelUsed: 'gemini-3.7-flash'
    }
  ]
};

let lastSyncedAt = Date.now();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (projectId) {
    return NextResponse.json({
      success: true,
      projectId,
      messages: serverChatStore[projectId] || [],
      lastSyncedAt
    });
  }

  let totalMessageCount = 0;
  for (const msgs of Object.values(serverChatStore)) {
    totalMessageCount += msgs.length;
  }

  return NextResponse.json({
    success: true,
    chats: serverChatStore,
    totalMessages: totalMessageCount,
    lastSyncedAt
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, messages, allChats } = body;

    if (allChats && typeof allChats === 'object') {
      serverChatStore = { ...serverChatStore, ...allChats };
      lastSyncedAt = Date.now();
      return NextResponse.json({
        success: true,
        message: 'All chats synced successfully to server',
        lastSyncedAt,
        chats: serverChatStore
      });
    }

    if (projectId && Array.isArray(messages)) {
      serverChatStore[projectId] = messages;
      lastSyncedAt = Date.now();
      return NextResponse.json({
        success: true,
        message: `Chat history for ${projectId} synced to server`,
        projectId,
        messageCount: messages.length,
        lastSyncedAt
      });
    }

    return NextResponse.json(
      { error: 'Invalid payload: provide projectId with messages or allChats object' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to sync chats' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (projectId) {
    delete serverChatStore[projectId];
    lastSyncedAt = Date.now();
    return NextResponse.json({
      success: true,
      message: `Cleared chat history for project ${projectId}`,
      lastSyncedAt
    });
  }

  // Clear all
  serverChatStore = {};
  lastSyncedAt = Date.now();
  return NextResponse.json({
    success: true,
    message: 'Cleared all server chat histories',
    lastSyncedAt
  });
}
