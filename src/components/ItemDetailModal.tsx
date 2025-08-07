'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { MenuItem, MenuItemVariant } from '@/types/menu';
import { useCartStore } from '@/stores/cart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AllergenBadge from '@/components/AllergenBadge';

interface ItemDetailModalProps {
  item: MenuItem;
  open: boolean;
  onClose: () => void;
}

export default function ItemDetailModal({ item, open, onClose }: ItemDetailModalProps) {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white p-0">
        {/* Product Image */}
        {item.image && (
          <div className="relative h-48 w-full">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          </div>
        )}
        
        <div className="p-4">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 font-heading">{item.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Description */}
            {item.description && (
              <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
            )}

            {/* Variants */}
            {item.variants && item.variants.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Choose your option:</h3>
                <div className="space-y-2">
                  {item.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedVariant?.id === variant.id 
                          ? 'border-black bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variant"
                            value={variant.id}
                            checked={selectedVariant?.id === variant.id}
                            onChange={() => setSelectedVariant(variant)}
                            className="text-black focus:ring-black"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{variant.name}</div>
                            {variant.description && (
                              <div className="text-sm text-gray-500">{variant.description}</div>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(variant.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Allergen Warning */}
            {item.allergens && item.allergens.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-900">Allergen Information:</p>
                <AllergenBadge allergens={item.allergens} className="self-start" />
              </div>
            )}

            <Separator />

            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-8 w-8 rounded-full border-gray-300"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center font-semibold text-lg text-gray-900">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 rounded-full border-gray-300"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full h-12 text-white font-semibold rounded-lg bg-black hover:bg-gray-800"
              size="lg"
            >
              Add to Cart • {formatPrice(totalPrice)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}