import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem, MenuItemVariant } from '@/types/menu';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (menuItem: MenuItem, variant?: MenuItemVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed values
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (itemId: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (menuItem: MenuItem, variant?: MenuItemVariant, quantity = 1) => {
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
            quantity
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
      }
    }),
    {
      name: 'aori-cart',
      partialize: (state) => ({ items: state.items })
    }
  )
);