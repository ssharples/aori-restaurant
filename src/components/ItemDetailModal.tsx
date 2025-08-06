'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { MenuItem, MenuItemVariant } from '@/types/menu';
import { useCartStore } from '@/stores/cart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {item.description && (
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
          )}

          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Choose your option:</h3>
              <div className="space-y-3">
                {item.variants.map((variant) => (
                  <Card 
                    key={variant.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedVariant?.id === variant.id 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variant"
                            value={variant.id}
                            checked={selectedVariant?.id === variant.id}
                            onChange={() => setSelectedVariant(variant)}
                            className="text-primary focus:ring-primary"
                          />
                          <div>
                            <div className="font-medium">{variant.name}</div>
                            {variant.description && (
                              <div className="text-sm text-muted-foreground">{variant.description}</div>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          {formatPrice(variant.price)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Allergen Warning */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Allergen Information:</p>
              <AllergenBadge allergens={item.allergens} className="self-start" />
            </div>
          )}

          <Separator />

          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-10 w-10 rounded-full"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
              <Button
                variant="default"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10 rounded-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full py-6 text-lg font-semibold rounded-2xl"
            size="lg"
          >
            Add to Cart • {formatPrice(totalPrice)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}