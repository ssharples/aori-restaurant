import { NextRequest, NextResponse } from 'next/server';
import { GroupSession } from '@/types/menu';

// Import the sessions map from the main route
// In production, this would be a database connection
const sessions: Map<string, GroupSession> = new Map();

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const { participantId } = await request.json();
    
    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      );
    }
    
    const session = sessions.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    // Find the participant
    const participant = session.participants.find(p => p.id === participantId);
    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found in session' },
        { status: 404 }
      );
    }
    
    // Remove participant and their items
    const updatedParticipants = session.participants.filter(p => p.id !== participantId);
    const updatedItems = session.items.filter(item => item.participantId !== participantId);
    
    const updatedSession = {
      ...session,
      participants: updatedParticipants,
      items: updatedItems
    };
    
    // If this was the host leaving, either assign a new host or mark session as cancelled
    if (participant.isHost) {
      if (updatedParticipants.length > 0) {
        // Assign host to the first remaining participant
        updatedParticipants[0].isHost = true;
        updatedSession.hostId = updatedParticipants[0].id;
        updatedSession.hostName = updatedParticipants[0].name;
      } else {
        // No participants left, mark session as cancelled
        updatedSession.status = 'cancelled';
      }
    }
    
    sessions.set(sessionId, updatedSession);
    
    console.log(`Participant ${participant.name} left session ${sessionId}`);
    
    return NextResponse.json({
      message: 'Participant removed from session',
      session: updatedSession
    });
    
  } catch (error) {
    console.error('Error leaving session:', error);
    return NextResponse.json(
      { error: 'Failed to leave session' },
      { status: 500 }
    );
  }
}