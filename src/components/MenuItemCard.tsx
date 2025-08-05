'use client';

import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useCartStore } from '@/stores/cart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all group border-border/50 hover:border-primary/20"
        onClick={() => setShowModal(true)}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <Button
                  onClick={handleQuickAdd}
                  size="icon"
                  className="ml-4 flex-shrink-0 rounded-full shadow-md hover:scale-110 transition-all"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {item.description && (
                <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col space-y-2">
                  {item.variants && item.variants.length > 0 ? (
                    item.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          {variant.name}
                        </Badge>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(variant.price)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              </div>

              {item.allergens && item.allergens.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-yellow-800 mb-1">Contains allergens:</p>
                        <span className="text-xs text-yellow-700">
                          {item.allergens.join(', ')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ItemDetailModal
        item={item}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}