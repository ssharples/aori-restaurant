'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart';

export default function CartButton() {
  const { getItemCount, toggleCart } = useCartStore();
  const itemCount = getItemCount();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-accent-white hover:bg-primary-green/20 rounded-full transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}