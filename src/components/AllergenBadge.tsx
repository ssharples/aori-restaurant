import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AllergenBadgeProps {
  allergens: string[];
  className?: string;
}

const allergenIcons: Record<string, string> = {
  'peanuts': '🥜',
  'nuts': '🌰',
  'gluten': '🌾',
  'dairy': '🥛',
  'eggs': '🥚',
  'fish': '🐟',
  'shellfish': '🦐',
  'prawn': '🦐',
  'soy': '🌱',
  'sesame': '🌿',
  'celery': '🥬',
  'mustard': '🟡',
  'sulphites': '🍷',
  'lupin': '🌺',
  'molluscs': '🦑'
};

export default function AllergenBadge({ allergens, className = '' }: AllergenBadgeProps) {
  if (!allergens || allergens.length === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 ${className}`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Contains allergens
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold mb-1">This item contains:</p>
            <ul className="space-y-1">
              {allergens.map((allergen) => (
                <li key={allergen} className="flex items-center gap-2">
                  <span>{allergenIcons[allergen.toLowerCase()] || '⚠️'}</span>
                  <span className="capitalize">{allergen}</span>
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}