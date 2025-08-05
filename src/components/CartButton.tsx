'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart';

export default function CartButton() {
  const { getItemCount, toggleCart } = useCartStore();
  const itemCount = getItemCount();

  return (
    <button
      onClick={toggleCart}
      className="relative p-3 text-primary-foreground hover:bg-primary-foreground/20 rounded-full transition-all hover:scale-110"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-lg animate-pulse">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}