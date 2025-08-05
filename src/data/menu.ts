import { MenuItem, RestaurantInfo } from '@/types/menu';

export const menuItems: MenuItem[] = [
  // GYROS
  {
    id: 'gyros-chicken',
    name: 'Chicken Gyros',
    description: 'Served in warm pita with chips, tomatoes, onions & tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ]
  },
  {
    id: 'gyros-pork',
    name: 'Pork Gyros',
    description: 'Served in warm pita with chips, tomatoes, onions & tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ]
  },
  {
    id: 'gyros-halloumi',
    name: 'Halloumi Gyros',
    description: 'Served in warm pita with chips, tomatoes, onions & tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ]
  },
  {
    id: 'gyros-greek-burger',
    name: 'Greek Burger',
    description: 'Served in warm pita with chips, tomatoes, onions & tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ]
  },
  {
    id: 'gyros-veggie-burger',
    name: 'Veggie Burger',
    description: 'Served in warm pita with chips, tomatoes, onions & tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ]
  },
  {
    id: 'gyros-shish-kebab',
    name: 'Shish Kebab',
    description: 'Served in warm pita with chips, tomatoes, onions & tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ]
  },

  // SOUVLAKI
  {
    id: 'souvlaki-chicken',
    name: 'Chicken Souvlaki',
    description: 'Box Meal: 2 Skewers, Pita, Chips, Salad & Tzatziki',
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ]
  },
  {
    id: 'souvlaki-pork',
    name: 'Pork Souvlaki',
    description: 'Box Meal: 2 Skewers, Pita, Chips, Salad & Tzatziki',
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ]
  },
  {
    id: 'souvlaki-pork-belly',
    name: 'Pork Belly Pancetta',
    description: 'Box Meal: 2 Skewers, Pita, Chips, Salad & Tzatziki',
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ]
  },
  {
    id: 'souvlaki-shish',
    name: 'Shish Kebab Souvlaki',
    description: 'Box Meal: 2 Skewers, Pita, Chips, Salad & Tzatziki',
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ]
  },
  {
    id: 'souvlaki-cretan-sausage',
    name: 'Cretan Sausage',
    description: 'Box Meal: 2 Skewers, Pita, Chips, Salad & Tzatziki',
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ]
  },

  // BAO BUN
  {
    id: 'bao-chicken',
    name: 'Chicken Bao Bun',
    price: 8.00,
    category: 'bao-bun',
    allergens: ['peanuts']
  },
  {
    id: 'bao-teriyaki-pork',
    name: 'Teriyaki Pork Bao Bun',
    price: 8.00,
    category: 'bao-bun',
    allergens: ['sesame seeds', 'soy sauce']
  },
  {
    id: 'bao-greek-hot-dog',
    name: 'Greek Hot Dog Bao Bun',
    price: 7.50,
    category: 'bao-bun'
  },
  {
    id: 'bao-tempura-prawn',
    name: 'Tempura Prawn Bao Bun',
    price: 9.00,
    category: 'bao-bun',
    allergens: ['prawn']
  },
  {
    id: 'bao-caesars',
    name: 'Caesar\'s Bao Bun',
    price: 9.00,
    category: 'bao-bun',
    allergens: ['fish']
  },

  // SALADS
  {
    id: 'salad-greek',
    name: 'Greek Salad',
    description: 'Tomatoes, onion, feta cheese, olives, extra virgin olive oil, oregano',
    price: 8.00,
    category: 'salad'
  },
  {
    id: 'salad-caesars',
    name: 'Caesar\'s Salad',
    description: 'Iceberg lettuce, chicken fillets, bacon, parmesan flakes, croutons, homemade dressing',
    price: 10.00,
    category: 'salad',
    allergens: ['fish']
  },
  {
    id: 'salad-italian',
    name: 'Italian Salad',
    description: 'Mixed baby greens, rocket, parmesan flakes, prosciutto, homemade dressing',
    price: 9.00,
    category: 'salad'
  },

  // PITA & DIPS
  {
    id: 'dip-tzatziki',
    name: 'Tzatziki with Pita',
    price: 5.00,
    category: 'pita-dips'
  },
  {
    id: 'dip-hummus',
    name: 'Hummus with Pita',
    price: 5.00,
    category: 'pita-dips'
  },
  {
    id: 'dip-spicy-feta',
    name: 'Spicy Feta Dip (Tirokauteri) with Pita',
    price: 5.00,
    category: 'pita-dips'
  },

  // SIDES
  {
    id: 'side-chips',
    name: 'Chips',
    price: 3.50,
    category: 'sides'
  },
  {
    id: 'side-grilled-halloumi',
    name: 'Grilled Halloumi',
    price: 5.90,
    category: 'sides'
  },
  {
    id: 'side-pita-bread',
    name: 'Pita Bread',
    price: 1.50,
    category: 'sides'
  },
  {
    id: 'side-olives',
    name: 'Olives',
    price: 3.00,
    category: 'sides'
  },

  // DESSERTS
  {
    id: 'dessert-ferrero',
    name: 'Ferrero',
    price: 5.00,
    category: 'desserts'
  },
  {
    id: 'dessert-profiterole',
    name: 'Profiterole',
    price: 5.00,
    category: 'desserts'
  },
  {
    id: 'dessert-tiramisu',
    name: 'Tiramisu',
    price: 5.00,
    category: 'desserts'
  },

  // DRINKS
  {
    id: 'drink-coke',
    name: 'Coke',
    price: 1.80,
    category: 'drinks'
  },
  {
    id: 'drink-coke-zero',
    name: 'Coke Zero',
    price: 1.80,
    category: 'drinks'
  },
  {
    id: 'drink-sprite',
    name: 'Sprite',
    price: 1.80,
    category: 'drinks'
  },
  {
    id: 'drink-fanta-orange',
    name: 'Fanta Orange',
    price: 1.80,
    category: 'drinks'
  },
  {
    id: 'drink-fanta-lemon',
    name: 'Fanta Lemon',
    price: 1.80,
    category: 'drinks'
  },
  {
    id: 'drink-motion-fruit-juice',
    name: 'Motion Fruit Juice',
    price: 1.80,
    category: 'drinks'
  },
  {
    id: 'drink-water',
    name: 'Water',
    price: 1.50,
    category: 'drinks'
  }
];

export const restaurantInfo: RestaurantInfo = {
  name: 'Aori',
  address: '78 Old Mill St, Manchester M4 6LW',
  phone: '+44 123 456 7890',
  hours: {
    monday: { open: '11:00', close: '22:00' },
    tuesday: { open: '11:00', close: '22:00' },
    wednesday: { open: '11:00', close: '22:00' },
    thursday: { open: '11:00', close: '22:00' },
    friday: { open: '11:00', close: '23:00' },
    saturday: { open: '11:00', close: '23:00' },
    sunday: { open: '12:00', close: '21:00' }
  }
};

export const categoryNames = {
  'gyros': 'Gyros',
  'souvlaki': 'Souvlaki',
  'bao-bun': 'Bao Bun',
  'salad': 'Salads',
  'pita-dips': 'Pita & Dips',
  'sides': 'Sides',
  'desserts': 'Desserts',
  'drinks': 'Drinks'
} as const;