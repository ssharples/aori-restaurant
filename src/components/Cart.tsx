'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart';

export default function Cart() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getTotal, 
    getItemCount 
  } = useCartStore();

  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={closeCart}
      />

      {/* Cart Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-aori-white rounded-t-3xl z-50 max-h-[85vh] flex flex-col animate-slide-up shadow-2xl border-t-4 border-aori-green">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-aori-green/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-aori-green rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-aori-white" />
            </div>
            <h2 className="text-xl font-bold text-aori-dark">
              Your Order ({getItemCount()})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-aori-green/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-aori-dark" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-20 h-20 bg-aori-green/10 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-aori-green/40" />
              </div>
              <h3 className="text-xl font-semibold text-aori-dark mb-3">Your cart is empty</h3>
              <p className="text-aori-dark/60 mb-6 leading-relaxed">Add some delicious Greek items to get started!</p>
              <button
                onClick={closeCart}
                className="bg-aori-green text-aori-white px-8 py-3 rounded-full hover:bg-aori-green-dark transition-all hover:scale-105 font-medium"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items.map((item) => {
                const price = item.variant?.price || item.menuItem.price;
                const itemTotal = price * item.quantity;

                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-aori-cream rounded-2xl border border-aori-green/10">
                    <div className="flex-1">
                      <h3 className="font-semibold text-aori-dark mb-1">
                        {item.menuItem.name}
                      </h3>
                      {item.variant && (
                        <p className="text-sm text-aori-dark/60 bg-aori-white px-2 py-1 rounded-full inline-block mb-2">
                          {item.variant.name}
                        </p>
                      )}
                      <p className="text-aori-green font-bold text-lg">
                        {formatPrice(price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 rounded-full bg-aori-white hover:bg-aori-green/10 flex items-center justify-center transition-colors border border-aori-green/20"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4 text-aori-green" />
                      </button>
                      <span className="w-10 text-center font-bold text-aori-dark text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 rounded-full bg-aori-green hover:bg-aori-green-dark text-aori-white flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-aori-dark text-lg mb-1">
                        {formatPrice(itemTotal)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors bg-red-50 px-2 py-1 rounded-full"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-aori-green/10 p-6 bg-aori-cream/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-aori-dark">Total:</span>
              <span className="text-3xl font-bold text-aori-green">
                {formatPrice(getTotal())}
              </span>
            </div>
            <Link
              href="/checkout"
              className="w-full bg-aori-green text-aori-white py-4 rounded-2xl font-semibold hover:bg-aori-green-dark transition-all flex items-center justify-center gap-2 text-center shadow-lg hover:scale-105 text-lg"
              onClick={closeCart}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}