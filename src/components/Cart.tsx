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
      <div className="fixed bottom-0 left-0 right-0 bg-accent-white rounded-t-2xl z-50 max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-green" />
            <h2 className="text-xl font-bold text-primary-dark">
              Your Order ({getItemCount()})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-4">Add some delicious items to get started!</p>
              <button
                onClick={closeCart}
                className="bg-primary-green text-accent-white px-6 py-2 rounded-full hover:bg-primary-green/90 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => {
                const price = item.variant?.price || item.menuItem.price;
                const itemTotal = price * item.quantity;

                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-dark">
                        {item.menuItem.name}
                      </h3>
                      {item.variant && (
                        <p className="text-sm text-gray-600">{item.variant.name}</p>
                      )}
                      <p className="text-primary-green font-semibold">
                        {formatPrice(price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-primary-dark">
                        {formatPrice(itemTotal)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
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
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-primary-dark">Total:</span>
              <span className="text-2xl font-bold text-primary-green">
                {formatPrice(getTotal())}
              </span>
            </div>
            <Link
              href="/checkout"
              className="w-full bg-primary-green text-accent-white py-4 rounded-full font-semibold hover:bg-primary-green/90 transition-colors flex items-center justify-center gap-2 text-center"
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