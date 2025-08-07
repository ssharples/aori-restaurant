'use client';

import { useState } from 'react';
import { Plus, Flame, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { useCartStore } from '@/stores/cart';
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.02 }}
        className="bg-white border-b border-gray-100 last:border-b-0"
      >
        <div 
          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowModal(true)}
        >
          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-medium text-gray-900 text-lg truncate">
                  {item.name}
                </h3>
                
                {/* Badges */}
                {(item.popular || item.vegetarian || item.spicy) && (
                  <div className="flex gap-1 mt-1">
                    {item.popular && (
                      <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                        Popular
                      </Badge>
                    )}
                    {item.vegetarian && (
                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
                        <Leaf className="w-3 h-3 mr-1" />
                        Vegetarian
                      </Badge>
                    )}
                    {item.spicy && (
                      <Badge className="bg-red-100 text-red-800 text-xs px-2 py-0.5">
                        <Flame className="w-3 h-3 mr-1" />
                        Spicy
                      </Badge>
                    )}
                  </div>
                )}

                {/* Description */}
                {item.description && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Price */}
                <div className="mt-3">
                  {item.variants && item.variants.length > 0 ? (
                    <div className="space-y-1">
                      {item.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {variant.name}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(variant.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-900 text-lg">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>

                {/* Allergens */}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="mt-2">
                    <AllergenBadge allergens={item.allergens} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Item Image with Add Button */}
          <div className="relative flex-shrink-0">
            {item.image ? (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {/* Add Button Overlay */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuickAdd}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>
            ) : (
              /* Add Button for items without images */
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickAdd}
                className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition-colors"
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <ItemDetailModal
        item={item}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}