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
        className="bg-aori-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all cursor-pointer border border-aori-green/10 hover:border-aori-green/20 group"
        onClick={() => setShowModal(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-semibold text-aori-dark group-hover:text-aori-green transition-colors">
                {item.name}
              </h3>
              <button
                onClick={handleQuickAdd}
                className="bg-aori-green text-aori-white p-3 rounded-full hover:bg-aori-green-dark transition-all ml-4 flex-shrink-0 hover:scale-110 shadow-md"
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {item.description && (
              <p className="text-aori-dark/70 mb-4 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                {item.variants && item.variants.length > 0 ? (
                  <div className="space-y-2">
                    {item.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center gap-3">
                        <span className="text-sm text-aori-dark/60 bg-aori-cream px-2 py-1 rounded-full">
                          {variant.name}
                        </span>
                        <span className="text-lg font-bold text-aori-green">
                          {formatPrice(variant.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-aori-green">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
            </div>

            {item.allergens && item.allergens.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-yellow-800 mb-1">Contains allergens:</p>
                  <span className="text-xs text-yellow-700">
                    {item.allergens.join(', ')}
                  </span>
                </div>
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