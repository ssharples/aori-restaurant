import { GroupSession } from '@/types/menu';

// In-memory storage for demo purposes
// In production, this should use a database like PostgreSQL or Redis
export const sessions: Map<string, GroupSession> = new Map();

// Cleanup expired sessions every hour
if (typeof window === 'undefined') { // Only run on server side
  setInterval(() => {
    const now = new Date();
    for (const [id, session] of sessions.entries()) {
      if (session.expiresAt < now) {
        sessions.delete(id);
        console.log(`Cleaned up expired session: ${id}`);
      }
    }
  }, 60 * 60 * 1000);
}

// Helper functions
export const getSession = (sessionId: string): GroupSession | undefined => {
  return sessions.get(sessionId);
};

export const setSession = (sessionId: string, session: GroupSession): void => {
  sessions.set(sessionId, session);
};

export const deleteSession = (sessionId: string): boolean => {
  return sessions.delete(sessionId);
};

export const hasSession = (sessionId: string): boolean => {
  return sessions.has(sessionId);
};

export const isSessionExpired = (session: GroupSession): boolean => {
  return session.expiresAt < new Date();
};

export const cleanupExpiredSession = (sessionId: string, session: GroupSession): boolean => {
  if (isSessionExpired(session)) {
    sessions.delete(sessionId);
    return true;
  }
  return false;
};