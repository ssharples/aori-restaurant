import { NextRequest, NextResponse } from 'next/server';
import { GroupSession, GroupSessionSettings } from '@/types/menu';

// In-memory storage for demo purposes
// In production, this should use a database like PostgreSQL or Redis
const sessions: Map<string, GroupSession> = new Map();

// Cleanup expired sessions every hour
setInterval(() => {
  const now = new Date();
  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(id);
      console.log(`Cleaned up expired session: ${id}`);
    }
  }
}, 60 * 60 * 1000);

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
    sessions.set(sessionData.id, sessionData);
    
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
      const session = sessions.get(sessionId);
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
      
      // Check if session is expired
      if (session.expiresAt < new Date()) {
        sessions.delete(sessionId);
        return NextResponse.json(
          { error: 'Session has expired' },
          { status: 410 }
        );
      }
      
      return NextResponse.json(session);
    } else {
      // List all active sessions (for admin/debugging)
      const activeSessions = Array.from(sessions.values())
        .filter(session => session.expiresAt > new Date());
      
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