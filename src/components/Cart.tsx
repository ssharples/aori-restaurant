'use client';

import { Minus, Plus, ShoppingBag } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

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
              {items.map((item) => {
                const price = item.variant?.price || item.menuItem.price;
                const itemTotal = price * item.quantity;

                return (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
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

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-10 w-10 rounded-full"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-10 text-center font-bold text-lg">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-10 w-10 rounded-full"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg mb-1">
                            {formatPrice(itemTotal)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive h-6 px-2"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="mt-6 space-y-4">
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-3xl font-bold text-primary">
                {formatPrice(getTotal())}
              </span>
            </div>
            <Button asChild className="w-full py-6 text-lg rounded-2xl" size="lg">
              <Link href="/checkout" onClick={closeCart}>
                Proceed to Checkout
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}