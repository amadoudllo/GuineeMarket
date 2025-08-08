import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, ProductCategory } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (filters?: {
    category?: ProductCategory;
    condition?: 'new' | 'used';
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    status?: 'pending' | 'approved' | 'rejected';
    vendorId?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select(`
          *,
          vendor:users!products_vendor_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.location) {
        query = query.eq('location', filters.location);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.vendorId) {
        query = query.eq('vendor_id', filters.vendorId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedProducts: Product[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        images: item.images,
        category: item.category as ProductCategory,
        condition: item.condition as 'new' | 'used',
        status: item.status as 'pending' | 'approved' | 'rejected',
        vendorId: item.vendor_id,
        vendor: {
          id: item.vendor.id,
          name: item.vendor.name,
          email: item.vendor.email,
          phone: item.vendor.phone,
          role: item.vendor.role,
          avatar: item.vendor.avatar,
          location: item.vendor.location,
          verified: item.vendor.verified,
          createdAt: new Date(item.vendor.created_at)
        },
        location: item.location,
        views: item.views,
        featured: item.featured,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: {
    title: string;
    description: string;
    price: number;
    images: string[];
    category: ProductCategory;
    condition: 'new' | 'used';
    location: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        vendor_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateProduct = async (id: string, updates: Partial<{
    title: string;
    description: string;
    price: number;
    images: string[];
    category: ProductCategory;
    condition: 'new' | 'used';
    location: string;
    status: 'pending' | 'approved' | 'rejected';
  }>) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  const incrementViews = async (id: string) => {
    const { error } = await supabase.rpc('increment_product_views', {
      product_id: id
    });

    if (error) console.error('Error incrementing views:', error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    incrementViews
  };
};