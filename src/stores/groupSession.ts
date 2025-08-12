import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  GroupSession, 
  GroupParticipant, 
  GroupSessionStatus, 
  CartItem,
  GroupSessionSettings,
  JoinSessionRequest
} from '@/types/menu';

interface GroupSessionStore {
  // Current session state
  currentSession: GroupSession | null;
  currentParticipant: GroupParticipant | null;
  isHost: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';

  // Session management
  createSession: (hostName: string, settings?: Partial<GroupSessionSettings>) => Promise<GroupSession>;
  joinSession: (sessionId: string, participantName: string) => Promise<GroupParticipant>;
  leaveSession: () => void;
  updateSessionStatus: (status: GroupSessionStatus) => void;
  
  // Participant management
  addParticipant: (participant: GroupParticipant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, updates: Partial<GroupParticipant>) => void;
  
  // Cart synchronization
  syncCartItems: (items: CartItem[]) => void;
  addItemToSession: (item: CartItem) => void;
  removeItemFromSession: (itemId: string) => void;
  updateItemInSession: (itemId: string, updates: Partial<CartItem>) => void;
  
  // Real-time updates
  startRealTimeSync: () => void;
  stopRealTimeSync: () => void;
  
  // Utilities
  generateSessionLink: (sessionId: string) => string;
  getSessionSummary: () => {
    totalItems: number;
    totalAmount: number;
    participantCount: number;
    participantSummaries: Array<{
      participantId: string;
      name: string;
      itemCount: number;
      subtotal: number;
    }>;
  };
}

// Color palette for participant distinction
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

