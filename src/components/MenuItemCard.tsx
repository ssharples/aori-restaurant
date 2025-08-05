'use client';

import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useCartStore } from '@/stores/cart';
import ItemDetailModal from '@/components/ItemDetailModal';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
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
      <div 
        className="bg-accent-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-primary-dark">
                {item.name}
              </h3>
              <button
                onClick={handleQuickAdd}
                className="bg-primary-green text-accent-white p-2 rounded-full hover:bg-primary-green/90 transition-colors ml-4 flex-shrink-0"
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {item.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {item.variants && item.variants.length > 0 ? (
                  <div className="space-y-1">
                    {item.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{variant.name}:</span>
                        <span className="font-semibold text-primary-green">
                          {formatPrice(variant.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xl font-bold text-primary-green">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
            </div>

            {item.allergens && item.allergens.length > 0 && (
              <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-50 rounded-md">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <span className="text-xs text-yellow-800">
                  Contains: {item.allergens.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ItemDetailModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}