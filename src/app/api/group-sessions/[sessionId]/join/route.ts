import { NextRequest, NextResponse } from 'next/server';
import { GroupSession, GroupParticipant, JoinSessionRequest } from '@/types/menu';
import { getSession, setSession, cleanupExpiredSession } from '@/lib/sessionStorage';

// Color palette for participants
const PARTICIPANT_COLORS = [
  '#6B7C5F', // Aori green (host)
  '#8FA384', // Light green
  '#5A6B4F', // Dark green
  '#7C6B5F', // Brown
  '#5F6B7C', // Blue-gray
  '#7C5F6B', // Purple-gray
  '#6B5F7C', // Purple
  '#5F7C6B', // Teal
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const joinRequest: JoinSessionRequest = await request.json();
    
    // Validate request
    if (!joinRequest.participantName || joinRequest.participantName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Participant name is required' },
        { status: 400 }
      );
    }
    
    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    // Check if session is expired
    if (cleanupExpiredSession(sessionId, session)) {
      return NextResponse.json(
        { error: 'Session has expired' },
        { status: 410 }
      );
    }
    
    // Check if session is still accepting participants
    if (session.status === 'completed' || session.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Session is no longer accepting participants' },
        { status: 409 }
      );
    }
    
    // Check participant limit
    if (session.maxParticipants && session.participants.length >= session.maxParticipants) {
      return NextResponse.json(
        { error: 'Session is full' },
        { status: 409 }
      );
    }
    
    // Check if participant name is already taken
    const existingParticipant = session.participants.find(
      p => p.name.toLowerCase() === joinRequest.participantName.toLowerCase()
    );
    
    if (existingParticipant) {
      return NextResponse.json(
        { error: 'A participant with this name already exists' },
        { status: 409 }
      );
    }
    
    // Create new participant
    const participantId = generateParticipantId();
    const colorIndex = session.participants.length % PARTICIPANT_COLORS.length;
    
    const newParticipant: GroupParticipant = {
      id: participantId,
      name: joinRequest.participantName.trim(),
      isHost: false,
      joinedAt: new Date(),
      lastActive: new Date(),
      color: PARTICIPANT_COLORS[colorIndex]
    };
    
    // Add participant to session
    const updatedSession = {
      ...session,
      participants: [...session.participants, newParticipant]
    };
    
    setSession(sessionId, updatedSession);
    
    console.log(`Participant ${joinRequest.participantName} joined session ${sessionId}`);
    
    return NextResponse.json({
      session: updatedSession,
      participant: newParticipant
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error joining session:', error);
    return NextResponse.json(
      { error: 'Failed to join session' },
      { status: 500 }
    );
  }
}

function generateParticipantId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}