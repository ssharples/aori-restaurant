'use client';

import { useState } from 'react';
import { X, Minus, Plus, AlertTriangle } from 'lucide-react';
import { MenuItem, MenuItemVariant } from '@/types/menu';
import { useCartStore } from '@/stores/cart';

interface ItemDetailModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | undefined>(
    item.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(item, selectedVariant, quantity);
    onClose();
  };

  const currentPrice = selectedVariant?.price || item.price;
  const totalPrice = currentPrice * quantity;

  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-accent-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-primary-dark">{item.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          {item.description && (
            <p className="text-gray-600 mb-6">{item.description}</p>
          )}

          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Choose your option:</h3>
              <div className="space-y-2">
                {item.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className={`
                      flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors
                      ${selectedVariant?.id === variant.id
                        ? 'border-primary-green bg-primary-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="variant"
                        value={variant.id}
                        checked={selectedVariant?.id === variant.id}
                        onChange={() => setSelectedVariant(variant)}
                        className="mr-3 text-primary-green focus:ring-primary-green"
                      />
                      <div>
                        <div className="font-medium">{variant.name}</div>
                        {variant.description && (
                          <div className="text-sm text-gray-500">{variant.description}</div>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-primary-green">
                      {formatPrice(variant.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Allergen Warning */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg mb-6">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 mb-1">Allergen Information</p>
                <p className="text-sm text-yellow-700">
                  Contains: {item.allergens.join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-green text-accent-white py-4 rounded-full font-semibold hover:bg-primary-green/90 transition-colors flex items-center justify-center gap-2"
          >
            Add to Cart • {formatPrice(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  );
}