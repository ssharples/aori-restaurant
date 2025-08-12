'use client';

import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';

export default function FloatingBasketButton() {
  const { getItemCount, getTotal, openCart } = useCartStore();
  const itemCount = getItemCount();
  const total = getTotal();

  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-6 left-4 right-4 z-50 flex justify-center"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ backgroundColor: '#6B7C5F', opacity: 1 }}
          className="text-white rounded-full shadow-lg px-4 py-2 md:px-6 md:py-3 flex items-center gap-3 min-w-[200px] max-w-[90vw]"
        >
          <Button
            onClick={openCart}
            style={{ backgroundColor: 'transparent', color: 'white' }}
            className="hover:bg-transparent p-0 h-auto flex items-center gap-3 w-full justify-between border-0"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                >
                  {itemCount}
                </motion.div>
              </div>
              <span className="font-semibold">View basket</span>
            </div>
            <span className="font-bold">{formatPrice(total)}</span>
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}