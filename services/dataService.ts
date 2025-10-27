import { Product } from '../types';

const mockProducts: Product[] = [
  { id: 1, name: 'Aether Run', brand: 'Nike', price: 120, sizes: [7, 8, 9, 10, 11], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', description: 'Lightweight and responsive for a comfortable run.' },
  { id: 2, name: 'Boost X', brand: 'Adidas', price: 150, sizes: [6, 7, 8, 9], image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop', description: 'Premium athletic shoes with maximum energy return.' },
  { id: 3, name: 'Classic Leather', brand: 'Reebok', price: 85, sizes: [8, 9, 10, 11, 12], image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop', description: 'Timeless style meets all-day comfort.' },
  { id: 4, name: 'Chuck 70', brand: 'Converse', price: 90, sizes: [7, 8, 9, 10], image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1965&auto=format&fit=crop', description: 'An iconic silhouette with vintage details.' },
  { id: 5, name: 'Suede Classic', brand: 'Puma', price: 70, sizes: [8, 9, 10, 11], image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop', description: 'The legendary PUMA Suede, a footwear classic.' },
  { id: 6, name: 'Old Skool', brand: 'Vans', price: 65, sizes: [7, 8, 9, 10], image: 'https://images.unsplash.com/photo-1608231387042-8a8169b2caf7?q=80&w=1935&auto=format&fit=crop', description: 'The original skate shoe with the iconic sidestripe.' },
  { id: 7, name: 'Gel-Lyte III', brand: 'ASICS', price: 110, sizes: [9, 10, 11], image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcdda9?q=80&w=2070&auto=format&fit=crop', description: 'A retro runner known for its split-tongue design.' },
  { id: 8, name: '990v5', brand: 'New Balance', price: 175, sizes: [8, 9, 10, 11], image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop', description: 'A perfect blend of cushioning and stability, crafted in the USA.' },
];

export const getMockProducts = (): Promise<Product[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500); // Simulate network delay
  });
};
