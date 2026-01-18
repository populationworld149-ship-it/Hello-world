export type Category = 'FOOD' | 'DRINKS' | 'PASTRIES';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  ingredients: string[];
  sizes?: string[]; // For drinks
}

export const products: Product[] = [
  // Food
  {
    id: 'f1',
    name: 'Avocado Toast',
    category: 'FOOD',
    price: 12,
    image: 'https://placehold.co/400x400/png?text=Avocado+Toast',
    ingredients: ['Sourdough Bread', 'Avocado', 'Radish', 'Chili Flakes', 'Lemon'],
  },
  {
    id: 'f2',
    name: 'Breakfast Burrito',
    category: 'FOOD',
    price: 14,
    image: 'https://placehold.co/400x400/png?text=Breakfast+Burrito',
    ingredients: ['Tortilla', 'Eggs', 'Cheese', 'Potatoes', 'Salsa'],
  },
  {
    id: 'f3',
    name: 'Acai Bowl',
    category: 'FOOD',
    price: 15,
    image: 'https://placehold.co/400x400/png?text=Acai+Bowl',
    ingredients: ['Acai', 'Granola', 'Banana', 'Berries', 'Honey'],
  },

  // Drinks
  {
    id: 'd1',
    name: 'Lavender Boba Latte',
    category: 'DRINKS',
    price: 6,
    image: 'https://placehold.co/400x400/png?text=Lavender+Boba',
    ingredients: ['Green Tea', 'Milk', 'Lavender Syrup', 'Boba Pearls'],
    sizes: ['Small', 'Medium', 'Large'],
  },
  {
    id: 'd2',
    name: 'Matcha Latte',
    category: 'DRINKS',
    price: 5.5,
    image: 'https://placehold.co/400x400/png?text=Matcha+Latte',
    ingredients: ['Matcha Powder', 'Milk', 'Sweetener'],
    sizes: ['Small', 'Medium', 'Large'],
  },
  {
    id: 'd3',
    name: 'Iced Coffee',
    category: 'DRINKS',
    price: 4,
    image: 'https://placehold.co/400x400/png?text=Iced+Coffee',
    ingredients: ['Coffee', 'Ice', 'Milk (Optional)'],
    sizes: ['Small', 'Medium', 'Large'],
  },

  // Pastries
  {
    id: 'p1',
    name: 'Croissant',
    category: 'PASTRIES',
    price: 4,
    image: 'https://placehold.co/400x400/png?text=Croissant',
    ingredients: ['Flour', 'Butter', 'Sugar', 'Yeast'],
  },
  {
    id: 'p2',
    name: 'Blueberry Muffin',
    category: 'PASTRIES',
    price: 3.5,
    image: 'https://placehold.co/400x400/png?text=Blueberry+Muffin',
    ingredients: ['Flour', 'Sugar', 'Blueberries', 'Eggs'],
  },
  {
    id: 'p3',
    name: 'Macarons',
    category: 'PASTRIES',
    price: 2.5,
    image: 'https://placehold.co/400x400/png?text=Macarons',
    ingredients: ['Almond Flour', 'Sugar', 'Egg Whites', 'Filling'],
  },
];
