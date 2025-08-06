'use client';

import { Minus, Plus, ShoppingBag } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            Your Order ({getItemCount()})
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto mt-6">
          <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">Add some delicious Greek items to get started!</p>
              <Button onClick={closeCart} className="rounded-full px-8">
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const price = item.variant?.price || item.menuItem.price;
                const itemTotal = price * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95, height: 0 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.05,
                      layout: { duration: 0.2 }
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-white border border-border/50">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {item.menuItem.name}
                          </h3>
                          {item.variant && (
                            <Badge variant="secondary" className="mb-2">
                              {item.variant.name}
                            </Badge>
                          )}
                          <p className="text-primary font-bold text-lg">
                            {formatPrice(price)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1">
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 rounded-full hover:bg-gray-200"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            </motion.div>
                            <motion.span 
                              key={item.quantity}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="w-8 text-center font-semibold text-base px-2"
                            >
                              {item.quantity}
                            </motion.span>
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 rounded-full hover:bg-gray-200"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </motion.div>
                          </div>
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive h-6 px-2 text-xs"
                            >
                              Remove
                            </Button>
                          </motion.div>
                          <div className="text-right mt-1">
                            <p className="font-bold text-lg text-primary">
                              {formatPrice(itemTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="mt-6 space-y-4 bg-white border-t border-border/50 -mx-6 px-6 pt-6 pb-2">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-3xl font-bold text-primary">
                {formatPrice(getTotal())}
              </span>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                asChild 
                className="w-full py-6 text-lg rounded-2xl bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-sm font-semibold" 
                variant="outline"
                size="lg"
              >
                <Link href="/checkout" onClick={closeCart}>
                  Proceed to Checkout
                </Link>
              </Button>
            </motion.div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}