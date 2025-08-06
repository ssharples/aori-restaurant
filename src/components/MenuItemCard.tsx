'use client';

import { useState } from 'react';
import { Plus, Flame, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { useCartStore } from '@/stores/cart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ItemDetailModal from '@/components/ItemDetailModal';
import AllergenBadge from '@/components/AllergenBadge';

interface MenuItemCardProps {
  item: MenuItem;
  index?: number;
}

export default function MenuItemCard({ item, index = 0 }: MenuItemCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { addItem } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.variants && item.variants.length > 0) {
      setShowModal(true);
    } else {
      addItem(item);
    }
  };

  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -5 }}
      >
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all group border-border/50 hover:border-primary/20 overflow-hidden"
          onClick={() => setShowModal(true)}
        >
          {item.image && (
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {item.popular && (
                  <Badge className="bg-primary text-white">Popular</Badge>
                )}
                {item.vegetarian && (
                  <Badge className="bg-green-600 text-white">
                    <Leaf className="w-3 h-3 mr-1" />
                    Vegetarian
                  </Badge>
                )}
                {item.spicy && (
                  <Badge className="bg-red-600 text-white">
                    <Flame className="w-3 h-3 mr-1" />
                    Spicy
                  </Badge>
                )}
              </div>
            </div>
          )}
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    {!item.image && (
                      <div className="flex gap-2 mt-2">
                        {item.popular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                        {item.vegetarian && (
                          <Badge variant="secondary" className="text-xs">
                            <Leaf className="w-3 h-3 mr-1" />
                            Vegetarian
                          </Badge>
                        )}
                        {item.spicy && (
                          <Badge variant="secondary" className="text-xs">
                            <Flame className="w-3 h-3 mr-1" />
                            Spicy
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleQuickAdd}
                      size="icon"
                      className="ml-4 flex-shrink-0 rounded-full shadow-md transition-all"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </div>

                {item.description && (
                  <motion.p 
                    initial={{ opacity: 0.8 }}
                    className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed"
                  >
                    {item.description}
                  </motion.p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col space-y-2">
                    {item.variants && item.variants.length > 0 ? (
                      item.variants.map((variant, idx) => (
                        <motion.div 
                          key={variant.id} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <Badge variant="secondary" className="text-xs">
                            {variant.name}
                          </Badge>
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(variant.price)}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <motion.span 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-primary"
                      >
                        {formatPrice(item.price)}
                      </motion.span>
                    )}
                  </div>
                </div>

                {item.allergens && item.allergens.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3"
                  >
                    <AllergenBadge allergens={item.allergens} />
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ItemDetailModal
        item={item}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}