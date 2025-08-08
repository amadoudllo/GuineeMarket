export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'vendor' | 'admin';
  avatar?: string;
  location: string;
  verified: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  condition: 'new' | 'used';
  status: 'pending' | 'approved' | 'rejected';
  vendorId: string;
  vendor: User;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  featured: boolean;
}

export type ProductCategory = 'electronics' | 'clothing' | 'vehicles' | 'furniture' | 'services';

export interface Order {
  id: string;
  productId: string;
  product: Product;
  buyerId: string;
  buyer: User;
  vendorId: string;
  vendor: User;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  phone: string;
  notes?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  productId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}