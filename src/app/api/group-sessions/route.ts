import { NextRequest, NextResponse } from 'next/server';
import { GroupSession } from '@/types/menu';
import { sessions, setSession, getSession, isSessionExpired, deleteSession } from '@/lib/sessionStorage';

export async function POST(request: NextRequest) {
  try {
    const sessionData: GroupSession = await request.json();
    
    // Validate required fields
    if (!sessionData.id || !sessionData.hostId || !sessionData.hostName) {
      return NextResponse.json(
        { error: 'Missing required session fields' },
        { status: 400 }
      );
    }

    // Store session
    setSession(sessionData.id, sessionData);
    
    console.log(`Created group session: ${sessionData.id} by ${sessionData.hostName}`);
    
    return NextResponse.json(sessionData, { status: 201 });
  } catch (error) {
    console.error('Error creating group session:', error);
    return NextResponse.json(
      { error: 'Failed to create group session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');
    
    if (sessionId) {
      // Get specific session
      const session = getSession(sessionId);
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
      
      // Check if session is expired
      if (isSessionExpired(session)) {
        deleteSession(sessionId);
        return NextResponse.json(
          { error: 'Session has expired' },
          { status: 410 }
        );
      }
      
      return NextResponse.json(session);
    } else {
      // List all active sessions (for admin/debugging)
      const activeSessions = Array.from(sessions.values())
        .filter(session => !isSessionExpired(session));
      
      return NextResponse.json({
        sessions: activeSessions.map(session => ({
          id: session.id,
          hostName: session.hostName,
          participantCount: session.participants.length,
          status: session.status,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt
        }))
      });
    }
  } catch (error) {
    console.error('Error fetching group sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}