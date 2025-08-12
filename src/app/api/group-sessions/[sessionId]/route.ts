import { NextRequest, NextResponse } from 'next/server';
import { GroupSession } from '@/types/menu';

// Import the sessions map from the main route
// In production, this would be a database connection
const sessions: Map<string, GroupSession> = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
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
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { sessionId } = params;
    const updates = await request.json();
    
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
    
    // Update session
    const updatedSession = { ...session, ...updates };
    sessions.set(sessionId, updatedSession);
    
    console.log(`Updated session ${sessionId}:`, updates);
    
    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { sessionId } = params;
    
    if (!sessions.has(sessionId)) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    sessions.delete(sessionId);
    console.log(`Deleted session: ${sessionId}`);
    
    return NextResponse.json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}