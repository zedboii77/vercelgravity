import { NextRequest, NextResponse } from 'next/server';
import { UserProfile } from '@/lib/types';

// Server-side user profile store
let serverUserProfile: UserProfile = {
  name: 'Mobile Vibe Coder',
  email: 'zedboii77@gmail.com',
  role: 'Full-Stack Creator',
  vibeStyle: 'builder',
  soundEnabled: true,
  totalPromptsSent: 14,
  totalFilesGenerated: 28,
  joinedAt: 1723750000000,
  lastActiveAt: Date.now()
};

export async function GET() {
  serverUserProfile.lastActiveAt = Date.now();
  return NextResponse.json({
    success: true,
    user: serverUserProfile
  });
}

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();
    serverUserProfile = {
      ...serverUserProfile,
      ...updates,
      lastActiveAt: Date.now()
    };

    return NextResponse.json({
      success: true,
      user: serverUserProfile,
      message: 'Profile and preferences synced to server'
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