export const useGroupSessionStore = create<GroupSessionStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      currentParticipant: null,
      isHost: false,
      connectionStatus: 'disconnected',

      createSession: async (hostName: string, settings: Partial<GroupSessionSettings> = {}) => {
        const sessionId = generateSessionId();
        const hostId = generateParticipantId();
        
        const defaultSettings: GroupSessionSettings = {
          allowGuestEdits: true,
          requireHostApproval: false,
          autoExpireAfterHours: 24,
          maxOrdersPerPerson: undefined,
          ...settings
        };

        const hostParticipant: GroupParticipant = {
          id: hostId,
          name: hostName,
          isHost: true,
          joinedAt: new Date(),
          lastActive: new Date(),
          color: PARTICIPANT_COLORS[0]
        };

        const session: GroupSession = {
          id: sessionId,
          hostId,
          hostName,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + defaultSettings.autoExpireAfterHours * 60 * 60 * 1000),
          status: 'active',
          participants: [hostParticipant],
          items: [],
          shareableLink: get().generateSessionLink(sessionId),
          settings: defaultSettings
        };

        // Create session via API
        try {
          const response = await fetch('/api/group-sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session)
          });

          if (!response.ok) throw new Error('Failed to create session');
          
          const createdSession = await response.json();
          
          set({
            currentSession: createdSession,
            currentParticipant: hostParticipant,
            isHost: true,
            connectionStatus: 'connected'
          });

          get().startRealTimeSync();
          return createdSession;
        } catch (error) {
          console.error('Failed to create group session:', error);
          throw error;
        }
      },

      joinSession: async (sessionId: string, participantName: string) => {
        try {
          const joinRequest: JoinSessionRequest = {
            sessionId,
            participantName
          };

          const response = await fetch(`/api/group-sessions/${sessionId}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(joinRequest)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to join session');
          }

          const { session, participant } = await response.json();
          
          set({
            currentSession: session,
            currentParticipant: participant,
            isHost: false,
            connectionStatus: 'connected'
          });

          get().startRealTimeSync();
          return participant;
        } catch (error) {
          console.error('Failed to join group session:', error);
          throw error;
        }
      },

      leaveSession: () => {
        const currentSession = get().currentSession;
        const currentParticipant = get().currentParticipant;
        
        if (currentSession && currentParticipant) {
          // Notify server about leaving
          fetch(`/api/group-sessions/${currentSession.id}/leave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participantId: currentParticipant.id })
          }).catch(console.error);
        }

        get().stopRealTimeSync();
        
        set({
          currentSession: null,
          currentParticipant: null,
          isHost: false,
          connectionStatus: 'disconnected'
        });
      },

      updateSessionStatus: (status: GroupSessionStatus) => {
        const currentSession = get().currentSession;
        if (!currentSession || !get().isHost) return;

        set({
          currentSession: {
            ...currentSession,
            status
          }
        });

        // Update server
        fetch(`/api/group-sessions/${currentSession.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        }).catch(console.error);
      },

      addParticipant: (participant: GroupParticipant) => {
        const currentSession = get().currentSession;
        if (!currentSession) return;

        const existingParticipants = currentSession.participants;
        if (existingParticipants.find(p => p.id === participant.id)) return;

        // Assign color
        const colorIndex = existingParticipants.length % PARTICIPANT_COLORS.length;
        const participantWithColor = {
          ...participant,
          color: PARTICIPANT_COLORS[colorIndex]
        };

        set({
          currentSession: {
            ...currentSession,
            participants: [...existingParticipants, participantWithColor]
          }
        });
      },

      removeParticipant: (participantId: string) => {
        const currentSession = get().currentSession;
        if (!currentSession) return;

        // Remove participant and their items
        const updatedParticipants = currentSession.participants.filter(p => p.id !== participantId);
        const updatedItems = currentSession.items.filter(item => item.participantId !== participantId);

        set({
          currentSession: {
            ...currentSession,
            participants: updatedParticipants,
            items: updatedItems
          }
        });
      },

      updateParticipant: (participantId: string, updates: Partial<GroupParticipant>) => {
        const currentSession = get().currentSession;
        if (!currentSession) return;

        const updatedParticipants = currentSession.participants.map(p =>
          p.id === participantId ? { ...p, ...updates, lastActive: new Date() } : p
        );

        set({
          currentSession: {
            ...currentSession,
            participants: updatedParticipants
          }
        });
      },

      syncCartItems: (items: CartItem[]) => {
        const currentSession = get().currentSession;
        if (!currentSession) return;

        set({
          currentSession: {
            ...currentSession,
            items
          }
        });
      },

      addItemToSession: (item: CartItem) => {
        const currentSession = get().currentSession;
        if (!currentSession) return;

        const updatedItems = [...currentSession.items, item];
        
        set({
          currentSession: {
            ...currentSession,
            items: updatedItems
          }
        });

        // Sync with server
        get().syncCartItems(updatedItems);
      },

      removeItemFromSession: (itemId: string) => {
        const currentSession = get().currentSession;
        if (!currentSession) return;

        const updatedItems = currentSession.items.filter(item => item.id !== itemId);
        
        set({
          currentSession: {
            ...currentSession,
            items: updatedItems
          }
        });

        // Sync with server
        get().syncCartItems(updatedItems);
      },

      updateItemInSession: (itemId: string, updates: Partial<CartItem>) => {
        const currentSession = get().currentSession;
        if (!currentSession) return;

        const updatedItems = currentSession.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        );
        
        set({
          currentSession: {
            ...currentSession,
            items: updatedItems
          }
        });

        // Sync with server
        get().syncCartItems(updatedItems);
      },

      startRealTimeSync: () => {
        // TODO: Implement WebSocket connection or Server-Sent Events
        // For now, we'll use polling as a fallback
        const currentSession = get().currentSession;
        if (!currentSession) return;

        set({ connectionStatus: 'connected' });
        
        // Poll for updates every 5 seconds
        const pollInterval = setInterval(async () => {
          try {
            const response = await fetch(`/api/group-sessions/${currentSession.id}`);
            if (response.ok) {
              const updatedSession = await response.json();
              set({ currentSession: updatedSession });
            }
          } catch (error) {
            console.error('Failed to sync session:', error);
            set({ connectionStatus: 'error' });
          }
        }, 5000);

        // Store interval ID for cleanup
        (get() as GroupSessionStore & { _pollInterval?: number })._pollInterval = pollInterval;
      },

      stopRealTimeSync: () => {
        const pollInterval = (get() as GroupSessionStore & { _pollInterval?: number })._pollInterval;
        if (pollInterval) {
          clearInterval(pollInterval);
        }
        set({ connectionStatus: 'disconnected' });
      },

      generateSessionLink: (sessionId: string) => {
        const baseUrl = typeof window !== 'undefined' 
          ? window.location.origin 
          : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        return `${baseUrl}/group/${sessionId}`;
      },

      getSessionSummary: () => {
        const currentSession = get().currentSession;
        if (!currentSession) {
          return {
            totalItems: 0,
            totalAmount: 0,
            participantCount: 0,
            participantSummaries: []
          };
        }

        const participantSummaries = currentSession.participants.map(participant => {
          const participantItems = currentSession.items.filter(item => item.participantId === participant.id);
          const itemCount = participantItems.reduce((sum, item) => sum + item.quantity, 0);
          const subtotal = participantItems.reduce((sum, item) => {
            const price = item.variant?.price || item.menuItem.price;
            return sum + (price * item.quantity);
          }, 0);

          return {
            participantId: participant.id,
            name: participant.name,
            itemCount,
            subtotal
          };
        });

        const totalItems = currentSession.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = currentSession.items.reduce((sum, item) => {
          const price = item.variant?.price || item.menuItem.price;
          return sum + (price * item.quantity);
        }, 0);

        return {
          totalItems,
          totalAmount,
          participantCount: currentSession.participants.length,
          participantSummaries
        };
      }
    }),
    {
      name: 'aori-group-session',
      partialize: (state) => ({
        currentSession: state.currentSession,
        currentParticipant: state.currentParticipant,
        isHost: state.isHost
      })
    }
  )
);

// Helper functions
function generateSessionId(): string {
  return `gs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateParticipantId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}