import { User, Product, Order, Message } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Mamadou Diallo',
    email: 'mamadou@email.com',
    phone: '+224 628 123 456',
    role: 'vendor',
    location: 'Conakry',
    verified: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Aissatou Barry',
    email: 'aissatou@email.com',
    phone: '+224 654 789 123',
    role: 'client',
    location: 'Kankan',
    verified: true,
    createdAt: new Date('2024-02-10')
  },
  {
    id: '3',
    name: 'Admin System',
    email: 'admin@marketplace.gn',
    phone: '+224 600 000 000',
    role: 'admin',
    location: 'Conakry',
    verified: true,
    createdAt: new Date('2024-01-01')
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max',
    description: 'iPhone 14 Pro Max 256GB, couleur violet, état impeccable avec boîte et accessoires d\'origine.',
    price: 850000,
    images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
    category: 'electronics',
    condition: 'used',
    status: 'approved',
    vendorId: '1',
    vendor: mockUsers[0],
    location: 'Conakry',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    views: 45,
    featured: true
  },
  {
    id: '2',
    title: 'Toyota Camry 2019',
    description: 'Toyota Camry 2019, automatique, climatisée, en très bon état. Véhicule entretenu régulièrement.',
    price: 18500000,
    images: ['https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'],
    category: 'vehicles',
    condition: 'used',
    status: 'approved',
    vendorId: '1',
    vendor: mockUsers[0],
    location: 'Conakry',
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28'),
    views: 89,
    featured: false
  },
  {
    id: '3',
    title: 'Robe traditionnelle guinéenne',
    description: 'Belle robe traditionnelle faite main, parfaite pour les occasions spéciales.',
    price: 75000,
    images: ['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg'],
    category: 'clothing',
    condition: 'new',
    status: 'pending',
    vendorId: '1',
    vendor: mockUsers[0],
    location: 'Labé',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
    views: 12,
    featured: false
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    productId: '1',
    product: mockProducts[0],
    buyerId: '2',
    buyer: mockUsers[1],
    vendorId: '1',
    vendor: mockUsers[0],
    status: 'pending',
    deliveryAddress: 'Quartier Bonfi, Kankan',
    phone: '+224 654 789 123',
    createdAt: new Date('2024-03-06')
  }
];

export const currentUser: User = mockUsers[0]; // Simulating logged in user