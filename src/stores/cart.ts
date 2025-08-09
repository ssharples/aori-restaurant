import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem, MenuItemVariant, GroupParticipant, GroupSplitSummary } from '@/types/menu';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  groupMode: boolean;
  participants: GroupParticipant[];
  activeParticipantId?: string;
  
  // Actions
  addItem: (menuItem: MenuItem, variant?: MenuItemVariant, quantity?: number, participantId?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  // Group order actions
  enableGroupMode: () => void;
  disableGroupMode: () => void;
  addParticipant: (name: string) => GroupParticipant;
  removeParticipant: (participantId: string) => void;
  setActiveParticipant: (participantId?: string) => void;
  
  // Computed values
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (itemId: string) => CartItem | undefined;
  getParticipantSubtotal: (participantId: string) => number;
  getSplitSummary: () => GroupSplitSummary[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      groupMode: false,
      participants: [],
      activeParticipantId: undefined,

      addItem: (menuItem: MenuItem, variant?: MenuItemVariant, quantity = 1, participantId?: string) => {
        const currentItems = get().items;
        const itemId = `${menuItem.id}${variant ? `-${variant.id}` : ''}`;
        
        const existingItemIndex = currentItems.findIndex(item => 
          item.id === itemId
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity
          };
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: itemId,
            menuItem,
            variant,
            quantity,
            participantId: participantId || get().activeParticipantId,
            participantName: participantId
              ? get().participants.find(p => p.id === participantId)?.name
              : get().participants.find(p => p.id === get().activeParticipantId)?.name
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (itemId: string) => {
        set({ items: get().items.filter(item => item.id !== itemId) });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const updatedItems = get().items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      // Group order actions
      enableGroupMode: () => {
        set({ groupMode: true });
      },
      disableGroupMode: () => {
        set({ groupMode: false, activeParticipantId: undefined });
      },
      addParticipant: (name: string) => {
        const participant: GroupParticipant = {
          id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name
        };
        const participants = [...get().participants, participant];
        set({ participants, activeParticipantId: participant.id });
        return participant;
      },
      removeParticipant: (participantId: string) => {
        const filtered = get().participants.filter(p => p.id !== participantId);
        // Also unassign items for that participant
        const reassignedItems = get().items.map(item => (
          item.participantId === participantId
            ? { ...item, participantId: undefined, participantName: undefined }
            : item
        ));
        const nextActive = get().activeParticipantId === participantId ? undefined : get().activeParticipantId;
        set({ participants: filtered, items: reassignedItems, activeParticipantId: nextActive });
      },
      setActiveParticipant: (participantId?: string) => {
        set({ activeParticipantId: participantId });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant?.price || item.menuItem.price;
          return total + (price * item.quantity);
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getItem: (itemId: string) => {
        return get().items.find(item => item.id === itemId);
      },

      getParticipantSubtotal: (participantId: string) => {
        return get().items.reduce((total, item) => {
          if (item.participantId !== participantId) return total;
          const price = item.variant?.price || item.menuItem.price;
          return total + (price * item.quantity);
        }, 0);
      },
      getSplitSummary: (): GroupSplitSummary[] => {
        const participants = get().participants;
        return participants.map(p => ({
          participantId: p.id,
          participantName: p.name,
          subtotal: get().getParticipantSubtotal(p.id),
          itemCount: get().items.filter(i => i.participantId === p.id).reduce((n, i) => n + i.quantity, 0)
        }));
      }
    }),
    {
      name: 'aori-cart',
      partialize: (state) => ({ items: state.items, groupMode: state.groupMode, participants: state.participants })
    }
  )
);