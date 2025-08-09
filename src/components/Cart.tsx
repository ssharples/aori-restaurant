'use client';

import { Minus, Plus, ShoppingBag, Users, UserPlus, User, Split } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getTotal, 
    getItemCount,
    groupMode,
    enableGroupMode,
    disableGroupMode,
    participants,
    addParticipant,
    activeParticipantId,
    setActiveParticipant,
    getSplitSummary
  } = useCartStore();

  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="bottom" className="h-[75vh] md:h-[90vh] flex flex-col bg-white">
        <SheetHeader className="px-4 pt-6 pb-2 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3 text-black">
              <ShoppingBag className="w-6 h-6 text-black" />
              Your Order ({getItemCount()})
            </SheetTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={() => (groupMode ? disableGroupMode() : enableGroupMode())}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${groupMode ? 'border-black text-black' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <span className="inline-flex items-center gap-1">
                  <Users className="w-4 h-4" /> {groupMode ? 'Group On' : 'Group Off'}
                </span>
              </button>
            </div>
          </div>
        </SheetHeader>

        {groupMode && (
          <div className="px-4 pt-3 pb-3 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {participants.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveParticipant(p.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm whitespace-nowrap ${activeParticipantId === p.id ? 'border-black text-black bg-gray-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <User className="w-4 h-4" /> {p.name}
                </button>
              ))}
              <button
                onClick={() => {
                  const name = prompt('Participant name');
                  if (name) addParticipant(name);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm border-dashed border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <UserPlus className="w-4 h-4" /> Add person
              </button>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4">
          <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-heading">Your cart is empty</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">Add some delicious Greek items to get started!</p>
              <Button onClick={closeCart} className="rounded-full px-8">
                Browse Menu
              </Button>
            </div>
          ) : (
              <div className="space-y-0">
              {items.map((item, index) => {
                const price = item.variant?.price || item.menuItem.price;
                const itemTotal = price * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ 
                      duration: 0.2,
                      delay: index * 0.05,
                      layout: { duration: 0.2 }
                    }}
                    className="py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {/* Item Image/Icon Placeholder */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-8 h-8 bg-[#6B7C5F] rounded text-white text-xs font-bold flex items-center justify-center">
                          {item.menuItem.name.charAt(0)}
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {item.menuItem.name}
                            </h3>
                            {groupMode && (item.participantName || item.participantId) && (
                              <p className="text-xs text-gray-500 mt-0.5">For: {item.participantName || item.participantId}</p>
                            )}
                            {item.variant && (
                              <p className="text-sm text-gray-500 mt-1">
                                {item.variant.name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 rounded-l-lg hover:bg-gray-50"
                              >
                                <Minus className="w-3 h-3 text-black" />
                              </Button>
                              <span className="w-8 text-center font-medium text-sm text-black">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 rounded-r-lg hover:bg-gray-50"
                              >
                                <Plus className="w-3 h-3 text-black" />
                              </Button>
                            </div>
                            
                            {/* Item Total Price */}
                            <div className="text-right min-w-[4rem]">
                              <p className="font-semibold text-gray-900">
                                {formatPrice(itemTotal)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-500">
                            {formatPrice(price)} each
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-4 pb-6 pt-4">
            {/* Add items button */}
            <Button
              variant="ghost"
              onClick={closeCart}
              className="w-full mb-4 text-[#6B7C5F] font-medium hover:bg-gray-50 rounded-lg border border-gray-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add items
            </Button>

            {groupMode && participants.length > 0 && (
              <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Split className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-800">Per person totals</span>
                </div>
                <div className="space-y-1">
                  {getSplitSummary().map((s) => (
                    <div key={s.participantId} className="flex justify-between text-sm">
                      <span className="text-gray-700">{s.participantName}</span>
                      <span className="text-gray-900 font-medium">{formatPrice(s.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">{formatPrice(getTotal())}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                asChild 
                className="w-full h-12 text-white font-semibold text-base rounded-lg bg-black hover:bg-gray-800"
                size="lg"
              >
                <Link href="/checkout" onClick={closeCart}>
                  Go to checkout
                </Link>
              </Button>
            </motion.div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}