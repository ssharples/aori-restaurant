import { MenuItem, RestaurantInfo } from '@/types/menu';

export const menuItems: MenuItem[] = [
  // GYROS
  {
    id: 'gyros-chicken',
    name: 'Chicken Gyros',
    description: 'Tender marinated chicken, grilled to perfection. Served in warm pita with crispy chips, fresh tomatoes, onions & homemade tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ],
    popular: true,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop'
  },
  {
    id: 'gyros-pork',
    name: 'Pork Gyros',
    description: 'Succulent pork slices seasoned with aromatic herbs. Wrapped in warm pita with golden chips, ripe tomatoes, onions & creamy tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ],
    image: 'https://images.unsplash.com/photo-1611658885159-cd33c6225fc0?w=400&h=300&fit=crop'
  },
  {
    id: 'gyros-halloumi',
    name: 'Halloumi Gyros',
    description: 'Grilled Cypriot halloumi cheese with a golden crust. Served in warm pita with chips, fresh vegetables & cooling tzatziki sauce',
    vegetarian: true,
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ],
    image: 'https://images.pexels.com/photos/5836624/pexels-photo-5836624.jpeg'
  },
  {
    id: 'gyros-greek-burger',
    name: 'Greek Burger',
    description: 'Juicy beef patty infused with Mediterranean spices and feta. Wrapped in warm pita with crispy chips, garden vegetables & tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ],
    image: 'https://images.pexels.com/photos/23996596/pexels-photo-23996596.jpeg'
  },
  {
    id: 'gyros-veggie-burger',
    name: 'Veggie Burger',
    description: 'House-made chickpea and vegetable patty with herbs. Served in warm pita with golden chips, fresh salad & tangy tzatziki',
    vegetarian: true,
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ],
    image: 'https://images.pexels.com/photos/9980751/pexels-photo-9980751.jpeg'
  },
  {
    id: 'gyros-shish-kebab',
    name: 'Shish Kebab',
    description: 'Traditional lamb kebab marinated in olive oil and oregano. Wrapped in warm pita with chips, Mediterranean vegetables & tzatziki',
    price: 9.50,
    category: 'gyros',
    variants: [
      { id: 'wrap', name: 'Wrap', price: 9.50 },
      { id: 'box', name: 'Box Meal', price: 14.50 }
    ],
    image: 'https://images.pexels.com/photos/7462844/pexels-photo-7462844.jpeg'
  },

  // SOUVLAKI
  {
    id: 'souvlaki-chicken',
    name: 'Chicken Souvlaki',
    description: 'Juicy chicken cubes marinated in lemon & herbs, chargrilled on skewers. Box meal includes 2 skewers, warm pita, chips, Greek salad & tzatziki',
    popular: true,
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ],
    image: 'https://images.pexels.com/photos/7301037/pexels-photo-7301037.jpeg'
  },
  {
    id: 'souvlaki-pork',
    name: 'Pork Souvlaki',
    description: 'Traditional pork cubes marinated in wine & spices, grilled over charcoal. Box meal: 2 skewers, pita bread, golden chips, fresh salad & tzatziki',
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ],
    image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg'
  },
  {
    id: 'souvlaki-pork-belly',
    name: 'Pork Belly Pancetta',
    description: 'Crispy pork belly pieces with a smoky flavor. Box meal features 2 skewers, soft pita, chips, garden salad & creamy tzatziki',
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ],
    image: 'https://images.pexels.com/photos/1651166/pexels-photo-1651166.jpeg'
  },
  {
    id: 'souvlaki-shish',
    name: 'Shish Kebab Souvlaki',
    description: 'Spiced lamb mince kebabs with parsley & onion. Box meal: 2 skewers, fresh pita, crispy chips, Greek salad & house tzatziki',
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ],
    image: 'https://images.pexels.com/photos/5191846/pexels-photo-5191846.jpeg'
  },
  {
    id: 'souvlaki-cretan-sausage',
    name: 'Cretan Sausage',
    description: 'Authentic Cretan sausages with fennel & orange zest. Box meal: 2 skewers, warm pita, golden chips, fresh salad & tzatziki',
    price: 3.50,
    category: 'souvlaki',
    variants: [
      { id: 'skewer', name: 'Per Skewer', price: 3.50 },
      { id: 'box', name: 'Box Meal', price: 10.00 }
    ],
    image: 'https://images.pexels.com/photos/1275692/pexels-photo-1275692.jpeg'
  },

  // BAO BUN
  {
    id: 'bao-chicken',
    name: 'Chicken Bao Bun',
    description: 'Crispy fried chicken in fluffy steamed buns with Asian slaw and peanut sauce',
    price: 8.00,
    category: 'bao-bun',
    allergens: ['peanuts'],
    image: 'https://images.pexels.com/photos/2089712/pexels-photo-2089712.jpeg'
  },
  {
    id: 'bao-teriyaki-pork',
    name: 'Teriyaki Pork Bao Bun',
    description: 'Slow-cooked pork belly glazed with teriyaki, pickled cucumber & sesame seeds',
    price: 8.00,
    category: 'bao-bun',
    allergens: ['sesame seeds', 'soy sauce'],
    image: 'https://images.pexels.com/photos/30708197/pexels-photo-30708197.jpeg'
  },
  {
    id: 'bao-greek-hot-dog',
    name: 'Greek Hot Dog Bao Bun',
    description: 'Greek-spiced sausage in a soft bao bun with tzatziki and crispy onions',
    price: 7.50,
    category: 'bao-bun'
  },
  {
    id: 'bao-tempura-prawn',
    name: 'Tempura Prawn Bao Bun',
    description: 'Light tempura prawns with wasabi mayo, shredded lettuce & lime',
    price: 9.00,
    category: 'bao-bun',
    allergens: ['prawn'],
    image: 'https://images.pexels.com/photos/3622477/pexels-photo-3622477.jpeg'
  },
  {
    id: 'bao-caesars',
    name: 'Caesar\'s Bao Bun',
    description: 'Grilled chicken with Caesar dressing, parmesan, lettuce & anchovies',
    price: 9.00,
    category: 'bao-bun',
    allergens: ['fish'],
    image: 'https://images.pexels.com/photos/2089712/pexels-photo-2089712.jpeg'
  },

  // SALADS
  {
    id: 'salad-greek',
    name: 'Greek Salad',
    description: 'Crisp cucumbers, ripe tomatoes, red onions, creamy feta, Kalamata olives, drizzled with extra virgin olive oil & oregano',
    vegetarian: true,
    price: 8.00,
    category: 'salad',
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg'
  },
  {
    id: 'salad-caesars',
    name: 'Caesar\'s Salad',
    description: 'Crispy romaine lettuce, grilled chicken breast, smoked bacon, aged parmesan, garlic croutons & our signature Caesar dressing',
    price: 10.00,
    category: 'salad',
    allergens: ['fish'],
    image: 'https://images.pexels.com/photos/28933156/pexels-photo-28933156.jpeg'
  },
  {
    id: 'salad-italian',
    name: 'Italian Salad',
    description: 'Fresh baby greens, peppery rocket, shaved parmesan, Italian prosciutto with house-made balsamic dressing',
    price: 9.00,
    category: 'salad',
    image: 'https://images.pexels.com/photos/17478679/pexels-photo-17478679.jpeg'
  },

  // PITA & DIPS
  {
    id: 'dip-tzatziki',
    name: 'Tzatziki with Pita',
    description: 'Creamy Greek yogurt dip with cucumber, garlic & dill. Served with warm pita bread',
    price: 5.00,
    category: 'pita-dips',
    vegetarian: true,
    image: 'https://images.pexels.com/photos/5191819/pexels-photo-5191819.jpeg'
  },
  {
    id: 'dip-hummus',
    name: 'Hummus with Pita',
    description: 'Smooth chickpea dip with tahini, lemon & olive oil. Served with warm pita bread',
    price: 5.00,
    category: 'pita-dips',
    vegetarian: true,
    image: 'https://images.pexels.com/photos/11842138/pexels-photo-11842138.jpeg'
  },
  {
    id: 'dip-spicy-feta',
    name: 'Spicy Feta Dip (Tirokauteri) with Pita',
    description: 'Whipped feta cheese with roasted red peppers & chili. Served with warm pita bread',
    price: 5.00,
    category: 'pita-dips',
    vegetarian: true,
    image: 'https://images.pexels.com/photos/5899672/pexels-photo-5899672.jpeg'
  },

  // SIDES
  {
    id: 'side-chips',
    name: 'Chips',
    description: 'Golden crispy chips seasoned with oregano and sea salt',
    price: 3.50,
    category: 'sides',
    vegetarian: true,
    image: 'https://images.pexels.com/photos/5860680/pexels-photo-5860680.jpeg'
  },
  {
    id: 'side-grilled-halloumi',
    name: 'Grilled Halloumi',
    description: 'Cypriot cheese grilled until golden, drizzled with lemon and herbs',
    price: 5.90,
    category: 'sides',
    vegetarian: true,
    image: 'https://images.pexels.com/photos/5950480/pexels-photo-5950480.jpeg'
  },
  {
    id: 'side-pita-bread',
    name: 'Pita Bread',
    description: 'Warm, fluffy Greek pita bread',
    price: 1.50,
    category: 'sides',
    vegetarian: true,
    image: 'https://images.pexels.com/photos/5086612/pexels-photo-5086612.jpeg'
  },
  {
    id: 'side-olives',
    name: 'Olives',
    description: 'Marinated Kalamata olives with herbs and olive oil',
    price: 3.00,
    category: 'sides',
    vegetarian: true,
    image: 'https://images.pexels.com/photos/33312365/pexels-photo-33312365.jpeg'
  },

  // DESSERTS
  {
    id: 'dessert-ferrero',
    name: 'Ferrero',
    description: 'Rich chocolate mousse with Ferrero Rocher pieces and hazelnut cream',
    price: 5.00,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/17939215/pexels-photo-17939215.jpeg'
  },
  {
    id: 'dessert-profiterole',
    name: 'Profiterole',
    description: 'Light choux pastry filled with vanilla cream, topped with chocolate sauce',
    price: 5.00,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/33268054/pexels-photo-33268054.jpeg'
  },
  {
    id: 'dessert-tiramisu',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 5.00,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/6612637/pexels-photo-6612637.jpeg'
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